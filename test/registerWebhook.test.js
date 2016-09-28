var expect = require('chai').expect;
var LambdaTester = require( 'lambda-tester' );
var registerLambda = require( '../src/registerWebhook' );
var verifyLambda = require( './verifyWebhook' );

var data = {
  "config": {
            "url" : "https://9yui64kvxi.execute-api.us-east-1.amazonaws.com/cd/test-post-lambda",
            "content_type" : "json",
            "secret" : process.env.SECRET_KEY
        },
        
  "events": [ "node-change/mac:14cfe2142142/.*","SYNC_NOTIFICATION","transaction-status", "device-status" ]
};

describe( 'Webhook Unit Testing', function() {
    this.timeout(5000);
    
    it( 'Registered', function() {

        return LambdaTester( registerLambda.handler )
                .event( { } )
                .expectResult(function( result ) 
                        {
                                result = JSON.parse(result);
                                expect(result.message).to.equal('Success');
                                
                        });
    });
    
    it('Verified', function(){
        
        return LambdaTester( verifyLambda.handler )
                .event( data )
                .expectResult(function( result ) 
                        {
                                expect(result).to.equal(true);
                        });                
        });
    
});
