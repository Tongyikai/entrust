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

function addBuddy( userToken, friendData, callback ) {
    let tokenName = tokenOperations.whoIsThisToken( userToken );
    if ( friendData.indexOf( "email=" ) == 0 ) { // 資料是 email 的格式, 查詢 email 的使用者名稱
        var email = friendData.replace( "email=", "" );
        console.log( "add friend email: " + email );
        memberOperations.queryTheUsernameOfEmail( email, ( username ) => {
            switch ( username ) {
                case "undefined":
                    console.log( "Not found: " + username );
                    callback( false );
                    break;
                default:
                    console.log( "Add new buddy from email." );
                    memberOperations.createNewFriend( tokenName, username, () => {
                        callback( true );
                    });
            } 
        });
    } else if ( friendData.indexOf( "username=" ) == 0 ) { // 資料是 username 的格式, 查詢名稱是否存在
        var username = friendData.replace( "username=", "" );
        console.log( "add friend username: " + username );
        memberOperations.queryUsername( username, ( exists ) => {
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
    } else {
        console.log( "err: " + friendData );
    }
}

function updateProfile( userToken, fields, files, callback ) {
    let tokenName = tokenOperations.whoIsThisToken( userToken );
    var birth = fields.yearOfBirth + "/" + fields.monthOfBirth + "/" + fields.dayOfBirth;
    var avatar64code = "0";
    if ( files.avatar.size > 0 ) {
        avatar64code = base64( files );
    }
    memberOperations.updateProfileData( tokenName, avatar64code, fields.familyName, fields.givenName, birth, fields.gender, fields.jobTitle, fields.currentCity, fields.hometown, fields.mobileNumber, fields.facebook, () => { 
        callback();
    });
}

function loadingProfile( userToken, callback ) {
    let tokenName = tokenOperations.whoIsThisToken( userToken );
    memberOperations.getProfileData( tokenName, ( profileData, buddyListData ) => {
        callback( profileData, buddyListData );
    });
}