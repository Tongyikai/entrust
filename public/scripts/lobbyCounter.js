CLEAR_TOKEN = "authorization=";
HOST_URL = "http://127.0.0.1:8888/index";

// 頭像menu
var graph_o = document.querySelector( ".graph_o" ); 
graph_o.addEventListener( "click", function() {
    this.classList.toggle( "active" );
});

// 新增好友輸入框
var add_box = document.querySelector( ".add_box" ); 
add_box.addEventListener( "click", function() {
    var addBtn = document.getElementsByClassName( "addBox_input" )[ 0 ];
    if ( addBtn.style.display == "none" || addBtn.style.display == "" ) {
        addBtn.style.display = "block";
    } else {
        addBtn.style.display = "none";
    }
});

// 引用外部 script "formCheck.js"
let emailCorrect = checkEmailFormat;
let nameLengthCorrect = checkNameLengthFormat;
let includeSymbolsCorrect = checkIncludeSymbolsFormat;
let usernameCorrect = checkUsernameFormat;
let checkProfile = checkProfileData;
// 引用外部 script "clientAJAX.js"
let addFriendEmail = addBuddyFromEmail;
let addFriendUsername = addBuddyFromUsername;
let uploadProfile = uploadProfileData;

function newFriend() {
    var addFriendName = document.getElementById( "addFriendName" );
    if ( emailCorrect( addFriendName.value ) ) {
        alert( "email Ok." );
        addFriendEmail( addFriendName.value );

    } else if ( nameLengthCorrect( addFriendName.value ) ) {
        alert( "Error: Name exceeds 24 characters." );

    } else if ( includeSymbolsCorrect( addFriendName.value ) ) {
        alert( "Error: Name has other symbols or email address is incorrect format." );

    } else if ( usernameCorrect( addFriendName.value ) ) {
        alert( "Error: The name must contain English and Numbers. Characters longer than 6." );

    } else {
        alert( "username Ok." );
        addFriendUsername( addFriendName.value );
    }
}

/* *********#*********#*********#*********#*********#
 *					 編輯視窗裡的功能 				   *
 #*********#*********#*********#*********#********* */
// 限制上傳圖片的大小
const UPLOAD_AVATAR_MAX_SIZE = 1*1024*1024; 
const ERROR_MESSAGE = "The uploaded attachment file cannot exceed 1 Mega Byte";
let avatarSize = true;
var loadFile = function( event ) {
    let uploadAvatar = document.getElementById( "edit_uploadAvatar" );

    // 上傳的檔案如果大於限制顯示警告
    if ( uploadAvatar.files[ 0 ].size > UPLOAD_AVATAR_MAX_SIZE ) {
        avatarSize = false;
        alert( ERROR_MESSAGE );
    } else {
        avatarSize = true;
        avatar = uploadAvatar;
    }
}

function cancelUploadAvatar() {
    document.getElementById( "edit_uploadAvatar" ).value = "";
    avatarSize = true;
}

// 出生年月日參數
function displayYear() {
    let options = "<option>year</option>";
    for ( var i = 1900; i <= 2020; i++ ) {
        options += ( "<option>" + i + "</option>" );
    }
    document.getElementById( "edit_yearBox" ).innerHTML = options;
}

function displayMonth() {
    let options = "<option>month</option>";
    for ( var i = 1; i <= 12; i++ ) {
        options += ( "<option>" + i + "</option>" );
    }
    document.getElementById( "edit_monthBox" ).innerHTML = options;
}

function displayDay() {
    let options = "<option>day</option>";
    for ( var i = 1; i <= 31; i++ ) {
        options += ( "<option>" + i + "</option>" );
    }
    document.getElementById( "edit_dayBox" ).innerHTML = options;
}

// 監聽 form 編輯視窗
window.addEventListener( "load", () => {
    const form = document.getElementById( "edit_profileForm" );
    form.addEventListener( "submit", ( event ) => {
        event.preventDefault();
        if ( checkProfile() ) {
            uploadProfile( form );
        }
    });
});

// Logout
let logoutButton = document.getElementById( "logout" );
logoutButton.onclick = () => {
    document.cookie = CLEAR_TOKEN;
    window.location.href = HOST_URL;
}

/* *********#*********#*********#*********#*********#
 *					畫面載入執行的功能				   *
 #*********#*********#*********#*********#********* */
 displayYear();
 displayMonth();
 displayDay();