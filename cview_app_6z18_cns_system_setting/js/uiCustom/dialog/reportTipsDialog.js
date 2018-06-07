// JavaScript Document

var reportTipsDialog = new ReportTipsDialog();
function ReportTipsDialog(){
	
	var fontTitle = uiCom.font.F22;
	var fontContent = uiCom.font.F20;
	var fontNav = uiCom.font.F18;
	
	var width_dialog = 500;
	var width_con = width_dialog*0.9;
	var height_dialog = 200;
	var left_tips = (UI.width-width_dialog)/2;
	var top_tips = 260;
	
	var left_nav = 240;
	
	var callback;

	var mainDlg;
	var uiParam = [
		{uiType:UIFrame,w:width_dialog,h:height_dialog,ol:left_tips,ot:top_tips,type:"9img",cls:"dialog/frameBlueBg",visibility:0},
		{uiType:UILabel,id:"tips_title",w:width_dialog,h:40,ol:0,ot:12,HAlign:"center",value:Lp.getValue("Work_Order_Result_Tips"),font:fontTitle},
		{uiType:UILabel,id:"tips_con",w:width_dialog,h:40,ol:0,ot:75,HAlign:"center",value:"",font:fontContent},
		
		{uiType:UIImg,w:36,h:22,ol:left_nav,ot:height_dialog-35,src:"setting/ico_ok"},
		{uiType:UILabel,w:50,h:30,ol:left_nav+40,ot:height_dialog-33,value:Lp.getValue("OK"),font:fontNav},
	]
	
	this.create = function(parentDlg){
		mainDlg = UI.createGroup(uiParam,"mainDlg",parentDlg,null,null,proc);
	}
	
	this.show = function(title,content,cb){
		mainDlg.getChild("tips_title").value = title;
		mainDlg.getChild("tips_con").value = content;
		mainDlg.visibility = 1;
		mainDlg.setFocus(true);
		callback = cb;
		mainDlg.update();
	}
	
	
	this.hide = function(){
		mainDlg.visibility = 0;
		mainDlg.update();
	}
	
	function proc(e){
		if(WorkReport.isSerach == true)return true;
		var ret = false;
		switch(e.keyCode){
			case UI.KEY.ENTER:
				callback();
				this.hide();
				ret = true;
			break;
		}
		return ret;
	}
}