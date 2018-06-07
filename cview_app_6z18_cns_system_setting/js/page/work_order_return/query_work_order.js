// JavaScript Document
var queryWorkOrder = new QueryWorkOrder();
function QueryWorkOrder(){
	var self = this;
	
	var font1 = uiCom.font.F20;
	var font2 = uiCom.font.F25;
	var font3 = uiCom.font.F35;
	
	var color1 = "grey";
	var color2 = "white";
	
	var width_frame = 460;
	var height_frame = 230;
	var top_frame = 200;
	
	var width_title = width_frame*0.4;
	var width_con = width_frame*0.5;
	
	var height_item = 50;
	var height_title = 30;
	var height_con = height_title;
	
	var top_title = 90;
	var top_con = top_title-6;
	var left_title = 10;
	var left_con = left_title + width_title + 2;
	
	var mainDlg;
	
	var uiParam=[
		{uiType:UIFrame,id:"bk",w:width_frame,h:height_frame,l:(1280 - width_frame)/2,t:top_frame,styleClass:"system_setting_bk",focusMoveMode:"circle",visibility:0},
		{uiType:UILabel,w:width_frame,h:50,ol:0,ot:2,dt:10,HAlign:"center",font:font2,value:Lp.getValue("system_setting")+">"+Lp.getValue("Work_Order_Query")},
		
		{uiType:UILabel,w:width_title,h:height_title,ol:left_title,ot:top_title,value:Lp.getValue("Company_Alias")+":",HAlign:"right",font:font1},
		{uiType:UIEdit,id:"company_alias",w:width_con,h:height_con,ol:left_con,ot:top_con,value:"",HAlign:"center",font:font1,styleClass:"setting_edit_item",onFocus:true},
		
		{uiType:UILabel,w:width_title,h:height_title,ol:left_title,ot:top_title+height_item,value:Lp.getValue("Work_Order_Simple_Code")+":",HAlign:"right",font:font1},
		{uiType:UIEdit,id:"simple_code",w:width_con,h:height_con,ol:left_con,ot:top_con+height_item,value:"",HAlign:"center",font:font1,styleClass:"setting_edit_item"},
		
		{uiType:UIImg,w:60,h:22,ol:130,ot:height_frame-40,src:"setting/ico_back"},
		{uiType:UILabel,w:80,h:30,ol:130+56,ot:height_frame-40+3,value:Lp.getValue("Cancel"),font:font1},
		{uiType:UIImg,w:60,h:22,ol:280,ot:height_frame-40+1,src:"setting/ico_ok"},
		{uiType:UILabel,w:80,h:30,ol:270+56,ot:height_frame-40+3,value:Lp.getValue("Submit"),font:font1}
	];
	
	
	this.create = function(parentDlg){
		mainDlg = UI.createGroup(uiParam,"mainDlg",parentDlg,null,null,proc);
	};
	
	this.show = function(){
		var so = CA.caGetZipCode(false);
		mainDlg.visibility = 1;
		mainDlg.getChild("company_alias").value = so;
		mainDlg.getChild("company_alias").setFocus(true);
		mainDlg.update();
	};
	this.hide = function(){
		mainDlg.visibility = 0;
	};
	
	function keyEnter(){
		var CrmId = mainDlg.getChild("company_alias").value;
		var CrmWorkshortsno = mainDlg.getChild("simple_code").value;
		for (; 0 === CrmId.indexOf("0");) CrmId = CrmId.substring(1);
		if(CrmId==""||CrmWorkshortsno==""){
			reportTipsDialog.show(Lp.getValue("Tips"),Lp.getValue("CrmId_Or_WorkNo_Is_Empty"),function(){
				mainDlg.getChild("company_alias").setFocus(true);
			});
			return ;
		}
		
		server = WorkReport.makeQueryServerUrl(CrmId);
		
		orderStorage.server = server;
		orderStorage.CrmId = CrmId;
		orderStorage.CrmWorkShortSNo = CrmWorkshortsno;	
		
		loadingDialog.show(Lp.getValue("STB_Work_Order_Inquiry"));	
		
		var xmlRequest = WorkReport.makeQueryParams(CrmId, CrmWorkshortsno);
		WorkReturn.sendOrder(xmlRequest, requestCB ,timeoutCB,server);	
	}
	
	function timeoutCB(){
		loadingDialog.hide();
		reportTipsDialog.show(Lp.getValue("Work_Order_Result_Tips"),Lp.getValue("Request_Timeout"),function(){
				mainDlg.getChild("company_alias").setFocus(true);
		});
	}
	
	function requestCB(xmlResult){
		loadingDialog.hide();

		if(!xmlResult){

			reportTipsDialog.show(Lp.getValue("Work_Order_Result_Tips"),Lp.getValue("Query_Failed"),function(){
				mainDlg.getChild("company_alias").setFocus(true);
			});
			return ;
		}

		var info = WorkReport.getWorkOrderInfo(xmlResult);
		
		if(info.RetCode!=0){
			var text = "[RetCode]:"+info.RetCode+"--"+info.RetMsg;
			reportTipsDialog.show(Lp.getValue("Work_Order_Result_Tips"),text,function(){
				mainDlg.getChild("company_alias").setFocus(true);
			});
			return;
		}

        orderStorage.CrmWorkOrder = info.CrmWorkOrder;
        orderStorage.CrmInstallName = info.CrmInstallName;
        orderStorage.CrmBpName = info.CrmBpName;
        orderStorage.CrmWorker1 = info.CrmWorker1;
        orderStorage.MobilePhone = info.MobilePhone;
		
		self.hide();

		showWorkOrder.show(info);
	}
	
	function proc(e){
		if(WorkReport.isSerach == true)return true;
		var ret = false;
        switch(e.keyCode)
        {
            case UI.KEY.ENTER:
			keyEnter();
			ret = true;
			break;
        }
        return ret;
	};
	
	
}