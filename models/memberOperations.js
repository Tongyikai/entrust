/*
Create Operations
Read Operations
Update Operations
Delete Operations
*/
const MongoClient = require( "mongodb" ).MongoClient;
const config = require( "../config/configuration" );
const uri = "mongodb://" + config.mongodb.user + ":" + config.mongodb.password + "@" + config.mongodb.host + "/" + config.mongodb.database;
const client = new MongoClient( uri, { useUnifiedTopology: true } );
const encryption = require( "./encryption" ); // 加密

module.exports = {
    queryUsername,
    queryUsernameAndPassword,
    queryEmail,
    createNewMember
}

function queryUsername( username, callback ) {
    terminalInformation( "Query Username." );

    var usernameExists = false;
    client.connect( err => {
        if ( err ) throw err;
        const membersCollections = client.db( config.mongodb.database ).collection( config.mongodb.members_Collections );
        membersCollections.find( { username: username } ).toArray( function( err, result ) {
            if ( err ) throw err;
    
            if ( result[ 0 ] == undefined ) {
                console.log( result );
                console.log( "∅ undefined" );
            } else {
                usernameExists = true;
                console.log( result );
            }
            client.close();
            callback( usernameExists );
        });
    });
}

function queryUsernameAndPassword( username, userPassword, callback ) {
    terminalInformation( "Query Username And Password." );

    var isExists = false;
    client.connect( err => {
        if ( err ) throw err;
        const membersCollections = client.db( config.mongodb.database ).collection( config.mongodb.members_Collections );
        membersCollections.find( { username: username } ).toArray( function( err, result ) {
            if ( err ) throw err;

            if ( result[ 0 ] == undefined ) { // 資料庫沒有找到相同的名字
                console.log( result );
                console.log( "∅ undefined" );
            } else if ( comparePassword( userPassword, result[ 0 ].password ) ) { // 找到名字, 做比對密碼的動作
                isExists = true;
                console.log( "same password" );
            }
            client.close();
            callback( isExists );
        });
    });
}

function queryEmail( emailAddress, callback ) {
    terminalInformation( "Query email." );

    var emailExists = false;
    client.connect( err => {
        if ( err ) throw err;
        const membersCollections = client.db( config.mongodb.database ).collection( config.mongodb.members_Collections );
        membersCollections.find( { email: emailAddress } ).toArray( function( err, result ) {
            if ( err ) throw err;
    
            if ( result[ 0 ] == undefined ) {
                console.log( result );
                console.log( "∅ undefined" );
            } else {
                emailExists = true;
                console.log( result );
            }
            client.close();
            callback( emailExists );
        });
    });
}

function createNewMember( username, emailAddress, password, callback ) {
    terminalInformation( "Create a new member.");

    client.connect( err => {
        if ( err ) throw err;
        const membersCollections = client.db( config.mongodb.database ).collection( config.mongodb.members_Collections );
        const dateTime = new Date().toLocaleString( "zh-TW", { timeZone: "Asia/Taipei" } ); // 取得目前的時間+台北的時區(存入資料庫才是會當地的時間)
        const encryptionPassword = encryption( password ); // 加密
        var userObj = { username: username, email: emailAddress, password: encryptionPassword, createDate: dateTime };
        membersCollections.insertOne( userObj, ( err, res ) => {
            if ( err ) throw err;
            console.log( res );
            console.log( "*          Create a new member          *" );
            client.close();
            callback();
        });
    });
}

function comparePassword( userPassword, dbPassword ) { // 將使用者的密碼, 加密變暗碼, 之後比對資料庫的暗碼是否相同
    const encryptionPassword = encryption( userPassword ); 
    if ( encryptionPassword == dbPassword ) return true;
    return false;
}

function terminalInformation( string ) {
    console.log( "/* *********#*********#*********#*********#*********#*********#*********#" );
    console.log( " *   MongoDB: " + string );
    console.log( " #*********#*********#*********#*********#*********#*********#********* */" );
}