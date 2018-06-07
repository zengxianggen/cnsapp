function ScheduledList(){
    var self = this;

    var chTimer = null;
    this.dlgParam = [
        {
            uiType : UIFrame,
            id : "bgFrame",
            l : 0,
            t : 0,
            w : UI.width,
            h : UI.height,
            type : "img",
            imgNames : ["user/pvrScheT_background"],
            stretch : "HV"
        },
        {
            uiType : UIImg,
            id : "titleBgImg",
            ol : 50,
            ot : 50,
            w : 1180,
            h : 40,
            src : "user/title_bg",
            stretch : "HV"
        },
        {
            uiType : UIImg,
            id : "chlistBgImg",
            ol : 50,
            ot : 115,
            w : 340,
            h : 530,
            src : "user/channelList_bg_345x536",
            stretch : "HV"
        },
        {
            uiType : UIImg,
            id : "eventBgImg",
            ol : 400,
            ot : 115,
            w : 825,
            h : 530,
            src : "user/eventList_bg_820x536",
            stretch : "HV"
        },

        {
            uiType : UILabel,
            id : "epgTitle",
            ol : (UI.width - 300) / 2,
            ot : 60,
            w : 300,
            h : 30,
            dt : 4,
            value : Lp.getValue("recording_list_title"),
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
            value : "",
            font : uiCom.font.F20,
            HAlign : "left",
            color : "grey"
        },

        {
            uiType : UILabel, id : "chLabel", ol : 75, ot : 125, w : 100, h : 40,
            font : uiCom.font.F20, color : "#62815a", value : Lp.getValue("channle")
        },

        {
            uiType : UILabel, id : "chNum", ol : 315, ot : 125, w : 100, h : 40,
            font : uiCom.font.F20, color : "grey", value : "1/1"
        },

        {
            uiType : UILabel, id : "proName", ol : 453, ot : 125, w : 100, h : 40,
            font : uiCom.font.F20, color : "#62815a", value : Lp.getValue("programName")
        },

        {
            uiType : UILabel, id : "startDate", ol : 820, ot : 125, w : 100, h : 40,
            font : uiCom.font.F20, color : "#62815a", value : Lp.getValue("start_date")
        },

        {
            uiType : UILabel, id : "start_end_time", ol : 970, ot : 125, w : 140, h : 40,
            font : uiCom.font.F20, color : "#62815a", value : Lp.getValue("start_end_time")
        },

        {
            uiType : UILabel, id : "eventNum", ol : 1150, ot : 125, w : 100, h : 40,
            font : uiCom.font.F20, color : "grey", value : "0/0",HAlign:"rigth"
        }
    ];

    this.open = function(){
        self.defOpen();
    };

    this.start = function(){
        self.openTimer();
        self.initStyleClass();
        self.createDlg();
        self.addData();
    };

    this.stop = function(){
        self.closeTimer();
    };

    this.close = function(){
        self.defClose();
    };

    this.onkey = function(e){
        var ret = true;
        switch(e.keyCode){
            case UI.KEY.BACKSPACE:
                appCom.goAppByName("tvportal",true);
                break;
            case UI.KEY.FUNYELLOW:
                self.showPasswdDialog();
                break;
            case UI.KEY.FUNBLUE:
                appCom.goAppByName("pvrRecordedList",true);
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
            self.addTableData1(true);
            self.addTableData2(true);
            self.updateNum();
            self.win.update();
        }, 1000 * 20);
    };

    this.closeTimer = function(){
        if(self.timer){
            clearInterval(self.timer);
            self.timer = null;
        }
    };
    /**************************************窗口创建区**************************************/
    this.initStyleClass = function(){
        UI.res.set("way_bt", {
            skin : {
                normal : {type : "img", imgNames : ["user/recordWayBtn_normal.png"], stretch : "HV"},
                focus : {type : "img", imgNames : ["user/recordWayBtn_highlight.png"], stretch : "HV"}
            }
        });
    };

    this.createDlg = function(){
        self.createTable1();
        self.createTable2();
        self.createNavDlg();
    };

    this.addData = function(){
        self.addTableData1();
        self.addTableData2();
        self.updateNum();
    };

    this.updateNum = function(){
        var chNumWin = self.win.getChild("chNum");
        var listNumWin = self.win.getChild("eventNum");
        var totalCh = self.channelListTb.rows;
        var currentCh = self.channelListTb.curIndex+1;
        chNumWin.value = ""+currentCh+"/"+totalCh;

        var totalEvent = self.eventListTb.rows;
        var currentEvent = self.eventListTb.curIndex+1;
        if(self.eventListTb.rows <= 0)
        {
            currentEvent = 0;
        }
        listNumWin.value = ""+currentEvent+"/"+totalEvent;
    };
    /**************************************节目列表操作区**************************************/
    this.createTable1 = function(){
        //第一列
        var clTb_l = 60;
        var clTb_t = 160;
        var clTb_w = 320;
        var clTb_h = 480;
        this.channelListTb = new UITable("null", "channelListTb", null, clTb_l, clTb_t, clTb_w, clTb_h,// ol ot w h
            {
                EnlargeV : -10, dt : -5,
                headUse : false, font : uiCom.font.F20, cols : 1, rowsOnePage : 9, HAlign : "left", color : "#96b4be",
                lineVWidth : 0, lineHWidth : 0, lineRectWidth : 0, LeaveFocusColor : "white", focusColor : "white",
                skin : {
                    normalBar : {type : "none"},
                    selectBar : {type : "img", imgNames : ["user/recordWayBtn_normal"], stretch : "HV"},
                    focusBar : {type : "img", imgNames : ["user/recordWayBtn_highlight"], stretch : "HV"}
                }
            }
        );
        this.channelListTb.attach(self.win);
        this.channelListTb.setFocus(true);
        this.channelListTb.setColClip(0, true);
        this.channelListTb.proc = self.tableProc1;
    };

    this.addTableData1 = function(isNotUpdateIndex){
        //初始化 节目列表分类数据
        var data1 = [];
        data1[0] = new Array();
        data1[0][0] = Lp.getValue("all_channel");
        data1[0][1] = -1;
        var chs = [];

        //分别从eventlist 和 taskList 中取出所有的频道

        for(var i = 0; i < recordSchCom.eventList.array.length; i++)
        {
            if(checkArrayItem(chs,recordSchCom.eventList.array[i].ch.idn) < 0)
            {
                chs.push(recordSchCom.eventList.array[i].ch.idn);
            }
        }

        for(var i = 0; i < recordSchCom.taskList.array.length; i++)
        {
            if(checkArrayItem(chs,recordSchCom.taskList.array[i].ch.idn) < 0)
            {
                chs.push(recordSchCom.taskList.array[i].ch.idn);
            }
        }

        //对取出的频道进行排序
        chs.sort(function(a,b){
            return a-b;
        });


        //初始化频道列表数据
        for(var i = 0; i < chs.length;i++)
        {
            data1[data1.length] = new Array();
            data1[data1.length - 1][0] = ""+format3ChannelNo(chs[i]) + "   " + dtvCom.getChNameByIdn(chs[i]);
            data1[data1.length - 1][1] = chs[i];
        }

        var oldIndex = self.channelListTb.curIndex;
        self.channelListTb.removeItems();
        self.channelListTb.addItems(data1);
        if(isNotUpdateIndex){
            if(oldIndex >= self.channelListTb.rows){
                oldIndex = 0;
            }
            self.channelListTb.curIndex = oldIndex;

        }

    };

    this.tableProc1 = function(e){
        var ret = true;
        switch(e.keyCode){
            case UI.KEY.LEFT:
                self.eventListTb.setFocus(true);
                self.win.update();
                break;
            case UI.KEY.RIGHT:
                self.eventListTb.setFocus(true);
                self.win.update();
                break;
            case UI.KEY.UP:
                self.channelListTb.listUp();
                self.addTableData2();
                self.updateNum();
                self.win.update();
                break;
            case UI.KEY.DOWN:
                self.channelListTb.listDown();
                self.addTableData2();
                self.updateNum();
                self.win.update();
                break;
            default:
                ret = false;
                break;
        }
        return ret;
    };

    /**************************************录制列表区**************************************/
    this.createTable2 = function(){
        var clTb_l = 403;
        var clTb_t = 160;
        var clTb_w = 820;
        var clTb_h = 440;
        this.eventListTb = new UITable("null", "eventListTb", null, clTb_l, clTb_t, clTb_w, clTb_h,// ol ot w h
            {
                EnlargeV : -10, dt : -5,
                headUse : false, font : uiCom.font.F20, cols : 5, rowsOnePage : 8, HAlign : "left", color : "#96b4be",
                lineVWidth : 0, lineHWidth : 0, lineRectWidth : 0, LeaveFocusColor : "white", focusColor : "white",
                skin : {
                    normalBar : {type : "none"},
                    selectBar : {type : "img", imgNames : ["user/epgList_markselected"], stretch : "HV"},
                    focusBar : {type : "img", imgNames : ["user/epgList_selected"], stretch : "HV"}
                }
            }
        );
        this.eventListTb.attach(self.win);
        this.eventListTb.setFocus(true);
        this.eventListTb.setColClip(1, true);
        this.eventListTb.proc = self.tableProc2;
        this.eventListTb.setColWidthArr(
            [
                this.eventListTb.w * 0.05,
                this.eventListTb.w * 0.42,
                this.eventListTb.w * 0.18,
                this.eventListTb.w * 0.18,
                this.eventListTb.w * 0.1,
            ]
        );
    };

    this.addTableData2 = function(isNotUpdateIndex){
        var item1 = self.channelListTb.getRowItems(self.channelListTb.curIndex);
        var recordlist = [];
        //所有预约录制信息
        if(item1[1] == -1)
        {
            for(var i = 0; i < recordSchCom.taskList.array.length;i++)
            {
                recordlist.push(recordSchCom.taskList.array[i]);
            }

            for(var i = 0; i < recordSchCom.eventList.array.length;i++)
            {
                var e = recordSchCom.eventList.array[i];
                if(e.type != recordSchCom.recordType.SINGLE &&  e.type != recordSchCom.recordType.ONETIME)
                {
                    continue;
                }
                recordlist.push(e);
            }
        }
        else
        {
            for(var i = 0; i < recordSchCom.taskList.array.length;i++)
            {
                if(recordSchCom.taskList.array[i].ch.idn == item1[1])
                {
                    recordlist.push(recordSchCom.taskList.array[i]);
                }
            }

            for(var i = 0; i < recordSchCom.eventList.array.length;i++)
            {
                var e = recordSchCom.eventList.array[i];
                if(e.type != recordSchCom.recordType.SINGLE &&  e.type != recordSchCom.recordType.ONETIME)
                {
                    continue;
                }

                if(recordSchCom.eventList.array[i].ch.idn == item1[1])
                {
                    recordlist.push(recordSchCom.eventList.array[i]);
                }
            }
        }

        var data2 = [];
        for(var i = 0; i < recordlist.length; i++)
        {
            var e = recordlist[i];
            if(e.type == recordSchCom.recordType.SERIAL)
            {
                data2[data2.length] = new Array();
                data2[data2.length-1][0] = {type : "img", img : "user/ico_folder"};

                data2[data2.length-1][1] = e.constraint.series_key;

                data2[data2.length-1][2] = "";
                data2[data2.length-1][3] = "";
                data2[data2.length-1][4] = getTypeText(recordlist[i].type);
                data2[data2.length-1][5] = e;
            }
            else if(e.type == recordSchCom.recordType.SINGLE)
            {
                data2[data2.length] = new Array();
                data2[data2.length-1][0] = {type : "img", img : getEpgImgByRate(e.epg.level)};
                if(!lockCom.checkAllLock(dtvCom.getChById(e.ch.idn),e.epg.level)) //检查锁
                {
                    data2[data2.length-1][1] = e.epg.name;
                }
                else
                {
                    data2[data2.length-1][1] = Lp.getValue("epg_lock_msg");
                }
                //data2[data2.length-1][1] = e.epg.name;
                data2[data2.length-1][2] = e.startTime.split(" ")[0];
                var startDate = getEpgStartDate(e.startTime);
                var endDate = getEpgEndDate(startDate,e.duration);
                data2[data2.length-1][3] = formatTime2(startDate,endDate);
                data2[data2.length-1][4] = getTypeText(recordlist[i].type);
                data2[data2.length-1][5] = e;
            }
            else if(e.type == recordSchCom.recordType.DAYTIME)
            {
                data2[data2.length] = new Array();
                data2[data2.length-1][0] = "";
                data2[data2.length-1][1] = dtvCom.getChNameByIdn(e.ch.idn);
                data2[data2.length-1][2] = e.constraint.startTime.split(" ")[0];
                var startDate = getEpgStartDate(e.constraint.startTime);
                var endDate = getEpgEndDate(startDate,e.constraint.duration);
                data2[data2.length-1][3] = formatTime2(startDate,endDate);
                data2[data2.length-1][4] = getTypeText(e.type);
                data2[data2.length-1][5] = e;
            }
            else if(e.type == recordSchCom.recordType.WEEKTIME)
            {
                data2[data2.length] = new Array();
                data2[data2.length-1][0] = "";
                data2[data2.length-1][1] = dtvCom.getChNameByIdn(e.ch.idn);
                data2[data2.length-1][2] = e.constraint.startTime.split(" ")[0];
                var startDate = getEpgStartDate(e.constraint.startTime);
                var endDate = getEpgEndDate(startDate,e.constraint.duration);
                data2[data2.length-1][3] = formatTime2(startDate,endDate);
                data2[data2.length-1][4] = getTypeText(e.type);
                data2[data2.length-1][5] = e;
            }
            else if(e.type == recordSchCom.recordType.ONETIME)
            {
                data2[data2.length] = new Array();
                data2[data2.length-1][0] = "";
                data2[data2.length-1][1] = dtvCom.getChNameByIdn(e.ch.idn);
                data2[data2.length-1][2] = e.startTime.split(" ")[0];
                var startDate = getEpgStartDate(e.startTime);
                var endDate = getEpgEndDate(startDate,e.duration);
                data2[data2.length-1][3] = formatTime2(startDate,endDate);
                data2[data2.length-1][4] = getTypeText(e.type);
                data2[data2.length-1][5] = e;
            }
        }
        var oldIndex = self.eventListTb.curIndex;
        self.eventListTb.removeItems();
        self.eventListTb.addItems(data2);
        if(isNotUpdateIndex){
            if(oldIndex >= self.eventListTb.rows){
                oldIndex = 0;
            }
            self.eventListTb.curIndex = oldIndex;
        }
    };

    this.tableProc2 = function(e){

        var ret = true;
        switch(e.keyCode){
            case UI.KEY.LEFT:
                self.channelListTb.setFocus(true);
                self.win.update();
                break;
            case UI.KEY.RIGHT:
                self.channelListTb.setFocus(true);
                self.win.update();
                break;
            case UI.KEY.UP:
                self.eventListTb.listUp();
                self.updateNum();
                self.win.update();
                break;
            case UI.KEY.DOWN:
                self.eventListTb.listDown();
                self.updateNum();
                self.win.update();
                break;
            case UI.KEY.ENTER:
                self.showChildItem();
                break;
            case UI.KEY.INFO:
                self.showInfo();
                break;
            case UI.KEY.FUNRED:
                self.showDelete();
                break;
            default:
                ret = false;
                break;
        }
        return ret;
    };

    /**************************************导航栏操作区**************************************/
    var navP = {
        l:55, t:643, w:1172, h:60, startOL:260, imgOt:30, txtOt:27, txtImgSpace:10,
        groupSpace:40, font:uiCom.font.F20, color:"#96b4be",
        dataArray:[
            {
                img:"user/ico_red",
                text:Lp.getValue("cancel_recored")
            },
            {
                img:"user/ico_blue",
                text:Lp.getValue("recorded_list")
            },
            {
                img:"user/ico_yellow",
                text:Lp.getValue("epg_nav_lock")
            },
            {
                img:"user/ico_infoKey",
                text:Lp.getValue("detail")
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
    /**************************************密码控制区**************************************/

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
        //播放频道

        //epg 重新加载
        self.addTableData2();

        self.win.update();
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

    /**************************************節目詳情区**************************************/
    this.showInfo = function(){
        if(self.infoDlg)
        {
            self.infoDlg.close();
        }

        if(self.eventListTb.rows <= 0)
        {
            return;
        }

        var item = self.eventListTb.getRowItems(self.eventListTb.curIndex);

        var text =  "  錄製頻道:"+item[1]+"\n";
        text += "  錄製方式:"+getTypeText(item[5].type)+"\n";

        if(item[5].type == recordSchCom.recordType.SERIAL)
        {
            if(item[5].recordingInfo.length > 0)
            {
                text += "  開始日期:"+item[5].recordingInfo[0].startTime.split(" ")[0]+"\n";
                text += "  開始時間:"+item[5].recordingInfo[0].startTime.split(" ")[1]+"\n";
                text += "  錄製時長:"+(item[5].recordingInfo[0].duration/60)+"分鐘"+"\n";
            }
            else
            {
                text += "  開始日期:"+"\n";
                text += "  開始時間:"+"\n";
                text += "  錄製時長:"+"0分鐘"+"\n";
            }
        }
        else if(item[5].type == recordSchCom.recordType.SINGLE)
        {
            text += "  開始日期:"+item[5].startTime.split(" ")[0]+"\n";
            text += "  開始時間:"+item[5].startTime.split(" ")[1]+"\n";
            text += "  錄製時長:"+(item[5].duration/60)+"分鐘"+"\n";
            text += "  錄製星期:";
        }
        else if(item[5].type == recordSchCom.recordType.ONETIME)
        {
            text += "  開始日期:"+item[5].startTime.split(" ")[0]+"\n";
            text += "  開始時間:"+item[5].startTime.split(" ")[1]+"\n";
            text += "  錄製時長:"+(item[5].duration/60)+"分鐘"+"\n";
            text += "  錄製星期:";
        }
        else if(item[5].type == recordSchCom.recordType.DAYTIME)
        {
            text += "  開始日期:"+item[5].constraint.startTime.split(" ")[0]+"\n";
            text += "  開始時間:"+item[5].constraint.startTime.split(" ")[1]+"\n";
            text += "  錄製時長:"+(item[5].constraint.duration/60)+"分鐘"+"\n";
            text += "  錄製星期:";
            var week=[0,1,2,3,4,5,6];
            for(var i = 0; i < week.length;i++)
            {
                text += Lp.getValue("everyWeek")+Lp.getValue("w"+week[i])+" ";

            }
        }
        else if(item[5].type == recordSchCom.recordType.WEEKTIME)
        {
            text += "  開始日期:"+item[5].constraint.startTime.split(" ")[0]+"\n";
            text += "  開始時間:"+item[5].constraint.startTime.split(" ")[1]+"\n";
            text += "  錄製時長:"+(item[5].constraint.duration/60)+"分鐘"+"\n";
            text += "  錄製星期:";
            for(var i = 0; i < item[5].constraint.week.length;i++)
            {
                text += Lp.getValue("everyWeek")+Lp.getValue("w"+item[5].constraint.week[i])+" ";

            }
        }

        var pr = {
            proc : self.infoDialogProc,
            win : self.win,
            frame : {w : 860, h : 400, t : 0, bg : "dialog/dialog_bg"},
            title : {dt : 7, font : uiCom.font.F20, color : "white", value : Lp.getValue("recording_prom_info")},
            content : {dw : -30, dt : 2, dh : 20, dl : 2, labelDt : 10, firstRowHeadSpace : "", font : uiCom.font.F20,
                color : "black",
                msg : text,
                bgColor : "grey",
                HAlign : "left"
            },
            nav : {
                dt : 11,
                dl : 390,
                color : "white",
                font : uiCom.font.F20,
                groupSpace : 60,
                group : [
                    {
                        img : "user/ico_back",
                        text : Lp.getValue("Back"),
                        fun : function(){
                            self.infoDlg.close(true);
                        },
                        key : UI.KEY.BACKSPACE
                    }
                ]
            }
        };

        self.infoDlg = new TextDialog(pr);
        self.infoDlg.show();
    };

    this.infoDialogProc = function(e){
        var ret = true;

        switch(e.keyCode){
            case UI.KEY.UP:
                self.infoDlg.onkeyUp();
                break;
            case UI.KEY.DOWN:
                self.infoDlg.onkeyDown();
                break;
            default:
                self.infoDlg.onkeyDefault(e.keyCode);
                //ret = false;
                break;
        }
        return ret;
    };

    /**************************************刪除預約区**************************************/
    this.showDelete = function(){
        if(self.deleteDlg)
        {
            self.deleteDlg.close();
        }

        if(self.eventListTb.rows <= 0)
        {
            return;
        }

        var text =  "\n"+Lp.getValue("delete_recording_item_confirm");

        var pr = {
            proc : self.deleteDialogProc,
            win : self.win,
            frame : {w : 400, h : 200, t : 0, bg : "dialog/dialog_bg"},
            title : {dt : 7, font : uiCom.font.F20, color : "white", value : Lp.getValue("recording_prom_info")},
            content : {dw : -30, dt : 2, dh : -10, dl : 2, labelDt : 10, firstRowHeadSpace : "", font : uiCom.font.F20,
                color : "white",
                msg : text,
                bgColor : "",
                HAlign : "center"
            },
            nav : {
                dt : 14,
                dl : 100,
                color : "white",
                font : uiCom.font.F20,
                groupSpace : 30,
                group : [
                    {
                        img : "user/ico_ok",
                        text : Lp.getValue("Ok"),
                        fun : function()
                        {
                            self.deleteCurItem();
                            self.deleteDlg.close(true);
                        },
                        key : UI.KEY.ENTER
                    }
                    ,
                    {
                        img : "user/ico_back",
                        text : Lp.getValue("Back"),
                        fun : function(){
                            self.deleteDlg.close(true);
                        },
                        key : UI.KEY.BACKSPACE
                    }
                ]
            }
        };

        self.deleteDlg = new TextDialog(pr);

        self.deleteDlg.show();
    };

    this.deleteSerialItems = function(list){
        if(!list || list.length <= 0){
            return;
        }

        for(var i = 0; i < list.length; i++){
            recordSchCom.deleteEvent(list[i]);
        }

        self.addData();
    };

    this.deleteDialogProc = function(e){
        var ret = true;

        switch(e.keyCode){
            case UI.KEY.UP:
                self.deleteDlg.onkeyUp();
                break;
            case UI.KEY.DOWN:
                self.deleteDlg.onkeyDown();
                break;
            default:
                self.deleteDlg.onkeyDefault(e.keyCode);
                //ret = false;
                break;
        }
        return ret;
    };

    this.deleteCurItem = function() {
        if(self.eventListTb.rows <= 0)
        {
            return;
        }

        if(self.eventListTb.curIndex >= self.eventListTb.rows)
        {

            self.eventListTb.curIndex = 0;
        }

        var item = self.eventListTb.getRowItems(self.eventListTb.curIndex);
        if(item[5].type == recordSchCom.recordType.SINGLE || item[5].type == recordSchCom.recordType.ONETIME)
        {

            recordSchCom.deleteEvent(item[5]);
        }
        else
        {
            recordSchCom.deleteTask(item[5]);
        }
        self.addData();
    };
    /**************************************系列子目錄**************************************/
    this.showChildItem = function(){
        if(self.eventListTb.curIndex >= self.eventListTb.rows)
        {
            self.eventListTb.curIndex = 0;
        }

        var item = self.eventListTb.getRowItems(self.eventListTb.curIndex);

        if(item[5].type != recordSchCom.recordType.SERIAL)
        {
            return;
        }

        var myData = [];
        for(var i =0; i < item[5].orderList.length; i++)
        {
            var e = item[5].orderList[i];
            var startDate = getEpgStartDate(e.startTime);
            var endDate = getEpgEndDate(startDate,e.duration);
            myData[i] = {};
            myData[i].name = "第"+e.epg.episode_key+"集";
            myData[i].level = e.epg.level;
            myData[i].startDate = getDateStrfromDate(startDate);
            myData[i].startEndTime = formatTime2(startDate,endDate);
            myData[i].event = e;
        }

        var p ={
            parent:self,
            title:item[5].constraint.series_key,
            data:myData
        };
        var w = new ChildList(p);
        w.show();
    };
    /*************************EPG  资讯*************************/
}

ScheduledList.prototype = UIModule.baseModule;
