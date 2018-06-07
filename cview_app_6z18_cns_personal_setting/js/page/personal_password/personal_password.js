// JavaScript Document

function PersonalPasswordPage(params,srcModule)
{
    var self = this;

	var font1 = uiCom.font.F20;
	var font2 = uiCom.font.F25;
	var font3 = uiCom.font.F35;
	
	var color1 = "grey";
	var color2 = "white";
	
	var mainDlg;
	var tipsDlg;
	
	var newPasswdDlg;
	var conPasswdDlg;
	
	var timer;

    this.dlgParam =  [
        //{uiType:UIFrame,id:"page_bk",l:0,t:0,w:1280,h:720,type:"hole"},
		 {uiType:UIFrame,id:"page_bk",l:0,t:0,w:1280,h:720,styleClass:"block_black_bt"},
    ];
	
	var width_frame = 500;
	var height_frame = 230;
	var top_frame = 200;
	
	var width_title = width_frame*0.55;
	var width_con = width_frame*0.2;
	
	var height_item = 40;
	var height_label = 30;
	var height_con = 30;
	
	var top_label = 86;
	var top_con = top_label - 8;
	
	var left_title = 20;
	var left_con = left_title + width_title + 6;
	
	var valueArr = [
		Lp.getValue("Switch_Off"),
		Lp.getValue("Switch_On")
	];
	
	var left_nav = width_frame*0.3;
	
	var mainParam = [
		{uiType:UIFrame,id:"bk",w:width_frame,h:height_frame,l:(1280 - width_frame)/2,t:top_frame,styleClass:"system_setting_bk",focusMoveMode:"circle",visibility:1},
		{uiType:UILabel,w:width_frame,h:50,ol:0,ot:2,dt:10,HAlign:"center",font:font2,value:Lp.getValue("Setting")+">"+Lp.getValue("Personal_Authentication_Code")},
		{uiType:UILabel,w:width_title,h:height_label,ol:left_title,ot:top_label,value:Lp.getValue("Enter_New_Password")+":",font:font1,HAlign:"right"},
		{uiType:UIEdit,id:"new_password_edit",w:width_con,h:height_con,ol:left_con,ot:top_con,dt:5,value:"",HAlign:"center",font:font1,onFocus:true,styleClass:"setting_edit_item",maxChars:4,password:true},
		{uiType:UILabel,w:width_title,h:height_label,ol:left_title,ot:top_label+height_item,value:Lp.getValue("Enter_New_Password_Again")+":",font:font1,HAlign:"right"},
		{uiType:UIEdit,id:"confirm_password_edit",w:width_con,h:height_con,ol:left_con,ot:top_con+height_item,dt:5,value:"",HAlign:"center",font:font1,styleClass:"setting_edit_item",maxChars:4,password:true},
		
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
		{uiType:UILabel,id:"tips_value",w:width_tips,h:40,ol:0,ot:70,value:Lp.getValue("Save_Sucessful"),font:font1,HAlign:"center"},
	]
	
	
		
	
	this.initData = function(){
		isRestored = 0;
	}
	
	this.initView = function(){
		mainDlg = UI.createGroup(mainParam,"mainDlg",self.win);
		tipsDlg = UI.createGroup(tipsParam,"tipsDlg",mainDlg);
		
		newPasswdDlg = mainDlg.getChild("new_password");
		conPasswdDlg = mainDlg.getChild("new_password_again");
		
		
		
	}
	
	function showTips(flag){
		
		if(flag == 0){
			tipsDlg.getChild("tips_value").value=Lp.getValue("Password_Empty");	
		}else if(flag==1){
			tipsDlg.getChild("tips_value").value=Lp.getValue("Password_Must_Be_4_Digits");
		}
		else if(flag==2){
			tipsDlg.getChild("tips_value").value=Lp.getValue("Passwords_Are_Different");
		}else{
			tipsDlg.getChild("tips_value").value=Lp.getValue("Save_Sucessful");
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
	
	function savePassword(){
		var p1 = mainDlg.getChild("new_password_edit").value;
		var p2 = mainDlg.getChild("confirm_password_edit").value;
		
		if(p1==""||p2==""){
			mainDlg.getChild("new_password_edit").value = "";
			mainDlg.getChild("confirm_password_edit").value = "";
			showTips(0);
			return;
		}
		
		if(p1.length!=4||p2.length!=4)
		{
			mainDlg.getChild("new_password_edit").value = "";
			mainDlg.getChild("confirm_password_edit").value = "";
			showTips(1);
			return;
		}
		
		if(p1 != p2){
			mainDlg.getChild("new_password_edit").value = "";
			mainDlg.getChild("confirm_password_edit").value = "";
			showTips(2);
			return;
		}
		sysCom.config.PersonalAuthenticationPin = mainDlg.getChild("new_password_edit").value;
		sysCom.saveConfig();
		showTips(3);
		
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
			savePassword();
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
PersonalPasswordPage.prototype = UIModule.baseModule;
