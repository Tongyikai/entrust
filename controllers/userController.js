let memberOperations = require("../models/memberOperations");

module.exports = {
    userLogin,
    userRegister
}

function userLogin( username, password, callback ) {
    
    if ( memberOperations.queryUsername( username, ( usernameExists ) => {
        if ( usernameExists ) {
            // 密碼比對
        } else {
            // 使用者名稱不存在
        }
    }));
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