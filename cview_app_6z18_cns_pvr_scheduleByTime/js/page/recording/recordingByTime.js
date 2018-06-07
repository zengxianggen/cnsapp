function RecordingByTime()
{
    var self = this;

    var chTimer = null;

    self.hasUnlock = false;

    this.dlgParam = [
        {uiType:UIFrame,id:"bgFrame",l:0,t:0,w:UI.width,h:UI.height,type:"img",imgNames:["user/pvrScheT_background"],stretch:"HV"},
        {uiType:UIImg,id:"titleBgImg",ol:50,ot:50,w:1180,h:40,src:"user/title_bg",stretch:"HV"},
        {uiType:UIImg,id:"chBgImg",ol:50,ot:115,w:530,h:530,src:"user/channel_column_background",stretch:"HV"},
        {uiType:UIImg,id:"wayBgImg",ol:590,ot:115,w:300,h:530,src:"user/recordway_column_background",stretch:"HV"},
        {uiType:UIImg,id:"tmsetBgImg",ol:900,ot:115,w:330,h:530,src:"user/timeset_column_background",stretch:"HV"},

        {
            uiType : UILabel,
            id : "epgTitle",
            ol : (UI.width - 300) / 2,
            ot : 60,
            w : 300,
            h : 30,
            dt:4,
            value : Lp.getValue("record_by_time"),
            font : uiCom.font.F25,
            HAlign : "center"
        },
        {
            uiType : UILabel,
            id : "titleTime",
            ol : 950,
            ot : 60,
            w : 200,
            h : 30,
            value : "",
            font : uiCom.font.F20,
            HAlign : "left",
            color : "grey"
        },
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

        {
            uiType:UILabel,id:"chLabel",ol:60,ot:125,w:100,h:40,
            font:uiCom.font.F20, color:"#62815a", value:Lp.getValue("select_channel")
        },
        {
            uiType:UILabel,id:"chNum",ol:500,ot:125,w:100,h:40,
            font:uiCom.font.F20, color:"white", value:""
        },
        {
            uiType:UILabel,id:"chLabel",ol:610,ot:125,w:100,h:40,
            font:uiCom.font.F20, color:"#62815a", value:Lp.getValue("recordMode")
        },
        {
            uiType:UILabel,id:"chLabel",ol:910,ot:125,w:100,h:40,
            font:uiCom.font.F20, color:"#62815a", value:Lp.getValue("set_time")
        },
    ];

    this.navParam = [

    ];

    this.open = function(){
        self.defOpen();
    };
    this.start = function()
    {
        self.openTimer();
        self.initStyleClass();
        self.createDlg();
        self.addData();
        self.registerCb();
        dtvCom.changeCh(null,0,true,function(){
            var rect = {
                l:600,
                t:400,
                w:273,
                h:160
            };
            var r = getVideoRect(rect,sysCom.config.Reslution);
            dtvCom.mp.mpSetVideoSize(r.l, r.t, r.w, r.h, false);
        });

    };

    this.stop = function(){};
    this.close = function(){
        dtvCom.stop();
        self.defClose();
    };

    this.onkey = function(e){

        var ret = true;
        switch(e.keyCode)
        {
            case UI.KEY.ENTER:

                break;
            case UI.KEY.FUNYELLOW:
                self.showPasswdDialog();
                break;
            case UI.KEY.FUNBLUE:
                appCom.goAppByName("pvrScheduledList",false);
                break;
            case UI.KEY.FUNRED:
                recordSchCom.reset();
                break;
            default:
                ret = false;
                break;
        }
        return ret;
    };
    /**************************************定时刷新区*************************************/
    this.openTimer = function(){
        self.win.getChild("titleTime").value = formatTitleDate(new Date());
        self.timer = setInterval(function(){
            self.win.getChild("titleTime").value = formatTitleDate(new Date());
            self.win.update();
        }, 1000 * 20);
    };

    /**************************************窗口创建区**************************************/
    this.initStyleClass = function(){
        UI.res.set("way_bt",{
            skin: {
                normal : {type : "img", imgNames : ["user/recordWayBtn_normal.png"], stretch : "HV"},
                focus : {type : "img", imgNames : ["user/recordWayBtn_highlight.png"], stretch : "HV"}
            }
        });

        UI.res.set("setTimeBt",{
            skin: {
                normal : {type : "img", imgNames : ["user/selectBox_time_normal.png"], stretch : "HV"},
                focus : {type : "img", imgNames : ["user/selectBox_time_highlight.png"], stretch : "HV"}
            }
        });

        UI.res.set("okBt",{
            skin: {
                normal : {type : "img", imgNames : ["user/btnBg_normal_100x45.png"], stretch : "HV"},
                focus : {type : "img", imgNames : ["user/btnBg_highlight_100x45.png"], stretch : "HV"}
            }
        });

        UI.res.set("weekBt",{
            skin: {
                focus : {type : "img", imgNames : ["user/selectBox_week_highlight.png"], stretch : "HV"},
                normal : {type : "img", imgNames : ["user/selectBox_week_normal.png"], stretch : "HV"}
            }
        });
    };

    this.createDlg = function(){
        //第一列
        var clTb_l = 60;
        var clTb_t = 160;
        var clTb_w = 180;
        var clTb_h = 480;
        this.channelListTb = new UITable("null", "channelListTb", null, clTb_l, clTb_t, clTb_w, clTb_h,// ol ot w h
            {
                EnlargeV:-10,dt:-10,
                headUse : false, font : uiCom.font.F20, cols : 1, rowsOnePage : 5, HAlign : "center", color : "#96b4be",
                lineVWidth : 0, lineHWidth : 0, lineRectWidth : 0, LeaveFocusColor : "white", focusColor : "white",
                skin : {
                    normalBar: {type : "img", imgNames : ["user/channelGroup_normal"], stretch : "HV"},
                    selectBar : {type : "img", imgNames : ["user/channelGroup_highlightWithNoFocus"], stretch : "HV"},
                    focusBar : {type : "img", imgNames : ["user/channelGroup_highlightWithFocus"], stretch : "HV"}
                }
            }
        );
        this.channelListTb.attach(self.win);
        this.channelListTb.setFocus(true);
        this.channelListTb.setColClip(0,true);
        this.channelListTb.proc = self.chlProc;

        //第二列
        var chTb_l = clTb_l + clTb_w + 20;
        var chTb_t = clTb_t;
        var chTb_w = 310;
        var chTb_h = clTb_h;
        this.channelTb = new UITable("null", "channelTb", null, chTb_l, chTb_t, chTb_w, chTb_h,// ol ot w h
            {
                headUse : false,
                font : uiCom.font.F20,
                cols : 1,
                rowsOnePage : 9,
                color : "#96b4be",
                lineVWidth : 0,
                lineHWidth : 0,
                lineRectWidth : 0,
                LeaveFocusColor : "white",
                focusColor : "white",
                HAlign : "left",
                skin : {
                    focusBar : {type : "img", imgNames : ["user/recordWayBtn_highlight"], stretch : "HV"},
                    selectBar : {type : "img", imgNames : ["user/recordWayBtn_normal"], stretch : "HV"}
                }
            }
        );
        this.channelTb.attach(self.win);
        this.channelTb.setColWidthArr([this.channelTb.w*0.9]);
        this.channelTb.setColClip(0, true);
        this.channelTb.proc = self.chProc;

        this.wayDlg = UI.createGroup(self.wayParams,"wayDlg",self.win);
        this.videoFrameImg = self.wayDlg.getChild("videoFrameImg");
        this.wayDlg.proc = self.wayProc;
        this.wayBtArray = [
            {focus:true,win:self.wayDlg.getChild("bt1")},
            {focus:false,win:self.wayDlg.getChild("bt2")},
            {focus:false,win:self.wayDlg.getChild("bt3")}
        ];
        this.wayImgArray = [
            {win:self.wayDlg.getChild("img1")},
            {win:self.wayDlg.getChild("img2")},
            {win:self.wayDlg.getChild("img3")}
        ];
        self.setSelectImg();

        self.changeSetTimeWin();

        self.createNavDlg();
    };

    this.addData = function()
    {
        self.addTableData1();
        self.addTableData2();
    };

    /**************************************节目列表操作区**************************************/
    this.addTableData1 = function(){
        //初始化 节目列表分类数据
        var data1 = [];
        for(var i = 1; i < dtvCom.chl.length; i++){
            data1[i - 1] = new Array();
            data1[i - 1][0] = dtvCom.chl[i].name;
            for(var j = 0; j < dtvCom.chl[i].engName.split("/").length;j++){
                data1[i - 1][0] += "\n";
                data1[i - 1][0] += dtvCom.chl[i].engName.split("/")[j];
            }
            //保存一个节目分类列表的下标
            data1[i - 1][1] = i;
        }
        self.channelListTb.removeItems();
        self.channelListTb.addItems(data1);
    };

    this.chlProc = function(e)
    {
        var ret = true;
        switch(e.keyCode)
        {
            case UI.KEY.LEFT:
                //wk  get focus
                if(self.channelTb.rows > 0)
                {
                    self.channelTb.setFocus(true);
                    self.win.update();
                }
                break;
            case UI.KEY.RIGHT:
                //ch get focus
                if(self.channelTb.rows > 0)
                {
                    self.channelTb.setFocus(true);
                    self.win.update();
                }
                break;
            case UI.KEY.UP:
                //scroll
                self.channelListTb.listUp();
                //change ch data
                self.addTableData2();

                self.win.update();
                break;
            case UI.KEY.DOWN:
                //scroll
                self.channelListTb.listDown();
                //change ch data
                self.addTableData2();

                self.win.update();
                break;
            default:
                ret = false;
                break;
        }
        return ret;
    };

    /**************************************频道操作区**************************************/
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
        self.updateChNum();
    };

    this.updateChNum = function(cur,tol){
        var numWin = self.win.getChild("chNum");
        var curIndex = self.channelTb.curIndex + 1;
        var totalIndex = dtvCom.chl[self.channelListTb.getRowItems(self.channelListTb.curIndex)[1]].chs.length;
        if(totalIndex == 0)
        {
            curIndex = 0;
        }
        numWin.value = ""+curIndex+"/"+totalIndex;
    };


    this.chProc = function(e)
    {
        var ret = true;
        switch(e.keyCode)
        {
            case UI.KEY.UP:
                setTimeout(function(){
                    self.channelTb.listUp();
                    self.updateChNum();
                    self.win.update();
                    self.changeChannel();
                },50);
                break;
            case UI.KEY.DOWN:
                setTimeout(function(){
                    self.channelTb.listDown();
                    self.updateChNum();
                    self.win.update();
                    self.changeChannel();
                },50);
                break;
            case UI.KEY.LEFT:

                self.channelListTb.setFocus(true);
                self.win.update();
                break;
            case UI.KEY.RIGHT:
                for(var i=0;i < self.wayBtArray.length;i++)
                {
                    if(self.wayBtArray[i].focus == true)
                    {
                        self.wayBtArray[i].win.setFocus(true);
                        break;
                    }
                }
                self.win.update();
                break;
            default:
                ret = false;
                break;
        }
        return ret;
    };

    this.getCurrentCh = function(){
        var ch = null;
        if(self.channelTb.rows <= 0)
        {
            ch = null;
        }
        else {
            var curChItem = self.channelTb.getRowItems(self.channelTb.curIndex);
            ch = curChItem[1];
        }
        return ch;
    };

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
            self.setVideoImg(self.videoFrameImg);
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
            self.setVideoImg(self.videoFrameImg);
        }

    };

    this.changeChannel = function(){

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

    /**************************************亲子锁操作区**************************************/
    this.checkCurrentLock = function(){
        var level = 0;
        var pfArray = epgCom.getChannelPf(dtvCom.chs[sysCom.config.chIndex], false);
        if(pfArray && pfArray.length == 2){
            level = pfArray[0].level
        }
        var flag = lockCom.checkAllLock(dtvCom.chs[sysCom.config.chIndex], level);
        return flag;
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
            self.setVideoImg(self.videoFrameImg);
        });
        eventCom.registerCallback(3,function(obj){
            if(obj.code == eventCom.EVENTCODE.CS_EVT_CA_SHOW_MESSAGE)
            {
                //no card
                if(obj.data.msgId == 0x03){
                    self.videoStatus.noCard = true;
                }
                else if(obj.data.msgId == 0x09){
                    self.videoStatus.noCertification = true;
                }
                self.setVideoImg(self.videoFrameImg);
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
            win.setSrc("video/noSign");
            win.update();
            return;
        }
        if(self.videoStatus.eventLock)
        {
            win.visibility = 1;
            win.setSrc("video/eventLocked");
            win.update();
            return;
        }
        if(self.videoStatus.noCard)
        {
            win.visibility = 1;
            win.setSrc("video/no_smartCard");
            win.update();
            return;
        }
        if(self.videoStatus.noCertification)
        {
            win.visibility = 1;
            win.setSrc("video/no_certification");
            win.update();
            return;
        }
        if(self.videoStatus.isRadio)
        {
            win.visibility = 1;
            win.setSrc("video/DBC_background_picture");
            win.update();
            return;
        }

        win.visibility = -1;
        win.update();
    };

    this.setEpgInfo = function()
    {
        var ch = self.getCurrentCh();

        var level  = 0;

        if(self.pfFormat && self.pfFormat.length==2)
        {
            level = self.pfFormat[0].rawData.level;
        }
        var isLock = lockCom.checkAllLock(ch,level);

        var win = self.wayDlg.getChild("epgInfo");

        if(self.pfFormat && self.pfFormat.length == 2)
        {
            if(isLock)
            {
                win.value =  self.pfFormat[0].timeStr + " " + Lp.getValue("epg_lock_msg");
            }
            else
            {
                win.value =  self.pfFormat[0].timeStr + " " + self.pfFormat[0].name;
            }

        }
        else
        {
            win.value = "";
        }
        win.update();
    };

    /**************************************录制方式操作区**************************************/
    this.wayBtArray = [
    ];

    this.wayImgArray = [
    ];

    this.wayParams = [
        {uiType:UIFrame,id:"wayFrame",t:160,l:600,w:280,h:480,type:"none"},
        {
            uiType:UIButton,id:"bt1",ol:10,ot:0,w:260,h:50,dt:8,
            value:Lp.getValue("oneTimeRecord"),HAlign:"center",font:uiCom.font.F20,
            color:"#96b4be",focusColor:"white",
            styleClass:"way_bt"
        },
        {
            uiType:UIButton,id:"bt2",ol:10,ot:80,w:260,h:50,dt:8,
            value:Lp.getValue("everyDayRecord"),HAlign:"center",font:uiCom.font.F20,
            color:"#96b4be",focusColor:"white",
            styleClass:"way_bt"
        },
        {
            uiType:UIButton,id:"bt3",ol:10,ot:160,w:260,h:50,dt:8,
            value:Lp.getValue("everyWeekRecord"),HAlign:"center",font:uiCom.font.F20,
            color:"#96b4be",focusColor:"white",
            styleClass:"way_bt"
        },
        {
            uiType:UIImg,id:"img1",ol:20,ot:0+16,w:25,h:20,stretch:"HV",
            src:"user/ico_selected_gray"
        },
        {
            uiType:UIImg,id:"img2",ol:20,ot:80+16,w:25,h:20,stretch:"HV",
            src:"user/ico_selected_gray"
        },
        {
            uiType:UIImg,id:"img3",ol:20,ot:160+16,w:25,h:20,stretch:"HV",
            src:"user/ico_selected_gray"
        },
        {
            uiType:UIFrame,id:"videoFrame",ol:10,ot:240,w:260,h:160,type:"hole"
        },
        {
            uiType:UIImg,id:"videoFrameImg",ol:10,ot:240,w:260,h:160,stretch:"HV",
            src:"",visibility:-1
        },
        {
            uiType:UILabel,id:"epgInfo",ol:10,ot:400,w:260,h:40,
            font:uiCom.font.F20, color:"#96b4be", HAlign:"left",
            value:""
        }
    ];

    this.setSelectImg = function(){
        for(var i = 0; i < self.wayBtArray.length;i++)
        {
            if(self.wayBtArray[i].focus)
            {
                self.wayImgArray[i].win.visibility = 1;
            }
            else
            {
                self.wayImgArray[i].win.visibility = -1;
            }
        }
    };

    this.wayProc = function(e)
    {
        var ret = true;
        switch(e.keyCode)
        {
            case UI.KEY.UP:
                for(var i = 0; i < self.wayBtArray.length;i++)
                {
                    if(i > 0 && self.wayBtArray[i].focus)
                    {
                        self.wayBtArray[i].focus = false;
                        self.wayBtArray[i-1].focus = true;
                        self.wayBtArray[i-1].win.setFocus(true);
                        self.setSelectImg();
                        self.changeSetTimeWin();
                        self.win.update();
                        break;
                    }
                }
                break;
            case UI.KEY.DOWN:
                for(var i = 0; i < self.wayBtArray.length;i++)
                {
                    if((i+1) < self.wayBtArray.length  && self.wayBtArray[i].focus)
                    {
                        self.wayBtArray[i].focus = false;
                        self.wayBtArray[i+1].focus = true;
                        self.wayBtArray[i+1].win.setFocus(true);
                        self.setSelectImg();
                        self.changeSetTimeWin();
                        self.win.update();
                        break;
                    }
                }
                break;
            case UI.KEY.LEFT:
                self.channelTb.setFocus(true);
                self.win.update();
                break;
            case UI.KEY.RIGHT:
                var w = self.getCurSetTimeWin();
                if(w)
                {
                    w.focusWin.setFocus(true);
                }
                self.win.update();
                break;
            default:
                ret = false;
                break;
        }
        return ret;
    };


    /**************************************设置时间操作区**************************************/
    this.singleParmas = [
        {uiType:UIFrame,id:"setTime1Frame",l:905,t:160,w:320,h:480,type:"none",focusMoveMode:"circle"},

        {uiType:UILabel,id:"startDateLabel",ol:10,ot:0,w:100,h:40,font:uiCom.font.F20,value:Lp.getValue("start_date")},
        {uiType:UIButton,id:"yearBt",ol:5,ot:40,w:90,h:40,dt:5,
            value:"",HAlign:"left",font:uiCom.font.F20,
            color:"#96b4be",focusColor:"white",
            styleClass:"setTimeBt"
        },
        {uiType:UIButton,id:"monthBt",ol:5+90+10,ot:40,w:90,h:40,dt:5,
            value:"",HAlign:"left",font:uiCom.font.F20,
            color:"#96b4be",focusColor:"white",
            styleClass:"setTimeBt"
        },
        {uiType:UIButton,id:"dayBt",ol:5+90+90+20,ot:40,w:90,h:40,dt:5,
            value:"",HAlign:"left",font:uiCom.font.F20,
            color:"#96b4be",focusColor:"white",
            styleClass:"setTimeBt"
        },

        {uiType:UILabel,id:"startDateLabel",ol:10,ot:100,w:100,h:40,font:uiCom.font.F20,value:Lp.getValue("start_time")},
        {uiType:UIButton,id:"apmBt",ol:5,ot:130,w:90,h:40,dt:5,
            value:"",HAlign:"left",font:uiCom.font.F20,
            color:"#96b4be",focusColor:"white",
            styleClass:"setTimeBt"
        },
        {uiType:UIButton,id:"hourBt",ol:5+90+10,ot:130,w:90,h:40,dt:5,
            value:"",HAlign:"left",font:uiCom.font.F20,
            color:"#96b4be",focusColor:"white",
            styleClass:"setTimeBt"
        },
        {uiType:UIButton,id:"minuteBt",ol:5+90+90+20,ot:130,w:90,h:40,dt:5,
            value:"",HAlign:"left",font:uiCom.font.F20,
            color:"#96b4be",focusColor:"white",
            styleClass:"setTimeBt"
        },

        {uiType:UILabel,id:"startDateLabel",ol:10,ot:180,w:100,h:40,font:uiCom.font.F20,value:Lp.getValue("record_time")},
        {uiType:UIButton,id:"shourBt",ol:5,ot:210,w:90,h:40,dt:5,
            value:"",HAlign:"left",font:uiCom.font.F20,
            color:"#96b4be",focusColor:"white",
            styleClass:"setTimeBt"
        },
        {uiType:UIButton,id:"sminuteBt",ol:5+90+10,ot:210,w:90,h:40,dt:5,
            value:"",HAlign:"left",font:uiCom.font.F20,
            color:"#96b4be",focusColor:"white",
            styleClass:"setTimeBt"
        },
        {uiType:UIButton,id:"okBt",ol:5+90+90+20,ot:210,w:90,h:40,dt:5,
            value:"预约",HAlign:"center",font:uiCom.font.F20,
            color:"#96b4be",focusColor:"white",
            styleClass:"okBt"
        }
    ];

    this.singleProc = function(e){
        var ret = true;

        switch(e.keyCode)
        {
            case UI.KEY.ENTER:

                if(self.getCurSetTimeWin().win.getFocusWin().id == "yearBt")
                {
                    var position = {w : 90, h : 110, l : 910, t : 240};
                    var data=self.sdata.year.data;
                    var type = 1;
                    var cb = function(arr)
                    {
                        if(arr.length != 1)
                        {
                            return;
                        }
                        self.sdata.year.index = arr[0];
                        self.getCurSetTimeWin().win.getChild("yearBt").value = data[self.sdata.year.index];
                    };
                    self.showList(position,data,type,cb,self.sdata.year.index);
                }
                else if(self.getCurSetTimeWin().win.getFocusWin().id == "monthBt"){
                    var position = {w : 90, h : 110, l : 1010, t : 240};
                    var data = self.sdata.month.data;
                    var type = 1;
                    var cb = function(arr){
                        if(arr.length != 1){
                            return;
                        }
                        self.sdata.month.index = arr[0];
                        self.getCurSetTimeWin().win.getChild("monthBt").value = data[self.sdata.month.index];
                    };
                    self.showList(position,data,type,cb,self.sdata.month.index);
                }
                else if(self.getCurSetTimeWin().win.getFocusWin().id == "dayBt"){
                    var position = {w : 90, h : 110, l : 1110, t : 240};
                    var data = self.sdata.day.data;
                    var type = 1;
                    var cb = function(arr){
                        if(arr.length != 1){
                            return;
                        }
                        self.sdata.day.index = arr[0];
                        self.getCurSetTimeWin().win.getChild("dayBt").value = data[self.sdata.day.index];
                    };
                    self.showList(position,data,type,cb,self.sdata.day.index);
                }
                else if(self.getCurSetTimeWin().win.getFocusWin().id == "apmBt"){
                    var position = {w : 90, h : 110, l : 910, t : 330};
                    var data = self.sdata.apm.data;
                    var type = 1;
                    var cb = function(arr){
                        if(arr.length != 1){
                            return;
                        }
                        self.sdata.apm.index = arr[0];
                        self.getCurSetTimeWin().win.getChild("apmBt").value = data[self.sdata.apm.index];
                    };
                    self.showList(position,data,type,cb,self.sdata.apm.index);
                }
                else if(self.getCurSetTimeWin().win.getFocusWin().id == "hourBt"){
                    var position = {w : 90, h : 110, l : 1010, t : 330};
                    var data = self.sdata.startHour.data;
                    var type = 1;
                    var cb = function(arr){
                        if(arr.length != 1){
                            return;
                        }
                        self.sdata.startHour.index = arr[0];
                        self.getCurSetTimeWin().win.getChild("hourBt").value = data[self.sdata.startHour.index];
                    };
                    self.showList(position,data,type,cb,self.sdata.startHour.index);
                }
                else if(self.getCurSetTimeWin().win.getFocusWin().id == "minuteBt"){
                    var position = {w : 90, h : 110, l : 1110, t : 330};
                    var data = self.sdata.startMinute.data;
                    var type = 1;
                    var cb = function(arr){
                        if(arr.length != 1){
                            return;
                        }
                        self.sdata.startMinute.index = arr[0];
                        self.getCurSetTimeWin().win.getChild("minuteBt").value = data[self.sdata.startMinute.index];
                    };
                    self.showList(position,data,type,cb,self.sdata.startMinute.index);
                }
                else if(self.getCurSetTimeWin().win.getFocusWin().id == "shourBt"){
                    var position = {w : 90, h : 110, l : 910, t : 410};
                    var data = self.sdata.totalHour.data;
                    var type = 1;
                    var cb = function(arr){
                        if(arr.length != 1){
                            return;
                        }
                        self.sdata.totalHour.index = arr[0];
                        self.getCurSetTimeWin().win.getChild("shourBt").value = data[self.sdata.totalHour.index];
                    };
                    self.showList(position,data,type,cb,self.sdata.totalHour.index);
                }
                else if(self.getCurSetTimeWin().win.getFocusWin().id == "sminuteBt"){
                    var position = {w : 90, h : 110, l : 1010, t : 410};
                    var data = self.sdata.totalMinute.data;
                    var type = 1;
                    var cb = function(arr){
                        if(arr.length != 1){
                            return;
                        }
                        self.sdata.totalMinute.index = arr[0];
                        self.getCurSetTimeWin().win.getChild("sminuteBt").value = data[self.sdata.totalMinute.index];
                    };
                    self.showList(position,data,type,cb,self.sdata.totalMinute.index);
                }
                else if(self.getCurSetTimeWin().win.getFocusWin().id == "okBt")
                {
                    self.print();
                    self.onkeyOkReocrd();
                }
                break;
            case UI.KEY.BACKSPACE:
                for(var i=0;i < self.wayBtArray.length;i++)
                {
                    if(self.wayBtArray[i].focus == true)
                    {
                        self.wayBtArray[i].win.setFocus(true);
                        break;
                    }
                }
                self.win.update();
                break;
            default:
                ret =false;
                break;
        }
        return false;
    };

    this.dayParams = self.singleParmas;
    this.dayProc = self.singleProc;
    this.weekParams = [
        {uiType:UIFrame,id:"setTime1Frame",l:905,t:160,w:320,h:480,type:"none",focusMoveMode:"circle"},

        {uiType:UILabel,id:"startDateLabel",ol:10,ot:0,w:100,h:40,font:uiCom.font.F20,value:Lp.getValue("start_date")},
        {uiType:UIButton,id:"yearBt",ol:5,ot:40,w:90,h:40,dt:5,
            value:"",HAlign:"left",font:uiCom.font.F20,
            color:"#96b4be",focusColor:"white",
            styleClass:"setTimeBt"
        },
        {uiType:UIButton,id:"monthBt",ol:5+90+10,ot:40,w:90,h:40,dt:5,
            value:"",HAlign:"left",font:uiCom.font.F20,
            color:"#96b4be",focusColor:"white",
            styleClass:"setTimeBt"
        },
        {uiType:UIButton,id:"dayBt",ol:5+90+90+20,ot:40,w:90,h:40,dt:5,
            value:"",HAlign:"left",font:uiCom.font.F20,
            color:"#96b4be",focusColor:"white",
            styleClass:"setTimeBt"
        },

        {uiType:UILabel,id:"selectWeekLabel",ol:10,ot:100,w:100,h:40,font:uiCom.font.F20,value:Lp.getValue("select_week")},
        {uiType:UIButton,id:"selectweekBt",ol:5,ot:140,w:300,h:40,dt:5,
            value:"",HAlign:"left",font:uiCom.font.F20,
            color:"#96b4be",focusColor:"white",
            styleClass:"weekBt"
        },


        {uiType:UILabel,id:"startDateLabel",ol:10,ot:200,w:100,h:40,font:uiCom.font.F20,value:Lp.getValue("start_time")},
        {uiType:UIButton,id:"apmBt",ol:5,ot:240,w:90,h:40,dt:5,
            value:"",HAlign:"left",font:uiCom.font.F20,
            color:"#96b4be",focusColor:"white",
            styleClass:"setTimeBt"
        },
        {uiType:UIButton,id:"hourBt",ol:5+90+10,ot:240,w:90,h:40,dt:5,
            value:"",HAlign:"left",font:uiCom.font.F20,
            color:"#96b4be",focusColor:"white",
            styleClass:"setTimeBt"
        },
        {uiType:UIButton,id:"minuteBt",ol:5+90+90+20,ot:240,w:90,h:40,dt:5,
            value:"",HAlign:"left",font:uiCom.font.F20,
            color:"#96b4be",focusColor:"white",
            styleClass:"setTimeBt"
        },

        {uiType:UILabel,id:"startDateLabel",ol:10,ot:300,w:100,h:40,font:uiCom.font.F20,value:Lp.getValue("record_time")},
        {uiType:UIButton,id:"shourBt",ol:5,ot:340,w:90,h:40,dt:5,
            value:"",HAlign:"left",font:uiCom.font.F20,
            color:"#96b4be",focusColor:"white",
            styleClass:"setTimeBt"
        },
        {uiType:UIButton,id:"sminuteBt",ol:5+90+10,ot:340,w:90,h:40,dt:5,
            value:"",HAlign:"left",font:uiCom.font.F20,
            color:"#96b4be",focusColor:"white",
            styleClass:"setTimeBt"
        },
        {uiType:UIButton,id:"okBt",ol:5+90+90+20,ot:340,w:90,h:40,dt:5,
            value:"预约",HAlign:"center",font:uiCom.font.F20,
            color:"#96b4be",focusColor:"white",
            styleClass:"okBt"
        }
    ];
    this.weekProc = function(e){
        var ret = true;
        switch(e.keyCode)
        {
            case UI.KEY.ENTER:

                if(self.getCurSetTimeWin().win.getFocusWin().id == "yearBt")
                {
                    var position = {w : 90, h : 110, l : 910, t : 240};
                    var data=self.sdata.year.data;
                    var type = 1;
                    var cb = function(arr)
                    {
                        if(arr.length != 1)
                        {
                            return;
                        }
                        self.sdata.year.index = arr[0];
                        self.getCurSetTimeWin().win.getChild("yearBt").value = data[self.sdata.year.index];
                    };
                    self.showList(position,data,type,cb,self.sdata.year.index);
                }
                else if(self.getCurSetTimeWin().win.getFocusWin().id == "monthBt"){
                    var position = {w : 90, h : 110, l : 1010, t : 240};
                    var data = self.sdata.month.data;
                    var type = 1;
                    var cb = function(arr){
                        if(arr.length != 1){
                            return;
                        }
                        self.sdata.month.index = arr[0];
                        self.getCurSetTimeWin().win.getChild("monthBt").value = data[self.sdata.month.index];
                    };
                    self.showList(position,data,type,cb,self.sdata.month.index);
                }
                else if(self.getCurSetTimeWin().win.getFocusWin().id == "dayBt"){
                    var position = {w : 90, h : 110, l : 1110, t : 240};
                    var data = self.sdata.day.data;
                    var type = 1;
                    var cb = function(arr){
                        if(arr.length != 1){
                            return;
                        }
                        self.sdata.day.index = arr[0];
                        self.getCurSetTimeWin().win.getChild("dayBt").value = data[self.sdata.day.index];
                    };
                    self.showList(position,data,type,cb,self.sdata.day.index);
                }
                else if(self.getCurSetTimeWin().win.getFocusWin().id == "selectweekBt"){
                    var position = {w : 300, h : 110, l : 910, t : 340};
                    var data = self.sdata.week.data;
                    var type = 2;
                    var cb = function(arr){

                        if(arr.length == 0){
                            return;
                        }
                        self.sdata.week.index = arr;
                        var str = "每周";
                        var wkArray = ["日", "一", "二", "三", "四", "五", "六"];
                        for(var i =0; i < arr.length; i++)
                        {
                            str += wkArray[arr[i]];
                            if((i+1) < arr.length)
                            {
                                str += ",";
                            }
                        }
                        self.getCurSetTimeWin().win.getChild("selectweekBt").value = str;
                    };
                    self.showList(position,data,type,cb);
                }
                else if(self.getCurSetTimeWin().win.getFocusWin().id == "apmBt"){
                    var position = {w : 90, h : 110, l : 910, t : 440};
                    var data = self.sdata.apm.data;
                    var type = 1;
                    var cb = function(arr){
                        if(arr.length != 1){
                            return;
                        }
                        self.sdata.apm.index = arr[0];
                        self.getCurSetTimeWin().win.getChild("apmBt").value = data[self.sdata.apm.index];
                    };
                    self.showList(position,data,type,cb,self.sdata.apm.index);
                }
                else if(self.getCurSetTimeWin().win.getFocusWin().id == "hourBt"){
                    var position = {w : 90, h : 110, l : 1010, t : 440};
                    var data = self.sdata.startHour.data;
                    var type = 1;
                    var cb = function(arr){
                        if(arr.length != 1){
                            return;
                        }
                        self.sdata.startHour.index = arr[0];
                        self.getCurSetTimeWin().win.getChild("hourBt").value = data[self.sdata.startHour.index];
                    };
                    self.showList(position,data,type,cb,self.sdata.startHour.index);
                }
                else if(self.getCurSetTimeWin().win.getFocusWin().id == "minuteBt"){
                    var position = {w : 90, h : 110, l : 1110, t : 440};
                    var data = self.sdata.startMinute.data;
                    var type = 1;
                    var cb = function(arr){
                        if(arr.length != 1){
                            return;
                        }
                        self.sdata.startMinute.index = arr[0];
                        self.getCurSetTimeWin().win.getChild("minuteBt").value = data[self.sdata.startMinute.index];
                    };
                    self.showList(position,data,type,cb,self.sdata.startMinute.index);
                }
                else if(self.getCurSetTimeWin().win.getFocusWin().id == "shourBt"){
                    var position = {w : 90, h : 110, l : 910, t : 540};
                    var data = self.sdata.totalHour.data;
                    var type = 1;
                    var cb = function(arr){
                        if(arr.length != 1){
                            return;
                        }
                        self.sdata.totalHour.index = arr[0];
                        self.getCurSetTimeWin().win.getChild("shourBt").value = data[self.sdata.totalHour.index];
                    };
                    self.showList(position,data,type,cb,self.sdata.totalHour.index);
                }
                else if(self.getCurSetTimeWin().win.getFocusWin().id == "sminuteBt"){
                    var position = {w : 90, h : 110, l : 1010, t : 540};
                    var data = self.sdata.totalMinute.data;
                    var type = 1;
                    var cb = function(arr){
                        if(arr.length != 1){
                            return;
                        }
                        self.sdata.totalMinute.index = arr[0];
                        self.getCurSetTimeWin().win.getChild("sminuteBt").value = data[self.sdata.totalMinute.index];
                    };
                    self.showList(position,data,type,cb,self.sdata.totalMinute.index);
                }
                else if(self.getCurSetTimeWin().win.getFocusWin().id == "okBt")
                {
                    self.print();
                    self.onkeyOkReocrd();
                }
                break;
            case UI.KEY.BACKSPACE:
                for(var i=0;i < self.wayBtArray.length;i++)
                {
                    if(self.wayBtArray[i].focus == true)
                    {
                        self.wayBtArray[i].win.setFocus(true);
                        break;
                    }
                }
                self.win.update();
                break;
            default:
                ret =false;
                break;
        }
        return false;
    };

    this.print = function(){
        var  w = self.getCurSetTimeWin().win;
        if(!w)
        {
            console.log("w is null");
        }
        else
        {
            console.log("year: "+w.getChild("yearBt").value);
            console.log("month: "+w.getChild("monthBt").value);
            console.log("day: "+w.getChild("dayBt").value);
            console.log("apm"+w.getChild("apmBt").value);
            console.log("hour: "+w.getChild("hourBt").value);
            console.log("minute: "+w.getChild("minuteBt").value);
            console.log("shour:"+ w.getChild("shourBt").value);
            console.log("sminute: " +w.getChild("sminuteBt").value);
        }
    };


    this.getRecordTime = function(type){
        var p = null;
        p = {
            year:self.sdata.year.value[self.sdata.year.index],
            month:self.sdata.month.value[self.sdata.month.index],
            day:self.sdata.day.value[self.sdata.day.index],
            apm:self.sdata.apm.value[self.sdata.apm.index],
            startHour:self.sdata.startHour.value[self.sdata.startHour.index] + self.sdata.apm.value[self.sdata.apm.index] * 12,
            startMinute:self.sdata.startMinute.value[self.sdata.startMinute.index],
            totalHour:self.sdata.totalHour.value[self.sdata.totalHour.index],
            totalMinute:self.sdata.totalMinute.value[self.sdata.totalMinute.index]
        };

        if(type == 2)
        {
            p.week = self.sdata.week.index;
        }
        return p;
    };

    this.checkRecordTime = function(type,p)
    {
        var flag = true;
        var date = new Date(p.year,p.month-1,p.day,p.startHour,p.startMinute,1);
        var curDate = new Date();
        console.log("date:"+date.toLocaleString());
        console.log("curDate:"+curDate.toLocaleString());
        if(type == 0)
        {
            if(date.getTime() <= curDate.getTime())
            {
                flag = false;
            }
        }
        else if(type == 1)
        {

        }
        else if(type == 2)
        {
            if(p.week.length <= 0)
            {
                flag = false;
            }
        }
        return flag;
    };

    this.initTemplate = function(type,t,e){
        var ch = self.getCurrentCh();
        if(ch == null)
        {
            return;
        }
        var startDate = new Date(t.year,t.month-1,t.day,t.startHour,t.startMinute,0);
        e.ch = {};
        e.ch.idn = ch.idn;
        e.ch.name = ch.name;
        e.ch.tsId = ch.tsId;
        e.ch.oriNetworkId = ch.oriNetworkId;
        e.ch.serviceId = ch.serviceId;
        if(type == 0)
        {
            e.startTime = getTimeStrfromDate(startDate);
            e.duration = t.totalHour*3600 + t.totalMinute*60;
        }
        else if(type == 1)
        {
            e.constraint.startTime = getTimeStrfromDate(startDate);
            e.constraint.hour = t.startHour;
            e.constraint.mintue = t.startMinute;
            e.constraint.duration = t.totalHour*3600 + t.totalMinute*60;
        }
        else if(type == 2)
        {
            e.constraint.week = t.week;
            e.constraint.hour = t.startHour;
            e.constraint.mintue = t.startMinute;
            e.constraint.startTime = getTimeStrfromDate(startDate);
            e.constraint.duration = t.totalHour*3600 + t.totalMinute*60;
        }

        console.log("initTemplate:"+JSON.stringify(e));
    };

    this.getConflictItem = function(et){
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

    this.onkeyOkReocrd = function() {
        var index = 0;
        for (var i = 0; i < self.setTimeParamsArray.length; i++) {
            if (self.setTimeParamsArray[i].select) {
                index = i;
                break;
            }
        }

        if(!sysCom.PVRService || sysCom.PVRService=="0"){
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
        if(!flag){
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

        //get record time
        var t = self.getRecordTime(index);
        //check time
        var f = self.checkRecordTime(index, t);
        if (!f) {
            console.log("时间过期");
            return;
        }
        //单次录制
        if (index == 0) {
            //get event
            var event = recordSchCom.getEventTemplate(recordSchCom.recordType.ONETIME);
            self.initTemplate(index, t, event);
            //获取冲突列表
            var al = recordSchCom.checkEventConflict(event);
            console.log("recordSchCom.checkEventConflict:" + JSON.stringify(al));
            //获取最优冲突列表
            var oplList = recordSchCom.getOptimalConflictBylist(al);
            console.log("recordSchCom.getOptimalConflictBylist:" + JSON.stringify(oplList));
            //设置tuner通道
            event.resId = oplList.resId;

            console.log("recordSchCom.addEvent:" + JSON.stringify(event));
            //如果最优冲突列表为0，则直接添加
            if (oplList.optimalList.length <= 0) {
                var ret = recordSchCom.addEvent(event);
            }
            //如果最优冲突列表不为0，则提示冲突列表
            else {
                var params = {
                    title: Lp.getValue("remind_conflict"),
                    okText: Lp.getValue("Ok"),
                    backText: Lp.getValue("Cancel"),
                    okIcon: "../cview_app_common_pic/ico_ok.png",
                    backIcon: "../cview_app_common_pic/ico_back.png",
                    text1: Lp.getValue("remind_conflict_ask_str"),
                    newTips: Lp.getValue("new_remind_conflict"),
                    oldTips: Lp.getValue("old_remind_conflict"),
                    newItem: null,
                    oldItem: null,
                    okfun: function () {
                        console.log("ok");
                    },
                    nofun: function () {
                        console.log("no");
                    }
                };
                //获取newItem
                params.newItem = self.getConflictItem(event);

                //获取oldItem
                params.oldItem = [];
                for (var i = 0; i < oplList.optimalList.length; i++) {
                    var item = self.getConflictItem(oplList.optimalList[i]);
                    params.oldItem.push(item);
                }
                //设置冲突列表弹窗参数
                params.okfun = function () {
                    console.log("ok");
                    recordSchCom.deleteConflictList(oplList.optimalList);
                    var ret = recordSchCom.addEvent(event);
                    console.log("ret:" + ret);
                };
                //弹出冲突列表
                var dia = new RecordingConflictDialog();
                dia.show(params);
            }

        }
        //每天录制
        else if (index == 1) {
            //get task
            var task = recordSchCom.getTaskTemplate(recordSchCom.recordType.DAYTIME);
            self.initTemplate(index, t, task);
            //获取冲突列表
            var al = recordSchCom.checkTaskConflict(task);
            console.log("recordSchCom.checkEventConflict:" + JSON.stringify(al));
            //获取最优冲突列表
            var oplList = recordSchCom.getOptimalConflictBylist(al);
            console.log("recordSchCom.getOptimalConflictBylist:" + JSON.stringify(oplList));
            //设置tuner通道
            task.resId = oplList.resId;

            console.log("recordSchCom.addTask:" + JSON.stringify(task));
            //如果最优冲突列表为0，则直接添加
            if (oplList.optimalList.length <= 0) {
                var ret = recordSchCom.addTask(task);
            }
            //如果最优冲突列表不为0，则提示冲突列表
            else {
                var params = {
                    title: Lp.getValue("remind_conflict"),
                    okText: Lp.getValue("Ok"),
                    backText: Lp.getValue("Cancel"),
                    okIcon: "../cview_app_common_pic/ico_ok.png",
                    backIcon: "../cview_app_common_pic/ico_back.png",
                    text1: Lp.getValue("remind_conflict_ask_str"),
                    newTips: Lp.getValue("new_remind_conflict"),
                    oldTips: Lp.getValue("old_remind_conflict"),
                    newItem: null,
                    oldItem: null,
                    okfun: function () {
                        console.log("ok");
                    },
                    nofun: function () {
                        console.log("no");
                    }
                };
                //获取newItem
                params.newItem = self.getConflictItem(task);

                //获取oldItem
                params.oldItem = [];
                for (var i = 0; i < oplList.optimalList.length; i++) {
                    var item = self.getConflictItem(oplList.optimalList[i]);
                    params.oldItem.push(item);
                }
                //设置冲突列表弹窗参数
                params.okfun = function () {
                    console.log("ok");
                    recordSchCom.deleteConflictList(oplList.optimalList);
                    var ret = recordSchCom.addTask(task);
                    console.log("ret:" + ret);
                };
                //弹出冲突列表
                var dia = new RecordingConflictDialog();
                dia.show(params);
            }
        }
        //每周录制
        else if (index == 2) {
            //get task
            var task = recordSchCom.getTaskTemplate(recordSchCom.recordType.WEEKTIME);
            self.initTemplate(index, t, task);
            //获取冲突列表
            var al = recordSchCom.checkTaskConflict(task);
            console.log("recordSchCom.checkEventConflict:" + JSON.stringify(al));
            //获取最优冲突列表
            var oplList = recordSchCom.getOptimalConflictBylist(al);
            console.log("recordSchCom.getOptimalConflictBylist:" + JSON.stringify(oplList));
            //设置tuner通道
            task.resId = oplList.resId;

            console.log("recordSchCom.addTask:" + JSON.stringify(task));
            //如果最优冲突列表为0，则直接添加
            if (oplList.optimalList.length <= 0) {
                var ret = recordSchCom.addTask(task);
            }
            //如果最优冲突列表不为0，则提示冲突列表
            else {
                var params = {
                    title: Lp.getValue("remind_conflict"),
                    okText: Lp.getValue("Ok"),
                    backText: Lp.getValue("Cancel"),
                    okIcon: "../cview_app_common_pic/ico_ok.png",
                    backIcon: "../cview_app_common_pic/ico_back.png",
                    text1: Lp.getValue("remind_conflict_ask_str"),
                    newTips: Lp.getValue("new_remind_conflict"),
                    oldTips: Lp.getValue("old_remind_conflict"),
                    newItem: null,
                    oldItem: null,
                    okfun: function () {
                        console.log("ok");
                    },
                    nofun: function () {
                        console.log("no");
                    }
                };
                //获取newItem
                params.newItem = self.getConflictItem(task);

                //获取oldItem
                params.oldItem = [];
                for (var i = 0; i < oplList.optimalList.length; i++) {
                    var item = self.getConflictItem(oplList.optimalList[i]);
                    params.oldItem.push(item);
                }
                //设置冲突列表弹窗参数
                params.okfun = function () {
                    console.log("ok");
                    recordSchCom.deleteConflictList(oplList.optimalList);
                    var ret = recordSchCom.addTask(task);
                    console.log("ret:" + ret);
                };
                //弹出冲突列表
                var dia = new RecordingConflictDialog();
                dia.show(params);
            }
        }
    };

    this.showRecoredConflict = function(text,cb){
        var pr = {
            proc : self.conflictDetailProc,
            win : self.win,
            frame : {
                w : 860,
                h : 400,
                t : 0,
                bg : "dialog/dialog_bg"
            },
            title : {
                dt : 7,
                font : uiCom.font.F20,
                color : "white",
                value : Lp.getValue("remind_conflict")
            },
            content : {
                dw : -30,
                dt : 2,
                dh : 20,
                dl : 2,
                labelDt : 10,
                firstRowHeadSpace : "",
                font : uiCom.font.F20,
                color : "white",
                msg : text,
                bgColor : "",
                HAlign : "left"
            },
            nav : {
                dt : 12,
                dl : 290,
                color : "white",
                font : uiCom.font.F20,
                groupSpace : 100,
                group : [
                    {
                        img : "user/ico_ok",
                        text : Lp.getValue("Ok"),
                        fun : cb,
                        key : UI.KEY.ENTER
                    },
                    {
                        img : "user/ico_back",
                        text : Lp.getValue("Cancel"),
                        fun : function(){
                            console.log("Cancel");
                        },
                        key : UI.KEY.BACKSPACE
                    }
                ]
            }
        };
        self.tipsDlg = new TextDialog(pr);
        self.tipsDlg.show();
    };

    this.getRecordConflictText = function(event,arraylist)
    {
        var str =   "  "+Lp.getValue("remind_conflict_ask_str") +
            "  "+Lp.getValue("new_remind_conflict") + getConflictText(event) +
        "- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n";
        for(var i = 0; i < arraylist.length; i++)
        {
            str = str + "  " + "    替换:   " +  getConflictText(arraylist[i]);
        }

        return str;
    };

    this.conflictDetailProc = function(e){
        var ret = true;

        switch(e.keyCode){
            case UI.KEY.UP:
                self.tipsDlg.onkeyUp();
                break;
            case UI.KEY.DOWN:
                self.tipsDlg.onkeyDown();
                break;
            default:
                self.tipsDlg.onkeyDefault(e.keyCode);
                //ret = false;
                break;
        }
        return ret;
    };

    this.closeConflictDetail = function(){
        if(self.tipsDlg){
            self.tipsDlg.close();
            self.tipsDlg = null;
        }
    };

    this.getDaysInMonth = function(year,month){
        month--;
        var d = new Date(year,month,1);
        d.setDate(d.getDate()+32-d.getDate());
        return (32-d.getDate());
    };

    /**
     * 获取生效的win
     * @returns {*}
     */
    this.getCurSetTimeWin = function(){
        for(var i = 0; i < self.setTimeParamsArray.length; i++)
        {
            if(self.setTimeParamsArray[i].select)
            {
                return self.setTimeParamsArray[i];
            }
        }
        return null;
    };

    /**
     * 更新设置时间区域窗口内容
     */
    this.changeSetTimeWin = function()
    {
        for(var i = 0; i < self.setTimeParamsArray.length; i++)
        {
            if(self.setTimeParamsArray[i].select)
            {
                self.setTimeParamsArray[i].win.destroy();
                self.setTimeParamsArray[i].select = false;
            }
        }

        for(var i = 0; i < self.wayBtArray.length;i++)
        {
            if(self.wayBtArray[i].focus && self.setTimeParamsArray[i].params != "")
            {
                self.setTimeParamsArray[i].select = true;
                self.setTimeParamsArray[i].win = UI.createGroup(self.setTimeParamsArray[i].params,"SetTime"+1,self.win);
                self.setTimeParamsArray[i].win.proc = self.setTimeParamsArray[i].proc;
                self.setTimeParamsArray[i].focusWin = self.setTimeParamsArray[i].win.getChild("yearBt");
                break;
            }
        }
        self.getDataArray();

        self.updateDataToWin();
    };

    this.showList = function(position,data,type,cb,index)
    {
        var params = {
            w : position.w, h : position.h, l : position.l, t : position.t, win:self.win, type : type, maxSize : 2,
            data : data,
            index:index?index:0,
            cb : function(arr){
                if(arr.length <= 0){
                    return;
                }
                cb(arr);
            }
        };
        if(type == 1)
        {
            params.background_img = "user/btnBg_highlight_100x45";
        }
        else
        {
            params.background_img = "user/recordWayBtn_highlight";
            params.selectImg = "user/ico_selected_gray";
        }
        (new ListDialog(params)).show();
    };


    this.setTimeParamsArray = [
        {select:false,win:"",params:self.singleParmas,proc:self.singleProc,focusWin:""},
        {select:false,win:"",params:self.dayParams,proc:self.dayProc,focusWin:""},
        {select:false,win:"",params:self.weekParams,proc:self.weekProc,focusWin:""}
    ];

    this.getDataArray = function(){
        self.sdata = {
            year:{
                data:[],
                value:[],
                index:0,
                get:function(){
                    var date = new Date();
                    self.sdata.year.value.push(date.getFullYear());
                    self.sdata.year.value.push(date.getFullYear()+1);
                    for(var i = 0; i < self.sdata.year.value.length;i++)
                    {
                        self.sdata.year.data[i] = self.sdata.year.value[i]+"年";
                    }
                    self.sdata.year.index = 0;
                }
            },
            month:{
                data:[],
                value:[],
                index:0,
                get:function(){
                    var date = new Date();
                    for(var i = 0; i < 12; i++)
                    {
                        self.sdata.month.value.push(i + 1);
                        self.sdata.month.data.push(""+(i+1)+"月");
                    }
                    self.sdata.month.index = date.getMonth();
                }
            },
            day:{
                data:[],
                value:[],
                index:0,
                get:function(){
                    var dayNum = self.getDaysInMonth(self.sdata.year.value[self.sdata.year.index],self.sdata.month.value[self.sdata.month.index]);

                    for(var i = 0; i < dayNum; i++)
                    {
                        self.sdata.day.value.push(i + 1);
                        self.sdata.day.data.push(""+(i+1)+"日");
                    }
                    var date = new Date();
                    self.sdata.day.index = date.getDate() - 1;
                }
            },
            week:{
                data:[],
                value:[],
                index:[],
                get:function(){
                    var wkArray = ["日", "一", "二", "三", "四", "五", "六"];
                    for(var i=0; i < 7; i++)
                    {
                        self.sdata.week.data.push("星期"+wkArray[i]);
                        //self.sdata.week.value.push(i);
                    }
                    self.sdata.week.index = (new Date()).getDay();
                }
            },
            apm:{
                data:[],
                value:[],
                index:0,
                get:function()
                {
                    for(var i =0;i < 2;i++)
                    {
                        self.sdata.apm.value.push(i);
                    }

                    self.sdata.apm.data.push(Lp.getValue("am"));
                    self.sdata.apm.data.push(Lp.getValue("pm"));

                    var date = new Date();

                    if(date.getHours() > 12)
                    {
                        self.sdata.apm.index = 1;
                    }
                }
            },
            startHour:{
                data:[],
                value:[],
                index:0,
                get:function(){
                    for(var i = 0;i < 12; i++)
                    {
                        self.sdata.startHour.data.push(""+i+"时");
                        self.sdata.startHour.value.push(i);
                    }

                    var date = new Date();
                    var hour = date.getHours();
                    self.sdata.startHour.index = hour > 12 ? (hour -12) : hour;
                }
            },
            startMinute:{
                data:[],
                value:[],
                index:0,
                get:function(){
                    for(var i = 0;i < 60; i++)
                    {
                        self.sdata.startMinute.data.push(""+i+"分");
                        self.sdata.startMinute.value.push(i);
                    }
                    var date = new Date();
                    var minute = date.getMinutes();
                    self.sdata.startMinute.index = minute;
                }
            },
            totalHour:{
                data:[],
                value:[],
                index:1,
                get:function(){
                    for(var i = 0;i < 12; i++)
                    {
                        self.sdata.totalHour.data.push(""+i+"时");
                        self.sdata.totalHour.value.push(i);
                    }
                }
            },
            totalMinute:{
                data:[],
                value:[],
                index:0,
                get:function(){
                    for(var i = 0;i < 6; i++)
                    {
                        self.sdata.totalMinute.data.push(""+i*10+"分");
                        self.sdata.totalMinute.value.push(i*10);
                    }
                }
            }
        }
    };


    this.updateDataToWin = function()
    {
        var w = self.getCurSetTimeWin().win;
        for(var a in self.sdata)
        {
            self.sdata[a].get();
        }
        w.getChild("yearBt").value = self.sdata.year.data[self.sdata.year.index];
        w.getChild("monthBt").value = self.sdata.month.data[self.sdata.month.index];
        w.getChild("dayBt").value = self.sdata.day.data[self.sdata.day.index];
        w.getChild("apmBt").value = self.sdata.apm.data[self.sdata.apm.index];
        w.getChild("hourBt").value = self.sdata.startHour.data[self.sdata.startHour.index];
        w.getChild("minuteBt").value = self.sdata.startMinute.data[self.sdata.startMinute.index];
        w.getChild("shourBt").value = self.sdata.totalHour.data[self.sdata.totalHour.index];
        w.getChild("sminuteBt").value = self.sdata.totalMinute.data[self.sdata.totalMinute.index];
    };

    /**************************************导航栏操作区**************************************/
    var navP = {
        l:55, t:643, w:1172, h:60, startOL:300, imgOt:30, txtOt:27, txtImgSpace:10,
        groupSpace:40, font:uiCom.font.F20, color:"#96b4be",
        dataArray:[
            {
                img:"user/ico_ok",
                text:Lp.getValue("select")
            },
            {
                img:"user/ico_blue",
                text:Lp.getValue("record_list")
            },
            {
                img:"user/ico_yellow",
                text:Lp.getValue("epg_nav_lock")
            },
            {
                img:"user/ico_back",
                text:Lp.getValue("epg_nav_last")
            }
        ]
    };
    this.createNavDlg = function(){
        self.navDlg = UI.createGroup(getNavParams(navP), "navDlg", self.win);
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
        var level = 0;
        var pfArray = epgCom.getChannelPf(dtvCom.chs[sysCom.config.chIndex], false);
        if(pfArray && pfArray.length == 2){
            level = pfArray[0].level
        }
        lockCom.unLockCallback(dtvCom.chs[sysCom.config.chIndex],level);
        self.videoStatus.eventLock = false;
        self.setVideoImg(self.videoFrameImg);
        self.hasUnlock = true;
        //播放频道
        self.doChangeCh(null, 0, true);
        //epg 重新加载
        self.setEpgInfo();
        self.win.update();
    };

    this.passwdProc = function(e){
        console.log(" PasswdOnkey Keycode:" + e.keyCode);
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

RecordingByTime.prototype = UIModule.baseModule;