/**
 * Created by tony_vopo on 2016/9/7.
 */
var firstGoSystemSettingPage = true;
var SystemSettingPage_index = 0;
function SystemSettingMenuPage(params,srcModule)
{
    var self = this;
    // constructor
    // Constructed end
	
	var width_List = 430;
	var height_list = 690;
	
	var width_table = width_List - 40;
	
	var font1 = uiCom.font.F22;
	var font2 = uiCom.font.F30;
	var font3 = uiCom.font.F35;
	
	var color1 = "grey";
	var color2 = "white";
	
	var listDlg;
	var listTable;
	
	var listItems;

    this.dlgParam =  [
        //{uiType:UIFrame,id:"page_bk",l:0,t:0,w:1280,h:720,type:"hole"},
		 {uiType:UIFrame,id:"page_bk",l:0,t:0,w:1280,h:720,type:"none"},
    ];
	
	this.listParam = [
		{uiType:UIFrame,id:"list_bk",l:(1280 - width_List)/2,t:16,w:width_List,h:height_list,styleClass:"system_setting_bk",visibility:0},
		{uiType:UILabel,w:width_List,h:50,ol:0,ot:2,dt:10,HAlign:"center",font:font3,value:Lp.getValue("System_Setting")},
		{uiType:UITable,id:"list_table",w:width_table,h:height_list*0.83,ol:(width_List-width_table)/2,ot:58,lineRectWidth:0,lineHWidth:0,lineVWidth:0,lineColor:"#505050", cols:1,rows:13,rowsOnePage:13,HAlign:"center",dl:0,color:color1,focusColor:color2,
		skin:{
				normalBar:{type:"none"},
				focusBar:{type:"img",imgNames:["setting/subNav_selecteditemBg"],stretch:"HV",},
			}
		},
		{uiType:UIImg,w:36,h:22,ol:100,ot:height_list-40,src:"setting/ico_ok"},
		{uiType:UILabel,w:50,h:30,ol:100+40,ot:height_list-40+3,value:Lp.getValue("OK"),font:font1},
		{uiType:UIImg,w:60,h:22,ol:100+40+50+50,ot:height_list-40,src:"setting/ico_back"},
		{uiType:UILabel,w:80,h:30,ol:100+40+50+50+62,ot:height_list-40+3,value:Lp.getValue("UP_Page"),font:font1}
	];
	
	var index = 0;
	this.initData = function(){
		listItems = new Array();
		listItems[index] = new Array();
		listItems[index][0] = Lp.getValue("System_Update");
		listItems[index++][1] = null;
		
		listItems[index] = new Array();
		listItems[index][0] = Lp.getValue("Search_Channel");
		listItems[index++][1] = null;
		
		listItems[index] = new Array();
		listItems[index][0] = Lp.getValue("Singal_Check");
		listItems[index++][1] = null;
		
		listItems[index] = new Array();
		listItems[index][0] = Lp.getValue("Network_Settings");
		listItems[index++][1] = null;
		
		listItems[index] = new Array();
		listItems[index][0] = Lp.getValue("CM_Information");
		listItems[index++][1] = null;
		
		listItems[index] = new Array();
		listItems[index][0] = Lp.getValue("CA_Information");
		listItems[index++][1] = null;
		
		listItems[index] = new Array();
		listItems[index][0] = Lp.getValue("Reset_STB");
		listItems[index++][1] = null;
		
		/*listItems[index] = new Array();
		listItems[index][0] = Lp.getValue("Authorization_Status");
		listItems[index++][1] = null;*/
		
		listItems[index] = new Array();
		listItems[index][0] = Lp.getValue("Work_Order_Return");
		listItems[index++][1] = null;
		
		listItems[index] = new Array();
		listItems[index][0] = Lp.getValue("DTV_Bidirectional_Module_Return");
		listItems[index++][1] = null;
		
		listItems[index] = new Array();
		listItems[index][0] = Lp.getValue("Action_Open_QR");
		listItems[index++][1] = null;
		
		/*listItems[index] = new Array();
		listItems[index][0] = Lp.getValue("BID_Setting");
		listItems[index++][1] = null;*/
		
		listItems[index] = new Array();
		listItems[index][0] = Lp.getValue("Format_Hard_Disk");
		listItems[index++][1] = null;

       listItems[index] = new Array();
        listItems[index][0] = Lp.getValue("app_update");
        listItems[index++][1] = null;

		listItems[index] = new Array();
		listItems[index][0] = Lp.getValue("Debug_Information");
		listItems[index++][1] = null;
		
		/*listItems[index] = new Array();
		listItems[index][0] = Lp.getValue("VBM_Switch");
		listItems[index++][1] = null;*/
	};
    this.initDataPage = function(){
        index = 0;
        if( listItems[0][1] == null) {
            listItems[index++][1] = SystemUpdateMenuPage;


            listItems[index++][1] = ScanChannelPage;


            listItems[index++][1] = SignalCheckPage;


            listItems[index++][1] = NetworkSettingMenuPage;


            listItems[index++][1] = CMInformationPage;

            listItems[index++][1] = CAInformationMenuPage;


            listItems[index++][1] = RestoreFactorySettingPage;

            /*
            listItems[index++][1] = ClusterMachineStatusPage;*/


            listItems[index++][1] = WorkOrderReturnPage;


            listItems[index++][1] = WorkOrderReturnPage;

            listItems[index++][1] = AcitonOpenPage;

            /*
            listItems[index++][1] = BidSettingPage;*/


            listItems[index++][1] = FormatHardDiskPage;

            listItems[index++][1] = AppUpdatePage;


            listItems[index++][1] = DebugInformationPage;
        }
        /*
        listItems[index++][1] = VBMInformationPage;*/
    };
	this.initView = function(){
		listDlg = UI.createGroup(self.listParam,"listDlg",self.win);
		listTable = listDlg.getChild("list_table");

		listTable.addItems(listItems);
		listTable.curIndex = SystemSettingPage_index;
		if(firstGoSystemSettingPage == true)
		{
			showPasswordDlg();
			firstGoSystemSettingPage = false;
		}
		else{
            this.initDataPage();
			listTable.setFocus(true);
			listDlg.visibility = 1;
			self.win.update();
		}
	};
	
	function rightDo(){
		listTable.setFocus(true);
		listDlg.visibility = 1;
		self.win.update();
	}
	function backDo(){
		appCom.goAppByName("tvportal",true);
	}
	
	function showPasswordDlg(){
		var p = 
		{
		 win:self.win,
		 titleCont:Lp.getValue("Please_Input_System_Password"),
		 rightPasswd:sysCom.config.SystemSettingPin,
		 rightDo:rightDo,
		 backDo:backDo
 		};
		var pd = new PasswdDialog(p);
		pd.show();
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
        setTimeout(function(){

            var rect = {
                l:0,
                t:0,
                w:1280,
                h:720
            };
            var r = getVideoRect(rect,sysCom.config.Reslution);
            dtvCom.mp.mpSetVideoSize(r.l, r.t, r.w, r.h, false);
        }, 300);
    };

	this.key_return = function(){
		var index = listTable.curIndex;
        this.initDataPage();
		var page = listItems[index][1];

		if(page!=""){
			this.go(page);
		}
		else{
			console.log("還沒實現");	
		}
	}

    this.onkey = function(e)
    {
        var ret = false;
        switch(e.keyCode)
        {
            case UI.KEY.ENTER:
				SystemSettingPage_index = listTable.curIndex;
			self.key_return();
			break;
			case UI.KEY.BACKSPACE:
				SystemSettingPage_index = 0;
				appCom.goAppByName("tvportal",true);
			break;
        }
        return ret;
    };
}
SystemSettingMenuPage.prototype = UIModule.baseModule;

