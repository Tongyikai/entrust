hostURL = "http://127.0.0.1:8888/index";

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

// 引用外部 script
let emailCorrect = checkEmailFormat;
let nameLengthCorrect = checkNameLengthFormat;
let userNameCorrect = checkUserNameFormat;

let addFriendEmail = addBuddyFromEmail;
let addFriendUsername = addBuddyFromUsername;

function newFriend() {
    var addFriendName = document.getElementById( "addFriendName" );
    if ( emailCorrect( addFriendName.value ) ) {
        alert( "email Ok" );
        addFriendEmail( addFriendName.value );

    } else if ( nameLengthCorrect( addFriendName.value ) ) {
        alert( "Error: Name exceeds 24 characters." );

    } else if ( userNameCorrect( addFriendName.value ) ) {
        alert( "Error: Name has other symbols." );

    } else {
        alert( "username Ok" );
        addFriendUsername( addFriendName.value );
    }
}

// Logout
let logoutButton = document.getElementById( "logout" );
logoutButton.onclick = () => {
    document.cookie = clearToken;
    window.location.href = hostURL;
}