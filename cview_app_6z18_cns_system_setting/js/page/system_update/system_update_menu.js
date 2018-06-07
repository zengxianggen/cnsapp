// JavaScript Document

/**
 * Created by tony_vopo on 2016/9/7.
 */
var SystemUpdateMenuIndex = 0;
function SystemUpdateMenuPage(params,srcModule)
{
    var self = this;
    // constructor
    // Constructed end
	
	var width_List = 430;
	var height_list = 230;
	
	var width_table = width_List - 40;
	
	var font1 = uiCom.font.F20;
	var font2 = uiCom.font.F25;
	var font3 = uiCom.font.F35;
	
	var color1 = "grey";
	var color2 = "white";
	
	var listDlg;
	var listTable;
	
	var listItems;

    this.dlgParam =  [
        {uiType:UIFrame,id:"page_bk",l:0,t:0,w:1280,h:720,type:"hole"}
    ];
	
	this.listParam = [
		{uiType:UIFrame,id:"list_bk",l:(1280 - width_List)/2,t:160,w:width_List,h:height_list,styleClass:"system_setting_bk"},
		{uiType:UILabel,w:width_List,h:50,ol:0,ot:2,dt:10,HAlign:"center",font:font2,value:Lp.getValue("System_Setting")+">"+Lp.getValue("System_Update")},
		{uiType:UITable,id:"list_table",w:width_table,h:height_list*0.5,ol:(width_List-width_table)/2,ot:55+13,lineRectWidth:0,lineHWidth:0,lineVWidth:0,lineColor:"#505050", font:font1,cols:1,rows:2,rowsOnePage:2,HAlign:"center",dl:0,dt:-10,color:color1,focusColor:color2,
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
	
	this.initData = function(){
		listItems = new Array();
		listItems[0] = new Array();
		listItems[0][0] = Lp.getValue("USB_Update");
		listItems[0][1] = "";
		
		listItems[1] = new Array();
		listItems[1][0] = Lp.getValue("OTA_Update");
		listItems[1][1] = "";
	}
	
	this.initView = function(){
		listDlg = UI.createGroup(self.listParam,"listDlg",self.win);
		listTable = listDlg.getChild("list_table");
		
		listTable.addItems(listItems);
		listTable.curIndex = SystemUpdateMenuIndex;
		listTable.setFocus(true);
		self.win.update();
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

	this.key_return = function(){
		var index = listTable.curIndex;
		var page = listItems[index][1];

		if(page!=""){
			this.go(page);
		}
		else{
			//console.log("還沒實現");
			if(index == 0)
			{
                var usbArray = FS.fsGetDiskInfo(null,false);


                if(usbArray == null || usbArray.length <= 0)//
				{
                    //提示用户
                    var p1 = {
                        title: Lp.getValue("tips"),

                        timeout: 4* 1000,
                        background: "../cview_app_common_pic/password_bg.png",

                    };

                    var p2 = {
                        text: Lp.getValue("NOUSB")
                    };
                    var dia = new Dialog(p1);
                    dia.show(p2);
				}
				else
                {
                    OTA.startUSBManual(false);
                }
			}
			else 	if(index == 1)
            {
                //OTA.startOTAManual(false);
                //检测是否有升级信息
                if(OTA.checkOTAUpdate(false)){//提示没有升级信息
                    OTA.startOTAUpdate(false);
                }
                else
				{
                    //提示用户
                    var p1 = {
                        title: Lp.getValue("tips"),

                        timeout: 4* 1000,
                        background: "../cview_app_common_pic/password_bg.png",

                    };

                    var p2 = {
                        text: Lp.getValue("NOOTASOFTWARE")
                    };
                    var dia = new Dialog(p1);
                    dia.show(p2);

				}
            }
		}
	}

    this.onkey = function(e)
    {
        var ret = false;
        switch(e.keyCode)
        {
            case UI.KEY.ENTER:
				SystemUpdateMenuIndex = listTable.curIndex;
			self.key_return();
			break;
			case UI.KEY.BACKSPACE:
				SystemUpdateMenuIndex = 0;
			self.go(SystemSettingMenuPage);
			break;
        }
        return ret;
    };
}
SystemUpdateMenuPage.prototype = UIModule.baseModule;

