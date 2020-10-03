// ==UserScript==
// @name  阮一峰博客 - MaiJZ
// @namespace    https://github.com/maijz128
// @version      0.1.0
// @description  去广告
// @author       MaiJZ
// @match        *://www.ruanyifeng.com/blog/*
// @grant        none
// ==/UserScript==


(function () {
    main();
})();

function main() {
    removeFirstElement("#sup-post-2");
    removeFirstElement("#gd1-inner");
    removeFirstElement("#gd1");
}

function matchURL(url) {
    const URL = window.location.href;
    return URL.indexOf(url) > -1;
}

function removeFirstElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.parentNode.removeChild(element);
    }
}

function removeAllElement(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
        element.parentNode.removeChild(element);
    });
}

