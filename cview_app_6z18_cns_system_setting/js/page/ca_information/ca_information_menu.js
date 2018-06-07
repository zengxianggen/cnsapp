/**
 * Created by tony_vopo on 2016/9/7.
 */
function CAInformationMenuPage(params,srcModule)
{
    var self = this;
	
	var width_dialog = 820;
	var height_dialog = 720*0.75;

	var font1 = uiCom.font.F25;
	var font2 = uiCom.font.F30;
	
	var operationDlg;
	var operationDlgNo;
	var operationDlgOn;
	var operationList;
	
	var listItems;
	
	this.initData = function(){
		listItems = new Array();
		listItems[0] = new Array();
		listItems[0][0] = Lp.getValue("Card_Password_Change");
		listItems[1] = new Array();
		listItems[1][0] = Lp.getValue("STB_Card_Pairing");
		listItems[2] = new Array();
		listItems[2][0] = Lp.getValue("Operator_Information");
		listItems[3] = new Array();
		listItems[3][0] = Lp.getValue("Card_Information");
		listItems[4] = new Array();
		listItems[4][0] = Lp.getValue("Card_Update_Information");
	}

    this.dlgParam =  [
        {uiType:UIFrame,id:"page_bk",l:0,t:0,w:1280,h:720,type:"hole"}
    ];
	
	this.dialog_param = [
		{uiType:UIFrame,id:"dialog_bk",l:(1280-width_dialog)/2,t:100,w:width_dialog,h:height_dialog,styleClass:"setting_dialog_bk"},
		{uiType:UILabel,id:"dialog_title",w:width_dialog,h:40,ol:0,ot:20,value:Lp.getValue("System_Setting")+">"+Lp.getValue("CA_Information"),font:font2,HAlign:"center"}
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
		{uiType:UITable,id:"list_table",w:width_content_left*0.88,h:height_item*5+space_v_list*3,ol:12,ot:top_item_ot,dt:6,lineRectWidth:0,lineHWidth:0,lineVWidth:0,lineColor:"#505050", cols:1,rows:5,rowsOnePage:5,focusEnlargeV:-10,font:font1,
		skin:{
				normalBar:{type:"none"},
				selectBar:{type:"3imgh",cls:"setting/greybar"},
				focusBar:{type:"3imgh",cls:"setting/bluebar"},
			}
		},
	];

	
	this.initView = function(){
		UI.createGroup(this.dialog_param,"step1Dlg",this.win);	
		operationDlg = UI.createGroup(this.openration_list,"operationDlg",this.win);
		operationList = operationDlg.getChild("list_table");
		operationDlgNo = operationDlg.getChild("list_bk_normal");
		operationDlgOn = operationDlg.getChild("list_bk_onfocus");
		
		
		operationList.addItems(listItems);
		operationList.defProc = self.table_proc;
		operationList.curIndex = 0;
		operationList.setFocus(true);
		
		caRightControl.curIndex = operationList.curIndex;
		caRightControl.init(operationDlg,setFocus,caRightControl.curIndex);
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
				self.go(SystemSettingMenuPage);
				ret = true;
			break;
			case UI.KEY.UP:
				operationList.listUp();
				caRightControl.switchSub(operationList.curIndex);
				self.win.update();
				ret = true;
			break;
			case UI.KEY.DOWN:
				operationList.listDown();
				caRightControl.switchSub(operationList.curIndex);
				console.log("operationList.curIndex == "+operationList.curIndex);
				ret = true;
				self.win.update();
			break;
			case UI.KEY.RIGHT:
			if(caRightControl.setSubFocus()){
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
CAInformationMenuPage.prototype = UIModule.baseModule;

