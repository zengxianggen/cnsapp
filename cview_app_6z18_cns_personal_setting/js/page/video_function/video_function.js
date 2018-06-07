// JavaScript Document

function VideoFunctionPage(params,srcModule)
{
    var self = this;

	var font1 = uiCom.font.F20;
	var font2 = uiCom.font.F25;
	var font3 = uiCom.font.F35;
	
	var color1 = "grey";
	var color2 = "white";
	
	var mainDlg;

    this.dlgParam =  [
        //{uiType:UIFrame,id:"page_bk",l:0,t:0,w:1280,h:720,type:"hole"},
		 {uiType:UIFrame,id:"page_bk",l:0,t:0,w:1280,h:720,styleClass:"block_black_bt"},
    ];
	
	var width_frame = 460;
	var height_frame = 230;
	var top_frame = 200;
	
	var width_title = width_frame*0.45;
	var width_con = width_frame*0.45;
	
	var height_label = 30;

	var top_label = 86;
		
	var valueArr = [
		Lp.getValue("Close"),
		Lp.getValue("Open")
	];
	
	var left_nav = width_frame*0.26;
	
	var mainParam = [
		{uiType:UIFrame,id:"bk",w:width_frame,h:height_frame,l:(1280 - width_frame)/2,t:top_frame,styleClass:"system_setting_bk",focusMoveMode:"circle",visibility:1},
		{uiType:UILabel,w:width_frame,h:50,ol:0,ot:2,dt:10,HAlign:"center",font:font2,value:Lp.getValue("Tips")},
		
		{uiType:UILabel,id:"tips",w:width_frame,h:height_label,ol:0,ot:top_label,value:"",font:font1,HAlign:"center"},
		
		{uiType:UIImg,w:60,h:22,ol:left_nav,ot:height_frame-40+2,src:"setting/ico_ok"},
		{uiType:UILabel,w:100,h:30,ol:(left_nav = left_nav + 50),ot:height_frame-40+3,value:Lp.getValue("Ok"),font:font1},
		{uiType:UIImg,w:60,h:22,ol:(left_nav = left_nav + 100),ot:height_frame-40+1,src:"setting/ico_back"},
		{uiType:UILabel,w:80,h:30,ol:left_nav+56,ot:height_frame-40+3,value:Lp.getValue("Cancel"),font:font1}
	];
	

	this.initData = function(){
		isRestored = 0;
	}
	
	this.initView = function(){
		mainDlg = UI.createGroup(mainParam,"mainDlg",self.win);
		var info = getInfo();
		mainDlg.getChild("tips").value=info;
		self.win.update();
	}
	function getInfo(){
		var info = "llllllllllllllllll";
		return info;
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
		switch(e.keyCode){
			case UI.KEY.ENTER:
			ret = true;
			break;
			case UI.KEY.BACKSPACE:
			self.go(PersonalSettingMenuPage);
			ret = true;
			break;
		}
        return ret;
    };
	
	
}
VideoFunctionPage.prototype = UIModule.baseModule;
