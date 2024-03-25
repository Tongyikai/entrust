let memberOperations = require( "../models/memberOperations" );
let tokenOperations = require( "../models/tokenOperations" );
let base64 = require( "../models/base64Model" );

module.exports = {
    userLogin,
    userRegister,
    tokenLogin,
    addBuddy,
    updateProfile,
    loadingProfile
}

function userLogin( username, password, callback ) {
    memberOperations.queryUsernameAndPassword( username, password, ( isExists ) => {
        console.log( "log in successfully: " + isExists );
        if ( isExists ) {
            // 使用者可以登入, 產生一個 token 回傳給使用者
            let generateToken = tokenOperations.getToken( username );
            callback( generateToken );
        } else {
            callback( "empty" ); // 使用者不存在, 回傳 empty, client 會拿到物件 authorization: empty
        }
    });
}

function userRegister( username, emailAddress, password, callback ) {
    // 驗證username
    if ( memberOperations.queryUsername( username, ( usernameExists ) => {
        if ( usernameExists ) {
            // 使用者名稱存在, 不能建立新會員


        } else if ( memberOperations.queryEmail( emailAddress, ( emailExists ) => {
            if ( emailExists ) {
                // email存在, 不能建立新會員
                

            } else {
                // 驗證可以, 建立新會員
                memberOperations.createNewMember( username, emailAddress, password, () => {
                    callback();
                });
            }
        })); 
    }));
}

function tokenLogin( token, callback ) {
    if ( tokenOperations.tokenExist( token ) ) {
        callback( "Okay" );
    } else {
        callback( "NotOkay" );
    }
}

async function addBuddy( userToken, friendData, callback ) { // 使函數異步,在呼叫函數時在其前面加上 await, 訪問 mongodb 就可以回傳 boolean
    let tokenName = tokenOperations.whoIsThisToken( userToken );

    if ( friendData.indexOf( "email=" ) == 0 ) { // 資料是 email 的格式
        var email = friendData.replace( "email=", "" );
        console.log( "add friend email: " + email );
        const name = await memberOperations.queryTheUsernameOfEmail( email ); // 取得email的username
        if ( name == "undefined" ) { // 查詢不到email的username
            callback( false );
        } else {
            const response = await memberOperations.queryNameOfBuddyList( tokenName, name ); // 檢查自己的好友名單,是否已經存在此人
            console.log( "Check buddyList exist?: " + response );
            if ( response ) { // 存在就不執行
                console.log( "Already friend: " + response );
                callback( false );
            } else {
                console.log( "Add new buddy from email." );
                memberOperations.createNewFriend( tokenName, name, () => {
                    callback( true );
                });
            }
        }
    }

    if ( friendData.indexOf( "username=" ) == 0 ) { // 資料是 username 的格式
        var username = friendData.replace( "username=", "" );
        console.log( "add friend username: " + username );
        const response = await memberOperations.queryNameOfBuddyList( tokenName, username ); // 檢查自己的好友名單,是否已經存在此人
        if ( response ) {
            console.log( "Check buddyList exist?: " + response );
            callback( false );
        } else {
            memberOperations.queryUsername( username, ( exists ) => { // 查詢名稱是否存在
                switch ( exists ) {
                    case false:
                        console.log( "Not found: " + username );
                        callback( false );
                        break;
                    default:
                        console.log( "Add new buddy from username." );
                        memberOperations.createNewFriend( tokenName, username, () => {
                            callback( true );
                        });
                }
            });
        }
    }
}

function updateProfile( userToken, fields, files, callback ) {
    let tokenName = tokenOperations.whoIsThisToken( userToken );
    var birth = fields.yearOfBirth + "/" + fields.monthOfBirth + "/" + fields.dayOfBirth;
    var avatar64code = "0";
    if ( files.avatar.size > 0 ) {
        avatar64code = base64( files );
    }
    memberOperations.updateProfileData( tokenName, avatar64code, fields.familyName, fields.givenName, fields.nickname, birth, fields.gender, fields.jobTitle, fields.currentCity, fields.hometown, fields.mobileNumber, fields.facebook, () => { 
        callback();
    });
}

function loadingProfile( userToken, callback ) {
    let tokenName = tokenOperations.whoIsThisToken( userToken );
    memberOperations.getProfileData( tokenName, ( profileData, buddyListData ) => {
        callback( profileData, buddyListData );
    });
}