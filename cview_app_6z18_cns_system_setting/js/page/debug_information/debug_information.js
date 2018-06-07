// JavaScript Document

function DebugInformationPage(params,srcModule)
{
    var self = this;

	var font1 = uiCom.font.F20;
	var font2 = uiCom.font.F25;
	var font3 = uiCom.font.F35;
	
	var color1 = "grey";
	var color2 = "white";
	
	var selectDlg;
	var tipsDlg;
    var timer;
    this.dlgParam =  [
        //{uiType:UIFrame,id:"page_bk",l:0,t:0,w:1280,h:720,type:"hole"},
		 {uiType:UIFrame,id:"page_bk",l:0,t:0,w:1280,h:720,styleClass:"block_black_bt"},
    ];
	
	var width_frame = 500;
	var height_frame = 180;
	var top_frame = 200;
	
	var width_title = width_frame*0.36;
	var width_con = width_frame*0.55;
	
	var height_label = 30;
	var height_con = 40;
	
	var top_label = 86;
	var top_con = top_label - 13;
	
	var left_title = 20;
	var left_con = left_title + width_title + 6;
	
	var valueArr = [
		Lp.getValue("Switch_Off"),
		Lp.getValue("Switch_On")
	];
	
	var left_nav = width_frame*0.3;
	
	var selectParam = [
		{uiType:UIFrame,id:"bk",w:width_frame,h:height_frame,l:(1280 - width_frame)/2,t:top_frame,styleClass:"system_setting_bk",focusMoveMode:"circle",visibility:1},
		{uiType:UILabel,w:width_frame,h:50,ol:0,ot:2,dt:10,HAlign:"center",font:font2,value:Lp.getValue("Debug_Information")},
		{uiType:UILabel,w:width_title,h:height_label,ol:left_title,ot:top_label,value:Lp.getValue("Debug_Information"),font:font1,HAlign:"right"},
		{uiType:UIButton,id:"debug_switch",w:width_con,h:height_con,ol:left_con,ot:top_con,dt:5,value:valueArr,HAlign:"center",font:font1,onFocus:true,styleClass:"setting_select_item"},
		
		{uiType:UIImg,w:60,h:22,ol:left_nav,ot:height_frame-40+2,src:"setting/ico_ok"},
		{uiType:UILabel,w:100,h:30,ol:(left_nav = left_nav + 50),ot:height_frame-40+3,value:Lp.getValue("OK"),font:font1},
		{uiType:UIImg,w:60,h:22,ol:(left_nav = left_nav + 100),ot:height_frame-40+1,src:"setting/ico_back"},
		{uiType:UILabel,w:80,h:30,ol:left_nav+56,ot:height_frame-40+3,value:Lp.getValue("UP_Page"),font:font1}
	];



    var width_tips = 250;
    var height_tips = 170;
    var left_tips = 515;
    var top_tips = 240;
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
		selectDlg = UI.createGroup(selectParam,"selectDlg",self.win,null,null,select_proc);
		tipsDlg = UI.createGroup(tipsParam,"selectDlg",self.win);
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

	
    this.open = function(){
		this.initData();
        this.defOpen();
		this.initView();
    };

    this.close = function(){
        this.defClose();
    };

    this.start = function(){
    	if(sysCom.config.isDebug){
            UI.focusWin.vIndex = 1;
		}
		else{
            UI.focusWin.vIndex = 0;
		}
    };
	
    this.onkey = function(e)
    {
        var ret = false;
        return ret;
    };
	
	function switchOn(){
        sysCom.config.isDebug = 1;
       // Subtitle.subtDebug({"debug":1},false)
        sysCom.saveConfig();
        showTips();
	}
	
	function switchOff(){
        sysCom.config.isDebug = 0;
        //Subtitle.subtDebug({"debug":0},false)
        sysCom.saveConfig();
        showTips();
	}



	function keyEnter(){
		var index = UI.focusWin.vIndex;
		if(index == 0){
            switchOff();
		}
		else{
			switchOn();
		}
	}
	
	
	function select_proc(e){
		var ret = false;
        switch(e.keyCode)
        {
            case UI.KEY.ENTER:
			ret = true;
			keyEnter();
			break;
			case UI.KEY.BACKSPACE:
			ret = true;
			self.go(SystemSettingMenuPage);
			break;
        }
        return ret;
	}
	

	
	
}
DebugInformationPage.prototype = UIModule.baseModule;
