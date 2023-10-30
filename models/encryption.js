const crypto = require( "crypto" );

module.exports = function getRePassword( password ) {
    //加密
    let hashPassword = crypto.createHash( "sha1" );
    hashPassword.update( password );
    const rePassword = hashPassword.digest( "hex" );
    
    console.log( " *          E N C R Y P T I O N          *" );
    console.log( "hashPassword: " + hashPassword );
    console.log( "rePassword: " + rePassword );

    return rePassword;
}