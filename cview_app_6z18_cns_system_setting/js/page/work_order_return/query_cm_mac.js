// JavaScript Document
var queryCMMAC = new QueryCMMAC();
function QueryCMMAC(){
	
	var self = this;
	
	var font1 = uiCom.font.F20;
	var font2 = uiCom.font.F25;
	var font3 = uiCom.font.F35;
	
	var color1 = "grey";
	var color2 = "white";
	
	var top_frame = 200;
	var width_frame = 460;
	var height_frame = 170;
	var width_title = width_frame*0.4;
	var height_title = 30;
	var width_con = width_frame*0.6;
	var height_label = 30;
	var top_item = 80;
	var left_title = 10;
	var left_con = left_title + width_title + 5;
	var height_item = 40;
	
	
	var mainDlg;

	left_img = (width_frame - 23)/2;
	var uiParam = [
		{uiType:UIFrame,id:"bk",w:width_frame,h:height_frame,l:(1280 - width_frame)/2,t:top_frame,styleClass:"system_setting_bk",focusMoveMode:"circle",visibility:0},
		{uiType:UILabel,w:width_frame,h:50,ol:0,ot:2,dt:10,HAlign:"center",font:font2,value:Lp.getValue("system_setting")+">"+Lp.getValue("Read_Return_CM_MAC")},
		
		{uiType:UILabel,w:width_title,h:height_title,ol:left_title,ot:top_item,value:Lp.getValue("MAC_Address")+":",HAlign:"right",font:font1},
		{uiType:UILabel,id:"company_alias",w:width_con,h:height_label,ol:left_con,ot:top_item,value:Lp.getValue("Reading_Please_Wait"),HAlign:"left",font:font1},
		
		{uiType:UIImg,w:43,h:43,ol:left_img,ot:122,src:"setting/loading",stretch:"HV"},
	]
	
	this.create = function(parentDlg){
		mainDlg = UI.createGroup(uiParam,"mainDlg",parentDlg,null,null,proc);
	};
	
	this.show = function(){
		mainDlg.visibility = 1;
		mainDlg.setFocus(true);
		mainDlg.update();
		request();
	};
	
	function requestCB(xmlResult){
		if(!xmlResult || 0 === xmlResult.length){
			
			reportTipsDialog.show(Lp.getValue("Read_Return_DTV_Result"),Lp.getValue("Query_Failed"),function(){
				self.hide();
				cmQuery.show();
			});
			return ;
		}
		
		var macInfo = WorkReport.parseMac(xmlResult);
		
		if(macInfo == null){
			reportTipsDialog.show(Lp.getValue("Read_Return_DTV_Result"),Lp.getValue("Query_Failed"),function(){
				self.hide();
				cmQuery.show();
			});
			return ;
		}
		
		console.log("macInfo=="+macInfo);
		self.hide();
		showCMMAC.show(macInfo);
	}
	
	function timeoutCB(){
		reportTipsDialog.show(Lp.getValue("Read_Return_DTV_Result"),Lp.getValue("Request_Timeout"),function(){
				mainDlg.setFocus(true);
		});
	}
	
	function request(){
		var preURL = "http://so",
        postURL = ".totalbb.net.tw/scm/GetHfcMacByRemoteAddr.php";
        var server = preURL + orderStorage.CrmId + postURL;
		console.log("server =="+server);
		
		var xmlRequest = null;
		WorkReport.isCMMACRquest = true;
		setTimeout(function(){
			WorkReturn.sendOrder(xmlRequest, requestCB ,timeoutCB,server);
		},50)
		
	}
	
	this.hide = function(){
		mainDlg.visibility = 0;
	};
	
	function proc(e){
		return true;
	};
	
	
}