// JavaScript Document
var wiredDevice = new WiredDevice();
function WiredDevice(){
	
	var self = this;
	
	var font1 = uiCom.font.P18;
	
	var mainDlg;
	var tipsDlg;
	
	var listDlg;
	
	var listItems;
	
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
	
	
	this.dlgParam = [
		{uiType:UIFrame,id:"right_bk",w:width_frame,h:height_frame,l:left_frame,t:top_frame,styleClass:"None",focusMoveMode:"circle"},
		
		{uiType:UIFrame,id:"right_bk_grey",w:width_frame,h:height_frame,l:left_frame,t:top_frame,type:"3imgv",cls:"setting/systemSetRightGrey",},
		{uiType:UIFrame,id:"right_bk_blue",w:width_frame,h:height_frame,l:left_frame,t:top_frame,type:"3imgv",cls:"setting/systemSetRightBlue",visibility:0},
		/*
{uiType:UITable,id:"device_list",w:width_frame*0.88,h:height_frame*0.8,ol:12,ot:top_item_ot,lineRectWidth:0,lineHWidth:0,lineVWidth:0,lineColor:"#505050", cols:3,rows:12,rowsOnePage:12,focusEnlargeV:-10,font:font1,headUse:true,
		skin:{
				headBar:{type:"None"},
				normalBar:{type:"None"},
				selectBar:{type:"3imgh",cls:"setting/greybar"},
				focusBar:{type:"3imgh",cls:"setting/bluebar"},
			}
		},
		*/
		{uiType:UITable,id:"device_list",w:width_frame,h:height_frame*0.8,ol:12,ot:top_item_ot,lineRectWidth:0,lineHWidth:0,lineVWidth:0,lineColor:"#505050", cols:3,rows:12,rowsOnePage:10,focusEnlargeV:-10,font:font1,headUse:true,
		skin:{
				headBar:{type:"none"},
				normalBar:{type:"none"},
				selectBar:{type:"3imgh",cls:"setting/greybar"},
				focusBar:{type:"3imgh",cls:"setting/bluebar"},
			}
		},

	];
	
	
	this.tipsParam = [
		{uiType:UIFrame,w:width_frame*0.85,h:height_frame*0.35,ol:60,ot:top_con_ot+100,styleClass:"dialog_tips",visibility:0},
		{uiType:UILabel,id:"tips_title",w:width_frame*0.85,h:height_item,ol:0,ot:0,dt:-10,HAlign:"center",value:Lp.getValue("Tips")+":",font:font1},
		{uiType:UILabel,id:"tips_con",w:width_frame*0.85,h:height_item,ol:0,ot:35,HAlign:"center",value:Lp.getValue("No_CM_Tips")+":",font:font1},
	]
	
	function initData(){
	
		listItems = new Array();
		listItems[0] = new Array();
		listItems[0][0] = "hh";
		listItems[0][1] = "192.168.130.1";
		listItems[0][2] = "8f.9e.3d.7a";
	}
	
	this.initDlg = function(parent){
		
		
		
		
		
		mainDlg = UI.createGroup(self.dlgParam,"deviceDlg",parent);
		listDlg = mainDlg.getChild("device_list");
		tipsDlg = UI.createGroup(self.tipsParam,"tipsDlg",mainDlg);
		
		listDlg.setColWidthArr([listDlg.w*0.4, listDlg.w*0.3,listDlg.w*0.3]);
        listDlg.setHeadCols([Lp.getValue("Device")+Lp.getValue("Name"), "IP "+Lp.getValue("Address"),"MAC "+Lp.getValue("Address")]);
		
	}
	
	this.hide = function(){
		mainDlg.visibility = 0;
	}
	
	this.show = function(){
		mainDlg.visibility = 1;
		var is_cm_available = cmRightControl.getWirelessCardModule();
		if(is_cm_available){
			initData();
		}
		if(listItems)listDlg.addItems(listItems);
		else tipsDlg.show();
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
			is_cm_available:1
		}
	
		return defaultInfo;
	}
	
	
	this.proc = function(e){
		var keyCode = e.keyCode;
		console.log("ip_information keyCode == "+keyCode);
		switch(keyCode){

		}	
	}
}