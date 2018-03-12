// ==UserScript==
// @name         BT之家下载助手
// @namespace    https://github.com/maijz128
// @version      0.2.3
// @description  替换下载地址为真实地址，页面可以自动滚动至最新BT处，BT页面自动点击下载；可以隐藏介绍。
// @author       MaiJZ
// @match        *://www.btbtt.co/attach-dialog-*.htm
// @match        *://www.btbtt.me/attach-dialog-*.htm
// @match        *://www.btbtt.net/attach-dialog-*.htm
// @match        *://www.btbtt.pw/attach-dialog-*.htm
// @match        *://www.btbtt.co/thread-index-fid-*.htm
// @match        *://www.btbtt.me/thread-index-fid-*.htm
// @match        *://www.btbtt.net/thread-index-fid-*.htm
// @match        *://www.btbtt.pw/thread-index-fid-*.htm
// @grant        none
// ==/UserScript==

const strContainerID = "btbtt-helper";

(function () {
    'use strict';

    const url = location.href;
    // bt下载页面
    if (url.indexOf("attach-dialog") > -1) {
        autoClickDownload();
    }
    // 帖子页面
    else if (url.indexOf("thread-index-fid") > -1) {
        setTimeout(function () {
            BT_Open_Handle();
        }, 1000);

        addContainer();

        hideIntroduction();

        scrollToBT();
    }

})();


// 自动下载 ////////////////////////////////////////////////////////////

function autoClickDownload() {
    const AUTO_CLOSE_TIME = 800;

    var inter = setInterval(function () {
        var elA = document.querySelector("#body > div > dl dd a");
        if (elA) {
            console.log(elA);
            clearInterval(inter);

            window.location.href = elA.getAttribute("href");

            setTimeout(function () {
                window.close();
            }, AUTO_CLOSE_TIME);
        }
    }, 50);
}
/////////////////////////////////////////////////////////////////////

// 添加容器
function addContainer() {
    var strContainer = '<div id="' + strContainerID + '" style="font-size: medium;"></div> ';
    $('.post_td:first').prepend(strContainer);

    var style = "#" + strContainerID + " span {";
    style += "margin-right: 10px;"
    style += "}"
    addStyle(style);
}

// start 隐藏介绍
function hideIntroduction() {
    var elContainer = $('#' + strContainerID);

    // 添加toggle按钮
    {
        var fun_toggleIntroduction = '<script>function toggleIntroduction(){';
        fun_toggleIntroduction += '$(".post_td .post:first").toggle();';
        fun_toggleIntroduction += '}</script>';

        $('head:first').append(fun_toggleIntroduction);

        var strButton = '<button onclick="toggleIntroduction()" ' +
            'style="width:100%;height:30px;">隐藏/显示介绍</button>';

        elContainer.prepend(strButton);
    }

    // 添加选项按钮：是否自动隐藏介绍
    {
        var fun_toggleAutoHideIntroduction = '<script>function toggleAutoHideIntroduction(){';
        fun_toggleAutoHideIntroduction += 'localStorage.isHideIntroduction = $("#cb-HideIntroduction").attr("checked");';
        fun_toggleAutoHideIntroduction += '}</script>';
        $('head:first').append(fun_toggleAutoHideIntroduction);

        var strCheckbox_HideIntroduction = '<span><input type="checkbox" id="cb-HideIntroduction"';
        strCheckbox_HideIntroduction += ' onchange="toggleAutoHideIntroduction()">';
        strCheckbox_HideIntroduction += '自动隐藏介绍<span>';
        elContainer.append(strCheckbox_HideIntroduction);

    }



    var isHideIntroduction = localStorage.isHideIntroduction || "false";
    if (isHideIntroduction === "true") {
        // 隐藏介绍
        $('.post_td:first .post').hide();

        $("#cb-HideIntroduction").attr("checked", true);
    }

}
// end

// start 滚动至最新的bt
function scrollToBT() {
    var elContainer = $('#' + strContainerID);

    // 添加选项按钮：是否自动滚动
    {
        var fun_toggleAutoScrollToBT = '<script>function toggleAutoScrollToBT(){';
        fun_toggleAutoScrollToBT += 'localStorage.isScrollToBT = $("#cb-ScrollToBT").attr("checked");';
        fun_toggleAutoScrollToBT += '}</script>';
        $('head:first').append(fun_toggleAutoScrollToBT);

        var strCheckbox_HideIntroduction = '<span><input type="checkbox" id="cb-ScrollToBT"';
        strCheckbox_HideIntroduction += ' onchange="toggleAutoScrollToBT()">';
        strCheckbox_HideIntroduction += '自动滚动至最新发布的BT<span>';
        elContainer.append(strCheckbox_HideIntroduction);

    }

    var isScrollToBT = localStorage.isScrollToBT || "false";
    if (isScrollToBT === "true") {
        $("#cb-ScrollToBT").attr("checked", true);

        $('html, body').animate({
            scrollTop: $(".post td a:last").offset().top - 100
        }, 1000);
    }

}
// end


// 一键打开所有BT下载窗口 /////////////////////////////////////////////////////


function BT_Open_Handle() {
    const QUERY = "#body table td.post_td div.post div.attachlist";
    var el_attachlist_list = document.querySelectorAll(QUERY);
    console.assert(el_attachlist_list.length > 0, "没找到BT列表");

    el_attachlist_list.forEach(function (el_attachlist) {
        // const handle = new OpenHandle(el_attachlist);
        //
        // const elBtn = addOpenButton(el_attachlist);
        // elBtn.addEventListener("click", function () {
        //     handle.open();
        // });

        // 替换下载链接：下载网页->直接地址
        {

            var elA_list = el_attachlist.querySelectorAll("a");
            if (elA_list) {
                for (var i = 0; i < elA_list.length; i++) {
                    const itemA = elA_list[i];
                    const href = itemA.getAttribute("href");

                    const str1 = "attach-dialog-fid";
                    const str2 = "attach-download-fid";

                    const newHref = href.replace(str1, str2);
                    itemA.setAttribute("href", newHref);
                }
            }
        }
    });
}

function addStyle(styleContent) {
    var elStyle = document.createElement("style");
    elStyle.innerHTML = styleContent;
    document.head.appendChild(elStyle);
}