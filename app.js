var http = require( "http" ); 
var fs = require( "fs" );
var url = require( "url" );
let querystring = require( "querystring" );

http.createServer( function( request, response ){

    var pathname = url.parse( request.url ).pathname;
    console.log( "Request for " + pathname + " received." );
    console.log( "要開啟的: " + pathname.substr( 1 ) );

    if ( request.url == '/' ) {
        console.log( '=1=' );
        sendFileContent( response, "view/index.html", "text/html" );
    }

    if ( request.url == '/index' ) {
        console.log( '=2=' );
        fs.readFile( 'index.html', function( err, data ) {
            if ( err ) {
                console.log( err );
                response.writeHead( 404, { 'Content-Type': 'text/html' });
            } else {
                response.writeHead( 200, { 'Content-Type': 'text/html' });
                response.write( data.toString());
            }
            response.end();
        });
    } else if ( /^\/[a-zA-Z0-9\/]*.css$/.test( request.url.toString())) {
		sendFileContent( response, request.url.toString().substring( 1 ), "text/css" );
		console.log( "Response File: " + request.url.toString().substring( 1 ) + "		.css" );
    }

}).listen( 8888 );//使用 listen 方法绑定 8888 端口

//終端印如下信息
console.log( 'Server running at http://127.0.0.1:8888/' );


/* ************************************************
 *                     Method                     *
 ************************************************ */
function sendFileContent( response, fileName, contentType ) {
	fs.readFile( fileName, function( err, data ) {
		if( err ) {
			response.writeHead( 404 );
			response.write( "Not Found!" );
		} else {
			response.writeHead( 200, { "Content-Type": contentType });
			response.write( data );
		}
		response.end();
	});
}