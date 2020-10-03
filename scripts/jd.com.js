// ==UserScript==
// @name  京东购物助手
// @namespace    https://github.com/maijz128
// @version      0.3.0
// @description  购物助手
// @author       MaiJZ
// @match        *://*.jd.com/*
// @grant        none
// ==/UserScript==


(function () {
    main();
})();

function main() {
    if (matchURL("item.jd.com")) {
        setTimeout(function () {
            baitiaoTotalAmount();
            baitiaoTotalAmount_bind();
            storePrompt();
            titleLink();
            setAddress();
        }, 3000);
    }
    else if (matchURL("what.jd.com/album/details")) {
        setTimeout(function () {
            album();
        }, 3000);
    }
    else if (matchURL("re.jd.com")) {
        setTimeout(function () {
            redirect();
        }, 400);
    }
}

// 计算并显示白条分期总额
function baitiaoTotalAmount() {
    $(".baitiao-list .item strong").each(function (index, element) {
        var text = $(this).text();
        text = text.split('=')[0];

        var buy_num = parseInt($('#buy-num').val()) || 1;

        // console.log(text);
        var summary_price = $('.summary-price .p-price .price').text() || 0;
        summary_price = parseFloat(summary_price) * buy_num;

        if (text.indexOf("×") > -1) {

            var formula = text.trim();
            formula = formula.replace("￥", "");
            formula = formula.replace("期", "");

            var formulaItems = formula.split("×");
            var total = parseFloat(formulaItems[0]) * parseFloat(formulaItems[1]);

            var interest = total - parseFloat(summary_price);

            $(this).text(text + "=" + parseInt(total) + "(" + parseInt(interest) + ")");
        }
    });
}
function baitiaoTotalAmount_bind(params) {
    $("#choose-baitiao").bind('DOMNodeInserted', function(e) {
        setTimeout(function () {
            baitiaoTotalAmount();
        }, 200);
    });  
}

// 有货|无货 字体加大
function storePrompt() {
    var style = '.store-prompt strong {font-size: 24px !important;}';
    addStyle(style);
}

// 商品标题链接化
function titleLink() {
    var elTitle = $('.sku-name:first');
    if (elTitle) {
        var titleName = elTitle.text().trim();
        var url = window.location.href;
        elTitle.html('<a href="' + url + '">' + titleName + '</a>');
    }
}

// 设置配送地址为默认地址 ----无效
function setAddress(){
    var address =$('#stock-address .address-used li:nth-child(1)');
    if (address) {
        address.click();
    }
}

// 专辑计算总额
function album() {
    var total = 0;
    var title = $('.c-title:first').text();
    function _showTotal() {
        $('.c-title:first').text(title + ' ¥' + total);
    }
    $('.price .num').each(function (index, element) {
        var num = parseInt($(this).text());
        if (Number.isInteger(num)) {
            total += num;
        }
        _showTotal();
    });
}

// 分享页自动跳转到商品页面
function redirect(){
    var a = document.querySelector('body  div.shop_intro  div.shop_intro_a  div.gobuy  a');
    if (a && a.getAttribute('href')) {
        window.location.href = a.getAttribute('href');
    }
}

function matchURL(url) {
    const URL = window.location.href;
    return URL.indexOf(url) > -1;
}

function addStyle(styleContent) {
    var elStyle = document.createElement("style");
    elStyle.innerHTML = styleContent;
    document.head.appendChild(elStyle);
}