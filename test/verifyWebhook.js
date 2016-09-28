var https = require('https');

var options = {
  host: 'api-cd.webpa.comcast.net',
  port: 8090,
  path: '/api/v2/hooks',
  method: 'GET',
  headers: {
            'content-type': 'application/json',
            'Authorization': 'Basic '+process.env.WEBPA_AUTH_HEADER
        }
};

exports.handler = (event, context, callback) => {
    const req = https.request(options, (res) => {
        var body = '';
        console.log('Status:', res.statusCode);
        res.setEncoding('utf8');
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
            console.log('Successfully processed HTTPS response');
            if (res.headers['content-type'] === 'application/json') {
                body = JSON.parse(body);
                for(var i=0; i<body.length; i++)
                {
                        if(JSON.stringify(body[i].config) === JSON.stringify(event.config))
                        {
                                if(JSON.stringify(body[i].events) === JSON.stringify(event.events))
                                {
                                        callback(null, true);
                                        break;
                                }
                                callback(new Error(false));
                                break;
                        }
                }
            }
        });
    });
    req.on('error', callback);
    req.end();
};
