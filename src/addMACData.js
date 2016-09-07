var AWS = require("aws-sdk");
var DOC = require('dynamodb-doc');
var UUID = require('node-uuid');
var S = require('string');

var dynamo = new DOC.DynamoDB();

AWS.config.region = 'us-east-1';

var serialTable = 'Serial-MAC';
var macTable = 'MAC-MAC-UUID';

exports.handler = function(event, context) 
{
        if(event.device_id && event.serialNumber)
        {
                var mac = S(event.device_id).strip('mac:').s;
                console.log("mac : ",mac);
                var serialTableParam = {
                        TableName: serialTable,
                        Item : {
                        'SerialNumber' : event.serialNumber,
                        'MAC' : mac
                        }
                }
                
                dynamo.putItem(serialTableParam, function(err, data){
                        if (err) 
                        {
                                var error = {
                                        code: "InternalServerError",
                                        status : 500,
                                        requestId : context.awsRequestId,
                                        message: "An unknown error has occurred. Please try again."
                                };
                                context.fail(JSON.stringify(error));
                        } 
                        else 
                        {
                                console.log("Item is added successfully\n",data);
                                var uuid = S(UUID.v1()).strip('-').s;
                                console.log("uuid :",uuid);
                                var macUuid = mac+'-'+uuid;
                                console.log("macUuid: ",macUuid);
                                var datetime = new Date().toISOString();
                                console.log("datetime :",datetime);
                                
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
                                                        requestId : context.awsRequestId,
                                                        message: "An unknown error has occurred. Please try again."
                                                };
                                                context.fail(JSON.stringify(error));
                                        } 
                                        else 
                                        {
                                                console.log("Data is added successfully\n",data);
                                                //TODO : send PATCH request to set MAC_UUID
                                                var message = {
                                                        code: "success",
                                                        status : 200,
                                                        requestId : context.awsRequestId,
                                                        message: "Data is added successfully."
                                                };
                                                context.succeed(JSON.stringify(message));
                                                
                                        }
                                });
                        }
                });
        }
        else
        {
                var error = {
                        code: "BadRequest",
                        status : 400,
                        requestId : context.awsRequestId,
                        message: "Invalid input data."
                };
                context.fail(JSON.stringify(error));
        }
};
