var UI = {
    version : "0.1.7",
    KEY:{
        POWER:0xe0035,
        UP:38,
        DOWN:40,
        LEFT:37,
        RIGHT:39,
        ENTER:13,

        BACKSPACE:0x08,
        MENU:0xe0033,
        LIVETV:27,

        RECORD:0xe0017,
        EPG:0xe0110,
        PVR:0xe0114,
        MUTE:0xe00f0,
        PLAY:0xe0010,
        STOP:0xe0011,

        LANG:0xe0200,
        INFO:0xe0034,

        CHAR0:48,
        CHAR1:49,
        CHAR2:50,
        CHAR3:51,
        CHAR4:52,
        CHAR5:53,
        CHAR6:54,
        CHAR7:55,
        CHAR8:56,
        CHAR9:57,

        CHNUP:0xe0030,
        CHNDOWN:0xe0031,
        VOLUP:0xe00f3,
        VOLDOWN:0xe00f4,

        FUNRED:0xe0000,
        FUNGREEN:0xe0001,
        FUNYELLOW:0xe0002,
        FUNBLUE:0xe0003,

        WM_VALUE_CHANGE:10000,
        WM_FOCUS_MOVE_TO_BORDER:10010,
        WM_PAINT:10020
    },

    "width" : 1280,
    "height" : 720,

    "font" : "24px Arial",

    "color" : "white",
    "focusColor" : "gold",

    "textAlign" : "left",
    "textBaseline" : "alphabetic",
    "HAlign" : "left",

    "modules" : [],

    "layerNum" : 4,
    "rootWin" : [],

    "scrollWigetNum" : 0,
    "effectWigetNum" : 0,

    "moveTime" : 200, //
    "moveNum" : 5, //

    "frameLength" : 100,
    "effectEnable" : true,
    "moduleEffect" : true,
    "effectMs" : 400,

    getRoot : function(id){
        if(!id) id = 1;

        return UI.rootWin[id];
    },

    "set" : function(key, value){
        UI[key] = value;
    },

    "get" : function(key){
        return UI[key];
    },

    "onKey" : function(e){

        var ret = false;

        var fsw = UI.focusWin;

        if(UI.effectWigetNum > 0 && e.keyCode < UI.KEY.WM_VALUE_CHANGE){
            UI.clearAllEffect();
        }

        UI.lastKeyCode = e.keyCode;

        if(fsw){
            ret = fsw.onkey(e);
        }

        return ret;
    },

    "clearAllEffect" : function(){
        for(var i = 0; i < UI.rootWin.length; i++){

            if(UI.rootWin[i]){

                UI.rootWin[i].travel(function(it){
                    if(it.effect){
                        it.clearEffect();
                    }
                }, false);
            }
        }
    },

    "getCurModule" : function(){
        return UI.lastModule;
    },

    "clearScreen" : function(){
        UI.ctx.clearRect(0, 0, UI.width, UI.height);
    },


    "start" : function(){

        for(var i = 0; i < UI.layerNum; i++){
            UI.rootWin[i] = new UIFrame({
                l : 0,
                t : 0,
                w : UI.width,
                h : UI.height,
                type : "none",
                onFocus : true
            }, "root" + i);
        }

        UI.scrollTimer = setInterval(function(){

            if(UI.scrollWigetNum > 0 || UI.effectWigetNum > 0){

                UI.update();
            }
        }, UI.frameLength);

        UI.regSwitcher();
    },

    "regSwitcher" : function(){

        var eft = {};

        eft.SlideToLeft = {type : "Slide", x1 : -1280, visibility : 0};
        eft.SlideToRight = {type : "Slide", x1 : 1280, visibility : 0};
        eft.SlideFromLeft = {type : "Slide", x0 : -1280};
        eft.SlideFromRight = {type : "Slide", x0 : 1280};

        eft.FadeOut = {type : "Fade", alpha2 : 0, visibility : 0};
        eft.FadeIn = {type : "Fade", alpha1 : 0};

        eft.ScaleOut = {type : "Scale", w1 : 2, h1 : 2, "position" : "center", visibility : 0};
        eft.ScaleIn = {type : "Scale", w0 : 2, h0 : 2, "position" : "center"};

        eft.ScaleOutFix = {type : "Scale", w1 : 2, h1 : 2, "position" : "fix", visibility : 0};
        eft.ScaleInFix = {type : "Scale", w0 : 2, h0 : 2, "position" : "fix"};

        UI.effect = eft;

        UI.effectOut = [eft.SlideToLeft, eft.SlideToRight, eft.FadeOut, eft.ScaleOut, eft.ScaleOutFix];
        UI.effectIn = [eft.SlideFromLeft, eft.SlideFromRight, eft.FadeIn, eft.ScaleIn, eft.ScaleInFix];
    },

    "createGroup" : function(obj, idn, parent, x, y, proc){

        var arr = (typeof(obj) == "string" ? UI.res.saveItems[obj] : obj);

        var id = [];

        if(arr && arr.length > 0)
        {
            if(idn){
                arr[0].id = idn;
            }

            for(var i = 0; i < arr.length; i++){
                id[i] = new arr[i].uiType(arr[i]);
                if(i > 0){
                    id[i].attach(id[0]);
                }
            }

            if(parent){
                id[0].attach(parent);
            } else {
                if(UI.rootWin[1]){
                    id[0].attach(UI.rootWin[1]);
                }
            }

            if(x) id[0].l = x;
            if(y) id[0].t = y;

            if(proc) id[0].proc = proc;
        }

        return id[0];
    },


    "createDlg" : function(obj, idn, parent, x, y, attrs, proc){

        var arr = (typeof(obj) == "string" ? UI.res.saveItems[obj] : obj);

        if(attrs){
            for(var i = 0; i < attrs.length; i++){
                var index = attrs[i].index;
                if(index >= 0 && index < arr.length){
                    for(var it in attrs[i]){
                        if(it != "index"){
                            arr[index][it] = attrs[i][it];
                        }
                    }
                }
            }
        }

        return this.createGroup(arr, idn, parent, x, y, proc);
    },

    "update" : function(){

        UI.clearScreen();

        UI.scrollWigetNum = 0;

        for(var i = 0; i < UI.rootWin.length; i++){
            if(UI.rootWin[i] && UI.rootWin[i].visibility > 0){

                UI.rootWin[i].paint();
            }
        }
    },

    "cutString" : function(str, leng){

        var len = str.length, tlen = len, nlen = 0;

        for(var x = 0; x < len; x++){
            var ch = str.charCodeAt(x);
            if(ch > 128){
                if(nlen + 2 < leng){
                    nlen += 2;
                } else {
                    tlen = x;
                    break;
                }
            } else {
                if(nlen + 1 < leng){
                    if(ch == 10){
                        tlen = x + 1;
                        break;
                    } else {
                        nlen += 1;
                    }
                } else {
                    tlen = x;
                    break;
                }
            }
        }

        return tlen;
    },

    cutStr : function(ctx, str, w, d){
        var w1 = 0;
        var s;
        if(typeof (d) == 'number'){
            for(var i = d + 1; i < str.length; i++){
                s = str.substr(d, i);
                w1 = ctx.measureText(s).width;
                if(w1 >= w){
                    return s;
                }
            }
        }
        else {
            for(var i = 0; i < str.length; i++){
                s = str.substr(0, i);
                w1 = ctx.measureText(s).width;
                if(w1 >= w){
                    return s;
                }
            }
        }

        return str;
    }
};


function UIRes(path){

    var img9end = ["_tl", "_tm", "_tr", "_ml", "_mm", "_mr", "_bl", "_bm", "_br"];
    var img3end = ["_l", "_m", "_r"];
    var img1end = [""];

    this.path = path;
    this.imgNum = 0;
    this.loadNum = 0;
    this.imgs = [];
    this.saveItems = [];

    this.setAttr = function(key, value){
        this[key] = value;
    };

    this.set = function(key, value){
        this.saveItems[key] = value;
    };

    this.get = function(key){
        return this.saveItems[key];
    };

    this.doLoad = function(id, name){
        var self = this;

        this.imgNum++;

        this.imgs[id] = new Image();

        this.imgs[id].src = name;

        this.imgs[id].onload = function(){
            self.loadNum++;
        };
    };

    this.checkLoadEnd = function(endProc, timeout){
        if(endProc){

            var pre = (new Date()).getTime();

            if(!timeout){
                timeout = 30000;
            }

            var self = this;
            if(self.loadNum < self.imgNum){
                this.timer = setInterval(function(){
                    if(self.loadNum == self.imgNum){
                        clearInterval(self.timer);
                        endProc(self.loadNum);
                    } else if((new Date()).getTime() - pre > timeout){
                        clearInterval(self.timer);
                        endProc(self.loadNum);
                        console.error("load images timeout. [" + self.loadNum + "/" + self.imgNum + "]");
                    }
                }, 50);
            } else {

                endProc(self.imgNum);
            }
        }
    };

    this.load = function(nameArr, endProc, timeout){

        if(nameArr){
            for(var i = 0; i < nameArr.length; i++){
                var name = (nameArr[i].split("."))[0];
                this.doLoad(name, this.path + nameArr[i]);
            }
        }

        this.checkLoadEnd(endProc, timeout);
    };

    this.getImagesByName = function(arr){

        var imgs = [];

        for(var i = 0; i < arr.length; i++){
            var id = (arr[i].split("."))[0];
            if(!this.imgs[id]){
                this.doLoad(id, arr[i]);
            }

            imgs[i] = this.imgs[id];
        }

        return imgs;
    };

    this.getImagesByType = function(name, type){

        switch(type){
            case "img":
                return this.doGetImagesByType(name, null, 1, img1end);

            case "9img":
                return this.doGetImagesByType(name, type, 9, img9end);

            case "3imgh":
            case "3imgv":
                return this.doGetImagesByType(name, type, 3, img3end);

            default:
                break;
        }
    };

    this.loadImgGroup = function(type, name, endProc, timeout){
        switch(type){
            case "img":
                this.doLoadImgGroup(name, null, 1, img1end);
                break;
            case "9img":
                this.doLoadImgGroup(name, type, 9, img9end);
                break;
            case "3imgh":
            case "3imgv":
                this.doLoadImgGroup(name, type, 3, img3end);
                break;
            default:
                return;
        }

        this.checkLoadEnd(endProc, timeout);
    };

    this.doLoadImgGroup = function(name, type, num, endArr){

        var pre = (type ? (name + "_" + type) : name);

        //this[name] = {type:type,imgs:[]};

        for(var i = 0; i < num; i++){

            var n = pre + endArr[i];
            this.doLoad(n, this.path + n + ".png");
            //this[name].imgs[i] = this[n];
        }
    };

    this.doGetImagesByType = function(name, type, num, endArr){

        var imgs = [];

        var pre = (type ? (name + "_" + type) : name);

        for(var i = 0; i < num; i++){
            var id = pre + endArr[i];
            if(!this.imgs[id]){
                this.doLoad(id, this.path + id + ".png");
            }
            imgs[i] = this.imgs[id];
        }

        return imgs;
    };
}

var gmodules = {};

function UIModule(){

    this.open = function(){this.defOpen();};
    this.close = function(){this.defClose();};
    this.start = function(){};
    this.stop = function(){};
    this.resume = function(){};
    this.pause = function(){};

    this.hideModule = function(){

        this.pause();

        if(this.win){
            this.win.hide();
            if(this.win.isAncestor(UI.focusWin)){
                this.saveFocusWin = UI.focusWin;
                this.win.removeFocusFromTree();
            }
        }
    };

    this.showModule = function(){
        if(this.win){
            if(!this.win.isAncestor(UI.focusWin)){
                if(this.saveFocusWin){
                    this.saveFocusWin.setFocus(true);
                    this.saveFocusWin = null;
                } else {
                    this.win.setFocus(true);
                }
            }

            this.resume();
        }
    };

    this.doGoOut = function(switcher, cb){

        if(switcher.closeFlag == "hide"){
            this.stop();
            this.hideModule();

        } else {
            // this.pause();
            this.stop();
            this.close();
            if(this.win){
                this.win.destroy();
                this.win = null;
            }
            if(gmodules[this.moduleName]){
                gmodules[this.moduleName].moduleObj = null;
            }
        }
    };

    this.doGoIn = function(switcher, moduleName){

        var ret = null;

        if(switcher.moduleClass){

            var moduleName = switcher.moduleName;

            if(!moduleName) moduleName = switcher.moduleClass.name;


            var it = gmodules[moduleName];

            if(!it){
                gmodules[moduleName] = {moduleName : moduleName, moduleClass : switcher.moduleClass};
                it = gmodules[moduleName];
            }

            if(!it.moduleObj){

                it.moduleObj = new switcher.moduleClass(switcher.targetParams, switcher.srcModule);
                it.moduleName = moduleName;
                it.moduleObj.moduleName = moduleName;

                var md = it.moduleObj;

                md.moduleClass = switcher.moduleClass;

                md.open();
                md.start();

                if(!md.win.isAncestor(UI.focusWin)){
                    md.win.setFocus(true);
                }

                //md.show();
                ret = md;

            } else {
                it.moduleObj.showModule();
                //it.moduleObj.win.show();
                ret = it.moduleObj;
            }

            UI.lastModule = ret;
        }

        return ret;
    };

    this.goOut = function(switcher, cb){
        var self = this;
        if(switcher.moveOutInfo && UI.moduleEffect){
            this.win.setEffect(switcher.moveOutInfo, function(){
                self.doGoOut(switcher);
                cb();
            });
            self.update();
        } else {
            self.doGoOut(switcher);
            cb();
        }
    };

    this.goIn = function(switcher, cb){

        var self = this;
        var it = self.doGoIn(switcher);

        if(it){
            if(switcher.moveInInfo && UI.moduleEffect){
                it.win.setEffect(switcher.moveInInfo, function(win){
                    if(cb){
                        cb();
                    }
                });
                it.update();

            } else {
                it.resume();
                it.show();
                if(cb){
                    cb();
                }
            }
        }
    };

    this.goEx = function(switcher, cb){

        var self = this;

        self.goOut(switcher, function(){
            self.goIn(switcher, cb);
        });
    };


    this.go = function(moduleClass, srcModule, params, closeFlag, moduleName){

        return this.goEx({
            moduleClass : moduleClass,
            srcModule : srcModule,
            targetParams : params,
            closeFlag : closeFlag,
            moduleName : moduleName
        });
    };

    this.defOpen = function(){
        var self = this;
        if(!this.win){
            this.win = UI.createGroup(this.dlgParam, this.moduleName);
            this.win.proc = function(e){
                return self.onkey(e);
            }
        }

    };

    this.defClose = function(){
        if(this.win){
            this.win.detach();
        }
    };


    this.show = function(){
        if(this.win){
            this.win.show();
        }
    };

    this.update = function(){
        if(this.win){
            this.win.update();
        }
    };
}
UIModule.baseModule = new UIModule();


function LcTree(){

    this.parent = null;
    this.next = null;
    this.child = null;

    this.getParent = function(){
        return this.parent;
    };

    this.getFirstChild = function(){
        return this.child;
    };

    this.attach = function(parent){
        var child = null;

        if(this.parent){
            this.detach();
        }

        if(parent && this.parent != parent){
            this.next = null;
            this.parent = parent;

            child = parent.child;

            if(!child){
                parent.child = this;
            }
            else {
                while(child.next){
                    child = child.next;
                }

                child.next = this;
            }
        }
    };

    this.detach = function(){
        var pchild = null;
        var parent = this.parent;

        if(parent){
            pchild = parent.child;
            if(pchild == this){
                parent.child = pchild.next;
            }
            else {
                while(pchild){
                    if(pchild.next == this){
                        pchild.next = this.next;
                        break;
                    }
                    pchild = pchild.next;
                }
            }
        }

        this.parent = null;
    };

    this.travel = function(proc, nome){
        var noProcChild;

        var pcur = this;

        if(!nome){
            noProcChild = proc(pcur);
        }

        if(!noProcChild){
            pcur = pcur.child;

            while(pcur){
                noProcChild = proc(pcur);

                if(!noProcChild){
                    pcur.travel(proc, true);
                }

                pcur = pcur.next;
            }
        }
    };

    this.travelInChildren = function(proc){
        var pcur = this;

        if(proc){
            pcur = pcur.child;

            while(pcur){
                proc(pcur);

                pcur = pcur.next;
            }
        }
    };

    this.find = function(key, cmp, nome){
        var pnode = null;

        var pcur = this;

        if(!nome && cmp(this, key)){
            pnode = this;
        }
        else {
            pcur = pcur.child;
            while(pcur && !pnode){
                if(cmp(pcur, key)){
                    pnode = pcur;
                }
                else {
                    pnode = pcur.find(key, cmp);
                }

                pcur = pcur.next;
            }
        }

        return pnode;
    };

    this.findInChildren = function(key, cmp, flag){
        var pnode = null;
        var pcur = this;

        if(key && cmp){
            if(!flag){
                if(cmp(pcur, key)){
                    pnode = pcur;
                }
            }

            if(!pnode){
                pcur = pcur.child;

                while(pcur){
                    if(cmp(pcur, key)){
                        pnode = pcur;
                        break;
                    }

                    pcur = pcur.next;
                }
            }

        }

        return pnode;
    }
}

function UIPageList(){

    this.rows = 0;
    this.curIndex = 0;
    this.rowsOnePage = 10;

    this.listInit = function(rows, rowsOnePage, curIndex){
        this.rows = rows;
        this.curIndex = curIndex;
        this.rowsOnePage = rowsOnePage;
    };

    this.listUp = function(){
        this.curIndex += this.rows - 1;
        this.curIndex %= this.rows;
    };

    this.listDown = function(){
        this.curIndex++;
        this.curIndex %= this.rows;
    };

    this.listPageUp = function(){
        var PageNum;
        var pageIndex;

        if(this.rows > this.rowsOnePage){
            pageIndex = Math.floor(this.curIndex / this.rowsOnePage);
            PageNum = Math.floor(this.rows / this.rowsOnePage);

            if(this.rows % this.rowsOnePage){
                PageNum++;
            }

            pageIndex += PageNum - 1;
            pageIndex %= PageNum;

            this.curIndex = pageIndex * this.rowsOnePage;
        }
    };

    this.listPageDown = function(){
        var PageNum;
        var pageIndex;

        if(this.rows > this.rowsOnePage){
            pageIndex = Math.floor(this.curIndex / this.rowsOnePage);
            PageNum = Math.floor(this.rows / this.rowsOnePage);

            if(this.rows % this.rowsOnePage){
                PageNum++;
            }

            pageIndex++;
            pageIndex %= PageNum;

            this.curIndex = pageIndex * this.rowsOnePage;
        }
    };

    this.listGetPageRange = function(){
        var pageIndex;
        var islasPage;
        var numInPage;
        var baseIndex;

        var pageRange = {'s' : 0, 'num' : 0};

        if(this.rows > 0){
            pageIndex = Math.floor(this.curIndex / this.rowsOnePage);

            baseIndex = this.rowsOnePage * pageIndex;

            if(this.rows % this.rowsOnePage == 0){
                islasPage = (pageIndex == Math.floor(this.rows / this.rowsOnePage) - 1);
            }
            else {
                islasPage = (pageIndex == Math.floor(this.rows / this.rowsOnePage));
            }

            if(!islasPage || this.rows % this.rowsOnePage == 0){
                numInPage = this.rowsOnePage;
            }
            else {
                numInPage = this.rows % this.rowsOnePage;
            }

            pageRange.s = baseIndex;
            pageRange.num = numInPage;
        }

        return pageRange;
    };

    this.listGetIndex = function(){
        return this.curIndex;
    };

    this.listSetIndex = function(index){
        if(index < this.rows){
            this.curIndex = index;
        }
    };

    this.listGetIndexInPage = function(){
        return this.curIndex % this.rowsOnePage;
    };

    this.listSetRows = function(rows){
        if(rows != this.rows){
            this.rows = rows;
            if(this.curIndex >= this.rows){
                this.curIndex = this.rows - 1;
            }
        }
    };
}

function UIEffect(effects, time, count){

    this.effects = effects;
    this.time = time;
    this.count = count;

    this.timeStep = time / count;

    this.ect = [];

    this.execute = function(cb){

        var self = this;

        var i = 0;

        if(UI.effect){
            this.effectsStart(count);

            UI.update();

            UI.moveTimer = setInterval(function(){

                self.effectsStep(i / self.count);

                UI.update();

                i++;

                if(i > self.count){

                    clearInterval(UI.moveTimer);
                    UI.moveTimer = null;
                    self.effectsEnd();

                    if(cb){
                        cb();
                    }

                    UI.update();
                }

            }, self.timeStep);
        } else {
            for(i = 0; i < this.effects.length; i++){
                this.effects[i].win.visibility = (this.effects[i].hide ? 0 : 1);
            }

            if(cb){
                cb();
            }

            UI.update();
        }
    };

    this.effectsStart = function(count){

        for(var i = 0; i < this.effects.length; i++){
            var tm = "effect" + this.effects[i].type + "Start";

            if(typeof(this[tm]) == 'function'){

                this.effects[i].win.visibility = 1;

                this.ect[i] = this[tm](this.effects[i], count);

                if(this.ect.cb){
                    this.ect.cb("start", this.ect.win);
                }
            }
        }
    };

    this.effectsEnd = function(){

        for(var i = 0; i < this.effects.length; i++){
            var tm = "effect" + this.effects[i].type + "End";

            if(typeof(this[tm]) == 'function'){

                this[tm](this.ect[i]);

                if(this.ect.cb){
                    this.ect.cb("end", this.ect.win);
                }
            }
        }
    };

    this.effectsStep = function(step){
        for(var i = 0; i < this.effects.length; i++){

            var tm = "effect" + this.effects[i].type + "Step";

            if(typeof(this[tm]) == 'function'){
                this[tm](this.ect[i], step);
            }
        }
    };

    //win xsize,ysize,mode

    this.effectslideStart = function(effect, count){

        var ect = {};

        for(var it in effect){
            ect[it] = effect[it];
        }

        var win = ect.win;

        ect.l = win.l;
        ect.t = win.t;

        var pos = ect.win.getPosition();

        win.l = pos.l;
        win.t = pos.t;

        ect.count = count;

        if(!ect.xsize) ect.xsize = 0;
        if(!ect.ysize) ect.ysize = 0;

        if(ect.mode == 'away'){

            ect.xstep = (ect.xsize) / count;
            ect.ystep = (ect.ysize) / count;

        } else {
            ect.xstep = (-ect.xsize) / count;
            ect.ystep = (-ect.ysize) / count;

            win.l += ect.xsize;
            win.t += ect.ysize;
        }

        return ect;
    };

    this.effectslideEnd = function(ect){

        var win = ect.win;

        win.l = ect.l;

        win.t = ect.t;

        win.visibility = (ect.mode == 'away' ? 0 : 1);
    };

    this.effectslideStep = function(ect, step){

        var win = ect.win;

        win.l += ect.xstep;

        win.t += ect.ysize;
    };

    //win alpha,mode

    this.effectfadeStart = function(effect, count){
        var ect = {};

        for(var it in effect){
            ect[it] = effect[it];
        }

        var win = ect.win;

        if(!ect.alpha) ect.alpha = 0;

        ect.saveAlpha = win.alpha;

        var old = win.alpha ? win.alpha : 1;

        if(ect.mode == 'out'){
            ect.alphaStep = (ect.alpha - old) / count;
            win.alpha = old;
        } else {
            ect.alphaStep = (old - ect.alpha) / count;
            win.alpha = ect.alpha;
        }

        return ect;
    };

    this.effectfadeEnd = function(ect){

        var win = ect.win;

        win.visibility = (ect.mode == 'out' ? 0 : 1);

        win.alpha = ect.saveAlpha;
    };

    this.effectfadeStep = function(ect, step){
        ect.win.alpha += ect.alphaStep;
    };


    this.effectrectClipStart = function(effect, count){
        var ect = {};

        for(var it in effect){
            ect[it] = effect[it];
        }

        var win = ect.win;
        var pos = win.getPosition();

        if(!ect.w) ect.w = 0;
        if(!ect.h) ect.h = 0;

        if(ect.mode == 'from'){

            ect.wStep = (pos.w - ect.w) / count;
            ect.hStep = (pos.h - ect.h) / count;

            var clip = {};

            clip.l = pos.l + (pos.w - ect.w) / 2;
            clip.t = pos.t + (pos.h - ect.h) / 2;

            clip.w = ect.w;
            clip.h = ect.h;

            win.clipRect = clip;

        } else {

            ect.wStep = (ect.w - pos.w) / count;
            ect.hStep = (ect.h - pos.h) / count;

            win.clipRect = pos;
        }

        return ect;
    };

    this.effectrectClipEnd = function(ect){

        var win = ect.win;

        if(ect.hide) win.visibility = 0;

        delete win.clipRect;
    };

    this.effectrectClipStep = function(ect, step){

        var pos = ect.win.clipRect;

        pos.w += ect.wStep;
        pos.h += ect.hStep;

        pos.l -= ect.wStep / 2;
        pos.t -= ect.hStep / 2;
    };

    this.effectscaleStart = function(effect, count){
        var ect = {};

        for(var it in effect){
            ect[it] = effect[it];
        }

        ect.count = count;

        var win = ect.win;

        ect.l = win.l;
        ect.t = win.t;

        var pos = win.getPosition();

        if(!ect.w) ect.w = 10;
        if(!ect.h) ect.h = 10;

        if(ect.mode == 'from'){

            ect.wStep = (pos.w - ect.w) / count;
            ect.hStep = (pos.h - ect.h) / count;

            var clip = {};

            clip.l = pos.l + (pos.w - ect.w) / 2;
            clip.t = pos.t + (pos.h - ect.h) / 2;
            clip.w = ect.w;
            clip.h = ect.h;

            ect.scaleRect = clip;

        } else {

            ect.wStep = (ect.w - pos.w) / count;
            ect.hStep = (ect.h - pos.h) / count;

            ect.scaleRect = {l : pos.l, t : pos.t, w : pos.w, h : pos.h};
        }

        ect.pos = pos;

        var target = ect.scaleRect;

        win.scale = [target.w / ect.pos.w, target.h / ect.pos.h];
        if(!ect.center){
            win.l = target.l / win.scale[0];
            win.t = target.t / win.scale[1];
        }

        return ect;
    };

    this.effectscaleEnd = function(ect){

        var win = ect.win;

        win.l = ect.l;
        win.t = ect.t;

        if(ect.hide) win.visibility = 0;

        delete win.scale;
    };

    this.effectscaleStep = function(ect, step){

        var win = ect.win;

        var target = ect.scaleRect;

        target.w += ect.wStep;
        target.h += ect.hStep;

        target.l -= ect.wStep / 2;
        target.t -= ect.hStep / 2;

        win.scale = [target.w / ect.pos.w, target.h / ect.pos.h];

        if(!ect.center){
            win.l = target.l / win.scale[0];
            win.t = target.t / win.scale[1];
        }
    };
}

function UIWm(){

    this.updateBack = true;

    this.visibility = 1;
    this.enable = true;
    this.focusStop = true;
    this.onFocus = false;

    this.font = UI.font;
    this.color = UI.color;
    this.focusColor = UI.focusColor;

    this.textAlign = UI.textAlign;
    this.textBaseline = UI.textBaseline;
    this.HAlign = UI.HAlign;

    this.defSkin = {normal : {type : "rect", color : "blue"}, focus : {type : "rect", color : "gold"}};
    this.value = null;

    this.setFocus = function(value){
        this.onFocus = value;
        if(value){
            if(UI.focusWin != this){
                if(UI.focusWin){
                    UI.focusWin.onFocus = false;
                }

                UI.focusWin = this;
            }

        } else {
            if(this.parent){
                this.parent.onFocus = true;
                UI.focusWin = this.parent;
            } else {
                UI.focusWin = UI.rootWin[1];
            }
        }
    };

    this.setRoot = function(id){
        if(!id) id = 1;
        UI.rootWin[id] = this;
    };

    this.getRoot = function(id){
        if(!id) id = 1;
        return UI.rootWin[id];
    };

    this.getFocusWin = function(){
        return UI.focusWin;
    };

    this.set = function(key, value){
        if(key == "onFocus"){
            this.setFocus(value);
        } else {
            this[key] = value;
        }
    };

    this.get = function(key){
        return this[key];
    };

    this.lostFocus = function(){
        if(UI.focusWin == this)
        {
            if(this.parent){
                this.parent.onArrowKey({keyCode : UI.KEY.RIGHT});
            }

            if(UI.focusWin == this){
                if(this.parent) UI.focusWin = this.parent;
            }
        }
    };

    this.doShow = function(ms, cb){
        var self = this;
        this.visibility = 1;

        if(ms && this.timeout){
            clearTimeout(self.timeout);
            self.timeout = null;
        }

        self.update();
        if(ms){
            this.timeout = setTimeout(function(){
                self.timeout = null;
                self.visibility = 0;

                if(cb){
                    cb();
                }
                self.update();
            }, ms);
        }
    };

    this.show = function(ms, cb){
        var self = this;
        this.doShow(ms, cb)
    };

    this.doHide = function(){
        this.clearTimer();
        this.lostFocus();
        this.visibility = 0;
    };

    this.hide = function(){
        this.doHide();
        this.update();
    };

    this.getVisibility = function(){
        return this.visibility;
    };

    this.setVisibility = function(v){
        if(v == 0){
            this.lostFocus();
        }
        this.visibility = v;
    };

    this.clearTimer = function(){
        if(this.timeout){
            clearTimeout(this.timeout);
            this.timeout = null;
        }
    };

    this.removeFocusFromTree = function(){
        if(this.isAncestor(UI.focusWin)){
            UI.focusWin.onFocus = false;
            if(this.parent)
            {
                UI.focusWin = this.parent;
            } else {
                UI.focusWin = UI.rootWin[1];
            }
        }
    };

    this.destroy = function(rcu){

        this.clearEffect();
        this.clearTimer();

        this.visibility = 0;

        if(rcu){
            this.travel(function(wm){
                wm.clearTimer();
            }, true);
        }

        this.removeFocusFromTree();

        var parent = this.parent;
        if(parent)
        {
            this.detach();
            //parent.update();
        }
    };

    this.isAncestor = function(t){
        var ret = false;
        pcur = t;

        while(pcur)
        {
            if(pcur == this)
            {
                ret = true;
                break;
            }
            pcur = pcur.parent;
        }
        return ret;
    };

    this.update = function(flag){
        UI.update();
    };

    this.paint = function(){

        var pcur = this;
        var pchild;

        if(pcur.visibility > 0){


            if(pcur.effect){
                pcur.exeEffect();
            }

            pcur.draw();

            pchild = pcur.child;

            while(pchild){

                pchild.paint();

                pchild = pchild.next;
            }

            if(pcur.proc){
                //console.log("WM_PAINT");
                pcur.proc({keyCode : UI.KEY.WM_PAINT});
            }

            if(pcur.effect){
                pcur.resEffect();
            }
        }
    };

    this.updateMe = function(){
        this.paint();
    };

    /*
    this.updateMe = function(){

        if(this.visibility > 0) {

            this.draw();
            this.travel(function (wm) {
                if(wm.visibility > 0) {
                    wm.draw();
                }else{
                    return true;
                }
            }, true);
        }

        for(var i = 0; i < UI.rootWin.length;i++){
            if(UI.rootWin[i] && UI.rootWin[i].visibility > 0){

                UI.rootWin[i].draw();

                UI.rootWin[i].travel(function (wm) {
                    if(wm.visibility > 0) {
                        wm.draw();
                    }else{
                        return true;
                    }
                }, true);
            }
        }
    };*/


    this.onkey = function(e){
        var ret = false;

        if(this.proc){
            ret = this.proc(e);
        }

        if(this.defProc && !ret){
            ret = this.defProc(e);
        }

        if(this.focusMoveMode && this.defBaseProc && !ret){
            ret = this.defBaseProc(e);
        }

        if(!ret){
            var p = this.getParent();

            if(p){
                ret = p.onkey(e);
            }
        }

        return ret;
    };

    this.defBaseProc = function(e){

        var ret = false;

        switch(e.keyCode){
            case UI.KEY.LEFT:
            case UI.KEY.RIGHT:
            case UI.KEY.UP:
            case UI.KEY.DOWN:
                return this.onArrowKey(e);
                break;
        }

        return ret;
    };

    this.onArrowKey = function(e){

        var d = ((e.keyCode == UI.KEY.LEFT || e.keyCode == UI.KEY.UP) ? -1 : 1);

        var x = ((e.keyCode == UI.KEY.LEFT || e.keyCode == UI.KEY.RIGHT) ? "x" : "y");

        var y = (x == "x" ? "y" : "x");

        var arr = this.getCanFocusChildren();
        var me;
        var it;

        it = this.getNextFocusById(UI.focusWin);
        if(it){
            it.setFocus(true);
            this.update();
            return true;
        }

        if(arr.length > 0){
            var focus = UI.focusWin;

            if(focus && focus.parent == this){
                me = focus;
            } else {
                me = arr[0];
                it = me;
            }

            if(!it)
            {
                if(arr.length == 1){
                    it = this.checkMoveBorder(me, me);
                    // it = me;
                }
                else {
                    //it = this.dim2next(arr,me,x,y,d,e.keyCode);
                    it = this.dim2nextDis(arr, me, x, y, d, e.keyCode);
                }
            }

            if(it){
                it.setFocus(true);

                this.update();
            }

            return true;
        } else {
            return false;
        }
    };

    this.getNextFocusById = function(me){

        var ret = null;

        var id;

        if(me.nextFocusLeft && UI.lastKeyCode == UI.KEY.LEFT){

            id = me.nextFocusLeft;

        } else if(me.nextFocusRight && UI.lastKeyCode == UI.KEY.RIGHT){

            id = me.nextFocusRight;

        } else if(me.nextFocusUp && UI.lastKeyCode == UI.KEY.UP){

            id = me.nextFocusUp;

        } else if(me.nextFocusDown && UI.lastKeyCode == UI.KEY.DOWN){

            id = me.nextFocusDown;

        } else {
            return null;
        }

        var item = this;

        while(item && !ret)
        {

            item.travelInChildren(function(it){
                if(it.id == id){
                    ret = it;
                    console.log("get next id=" + ret.id);
                }
            });

            item = item.parent;
        }

        return ret;
    };


    this.dimGetCmpFromPos = function(me, keyCode){

        var p = {};

        switch(keyCode){
            case UI.KEY.LEFT:
                p.x = me.x;
                p.y = me.y + me.h / 2;
                p.cx = 10000;
                p.cy = p.y;
                break;
            case UI.KEY.RIGHT:
                p.x = me.x + me.w;
                p.y = me.y + me.h / 2;
                p.cx = -10000;
                p.cy = p.y;
                break;
            case UI.KEY.UP:
                p.x = me.x + me.w / 2;
                p.y = me.y;
                p.cx = p.x;
                p.cy = 10000;
                break;
            case UI.KEY.DOWN:
                p.x = me.x + me.w / 2;
                p.y = me.y + me.h;
                p.cx = p.x;
                p.cy = -10000;
                break;
            default:
                return null;
        }

        return p;
    };

    this.dimGetCmpToPos = function(me, keyCode){

        var p = {};

        switch(keyCode){
            case UI.KEY.LEFT:
                p.x = me.x + me.w;
                p.y = me.y + me.h / 2;

                break;

            case UI.KEY.RIGHT:
                p.x = me.x;
                p.y = me.y + me.h / 2;

                break;
            case UI.KEY.UP:
                p.x = me.x + me.w / 2;
                p.y = me.y + me.h;

                break;
            case UI.KEY.DOWN:

                p.x = me.x + me.w / 2;
                p.y = me.y;

                break;
            default:
                return null;
        }

        return p;
    };

    this.dim2nextDis = function(arr, me, x, y, d, keyCode){

        var i;

        var ret = me;

        var dis = [];
        var cicleDis = [];

        var mp = this.dimGetCmpFromPos(me, keyCode);
        var tp = {};

        for(i = 0; i < arr.length; i++){
            if(arr[i] == me)
            {
                dis[i] = 10000;
            } else {

                var dx;
                var dy;

                tp = this.dimGetCmpToPos(arr[i], keyCode);

                // tp.x = arr[i].x + arr[i].w / 2;
                //tp.y = arr[i].y + arr[i].h / 2;

                if((arr[i][x] * d) > (me[x] * d)){

                    dx = tp.x - mp.x;
                    dy = tp.y - mp.y;

                    dis[i] = Math.sqrt(dx * dx + dy * dy);
                } else {
                    dx = tp.x - mp.cx;
                    dy = tp.y - mp.cy;

                    cicleDis[i] = Math.sqrt(dx * dx + dy * dy);
                }
            }
        }

        var target = null;
        var circleTarget = null;

        for(i = 0; i < arr.length; i++){
            if(arr[i] == me){

            } else if(dis[i] >= 0){
                if(target === null || dis[target] > dis[i]){
                    target = i;
                }
            } else if(cicleDis[i] >= 0){
                if(circleTarget === null || cicleDis[circleTarget] > cicleDis[i]){
                    circleTarget = i;
                }
            }
        }

        if(target != null){
            ret = arr[target];
        } else if(circleTarget != null){
            ret = this.checkMoveBorder(arr[circleTarget], me);
        }

        return ret;
    };

    this.dim2cmp = function cmp(a, b, x, y, d){

        var ret = 0;

        if(a != b){
            ret = a[x] - b[x];
            if(!ret){
                ret = a[y] - b[y];
            }
            ret *= d;
        }

        return ret;
    };

    this.dimItcmp = function cmp(a, b, x, d, abs){
        var ret = d * (a[x] - b[x]);

        if(abs && ret < 0){
            ret = -ret;
        }

        return ret;
    };

    this.dim2next = function(arr, me, x, y, d, keyCode){

        var i;
        var rc;

        var ret = me;

        var min = arr[0];

        for(i = 0; i < arr.length; i++){

            rc = this.dimItcmp(arr[i], me, x, d);

            if(rc > 0){
                rc = this.dimItcmp(arr[i], ret, x, d);
                if(rc > 0){
                    if(ret == me){
                        ret = arr[i];
                    }
                } else if(rc < 0){
                    if(ret != me){
                        ret = arr[i];
                    }
                } else if(rc == 0){
                    if(ret != me){
                        var cr = this.dimItcmp(ret, me, y, d, true);
                        var ai = this.dimItcmp(arr[i], me, y, d, true);
                        if(ai < cr){
                            ret = arr[i];
                        }
                    }
                }
            }

            rc = this.dimItcmp(arr[i], min, x, d);

            if(rc < 0){
                min = arr[i];
            } else if(rc == 0){
                var mm = this.dimItcmp(min, me, y, d, true);
                var aim = this.dimItcmp(arr[i], me, y, d, true);
                if(aim < mm){
                    min = arr[i];
                }
            }
        }

        if(ret == me){
            console.log("to border.");

            ret = this.checkMoveBorder(min, me);
        }

        return ret;
    };

    this.checkMoveBorder = function(min, me){

        var ret = me;

        if(this.focusMoveMode == 'circle'){
            ret = min;
        } else {
            var tr;
            var it = this;

            while(it){
                if(it.proc){
                    tr = this.proc({
                        keyCode : UI.KEY.WM_FOCUS_MOVE_TO_BORDER,
                        hwin : me, id : me.id, originKey : UI.lastKeyCode
                    });

                    if(tr === true){
                        ret = null;
                        break
                    } else if(tr){
                        ret = tr;
                        break;
                    } else {

                    }
                }

                it = it.parent;
            }
        }

        return ret;
    };

    this.getCanFocusChildren = function(){

        var ch = [];
        var j = 0;

        /* this.travelInChildren(function(cur){
             if(cur.focusStop && cur.visibility){
                 ch[j++] = cur;
             }
         });
         */

        this.travel(function(cur){
            if(cur.focusStop && cur.visibility && cur.w && cur.h){
                ch[j++] = cur;
            }
            return (cur.visibility) ? false : true;
        }, true);


        return ch;
    };

    this.initArgsDef = function(obj, id, value, l, t, w, h, attr){

        this.ctx = UI.ctx;
        this.res = UI.res;

        this.id = id;
        this.value = value;
        this.vIndex = 0;

        var params = (typeof(obj) == "string" ? this.res.saveItems[obj] : obj);
        if(params){

            if(params.styleClass){
                var pstyle = this.res.saveItems[params.styleClass];
                for(var p in pstyle){
                    this[p] = pstyle[p];
                }
            }

            for(var p in params){
                this[p] = params[p];
            }
        }

        if(attr){
            for(var p in attr){
                this[p] = attr[p];
            }
        }

        if(l) this.l = l;
        if(t) this.t = t;
        if(w) this.w = w;
        if(h) this.h = h;

        if(!this.w) this.w = 0;
        if(!this.h) this.h = 0;

        if(!this.l && !this.ol && !this.or) this.ol = 0;
        if(!this.t && !this.ot && !this.ob) this.ot = 0;

        if(!this.imgs){
            if(this.cls){
                this.imgs = this.res.getImagesByType(this.cls, this.type);
            } else if(this.imgNames){
                this.imgs = this.res.getImagesByName(this.imgNames);
            }
        }

        if(this.focusStop && this.onFocus && this != UI.focusWin){
            if(UI.focusWin){
                UI.focusWin.onFocus = false;
            }
            UI.focusWin = this;
        }

        if(!this.font) this.font = UI.font;
        if(!this.color) this.color = UI.color;
        if(!this.focusColor) this.focusColor = UI.focusColor;
        if(!this.textAlign) this.textAlign = UI.textAlign;
        if(!this.textBaseline) this.textBaseline = UI.textBaseline;
    };

    this.getChild = function(id){
        return this.find(id, function(cur, key){
            return (cur.id == key) ? true : false;
        }, true);
    };

    this.isKeyOn = function(id){
        if(typeof(id) == 'string'){
            return UI.focusWin.id == id;
        } else {
            return UI.focusWin == id;
        }
    };

    this.clear = function(){
        if(!this.l || !this.t){
            this.getPosition();
        }
        this.ctx.clearRect(this.x, this.y, this.w, this.h);
    };

    this.setSkin = function(skin){

        if(!this.skin){
            this.skin = {};
        }

        for(var p in skin){
            this.skin[p] = skin[p];
        }

        this.initSkinDef();
    };


    this.initSkinDef = function(defSkin){
        if(!this.skin) this.skin = defSkin;
        if(this.skin){
            this.frame = {};

            for(var p in this.skin){

                if(this.skin[p].type){
                    this.frame[p] = new UIFrame(this.skin[p], "", "", this.l, this.t, this.w, this.h);
                    this.frame[p].container = this;
                }
            }
        } else {

        }
    };

    this.drawSkinDef = function(pos){

        var frame = this.frame;
        if(frame){
            if(this.onFocus){
                if(frame.focus){
                    frame.focus.draw(pos);
                } else if(frame.normal){
                    frame.normal.draw(pos);
                }
            } else if(!this.enable && frame.disabled){
                if(frame.disabled){
                    frame.disabled.draw(pos);
                } else if(frame.normal){
                    frame.normal.draw(pos);
                }
            } else if(frame.normal){
                frame.normal.draw(pos);
            }
        }
    };
    this.scrollOffset = 0;

    this.drawValueDef = function(pos){

        /*console.log("drawValueDef value=" + this.value + ",pos=" + JSON.stringify(pos)
            + ",this.font=" + this.font + ",this.color=" + this.color
            +",dl="+this.dl + ",dt=" + this.dt + ",pos.w=" + pos.w);
        */


        if(this.value != null){
            var ctx = this.ctx;

            ctx.font = this.font;
            ctx.fillStyle = (this.onFocus ? this.focusColor : this.color);
            ctx.textAlign = this.textAlign;
            ctx.strokeStyle = this.color;
            ctx.textBaseline = this.textBaseline;

            var tv = (typeof(this.value) == "object") ? this.value[this.vIndex] : this.value;

            if(this.prefixValue){
                tv = this.prefixValue + tv;
            }

            var xl = pos.l + this.dl;

            var drawW = pos.w - 2 * this.dl;

            var a = this.ctx.measureText(tv);

            if(((this.HAlign == "scroll" ||
                    (this.HAlign == "selectScroll" && this.onFocus == true))
                    && (a.width > drawW)) || this.HAlign == "forceScroll"){

                this.isTextScroll = true;

                UI.scrollWigetNum++;

                if(!this.scrollStep){
                    this.scrollStep = 2;
                }

                /*if(typeof(this.scrollOffset) != 'number'){
                    this.scrollOffset = -(drawW / 2);
                }

                if(this.scrollOffset >= a.width)
                {
                    this.scrollOffset = -(drawW);
                }

                ctx.save();

                ctx.rect(xl,pos.t,drawW,pos.h);

                ctx.clip();


                ctx.fillText("" + tv,xl - this.scrollOffset,pos.t + pos.h / 2 + this.dt);


                ctx.restore();

                this.scrollOffset += this.scrollStep;*/

                if(this.scrollOffset >= tv.length - 1){
                    this.scrollOffset = 0;
                }

                var curStr1 = tv.substr(this.scrollOffset, tv.length - 1);

                var endStr1 = UI.cutStr(UI.ctx, curStr1, drawW);

                this.scrollOffset++;

                ctx.fillText("" + endStr1, xl, pos.t + pos.h / 2 + this.dt);


            } else {
                this.isTextScroll = false;

                var cut = tv;
                var cw = a.width;

                if(a.width > (pos.w - 2 * this.dl)){
                    var obj = UI.cutStr(this.ctx, tv, pos.w - 2 * this.dl);
                    cut = obj;
                    cw = pos.w - 2 * this.dl;
                }

                if(this.HAlign == "center"){
                    xl = (pos.l + (pos.w - cw) / 2);
                } else if(this.HAlign == "right"){
                    xl = pos.l + pos.w - this.dl - cw;
                }

                ctx.fillText("" + cut, xl, pos.t + pos.h / 2 + this.dt, pos.w - 2 * this.dl);
            }
        }
    };

    this.getPosition = function(){

        var pos = {l : this.l, t : this.t, w : this.w, h : this.h};

        /* The pos not sync change with ol,ot,if save x,y;*/
        if(true/*!(this.x && this.y)*/){

            if(!(pos.l || pos.l == 0) || !(pos.t || pos.t == 0)){
                var p = this.getParent();
                if(!p) p = this.container;

                if(p){
                    var tmp = p.getPosition();

                    if(this.or || this.or === 0) pos.l = tmp.l + tmp.w - this.or;
                    if(this.ob || this.ob === 0) pos.t = tmp.t + tmp.h - this.ob;
                    if(this.ol || this.ol === 0) pos.l = tmp.l + this.ol;
                    if(this.ot || this.ot === 0) pos.t = tmp.t + this.ot;

                    if(!(pos.l || pos.l === 0)) pos.l = tmp.l;
                    if(!(pos.t || pos.t === 0)) pos.t = tmp.t;

                } else {

                    if(!pos.l) pos.l = 0;
                    if(!pos.t) pos.t = 0;
                }
            }

            this.x = pos.l;
            this.y = pos.t;
        } else {
            pos.l = this.x;
            pos.t = this.y;
        }

        return pos;
    };

    this.doMoveNormal = function(xStep, yStep, count, stepMs, cb){

        var self = this;
        var cn = 0;

        UI.moveTimer = setInterval(function(){
            if(cn < count){
                if(xStep){
                    self.l += xStep;
                }

                if(yStep){
                    self.t += yStep;
                }

                self.visibility = 1;

                self.update();
            } else {
                clearInterval(UI.moveTimer);
                UI.moveTimer = null;
                cb();
            }

            cn++;

        }, stepMs);

    };

    this.moveOutNormal = function(info, cb){
        //{mode: "normal", xsize: 800,time:500,count:10}
        var self = this;
        var sl = this.l;
        var st = this.t;

        var count = info.count;
        var tl = info.time;

        if(!count){
            count = 10;
        }

        if(!tl){
            tl = 500;
        }

        var stepMs = tl / count;

        var xStep = info.xsize;
        if(xStep){
            xStep /= count;
        }

        var yStep = info.ysize;
        if(yStep){
            yStep /= count;
        }

        if(typeof(sl) == 'number' && typeof(st) == 'number' && !UI.moveTimer){
            console.log("stepMs=" + stepMs);
            this.doMoveNormal(xStep, yStep, count, stepMs, function(){
                self.l = sl;
                self.t = st;

                self.hide();

                if(cb){
                    cb();
                }
            });
        }
    };


    this.moveInNormal = function(info, cb){

        //{mode: "normal", xsize: 800,time:500,count:10}
        var self = this;
        var sl = this.l;
        var st = this.t;

        var count = info.count;
        var tl = info.time;

        if(!count){
            count = 10;
        }

        if(!tl){
            tl = 500;
        }

        var stepMs = tl / count;

        var xStep = info.xsize;
        if(xStep){
            this.l += xStep;
            xStep /= count;
        }

        var yStep = info.ysize;
        if(yStep){
            this.t += yStep;
            yStep /= count;
        }

        if(typeof(sl) == 'number' && typeof(st) == 'number' && !UI.moveTimer){
            this.doMoveNormal(-xStep, -yStep, count, stepMs, function(){
                self.l = sl;
                self.t = st;

                self.show();

                if(cb){
                    cb();
                }
            });
        }
    };

    this.doMoveCircle = function(r1, r2, count, stepMs, cb){
        var self = this;
        var cn = 0;

        var step = (r2 - r1) / count;
        var r = r1;

        UI.moveTimer = setInterval(function(){

            if(cn < count){

                self.ctx.clearRect(0, 0, UI.width, UI.height);
                self.ctx.save();

                self.ctx.translate(0, 0);

                self.ctx.beginPath();
                self.ctx.arc(UI.width / 2, UI.height / 2, r, 0, Math.PI * 2, true);
                self.ctx.clip();


                self.visibility = 1;

                self.update();

                self.ctx.restore();

                r += step;

            } else {
                clearInterval(UI.moveTimer);
                UI.moveTimer = null;
                cb();
            }

            cn++;

        }, stepMs);
    };

    this.moveCircle = function(info, out, cb){
        var self = this;
        var sl = this.l;
        var st = this.t;

        var count = info.count;
        var tl = info.time;

        if(!count){
            count = 10;
        }

        if(!tl){
            tl = 500;
        }

        //self.ctx.save();

        if(typeof(sl) == 'number' && typeof(st) == 'number' && !UI.moveTimer){
            this.doMoveCircle(info.r1, info.r2, count, tl / count, function(){
                self.l = sl;
                self.t = st;

                if(out){
                    self.hide();
                } else {
                    self.show();
                }

                if(cb){
                    cb();
                }
            });
        }
    };

    this.moveOut = function(info, cb){

        var obj = (typeof(info) == 'string' ? UI.res.saveItems[info] : info);

        if(obj.mode == "normal"){

            this.moveOutNormal(obj, cb);

        } else if(obj.mode == "circle"){

            this.moveCircle(obj, true, cb);

        }
    };

    this.moveIn = function(info, cb){

        var obj = (typeof(info) == 'string' ? UI.res.saveItems[info] : info);

        if(obj.mode == "normal"){

            this.moveInNormal(obj, cb);

        } else if(obj.mode == "circle"){

            this.moveCircle(obj, false, cb);

        }
    };

    this.draw = function(){};
    this.proc = function(){return false};

    this.clearEffect = function(){

        if(this.effect){
            if(typeof(this.effect.visibility) == 'number'){
                this.visibility = this.effect.visibility;
            }

            //add by jwq
            //闂锛氱獥鍙ｇЩ鍑虹殑锷ㄧ敾杩囩▼涓紝鑻ユ湁鎸夐敭锛屽姩鐢讳细涓銆傚鏋灭獥鍙ｆ渶缁埚彧鏄殣钘忔晥鏋滐紝鍙互璁剧疆visibility.
            //     浣嗗鏋灭獥鍙ｆ渶缁堣destroy锛岃€岀獥鍙ｇ殑destroy镄勬柟娉曞湪锷ㄧ敾缁撴潫镄勫洖璋冨嚱鏁颁腑锛屽姩鐢讳腑姝紝鍒欐棤娉昫estroy.
            //瑙ｅ喅锛氩湪璁剧疆锷ㄧ敾鍙傛暟涓姞鍏ヤ竴涓?涓锷ㄧ敾 镞剁殑鎿崭綔銆俰nterrupt:鍙互鏄嚜瀹氢箟鍑芥暟锛屼篃鍙互鎸囧畾涓哄姩鐢荤粨鏉熷悗镄勬搷浣?            //浣跨敤锛殁type:"Fade",alpha2:0,duration:400,interrupt:function(){...}},
            //     {type:"Fade",alpha2:0,duration:400,interrupt:"default"}
            var cb = null;
            if(this.effect.interrupt){
                if(typeof this.effect.interrupt == 'function'){
                    cb = this.effect.interrupt;
                }
                else if(typeof this.effect.interrupt == 'string' && this.effect.interrupt == "default"){
                    if(this.effect.cb){
                        cb = this.effect.cb;
                    }
                }
            }

            this["effect" + this.effect.type + "End"]();
            delete this.effect;
            UI.effectWigetNum--;


            //add by jwq
            //闂锛氱獥鍙ｅ嚭鏉ュ姩鐢昏绷绋嬩腑锛屽鏋沧湁鎸夐敭锛屽姩鐢讳腑姝紝绐楀彛绉诲姩浼氩仠姝紝娌℃湁鍒伴链熶綅缃€?            //鏂规锛氩湪锷ㄧ敾涓镞讹紝搴旇璋幂敤update鏂规硶锛屽埛鏂伴〉闱紝璁╃獥鍙ｅ埌杈鹃链熶綅缃€?            this.update();

            //镓ц涓柇鍑芥暟
            if(cb){
                cb();
            }
        }
    };

    this.setEffect = function(effect, cb){

        var eft = (typeof(effect) == "string" ? UI.effect[effect] : effect);

        if(!eft){

            var id;

            if(effect == "randomOut"){
                id = Math.floor(Math.random() * UI.effectOut.length);
                eft = UI.effectOut[id];
            } else if(effect == "randomIn"){
                id = Math.floor(Math.random() * UI.effectIn.length);
                eft = UI.effectIn[id];
            }
        }

        if(!UI.effectEnable || !eft){
            if(eft){
                if(typeof(eft.visibility) == 'number'){
                    this.visibility = eft.visibility;
                } else {
                    this.visibility = 1;
                }
            }

            if(cb){

                cb(this);
            }
            return;
        }

        this.clearEffect();

        this.effect = {};

        for(var it in eft){
            this.effect[it] = eft[it];
        }

        this.effect.cb = cb;

        if(this.effect.duration < 2 * UI.frameLength){
            this.effect.duration = UI.effectMs;
        }

        if(!this.effect.duration) this.effect.duration = UI.effectMs;

        this.effect.count = Math.ceil(this.effect.duration / UI.frameLength);

        this.effect.step = 0;

        UI.effectWigetNum++;

        this.visibility = 1;

        this["effect" + this.effect.type + "Start"]();
    };

    this.exeEffect = function(){

        var eft = this.effect;

        this["effect" + eft.type + "Step"]();

        if(eft.step == -1){

            if(typeof(eft.visibility) == 'number'){
                this.visibility = eft.visibility;
            }

            eft.step = -2;

        } else {

            eft.step++;

            if(eft.step > eft.count){

                eft.step = -1;
            }
        }
    };

    this.resEffect = function(){

        var eft = this.effect;

        this["effect" + eft.type + "Res"]();

        if(eft.step == -2){

            this["effect" + eft.type + "End"]();

            var cb = eft.cb;

            UI.effectWigetNum--;

            delete this.effect;

            if(cb){
                cb(this);
            }
        }
    };

    this.effectFadeStart = function(){};

    this.effectFadeStep = function(){

        var eft = this.effect;

        if(eft.step == 0){
            eft.saveAlpha = this.ctx.globalAlpha;

            if(!eft.alpha1 && eft.alpha1 != 0) eft.alpha1 = eft.saveAlpha;
            if(!eft.alpha2 && eft.alpha2 != 0) eft.alpha2 = eft.saveAlpha;

            this.ctx.globalAlpha = eft.alpha1;
        } else if(eft.step > 0){
            this.ctx.globalAlpha = eft.alpha1 + eft.step * (eft.alpha2 - eft.alpha1) / eft.count;
        } else {
            this.ctx.globalAlpha = eft.alpha2;
        }
    };

    this.effectFadeEnd = function(){

    };

    this.effectFadeRes = function(){
        this.ctx.globalAlpha = this.effect.saveAlpha;
    };


    this.effectSlideStart = function(){

        var eft = this.effect;

        eft.l = this.l;
        eft.t = this.t;

        var pos = this.getPosition();

        if(!eft.x0 && eft.x0 != 0) eft.x0 = pos.l;
        if(!eft.y0 && eft.y0 != 0) eft.y0 = pos.t;

        if(!eft.x1 && eft.x1 != 0) eft.x1 = pos.l;
        if(!eft.y1 && eft.y1 != 0) eft.y1 = pos.t;

        this.l = eft.x0;
        this.t = eft.y0;
    };

    this.effectSlideEnd = function(){

        var eft = this.effect;

        this.l = eft.l;
        this.t = eft.t;

    };

    this.effectSlideStep = function(){
        var eft = this.effect;

        if(eft.step == 0){

        } else if(eft.step >= 0){
            this.l = eft.x0 + eft.step * (eft.x1 - eft.x0) / eft.count;
            this.t = eft.y0 + eft.step * (eft.y1 - eft.y0) / eft.count;
        } else {
            this.l = eft.x1;
            this.t = eft.y1;
        }
    };

    this.effectSlideRes = function(){

    };

    this.effectScaleStart = function(){

        var eft = this.effect;

        eft.savel = this.l;
        eft.savet = this.t;

        var pos = this.getPosition();

        eft.pos = pos;

        eft.l = pos.l;
        eft.t = pos.t;

        if(!eft.w0 && eft.w0 != 0){
            eft.w0 = pos.w;
        }

        if(!eft.h0 && eft.h0 != 0){
            eft.h0 = pos.h;
        }

        if(!eft.w1 && eft.w1 != 0){
            eft.w1 = pos.w;
            if(eft.position != 'fix'){
                eft.l = pos.l + (pos.w - eft.w0) / 2;
            }
        }

        if(!eft.h1 && eft.h1 != 0){
            eft.h1 = pos.h;
            if(eft.position != 'fix'){
                eft.t = pos.t + (pos.h - eft.h0) / 2;
            }
        }

        if(eft.w0 < 2) eft.w0 = 2;
        if(eft.h0 < 2) eft.h0 = 2;
        if(eft.w1 < 2) eft.w1 = 2;
        if(eft.h1 < 2) eft.h1 = 2;

    };

    this.effectScaleEnd = function(){

        var eft = this.effect;

        this.l = eft.savel;
        this.t = eft.savet;
    };

    this.effectScaleStep = function(){
        var eft = this.effect;
        var tw, th;

        this.ctx.save();

        if(eft.step >= 0){
            if(eft.step == 0){
                eft.wStep = (eft.w1 - eft.w0) / eft.count;
                eft.hStep = (eft.h1 - eft.h0) / eft.count;
            }
            tw = eft.w0 + eft.step * eft.wStep;
            th = eft.h0 + eft.step * eft.hStep;
        } else {
            tw = eft.w1;
            th = eft.h1;
        }

        var scaleX = tw / eft.pos.w;
        var scaleY = th / eft.pos.h;

        if(eft.step >= 0){
            if(eft.position == 'fix'){

                this.l = eft.l / scaleX;
                this.t = eft.t / scaleY;

            } else if(eft.position == 'center'){
                if(eft.step == 0){

                    this.l = eft.l;
                    this.t = eft.t;

                } else {

                    this.l = eft.l - eft.step * (eft.wStep / 2);
                    this.t = eft.t - eft.step * (eft.hStep / 2);
                    this.l /= scaleX;
                    this.t /= scaleY;

                }
            } else {

            }
        }

        this.ctx.scale(scaleX, scaleY)
    };

    this.effectScaleRes = function(){
        this.ctx.restore();
    };
}


UIWm.prototype = new LcTree();

function UIFrame(obj, id, value, l, t, w, h, attr){

    this.focusStop = false;

    this.initArgsDef(obj, id, value, l, t, w, h, attr);

    this.draw = function(pos){

        if(!pos){
            pos = this.getPosition();
        }

        this["draw" + this.type](pos.l, pos.t, pos.w, pos.h);
    };

    this.draw9img = function(l, t, w, h){

        var imgs = this.imgs;
        if(imgs){
            var dw = imgs[0].width;
            var dh = imgs[0].height;

            this.ctx.drawImage(imgs[0], l, t);
            this.ctx.drawImage(imgs[1], l + dw, t, w - 2 * dw, dh);
            this.ctx.drawImage(imgs[2], l + w - dw, t);

            this.ctx.drawImage(imgs[3], l, t + dh, dw, h - 2 * dh);
            this.ctx.drawImage(imgs[4], l + dw, t + dh, w - 2 * dw, h - 2 * dh);
            this.ctx.drawImage(imgs[5], l + w - dw, t + dh, dw, h - 2 * dh);

            this.ctx.drawImage(imgs[6], l, t + h - dh);
            this.ctx.drawImage(imgs[7], l + dw, t + h - dh, w - 2 * dw, dh);
            this.ctx.drawImage(imgs[8], l + w - dw, t + h - dh);
        }
    };

    this.draw3imgh = function(l, t, w, h){

        var imgs = this.imgs;
        if(imgs){
            var dw = imgs[0].width;
            var dh = imgs[0].height;
            if(this.stretch == "V" || this.stretch == "HV"){
                this.ctx.drawImage(imgs[0], l, t, imgs[0].width, h);
                this.ctx.drawImage(imgs[1], l + dw, t, w - 2 * dw, h);
                this.ctx.drawImage(imgs[2], l + w - dw, t, imgs[2].width, h);
            } else {
                this.ctx.drawImage(imgs[0], l, t);
                this.ctx.drawImage(imgs[1], l + dw, t, w - 2 * dw, dh);
                this.ctx.drawImage(imgs[2], l + w - dw, t);
            }
        }

    };

    this.draw3imgv = function(l, t, w, h){

        var imgs = this.imgs;
        if(imgs){
            var dw = imgs[0].width;
            var dh = imgs[0].height;

            if(this.stretch == "H" || this.stretch == "HV"){
                this.ctx.drawImage(imgs[0], l, t, w, imgs[0].height);
                this.ctx.drawImage(imgs[1], l, t + dh, w, h - 2 * dh);
                this.ctx.drawImage(imgs[2], l, t + h - dh, w, imgs[2].height);
            } else {
                this.ctx.drawImage(imgs[0], l, t);
                this.ctx.drawImage(imgs[1], l, t + dh, dw, h - 2 * dh);
                this.ctx.drawImage(imgs[2], l, t + h - dh);
            }
        }
    };

    this.drawimg = function(l, t, w, h){

        var imgs = this.imgs;
        if(imgs){

            if(this.stretch == "H"){
                this.ctx.drawImage(imgs[0], l, t, w, imgs[0].height);
            } else if(this.stretch == "V"){
                this.ctx.drawImage(imgs[0], l, t, imgs[0].width, h);
            } else if(this.stretch == "HV"){
                this.ctx.drawImage(imgs[0], l, t, w, h);
            } else {
                this.ctx.drawImage(imgs[0], l, t);
            }
        }
    };

    this.drawimgObj = function(l, t, w, h){

        var imgs = this.imgObj;
        if(imgs){
            if(this.stretch == "H"){
                this.ctx.drawImage(imgs, l, t, w, imgs.height);
            } else if(this.stretch == "V"){
                this.ctx.drawImage(imgs, l, t, imgs.width, h);
            } else if(this.stretch == "HV"){
                this.ctx.drawImage(imgs, l, t, w, h);
            } else {
                this.ctx.drawImage(imgs, l, t);
            }
        }
    };

    this.drawblock = function(l, t, w, h){
        if(this.color){

            this.ctx.fillStyle = this.color;
            this.ctx.fillRect(l, t, w, h);
        }
    };

    this.drawrect = function(l, t, w, h){
        if(this.color){
            if(this.lineWidth){
                this.ctx.lineWidth = this.lineWidth;
            }
            this.ctx.strokeStyle = this.color;
            this.ctx.strokeRect(l, t, w, h);
        }
    };

    this.drawfillRect = function(l, t, w, h){

        var lw = this.borderWidth;
        if(!lw) lw = 2;

        if(this.fillColor){
            this.ctx.fillStyle = this.fillColor;
            this.ctx.fillRect(l, t, w, h);
        }

        if(this.color){
            this.ctx.lineWidth = lw;
            this.ctx.strokeStyle = this.color;
            this.ctx.strokeRect(l, t, w, h);
        }
    };

    this.drawcircle = function(l, t, w, h){

        var lw = this.borderWidth;
        if(!lw) lw = 2;

        if(this.color){
            this.ctx.lineWidth = lw;
            this.ctx.strokeStyle = this.color;
            var x = l + w / 2;
            var y = t + h / 2;
            var r = (w > h ? h / 2 : w / 2);
            this.ctx.beginPath();
            this.ctx.arc(x, y, r, 0, Math.PI * 2, true);
            this.ctx.closePath();
            this.ctx.stroke();

            console.log("r=" + r);
        }

    };

    this.drawfillCircle = function(l, t, w, h){

        var r = (w > h ? h / 2 : w / 2);

        var x = l + w / 2;
        var y = t + h / 2;

        if(this.fillColor){
            this.ctx.fillStyle = this.fillColor;

            this.ctx.beginPath();
            this.ctx.arc(x, y, r, 0, Math.PI * 2, true);
            this.ctx.closePath();
            this.ctx.fill();
        }

        var lw = this.borderWidth;
        if(lw){
            this.ctx.lineWidth = lw;
            this.ctx.strokeStyle = this.color;

            this.ctx.beginPath();
            this.ctx.arc(x, y, r, 0, Math.PI * 2, true);
            this.ctx.closePath();
            this.ctx.stroke();
        }
    };

    this.drawlinear = function(l, t, w, h){

        var linearRate = this.linearRate;

        var grd = this.ctx.createLinearGradient(
            l + linearRate.x0 * w, t + linearRate.y0 * h,
            l + linearRate.x1 * w, t + linearRate.y1 * h);

        for(var i = 0; i < this.gradient.length; i++){
            grd.addColorStop(this.gradient[i].step, this.gradient[i].color);
        }

        this.ctx.fillStyle = grd;
        this.ctx.fillRect(l, t, w, h);
    };

    this.drawradial = function(l, t, w, h){
        var radialInfo = this.radialInfo;

        var grd = this.ctx.createRadialGradient(
            l + radialInfo.x0 * w, t + radialInfo.y0 * h, radialInfo.r0,
            l + radialInfo.x1 * w, t + radialInfo.y1 * h, radialInfo.r1);

        for(var i = 0; i < this.gradient.length; i++){
            grd.addColorStop(this.gradient[i].step, this.gradient[i].color);
        }

        this.ctx.fillStyle = grd;
        this.ctx.fillRect(l, t, w, h);
    };

    this.drawhole = function(l, t, w, h){
        this.ctx.clearRect(l, t, w, h);
    };

    this.drawnone = function(l, t, w, h){

    };

}

UIFrame.prototype = new UIWm();

function UILabel(obj, id, value, l, t, w, h, attr){

    this.dl = 0;
    this.dt = 0;

    this.focusStop = false;

    this.initArgsDef(obj, id, value, l, t, w, h, attr);


    //this.charWidth = 12;
    //this.lineInterval = 55;

    this.initSkinDef();

    this.draw = function(){

        if(this.visibility > 0){
            var pos = this.getPosition();

            this.drawSkinDef(pos);
            if(this.multiLine){
                this.drawMultiLine(pos);
            } else {
                this.drawValueDef(pos);
            }
        }
    };


    this.drawMultiLine = function(pos){
        if(this.value && this.value.length > 0){

            this.ctx.font = this.font;
            this.ctx.fillStyle = (this.onFocus ? this.focusColor : this.color);
            this.ctx.textAlign = this.textAlign;
            this.ctx.strokeStyle = this.strokeStyle;

            this.ctx.textBaseline = this.textBaseline;

            var num = Math.floor(pos.w / this.charWidth);

            this.doDrawMultiLine(this.ctx, this.value,
                pos.l + this.dl, pos.t + this.dt, pos.w - 2 * this.dl, pos.h - 2 * this.dt,
                this.lineInterval, num);

        }
    };

    this.doDrawMultiLine = function(ctx, text, l, t, w, h, li, rw){
        for(var i = 1; text.length > 0; i++){
            var tl = UI.cutString(text, rw);

            var tv = text.substr(0, tl)/*.replace(/^\s+|\s+$/, "")*/;

            if(i * li < h){
                ctx.fillText(tv, l, t + i * li, w);
                text = text.substr(tl);
            } else {
                break;
            }
        }
    };
}

UILabel.prototype = new UIWm();

function UIButton(obj, id, value, l, t, w, h, attr){

    this.dl = 0;
    this.dt = 0;

    this.HAlign = "center";

    this.initArgsDef(obj, id, value, l, t, w, h, attr);

    // console.log("UIButton [" + this.l + "," + this.t + "," + this.w + "," + this.h + "]");


    this.initSkinDef(this.defSkin);


    this.draw = function(){

        if(this.visibility > 0){
            //console.log("this.onFocus=" + this.onFocus,"id="+this.id);

            var pos = this.getPosition();
            //console.log("Button pos=" + JSON.stringify(pos));
            this.drawSkinDef(pos);
            this.drawValueDef(pos);
        }
    };

    this.defProc = function(e){
        var ret = false;
        if(typeof(this.value) == "object" && this.value.length > 0){
            if(e.keyCode == UI.KEY.LEFT || e.keyCode == UI.KEY.RIGHT){
                var step = (e.keyCode == UI.KEY.LEFT ? -1 : 1);
                this.vIndex = (this.vIndex + step + this.value.length) % this.value.length;
                ret = true;
                this.update();
                this.onkey({keyCode : UI.KEY.WM_VALUE_CHANGE, id : this.id, hwin : this});
            }
        }

        return ret;
    };

    this.getValue = function(){
        var tv = (typeof(this.value) == "object") ? this.value[this.vIndex] : this.value;
        return tv;
    }


    this.getNumberValue = function(){
        var tv = (typeof(this.value) == "object") ? this.value[this.vIndex] : this.value;
        if(typeof(tv) == "string"){
            return parseFloat(tv);
        } else {
            return tv;
        }
    };
}

UIButton.prototype = new UIWm();


function UIImg(obj, id, value, l, t, w, h, attr){

    this.focusAddSize = 2;
    //this.focusRectLineWidth = 3;
    this.focusRectLineColor = UI.focusColor;

    this.initArgsDef(obj, id, value, l, t, w, h, attr);

    this.focusStop = false;

    this.initUrl = function(){
        if(this.src){
            this.skin = {};

            var srcImg;

            if(typeof(this.src) == "string"){
                this.skin.normal = {type : "img", cls : this.src, stretch : this.stretch};
                srcImg = this.res.imgs[this.src];
            } else if(typeof(this.src) == "object"){
                srcImg = this.src;

                this.skin.normal = {type : "imgObj", imgObj : this.src, stretch : this.stretch};
            }

            if(typeof(this.focusSrc) == "string"){
                this.skin.focus = {type : "img", cls : this.focusSrc, stretch : this.stretch};

            } else if(typeof(this.focusSrc) == "object"){

                this.skin.focus = {type : "imgObj", imgObj : this.focusSrc, stretch : this.stretch};
            }

            if((!this.w || !this.h) && srcImg){

                if(!this.w && srcImg.width){
                    this.w = srcImg.width;
                }

                if(!this.h && srcImg.height){
                    this.h = srcImg.height;
                }
            }
        }
    };

    this.initUrl();

    this.initSkinDef(this.defSkin);

    this.setSrc = function(src){

        if(this.src != src){
            this.src = src;

            this.initUrl();

            this.initSkinDef();
        }
    };

    this.setFocusSrc = function(src){

        if(this.focusSrc != src){
            this.focusSrc = src;

            this.initUrl();

            this.initSkinDef();
        }
    };

    this.draw = function(){

        //return;

        if(this.visibility > 0){

            var pos = this.getPosition();

            if(!this.frame.focus && UI.focusWin == this && this.stretch){
                pos.l -= this.focusAddSize;
                pos.t -= this.focusAddSize;
                pos.w += 2 * this.focusAddSize;
                pos.h += 2 * this.focusAddSize;

                if(pos.l < 0){
                    pos.w += pos.l;
                    pos.l = 0;
                }

                if(pos.t < 0){
                    pos.h += pos.t;
                    pos.t = 0;
                }
            }

            this.drawSkinDef(pos);

            if(!this.frame.focus && UI.focusWin == this && this.focusRectLineWidth){

                this.ctx.strokeStyle = this.focusRectLineColor;
                this.ctx.lineWidth = this.focusRectLineWidth;

                this.ctx.strokeRect(pos.l, pos.t, pos.w, pos.h);
            }

            this.drawValueDef(pos);
        }
    };
}

UIImg.prototype = new UIWm();


/*
* maxChars:     最大输入字符数
* focusColor:   焦点时的颜色
* password:     是否输入密码
* passwdSpace:  每位之间的空隙"   "
*/
function UIEdit(obj, id, value, l, t, w, h, attr){

    this.dl = 20;
    this.dt = 5;

    this.editType = "number";
    this.maxChars = 9;

    this.value = "";

    this.initArgsDef(obj, id, value, l, t, w, h, attr);

    // console.log("UIEdit [" + this.l + "," + this.t + "," + this.w + "," + this.h + "]");

    if(typeof(this.value) == "number"){
        this.value = "" + this.value;
    }

    this.initSkinDef(this.defSkin);

    if(this.editType == "number"){
        if(this.maxChars > 15){
            //this.maxChars = 15;
        }
    }

    this.draw = function(){

        if(this.visibility > 0){
            //console.log("this.onFocus=" + this.onFocus,"id="+this.id);

            var pos = this.getPosition();

            this.drawSkinDef(pos);
            this.doDrawValue(pos);
        }
    };

    this.doDrawValue = function(pos){

        /*console.log("drawValueDef value=" + this.value + ",pos=" + JSON.stringify(pos)
         + ",this.font=" + this.font + ",this.color=" + this.color
         +",dl="+this.dl + ",dt=" + this.dt + ",pos.w=" + pos.w);
         */

        if(this.value || this.suffixValue){
            this.ctx.font = this.font;
            this.ctx.fillStyle = (this.onFocus ? this.focusColor : this.color);
            this.ctx.textAlign = this.textAlign;
            this.ctx.textBaseline = this.textBaseline;

            var vx = "";


            if(this.passwdSpace){
                for(var i = 0; i < this.value.length; i++){
                    if(i < this.value.length - 1){
                        vx += this.value[1];
                        vx += this.passwdSpace;
                    }
                }
            }
            else {
                vx = this.value;
            }

            if(this.onFocus){
                vx += "_";
            }

            var a = this.ctx.measureText(vx);

            var xl = pos.l + this.dl;

            if(this.HAlign == "center"){
                xl = (pos.l + (pos.w - a.width) / 2);
            }
            else if(this.HAlign == "right"){
                xl = pos.l + pos.w - this.dl - a.width;
            }

            var vy = pos.t + pos.h / 2 + this.dt;

            if(this.password){
                vx = "";

                for(var i = 0; i < this.value.length; i++){

                    vx += "*";


                    if(this.passwdSpace && (i < this.value.length - 1)){
                        vx += this.passwdSpace;
                    }
                }

                if(this.onFocus) vx += "_";
            }

            this.ctx.fillText(vx, xl, vy, pos.w);

            if(this.suffixValue){
                a = this.ctx.measureText(this.suffixValue);
                xl = pos.l + pos.w - this.dl - a.width;
                this.ctx.fillText(this.suffixValue, xl, vy, pos.w);
            }
        }
    };

    this.getNumberValue = function(){
        return parseFloat(this.value);
    };

    this.getIntValue = function(){
        return parseInt(this.value);
    };

    this.defProc = function(e){
        var ret = false;
        var kechars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

        if(e.keyCode >= UI.KEY.CHAR0 && e.keyCode <= UI.KEY.CHAR9){
            if(this.value.length < this.maxChars){
                this.value += kechars[e.keyCode - UI.KEY.CHAR0];
                ret = true;
            }
        } else if(e.keyCode == UI.KEY.LEFT){
            if(this.value.length > 1){
                this.value = this.value.slice(0, this.value.length - 1);
            } else {
                this.value = "";
            }

            ret = true;
        }

        if(ret == true){
            this.update();
            this.onkey({keyCode : UI.KEY.WM_VALUE_CHANGE, id : this.id, hwin : this});
        }
        return ret;
    };

}

UIEdit.prototype = new UIWm();


function UIProgress(obj, id, value, l, t, w, h, attr){

    this.dl = 20;
    this.dt = 5;
    this.borderW = 0;
    this.focusStop = false;
    this.initArgsDef(obj, id, value, l, t, w, h, attr);

    if(!this.w1){
        this.w1 = this.w - this.w2;
    }

    if(!this.w2){
        this.w2 = this.w - this.w1;
    }


    this.initSkinEx = function(){

        if(!this.barRectH) this.barRectH = this.h;

        if(!this.progRectH) this.progRectH = this.h - 1;
        if(!this.valueW) this.valueW = (this.w > 50 ? 50 : this.w);

        var fi = this.frame.barRect;
        if(fi){

            fi.l = null;
            fi.t = null;
            fi.ol = 0;
            fi.ot = Math.floor((this.h - this.barRectH) / 2);
            fi.h = this.barRectH;
            fi.w = this.w - this.valueW;
        }

        fi = this.frame.progRect;

        if(fi){

            fi.l = null;
            fi.t = null;
            fi.ol = this.borderW;
            fi.ot = Math.floor((this.h - this.progRectH) / 2);
            fi.h = this.progRectH;
        }

    };

    this.initSkinDef(this.defSkin);
    this.initSkinEx();

    this.draw = function(){

        if(this.visibility > 0){
            var pos = this.getPosition();

            this.drawSkin(pos);
            this.drawProgValue(pos);
        }
    };

    /*barRect,progRect,background*/
    this.drawSkin = function(pos){
        var fro = this.frame;
        if(fro){

            if(fro.background){
                fro.background.draw(pos);
            }
            if(fro.barRect){
                fro.barRect.draw();
            }

            if(fro.progRect){
                if(this.value > this.maxValue){
                    this.value = this.maxValue;
                }
                fro.progRect.w = Math.floor((this.w - this.valueW - 2 * this.borderW) * this.value / this.maxValue);
                if(this.progRectMinWeight && fro.progRect.w < this.progRectMinWeight){
                    fro.progRect.w = 0;
                }
                if(fro.progRect.w > 0){
                    fro.progRect.draw();
                }


            }
        }
    };

    this.drawProgValue = function(pos){

        if(!this.notShowValue){
            var v = this.value;

            if(this.suffixValue){
                v += this.suffixValue;
            }

            this.ctx.font = this.font;
            this.ctx.fillStyle = this.color;
            this.ctx.textAlign = this.textAlign;

            var a = this.ctx.measureText(v);
            var xl = pos.l + pos.w - this.dl - a.width;
            var vy = pos.t + pos.h / 2 + this.dt + this.dt;

            this.ctx.fillText(v, xl, vy, pos.w);
        }
    };
}

UIProgress.prototype = new UIWm();

/*
value,pageValue,startValue
iconLen,scrollType,sliderW
skin name: barRect,slider,icon1,icon2
*/
function UIScrollBar(obj, id, value, l, t, w, h, attr){
    this.focusStop = false;
    this.initArgsDef(obj, id, value, l, t, w, h, attr);

    this.initSkinEx = function(){

        if(!this.pageValue) this.pageValue = 10;
        if(!this.startValue) this.startValue = 0;
        if(!this.value) this.value = 10;

        if(this.iconLen == null) this.iconLen = 0;

        if(!this.sliderW) this.sliderW = (this.scrollType == "H" ? this.h : this.w) - 2;

        var fi = this.frame.barRect;
        if(this.scrollType == "H"){

            var barW = this.w - 2 * this.iconLen;
            fi.w = barW;
            fi.h = this.h;
            fi.ol = this.iconLen;
            fi.ot = 0;
            fi.l = null;
            fi.t = null;

            fi = this.frame.slider;
            fi.l = null;
            fi.t = null;
            fi.h = this.sliderW;

            if(!this.fixLength){
                if(this.value > this.pageValue){
                    fi.w = Math.floor(barW * this.pageValue / this.value);
                } else {
                    fi.w = barW;
                }
            } else {
                if(this.fixLength > barW){
                    this.fixLength = barW;
                }

                fi.w = this.fixLength;
            }

            fi.ol = this.iconLen + Math.floor((barW - fi.w) * this.startValue / this.value);
            fi.ot = (this.h - fi.h) / 2;

            fi = this.frame.icon1;
            if(fi){
                fi.l = null;
                fi.t = null;
                fi.ol = 0;
                fi.ot = 0;
                fi.w = this.iconLen;
            }

            fi = this.frame.icon2;
            if(fi){
                fi.l = null;
                fi.t = null;
                fi.w = this.iconLen;
                fi.ol = this.w - this.iconLen;
                fi.ot = 0;
            }

        } else {
            var barH = this.h - 2 * this.iconLen;
            fi.h = barH;
            fi.w = this.w;
            fi.ot = this.iconLen;
            fi.l = null;
            fi.t = null;

            fi = this.frame.slider;

            fi.l = null;
            fi.t = null;
            fi.w = this.sliderW;

            if(!this.fixLength){
                if(this.value > this.pageValue){
                    fi.h = Math.floor(barH * this.pageValue / this.value);
                    //璁剧疆绾靛悜鏄剧ず镞讹紝濡傛灉璁＄畻鍑虹殑slider楂桦害澶皬锛屽垯浣跨敤璁剧疆镄勬渶灏忛佩搴︼紝鏀剧疆缁桦浘鍙桦舰
                    if(fi.h < this.sliderMinHeight){
                        fi.h = this.sliderMinHeight;
                    }
                } else {
                    fi.h = barH;
                }
            } else {

                if(this.fixLength > barH){
                    this.fixLength = barH;
                }
                fi.h = this.fixLength;
            }
            fi.ol = (this.w - fi.w) / 2;
            fi.ot = this.iconLen + Math.floor((barH - fi.h) * this.startValue / this.value);

            fi = this.frame.icon1;
            if(fi){
                fi.l = null;
                fi.t = null;
                fi.ol = 0;
                fi.ot = 0;
                fi.h = this.iconLen;
            }

            fi = this.frame.icon2;
            if(fi){
                fi.l = null;
                fi.t = null;
                fi.h = this.iconLen;
                fi.ol = 0;
                fi.ot = this.h - this.iconLen;
            }
        }
    };


    this.initSkinDef(this.defSkin);
    this.initSkinEx();

    this.updateSlider = function(){
        this.initSkinEx();
        //console.log("this.frame.slider.ol =" + this.frame.slider.ol);
    };

    this.draw = function(){

        if(this.visibility > 0){
            this.initSkinEx();
            this.drawSkin();
        }
    };

    //skin name: barRect,slider,icon1,icon2
    this.drawSkin = function(pos){

        var fro = this.frame;
        if(fro){

            if(fro.barRect){
                fro.barRect.draw();
            }
            if(fro.slider){
                fro.slider.draw();
            }

            if(fro.icon1){
                fro.icon1.draw();
            }
            if(fro.icon2){
                fro.icon2.draw();
            }
        }
    };
}

UIScrollBar.prototype = new UIWm();

/*
attr:lineRectWidth,lineHWidth,lineVWidth,lineColor,scrollWidth,cols,rows,rowsOnePage,color,focusColor,headUse,colWidthArr,scrollDl(scroll dl)
skin:evenBar,oddBar,normalBar,focusBar,headBar
vScroll:
*/

function UITable(obj, id, value, l, t, w, h, attr){

    this.dl = 10;
    this.dt = 0;
    this.cell = [];

    this.fullHline = true;

    this.textBaseline = "middle";
    if(!this.lineRectWidth) this.lineRectWidth = 1;
    if(!this.lineColor) this.lineColor = UI.color;
    if(!this.cols) this.cols = 1;
    if(!this.scrollWidth) this.scrollWidth = 0;
    if(!this.rowsOnePage) this.rowsOnePage = 10;

    this.listInit(0, 10, 0);

    this.initArgsDef(obj, id, value, l, t, w, h, attr);

    this.rows = 0;
    this.curIndex = 0;


    // this.h = this.rowsOnePage * Math.floor(this.h/this.rowsOnePage);

    this.colClipFlag = [];

    if(this.headUse){
        this.cell[0] = [];
    }

    this.initSkin = function(defSkin){
        if(!this.skin) this.skin = defSkin;
        if(this.skin){
            this.frame = {};
            var skin = this.skin;
            var frame = this.frame;

            var w = this.w;
            var h = this.h;

            var vNum = this.rowsOnePage;
            if(this.headUse) vNum++;

            var itemH = /*Math.floor*/(h / vNum) + (this.EnlargeV ? this.EnlargeV : 0);

            if(this.scrollWidth){
                w -= this.scrollWidth;
            }

            if(!skin.evenBar) skin.evenBar = skin.normalBar;
            if(skin.evenBar){
                frame.evenBar = new UIFrame(skin.evenBar, "", "", null, null, w, itemH);
                frame.evenBar.ol = 0;
                frame.evenBar.ot = (this.headUse ? itemH : 0);
                frame.evenBar.container = this;
            }

            if(!skin.oddBar) skin.oddBar = skin.evenBar;
            if(skin.oddBar){
                frame.oddBar = new UIFrame(skin.oddBar, "", "", null, null, w, itemH);
                frame.oddBar.ol = 0;
                frame.oddBar.ot = (this.headUse ? itemH * 2 : itemH);
                frame.oddBar.container = this;
            }

            if(!skin.headBar) skin.headBar = skin.evenBar;
            if(this.headUse && skin.headBar){
                frame.headBar = new UIFrame(skin.headBar, "", "", null, null, w, itemH);
                frame.headBar.ol = 0;
                frame.headBar.ot = 0;
                frame.headBar.container = this;
            }

            if(skin.selectBar){

                var focusH = itemH;
                if(this.focusEnlargeH){
                    w += this.focusEnlargeH;
                }

                if(this.focusEnlargeV){
                    focusH += this.focusEnlargeV;
                }

                frame.selectBar = new UIFrame(skin.selectBar, "", "", null, null, w, focusH);
                frame.selectBar.ol = (this.focusEnlargeH ? - this.focusEnlargeH / 2 : 0);
                frame.selectBar.ot = (this.headUse ? itemH : 0);
                frame.selectBar.container = this;
            }

            if(skin.focusBar){

                var focusH = itemH;

                if(this.focusEnlargeH){
                    w += this.focusEnlargeH;
                }

                if(this.focusEnlargeV){
                    focusH += this.focusEnlargeV;
                }

                frame.focusBar = new UIFrame(skin.focusBar, "", "", null, null, w, focusH);
                frame.focusBar.ol = (this.focusEnlargeH ? -this.focusEnlargeH / 2 : 0);
                frame.focusBar.ot = (this.headUse ? itemH : 0);
                frame.focusBar.container = this;
            }
            //hScroll:{param:"scrollBarClassV"},
            if(this.vScroll && this.scrollWidth > 0){
                var param = this.vScroll.param;
                if(typeof(param) == "string") param = this.res.saveItems[param];

                var sc = new UIScrollBar(param, (this.id + "hs" + this.rows),
                    0, null, null, this.scrollWidth, this.h, this.vScroll);

                sc.ol = this.w - this.scrollWidth;
                if(this.scrollDl){
                    sc.ol += this.scrollDl;
                }
                sc.container = this;
                sc.pageValue = this.rowsOnePage;
                sc.value = this.rows;

                this.sc = sc;
            }
        }
    };

    /*this.setSelectBar = function(selectBar){
        var w = this.w;
        var h = this.h;

        var vNum = this.rowsOnePage;
        if(this.headUse)vNum ++;

        var itemH = (h / vNum);

        console.log("init itemH=" + itemH);

        if(this.scrollWidth){
            w -= this.scrollWidth;
        }

        var frame = this.frame;

        var focusH = itemH;

        if(this.focusEnlargeH){
            w += this.focusEnlargeH;
        }

        if(this.focusEnlargeV){
            focusH += this.focusEnlargeV;
        }

        frame.focusBar = new UIFrame(selectBar, "", "", null, null, w, focusH);
        frame.focusBar.ol = 0;
        frame.focusBar.ot = (this.headUse?itemH:0);
        frame.focusBar.container = this;
    };
*/
    this.initSkin();

    this.first = true;
    this.draw = function(){

        var pos = this.getPosition();
        if(this.visibility > 0){
            this.drawSkin(pos);
            this.drawValue(pos);
            this.drawScroll();
        }
    };

    this.drawScroll = function(){
        if(this.vScroll){
            var sc = this.sc;
            if(sc){
                sc.draw();
            }
        }
    };

    this.drawSkin = function(pos){
        this.drawBars(pos);
        this.drawGrid(pos);

        if(this.focusEnlargeV && (this.onFocus == true || this.selectShow)){
            this.frame.focusBar.draw();
        }
    };

    this.drawBars = function(pos){
        var i;
        var ot;
        var frame = this.frame;

        var vNum = this.rowsOnePage;

        var pi = this.listGetIndexInPage();

        var ln = vNum;
        if(!this.fullHline){
            ln = this.listGetPageRange().num;
        }

        if(this.headUse){

            vNum++;
            ln++;

            console.log("this.listDown index=" + this.curIndex
                + ",page index=" + pi);

            for(i = 0; i < vNum && i < ln; i++){

                ot = /*Math.floor*/(i * pos.h / vNum);

                if(i == 0){
                    frame.headBar.draw();
                } else if((pi == i - 1) && this.rows > 0){

                    if(this.onFocus == true){
                        frame.focusBar.ot = (this.focusEnlargeV ? ot - this.focusEnlargeV / 2 : ot);

                        if(!this.focusEnlargeV){
                            frame.focusBar.draw();
                        }
                    }
                    else if(this.listGetIndex() == this.curIndex){
                        if(frame.selectBar){
                            frame.selectBar.ot = ot;
                            frame.selectBar.draw();
                        }
                    }

                }
                else {

                    if((i % 2) != 0){ //even
                        frame.evenBar.ot = ot;
                        frame.evenBar.draw();
                    } else { //odd
                        frame.oddBar.ot = ot;
                        frame.oddBar.draw();
                    }
                }
            }

        } else {
            for(i = 0; i < vNum; i++){

                ot = /*Math.floor*/(i * pos.h / vNum);

                if(pi == i && this.rows > 0){

                    if(this.onFocus == true){
                        frame.focusBar.ot = (this.focusEnlargeV ? ot - this.focusEnlargeV / 2 : ot);

                        if(!this.focusEnlargeV){
                            frame.focusBar.draw();
                        }

                    }
                    else if(this.listGetIndex() == this.curIndex){
                        if(frame.selectBar){
                            frame.selectBar.ot = ot;
                            frame.selectBar.draw();
                        }
                    }

                }
                else if((i % 2) == 0){ //even
                    if(frame.evenBar){
                        frame.evenBar.ot = ot;
                        frame.evenBar.draw();
                    }

                } else { //odd
                    if(frame.oddBar){
                        frame.oddBar.ot = ot;
                        frame.oddBar.draw();
                    }
                }
            }
        }
    };

    //cols,rowsOnePage,lineVW
    //colLength[]; rowHeight

    this.drawGrid = function(pos){

        var ctx = this.ctx;

        if(this.lineRectWidth){
            var h = pos.h;

            if(!this.fullHline){
                var ln = this.listGetPageRange().num + (this.headUse ? 1 : 0);
                h = ln * pos.h / (this.rowsOnePage + (this.headUse ? 1 : 0));
            }

            ctx.lineWidth = this.lineRectWidth;
            ctx.strokeStyle = this.lineColor;

            ctx.strokeRect(pos.l, pos.t, pos.w, h);
        }

        if(this.lineHWidth){
            var i;

            var itemH;
            var lineNum = (this.rowsOnePage - 1);
            var ln = lineNum;

            if(!this.fullHline){
                ln = this.listGetPageRange().num - 1;
            }

            if(this.headUse){
                lineNum++;
                ln++;
            }

            if(lineNum > 0 && this.lineHWidth > 0){

                ctx.lineWidth = this.lineHWidth;
                ctx.strokeStyle = this.lineColor;
                ctx.beginPath();

                for(i = 1; i <= lineNum && i <= ln; i++){
                    var t = pos.t + /*Math.floor*/((i * this.h) / (lineNum + 1));
                    ctx.moveTo(pos.l, t);
                    ctx.lineTo(pos.l + pos.w, t);
                }

                ctx.stroke();
            }

            lineNum = (this.cols - 1);

            if(lineNum > 0 && this.lineVWidth > 0){

                var itemW = this.colWidthArr;
                if(!itemW){
                    itemH = /*Math.floor*/((pos.w) / (lineNum + 1));
                }

                ctx.lineWidth = this.lineVWidth;
                ctx.strokeStyle = this.lineColor;
                ctx.beginPath();

                var l = pos.l;

                for(i = 1; i <= lineNum; i++){

                    l += (itemW ? itemW[i - 1] : itemH);

                    ctx.moveTo(l, pos.t);
                    ctx.lineTo(l, pos.t + pos.h);
                }
                ctx.stroke();
            }
        }
    };

    this.drawValue = function(pos){
        var i, j;

        var itemH;

        var rowNum = (this.rowsOnePage);

        if(this.headUse) rowNum++;

        var itemW0;
        var itemW = this.colWidthArr;
        if(!itemW){
            itemW0 = /*Math.floor*/((pos.w - -this.scrollWidth) / this.cols);
        }

        var t = pos.t;
        var w;

        var halfItemH = /*Math.floor*/(this.h / (2 * rowNum));

        this.ctx.font = this.font;
        this.ctx.fillStyle = this.color;
        this.ctx.textAlign = this.textAlign;
        this.ctx.textBaseline = this.textBaseline;

        var t0 = pos.t + this.dt;

        var pr = this.listGetPageRange();

        itemH = /*Math.floor*/(pos.h / rowNum) ;

        for(i = 0; i < rowNum && i < (this.headUse ? pr.num + 1 : pr.num); i++){
            t = t0 + /*Math.floor*/((i * this.h) / rowNum);

            var l = pos.l;

            var id = ((this.headUse && i == 0) ? 0 : pr.s + i);


            //表格失去焦点后后，当前行的内容颜色
            var idn = id;
            if(this.headUse){
                idn = id + 1;
            }

            if(this.LeaveFocusColor && this.onFocus == false){
                if(this.curIndex == idn){
                    this.ctx.fillStyle = this.LeaveFocusColor;
                } else {
                    this.ctx.fillStyle = this.color;
                }
            }

            //表格得到焦点后后，当前行的内容颜色
            var idx = id;
            if(this.headUse){
                idx = id - 1;
            }
            if(this.focusColor && this.onFocus == true){
                if(this.curIndex == idx){
                    this.ctx.fillStyle = this.focusColor;
                } else {
                    this.ctx.fillStyle = this.color;
                }
            }


            for(j = 0; j < this.cols; j++){

                w = (itemW ? itemW[j] : itemW0);
                l += this.dl;
                var w0 = w - this.dl;
                this.drawItemValue(this.cell[id][j], l, t, w0, itemH, halfItemH, this.colClipFlag[j]);

                l += w0;
            }
        }
    };

    this.setColClip = function(col, flag){
        this.colClipFlag[col] = flag;
    };

    this.setColWidthArr = function(colWidthArr){
        this.colWidthArr = colWidthArr;
    };


    this.drawCutText = function(v, x, y, w, h, halfH){

        /*var ctx = this.ctx;
         ctx.save();
         ctx.rect(x,y,w,h);
         ctx.clip();
         ctx.fillText(v,x,y + halfH);
         ctx.restore();
         */
        if(v.indexOf("\n") != -1)
        {
            var mh = 20;
            var strArray = v.split("\n");
            for(var i = 0; i < strArray.length;i++)
            {
                var mx = (w - UI.ctx.measureText(strArray[i]).width)/2 + x;
                this.ctx.fillText(strArray[i], mx, y + (halfH-mh/2) + i * mh);
            }
        }
        else
        {
            var textLength = this.ctx.measureText(v).width;
            var str = UI.cutStr(this.ctx, v, w);

            if(this.HAlign == "center")
            {
                var mx = (w - UI.ctx.measureText(str).width)/2 + x;
                this.ctx.fillText(str, mx, y + halfH);
            }
            else
            {
                this.ctx.fillText(str, x, y + halfH);
            }

        }


    };

    this.drawItemValue = function(v, x, y, w, h, halfH, clip){

        var T = typeof(v);

        if(T == "string"){

            if(clip){
                this.drawCutText(v, x, y, w, h, halfH);
            } else {
                if(this.HAlign == "center"){
                    var textLength = this.ctx.measureText(v).width;
                    if(textLength > w){
                        this.ctx.fillText(v, x, y + halfH, w);
                    } else {
                        var bx = x + (w - textLength) / 2;
                        this.ctx.fillText(v, bx, y + halfH, w);
                    }

                }
                else if(this.HAlign == "right"){
                    var textLength = this.ctx.measureText(v).width;
                    if(textLength > w){
                        this.ctx.fillText(v, x, y + halfH, w);
                    } else {
                        var bx = x + (w - textLength);
                        this.ctx.fillText(v, bx, y + halfH, w);
                    }

                } else {

                    this.ctx.fillText(v, x, y + halfH, w);
                }

            }

        } else if(T != "object"){
            if(clip){
                this.drawCutText("" + v, x, y, w, h, halfH);
            } else {
                this.ctx.fillText("" + v, x, y + halfH, w);
            }


        } else {

            if(v.type == "img"){

                var img;

                if(typeof(v.img) == "string"){
                    img = this.res.imgs[v.img];
                } else {
                    img = v.img;
                }

                if(!v.alignH) v.alignH = "left";
                if(!v.alignV) v.alignV = "center";

                var iw = img.width;
                var ih = img.height;

                if(v.alignH == "center"){
                    x += /*Math.floor*/((w - iw) / 2);
                } else if(v.alignH == "right"){
                    x += (w - iw);
                }

                if(v.alignV == "center"){
                    y += /*Math.floor*/((h - ih) / 2);
                } else if(v.alignV == "bottom"){
                    y += (h - ih);
                }

                this.ctx.drawImage(img, x, y, iw, ih);
            }
        }
    };

    this.defProc = function(e){

        var ret = false;

        if(e.keyCode == UI.KEY.UP){
            this.listUp();
            ret = true;
        } else if(e.keyCode == UI.KEY.DOWN){
            this.listDown();
            ret = true;
        } else if(e.keyCode == UI.KEY.PAGEUP){
            this.listPageUp();
            ret = true;
        } else if(e.keyCode == UI.KEY.PAGEDOWN){
            this.listPageDown();
            ret = true;
        }

        if(ret == true){
            var sc = this.sc;
            if(sc){
                sc.startValue = this.curIndex;
            }

            this.update();
            this.onkey({keyCode : UI.KEY.WM_VALUE_CHANGE, id : this.id, hwin : this});
        }

        return ret;
    };

    this.syncScroll = function(){
        var sc = this.sc;
        if(sc){
            sc.startValue = this.curIndex;
        }
    };

    this.setSelectIndex = function(index){
        if(typeof(index) == 'number'
            && index >= 0
            && index < this.cell.length){

            this.curIndex = index;
            this.syncScroll();
        }
    };

    this.setHeadCols = function(headArr){
        if(this.headUse){
            this.cell[0] = headArr;
        }
    };

    this.addItems = function(items){

        var off = this.cell.length;

        for(var i = 0; i < items.length; i++){
            this.cell[i + off] = items[i];
        }

        this.rows += items.length;
        if(this.sc){
            this.sc.value = this.rows;
        }
    };

    this.addRow = function(rowItems){
        var off = this.cell.length;
        this.cell[off] = rowItems;
        this.rows++;
        if(this.sc){
            this.sc.value = this.rows;
        }
    };

    this.removeItems = function(){

        var head;

        if(this.headUse){
            head = this.cell[0];
        }

        var sc = this.sc;
        if(sc){
            sc.value = this.rows;
            sc.startValue = 0;
        }

        this.rows = 0;
        this.curIndex = 0;
        this.cell = [];

        if(head){
            this.cell[0] = head;
        }
    };

    this.setItemValue = function(row, col, value){
        if(this.headUse){
            row++;
        }

        this.cell[row][col] = value;
    };

    this.getCurRow = function(){
        return this.curIndex;
    };

    this.getItemValue = function(row, col){

        return this.cell[row][col] = value;
    };

    this.getRowItems = function(id0){

        var row;

        if(id0 >= 0 && id0 < this.rows){
            row = this.cell[id0];
        } else {
            var id = this.curIndex;

            if(this.headUse){
                id++;
            }

            row = this.cell[id];
        }

        return row;
    };

    this.getRows = function(){
        return this.rows;
    };
}

UIPageList.prototype = new UIWm();
UITable.prototype = new UIPageList();
