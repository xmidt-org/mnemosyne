var LambdaTester = require( 'lambda-tester' );
var myLambda = require( '../src/addMACData' );
var S = require('string');
var crypto = require('crypto');
var SECRET = process.env.SECRET_KEY;

describe( 'addMACData Unit Testing', function() {
    this.timeout(5000);
    
    // valid inputs
    it( 'Success', function() {
        var body = { "device_id": "mac:1122334455","serial_number": "11AABBCCDDEE" };
        var signature = crypto.createHmac('SHA1', SECRET)
                .update(JSON.stringify(body))
                .digest('hex');
        
        return LambdaTester( myLambda.handler )
            .event( { "signature" : "sha1="+signature, body } )
            .expectResult();
    });
    
    // invalid signature
    it( 'Failure', function() {
        var body = { "devce_id": "mac:1234567891","serial_number": "ABCDEFABC1234" };
        var signature = crypto.createHmac('SHA1', "abcd")
                .update(JSON.stringify(body))
                .digest('hex');
                
        return LambdaTester( myLambda.handler )
            .event( { "signature" : "sha1="+signature, body } )
            .expectError();
    });
    
    // mismatch in device_id input
    it( 'Failure', function() {
        var body = { "devce_id": "mac:1234567891","serial_number": "ABCDEFABC1234" };
        var signature = crypto.createHmac('SHA1', SECRET)
                .update(JSON.stringify(body))
                .digest('hex');
                
        return LambdaTester( myLambda.handler )
            .event( { "signature" : "sha1="+signature, body } )
            .expectError();
    });
    
    // mismatch in serial_number input
    it( 'Failure', function() {
        var body = { "device_id": "mac:1a2b3c4d5e","serial_nmber": "A1B2C3D4E50321" };
        var signature = crypto.createHmac('SHA1', SECRET)
                .update(JSON.stringify(body))
                .digest('hex');
                
        return LambdaTester( myLambda.handler )
            .event( { "signature" : "sha1="+signature, body } )
            .expectError();
    });
    
    // without device_id input
    it( 'Failure', function() {
        var body = { "serial_number": "D1B2C3A4E50321" };
        var signature = crypto.createHmac('SHA1', SECRET)
                .update(JSON.stringify(body))
                .digest('hex');
                
        return LambdaTester( myLambda.handler )
            .event( { "signature" : "sha1="+signature, body } )
            .expectError();
    });
    
    // without serial_number input
    it( 'Failure', function() {
        var body = { "device_id": "mac:a6542198301" };
        var signature = crypto.createHmac('SHA1', SECRET)
                .update(JSON.stringify(body))
                .digest('hex');
                
        return LambdaTester( myLambda.handler )
            .event( { "signature" : "sha1="+signature, body } )
            .expectError();
    });
    
    // without serial_number and device_id
    it( 'Failure', function() {
        var body = {  };
        var signature = crypto.createHmac('SHA1', SECRET)
                .update(JSON.stringify(body))
                .digest('hex');
                
        return LambdaTester( myLambda.handler )
            .event( { "signature" : "sha1="+signature, body } )
            .expectError();
    });
});
