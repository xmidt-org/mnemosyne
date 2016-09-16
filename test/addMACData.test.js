var LambdaTester = require( 'lambda-tester' );
var myLambda = require( '../src/addMACData' );

describe( 'addMACData Unit Testing', function() {
    this.timeout(5000);
    
    // valid inputs
    it( 'Success', function() {

        return LambdaTester( myLambda.handler )
            .event( { "device_id": "mac:1122334455","serialNumber": "11AABBCCDDEE" } )
            .expectResult();
    });
    
    // mismatch in device_id input
    it( 'Failure', function() {

        return LambdaTester( myLambda.handler )
            .event( { "devce_id": "mac:1234567891","serialNumber": "ABCDEFABC1234" } )
            .expectError();
    });
    
    // mismatch in serialNumber input
    it( 'Failure', function() {

        return LambdaTester( myLambda.handler )
            .event( { "device_id": "mac:1a2b3c4d5e","serialNmber": "A1B2C3D4E50321" } )
            .expectError();
    });
    
    // without device_id input
    it( 'Failure', function() {

        return LambdaTester( myLambda.handler )
            .event( { "serialNumber": "D1B2C3A4E50321" } )
            .expectError();
    });
    
    // without serialNumber input
    it( 'Failure', function() {

        return LambdaTester( myLambda.handler )
            .event( { "device_id": "mac:a6542198301" } )
            .expectError();
    });
    
    // without serialNumber and device_id
    it( 'Failure', function() {

        return LambdaTester( myLambda.handler )
            .event( {  } )
            .expectError();
    });
    
});
