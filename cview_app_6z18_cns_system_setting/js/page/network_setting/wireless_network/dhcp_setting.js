// JavaScript Document
var dhcpSetting = new DHCPSetting();
function DHCPSetting(){
	
	var self = this;
	
	var font1 = uiCom.font.P20;
	
	var mainDlg;
	var navNorDlg;
	var navFocusDlg;
	var navChangeDlg;
	
	var bkNor;
	var bkFoc;
	
	var rangDlg;
	
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
	
	var valueArr = [
		"192.168.201.1",
		"192.168.202.1",
		"192.168.203.1",
		"192.168.204.1",
		"192.168.205.1",
		"192.168.206.1",
		"192.168.207.1",
		"192.168.208.1",
		"192.168.209.1",
		"192.168.210.1",
		
	]
	
	this.dlgParam = [
		{uiType:UIFrame,id:"bk",w:width_frame,h:height_frame,l:left_frame,t:top_frame,styleClass:"None",focusMoveMode:"circle",visibility:0},
		{uiType:UIFrame,id:"bk_grey",w:width_frame,h:height_frame,l:left_frame,t:top_frame,type:"3imgv",cls:"setting/systemSetRightGrey",},
		{uiType:UIFrame,id:"bk_blue",w:width_frame,h:height_frame,l:left_frame,t:top_frame,type:"3imgv",cls:"setting/systemSetRightBlue",visibility:0},
		{uiType:UILabel,id:"wan_ip_title",w:width_title,h:height_item,ol:2,ot:top_item_ot,dt:item_dt,HAlign:"right",value:Lp.getValue("Subnet_Setting")+":",font:font1},
		
		{uiType:UIButton,id:"ip_range_edit",w:width_con,h:height_item,ol:left_con,ot:top_item_ot,dt:item_dt,HAlign:"center",vIndex:0,value:valueArr,styleClass:"setting_select_item"},

	];
	
	var left_start1 = 10;
	this.navNormalParam = [
		{uiType:UIFrame,id:"dialog_bk",w:width_frame,h:60,ol:0,ot:height_frame+18,styleClass:"None",visibility:1},
		{uiType:UIImg,id:"nav1",w:34,h:26,ol:left_start1,ot:0,src:"setting/ico_rightArrow"},
		{uiType:UILabel,id:"nav1_text",w:200,h:40,ol:left_start1+34+6,ot:-3,value:Lp.getValue("Move_Focus_Right"),font:font1},
		{uiType:UIImg,id:"nav1",w:47,h:26,ol:left_start1 + 260,ot:0,src:"setting/ico_back"},
		{uiType:UILabel,id:"nav1_text",w:200,h:40,ol:left_start1+260+47+6,ot:-3,value:Lp.getValue("UP_Page"),font:font1}
	];
	
	this.navFocusParam = [
		{uiType:UIFrame,id:"dialog_bk",w:width_frame,h:60,ol:0,ot:height_frame+18,styleClass:"None",visibility:0},
		{uiType:UIImg,w:34,h:26,ol:left_start1,ot:0,src:"setting/ico_back"},
		{uiType:UILabel,id:"nav1_text",w:200,h:40,ol:left_start1+54+6,ot:-3,value:Lp.getValue("Move_Focus_Left"),font:font1},
		{uiType:UIImg,w:47,h:26,ol:left_start1 + 260,ot:0,src:"setting/ico_four_direction_dark"},
		{uiType:UILabel,id:"nav2_text",w:200,h:40,ol:left_start1+260+47+6,ot:-3,value:Lp.getValue("Select"),font:font1}
	];
	
	this.navChangeParam = [
		{uiType:UIFrame,id:"dialog_bk",w:width_frame,h:60,ol:0,ot:height_frame+18,styleClass:"None",visibility:0},
		{uiType:UIImg,w:34,h:26,ol:left_start1,ot:0,src:"setting/ico_back"},
		{uiType:UILabel,id:"nav1_text",w:200,h:40,ol:left_start1+54+6,ot:-3,value:Lp.getValue("Move_Focus_Left"),font:font1},
		{uiType:UIImg,w:47,h:26,ol:left_start1 + 260,ot:0,src:"setting/ico_ok"},
		{uiType:UILabel,id:"nav2_text",w:200,h:40,ol:left_start1+260+47+6,ot:-3,value:Lp.getValue("Save"),font:font1}
	];
	
	this.initDlg = function(parent){
		mainDlg = UI.createGroup(self.dlgParam,"mainDlg",parent,null,null,self.proc);
		navNorDlg = UI.createGroup(self.navNormalParam,"navNorDlg",mainDlg);
		navFocusDlg = UI.createGroup(self.navFocusParam,"navFocusDlg",mainDlg);
		navChangeDlg = UI.createGroup(self.navChangeParam,"navChangeDlg",mainDlg);
		
		bkNor = mainDlg.getChild("bk_grey");
		bkFoc = mainDlg.getChild("bk_blue");
		
		rangDlg = mainDlg.getChild("ip_range_edit");
		rangDlg.defProc = self.buttonProc;
		
		var info = self.getInfo();
		var index = 0;
		for(var i=0;i<valueArr.length;i++){
		
			if(info.range == valueArr[i]){
				index = i;
				break;
			}
		}
		
		rangDlg.vIndex = index;
		
	}
	
	this.hide = function(){
		mainDlg.visibility = 0;
	}
	
	this.show = function(){
		mainDlg.visibility = 1;
	}
	
	this.setFocus = function(){
		mainDlg.getChild("ip_range_edit").setFocus(true);
		bkNor.visibility = 0;
		bkFoc.visibility = 1;
		navNorDlg.visibility = 0;
		navFocusDlg.visibility = 1;
		return true;
	}
	
	this.loseFocus = function(){
	
		bkNor.visibility = 1;
		bkFoc.visibility = 0;
		navChangeDlg.visibility = 0;
		navFocusDlg.visibility = 0;
		navNorDlg.visibility = 1;
	}
	
	this.getInfo = function(){
		
		var defaultInfo = {
			range:"192.168.202.1"
		}
	
		return defaultInfo;
	}
	
	
	this.buttonProc = function(e){
        var ret = false;
        if(typeof(this.value) == "object" && this.value.length > 0){
            if(e.keyCode == UI.KEY.LEFT || e.keyCode == UI.KEY.RIGHT){
                var step = (e.keyCode == UI.KEY.LEFT?-1:1);
                this.vIndex = (this.vIndex + step + this.value.length) % this.value.length;
				
				if(self.getInfo().range == rangDlg.getValue()){
					navFocusDlg.visibility = 1;
					navChangeDlg.visibility = 0;
				}
				else{
					navFocusDlg.visibility = 0;
					navChangeDlg.visibility = 1;
				}
				
                ret = true;
                this.update();
                this.onkey({keyCode:UI.KEY.WM_VALUE_CHANGE,id:this.id,hwin:this});
            }
        }

        return ret;
    };
	
	this.proc = function(e){
		var keyCode = e.keyCode;
		console.log("ip_information keyCode == "+keyCode);
		var ret =false;
		switch(keyCode){
			case UI.KEY.BACKSPACE:
				cmRightControl.subLoseFocus();
			break;
		}	
		
		return ret;
	}
}