// JavaScript Document
var parentChildLock = new ParentChildLock();
function ParentChildLock(){
	
	var self = this;
	
	var font1 = uiCom.font.F18;
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
	
	var limitTable;
	var listItems;
	
	var width_frame = lockRightControl.width;
	var height_frame = lockRightControl.height;
	var left_frame = lockRightControl.left;
	var top_frame = lockRightControl.top;
	
	var width_table = width_frame*0.96;
	var height_table = height_frame*0.96;
	var left_table = (width_frame - width_table)/2;
	var top_table= (height_frame - height_table)/2+10;

	var item_dt = 6;
	this.dlgParam = [
		{uiType:UIFrame,id:"bk",w:width_frame,h:height_frame,l:left_frame,t:top_frame,styleClass:"None",focusMoveMode:"circle"},
		{uiType:UIFrame,id:"bk_grey",w:width_frame,h:height_frame,l:left_frame,t:top_frame,type:"3imgv",cls:"setting/systemSetRightGrey",},
		{uiType:UIFrame,id:"bk_blue",w:width_frame,h:height_frame,l:left_frame,t:top_frame,type:"3imgv",cls:"setting/systemSetRightBlue",visibility:0},
		{uiType:UITable,id:"limit_table",w:width_table,h:height_table,ol:left_table,ot:top_table,lineRectWidth:0,lineHWidth:0,lineVWidth:0,lineColor:"#505050", font:font2,cols:2,rows:7,rowsOnePage:7,HAlign:"left",dl:20,dt:-10,color:color1,focusColor:color2,
		skin:{
				normalBar:{type:"none"},
				focusBar:{type:"3imgh",cls:"setting/bluebar"}
			}
		}
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
	];
	
	var left_start1 = 100;
	this.navNormalParam = [
		{uiType:UIFrame,id:"dialog_bk",w:width_frame,h:60,ol:0,ot:height_frame+18,styleClass:"None",visibility:1},
		{uiType:UIImg,id:"nav1",w:34,h:26,ol:left_start1,ot:0,src:"setting/ico_rightArrow"},
		{uiType:UILabel,id:"nav1_text",w:100,h:40,ol:(left_start1=left_start1+34 + 10),ot:-3,value:Lp.getValue("Move_Focus_Right"),font:font1},
		{uiType:UIImg,id:"nav2",w:47,h:26,ol:(left_start1=left_start1+100+10),ot:0,src:"setting/ico_back"},
		{uiType:UILabel,id:"nav2_text",w:200,h:40,ol:(left_start1=left_start1+47+10),ot:-3,value:Lp.getValue("Up_Page"),font:font1}
	];
	
	left_start1 = 100;
	this.navFocusParam = [
		{uiType:UIFrame,id:"dialog_bk",w:width_frame,h:60,ol:0,ot:height_frame+18,styleClass:"None",visibility:0},
		{uiType:UIImg,id:"nav1",w:47,h:20,ol:left_start1,ot:0,src:"setting/ico_back"},
		{uiType:UILabel,id:"nav1_text",w:100,h:40,ol:(left_start1=left_start1+47 + 10),ot:-3,value:Lp.getValue("Move_Focus_Left"),font:font1},
		{uiType:UIImg,id:"nav2",w:34,h:20,ol:(left_start1=left_start1+100+10),ot:0,src:"setting/ico_ok"},
		{uiType:UILabel,id:"nav2_text",w:200,h:40,ol:(left_start1=left_start1+34+10),ot:-3,value:Lp.getValue("Save"),font:font1}
	];
	
	this.initData = function(){
		;
	}
	
	
	this.initDlg = function(parent){
		this.initData();
		mainDlg = UI.createGroup(self.dlgParam,"mainDlg",parent,null,null,self.proc);
		navNorDlg = UI.createGroup(self.navNormalParam,"navNorDlg",mainDlg);
		navFocusDlg = UI.createGroup(self.navFocusParam,"navFocusDlg",mainDlg);

        //update language
        navNorDlg.getChild("nav1_text").value=Lp.getValue("Move_Focus_Right");
        navNorDlg.getChild("nav2_text").value=Lp.getValue("Up_Page");

        navFocusDlg.getChild("nav1_text").value=Lp.getValue("Move_Focus_Left");
        navFocusDlg.getChild("nav2_text").value=Lp.getValue("Save");


        bkNor = mainDlg.getChild("bk_grey");
		bkFoc = mainDlg.getChild("bk_blue");
		tipsDlg = UI.createGroup(tipsParam,"tipsDlg",mainDlg);
		
		limitTable = mainDlg.getChild("limit_table");
		limitTable.setColWidthArr([limitTable.w*0.35, limitTable.w*0.65]);
		updateTable(0);
		
	};
	
	function showTips(){
		tipsDlg.show();
		timer = setTimeout(function(){
			tipsDlg.hide();
		},2000);
	}
	
	function closeTime(){
		if(timer)clearTimeout(timer);
		timer = null;
	}
	
	this.hide = function(){
		mainDlg.visibility = 0;
	};
	
	this.show = function(){
		mainDlg.visibility = 1;
	};
	
	this.setFocus = function(){
		limitTable.curIndex = 0;
		limitTable.setFocus(true);
		bkNor.visibility = 0;
		bkFoc.visibility = 1;
		navNorDlg.visibility = 0;
		navFocusDlg.visibility = 1;
		return true;
	};
	
	this.loseFocus = function(){
		bkNor.visibility = 1;
		bkFoc.visibility = 0;
		navFocusDlg.visibility = 0;
		navNorDlg.visibility = 1;
	};
	
	
	function updateTable(index){
		listItems = new Array();


		listItems[0] = new Array();
		listItems[0][0] = sysCom.config.ParentLockLevel==14?{type:"img",img:"setting/right_green",alignH:"right",alignV:"center"}:"";
		listItems[0][1] = Lp.getValue("Limit");
		listItems[0][2] = 14;

		listItems[1] = new Array();
		listItems[1][0] = sysCom.config.ParentLockLevel==12?{type:"img",img:"setting/right_green",alignH:"right",alignV:"center"}:"";
		listItems[1][1] = Lp.getValue("Counseling_15");
		listItems[1][2] = 12;
		
		listItems[2] = new Array();
		listItems[2][0] = sysCom.config.ParentLockLevel==9?{type:"img",img:"setting/right_green",alignH:"right",alignV:"center"}:"";
		listItems[2][1] = Lp.getValue("Counseling_12");
		listItems[2][2] = 9;

        listItems[3] = new Array();
        listItems[3][0] = sysCom.config.ParentLockLevel==6?{type:"img",img:"setting/right_green",alignH:"right",alignV:"center"}:"";
        listItems[3][1] = Lp.getValue("Protection");
        listItems[3][2] = 6;
		

		limitTable.removeItems();
		limitTable.addItems(listItems);
		limitTable.curIndex = index;
		limitTable.update();
	}
	
	function keyEnter(){
		var index = limitTable.curIndex;
		sysCom.config.ParentLockLevel = listItems[index][2];
		sysCom.saveConfig();
		showTips();
		updateTable(limitTable.curIndex);
	}
		
	this.proc = function(e){
		var keyCode = e.keyCode;
		var ret =false;
		switch(keyCode){
			case UI.KEY.BACKSPACE:
			ret =true;
			lockRightControl.subLoseFocus();
			break;
			case UI.KEY.ENTER:
			ret =true;
			keyEnter();
			break;
		}	
		
		return ret;
	}
}