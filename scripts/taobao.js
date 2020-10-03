// ==UserScript==
// @name         淘宝助手
// @namespace    https://github.com/maijz128
// @version      0.4.2
// @description  自动登录
// @author       MaiJZ
// @match        *://*.taobao.com/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/1.6.4/jquery.min.js
// ==/UserScript==



(function () {
    main();
})();

function main() {
    if (matchURLAbsolute('https://www.taobao.com/')) {
        console.log('官网首页');
        // jumpToLogin();
    } else if (matchURL('https://login.taobao.com/member/login.jhtml')) {
        // autoLogin();
    }else if (matchURL("/search?")){
        EnterToInput();
    }else if (matchURL("/item.htm?")){

        setTimeout(function () {
            
            var div_main_pic = $('div.tb-main-pic:first');
            var btn = document.createElement("button");
            btn.textContent = "原图";
            btn.style = "position: absolute; opacity: 0.5;";
            btn.addEventListener("click", function(){
                var imgBooth = document.getElementById("J_ImgBooth");
                var imgLink = imgBooth.getAttribute("src");
                imgLink = imgLink.replace("_400x400.jpg", "");
                window.open(imgLink);
                
            }, false);
            div_main_pic.prepend(btn);
            
        }, 1000);


        setTimeout(function () {
            HUABEI_TotalAmount();
            HUABEI_TotalAmount_bind();
        }, 3000);
    }
    Mercury_Album_Box();
}


// 计算并显示分期总额
function HUABEI_TotalAmount() {
    $("#J_TBMultiTerms .J_TBMultiTerms li").each(function (index, element) {
        var text = $(this).text();
        text = text.replace("(含手续费)", "");
        // console.log(text);

        var buy_num = parseInt($('#J_IptAmount').val()) || 1;

        var summary_price = $('#J_PromoPriceNum').text() || $('#J_StrPrice em.tb-rmb-num').text() || 0;
        summary_price = parseFloat(summary_price) * buy_num;

        if (text.indexOf("x") > -1 || text.indexOf("x") > -1) {

            var formula = text.trim();
            formula = formula.replace("￥", "");
            formula = formula.replace("期", "");
            // console.log("formula: " + formula);

            var formulaItems = formula.split("x");
            var total = parseFloat(formulaItems[0]) * parseFloat(formulaItems[1]);

            var interest = total - parseFloat(summary_price);

            var newText = text + " = " + parseInt(total) + "(" + parseInt(interest) + ")";
            // console.log("New: " + newText);
            $(this).text(newText);
        }
    });
}
function HUABEI_TotalAmount_bind() {
    $(".J_TSaleProp li").bind('click', function(e) {
        console.log("click price");
        setTimeout(function () {
            HUABEI_TotalAmount();
        }, 200);
    });

    $("#J_Stock").bind('click', function(e) {
        console.log("click number");
        setTimeout(function () {
            HUABEI_TotalAmount();
        }, 200);
    });
}

function isLogin() {
    var div_login = $('div.member-login:first');
    if (div_login) {
        var div_login_display = div_login.css('display');
        return div_login_display.indexOf('block') > -1;
    }
    return false;
}

function jumpToLogin() {
    var login_html = 'https://login.taobao.com/member/login.jhtml?redirectURL=http%3A%2F%2Fwww.taobao.com%2F';
    var btn_login = $('.btn-login:first');
    if (!isLogin) {
        window.location.href = login_html;
    } else {
        console.log('已经登录...');
    }
}

function autoLogin() {
    var inter = setInterval(function () {
        var password = $('#TPL_password_1').val();
        if (password) {
            clearInterval(inter);
            $('#J_SubmitStatic').click();
        }
    }, 100);
}

function EnterToInput() {
    var KEYS = {
        ENTER: 13, SPACE: 32, ESC: 27,
        LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40,
        A: 65, D: 68, E: 69, F: 70, R: 82, S: 83, W: 87, Z: 90, Q: 81
    };
    

    function onKeyDown() {
        document.onkeydown = function (event) {
            var e = event || window.event || arguments.callee.caller.arguments[0];
            if (e && isShortcutKey()) {
                handleKeyDown(e.keyCode);
            }
        };
    }

    function isShortcutKey() {
        return true;
    }

    function handleKeyDown(keyCode) {
        switch (keyCode) {
            case KEYS.A:
                console.log(keyCode + ": Enter");
                // var player_main = document.getElementById("");
                // fireKeyEvent(player_main, "keydown", KEYS.UP);
                
                $(".search-combobox-input")[0].focus();
                break;

            default:
                break;
        }
    }

    onKeyDown();
}



// 收藏标签分类
function Mercury_Album_Box(){
    var style = '.mercuryalbum-container{height: 240px !important;} #popupPanel, #popupPanel iframe { height: 380px !important; }'; 
    addStyle(style);
}


function matchURL(url) {
    var URL = window.location.href;
    return URL.indexOf(url) > -1;
}

function matchURLAbsolute(url) {
    var href = window.location.href;
    var len = href.length;
    return href.indexOf(url) > -1 && url.length == len;
}

function addStyle(styleContent) {
    var elStyle = document.createElement("style");
    elStyle.innerHTML = styleContent;
    document.head.appendChild(elStyle);
}

// Usage: fireKeyEvent(input元素, 'keydown', 13);  
// http://blog.csdn.net/lovelyelfpop/article/details/52471878
function fireKeyEvent(el, evtType, keyCode) {
    var doc = el.ownerDocument;
    var win = doc.defaultView || doc.parentWindow,
        evtObj;
    if (doc.createEvent) {
        if (win.KeyEvent) {
            evtObj = doc.createEvent('KeyEvents');
            evtObj.initKeyEvent( evtType, true, true, win, false, false, false, false, keyCode, 0 );
        }
        else {
            evtObj = doc.createEvent('UIEvents');
            Object.defineProperty(evtObj, 'keyCode', {
                get : function () { return this.keyCodeVal; }
            });
            Object.defineProperty(evtObj, 'which', {
                get : function () { return this.keyCodeVal; }
            });
            evtObj.initUIEvent( evtType, true, true, win, 1 );
            evtObj.keyCodeVal = keyCode;
            if (evtObj.keyCode !== keyCode) {
                console.log("keyCode " + evtObj.keyCode + " 和 (" + evtObj.which + ") 不匹配");
            }
        }
        el.dispatchEvent(evtObj);
    }
    else if (doc.createEventObject) {
        evtObj = doc.createEventObject();
        evtObj.keyCode = keyCode;
        el.fireEvent('on' + evtType, evtObj);
    }
}

function eventFire(el, eType){
    if (el.fireEvent) {
      el.fireEvent('on' + eType);
    } else {
      var evObj = document.createEvent('Events');
      evObj.initEvent(eType, true, false);
      el.dispatchEvent(evObj);
    }
}
