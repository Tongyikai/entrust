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
    queryTheUsernameOfEmail,
    queryNameOfBuddyList,
    createNewMember,
    createNewFriend,
    updateProfileData,
    getProfileData,
    createCircleForm
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

function queryTheUsernameOfEmail( emailAddress ) { // 查詢此 email 的使用者名稱
    terminalInformation( "Query email. for username" );
    var username = "undefined";

    return new Promise( ( resolve, reject ) => { // 將函數內的程式碼包裝在 Promise 中, 就可以回傳 boolean
        client.connect( err => {
            if ( err ) throw err;
            const membersCollection = client.db( config.mongodb.database ).collection( config.mongodb.members_Collection );
            membersCollection.find( { email: emailAddress } ).toArray( ( err, result ) => {
                if ( err ) throw err;
                if ( result[ 0 ] == undefined ) {
                    console.log( result );
                    console.log( emailAddress + "===> undefined" );
                } else {
                    console.log( emailAddress + "===> username: " + result[ 0 ].username );
                    username = result[ 0 ].username;
                }
                client.close();
                resolve( username );
            });
        });
    });
}

function queryNameOfBuddyList( tokenName, username ) {
    terminalInformation( "Does this name exist?" );
    var nameExist = false;

    return new Promise( ( resolve, reject ) => { // 將函數內的程式碼包裝在 Promise 中, 就可以回傳 boolean
        client.connect( err => {
            if ( err ) throw err;
            const buddyListCollection = client.db( config.mongodb.database ).collection( config.mongodb.buddy_Collection );
            buddyListCollection.find( { owner: tokenName } ).toArray( ( err, result ) => {
                if ( err ) throw err;
                // console.log( result );
                // console.log( result[ 0 ] );
  
                if ( result == undefined ) {
                    console.log( "result == undefined" );
                }

                if ( result[ 0 ] == undefined ) {
                    console.log( "BuddyList=undefined, first time" );
                }

                if ( result[ 0 ] != undefined ) {
                    let buddy = result[ 0 ].buddyList;
                    for ( var i = 0; i < buddy.length; i++ ) {
                        console.log( "Inquire name: " + buddy[ i ].username + " <=conform to=> " + username );
                        if ( buddy[ i ].username == username ) {
                            nameExist = true;
                            console.log( "⭐️Inquire name: " + buddy[ i ].username + "⭐️" );
                        }
                    }
                }
                client.close();
                resolve( nameExist );
            }); 
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
        var userObj = { username: username, email: emailAddress, password: encryptionPassword, createDate: dateTime, avatar64code: config.DEFAULT_AVATAR, familyName: unfilled, givenName: unfilled, nickname: unfilled, birth: unfilled, gender: unfilled, jobTitle: unfilled, currentCity: unfilled, hometown: unfilled, mobileNumber: unfilled, facebook: unfilled, unreadMessage: [] };
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

function getSomeoneData( name, callback ) { // 取得名字人的 avatar64code & job title(職稱)
    terminalInformation( "Get avatar64code & job title." );
    var avatar64code, familyName, givenName, nickname, jobTitle = "";
    client.connect( err => {
        if ( err ) throw err;
        const membersCollection = client.db( config.mongodb.database ).collection( config.mongodb.members_Collection );
        membersCollection.find( { username: name } ).toArray( function( err, result ) {
            if ( err ) throw err;
            if ( result[ 0 ] == undefined ) {
                console.log( result );
                console.log( "∅ undefined" );
            } else {
                // console.log( result );
                avatar64code = result[ 0 ].avatar64code;
                familyName = result[ 0 ].familyName;
                givenName = result[ 0 ].givenName;
                nickname = result[ 0 ].nickname;
                jobTitle = result[ 0 ].jobTitle;
            }
            // client.close();
            callback( avatar64code, familyName, givenName, nickname, jobTitle );
        });
    });
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
                // 取得名字人的資料，再建立一個新的資料表
                getSomeoneData( newFriendsName, ( avatar64code, familyName, givenName, nickname, jobTitle ) => {
                    let person = [ { username: newFriendsName, familyName: familyName, givenName: givenName, nickname: nickname, avatar64code: avatar64code, jobTitle: jobTitle } ];
                    var userObj = { owner: tokenName, buddyList: person };
                    buddyListCollection.insertOne( userObj, ( err, res ) => {
                        if ( err ) throw err;
                        console.log( res );
                        client.close();
                        callback();
                    });
                });
            } else { // 資料表存在，查詢 tokenName，插入一筆到 buddyList陣列中
                console.log( result ); 
                // 取得名字人的資料，再更新一筆資料
                getSomeoneData( newFriendsName, ( avatar64code, familyName, givenName, nickname, jobTitle ) => {
                    var person = [];
                    person = result[ 0 ].buddyList;
                    person.push( { username: newFriendsName, familyName: familyName, givenName: givenName, nickname: nickname, avatar64code: avatar64code, jobTitle: jobTitle } );
                    var whereStr = { owner: tokenName };
                    var updateStr = { $set: { buddyList: person } };
                    buddyListCollection.updateOne( whereStr, updateStr, ( err, res ) => {
                        if ( err ) throw err;
                        console.log( res );
                        client.close();
                        callback();
                    });
                });
            }
        });
    });
}

function updateProfileData( username, avatar64code, familyName, givenName, nickname, birth, gender, jobTitle, currentCity, hometown, mobileNumber, facebook, callback ) {
    terminalInformation( "Update Profile." );
    if ( avatar64code == "0" ) avatar64code = config.DEFAULT_AVATAR;
    client.connect( err => {
        if ( err ) throw err;
        const membersCollection = client.db( config.mongodb.database ).collection( config.mongodb.members_Collection );
        var modifiedUser = { username: username };
        var updateData = { $set: { avatar64code: avatar64code, familyName: familyName, givenName: givenName, nickname: nickname, birth: birth, gender: gender, jobTitle: jobTitle, currentCity: currentCity, hometown: hometown, mobileNumber: mobileNumber, facebook: facebook } };
        membersCollection.updateMany( modifiedUser, updateData, function( err, result ) {
            if ( err ) throw err;
            console.log( result );
            client.close();
            callback();
        });
    });
}

function getProfileData( username, callback ) {
    terminalInformation( "Get Profile." );
    var profileData = { avatar64code: "" };
    var buddyListData = [];
    client.connect( err => {
        if ( err ) throw err;
        // 取得好友清單
        const buddyListCollection = client.db( config.mongodb.database ).collection( config.mongodb.buddy_Collection );
        buddyListCollection.find( { owner: username } ).toArray( function( err, result ) {
            if ( err ) throw err;
            if ( result[ 0 ] != undefined ) {
                buddyListData = result[ 0 ].buddyList;
                console.log( "Buddy List length: " + buddyListData.length );
                console.log( "Show Object Element, Buddy List: " + Object.keys( buddyListData[ 0 ] ) );
            } else {
                console.log( "I have no friends. I haven't had any friends: 🥲" );
            }
        });
        // 取得使用者自己的個人資料
        const membersCollection = client.db( config.mongodb.database ).collection( config.mongodb.members_Collection );
        membersCollection.find( { username: username } ).toArray( ( err, result ) => {
            if ( err ) throw err;
            if ( result[ 0 ] == undefined ) {
                console.log( result );
                console.log( "∅ undefined" );
            } else {
                console.log( "Get profile from ->member username: " + result[ 0 ].username );
                profileData.avatar64code = result[ 0 ].avatar64code;
            }
            client.close();
            callback( profileData, buddyListData );
        });
    });
}

// 數字、字串前補0
// code : 你輸入的資料(字串、數字)
// dataLength : 資料補0後的長度
function LeadingZero( code, dataLength ) {
    var str = Array( 10 ).join( '0' ) + code;
    return str.slice( 0 - dataLength );
}

var lastSerialNumber;
function generatedSerialNumber() {
    var y = new Date().getFullYear();
    y = y % 2000;
    var m = new Date().getMonth();
    m = LeadingZero( m, 2 );
    var d = new Date().getDay();
    d = LeadingZero( d , 2 );
    var h = new Date().getHours();
    h = LeadingZero( h, 2 );
    var mm = new Date().getMinutes();
    var ss = new Date().getSeconds();
    var number = y + m + d + h + mm + ss;
    if ( lastSerialNumber == number ) number++;
    lastSerialNumber = number;
    return "cf" + number;
}

// Circle的邀請成員們, 寫入一個unread訊息
function unreadMessages( serialNumber, recipient, callback ) {
    terminalInformation( "Make Unread Message Notifications." );
    var arr = recipient.split(','); // 陣列字串分割成陣列
    console.log( "recipient: " + arr );
    const membersCollection = client.db( config.mongodb.database ).collection( config.mongodb.members_Collection );

    for ( let i = 0; i < arr.length; i ++ ) {
        // console.log( "username: " + arr[ i ] );
        membersCollection.find( { username: arr[ i ] } ).toArray( ( err, result ) => {
            if ( err ) throw err;
            if ( result[ 0 ] == undefined ) {
                console.log( result );
                console.log( "∅ username not found" );
            } else {
                // console.log( "username found: " + result[ 0 ].username );
                var whereStr = { username: result[ 0 ].username };
                var message = [];
                message = result[ 0 ].unreadMessage;
                message.push( serialNumber );
                var updateStr = { $set: { unreadMessage: message } };
                membersCollection.updateOne( whereStr, updateStr, ( err, res ) => {
                    if ( err ) throw err;
                    // console.log( res );
                    // client.close();
                    callback();
                });
            }
        });
    }
}

function createCircleForm( tokenName, fields, callback ) {
    terminalInformation( "Create a Circle Form." );
    client.connect( err => {
        if ( err ) throw err;
        const circleCollection = client.db( config.mongodb.database ).collection( config.mongodb.circle_Collection );
        var serialNumber = generatedSerialNumber();
        var userObj = { serialNumber: serialNumber, circleName: fields.circle_name, circleDues: fields.circle_dues, circlePaymentCycle: fields.circle_paymentCycle, circleTextarea: fields.circle_textarea, founder: tokenName, member: fields.inviteMember };
        circleCollection.insertOne( userObj, ( err, res ) => {
            if ( err ) throw err;
            console.log( res );
            console.log( "* Create a Circle Form *" );
            unreadMessages( serialNumber, fields.inviteMember, () => {
                client.close();
                callback();
            });
        });
    });
}

function terminalInformation( string ) {
    console.log( "/* *********#*********#*********#*********#*********#*********#*********#" );
    console.log( " *   MongoDB: " + string );
    console.log( " #*********#*********#*********#*********#*********#*********#********* */" );
}