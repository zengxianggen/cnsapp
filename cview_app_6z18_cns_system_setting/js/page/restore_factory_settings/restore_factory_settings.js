// JavaScript Document

function RestoreFactorySettingPage(params,srcModule)
{
    var self = this;
    // constructor
    // Constructed end
	
	var width_frame = 500;
	var height_frame = 180;
	var top_frame = 200;
	
	var font1 = uiCom.font.F20;
	var font2 = uiCom.font.F25;
	var font3 = uiCom.font.F35;
	
	var color1 = "grey";
	var color2 = "white";
	
	var confirmDlg;
	var statusDlg;
	var isRestored;
	

    this.dlgParam =  [
        {uiType:UIFrame,id:"page_bk",l:0,t:0,w:1280,h:720,type:"hole"},
		 //{uiType:UIFrame,id:"page_bk",l:0,t:0,w:1280,h:720,type:"img",imgNames:["setting/default_background"]},
    ];
	
	this.confirmParam = [
		{uiType:UIFrame,id:"bk",w:width_frame,h:height_frame,l:(1280 - width_frame)/2,t:top_frame,styleClass:"system_setting_bk"},
		{uiType:UILabel,w:width_frame,h:50,ol:0,ot:2,dt:10,HAlign:"center",font:font2,value:Lp.getValue("Tips")},
		
		{uiType:UILabel,w:width_frame,h:30,ol:0,ot:80,value:Lp.getValue("Verify_Factory_Restored"),HAlign:"center",font:font1},

		{uiType:UIImg,w:36,h:22,ol:100,ot:height_frame-40,src:"setting/ico_ok"},
		{uiType:UILabel,w:50,h:30,ol:100+40,ot:height_frame-40+3,value:Lp.getValue("OK"),font:font1},
		{uiType:UIImg,w:60,h:22,ol:100+40+50+50,ot:height_frame-40,src:"setting/ico_back"},
		{uiType:UILabel,w:80,h:30,ol:100+40+50+50+62,ot:height_frame-40+3,value:Lp.getValue("UP_Page"),font:font1}
	];
	
	this.statusParam = [
		{uiType:UIFrame,id:"bk",w:width_frame,h:height_frame,l:(1280 - width_frame)/2,t:top_frame,styleClass:"system_setting_bk",visibility:0},
		{uiType:UILabel,id:"title",w:width_frame,h:50,ol:0,ot:2,dt:10,HAlign:"center",font:font2,value:Lp.getValue("Status")},
		{uiType:UILabel,id:"content",w:width_frame,h:30,ol:0,ot:80,value:Lp.getValue("Restored_Tips"),HAlign:"center",font:font1},
	];
	
	
	this.initData = function(){
		isRestored = 0;
	};
	
	this.initView = function(){
		confirmDlg = UI.createGroup(self.confirmParam,"confirmDlg",self.win);
		statusDlg = UI.createGroup(self.statusParam,"statusDlg",self.win);
		self.win.update();
	};
	
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

	this.key_return = function(){
		restore();
	};
	
	function restore(){
		confirmDlg.visibility = 0;
		statusDlg.visibility = 1;
        self.win.update();
		setTimeout(function(){
			DB.DoEvnVars({
                "opt": "write",
                "var": "resolution",
                "value": 3
            });
			DB.dbClearAll(false);
			utility.reboot(false);
		},3000);

	}

    this.onkey = function(e)
    {
        var ret = false;
        switch(e.keyCode)
        {
            case UI.KEY.ENTER:
				ret = true;
				self.key_return();
			break;
			case UI.KEY.BACKSPACE:
			self.go(SystemSettingMenuPage);
			break;
        }
        return ret;
    };
	
}
RestoreFactorySettingPage.prototype = UIModule.baseModule;
