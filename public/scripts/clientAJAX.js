// Asynchronous JavaScript and XML

const httpRequest = new XMLHttpRequest();
let isEmailAvailable;

httpRequest.onload = function() {
    if ( httpRequest.status >= 200 && httpRequest.status < 400 ) {
        let jsonObject = JSON.parse( httpRequest.responseText );

        // Email是否可以使用
        if ( jsonObject.emailAvailable == "true" ) {
            isEmailAvailable = true;
        } else {
            isEmailAvailable = false;
        }

        // 成功註冊
        if ( jsonObject.createMember == "success" ) {
            window.location.href = "http://127.0.0.1:8888/index";
        }
    }
}

httpRequest.onerror = function() {
    alert( "Can't connect to this network." );
}

// 傳送使用者"註冊"的基本資料
function registerForUser( familyName, givenName, email, password, yearOfBirth, monthOfBirth, dayOfBirth, gender ) {
    // console.log("客戶端註冊資訊準備用POST傳給伺服器");
    httpRequest.open( "POST", "http://127.0.0.1:8888/register", false );
    httpRequest.setRequestHeader( "Content-type", "application/x-www-form-urlencoded" );
    httpRequest.send( "familyName=" + familyName + 
                      "&givenName=" + givenName +
                          "&email=" + email +
                       "&password=" + password +
                    "&yearOfBirth=" + yearOfBirth + 
                   "&monthOfBirth=" + monthOfBirth +
                     "&dayOfBirth=" + dayOfBirth +
                         "&gender=" + gender );
}