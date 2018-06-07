// JavaScript Document

var changePassword = new ChangePassword();
function ChangePassword(){
	
	var self = this;
	
	var font1 = uiCom.font.F20;
	var font2 = uiCom.font.F22;
	
	var color1 = "grey";
	var color2 = "white";
	
	var mainDlg;
	var navNorDlg;
	var navFocusDlg;
	
	var bkNor;
	var bkFoc;
	
	var tipsDlg;
	var timer;
	
	var width_frame = lockRightControl.width;
	var height_frame = lockRightControl.height;
	var left_frame = lockRightControl.left;
	var top_frame = lockRightControl.top;
	
	
	var width_title = 200;
	var width_con = 120;
	var height_label = 30;
	var height_con = 30;
	var height_item = 40;
	var top_title = 110;
	var top_con = top_title-6;
	var left_title = 10;
	var left_con = left_title+width_title+3;
	var item_dt = 6;
	this.dlgParam = [
		{uiType:UIFrame,id:"bk",w:width_frame,h:height_frame,l:left_frame,t:top_frame,styleClass:"None",focusMoveMode:"circle",visibility:0},
		{uiType:UIFrame,id:"bk_grey",w:width_frame,h:height_frame,l:left_frame,t:top_frame,type:"3imgv",cls:"setting/systemSetRightGrey",},
		{uiType:UIFrame,id:"bk_blue",w:width_frame,h:height_frame,l:left_frame,t:top_frame,type:"3imgv",cls:"setting/systemSetRightBlue",visibility:0},
		{uiType:UILabel,id:"nav1_text",w:width_title,h:height_label,ol:left_title,ot:top_title,value:Lp.getValue("New_Password")+":",font:font1,HAlign:"right"},
		{uiType:UILabel,id:"nav2_text",w:width_title,h:height_label,ol:left_title,ot:top_title+height_item,value:Lp.getValue("Confirm_Password")+":",font:font1,HAlign:"right"},
		{uiType:UIEdit,id:"new_password_edit",w:width_con,h:height_con,ol:left_con,ot:top_con,value:"",password:true,font:font1,maxChars:4,styleClass:"setting_edit_item"},
		{uiType:UIEdit,id:"confirm_password_edit",w:width_con,h:height_con,ol:left_con,ot:top_con+height_item,password:true,font:font1,maxChars:4,value:"",styleClass:"setting_edit_item"},
		
		
	];
	
	var left_start1 = 100;
	this.navNormalParam = [
		{uiType:UIFrame,id:"dialog_bk",w:width_frame,h:60,ol:0,ot:height_frame+18,styleClass:"None",visibility:1},
		{uiType:UIImg,id:"nav1",w:34,h:26,ol:left_start1,ot:0,src:"setting/ico_rightArrow"},
		{uiType:UILabel,id:"nav1_text",w:100,h:40,ol:(left_start1=left_start1+34 + 10),ot:-3,value:Lp.getValue("Move_Focus_Right"),font:font1},
		{uiType:UIImg,id:"nav2",w:47,h:26,ol:(left_start1=left_start1+100+10),ot:0,src:"setting/ico_back"},
		{uiType:UILabel,id:"nav2_text",w:200,h:40,ol:(left_start1=left_start1+47+10),ot:-3,value:Lp.getValue("Up_Page"),font:font1}
	];
	
	left_start1 = 60;
	this.navFocusParam = [
		{uiType:UIFrame,id:"dialog_bk",w:width_frame,h:60,ol:0,ot:height_frame+18,styleClass:"None",visibility:0},
		{uiType:UIImg,id:"nav1",w:47,h:20,ol:left_start1,ot:0,src:"setting/ico_back"},
		{uiType:UILabel,id:"nav1_text",w:100,h:40,ol:(left_start1=left_start1+47 + 10),ot:-3,value:Lp.getValue("Move_Focus_Left"),font:font1},
		{uiType:UIImg,id:"nav2",w:34,h:20,ol:(left_start1=left_start1+100+10),ot:0,src:"setting/ico_ok"},
		{uiType:UILabel,id:"nav2_text",w:200,h:40,ol:(left_start1=left_start1+34+10),ot:-3,value:Lp.getValue("Save"),font:font1}
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
		
	}
	
	
	this.initDlg = function(parent){
		this.initData();
		mainDlg = UI.createGroup(self.dlgParam,"mainDlg",parent,null,null,self.proc);
		navNorDlg = UI.createGroup(self.navNormalParam,"navNorDlg",mainDlg);
		navFocusDlg = UI.createGroup(self.navFocusParam,"navFocusDlg",mainDlg);


        //update language
        mainDlg.getChild("nav1_text").value=Lp.getValue("New_Password");
        mainDlg.getChild("nav2_text").value=Lp.getValue("Confirm_Password");

        navNorDlg.getChild("nav1_text").value=Lp.getValue("Move_Focus_Right");
        navNorDlg.getChild("nav2_text").value=Lp.getValue("Up_Page");

        navFocusDlg.getChild("nav1_text").value=Lp.getValue("Move_Focus_Left");
        navFocusDlg.getChild("nav2_text").value=Lp.getValue("Save");


		bkNor = mainDlg.getChild("bk_grey");
		bkFoc = mainDlg.getChild("bk_blue");
		
		tipsDlg = UI.createGroup(tipsParam,"tipsDlg",mainDlg);
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
	
	this.hide = function(){
		mainDlg.visibility = 0;
		closeTime();
	}
	
	this.show = function(){
		mainDlg.visibility = 1;
	}
	
	this.setFocus = function(){
		mainDlg.getChild("new_password_edit").setFocus(true);
		bkNor.visibility = 0;
		bkFoc.visibility = 1;
		navNorDlg.visibility = 0;
		navFocusDlg.visibility = 1;
		return true;
	}
	
	this.loseFocus = function(){
		bkNor.visibility = 1;
		bkFoc.visibility = 0;
		navFocusDlg.visibility = 0;
		navNorDlg.visibility = 1;
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
		sysCom.config.ParentalPin = mainDlg.getChild("new_password_edit").value;
		sysCom.saveConfig();
		showTips(3);
		
	}
	
	function keyEnter(){
		//save password
		showTips();
	}
	this.proc = function(e){
		var keyCode = e.keyCode;
		console.log("ip_information keyCode == "+keyCode);
		var ret =false;
		switch(keyCode){
			case UI.KEY.BACKSPACE:
			ret =true;
			lockRightControl.subLoseFocus();
			break;
			case UI.KEY.ENTER:
			ret =true;
			savePassword();
			break;
			case UI.KEY.YELLOW:
			keyYellow();
			break;
		}	
		
		return ret;
	}
	
	
}