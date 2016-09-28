var AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';

var DOC = require('dynamodb-doc');
var dynamo = new DOC.DynamoDB();
var S = require('string');

var serialTable = 'Serial_MAC';
var macTable = 'MAC_MAC_UUID';

exports.handler = function(event, context, callback) {
        
        if(process.env.WEBPA_AUTH_HEADER === event.authorization)
        {
                var mac = ' ';
                function getUuid()
                {
                        var param = {
                                TableName : macTable,
                                Key : { "MAC" : mac }
                        };
                        dynamo.getItem(param, function(err, data) {
                                if (err) 
                                {
                                        var error = {
                                                code: "Not Found",
                                                message: "The requested resource was not found.",
                                                status : 404
                                        };
                                        
                                        console.log(context.awsRequestId + ": " + JSON.stringify(error));
                                        return callback(JSON.stringify(error));
                                }
                                if(data.Item)
                                {
                                        var message = {
                                                'MAC_UUID' : data.Item.MAC_UUID
                                        };
                                        console.log(context.awsRequestId + ": " + JSON.stringify(message));
                                        return callback(null, message);
                                }
                                else
                                {
                                        var error = {
                                                code: "Unknown Error",
                                                message: "An unknown error has occurred.",
                                                status : 520
                                        };
                                        
                                        console.log(context.awsRequestId + ": " + JSON.stringify(error));
                                        return callback(JSON.stringify(error));
                                }
                        });
                }
                
                //device_id is required input
                if(event.device_id)
                {
                        if(S(event.device_id).contains('serial:'))
                        {
                                var serialNumber = S(event.device_id).strip('serial:').s;
                                var param = {
                                        TableName : serialTable,
                                        Key : { "SerialNumber" : serialNumber }
                                };
                                
                                dynamo.getItem(param, function (err, data) {
                                        if (err) 
                                        {
                                                var error = {
                                                        code : "Not Found",
                                                        message : "The requested resource was not found.",
                                                        status : 404
                                                };
                                                
                                                console.log(context.awsRequestId + ": " + JSON.stringify(error));
                                                return calback(JSON.stringify(error));
                                        } 
                                        if(data.Item) 
                                        {
                                                mac = data.Item.MAC;
                                                getUuid();
                                        }
                                        else
                                        {
                                                var error = {
                                                        code: "Unknown Error",
                                                        message: "An unknown error has occurred.",
                                                        status : 520
                                                };
                                                
                                                console.log(context.awsRequestId + ": " + JSON.stringify(error));
                                                return callback(JSON.stringify(error));
                                        }
                                });   
                                   
                        }
                        else if(S(event.device_id).contains('mac:'))
                        {
                                mac = S(event.device_id).strip('mac:').s;
                                getUuid();
                        }
                        else
                        {
                                var error = {
                                        code: "Bad Request",
                                        message: "Invalid input data.",
                                        status : 400
                                };
                                
                                console.log(context.awsRequestId + ": " + JSON.stringify(error));
                                return callback(JSON.stringify(error));
                        }
                }
                else
                {
                        var error = {
                                code: "Bad Request",
                                message: "Invalid input data.",
                                status : 400
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
