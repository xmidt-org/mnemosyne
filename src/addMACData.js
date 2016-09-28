var AWS = require("aws-sdk");
AWS.config.region = 'us-east-1';

var DOC = require('dynamodb-doc');
var UUID = require('node-uuid');
var S = require('string');
var crypto = require('crypto');

var dynamo = new DOC.DynamoDB();

var serialTable = 'Serial_MAC';
var macTable = 'MAC_MAC_UUID';
var SECRET = process.env.SECRET_KEY;

exports.handler = function(event, context, callback) 
{        
        var signature = S(event.signature).strip('sha1=').s;
        var digest = crypto.createHmac('SHA1', SECRET)
        .update(JSON.stringify(event.body))
        .digest('hex');
        
        if(signature === digest)
        {
                //device_id and serial_number are required inputs
                if(event.body.device_id && event.body.serial_number)
                {
                        var mac = S(event.body.device_id).strip('mac:').s;
                        var serialTableParam = {
                                TableName: serialTable,
                                Item : {
                                        'SerialNumber' : event.body.serial_number,
                                        'MAC' : mac
                                }
                        };

                        dynamo.putItem(serialTableParam, function(err, data){
                        if (err) 
                        {
                                var error = {
                                        code: "InternalServerError",
                                        status : 500,
                                        message: "An unknown error has occurred."
                                };
                                console.log(context.awsRequestId + ": " + JSON.stringify(error));
                                return callback(JSON.stringify(error));
                        } 
                        });

                        var uuid = S(UUID.v1()).strip('-').s;
                        var macUuid = mac+'-'+uuid;
                        var datetime = new Date().toISOString();

                        var macTableParam = {
                                TableName: macTable,
                                Item : {
                                        'MAC' : mac,
                                        'MAC_UUID': macUuid,
                                        'timestamp': datetime
                                }
                        };

                        dynamo.putItem(macTableParam, function(err, data){
                                if (err) 
                                {
                                        var error = {
                                                code: "InternalServerError",
                                                status : 500,
                                                message: "An unknown error has occurred."
                                        };
                                        console.log(context.awsRequestId + ": " + JSON.stringify(error));
                                        return callback(JSON.stringify(error));
                                } 
                                else 
                                {
                                        //TODO : send PATCH request to set MAC_UUID
                                        var message = {
                                                code: "success",
                                                status : 200,
                                                message: "Data is added successfully."
                                        };
                                        console.log(context.awsRequestId + ": " + JSON.stringify(message));
                                        return callback(null,JSON.stringify(message));
                                }
                        });
                }
                else
                {
                        var error = {
                                code: "BadRequest",
                                status : 400,
                                message: "Invalid input data."
                        };
                        console.log(context.awsRequestId + ": " + JSON.stringify(error));
                        return callback(JSON.stringify(error));
                }
        }
        else
        {
                var error = {
                        code: "AuthenticationError",
                        status : 403,
                        message: "Authentication Failed."
                };
                console.log(context.awsRequestId + ": " + JSON.stringify(error));
                return callback(JSON.stringify(error));
        }
        
};
