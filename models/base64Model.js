let fs = require( "fs" );
let path = require( "path" );
let base64 = "";

module.exports = function getBase64Code( file ) { // 最終回傳 Base64 code
    saveUploadAvatar( file );
    if ( base64 == "" ) {
        console.log( "error" );
    }
    return base64;
}

// Client 上傳的圖片暫存在 uploadDir 文件夾
function saveUploadAvatar( file ) {
    let name = "image";
    let extName = path.extname( file.avatar.originalFilename );
    let oldPath = file.avatar.filepath;
    let newPath = "uploadDir/" + name + extName;

    fs.renameSync( oldPath, newPath, ( err ) => {
        if ( err ) {
            consoler.log( err );
        } 
    });
    imageBase64( newPath );
}

function imageBase64( fileURL ) {
    let imageData = fs.readFileSync( "./" + fileURL );
    var imageBase64 = imageData.toString( 'base64' );
    imagePrefix( imageBase64 );
}

function imagePrefix( base64code ) { // 把圖片轉成 Base64
    let imagePrefix = "data:image/jpeg;base64,";
    base64 = imagePrefix + base64code;    
}