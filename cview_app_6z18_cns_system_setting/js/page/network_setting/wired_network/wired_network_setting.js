// JavaScript Document

function WiredNetworkSettingPage(params,srcModule)
{
     var self = this;
    // constructor
    // Constructed end
	var width_screen = 1280;
	var height_screen = 720;
	var width_frame = 500;
	var height_frame = 330;
	
	var width_tips = width_frame*0.8;
	
	var width_table = width_frame - 40;
	
	var font1 = uiCom.font.F20;
	var font2 = uiCom.font.F25;
	var font3 = uiCom.font.F35;
	
	var color1 = "grey";
	var color2 = "white";
	
	var dynamicDlg;
	var staticDlg;
	var dynamicSeletDlg;
	var staticSelectDlg;
	
	var tipsToStaticDlg;
	var tipsToDynamicDlg;
	var tipsSucessDlg;
	
	var valueArr = [
		Lp.getValue("Dynamic_IP_Configuration"),
		Lp.getValue("Static_IP_Configuration")
	
	]

    this.dlgParam =  [
        //{uiType:UIFrame,id:"page_bk",l:0,t:0,w:1280,h:720,type:"hole"},
		 {uiType:UIFrame,id:"page_bk",l:0,t:0,w:1280,h:720,type:"img",imgNames:["setting/default_background"]},
    ];
	
	
	var width_title = width_frame * 0.3;
	var width_con = width_frame*0.55;
	var height_item = 40;
	var height_con = 30;
	var top_title = 65;
	var top_con = top_title+10;
	var left_title = (width_frame-width_title-width_con)/2;
	var left_con = left_title + width_title + 2;
	var con_dt = 6;
	
	var maxChar = 100;
	this.dynamicParam = [
		{uiType:UIFrame,id:"list_bk",l:(1280 - width_frame)/2,t:160,w:width_frame,h:height_frame,styleClass:"system_setting_bk",focusMoveMode:"circle"},
		{uiType:UILabel,w:width_frame,h:height_item,ol:0,ot:2,dt:10,HAlign:"center",font:font2,value:Lp.getValue("System_Setting")+">"+Lp.getValue("Network_Settings")+">"+Lp.getValue("Wired_Network")},
		
		{uiType:UILabel,w:width_title,h:height_item,ol:left_title,ot:top_title+height_item*0,dt:10,HAlign:"right",font:font1,value:Lp.getValue("IP_Acquisition_Mode")+":",color:color1},
		{uiType:UILabel,w:width_title,h:height_item,ol:left_title,ot:top_title+height_item*1,dt:10,HAlign:"right",font:font1,value:Lp.getValue("Local_IP")+":",color:color1},
		{uiType:UILabel,w:width_title,h:height_item,ol:left_title,ot:top_title+height_item*2,dt:10,HAlign:"right",font:font1,value:Lp.getValue("Subnetwork_Mask")+":",color:color1},
		{uiType:UILabel,w:width_title,h:height_item,ol:left_title,ot:top_title+height_item*3,dt:10,HAlign:"right",font:font1,value:Lp.getValue("Communication_Gateway")+":",color:color1},
		{uiType:UILabel,w:width_title,h:height_item,ol:left_title,ot:top_title+height_item*4,dt:10,HAlign:"right",font:font1,value:Lp.getValue("DNS_Server")+":",color:color1},
		
		{uiType:UIButton,id:"ip_mode_select",w:width_con,h:height_con,ol:left_con,ot:top_con,dt:con_dt,HAlign:"center",vIndex:0,value:valueArr,styleClass:"setting_edit_item",font:font1},
		{uiType:UILabel,id:"local_ip_label",w:width_con,h:height_con,ol:left_con,ot:top_con+height_item*1,dt:con_dt,HAlign:"center",value:405,styleClass:"item_label_bk",color:color1},
		{uiType:UILabel,id:"subnetwork_mask_label",w:width_con,h:height_con,ol:left_con,ot:top_con+height_item*2,dt:con_dt,HAlign:"center",value:405,styleClass:"item_label_bk",color:color1},
		{uiType:UILabel,id:"communication_gateway_label",w:width_con,h:height_con,ol:left_con,ot:top_con+height_item*3,dt:con_dt,HAlign:"center",value:405,styleClass:"item_label_bk",color:color1},
		{uiType:UILabel,id:"dns_server_label",w:width_con,h:height_con,ol:left_con,ot:top_con+height_item*4,dt:con_dt,HAlign:"center",value:405,styleClass:"item_label_bk",color:color1},
		
		
		{uiType:UIImg,id:"nav_icon1",w:36,h:22,ol:100,ot:height_frame-40,src:"setting/ico_four_direction_dark"},
		{uiType:UILabel,id:"nav_label1",w:100,h:30,ol:100+40,ot:height_frame-40+3,value:Lp.getValue("Modify_Settings"),font:font1},
		{uiType:UIImg,id:"nav_icon2",w:60,h:22,ol:100+40+50+50,ot:height_frame-40,src:"setting/ico_back"},
		{uiType:UILabel,id:"nav_label2",w:80,h:30,ol:100+40+50+50+62,ot:height_frame-40+3,value:Lp.getValue("UP_Page"),font:font1}
	];
	
	this.staticParam = [
		{uiType:UIFrame,id:"list_bk",l:(1280 - width_frame)/2,t:160,w:width_frame,h:height_frame,styleClass:"system_setting_bk",focusMoveMode:"circle",visibility:0},
		{uiType:UILabel,w:width_frame,h:height_item,ol:0,ot:2,dt:10,HAlign:"center",font:font2,value:Lp.getValue("System_Setting")+">"+Lp.getValue("Network_Settings")+">"+Lp.getValue("Wired_Network")},
		
		{uiType:UILabel,w:width_title,h:height_item,ol:left_title,ot:top_title+height_item*0,dt:10,HAlign:"right",font:font1,value:Lp.getValue("IP_Acquisition_Mode")+":"},
		{uiType:UILabel,w:width_title,h:height_item,ol:left_title,ot:top_title+height_item*1,dt:10,HAlign:"right",font:font1,value:Lp.getValue("Local_IP")+":"},
		{uiType:UILabel,w:width_title,h:height_item,ol:left_title,ot:top_title+height_item*2,dt:10,HAlign:"right",font:font1,value:Lp.getValue("Subnetwork_Mask")+":"},
		{uiType:UILabel,w:width_title,h:height_item,ol:left_title,ot:top_title+height_item*3,dt:10,HAlign:"right",font:font1,value:Lp.getValue("Communication_Gateway")+":"},
		{uiType:UILabel,w:width_title,h:height_item,ol:left_title,ot:top_title+height_item*4,dt:10,HAlign:"right",font:font1,value:Lp.getValue("DNS_Server")+":"},
		
		{uiType:UIButton,id:"ip_mode_select",w:width_con,h:height_con,ol:left_con,ot:top_con,dt:con_dt,HAlign:"center",vIndex:1,value:valueArr,styleClass:"setting_select_item",font:font1},
		{uiType:UIIPEdit,id:"local_ip_edit",w:width_con,h:height_con,ol:left_con,ot:top_con+height_item*1,dt:con_dt,HAlign:"center",value:405,styleClass:"setting_edit_item"},
		{uiType:UIIPEdit,id:"subnetwork_mask_edit",w:width_con,h:height_con,ol:left_con,ot:top_con+height_item*2,dt:con_dt,HAlign:"center",value:405,styleClass:"setting_edit_item"},
		{uiType:UIIPEdit,id:"communication_gateway_edit",w:width_con,h:height_con,ol:left_con,ot:top_con+height_item*3,dt:con_dt,HAlign:"center",value:405,styleClass:"setting_edit_item"},
		{uiType:UIIPEdit,id:"dns_server_edit",w:width_con,h:height_con,ol:left_con,ot:top_con+height_item*4,dt:con_dt,HAlign:"center",value:405,styleClass:"setting_edit_item"},
		
		
		{uiType:UIImg,id:"nav_icon1",w:36,h:22,ol:100,ot:height_frame-40},
		{uiType:UILabel,id:"nav_label1",w:100,h:30,ol:100+40,ot:height_frame-40+3,value:Lp.getValue("Confirm_Settings"),font:font1},
		{uiType:UIImg,id:"nav_icon2",w:60,h:22,ol:100+40+50+50,ot:height_frame-40,src:"setting/ico_back"},
		{uiType:UILabel,id:"nav_label2",w:80,h:30,ol:100+40+50+50+62,ot:height_frame-40+3,value:Lp.getValue("UP_Page"),font:font1}
	]
	
	
	var width_dialog = width_frame*0.85;
	var width_con = width_dialog*0.85;
	var height_dialog = height_frame*0.55;
	var left_tips = (width_screen-width_dialog)/2;
	var top_tips = 250;
	
	var tipsToStatic = [
		{uiType:UIFrame,w:width_dialog,h:height_dialog,ol:left_tips,ot:top_tips,styleClass:"setting_dialog_bk_blue",visibility:0},
		{uiType:UILabel,id:"tips_title",w:width_dialog,h:40,ol:0,ot:12,HAlign:"center",value:Lp.getValue("Network_Setup_Confirmation"),font:font2},
		{uiType:UILabel,id:"tips_con",w:width_con,h:40,ol:(width_dialog-width_con)/2,ot:75,HAlign:"center",value:Lp.getValue("Switch_To_Static_IP_Tips"),font:font1},
		
		{uiType:UIImg,w:36,h:22,ol:100,ot:height_dialog-35,src:"setting/ico_ok"},
		{uiType:UILabel,w:50,h:30,ol:100+40,ot:height_dialog-33,value:Lp.getValue("OK"),font:font1},
		{uiType:UIImg,w:60,h:22,ol:100+40+50+50,ot:height_dialog-35,src:"setting/ico_back"},
		{uiType:UILabel,w:80,h:30,ol:100+40+50+50+52,ot:height_dialog-33,value:Lp.getValue("Cancel"),font:font1}
	]
	
	var tipsToDynamic = [
		{uiType:UIFrame,w:width_dialog,h:height_dialog,ol:left_tips,ot:top_tips,styleClass:"setting_dialog_bk_blue",visibility:0},
		{uiType:UILabel,id:"tips_title",w:width_dialog,h:40,ol:0,ot:12,HAlign:"center",value:Lp.getValue("Network_Setup_Confirmation"),font:font2},
		{uiType:UILabel,id:"tips_con",w:width_con,h:40,ol:(width_dialog-width_con)/2,ot:75,HAlign:"center",value:Lp.getValue("Switch_To_Dynamic_IP_Tips"),font:font1},
		
		{uiType:UIImg,w:36,h:22,ol:100,ot:height_dialog-35,src:"setting/ico_ok"},
		{uiType:UILabel,w:50,h:30,ol:100+40,ot:height_dialog-33,value:Lp.getValue("OK"),font:font1},
		{uiType:UIImg,w:60,h:22,ol:100+40+50+50,ot:height_dialog-35,src:"setting/ico_back"},
		{uiType:UILabel,w:80,h:30,ol:100+40+50+50+52,ot:height_dialog-33,value:Lp.getValue("Cancel"),font:font1}
	]
	
	var tipsSucess =[
		{uiType:UIFrame,w:width_dialog,h:height_dialog,ol:left_tips,ot:top_tips,styleClass:"setting_dialog_bk_blue",visibility:0},
		{uiType:UILabel,id:"tips_title",w:width_dialog,h:40,ol:0,ot:12,HAlign:"center",value:Lp.getValue("Network_Settings"),font:font2},
		{uiType:UILabel,id:"tips_con",w:width_con,h:40,ol:(width_dialog-width_con)/2,ot:75,HAlign:"center",value:Lp.getValue("Setting_Success"),font:font1},
	]
	
	this.initData = function(){
		
	}
	
	this.initView = function(){
		dynamicDlg = UI.createGroup(self.dynamicParam,"dynamicDlg",self.win);
		staticDlg = UI.createGroup(self.staticParam,"staticDlg",self.win);
		
		dynamicSeletDlg = dynamicDlg.getChild("ip_mode_select");
		staticSeletDlg = staticDlg.getChild("ip_mode_select");
		
		dynamicSeletDlg.defProc = dynamic_select_proc;
		staticSeletDlg.defProc = static_select_proc;
		staticSeletDlg.onfocus = static_select_onfocus; 
		staticSeletDlg.onblur = static_select_onblur;
		
		staticDlg.getChild("local_ip_edit").onblur = ip_set_onblur;
		staticDlg.getChild("subnetwork_mask_edit").onblur = mask_set_onblur;
		staticDlg.getChild("communication_gateway_edit").onblur = ip_set_onblur;
		staticDlg.getChild("dns_server_edit").onblur = ip_set_onblur;
		
		tipsToStaticDlg = UI.createGroup(tipsToStatic,"tipsToStaticDlg",self.win,null,null,self.to_static_tips_proc);
		tipsToDynamicDlg = UI.createGroup(tipsToDynamic,"tipsToDynamicDlg",self.win,null,null,self.to_dynamic_tips_proc);
		tipsSucessDlg = UI.createGroup(tipsSucess,"tipsSucessDlg",self.win);
		
		var mode = sysCom.config.ip_get_mode;
		if(mode == 0)dynamicDlgShow();
		else staticDlgShow();
	}
	
	
	function dynamicDlgShow(){
		var mode = sysCom.config.ip_get_mode;
		console.log("dynamicDlgShow mode === "+mode);
		if(mode == 0){
			 var info = getDynamicIPInfo();
			 dynamicDlg.getChild("local_ip_label").value = info.local_ip;
			 dynamicDlg.getChild("subnetwork_mask_label").value = info.subnetwork_mask;
			 dynamicDlg.getChild("communication_gateway_label").value = info.communication_gateway;
			 dynamicDlg.getChild("dns_server_label").value = info.dns_server;
			 
			 dynamicDlg.getChild("nav_icon1").setSrc("");
			 dynamicDlg.getChild("nav_label1").value = Lp.getValue("Modify_Settings");
		}
		else{
			var info = getStaticIPInfo();
			dynamicDlg.getChild("local_ip_label").value = info.local_ip;
			dynamicDlg.getChild("subnetwork_mask_label").value = info.subnetwork_mask;
			dynamicDlg.getChild("communication_gateway_label").value = info.communication_gateway;
			dynamicDlg.getChild("dns_server_label").value = info.dns_server;
			
			dynamicDlg.getChild("nav_icon1").setSrc("setting/ico_ok");
			dynamicDlg.getChild("nav_label1").value = Lp.getValue("Confirm_Settings");
		}
		
		dynamicDlg.visibility = 1;
		staticDlg.visibility = 0;
		dynamicSeletDlg.setFocus(true);
		dynamicDlg.update();
	}
	
	function staticDlgShow(){
		var info = getStaticIPInfo();
			staticDlg.getChild("local_ip_edit").setValue(info.local_ip);
			staticDlg.getChild("subnetwork_mask_edit").setValue(info.subnetwork_mask);
			staticDlg.getChild("communication_gateway_edit").setValue(info.communication_gateway);
			staticDlg.getChild("dns_server_edit").setValue(info.dns_server);
			
			staticDlg.getChild("nav_icon1").setSrc("setting/ico_ok");
			staticDlg.getChild("nav_label1").value = Lp.getValue("Modify_Settings");
			
			dynamicDlg.visibility = 0;
			staticDlg.visibility = 1;
			staticSeletDlg.setFocus(true);
			self.win.update();
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
	
	function showTips(){
	
		tipsSucessDlg.visibility = 1;
		setTimeout(function(){
			tipsSucessDlg.hide();		
		},sysCom.config.displayTime*1000);
	}
	
	function getDynamicIPInfo(){
	
		var info = {
			local_ip:"192.100.0.2",
			subnetwork_mask:"255.255.255.0",
			communication_gateway:"192.100.0.1",
			dns_server:"203.89.0.9"
		}
		
		return info;
	}
	
	function setStaticIPInfo(){
		
		sysCom.config.ip_get_mode = 1;
		
		sysCom.config.static_ip_info.local_ip = staticDlg.getChild("local_ip_edit").getValue();
		sysCom.config.static_ip_info.subnetwork_mask = staticDlg.getChild("subnetwork_mask_edit").getValue();
		sysCom.config.static_ip_info.communication_gateway = staticDlg.getChild("communication_gateway_edit").getValue();
		sysCom.config.static_ip_info.dns_server = staticDlg.getChild("dns_server_edit").getValue();
	}
	
	function getStaticIPInfo(){
		var info = sysCom.config.static_ip_info;
		return info;
	}
	
	function static_select_onfocus(){
		staticDlg.getChild("nav_icon1").setSrc("setting/ico_ok");
		staticDlg.getChild("nav_label1").value = Lp.getValue("Confirm_Settings");
	}
	function static_select_onblur(){
		staticDlg.getChild("nav_icon1").setSrc("");
		staticDlg.getChild("nav_label1").value = Lp.getValue("Modify_Settings");
	}
	
	function ip_set_onblur(){
		
		var ip = this.getValue();
		if(checkIP(ip) == false){
			this.setDefaultValue();
		}
	}
	
	function mask_set_onblur(){
		var mask = this.getValue();
		if(checkMask(mask) == false){
			this.setDefaultValue();
		}
	}
	
	 this.onkey = function(e)
    {
        var ret = false;
        console.log("In ScanChannelPage module keyCode =" +  e.keyCode );
        return ret;
    };

	function static_select_proc(e){
	
		var ret = false;
		switch(e.keyCode)
        {
			case UI.KEY.ENTER:
				tipsToStaticDlg.setFocus(true);
				tipsToStaticDlg.show();
				ret = true;
			break;
			case UI.KEY.LEFT:
			case UI.KEY.RIGHT:
			tipsToDynamicDlg.setFocus(true);
			tipsToDynamicDlg.show();
			ret = true;
			break;
			case UI.KEY.BACKSPACE:
			ret = true;
			self.go(NetworkSettingMenuPage);
			break;
        }
		
        return ret;
	}

	function dynamic_select_proc(e){
	
		var ret =false;
		var mode = sysCom.config.ip_get_mode;
		switch(e.keyCode)
        {
			case UI.KEY.LEFT:
			case UI.KEY.RIGHT:
			
			tipsToStaticDlg.setFocus(true);
			tipsToStaticDlg.show();
			ret = true;
			break;
			case UI.KEY.BACKSPACE:
			ret = true;
			self.go(NetworkSettingMenuPage);
			break;
        }
        return ret;
	}

	this.to_static_tips_proc = function(e){
		var ret = false;
        switch(e.keyCode)
        {
			case UI.KEY.ENTER:
				setStaticIPInfo();
				this.visibility = 0;
				showTips();
				staticDlgShow();
				ret = true;
			break;
			case UI.KEY.BACKSPACE:
				this.visibility = 0;
				dynamicSeletDlg.setFocus(true);
				this.update();
				ret = true;
			break;
        }
        return ret;
	}
	
	this.to_dynamic_tips_proc = function(e){
		var ret = false;
        switch(e.keyCode)
        {
			case UI.KEY.ENTER:
				sysCom.config.ip_get_mode = 0;
				this.visibility = 0;
				showTips();
				dynamicDlgShow();
				ret = true;
			break;
			case UI.KEY.BACKSPACE:
				this.visibility = 0;
				staticSeletDlg.setFocus(true);
				this.update();
				ret = true;
			break;
        }
        return ret;
	}
}
WiredNetworkSettingPage.prototype = UIModule.baseModule;

