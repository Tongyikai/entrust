const MongoClient = require( "mongodb" ).MongoClient;
const config = require( "../config/configuration" );
const uri = "mongodb://" + config.mongodb.user + ":" + config.mongodb.password + "@" + config.mongodb.host + "/" + config.mongodb.database;
const client = new MongoClient( uri, { useUnifiedTopology: true } );

module.exports = {
    helloDB
}

function helloDB( parameter ) {
    client.connect( err => {
        if ( err ) throw err;
        const collectionMember = client.db( config.mongodb.database ).collection( config.mongodb.collections_members );
        collectionMember.find( { name: parameter } ).toArray( function( err, result ) {
            if ( err ) throw err;
            console.log( result );
            client.close();
        });
    });
}