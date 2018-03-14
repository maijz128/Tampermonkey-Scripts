// ==UserScript==
// @name         BT之家小助手
// @namespace    https://github.com/maijz128
// @version      0.3
// @description  替换下载地址为真实地址，可以自动滚动至最新BT处，可以自动隐藏介绍，可以隐藏置顶帖子 。
// @author       MaiJZ
// @match        *://www.btbtt.co/*.htm
// @match        *://www.btbtt.me/*.htm
// @match        *://www.btbtt.net/*.htm
// @match        *://www.btbtt.pw/*.htm
// @grant        none
// ==/UserScript==

const strContainerID = "btbtt-helper";

(function () {
    'use strict';

    // BT下载页面
    if (matchURL("attach-dialog")) {
        autoClickDownload();
    }
    // 帖子页面
    else if (matchURL("thread-index-fid")) {

        ThreadPage();

    }
    // 帖子浏览页面
    else if (matchURL("forum-index-fid")) {
        ToggleTopThread();
    }

})();


// BT下载页面 ////////////////////////////////////////////////////////////

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

// 帖子页面 ////////////////////////////////////////////////////////////////

function ThreadPage() {
    addContainer();
    hideIntroduction();
    scrollToBT();
    replaceLink();

    // 添加容器
    function addContainer() {
        var strContainer = '<div id="' + strContainerID + '" style="font-size: medium;"></div> ';
        $('.post_td:first').prepend(strContainer);

        var style = "#" + strContainerID + " span {";
        style += "margin-right: 10px;";
        style += "}";
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

    // 滚动至最新的bt
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

    // 替换下载链接：下载网页->直接地址
    function replaceLink() {
        // 替换前：attach-dialog-fid-950-aid-4323928.htm
        // 替换后：attach-download-fid-950-aid-4323928.htm


        const QUERY = "#body table td.post_td div.post div.attachlist";
        var el_attachlist_list = document.querySelectorAll(QUERY);
        console.assert(el_attachlist_list.length > 0, "没找到BT列表");

        el_attachlist_list.forEach(function (el_attachlist) {

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
        });
    }

}



// 帖子浏览页面：隐藏置顶帖子 ////////////////////////////////////////////////////////

function ToggleTopThread() {
    const TITLE_SELECTOR = "#body div.header td.subject";

    addToggleTopThreadButton();
    addToggleTopThreadContainerFunction();
    addCheckbox();


    function addToggleTopThreadButton() {
        var header_td = document.querySelector(TITLE_SELECTOR);
        if (header_td) {
            var strButton = '<button onclick="toggleTopThreadContainer()" ' +
                'style="font-size: x-small; font-weight:bold;">显示/隐藏 置顶帖子</button>';

            $(header_td).append(strButton);
        }
    }

    function addToggleTopThreadContainerFunction() {
        var toggleTopThreadFun = '<script> function toggleTopThreadContainer() {';
        toggleTopThreadFun += '    $("#threadlist > .bg2").prevAll().toggle();';
        toggleTopThreadFun += '} </script>';
        $('head:first').prepend(toggleTopThreadFun);
    }

    // 添加选项按钮：是否自动隐藏置顶帖子
    function addCheckbox() {
        var fun_toggleAutoHideTopThread = '<script>function toggleAutoHideTopThread(){';
        fun_toggleAutoHideTopThread += 'localStorage.isHideTopThread = $("#cb-HideTopThread").attr("checked");';
        fun_toggleAutoHideTopThread += '}</script>';
        $('head:first').append(fun_toggleAutoHideTopThread);

        var strCheckbox_HideTopThread = '<span style="margin-left: 5px; font-weight:bold;">';
        strCheckbox_HideTopThread += '<input type="checkbox" id="cb-HideTopThread"';
        strCheckbox_HideTopThread += ' onchange="toggleAutoHideTopThread()">';
        strCheckbox_HideTopThread += '自动隐藏置顶帖子<span>';

        $(TITLE_SELECTOR).append(strCheckbox_HideTopThread);

    }


    var isHideTopThread = localStorage.isHideTopThread || "false";
    if (isHideTopThread === "true") {
        // 隐藏置顶帖子
        $("#threadlist > .bg2").prevAll().hide();

        $("#cb-HideTopThread").attr("checked", true);
    }
}


// Util //////////////////////////////////////////////////////

function matchURL(url) {
    const URL = window.location.href;
    return URL.indexOf(url) > -1;
}

function addStyle(styleContent) {
    var elStyle = document.createElement("style");
    elStyle.innerHTML = styleContent;
    document.head.appendChild(elStyle);
}