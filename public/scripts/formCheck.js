emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
nameRule = /[a-zA-Z0-9]{25}/; // 匹配成立代表名字超過24字元
passwordRule = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[\w\s]).{8,16}$/;
blankRule = /(^s*)|(s*$)/g;
testName = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,12}$/; //至少有一個數字,至少有一個小寫英文字母,至少有一個大寫英文字母,字串長度在 6 ~ 12 個字母之間

/* *********#*********#*********#*********#*********#
 *					    METHOD 					    *
 #*********#*********#*********#*********#********* */
function checkEmailFormat( parameter ) {
    if ( emailRule.test( parameter ) ) return true;
    return false;
}

function checkNameFormat( parameter ) {
    if ( nameRule.test( parameter ) ) return true;
    return false;
}

function checkPasswordFormat( parameter ) {
    return passwordRule.test( parameter );
}

// 檢查是否輸入了空白 ( 沒有輸入或輸入空白為 true，文字包含空白字符為 false )
function checkBlankFormat( parameter ) {
    if ( parameter.replace( blankRule, "" ).length == 0 ) {
        return true;
    }
    
    if ( parameter == "" ) return true;
    var regulation = "^[ ]+$";
    var re = new RegExp( regulation );
    return re.test( parameter );
}