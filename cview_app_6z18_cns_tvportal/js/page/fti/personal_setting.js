// JavaScript Document

function ScreenSoundPage(params,srcModule)
{
    var self = this;

    var font1 = uiCom.font.F20;
    var font2 = uiCom.font.F25;
    var font3 = uiCom.font.F35;


    var mainDlg;

    var tipsDlg;

    var timer;
    var is_havedone= false;
    this.dlgParam =  [
        {uiType:UIFrame,id:"page_bk",l:0,t:0,w:1280,h:720,type:"hole"},
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
    var top_con = top_label - 8;

    var left_title = 20;
    var left_con = left_title + width_title + 6;

    var screenArr = [
        Lp.getValue("Automatic"),
        "16:9 PB",
        "16:9 PS",
        "4:3 LB",
        "4:3 PS"
    ];

    var picArr = [
        [
            "480p",
            "720p",
            "1080i",
            "1080p",
            "2160P30",
            "2160P60"],
        [
            1,
            4,
            6,
            8,
            11,
            13
        ]
    ];

    var languageArr =[
        Lp.getValue("Chinese"),
        Lp.getValue("English")
    ];


    var left_nav = width_frame*0.4;

    var mainParam = [
        {uiType:UIFrame,id:"bk",w:width_frame,h:height_frame,l:(1280 - width_frame)/2,t:top_frame,styleClass:"system_setting_bk",focusMoveMode:"circle",visibility:1},
        {uiType:UILabel,id:"maintitle",w:width_frame,h:50,ol:0,ot:2,dt:10,HAlign:"center",font:font2,value:Lp.getValue("Step2")},


        {uiType:UILabel,id:"main_language_title",w:width_title,h:height_label,ol:left_title,ot:top_label,value:Lp.getValue("Language")+":",font:font1,HAlign:"right"},
        {uiType:UIButton,id:"main_language_button",w:width_con,h:height_con,ol:left_con,ot:top_con,dt:5,value:languageArr,HAlign:"center",font:font1,onFocus:true,styleClass:"setting_select_item",vIndex:sysCom.config.mainLanguage},


        {uiType:UILabel,id:"ratio_title",w:width_title,h:height_label,ol:left_title,ot:top_label+height_item,value:Lp.getValue("Screen_Scale")+":",font:font1,HAlign:"right"},
        {uiType:UIButton,id:"ratio_button",w:width_con,h:height_con,ol:left_con,ot:top_con+height_item,dt:5,value:screenArr,HAlign:"center",font:font1,styleClass:"setting_select_item",vIndex:sysCom.config.screenRatio},

        {uiType:UILabel,id:"picture_quality_title",w:width_title,h:height_label,ol:left_title,ot:top_label+height_item*2,value:Lp.getValue("Picture")+":",font:font1,HAlign:"right"},
        {uiType:UIButton,id:"picture_quality_button",w:width_con,h:height_con,ol:left_con,ot:top_con+height_item*2,dt:5,value:picArr[0],HAlign:"center",font:font1,styleClass:"setting_select_item",vIndex:sysCom.config.Reslution},


        {uiType:UIImg,w:60,h:22,ol:left_nav,ot:height_frame-40+2,src:"dialog/ico_ok"},
        {uiType:UILabel,id:"NextTtx",w:100,h:30,ol:(left_nav = left_nav + 50),ot:height_frame-40+3,value:Lp.getValue("Next"),font:font1},
    ];

    var width_tips = width_frame/2;
    var height_tips = 170;
    var left_tips = (width_frame - width_tips)/2;
    var top_tips = (height_frame-height_tips)/2;
    var tipsParam = [
        {uiType:UIFrame,id:"dialog_bk",w:width_tips,h:height_tips,ol:left_tips,ot:20,styleClass:"system_setting_bk",visibility:0},
        {uiType:UILabel,id:"tips",w:width_tips,h:40,ol:0,ot:6,value:Lp.getValue("Tips"),font:font1,HAlign:"center"},
        {uiType:UILabel,id:"save",w:width_tips,h:40,ol:0,ot:70,value:Lp.getValue("Save_Sucessful"),font:font1,HAlign:"center"},
    ];

    this.initData = function(){
        isRestored = 0;
    };


    this.toEnglish= function(){


        mainDlg.getChild("maintitle").value=Lp.getValue("Step2",1);
        mainDlg.getChild("main_language_title").value=Lp.getValue("Language",1)+":";
        mainDlg.getChild("ratio_title").value=Lp.getValue("Screen_Scale",1)+":";
        mainDlg.getChild("picture_quality_title").value=Lp.getValue("Picture",1)+":";
        mainDlg.getChild("NextTtx").value=Lp.getValue("Next",1);

        tipsDlg.getChild("tips").value=Lp.getValue("Next",1);
        tipsDlg.getChild("save").value=Lp.getValue("save",1);
        screenArr[0]= Lp.getValue("Automatic",1);

    }

    this.toChinese= function(){

        mainDlg.getChild("maintitle").value=Lp.getValue("Step2",0);
        mainDlg.getChild("main_language_title").value=Lp.getValue("Language",0)+":";
        mainDlg.getChild("ratio_title").value=Lp.getValue("Screen_Scale",0)+":";
        mainDlg.getChild("picture_quality_title").value=Lp.getValue("Picture",0)+":";
        mainDlg.getChild("NextTtx").value=Lp.getValue("Next",0);

        tipsDlg.getChild("tips").value=Lp.getValue("Next",0);
        tipsDlg.getChild("save").value=Lp.getValue("save",0);
        screenArr[0]= Lp.getValue("Automatic",0);

    }

    this.language_proc=function(e){
        var ret = false;
        if(typeof(this.value) == "object" && this.value.length > 0){
            if(e.keyCode == UI.KEY.LEFT || e.keyCode == UI.KEY.RIGHT){
                var step = (e.keyCode == UI.KEY.LEFT?-1:1);
                this.vIndex = (this.vIndex + step + this.value.length) % this.value.length;

                if(this.vIndex == 1){
                    self.toEnglish();
                }
                else{
                    self.toChinese();
                }
                ret = true;
                this.update();
                this.onkey({keyCode:UI.KEY.WM_VALUE_CHANGE,id:this.id,hwin:this});
            }
        }

        return ret;
    };
    this.initView = function(){

        mainDlg = UI.createGroup(mainParam,"mainDlg",self.win);
        tipsDlg = UI.createGroup(tipsParam,"tipsDlg",mainDlg);

        mainDlg.getChild("main_language_button").defProc = self.language_proc;

        for(var i=0;i<picArr[1].length;i++){
            if(parseInt(sysCom.config.Reslution) == picArr[1][i])
                mainDlg.getChild("picture_quality_button").vIndex = i;
        }

        self.win.update();
    };

    function showTips(cb){

        tipsDlg.show();
        timer = setTimeout(function(){
            tipsDlg.hide();
            if(cb){
                cb();
            }
        },sysCom.config.displayTime*1000);
    }

    function closeTime(){
        if(timer)clearTimeout(timer);
        timer = null;
    }

    function saveConfig(){

        var screenIndex = parseInt(mainDlg.getChild("ratio_button").vIndex);
        var pictureIndex = parseInt(mainDlg.getChild("picture_quality_button").vIndex);
        var langIndex = parseInt(mainDlg.getChild("main_language_button").vIndex);

        switch(screenIndex){
            case 0://自動
                sysCom.config.AspectRatio = 0;
                sysCom.config.AspectMode = 0;
                /* dtvCom.mp.mpSetAspectRatio(0,false);
                 dtvCom.mp.mpSetAspectMode(0,false);*/
                dtvCom.mp.setAspectParams( sysCom.config.AspectRatio,sysCom.config.AspectMode,false);
                break;
            case 1:
                sysCom.config.AspectRatio = 0;
                sysCom.config.AspectMode = 3;
                /*dtvCom.mp.mpSetAspectRatio(0,false);
                dtvCom.mp.mpSetAspectMode(1,false);*/
                dtvCom.mp.setAspectParams( sysCom.config.AspectRatio,sysCom.config.AspectMode,false);
                break;
            case 2:
                sysCom.config.AspectRatio = 0;
                sysCom.config.AspectMode = 2;
                /*  dtvCom.mp.mpSetAspectRatio(0,false);
                  dtvCom.mp.mpSetAspectMode(0,false);*/
                dtvCom.mp.setAspectParams( sysCom.config.AspectRatio,sysCom.config.AspectMode,false);
                break;
            case 3:
                sysCom.config.AspectRatio = 1;
                sysCom.config.AspectMode = 1;
                /*  dtvCom.mp.mpSetAspectRatio(1,false);
                  dtvCom.mp.mpSetAspectMode(1,false);*/
                dtvCom.mp.setAspectParams( sysCom.config.AspectRatio,sysCom.config.AspectMode,false);
                break;
            case 4:
                sysCom.config.AspectRatio = 1;
                sysCom.config.AspectMode = 2;
                /*dtvCom.mp.mpSetAspectRatio(1,false);
                dtvCom.mp.mpSetAspectMode(0,false);*/
                dtvCom.mp.setAspectParams( sysCom.config.AspectRatio,sysCom.config.AspectMode,false);
                break;
        }
        Disp.setResolution(picArr[1][pictureIndex],false);
        sysCom.config.Reslution = picArr[1][pictureIndex];

        languageCom.setMenuLanguage(langIndex);
        //sysCom.config.mainLanguage = langIndex;
        //languageCom.menuLanguageIndex = sysCom.config.menuLanguageIndex;
        sysCom.saveConfig();
        showTips(function(){
            self.go(SignalCheckPage);
        });
    }

    this.open = function(){
        this.initData();
        this.defOpen();
        this.initView();
    };

    this.close = function(){
        this.defClose();
    };

    this.start = function(){
    };


    this.onkey = function(e)
    {
        var ret = true;
        switch(e.keyCode){
            case UI.KEY.ENTER:
                if(is_havedone == false) {
                    saveConfig();
                    is_havedone = true;
                }
                break;
        }
        return ret;
    };


}
ScreenSoundPage.prototype = UIModule.baseModule;
