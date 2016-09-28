var LambdaTester = require( 'lambda-tester' );
var myLambda = require( '../src/getMACUuid' );

describe( 'getMACUuid Unit Testing', function() {
    this.timeout(5000);
    
    //valid input
    it( 'Success', function() {
        
        return LambdaTester( myLambda.handler )
            .event( { "device_id": "mac:1122334455", "authorization": process.env.WEBPA_AUTH_HEADER } )
            .expectResult();
    });
    
    //valid input
    it( 'Success', function() {

        return LambdaTester( myLambda.handler )
            .event( { "device_id": "serial:11AABBCCDDEE", "authorization": process.env.WEBPA_AUTH_HEADER } )
            .expectResult();
    });
    
    //invalid authorization header
    it( 'Failure', function() {

        return LambdaTester( myLambda.handler )
            .event( { "device_id": "mac:1122334455", "authorization": "Basic abcd=12eftr" } )
            .expectError();
    });
    
    //invalid input
    it( 'Failure', function() {

        return LambdaTester( myLambda.handler )
            .event( { "device_id": "serial:AB12CD23EF3412", "authorization": process.env.WEBPA_AUTH_HEADER } )
            .expectError();
    });
    
    //invalid input
    it( 'Failure', function() {

        return LambdaTester( myLambda.handler )
            .event( { "device_id": "mac:123456789", "authorization": process.env.WEBPA_AUTH_HEADER } )
            .expectError();
    });
    
    //input mismatch
    it( 'Failure', function() {

        return LambdaTester( myLambda.handler )
            .event( { "devi_id": "mac:124213568", "authorization": process.env.WEBPA_AUTH_HEADER } )
            .expectError();
    });
    
    //input mismatch
    it( 'Failure', function() {

        return LambdaTester( myLambda.handler )
            .event( { "device_id": "mc:111111111", "authorization": process.env.WEBPA_AUTH_HEADER } )
            .expectError();
    });

    //input mismatch
    it( 'Failure', function() {

        return LambdaTester( myLambda.handler )
            .event( { "device_id": "seal:AAAAAAAAAAAA", "authorization": process.env.WEBPA_AUTH_HEADER } )
            .expectError();
    });
    
    //without input
    it( 'Failure', function() {

        return LambdaTester( myLambda.handler )
            .event( {"authorization": process.env.WEBPA_AUTH_HEADER} )
            .expectError();
    });
    
});
