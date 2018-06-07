/**
 * Created by 2017-07-03
 */

function EpgPage(params, srcModule){
    var self = this;

    var timer = null;
    var chTimer = null;
    var epgTimer = null;
    self.checkAdTimer = null;
    self.passwdDlg = null;
    self.hasUnlock = false;
    /*************************EPG  UI界面参数定义区*************************/

    this.dlgParam = [
        {
            uiType : UIFrame,
            id : "epgBk",
            l : 0,
            t : 0,
            w : UI.width,
            h : UI.height,
            type : "img",
            imgNames : ["epg/epg_background.jpg"],
            stretch : "HV",
            focusMoveMode : "circle"
        },
        {
            uiType : UILabel,
            id : "epgTitle",
            ol : (UI.width - 300) / 2,
            ot : 60,
            w : 300,
            h : 30,
            value : Lp.getValue("epg_program_list"),
            font : uiCom.font.F30,
            HAlign : "center"
        },
        {
            uiType : UILabel,
            id : "epgTime",
            ol : 1000,
            ot : 60,
            w : 200,
            h : 30,
            value : "",
            font : uiCom.font.F20,
            HAlign : "left",
            color : "grey"
        },

        //num input
        {
            uiType : UILabel,
            id : "numInputLabel",
            ol : 1130,
            ot : 60,
            w : 100,
            h : 30,
            value : " - - -",
            font : uiCom.font.F20,
            HAlign : "left",
            color : "grey"
        },

        //video
        {
            uiType : UIImg,
            id : "videoFrame",
            ol : 55 + 187,
            ot : 116,
            w : 340,
            h : 188,
            src : "epg/video_frame",
            stretch : "HV",
            focusStop : false
        },
        {
            uiType : UIFrame,
            id : "videoContent",
            ol : 55 + 187 + 8,
            ot : 116 + 8,
            w : 340 - 16,
            h : 188 - 16,
            type : "hole"
        },
        {
            uiType : UIImg,
            id : "videoLock",
            ol : 55 + 187 + 8,
            ot : 116 + 8,
            w : 340 - 16,
            h : 188 - 16,
            stretch : "HV",
            src : ""
        },

        //ad
        {
            uiType : UIImg,
            id : "adFrame",
            ol : 55 + 180 + 350,
            ot : 116,
            w : 640,
            h : 188,
            src : "epg/ad_frame",
            stretch : "HV"
        },
        {
            uiType : UIImg,
            id : "adImg",
            ol : 55 + 180 + 366,
            ot : 116 + 13,
            w : 640 - 30,
            h : 188 - 55,
            src : "epg/AD_sanple",
            stretch : "HV"
        },

        {
            uiType : UILabel, id : "tips", ol : 55 + 187 + 350 + 10, ot : 118 + 185 - 40, w : 510, h : 40,
            value : "", font : uiCom.font.F20, color : "#96b4be", HAlign : "left"
        }
    ];


    UI.ctx.font = uiCom.font.F20;
    var space = 40;
    var navL1 = 200;
    var navL2 = navL1 + 50 + 5 + UI.ctx.measureText(Lp.getValue("epg_nav_summary")).width + space;
    var navL3 = navL2 + 25 + 5 + UI.ctx.measureText(Lp.getValue("epg_nav_remind_view")).width + space;
    var navL4 = navL3 + 25 + 5 + UI.ctx.measureText(Lp.getValue("epg_nav_remind_channel")).width + space;
    var navL5 = navL4 + 25 + 5 + UI.ctx.measureText(Lp.getValue("epg_nav_record")).width + space;
    var navL6 = navL5 + 25 + 5 + UI.ctx.measureText(Lp.getValue("epg_nav_lock")).width + space;

    this.nav1Param = [
        {uiType : UIFrame, id : "nav1Frame", l : 55, t : 643, w : 1172, h : 60, type : "none"},
        {
            uiType : UIImg,
            id : "Img1",
            ol : navL1,
            ot : 20,
            w : 50,
            h : 20,
            src : "epg/ico_ok",
            stretch : "HV",
            focusStop : false
        },
        {
            uiType : UILabel,
            id : "Lab1",
            ol : navL1 + 50 + 5,
            ot : 27,
            w : UI.ctx.measureText(Lp.getValue("epg_nav_summary")).width,
            h : 20,
            value : Lp.getValue("epg_nav_summary"),
            font : uiCom.font.F20,
            HAlign : "left",
            color : "#96b4be"
        },

        {
            uiType : UIImg,
            id : "Img2",
            ol : navL2,
            ot : 20,
            w : 25,
            h : 20,
            src : "epg/ico_red",
            stretch : "HV",
            focusStop : false
        },
        {
            uiType : UILabel,
            id : "Lab2",
            ol : navL2 + 25 + 5,
            ot : 27,
            w : UI.ctx.measureText(Lp.getValue("epg_nav_remind_view")).width,
            h : 20,
            value : Lp.getValue("epg_nav_remind_view"),
            font : uiCom.font.F20,
            HAlign : "left",
            color : "#96b4be"
        },

        {
            uiType : UIImg,
            id : "Img3",
            ol : navL3,
            ot : 20,
            w : 25,
            h : 20,
            src : "epg/ico_green",
            stretch : "HV",
            focusStop : false
        },
        {
            uiType : UILabel,
            id : "Lab3",
            ol : navL3 + 25 + 5,
            ot : 27,
            w : UI.ctx.measureText(Lp.getValue("epg_nav_remind_channel")).width,
            h : 20,
            value : Lp.getValue("epg_nav_remind_channel"),
            font : uiCom.font.F20,
            HAlign : "left",
            color : "#96b4be"
        },
        {
            uiType : UIImg,
            id : "Img4",
            ol : navL4,
            ot : 20,
            w : 25,
            h : 20,
            src : "epg/ico_REC",
            stretch : "HV",
            focusStop : false
        },
        {
            uiType : UILabel,
            id : "Lab4",
            ol : navL4 + 25 + 5,
            ot : 27,
            w : UI.ctx.measureText(Lp.getValue("epg_nav_record")).width,
            h : 20,
            value : Lp.getValue("epg_nav_record"),
            font : uiCom.font.F20,
            HAlign : "left",
            color : "#96b4be"
        },

        {
            uiType : UIImg,
            id : "Img5",
            ol : navL5,
            ot : 20,
            w : 25,
            h : 20,
            src : "epg/ico_yellow",
            stretch : "HV",
            focusStop : false
        },
        {
            uiType : UILabel,
            id : "Lab5",
            ol : navL5 + 25 + 5,
            ot : 27,
            w : UI.ctx.measureText(Lp.getValue("epg_nav_lock")).width,
            h : 20,
            value : Lp.getValue("epg_nav_lock"),
            font : uiCom.font.F20,
            HAlign : "left",
            color : "#96b4be"
        },

        {
            uiType : UIImg,
            id : "Img6",
            ol : navL6,
            ot : 20,
            w : 50,
            h : 20,
            src : "epg/ico_back",
            stretch : "HV",
            focusStop : false
        },
        {
            uiType : UILabel,
            id : "Lab6",
            ol : navL6 + 50 + 5,
            ot : 27,
            w : UI.ctx.measureText(Lp.getValue("epg_nav_last")).width,
            h : 20,
            value : Lp.getValue("epg_nav_last"),
            font : uiCom.font.F20,
            HAlign : "left",
            color : "#96b4be"
        }
    ];

    UI.ctx.font = uiCom.font.F20;
    var space1 = 40;
    var nav1L1 = 350;
    var nav1L2 = nav1L1 + 50 + 5 + UI.ctx.measureText(Lp.getValue("epg_nav_remind_channel")).width + space1;
    var nav1L3 = nav1L2 + 25 + 5 + UI.ctx.measureText(Lp.getValue("epg_nav_lock")).width + space1;
    this.nav2Param = [
        {uiType : UIFrame, id : "nav2Frame", l : 55, t : 643, w : 1172, h : 60, type : "none"},

        {
            uiType : UIImg,
            id : "1Img1",
            ol : nav1L1,
            ot : 20,
            w : 25,
            h : 20,
            src : "epg/ico_green",
            stretch : "HV",
            focusStop : false
        },
        {
            uiType : UILabel,
            id : "1Lab1",
            ol : nav1L1 + 25 + 5,
            ot : 27,
            w : UI.ctx.measureText(Lp.getValue("epg_nav_remind_channel")).width,
            h : 20,
            value : Lp.getValue("epg_nav_remind_channel"),
            font : uiCom.font.F20,
            HAlign : "left",
            color : "#96b4be"
        },

        {
            uiType : UIImg,
            id : "1Img2",
            ol : nav1L2,
            ot : 20,
            w : 25,
            h : 20,
            src : "epg/ico_yellow",
            stretch : "HV",
            focusStop : false
        },
        {
            uiType : UILabel,
            id : "1Lab2",
            ol : nav1L2 + 25 + 5,
            ot : 27,
            w : UI.ctx.measureText(Lp.getValue("epg_nav_lock")).width,
            h : 20,
            value : Lp.getValue("epg_nav_lock"),
            font : uiCom.font.F20,
            HAlign : "left",
            color : "#96b4be"
        },

        {
            uiType : UIImg,
            id : "1Img3",
            ol : nav1L3,
            ot : 20,
            w : 50,
            h : 20,
            src : "epg/ico_back",
            stretch : "HV",
            focusStop : false
        },
        {
            uiType : UILabel,
            id : "1Lab3",
            ol : nav1L3 + 50 + 5,
            ot : 27,
            w : UI.ctx.measureText(Lp.getValue("epg_nav_last")).width,
            h : 20,
            value : Lp.getValue("epg_nav_last"),
            font : uiCom.font.F20,
            HAlign : "left",
            color : "#96b4be"
        }
    ];


    /*************************EPG  标准页面函数定义*************************/
    this.open = function(){
        this.defOpen();
        this.nav1Dlg = UI.createGroup(this.nav1Param, "tbDlg1", this.win);
        this.nav1Dlg.visibility = -1;

        this.nav2Dlg = UI.createGroup(this.nav2Param, "tbDlg2", this.win);
        this.vlockDlg = self.win.getChild("videoLock");
        this.vlockDlg.visibility = -1;
        this.createTb();
        this.addTableData();
        self.manualUpdateShc();
        this.channelListTb.setFocus(true);
        this.titleDlg = self.win.getChild("epgTime");
        this.tipsDlg = self.win.getChild("tips");
        this.addRecrdSelectWin();
        this.addRecordCancelWin();
        this.registerCb();
        console.log("EPGPage open");
    };

    this.close = function(){
        this.defClose();
        console.log("EPGPage close");
    };

    this.checkCurrentLock = function(){
        var level = 0;
        var pfArray = epgCom.getChannelPf(dtvCom.chs[sysCom.config.chIndex], false);
        if(pfArray && pfArray.length == 2){
            level = pfArray[0].level
        }
        var flag = lockCom.checkAllLock(dtvCom.chs[sysCom.config.chIndex], level);
        return flag;
    };

    this.start = function(){
        setTimeout(function(){
            if(!self.checkCurrentLock()){
                dtvCom.changeCh(null, 0);
            }
            else{
                self.videoStatus.eventLock = true;
                self.setVideoImg(self.win.getChild("videoLock"));
            }

            var rect = {
                l:250,
                t:120,
                w:326,
                h:180
            };
            var r = getVideoRect(rect,sysCom.config.Reslution);
            dtvCom.mp.mpSetVideoSize(r.l, r.t, r.w, r.h, false);
            self.openTimer();
            self.updateTips();
        }, 300);

        this.startAd();
    };

    this.stop = function(){
        dtvCom.stop();
        self.closeTimer();
        console.log("EPGPage stop:");
    };

    this.onkey = function(e){
        var ret = false;
        console.log("In EPGPage module keyCode =" + e.keyCode);
        switch(e.keyCode){
            case UI.KEY.ENTER:
                break;
            case UI.KEY.LEFT:
                break;
            case UI.KEY.RIGHT:
                break;
            case UI.KEY.UP:
                break;
            case UI.KEY.DOWN:
                break;
            case UI.KEY.BACKSPACE:
                appCom.goAppByName("tvportal",true);
                break;
            //输入亲子锁
            case UI.KEY.FUNYELLOW:
                self.showPasswdDialog();
                break;
            //进入预约列表
            case UI.KEY.FUNGREEN:
                //this.go(ReminderList,EpgPage,null,"hide");
                this.go(ReminderList);
                break;
            case UI.KEY.FUNBLUE:
                self.adModule.onkey(e);
                break;
            case UI.KEY.CHAR0:
            case UI.KEY.CHAR1:
            case UI.KEY.CHAR2:
            case UI.KEY.CHAR3:
            case UI.KEY.CHAR4:
            case UI.KEY.CHAR5:
            case UI.KEY.CHAR6:
            case UI.KEY.CHAR7:
            case UI.KEY.CHAR8:
            case UI.KEY.CHAR9:
                self.inputNum(e.keyCode - 48);
                break;
            case UI.KEY.EPG:

                break;
        }
        return ret;
    };

    /*************************EPG  广告*************************/
    this.startAd = function()
    {
        self.checkAdTimer = setInterval(function(){
            if(dsmssCom.adStatus == "4")
            {
                console.log("epg ad start!");
                clearInterval(self.checkAdTimer);
                self.checkAdTimer = null;

                var str = dsmssCom.getAdXml(CA.caGetZipCode(false));
                var p = {
                    dat:str,
                    url: dsmssCom.getAdBasePath(CA.caGetZipCode(false)),    //广告文件文件夹路径
                    block: "epg",   //广告窗口位置:"portal","epg","miniepg"
                    win: self.win,  //父窗口
                    adWin:self.win.getChild("adImg")     //广告子窗口
                };
                self.adModule = new AD(p);
                self.adModule.start();
            }
        },1000);
    };

    /*************************EPG  定时刷新区域*************************/

    this.manualUpdateShc = function(){
        var ch = self.getCurrentCh();
        var date = self.getCurrentDate();
        if(!ch){
            console.log("openTitleTimer  ch");
        }
        if(!date){
            console.log("openTitleTimer date");
        }
        if(ch && date){

            epgCom.getChannelSchDirect(ch, date, self.addTableData4);
        }
    };

    this.openTimer = function(){
        self.titleDlg.value = self.formatTitleDate(new Date());
        timer = setInterval(function(){
            self.titleDlg.value = self.formatTitleDate(new Date());
            self.addTableData3(true);
            self.manualUpdateShc();
        }, 1000 * 10);
    };

    this.closeTimer = function(){
        if(timer != null){
            clearInterval(timer);
            timer = null;
        }

        clearInterval(self.checkAdTimer);
        self.checkAdTimer = null;
    };
    /*************************EPG  亲子锁操作*************************/
    this.getCurrentDate = function(){
        var curWeekItem = self.wkTb.getRowItems(self.wkTb.curIndex);
        if(curWeekItem){
            return curWeekItem[1];
        }
        return null;
    };

    this.getCurrentCh = function(){
        var ch = null;
        if(self.channelTb.rows <= 0){
            ch = null;
        }
        else {
            var curChItem = self.channelTb.getRowItems(self.channelTb.curIndex);
            ch = curChItem[1];
        }
        return ch;
    };

    this.getCurrentShc = function(){
        var shc = null;
        if(self.channelTb.rows <= 0 || self.shcTb.rows <= 0){
            shc = null;
        }
        else {
            shc = self.shcTb.getRowItems(self.shcTb.curIndex);
        }
        return shc;
    };

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

    this.closePasswdDialog = function(){
        if(self.passwdDlg){
            self.passwdDlg.close(true);
            self.passwdDlg = null;
        }
    };

    this.passwdCb = function(){
        var level = self.getCurrentShc() ? self.getCurrentShc()[4].level : 0;
        lockCom.unLockCallback(dtvCom.chs[sysCom.config.chIndex],level);
        self.videoStatus.eventLock = false;
        self.setVideoImg(self.win.getChild("videoLock"));
        self.hasUnlock = true;
        //播放频道
        self.doChangeCh(null, 0, true);
        //epg 重新加载
        self.addTableData4();
        self.updateTips();
        self.afterUnlockUpdateNav();
    };

    this.passwdProc = function(e){
        console.log("epg PasswdOnkey Keycode:" + e.keyCode);
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
    /*************************EPG  视频区域操作*************************/
    this.videoStatus = {
        "noSign":false,
        "eventLock":false,
        "noCard":false,
        "noCertification":false,
        "isRadio":false
    };

    this.registerCb = function(){
        //signal
        eventCom.registerCallback(1,function(obj){
            if(obj.code == eventCom.EVENTCODE.CS_EVT_DVB_SIGNAL_LOST)
            {
                self.videoStatus.noSign = true;
            }
            else
            {
                self.videoStatus.noSign = false;
            }
            self.setVideoImg(self.win.getChild("videoLock"));
        });
        eventCom.registerCallback(3,function(obj){
            if(obj.code == eventCom.EVENTCODE.CS_EVT_CA_SHOW_MESSAGE)
            {
                self.caMsgDlg.show({msgid:obj.data.msgId});
                //no card
                if(obj.data.msgId == 0x03){
                    self.videoStatus.noCard = true;
                }
                else if(obj.data.msgId == 0x09){
                    self.videoStatus.noCertification = true;
                }
                self.setVideoImg(self.win.getChild("videoLock"));
            }

        });
    };

    /**
     * 设置视频窗口的提示图片显示
     * @param win
     */
    this.setVideoImg = function(win)
    {
        if(self.videoStatus.noSign)
        {
            win.visibility = 1;
            win.setSrc("TipImg/EPG_noSign");
            win.update();
            return;
        }
        if(self.videoStatus.eventLock)
        {
            win.visibility = 1;
            win.setSrc("TipImg/EPG_eventLocked");
            win.update();
            return;
        }
        if(self.videoStatus.noCard)
        {
            win.visibility = 1;
            win.setSrc("TipImg/EPG_no_smartCard");
            win.update();
            return;
        }
        if(self.videoStatus.noCertification)
        {
            win.visibility = 1;
            win.setSrc("TipImg/EPG_no_certification");
            win.update();
            return;
        }
        if(self.videoStatus.isRadio)
        {
            win.visibility = 1;
            win.setSrc("TipImg/DBC_background_picture");
            win.update();
            return;
        }

        win.visibility = -1;
        win.update();
    };

    /*************************EPG  频道播放操作*************************/
    this.doChangeCh = function(){
        var ch = self.getCurrentCh();
        //变更当前节目号
        dtvCom.updateIndex(ch.idn,null);
        var isLock = self.checkCurrentLock();
        if(isLock && !self.hasUnlock){
            //停止播台
            dtvCom.mp.mpStop();
            //视频区域显示提示
            self.videoStatus.eventLock = true;
            self.setVideoImg(self.win.getChild("videoLock"));
        }
        else {
            var level = 0;
            var pfArray = epgCom.getChannelPf(dtvCom.chs[sysCom.config.chIndex], false);
            if(pfArray && pfArray.length == 2){
                level = pfArray[0].level
            }
            lockCom.unLockCallback(ch,level);
            //真换台
            dtvCom.doChangeCh(true, null);
            //视频区域显示提示
            self.videoStatus.eventLock = false;
            self.setVideoImg(self.win.getChild("videoLock"));
        }

    };

    this.changeChannel = function(){
        self.manualUpdateShc();

        if(self.channelTb.rows <= 0){
            return;
        }

        if(chTimer){
            clearTimeout(chTimer);
            chTimer = null;
        }

        chTimer = setTimeout(function(){
            self.doChangeCh();
            chTimer = null;
        }, 300);
    };

    /*************************EPG  广告显示操作*************************/
    this.updateTips = function(){
        if(self.channelTb.rows <= 0){
            self.tipsDlg.value = "";
            return;
        }

        var curChitem = self.channelTb.getRowItems(self.channelTb.curIndex);

        var shc = self.getCurrentShc();
        var shcStr = "";
        if(shc){
            shcStr = shc[0];
        }
        self.tipsDlg.value = curChitem[0] + "  " + shcStr;

    };

    /*************************EPG  数字键换台操作*************************/
    this.numInputArray = new Array();
    this.numInputTimer = null;
    this.inputNum = function(num){

        self.stopNumInputTimer();

        self.numInputArray.push("" + num);
        if(self.numInputArray.length >= 3){
            //openTimer 100ms
            self.openNumInputTimer(200);
        }
        else {
            //openTimer  2000ms
            self.openNumInputTimer(2000);
        }

        //update  UI
        self.updateNumInputUI();

    };

    this.updateNumInputUI = function(){
        var label = self.win.getChild("numInputLabel");
        var str = "";
        if(self.numInputArray.length == 0){
            str = " -" + " -" + " -";
        }
        else if(self.numInputArray.length == 1){
            str = " -" + " -" + " " + self.numInputArray[0];
        }
        else if(self.numInputArray.length == 2){
            str = " -" + " " + self.numInputArray[0] + " " + self.numInputArray[1];
        }
        else if(self.numInputArray.length == 3){
            str = " " + self.numInputArray[0] + " " + self.numInputArray[1] + " " + self.numInputArray[2];
        }
        label.value = str;
        self.win.update();
    };

    this.updateNumInputTableFocus = function(){
        var num = self.getNum();
        var index = self.getCurListIndexByNum(num);
        if(index >= 0){
            self.channelTb.curIndex = index;
            self.addTableData4();
            self.win.update();
        }
    };

    this.getNum = function(){
        var num = parseInt(self.numInputArray.join(""), 10);
        return num;
    };

    this.getCurListIndexByNum = function(num){
        //初始化 频道数据
        var listrows = self.channelListTb.getRowItems(self.channelListTb.curIndex);
        //得到分类列表的下标
        var listIndex = listrows[1];
        for(var i = 0; i < dtvCom.chl[listIndex].chs.length; i++){
            if(dtvCom.chl[listIndex].chs[i].idn == num){
                return i;
            }
        }
        return -1;
    };

    this.openNumInputTimer = function(timeout){
        self.numInputTimer = setTimeout(function(){
            var num = self.getNum();
            if(self.getCurListIndexByNum(num) >= 0){
                console.log("Input ch num:" + num + "   change Success!!!");
                //update  focus
                self.updateNumInputTableFocus();

                self.changeChannel();
            }
            else {
                console.log("Input ch num:" + num + "   change error!!!");
            }
            self.numInputTimer = null;
            self.numInputArray = new Array();
            self.updateNumInputUI();
        }, timeout);
    };

    this.stopNumInputTimer = function(){
        if(self.numInputTimer){
            clearTimeout(self.numInputTimer);
            self.numInputTimer = null;
        }
    };

    /*************************EPG  工具函数区*************************/

    //return   " 03/02(一) "
    this.formatWeekDate = function(date){
        var wkArray = ["日", "一", "二", "三", "四", "五", "六"];
        var month = (date.getMonth() + 1) >= 10 ? "" + (date.getMonth() + 1) : "0" + (date.getMonth() + 1);
        var day = date.getDate() >= 10 ? "" + date.getDate() : "0" + date.getDate();
        var week = wkArray[date.getDay()];

        return (month + "/" + day + "(" + week + ")");
    };

    //return  03/02  19:31
    this.formatTitleDate = function(date){
        var month = (date.getMonth() + 1) >= 10 ? "" + (date.getMonth() + 1) : "0" + (date.getMonth() + 1);
        var day = date.getDate() >= 10 ? "" + date.getDate() : "0" + date.getDate();
        var hour = date.getHours() >= 10 ? "" + date.getHours() : "0" + date.getHours();
        var minute = date.getMinutes() >= 10 ? "" + date.getMinutes() : "0" + date.getMinutes();

        return (month + "/" + day + " " + hour + ":" + minute);
    };
    /*************************EPG  输入密码框之后,导航栏的改变*************************/
    this.afterUnlockUpdateNav = function(){
        self.nav1Dlg.getChild("Img5").visibility=-1;
        self.nav1Dlg.getChild("Lab5").visibility=-1;
        self.nav1Dlg.getChild("Img6").ol = navL5;
        self.nav1Dlg.getChild("Lab6").ol = navL5 + + 50 + 5;

        self.nav2Dlg.getChild("1Img2").visibility=-1;
        self.nav2Dlg.getChild("1Lab2").visibility=-1;
        self.nav2Dlg.getChild("1Img3").ol = nav1L2;
        self.nav2Dlg.getChild("1Lab3").ol = nav1L2 + 50 + 5;

        self.win.update();
    };

    /*************************EPG  焦点在EPG列表时,导航栏*************************/
    this.updateNav1 = function(){

        var shc = self.getCurrentShc();
        if(shc && reservationCom.checkReserved(shc[4].rawData)){
            self.nav1Dlg.getChild("Lab2").value = Lp.getValue("epg_nav_cancel_remind");
        }
        else {
            self.nav1Dlg.getChild("Lab2").value = Lp.getValue("epg_nav_remind_view");
        }

    };

    /*************************EPG  第一列：分类列表（数据+操作）*************************/
    //添加频道列表分类数据
    this.addTableData1 = function(){
        //初始化 节目列表分类数据
        var data1 = [];
        for(var i = 1; i < dtvCom.chl.length; i++){
            data1[i - 1] = new Array();
            data1[i - 1][0] = dtvCom.chl[i].name;
            //保存一个节目分类列表的下标
            data1[i - 1][1] = i;
        }
        self.channelListTb.removeItems();
        self.channelListTb.addItems(data1);
    };


    //节目分类table
    this.proc1 = function(e){
        var ret = true;
        switch(e.keyCode){
            case UI.KEY.LEFT:
                //wk  get focus
                if(self.channelTb.rows <= 0){
                }
                else {
                    self.wkTb.setFocus(true);
                }

                break;
            case UI.KEY.RIGHT:
                //ch get focus
                if(self.channelTb.rows <= 0){
                }
                else {
                    self.channelTb.setFocus(true);
                }

                break;
            case UI.KEY.CHNUP:
                //scroll
                self.channelListTb.listPageUp();
                //change ch data
                self.addTableData2();
                //change epg data
                self.addTableData4();
                //change tips
                self.updateTips();
                //change channel
                self.changeChannel();
                break;
            case UI.KEY.CHNDOWN:
                //scroll
                self.channelListTb.listPageDown();
                //change ch data
                self.addTableData2();
                //change epg data
                self.addTableData4();
                //change tips
                self.updateTips();
                //change channel
                self.changeChannel();
                break;
            case UI.KEY.UP:
                //scroll
                self.channelListTb.listUp();
                //change ch data
                self.addTableData2();
                //change epg data
                self.addTableData4();
                //change tips
                self.updateTips();
                //change channel
                self.changeChannel();
                break;
            case UI.KEY.DOWN:
                //scroll
                self.channelListTb.listDown();
                //change ch data
                self.addTableData2();
                //change epg data
                self.addTableData4();
                //change tips
                self.updateTips();
                //change channel
                self.changeChannel();
                break;
            default:
                ret = false;
                break;
        }
        if(ret){
            self.win.update();
        }
        return ret;
    };

    /*************************EPG  第二列：频道列表（数据+操作）*************************/
    //添加 频道数据
    this.addTableData2 = function(){
        //初始化 频道数据
        var listrows = self.channelListTb.getRowItems(self.channelListTb.curIndex);
        //得到分类列表的下标
        var listIndex = listrows[1];
        var data2 = [];
        var cIndex = -1;
        for(var i = 0; i < dtvCom.chl[listIndex].chs.length; i++){
            data2[i] = new Array();
            data2[i][0] = " " + dtvCom.chl[listIndex].chs[i].idn + "  " + dtvCom.chl[listIndex].chs[i].name;
            //保存一个节目
            data2[i][1] = dtvCom.chl[listIndex].chs[i];
            data2[i][2] = null;
            //让当前播放频道，定位成table焦点
            if(dtvCom.chs[sysCom.config.chIndex].idn == dtvCom.chl[listIndex].chs[i].idn){
                cIndex = i;
            }
        }
        self.channelTb.removeItems();
        self.channelTb.addItems(data2);
        if(cIndex >= 0){
            self.channelTb.curIndex = cIndex;
        }
    };

    //channel table proc
    this.proc2 = function(e){
        var ret = true;
        switch(e.keyCode){
            case UI.KEY.LEFT:
                //chl get focus
                self.channelListTb.setFocus(true);
                break;
            case UI.KEY.RIGHT:
                //epg get foucs
                if(self.shcTb.rows <= 0){
                    self.wkTb.setFocus(true);
                }
                else {
                    self.shcTb.setFocus(true);
                    self.nav2Dlg.visibility = -1;
                    self.nav1Dlg.visibility = 1;
                }
                break;
            case UI.KEY.UP:
                //scroll
                self.channelTb.listUp();
                //change epg data
                self.addTableData4();
                //change tips
                self.updateTips();
                //change channel
                self.changeChannel();
                break;
            case UI.KEY.DOWN:

                //scroll
                self.channelTb.listDown();
                //change epg data
                self.addTableData4();
                //change tips
                self.updateTips();
                //change channel
                self.changeChannel();

                break;
            case UI.KEY.CHNDOWN:
                //scroll
                self.channelTb.listPageUp();
                //change epg data
                self.addTableData4();
                //change tips
                self.updateTips();
                //change channel
                self.changeChannel();
                break;
            case UI.KEY.CHNUP:
                //scroll
                self.channelTb.listPageDown();
                //change epg data
                self.addTableData4();
                //change tips
                self.updateTips();
                //change channel
                self.changeChannel();
                break;
            default:
                ret = false;
                break;
        }
        if(ret){
            self.win.update();
        }
        return ret;
    };
    /*************************EPG  第三列：Week列表（数据+操作）*************************/
    //添加星期数据
    this.addTableData3 = function(refreshIndex){
        var saveIndex = 0;
        if(refreshIndex){
            saveIndex = self.wkTb.curIndex;
        }
        //初始化 星期数据
        var data4 = [];
        for(var i = 0; i < 7; i++){
            var date = new Date();
            date.setDate(date.getDate() + i);
            data4[i] = new Array();
            data4[i][0] = self.formatWeekDate(date);
            data4[i][1] = date;
        }
        self.wkTb.removeItems();
        self.wkTb.addItems(data4);
        if(refreshIndex){
            self.wkTb.curIndex = saveIndex;
        }
    };

    //week table proc
    this.proc3 = function(e){
        var ret = true;
        switch(e.keyCode){
            case UI.KEY.LEFT:
                //epg get focus
                if(self.shcTb.rows <= 0){
                    self.channelTb.setFocus(true);
                }
                else {
                    self.shcTb.setFocus(true);
                    self.nav2Dlg.visibility = -1;
                    self.nav1Dlg.visibility = 1;
                }

                break;
            case UI.KEY.RIGHT:
                //week get focus
                self.channelListTb.setFocus(true);
                break;
            case UI.KEY.UP:
                // scroll
                self.wkTb.listUp();
                self.addTableData4();
                //change tips
                self.updateTips();
                break;
            case UI.KEY.DOWN:
                //scroll
                self.wkTb.listDown();
                self.addTableData4();
                //change tips
                self.updateTips();
                break;
            default:
                ret = false;
                break;
        }
        if(ret){
            self.win.update();
        }
        return ret;
    };

    /*************************EPG  第四列：EPG列表（数据+操作）*************************/
    //添加EPG数据
    /*
    * refresh:是否更新table index,true:不更新, false:恢复默认0
    * */
    this.addTableData4 = function(refresh, shc, ch, date){
        if(self.channelTb.rows <= 0){
            self.shcTb.removeItems();
            return;
        }

        var saveIndex = 0;
        if(refresh){
            saveIndex = self.shcTb.curIndex;
        }

        var shcDay = [];
        var curChannelItem = self.channelTb.getRowItems(self.channelTb.curIndex);
        var curWeekItem = self.wkTb.getRowItems(self.wkTb.curIndex);

        //自动更新分支
        if(shc && ch && date)
        {
            //判断频道以及日期是否与当前一致,一致则更新
            if(ch.idn != curChannelItem[1].idn)
            {
                return;
            }

            if(date.getYear() != curWeekItem[1].getYear() ||
                date.getMonth() != curWeekItem[1].getMonth() ||
                date.getDay() != curWeekItem[1].getDay()){
                return;
            }

            shcDay = shc;
        }
        else {
            //设置当前时间
            curWeekItem[1].setHours((new Date()).getHours(), (new Date()).getMinutes(), (new Date()).getSeconds());

            shcDay = epgCom.getChannelSch(curChannelItem[1], curWeekItem[1]);
        }


        var data3 = [];
        for(var i = 0; i < shcDay.length; i++)
        {
            data3[i] = new Array();
            //数组第一位：table上要显示的epg信息
            var isLock = lockCom.checkAllLock(curChannelItem[1], shcDay[i].rawData.level);
            if(!isLock || self.hasUnlock) //检查锁
            {
                data3[i][0] = shcDay[i].str;
            }
            else{
                data3[i][0] = formatTime2(shcDay[i]["startDate"], shcDay[i]["endDate"]) + "  " + Lp.getValue("epg_lock_msg");
            }

            //数组第二位: 是否为预约节目
            if(reservationCom.checkReserved(shcDay[i].rawData))
            {
                data3[i][1] = {type : "img", img : "epg/ico_clock"};
            }
            else {
                data3[i][1] = "";
            }

            //数组第三位: 是否为录制节目
            var e = recordSchCom.checkEpgRecord(shcDay[i].rawData);

            if(!e){
                data3[i][2] = "";
            }
            else if(e.status)
            {
                data3[i][2] = {type : "img", img : "epg/ico_recording"};
            }
            else if(e.type == recordSchCom.recordType.SINGLE)
            {
                data3[i][2] = {type : "img", img : "epg/ico_once_record"};
            }
            else if(e.type == recordSchCom.recordType.SERIAL)
            {
                data3[i][2] = {type : "img", img : "epg/ico_series_record_byTime"};
            }

            //数组第四位: 显示节目的等级
            data3[i][3] = {type : "img", img : getEpgImgByRate(shcDay[i].rawData.level)};

            //数组第四位: 存储此频道当前日期下的所有epg信息
            data3[i][4] = shcDay[i].rawData;
        }
        self.shcTb.removeItems();

        self.shcTb.addItems(data3);

        if(refresh){
            self.shcTb.curIndex = saveIndex;
        }

        self.updateNav1();

        self.win.update();
    };

    //epg table proc
    this.proc4 = function(e){
        var ret = true;
        switch(e.keyCode){
            case UI.KEY.LEFT:
                self.channelTb.setFocus(true);
                self.nav2Dlg.visibility = 1;
                self.nav1Dlg.visibility = -1;
                break;
            case UI.KEY.RIGHT:
                self.wkTb.setFocus(true);
                self.nav2Dlg.visibility = 1;
                self.nav1Dlg.visibility = -1;
                break;
            case UI.KEY.UP:
                self.shcTb.listUp();
                self.updateNav1();
                //change tips
                self.updateTips();
                break;
            case UI.KEY.DOWN:
                self.shcTb.listDown();
                self.updateNav1();
                //change tips
                self.updateTips();
                break;
            case UI.KEY.CHNUP:
                //scroll
                self.shcTb.listPageUp();
                self.updateTips();
                break;
            case UI.KEY.CHNDOWN:
                //scroll
                self.shcTb.listPageDown();
                self.updateTips();
                break;
            case UI.KEY.FUNRED:
                self.proc4OnkeyRed();
                break;
            case UI.KEY.RECORD:
                self.proc4OnkeyRecord();
                break;
            case UI.KEY.CHAR1:
                self.getEventSize();
                break;
            case UI.KEY.FUNBLUE:
                recordSchCom.print();
                break;
            case UI.KEY.ENTER:
                self.showDetail();
                break;
            default:
                ret = false;
                break;
        }
        if(ret){
            self.win.update();
        }
        return ret;
    };

    /*************************EPG  列表创建区*************************/
    this.addTableData = function()
    {
        this.addTableData1();
        this.addTableData2();
        this.addTableData3();
        this.addTableData4();
    };

    this.createTb = function(){
        //第一列
        var clTb_l = 55;
        var clTb_t = 118;
        var clTb_w = 180;
        var clTb_h = 522;
        this.channelListTb = new UITable("null", "channelListTb", null, clTb_l, clTb_t, clTb_w, clTb_h,// ol ot w h
            {
                headUse : false, font : uiCom.font.F20, cols : 1, rowsOnePage : 5, HAlign : "center", color : "#96b4be",
                lineVWidth : 0, lineHWidth : 0, lineRectWidth : 0, LeaveFocusColor : "white", focusColor : "white",
                skin : {
                    selectBar : {type : "img", imgNames : ["epg/channelGroup_markselected"], stretch : "HV"},
                    focusBar : {type : "img", imgNames : ["epg/channelGroup_selected"], stretch : "HV"}
                }
            }
        );

        this.channelListTb.attach(self.win);
        this.channelListTb.proc = self.proc1;


        //第二列
        var chTb_l = 55 + 180 + 7;
        var chTb_t = 118 + 185;
        var chTb_w = 340;
        var chTb_h = 522 - 185;
        this.channelTb = new UITable("null", "channelTb", null, chTb_l, chTb_t, chTb_w, chTb_h,// ol ot w h
            {
                headUse : false,
                font : uiCom.font.F20,
                cols : 1,
                rowsOnePage : 7,
                color : "#96b4be",
                lineVWidth : 0,
                lineHWidth : 0,
                lineRectWidth : 0,
                LeaveFocusColor : "white",
                focusColor : "white",
                HAlign : "left",
                skin : {
                    selectBar : {type : "img", imgNames : ["epg/channelList_markselected"], stretch : "HV"},
                    focusBar : {type : "img", imgNames : ["epg/channelList_selected"], stretch : "HV"}
                }
            }
        );

        this.channelTb.attach(self.win);
        //this.channelTb.setColWidthArr([this.channelTb.w*0.9]);
        this.channelTb.setColClip(0, true);
        this.channelTb.setColClip(1, true);
        this.channelTb.proc = self.proc2;
        //this.channelTb.addItems(data2);

        //第三列
        var shcTb_l = 55 + 187 + 350;
        var shcTb_t = 118 + 185;
        var shcTb_w = 510;
        var shcTb_h = 522 - 185;
        this.shcTb = new UITable("null", "shcTb", null, shcTb_l, shcTb_t, shcTb_w, shcTb_h,// ol ot w h
            {
                headUse : false,
                font : uiCom.font.F20,
                cols : 4,
                rowsOnePage : 7,
                color : "#96b4be",
                lineVWidth : 0,
                lineHWidth : 0,
                lineRectWidth : 0,
                LeaveFocusColor : "white",
                focusColor : "white",
                HAlign : "left",
                skin : {
                    selectBar : {type : "img", imgNames : ["epg/epgList_markselected"], stretch : "HV"},
                    focusBar : {type : "img", imgNames : ["epg/epgList_selected"], stretch : "HV"}
                }
            }
        );
        this.shcTb.setColWidthArr([this.shcTb.w * 0.77, this.shcTb.w * 0.06, this.shcTb.w * 0.06, this.shcTb.w * 0.06]);
        this.shcTb.attach(self.win);
        this.shcTb.setColClip(0, true);
        this.shcTb.setColClip(1, true);
        this.shcTb.proc = self.proc4;
        //this.shcTb.addItems(data3);


        //第四列
        var wkTb_l = 55 + 187 + 350 + 515;
        var wkTb_t = 118 + 185;
        var wkTb_w = 118;
        var wkTb_h = 522 - 185;
        this.wkTb = new UITable("null", "wkTb", null, wkTb_l, wkTb_t, wkTb_w, wkTb_h,// ol ot w h
            {
                headUse : false, font : uiCom.font.F20, cols : 1, rowsOnePage : 7, HAlign : "center", color : "#96b4be",
                lineVWidth : 0, lineHWidth : 0, lineRectWidth : 0, LeaveFocusColor : "white", focusColor : "white",
                skin : {
                    selectBar : {type : "img", imgNames : ["epg/weeklyDate_markselected"], stretch : "HV"},
                    focusBar : {type : "img", imgNames : ["epg/weeklyDate_selected"], stretch : "HV"}
                }
            }
        );
        this.wkTb.attach(self.win);
        this.wkTb.proc = self.proc3;
        //this.wkTb.addItems(data4);
        //this.win.setFocus(true);
    };
    /*************************EPG   预约收视*************************/
    this.proc4OnkeyRed = function() {
        var shc = self.getCurrentShc();
        if(reservationCom.checkReserved(shc[4])) {
            console.log("removeReservation");
            self.removeReservation();
        }
        else {
            console.log("addReservation");
            self.addReservation();
        }
    };
    this.addReservation = function() {
        var ch = self.getCurrentCh();
        var shcing = self.getCurrentShc();

        var schedObj= reservationCom.checkConflict(shcing[4]);
        if(reservationCom.checkExpiration(shcing[4])) {
            //弹窗通知预约收视已过期
            //提示用户
            var p1 = {
                title: Lp.getValue("tips"),
                textok: Lp.getValue("OK"),
                textno: Lp.getValue("Cancel"),
                timeout:10*1000,
                background: "../cview_app_common_pic/password_bg.png",
                dia_ImgOK: "../cview_app_common_pic/ico_ok.png",
                dia_ImgNO: "../cview_app_common_pic/ico_back.png",
                okfun: function () {

                },
                nofun: function () {
                }
            };

            var p2 = {
                text:Lp.getValue("remind_expired")
            };
            var dia = new Dialog(p1);
            dia.show(p2);
            return;
        }

        if(schedObj) {
            console.log("new Reservation:"+JSON.stringify(shcing[4]));
            console.log("old Reservation:"+JSON.stringify(schedObj));
            var params = {
                title:Lp.getValue("remind_conflict"),
                okText:Lp.getValue("Ok"),
                backText:Lp.getValue("Cancel"),
                okIcon:"../cview_app_common_pic/ico_ok.png",
                backIcon:"../cview_app_common_pic/ico_back.png",
                text1:Lp.getValue("remind_conflict_ask_str"),
                newTips:Lp.getValue("new_remind_conflict"),
                oldTips:Lp.getValue("old_remind_conflict"),
                newItem:null,
                oldItem:null,
                okfun: function () {
                    console.log("ok");
                },
                nofun: function () {
                    console.log("no");
                }
            };
            params.newItem = self.getReservationConflictItem(shcing[4]);
            params.oldItem = [];
            params.oldItem.push(self.getReservationConflictItem(schedObj));
            //设置冲突列表弹窗参数
            params.okfun = function(){
                reservationCom.delete(schedObj);
                reservationCom.add(shcing[4]);
                self.addTableData4(true);
            };
            //弹出冲突列表
            var dia = new RecordingConflictDialog();
            dia.show(params);
            return;
        }
        else{
            reservationCom.add(shcing[4]);
            self.addTableData4(true);
        }
    };
    this.removeReservation = function(){
        var shc = self.getCurrentShc();

        if(reservationCom.checkReserved(shc[4]))
        {
            reservationCom.delete(shc[4]);
        }

        self.addTableData4(true);
    };
    this.getReservationConflictItem = function(et){
        var item = {
            dateStr:"",
            timeStr:"",
            chName:"",
            schName:"",
            type:""
        };
        var startDate = getEpgStartDate(et.startTime);
        var endDate = getEpgEndDate(startDate,et.duration);
        item.dateStr = formatWeekDate(startDate);
        item.timeStr = formatTime2(startDate,endDate);
        item.chName = et.ch.name;
        item.schName = et.name;
        return item;
    };
    /*************************EPG  预约窗口管理*************************/
    UI.res.set("epgRecordSelectButton", {
        skin : {
            normal : {type : "img", imgNames : ["epg/popUp_itemBg_normal"], stretch : "HV"},
            focus : {type : "img", imgNames : ["epg/popUp_itemBg_highlight"], stretch : "HV"}
        }
    });

    this.recordSelectParams = [
        {
            uiType : UIFrame,
            id : "recordSelectFrame",
            ol : 570,
            ot : 500,
            w : 302,
            h : 162,
            type : "img",
            imgNames : ["epg/pop_up_bg_302x162"],
            stretch : "HV",
            focusMoveMode : "circle",
            visibility : -1
        },
        {
            uiType : UIButton,
            id : "singleBt",
            ol : 10,
            ot : 15,
            w : 280,
            h : 46,
            styleClass : "epgRecordSelectButton",
            value : Lp.getValue("remind_single_record"),
            dt : 7,
            focusColor : "white",
            font : uiCom.font.F20
        },
        {
            uiType : UIButton,
            id : "serialBt",
            ol : 10,
            ot : 85,
            w : 280,
            h : 46,
            styleClass : "epgRecordSelectButton",
            value : Lp.getValue("remind_serial_record"),
            dt : 7,
            focusColor : "white",
            font : uiCom.font.F20
        }
    ];

    this.addRecrdSelectWin = function(){
        self.recordSelectDlg = UI.createGroup(self.recordSelectParams, "recordSelectDlg", self.win);
        self.recordSelectDlg.proc = self.recordSelectOnKey;

    };

    this.showRecordSelectWin = function(singleCb, serialCb,rawData){
        self.recordSelectValue = {
            "singleCb" : singleCb,
            "serialCb" : serialCb,
            "rawData"  :rawData,
            "preFocusWin" : self.win.getFocusWin()
        };
        self.recordSelectDlg.visibility = 1;
        var win = self.recordSelectDlg.getChild("singleBt");
        win.setFocus(true);
        win.show();
    };

    this.closeRecordSelectWin = function(flag){
        if(flag){
            var win = self.recordSelectDlg.getFocusWin();
            if(win.id == "singleBt"){
                console.log("singleCb");
                if(self.recordSelectValue.singleCb)
                {
                    self.recordSelectValue.singleCb(self.recordSelectValue.rawData);
                }
            }
            else {
                console.log("serialCb");
                if(self.recordSelectValue.serialCb)
                {
                    self.recordSelectValue.serialCb(self.recordSelectValue.rawData);
                }
            }
        }
        self.recordSelectValue.preFocusWin.setFocus(true);
        self.recordSelectDlg.hide();
    };

    this.recordSelectOnKey = function(e){
        var ret = true;
        switch(e.keyCode){
            case UI.KEY.FUNRED:
            case UI.KEY.FUNYELLOW:
            case UI.KEY.FUNGREEN:
            case UI.KEY.FUNBLUE:
                break;
            case UI.KEY.ENTER:
                self.closeRecordSelectWin(true);
                break;
            case UI.KEY.BACKSPACE:
                self.closeRecordSelectWin(false);
                break;
            default:
                ret = false;
                break;
        }
        return ret;
    };

    UI.res.set("epgRecordCancelButton", {
        skin : {
            focus : {type : "img", imgNames : ["epg/popUp_itemBg_highlight"], stretch : "HV"}
        }
    });

    this.recordCancelParams = [
        {
            uiType : UIFrame,
            id : "recordCancelFrame",
            ol : 500,
            ot : 200,
            w : 340,
            h : 160,
            type : "img",
            imgNames : ["dialog/dialog_bg"],
            stretch : "HV",
            focusMoveMode : "circle",
            visibility : -1
        },
        {
            uiType : UILabel,
            id : "tipLabel",
            ol : 0,
            ot : 5,
            w : 360,
            h : 40,
            font : uiCom.font.F20,
            color : "white",
            HAlign : "center",
            value : Lp.getValue("tips")
        },
        {
            uiType : UIButton,
            id : "singleBt",
            ol : 31,
            ot : 35,
            w : 280,
            h : 46,
            styleClass : "epgRecordCancelButton",
            value : Lp.getValue("cancel_single_record"),
            dt : 7,
            focusColor : "white",
            font : uiCom.font.F20
        },
        {
            uiType : UIButton,
            id : "serialBt",
            ol : 31,
            ot : 80,
            w : 280,
            h : 46,
            styleClass : "epgRecordCancelButton",
            value : Lp.getValue("cancel_serial_record"),
            dt : 7,
            focusColor : "white",
            font : uiCom.font.F20
        },
        {
            uiType:UIImg,
            id:"okImg",
            ol:70,
            ot:134,
            src:"epg/ico_ok"
        },
        {
            uiType:UILabel,
            id:"okLabel",
            ol:110,
            ot:130,
            w:50,
            h:40,
            font:uiCom.font.F20,
            HAlign:"left",
            color:"white",
            value: Lp.getValue("Ok")
        },
        {
            uiType:UIImg,
            id:"okImg",
            ol:200,
            ot:134,
            src:"epg/ico_back"
        },
        {
            uiType:UILabel,
            id:"okLabel",
            ol:250,
            ot:130,
            w:50,
            h:40,
            font:uiCom.font.F20,
            HAlign:"left",
            color:"white",
            value:Lp.getValue("Cancel")
        }
    ];

    this.addRecordCancelWin = function(){
        self.recordCancelDlg = UI.createGroup(self.recordCancelParams, "recordCancelDlg", self.win);
        self.recordCancelDlg.proc = self.recordCancelOnKey;
    };

    this.showRecordCancelWin = function(singleCb,serialCb){
        self.recordCancelValue = {
            "singleCb" : singleCb,
            "serialCb" : serialCb,
            "preFocusWin" : self.win.getFocusWin()
        };
        self.recordCancelDlg.visibility = 1;
        var win = self.recordCancelDlg.getChild("singleBt");
        win.setFocus(true);
        win.show();
    };

    this.closeRecordCancelWin = function(flag){
        if(flag){
            var win = self.recordCancelDlg.getFocusWin();
            if(win.id == "singleBt"){
                if(self.recordCancelValue.singleCb)
                {
                    self.recordCancelValue.singleCb();
                }
            }
            else {
                console.log("serialCb");
                if(self.recordCancelValue.serialCb)
                {
                    self.recordCancelValue.serialCb();
                }
            }
        }
        self.recordCancelValue.preFocusWin.setFocus(true);
        self.recordCancelDlg.hide();
    };

    this.recordCancelOnKey = function(e){
        var ret = true;
        switch(e.keyCode){
            case UI.KEY.FUNRED:
            case UI.KEY.FUNYELLOW:
            case UI.KEY.FUNGREEN:
            case UI.KEY.FUNBLUE:
                break;
            case UI.KEY.ENTER:
                self.closeRecordCancelWin(true);
                break;
            case UI.KEY.BACKSPACE:
                self.closeRecordCancelWin(false);
                break;
            default:
                ret = false;
                break;
        }
        return ret;
    };

    /*************************预约录制*************************/
    self.eventSize =  0;
    this.getEventSize = function(){
        var ch = self.getCurrentCh();
        var sch = self.getCurrentShc();
        var event = recordSchCom.getEventTemplate(recordSchCom.recordType.SINGLE);
        event.ch.idn = ch.idn;
        event.ch.name = ch.name;
        event.startTime = sch[4].startTime;
        event.duration = sch[4].duration;
        event.epg.eventId = sch[4].eventId;
        event.epg.name = sch[4].name;
        event.epg.level = sch[4].level;

        var size = JSON.stringify(event).length;
        console.log("content:"+JSON.stringify(event)+"  size:"+size +"   maxSize:"+self.eventSize);
        if(size > self.eventSize)
        {
            self.eventSize = size;
        }
    };

    this.checkIsCanRecord = function(){
        var ret = 0;
        //无信号
        if(self.videoStatus.noSign){
            ret = 1;
        }
        //无卡
        if(self.videoStatus.noCard){
            ret = 2;
        }
        //有锁
        if(self.videoStatus.eventLock){
            ret = 3;
        }
        //无授权
        if(self.videoStatus.noCertification){
            ret = 4;
        }

        return ret;
    };

    this.getRecordConflictItem = function(et){
        var item = {
            dateStr:"",
            timeStr:"",
            chName:"",
            schName:"",
            type:""
        };
        if(et.type == recordSchCom.recordType.ONETIME){
            var startDate = getEpgStartDate(et.startTime);
            var endDate = getEpgEndDate(startDate,et.duration);
            item.dateStr = formatWeekDate(startDate);
            item.timeStr = formatTime2(startDate,endDate);
            item.chName = et.ch.name;
            //tem.schName = et.epg.name;
            item.type = getTypeText(et.type);

        }
        else if(et.type == recordSchCom.recordType.WEEKTIME){

            if(et.eventHangle){
                var startDate = getEpgStartDate(et.startTime);
                var endDate = getEpgEndDate(startDate,et.duration);
                item.dateStr = formatWeekDate(startDate);
                item.timeStr = formatTime2(startDate,endDate);
            }
            else{
                var startDate = getEpgStartDate(et.constraint.startTime);
                var endDate = getEpgEndDate(startDate,et.constraint.duration);
                item.dateStr = formatWeekDate(startDate);
                item.timeStr = formatTime2(startDate,endDate);
            }
            item.chName = et.ch.name;
            item.type = getTypeText(et.type);
        }
        else if(et.type == recordSchCom.recordType.DAYTIME){

            if(et.eventHangle){
                var startDate = getEpgStartDate(et.startTime);
                var endDate = getEpgEndDate(startDate,et.duration);
                item.dateStr = formatWeekDate(startDate);
                item.timeStr = formatTime2(startDate,endDate);
            }
            else{
                var startDate = getEpgStartDate(et.constraint.startTime);
                var endDate = getEpgEndDate(startDate,et.constraint.duration);
                item.dateStr = formatWeekDate(startDate);
                item.timeStr = formatTime2(startDate,endDate);
            }
            item.chName = et.ch.name;
            item.type = getTypeText(et.type);
        }
        else if(et.type == recordSchCom.recordType.SINGLE){
            var startDate = getEpgStartDate(et.startTime);
            var endDate = getEpgEndDate(startDate,et.duration);
            item.dateStr = formatWeekDate(startDate);
            item.timeStr = formatTime2(startDate,endDate);
            item.chName = et.ch.name;
            item.schName = et.epg.name;
            item.type = getTypeText(et.type);
        }
        else if(et.type == recordSchCom.recordType.SERIAL){
            if(et.eventHangle){
                var startDate = getEpgStartDate(et.startTime);
                var endDate = getEpgEndDate(startDate,et.duration);
                item.dateStr = formatWeekDate(startDate);
                item.timeStr = formatTime2(startDate,endDate);
                item.schName = et.epg.series_key;
            }
            else{
                var startDate = getEpgStartDate(et.constraint.startTime);
                var endDate = getEpgEndDate(startDate,et.constraint.duration);
                item.dateStr = formatWeekDate(startDate);
                item.timeStr = formatTime2(startDate,endDate);
                item.schName = et.constraint.series_key;
            }
            item.chName = et.ch.name;

            item.type = getTypeText(et.type);
        }
        return item;
    };

    this.addSingleRecording = function(rawData){
        console.log("添加单集预约录制");
        //获取事件模板
        var event = recordSchCom.getEventTemplate(recordSchCom.recordType.SINGLE);

        //初始化录制事件
        event.ch = rawData.ch;
        event.startTime = rawData.startTime;
        event.duration = rawData.duration;
        event.epg.eventId = rawData.eventId;
        event.epg.name = rawData.name;
        event.epg.level = rawData.level;
        event.epg.text = rawData.extendEvent.text;

        //判断录制时间是否过期
        var curdate = new Date();
        var staDate = getEpgStartDate(event.startTime);
        var endDate = getEpgEndDate(staDate,event.duration);
        if((endDate.getTime() - curdate.getTime()) < 1000*60){
            return;
        }
        //判断是否需要更新录制时间
        var off = curdate.getTime() - staDate.getTime();
        if(off > 60 * 1000){
            event.startTime = getTimeStrfromDate(curdate);
            event.duration = (endDate.getTime() - curdate.getTime())/1000;
        }

        //获取冲突列表
        var al = recordSchCom.checkEventConflict(event);
        console.log("recordSchCom.checkEventConflict:"+JSON.stringify(al));
        //获取最优冲突列表
        var oplList = recordSchCom.getOptimalConflictBylist(al);
        console.log("recordSchCom.getOptimalConflictBylist:"+JSON.stringify(oplList));
        //设置tuner通道
        event.resId = oplList.resId;
        //如果最优冲突列表为0，则直接添加
        if(oplList.optimalList.length <= 0){
            console.log("recordSchCom.addEvent:"+JSON.stringify(event));
            var ret = recordSchCom.addEvent(event);
            self.addTableData4(true);
        }
        //如果最优冲突列表不为0，则提示冲突列表
        else
        {
            var params = {
                title:Lp.getValue("remind_conflict"),
                okText:Lp.getValue("Ok"),
                backText:Lp.getValue("Cancel"),
                okIcon:"../cview_app_common_pic/ico_ok.png",
                backIcon:"../cview_app_common_pic/ico_back.png",
                text1:Lp.getValue("remind_conflict_ask_str"),
                newTips:Lp.getValue("new_remind_conflict"),
                oldTips:Lp.getValue("old_remind_conflict"),
                newItem:null,
                oldItem:null,
                okfun: function () {
                    console.log("ok");
                },
                nofun: function () {
                    console.log("no");
                }
            };
            //获取newItem
            params.newItem = self.getRecordConflictItem(event);

            //获取oldItem
            params.oldItem = [];
            for(var i = 0; i < oplList.optimalList.length;i++){
                var item = self.getRecordConflictItem(oplList.optimalList[i]);
                params.oldItem.push(item);
            }
            //设置冲突列表弹窗参数
            params.okfun = function(){
                console.log("ok");
                recordSchCom.deleteConflictList(oplList.optimalList);
                var ret = recordSchCom.addEvent(event);
                console.log("ret:"+ret);
                self.addTableData4(true);
            };
            //弹出冲突列表
            var dia = new RecordingConflictDialog();
            dia.show(params);
        }
    };

    this.addSeriesRecording = function(rawData){
        console.log("添加系列预约录制");
        //查看是否已添加该系列预约
        if(recordSchCom.checkSeriesRecord(rawData.seriesLinking.series_key)){
            //提示用户
            var p1 = {
                title: Lp.getValue("tips"),
                textok: Lp.getValue("OK"),
                textno: Lp.getValue("Cancel"),
                timeout:10*1000,
                background: "../cview_app_common_pic/password_bg.png",
                dia_ImgOK: "../cview_app_common_pic/ico_ok.png",
                dia_ImgNO: "../cview_app_common_pic/ico_back.png",
                okfun: function () {

                },
                nofun: function () {
                }
            };

            var p2 = {
                text:Lp.getValue("serial_record_has_record")
            };
            var dia = new Dialog(p1);
            dia.show(p2);
            return;
        }

        var task = recordSchCom.getTaskTemplate(recordSchCom.recordType.SERIAL);
        //初始化录制任务
        task.ch = rawData.ch;
        task.constraint.series_key = rawData.seriesLinking.series_key;
        task.constraint.startTime = rawData.startTime;
        //获取系列录制子事件
        var eEpg = epgCom.getEpgBySerialKey(rawData.ch,rawData.startTime,rawData.seriesLinking.series_key);
        for(var i = 0; i < eEpg.length;i++){
            var e = recordSchCom.getEventTemplate(recordSchCom.recordType.SERIAL);
            //初始化录制事件
            e.ch = task.ch;
            e.startTime = eEpg[i].startTime;
            e.duration = eEpg[i].duration;
            e.epg = {};
            e.epg.eventId = eEpg[i].eventId;
            e.epg.name = eEpg[i].name;
            e.epg.level = eEpg[i].level;
            e.epg.series_key = eEpg[i].seriesLinking.series_key;
            e.epg.episode_key = eEpg[i].seriesLinking.episode_key;
            e.epg.episode_status = eEpg[i].seriesLinking.episode_status;
            e.epg.episode_last = eEpg[i].seriesLinking.episode_last;
            e.epg.text = eEpg[i].extendEvent.text;
            e.taskHangle = task.taskHangle;
            task.orderList.push(e);
        }
        console.log("task:"+JSON.stringify(task));
        //获取冲突列表
        var al = recordSchCom.checkTaskConflict(task);
        //console.log("recordSchCom.checkTaskConflict:"+JSON.stringify(al));

        //获取最优冲突列表
        var oplList = recordSchCom.getOptimalConflictBylist(al);
        //console.log("recordSchCom.getOptimalConflictBylist:"+JSON.stringify(oplList));

        //设置tuner通道
        task.resId = oplList.resId;
        for(var i = 0; i < task.orderList.length;i++){
            task.orderList[i].resId = task.resId;
        }

        //如果最优冲突列表为0，则直接添加
        if(oplList.optimalList.length <= 0){
            var ret = recordSchCom.addTask(task);
            console.log("addTask ret:"+ret);
            self.addTableData4(true);
        }
        //如果最优冲突列表不为0，则提示冲突列表
        else
        {
            var params = {
                title:Lp.getValue("remind_conflict"),
                okText:Lp.getValue("Ok"),
                backText:Lp.getValue("Cancel"),
                okIcon:"../cview_app_common_pic/ico_ok.png",
                backIcon:"../cview_app_common_pic/ico_back.png",
                text1:Lp.getValue("remind_conflict_ask_str"),
                newTips:Lp.getValue("new_remind_conflict"),
                oldTips:Lp.getValue("old_remind_conflict"),
                newItem:null,
                oldItem:null,
                okfun: function () {
                    console.log("ok");
                },
                nofun: function () {
                    console.log("no");
                }
            };
            //获取newItem
            params.newItem = self.getRecordConflictItem(task);

            //获取oldItem
            params.oldItem = [];
            for(var i = 0; i < oplList.optimalList.length;i++){
                var item = self.getConflictItem(oplList.optimalList[i]);
                params.oldItem.push(item);
            }
            //设置冲突列表弹窗参数
            params.okfun = function(){
                console.log("ok");
                recordSchCom.deleteConflictList(oplList.optimalList);
                var ret = recordSchCom.addTask(task);
                console.log("ret:"+ret);
                self.addTableData4(true);
            };
            //弹出冲突列表
            var dia = new RecordingConflictDialog();
            dia.show(params);
        }
    };

    this.proc4OnkeyRecord = function(){
        //是否有信号

        //CA卡是否插入

        //是否有授权

        //查看PVR服务是否开通
        //if(!sysCom.PVRService || sysCom.PVRService=="0"){
        if(false){
            //提示用户PVR业务尚未开通
            var p1 = {
                title: Lp.getValue("tips"),
                textok: Lp.getValue("OK"),
                textno: Lp.getValue("Cancel"),
                timeout:5*1000,
                background: "../cview_app_common_pic/password_bg.png",
                dia_ImgOK: "../cview_app_common_pic/ico_ok.png",
                dia_ImgNO: "../cview_app_common_pic/ico_back.png",
            };
            var p2 = {
                text:""
            };
            p2.text = Lp.getValue("noPVRService");

            var dia = new Dialog(p1);
            dia.show(p2);
            return;
        }
        //查看USB是否准备好
        var flag = false;
        var diskArray = FS.fsGetDiskInfo(false);
        for(var i = 0; i < diskArray.length;i++){
            if(diskArray[i].flag == 0 && diskArray[i].sn == sysCom.PVRPariedSn){
                flag = true;
                break;
            }
        }
        //if(!flag){
        if(false){
            //提示用户 硬盘没有准备好
            var p1 = {
                title: Lp.getValue("tips"),
                textok: Lp.getValue("OK"),
                textno: Lp.getValue("Cancel"),
                timeout:5*1000,
                background: "../cview_app_common_pic/password_bg.png",
                dia_ImgOK: "../cview_app_common_pic/ico_ok.png",
                dia_ImgNO: "../cview_app_common_pic/ico_back.png",
            };
            var p2 = {
                text:""
            };
            p2.text = Lp.getValue("noPVRDISK");

            var dia = new Dialog(p1);
            dia.show(p2);
            return;
        }


        var ch = self.getCurrentCh();
        var sch = self.getCurrentShc();
        console.log("rawData:"+JSON.stringify(sch[4]));
        var e = recordSchCom.checkEpgRecord(sch[4]);
        //未预约
        if(!e)
        {
            //查看是否可以预约
           /* var ret = self.checkIsCanRecord();
            if(ret){
                var p1 = {
                    title: Lp.getValue("tips"),
                    textok: Lp.getValue("OK"),
                    textno: Lp.getValue("Cancel"),
                    timeout:5*1000,
                    background: "../cview_app_common_pic/password_bg.png",
                    dia_ImgOK: "../cview_app_common_pic/ico_ok.png",
                    dia_ImgNO: "../cview_app_common_pic/ico_back.png",
                };
                var p2 = {
                    text:""
                };
                if(ret == 1){
                    p2.text = Lp.getValue("noSignText");
                }else if(ret == 2){
                    p2.text = Lp.getValue("noCardText");
                }else if(ret == 3){
                    p2.text = Lp.getValue("eventLockText");
                }else if(ret == 4){
                    p2.text = Lp.getValue("noCertificationText");
                }
                var dia = new Dialog(p1);
                dia.show(p2);
                return;
            }*/

            //如果是未添加的系列节目,提示用户是单集预约录制还是系列预约录制
            if(sch[4].seriesLinking)
            {
                self.showRecordSelectWin(self.addSingleRecording,self.addSeriesRecording,sch[4]);
                return;
            }
            //如果是未添加的单集节目
            else {
                self.addSingleRecording(sch[4]);
            }
        }
        //正在录制,取消录制
        else if(e.status) {
            console.log("deleteEvent:"+JSON.stringify(e));
            recordSchCom.deleteEvent(e);
            self.addTableData4(true);
        }
        //如果是已添加的单集预约
        else if(e.type == recordSchCom.recordType.SINGLE)
        {
            console.log("deleteEvent:"+JSON.stringify(e));
            recordSchCom.deleteEvent(e);
            self.addTableData4(true);
        }
        //如果是已添加的系列录制
        else if(e.type == recordSchCom.recordType.SERIAL)
        {
            var singlecb = function(){
                recordSchCom.deleteEvent(e);
                console.log("singlecb:"+JSON.stringify(e));
                self.addTableData4(true);
            };

            var serialcb = function(){
                var task = recordSchCom.getTaskByHandle(e.taskHangle);
                console.log("serialcb:"+JSON.stringify(task));
                recordSchCom.deleteTask(task);
                self.addTableData4(true);
            };
            //提示取消单集预约还是取消系列预约
            self.showRecordCancelWin(singlecb,serialcb);
        }

    };

    /*************************EPG  资讯*************************/
    this.showDetail = function(){
        var text = "";
        var pr = {
            win : self.win,
            frame : {
                bg: "dialog/dialog_bg",
                w : 600,
                h : 310,
                t : -100
            },
            title : {
                dt : 5,
                color : "white",
                value : "Information"
            },
            content : {
                dw : -24,
                dt : -5,
                dh : 20,
                labelDt : 10,
                firstRowHeadSpace : "   ",
                font : uiCom.font.F20,
                msg : text,
                bgColor : "grey"
            },
            nav : {
                dt : 0,
                dl : 280,
                color:"white",
                group : [
                    {
                        img : "epg/ico_ok",
                        text : Lp.getValue("Ok"),
                        fun : function(){
                        },
                        key : UI.KEY.ENTER
                    }
                ]
            }
        };

        var ch = self.getCurrentCh();
        var shc = self.getCurrentShc();

        if(!shc){
            pr.content.msg = Lp.getValue("NoPfInfo");
            pr.title.value = Lp.getValue("NoPfInfo");
        }
        else{
            if(!self.hasUnlock && lockCom.checkAllLock(ch,shc[4].level)){
                pr.title.value = Lp.getValue("epg_lock_msg");
                pr.content.msg = Lp.getValue("epg_lock_msg");
            }
            else{
                if(shc[4].extendEvent && shc[4].extendEvent.text){
                    pr.content.msg = shc[4].extendEvent.text;
                }
                else{
                    pr.content.msg = shc[4].name;
                }
                pr.title.value = shc[4].name;
            }
        }

        self.detailDialog = new TextDialog(pr);
        self.detailDialog.show();
    };

    this.closePfDetail = function(){
        if(self.detailDialog){
            self.detailDialog.close();
            self.detailDialog = null;
        }
    };
}

EpgPage.prototype = UIModule.baseModule;

