var http = require( "http" ); 
var fs = require( "fs" );
var url = require( "url" );
let querystring = require( "querystring" );
let userController = require( "./controllers/userController" );

http.createServer( function( request, response ) {

    let post = "";

    /* *********#*********#*********#*********#*********#
	 *					     POST 					    *
	 #*********#*********#*********#*********#********* */
	request.on( "data", function( chunk ) {
		post += chunk;
		console.log( "/* *********#*********#*********#*********#*********#" );
		console.log( " *                       POST                       *" );
		console.log( " #*********#*********#*********#*********#********* */" );
	});

	request.on( "end", function() {
		if ( request.url === "/signinForm" ) {
			post = querystring.parse( post );
            console.log( "Request for sign in: " );
			console.log( post );

        } else if ( request.url === "/signupForm" ) {
			post = querystring.parse( post );
			console.log( "Request for sign up: " );
            console.log( post );

		}
    });
   
	/* *********#*********#*********#*********#*********#
	 *					      URL 					    *
	 #*********#*********#*********#*********#********* */
    if ( request.url == '/' ) {
        sendFileContent( response, "views/index.html", "text/html" );
		console.log( "/* *********#*********#*********#*********#*********#" );
		console.log( " *             F I R S T - R E Q U E S T            *" );
		console.log( " #*********#*********#*********#*********#********* */" );
    }

    if ( request.url == '/index' ) {
        fs.readFile( 'index.html', function( err, data ) {
            if ( err ) {
                console.log( err );
                response.writeHead( 404, { 'Content-Type': 'text/html' } );
            } else {
                response.writeHead( 200, { 'Content-Type': 'text/html' } );
                response.write( data.toString() );
            }
            response.end();
        });

    } else if ( /^\/[a-zA-Z0-9\/]*.css$/.test( request.url.toString() ) ) {
		sendFileContent( response, request.url.toString().substring( 1 ), "text/css" );
		console.log( "Response File: " + request.url.toString().substring( 1 ) );

    } else if ( /^\/[a-zA-Z0-9\/]*.png$/.test( request.url.toString() ) ) {
		sendFileContent( response, request.url.toString().substring( 1 ), "text/png" );
		console.log( "Response File: " + request.url.toString().substring( 1 ) );

	} else if ( /^\/[a-zA-Z0-9\/]*.js$/.test( request.url.toString() ) ) {
		sendFileContent( response, request.url.toString().substring( 1 ), "text/javascript" );
		console.log("Response File: " + request.url.toString().substring( 1 ) );
		
	} else if ( /^\/[a-zA-Z0-9\/]*.mp4$/.test( request.url.toString() ) ) {
		sendFileContent( response, request.url.toString().substring( 1 ), "text/mp4" );
		console.log("Response File: " + request.url.toString().substring( 1 ) );
		
	}

}).listen( 8888 );//使用 listen 方法绑定 8888 端口

//終端印如下信息
console.log( "/* *********#*********#*********#*********#*********#" );
console.log( " *      Server running at http://127.0.0.1:8888     *" );
console.log( " #*********#*********#*********#*********#********* */" );

/* *********#*********#*********#*********#*********#
 *					    METHOD 					    *
 #*********#*********#*********#*********#********* */
function sendFileContent( response, fileName, contentType ) {
	fs.readFile( fileName, function( err, data ) {
		if( err ) {
			response.writeHead( 404 );
			response.write( "Not Found!" );
		} else {
			response.writeHead( 200, { "Content-Type": contentType } );
			response.write( data );
		}
		response.end();
	});
}