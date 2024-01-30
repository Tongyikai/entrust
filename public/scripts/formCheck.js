emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
nameLengthRule = /[a-zA-Z0-9]{25}/; // 匹配成立代表名字超過24字元
includeSymbolsRule = /[^a-zA-Z0-9]+/; // 英文或數字以外的符號都配對，[^a-z] 方刮號前面寫一個尖號(脱字符)則代表要求匹配除了尖號後面列出"以外"的字符
usernameRule = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,23}$/; //至少有一個數字,至少有一個小寫英文字母,至少有一個大寫英文字母,字串長度在 6 ~ 23 個字母之間
passwordRule = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[\w\s]).{8,16}$/;
blankRule = /(^s*)|(s*$)/g;

function checkEmailFormat( parameter ) {
    if ( emailRule.test( parameter ) ) return true;
    return false;
}

function checkNameLengthFormat( parameter ) {
    if ( nameLengthRule.test( parameter ) ) return true;
    return false;
}

function checkIncludeSymbolsFormat( parameter ) { // 匹配成功代表輸入了英文數字以外的字符
    if ( includeSymbolsRule.test( parameter ) ) return true;
    return false;
}

function checkUsernameFormat( parameter ) {
    if ( usernameRule.test( parameter ) ) return false;
    return true;
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

function checkProfileData() {
    return true;
}