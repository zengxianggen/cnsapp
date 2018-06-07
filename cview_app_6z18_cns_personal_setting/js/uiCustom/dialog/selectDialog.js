// JavaScript Document

function SelectDialog(){
	var self = this;
	
	var fontTitle = uiCom.font.F22;
	var fontContent = uiCom.font.F20;
	var fontNav = uiCom.font.F18;
	
	
	var width_dialog = 500;
	var height_dialog = 300;
	var left_dialog = (UI.width-width_dialog)/2;
	var top_dialog = 200;
	
	
	var width_label = width_dialog*0.85;
	var height_label = 30;
	
	var left_label = (width_dialog-width_label)/2;
	
	var left_nav = 120;
	
	
	var curtime = 10000;
	var sptime = 1000;
	var timer = null;
	var mainDlg;
	var contentDlg;
	
	var param;
	
	var uiParam = [
		{uiType:UIFrame,w:width_dialog,h:height_dialog,l:left_dialog,t:top_dialog,type:"9img",cls:"dialog/frameBlueBg",visibility:0},
		{uiType:UILabel,id:"title",w:width_label,h:height_label,ol:left_label,ot:20,value:Lp.getValue("Resolution_Setting"),font:fontTitle,HAlign:"center"},
		{uiType:UILabel,id:"content",w:width_label,h:height_label,ol:left_label,ot:70,dt:0,multiLine:5,LS:30,font:fontContent,HAlign:"left"},
		
		{uiType:UIImg,w:47,h:22,ol:left_nav,ot:height_dialog-40+2,src:"setting/ico_back"},
		{uiType:UILabel,w:80,h:30,ol:(left_nav = left_nav + 47 + 10),ot:height_dialog-40+3,value:Lp.getValue("Cancel"),font:fontNav},
		{uiType:UIImg,w:34,h:22,ol:(left_nav = left_nav + 100),ot:height_dialog-40+1,src:"setting/ico_ok"},
		{uiType:UILabel,w:80,h:30,ol:left_nav+34+10,ot:height_dialog-40+3,value:Lp.getValue("Ok"),font:fontNav}
	]
	
	this.create = function(parent){
		mainDlg = UI.createGroup(uiParam,"mainDlg",self.win,null,null,proc);
		contentDlg = mainDlg.getChild("content");
	}
	
	this.show = function(paramVal){
		mainDlg.visibility = 1;
		mainDlg.setFocus(true);
		contentDlg.value = Lp.getValue("Change_Tips_Before")+curtime/1000+Lp.getValue("Change_Tips_After");
		openTimer();
		mainDlg.update();
		param = paramVal;
	}
	
	this.hide = function(){
		mainDlg.visibility = 0;
	}

	function openTimer(){
		clearTimer();
		
		timer = setInterval(function(){
			curtime = curtime - sptime;
			if(curtime <=0){
				clearTimer();
				self.hide();
				param.cancel();
				return;
			}
			console.log("curtime =="+curtime);
			contentDlg.value = Lp.getValue("Change_Tips_Before")+curtime/1000+Lp.getValue("Change_Tips_After");
			contentDlg.update();
		},sptime);
	}
	
	function clearTimer(){
		if(timer){
			clearInterval(timer);
			timer = null;
			curtime = 10000;
		}
	}
	
	function proc(e){
		ret = false;
		switch(e.keyCode){
			case UI.KEY.ENTER:
				self.hide();
				param.ok();
				clearTimer();
				ret = true;
			break;
			case UI.KEY.BACKSPACE:
				clearTimer();
				param.cancel();
				ret = true;
			break;
		}
	}
	return this;
}