// JavaScript Document

function LanguageInformationPage(params,srcModule)
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
	
	var timer;

    this.dlgParam =  [
        //{uiType:UIFrame,id:"page_bk",l:0,t:0,w:1280,h:720,type:"hole"},
		 {uiType:UIFrame,id:"page_bk",l:0,t:0,w:1280,h:720,styleClass:"block_black_bt"},
    ];
	
	var width_frame = 600;
	var height_frame = 230;
	var top_frame = 200;
	
	var width_title = width_frame*0.45;
	var width_con = width_frame*0.45;
	
	var height_item = 46;
	var height_label = 30;
	var height_con = 36;
	
	var top_label = 86;
	var top_con = top_label - 8;
	
	var left_title = 20;
	var left_con = left_title + width_title + 6;
		
	var languageArr = [Lp.getValue("Traditional_Chinese"),"English"];
	
	
	
	
	
	var timeArr =[
		[
			"3 秒",
			"5 秒",
			"10 秒",
			"15 秒",
			"20 秒",
		],
		[
			"3 Second",
			"5 Second",
			"10 Second",
			"15 Second",
			"20 Second",
		]
	]
	
	var left_nav = width_frame*0.3;
	
	var mainParam = [
		{uiType:UIFrame,id:"bk",w:width_frame,h:height_frame,l:(1280 - width_frame)/2,t:top_frame,styleClass:"system_setting_bk",focusMoveMode:"circle",visibility:1},
		{uiType:UILabel,id:"dlg_title",w:width_frame,h:50,ol:0,ot:2,dt:10,HAlign:"center",font:font2,value:Lp.getValue("Personal_Settings")+">"+Lp.getValue("Language_And_Messaging_Settings")},
		
		{uiType:UILabel,id:"language_title",w:width_title,h:height_label,ol:left_title,ot:top_label,value:Lp.getValue("Picture_Language_Display")+":",font:font1,HAlign:"right"},
		{uiType:UIButton,id:"language_button",w:width_con,h:height_con,ol:left_con,ot:top_con,dt:5,value:languageArr,HAlign:"center",font:font1,onFocus:true,styleClass:"setting_select_item"},
		{uiType:UILabel,id:"time_title",w:width_title,h:height_label,ol:left_title,ot:top_label+height_item,value:Lp.getValue("Message_Display_Time")+":",font:font1,HAlign:"right"},
		{uiType:UIButton,id:"time_button",w:width_con,h:height_con,ol:left_con,ot:top_con+height_item,dt:5,value:timeArr[0],HAlign:"center",font:font1,styleClass:"setting_select_item"},
		
		{uiType:UIImg,w:60,h:22,ol:left_nav,ot:height_frame-40+2,src:"setting/ico_ok"},
		{uiType:UILabel,id:"save_label",w:100,h:30,ol:(left_nav = left_nav + 50),ot:height_frame-40+3,value:Lp.getValue("Save"),font:font1},
		{uiType:UIImg,w:60,h:22,ol:(left_nav = left_nav + 100),ot:height_frame-40+1,src:"setting/ico_back"},
		{uiType:UILabel,id:"up_label",w:80,h:30,ol:left_nav+56,ot:height_frame-40+3,value:Lp.getValue("Up_Page"),font:font1}
	];
	
	var width_tips = width_frame/2;
	var height_tips = 170;
	var left_tips = (width_frame - width_tips)/2;
	var top_tips = (height_frame-height_tips)/2;
	left_start1 = 20;
	var tipsParam = [
		{uiType:UIFrame,id:"dialog_bk",w:width_tips,h:height_tips,ol:left_tips,ot:top_tips,styleClass:"system_setting_bk",visibility:0},
		{uiType:UILabel,id:"tips_title",w:width_tips,h:40,ol:0,ot:6,value:Lp.getValue("Tips"),font:font1,HAlign:"center"},
		{uiType:UILabel,id:"tps_label",w:width_tips,h:40,ol:0,ot:70,value:Lp.getValue("Save_Sucessful"),font:font1,HAlign:"center"},
	]
	
	
		
	
	this.initData = function(){
		isRestored = 0;
	}
	
	this.initView = function(){
		mainDlg = UI.createGroup(mainParam,"mainDlg",self.win);
		mainDlg.getChild("language_button").defProc = language_proc;

		tipsDlg = UI.createGroup(tipsParam,"tipsDlg",mainDlg);
		
		var lan_index = languageCom.menuLanguageIndex;
		var dis_index = 0;
		for(var i=0;i<timeArr[1].length;i++){
			if(parseInt(timeArr[1][i]) == sysCom.config.displayTime){
				dis_index = i;
				break;
			}
		}
		
		mainDlg.getChild("language_button").vIndex=lan_index;
		mainDlg.getChild("time_button").vIndex=dis_index;
		
		
		self.win.update();
	}
	
	function showTips(flag){
		console.log("sysCom.config.displayTime == "+sysCom.config.displayTime);
		if(flag == 0){
			tipsDlg.getChild("tips_title").value = Lp.getValue("Tips",0);
			tipsDlg.getChild("tps_label").value = Lp.getValue("Save_Sucessful",0);
		}
		else{
			tipsDlg.getChild("tips_title").value = Lp.getValue("Tips",1);
			tipsDlg.getChild("tps_label").value = Lp.getValue("Save_Sucessful",1);
		}
		tipsDlg.show();
		timer = setTimeout(function(){
			tipsDlg.hide();
		},sysCom.config.displayTime*1000);
	}
	
	function closeTime(){
		if(timer)clearTimeout(timer);
		timer = null;
	}
	
	function saveConfig(){
		var lan_index = mainDlg.getChild("language_button").vIndex;
		var tim_index = mainDlg.getChild("time_button").vIndex;
		
		sysCom.config.displayTime = parseInt(timeArr[lan_index][tim_index]);
		languageCom.setMenuLanguage(lan_index);
		showTips(lan_index);
		console.log("languageCom.menuLanguageIndex == "+languageCom.menuLanguageIndex);
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
	
	function toEnglish(){
		mainDlg.getChild("dlg_title").value=Lp.getValue("Personal_Settings",1)+">"+Lp.getValue("Language_And_Messaging_Settings",1);
		mainDlg.getChild("save_label").value=Lp.getValue("Save",1);
		mainDlg.getChild("up_label").value=Lp.getValue("Up_Page",1);
		mainDlg.getChild("language_title").value=Lp.getValue("Picture_Language_Display",1)+":";
		mainDlg.getChild("time_title").value=Lp.getValue("Message_Display_Time",1)+":";
		mainDlg.getChild("time_button").value = timeArr[1];
	}
	
	function toChinese(){
		mainDlg.getChild("dlg_title").value=Lp.getValue("Personal_Settings",0)+">"+Lp.getValue("Language_And_Messaging_Settings",0);
		mainDlg.getChild("save_label").value=Lp.getValue("Save",0);
		mainDlg.getChild("up_label").value=Lp.getValue("Up_Page",0);
		mainDlg.getChild("language_title").value=Lp.getValue("Picture_Language_Display",0)+":";
		mainDlg.getChild("time_title").value=Lp.getValue("Message_Display_Time",0)+":";
		mainDlg.getChild("time_button").value = timeArr[0];
	}
	
	
	function language_proc(e){
        var ret = false;
        if(typeof(this.value) == "object" && this.value.length > 0){
            if(e.keyCode == UI.KEY.LEFT || e.keyCode == UI.KEY.RIGHT){
                var step = (e.keyCode == UI.KEY.LEFT?-1:1);
                this.vIndex = (this.vIndex + step + this.value.length) % this.value.length;
				
				if(this.vIndex == 1){
					toEnglish();
				}
				else{
					toChinese();
				}
                ret = true;
                this.update();
                this.onkey({keyCode:UI.KEY.WM_VALUE_CHANGE,id:this.id,hwin:this});
            }
        }

        return ret;
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
LanguageInformationPage.prototype = UIModule.baseModule;
