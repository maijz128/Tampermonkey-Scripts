// ==UserScript==
// @name         BT之家下载助手
// @namespace    https://github.com/maijz128
// @version      0.2.2
// @description  替换下载地址为真实地址，页面自动滚动至最新BT处，BT页面自动点击下载；默认隐藏介绍。
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

// start 隐藏介绍
function hideIntroduction() {

    // 添加toggle按钮
    {

        var strFun1 = '<script>function toggleIntroduction(){';
        strFun1 += 'const el = document.querySelector(".post_td .post");';
        strFun1 += 'if(el.style.display=="block") {el.style.display="none";}';
        strFun1 += 'else {el.style.display="block";}';
        strFun1 += '}</script>';

        $('head:first').prepend(strFun1);

        var strButton = '<button onclick="toggleIntroduction()" ' +
            'style="width:100%;height:30px;">toggle</button>';

        $('.post_td:first').prepend(strButton);
    }

    // 隐藏介绍
    $('.post_td:first .post').hide();
}
// end

// start 滚动至最新的bt
function scrollToBT() {
    $('html, body').animate({
        scrollTop: $(".post td a:last").offset().top - 100
    }, 1000);
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

    /*
    function addOpenButton(el_attachlist) {
        const Q = " table > tbody > tr:nth-child(1) > td.bold";
        const elTD = el_attachlist.querySelector(Q);

        const elBtn = document.createElement("button");
        elBtn.innerText = "下载所有BT";
        // elBtn.style.marginLeft = "50px";
        elBtn.style.float = "right";
        elBtn.style.right = "0px";
        elBtn.style.opacity = "0.8";

        elTD.appendChild(elBtn);

        return elBtn;
    }

    function OpenHandle(el_attachlist) {
        const self = this;
        self.el_attachlist = el_attachlist;
    }
    // OpenHandle.prototype.open = function () {
    //     const self = this;
    //     const hrefList = self.getAttachHrefList(self.el_attachlist);
    //     if (hrefList.length > 0) {
    //         console.log(hrefList);
    //         for (var i = 0; i <hrefList.length; i++) {
    //             // window.location.href = href;
    //             const href = hrefList[i];
    //
    //             setTimeout(function () {
    //                 window.open(href);
    //
    //             }, 1000);
    //         }
    //
    //     }
    //     console.assert(hrefList.length > 0, "没找到BT链接");
    // };
    OpenHandle.prototype.open = function () {
        const self = this;
        var elA_list = self.el_attachlist.querySelectorAll("a");
        if (elA_list) {
            for (var i = 0; i < elA_list.length; i++) {
                //const href = elA_list[i].getAttribute("href");
                elA_list[i].click();
            }
        }
    };
    OpenHandle.prototype.getAttachHrefList = function (el_attachlist) {
        const result = [];
        var elA_list = el_attachlist.querySelectorAll("a");
        if (elA_list) {
            for (var i = 0; i < elA_list.length; i++) {
                const href = elA_list[i].getAttribute("href");
                result.push(href);
            }
        }
        return result;
    };

    */
    ////////////////////////////////////////////////////////////////////////

