// ==UserScript==
// @name         MJZ-淘宝助手
// @namespace    https://github.com/maijz128
// @version      24.10.09
// @description  淘宝助手
// @author       MaiJZ
// @match        *://*.taobao.com/*
// @match        *://*.tmall.com/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/1.6.4/jquery.min.js
// @grant        GM_setClipboard
// ==/UserScript==



(function () {
    setTimeout(() => {
        main();
    }, 1000);
})();

function main() {

    if (matchURL('https://web.m.taobao.com/app/mtb/pc-itaotool/collect?tab=shop')) {
        window.location.href = 'https://shoucang.taobao.com/shop_collect_list.htm';
    }

    TB_All();
    if (matchURLAbsolute('https://www.taobao.com/')) {
        console.log('官网首页');
        // jumpToLogin();
    } else if (matchURL('https://login.taobao.com/member/login.jhtml')) {
        // autoLogin();
    }else if (matchURL("/search?")){
        TaoBaoSearch();
    }else if (matchURL("/item.htm?")){
        if (matchURL("taobao.com")) {
            TaoBao();
        }else if (matchURL("tmall.com")) {
            Tmall();
        }
    }
    Mercury_Album_Box();
    EnterShopAllSearch();
}

function TB_All(){

    var css = '';

    css += '';
    // css += '.tb-toolkit{opacity: 0 !important;} .tb-toolkit:hover{opacity: 1 !important;}';
    css += '.tb-toolkit{display: none !important;} ';
    css += '';

    addStyle(css);
}

function TaoBao(){
    console.log('taobao item ...');

    Thumbnail_img_src();

    Item_li();

    setTimeout(function () {
        HUABEI_TotalAmount();
        HUABEI_TotalAmount_bind();

        
    }, 3000);

    // 商品 URL
    setTimeout(function () {
        var li = document.createElement("li");
        var itemUrl = "https://item.taobao.com/item.htm?id="; 
        itemUrl += getQueryParams()["id"];
        console.log(itemUrl);
        li.innerHTML = `<text>${itemUrl}</text>`;
        $("#J_Social ul").append(li);
    }, 1000);

    
}

function Tmall(){
    console.log('Tmall item ...');

    Thumbnail_img_src();

    Item_li();


    setTimeout(function () {
        var div_main_pic = $('div.tb-booth:first');
        var btn = document.createElement("button");
        btn.textContent = "原图";
        btn.style = "position: absolute; opacity: 0.5;";
        btn.addEventListener("click", function(){
            var imgBooth = document.getElementById("J_ImgBooth");
            var imgLink = imgBooth.getAttribute("src");
            imgLink = imgLink.replace("_430x430q90.jpg", "");
            window.open(imgLink);
            
        }, false);
        div_main_pic.prepend(btn);
        
    }, 1000);
}

function TaoBaoSearch(){
    console.log('taobao sea ...');
    EnterToInput();


    var css = '';
    css += "div[class^='rightWrap--'],div[class*=' rightWrap--'] {display: none !important;}";
    css += "div[class^='leftWrap--'],div[class*=' leftWrap--'] {width: 1024px !important;}";

    addStyle(css);


}

// 在商品页面，添加‘所有商品’按钮
function EnterShopAllSearch(){

    if (matchURL('item.htm')) {
        var ShopHeader_optionWrap = "div[class^='ShopHeader--optionWrap'],div[class*=' ShopHeader--optionWrap']";
        $(ShopHeader_optionWrap).each(function (index, element) {
            var sHeader = $(this);
            // var $child =  $(this).children("a:last-child").clone(true,true);
            var lastChild =  $(this).children("a:last-child");
            var btnClass = lastChild.attr('class');
            var shopHref = lastChild.attr('href').split('?')[0];
            var btnHref = shopHref + '/search.htm'; 
            var btn = '<a class="' + btnClass + '" _target="_blank" href="' + btnHref + '"><span>所有商品</span></a>';
            sHeader.append(btn);
        });
    }
}

function Thumbnail_img_src(){

    var btn = document.createElement("button");
    btn.textContent = "原图";
    btn.id = "btn_img_src";
    btn.style = "position: absolute; right: 0; opacity: 0.4; z-index: 9999;";
    btn.addEventListener("click", function(){
        var imgLink = '';
        var imgBooth = document.querySelector(".js-image-zoom__zoomed-image:last-child");
        if (imgBooth) {
            // var imgLink = imgBooth.getAttribute("background-image");
            var style = imgBooth.currentStyle || window.getComputedStyle(imgBooth, false),
            imgLink = style.backgroundImage.slice(4, -1).replace(/"/g, "");
            imgLink = imgLink.replace("url(", "");
            imgLink = imgLink.replace(");", "");
        }else{
            var btn_img_src = document.getElementById("btn_img_src");
            imgBooth = btn_img_src.parentElement.querySelector('img');
            //  imgBooth = $('#btn_img_src').parent().child('img').first();
            if (imgBooth) {
                imgLink = imgBooth.getAttribute("src");
            }
        }
        if (imgLink) {
            window.open(imgLink);
        }
        
    }, false);

    setTimeout(function () {
        
        var mainPicWrapSelector = "div[class^='PicGallery--mainPicWrap'],div[class*=' PicGallery--mainPicWrap']";
        $(mainPicWrapSelector).each(function (index, element) {
            var mainPicWrap = $(this);
            mainPicWrap.prepend(btn);
        });
        
    }, 1000);

}

// 商品选项分类，排版
function Item_li(){
    var css = '';
    css += '#detail .tb-key .tb-prop .tb-img li span { display: inline !important; padding-left: 40px;}';
    css += '#detail .tb-key .tb-prop .tb-img li a { background-position-x: left !important; }';
    css += '.J_Prop .J_TSaleProp { overflow: auto; max-height: 300px; }';

    // 商品选项
    css += "div[class^='skuWrapper '],div[class*=' skuWrapper'] {max-height: 300px; overflow-y: auto;}";
    css += "div[class^='valueItem '],div[class*=' valueItem'] {max-width: 100% !important; }";
    css += "span[class^='valueItemText '],span[class*=' valueItemText'] {max-width: 100% !important; }"

    // 保障服务
    css += "div[class^='Service '],div[class*=' Service'] {max-height: 100px; overflow-y: auto;}";


    css += "div[class^='Item2024--mainInnerWrap'],div[class*=' Item2024--mainInnerWrap'] {width: 86% !important;}";
    css += '.skuWrapper {max-height: 300px; overflow-y: auto;}'
    css += "#purchasePanel { width: 60% !important;     position: initial !important;}";
    css += "#purchasePanel div[class^='PurchasePanel--footWrap'],div[class*=' PurchasePanel--footWrap'] {position: initial !important;}";


    addStyle(css);
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
    var style = ''; 
    style += ".mercuryalbum-container{height: 360px !important;} ";
    style += "#popupPanel, #popupPanel iframe { height: 500px !important; }";
    style += ".favorate-overlay, .favorate-overlay iframe { height: 500px !important;}";
    style += "";
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

function getQueryParams(){  // 当前网页查询参数。?id=xxxxx
    var urlSearchParams = new URLSearchParams(window.location.search);
    var params = Object.fromEntries(urlSearchParams.entries());
    return params;
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


