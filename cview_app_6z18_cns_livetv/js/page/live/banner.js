function Banner(params){
    var self = this;

    this.params = params;
    this.bannerIndex = 0;
    this.timer = null;
    this.changeTimer = null;

    this.pfDetailDialog = null;

    this.bannerpfForamt = [];

    this.checkAdTimer = null;

    var bw = 1280;
    var bh = 200;
    var bt = (UI.height - bh);
    var bl = (UI.width - bw) / 2;

    this.dlgParam = [
        {
            uiType : UIFrame,
            id : "banner_bk",
            l : bl,
            t : bt,
            w : bw,
            h : bh,
            type : "img",
            imgNames : ["live/PF_bg"],
            stretch : "HV",
            focusStop : true
        },
        {
            uiType : UILabel,
            id : "channelId",
            ol : 0,
            ot : 30,
            w : 400,
            h : 40,
            value : "",
            font : uiCom.font.F30,
            HAlign : "center",
            color : "#209cc2"
        },
        {
            uiType : UILabel,
            id : "channelName",
            ol : 0,
            ot : 80,
            w : 400,
            h : 40,
            value : "",
            font : uiCom.font.F30,
            HAlign : "center",
            color : "#F0F0F0"
        },
        {
            uiType : UILabel,
            id : "bannerTime",
            ol : 760,
            ot : 10,
            w : 200,
            h : 40,
            value : "",
            font : uiCom.font.F20,
            HAlign : "center",
            color : "#F0F0F0"
        },
        {
            uiType : UILabel,
            id : "firstPfTime",
            ol : 460,
            ot : 60,
            w : 120,
            h : 40,
            value : "",
            font : uiCom.font.F20,
            HAlign : "left",
            color : "#F0F0F0"
        },
        {
            uiType : UILabel,
            id : "firstPfName",
            ol : 580,
            ot : 60,
            w : 320,
            h : 40,
            value : "",
            font : uiCom.font.F20,
            HAlign : "left",
            color : "#F0F0F0"
        },
        {
            uiType : UILabel,
            id : "firstNonePf",
            ol : 460,
            ot : 60,
            w : 320,
            h : 40,
            value : "",
            font : uiCom.font.F20,
            HAlign : "left",
            color : "#F0F0F0"
        },
        {uiType : UIImg, id : "firstPfLevel", ol : 900, ot : 60, w : 30, h : 30, src : "live/ico_pu"},
        {
            uiType : UIProgress,
            id : "pro_progress",
            w : 520,
            h : 8,
            ol : 460,
            ot : 60 + 32,
            value : 0,
            styleClass : "banner_progress",
            maxValue : 100,
            notShowValue : true
        },
        {
            uiType : UILabel,
            id : "secondPfTime",
            ol : 460,
            ot : 110,
            w : 120,
            h : 40,
            value : "",
            font : uiCom.font.F20,
            HAlign : "left",
            color : "#C2C2C2"
        },
        {
            uiType : UILabel,
            id : "secondPfName",
            ol : 580,
            ot : 110,
            w : 320,
            h : 40,
            value : "",
            font : uiCom.font.F20,
            HAlign : "left",
            color : "#C2C2C2"
        },
        {
            uiType : UILabel,
            id : "secondNonePf",
            ol : 460,
            ot : 110,
            w : 320,
            h : 40,
            value : "",
            font : uiCom.font.F20,
            HAlign : "left",
            color : "#C2C2C2"
        },
        {uiType : UIImg, id : "secondPfLevel", ol : 900, ot : 110, w : 30, h : 30, src : "live/ico_pu"},

        {uiType : UIImg, id : "icon_ad", ol : 460 + 510 , ot : 25, w : 250, h : 150, src : "live/BBTV_logo"}

    ];

    this.navParam1 = [
        //HD  DOBLY   LOCK
        {uiType : UIFrame, id : "bannerNav1", ol : 460, ot : 10, w : 300, h : 40, type : "none"},

        {uiType : UIImg, id : "nav1Img1", ot : 0},

        {uiType : UIImg, id : "nav1Img2", ot : 0},

        {uiType : UIImg, id : "nav1Img3", ot : 0},

        {uiType : UIImg, id : "nav1Img4", ot : 0},

        {uiType : UIImg, id : "nav1Img5", ot : 0}
    ];

    this.navParam2 = [
        //OK  RED  PAUSE  GREEN Multi Language
        {uiType : UIFrame, id : "bannerNav2", ol : 260, ot : 155, w : 700, h : 40, type : "none"},
        {uiType : UIImg, id : "nav2Img1", ot : 0},
        {
            uiType : UILabel,
            id : "nav2Label1",
            font : uiCom.font.F18,
            HAlign : "left",
            color : "#C2C2C2",
            h : 40,
            ot : -4
        },

        {uiType : UIImg, id : "nav2Img2", ot : 0},
        {
            uiType : UILabel,
            id : "nav2Label2",
            font : uiCom.font.F18,
            HAlign : "left",
            color : "#C2C2C2",
            h : 40,
            ot : -4
        },

        {uiType : UIImg, id : "nav2Img3", ot : 0},
        {
            uiType : UILabel,
            id : "nav2Label3",
            font : uiCom.font.F18,
            HAlign : "left",
            color : "#C2C2C2",
            h : 40,
            ot : -4
        },

        {uiType : UIImg, id : "nav2Img4", ot : 0},
        {
            uiType : UILabel,
            id : "nav2Label4",
            font : uiCom.font.F18,
            HAlign : "left",
            color : "#C2C2C2",
            h : 40,
            ot : -4
        },

        {uiType : UIImg, id : "nav2Img5", ot : 0},
        {
            uiType : UILabel,
            id : "nav2Label5",
            font : uiCom.font.F18,
            HAlign : "left",
            color : "#C2C2C2",
            h : 40,
            ot : -4
        }
    ];

    this.multiAudioParams = [
        {
            uiType:UIFrame,
            id:"multiAudioFrame",
            ol:460 + 510 + 30,
            ot:-40,
            w:310,
            h:40,
            type:"img",
            imgNames:["live/audio_track_bg"],
            stretch:"HV",
            visibility:-1
        },
        {
            uiType:UILabel,
            id:"multiAudioLabel",
            ol:0,
            ot:0,
            w:310,
            h:40,
            dt:10,
            font:uiCom.font.F20,
            color:"white",
            HAlign:"center",
            value:"音轨1:中文"
        }
    ];

    this.subtitleParams = [
        {
            uiType:UIFrame,
            id:"subtitleFrame",
            ol:460 + 510 + 30,
            ot:-370,
            w:200,
            h:40,
            type:"img",
            imgNames:["live/subtitleBg_280x40"],
            stretch:"HV",
            visibility:-1
        },
        {
            uiType:UILabel,
            id:"subtitleLabel",
            ol:0,
            ot:0,
            w:200,
            h:40,
            dt:5,
            font:uiCom.font.F20,
            color:"white",
            HAlign:"center",
            value:"字幕:繁中"
        }
    ];



    /***********************banner 创建，显示，更新*************************/
    this.create = function(){
        UI.res.set("banner_progress", {
            skin : {
                barRect : {type : "img", imgNames : ["live/process_back_bg"], stretch : "HV"},
                progRect : {type : "img", imgNames : ["live/process_front_bg"], stretch : "HV"}
            }
        });

        self.dlg = UI.createGroup(this.dlgParam, "banner", self.params.win);
        self.nav1Dlg = UI.createGroup(this.navParam1, "bannerNav1", self.dlg);
        self.nav2Dlg = UI.createGroup(this.navParam2, "bannerNav2", self.dlg);
        self.mAudioDlg = UI.createGroup(this.multiAudioParams, "bannermAudio", self.dlg);
        self.subtitleDlg = UI.createGroup(this.subtitleParams,"bannerSubtitle",self.dlg);
        self.dlg.visibility = -1;
        this.bannerIndex = sysCom.config.chIndex;
        self.startAd();
    };


    /*
    * delayFlag: 是否延时消失  true:消失
    * updateFlag: true:显示当前播放频道信息  false:显示banner自记录频道信息
    * syncFlag :  目前没用
    * */
    this.show = function(delayFlag, updateFlag, syncFlag){
        if(dtvCom.chs.length <= 0) {
            return;
        }
        self.closePfDetail();
        self.dlg.proc = self.onkey;
        self.dlg.visibility = 1;
        self.dlg.setFocus(true);
        if(delayFlag){
            self.openTimer();
        }
        self.update(updateFlag, syncFlag);
    };

    /************tvportal 广告控制区***********/

    this.startAd = function(){

        self.checkAdTimer = setInterval(function(){
            if(dsmssCom.adStatus == "4")
            {
                console.log("banner ad start!");
                clearInterval(self.checkAdTimer);
                self.checkAdTimer = null;

                var str = dsmssCom.getAdXml(CA.caGetZipCode(false));
                var p = {
                    dat:str,
                    url: dsmssCom.getAdBasePath(CA.caGetZipCode(false)),    //广告文件文件夹路径
                    block: "miniepg",   //广告窗口位置:"portal","epg","miniepg"
                    win: self.params.win,  //父窗口
                    adWin:self.dlg.getChild("icon_ad")     //广告子窗口
                };
                self.adModule = new AD(p);
                self.adModule.start();
            }

        },1000);
    };


    /*
    *
    * 更新banner上的信息
    * */
    this.update = function(updateFlag){

        var ch = null;

        if(updateFlag){
            self.bannerIndex = sysCom.config.chIndex;
        }

        if(self.bannerIndex < dtvCom.chs.length && self.bannerIndex >= 0){
            ch = dtvCom.chs[self.bannerIndex];
        }


        if(!ch)
        {
            return;
        }

        //upate   banner data
        self.dlg.getChild("channelId").value = format3ChannelNo(ch.idn);
        self.dlg.getChild("channelName").value = ch.name;
        self.dlg.getChild("bannerTime").value = self.getBannerTime();
        //update PF
        self.updateBannerPF(ch);
        //update  navParam1
        self.updateNavParam1(ch);
        //update  navParam2
        self.updateNavParam2(ch);

        self.dlg.update();
    };
    /***********************banner PF信息更新控制*************************/


    this.updateBannerPF = function(ch){
        var curCh = null;
        if(ch)
        {
            curCh = ch;
        }
        else if(self.bannerIndex < dtvCom.chs.length && self.bannerIndex >= 0)
        {
            curCh = dtvCom.chs[self.bannerIndex];
        }

        self.bannerpfForamt = [];

        var pfArray = epgCom.getChannelPf(ch, false);
        {
            self.bannerpfForamt = pfArray;

            var isLock =  false;

            //有PF信息，无锁
            if(pfArray.length > 0){
                self.dlg.getChild("firstPfTime").value = pfArray[0].timeStr;
                if(lockCom.checkAllLock(ch,pfArray[0].level)){
                    self.dlg.getChild("firstPfName").value = Lp.getValue("pf_lock_msg");
                }
                else{
                    self.dlg.getChild("firstPfName").value = getEllipsisString(uiCom.font.F20, self.dlg.getChild("firstPfName").w, pfArray[0].name);

                }
                if(lockCom.checkAllLock(ch,pfArray[1].level)){
                    self.dlg.getChild("secondPfName").value = Lp.getValue("pf_lock_msg");
                }
                else{
                    self.dlg.getChild("secondPfName").value = getEllipsisString(uiCom.font.F20, self.dlg.getChild("secondPfName").w, pfArray[1].name);

                }

                self.dlg.getChild("firstNonePf").value = "";
                self.dlg.getChild("firstPfLevel").ol = 590 + getStrLength(uiCom.font.F20, self.dlg.getChild("firstPfName").value);
                self.dlg.getChild("pro_progress").value = pfArray[0].process;
                self.dlg.getChild("secondPfTime").value = pfArray[1].timeStr;
                self.dlg.getChild("secondNonePf").value = "";
                self.dlg.getChild("secondPfLevel").ol = 590 + getStrLength(uiCom.font.F20, self.dlg.getChild("secondPfName").value);
                //set epg rate level
                self.dlg.getChild("firstPfLevel").setSrc(getEpgImgByRate(pfArray[0].level));
                self.dlg.getChild("secondPfLevel").setSrc(getEpgImgByRate(pfArray[1].level));
                self.dlg.getChild("firstPfLevel").visibility = 1;
                self.dlg.getChild("secondPfLevel").visibility = 1;
                self.dlg.update();
            }
            else{
                self.dlg.getChild("firstPfTime").value = "";
                self.dlg.getChild("firstPfName").value = "";
                self.dlg.getChild("firstNonePf").value = Lp.getValue("NoPfInfo");
                self.dlg.getChild("firstPfLevel").ol = 900;
                self.dlg.getChild("pro_progress").value = 0;
                self.dlg.getChild("secondPfTime").value = "";
                self.dlg.getChild("secondPfName").value = "";
                self.dlg.getChild("secondNonePf").value = Lp.getValue("NoPfInfo");
                self.dlg.getChild("secondPfLevel").ol = 900;
                self.dlg.getChild("firstPfLevel").visibility = -1;
                self.dlg.getChild("secondPfLevel").visibility = -1;
                self.dlg.update();
            }
        }

    };

    /***********************banner 上部导航区更新*************************/
    this.updateNavParam1 = function(ch){
        var nav1Array = new Array();
        var startOl = 0;
        var curOl = startOl;
        var space = 5;

        //HD
        if (0x0200 & ch.data.category){
            nav1Array[nav1Array.length] = "live/HD";
        }

        //dolby
        if(ch.userData &&ch.audio ) {
            if(!ch.userData.audioSelect)
                ch.userData.audioSelect =0;
            if (ch.userData.audioSelect < ch.audio.length &&
                ( ch.audio[ch.userData.audioSelect].type == 0x06 || ch.audio[ch.userData.audioSelect].type == 0x81 ||
                    ch.audio[ch.userData.audioSelect].type == 0x87)) {
                nav1Array[nav1Array.length] = "live/ico_dolby";
            }
        }
        //lock
        if(ch.userData && ch.userData.lock){
            nav1Array[nav1Array.length] = "live/ico_lock";
        }


        for(var i = 0; i < 5; i++){
            if(i < nav1Array.length)
            {
                self.nav1Dlg.getChild("nav1Img" + (i + 1)).visibility = 1;
                self.nav1Dlg.getChild("nav1Img" + (i + 1)).ol = curOl;
                self.nav1Dlg.getChild("nav1Img" + (i + 1)).w = UI.res.imgs[nav1Array[i]].width;
                self.nav1Dlg.getChild("nav1Img" + (i + 1)).setSrc(nav1Array[i]);
                curOl += (space + self.nav1Dlg.getChild("nav1Img" + (i + 1)).w);
            }
            else
            {
                self.nav1Dlg.getChild("nav1Img" + (i + 1)).visibility = -1;
            }
        }
    };


    /***********************banner 下部导航区更新*************************/
    this.updateNavParam2 = function(ch){
        var startOl = 0;
        var curOl = startOl;
        var space1 = 5;
        var space2 = 15;

        var nav2Array = new Array();
        //频道切换&节目简介
        nav2Array[0] = {};
        nav2Array[0].img = "live/ico_ok";


        if(sysCom.config.chIndex == self.bannerIndex){

            nav2Array[0].text = Lp.getValue("Program_synopsis");
        }
        else {

            nav2Array[0].text = Lp.getValue("Change_channel");
        }

        if(sysCom.config.chIndex != self.bannerIndex)
        {
            self.nav2Dlg.getChild("nav2Label" + (0 + 1)).w = getStrLength(uiCom.font.F18, nav2Array[0].text);
            self.nav2Dlg.getChild("nav2Label" + (0 + 1)).value = nav2Array[0].text;
            return;
        }
        //节目列表
        nav2Array[1] = {};
        nav2Array[1].img = "live/ico_red";
        nav2Array[1].text = Lp.getValue("Channel_List");

        //是否支持时移
        if(1){
            nav2Array[nav2Array.length] = {};
            nav2Array[nav2Array.length - 1].img = "live/ico_playpause";
            nav2Array[nav2Array.length - 1].text = Lp.getValue("Timeshift");
        }


        //是否支持 subtitle
        if(ch.subt){
            nav2Array[nav2Array.length] = {};
            nav2Array[nav2Array.length - 1].img = "live/ico_green";
            nav2Array[nav2Array.length - 1].text = Lp.getValue("ChangeSub");
        }

        //是否有 multi Audio
        if(ch.audio && ch.audio.length > 1){
            nav2Array[nav2Array.length] = {};
            nav2Array[nav2Array.length - 1].img = "live/ico_language";
            nav2Array[nav2Array.length - 1].text = Lp.getValue("ChangeMultiLanguage");
        }

        for(var i = 0; i < 5; i++){
            if(i >=　nav2Array.length)
            {
                self.nav2Dlg.getChild("nav2Img" + (i + 1)).visibility = -1;
                self.nav2Dlg.getChild("nav2Label" + (i + 1)).visibility = -1;
                continue;
            }

            self.nav2Dlg.getChild("nav2Img" + (i + 1)).ol = curOl;
            self.nav2Dlg.getChild("nav2Img" + (i + 1)).w = UI.res.imgs[nav2Array[i].img].width;
            self.nav2Dlg.getChild("nav2Img" + (i + 1)).setSrc(nav2Array[i].img);
            curOl += (space1 + self.nav2Dlg.getChild("nav2Img" + (i + 1)).w);

            self.nav2Dlg.getChild("nav2Label" + (i + 1)).ol = curOl;
            self.nav2Dlg.getChild("nav2Label" + (i + 1)).w = getStrLength(uiCom.font.F18, nav2Array[i].text);
            self.nav2Dlg.getChild("nav2Label" + (i + 1)).value = nav2Array[i].text;
            curOl += (space2 + self.nav2Dlg.getChild("nav2Label" + (i + 1)).w);

            self.nav2Dlg.getChild("nav2Img" + (i + 1)).visibility = 1;
            self.nav2Dlg.getChild("nav2Label" + (i + 1)).visibility = 1;
        }
    };

    /***********************banner 多音轨功能区*************************/
    this.showMultiAudio = function(){
        //判断当前节目是否有效
        if(sysCom.config.chIndex < 0 || sysCom.config.chIndex >= dtvCom.chs.length)
        {
            return ;
        }

        //获取到当前节目
        var ch =  dtvCom.chs[sysCom.config.chIndex];


        //变换选择的音轨
        if(ch.audio.length > 1)
        {
            ch.userData.audioSelect += (1 + ch.audio.length);
            ch.userData.audioSelect %= ch.audio.length;

            var params = {
                chanId: ch.idn,
                data: ch.userData
            };

            DB.dbSetChanUserData(params, function () {
                utility.setH5Storage("CNS_DVB_CHS", self.chs);
            });

			var param = {
				aStreamType:ch.audio[ch.userData.audioSelect].type,
				pid:ch.audio[ch.userData.audioSelect].pid
			};
			dtvCom.changeAudio(param);
        }
        else
        {
            return;
        }


        var label = self.mAudioDlg.getChild("multiAudioLabel");

        //如果有EPG详细咨询显示窗口则关闭
        self.closePfDetail();

        self.openTimer();


        //显示的音轨信息
		var tips = "";
		if(getCountryByCode(ch.audio[ch.userData.audioSelect].lang) == "chi")
        {
            tips = Lp.getValue("Chinese");
        }
		else if(getCountryByCode(ch.audio[ch.userData.audioSelect].lang) == "eng"){
			tips = Lp.getValue("English");
		}
		else{
		    tips = getCountryByCode(ch.audio[ch.userData.audioSelect].lang);
        }

        label.value = Lp.getValue("audio_track") + (ch.userData.audioSelect+1) + ":" + tips;
        self.mAudioDlg.visibility = 1;
        self.mAudioDlg.update();
        self.mAudioDlg.show(sysCom.config.displayTime*1000,function(){
            self.mAudioDlg.visibility = -1;
            self.mAudioDlg.update();
        });
    };

    /***********************banner 字幕功能区*************************/
    this.showSubtitle = function(){
        //判断当前节目是否有效
        if(sysCom.config.chIndex < 0 || sysCom.config.chIndex >= dtvCom.chs.length)
        {
            return ;
        }

        //获取到当前节目
        var ch =  dtvCom.chs[sysCom.config.chIndex];

        if(ch.subt && ch.subt.length > 0)
        {

            if(!ch.userData){
                ch.userData = {};
                ch.userData.subtitleSelect = 0;
            }

            if(!ch.userData.subtitleSelect){
                ch.userData.subtitleSelect = 0;
            }

            ch.userData.subtitleSelect++;

            if (ch.userData.subtitleSelect >= ch.subt.length) {

                ch.userData.subtitleSelect = -1;
                Subtitle.subtStop(null,false);
                self.subtitleDlg.getChild("subtitleLabel").value = Lp.getValue("subtClose");
                self.subtitleDlg.visibility = 1;
                self.subtitleDlg.show(3000,function(){
                    self.subtitleDlg.visibility = -1;
                });
                return;
            }

            Subtitle.subtStop(null,false);

            var params = {
                "pid": ch.subt[ch.userData.subtitleSelect].pid,
                "pageId": 2,
                "ancillaryId": 1
            };
            Subtitle.subtStart(params,false);
        }
        else
        {
            return;
        }
        var label = self.subtitleDlg.getChild("subtitleLabel");
        //如果有ＥＰＧ详细咨询显示窗口则关闭
        self.closePfDetail();

        self.openTimer();

        //显示当前字幕
        var tips = "";
        if(getCountryByCode(ch.subt[ch.userData.subtitleSelect].lang) == "chi")
        {
            tips = Lp.getValue("Chinese");
        }
        else{
            tips = getCountryByCode(ch.subt[ch.userData.subtitleSelect].lang);
        }

        label.value = Lp.getValue("subtitle") + (ch.userData.subtitleSelect+1) + ":" + tips;
        self.subtitleDlg.visibility = 1;
        self.subtitleDlg.show(3000,function(){
            self.subtitleDlg.visibility = -1;
        });
    };


    /***********************banner 详细EPG信息显示窗口*************************/
    this.showPfDetail = function(){
            var text = "";
            var pr = {
                win : self.dlg,
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
                            img : "live/ico_ok",
                            text : Lp.getValue("Ok"),
                            fun : function(){
                                self.closePfDetail();
                                self.dlg.setFocus(true);
                                self.openTimer();
                            },
                            key : UI.KEY.ENTER
                        }
                    ]
                }
            };

        var curCh = dtvCom.chs[self.bannerIndex];
        var pfArray = epgCom.getChannelPf(ch, false);

        if(!pfArray || pfArray.length <= 0){
            pr.content.msg = Lp.getValue("NoPfInfo");
            pr.title.value = Lp.getValue("NoPfInfo");
        }
        else{
            if(lockCom.checkAllLock(curCh,pfArray[0].level)){
                pr.title.value = Lp.getValue("epg_lock_msg");
                pr.content.msg = Lp.getValue("epg_lock_msg");
            }
            else{
                if(pfArray[0].rawData.extendEvent && pfArray[0].rawData.extendEvent.text){
                    pr.content.msg = pfArray[0].rawData.extendEvent.text;
                }
                else{
                    pr.content.msg = pfArray[0].name;
                }
                pr.title.value = pfArray[0].name;
            }
        }
        self.pfDetailDialog = new TextDialog(pr);
        self.pfDetailDialog.show();
    };

    this.closePfDetail = function(){
        if(self.pfDetailDialog){
            self.pfDetailDialog.close();
            self.pfDetailDialog = null;
        }
    };


    /***********************banner 定时或按键控制区*************************/
    this.getBannerTime = function(){
        var date = new Date();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var week = date.getDay();
        var hour = date.getHours();
        var min = date.getMinutes();

        month = ( month < 10) ? "0" + month : "" + month;
        day = ( day < 10) ? "0" + day : "" + day;
        hour = ( hour < 10) ? "0" + hour : "" + hour;
        min = ( min < 10) ? "0" + min : "" + min;
        var str = month + "/" + day + "(" + Lp.getValue("w" + week) + ")" + hour + ":" + min;
        return str;
    };

    this.openTimer = function(){

        self.stopTimer();
        self.timer = setTimeout(function(){
            self.close(true);
        }, 1000 * 5);
    };

    this.stopTimer = function(){
        if(self.timer){
            clearTimeout(self.timer);
            self.timer = null;
        }
    };

    this.close = function(updateFlag){
        self.stopTimer();
        self.dlg.proc = function(){};
        self.dlg.visibility = -1;
        self.closePfDetail();
        if(updateFlag){
            self.dlg.update();
        }
        this.bannerIndex = sysCom.config.chIndex;

        clearInterval(self.checkAdTimer);
        self.checkAdTimer = null;

        console.log("banner close");
    };

    this.onkeyUp = function(){
        self.bannerIndex += (dtvCom.chs.length + 1);
        self.bannerIndex %= dtvCom.chs.length;
        self.update();
        self.dlg.update();
        self.openTimer();
    };

    this.onkeyDown = function(){
        self.bannerIndex += (dtvCom.chs.length - 1);
        self.bannerIndex %= dtvCom.chs.length;

        self.update();
        self.dlg.update();
        self.openTimer();
    };

    this.changeCh = function(){
        if(this.changeTimer){
            clearTimeout(self.changeTimer);
        }
        var no = dtvCom.chs[self.bannerIndex].idn;
        this.changeTimer = setTimeout(function(){
            params.live.changeCh(idn, step, true, cb);
            self.changeTimer = null;
            self.close(true);
        }, 300);
    };

    this.onkeyEnter = function(){
        if(self.bannerIndex != sysCom.config.chIndex){

            if(dtvCom.chs.length == 0){
                return;
            }
            params.live.changeCh(dtvCom.chs[self.bannerIndex].idn, null, true, params.live.passwdCb);
            self.close(true);
        }
        else {
            //查看节目简介
            self.stopTimer();
            self.showPfDetail();
        }
    };

    this.onkey = function(e){
        console.log("Banner keycode:" + e.keyCode);
        var ret = true;
        switch(e.keyCode){
            case UI.KEY.ENTER:
                self.onkeyEnter();
                break;
            case UI.KEY.BACKSPACE:
                self.close();
                break;
            case UI.KEY.UP:
                self.onkeyUp();
                break;
            case UI.KEY.DOWN:
                self.onkeyDown();
                break;
            case UI.KEY.LANG:
                self.showMultiAudio();
                break;
            default:
                ret = false;
                break;
        }
        return ret;
    };

    this.create();

    return this;
}