let memberOperations = require( "../models/memberOperations" );
let tokenOperations = require( "../models/tokenOperations" );

module.exports = {
    userLogin,
    userRegister,
    tokenLogin,
    addBuddy
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

function tokenLogin( token ) {
    if ( tokenOperations.tokenExist( token ) ) {
        console.log( "token exist [ Under Construction ]" );
    } else {
        console.log( "token no exist [ Under Construction ]" );
    }
}

function addBuddy( userToken, friendData, callback ) {
    let tokenName = tokenOperations.whoIsThisToken( userToken );

    if ( friendData.indexOf( "email=" ) == 0 ) { // 資料是 email 的格式, 查詢 email 的使用者名稱
        var str = friendData.replace( "email=", "" );
        console.log( "add friend email: " + str );

        memberOperations.QueryTheUsernameOfEmail( str, ( username ) => {
            switch ( username ) {
                case "undefined":
                    console.log( "😞Not found: " + username );
                    break;
                
                default:
                    console.log( "🫱🏻‍🫲🏽 Buddy 🫱🏿‍🫲🏻" );
                    memberOperations.createNewFriend( tokenName, username );
            } 
        });

    } else if ( friendData.indexOf( "username=" ) == 0 ) { // 資料是 username 的格式, 查詢名稱是否存在
        var str = friendData.replace( "username=", "" );
        console.log( "add friend username: " + str );

        memberOperations.queryUsername( str, ( exists ) => {
            switch ( exists ) {
                case false:
                    console.log( "😞Not found: " + str );
                    break;
                
                default:
                    console.log( "🫱🏻‍🫲🏽 Buddy 🫱🏿‍🫲🏻" );
                    // createNewFriend();
            } 
        });

    } else {
        console.log( "err: " + friendData );

    }
    // console.log( tokenOperations.whoIsThisToken( userToken ) );
}