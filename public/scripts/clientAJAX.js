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

// 檢查電子郵件是否存在(避免註冊重複的電子郵件)
function checkEmailAvailable( searchEmail ) {
    httpRequest.open( "GET", "http://127.0.0.1:8888/signUp/check?email=" + searchEmail, false );
    httpRequest.send();
    return isEmailAvailable;
}

// 傳送使用者"註冊"的基本資料
function registerForUser( familyName, givenName, email, password, yearOfBirth, monthOfBirth, dayOfBirth, gender ) {
    // console.log("客戶端註冊資訊準備用POST傳給伺服器");
    // async 可选
    // 一个可选的布尔参数，表示是否异步执行操作，默认为 true。
    // 如果值为 false，send() 方法直到收到答复前不会返回。
    // 如果 true，已完成事务的通知可供事件监听器使用。
    // 如果 multipart 属性为 true 则这个必须为 true，否则将引发异常。
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

function usernameExists( parameter ) {
    httpRequest.open( "POST", "http://127.0.0.1:8888/usernameExists", false );
    httpRequest.setRequestHeader( "Content-type", "application/x-www-form-urlencoded" );
    httpRequest.send( "username=" + parameter );
}