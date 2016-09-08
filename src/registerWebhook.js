var https = require('https');

var options = {
  host: 'api-cd.webpa.comcast.net',
  port: 8090,
  path: '/api/v2/hook',
  family: 4,
  method: 'POST',
  headers: {
            'content-type': 'application/json',
            'Authorization': '<<password>>'
        }
};

var data = {
  "config": {
            "url" : "https://9yui64kvxi.execute-api.us-east-1.amazonaws.com/cd/test-post-lambda",
            "content_type" : "json"
        },
        
  "events": [ "node-change/mac:14cfe2142142/.*","SYNC_NOTIFICATION","transaction-status" ]
};

exports.handler = (event, context, callback) => {
    const req = https.request(options, (res) => {
        var body = '';
        console.log('Status:', res.statusCode);
        console.log('Headers:', JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
            console.log('Successfully processed HTTPS response');
            if (res.headers['content-type'] === 'application/json') {
                body = JSON.parse(body);
            }
            callback(null, body);
        });
    });
    req.on('error', callback);
    req.write(JSON.stringify(data));
    req.end();
};
