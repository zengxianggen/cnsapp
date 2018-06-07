// JavaScript Document

function DTVModuleReturnPage(params,srcModule)
{
    var self = this;

	var font1 = uiCom.font.F20;
	var font2 = uiCom.font.F25;
	var font3 = uiCom.font.F35;
	
	var color1 = "grey";
	var color2 = "white";
	
	var queryDlg;
	var orderInfoDlg;
	var orderInfoTable;
	var submitInfoDlg;
	var submitInfoTable;
	
	var authorizationLoadingDlg;
	var authorizationResultDlg;
	
	var bidirectionalModuleDlg;
	var cmMACReadDlg;
	var cmMacResultDlg;
	var cmMACPassResultDlg;

    this.dlgParam =  [
        //{uiType:UIFrame,id:"page_bk",l:0,t:0,w:1280,h:720,type:"hole"},
		 {uiType:UIFrame,id:"page_bk",l:0,t:0,w:1280,h:720,type:"img",imgNames:["setting/default_background"]},
    ];
	
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
	
	var queryParam = [
		{uiType:UIFrame,id:"bk",w:width_frame,h:height_frame,l:(1280 - width_frame)/2,t:top_frame,styleClass:"system_setting_bk",focusMoveMode:"circle",visibility:0},
		{uiType:UILabel,w:width_frame,h:50,ol:0,ot:2,dt:10,HAlign:"center",font:font2,value:Lp.getValue("system_setting")+">"+Lp.getValue("DTV_Bidirectional_Module_Return")},
		
		{uiType:UILabel,w:width_title,h:height_title,ol:left_title,ot:top_title,value:Lp.getValue("Company_Alias")+":",HAlign:"right",font:font1},
		{uiType:UIEdit,id:"company_alias",w:width_con,h:height_con,ol:left_con,ot:top_con,value:"",HAlign:"center",font:font1,styleClass:"setting_edit_item",onFocus:true},
		
		{uiType:UILabel,w:width_title,h:height_title,ol:left_title,ot:top_title+height_item,value:Lp.getValue("Work_Order_Simple_Code")+":",HAlign:"right",font:font1},
		{uiType:UIEdit,id:"simple_code",w:width_con,h:height_con,ol:left_con,ot:top_con+height_item,value:"",HAlign:"center",font:font1,styleClass:"setting_edit_item"},
		
		{uiType:UIImg,w:60,h:22,ol:130,ot:height_frame-40,src:"setting/ico_back"},
		{uiType:UILabel,w:80,h:30,ol:130+56,ot:height_frame-40+3,value:Lp.getValue("Cancel"),font:font1},
		{uiType:UIImg,w:60,h:22,ol:280,ot:height_frame-40+1,src:"setting/ico_ok"},
		{uiType:UILabel,w:80,h:30,ol:270+56,ot:height_frame-40+3,value:Lp.getValue("Submit"),font:font1}
	];
	
	width_frame = 460;
	width_title = width_frame*0.4;
	width_con = width_frame*0.6;
	height_label = 30;
	top_item = 80;
	left_title = 10;
	left_con = left_title + width_title + 5;
	var height_item = 40;
	var bidirectionalModuleParam = [
		{uiType:UIFrame,id:"bk",w:width_frame,h:height_frame,l:(1280 - width_frame)/2,t:top_frame,styleClass:"system_setting_bk",focusMoveMode:"circle",visibility:0},
		{uiType:UILabel,w:width_frame,h:50,ol:0,ot:2,dt:10,HAlign:"center",font:font2,value:Lp.getValue("system_setting")+">"+Lp.getValue("Query_DTV_Bidirectional_Module")},
		
		{uiType:UILabel,w:width_title,h:height_title,ol:left_title,ot:top_item,value:Lp.getValue("Company_Alias")+":",HAlign:"right",font:font1},
		{uiType:UILabel,id:"company_alias",w:width_con,h:height_label,ol:left_con,ot:top_item,value:"20",HAlign:"left",font:font1},
		
		{uiType:UILabel,w:width_title,h:height_title,ol:left_title,ot:top_item+height_item,value:Lp.getValue("Work_Order_Simple_Code")+":",HAlign:"right",font:font1},
		{uiType:UILabel,id:"full_code",w:width_con,h:height_label,ol:left_con,ot:top_item+height_item,value:"53456789",HAlign:"left",font:font1},
		
		{uiType:UIImg,w:60,h:22,ol:130,ot:height_frame-40,src:"setting/ico_back"},
		{uiType:UILabel,w:80,h:30,ol:130+56,ot:height_frame-40+3,value:Lp.getValue("Cancel"),font:font1},
		{uiType:UIImg,w:60,h:22,ol:280,ot:height_frame-40+1,src:"setting/ico_ok"},
		{uiType:UILabel,w:80,h:30,ol:270+56,ot:height_frame-40+3,value:Lp.getValue("Submit"),font:font1}
	]
	
	height_frame = 170;
	left_img = (width_frame - 23)/2;
	var cmMacReadParam = [
		{uiType:UIFrame,id:"bk",w:width_frame,h:height_frame,l:(1280 - width_frame)/2,t:top_frame,styleClass:"system_setting_bk",focusMoveMode:"circle",visibility:0},
		{uiType:UILabel,w:width_frame,h:50,ol:0,ot:2,dt:10,HAlign:"center",font:font2,value:Lp.getValue("system_setting")+">"+Lp.getValue("Read_Return_CM_MAC")},
		
		{uiType:UILabel,w:width_title,h:height_title,ol:left_title,ot:top_item,value:Lp.getValue("MAC_Address")+":",HAlign:"right",font:font1},
		{uiType:UILabel,id:"company_alias",w:width_con,h:height_label,ol:left_con,ot:top_item,value:Lp.getValue("Reading_Please_Wait"),HAlign:"left",font:font1},
		
		{uiType:UIImg,w:43,h:43,ol:left_img,ot:122,src:"setting/loading",stretch:"HV"},
	]
	
	var cmMacResultParam = [
		{uiType:UIFrame,id:"bk",w:width_frame,h:height_frame,l:(1280 - width_frame)/2,t:top_frame,styleClass:"system_setting_bk",focusMoveMode:"circle",visibility:0},
		{uiType:UILabel,w:width_frame,h:50,ol:0,ot:2,dt:10,HAlign:"center",font:font2,value:Lp.getValue("system_setting")+">"+Lp.getValue("Read_Return_CM_MAC")},
		
		{uiType:UILabel,w:width_title,h:height_title,ol:left_title,ot:top_item,value:Lp.getValue("MAC_Address")+":",HAlign:"right",font:font1},
		{uiType:UILabel,id:"company_alias",w:width_con,h:height_label,ol:left_con,ot:top_item,value:"89:09:89:78",HAlign:"left",font:font1},
		
		{uiType:UIImg,w:60,h:22,ol:130,ot:height_frame-40,src:"setting/ico_back"},
		{uiType:UILabel,w:80,h:30,ol:130+56,ot:height_frame-40+3,value:Lp.getValue("Cancel"),font:font1},
		{uiType:UIImg,w:60,h:22,ol:280,ot:height_frame-40+1,src:"setting/ico_ok"},
		{uiType:UILabel,w:80,h:30,ol:270+56,ot:height_frame-40+3,value:Lp.getValue("Pass_Back"),font:font1}
	]

	width_frame = 400;
	top_frame = 260;
	var cmMACPassResultParam = [
		{uiType:UIFrame,id:"bk",w:width_frame,h:height_frame,l:(1280 - width_frame)/2,t:top_frame,styleClass:"system_setting_bk",visibility:0},
		{uiType:UILabel,w:width_frame,h:30,ol:0,ot:16,value:Lp.getValue("Read_Return_DTV_Result"),font:font1,HAlign:"center"},
		{uiType:UILabel,id:"authorization_result",w:width_frame,h:40,ol:0,ot:76,value:Lp.getValue("Function_Call_Successful"),font:font1,HAlign:"center"},
		
		{uiType:UIImg,w:60,h:22,ol:190,ot:height_frame-40+1,src:"setting/ico_ok"},
		{uiType:UILabel,w:80,h:30,ol:170+62,ot:height_frame-40+3,value:Lp.getValue("OK"),font:font1},
	]

	
	
	this.initData = function(){
		isRestored = 0;
	}
	
	this.initView = function(){
		queryDlg = UI.createGroup(queryParam,"queryDlg",self.win,null,null,query_proc);
		
		
		bidirectionalModuleDlg = UI.createGroup(bidirectionalModuleParam,"bidirectionalModuleDlg",self.win,null,null,bidirectional_module_proc);
		
		
		cmMACReadDlg = UI.createGroup(cmMacReadParam,"cmMACReadDlg",self.win,null,null,cm_read_proc);
		cmMACResultDlg = UI.createGroup(cmMacResultParam,"cmMACResultDlg",self.win,null,null,cm_result_proc);
		
		cmMACPassResultDlg = UI.createGroup(cmMACPassResultParam,"cmMACPassResultDlg",self.win,null,null,cm_pass_result_proc);
		showQueryDlg();
		//showOrderInfo();
		//showSubmitInfo();
		//showLoading();
	}
	
	function showQueryDlg(){
		queryDlg.visibility = 1;
		queryDlg.getChild("company_alias").setFocus(true);
		queryDlg.update();
	}
	
	
	function showBidirectionalModule(){
		bidirectionalModuleDlg.visibility = 1;
		bidirectionalModuleDlg.setFocus(true);
		bidirectionalModuleDlg.update();
	}
	
	function showCmMACRead(){
		cmMACReadDlg.visibility = 1;
		cmMACReadDlg.setFocus(true);
		cmMACReadDlg.update();
	}
	
	function showCmMACResult(){
		cmMACResultDlg.visibility = 1;
		cmMACResultDlg.setFocus(true);
		cmMACResultDlg.update();
	}
	
	function showCmMACPassResult(){
		cmMACPassResultDlg.visibility = 1;
		cmMACPassResultDlg.setFocus(true);
		cmMACPassResultDlg.update();
	}
	
	
    this.open = function(){
		this.initData();
        this.defOpen();
		this.initView();
    };

    this.close = function(){
        this.defClose();
    };

    this.start = function(){
    };
	
    this.onkey = function(e)
    {
        var ret = false;
        switch(e.keyCode)
        {
            case UI.KEY.ENTER:
			break;
			case UI.KEY.BACKSPACE:
			self.go(SystemSettingMenuPage);
			break;
        }
        return ret;
    };
	
	
	function query_proc(e){
		var ret = false;
        switch(e.keyCode)
        {
            case UI.KEY.ENTER:
			queryDlg.visibility = 0;
			showBidirectionalModule();
			break;
			case UI.KEY.BACKSPACE:
			self.go(SystemSettingMenuPage);
			break;
        }
        return ret;
	}
	
	function bidirectional_module_proc(e){
		switch(e.keyCode)
        {
            case UI.KEY.ENTER:
				bidirectionalModuleDlg.visibility = 0;
				showCmMACResult();
			break;
			case UI.KEY.BACKSPACE:
				bidirectionalModuleDlg.visibility = 0;
				showQueryDlg();
			break;
        }
		return true;
	}
	
	function cm_read_proc(e){
		return true;
	}	
	
	function cm_result_proc(e){
		switch(e.keyCode)
        {
            case UI.KEY.ENTER:
				showCmMACPassResult();
			break;
			case UI.KEY.BACKSPACE:
				cmMACResultDlg.visibility = 0;
				showQueryDlg();
			break;
        }
		return true;
	}
	
	function cm_pass_result_proc(e){
		switch(e.keyCode)
        {
            case UI.KEY.ENTER:
				cmMACResultDlg.visibility = 0;
				cmMACPassResultDlg.visibility = 0;
				showQueryDlg();
			break;
        }
		return true;
	}	
	
}
DTVModuleReturnPage.prototype = UIModule.baseModule;
