// JavaScript Document

var NetworkSettingMenuIndex = 0;
function NetworkSettingMenuPage(params,srcModule)
{
    var self = this;
    // constructor
    // Constructed end
	
	var width_List = 500;
	var height_list = 180;
	
	var width_tips = width_List*0.8;
	
	var width_table = width_List - 40;
	
	var font1 = uiCom.font.F20;
	var font2 = uiCom.font.F25;
	var font3 = uiCom.font.F35;
	
	var color1 = "grey";
	var color2 = "white";
	
	var listDlg;
	var listTable;
	
	var listItems;
	
	var tipsDlg;

    this.dlgParam =  [
        {uiType:UIFrame,id:"page_bk",l:0,t:0,w:1280,h:720,type:"hole"},
		 //{uiType:UIFrame,id:"page_bk",l:0,t:0,w:1280,h:720,type:"img",imgNames:["setting/default_background"]},
    ];
	
	this.listParam = [
		{uiType:UIFrame,id:"list_bk",l:(1280 - width_List)/2,t:200,w:width_List,h:height_list,styleClass:"system_setting_bk"},
		{uiType:UILabel,w:width_List,h:50,ol:0,ot:2,dt:10,HAlign:"center",font:font2,value:Lp.getValue("System_Setting")+">"+Lp.getValue("Network_Settings")},
		{uiType:UITable,id:"list_table",w:width_table,h:height_list*0.5,ol:(width_List-width_table)/2,ot:55+16,lineRectWidth:0,lineHWidth:0,lineVWidth:0,lineColor:"#505050", font:font1,cols:2,rows:2,rowsOnePage:2,HAlign:"left",dl:20,dt:0,color:color1,focusColor:color2,
		skin:{
				normalBar:{type:"none"},
				focusBar:{type:"3imgh",cls:"setting/bluebar"},
			}
		},
		{uiType:UIImg,w:36,h:22,ol:100,ot:height_list-40,src:"setting/ico_ok"},
		{uiType:UILabel,w:50,h:30,ol:100+40,ot:height_list-40+3,value:Lp.getValue("OK"),font:font1},
		{uiType:UIImg,w:60,h:22,ol:100+40+50+50,ot:height_list-40,src:"setting/ico_back"},
		{uiType:UILabel,w:80,h:30,ol:100+40+50+50+62,ot:height_list-40+3,value:Lp.getValue("UP_Page"),font:font1}
	];
	/*
	this.tipsParam = [
		{uiType:UIFrame,id:"tips_bk",l:(1280 - width_tips)/2,t:180,w:width_tips,h:height_list,styleClass:"setting_dialog_bk_blue",visibility:0},
		{uiType:UILabel,w:width_tips,h:50,ol:0,ot:2,dt:10,HAlign:"center",font:font2,value:Lp.getValue("Restart_STB_Confirm")},
		{uiType:UILabel,w:width_tips,h:50,ol:0,ot:82,dt:10,HAlign:"center",font:font1,value:Lp.getValue("Please_Confirm_Restart_STB")},
		{uiType:UIImg,w:36,h:22,ol:width_tips*0.15,ot:height_list-40,src:"setting/ico_ok"},
		{uiType:UILabel,w:50,h:30,ol:width_tips*0.15+40,ot:height_list-40+3,value:Lp.getValue("OK"),font:font1},
		{uiType:UIImg,w:60,h:22,ol:width_tips*0.15+40+50+50,ot:height_list-40,src:"setting/ico_back"},
		{uiType:UILabel,w:80,h:30,ol:width_tips*0.15+40+50+50+62,ot:height_list-40+3,value:Lp.getValue("Cancel"),font:font1}
	]
	*/
	this.initData = function(){
		listItems = new Array();
		
		listItems[0] = new Array();
		listItems[0][0] = {type:"img",img:"setting/right_green",alignH:"right",alignV:"center"};
		listItems[0][1] = Lp.getValue("CM_Mode");
		listItems[0][2] = WirelessSettingMenuPage;
	};
	
	this.initView = function(){
		listDlg = UI.createGroup(self.listParam,"listDlg",self.win);
		//tipsDlg = UI.createGroup(self.tipsParam,"listDlg",self.win,null,null,self.tipsProc);
		listTable = listDlg.getChild("list_table");
		listTable.setColWidthArr([listTable.w*0.37, listTable.w*0.63]);
		listTable.addItems(listItems);
		listTable.curIndex = NetworkSettingMenuIndex;
		listTable.setFocus(true);
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
		var index = listTable.curIndex;
		var page = listItems[index][2];
		
		//self.go(page);
		
		
		NetworkSettingMenuIndex = listTable.curIndex;
	};

    this.onkey = function(e)
    {
        var ret = false;
        switch(e.keyCode)
        {
            case UI.KEY.ENTER:
			self.key_return();
			ret = true;
			break;
			case UI.KEY.BACKSPACE:
				NetworkSettingMenuIndex = 0;
			self.go(SystemSettingMenuPage);
			break;
        }
        return ret;
    };
	/*
	this.tipsProc = function(e){
		var ret = false;
        switch(e.keyCode)
        {
            case UI.KEY.ENTER:
			sysCom.config.networkMode = sysCom.config.networkMode == 0?1:0;
			self.go(NetworkSettingMenuPage);
			ret = true;
			break;
			case UI.KEY.BACKSPACE:
				
				listTable.setFocus(true);
				tipsDlg.hide();
				ret = true;
			break;
        }
        return ret;
	}*/
}
NetworkSettingMenuPage.prototype = UIModule.baseModule;

function checkIP(ip) 
{ 
    obj=ip;
    var exp=/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/; 
    var reg = obj.match(exp); 
    if(reg==null) 
    { 	console.log("checkIP null ip =="+ip);
        return false;//不合法
    } 
    else 
    { console.log("checkIP ip =="+ip);
        return true; //合法
    } 
}

function checkMask(mask) 
{ 
    obj=mask; 
    var exp=/^(254|252|248|240|224|192|128|0)\.0\.0\.0|255\.(254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(254|252|248|240|224|192|128|0)$/; 
    var reg = obj.match(exp); 
    if(reg==null) 
    { 
         return false; //"非法"
    } 
     else 
    { 
         return true; //"合法"
    } 
}  