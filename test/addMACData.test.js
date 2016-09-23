var LambdaTester = require( 'lambda-tester' );
var myLambda = require( '../src/addMACData' );

describe( 'addMACData Unit Testing', function() {
    this.timeout(5000);
    
    // valid inputs
    it( 'Success', function() {

        return LambdaTester( myLambda.handler )
            .event( { "deviceId": "mac:1122334455","serialNumber": "11AABBCCDDEE" } )
            .expectResult();
    });
    
    // mismatch in deviceId input
    it( 'Failure', function() {

        return LambdaTester( myLambda.handler )
            .event( { "devceId": "mac:1234567891","serialNumber": "ABCDEFABC1234" } )
            .expectError();
    });
    
    // mismatch in serialNumber input
    it( 'Failure', function() {

        return LambdaTester( myLambda.handler )
            .event( { "deviceId": "mac:1a2b3c4d5e","serialNmber": "A1B2C3D4E50321" } )
            .expectError();
    });
    
    // without deviceId input
    it( 'Failure', function() {

        return LambdaTester( myLambda.handler )
            .event( { "serialNumber": "D1B2C3A4E50321" } )
            .expectError();
    });
    
    // without serialNumber input
    it( 'Failure', function() {

        return LambdaTester( myLambda.handler )
            .event( { "deviceId": "mac:a6542198301" } )
            .expectError();
    });
    
    // without serialNumber and deviceId
    it( 'Failure', function() {

        return LambdaTester( myLambda.handler )
            .event( {  } )
            .expectError();
    });
    
});
