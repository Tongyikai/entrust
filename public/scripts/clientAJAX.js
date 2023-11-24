// Asynchronous JavaScript and XML
const httpRequest = new XMLHttpRequest();

httpRequest.onload = function() {
    if ( httpRequest.status >= 200 && httpRequest.status < 400 ) {
        let jsonObject = JSON.parse( httpRequest.responseText );

        console.log( jsonObject );

        // 註冊成功, 讓使用者自行登入
        if ( jsonObject.register == "done" ) {
            alert( "Register Done" );
            return;
        }
       
        switch( jsonObject.authorization ) {
            case "empty":
                alert( "Account password is wrong!!" );
                break;

            case "Okay":
                alert( "Welcome To Entrust Lobby" );
                window.location.href = "http://127.0.0.1:8888/lobby";
                break;

            default:
                document.cookie = "authorization=" + jsonObject.authorization;
                loginAuthorization();
        }
    }
}

httpRequest.onerror = function() {
    alert( "Can't connect to this network." );
}

function userLogin( username, password ) {
    httpRequest.open( "POST", "http://127.0.0.1:8888/SignIn", false );
    httpRequest.setRequestHeader( "Content-type", "application/x-www-form-urlencoded" );
    httpRequest.send( "username=" + username + "&password=" + password );
}

function userRegister( username, email, password ) {
    httpRequest.open( "POST", "http://127.0.0.1:8888/SignUp", false );
    httpRequest.setRequestHeader( "Content-type", "application/x-www-form-urlencoded" );
    httpRequest.send( "username=" + username + "&email=" + email + "&password=" + password );
}

function loginAuthorization() {
    var cookieValue = document.cookie.replace( /(?:(?:^|.*;\s*)authorization\s*\=\s*([^;]*).*$)|^.*$/, "$1" );
    console.log( "拿到認證: " + cookieValue );

    if ( cookieValue !== "" ) { // 如果authorization有值，傳給伺服器認證
        httpRequest.open( "POST", "http://127.0.0.1:8888/logInWithToken", false );
        httpRequest.setRequestHeader( "Authorization", "Bearer " + cookieValue );
        httpRequest.send();
    }
}

// function addBuddyFromEmail( email ) {
//     httpRequest.open( "POST", "http://127.0.0.1:8888/addBuddy", false );
//     httpRequest.setRequestHeader( "Authorization", "Bearer " + cookieValue  );
//     httpRequest.send( "email=" + email );
// }

// function addBuddyFromUsername( username ) {
//     httpRequest.open( "POST", "http://127.0.0.1:8888/addBuddy", false );
//     httpRequest.setRequestHeader( "Authorization", "Bearer " + cookieValue  );
//     httpRequest.send( "username=" + username );
// }