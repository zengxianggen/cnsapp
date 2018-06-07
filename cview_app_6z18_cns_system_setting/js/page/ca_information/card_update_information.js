// JavaScript Document
var cardUpdateInformation = new CardUpdateInformation();
function CardUpdateInformation(){
	
	var self = this;
	
	var font1 = uiCom.font.F20;
	
	var mainDlg;
	var navNorDlg;
	
	var width_frame = caRightControl.width;
	var height_frame = caRightControl.height;
	var left_frame = caRightControl.left;
	var top_frame = caRightControl.top;
	
	var width_title = width_frame*0.4;
	var height_label = 30;
	var width_con = width_frame*0.5;
	var left_title = 10;
	var left_con = left_title + width_title + 5;
	var top_label = 100;
	
	var height_item = 50;
	
	this.dlgParam = [
		{uiType:UIFrame,id:"bk",w:width_frame,h:height_frame,l:left_frame,t:top_frame,type:"3imgv",cls:"setting/systemSetRightGrey",visibility:0},
		
		{uiType:UILabel,w:width_title,h:height_label,ol:left_title,ot:top_label,value:Lp.getValue("Update_Time")+":",font:font1,HAlign:"right"},
		{uiType:UILabel,id:"update_time",w:width_con,h:height_label,ol:left_con,ot:top_label,value:"",font:font1,HAlign:"left"},
		
		{uiType:UILabel,w:width_title,h:height_label,ol:left_title,ot:top_label+height_item,value:"CA "+Lp.getValue("Update_Status")+":",font:font1,HAlign:"right"},
		{uiType:UILabel,id:"update_status",w:width_con,h:height_label,ol:left_con,ot:top_label+height_item,value:"",font:font1,HAlign:"left"},

	];
	
	var left_start1 = 10;
	this.navNormalParam = [
		{uiType:UIFrame,id:"dialog_bk",w:width_frame,h:60,ol:0,ot:height_frame+18,styleClass:"None",visibility:0},
		{uiType:UIImg,id:"nav1",w:34,h:26,ol:left_start1,ot:0,src:"setting/ico_rightArrow"},
		{uiType:UILabel,id:"nav1_text",w:200,h:40,ol:left_start1+34+6,ot:-3,value:Lp.getValue("Move_Focus_Right"),font:font1},
		{uiType:UIImg,id:"nav1",w:47,h:26,ol:left_start1 + 260,ot:0,src:"setting/ico_back"},
		{uiType:UILabel,id:"nav1_text",w:200,h:40,ol:left_start1+260+47+6,ot:-3,value:Lp.getValue("UP_Page"),font:font1}
	];
	
	
	
	
	this.initDlg = function(parent){
		
		mainDlg = UI.createGroup(self.dlgParam,"mainDlg",parent,null,null,self.proc);
		authorizationInformation.initDlg(parent);
		navNorDlg = UI.createGroup(self.navNormalParam,"navNorDlg",mainDlg);
		
	}
	
	this.hide = function(){
		mainDlg.visibility = 0;
	}
	
	this.show = function(){
		updateView();
		mainDlg.visibility = 1;
		
	}
	
	function updateView(){
		var info = getInfo();
		mainDlg.getChild("update_time").value = info.update_time;
		mainDlg.getChild("update_status").value = info.update_status;
	}
	
	this.setFocus = function(){
		return false;
	}
	
	this.loseFocus = function(){
	

	}
	
	
	
	function getInfo(){
        var defaultInfo = {
            update_time:"",
            update_status:""
        }

		var data = CA.getSMCUpgrade(false);
		if(data&&data.errorcode==0){
			defaultInfo.update_time = data.upgradetime;
			defaultInfo.update_status = data.upgradestate;
		}
		return defaultInfo;
	}
	
	
	
	this.proc = function(e){
		var keyCode = e.keyCode;
		console.log("ip_information keyCode == "+keyCode);
		var ret =false;
		switch(keyCode){

		}	
		
		return ret;
	}
}