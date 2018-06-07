// JavaScript Document
var ipInformation = new IPInformation();
function IPInformation(){
	
	var self = this;
	
	var font1 = uiCom.font.P20;
	
	var mainDlg;
	var tipsDlg;
	
	var bkNor;
	var bkFoc;
	
	var navFocusDlg;
	var navChangeDlg;
	
	var width_frame = cmRightControl.width;
	var height_frame = cmRightControl.height;
	var left_frame = cmRightControl.left;
	var top_frame = cmRightControl.top;
	
	var width_title = width_frame*0.40;
	var width_con = width_frame*0.55;
	var left_con = width_title + 10;
	var height_item = 50;
	var top_item_ot = 8;
	var item_dt = 6;

	this.dlgParam = [
		{uiType:UIFrame,id:"bk",w:width_frame,h:height_frame,l:left_frame,t:top_frame,styleClass:"None",focusMoveMode:"circle"},
		{uiType:UIFrame,id:"bk_grey",w:width_frame,h:height_frame,l:left_frame,t:top_frame,type:"3imgv",cls:"setting/systemSetRightGrey",},
		{uiType:UIFrame,id:"bk_blue",w:width_frame,h:height_frame,l:left_frame,t:top_frame,type:"3imgv",cls:"setting/systemSetRightBlue",visibility:0},
		
		{uiType:UILabel,id:"wan_ip_title",w:width_title,h:height_item,ol:2,ot:top_item_ot,dt:item_dt,HAlign:"right",value:"WAN IP:",font:font1},
		{uiType:UILabel,id:"subnet_mask_title",w:width_title,h:height_item,ol:2,ot:top_item_ot+height_item,dt:item_dt,HAlign:"right",value:Lp.getValue("Subnet_Mask")+":",font:font1},
		{uiType:UILabel,id:"default_gateway_title",w:width_title,h:height_item,ol:2,ot:top_item_ot+height_item*2,dt:item_dt,HAlign:"right",value:Lp.getValue("Default_Gateway")+":",font:font1},
		{uiType:UILabel,id:"main_dns_title",w:width_title,h:height_item,ol:2,ot:top_item_ot+height_item*3,dt:item_dt,HAlign:"right",value:Lp.getValue("Main_DNS")+":",font:font1},
		{uiType:UILabel,id:"second_dns_title",w:width_title,h:height_item,ol:2,ot:top_item_ot+height_item*4,dt:item_dt,HAlign:"right",value:Lp.getValue("Second_DNS")+":",font:font1},
		
		{uiType:UILabel,id:"wan_ip_con",w:width_con,h:height_item,ol:left_con,ot:top_item_ot+height_item*0,dt:item_dt,HAlign:"left",value:0,font:font1},
		{uiType:UILabel,id:"subnet_mask_con",w:width_con,h:height_item,ol:left_con,ot:top_item_ot+height_item*1,dt:item_dt,HAlign:"left",value:0,font:font1},
		{uiType:UILabel,id:"default_gateway_con",w:width_con,h:height_item,ol:left_con,ot:top_item_ot+height_item*2,dt:item_dt,HAlign:"left",value:0,font:font1},
		{uiType:UILabel,id:"main_dns_con",w:width_con,h:height_item,ol:left_con,ot:top_item_ot+height_item*3,dt:item_dt,HAlign:"left",value:0,font:font1},
		{uiType:UILabel,id:"second_dns_con",w:width_con,h:height_item,ol:left_con,ot:top_item_ot+height_item*4,dt:item_dt,HAlign:"left",value:0,font:font1},
		

	];
	
	var left_start1 = 10;
	this.navNormalParam = [
		{uiType:UIFrame,id:"dialog_bk",w:width_frame,h:60,ol:0,ot:height_frame+18,styleClass:"None"},
		{uiType:UIImg,id:"nav1",w:34,h:26,ol:left_start1,ot:0,src:"setting/ico_rightArrow"},
		{uiType:UILabel,id:"nav1_text",w:200,h:40,ol:left_start1+34+6,ot:-3,value:Lp.getValue("Move_Focus_Right"),font:font1},
		{uiType:UIImg,id:"nav1",w:47,h:26,ol:left_start1 + 260,ot:0,src:"setting/ico_back"},
		{uiType:UILabel,id:"nav1_text",w:200,h:40,ol:left_start1+260+47+6,ot:-3,value:Lp.getValue("UP_Page"),font:font1}
	];
	
	this.navFocusParam = [
		{uiType:UIFrame,id:"dialog_bk",w:width_frame,h:60,ol:0,ot:height_frame+18,styleClass:"None",visibility:0},
		{uiType:UIImg,w:34,h:26,ol:left_start1,ot:0,src:"setting/ico_back"},
		{uiType:UILabel,id:"nav1_text",w:200,h:40,ol:left_start1+54+6,ot:-3,value:Lp.getValue("Move_Focus_Left"),font:font1},
	];
	
	
	this.tipsParam = [
		{uiType:UIFrame,w:width_frame*0.85,h:height_frame*0.35,ol:60,ot:top_item_ot+100,styleClass:"dialog_tips",visibility:0},
		{uiType:UILabel,id:"tips_title",w:width_frame*0.85,h:height_item,ol:0,ot:0,dt:-10,HAlign:"center",value:Lp.getValue("Tips")+":",font:font1},
		{uiType:UILabel,id:"tips_con",w:width_frame*0.85,h:height_item,ol:0,ot:35,HAlign:"center",value:Lp.getValue("No_CM_Tips")+":",font:font1},
	]
	
	this.initDlg = function(parent){
		mainDlg = UI.createGroup(self.dlgParam,"ipInfoDlg",parent,null,null,self.proc);
		navNorDlg = UI.createGroup(self.navNormalParam,"navNorDlg",mainDlg);
		navFocusDlg = UI.createGroup(self.navFocusParam,"navFocusDlg",mainDlg);
		
		bkNor = mainDlg.getChild("bk_grey");
		bkFoc = mainDlg.getChild("bk_blue");
	}
	
	function showInfo(){
		var info = self.getInfo();
		mainDlg.getChild("wan_ip_con").value = info.wan_ip;
		mainDlg.getChild("subnet_mask_con").value = info.subnet_mask;
		mainDlg.getChild("default_gateway_con").value = info.default_gateway;
		mainDlg.getChild("main_dns_con").value = info.main_dns;
		mainDlg.getChild("second_dns_con").value = info.second_dns;
		mainDlg.update();
	}
	
	this.hide = function(){
		mainDlg.visibility = 0;
	}
	
	this.show = function(){
		mainDlg.visibility = 1;
		showInfo();
	}
	
	this.setFocus = function(){
		mainDlg.setFocus(true);
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
	
	this.getInfo = function(){
        var info = NetWork.networkGet("eth1",false);

        var defaultInfo = {
            wan_ip:"0.0.0.0",
            subnet_mask:"0.0.0.0",
            default_gateway:"0.0.0.0",
            main_dns:"0.0.0.0",
            second_dns:"0.0.0.0"
        };

		if(info){
            defaultInfo.wan_ip = info.ip;
            defaultInfo.subnet_mask = info.mask;
            defaultInfo.default_gateway = info.gateway;
            defaultInfo.main_dns = info.dns[0];
            defaultInfo.second_dns = info.dns[1];
		}

		return defaultInfo;
	};
	
	this.proc = function(e){
		var keyCode = e.keyCode;
		console.log("ip_information keyCode == "+keyCode);
		switch(keyCode){
			case UI.KEY.BACKSPACE:
			cmRightControl.subLoseFocus();
			break;
		
		}	
	}
}