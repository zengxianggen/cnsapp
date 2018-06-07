// JavaScript Document
function ChannelList(params){

    var self = this;
    var chTimer = null;

    var ch_w = 380;
    var ch_h = 720;
    var ch_l = 10;
    var ch_t = 0;


    this.tableGetFocus = true;
    this.curBatIndex = 1;
    this.listItems = new Array();

    this.listParam = [
        {
            uiType : UIFrame,
            id : "chListBg",
            w : ch_w,
            h : ch_h,
            l : ch_l,
            t : ch_t,
            type : "img",
            imgNames : ["live/channel_list_bk"],
            visibility : 1
        },
        {
            uiType : UILabel,
            id : "chlistTitle",
            w : ch_w,
            h : 50,
            ol : 0,
            ot : ch_h * 0.05,
            font : uiCom.font.F35,
            value : Lp.getValue("Tv_Channel"),
            color : "",
            HAlign : "center"
        },
        {
            uiType : UIButton,
            id : "curlistName",
            w : ch_w * 0.85,
            h : 38,
            ol : (ch_w - ch_w * 0.85) / 2,
            ot : ch_h * 0.11,
            font : uiCom.font.F20,
            styleClass : "channel_list_bat_select_bk",
            dt : 8,
            value : "",
            color : "grey"
        },
        {
         uiType : UITable,
         id : "chlistTable",
         w : ch_w -20,
         h : ch_h*0.628,
         ol : 10,
         ot : 120,
         dt : -6,
         cols : 3,lineHWidth:0,lineVWidth:0,lineRectWidth:0,
         rowsOnePage : 9,
         HAlign : "center",
         //focusEnlargeV : -10,
         font:uiCom.font.F20,
         color:"#738b8d",
         focusColor:"#BFEFFF",
         vScroll : {param : "scrollChannelList"},
         scrollWidth : 10,
         skin : {
         normalBar : {type : "none"},
         selectBar : {type : "3imgh", cls : "live/bluebar"},
         focusBar : {type : "3imgh", cls : "live/bluebar"}
         }
         },
        {
            uiType : UIImg,
            id : "ico_green",
            w : 23,
            h : 20,
            ol : ch_w * 0.1,
            ot : ch_h * 0.88,
            src : "live/ico_green",
            stretch : "HV"
        },
        {
            uiType : UILabel,
            id : "fav_control_label",
            w : 150,
            h : 40,
            ol : ch_w * 0.18,
            ot : ch_h * 0.88,
            dt : -3,
            font : uiCom.font.F20,
            value : ""
        },

        {uiType : UIImg, id : "ico_back", w : 40, h : 30, ol : ch_w * 0.5, ot : ch_h * 0.88, src : "live/ico_back"},
        {
            uiType : UILabel,
            id : "back_label",
            w : 150,
            h : 40,
            ol : ch_w * 0.65,
            ot : ch_h * 0.88,
            dt : -3,
            font : uiCom.font.F20,
            value : Lp.getValue("last_page")
        }

    ];


    this.create = function(){
        //init self styleClass
        UI.res.set("channel_list_bat_select_bk", {
            skin : {
                normal : {type : "img", imgNames : ["live/bat_select"], stretch : "HV"},
                focus : {type : "none"}
            }
        });

        UI.res.set("scrollChannelList", {
            sliderW : 5, scrollType : "V",
            skin : {
                barRect : {type : "img", imgNames : ["live/srcollbar_back_pic"], stretch : "HV"},
                slider : {type : "img", imgNames : ["live/srcollbar_front_pic"], stretch : "HV"}
            }
        });

        //create group
        self.chlDlg = UI.createGroup(self.listParam, "channelListDlg", params.win);
        self.chlDlg.proc = self.proc;

        self.curListName = self.chlDlg.getChild("curlistName");
        self.chlistTable = self.chlDlg.getChild("chlistTable");
        self.favLabel = self.chlDlg.getChild("fav_control_label");

        self.chlistTable.setColWidthArr([self.chlistTable.w * 0.2, self.chlistTable.w * 0.2, self.chlistTable.w * 0.5]);
        self.chlistTable.defProc = self.tableProc;
        self.chlistTable.setColClip(2, true);

        self.chlDlg.visibility = -1;
    };




    this.updateListTable = function(){

        self.listItems = new Array();

        var curList = dtvCom.chl[self.curBatIndex].chs;

        for(var i = 0; i < curList.length; i++){
            self.listItems[i] = new Array();

            if(curList[i].userData && curList[i].userData.fav == 1){
                self.listItems[i][0] = {type : "img", img : "live/ico_star", alignH : "left", alignV : "center"};
            }
            else {
                self.listItems[i][0] = "";
            }

            self.listItems[i][1] = curList[i].idn;

            self.listItems[i][2] = curList[i].name;

            self.listItems[i][3] = curList[i];
        }
    };

    this.updateListIndex = function()
    {
        //更新table焦点位置
        var idn = dtvCom.chs[sysCom.config.chIndex].idn;

        var index = self.getIndexFromlistById(idn, dtvCom.chl[self.curBatIndex].chs);

        if(index >= 0){
            self.chlistTable.curIndex = index;
            return true;
        }
        else {
            self.chlistTable.curIndex = 0;
            return false;
        }
    };

    this.updateListName = function()
    {
        //更新频道列表标题
        self.curListName.value = new Array();
        self.curListName.value[0] = dtvCom.chl[self.curBatIndex].name;
    };

    this.updateGreenLabel = function(){
        if(self.listItems.length <= 0){
            return;
        }

        var item = self.chlistTable.getRowItems(self.chlistTable.curIndex);
        if(!item)
        {
            return;
        }

        if(item[3].userData  && item[3].userData.fav == 1){
            self.favLabel.value  = Lp.getValue("Cancel_Favorite");
        }
        else {
            self.favLabel.value = Lp.getValue("Add_Favorite");
        }
    };

    this.show = function(){
        if(dtvCom.chs.length <= 0) {
            return;
        }
        if(params.live.banner)
        {
            params.live.banner.close(false);
        }
        self.chlDlg.visibility = 1;
        self.chlistTable.setFocus(true);
        self.changeList(0);
    };

    this.onkeyGreen = function(){

        var item = self.chlistTable.getRowItems(self.chlistTable.curIndex);
        var flag = 0;


        if(item[3].userData != null && item[3].userData.fav == 1){
            flag = 0;
        }
        else {
            flag = 1;
        }

        dtvCom.setChannleFav(dtvCom.getIndexByNo(item[1]), flag);
        self.changeList(0);
    };


    this.getIndexFromlistById = function(no, list){
        for(var i = 0; i < list.length; i++){
            if(list[i].idn == no){
                return i;
            }
        }
        return -1;
    };

    this.changeList = function(step)
    {
        //更新频道分类序号
        self.curBatIndex = (self.curBatIndex + step + dtvCom.chl.length) % dtvCom.chl.length;

        //添加列表数据
        self.chlistTable.removeItems();
        self.updateListTable();
        self.chlistTable.addItems(self.listItems);
        self.chlistTable.rows = self.listItems.length;

        //更新节目列表标题
        self.updateListName();

        //更新焦点位置
        self.tableGetFocus = self.updateListIndex();

        //更新绿色键状态
        self.updateGreenLabel();

        if(self.tableGetFocus)
        {
            self.chlistTable.setFocus(true);
        }
        else
        {
            self.chlDlg.setFocus(true);
        }

        self.chlistTable.update();

    };


    this.changeCh = function(idn,showBanner,asyncFlag,proc)
    {
        if(chTimer)
        {
            clearTimeout(chTimer);
            chTimer = null;
        }

        if(asyncFlag == true)
        {
            params.live.changeCh(idn,null,showBanner ? true :false,params.live.passwdCb,proc ? proc : params.live.chlistPasswdOnkey);
        }
        else{
            chTimer = setTimeout(function(){
                params.live.changeCh(idn,null,showBanner ? true :false,params.live.passwdCb,proc ? proc : params.live.chlistPasswdOnkey);
                chTimer = null;
            },500);
        }
    };

    this.close = function(updateFlag){
        this.curBatIndex = 1;
        self.chlistTable.removeItems();
        self.chlDlg.setFocus(false);
        self.chlDlg.visibility = -1;
        if(updateFlag)
        {
            self.chlDlg.hide();
        }
    };


    this.tableOnkeyUp = function(showBanner,asyncFlag,proc)
    {
        if(self.listItems.length <= 0)
        {
            return ;
        }
        self.chlistTable.listUp();
        self.updateGreenLabel();
        self.chlistTable.syncScroll();
        self.chlistTable.update();
        self.changeCh(self.chlistTable.getRowItems(self.chlistTable.curIndex)[1],showBanner,asyncFlag,proc);
    };

    this.tableOnkeyDown = function(showBanner,asyncFlag,proc)
    {
        if(self.listItems.length <= 0)
        {
            return ;
        }
        self.chlistTable.listDown();
        self.updateGreenLabel();
        self.chlistTable.syncScroll();
        self.chlistTable.update();
        self.changeCh(self.chlistTable.getRowItems(self.chlistTable.curIndex)[1],showBanner,asyncFlag,proc);
    };



    this.tableProc = function(e){

        var ret = true;
        switch(e.keyCode){
            case UI.KEY.UP:
                self.tableOnkeyUp(false,true,params.live.chlistPasswdOnkey);
                break;
            case UI.KEY.DOWN:
                self.tableOnkeyDown(false,true,params.live.chlistPasswdOnkey);
                break;
            case UI.KEY.CHNDOWN:
                self.tableOnkeyUp(true,true,params.live.bannerPasswdOnkey);
                self.close();
                //params.live.banner.show(true,true);
                break;
            case UI.KEY.CHNUP:
                self.tableOnkeyDown(true,true,params.live.bannerPasswdOnkey);
                self.close();
                //params.live.banner.show(true,true);
                break;
            case UI.KEY.FUNGREEN:
                self.onkeyGreen();
                break;
            default:
                ret = false;
                break;
        }
        return ret;
    };

    this.chlistOnkeyDown = function()
    {
        if(!self.tableGetFocus)
        {
            if(self.listItems.length <= 0)
            {
                return;
            }
            else
            {
                self.chlistTable.setFocus(true);
                self.chlistTable.update();
                self.changeCh(self.chlistTable.getRowItems(self.chlistTable.curIndex)[1]);

            }
        }
    };

    this.proc = function(e)
    {
        var ret = true;
        switch(e.keyCode){
            case UI.KEY.UP:

                break;
            case UI.KEY.DOWN:
                self.chlistOnkeyDown();
                break;
            case UI.KEY.RIGHT:
                self.changeList(1);
                break;
            case UI.KEY.LEFT:
                self.changeList(-1);
                break;
            case UI.KEY.ENTER:
                
                break;
            case UI.KEY.BACKSPACE:
                self.close(true);
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