function RecordedList(){
    var self = this;
    self.eventListArray = [];
    self.taskListArray = [];
    self.fsInfo = null;
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
            value : Lp.getValue("recorded_list_title"),
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
            uiType : UILabel, id : "chLabel", ol : 75, ot : 125, w : 100, h : 40,
            font : uiCom.font.F20, color : "#62815a", value : Lp.getValue("channle")
        },

        {
            uiType : UILabel, id : "chNum", ol : 315, ot : 125, w : 100, h : 40,
            font : uiCom.font.F20, color : "grey", value : "0/0"
        },

        {
            uiType : UILabel, id : "proName", ol : 453, ot : 125, w : 100, h : 40,
            font : uiCom.font.F20, color : "#62815a", value : Lp.getValue("programName")
        },

        {
            uiType : UILabel, id : "Date", ol : 820, ot : 125, w : 100, h : 40,
            font : uiCom.font.F20, color : "#62815a", value : Lp.getValue("date")
        },

        {
            uiType : UILabel, id : "start_end_time", ol : 970, ot : 125, w : 140, h : 40,
            font : uiCom.font.F20, color : "#62815a", value : Lp.getValue("start_time")
        },

        {
            uiType : UILabel, id : "eventNum", ol : 1050, ot : 125, w : 100, h : 40,
            font : uiCom.font.F20, color : "grey", value : "0/0",HAlign:"right"
        },
        //底部影片信息
        {
            uiType : UILabel, id : "durationLabel", ol : 370, ot : 615, w : 100, h : 40,
            font : uiCom.font.F20, color : "#4D4D4D", value : Lp.getValue("videoDuration"),HAlign:"right"
        },

        {
            uiType : UILabel, id : "durationValue", ol : 470, ot : 615, w : 100, h : 40,
            font : uiCom.font.F20, color : "white", value : "00:00:00",HAlign:"left"
        },
        {
            uiType : UILabel, id : "sizeLabel", ol : 580, ot : 615, w : 120, h : 40,
            font : uiCom.font.F20, color : "#4D4D4D", value : Lp.getValue("videoSize"),HAlign:"right"
        },

        {
            uiType : UILabel, id : "sizeValue", ol : 700, ot : 615, w : 100, h : 40,
            font : uiCom.font.F20, color : "white", value : "",HAlign:"left"
        },

        {
            uiType : UILabel, id : "diskInfoLabel", ol :   800, ot : 615, w : 200, h : 40,
            font : uiCom.font.F20, color : "#4D4D4D", value : Lp.getValue("usedSpace"),HAlign:"right"
        },

        {
            uiType : UILabel, id : "diskInfoValue", ol : 1000, ot : 615, w : 240, h : 40,
            font : uiCom.font.F20, color : "white", value : "",HAlign:"left"
        }
    ];

    this.open = function(){
        self.defOpen();
    };

    this.start = function(){
        self.openTimer();
        self.initStyleClass();
        self.createDlg();
        setTimeout(function(){
            self.addData();
            self.fsInfo = FS.fsGetDiskInfo(false);
            self.updateChNum();
            self.updateEventNum();
            self.updateDetailInfo();
            self.win.update();
        },300);

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
            case UI.KEY.FUNBLUE:
                appCom.goAppByName("pvrScheduledList",false);
                break;
            case UI.KEY.BACKSPACE:
                appCom.goAppByName("tvportal",true);
                break;
            case UI.KEY.FUNYELLOW:
                //self.showPasswdDialog();
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

    this.getAllEventList =function(){
        self.eventListArray = PVR.fsGetReplayRes(false);
        console.log("self.eventListArray:"+JSON.stringify(self.eventListArray));
    };

    this.getTaskList = function(){
        self.taskListArray = [];
        var flag = false;
        for(var i =0; i< self.eventListArray.length;i++){
            var rs = self.eventListArray[i];
            if(rs.userData.type == recordSchCom.recordType.SERIAL)
            {
                for(var j = 0; j < self.taskListArray.length; j++){
                    if(rs.userData.taskHangle == self.taskListArray[j].userData.taskHangle){
                        flag = true;
                    }
                }
                if(!flag){
                    self.taskListArray.push(rs);
                }
            }
        }
        console.log("self.taskListArray:"+JSON.stringify(self.taskListArray));
    };
    this.addData = function(){
        self.getAllEventList();
        self.getTaskList();
        self.addTableData1();
        self.addTableData2();
        self.win.update();
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

    this.addTableData1 = function(){
        //初始化 节目列表分类数据
        var data1 = [];
        data1[0] = new Array();
        data1[0][0] = Lp.getValue("all_channel");
        data1[0][1] = -1;
        var chs = [];
        for(var i = 0; i < self.eventListArray.length; i++)
        {
            if(checkArrayItem(chs,self.eventListArray[i].userData.ch.idn) < 0)
            {
                chs.push(self.eventListArray[i].userData.ch.idn);
            }
        }

        for(var i = 0; i < chs.length;i++)
        {
            data1[data1.length] = new Array();
            data1[data1.length - 1][0] = ""+format3ChannelNo(chs[i]) + "   " + dtvCom.getChNameByIdn(chs[i]);
            data1[data1.length - 1][1] = chs[i];
        }

        self.channelListTb.removeItems();
        self.channelListTb.addItems(data1);

    };

    this.updateChNum = function(){
        var win = self.win.getChild("chNum");
        var str = (self.channelListTb.curIndex + 1 + "") + "/" + (self.channelListTb.rows);
        win.value = str;
    };

    this.updateEventNum = function(){
        var win = self.win.getChild("eventNum");
        var str = (self.eventListTb.curIndex + 1 + "") + "/" + (self.eventListTb.rows);
        win.value = str;
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
                self.updateChNum();
                self.addTableData2();
                self.updateEventNum();
                self.win.update();
                break;
            case UI.KEY.DOWN:
                self.channelListTb.listDown();
                self.updateChNum();
                self.addTableData2();
                self.updateEventNum();
                self.win.update();
                break;
            case UI.KEY.FUNRED:
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
        this.eventListTb.setColClip(0, true);
        this.eventListTb.proc = self.tableProc2;
        this.eventListTb.setColWidthArr(
            [
                this.eventListTb.w * 0.05,
                this.eventListTb.w * 0.45,
                this.eventListTb.w * 0.18,
                this.eventListTb.w * 0.18,
                this.eventListTb.w * 0.1,
            ]
        );
    };

    this.addTableData2 = function(){
        var item1 = self.channelListTb.getRowItems(self.channelListTb.curIndex);
        var recordedList = [];
        var data2 = [];
        //所有预约录制信息
        if(item1[1] == -1)
        {
            //1.获取不重复的系列录制
            for(var i = 0; i < self.taskListArray.length;i++){
                recordedList.push(self.taskListArray[i]);
            }

            //2.获取其他录制类型信息
            for(var i = 0; i < self.eventListArray.length;i++)
            {
                var rs = self.eventListArray[i];
                if(rs.userData.type != recordSchCom.recordType.SERIAL)
                {
                    recordedList.push(rs);
                }
            }
        }
        else
        {
            //1.获取不重复的系列录制
            for(var i = 0; i < self.taskListArray.length;i++){
                if(self.taskListArray[i].userData.ch.idn == item1[1]){
                    recordedList.push(self.taskListArray[i]);
                }
            }

            //2.获取其他录制类型信息
            for(var i = 0; i < self.eventListArray.length;i++)
            {
                var rs = self.eventListArray[i];
                if(rs.userData.type != recordSchCom.recordType.SERIAL)
                {
                    if(rs.userData.ch.idn == item1[1])
                        recordedList.push(rs);
                }
            }
        }


        for(var i = 0; i < recordedList.length;i++)
        {
            var rs = recordedList[i];
            data2[data2.length] = new Array();
            if(rs.userData.type == recordSchCom.recordType.SERIAL)
            {
                data2[data2.length-1][0] = {type : "img", img : "user/ico_folder"};
                data2[data2.length-1][1] = rs.userData.epg.series_key;
                data2[data2.length-1][2] = "";
                data2[data2.length-1][3] = "";
                data2[data2.length-1][4] = "";
            }
            else if(rs.userData.type  == recordSchCom.recordType.SINGLE)
            {
                data2[data2.length-1][0] = {type : "img", img : getEpgImgByRate(rs.userData.epg.level)};
                data2[data2.length-1][1] = rs.userData.epg.name;
                data2[data2.length-1][2] = rs.userData.startTime.split(" ")[0];
                data2[data2.length-1][3] = rs.userData.startTime.split(" ")[1];
                data2[data2.length-1][4] = "";
            }
            else
            {
                data2[data2.length-1][0] = "";
                data2[data2.length-1][1] = rs.userData.ch.name;
                data2[data2.length-1][2] = rs.userData.startTime.split(" ")[0];
                data2[data2.length-1][3] = rs.userData.startTime.split(" ")[1];
                data2[data2.length-1][4] = "";
            }
            data2[data2.length-1][5] = rs;
        }
        self.eventListTb.removeItems();
        self.eventListTb.addItems(data2);
        if(data2.length <= 0)
        {
            self.channelListTb.setFocus(true);
            self.win.update();
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
                self.updateEventNum();
                self.updateDetailInfo();
                self.win.update();
                break;
            case UI.KEY.DOWN:
                self.eventListTb.listDown();
                self.updateEventNum();
                self.updateDetailInfo();
                self.win.update();
                break;
            case UI.KEY.ENTER:
                self.onkeyEnter();
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

    this.updateDetailInfo = function(){
        var item = self.eventListTb.getRowItems(self.eventListTb.curIndex);
        if(!item){
            return;
        }
        var dur = self.win.getChild("durationValue");
        var size = self.win.getChild("sizeValue");
        var used = self.win.getChild("diskInfoValue");

        dur.value = getFormatTimeStr(item[5].duration);
        size.value = getFormatSize(item[5].size);
        var  p = GetPercent((self.fsInfo[0].totalSize - self.fsInfo[0].freeSize),self.fsInfo[0].totalSize);
        used.value = "" + p + "(" + Lp.getValue("totalSize") + getFormatSize(self.fsInfo[0].totalSize) + ")";
    };
    /**************************************导航栏操作区**************************************/
    var navP = {
        l:55, t:643, w:1172, h:60, startOL:300, imgOt:30, txtOt:27, txtImgSpace:10,
        groupSpace:40, font:uiCom.font.F20, color:"#96b4be",
        dataArray:[
            {
                img:"user/ico_ok",
                text:Lp.getValue("play")
            },
            {
                img:"user/ico_red",
                text:Lp.getValue("delete")
            },
            {
                img:"user/ico_blue",
                text:Lp.getValue("recording_list")
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

    /**************************************控制区**************************************/
    this.onkeyRed = function(){
        var item = self.eventListTb.getRowItems(self.eventListTb.curIndex);
        if(!item){
            return;
        }
        if(item[5].userData.type != recordSchCom.recordType.SERIAL){
            self.deleteSerial(item[5]);
        }
        else{
            self.deleteItem(item[5]);
        }
        self.addData();
    };

    this.deleteSerial = function(rs){
        var taskH = rs.userData.taskHangle;
        var rsArray = [];
        for(var i = 0;i < self.eventListArray.length;i++){
            var tmp = self.eventListArray[i];
            if(tmp.userData.type == recordSchCom.recordType.SERIAL && tmp.userData.taskHangle == taskH){
                rsArray.push(tmp);
                self.eventListArray.splice(i,1);
                i--;
            }
        }
        self.deleteItems(rsArray);
        self.getTaskList();
    };

    this.deleteItem = function(rs)
    {
        if(!rs){
            return;
        }
        console.log("PVR.fsDeleteReplayRes:"+rs.resId);
        var ret = PVR.fsDeleteReplayRes(rs.resId,false);
        if(!ret){
            console.log("PVR.fsDeleteReplayRes:"+rs.resId+" Failed!");
        }
    };

    this.deleteItems = function(rsArray) {
        if(!rsArray){
            return;
        }
        rsArray.sort(function(a,b){
            if(a.resId < b.resId){
                return 1;
            }
            else{
                return 0;
            }
        });
        for(var i = 0; i < rsArray.length;i++){
            console.log("resId:"+rsArray[i].resId);
            self.deleteItem(rsArray[i]);
        }
    };

    this.playItem = function(rs) {
        self.go(RecordedPlay,RecordedList,rs,"hide");
    };

    this.onkeyEnter = function(){
        var item = self.eventListTb.getRowItems(self.eventListTb.curIndex);
        if(!item){
            return;
        }
        if(item[5].userData.type != recordSchCom.recordType.SERIAL){
            self.playItem(item[5]);
        }
        else{
            self.showChildItem();
        }
    };

    /**************************************刪除录制区**************************************/
    this.showDelete = function()
    {
        if(self.deleteDlg)
        {
            self.deleteDlg.close();
        }

        var text =  Lp.getValue("delete_recorded_item_confirm");

        var pr = {
            proc : self.deleteDialogProc,
            win : self.win,
            frame : {w : 400, h : 200, t : 0, bg : "dialog/dialog_bg"},
            title : {dt : 7, font : uiCom.font.F20, color : "white", value : Lp.getValue("confirm_delete")},
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
                        fun : function(){
                            self.deleteDlg.close(true);
                            self.onkeyRed();
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
                break;
        }
        return ret;
    };

    /**************************************系列子目錄**************************************/
    this.showChildItem = function(){
        if(self.eventListTb.curIndex >= self.eventListTb.rows)
        {
            self.eventListTb.curIndex = 0;
        }

        var item = self.eventListTb.getRowItems(self.eventListTb.curIndex);


        if(item[5].userData.type != recordSchCom.recordType.SERIAL)
        {
            return;
        }

        var myData = [];

        for(var i = 0; i < self.eventListArray.length; i++)
        {
            var rs = self.eventListArray[i];

            if(rs.userData.type == recordSchCom.recordType.SERIAL && rs.userData.taskHangle == item[5].userData.taskHangle)
            {
                myData.push(rs);
            }
        }

        var p ={
            win:self.win,
            title:Lp.getValue("RecordedProm")+">"+item[5].userData.epg.series_key,
            data:myData,
            playRec:self.playItem,
            deleteArray:self.deleteItems,
            updateData:self.addData
        };

        self.chlidListDlg = new ChildList(p);
        self.chlidListDlg.show();
    };

    /*************************EPG  资讯*************************/
    this.showDetail = function(){
        var text = self.extendText;
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
                bgColor : "white"
            },
            nav : {
                dt : 0,
                dl : 280,
                group : [
                    {
                        img : "live/ico_ok",
                        text : Lp.getValue("Ok"),
                        fun : function(){
                        },
                        key : UI.KEY.ENTER
                    }
                ]
            }
        };

        if(!self.hasUnlock && lockCom.checkAllLock()){
            pr.content.msg = Lp.getValue("epg_lock_msg");
        }
        else{
            var sch = self.getCurrentShc();
            if(sch){
                pr.content.msg = sch[4].extendEvent.text;
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
RecordedList.prototype = UIModule.baseModule;
