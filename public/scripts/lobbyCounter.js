/* *********#*********#*********#*********#*********#
 *                      網頁功能                     *
 #*********#*********#*********#*********#********* */
 
CLEAR_TOKEN = "authorization=";
HOST_URL = "http://127.0.0.1:8888/index";

// 頭像 menu
var graph_o = document.querySelector( ".graph_o" ); // 取 class
graph_o.addEventListener( "click", function() {
    this.classList.toggle( "active" );
});

// 頭像 menu 底下的, 新增好友
var addFriendBtn = document.querySelector( "#menu_addFriend" ); // 取 id
addFriendBtn.addEventListener( "click", function() {
    var addNewFriendWindow = document.getElementsByClassName( "addNewFriendWindow" )[ 0 ];
    if ( addNewFriendWindow.style.display === "none" || addNewFriendWindow.style.display === "" ) {
        addNewFriendWindow.style.display = "block";
    } else {
        addNewFriendWindow.style.display = "none";
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
let loadingProfile = loadingProfileData;

function newFriend() { // onclick功能, 寫在lobby.html
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

var loadFile = function( event ) {
    let uploadAvatar = document.getElementById( "edit_uploadAvatar" );

    // 上傳的檔案如果大於限制顯示警告
    if ( uploadAvatar.files[ 0 ].size > UPLOAD_AVATAR_MAX_SIZE ) {
        alert( ERROR_MESSAGE );
        cancelUploadAvatar(); // 取消頭像
    } else {
        // avatar = uploadAvatar;


    }
}

function cancelUploadAvatar() {
    document.getElementById( "edit_uploadAvatar" ).value = "";
}

// 出生年月日參數
function displayYear() {
    let options = "<option>Year</option>";
    for ( var i = 1900; i <= 2020; i++ ) {
        options += ( "<option>" + i + "</option>" );
    }
    document.getElementById( "edit_yearBox" ).innerHTML = options;
}

function displayMonth() {
    let options = "<option>Month</option>";
    for ( var i = 1; i <= 12; i++ ) {
        options += ( "<option>" + i + "</option>" );
    }
    document.getElementById( "edit_monthBox" ).innerHTML = options;
}

function displayDay() {
    let options = "<option>Day</option>";
    for ( var i = 1; i <= 31; i++ ) {
        options += ( "<option>" + i + "</option>" );
    }
    document.getElementById( "edit_dayBox" ).innerHTML = options;
}

// 編輯個人資料 提交
window.addEventListener( "load", () => {
    const form = document.getElementById( "edit_profileForm" );
    form.addEventListener( "submit", ( event ) => {
        event.preventDefault();
        if ( checkProfile( form ) ) uploadProfile( form );
    });
});

// 取得個人資料
function displayProfile() {
    loadingProfile();
}

// 個人資料顯示 將Server給的資料 放置對的地方
function setProfile( profileData, buddyListData ) {
    document.getElementById( "menuAvatar" ).src = profileData.avatar64code;
    var count = buddyListData.length;
    for ( var i = 0; i < count; i++ ) {
        dynamicallyAddBuddyList( buddyListData[ i ].username, buddyListData[ i ].avatar64code, buddyListData[ i ].jobTitle, i );
    }
} 

/* *********#*********#*********#*********#*********#
 *					 動態新增好友清單				   *
 #*********#*********#*********#*********#********* */
 function dynamicallyAddBuddyList( name, avatar64code, jobTitle, ordinalNumber ) {
    var div = document.querySelector( ".container_left .box" );
    var count = ordinalNumber + 1;
    div.innerHTML += '<div class="list">' +
                         '<div class="imgBx">' +
                             '<img src="' + avatar64code + '">' +
                         '</div>' +
                         '<div class="content">' +
                             '<h2 class="rank"><small>#</small>' + count + '</h2>' +
                             '<h4>' + name + '</h4>' +
                             '<p>' + jobTitle + '</p>' +
                         '</div>' +
                     '</div>';
    /*
    div.innerHTML += '<div class="list"><div class="imgBx"><img src="public/images/avatar2.png"></div><div class="content"><h2 class="rank"><small>#</small>11</h2><h4>Liza Koshy</h4><p>YouTuber/Social Media Personality</p></div></div>';
    div.innerHTML += '<div class="list"><div class="imgBx"><img src="public/images/avatar.png"></div><div class="content"><h2 class="rank"><small>#</small>12</h2><h4>Liza Koshy</h4><p>YouTuber/Social Media Personality</p></div></div>';
    */
 }

/* *********#*********#*********#*********#*********#
 *					   Menu 選單				     *
 #*********#*********#*********#*********#********* */
 // edit
 let editButton = document.getElementById( "menu_edit" );
 let middleWindow = document.getElementsByClassName( "container_middle" )[ 0 ];
 editButton.onclick = () => {
    let editWindow = document.getElementsByClassName( "editWindow" )[ 0 ];
    if ( editWindow.style.display === "none" ) {
        editWindow.style.display = "block";
        middleWindow.style.display = "none";
    } else {
        editWindow.style.display = "none";
        middleWindow.style.display = "block";
    }
 }
 // edit_closeButton
 let edit_closeButton = document.getElementsByClassName( "edit_closeButton" )[ 0 ];
 edit_closeButton.onclick = () => {
    let editWindow = document.getElementsByClassName( "editWindow" )[ 0 ];
    editWindow.style.display = "none";
    middleWindow.style.display = "block";
 }
 
 // logout
 let logoutButton = document.getElementById( "menu_logout" );
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
 displayProfile();