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

function addBuddy( userToken, friendData ) {
    if ( friendData.indexOf( "email=" ) == 0 ) {
        var str = friendData.replace( "email=", "" );
        console.log( "add friend email: " + str );
        memberOperations.QueryTheUsernameOfEmail( str );

    } else if ( friendData.indexOf( "username=" ) == 0 ) {
        var str = friendData.replace( "username=", "" );
        console.log( "add friend username: " + str );

    } else {
        console.log( "err: " + friendData );
    }
    console.log( tokenOperations.whoIsThisToken( userToken ) );
}