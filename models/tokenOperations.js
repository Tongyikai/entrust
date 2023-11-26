const jwt = require( "jsonwebtoken" );
const config = require( "../config/configuration" );

module.exports = {
    getToken,
    tokenExist,
    whoIsThisToken
}

function getToken( username ) {
    terminalInformation( "generate new key" );
    
    const token = jwt.sign( { algorithm: "HS256", exp: Math.floor( Date.now() / 1000 ) + ( 60 * 60 ), username: username }, config.JWT_KEY );
    console.log( "generate token: " + token );
    return token;
}

function tokenExist( token ) {
    terminalInformation( "Is exist Token?" );
    
    let decoded;
    let tokenCorrect;
    jwt.verify( token, config.JWT_KEY, err => {
        if ( err ) {
            console.log( "err: " + err );
            tokenCorrect = false;
        } else {   
            decoded = jwt.verify( token, config.JWT_KEY );
            console.log( decoded );
            console.log( "Token Exist: " + decoded.username );
            tokenCorrect = true;
        }
    });
    return tokenCorrect;
}

function whoIsThisToken( token ) {
    terminalInformation( "Who is this Token?" );
    
    let decoded;
    let who = "????";
    jwt.verify( token, config.JWT_KEY, err => {
        if ( err ) {
            console.log( "err: " + err );
            
        } else {   
            decoded = jwt.verify( token, config.JWT_KEY );
            console.log( decoded );
            console.log( "Token parse username: " + decoded.username );
            who = decoded.username;
        }
    });
    return who;
}

function terminalInformation( string ) {
    console.log( "/* *********#*********#*********#*********#*********#*********#*********#" );
    console.log( " *   Token: " + string );
    console.log( " #*********#*********#*********#*********#*********#*********#********* */" );
}