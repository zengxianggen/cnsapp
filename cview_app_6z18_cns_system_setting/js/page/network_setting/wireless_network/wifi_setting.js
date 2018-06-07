// JavaScript Document
var wifiSetting = new WiFiSetting();
function WiFiSetting(){
	
	var self = this;
	
	var font1 = uiCom.font.P18;
	
	var mainDlg;
	var norDlg;
	var noCMDlg;
	
	var bkNor;
	var bkFoc;
	
	var navNorDlg;
	var navFocusDlg;
	
	var width_frame = cmRightControl.width;
	var height_frame = cmRightControl.height;
	var left_frame = cmRightControl.left;
	var top_frame = cmRightControl.top;
	
	var width_title = width_frame*0.40;
	var width_con = width_frame*0.60;
	var left_con = width_title + 20;
	var height_item = 60;
	var height_con = height_item*0.65;
	var top_item_ot = 8;
	var top_con_ot = top_item_ot +7;
	var item_dt = 6;
	
	var swValueArr = [
		Lp.getValue("Switch_On"),
		Lp.getValue("Switch_Off")
	]
	
	var enValueArr = [
		"NONE",
		"WPA",
		"WPA2",
		"WPA/WPA2"
	]
	
	this.dlgParam = [
		{uiType:UIFrame,id:"right_bk",w:width_frame,h:height_frame,l:left_frame,t:top_frame,styleClass:"None",focusMoveMode:"circle"},
		{uiType:UIFrame,id:"right_bk_grey",w:width_frame,h:height_frame,l:left_frame,t:top_frame,type:"3imgv",cls:"setting/systemSetRightGrey",},
		{uiType:UIFrame,id:"right_bk_blue",w:width_frame,h:height_frame,l:left_frame,t:top_frame,type:"3imgv",cls:"setting/systemSetRightBlue",visibility:0},

	];
	
	this.normalParam = [
		{uiType:UIFrame,id:"right_bk_nor",w:width_frame,h:height_frame,l:left_frame,t:top_frame,styleClass:"None",focusMoveMode:"circle"},
		
		{uiType:UILabel,id:"wifi_switch_title",w:width_title,h:height_item,ol:2,ot:top_item_ot,dt:item_dt,HAlign:"right",value:"WiFi"+Lp.getValue("Switch")+":",font:font1},
		{uiType:UILabel,id:"wifi_name_title",w:width_title,h:height_item,ol:2,ot:top_item_ot+height_item,dt:item_dt,HAlign:"right",value:"WiFi"+Lp.getValue("Name")+":",font:font1},
		{uiType:UILabel,id:"encrypt_mode_title",w:width_title,h:height_item,ol:2,ot:top_item_ot+height_item*2,dt:item_dt,HAlign:"right",value:Lp.getValue("Encrypt_Mode")+":",font:font1},
		{uiType:UILabel,id:"wifi_password_title",w:width_title,h:height_item,ol:2,ot:top_item_ot+height_item*3,dt:item_dt,HAlign:"right",value:"WiFi"+Lp.getValue("Password")+":",font:font1},
		{uiType:UILabel,id:"confirm_password_title",w:width_title,h:height_item,ol:2,ot:top_item_ot+height_item*4,dt:item_dt,HAlign:"right",value:Lp.getValue("Confirm_Password")+":",font:font1},
		
		{uiType:UIButton,id:"wifi_switch_edit",w:width_con,h:height_con,ol:left_con,ot:top_con_ot,dt:item_dt,HAlign:"center",vIndex:0,value:swValueArr,styleClass:"setting_select_item"},
		
		{uiType:UILabel,id:"wifi_name_con",w:width_con,h:height_item,ol:left_con,ot:top_con_ot+height_item,HAlign:"center",value:"home_kk9_0",font:font1},
		
		{uiType:UIButton,id:"encrypt_mode_edit",w:width_con,h:height_con,ol:left_con,ot:top_con_ot+height_item*2,dt:item_dt,HAlign:"center",vIndex:0,value:enValueArr,styleClass:"setting_select_item"},
		
		{uiType:UIEdit,id:"wifi_password_edit",w:width_con,h:height_con,ol:left_con,ot:top_con_ot+height_item*3,dt:item_dt,HAlign:"center",value:"........",styleClass:"setting_edit_item",maxChars:16},
		
		{uiType:UIEdit,id:"confirm_password_edit",w:width_con,h:height_con,ol:left_con,ot:top_con_ot+height_item*4,dt:item_dt,HAlign:"center",value:"........",styleClass:"setting_edit_item",maxChars:16},
	
	]
	
	this.norTipsParam = [
	

	]
	
	this.noCMParam = [
	
		{uiType:UIFrame,id:"right_bk_nor",w:width_frame,h:height_frame,l:left_frame,t:top_frame,styleClass:"None",focusMoveMode:"circle",visibility:0},
		
		{uiType:UILabel,id:"wifi_switch_title",w:width_title,h:height_item,ol:2,ot:top_item_ot,dt:item_dt,HAlign:"right",value:"WiFi"+Lp.getValue("Switch")+":",font:font1},
		{uiType:UILabel,id:"wifi_name_title",w:width_title,h:height_item,ol:2,ot:top_item_ot+height_item,dt:item_dt,HAlign:"right",value:"WiFi"+Lp.getValue("Name")+":",font:font1},
		{uiType:UILabel,id:"encrypt_mode_title",w:width_title,h:height_item,ol:2,ot:top_item_ot+height_item*2,dt:item_dt,HAlign:"right",value:Lp.getValue("Encrypt_Mode")+":",font:font1},
		{uiType:UILabel,id:"wifi_password_title",w:width_title,h:height_item,ol:2,ot:top_item_ot+height_item*3,dt:item_dt,HAlign:"right",value:"WiFi"+Lp.getValue("Password")+":",font:font1},
		{uiType:UILabel,id:"confirm_password_title",w:width_title,h:height_item,ol:2,ot:top_item_ot+height_item*4,dt:item_dt,HAlign:"right",value:Lp.getValue("Confirm_Password")+":",font:font1},
		
		{uiType:UIButton,id:"nwifi_switch_edit",w:width_con,h:height_con,ol:left_con,ot:top_con_ot,dt:item_dt,HAlign:"center",vIndex:0,value:[""],styleClass:"setting_select_item"},
		
		{uiType:UILabel,id:"nwifi_name_con",w:width_con,h:height_item,ol:left_con,ot:top_con_ot+height_item,HAlign:"center",value:"home_kk9_0",font:font1},
		
		{uiType:UIButton,id:"nencrypt_mode_edit",w:width_con,h:height_con,ol:left_con,ot:top_con_ot+height_item*2,dt:item_dt,HAlign:"center",vIndex:0,value:enValueArr,styleClass:"setting_select_item"},
		
		{uiType:UIEdit,id:"nwifi_password_edit",w:width_con,h:height_con,ol:left_con,ot:top_con_ot+height_item*3,dt:item_dt,HAlign:"center",value:"........",styleClass:"setting_edit_item",maxChars:16},
		
		{uiType:UIEdit,id:"nconfirm_password_edit",w:width_con,h:height_con,ol:left_con,ot:top_con_ot+height_item*4,dt:item_dt,HAlign:"center",value:"........",styleClass:"setting_edit_item",maxChars:16},
		{uiType:UIFrame,w:width_frame*0.85,h:height_frame*0.35,ol:60,ot:top_con_ot+100,styleClass:"dialog_tips"},
		{uiType:UILabel,id:"tips_title",w:width_frame*0.85,h:height_item,ol:60,ot:top_con_ot+100,dt:-10,HAlign:"center",value:Lp.getValue("Tips")+":",font:font1},
		{uiType:UILabel,id:"tips_con",w:width_frame*0.85,h:height_item,ol:60,ot:top_con_ot+145,HAlign:"center",value:Lp.getValue("No_CM_Tips")+":",font:font1},
	]
	
	this.initDlg = function(parent){
		mainDlg = UI.createGroup(self.dlgParam,"wifiDlg",parent);
		norDlg = UI.createGroup(self.normalParam,"normalDlg",mainDlg,null,null,self.nor_proc);
		noCMDlg = UI.createGroup(self.noCMParam,"noCMDlg",mainDlg);
		
		var is_cm_available = cmRightControl.getWirelessCardModule();
		mainDlg.visibility = 0;
		if(!is_cm_available){
			norDlg.visibility = 0;
			noCMDlg.visibility = 1;
		}
		else{
			noCMDlg.visibility = 0;
		}
	}
	
	this.hide = function(){
		mainDlg.visibility = 0;
	}
	
	this.show = function(){
		mainDlg.visibility = 1;
		var is_cm_available = cmRightControl.getWirelessCardModule();
		if(!is_cm_available){
			norDlg.visibility = 0;
			noCMDlg.visibility = 1;
		}
		else{
			noCMDlg.visibility = 0;
		}
	}
	
	this.setFocus = function(){
		if(cmRightControl.getWirelessCardModule() == false)return false;
		else {
			return true;
		}
	}
	
	this.loseFocus = function(){
	
	
	}
	
	this.getInfo = function(){
		
		var defaultInfo = {
			is_cm_available:0
		}
	
		return defaultInfo;
	}
	
	this.nor_proc = function(e){
		var keyCode = e.keyCode;
		console.log("ip_information keyCode == "+keyCode);
		switch(keyCode){
			
		
		}	
	}
	
	this.tips_proc = function(e){
		var keyCode = e.keyCode;
		console.log("ip_information keyCode == "+keyCode);
		switch(keyCode){
			
		
		}	
	}
}