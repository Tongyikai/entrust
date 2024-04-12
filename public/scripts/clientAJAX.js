// Asynchronous JavaScript and XML
const httpRequest = new XMLHttpRequest();
const AUTHORIZATION_FORMAT = /(?:(?:^|.*;\s*)authorization\s*\=\s*([^;]*).*$)|^.*$/;

httpRequest.onload = function() {
    if ( httpRequest.status >= 200 && httpRequest.status < 400 ) {
        let jsonObject = JSON.parse( httpRequest.responseText );

        console.log( jsonObject );

        // 註冊成功, 讓使用者自行登入
        if ( jsonObject.register == "done" ) {
            alert( "Register Done" );
            return;
        }

        if ( jsonObject.addBuddy == true ) {
            alert( "🫱🏻‍🫲🏽 New Buddy!" );
            return;
        } else if ( jsonObject.addBuddy == false ) {
            alert( "Not found! or Already friends" );
            return;
        }

        if ( jsonObject.updateProfile == "finished" ) {
            alert( "📝 Update Profile!" );
            return;
        }

        if ( jsonObject.createCircle == "finished" ) {
            alert( "📜 Create Circle!" );
            return;
        }

        // 取得個人資料
        if (  jsonObject[ "profileData" ] != undefined ) { 
            let setProfileData = setProfile; // 引用外部 script "lobbyCounter.js"
            setProfileData( jsonObject.profileData, jsonObject.buddyListData );
            // console.log( "profileData: " + jsonObject.profileData );
            // console.log( "buddyListData: " + jsonObject.buddyListData );
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

            case "NotOkay":
                alert( "Token Authentication Failed: " + jsonObject.authorization );
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
    var cookieValue = document.cookie.replace( AUTHORIZATION_FORMAT, "$1" );
    console.log( "Token: " + cookieValue );

    if ( cookieValue !== "" ) { // 如果authorization有值，傳給伺服器認證
        httpRequest.open( "POST", "http://127.0.0.1:8888/logInWithToken", false );
        httpRequest.setRequestHeader( "Authorization", "Bearer " + cookieValue );
        httpRequest.send();
    }
}

function addBuddyFromEmail( email ) {
    var cookieValue = document.cookie.replace( AUTHORIZATION_FORMAT, "$1" );
    httpRequest.open( "POST", "http://127.0.0.1:8888/addBuddy", false );
    httpRequest.setRequestHeader( "Authorization", "Bearer " + cookieValue  );
    httpRequest.send( "email=" + email );
}

function addBuddyFromUsername( username ) {
    var cookieValue = document.cookie.replace( AUTHORIZATION_FORMAT, "$1" );
    httpRequest.open( "POST", "http://127.0.0.1:8888/addBuddy", false );
    httpRequest.setRequestHeader( "Authorization", "Bearer " + cookieValue  );
    httpRequest.send( "username=" + username );
}

function uploadProfileData( form ) {
    var cookieValue = document.cookie.replace( AUTHORIZATION_FORMAT, "$1" );
    const FD = new FormData( form );
    httpRequest.addEventListener( "load", function( event ) {
        // alert( "Server: " + event.target.responseText );
    });
    httpRequest.addEventListener( "error", function( event ) {
        alert( "Oops! Something went wrong..." + event );
    });
    httpRequest.open( "POST", "http://127.0.0.1:8888/updateProfile" );
    httpRequest.setRequestHeader( "Authorization", "Bearer " + cookieValue  );
    httpRequest.send( FD );
}

function loadingProfileData() {
    var cookieValue = document.cookie.replace( AUTHORIZATION_FORMAT, "$1" );
    httpRequest.open( "POST", "http://127.0.0.1:8888/loadingProfileData", false );
    httpRequest.setRequestHeader( "Authorization", "Bearer " + cookieValue );
    httpRequest.send();
}

function circleData( form ) {
    var cookieValue = document.cookie.replace( AUTHORIZATION_FORMAT, "$1" );
    const FD = new FormData( form );
    httpRequest.addEventListener( "load", function( event ) {
        // alert( "Server: " + event.target.responseText );
    });
    httpRequest.addEventListener( "error", function( event ) {
        alert( "Oops! Something went wrong..." + event );
    });
    httpRequest.open( "POST", "http://127.0.0.1:8888/createCircle" );
    httpRequest.setRequestHeader( "Authorization", "Bearer " + cookieValue  );
    httpRequest.send( FD );
}