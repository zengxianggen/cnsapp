function ReminderList(params,srcModule)
{
    var self = this;

    var content_l = 50;
    var content_t = 115;
    var content_w = 1180;
    var content_h = 530;

    var bl = 90;
    this.dlgParam = [
        {uiType:UIFrame,id:"backgroundFrame",l:0,t:0,w:UI.width,h:UI.height,type:"img",imgNames:["epg/reminder_background.jpg"],stretch:"HV"},
        {uiType:UILabel,id:"pageTitleLabel",ol:0,ot:50,w:UI.width,h:40,font:uiCom.font.F25,color:"white",HAlign:"center",value:Lp.getValue("epg_nav_remind_channel")},

        {uiType:UILabel,id:"titleLcnLabel",ol:bl + content_w*0.0,ot:150,w:content_w*0.1,font:uiCom.font.F20,color:"#8ECD8C",HAlign:"left",value:Lp.getValue("channlNum")},
        {uiType:UILabel,id:"titleLcnLabel",ol:bl + content_w*0.1,ot:150,w:content_w*0.2,font:uiCom.font.F20,color:"#8ECD8C",HAlign:"left",value:Lp.getValue("channle")},
        {uiType:UILabel,id:"titleLcnLabel",ol:bl + content_w*0.3,ot:150,w:content_w*0.4,font:uiCom.font.F20,color:"#8ECD8C",HAlign:"left",value:Lp.getValue("programName")},
        {uiType:UILabel,id:"titleLcnLabel",ol:bl + content_w*0.7,ot:150,w:content_w*0.1,font:uiCom.font.F20,color:"#8ECD8C",HAlign:"left",value:Lp.getValue("date")},
        {uiType:UILabel,id:"titleLcnLabel",ol:bl + content_w*0.8,ot:150,w:content_w*0.2,font:uiCom.font.F20,color:"#8ECD8C",HAlign:"left",value:Lp.getValue("time")}

    ];

    UI.ctx.font = uiCom.font.F20;
    var space1 = 40;
    var nav1L1 = 350;
    var nav1L2 = nav1L1 + 50 + 5 + UI.ctx.measureText(Lp.getValue("epg_nav_cancel_remind")).width + space1;
    var nav1L3 = nav1L2 + 25 + 5 + UI.ctx.measureText(Lp.getValue("epg_nav_lock")).width + space1;
    this.navParam = [
        {uiType : UIFrame, id : "nav2Frame", l : 55, t : 643, w : 1172, h : 60, type : "none"},
        {
            uiType : UIImg, id : "1Img1", ol : nav1L1, ot : 20, w : 45, h : 20,
            src : "epg/ico_ok", focusStop : false
        },
        {
            uiType : UILabel, id : "1Lab1", ol : nav1L1 + 35 + 5, ot : 27, w : UI.ctx.measureText(Lp.getValue("epg_nav_cancel_remind")).width,
            h : 20, value : Lp.getValue("epg_nav_cancel_remind"), font : uiCom.font.F20,
            HAlign : "left",
            color : "#96b4be"
        },

        {
            uiType : UIImg, id : "1Img2", ol : nav1L2, ot : 20, w : 25, h : 20, src : "epg/ico_yellow",
            stretch : "HV",
            focusStop : false
        },
        {
            uiType : UILabel, id : "1Lab2", ol : nav1L2 + 25 + 5, ot : 27, w : UI.ctx.measureText(Lp.getValue("epg_nav_lock")).width, h : 20,
            value : Lp.getValue("epg_nav_lock"),
            font : uiCom.font.F20,
            HAlign : "left",
            color : "#96b4be"
        },

        {
            uiType : UIImg, id : "1Img3", ol : nav1L3, ot : 20, w : 50, h : 20,
            src : "epg/ico_back",
            stretch : "HV",
            focusStop : false
        },
        {
            uiType : UILabel, id : "1Lab3", ol : nav1L3 + 50 + 5, ot : 27, w : UI.ctx.measureText(Lp.getValue("epg_nav_last")).width, h : 20,
            value : Lp.getValue("epg_nav_last"),
            font : uiCom.font.F20,
            HAlign : "left",
            color : "#96b4be"
        }
    ];

    this.open = function(){
        this.defOpen();
        this.createTb();
        this.navDlg = UI.createGroup(this.navParam, "navDlg", this.win);
    };

    this.close = function(){
        this.defClose();
    };

    this.start = function(){

    };

    this.stop = function(){

    };

    this.onkey = function(e){
        var ret = true;
        switch(e.keyCode)
        {
            case UI.KEY.ENTER:
                self.onkeyEnter();
                break;
            case UI.KEY.FUNYELLOW:
                self.showPasswdDialog();
                break;
            case UI.KEY.BACKSPACE:
                this.go(EpgPage);
                break;
            case UI.KEY.EPG:

                break;
            default:
                ret = false;
                break;
        }
        return ret;
    };


    this.createTb = function(){
        var Tb_l = content_l + 30;
        var Tb_t = content_t + 60;
        var Tb_w = content_w - 120;
        var Tb_h = content_h - 60;
        this.listTb = new UITable("null", "listTb", null, Tb_l, Tb_t, Tb_w, Tb_h,// ol ot w h
            {
                headUse : false, font : uiCom.font.F20, cols : 6, rowsOnePage : 9, HAlign : "right", color : "#96b4be",
                lineVWidth : 0, lineHWidth : 0, lineRectWidth : 0, LeaveFocusColor : "white", focusColor : "white",
                focusEnlargeH:60,
                skin : {
                    selectBar : {type : "img", imgNames : ["epg/channelGroup_markselected"], stretch : "HV"},
                    focusBar : {type : "img", imgNames : ["epg/channelGroup_selected"], stretch : "HV"}
                }
            }
        );
        this.listTb.setColWidthArr([this.listTb.w * 0.11,
                                    this.listTb.w * 0.22,
                                    this.listTb.w * 0.45,
                                    this.listTb.w * 0.11,
                                    this.listTb.w * 0.14,
                                    this.listTb.w * 0.1]);
        this.listTb.attach(self.win);
        this.listTb.proc = self.proc1;
        this.listTb.setColClip(0, true);
        this.listTb.setColClip(1, true);
        this.listTb.setColClip(2, true);
        this.listTb.setColClip(3, true);
        this.listTb.setColClip(4, true);
        self.addData();
        this.listTb.setFocus(true);
    };

    this.proc1 = function(e)
    {

    };

    this.addData = function(){
        var data = [];
        for(var i=0; i < reservationCom.reservationArray.array.length;i++)
        {
            var item = reservationCom.reservationArray.array[i];
            var sDate = getEpgStartDate(item.startTime);
            var eDate = getEpgEndDate(sDate,item.duration);
            var ch = dtvCom.chs[dtvCom.getIndexByNo(item.ch.idn)];


            data[i] = new Array();
            data[i][0] = item.ch.idn ;
            data[i][1] = item.ch.name ;
            if(!lockCom.checkAllLock(ch, item.level)) //检查锁
            {
                data[i][2] = item.name;
            }
            else
            {
                data[i][2] = Lp.getValue("epg_lock_msg");
            }
            data[i][3] = formatDate1(sDate);
            data[i][4] = formatTime2(sDate,eDate);
            data[i][5] = {type : "img", img : "epg/ico_clock"};
            data[i][6] = item;
        }
        self.listTb.removeItems();
        self.listTb.addItems(data);

        if(self.listTb.curIndex >= data.length)
        {
            self.listTb.curIndex = 0;
        }

        self.win.update();
    };

    this.delete = function(){
        if(self.listTb.rows <= 0)
        {
            return;
        }

        var shc = self.listTb.getRowItems(self.listTb.curIndex);

        if(!shc)
        {
            return;
        }
        reservationCom.delete(shc[6]);

        this.addData();
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

        lockCom.unLockCallback();
        lockCom.channelUnlock = true;
        lockCom.parentUnlock = true;
        //epg 重新加载
        self.addData();
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


    this.onkeyEnter = function(){
        if(self.listTb.rows <= 0)
        {
            return;
        }
        var item = self.listTb.getRowItems(self.listTb.curIndex);;
        var str = "您确认取消提醒\""+item[1]+" "+item[3]+" "+item[4] +" " +item[2]+"\"吗?";
        self.showRemoveDetail(str);
    };

    this.showRemoveDetail = function(text){
        var pr = {
            win : self.win,
            frame : {
                w : 360,
                h : 140,
                t : 0,
                bg: "dialog/dialog_bg"
            },
            title : {
                dt : 7,
                font:uiCom.font.F20,
                color : "white",
                value : "提醒收视"
            },
            content : {
                dw : -30,
                dt : 2,
                dh : -4,
                dl : 2,
                labelDt : 10,
                firstRowHeadSpace : "   ",
                font : uiCom.font.F20,
                color:"white",
                msg : text,
                bgColor : ""
            },
            nav : {
                dt : 4,
                dl : 70,
                color:"white",
                font:uiCom.font.F20,
                group : [
                    {
                        img : "epg/ico_ok",
                        text : "确认",
                        fun : function(){
                            self.delete();
                        },
                        key : UI.KEY.ENTER
                    },
                    {
                        img : "epg/ico_back",
                        text : "取消",
                        fun : function(){
                            console.log("back");
                        },
                        key : UI.KEY.BACKSPACE
                    }
                ]
            }
        };

        self.tipsDlg = new TextDialog(pr);
        self.tipsDlg.show();
    };

    this.closeRemoveDetail = function(){
        if(self.tipsDlg){
            self.tipsDlg.close();
            self.tipsDlg = null;
        }
    };


}
ReminderList.prototype = UIModule.baseModule;