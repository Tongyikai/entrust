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
// 引用外部 script "clientAJAX.js"
let addFriendEmail = addBuddyFromEmail;
let addFriendUsername = addBuddyFromUsername;

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

// Logout
let logoutButton = document.getElementById( "logout" );
logoutButton.onclick = () => {
    document.cookie = CLEAR_TOKEN;
    window.location.href = HOST_URL;
}