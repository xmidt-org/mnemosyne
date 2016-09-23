var AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';

var DOC = require('dynamodb-doc');
var dynamo = new DOC.DynamoDB();
var S = require('string');

var serialTable = 'Serial-MAC';
var macTable = 'MAC-MAC-UUID';

exports.handler = function(event, context, callback) {
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
        
        //deviceId is required input
        if(event.deviceId)
        {
                if(S(event.deviceId).contains('serial:'))
                {
                        var serialNumber = S(event.deviceId).strip('serial:').s;
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
                else if(S(event.deviceId).contains('mac:'))
                {
                        mac = S(event.deviceId).strip('mac:').s;
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
        
};
