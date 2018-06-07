// JavaScript Document
function UpdateCheckPage(params,srcModule)
{
    var self = this;

    var font1 = uiCom.font.F20;
    var font2 = uiCom.font.F25;
    var font3 = uiCom.font.F35;

    var checkTimer = null;

    var mainDlg;


    this.dlgParam =  [
        {uiType:UIFrame,id:"page_bk",l:0,t:0,w:1280,h:720,type:"hole"}
    ];

    var width_frame = 560;
    var height_frame = 270;
    var top_frame = 160;

    var width_title = width_frame*0.35;
    var width_con = width_frame*0.5;

    var height_item = 46;
    var height_label = 30;
    var height_con = 36;

    var top_label = 86;
    var top_con = top_label-2;

    var left_title = 20;
    var left_con = left_title + width_title + 6;
    var left_nav = width_frame*0.4;

    var mainParam = [
        {uiType:UIFrame,id:"bk",w:width_frame,h:height_frame,l:(1280 - width_frame)/2,t:top_frame,styleClass:"system_setting_bk",focusMoveMode:"circle",visibility:1},
        {uiType:UILabel,id:"title",w:width_frame,h:50,ol:0,ot:2,dt:10,HAlign:"center",font:font2,value:Lp.getValue("Step1"),color:"grey"},

        {uiType:UILabel,id:"ota_Title",w:width_title,h:height_label,ol:left_title,ot:top_label,value:Lp.getValue("Ota"),font:font1,HAlign:"right",color:"grey"},
        {uiType:UILabel,id:"ota_text",w:width_con,h:height_con,ol:left_con,ot:top_con,HAlign:"left",font:font1,value:Lp.getValue("UpCheck")},

        {uiType:UILabel,id:"bid_title",w:width_title,h:height_label,ol:left_title,ot:top_label+height_item,value:"BID:",font:font1,HAlign:"right",color:"grey"},
        {uiType:UILabel,id:"bid_text",w:width_con,h:height_con,ol:left_con,ot:top_con+height_item,HAlign:"left",font:font1,value:"25149"},

        {uiType:UILabel,id:"sw_title",w:width_title,h:height_label,ol:left_title,ot:top_label+height_item*2,value:Lp.getValue("CurSw"),font:font1,HAlign:"right",color:"grey"},
        {uiType:UILabel,id:"sw_text",w:width_con,h:height_con,ol:left_con,ot:top_con+height_item*2,HAlign:"left",font:font1,value:"3E:3F"},

        {uiType:UIImg,id:"iconOk",w:60,h:22,ol:left_nav,ot:height_frame-40+2,src:"dialog/ico_ok"},
        {uiType:UILabel,id:"iconText",w:100,h:30,ol:(left_nav = left_nav + 50),ot:height_frame-40+3,value:Lp.getValue("Wait"),font:font1,color:"grey"}
    ];

    this.initView = function(){

        utility.setled(2,1);
        utility.setled(0,0);
        mainDlg = UI.createGroup(mainParam,"mainDlg",self.win);
        if(caCom && caCom.caParams && caCom.caParams.bouquetId){
            mainDlg.getChild("bid_text").value = caCom.caParams.bouquetId;
        }
        else{
            mainDlg.getChild("bid_text").value = sysCom.config.bouquetID;
        }

        var deviceInfo = utility.getDeviceInfo(false);
        if(deviceInfo){
            mainDlg.getChild("sw_text").value = "C"+deviceInfo.swVersion;
        }
        else{
            mainDlg.getChild("sw_text").value = "C01";
        }
        self.win.update();
    };

    var cntTimes = 15;
    this.openCheckTimer = function(){
        checkTimer = setInterval(function(){
            mainDlg.getChild("ota_text").value = Lp.getValue("UpCheck") + cntTimes + Lp.getValue("second");

            cntTimes--;
            if(cntTimes < 0){
                self.closeCheckTimer();
                mainDlg.getChild("iconText").value = Lp.getValue("Next");
            }
            //检测是否有升级信息
            if(OTA.checkOTAUpdate(false)){
                OTA.startOTAUpdate(false);
            }
            self.win.update();
        },1000);
    };


    this.closeCheckTimer = function(){
        if(checkTimer){
            clearInterval(checkTimer);
            checkTimer = null;
        }
    };

    this.open = function(){
        this.defOpen();
        this.initView();
    };


    this.close = function(){
        this.defClose();
    };

    this.start = function(){
        //锁频 开始接收升级信息
        var param = {
            "id": 0,
            "signal": 0,
            "car":
                {
                    "freq":sysCom.config.frequency,
                    "sym":sysCom.config.symbol_rate,
                    "qam": sysCom.config.qam
                }
        };
        var ret = Tuner.tunerConnect(param,false);
        self.openCheckTimer();
    };

    this.stop = function(){
        self.closeCheckTimer();
    };

    this.onkey = function(e)
    {
        var ret = true;
        switch(e.keyCode){
            case UI.KEY.ENTER:
                if(cntTimes < 0){
                    self.go(ScreenSoundPage);
                }
                ret = true;
                break;
        }
        return ret;
    };
}
UpdateCheckPage.prototype = UIModule.baseModule;
