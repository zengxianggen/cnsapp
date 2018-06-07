function ChildList(params)
{
    var self = this;

    self.deleteArray = [];

    this.childParams = [
        {uiType:UIFrame,id:"childListFrame",l:240,t:115,w:800,h:500,type:"img",imgNames:["user/folderList_bg_820x500"],stretch:"HV",visibility:1},
        {uiType:UILabel,id:"titleLabel",ol:20,ot:10,w:200,h:40,font:uiCom.font.F20,color:"grey",HAlign:"left",value:""},
        {uiType:UILabel,id:"listNum",ol:700,ot:10,w:100,h:40,font:uiCom.font.F20,color:"grey",HAlign:"center",value:""},
        {
            uiType : UILabel, id : "proName", ol : 90, ot : 50, w : 100, h : 40,
            font : uiCom.font.F20, color : "#62815a", value : Lp.getValue("programName")
        },
        {
            uiType : UILabel, id : "startDate", ol : 485, ot : 50, w : 100, h : 40,
            font : uiCom.font.F20, color : "#62815a", value : Lp.getValue("date")
        },
        {
            uiType : UILabel, id : "start_end_time", ol : 635, ot : 50, w : 140, h : 40,
            font : uiCom.font.F20, color : "#62815a", value : Lp.getValue("start_time")
        },
        {
            uiType:UITable,id:"listTable",ol:10,ot:80,w:780,h:375,lineRectWidth:0,
            lineHWidth:0,lineVWidth:0,lineColor:"#505050",color:"grey",font:uiCom.font.F20,
            cols:4,rows:0,rowsOnePage:8,focusColor:"white",
            skin:{
                normalBar : {type : "none"},
                selectBar : {type : "img", imgNames : ["user/epgList_markselected"], stretch : "HV"},
                focusBar : {type : "img", imgNames : ["user/epgList_selected"], stretch : "HV"}
            }

        },
        {
            uiType:UIImg,id:"iconOK",ol:220,ot:465,src:"user/ico_ok",stretch:"HV"
        },
        {
            uiType : UILabel, id : "deleteLabel", ol : 260, ot : 460, w : 80, h : 40,
            font : uiCom.font.F18, color : "#62815a", value : Lp.getValue("play")
        },
        {
            uiType:UIImg,id:"iconRed",ol:330,ot:465,src:"user/ico_red",stretch:"HV"
        },
        {
            uiType : UILabel, id : "deleteLabel", ol : 360, ot : 460, w : 80, h : 40,
            font : uiCom.font.F18, color : "#62815a", value : Lp.getValue("delete")
        },
        {
            uiType:UIImg,id:"iconBack",ol:450,ot:465,src:"user/ico_back",stretch:"HV"
        },
        {
            uiType : UILabel, id : "deleteLabel", ol : 505, ot : 460, w : 80, h : 40,
            font : uiCom.font.F18, color : "#62815a", value : Lp.getValue("Back")
        }
    ];

    this.createChildListDlg = function(){
        self.childlistDlg = UI.createGroup(self.childParams,"childList",params.win);
        self.childTitleLabel = self.childlistDlg.getChild("titleLabel");
        self.childListNum = self.childlistDlg.getChild("listNum");

        self.childlistTb = self.childlistDlg.getChild("listTable");
        self.childlistTb.setColWidthArr([
            self.childlistTb.w*0.1,
            self.childlistTb.w*0.5,
            self.childlistTb.w*0.2,
            self.childlistTb.w*0.2
        ]);
        self.childlistTb.proc = self.childlistTbProc;
        self.childlistDlg.proc = self.childlistProc;

        self.data = new Array();
        for(var i= 0;i < params.data.length;i++)
        {
            var rs = params.data[i];
            self.data[i] = new Array();
            self.data[i][0] = {type : "img", img : getEpgImgByRate(rs.userData.epg.level)};
            self.data[i][1] = "第"+rs.userData.epg.episode_key+"集";
            self.data[i][2] = rs.userData.startTime.split(" ")[0];
            self.data[i][3] = rs.userData.startTime.split(" ")[1];
        }
    };

    this.childlistTbProc = function(e){
        var ret = true;
        switch(e.keyCode){
            case UI.KEY.UP:
                self.childlistTb.listUp();
                self.updateNum();
                params.win.update();
                break;
            case UI.KEY.DOWN:
                self.childlistTb.listDown();
                self.updateNum();
                params.win.update();
                break;
            case UI.KEY.BACKSPACE:
                self.close();
                break;
            case UI.KEY.FUNRED:
                self.showDelete();
                break;
            case UI.KEY.ENTER:
                self.onkeyEnter();
                break;
            default:
                ret = false;
                break;
        }
        return ret;
    };

    this.updateNum = function(){
        var totalNum = self.childlistTb.rows;
        var curIndex = self.childlistTb.curIndex + 1;
        self.childListNum.value = ""+curIndex+"/"+totalNum;
    };

    this.initChildListDlg = function(){
        self.childTitleLabel.value = params.title;
        self.childListNum.value = "1"+"/"+params.data.length;
        self.childlistTb.removeItems();
        self.childlistTb.addItems(self.data);
        self.updateNum();
    };

    this.show = function()
    {
        self.preFocusWin = params.win.getFocusWin();
        if(self.data.length <= 0 )
        {
            self.close();
        }
        self.childlistDlg.visibility = 1;
        self.childlistTb.setFocus(true);
        params.win.update();
    };


    this.close = function(){
        self.childlistDlg.destroy();
        self.preFocusWin.setFocus(true);
        params.win.update();
        if(self.deleteArray.length > 0){
            params.deleteArray(self.deleteArray);
            params.updateData();
        }
    };

    this.onkeyEnter = function(){
        if(self.childlistTb.rows <=0 ){
            return;
        }
        var index = self.childlistTb.curIndex;

        var rs = params.data[index];

        self.close();

        params.playRec(rs);
    };

    this.deleteCurItem = function(){
        if(self.childlistTb.rows <=0 ){
            return;
        }

        var index = self.childlistTb.curIndex;

        var rs = params.data[index];

        self.deleteArray.push(rs);

        self.data.splice(index,1);

        if(self.data.length <= 0){
            self.close();
            return;
        }
        self.childListNum.value = "1"+"/"+self.data;
        self.childlistTb.removeItems();
        self.childlistTb.addItems(self.data);
        self.updateNum();
        self.childlistDlg.update();
    };

    this.createChildListDlg();

    this.initChildListDlg();

    this.showDelete = function(){
        if(self.deleteDlg)
        {
            self.deleteDlg.close();
        }

        var text =  Lp.getValue("delete_recorded_item_confirm");

        var pr = {
            proc : self.deleteDialogProc,
            win : params.win,
            frame : {w : 400, h : 200, t : 0, bg : "dialog/dialog_bg"},
            title : {dt : 7, font : uiCom.font.F20, color : "white", value : Lp.getValue("recording_prom_info")},
            content : {dw : -30, dt : 0, dh : -10, dl : 2, labelDt : 10, firstRowHeadSpace : "", font : uiCom.font.F20,
                color : "white",
                msg : text,
                bgColor : "",
                HAlign : "center",
                labelDt:50
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
                        fun : function()
                        {
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

        switch(e.keyCode)
        {
            case UI.KEY.UP:
                self.deleteDlg.onkeyUp();
                break;
            case UI.KEY.DOWN:
                self.deleteDlg.onkeyDown();
                break;
            default:
                self.deleteDlg.onkeyDefault(e.keyCode);
                ret = false;
                break;
        }
        return ret;
    };
}