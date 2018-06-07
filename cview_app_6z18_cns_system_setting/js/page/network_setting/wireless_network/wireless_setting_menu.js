function WirelessSettingMenuPage(params,srcModule)
{
    var self = this;
	
	var width_dialog = 820;
	var height_dialog = 720*0.75;

	var font1 = uiCom.font.P20;
	var font2 = uiCom.font.P35;
	
	var operationDlg;
	var operationDlgNo;
	var operationDlgOn;
	var operationList;

	var navLeftDlg;
	var navRightDlg;
	
	var listItems;
	
	this.initData = function(){
		listItems = new Array();
		listItems[0] = new Array();
		listItems[0][0] = Lp.getValue("IP_Information");
		listItems[1] = new Array();
		listItems[1][0] = Lp.getValue("DHCP_Setting");
		listItems[2] = new Array();
		listItems[2][0] = Lp.getValue("WiFi_Setting");
		listItems[3] = new Array();
		listItems[3][0] = Lp.getValue("Wired_Device");
	}

    this.dlgParam =  [
        {uiType:UIFrame,id:"page_bk",l:0,t:0,w:1280,h:720,type:"img",imgNames:["setting/default_background"]}
    ];
	
	this.dialog_param = [
		{uiType:UIFrame,id:"dialog_bk",l:(1280-width_dialog)/2,t:100,w:width_dialog,h:height_dialog,styleClass:"setting_dialog_bk"},
		{uiType:UILabel,id:"dialog_title",w:width_dialog,h:40,ol:0,ot:10,value:Lp.getValue("System_Setting")+">"+Lp.getValue("Network_Settings")+">"+Lp.getValue("CM_Mode"),font:font2,HAlign:"center"}
	];
	
	var left_list = (1280-width_dialog)/2 + 20;
	var top_content = 100 + 60;
	var width_content_left = width_dialog*0.28;
	var height_content = 420;
	var space_v_list = 8;
	var height_item = 36;
	var space_v_item = space_v_list + height_item;
	var top_item_ot = 8;
	var height_progress = 8;
	
	this.openration_list = [

		{uiType:UIFrame,id:"list_bk",w:width_content_left,h:height_content,l:left_list,t:top_content,styleClass:"None",focusMoveMode:"circle"},
		{uiType:UIFrame,id:"list_bk_normal",w:width_content_left,h:height_content,l:left_list,t:top_content,type:"3imgv",cls:"setting/systemSetLeftGrey"},
		{uiType:UIFrame,id:"list_bk_onfocus",w:width_content_left,h:height_content,l:left_list,t:top_content,type:"3imgv",cls:"setting/systemSetLeftBlue"},
		{uiType:UITable,id:"list_table",w:width_content_left*0.88,h:height_item*4+space_v_list*3,ol:12,ot:top_item_ot,lineRectWidth:0,lineHWidth:0,lineVWidth:0,lineColor:"#505050", cols:1,rows:4,rowsOnePage:4,focusEnlargeV:-10,font:font1,
		skin:{
				normalBar:{type:"none"},
				selectBar:{type:"3imgh",cls:"setting/greybar"},
				focusBar:{type:"3imgh",cls:"setting/bluebar"},
			}
		},
		
	];
	
	this.nav_focus_left = [
		{uiType:UIFrame,id:"dialog_bk",l:(1280-width_dialog)/2,t:height_content+180,w:width_dialog,h:60,styleClass:"None"},
		{uiType:UIImg,id:"nav1",w:34,h:26,ol:300,ot:0,src:"setting/ico_rightArrow"},
		{uiType:UILabel,id:"nav1_text",w:200,h:40,ol:300+34+6,ot:-3,value:Lp.getValue("Move_Focus_Right"),font:font1},
		{uiType:UIImg,id:"nav1",w:47,h:26,ol:560,ot:0,src:"setting/ico_back"},
		{uiType:UILabel,id:"nav1_text",w:200,h:40,ol:560+47+6,ot:-3,value:Lp.getValue("UP_Page"),font:font1}
	];

	
	this.initView = function(){
		UI.createGroup(this.dialog_param,"step1Dlg",this.win);	
		operationDlg = UI.createGroup(this.openration_list,"operationDlg",this.win);
		operationList = operationDlg.getChild("list_table");
		operationDlgNo = operationDlg.getChild("list_bk_normal");
		operationDlgOn = operationDlg.getChild("list_bk_onfocus");

		//navLeftDlg = UI.createGroup(this.nav_focus_left,"navLeftDlg",this.win);	
		//navRightDlg = UI.createGroup(this.nav_focus_right,"navRightDlg",this.win);
		
		
		operationList.addItems(listItems);
		operationList.defProc = self.table_proc;
		operationList.curIndex = 0;
		operationList.setFocus(true);
		
		cmRightControl.curIndex = operationList.curIndex;
		cmRightControl.init(operationDlg,setFocus,cmRightControl.curIndex);
	};
	
    this.open = function(){
		this.initData();
        this.defOpen();
		this.initView();
    };

    this.close = function(){

		dtvCom.getChannels();
        this.defClose();
    };

    this.start = function(){
    };

    this.stop = function(){
    };
		
    this.onkey = function(e)
    {
        var ret = false;
        console.log("In ScanChannelPage module keyCode =" +  e.keyCode );
        switch(e.keyCode)
        {
            case UI.KEY.BACKSPACE:
			break;
        }
        return ret;
    };
	
	function setFocus(){
	
		operationList.setFocus(true);
		operationDlgOn.visibility = 1;
		operationDlgNo.visibility = 0;
		self.win.update();
	}
	
	this.table_proc = function(e){
		var ret = false;
		console.log("channel list tableProc keyCode =="+e.keyCode);
		var curIndex = operationList.curIndex;
		switch(e.keyCode){
			case UI.KEY.BACKSPACE:
				self.go(NetworkSettingMenuPage);
				ret = true;
			break;
			case UI.KEY.UP:
				operationList.listUp();
				cmRightControl.switchSub(operationList.curIndex);
				self.win.update();
				ret = true;
			break;
			case UI.KEY.DOWN:
				operationList.listDown();
				cmRightControl.switchSub(operationList.curIndex);
				console.log("operationList.curIndex == "+operationList.curIndex);
				ret = true;
				self.win.update();
			break;
			case UI.KEY.RIGHT:
			if(cmRightControl.setSubFocus()){
				operationDlgOn.visibility = 0;
				operationDlgNo.visibility = 1;
				self.win.update();
			}	
			return true;
			break;
		}
		
		console.log("channel list tableProc end ret =="+ret);
        return ret;
	}
}
WirelessSettingMenuPage.prototype = UIModule.baseModule;

