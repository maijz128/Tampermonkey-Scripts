// ==UserScript==
// @name         MJZ - 知乎
// @namespace    https://github.com/maijz128
// @version      26.04.19
// @description  描述
// @author       MaiJZ
// @match        *://*.zhihu.com/*
// @grant        none
// ==/UserScript==
//// @require      http://code.jquery.com/jquery-1.12.4.min.js


(function () {
    setTimeout(function(){
        main();
    }, 500);
})();

function main() {
    if (matchURL("/question/") && matchURL("/answer/")) {
        // CollectAnswer();
    }

    if (matchURL("/question/")) {
        CenterAnswer();
    }

    if (window.location.pathname == "/") {
        HomePage();
    }
}

function HomePage() {
    var css = "";
    css += " ";
    css += " ";
    addStyle(css);

    // .Topstory-mainColumn 后移
    {
        const targetElement = document.querySelector('.Topstory-mainColumn');

        // 检查元素是否存在，避免报错
        if (targetElement) {
            // 获取父元素
            const parentElement = targetElement.parentElement;
            
            // 将元素移动到父容器最后
            parentElement.appendChild(targetElement);
            
            console.log('元素已移动到父容器最后位置');
        } else {
            console.log('未找到类名为 Topstory-mainColumn 的元素');
        }
    }
}

// 回答居中
function CenterAnswer() {
    var css = "";
    css += ".Question-main .ListShortcut {margin: auto !important;} ";
    css += ".Question-mainColumn {margin: 0 auto; width: 800px !important;} ";
    css += ".Question-sideColumn {display: none !important;} ";
    addStyle(css);
}


// 收藏
function CollectAnswer() {
    var style = '';
    style += '.QuestionHeader-main {margin: 0 auto;}';
    style += '.Question-mainColumn {margin: 0 auto; width: 800px;} ';
    style += '.Question-sideColumn, .QuestionHeader-side, .QuestionHeader-tags, .QuestionHeader-footer, .QuestionHeader-detail, ';
    style += '.Card, header, .CornerButton[data-tooltip="建议反馈"] {display: none;}';
    style += '.AnswerCard { display: block;}';
    style += '.Sticky { position: inherit !important;}';
    addStyle(style);


    setTimeout(function () {

        var SELECTOR = ' .QuestionHeader .QuestionHeader-content  .QuestionHeader-main  h1';
        var QuestionHeader_title = document.querySelector(SELECTOR);

        var elA = document.createElement("a");
        elA.setAttribute("href", window.location.href);

        var parentElement = QuestionHeader_title.parentElement;
        parentElement.appendChild(elA);
        elA.appendChild(QuestionHeader_title);
        
    }, 1000);

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