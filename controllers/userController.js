let memberOperations = require("../models/memberOperations");

module.exports = {
    userLogin
}

function userLogin( username, password ) {
    
    if ( memberOperations.queryUsername( username, ( usernameExists ) => {
        if ( usernameExists ) {
            console.log( "/* *********#*********#*********#*********#*********#" );
            console.log( " *                      welcome                     *" );
            console.log( " #*********#*********#*********#*********#********* */" );
        } else {
            console.log( "/* *********#*********#*********#*********#*********#" );
            console.log( " *                     Outlander                    *" );
            console.log( " #*********#*********#*********#*********#********* */" );
        }
    }));
}