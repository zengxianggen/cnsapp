// JavaScript Document
var channelLock = new ChannelLock();
function ChannelLock(){
	
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
	
	var channelTable;
	var listItems;
	
	var tipsDlg;
	
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
		{uiType:UIFrame,id:"bk",w:width_frame,h:height_frame,l:left_frame,t:top_frame,styleClass:"None",focusMoveMode:"circle",visibility:0},
		{uiType:UIFrame,id:"bk_grey",w:width_frame,h:height_frame,l:left_frame,t:top_frame,type:"3imgv",cls:"setting/systemSetRightGrey",},
		{uiType:UIFrame,id:"bk_blue",w:width_frame,h:height_frame,l:left_frame,t:top_frame,type:"3imgv",cls:"setting/systemSetRightBlue",visibility:0},
		{uiType:UITable,id:"channel_table",w:width_table,h:height_table,ol:left_table,ot:top_table,lineRectWidth:0,lineHWidth:0,lineVWidth:0,lineColor:"#505050", font:font2,cols:3,rows:6,rowsOnePage:6,HAlign:"left",dl:20,dt:-10,color:color1,focusColor:color2,textAligns:["center","right","left"],
		skin:{
				normalBar:{type:"none"},
				focusBar:{type:"3imgh",cls:"setting/bluebar"},
			}
		},
		
		
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
		{uiType:UILabel,id:"nav1_text",w:80,h:40,ol:(left_start1=left_start1+47 + 6),ot:-3,value:Lp.getValue("Move_Focus_Left"),font:font1},
		{uiType:UIImg,id:"nav2",w:34,h:20,ol:(left_start1=left_start1+80+10),ot:0,src:"setting/ico_ok"},
		{uiType:UILabel,id:"nav2_text",w:80,h:40,ol:(left_start1=left_start1+34+6),ot:-3,value:Lp.getValue("Save"),font:font1},
		{uiType:UIImg,id:"nav3",w:23,h:20,ol:(left_start1=left_start1+80+10),ot:0,src:"setting/ico_yellow"},
		{uiType:UILabel,id:"nav3_text",w:200,h:40,ol:(left_start1=left_start1+23+6),ot:-3,value:Lp.getValue("All_Unlock"),font:font1}
	];
	
	var width_tips = width_frame/2;
	var height_tips = 170;
	var left_tips = (width_frame - width_tips)/2;
	var top_tips = (height_frame-height_tips)/2;
	left_start1 = 20;
	var tipsParam = [
		{uiType:UIFrame,id:"dialog_bk",w:width_tips,h:height_tips,ol:left_tips,ot:top_tips,styleClass:"system_setting_bk",visibility:0},
		{uiType:UILabel,w:width_tips,h:40,ol:0,ot:6,value:Lp.getValue("Channel_Lock"),font:font1,HAlign:"center"},
		{uiType:UILabel,w:width_tips,h:40,ol:0,ot:70,value:Lp.getValue("Unlock_All_Tips"),font:font1,HAlign:"center"},
		
		{uiType:UIImg,id:"nav1",w:34,h:20,ol:left_start1,ot:height_tips-40,src:"setting/ico_ok"},
		{uiType:UILabel,id:"nav1_text",w:80,h:40,ol:(left_start1=left_start1+34 +6),ot:height_tips-40-3,value:Lp.getValue("Ok"),font:font1},
		{uiType:UIImg,id:"nav1",w:47,h:20,ol:(left_start1=left_start1+80),ot:height_tips-40,src:"setting/ico_back"},
		{uiType:UILabel,id:"nav1_text",w:200,h:40,ol:(left_start1=left_start1+47+6),ot:height_tips-40-3,value:Lp.getValue("Cancel"),font:font1}
	];
	
	this.initData = function(){
		
	};
	
	
	this.initDlg = function(parent){
		this.initData();
		mainDlg = UI.createGroup(self.dlgParam,"mainDlg",parent,null,null,self.proc);
		navNorDlg = UI.createGroup(self.navNormalParam,"navNorDlg",mainDlg);
		navFocusDlg = UI.createGroup(self.navFocusParam,"navFocusDlg",mainDlg);
		bkNor = mainDlg.getChild("bk_grey");
		bkFoc = mainDlg.getChild("bk_blue");


        //update language
        navNorDlg.getChild("nav1_text").value=Lp.getValue("Move_Focus_Right");
        navNorDlg.getChild("nav2_text").value=Lp.getValue("Up_Page");

        navFocusDlg.getChild("nav1_text").value=Lp.getValue("Move_Focus_Left");
        navFocusDlg.getChild("nav2_text").value=Lp.getValue("Save");
        navFocusDlg.getChild("nav3_text").value=Lp.getValue("All_Unlock");

		
		tipsDlg = UI.createGroup(tipsParam,"tipsDlg",mainDlg,null,null,self.tips_proc);
		
		channelTable = mainDlg.getChild("channel_table");
		channelTable.defProc = self.table_proc;
		channelTable.setColWidthArr([channelTable.w*0.1, channelTable.w*0.1,channelTable.w*0.8]);
		updateTable(0);
	};
	
	this.hide = function(){
		mainDlg.visibility = 0;
	};
	
	this.show = function(){
		mainDlg.visibility = 1;
	};
	
	this.setFocus = function(){
		channelTable.curIndex = 0;
		channelTable.setFocus(true);
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
		if(!dtvCom.chs.length)
		{
			return;
		}

		for(var i=0;i<dtvCom.chs.length;i++){
			var isLock = dtvCom.checkChannelLock(dtvCom.chs[i]);
			listItems[i] = new Array();
			listItems[i][0] = isLock==true?{type:"img",img:"setting/ico_lock",alignH:"right",alignV:"center"}:"";
			listItems[i][1] = dtvCom.chs[i].idn;
			listItems[i][2] = dtvCom.chs[i].name;
		}
		
		
		channelTable.removeItems();
		channelTable.addItems(listItems);
		channelTable.curIndex = index;
		if(dtvCom.chs[index].lock ==0){
			navFocusDlg.getChild("nav2_text").value=Lp.getValue("Lock");
		}
		else{
			navFocusDlg.getChild("nav2_text").value=Lp.getValue("Unlock");
		}
		channelTable.update();
	}
	 
	
	function keyYellow(){
		tipsDlg.setFocus(true);
		tipsDlg.show();
		
	}
	function keyEnter(){
		var index = channelTable.curIndex;
		if(dtvCom.checkChannelLock(dtvCom.chs[index])){
			dtvCom.setChannelLock(index,false);
		}
		else{
			dtvCom.setChannelLock(index,true);
		}
		updateTable(index);
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
			case UI.KEY.FUNYELLOW:
			keyYellow();
			break;
		}	
		
		return ret;
	};
	
	this.table_proc = function(e){
		var ret = false;

        if(e.keyCode == UI.KEY.UP){
            this.listUp();
            ret = true;
        }else if(e.keyCode == UI.KEY.DOWN){
            this.listDown();
            ret = true;
        }else if(e.keyCode == UI.KEY.PAGEUP){
            this.listPageUp();
            ret = true;
        }else if(e.keyCode == UI.KEY.PAGEDOWN){
            this.listPageDown();
            ret = true;
        }

        if(ret == true){
            var sc = this.sc;
            if(sc) {
                sc.startValue = this.curIndex;
            }
			if(dtvCom.chs[this.curIndex].lock ==0){
				navFocusDlg.getChild("nav2_text").value=Lp.getValue("Lock");
			}
			else{
				navFocusDlg.getChild("nav2_text").value=Lp.getValue("Unlock");
			}
            this.update();
            this.onkey({keyCode: UI.KEY.WM_VALUE_CHANGE, id: this.id, hwin: this});
        }

        return ret;
	};
	
	this.tips_proc=function(e){
		var keyCode = e.keyCode;
		switch(keyCode){
			case UI.KEY.BACKSPACE:
			tipsDlg.visibility = 0;
			channelTable.setFocus(true);
			channelTable.update();
			ret =true;
			break;
			case UI.KEY.ENTER:
			dtvCom.setAllChannelUnlock();
			tipsDlg.visibility = 0;
			channelTable.setFocus(true);
			updateTable(channelTable.curIndex);
			ret =true;
			break;
		}	
		
		return true;
	}
}