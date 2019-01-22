// ==UserScript==
// @name         AcFun小助手
// @namespace    https://github.com/maijz128
// @version      1.1.0
// @description  文章区：评论区域居中、文章内容始终显示、高亮楼主名字；视频：在简介栏中可以显示封面；
// @author       MaiJZ
// @match        *://*.acfun.cn/*
// @grant        none
// ==/UserScript==


(function () {
    main();
})();


function main() {
    if (matchURL("/a/ac")) {
        Article();
    } else if (matchURL("/v/ac")) {
        VideoPage();
    } else if (isHomePage()) {
        HomePage();
    }
}


// 首页

function isHomePage() {
    var href = window.location.href;
    return href === 'http://www.acfun.cn/' || href === 'https://www.acfun.cn/';
}

function HomePage() {

}

// 视频
function VideoPage() {

    var coverURL = getVideoCoverURL();
    addCoverLink(coverURL);
    console.log(coverURL);


    function addCoverLink(url) {
        var style = '.video-cover:hover img { display: block !important; }';
        style += '.video-cover img { position: absolute; z-index: 99;  }';
        addStyle(style);

        var elTitle = document.querySelector("#main div.introduction section div.title");
        if (elTitle) {
            var strHtml = '<span style="margin-right: 20px;">简介</span>';
            strHtml += '<span class="video-cover"> <a href="' + url + '" target="_blank">封面</a>';
            strHtml += '<img src="' + url + '"  style="display: none;">';
            strHtml += '</span>';

            elTitle.innerHTML = strHtml;
        }
    }


    function getVideoCoverURL() {
        var result = null;
        // var player = document.getElementById("ACFlashPlayer");
        var pageInfo = document.querySelector('#main #pageInfo');
        if (pageInfo) {
            var value = pageInfo.getAttribute('data-pic');
            result = value;
        }
        return result;
    }

}

// 文章
function Article() {
    this.upId = null;
    this.upName = null;
    this.time = null;

    this._init = function () {
        var elArticleUp = document.getElementById('article-up');
        var elUpName = elArticleUp.querySelector('.up-name  a');
        this.upName = elUpName.innerHTML;

        var href = elUpName.getAttribute('href');
        this.upId = href.replace('/u/', '').replace('.aspx', '');

        var elTime = elArticleUp.querySelector('.up-time');
        this.time = elTime.innerHTML;


        //var style = '.display-block{display: block !important;}';
        // style += '.comment-content{width: 850px !important; margin: 0 auto !important;}';
        // addStyle(style);

    };

    // 高亮楼主名字
    this.highlightUp = function () {
        var COLOR = "#008000";
        var style = 'a[data-uid="' + this.upId + '"]{';
        style += 'color: ' + COLOR + ' !important;';
        style += 'font-weight: bold !important;}';

        // 楼主标志
        style += 'a[data-uid="' + this.upId + '"]:before {';
        // 样式1
        // style += 'content: "UP: "; color: #c66;';
        // 样式2
        style += 'content: "UP主"; padding: 1px 2px; margin-right: 4px; font-size: 12px; background-color: #4a8eff; border-radius: 2px; color: #fff;';
        style += '}';

        addStyle(style);
    };

    // 在查看下一页评论时，文章内容也一直显示
    this.alwaysShowContent = function () {
        $('#article-content').addClass('display-block');
    };

    // 让评论区域居中显示
    this.centerComments = function () {
        var style = '.columen-left { width: 850px !important; padding-top: 20px;';
        style += 'float: none !important; margin: 0 auto !important; }';
        addStyle(style);
    };

    // 评论区域元素上移
    this.moveUpComments = function () {
        var contentArea = $('.content:first');
        var elCommentArea = $('.comment-area:first');
        contentArea.append(elCommentArea);
    };

    // 文章内容
    this.articleContent = function(){
        var style = '#article-content>.article-content { min-height: 400px; }';
        addStyle(style);
    };

    this._init();
    this.highlightUp();
    //this.alwaysShowContent();
    this.centerComments();
    this.moveUpComments();
    this.articleContent();
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