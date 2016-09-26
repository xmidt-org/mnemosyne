var AWS = require("aws-sdk");
AWS.config.region = 'us-east-1';

var DOC = require('dynamodb-doc');
var UUID = require('node-uuid');
var S = require('string');

var dynamo = new DOC.DynamoDB();

var serialTable = 'Serial-MAC';
var macTable = 'MAC-MAC-UUID';

exports.handler = function(event, context, callback) 
{
        //device_id and serial_number are required inputs
        if(event.device_id && event.serial_number)
        {
                var mac = S(event.device_id).strip('mac:').s;
                var serialTableParam = {
                        TableName: serialTable,
                        Item : {
                        'SerialNumber' : event.serial_number,
                        'MAC' : mac
                        }
                }
                
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
                }
                
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
};
