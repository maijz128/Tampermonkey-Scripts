// ==UserScript==
// @name         MaiJZ - Cool18（禁忌书屋）
// @namespace    https://github.com/maijz128
// @version      24.08.05
// @description  描述
// @author       MaiJZ
// @match        *://*.cool18.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_cookie
// @grant        GM.cookie
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        window.close
// @grant        window.focus
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAjCAIAAAB+eU8wAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAHYcAAB2HAY/l8WUAAAJESURBVEhL7ZexSgNBEIbzNla+hY8g+AA2tlZ2WllZCtZinc4iViLaiJBGQQQtRLQQ1MIiFkLOb+9f5y43e2dyMdpkGI7Z2dn/n52ZjdjJGmU4HEarUX4M62RbCzPXOU0L/T+aXxGHORXN6ePF4uFy7/4krk0c5lQ03dve0tEqTDevd9ElcZhj0Ty8P5Hy7uUB6UfXt2yc70ADX1xLRjF5vGmal8Fb//mKw9v9vZXjdYBMFWAimpa3IX1VwxSy/esufgWYTEWDgGgcEERvLhSQiw4+P7ChISH5C3GYTb2Bae1sU0zlrlBPPBBgc0toVFiapwCPWUsDFsdImS8Q5aLhFLcqJiWAJU0Nhx1m0whw2DokAyx2KZqcplbDKA4zTUNLUUEwbHwpmnJnFw82t5SnZW9UKAxQ6I34cAoUA49y17UIJgkuhEEGYcthJmiUuGhQzusSotHs0iT86nxFw1mHmaCp4ErplpY2eyjlIn3iaSQBcHO/MJMOs5amkilAZVbIgFPpEAjijEkcZi2N5lgaEsw7bwSwBrh8WORHMeT0mAkajbL1HBWNliSBUi7ysHE3VaTHTNCQIBUrPw6NrGgAKm8p0ho2wfNUHbiNNUklUu7sohhAW29Eo2cQxGEmaOgniECUp0CUKBwEYLCbQxY/CmzJ4zETNIh1hTS5inClCpBdaU8xbKOYtX/WVLEiuyzjd1O4WtocQkOF+aJko12PmabxQqaAGhB5cFFS0RKZ8N3MQuc0LfQPaWpkzP/TylJ7JMu+AMWUf3c+C6RtAAAAAElFTkSuQmCC
// ==/UserScript==

// font-family: 微软雅黑, 宋体 !important; 
var Font_Color_Style = "color: #3C3C3C !important; font-size: 27px !important; line-height: 1.8 !important; letter-spacing: 0.04em !important; text-align: justify !important; text-shadow: 0 0 1.15px #fcf6ecd9, 0 0 1px #7b7b7b, 0 0 0.75px #65625e57 !important;";
var Background_Color_Style = "background-color: rgb(228, 235, 241) !important;";

(function () {
    setTimeout(function(){
        main();
    },10);
})();

function main() {
    var style = "";
    // style += "line-height: 36px !important; font-size: 24px !important;";
    // style += "font-family: 'Microsoft YaHei',system-ui,-apple-system,BlinkMacSystemFont,Helvetica,sans-serif,'iconfont','icomoon','FontAwesome','Material Icons Extended','Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji',emoji !important;";
    style += Font_Color_Style;
    style += "margin: auto; min-height: 1em;";

    addStyle(".img_ad_list{ display: none !important; }");

    var bbs4IndexCss = "#d_gold_list {height: 180px !important;} #d_list{ font-size: 16px !important; } #d_list li {line-height: 20px !important;}";
    bbs4IndexCss += ".gold_td {font-size: 16px !important;}";
    bbs4IndexCss += "#d_list_page {font-size: 14px;}";
    addStyle(bbs4IndexCss);

    $("pre").attr("style", "max-width: 820px;" + style);
    $("pre span").attr("style", style);
    $("pre p").attr("style", style);
    $("pre b").attr("style", style);
    $("pre font").attr("style", style);

    if (Mjztool.matchURL("act=threadview")) {
        $("body").attr("style", Background_Color_Style);
        $("tbody").attr("style", Background_Color_Style);
        $("tbody tr").attr("style", Background_Color_Style);   

        ThreadView();
    }




}

function ThreadView(){

    $(".show_content pre font").each(function(){
        var f = $(this);
        var text = f.text().trim();
        if (text == "cool18.com" || text == "www.6park.com") {
            f.remove(); // f.text("");
        }
    });


    // var td_btn = `<td><button onclick="remove_br()">删除换行</button></td>`;
    // $(".show_content table tbody tr").append(td_btn);
    // window.remove_br = function(){$("tbody br").remove();};
    
    var btn = document.createElement("button");
    btn.textContent = "删除换行";
    btn.onclick = function ()
    {
        $("tbody br").remove();

        // $("tbody p").text(function(i,origText){
        //     var text = origText;
        //     text = text.replace(/\r\n/g,"<br>");  
        //     text = text.replace(/\n/g,"<br>");  
        //     // console.log(text);
        //     return text;
        // });

        // $("tbody pre").text(function(i,origText){
        //     var text = origText;
        //     text = text.replace(/\r\n/g,"<br>");  
        //     text = text.replace(/\n/g,"<br>");  
        //     // console.log(text);
        //     return text;
        // });
    };

    var btn2 = document.createElement("button");
    btn2.textContent = "删除换行2";
    btn2.onclick = function ()
    {

        $("tbody p").text(function(i,origText){
            var text = origText;
            text = text.replace(/([^\x00-\xff])\n([^\x00-\xff])/g, "$1$2");  
            return text;
        });

        $("tbody pre").html(function(i,origText){
            var text = origText;
            text = text.replace(/([^\x00-\xff])\n([^\x00-\xff])/g, "$1$2");  
            return text;
        });
    };

    var btn3 = document.createElement("button");
    btn3.textContent = "格式化换行";
    btn3.onclick = function ()
    {
        $("tbody p").text(function(i,origText){
            var text = origText;
            text = text.replace(/\r\n/g,"<br>");  
            text = text.replace(/\n/g,"<br>");  
            return text;
        });

        $("tbody pre").html(function(i,origText){
            var text = origText;
            text = text.replace(/\r\n/g,"<br>");  
            text = text.replace(/\n/g,"<br>");  
            return text;
        });
    };

    var btn4 = document.createElement("button");
    btn4.textContent = "添加空行";
    btn4.onclick = function ()
    {

        $("tbody p").text(function(i,origText){
            var text = origText;
            text = text.replace(/\r\n/g,"<br>");
            text = text.replace(/\n/g,"<br>");
            text = text.replace(/<br>/g,"<br><br>");
            return text;
        });

        $("tbody pre").html(function(i,origText){
            var text = origText;
            text = text.replace(/\r\n/g,"<br>");  
            text = text.replace(/\n/g,"<br>");  
            text = text.replace(/<br>/g,"<br><br>");
            return text;
        });
    };

    var btnCopy = document.createElement("button");
    btnCopy.textContent = "复制内容";
    btnCopy.onclick = function ()
    {
        // var text =  $("tbody pre").text();
        var elText = document.querySelector("tbody pre");
        var text = elText.innerText || elText.textContent;
        Mjztool.GM_setClipboard(text);
    };

    var td = document.createElement("td");
    td.appendChild(btn);
    td.appendChild(btn2);
    td.appendChild(btn3);
    td.appendChild(btn4);
    td.appendChild(btnCopy);

    $(".show_content table tbody tr").append(td);
}





/*******************************************************************************/

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
