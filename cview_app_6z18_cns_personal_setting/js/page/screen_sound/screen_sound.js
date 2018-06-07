// JavaScript Document

function ScreenSoundPage(params,srcModule)
{
    var self = this;

	var font1 = uiCom.font.F20;
	var font2 = uiCom.font.F25;
	var font3 = uiCom.font.F35;
	
	var color1 = "grey";
	var color2 = "white";
	
	var mainDlg;
	var chnTipsDlg;
	var enTipsDlg;
	var tipsDlg;
	
	var selectDialog;
	
	var timer;

    this.dlgParam =  [
        //{uiType:UIFrame,id:"page_bk",l:0,t:0,w:1280,h:720,type:"hole"},
		 {uiType:UIFrame,id:"page_bk",l:0,t:0,w:1280,h:720,styleClass:"block_black_bt"},
    ];
	
	var width_frame = 560;
	var height_frame = 370;
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
	]
	
	var switchArr=[
		Lp.getValue("Close"),
		Lp.getValue("Open")
	]
	
	var dubiArr=[
		Lp.getValue("Stereo"),
        Lp.getValue("Dolby")
	]
	
	var left_nav = width_frame*0.3;
	
	var mainParam = [
		{uiType:UIFrame,id:"bk",w:width_frame,h:height_frame,l:(1280 - width_frame)/2,t:top_frame,styleClass:"system_setting_bk",focusMoveMode:"circle",visibility:1},
		{uiType:UILabel,w:width_frame,h:50,ol:0,ot:2,dt:10,HAlign:"center",font:font2,value:Lp.getValue("Personal_Settings")+">"+Lp.getValue("Screen_And_Sound")},
		
		{uiType:UILabel,id:"ratio_title",w:width_title,h:height_label,ol:left_title,ot:top_label,value:Lp.getValue("Screen_Scale")+":",font:font1,HAlign:"right"},
		{uiType:UIButton,id:"ratio_button",w:width_con,h:height_con,ol:left_con,ot:top_con,dt:5,value:screenArr,HAlign:"center",font:font1,onFocus:true,styleClass:"setting_select_item",vIndex:sysCom.config.screenRatio},
		
		{uiType:UILabel,id:"picture_quality_title",w:width_title,h:height_label,ol:left_title,ot:top_label+height_item,value:Lp.getValue("Picture")+":",font:font1,HAlign:"right"},
		{uiType:UIButton,id:"picture_quality_button",w:width_con,h:height_con,ol:left_con,ot:top_con+height_item,dt:5,value:picArr[0],HAlign:"center",font:font1,styleClass:"setting_select_item",vIndex:sysCom.config.Reslution},
		
		{uiType:UILabel,id:"main_language_title",w:width_title,h:height_label,ol:left_title,ot:top_label+height_item*2,value:Lp.getValue("Major_Sound_Language")+":",font:font1,HAlign:"right"},
		{uiType:UIButton,id:"main_language_button",w:width_con,h:height_con,ol:left_con,ot:top_con+height_item*2,dt:5,value:languageArr,HAlign:"center",font:font1,styleClass:"setting_select_item",vIndex:sysCom.config.mainLanguage},
		
		{uiType:UILabel,id:"hdmi_cec_title",w:width_title,h:height_label,ol:left_title,ot:top_label+height_item*3,value:"HDMI CEC:",font:font1,HAlign:"right"},
		{uiType:UIButton,id:"hdmi_cec_button",w:width_con,h:height_con,ol:left_con,ot:top_con+height_item*3,dt:5,value:switchArr,HAlign:"center",font:font1,styleClass:"setting_select_item",vIndex:sysCom.config.hdmiCECStatus},
		
		{uiType:UILabel,id:"dolby_digit_title",w:width_title,h:height_label,ol:left_title,ot:top_label+height_item*4,value:Lp.getValue("Dolby_Digital")+":",font:font1,HAlign:"right"},
		{uiType:UIButton,id:"dolby_digit_button",w:width_con,h:height_con,ol:left_con,ot:top_con+height_item*4,dt:5,value:dubiArr,HAlign:"center",font:font1,styleClass:"setting_select_item",vIndex:sysCom.config.dolbyDigit},
		
		{uiType:UIImg,w:60,h:22,ol:left_nav,ot:height_frame-40+2,src:"setting/ico_ok"},
		{uiType:UILabel,w:100,h:30,ol:(left_nav = left_nav + 50),ot:height_frame-40+3,value:Lp.getValue("Save"),font:font1},
		{uiType:UIImg,w:60,h:22,ol:(left_nav = left_nav + 100),ot:height_frame-40+1,src:"setting/ico_back"},
		{uiType:UILabel,w:80,h:30,ol:left_nav+56,ot:height_frame-40+3,value:Lp.getValue("Up_Page"),font:font1}
	];
	
	var width_tips = width_frame/2;
	var height_tips = 170;
	var left_tips = (width_frame - width_tips)/2;
	var top_tips = (height_frame-height_tips)/2;
	left_start1 = 20;
	var tipsParam = [
		{uiType:UIFrame,id:"dialog_bk",w:width_tips,h:height_tips,ol:left_tips,ot:top_tips,styleClass:"system_setting_bk",visibility:0},
		{uiType:UILabel,w:width_tips,h:40,ol:0,ot:6,value:Lp.getValue("Tips"),font:font1,HAlign:"center"},
		{uiType:UILabel,w:width_tips,h:40,ol:0,ot:70,value:Lp.getValue("Save_Sucessful"),font:font1,HAlign:"center"},
	]
	
	
		
	
	this.initData = function(){
		isRestored = 0;
	}
	
	this.initView = function(){
		mainDlg = UI.createGroup(mainParam,"mainDlg",self.win);
		tipsDlg = UI.createGroup(tipsParam,"tipsDlg",mainDlg);
		
		
		selectDialog = new SelectDialog();
		selectDialog.create(self.win);

		console.log("Reslution:"+sysCom.config.Reslution);
		for(var i=0;i<picArr[1].length;i++){
			if(parseInt(sysCom.config.Reslution) == picArr[1][i])
			   mainDlg.getChild("picture_quality_button").vIndex = i;
		}
		
		self.win.update();
	}
	
	function showTips(){
		
		tipsDlg.show();
		timer = setTimeout(function(){
			tipsDlg.hide();
		},sysCom.config.displayTime*1000);
	}
	
	function closeTime(){
		if(timer)clearTimeout(timer);
		timer = null;
	}
	
	var oldFocusDlg=null;
	
	function selectCancel(){
		Disp.setResolution(parseInt(sysCom.config.Reslution),false);
		for(var i=0;i<picArr[1].length;i++){
			if(parseInt(sysCom.config.Reslution) == picArr[1][i])
			mainDlg.getChild("picture_quality_button").vIndex = i;
		}
		oldFocusDlg.setFocus(true);
		mainDlg.update();
	}
	
	function selectOk(){
		
		var pictureIndex = parseInt(mainDlg.getChild("picture_quality_button").vIndex)
		
		sysCom.config.Reslution = picArr[1][pictureIndex];
		sysCom.saveConfig();
		oldFocusDlg.setFocus(true);
		oldFocusDlg.update();
	}
	
	function saveConfig(){

		var screenIndex = parseInt(mainDlg.getChild("ratio_button").vIndex);
		var pictureIndex = parseInt(mainDlg.getChild("picture_quality_button").vIndex);
		var langIndex = parseInt(mainDlg.getChild("main_language_button").vIndex);
		var hdmiIndex = parseInt(mainDlg.getChild("hdmi_cec_button").vIndex);
		var dolbyIndex = parseInt(mainDlg.getChild("dolby_digit_button").vIndex);


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
        sysCom.saveConfig();

        if(sysCom.config.screenRatio!=screenIndex){
			sysCom.config.screenRatio = screenIndex;
            sysCom.saveConfig();
			showTips();
			return;
		}
		
		if(picArr[1][pictureIndex] != parseInt(sysCom.config.Reslution)){
            console.log("Reslution:"+picArr[1][pictureIndex]);
			Disp.setResolution(picArr[1][pictureIndex],false);
            sysCom.config.Reslution = picArr[1][pictureIndex];
            sysCom.saveConfig();
            showTips();
			return;
		}
		
		
		
		if( langIndex!=sysCom.config.mainLanguage||hdmiIndex!=sysCom.config.hdmiCECStatus||dolbyIndex!=sysCom.config.dolbyDigit){
			
			sysCom.config.screenRatio = parseInt(mainDlg.getChild("ratio_button").vIndex);
			sysCom.config.mainLanguage = parseInt(mainDlg.getChild("main_language_button").vIndex);
			sysCom.config.hdmiCECStatus = parseInt(mainDlg.getChild("hdmi_cec_button").vIndex);
			sysCom.config.dolbyDigit = parseInt(mainDlg.getChild("dolby_digit_button").vIndex);
            sysCom.saveConfig();
			showTips();
		}

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
        var ret = false;
		switch(e.keyCode){
			case UI.KEY.ENTER:
			saveConfig();
			ret = true;
			break;
			case UI.KEY.BACKSPACE:
			self.go(PersonalSettingMenuPage);
			ret = true;
			break;
		}
        return ret;
    };
	
	
}
ScreenSoundPage.prototype = UIModule.baseModule;
