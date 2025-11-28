// ==UserScript==
// @name         MaiJZ - StripChat
// @namespace    https://github.com/maijz128
// @version      25.11.28
// @description  描述
// @author       MaiJZ
// @match        *://*.stripchat.com/*
// @match        *://localhost:5000/*
// @match        *://127.0.0.1:5000/*
// @match        *://pc-z370:5000/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stripchat.com
// @require      https://code.jquery.com/jquery-2.2.4.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_cookie
// @grant        GM.cookie
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        window.close
// @grant        window.focus
// ==/UserScript==


(function () {
    setTimeout(function(){
        main();
    },10);
})();

function main() {

    if (matchURL("stripchat.com")) {
        window.myStripChat = new MyStripChat();
        window.myStripChat.init();
    }else{
        window.myStreaMonitor = new MyStreaMonitor();
        window.myStreaMonitor.init();
    }
    
}

class ModelData {
    constructor(modelIdName) {
        this.id = modelIdName;
        this.favorite = false;      // 是否最爱
        this.notification = false;  // 是否通知
        this.thumbCover = '';       // 主播封面
    }
}

class ModelsThumbCover{
    constructor() {
        this.mModelsThumbCover = new Map();
        this.mModelsThumbCoverSave = {
            hosts:{
                // 'h0':'https://img.doppiocdn.net'
            },
            models : {
                // 'h0':[['name','url']]
            }
        };

        this.jsonDataLast = '';

    }
    set(modelId, thumbCover){
        this.mModelsThumbCover.set(modelId, thumbCover);
    }
    get(modelId){
        return this.mModelsThumbCover.get(modelId);
    }


    save(){
        let modelsArray = Array.from(this.mModelsThumbCover.entries());
        let hostsMap = new Map();
        // let modelsMap = new Map();
        this.mModelsThumbCoverSave.hosts = {};
        this.mModelsThumbCoverSave.models = {}

        for (let i = 0; i < modelsArray.length; i++) {
            let model = modelsArray[i];
            let modelId = model[0];
            let thumbCover = model[1];

            const parsedUrl = new URL(thumbCover);
            let host = parsedUrl.protocol + '//' + parsedUrl.host;

            let hostIndex = '';
            if(hostsMap.has(host)){
                hostIndex = hostsMap.get(host);
            }
            else{
                hostIndex = 'h'+ hostsMap.size + 1;
                hostsMap.set(host, 'h'+ hostsMap.size + 1);
                this.mModelsThumbCoverSave.hosts[hostIndex] = host;
                this.mModelsThumbCoverSave.models[hostIndex] = [];
            }

            let thumbCoverPath = parsedUrl.pathname;
            this.mModelsThumbCoverSave.models[hostIndex].push([modelId, thumbCoverPath]);
        }

        let jsonData = JSON.stringify(this.mModelsThumbCoverSave);

        if (this.jsonDataLast != jsonData) {
            this.jsonDataLast = jsonData;
            GM_setValue('ModelsThumbCover', jsonData);
        }
    }

    load (){
        let modelsThumbCoverJson = GM_getValue('ModelsThumbCover');
        if (modelsThumbCoverJson) {
            let modelsThumbCoverSave = JSON.parse(modelsThumbCoverJson);

            let hosts = modelsThumbCoverSave.hosts;
            let models = modelsThumbCoverSave.models;

            for (const hostIndex in hosts) {
                let host = hosts[hostIndex];
                let modelsArray = models[hostIndex];
                for (let i = 0; i < modelsArray.length; i++) {
                    let model = modelsArray[i];
                    let modelId = model[0];
                    let thumbCover = model[1];
                    this.mModelsThumbCover.set(modelId, host + '/' + thumbCover);
                }
            }

        }
    }


}

class ModelsRecording {

    constructor() {
        this.mModelsRecording = new Map();
    }
    
    isRecording(modelId){
        return this.get(modelId);
    }
    get(modelId) {
        let isRecording = this.mModelsRecording.get(modelId);
        if (isRecording == undefined) {
            return false;
        }
        return isRecording > 0;
    }

    set(modelId, isRecording){
        if (isRecording){
            this.mModelsRecording.set(modelId, 1);
        }else{
            this.mModelsRecording.set(modelId, 0);
        }
    }


    clearAll(){
        this.mModelsRecording.clear();
    }

    save(){
        let jsonData = Array.from(this.mModelsRecording.entries());
        // console.log('ModelsRecording save', jsonData);
        GM_setValue('ModelsRecording', jsonData);
    }

    load(){
        let modelsRecordingJson = GM_getValue('ModelsRecording');
        if (modelsRecordingJson) {
            // let jsonObj = JSON.parse(modelsRecordingJson);
            let jsonObj = modelsRecordingJson;

            this.clearAll();

            for (let i=0; i < jsonObj.length; i++) {
                let modelId = jsonObj[i][0];
                let isRecording = jsonObj[i][1];
                this.mModelsRecording.set(modelId, isRecording);
            }

        }
    }
}


class MyUserData {
    constructor(userName) {
        this.mUserName = userName || 'fcxe324';
        this.mUserData = null;
        this.mUserDataLastTime = 0;
        this.mModelsThumbCover = new ModelsThumbCover();
        this.initd = false; // 初始化标志
    }

    init(userName){
        this.mUserName = userName || 'fcxe324';
        this.mUserData = this.loadData();
        this.mModelsThumbCover.load();
        this.initd = true;
    }

    loadData(){
        const uName = this.mUserName;
        const lastTime = localStorage.getItem(uName + '_lastTime');
    
        if (this.mUserData == null || this.mUserDataLastTime != lastTime){
            var userDataJson = localStorage.getItem(uName);
            if (userDataJson == null) {
                this.mUserData = {};
                this.mUserDataLastTime = 0;
            }else{
                this.mUserData = JSON.parse(userDataJson);
                this.mUserDataLastTime = lastTime;
            }
        }
        return this.mUserData;
    }

    saveData(){
        const uName = this.mUserName;
        const uData = this.mUserData;
        if (uData == null) {
            console.error('save User Data:  userData is null');
            return;
        }
        var userDataJson = JSON.stringify(uData);
        // 保存数据（值需为字符串，复杂类型需序列化）
        localStorage.setItem(uName, userDataJson);
        this.mUserData = uData;
    
        this.mUserDataLastTime = Date.now();
        localStorage.setItem(uName + '_lastTime', this.mUserDataLastTime);
    
    }
    
    getModelData(modelId){
        // 获取主播数据
        // user name
        var userData = this.mUserData;
        if (userData == undefined) {
            console.error('userData is null ' + modelId);
            return null;
        }
        var modelDataMap = userData['modelData'];
        if (modelDataMap == undefined) {
            console.error('modelDataMap is null ' + modelId);
            return null;
        }
        var modelData = modelDataMap[modelId];
        // if (modelData == undefined) {
        //     console.error('modelData is null, ' + modelId);
        //     return null;
        // }
        return modelData;
    }

    setModelData(modelId, modelData){
        // 获取主播数据
        // user name
        var userData = this.mUserData;
        if (userData == undefined) {
            console.error('userData is null ' + modelId);
            // return;
            this.mUserData = {};
            userData = this.mUserData;
        }
        var modelDataMap = userData['modelData'];
        if (modelDataMap == undefined) {
            userData['modelData'] = {};
        }
        modelDataMap[modelId] = modelData;
    }

    setModelThumbCover(modelId, modelThumbCover) {
        // let modelData = this.getModelData(modelId);
        // if (modelData) {
        //     modelData['thumbCover'] = modelThumbCover;
        // }
        this.mModelsThumbCover.set(modelId, modelThumbCover);
    }

    getModelThumbCover(modelId) {
        // let modelData = this.getModelData(modelId);
        // if (modelData) {
        //     return modelData['thumbCover'];
        // }
        return this.mModelsThumbCover.get(modelId);
        return null;
    }
    
    saveModelThumbCover() {
        this.mModelsThumbCover.save();
    }
}


class MyStripChat {
    constructor() {
        // this.favorite = [];
        // this.mUserName = 'fcxe00';
        this.myUserData = new MyUserData();
        this.mUserName = null;
    }

    init() {
        console.log('init MyStripChat');
        const self = this;
        

        const inter = setInterval(() => {
            let userName = self.findUserName();
            if (userName != null) {
                clearInterval(inter);
                self.mUserName = userName;
                self.main();
            }
        }, 100);
    }

    main(){
        const self = this;

        this.myUserData.init(this.mUserName);

        this.AddCss();
        
        // 设置视频的height适应窗口height
        this.VideoFitForHeight();

        setTimeout(() => {
            self.CopyModelNameButton();
        }, 5000);
        
        // 桌面模式
        const isDesktop = isMobile() == false;
        if (isDesktop) {
            // 显示国家时间
            self.ShowCountryTime();
            // 显示直播最高画质
            self.ShowLiveResolution();

            // 最爱的主播（开播提醒）
            setInterval(function () {
                self.RecordFavorite();
                self.ShowFavoriteForNotification();

            }, 6000);

            self.RecordModelThumbCover();
            self.HighlightModelsRecording();
        }
    }

 AddCss(){
    var css = '';

    // 水印，隐藏
    css += '.watermark { display: none !important; }';

    // 全屏模式下，右侧打赏按钮
    css += '.plugin-panel--wheel-of-fortune, .plugin-panel--reactions { opacity: 0 !important; } ';
    css += '@media (min-width: 800px) {';
    css += '.plugin-panel--wheel-of-fortune:hover, .plugin-panel--reactions:hover { opacity: 1 !important; } ';
    css += '} ';
    // 右侧-炸弹按钮-Battleship
    css += '.plugin-control-content__show-button-wrapper { opacity: 0 !important; } ';
    css += '@media (min-width: 800px) {';
    css += '.plugin-control-content__show-button-wrapper:hover { opacity: 1 !important; } ';
    css += '} ';
    // 开始录制按钮，自动隐藏
    css += '#record-show-button-viewcam--with-text-enabled-not-started {opacity: 0 !important; } ';
    css += '.record-show-button:hover #record-show-button-viewcam--with-text-enabled-not-started:hover {opacity: 1 !important; } '
    // 虚拟实境按钮，自动隐藏
    css += '.player-controls-user__watch-vr {opacity: 0 !important; } ';
    css += '@media (min-width: 800px) {';
    css += '.player-controls-user__watch-vr:hover {opacity: 1 !important; } '
    css += '} ';
    // 插件面板，战舰，自动隐藏
    css += '.plugin-panel--battleships {opacity: 0 !important; } ';
    css += '@media (min-width: 800px) {';
    css += '.plugin-panel--battleships:hover {opacity: 1 !important; } '
    css += '} ';


    // 全屏模式下，左侧聊天框
    css += '.player-controls-fullscreen__chat-wrapper { opacity: 0 !important; } ';
    css += '@media (min-width: 800px) {';
    css += '.player-controls-fullscreen__chat-wrapper:hover { opacity: 1 !important; } ';
    css += '} ';

    // 全屏模式下，底部打赏栏
    css += '.player-controls-fullscreen__bottom-controls { opacity: 0 !important; } ';
    css += '@media (min-width: 800px) {';
    css += '.player-controls-fullscreen__bottom-controls:hover { opacity: 1 !important; } ';
    css += '} ';

    // 全屏模式下，顶部控制栏
    css += '.fullscreen-top-controls { opacity: 0 !important; } ';
    css += '.fullscreen-top-controls:hover { opacity: 1 !important; } ';

    // 全屏模式下，下一个主播
    css += '.next-model-button { display: none !important; } ';


    //------------- 自定义 -------------
    css += '.favorite-notification { border: 2px solid red;}';

    css += '.model-recording { border-top: 2px solid green !important;}';

    //----------------------------------

    addStyle(css);

    console.log('stripchat.js: css loaded');
}


 VideoFitForHeight(){
    var css = ``;
    css += '.video-element-fit { height: 100vh !important; object-fit: cover !important;} ';

    addStyle(css);

    var btnsSelector = '.fullscreen-top-controls__top-buttons';
    // var btnHtml = '<button id="btnVideoFitForHeight" onclick="VideoFitForHeight()" class="btn ds-btn-inline-block overflow-visible player-top-button" type="button">Fit</button>';
    


    var iterator = setInterval(function(){
        var topBtns = document.querySelector(btnsSelector);
        var btnFitHas = document.querySelector('#btnVideoFitForHeight');
        if (topBtns != undefined){
            if (btnFitHas == undefined){
                console.log('add btnVideoFitForHeight');

                // 1. 创建按钮元素
                const btn = document.createElement('button');
                btn.textContent = '↕Fit↕';  // 按钮文字
                btn.title = 'Fit for height';      // 按钮标题
                btn.id = 'btnVideoFitForHeight';
                btn.className = 'btn ds-btn-inline-block overflow-visible fullscreen-top-controls__button fullscreen-top-controls__button--tokens player-tokens-button player-top-button';

                // 2. 添加点击事件（可选）
                btn.addEventListener('click', () => {
                    var elVideo = document.querySelector('.mse-player video.video-element');
                    elVideo.classList.toggle('video-element-fit');
                });

                topBtns.prepend(btn);
                // clearInterval(iterator);
            }
        }
    }, 3000);

}


// 判断是否为直播页面
 IsLivePage(){
    // 是否直播页面
    var profileLabel = document.querySelector('h1.viewcam-profile-menu-item__label');
    // console.log('不是直播页面');
    if (profileLabel != undefined) return true;
    return false;
}

// 判断是否为Favorite页面
 IsFavoritePage(){
    return window.location.pathname == '/favorites';
}

//-------------------------------------------------------------------------


 loadMyUserData(){
    let userData = this.myUserData.loadData();
    return userData;
}
 saveMyUserData(){
    this.myUserData.saveData();
}

findUserName(){
    // var userNameLink = document.querySelector('.user-levels-header-menu a.user-menu-avatar-wrapper');
    // var userName = userNameLink.getAttribute('href').split('/user/')[1];
    var userNameImg = document.querySelector('.header-user-menu .avatar img.image-background');
    if (userNameImg == undefined) return null;

    var userName = userNameImg.getAttribute('alt').split(' ')[0];

    // if (userName == undefined) {
    //     console.error('userName is null');
    //     return null;
    // }

    return userName;
}
getUserName(){
    return this.mUserName;
}

getModelData(modelId){
    // 获取主播数据
    // user name
    var modelData = this.myUserData.getModelData(modelId);
    // if (modelData == undefined) {
    //     console.error('modelData is null, ' + modelId);
    //     return null;
    // }
    return modelData;
}


 isFavoriteModelNotificationEnabled(modelId) {
    // 检查是否启用了对指定主播的通知
    var modelData = this.getModelData(modelId);
    if (modelData == undefined) {
        return false;
    }
    var notification = modelData['notification'];
    return notification;
}


 RecordFavorite() {
    const self = this;
    // 当打开主播直播页面，查看是否最爱的主播，然后登记主播ID

    // 判断标签是否为当前活跃状态
    if (document.visibilityState !== "visible") return;

    
    // 是否直播页面
    if (self.IsLivePage() == false) return;


    // 主播ID
    var modelIdName = window.location.pathname.split('/')[1];

    // 是否最爱的主播
    var favorite = document.querySelectorAll('.broken-heart-button').length > 0;
    // console.log('是否最爱的主播：' + favorite);

    // 是否开启通知
    var notificationSelector = '.subscriptions-control-button-group .icon-notifications-2';
    var notificationEnabled = document.querySelectorAll(notificationSelector).length > 0;
    // console.log('是否开启通知：' + notificationEnabled);


    var changed = false;

    // 读取数据
    var userData = this.loadMyUserData();

    if (userData == undefined) {
        userData = {};
        changed = true;
    }

    var modelDataMap = userData['modelData'];
    if (modelDataMap == undefined){
        modelDataMap = {
            'a' : new ModelData('template')
        };
        userData['modelData'] = modelDataMap;
        changed = true;
    }

    if (favorite){
        // 没有最爱的主播，则添加
        if (modelDataMap[modelIdName] == undefined){
            let md = new ModelData(modelIdName);
            md.favorite = favorite;
            md.notification = notificationEnabled
            modelDataMap[modelIdName] = md;
            changed = true;
            // console.log('添加最爱的主播：' + modelIdName);
        }else{
            // 已有最爱的主播，则更新
            if (modelDataMap[modelIdName]['notification'] != notificationEnabled){
                modelDataMap[modelIdName]['notification'] = notificationEnabled;
                changed = true;
                // console.log('更新最爱的主播：' + modelIdName);
            }
        }
    }else{
        // 没有最爱的主播，则删除
        if (modelDataMap[modelIdName] != undefined){
            delete modelDataMap[modelIdName];
            changed = true;
            // console.log('删除最爱的主播：' + modelIdName);
        }
    }

    if (changed){
        this.saveMyUserData();
    }

}

 ShowFavoriteForNotification() {
    const self = this;
    // var css = '';
    // css += '.favorite-notification { border: 2px solid red;}';
    // addStyle(css);

    // 判断标签是否为当前活跃状态
    if (document.visibilityState !== "visible") {
        // console.log("当前页面不可见");
        return;
    }

    // 检查是否启用了对指定主播的通知

    const modelListItem = document.querySelectorAll('.model-list-item a');
    modelListItem.forEach(function (item) {
        const href = item.getAttribute('href');
        const modelId = href.split('/')[1];
        // console.log('主播ID：' + modelId);

        const notification = self.isFavoriteModelNotificationEnabled(modelId);
        if (notification) {
            // console.log('主播ID：' + modelId + '，通知：' + notification);
            item.classList.add('favorite-notification');
        }
    });

    
}

RecordModelThumbCover() {
    const self = this;
    if (this.IsFavoritePage()){
        const inter = setInterval(() => {
            if (document.visibilityState !== "visible") return;
            self.RecordModelThumbCover_handler();
        }, 6000);
    }
}
RecordModelThumbCover_handler() {
    const self = this;
    const modelListItem = document.querySelectorAll('.model-list-item a');

    // console.log('开始记录主播封面: ' + modelListItem.length);
    if (modelListItem.length === 0) return;

    for (let i = 0; i < modelListItem.length; i++) {
        const item = modelListItem[i];
        const href = item.getAttribute('href');
        const modelId = href.split('/')[1];
        // console.log('主播ID：' + modelId);

        const modelThumbCoverImg = item.querySelector('img.image-background');
        if (modelThumbCoverImg) {
            let modelThumbCover = modelThumbCoverImg.src;
            self.setModelThumbCover(modelId, modelThumbCover);
            // console.log('主播ID：' + modelId + '，封面：' + modelThumbCover);
        }
    }

    this.myUserData.saveModelThumbCover();
}

setModelThumbCover(modelId, modelThumbCover) {
    // console.log('主播ID：' + modelId + '，封面：' + modelThumbCover);
    this.myUserData.setModelThumbCover(modelId, modelThumbCover);
}

HighlightModelsRecording() {
    const self = this;
    // console.log('开始高亮正在录制的Models');
    if (this.IsFavoritePage()){
        const inter = setInterval(() => {
            if (document.visibilityState !== "visible") return;
            self.HighlightModelsRecording_handler();
        }, 6000);
    }
}
HighlightModelsRecording_handler() {
    const self = this;
    // console.log('HighlightModelsRecording_handler');
    let myModelsRecording = new ModelsRecording();
    myModelsRecording.load();

    const modelListItem = document.querySelectorAll('.model-list-item a');
    // console.log('主播 数量：' + modelListItem.length);
    if (modelListItem.length === 0) {
        return;
    }

    for (let i = 0; i < modelListItem.length; i++) {
        const item = modelListItem[i];
        const href = item.getAttribute('href');
        const modelId = href.split('/')[1];

        const isRecording = myModelsRecording.isRecording(modelId);
        self.setModelIsRecording(item, modelId, isRecording);

        // console.log('主播ID：' + modelId + '，是否在录制：' + isRecording);
    }

}
setModelIsRecording(modelListItem, modelId, isRecording) {
    const cssName = 'model-recording';
    if (isRecording) {
        modelListItem.classList.add(cssName);
    }else {
        modelListItem.classList.remove(cssName);
    }
}

//-------------------------------------------------------------------------

 CopyModelNameButton(){
    // var modelName = document.querySelector('.user-levels-header-menu a.user-menu-avatar-wrapper').innerText;
    // navigator.clipboard.writeText(modelName);

    // 是否直播页面
    if (this.IsLivePage() == false) return;


    var css = '';
    css += '@media (min-width: 800px) {';
    css += '.btn-copy-id-TopLeft  { display: none; }';
    css += '} ';
    css += '.btn-copy-id-TopLeft {';
    css += '    position: absolute;';
    css += '    top: 4px;';
    css += '    left: 4px;';
    css += '    background: rgba(0, 0, 0, 0.3);';
    css += '    color: #fff;';
    css += '    font-size: 16px;';
    css += '    text-align: center;';
    css += '    line-height: 32px;';
    css += '    cursor: pointer;';
    css += '    z-index: 9999;';
    css += '} ';
    addStyle(css);

    // 主播ID
    const modelIdName0 = window.location.pathname.split('/')[1];

    // add copy id button top left
    var btn = document.createElement('button');
    btn.className = 'btn-copy-id-TopLeft';
    btn.innerHTML = modelIdName0;
    btn.onclick = function(){
        const modelIdName1 = window.location.pathname.split('/')[1];
        this.innerHTML = modelIdName1;
        GM_setClipboard(modelIdName1);
    };
    body.appendChild(btn);


    // add copy id button to favorite control
    const inter = setInterval(function(){
        const favControl = document.querySelector('.favorite-control'); 
        if (favControl != null){
            var btn = document.createElement('button');
            btn.innerHTML = '复制ID';
            btn.onclick = function(){
                // 主播ID
                const modelIdName2 = window.location.pathname.split('/')[1];
                GM_setClipboard(modelIdName2);
                // alert('复制成功:' + modelIdName);
            };
            favControl.appendChild(btn);
            clearInterval(inter);
        }
    }, 500);

    

}


 ShowCountryTime(){
    const self = this;
    var css = ``;
    css += '.tags-inline-badges-container .btn-tags-inline-badge .country-flag { color:brown; text-shadow: 0 0 black; background-position-x: left; padding-left: 2.5em;} ';
    addStyle(css);

    setInterval(function(){
        // 判断标签是否为当前活跃状态
        if (document.visibilityState !== "visible") return; // 如果标签页不可见，则不执行下面的代码
        // 是否直播页面
        if (self.IsLivePage() == false) return;
        document.querySelectorAll('.tags-inline-badges-container .btn-tags-inline-badge .country-flag').forEach(function(el){
            var countryName = el.parentElement.getAttribute('aria-label');

            var flagUrl = el.style.backgroundImage;
            // 第一步：分割“images/”，取后半部分字符串（即“co.svg”）
            const afterImages = flagUrl.split("images/")[1]; 
            // 第二步：分割“.svg”，取前半部分字符串（即“co”）
            const countryCode = afterImages.split(".svg")[0]; 
    
            // console.log(countryCode); // 输出结果：co
            // console.log(flagUrl);

            if (countryCode != undefined){
                var countryTime = getSimpleTimeByCountryCode(countryCode.toUpperCase()); // 获取国家时间
                el.innerHTML = countryName + '\n' + countryTime;
            }
        });

    }, 10000);

}


 SaveFirstFrame(){
    // 是否直播页面
    if (this.IsLivePage() == false) return;
    // 是否为当前活跃状态
    // if (document.visibilityState !== "visible") return; // 如果标签页不可见，则不执行下面的代码
    // 获取当前时间
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
}



// 提示直播的画质
 ShowLiveResolution() {
    const self = this;
    // 是否直播页面
    if (self.IsLivePage() == false) return;

    const inter = setInterval(function() {
        // 是否为当前活跃状态
        if (document.visibilityState !== "visible") return; // 如果标签页不可见，则不执行下面的代码
        const btnPlayerRes = document.querySelector('.btn.player-resolution');

        if (btnPlayerRes != null) {
            btnPlayerRes.addEventListener('click', function() {
                setTimeout(function() {
                    const liveName = document.title.split('|')[0];
                    // 设置标签页的标题 最高画质：
                    const res = liveName + ' | ' + self.getLiveResolution();
                    console.log(res);
                    document.title = res;
                }, 500);
            });
            clearInterval(inter);
        }
    }, 1000);

}

 getLiveResolution() {
    
    // var maxRes = document.querySelector('.player-resolution-tooltip__resolutions');
    var maxRes = document.querySelector('.player-resolution-tooltip__resolutions > div:nth-child(2)');
    return maxRes.getAttribute('data-resolution');

    {

        /*
    setInterval(function(){
        // 判断标签是否为当前活跃状态
        if (document.visibilityState !== "visible") return; // 如果标签页不可见，则不执行下面的代码
        var video = document.querySelector('.video-player');
        var videoWidth = video.offsetWidth; // 获取视频宽度
        var videoHeight = video.offsetHeight; // 获取视频高度
        var videoRatio = videoWidth / videoHeight; // 计算视频宽高比
        var resolution = "";
        if (videoRatio > 1.7) {
            
            resolution = "1080p"; // 如果宽高比大于1.7，则认为是1080p
        }
        else if (videoRatio > 1.3) {

            resolution = "720p"; // 如果宽高比大于1.3，则认为是720p
        }
        else if (videoRatio > 1) {

            resolution = "480p"; // 如果宽高比大于1，则认为是480p
        }
        else {

            resolution = "360p"; // 否则认为是360p

        }
        var el = document.querySelector('.resolution');
        el.innerHTML = resolution;
    }, 1000);

    */
    }
}

}


/*******************************************************************************/
//  StreaMonitor

class MyStreaMonitor {

    constructor() {
        this.myUserData = new MyUserData();
        this.myUserData.init(this.myUserData.mUserName);
        this.myModelsRecording = new ModelsRecording();
    }
    
    init() {
        console.log('init MyStreaMonitor');

        const self = this;

        // 监听 popstate 事件
        window.addEventListener('popstate', function(event) {
            console.log('地址栏发生变化:', window.location.href);
            console.log('历史记录状态:', event.state);
            
            // 在这里根据新的 URL 更新页面内容
            setTimeout(() => {
                self.main();
            }, 1000);
        });

        self.AddCss();
    
        self.main();
    }
    
    main() {
        if (window.location.pathname == '/') {
            this.OnMainPage();
        }
        this.OnVideoListPage();
    }

    AddCss() {
        let css ='';

        css += '.streamer-card {height: 200px !important;}';
        css += '.streamer-card .card-header {border: none !important;}';


        css += '#add-streamer-form > div.col-md-7 > div > button{ position: absolute; }';
        css += '#add-streamer-form  #site{ margin-left: 100px;}';

        // 在线状态
        css += '.streamer-card .span-online { background-color: green !important; }';

        // 网站名字
        css += '.streamer-card .card-header small { opacity: 0; } .card-header small:hover { opacity: 1; }';
        css += '.streamer-card .card-header .streamer-site { opacity: 0; } .card-header .streamer-site:hover { opacity: 1; }';
        css += '.streamer-card .card-body .small.text-muted { opacity: 0; } .card-body .small.text-muted:hover { opacity: 1; }';

        // model name
        css += '.streamer-card .card-header h6.mb-0 { color: black !important;}';

        // 运行状态
        css +='.streamer-card .card-body > div.d-flex.justify-content-between.align-items-center.mb-2';
        css +='{ bottom: 0; position: absolute; width: 80%;}';

        // Filters & Actions
        css += '#content > div > div:nth-child(3) .card-header .btn-group';
        css += '{ width: 70%; }';
        css += '#content > div > div:nth-child(3) .card-header .btn-group button';
        css += '{ min-width: 300px; }';
        css += '.card-header .btn-group .stop-streamers,.card-header .btn-group .start-streamers ';  
        css += '{ display:none; }';
        css += '.card-header .btn-group .stop-streamers'; // , .start-streamers
        css += '{ margin-left: 50% !important; }';
        css += '.card-header .btn-group .btn-warning'; 
        css += '{ margin-left: 7rem !important; position: absolute; }';


        addStyle(css);
    }

    OnMainPage() {
        // Add Streamer Button 左移
        
        const self = this;

        const runFunc = function () {
            self.funcOpenSite();
            self.funcOnlineHighlight();
            self.funcModelThumbCover();
            self.funcModelsRecording();
        }

        setInterval(runFunc, 6000);

        runFunc();
    }

    // open site in new tab
    funcOpenSite () {
        const streamerCardList = document.querySelectorAll('.streamer-card');
        streamerCardList.forEach(function (streamerCard) {
            const openSiteBtn = streamerCard.querySelector('.card-header .dropdown ul li a');

            const elId = streamerCard.getAttribute('id');
            const elId_s = elId.split('-');
            const siteId = elId_s[1];
            let modelId = elId_s[2];
            modelId = streamerCard.querySelector('.card-header h6').innerHTML;
            let newHref = '';
            if (siteId == 'sc') {
                newHref = 'https://zh.stripchat.com/'
            }
            newHref += modelId;

            openSiteBtn.href = newHref;
        });
    }

    funcOnlineHighlight () {
        const streamerCardList = document.querySelectorAll('.streamer-card');
        streamerCardList.forEach(function (streamerCard) {
            const spanOnline = streamerCard.querySelector('.card-body span.bg-secondary');

            let isOnline = spanOnline != null;
            if (spanOnline) {
                isOnline = spanOnline.innerHTML.trim() == 'Online';

                if (isOnline) {
                    spanOnline.classList.add('span-online');
                    spanOnline.classList.remove('bg-secondary');
                }else{
                    spanOnline.classList.remove('span-online');
                    spanOnline.classList.add('bg-secondary');
                }
            }
            
        });
    }

    funcModelThumbCover(){
        const self = this;
        const streamerCardList = document.querySelectorAll('.streamer-card');
        streamerCardList.forEach(function (streamerCard) {
            const elId = streamerCard.getAttribute('id');
            const elId_s = elId.split('-');
            const siteId = elId_s[1];
            let modelId = elId_s[2];
            modelId = streamerCard.querySelector('.card-header h6').innerHTML;
            
            let modelThumbCover = self.myUserData.getModelThumbCover(modelId);
            streamerCard.style.backgroundImage = "url('" + modelThumbCover + "')";
            streamerCard.style.backgroundSize = 'contain'; // 'cover';
            streamerCard.style.backgroundPosition = "center center";
            streamerCard.style.height = "180px !important";

            
            // console.log( 'modelId: ' + modelId + ' modelThumbCover: ' + modelThumbCover );

        });
    }

    funcModelsRecording (){
        const self = this;
        this.myModelsRecording.clearAll();

        const streamerCardList = document.querySelectorAll('.streamer-card');

        for (let i = 0; i < streamerCardList.length; i++) {
            const streamerCard = streamerCardList[i];
            const elId = streamerCard.getAttribute('id');
            const elId_s = elId.split('-');
            const siteId = elId_s[1];
            let modelId = elId_s[2];
            modelId = streamerCard.querySelector('.card-header h6').innerHTML;
            
            const isRecording = streamerCard.querySelector('.card-body .bi-record-fill') != null;

            self.myModelsRecording.set(modelId, isRecording);
            
            // console.log( 'modelId: ' + modelId + ' isRecording: ' + isRecording);

        }

        this.myModelsRecording.save();
    }

    OnVideoListPage() {
        // Files页
    
        var videoList = document.querySelector('#video-list');
        if (videoList) {
            setInterval (function(){
                if (document.querySelectorAll('.vli-potplayer').length > 0) return;
    
                var videoListItems = videoList.querySelectorAll('.list-group-item a');
                videoListItems.forEach(function(item) {
                    const videoHref =  item.href;
                    let btn = createPotPlayerButton(videoHref);
                    btn.classList.add('vli-potplayer');
                    item.parentElement.prepend(btn);
                });
            }, 500);
        }
    
        // 视频播放页
        var videoArea = document.querySelector('#video-area');
        var videoAreaCardFooter = document.querySelector('#video-area .card-footer');
    
        if (videoArea) {
            var videoBtn = document.querySelector('#video-area > div > div.card-footer > a');
            if (videoBtn) {
                const videoHref =  videoBtn.href;
                console.log(videoHref);
                videoAreaCardFooter.appendChild(createPotPlayerButton(videoHref));
            }
        }
    }
    
    
    createPotPlayerButton(videoHref) {
        // 创建一个新的 <a> 元素
        const link = document.createElement('a');
    
        var url = 'PotPlayer://' + videoHref;
    
        // 设置链接的属性
        link.href = url; // 设置链接地址
        link.textContent = 'PotPlayer'; // 设置链接显示的文本
        link.target = '_self'; // 设置在新窗口打开
        link.title = 'PotPlayer'; // 设置鼠标悬停提示
    
        link.classList.add('btn', 'btn-primary');
    
        return link;
    }
    
}



/*******************************************************************************/

// 判断是否为移动设备（手机/平板）
function isMobile() {
    const userAgent = navigator.userAgent.toLowerCase();
    // 移动设备标识：Mobile、Android、iPhone、iPad、iPod、BlackBerry、Windows Phone等
    const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
    return mobileKeywords.some(keyword => userAgent.includes(keyword));
}


//------------------------------------------------------------------------
// 根据国家代码得到国家当前时间

const countryTimeZoneMap = {
    // 亚洲
    'CN': 'Asia/Shanghai',      // 中国（北京）
    'JP': 'Asia/Tokyo',         // 日本（东京）
    'KR': 'Asia/Seoul',         // 韩国（首尔）
    'IN': 'Asia/Kolkata',       // 印度（新德里）
    'SG': 'Asia/Singapore',     // 新加坡
    'TH': 'Asia/Bangkok',       // 泰国（曼谷）
    'MY': 'Asia/Kuala_Lumpur',  // 马来西亚（吉隆坡）
    'ID': 'Asia/Jakarta',       // 印度尼西亚（雅加达）
    'PH': 'Asia/Manila',        // 菲律宾（马尼拉）
    'VN': 'Asia/Ho_Chi_Minh',   // 越南（胡志明市）
    'PK': 'Asia/Karachi',       // 巴基斯坦（卡拉奇）
    'BD': 'Asia/Dhaka',         // 孟加拉国（达卡）
    'LK': 'Asia/Colombo',       // 斯里兰卡（科伦坡）
    'NP': 'Asia/Kathmandu',     // 尼泊尔（加德满都）
    
    // 欧洲
    'GB': 'Europe/London',      // 英国（伦敦）
    'DE': 'Europe/Berlin',      // 德国（柏林）
    'FR': 'Europe/Paris',       // 法国（巴黎）
    'IT': 'Europe/Rome',        // 意大利（罗马）
    'ES': 'Europe/Madrid',      // 西班牙（马德里）
    'PT': 'Europe/Lisbon',      // 葡萄牙（里斯本）
    'NL': 'Europe/Amsterdam',   // 荷兰（阿姆斯特丹）
    'BE': 'Europe/Brussels',    // 比利时（布鲁塞尔）
    'CH': 'Europe/Zurich',      // 瑞士（苏黎世）
    'AT': 'Europe/Vienna',      // 奥地利（维也纳）
    'SE': 'Europe/Stockholm',   // 瑞典（斯德哥尔摩）
    'NO': 'Europe/Oslo',        // 挪威（奥斯陆）
    'DK': 'Europe/Copenhagen',  // 丹麦（哥本哈根）
    'FI': 'Europe/Helsinki',    // 芬兰（赫尔辛基）
    'RU': 'Europe/Moscow',      // 俄罗斯（莫斯科）
    'UA': 'Europe/Kiev',        // 乌克兰（基辅）
    'PL': 'Europe/Warsaw',      // 波兰（华沙）
    'CZ': 'Europe/Prague',      // 捷克（布拉格）
    'RO': 'Europe/Bucharest',    // 罗马尼亚（布加勒斯特）
    
    // 北美洲
    'US': 'America/New_York',   // 美国（纽约，东部时间）
    'CA': 'America/Toronto',    // 加拿大（多伦多）
    'MX': 'America/Mexico_City',// 墨西哥（墨西哥城）
    'CA': 'America/Vancouver',  // 加拿大（温哥华，可选）
    'US-CA': 'America/Los_Angeles', // 美国加州（洛杉矶，扩展）
    
    // 南美洲
    'BR': 'America/Sao_Paulo',  // 巴西（圣保罗）
    'AR': 'America/Buenos_Aires',// 阿根廷（布宜诺斯艾利斯）
    'CL': 'America/Santiago',   // 智利（圣地亚哥）
    'CO': 'America/Bogota',     // 哥伦比亚（波哥大）
    'PE': 'America/Lima',       // 秘鲁（利马）
    'VE': 'America/Caracas',     // 委内瑞拉（加拉加斯）
    
    // 大洋洲
    'AU': 'Australia/Sydney',   // 澳大利亚（悉尼）
    'NZ': 'Pacific/Auckland',   // 新西兰（奥克兰）
    'AU-WA': 'Australia/Perth', // 澳大利亚西澳（珀斯，扩展）
    
    // 非洲
    'ZA': 'Africa/Johannesburg',// 南非（约翰内斯堡）
    'NG': 'Africa/Lagos',       // 尼日利亚（拉各斯）
    'EG': 'Africa/Cairo',       // 埃及（开罗）
    'KE': 'Africa/Nairobi',     // 肯尼亚（内罗毕）
    'GH': 'Africa/Accra',       // 加纳（阿克拉）
  };

/**
 * 根据国家代码获取当前时间
 * @param {string} countryCode - 国家代码（如 'CN'、'US'）
 * @returns {string} 格式化的当地时间，若国家代码无效则返回提示
 */
function getSimpleTimeByCountryCode(countryCode) {
    // 统一转为大写（避免大小写问题）
    const code = countryCode.toUpperCase();
    // 获取对应时区
    const timeZone = countryTimeZoneMap[code];
    
    if (!timeZone) {
      return `未找到国家代码 ${code} 对应的时区`;
    }
    
    // 配置时间格式
    const options = {
      year: '2-digit',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      // second: '2-digit',
      hour12: false, // 24小时制
      timeZone: timeZone
    };
    
    // 格式化当前时间
    const now = new Date();
    return new Intl.DateTimeFormat('zh-CN', options).format(now);
  }

console.log('日本时间：', getSimpleTimeByCountryCode('JP'));    // 日本时间： 25/11/18 11:24

//------------------------------------------------------------------------

function open_in_new_tab(selector){
    // $('a').attr('target', '_blank');
    $(selector).attr('target', '_blank');
}


// How to fix TrustedHTML assignment error with Angular [innerHTML]
if (window.trustedTypes && window.trustedTypes.createPolicy && !window.trustedTypes.defaultPolicy) {
    window.trustedTypes.createPolicy('default', {
        createHTML: string => string
        // Optional, only needed for script (url) tags
        ,createScriptURL: string => string
        ,createScript: string => string,
    });
}
var escapeHTMLPolicy = null;
if (window.trustedTypes){
    escapeHTMLPolicy = trustedTypes.createPolicy("forceInner", {
        createHTML: (to_escape) => to_escape
    })
}
function InnerHTML(styleContent)
{
    return escapeHTMLPolicy.createHTML(styleContent);
}

function addStyle(styleContent) {
    var elStyle = document.createElement("style");
    if (escapeHTMLPolicy)
        elStyle.innerHTML = escapeHTMLPolicy.createHTML(styleContent);
    else
        elStyle.innerHTML = styleContent;
    document.head.appendChild(elStyle);
}


function getQueryParams(){  // 当前网页查询参数。?id=xxxxx
    var urlSearchParams = new URLSearchParams(window.location.search);
    var params = Object.fromEntries(urlSearchParams.entries());
    return params;
}


function downloadText(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
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
Mjztool.isMatchUrl = function(url) {
    const URL = window.location.href;
    return URL.indexOf(url) > -1;
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
Mjztool.addFunction = function(name, func) {
    name = name || func.name;
    document[name] = func;
};
Mjztool.GM_setClipboard = function(content) {
	// @grant        GM_setClipboard
    GM_setClipboard(content);
};
Mjztool.GM_downloadImg = function(pic_url, filename) {
	// @grant        GM_xmlhttpRequest
    GM_xmlhttpRequest ( {
        method:         'GET',
        url:            pic_url,
        responseType:   'blob',
        onload:         function (resp) {
            var blob = resp.response;
            var link = document.createElement("a");
            link.download = filename;
            link.href = window.URL.createObjectURL(blob);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            delete link;
        }
    } );
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
Mjztool.parseURL = function(url) {
    try {
      const parsedUrl = new URL(url);
      return {
        href: parsedUrl.href,          // 完整的 URL
        protocol: parsedUrl.protocol,  // 协议（如 http:）
        host: parsedUrl.host,          // 主机名 + 端口
        hostname: parsedUrl.hostname,  // 主机名（域名）
        port: parsedUrl.port,          // 端口号
        pathname: parsedUrl.pathname,  // 路径
        search: parsedUrl.search,      // 查询字符串（带?）
        searchParams: parsedUrl.searchParams, // URLSearchParams 对象
        hash: parsedUrl.hash           // 哈希值（带#）
      };
    } catch (error) {
      console.error('Invalid URL:', error.message);
      return null;
    }
};
  