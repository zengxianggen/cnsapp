// JavaScript Document
var showCMMAC = new ShowCMMAC();
function ShowCMMAC(){
	
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

	
	var uiParam=[
		{uiType:UIFrame,id:"bk",w:width_frame,h:height_frame,l:(1280 - width_frame)/2,t:top_frame,styleClass:"system_setting_bk",focusMoveMode:"circle",visibility:0},
		{uiType:UILabel,w:width_frame,h:50,ol:0,ot:2,dt:10,HAlign:"center",font:font2,value:Lp.getValue("system_setting")+">"+Lp.getValue("Read_Return_CM_MAC")},
		
		{uiType:UILabel,w:width_title,h:height_title,ol:left_title,ot:top_item,value:Lp.getValue("MAC_Address")+":",HAlign:"right",font:font1},
		{uiType:UILabel,id:"mac_address",w:width_con,h:height_label,ol:left_con,ot:top_item,value:"89:09:89:78",HAlign:"left",font:font1},
		
		{uiType:UIImg,w:60,h:22,ol:130,ot:height_frame-40,src:"setting/ico_back"},
		{uiType:UILabel,w:80,h:30,ol:130+56,ot:height_frame-40+3,value:Lp.getValue("Cancel"),font:font1},
		{uiType:UIImg,w:60,h:22,ol:280,ot:height_frame-40+1,src:"setting/ico_ok"},
		{uiType:UILabel,w:80,h:30,ol:270+56,ot:height_frame-40+3,value:Lp.getValue("Pass_Back"),font:font1}
	];
	
	this.create = function(parentDlg){
		mainDlg = UI.createGroup(uiParam,"mainDlg",parentDlg,null,null,proc);
	};
	
	this.show = function(mac){
		mainDlg.getChild("mac_address").value = mac;
		mainDlg.visibility = 1;
		mainDlg.setFocus(true);
		mainDlg.update();
	};
	this.hide = function(){
		mainDlg.visibility = 0;
	};
	
	function getCMSN(){
		//return "201707240001";
        var cminfo = CableModem.cmGetIpInfo(false);
        console.log("cminfo="+cminfo)
        if(cminfo) {
            console.log("cminfo.hfcMac="+cminfo.hfcMac);
            var mac = cminfo.hfcMac.replace(/ /g, "");
            return mac;
        }
        return "";
	}
	
	function requestCB(xmlResult){
		if(!xmlResult){
			reportTipsDialog.show(Lp.getValue("Read_Return_DTV_Result"),Lp.getValue("Pass_Back_Failed"),function(){
				mainDlg.setFocus(true);
			});
			return ;
		}
		var info = WorkReport.getReturnCmMacResultInfo(xmlResult);
		if(info.RetCode!=0){
			var text = "[RetCode]:"+info.RetCode+"--"+info.RetMsg;
			reportTipsDialog.show(Lp.getValue("Read_Return_DTV_Result"),text,function(){
				mainDlg.setFocus(true);
			});
			return;
		}
		
		var text = "[RetCode]:"+info.RetCode+"--"+info.RetMsg;
		reportTipsDialog.show(Lp.getValue("Read_Return_DTV_Result"),text,function(){
			self.hide();
			submitWorkOrder.show();
		});
	}
	
	function timeoutCB(){
		reportTipsDialog.show(Lp.getValue("Read_Return_DTV_Result"),Lp.getValue("Request_Timeout"),function(){
			mainDlg.setFocus(true);
		});
	}
	
	function keyEnter(){
		var cmsn = getCMSN();
		var xmlRequest = WorkReport.makeReturnCmMacParam(orderStorage.CrmId, orderStorage.CrmWorkOrder, cmsn);
		WorkReturn.sendOrder(xmlRequest, requestCB ,timeoutCB,orderStorage.server);
	}
	
	function proc(e){
		if(WorkReport.isSerach == true)return true;
		switch(e.keyCode)
        {
            case UI.KEY.ENTER:
				keyEnter();
			break;
			case UI.KEY.BACKSPACE:
				self.hide();
				showWorkOrder.show();
			break;
        }
		return true;
	};
	
	
}