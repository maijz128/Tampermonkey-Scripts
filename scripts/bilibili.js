// ==UserScript==
// @name  bilibili私人助手
// @namespace    https://github.com/maijz128
// @version      0.1.0
// @description  描述
// @author       MaiJZ
// @match        *://*.bilibili.com/*
// @grant        none
// ==/UserScript==


(function () {
    main();
})();

function main() {

    if (matchURL("/watchlater/")) {
        watchlater();
    }
}

// 稍后再看
function watchlater() {

    setTimeout(function () {

        // 功能：鼠标悬停显示完整章节名字
        $('.bilibili-player-watchlater-plist-chapter').each(function (index, element) {
            var chapterName = $(this).text();
            $(this).attr('title', chapterName);
        });

        // 功能：显示播放标题
        function showChapterName() {
            var elChapter = $('.bilibili-player-watchlater-part-item[data-state-play=true] .bilibili-player-watchlater-plist-chapter:first');
            var chapterName = elChapter.text();

            if ($('#chapter-name').length === 0) {
                var elTitle = $('.video-info-module  h1:first');
                elTitle.after('<h1 id="chapter-name">' + chapterName + '</h1>');
            } else {
                $('#chapter-name').text(chapterName);
            }
        }

        showChapterName();
        var prevHref = window.location.href;
        setInterval(function () {
            if (window.location.href !== prevHref) {
                showChapterName();
                prevHref = window.location.href;
            }
        }, 5000);


    }, 2000);
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