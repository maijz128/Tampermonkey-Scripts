// ==UserScript==
// @name         52doll 图片增强 + 透明层悬停显示 + 自动回复前缀（修改一条回复内容）
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  替换 zoomfile 原图，帖子居中，已访问紫色，随机回复带前缀，悬浮替换缩略图，透明层悬停显示，兼容 forum、home、space 页面
// @author       You
// @match        https://bbs.52doll.com/thread-*-*-*.html
// @match        https://bbs.52doll.com/forum.php?mod=viewthread*
// @match        https://bbs.52doll.com/forum-*-*.html
// @match        https://bbs.52doll.com/home.php*
// @match        https://bbs.52doll.com/space-uid-*.html
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // ---------- 1. 注入CSS样式 ----------
    const style = document.createElement('style');
    style.textContent = `
        #postlist .plhin .t_fsz {
            text-align: center !important;
        }
        #threadlist a:visited,
        div.card-info > p.card-info-title > a:visited {
            color: #8844aa !important;
        }
        #translate,
        #layui-layer5 {
            opacity: 0 !important;
            transition: opacity 0.3s ease;
        }
        #translate:hover,
        #layui-layer5:hover {
            opacity: 1 !important;
        }
    `;
    document.head.appendChild(style);

    // ---------- 2. 图片替换函数（zoomfile） ----------
    function replaceImages() {
        const imgs = document.querySelectorAll('img[zoomfile]');
        imgs.forEach(img => {
            const zoomSrc = img.getAttribute('zoomfile');
            if (zoomSrc && img.src !== zoomSrc) {
                img.src = zoomSrc;
                img.removeAttribute('data-original');
                img.removeAttribute('lazy-src');
            }
        });
    }

    // ---------- 3. 随机回复填充（带“自动回复：”前缀） ----------
    const replyMessages = [
        '感谢分享，辛苦了！',
        '不错，支持一下！',
        '学习了，谢谢楼主！',
        '好资源，收藏了！',
        '顶一个，感谢分享！',
        'Mark一下，以后再看。',
        '很有帮助，谢谢！',
        '楼主威武，赞！',
        '这个太棒了！',
        '感谢楼主分享！',
        '内容很实用。',          // <--- 修改此处（原为“内容很实用，收了。”）
        '楼主好人，一生平安！'
    ];

    function fillRandomReply() {
        const textarea = document.querySelector('textarea#fastpostmessage');
        if (textarea && textarea.value.trim() === '') {
            const randomIndex = Math.floor(Math.random() * replyMessages.length);
            textarea.value = '自动回复：' + replyMessages[randomIndex];
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            textarea.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    // ---------- 4. 判断是否为帖子详情页 ----------
    function isThreadPage() {
        const path = window.location.pathname;
        if (/\/thread-\d+-\d+-\d+\.html/.test(path)) {
            return true;
        }
        if (path === '/forum.php') {
            const params = new URLSearchParams(window.location.search);
            if (params.get('mod') === 'viewthread' && params.has('tid')) {
                return true;
            }
        }
        return false;
    }

    // ---------- 5. 鼠标悬浮替换缩略图 ----------
    function upgradeImageOnHover(e) {
        const img = e.target;
        if (img.tagName !== 'IMG') return;
        const src = img.src;
        const match = src.match(/\.(\d+)x(\d+)\.jpg\.webp$/i);
        if (match) {
            const w = parseInt(match[1], 10);
            const h = parseInt(match[2], 10);
            if (w < 512 && h < 512) {
                let newSrc = src.replace(/\.\d+x\d+\.jpg\.webp$/i, '.webp');
                if (newSrc !== src) {
                    img.src = newSrc;
                }
            }
        }
    }
    document.addEventListener('mouseover', upgradeImageOnHover);

    // ---------- 6. 统一执行 ----------
    function executeAll() {
        if (isThreadPage()) {
            replaceImages();
            fillRandomReply();
        }
    }

    executeAll();

    const observer = new MutationObserver(() => {
        if (isThreadPage()) {
            replaceImages();
            fillRandomReply();
        }
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    window.addEventListener('load', function() {
        if (isThreadPage()) {
            replaceImages();
            fillRandomReply();
        }
    });

})();