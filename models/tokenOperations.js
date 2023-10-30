const jwt = require( "jsonwebtoken" );
const config = require( "../config/configuration" );

module.exports = {
    getToken,
    whoIsThisToken
}

function getToken( username ) {
    terminalInformation( "generate new key" );
    const token = jwt.sign( { algorithm: "HS256", exp: Math.floor( Date.now() / 1000 ) + ( 60 * 60 ), name: username }, config.signature );
    return token;
}

function whoIsThisToken( token ) {
    terminalInformation( "Who is this Token?" );
    
    let decoded;
    let tokenCorrect;
    jwt.verify( token, config.signature, err => {
        if ( err ) {
            console.log( "err: " + err );
            tokenCorrect = false;
        } else {   
            decoded = jwt.verify( token, config.secret );
            console.log( decoded );
            console.log( "Token Exist: " + decoded.name );
            tokenCorrect = true;
        }
    });
    return tokenCorrect;
}

function terminalInformation( string ) {
    console.log( "/* *********#*********#*********#*********#*********#*********#*********#" );
    console.log( " *   Token: " + string );
    console.log( " #*********#*********#*********#*********#*********#*********#********* */" );
}