console.log("uiCom  end" + (new Date()).getTime());

function Tvportal() {
    var self = this;

    self.isLock = false;
    /************UI参数定义区***********/
    var imgW = 184;
    var imgH = 161;
    var spaceH = 10;
    var spaceW = 2;
    var expandSize = 11;

    var left_l = 60;
    var left_t = 120;
    var left_w = (imgW * 3 + spaceW * 2);
    var left_h = (imgH * 3 + spaceH * 2);

    var right_l = left_l + left_w + 10;
    var right_t = left_t;
    var right_w = 560;
    var right_h = 315;

    this.preIndex = 0;
    this.curIndex = 0;
    this.curList = [];

    this.adModule = null;
    this.checkAdTimer = null;

    this.dlgParam = [
        {
            uiType: UIFrame,
            id: "tvPortalFrame",
            l: 0,
            t: 0,
            w: UI.width,
            h: UI.height,
            visibility:1,
            type: "block",
            color: "#202020"
        },
        {
            uiType: UIImg,
            id: "tvPortalImg",
            ol: 0,
            ot: 0,
            w: 1280,
            h: 720,
            stretch: "HV",
            visibility:-1,
            src: ""
        },
        {
            uiType: UIImg,
            id: "leftUpLogoImg",
            ol: left_l,
            ot: 40,
            h: left_t - 40,
            stretch: "H",
            src: "tvportal/BBTV_logo"
        },
        {
            uiType: UILabel,
            id: "tvPortalTimeLabel",
            ol: right_l + right_w / 2, ot: right_t / 2, w: 200, h: 30,
            font: uiCom.font.F20,
            color: "#F2F2F2",
            HAlign: "Left",
            value: ""
        },
        {
            uiType: UIImg, id: "tvPortalNetworkEthImg",
            ol: right_l + right_w / 2 + 200,
            ot: right_t / 2 - 10,
            src: "tvportal/icon_ethernet"
        },
        {
            uiType: UIImg, id: "tvportalPreviousImg",
            ol: left_l + left_w / 2 - 20,
            ot: left_t - 40,
            src: "tvportal/previous"
        },
        {
            uiType: UIImg,
            id: "tvportalNextImg",
            ol: left_l + left_w / 2 - 20,
            ot: left_t + left_h + 20,
            src: "tvportal/next"
        },
        {
            uiType: UIFrame,
            id: "tvshowAreaFrame",
            ol: right_l,
            ot: right_t,
            w: right_w,
            h: right_h ,
            type: "hole"
        },
        {
            uiType: UIImg,
            id: "tvshowAreaImg",
            ol: right_l,
            ot: right_t,
            w: right_w,
            h: right_h ,
            src: "",
            stretch: "HV",
            visibility: -1,
        },
        {
            uiType: UIImg,
            id: "staticAdImg",
            ol: right_l,
            ot: right_t + right_h  + right_h * 0.1,
            w: right_w,
            h: right_h * 0.5,
            src: "tvportal/AD_mainmenu",
            focusRectLineWidth: 10,
            focusRectLineColor: "#16A1FE",
            stretch: "HV"
        },
        {
            uiType: UIImg,
            id: "tvportalOkImg",
            ol: right_l + right_w / 2,
            ot: right_t + right_h*1.5 + 40,
            src: "tvportal/ok"
        },
        {
            uiType: UILabel,
            id: "tvportalOkLabel",
            ol: right_l + right_w / 2 + 60,
            ot: right_t + right_h*1.5 + 50,
            w: 100,
            h: 20,
            font: uiCom.font.F20,
            color: "#F2F2F2",
            HAlign: "left",
            value: Lp.getValue("Ok")
        },
        {
            uiType: UIImg,
            id: "tvportalLiveTvImg",
            ol: right_l + right_w / 2 + 150,
            ot: right_t + right_h*1.5 + 40,
            src: "tvportal/live_tv",

        },
        {
            uiType: UILabel,
            id: "tvportalLiveTvLabel",
            ol: right_l + right_w / 2 + 250,
            ot: right_t + right_h*1.5 + 50,
            w: 100,
            h: 20,
            font: uiCom.font.F20,
            color: "#F2F2F2",
            HAlign: "left",
            value: Lp.getValue("leave")
        }
    ];


    /************页面创建基本操作区***********/
    this.initLayout = function () {

        self.leftParam = [
            {
                uiType: UIFrame,
                id: "leftParamFrame",
                l: left_l,
                t: left_t,
                w: left_w,
                h: left_h,
                type: "none"
            }
        ];

        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                var item = {
                    uiType: UIImg,
                    id: "img" + (i * 3 + j),
                    ol: (imgW + spaceW) * j,
                    ot: (imgH + spaceH) * i,
                    w: imgW,
                    h: imgH,
                    src: "",
                    stretch: "HV",
                    focusAddSize: expandSize,
                };
                self.leftParam.push(item);
            }
        }
    };

    this.open = function () {
        this.initLayout();
        this.defOpen();
        this.leftDlg = UI.createGroup(self.leftParam, "leftDlg", self.win);


    };

    this.start = function () {
        console.log("tvportal start" + (new Date()).getTime());
        utility.setled(2,1);
        utility.setled(0,0);
        self.getAppList();

        var apptvportal = appCom.getAppByName("tvportal");

        console.log("apptvportal="+apptvportal.icon_url);
        if(apptvportal && apptvportal.icon_url && apptvportal.icon_url!="")
        {
            var img = new Image();
            console.log("apptvportal.icon_url="+apptvportal.icon_url);
            img.src = apptvportal.icon_url;
            img.onload=function()
            {
                self.win.getChild("tvPortalFrame").visibility = -1;
                self.win.getChild("tvPortalImg").setSrc(img);
                self.win.getChild("tvPortalImg").visibility = 1;
                self.win.update();
            }
        }

        var returnid = sysCom.getMemConfig("returnid");
        console.log("start=============>returnid="+returnid);
        if (returnid) {
            console.log("enter=============>returnid="+returnid);
            self.curIndex = self.getIndexByAppId(sysCom.getMemConfig("returnid"));
            console.log(" self.returnid="+ sysCom.getMemConfig("returnid"));
            console.log(" self.curIndex="+ self.curIndex);
            sysCom.setMemConfig("returnid",0);
        }
       else if (sysCom.getMemConfig("last_app_id")) {
            self.curIndex = self.getIndexByAppId(sysCom.getMemConfig("last_app_id"));
           console.log(" self.last_app_id="+ sysCom.getMemConfig("last_app_id"));
            console.log(" self.curIndex="+ self.curIndex);
        }
        self.initPortalBylist();
        self.setFocusIcon();
        self.startUpdateTime();
        self.updateTimeTask();
        //self.win.update();
        self.checkLoadTimer = setInterval(function () {
            if (self.Check9Img()) {
                self.win.update();
                clearInterval(self.checkLoadTimer);
            }
        }, 100);

        setTimeout(function () {

            var ch = dtvCom.getBarkerChannel();
            if(!ch){
                return;
            }
            var ret = Epg.epgGetPf(ch.tsId,ch.oriNetworkId,ch.serviceId,false);
            var pf = epgCom.getPfFormat(ret,ch);

            var l = false;
            if(pf && pf.length > 0){
                l = lockCom.checkAllLock(ch,pf[0].level);
            }
            else{
                l = lockCom.checkAllLock(ch,0);
            }


            if(!l){
                self.playBarker();
            }
            else{
                self.videoStatus.eventLock = true;
                self.setVideoImg(self.getDisplayAreaImg());
                self.isLock = true;
            }


         //   sysCom.setMemConfig("current_app_id", appCom.getAppByName("tvportal").app_id);
        }, 300);


    this.playBarker = function(){
            dtvCom.playBarkerChannel(function () {
                var rect = {
                    l: 636,
                    t: 120,
                    w: 560,
                    h: 315
                };
                var r = getVideoRect(rect, sysCom.config.Reslution);
                dtvCom.mp.mpSetVideoSize(r.l, r.t, r.w, r.h, false);
            });
        };
        this.registerCb();

        this.startAd();

        this.getEthImg().hide();

        console.log("tvportal end" + (new Date()).getTime());
    };

    this.close = function () {
        this.defClose();

    };

    this.stop = function () {
        dtvCom.stop();
        clearInterval(self.checkAdTimer);
        self.checkAdTimer = null;
    };

    this.onkey = function (e) {
        var ret = true;
        console.log("tvportal keyCode:" + e.keyCode);
        switch (e.keyCode) {
            case UI.KEY.UP:
                self.onkeyUp();
                break;
            case UI.KEY.DOWN:
                self.onkeyDown();
                break;
            case UI.KEY.LEFT:
                self.onkeyLeft();
                break;
            case UI.KEY.RIGHT:
                self.onkeyRight();
                break;
            case UI.KEY.ENTER:
                self.onkeyEnter();
                break;
            case UI.KEY.BACKSPACE:
                self.onkeyBack();
                break;
            case UI.KEY.FUNBLUE:
                self.adModule.onkey(e);
                break;
            case UI.KEY.FUNYELLOW:
                if(self.isLock){
                    self.showPasswdDialog();
                }
                break;
            default:
                ret = false;
                break;
        }
        return ret;
    };



    /************页面元素获取区***********/
    this.getImgById1 = function (id) {
        if (id < 3) {
            return self.leftDlg1.getChild("img" + id);
        }
        else if (id < 6) {
            return self.leftDlg2.getChild("img" + id);
        }
        else if (id < 9) {
            return self.leftDlg3.getChild("img" + id);
        }
    };

    this.getImgById = function (id) {
        return self.leftDlg.getChild("img" + id);
    };

    this.getTimeLabel = function () {
        return self.win.getChild("tvPortalTimeLabel");
    };

    this.getWifiImg = function () {
        return self.win.getChild("tvPortalNetworkWifiImg");
    };

    this.getEthImg = function () {
        return self.win.getChild("tvPortalNetworkEthImg");
    };

    this.getDisplayAreaImg = function () {
        return self.win.getChild("tvshowAreaImg");
    };

    this.getLogoImg = function () {
        return self.win.getChild("leftUpLogoImg");
    };

    this.getStaticAdImg = function () {
        return self.win.getChild("staticAdImg");
    };

    this.getOkImg = function () {
        return self.win.getChild("tvportalOkImg");
    };

    this.getOkLabel = function () {
        return self.win.getChild("tvportalOkLabel");
    };

    /************移动控制区***********/


    this.getAppList = function () {
        var curId = sysCom.getMemConfig("current_app_id");
        var lp = appCom.getLinkPointByAppId(curId);
        self.curList = appCom.getAppListByLinkPonit(lp);
        if (!self.curList || self.curList.length == 0) {

            var curId = appCom.getAppByName("tvportal").app_id;
            console.log("tvportal id = "+curId);
            sysCom.setMemConfig("current_app_id", curId);
            sysCom.setMemConfig("last_app_id", curId);

            var lp = appCom.getLinkPointByAppId(curId);
            self.curList = appCom.getAppListByLinkPonit(lp);
        }
        console.log("self.curList:" + self.curList.length);
    };

    this.getIndexByAppId = function (id) {
        for (var i = 0; i < self.curList.length; i++) {
            if (self.curList[i].app_id == id) {
                return i;
            }
        }
        return 0;
    };

    this.isHasImg = function (ImgObj) {
        if (ImgObj == null)
            return true;
        if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
            return true;
        } else {
            return false;
        }
    };

    this.Check9Img = function () {
        var index = self.curIndex >= 0 ? self.curIndex : self.preIndex;
        var page = parseInt(index / 9, 10);
        for (var i = 0 + page * 9; i < 9 + page * 9; i++) {
            var item = self.getImgById(i % 9);
            if (i < self.curList.length) {

                if (self.isHasImg(self.curList[i].IconSrc) == false) {
                    return false;
                }
            }
            else {

            }
        }
        return true;
    };

    this.initPortalBylist = function () {
        var index = self.curIndex >= 0 ? self.curIndex : self.preIndex;
        var page = parseInt(index / 9, 10);
        for (var i = 0 + page * 9; i < 9 + page * 9; i++) {
            var item = self.getImgById(i % 9);
            if (i < self.curList.length) {
                if(self.isHasImg(self.curList[i].IconSrc))
                   item.setSrc(self.curList[i].IconSrc);
                item.visibility = 1;
            }
            else {
                item.visibility = -1;
            }
        }
    };

    this.setFocusIcon = function () {
        if (self.curIndex >= 0) {
            self.getImgById(self.curIndex % 9).setFocus(true);
        }
        else {
            self.getStaticAdImg().setFocus(true);
        }
    };


    this.onkeyUp = function () {
        if (self.curIndex < 0) {
            return;
        }
        //判断是否在最上面一行
        if (self.curIndex - 3 < 0) {
            var a = parseInt(self.curList.length / 3, 10);
            var b = self.curList.length % 3;
            if (b == 0) {
                self.preIndex = self.curIndex;
                self.curIndex = 3 * (a - 1) + self.curIndex;
            }
            else {
                self.preIndex = self.curIndex;
                if (self.curIndex <= (b - 1)) {
                    self.curIndex = 3 * a + self.curIndex;
                }
                else {
                    self.curIndex = 3 * a + b - 1;
                }
            }
        }
        else {
            self.preIndex = self.curIndex;
            self.curIndex -= 3;
        }

        self.moveUpdate();
    };

    this.onkeyDown = function () {
        if (self.curIndex < 0) {
            return;
        }
        //判断是否在最后一行
        if (self.curIndex + 3 >= self.curList.length) {
            if (parseInt(self.curIndex / 3, 10) == parseInt(self.curList.length / 3, 10)) {
                self.preIndex = self.curIndex;
                self.curIndex = 0;
            }
            else {
                self.preIndex = self.curIndex;
                self.curIndex = self.curList.length - 1;
            }
        }
        else {
            self.preIndex = self.curIndex;
            self.curIndex += 3;
        }

        self.moveUpdate();
    };

    this.onkeyLeft = function () {

        //判断焦点是否在广告上
        if (self.curIndex < 0) {
            self.curIndex = self.preIndex;
        }
        //判断焦点是否在第一个应用上
        else if (self.curIndex == 0) {
            self.preIndex = self.curIndex;
            self.curIndex = self.curList.length - 1;
        }
        else {
            self.preIndex = self.curIndex;
            self.curIndex -= 1;
        }

        self.moveUpdate();
    };

    this.onkeyRight = function () {
        if (self.curIndex < 0) {
            return;
        }

        //判断是否跳到广告
        if (self.checkIsJumpToAd()) {
            self.preIndex = self.curIndex;
            self.curIndex = -1;
        }
        else {
            self.preIndex = self.curIndex;
            self.curIndex += 1;
        }
        self.moveUpdate();
    };

    this.onkeyCHNUP = function () {

    };

    this.onkeyCHNDOWN = function () {

    };

    this.onkeyEnter = function () {
        if (self.curIndex >= 0) {
            var app = self.curList[self.curIndex];
            if (app.category == 1) {

                if (appCom.getAppListByLinkPonit(app.link_point).length <= 0) {
                    return;
                }




                //check adult
                if(app.launch_app_name=="adultf") {

                    self.showAdultPasswdDialog();
                    return;
                }
                /////////////////
                var last_app_id = sysCom.getMemConfig("current_app_id");
                sysCom.setMemConfig("last_app_id", last_app_id);
                sysCom.setMemConfig("current_app_id", app.app_id);



                self.preIndex = 0;
                self.curIndex = 0;
                self.curList = [];
                self.getAppList();
                self.initPortalBylist();
                self.setFocusIcon();
                self.win.update();
            }

            if (app.category == 2) {
                appCom.goAppByID(app.app_id);
            }
        }
        else {
            self.adModule.onkey({keyCode: UI.KEY.ENTER});
        }
    };

    function handleLinkPoint(linkPoint) {
        var lpArray = new Array();
        if (linkPoint) {
            lpArray = linkPoint.split(":");
        }

        lpArray.forEach(function (data, index, arr) {
            arr[index] = parseInt(data, 10);
        });
        return lpArray;
    }

    this.onkeyBack = function () {
        var current_app_id = sysCom.getMemConfig("current_app_id");
        var lp = appCom.getLinkPointByAppId(current_app_id);
        if (lp != "0") {
            var last_app_id = sysCom.getMemConfig("last_app_id");
            sysCom.setMemConfig("current_app_id", last_app_id);
            self.preIndex = 0;
            self.curList = [];
            self.getAppList();
            self.curIndex = self.getIndexByAppId(current_app_id);
            console.log("curIndex:" + self.curIndex);
            self.initPortalBylist();
            self.setFocusIcon();
            self.win.update();
        }
    };


    this.moveUpdate = function () {
        self.initPortalBylist();
        self.addTurnPageEffect(function () {
            self.addFocusEffect();
            self.setFocusIcon();
            self.win.update();
        });
    };

    this.checkIsJumpToAd = function () {
        if (self.curIndex == self.curList.length - 1) {
            return true;
        }
        else if ((self.curIndex + 1) % 9 == 0 && self.curIndex != 0) {
            return true;
        }
        return false;
    };

    this.addPreEffect = function () {
        if (self.preIndex == self.curIndex) {
            return;
        }
        setTimeout(function () {
            var item = self.getImgById(self.preIndex % 9);
            var ScaleIn = {
                type: "Scale",
                w0: imgW + expandSize,
                h0: imgH + expandSize,
                "position": "center",
                duration: 100
            };
            item.setEffect(ScaleIn, false);
        }, 10);
    };

    this.addFocusEffect = function () {
        if (self.curIndex < 0) {
            return;
        }

        var item = self.getImgById(self.curIndex % 9);
        var ScaleOut = {
            type: "Scale",
            w1: imgW + expandSize / 2,
            h1: imgH + expandSize / 2,
            "position": "center",
            duration: 100
        };
        item.setEffect(ScaleOut, false);
    };

    this.addTurnPageEffect = function (cb) {
        var step = 0;
        if (self.curIndex < 0) {
            step = 0;
        }
        else {
            var a = parseInt(self.curIndex / 9, 10);
            var b = parseInt(self.preIndex / 9, 10);
            if (a != b && a > b) {
                step = 1;
            }

            if (a != b && a < b) {
                step = -1;
            }

        }
        //step < 0   up      step > 0  down     step == 0  no
        if (step < 0) {
            var SlideDown = {type: "Slide", y0: left_t - left_h, y1: left_t, duration: 100, visibility: 1};
            self.leftDlg.setEffect(SlideDown, cb);
        }
        else if (step > 0) {
            var SlideUp = {type: "Slide", y0: left_t + left_h, y1: left_t, duration: 100, visibility: 1};
            self.leftDlg.setEffect(SlideUp, cb);
        }
        else {
            cb();
        }
    };


    /************tvportal Time更新区***********/
    this.startUpdateTime = function () {
        self.stopUpdateTime();
        self.updateTimer = setInterval(self.updateTimeTask, 1000 * 10);
    };


    this.stopUpdateTime = function () {
        if (self.updateTimer) {
            clearInterval(self.updateTimer);
            self.updateTimer = null;
        }
    };


    this.updateTimeTask = function () {
        self.getTimeLabel().value = self.getTvportalTime();
        //this.getEthImg().hide();
        self.updateEthStatus();
        self.win.update();
    };

    this.getTvportalTime = function () {
        var date = new Date();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var week = date.getDay();
        var hour = date.getHours();
        var min = date.getMinutes();

        month = (month < 10) ? "0" + month : "" + month;
        day = (day < 10) ? "0" + day : "" + day;
        hour = (hour < 10) ? "0" + hour : "" + hour;
        min = (min < 10) ? "0" + min : "" + min;
        var str = month + "/" + day + "(" + Lp.getValue("w" + week) + ")" + hour + ":" + min;
        return str;
    };
    /************tvportal 网络状态更新区***********/

    this.addNetworkListener = function () {

    };

    this.updateWifiStatus = function () {

    };

    this.updateEthStatus = function () {

        var cminfo = CableModem.cmGetIpInfo(false);
        console.log("cminfo="+cminfo)
        if(cminfo) {
           if(cminfo.online==12)
           {
               console.log("updateEthStatus icon_ethernet")
               this.getEthImg().setSrc( "tvportal/icon_ethernet");
               this.getEthImg().show();

           }
           else
           {
               //this.getEthImg().hide();
               console.log("updateEthStatus icon_ethernet_warning 1")
               this.getEthImg().setSrc("tvportal/icon_ethernet_warning");
               this.getEthImg().show();
           }
        }
        else {
           // this.getEthImg().hide();
            console.log("updateEthStatus icon_ethernet_warning 2")
            this.getEthImg().setSrc("tvportal/icon_ethernet_warning");
            this.getEthImg().show();
        }
    };


    /*************************EPG  视频区域操作*************************/
    this.videoStatus = {
        "noSign": false,
        "noCard": false,
        "noCertification": false,
         "eventLock": false
    };

    this.registerCb = function () {
        //signal
        eventCom.registerCallback(1, function (obj) {
            if (obj.code == eventCom.EVENTCODE.CS_EVT_DVB_SIGNAL_LOST) {
                self.videoStatus.noSign = true;
            }
            else {
                self.videoStatus.noSign = false;
            }
            self.setVideoImg(self.getDisplayAreaImg());
        });
    };


    /**
     * 设置视频窗口的提示图片显示
     * @param win
     */
    this.setVideoImg = function (win) {
        if (self.videoStatus.noSign) {
            win.visibility = 1;
            win.setSrc("TipImg/noSign");
            win.update();
            return;
        }
        if (self.videoStatus.noCard) {
            win.visibility = 1;
            win.setSrc("TipImg/no_smartCard");
            win.update();
            return;
        }
        if (self.videoStatus.noCertification) {
            win.visibility = 1;
            win.setSrc("TipImg/no_certification");
            win.update();
            return;
        }
         if (self.videoStatus.eventLock) {
                     win.visibility = 1;
            win.setSrc("TipImg/EPG_eventLocked");
            win.update();
            return;
        }
        win.visibility = -1;
        win.update();
    };

    /************tvportal 广告控制区***********/
    this.startAd = function () {
        self.checkAdTimer = setInterval(function () {
            if (dsmssCom.adStatus == "4") {
                console.log("tvportal ad start!");
                clearInterval(self.checkAdTimer);
                self.checkAdTimer = null;
                var str = dsmssCom.getAdXml(CA.caGetZipCode(false));

                var p = {
                    dat: str,
                    url: dsmssCom.getAdBasePath(CA.caGetZipCode(false)),    //广告文件文件夹路径
                    block: "portal",   //广告窗口位置:"portal","epg","miniepg"
                    win: self.win,  //父窗口
                    adWin: self.getStaticAdImg()     //广告子窗口
                };
                self.adModule = new AD(p);
                self.adModule.start();
            }
        }, 1000);
    };


    /************tvportal 商标控制区***********/


    /************tvportal 主题切换控制区***********/
     this.showPasswdDialog = function(){
        var p = {
            win : self.win,
            rightPasswd : sysCom.config.ParentalPin,
            proc : self.passwdProc,
            rightDo : self.passwdCb
        };
        self.passwdDlg = new PasswdDialog(p);
        self.passwdDlg.show();
    };

    this.showAdultPasswdDialog = function(){
        var p = {
            win : self.win,
            rightPasswd : sysCom.config.ParentalPin,
            proc : self.passwdProc,
            rightDo : self.adultpasswdCb
        };
        self.passwdDlg = new PasswdDialog(p);
        self.passwdDlg.show();
    };

    this.closePasswdDialog = function(){
        if(self.passwdDlg){
            self.passwdDlg.close(true);
            self.passwdDlg = null;
        }
    };

    this.adultpasswdCb = function(){

        var app = self.curList[self.curIndex];
        var last_app_id = sysCom.getMemConfig("current_app_id");
        sysCom.setMemConfig("last_app_id", last_app_id);
        sysCom.setMemConfig("current_app_id", app.app_id);



        self.preIndex = 0;
        self.curIndex = 0;
        self.curList = [];
        self.getAppList();
        self.initPortalBylist();
        self.setFocusIcon();
        self.win.update();
    };
    this.passwdCb = function(){

        self.videoStatus.eventLock = false;
        self.setVideoImg(self.getDisplayAreaImg());
        //播放频道
        self.playBarker();
        self.isLock = false;
    };

    this.passwdProc = function(e){
        var ret = true;
        switch(e.keyCode){
            /*直播按键   不处理
             *主页按键   不处理
             *音量键     不处理
             *静音键     不处理
             *其他按键   处理
            */
            case UI.KEY.ENTER:
                self.passwdDlg.onkeyReturn();
                break;
            case UI.KEY.BACKSPACE:
                self.closePasswdDialog();
                break;
            default:
                ret = true;
                break;
        }
        return ret;
    };

}

Tvportal.prototype = UIModule.baseModule;
