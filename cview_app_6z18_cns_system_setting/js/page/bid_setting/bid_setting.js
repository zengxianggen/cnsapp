// JavaScript Document

function BidSettingPage(params,srcModule)
{
    var self = this;

	var font1 = uiCom.font.F20;
	var font2 = uiCom.font.F25;
	var font3 = uiCom.font.F35;
	
	var color1 = "grey";
	var color2 = "white";
	
	var inputDlg;

    this.dlgParam =  [
        //{uiType:UIFrame,id:"page_bk",l:0,t:0,w:1280,h:720,type:"hole"},
		 {uiType:UIFrame,id:"page_bk",l:0,t:0,w:1280,h:720,styleClass:"None"},
    ];
	
	var width_frame = 460;
	var height_frame = 230;
	var top_frame = 200;
	
	var width_title = width_frame*0.4;
	var width_con = width_frame*0.5;
	
	var height_item = 50;
	var height_label = 30;
	var height_con = 40;
	
	var top_label = 90;
	var top_con = top_label-6;
	var left_title = 10;
	var left_con = left_title + width_title + 2;
	
	var inputParam = [
		{uiType:UIFrame,id:"bk",w:width_frame,h:height_frame,l:(1280 - width_frame)/2,t:top_frame,styleClass:"system_setting_bk",focusMoveMode:"circle",visibility:1},
		{uiType:UILabel,w:width_frame,h:50,ol:0,ot:2,dt:10,HAlign:"center",font:font2,value:Lp.getValue("BID_Setting")},
		
		{uiType:UILabel,w:width_title,h:height_label,ol:left_title,ot:top_label,value:"Bouquet ID:",HAlign:"right",font:font1},
		{uiType:UIEdit,id:"bid_number",w:width_con,h:height_con,ol:left_con,ot:top_con,value:"",HAlign:"center",font:font1,styleClass:"setting_edit_item",onFocus:true},
		
		{uiType:UILabel,w:width_title,h:height_label,ol:left_title,ot:top_label+height_item,value:Lp.getValue("Current")+"Bouquet ID:",HAlign:"right",font:font1},
		{uiType:UILabel,id:"current_bid",w:width_con,h:height_label,ol:left_con,ot:top_label+height_item,value:sysCom.config.bouquetID,HAlign:"center",font:font1},
		
		{uiType:UIImg,w:60,h:22,ol:70,ot:height_frame-40+2,src:"setting/ico_ok"},
		{uiType:UILabel,w:200,h:30,ol:70+46,ot:height_frame-40+3,value:Lp.getValue("Save_And_Search"),font:font1},
		{uiType:UIImg,w:60,h:22,ol:280,ot:height_frame-40+1,src:"setting/ico_back"},
		{uiType:UILabel,w:80,h:30,ol:270+66,ot:height_frame-40+3,value:Lp.getValue("Cancel"),font:font1}
	];
	
	
	
	this.initData = function(){
		isRestored = 0;
	};
	
	this.initView = function(){
		inputDlg = UI.createGroup(inputParam,"inputDlg",self.win,null,null,input_proc);
	};
	
	function showQueryDlg(){
		queryDlg.visibility = 1;
		queryDlg.getChild("company_alias").setFocus(true);
		queryDlg.update();
	}
	
	function showQR(){
		qrDlg.visibility = 1;
		qrDlg.setFocus(true);
		qrDlg.update();
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
        return ret;
    };
	
	
	function input_proc(e){
		var ret = false;
        switch(e.keyCode)
        {
            case UI.KEY.ENTER:
			ret = true;
			var bid = inputDlg.getChild("bid_number").getIntValue();
			sysCom.config.bouquetID = bid;
			sysCom.saveConfig();
			self.go(ScanChannelPage);
			break;
			case UI.KEY.BACKSPACE:
			ret = true;
			self.go(SystemSettingMenuPage);
			break;
        }
        return ret;
	}
	

	
	
}
BidSettingPage.prototype = UIModule.baseModule;
