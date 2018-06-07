// JavaScript Document

function ClusterMachineStatusPage(params,srcModule)
{
    var self = this;

	var font1 = uiCom.font.F20;
	var font2 = uiCom.font.F25;
	var font3 = uiCom.font.F35;
	
	var color1 = "grey";
	var color2 = "white";
	
	var status1Dlg;
	var status2Dlg;
	var status3Dlg;
	
	var width_frame = 500;
	var height_frame = 280;
	var top_frame = 200;
	
	var height_label = 30;
	var height_item = 50;
	var top_item = 90;
	var width_title = width_frame*0.4;
	var width_con = width_frame*0.6;
	
	var left_title = 10;
	var left_con = left_title + width_title + 2;
	
	

    this.dlgParam =  [
        //{uiType:UIFrame,id:"page_bk",l:0,t:0,w:1280,h:720,type:"hole"},
		 {uiType:UIFrame,id:"page_bk",l:0,t:0,w:1280,h:720,type:"img",imgNames:["setting/default_background"]},
    ];
	
	this.status1Param = [
		{uiType:UIFrame,id:"bk",w:width_frame,h:height_frame,l:(1280 - width_frame)/2,t:top_frame,styleClass:"system_setting_bk"},
		{uiType:UILabel,w:width_frame,h:50,ol:0,ot:2,dt:10,HAlign:"center",font:font2,value:Lp.getValue("system_setting")+">"+Lp.getValue("Authorization_Status")},
		
		//{uiType:UILabel,w:width_title,h:height_label,ol:left_title,ot:top_item,value:Lp.getValue("Native_Status")+":",HAlign:"right",font:font1},
		//{uiType:UILabel,id:"native_status",w:width_con,h:height_label,ol:left_con,ot:top_item,value:"kk",font:font1},
		
		{uiType:UILabel,w:width_title,h:height_label,ol:left_title,ot:top_item+height_item,value:Lp.getValue("Authorization_Status")+":",HAlign:"right",font:font1},
		{uiType:UILabel,id:"authorization_status",w:width_con,h:height_label,ol:left_con,ot:top_item+height_item,value:"kk",font:font1},
		
		//{uiType:UILabel,w:width_title,h:height_label,ol:left_title,ot:top_item+height_item*2,value:Lp.getValue("Corresponding_Master_Card")+":",HAlign:"right",font:font1},
		//{uiType:UILabel,id:"master_card",w:width_con,h:height_label,ol:left_con,ot:top_item+height_item*2,value:"kk",font:font1},
		
		{uiType:UIImg,w:60,h:22,ol:200,ot:height_frame-40,src:"setting/ico_back"},
		{uiType:UILabel,w:80,h:30,ol:200+62,ot:height_frame-40+3,value:Lp.getValue("UP_Page"),font:font1}
	];

	
	
	this.initData = function(){
		isRestored = 0;
	};
	
	this.initView = function(){
		status1Dlg = UI.createGroup(self.status1Param,"status1Dlg",self.win);
		
		//updateView();
	};
	
	function updateView(){
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
    	var status = CA.getPaired(false);
    	if(status && status.pairedstate == 0){
            status1Dlg.getChild("authorization_status").value = Lp.getValue("Authorized");
		}
		else
		{
            status1Dlg.getChild("authorization_status").value = Lp.getValue("Unauthorized");
		}
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
	
}
ClusterMachineStatusPage.prototype = UIModule.baseModule;
