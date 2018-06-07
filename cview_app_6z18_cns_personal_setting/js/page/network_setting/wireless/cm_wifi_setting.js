// JavaScript Document
var wifiSetting = new WiFiSetting();
function WiFiSetting(){
	
	var self = this;
	
	var font1 = uiCom.font.P18;
	var font2 = uiCom.font.P20;
	
	var color1 = "grey";
	var color2 = "white";
	
	var mainDlg;
	
	var navNorDlg;
	var navFocusDlg;
	
	var bkNor;
	var bkFoc;
	
	var openDlg;
	var closeDlg;
	var noCMDlg;
	
	var openSelectDlg;
	var closeSelectDlg;
	
	var tipsDlg;
	
	var width_frame = cmRightControl.width;
	var height_frame = cmRightControl.height;
	var left_frame = cmRightControl.left;
	var top_frame = cmRightControl.top;
	
	var width_title = width_frame*0.35;
	var width_con = width_frame*0.55;
	var left_con = width_title + 20;
	var height_item = 60;
	var height_con = 36;
	var top_item_ot = 8;
	var top_con_ot = top_item_ot +13;
	var item_dt = 6;
	
	var openValueArr = [
		Lp.getValue("Switch_Off"),
	]
	
	var closeValueArr=[
		Lp.getValue("Switch_On")
	]
	
	var enValueArr = [
		"NONE",
		"WPA",
		"WPA2",
		"WPA/WPA2"
	]
	
	
	var mainParam = [
		{uiType:UIFrame,id:"right_bk",w:width_frame,h:height_frame,l:left_frame,t:top_frame,styleClass:"None",focusMoveMode:"circle"},
		{uiType:UIFrame,id:"bk_grey",w:width_frame,h:height_frame,l:left_frame,t:top_frame,type:"3imgv",cls:"setting/systemSetRightGrey",stretch:"HV"},
		{uiType:UIFrame,id:"bk_blue",w:width_frame,h:height_frame,l:left_frame,t:top_frame,type:"3imgv",cls:"setting/systemSetRightBlue",stretch:"HV",visibility:0},
	];
	
	var openParam = [
		{uiType:UIFrame,id:"right_bk_nor",w:width_frame,h:height_frame,l:left_frame,t:top_frame,styleClass:"None",focusMoveMode:"circle",visibility:0},
		
		{uiType:UILabel,id:"wifi_switch_title",w:width_title,h:height_item,ol:2,ot:top_item_ot,dt:item_dt,HAlign:"right",value:Lp.getValue("WiFi_Switch")+":",font:font1},
		{uiType:UILabel,id:"wifi_name_title",w:width_title,h:height_item,ol:2,ot:top_item_ot+height_item,dt:item_dt,HAlign:"right",value:"WiFi"+Lp.getValue("Name")+":",font:font1},
		{uiType:UILabel,id:"encrypt_mode_title",w:width_title,h:height_item,ol:2,ot:top_item_ot+height_item*2,dt:item_dt,HAlign:"right",value:Lp.getValue("Encryption_Mode")+":",font:font1},
		{uiType:UILabel,id:"wifi_password_title",w:width_title,h:height_item,ol:2,ot:top_item_ot+height_item*3,dt:item_dt,HAlign:"right",value:"WiFi"+Lp.getValue("Password")+":",font:font1},
		{uiType:UILabel,id:"confirm_password_title",w:width_title,h:height_item,ol:2,ot:top_item_ot+height_item*4,dt:item_dt,HAlign:"right",value:Lp.getValue("Confirm_Password")+":",font:font1},
		
		{uiType:UIButton,id:"wifi_switch_button",w:width_con,h:height_con,ol:left_con,ot:top_con_ot,dt:item_dt,HAlign:"center",vIndex:0,value:openValueArr,styleClass:"setting_select_item"},
		
		{uiType:UILabel,id:"wifi_name_con",w:width_con,h:height_item,ol:left_con,ot:top_con_ot+height_item,HAlign:"center",value:"home_kk9_0",font:font1},
		
		{uiType:UIButton,id:"encrypt_mode_edit",w:width_con,h:height_con,ol:left_con,ot:top_con_ot+height_item*2,dt:item_dt,HAlign:"center",vIndex:0,value:enValueArr,styleClass:"setting_select_item"},
		
		{uiType:UIEdit,id:"wifi_password_edit",w:width_con,h:height_con,ol:left_con,ot:top_con_ot+height_item*3,dt:item_dt,HAlign:"center",value:"",styleClass:"setting_edit_item",maxChars:16,password:true},
		
		{uiType:UIEdit,id:"confirm_password_edit",w:width_con,h:height_con,ol:left_con,ot:top_con_ot+height_item*4,dt:item_dt,HAlign:"center",value:"",styleClass:"setting_edit_item",maxChars:16,password:true},
	
	]
	
	var closeParam = [
		{uiType:UIFrame,id:"right_bk_nor",w:width_frame,h:height_frame,l:left_frame,t:top_frame,styleClass:"None",visibility:0},
		
		{uiType:UILabel,id:"wifi_switch_title",w:width_title,h:height_item,ol:2,ot:top_item_ot,dt:item_dt,HAlign:"right",value:Lp.getValue("WiFi_Switch")+":",font:font1,color:color1},
		{uiType:UILabel,id:"wifi_name_title",w:width_title,h:height_item,ol:2,ot:top_item_ot+height_item,dt:item_dt,HAlign:"right",value:"WiFi"+Lp.getValue("Name")+":",font:font1,color:color1},
		{uiType:UILabel,id:"encrypt_mode_title",w:width_title,h:height_item,ol:2,ot:top_item_ot+height_item*2,dt:item_dt,HAlign:"right",value:Lp.getValue("Encryption_Mode")+":",font:font1,color:color1},
		{uiType:UILabel,id:"wifi_password_title",w:width_title,h:height_item,ol:2,ot:top_item_ot+height_item*3,dt:item_dt,HAlign:"right",value:"WiFi"+Lp.getValue("Password")+":",font:font1,color:color1},
		{uiType:UILabel,id:"confirm_password_title",w:width_title,h:height_item,ol:2,ot:top_item_ot+height_item*4,dt:item_dt,HAlign:"right",value:Lp.getValue("Confirm_Password")+":",font:font1,color:color1},
		
		{uiType:UIButton,id:"wifi_switch_button",w:width_con,h:height_con,ol:left_con,ot:top_con_ot,dt:item_dt,HAlign:"center",vIndex:0,value:closeValueArr,styleClass:"setting_select_item",},
		
		{uiType:UILabel,id:"wifi_name_con",w:width_con,h:height_item,ol:left_con,ot:top_con_ot+height_item,HAlign:"center",value:"home_kk9_0",font:font1,color:color1},
		
		{uiType:UIButton,id:"encrypt_mode_edit",w:width_con,h:height_con,ol:left_con,ot:top_con_ot+height_item*2,dt:item_dt,HAlign:"center",vIndex:0,value:enValueArr,styleClass:"setting_select_item",color:color1,color:color1},
		
		{uiType:UIEdit,id:"wifi_password_edit",w:width_con,h:height_con,ol:left_con,ot:top_con_ot+height_item*3,dt:item_dt,HAlign:"center",value:"",styleClass:"setting_edit_item",maxChars:16,password:true,color:color1,maxChars:20},
		
		{uiType:UIEdit,id:"confirm_password_edit",w:width_con,h:height_con,ol:left_con,ot:top_con_ot+height_item*4,dt:item_dt,HAlign:"center",value:"",styleClass:"setting_edit_item",maxChars:16,password:true,color:color1,maxChars:20},
	
	]
	
	var noCMParam = [
	
		{uiType:UIFrame,id:"right_bk_nor",w:width_frame,h:height_frame,l:left_frame,t:top_frame,styleClass:"None",focusMoveMode:"circle",visibility:1},
		
		{uiType:UILabel,id:"wifi_switch_title",w:width_title,h:height_item,ol:2,ot:top_item_ot,dt:item_dt,HAlign:"right",value:Lp.getValue("WiFi_Switch")+":",font:font1,color:color1},
		{uiType:UILabel,id:"wifi_name_title",w:width_title,h:height_item,ol:2,ot:top_item_ot+height_item,dt:item_dt,HAlign:"right",value:"WiFi"+Lp.getValue("Name")+":",font:font1,color:color1},
		{uiType:UILabel,id:"encrypt_mode_title",w:width_title,h:height_item,ol:2,ot:top_item_ot+height_item*2,dt:item_dt,HAlign:"right",value:Lp.getValue("Encrypt_Mode")+":",font:font1,color:color1},
		{uiType:UILabel,id:"wifi_password_title",w:width_title,h:height_item,ol:2,ot:top_item_ot+height_item*3,dt:item_dt,HAlign:"right",value:"WiFi"+Lp.getValue("Password")+":",font:font1,color:color1},
		{uiType:UILabel,id:"confirm_password_title",w:width_title,h:height_item,ol:2,ot:top_item_ot+height_item*4,dt:item_dt,HAlign:"right",value:Lp.getValue("Confirm_Password")+":",font:font1,color:color1},
		
		{uiType:UIButton,id:"nwifi_switch_edit",w:width_con,h:height_con,ol:left_con,ot:top_con_ot,dt:item_dt,HAlign:"center",vIndex:0,value:[""],styleClass:"setting_select_item",color:color1},
		
		{uiType:UILabel,id:"nwifi_name_con",w:width_con,h:height_item,ol:left_con,ot:top_con_ot+height_item,HAlign:"center",value:"",font:font1,color:color1},
		
		{uiType:UIButton,id:"nencrypt_mode_edit",w:width_con,h:height_con,ol:left_con,ot:top_con_ot+height_item*2,dt:item_dt,HAlign:"center",vIndex:0,value:"",styleClass:"setting_select_item"},
		
		{uiType:UIEdit,id:"nwifi_password_edit",w:width_con,h:height_con,ol:left_con,ot:top_con_ot+height_item*3,dt:item_dt,HAlign:"center",value:"",styleClass:"setting_edit_item",maxChars:16},
		
		{uiType:UIEdit,id:"nconfirm_password_edit",w:width_con,h:height_con,ol:left_con,ot:top_con_ot+height_item*4,dt:item_dt,HAlign:"center",value:"",styleClass:"setting_edit_item",maxChars:16},
		{uiType:UIFrame,w:width_frame*0.85,h:height_frame*0.35,ol:60,ot:top_con_ot+100,styleClass:"dialog_tips"},
		{uiType:UILabel,id:"tips_title",w:width_frame*0.85,h:height_item,ol:60,ot:top_con_ot+100,dt:-10,HAlign:"center",value:Lp.getValue("Tips")+":",font:font1},
		{uiType:UILabel,id:"tips_con",w:width_frame*0.85,h:height_item,ol:60,ot:top_con_ot+145,HAlign:"center",value:Lp.getValue("No_CM_Tips")+":",font:font1},
	]
	
	
	var width_tips = width_frame*2/3;
	var height_tips = height_frame/2;
	var left_tips = (width_frame - width_tips)/2;
	var top_tips = (height_frame - height_tips)/2;
	var tipsParam = [
		{uiType:UIFrame,id:"tips_bk",w:width_tips,h:height_tips,ol:left_tips,ot:top_tips,styleClass:"setting_dialog_bk_blue",visibility:0},
		{uiType:UILabel,w:width_tips,h:50,ol:0,ot:2,dt:0,HAlign:"center",font:font2,value:Lp.getValue("WiFi_Switch")},
		{uiType:UILabel,w:width_tips,h:50,ol:0,ot:82,dt:10,HAlign:"center",font:font1,value:Lp.getValue("Change_Tips")},
		{uiType:UIImg,w:36,h:22,ol:width_tips*0.15,ot:height_tips-26,src:"setting/ico_ok"},
		{uiType:UILabel,w:50,h:30,ol:width_tips*0.15+40,ot:height_tips-26+3,value:Lp.getValue("Ok"),font:font1},
		{uiType:UIImg,w:60,h:22,ol:width_tips*0.15+40+50+50,ot:height_tips-26,src:"setting/ico_back"},
		{uiType:UILabel,w:80,h:30,ol:width_tips*0.15+40+50+50+62,ot:height_tips-26+3,value:Lp.getValue("Cancel"),font:font1}
	]
	
	
	var left_start1 = 10;
	this.navNormalParam = [
		{uiType:UIFrame,id:"dialog_bk",w:width_frame,h:60,ol:0,ot:height_frame+18,styleClass:"None",visibility:1},
		{uiType:UIImg,id:"nav1",w:34,h:26,ol:left_start1,ot:0,src:"setting/ico_rightArrow"},
		{uiType:UILabel,id:"nav1_text",w:200,h:40,ol:left_start1 = left_start1+34+6,ot:-3,value:Lp.getValue("Move_Focus_Right"),font:font1},
		{uiType:UIImg,id:"nav2",w:47,h:26,ol:left_start1=left_start1+200+10 ,ot:0,src:"setting/ico_back"},
		{uiType:UILabel,id:"nav1_text",w:80,h:40,ol:left_start1 = left_start1+47+6,ot:-3,value:Lp.getValue("Up_Page"),font:font1},
	];
	
	left_start1 = 10;
	this.navFocusParam = [
		{uiType:UIFrame,id:"dialog_bk",w:width_frame,h:60,ol:0,ot:height_frame+18,styleClass:"None",visibility:0},
		{uiType:UIImg,id:"nav1",w:34,h:26,ol:left_start1,ot:0,src:"setting/ico_rightArrow"},
		{uiType:UILabel,id:"nav1_text",w:200,h:40,ol:left_start1 = left_start1+34+6,ot:-3,value:Lp.getValue("Move_Focus_Left"),font:font1},
		{uiType:UIImg,id:"nav2",w:34,h:26,ol:left_start1=left_start1+200+10 ,ot:0,src:"setting/ico_four_direction_dark"},
		{uiType:UILabel,id:"nav2_text",w:80,h:40,ol:left_start1 = left_start1+34+6,ot:-3,value:Lp.getValue("Save"),font:font1},
		{uiType:UIImg,id:"nav3",w:23,h:20,ol:left_start1=left_start1+80+10 ,ot:0,src:"setting/ico_blue"},
		{uiType:UILabel,id:"nav3_text",w:150,h:40,ol:left_start1 = left_start1+23+6,ot:-3,value:Lp.getValue("Display_Password"),font:font1},
	];
	
	this.initDlg = function(parent){
		mainDlg = UI.createGroup(mainParam,"mainDlg",parent,null,null,self.main_proc);
		openDlg = UI.createGroup(openParam,"openDlg",mainDlg,null,null,self.open_proc);
		closeDlg = UI.createGroup(closeParam,"closeDlg",mainDlg,null,null,self.close_proc);
		noCMDlg = UI.createGroup(noCMParam,"noCMDlg",mainDlg);
		
		openSelectDlg = openDlg.getChild("wifi_switch_button");
		closeSelectDlg = closeDlg.getChild("wifi_switch_button");
		openSelectDlg.defProc = open_select_proc;
		closeSelectDlg.defProc = close_select_proc;
		
		tipsDlg = UI.createGroup(tipsParam,"openDlg",mainDlg,null,null,tips_proc);
		
		navNorDlg = UI.createGroup(self.navNormalParam,"navNorDlg",mainDlg);
		navFocusDlg = UI.createGroup(self.navFocusParam,"navFocusDlg",mainDlg);
		
		bkNor = mainDlg.getChild("bk_grey");
		bkFoc = mainDlg.getChild("bk_blue");
		updateView();
	}
	
	function updateView(){
		openDlg.getChild("wifi_name_con").value = sysCom.config.cm_wifi_name;
		openDlg.getChild("encrypt_mode_edit").vIndex = sysCom.config.cm_wifi_mode;
		openDlg.getChild("wifi_password_edit").value = sysCom.config.cm_wifi_password;
		openDlg.getChild("confirm_password_edit").value = sysCom.config.cm_wifi_password;
		
		closeDlg.getChild("wifi_name_con").value = sysCom.config.cm_wifi_name;
		closeDlg.getChild("encrypt_mode_edit").vIndex = sysCom.config.cm_wifi_mode;
		closeDlg.getChild("wifi_password_edit").value = sysCom.config.cm_wifi_password;
		closeDlg.getChild("confirm_password_edit").value = sysCom.config.cm_wifi_password;
	}
	
	this.hide = function(){
		mainDlg.visibility = 0;
	};
	
	this.show = function(){

		var is_cm_available = cmRightControl.getWirelessCardModule();
		var is_cm_open = sysCom.config.wifiStatus;
		
		if(!is_cm_available){
			openDlg.visibility = 0;
			closeDlg.visibility = 0;
			noCMDlg.visibility = 1;
		}
		else{
			if(is_cm_open == 0){
				openDlg.visibility = 0;
				closeDlg.visibility = 1;
				noCMDlg.visibility = 0;
				navFocusDlg.getChild("nav2").setSrc("setting/ico_four_direction_dark"); 
		navFocusDlg.getChild("nav2_text").value = Lp.getValue("Select");
			}
			else{
				openDlg.visibility = 1;
				closeDlg.visibility = 0;
				noCMDlg.visibility = 0;
				navFocusDlg.getChild("nav2").setSrc("setting/ico_ok");
				navFocusDlg.getChild("nav2_text").value = Lp.getValue("Save");
			}
		}
		
		mainDlg.visibility = 1;
	};
	
	this.setFocus = function(){
		if(cmRightControl.getWirelessCardModule()==false)return false;
		else {
			if(sysCom.config.cmStatus){
				openDlg.getChild("wifi_switch_button").setFocus(true);
			}
			else{
				closeDlg.getChild("wifi_switch_button").setFocus(true);
			}
			bkNor.visibility = 0;
			bkFoc.visibility = 1;
			navNorDlg.visibility = 0;
			navFocusDlg.visibility = 1;
			return true;
		}
	};
	
	this.loseFocus = function(){
		bkNor.visibility = 1;
		bkFoc.visibility = 0;
		navFocusDlg.visibility = 0;
		navNorDlg.visibility = 1;
	
	};

	function toOpen(){
		openSelectDlg.setFocus(true);
		openDlg.visibility = 1;
		closeDlg.visibility = 0;
		tipsDlg.visibility = 0;
		navFocusDlg.getChild("nav2").setSrc("setting/ico_ok");
		navFocusDlg.getChild("nav2_text").value = Lp.getValue("Save");
		tipsDlg.update();
		sysCom.config.cmStatus = 1;
	}

	function toClose(){
		closeSelectDlg.setFocus(true);
		closeDlg.visibility = 1;
		openDlg.visibility = 0;
		tipsDlg.visibility = 0;
		navFocusDlg.getChild("nav2").setSrc("setting/ico_four_direction_dark"); 
		navFocusDlg.getChild("nav2_text").value = Lp.getValue("Select");
		tipsDlg.update();
		sysCom.config.cmStatus = 0;
	}
	
	function showTips(){
		tipsDlg.setFocus(true);
		tipsDlg.visibility = 1;
	}
	
	function toSave(){
		var text1 = openDlg.getChild("wifi_password_edit").value;
		var text2 = openDlg.getChild("confirm_password_edit").value;
		
		if(text1=="" || text2==""){
			
			console.log("password is empty");
			return;
		}
		
		if(text1!=text2){
			console.log("two password is not the same");
			return;
		}
		
		sysCom.config.cm_wifi_password =text1; 
	}
	
	this.main_proc = function(e){
		switch(e.keyCode){
			case UI.KEY.BACKSPACE:
				cmRightControl.subLoseFocus();
			break;
			
		}
		return true;
	};
	
	this.open_proc = function(e){
		var keyCode = e.keyCode;
		console.log("ip_information keyCode == "+keyCode);
		switch(keyCode){
			case UI.KEY.ENTER:
				toSave();
			break;
		}	
	};
	
	this.close_proc = function(e){
		var keyCode = e.keyCode;
		console.log("ip_information keyCode == "+keyCode);
		switch(keyCode){
			
		
		}	
	};
	
	
	
	function open_select_proc(e){
		var ret = false;
		console.log("ljfafgadfyg");
        if(typeof(this.value) == "object" && this.value.length > 0){
            if(e.keyCode == UI.KEY.LEFT || e.keyCode == UI.KEY.RIGHT){
                showTips();
               
                ret = true;
                this.update();
                this.onkey({keyCode:UI.KEY.WM_VALUE_CHANGE,id:this.id,hwin:this});
            }
        }

        return ret;
	};
	
	function close_select_proc(e){
		var ret = false;
        if(typeof(this.value) == "object" && this.value.length > 0){
            if(e.keyCode == UI.KEY.LEFT || e.keyCode == UI.KEY.RIGHT){
                
                showTips();
                ret = true;
                this.update();
                this.onkey({keyCode:UI.KEY.WM_VALUE_CHANGE,id:this.id,hwin:this});
            }
        }

        return ret;
	}
	
	function tips_proc(e){
		switch(e.keyCode){
			case UI.KEY.ENTER:
				if(sysCom.config.cmStatus == 0){
					toOpen();
				}
				else{
					toClose();
				}
			break;
			case UI.KEY.BACKSPACE:
				if(sysCom.config.cmStatus == 0){
					closeSelectDlg.setFocus(true);
				}
				else{
					openSelectDlg.setFocus(true);
				}
				tipsDlg.visibility = 0;
				tipsDlg.update();
			break;
		}
		return true;
	}
}