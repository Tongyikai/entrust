/* *********#*********#*********#*********#*********#
 *                      資料檢查                     *
 #*********#*********#*********#*********#********* */

emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
nameLengthRule = /[a-zA-Z0-9]{25}/; // 匹配成立代表名字超過24字元
includeSymbolsRule = /[^a-zA-Z0-9]+/; // 英文或數字以外的符號都配對，[^a-z] 方刮號前面寫一個尖號(脱字符)則代表要求匹配除了尖號後面列出"以外"的字符
usernameRule = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,23}$/; //至少有一個數字,至少有一個小寫英文字母,至少有一個大寫英文字母,字串長度在 6 ~ 23 個字母之間
passwordRule = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[\w\s]).{8,16}$/;
blankRule = /(^s*)|(s*$)/g;
includeNumber = /[0-9]/;

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

// 檢查文字中是否包含空白
function checkBlankInTheWord( parameter ) {
    let str = parameter.split( "" );
    for ( var i = 0; i < str.length; i++ ) {
        if ( str[ i ] == " " ) {
            return true;
        }
    }
    return false;
}

function checkIncludeNumber( parameter ) {
    if ( includeNumber.test( parameter ) ) return true;
    return false;
}

// 檢查出生年月日是否正確
function checkDateOfBirth( year, month, day ) {
    let limitInMonth = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
    let isLeap = new Date( year, 1, 29 ).getDate() === 29;
    if ( isLeap ) {
        limitInMonth[ 1 ] = 29;
    }
    return day <= limitInMonth[ month - 1 ];
}

function checkProfileData( form ) {

    userData = { // 從 form 表單 取出要的資料
        avatarImg: form[ 0 ].value,
       familyName: form[ 2 ].value,
        givenName: form[ 3 ].value,
         nickname: form[ 4 ].value,
      yearOfBirth: form[ 5 ].value,
     monthOfBirth: form[ 6 ].value,
       dayOfBirth: form[ 7 ].value,
           stayAt: form[ 10 ].value,
         hometown: form[ 11 ].value,
           mobile: form[ 12 ].value,
               fb: form[ 13 ].value
    };

    const YEAR_CHARACTER = "Year";
    const MONTH_CHARACTER = "Month";
    const DAY_CHARACTER = "Day";
    var safeBall = 8;

    if ( checkBlankInTheWord( userData.familyName ) ) {
        // alert( "Family Name: Do not include whitespace characters in the text" );
        alert( "Family Name: Words include blank" );
        safeBall--;

    } else if ( checkIncludeNumber( userData.familyName ) ) {
        alert( "Family Name: Cannot have numbers" );
        safeBall--;

    } else if ( checkNameLengthFormat( userData.familyName ) ) {
        alert( "Family Name: Text exceeds 24 characters" );
        safeBall--;
    }
    
    if ( checkBlankInTheWord( userData.givenName ) ) {
        // alert( "Given Name: Do not include whitespace characters in the text" );
        alert( "Given Name: Words include blank" );
        safeBall--;

    } else if ( checkIncludeNumber( userData.givenName ) ) {
        alert( "Given Name: Cannot have numbers" );
        safeBall--;

    } else if ( checkNameLengthFormat( userData.givenName ) ) {
        alert( "Given Name: Text exceeds 24 characters" );
        safeBall--;
    }

    if ( checkNameLengthFormat( userData.nickname ) ) {
        alert( "Nickname: Text exceeds 24 characters" );
        safeBall--;
    }

    if ( userData.yearOfBirth != YEAR_CHARACTER && userData.monthOfBirth != MONTH_CHARACTER && userData.dayOfBirth != DAY_CHARACTER ) {
        if ( checkDateOfBirth( userData.yearOfBirth, userData.monthOfBirth, userData.dayOfBirth ) ) {
            // alert( "出生 - 修改 可以" );

        } else {
            safeBall--;
            alert( "Birth: Not the correct date" );
        }
    } else if ( userData.yearOfBirth == YEAR_CHARACTER && userData.monthOfBirth == MONTH_CHARACTER && userData.dayOfBirth == DAY_CHARACTER ) {
        // alert( "出生 - 不修改" );

    } else {
        alert( "Birth: Please enter complete date of birth" );
        safeBall--;
    }

    if ( checkNameLengthFormat( userData.stayAt ) ) {
        alert( "Stay at: Text exceeds 24 characters" );
        safeBall--;
    }

    if ( checkNameLengthFormat( userData.hometown ) ) {
        alert( "Hometown: Text exceeds 24 characters" );
        safeBall--;
    }

    if ( userData.fb.length > 100 ) {
        alert( "Facebook: Text exceeds 100 characters-" + userData.fb.length );
        safeBall--;
    } 

    if ( safeBall < 8 ) {
        alert( "Form table cannot be sent" );
        return false;
    } else {
        // alert( "送出修改");
        return true;
    }
}