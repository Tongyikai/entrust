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
    QueryTheUsernameOfEmail,
    createNewMember,
    createNewFriend,
    updateProfileData,
    getProfileData
}

function queryUsername( username, callback ) {
    terminalInformation( "Query Username." );

    var usernameExists = false;
    client.connect( err => {
        if ( err ) throw err;
        const membersCollection = client.db( config.mongodb.database ).collection( config.mongodb.members_Collection );
        membersCollection.find( { username: username } ).toArray( function( err, result ) {
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

    var passwordExists = false;
    client.connect( err => {
        if ( err ) throw err;
        const membersCollection = client.db( config.mongodb.database ).collection( config.mongodb.members_Collection );
        membersCollection.find( { username: username } ).toArray( function( err, result ) {
            if ( err ) throw err;

            if ( result[ 0 ] == undefined ) { // 資料庫沒有找到相同的名字
                console.log( result );
                console.log( "∅ undefined" );
            } else if ( comparePassword( userPassword, result[ 0 ].password ) ) { // 找到名字, 做比對密碼的動作
                passwordExists = true;
                console.log( "same password" );
            }
            client.close();
            callback( passwordExists );
        });
    });
}

function queryEmail( emailAddress, callback ) {
    terminalInformation( "Query email. does it exist?" );

    var emailExists = false;
    client.connect( err => {
        if ( err ) throw err;
        const membersCollection = client.db( config.mongodb.database ).collection( config.mongodb.members_Collection );
        membersCollection.find( { email: emailAddress } ).toArray( function( err, result ) {
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

function QueryTheUsernameOfEmail( emailAddress, callback ) {
    terminalInformation( "Query email. for username" );
    var username = "undefined";

    client.connect( err => {
        if ( err ) throw err;
        const membersCollection = client.db( config.mongodb.database ).collection( config.mongodb.members_Collection );
        membersCollection.find( { email: emailAddress } ).toArray( ( err, result ) => {
            if ( err ) throw err;

            if ( result[ 0 ] == undefined ) {
                console.log( result );
                console.log( "∅ undefined" );
            } else {
                console.log( "member username: " + result[ 0 ].username );
                username = result[ 0 ].username;
            }
            client.close();
            callback( username );
        });
    });
}

function createNewMember( username, emailAddress, password, callback ) {
    terminalInformation( "Create a new member." );

    client.connect( err => {
        if ( err ) throw err;
        const membersCollection = client.db( config.mongodb.database ).collection( config.mongodb.members_Collection );
        const dateTime = new Date().toLocaleString( "zh-TW", { timeZone: "Asia/Taipei" } ); // 取得目前的時間+台北的時區(存入資料庫才是會當地的時間)
        const encryptionPassword = encryption( password ); // 加密
        const unfilled = "";
        var userObj = { username: username, email: emailAddress, password: encryptionPassword, createDate: dateTime, avatar64code: config.DEFAULT_AVATAR, familyName: unfilled, givenName: unfilled, birth: unfilled, gender: unfilled, currentCity: unfilled, hometown: unfilled, mobileNumber: unfilled, facebook: unfilled };
        membersCollection.insertOne( userObj, ( err, res ) => {
            if ( err ) throw err;
            console.log( res );
            console.log( "* Create a new member *" );
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

function createNewFriend( tokenName, newFriendsName, callback ) {
    terminalInformation( "New buddy." );

    client.connect( err => {
        if ( err ) throw err;
        const buddyListCollection = client.db( config.mongodb.database ).collection( config.mongodb.buddy_Collection );
        buddyListCollection.find( { owner: tokenName } ).toArray( function( err, result ) {
            if ( err ) throw err;

            if ( result[ 0 ] == undefined ) { // 資料表不存在，就建立(第1次邀請好友)
                console.log( result );
                console.log( "∅ undefined * create a new tables, first times add buddy." );

                let person = [ newFriendsName ]; 
                var userObj = { owner: tokenName, buddyList: person };
                buddyListCollection.insertOne( userObj, ( err, res ) => {
                    if ( err ) throw err;
                    console.log( res );
                    client.close();
                    callback();
                });

            } else { // 資料表存在，查詢 tokenName，插入一筆到 buddyList陣列中
                console.log( result ); 
                var person = [];
                person = result[ 0 ].buddyList;
                person.push( newFriendsName );
                console.log( person );

                var whereStr = { owner: tokenName };
                var updateStr = { $set: { buddyList: person } };
                buddyListCollection.updateOne( whereStr, updateStr, ( err, res ) => {
                    if ( err ) throw err;
                    console.log( res );
                    client.close();
                    callback();
                });
            }
        });
    });
}

function updateProfileData( username, avatar64code, familyName, givenName, birth, gender, currentCity, hometown, mobileNumber, facebook, callback ) {
    terminalInformation( "Update Profile." );
    if ( avatar64code == "0" ) avatar64code = config.DEFAULT_AVATAR;

    client.connect( err => {
        if ( err ) throw err;
        const membersCollection = client.db( config.mongodb.database ).collection( config.mongodb.members_Collection );
        var modifiedUser = { username: username };
        var updateData = { $set: { avatar64code: avatar64code, familyName: familyName, givenName: givenName, birth: birth, gender: gender, currentCity: currentCity, hometown: hometown, mobileNumber: mobileNumber, facebook: facebook } };
        membersCollection.updateMany( modifiedUser, updateData, function( err, result ) {
            if ( err ) throw err;
            console.log( result );
            client.close();
            callback();
        });
    });
}

function getProfileData( username, callback ) {
    var profileData = { avatar64code: "" };
    client.connect( err => {
        if ( err ) throw err;
        const membersCollection = client.db( config.mongodb.database ).collection( config.mongodb.members_Collection );
        membersCollection.find( { username: username } ).toArray( ( err, result ) => {
            if ( err ) throw err;

            if ( result[ 0 ] == undefined ) {
                console.log( result );
                console.log( "∅ undefined" );
            } else {
                console.log( "member username: " + result[ 0 ].username );
                profileData.avatar64code = result[ 0 ].avatar64code;
            }
            client.close();
            callback( profileData );
        });
    });
}

function terminalInformation( string ) {
    console.log( "/* *********#*********#*********#*********#*********#*********#*********#" );
    console.log( " *   MongoDB: " + string );
    console.log( " #*********#*********#*********#*********#*********#*********#********* */" );
}