// ==UserScript==
// @name         MaiJZ - Metadata
// @namespace    https://github.com/maijz128
// @version      0.1.0
// @description  提取网页的元数据
// @author       MaiJZ
// @match        *://*/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.3/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jszip/3.10.1/jszip.min.js
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @grant        GM_info
// @grant        GM.info
// @grant        GM_cookie
// @grant        GM.cookie
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        window.onurlchange
// @grant        unsafeWindow
// @grant        window.close
// @grant        window.focus
// ==/UserScript==

const SCRIPT_NAME = '网页元数据';
var lp = location.pathname;

(function () {
    setTimeout(function(){
        main();
    },10);
})();

function main() {
    ScriptMenu();
}


function ScriptMenu(){
    var menuAll = [
        ['menu_disable', '✅ 已启用 (点击对当前网站禁用)', '❌ 已禁用 (点击对当前网站启用)', []],
        // ['menu_thread', '帖子内自动翻页 (社区类网站)', '帖子内自动翻页 (社区类网站)', true],
        // ['menu_page_number', '显示当前页码及点击暂停翻页', '显示当前页码及点击暂停翻页', true],
        // ['menu_pause_page', '左键双击网页空白处暂停翻页', '左键双击网页空白处暂停翻页', false],
        // ['menu_history', '添加历史记录+修改地址/标题', '添加历史记录+修改地址/标题', true],
        // ['menu_rules', '更新外置翻页规则 (每天自动)', '更新外置翻页规则 (每天自动)', {}],
        ['menu_customRules', '自定义翻页规则', '自定义翻页规则', {}]
    ], menuId = [], webType = 0;
    for (let i=0;i<menuAll.length;i++){ // 如果读取到的值为 null 就写入默认值
        if (GM_getValue(menuAll[i][0]) == null){
            GM_setValue(menuAll[i][0], menuAll[i][3]);
        }
    }
    registerMenuCommand();

    // 注册脚本菜单
    function registerMenuCommand() {
        if (menuId.length != []){
            for (let i=0;i<menuId.length;i++){
                GM_unregisterMenuCommand(menuId[i]);
            }
        }
        for (let i=0;i<menuAll.length;i++) { // 循环注册脚本菜单
            menuAll[i][3] = GM_getValue(menuAll[i][0]);

            if (menuAll[i][0] === 'menu_disable') { // 启用/禁用

                if (menu_disable('check')) { // 当前网站在禁用列表中
                    menuId[i] = GM_registerMenuCommand(`${menuAll[i][2]}`, function(){menu_disable('del')});
                    break;
                } else { // 不在禁用列表中
                    webType = doesItSupport(); // 判断网站类型（即是否支持），顺便直接赋值
                    if (webType === 0) {
                        menuId[0] = GM_registerMenuCommand('❌ 当前网页暂不支持 [点击申请]', function () {
                            window.GM_openInTab('https://github.com/maijz128', {active: true,insert: true,setParent: true});
                        });
                        menuId[1] = GM_registerMenuCommand('🔄 更新外置翻页规则 (每天自动)', function(){getRulesUrl(true)});
                        menuId[2] = GM_registerMenuCommand('#️⃣ 自定义翻页规则', function(){customRules()});
                        console.info(SCRIPT_NAME + ' - 暂不支持当前网页 [ ' + location.href + ' ]，申请支持: ');
                        break;
                    } else if (webType === -1) {
                        break;
                    }
                    menuId[i] = GM_registerMenuCommand(`${menuAll[i][1]}`, function(){menu_disable('add')});
                }

            } else if (menuAll[i][0] === 'menu_rules') {
                // menuId[i] = GM_registerMenuCommand(`🔄 ${menuAll[i][1]}`, function(){getRulesUrl(true)});

            } else if (menuAll[i][0] === 'menu_customRules') {
                // menuId[i] = GM_registerMenuCommand(`#️⃣ ${menuAll[i][1]}`, function(){customRules()});

            } else {
                menuId[i] = GM_registerMenuCommand(`${menuAll[i][3]?'✅':'❌'} ${menuAll[i][1]}`, function(){menu_switch(menuAll[i][3], menuAll[i][0], menuAll[i][2])});
            }
        }
        menuId[menuId.length] = GM_registerMenuCommand('💾 下载元数据', function () {
            console.info(SCRIPT_NAME + ' - 💾 下载元数据 [ ' + location.href + ' ]');
            DownloadMetadata();
        });
        menuId[menuId.length] = GM_registerMenuCommand('💬 反馈失效 / 申请支持', function () {window.GM_openInTab('https://github.com/XIU2/UserScript#xiu2userscript', {active: true,insert: true,setParent: true});window.GM_openInTab('https://greasyfork.org/zh-CN/scripts/419215/feedback', {active: true,insert: true,setParent: true});});
    }

    // 启用/禁用 (当前网站)
    function menu_disable(type) {
        switch(type) {
            case 'check':
                return check(); break;
            case 'add':
                add(); break;
            case 'del':
                del(); break;
        }

        function check() { // 存在返回真，不存在返回假
            if (GM_getValue('menu_disable').indexOf(location.hostname) == -1) return false; // 不存在返回假
            return true;
        }

        function add() {
            if (check()) return;
            let list = GM_getValue('menu_disable'); // 读取网站列表
            list.push(location.hostname); // 追加网站域名
            GM_setValue('menu_disable', list); // 写入配置
            location.reload(); // 刷新网页
        }

        function del() {
            if (!check()) return;
            let list = GM_getValue('menu_disable'), // 读取网站列表
            index = list.indexOf(location.hostname);
            list.splice(index, 1); // 删除网站域名
            GM_setValue('menu_disable', list); // 写入配置
            location.reload(); // 刷新网页
        }
    }

    // 判断是支持
    function doesItSupport() {
        var curSite, urlC;
        var DBSite = {
            github : {
                host : "github.com",
                url: ()=> {
                    urlC = true;
                    if (indexOF(/\/(mods|users)\/\d+/)) 
                    {
                        if (indexOF('tab=posts','s'))
                        {
                            curSite = DBSite.github_repository;
                        } 
                        else if (indexOF('tab=repositories','s'))
                        {
                            curSite = DBSite.github;
                        }
                    } 
                    else if (lp !== '/' && getCSS('.js-repo-nav #code-tab.selected')) 
                    {
                        curSite = DBSite.github_repository;
                    }
                },
            },
            github_repository : {
            }
        };

        // 遍历判断是否是某个已支持的网站，顺便直接赋值
        let support = false;

        end:
        for (let now in DBSite) { // 遍历 对象
            if (!DBSite[now].host) continue; // 如果不存在则继续下一个循环
            // 如果是 数组

            if (Array.isArray(DBSite[now].host)) {

                for (let i of DBSite[now].host) { // 遍历 数组

                    // 针对自定义翻页规则中的正则
                    if (typeof i === 'string' && i.slice(0,1) === '/') i = new RegExp(i.slice(1,i.length-1))
                    if ((i instanceof RegExp && i.test(location.hostname)) || (typeof i === 'string' && i === location.hostname)) {

                        if (self != top) {if (!DBSite[now].iframe) continue end;} // 如果当前位于 iframe 框架下，就需要判断是否需要继续执行
                        if (DBSite[now].url) {
                            if (typeof DBSite[now].url == 'function') {
                                DBSite[now].url();
                            } else { // 自定义翻页规则时，因为同域名不同页面 url 分开写，所以如果没找到就需要跳出当前数组循环，继续规则循环
                                try {
                                    if (DBSite[now].url.slice(0,1) === '/') { // 如果是正则，则对 URL 路径进行匹配
                                        if (new RegExp(DBSite[now].url.slice(1,DBSite[now].url.length-1), 'i').test(location.pathname + location.search) === true) {curSite = DBSite[now];} else {if (urlC === true) {support = true;}; break;}
                                    } else { // 如果是函数，那就执行代码
                                        if (new Function('fun', DBSite[now].url)(window.autoPage)) {curSite = DBSite[now];} else {if (urlC === true) {support = true;}; break;}
                                    }
                                } catch (e) {
                                    console.error(SCRIPT_NAME + ' - 当前网页规则 "url" 有误，请检查！', e, DBSite[now].url);
                                }
                            }
                        } else {
                            curSite = DBSite[now];
                        }
                        support = true; break end; // 如果找到了就退出所有循环
                    }
                }

                // 如果是 正则/字符串
            } else {
                // 针对自定义翻页规则中的正则
                if (typeof DBSite[now].host === 'string' && DBSite[now].host.slice(0,1) === '/') DBSite[now].host = new RegExp(DBSite[now].host.slice(1,DBSite[now].host.length-1))
                if ((DBSite[now].host instanceof RegExp && DBSite[now].host.test(location.hostname)) || (typeof DBSite[now].host === 'string' && DBSite[now].host === location.hostname)) {

                    if (self != top) {if (!DBSite[now].iframe) continue;} // 如果当前位于 iframe 框架下，就需要判断是否需要继续执行
                    if (DBSite[now].url) {
                        if (typeof DBSite[now].url == 'function') {
                            DBSite[now].url();
                        } else { // 自定义翻页规则时，因为同域名不同页面 url 分开写，所以如果没找到就需要继续规则循环
                            try {
                                if (DBSite[now].url.slice(0,1) === '/') { // 如果是正则，则对 URL 路径进行匹配
                                    if (new RegExp(DBSite[now].url.slice(1,DBSite[now].url.length-1), 'i')
                                    .test(location.pathname + location.search) === true) 
                                    {curSite = DBSite[now];} 
                                    else {if (urlC === true) {support = true;}; continue;}
                                } else { // 如果是函数，那就执行代码

                                    if (new Function('fun', DBSite[now].url)(window.autoPage)) 
                                    {curSite = DBSite[now];} else {if (urlC === true) {support = true;}; continue;}

                                }
                            } catch (e) {
                                console.error(SCRIPT_NAME + ' - 当前网页规则 "url" 有误，请检查！', e, DBSite[now].url);
                            }
                        }
                    } else {
                        curSite = DBSite[now];
                    }
                    support = true; break; // 如果找到了就退出循环
                }
            }
        }

        if (support) {
            console.info(SCRIPT_NAME + ' - 支持此网站'); return 1;
        } else if (self != top) {
            return -1;
        }
        return 0;
    }

}

function DownloadMetadata(){
    if(Mjztool.matchURL("civitai.com")){
        Download_civitai();
    }
}

function Download_civitai(){

    var metadata = {
        title: "",
        url: "",
        title: "",
        title: "",
    };
    //* 1.获取标题文本
    var title = $('h1.mantine-Title-root').text();
    metadata.title = title;
    //* 2.获取网页链接
    var url = location.href;
    metadata.url = url;

    //^ 通过api获取模型相关数据
    // 例子：https://civitai.com/api/v1/models/8281
    let requestUrl = 'https://civitai.com/api/v1/models/' + url.match(/\d+/);
    console.log('请求链接: ' + requestUrl);
    fetch(requestUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            civitai_saveData(data);
    });

    zipContents("test", [{path: "12.txt", content: "fafas"}]);
    var zip = new JSZip();
    zip.file("Hello.txt", "Hello World\n");
    var img = zip.folder("images");
    img.file("smile.gif", imgData, {base64: true});
    zip.generateAsync({type:"blob"})
    .then(function(content) {
        // see FileSaver.js
        saveAs(content, "example.zip");
    });

    function civitai_saveData(data){
        var zipFileName = data.id;
        var contents = [];
        var modelId = url.match(/\d+/);
        var dataJSON = JSON.stringify(data);
        // saveText(content, modelId, ".json");

        // contents.push({path : "", content : ""});
        contents.push({path : modelId + ".json", content : dataJSON});
        zipContents(zipFileName, contents);

        var i = 0, count = data.modelVersions.length;
        data.modelVersions.forEach(model => {
            var modelFileName, modelName;

            // 获取模型文件名
            if (model.files.length == 1) {
                modelFileName = model.files[0].name;
            } else {
                for (let i = 0; i < model.files.length; i++) {
                    if (model.files[i].type == 'Model') {
                        modelFileName = model.files[i].name;
                    }
                }
            }
            modelName = modelFileName.slice(0, modelFileName.lastIndexOf('.'));


            var modelJSON = JSON.stringify(model);
            contents.push({path : modelName + "/" + modelFileName + ".json", content : modelJSON});

            i++;
            if (i >= count) {
                zipContents(zipFileName, contents);
            }
        });
    }

    
}

/*******************************************************************************/

    // 判断 URL 是否存在指定文本
    function indexOF(e, l = 'p', low = true){
        switch (l) {
            case 'h':
                l = location.href; break;
            case 'p':
                l = location.pathname; break;
            case 's':
                l = location.search; break;
        }
        //console.log(l,e,l.indexOf(e))
        if (e instanceof RegExp) {
            if (e.test(l)) return true
        } else {
            if (low) {e = e.toLowerCase(); l = l.toLowerCase();} // 全部转为小写（即不区分大小写）
            if (l.indexOf(e) != -1) return true
        }
        return false
    }
    // 获取 Search 指定参数
    function getSearch(variable) {
        let query = window.location.search.substring(1),
            vars = query.split('&');
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split('=');
            if(pair[0] == variable){return pair[1];}
        }
        return '';
    }

    // 获取元素（CSS/Xpath）来自：https://github.com/machsix/Super-preloader
    function getCSS(css, contextNode = document) {
        return contextNode.querySelector(css);
    }
    function getAllCSS(css, contextNode = document) {
        return [].slice.call(contextNode.querySelectorAll(css));
    }
    function getXpath(xpath, contextNode, doc = document) {
        contextNode = contextNode || doc;
        try {
            const result = doc.evaluate(xpath, contextNode, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            // 应该总是返回一个元素节点
            return result.singleNodeValue && result.singleNodeValue.nodeType === 1 && result.singleNodeValue;
        } catch (err) {
            throw new Error(`无效 Xpath: ${xpath}`);
        }
    }
    function getAllXpath(xpath, contextNode, doc = document) {
        contextNode = contextNode || doc;
        const result = [];
        try {
            const query = doc.evaluate(xpath, contextNode, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            for (let i = 0; i < query.snapshotLength; i++) {
                const node = query.snapshotItem(i);
                // 如果是 Element 节点
                if (node.nodeType === 1) result.push(node);
            }
        } catch (err) {
            throw new Error(`无效 Xpath: ${xpath}`);
        }
        return result;
    }
    function getOne(selector, contextNode = undefined, doc = document) {
        if (!selector) return;
        contextNode = contextNode || doc;
        if (selector.slice(0,1) === '/' || selector.slice(0,2) === './' || selector.slice(0,2) === '(/' || selector.slice(0,3) === 'id(') {
            return getXpath(selector, contextNode, doc);
        } else {
            return getCSS(selector, contextNode);
        }
    }
    function getAll(selector, contextNode = undefined, doc = document) {
        if (!selector) return [];
        contextNode = contextNode || doc;
        if (selector.slice(0,1) === '/' || selector.slice(0,2) === './' || selector.slice(0,2) === '(/' || selector.slice(0,3) === 'id(') {
            return getAllXpath(selector, contextNode, doc);
        } else {
            return getAllCSS(selector, contextNode);
        }
    }
    function createDocumentByString(e) {
        if (e) {
            if ('HTML' !== document.documentElement.nodeName) return (new DOMParser).parseFromString(e, 'application/xhtml+xml');
            var t;
            try { t = (new DOMParser).parseFromString(e, 'text/html');} catch (e) {}
            if (t) return t;
            if (document.implementation.createHTMLDocument) {
                t = document.implementation.createHTMLDocument('ADocument');
            } else {
                try {((t = document.cloneNode(!1)).appendChild(t.importNode(document.documentElement, !1)), t.documentElement.appendChild(t.createElement('head')), t.documentElement.appendChild(t.createElement('body')));} catch (e) {}
            }
            if (t) {
                var r = document.createRange(),
                    n = r.createContextualFragment(e);
                r.selectNodeContents(document.body);
                t.body.appendChild(n);
                for (var a, o = { TITLE: !0, META: !0, LINK: !0, STYLE: !0, BASE: !0}, i = t.body, s = i.childNodes, c = s.length - 1; c >= 0; c--) o[(a = s[c]).nodeName] && i.removeChild(a);
                return t;
            }
        } else console.error('没有找到要转成 DOM 的字符串', e);
    }


/*******************************************************************************/


function zipContents(filename, contents){
    var currDate = new Date();
	var dateWithOffset = new Date(currDate.getTime() - currDate.getTimezoneOffset() * 60000);
	// replace the default date with dateWithOffset
	JSZip.defaults.date = dateWithOffset;

	var zip = new JSZip();
    contents.forEach(function(item){
        zip.file(item.path, item.content, {createFolders:true,base64:true});
    });
    return new Promise(function(res, rej){
    	zip.generateAsync({type:"blob"})
	    .then(function (content) {
	        saveAs(content, filename + ".zip");
	        res();
	    }, function(error){
	        console.log(error);
	        rej(error);
	    });
    });	
};


function saveText(content, fileName, fileExt){
    fileExt = fileExt || '.txt';
    var blob = new Blob([content], {
        type: "text/plain;charset=utf-8"
    });
    // 保存文件
    saveAs(blob, fileName + fileExt);
}


/**
 * 图片下载
 * @param {*} pic_url  图片链接
 * @param {*} filename  文件名
 */
 function downloadImg(pic_url, filename) {
    var x = new XMLHttpRequest();
    x.open("GET", pic_url, true);
    x.responseType = 'blob';
    x.onload = function (e) {
        var url = window.URL.createObjectURL(x.response);
        var a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
    };
    x.send();
}


function open_in_new_tab(selector){
    // $('a').attr('target', '_blank');
    $(selector).attr('target', '_blank');
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


function forceDownload(url, fileName){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    xhr.onload = function(){
        var urlCreator = window.URL || window.webkitURL;
        var imageUrl = urlCreator.createObjectURL(this.response);
        var tag = document.createElement('a');
        tag.href = imageUrl;
        tag.download = fileName;
        document.body.appendChild(tag);
        tag.click();
        document.body.removeChild(tag);
    };
    xhr.send();
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function setCookie(c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate()+expiredays);
    document.cookie = c_name + "=" + escape(value) + ((expiredays==null) ?
        "" :
        ";expires="+exdate.toUTCString() + ";path=/");
}

function deleteCookie( name ) {
    document.cookie = name + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
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

function matchURL(url) {
    var URL = window.location.href;
    return URL.indexOf(url) > -1;
}

// toolkit
function Mjztool(){}
Mjztool.bytesToSize = function(bytes) {
    if (bytes === 0) return '0 B';
    var k = 1024;
    var sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    //toPrecision(3) 后面保留一位小数，如1.0GB                                                                                                                  //return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];  
};
Mjztool.matchURL = function(url) {
    const URL = window.location.href;
    return URL.indexOf(url) > -1;
};
Mjztool.matchUrlList = function(list) {
    var URL = window.location.href;
    for (var index = 0; index < list.length; index++) {
        var url = list[index];
        if (URL.indexOf(url) > -1) {
            return true;
        }
    }
    return false;
};
Mjztool.matchURLAbsolute = function(url) {
    const href = window.location.href;
    const len = href.length;
    return href.indexOf(url) > -1 && url.length == len;
};
Mjztool.addStyle = function(styleContent) {
    var elStyle = document.createElement("style");
    elStyle.innerHTML = styleContent;
    document.head.appendChild(elStyle);
};
Mjztool.addFunction = function(func, name) {
    name = name || func.name;
    document[name] = func;
};
Mjztool.GM_setClipboard = function(content) {
	// @grant        GM_setClipboard
    GM_setClipboard(content);
};
Mjztool.appendScriptLink = function(src) {
    var f = document.createElement('script');
    f.src = src;
    document.body.appendChild(f);
};
Mjztool.appendStyleLink = function(src) {
    var elStyle = document.createElement("link");
    elStyle.rel="stylesheet";
    elStyle.type="text/css";
    elStyle.href = src;
    document.head.appendChild(elStyle);
};
Mjztool.randomSelect = function(list) {
    var rStart = 0;
    var rEnd = list.length;
    var randomIndex = Math.floor(Math.random() * rEnd + rStart);
    return list[randomIndex];
};
Mjztool.filterList = function(list, filter, constructor){
    if(!(list instanceof Array)) console.error('param "list" is not Array');
    if(typeof(filter) !== 'function') console.error('param "filter" is not Function');

    var result = [];
    for (var index = 0; index < list.length; index++) {
        var element = list[index];
        if (filter(element, index)) {
            if(typeof(constructor) === 'function'){
                result.push(constructor(element, index));
            }else{
                result.push(element);
            }
        }
    }
    return result;
};
Mjztool.printIt = function (printThis) {
	var win = window.open();
	win.document.open();
	win.document.write('<html><body style="white-space: pre;">');
	win.document.write(printThis);
	win.document.write('</body></html>');
	win.document.close();
	win.print();
	win.close();
};
