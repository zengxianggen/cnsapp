function SystemInformationPage(params,srcModule)
{
    var self = this;
    // constructor
    // Constructed end
	
	var width_List = 630;
	var height_list = 530;
	
	var width_table = width_List - 40;
	
	var font1 = uiCom.font.F18;
	var font2 = uiCom.font.F22;
	var font3 = uiCom.font.F30;
	
	var color1 = "grey";
	var color2 = "white";
	
	var listDlg;
	var listTable;
	
	var listItems;

    this.dlgParam =  [
        //{uiType:UIFrame,id:"page_bk",l:0,t:0,w:1280,h:720,type:"hole"},
		 {uiType:UIFrame,id:"page_bk",l:0,t:0,w:1280,h:720,type:"img",imgNames:["setting/default_background"]},
    ];
	
	this.listParam = [
		{uiType:UIFrame,id:"list_bk",l:(1280 - width_List)/2,t:90,w:width_List,h:height_list,styleClass:"system_setting_bk"},
		{uiType:UILabel,w:width_List,h:50,ol:0,ot:2,dt:10,HAlign:"center",font:font3,value:Lp.getValue("Personal_Settings")+">"+Lp.getValue("System_Information")},
		{uiType:UITable,id:"list_table",w:width_table,h:height_list*0.78,ol:(width_List-width_table)/2,ot:60,lineRectWidth:0,lineHWidth:0,lineVWidth:0,lineColor:"#505050", cols:2,rows:12,rowsOnePage:12,HAlign:"center",dl:0,color:color1,focusColor:color2,font:font2,textAligns:["right","left"],focusStop:false,
		skin:{
				normalBar:{type:"none"},
				focusBar:{type:"img",imgNames:["setting/subNav_selecteditemBg"],stretch:"HV",},
			}
		},
		{uiType:UIImg,w:60,h:22,ol:100+40+50+50,ot:height_list-40,src:"setting/ico_back"},
		{uiType:UILabel,w:80,h:30,ol:100+40+50+50+62,ot:height_list-40+3,value:Lp.getValue("Up_Page"),font:font1}
	];
	
	this.initData = function(){
		listItems = new Array();
		var info = getInfo();
		listItems[0] = new Array();
		listItems[0][0] = Lp.getValue("STB_Serial_Number")+" : ";
		listItems[0][1] = info.serial_number;
		
		listItems[1] = new Array();
		listItems[1][0] = "MAC : ";
		listItems[1][1] = info.mac;
		
		listItems[2] = new Array();
		listItems[2][0] = "HFC MAC : ";
		listItems[2][1] = info.hfc_mac;
		
		listItems[3] = new Array();
		listItems[3][0] = "WAN MAC : ";
		listItems[3][1] = info.wan_mac;
		
		listItems[4] = new Array();
		listItems[4][0] = Lp.getValue("Hardware_Version")+" : ";
		listItems[4][1] = info.hard_version;
		
		listItems[5] = new Array();
		listItems[5][0] = Lp.getValue("Software_Version")+" : ";
		listItems[5][1] = info.soft_version;
		
		listItems[6] = new Array();
		listItems[6][0] = Lp.getValue("Loader_Version")+" : ";
		listItems[6][1] = info.loader_version;
		
		listItems[7] = new Array();
		listItems[7][0] = "Bouquet ID : ";
		listItems[7][1] = info.bouquet_id;
		
		listItems[8] = new Array();
		listItems[8][0] = Lp.getValue("Smart_Card_Number")+" : ";
		listItems[8][1] = info.smart_card_number;
		
		listItems[9] = new Array();
		listItems[9][0] = Lp.getValue("CA_Version")+" : ";
		listItems[9][1] = info.ca_version;
		
		listItems[10] = new Array();
		listItems[10][0] = Lp.getValue("System_Version")+" : ";
		listItems[10][1] = info.system_version;
		
		listItems[11] = new Array();
		listItems[11][0] = Lp.getValue("Video_Function")+" : ";
		listItems[11][1] = info.video_function;
	}
	
	this.initView = function(){
		listDlg = UI.createGroup(self.listParam,"listDlg",self.win);
		listTable = listDlg.getChild("list_table");
		
		listTable.addItems(listItems);
		listTable.curIndex = PersonalSettingMenuPage_Index;
		self.win.update();
	};
	
	function getInfo(){

		var info={
			serial_number:"0000000000000000",
			mac:"00:00:00:00:00",
			hfc_mac:"00:00:00:00:00",
			wan_mac:"00:00:00:00:00",
			hard_version:"",
			soft_version:"",
			loader_version:"1",
			bouquet_id:"25149",
			smart_card_number:"00000000000000",
			ca_version:"",
			system_version:"3.10.40",//該C01.01(主版本，次版本)
			video_function:"裝置未就緒（代碼:PVR002）"//裝置未配對（代碼:PVR003）
		};

        var deviceInfo = utility.getDeviceInfo(false);
        if(deviceInfo){
        	info.mac = deviceInfo.mac;
        	info.hard_version = deviceInfo.hwVersion;
        	info.soft_version = deviceInfo.swVersion;
        	info.serial_number = deviceInfo.sn;
            info.system_version="C"+deviceInfo.swVersion;
            info.loader_version=deviceInfo.loaderversion;

		}
		//ca相关
		var ret = CA.getCardNo(false);
        if(ret.errorcode == 0){
            info.smart_card_number = ret.cardno;
		}
		//get bouquet id

        if(caCom && caCom.caParams) {
            info.bouquet_id  = ""+caCom.caParams.bouquetId ? caCom.caParams.bouquetId : sysCom.config.bouquetID;//sysCom.config.bouquetID;
        }
        else {
        	;
        }
        info.bouquet_id =""+parseInt(info.bouquet_id);
        //get HFC MAC and WLAN MAC
        var cminfo = CableModem.cmGetIpInfo(false);
        console.log("cminfo="+cminfo)
        if(cminfo) {
        	console.log("cminfo.hfcMac="+cminfo.hfcMac);
            var mac = cminfo.hfcMac.replace(/ /g, ":");
            if (mac.substr(mac.length - 1, 1) == ":") {
                mac = mac.substr(0, mac.length - 1);
            }
            info.hfc_mac = mac;
            info.wan_mac = mac;

          /*  var mac1 = cminfo.wanMac.replace(/ /g, ":");
            if (mac1.substr(mac1.length - 1, 1) == ":") {
                mac1 = mac1.substr(0, mac1.length - 1);
            }
            info.hfc_mac = mac1;*/
        }
       /////////////////////////////////////



		//get the CAK info
        var data = CA.getCasInfo(false);
        if (data && data.errorcode == 0) {
            info.ca_version = data.calibversion;
        }
        //get the HDD info

        usblists = FS.fsGetDiskInfo(false);
        console.log("usblists count="+usblists.length );
        if(!usblists || usblists.length <= 0)
        {
            console.log("Lp.HDDNoready" );
            info.video_function =  Lp.getValue("HDDNoready");
        }
        else {
           if(sysCom.config.PVRService == 0)
		   {
                console.log("1 Lp.HDDnopair" );

               info.video_function =  Lp.getValue( "HDDnopair");
		   }
		   else {
               for (var k = 0; k < usblists.length; k++) {
                   if (usblists[k].sn == sysCom.config.PVRPariedSn) {

                       break;
                   }
               }
               if(k == usblists.length)
			   {
                   console.log("2 Lp.HDDnopair" );
                   info.video_function =  Lp.getValue( "HDDnopair");
			   }
			   else
			   {
                   console.log("Lp.HDDready" );
                   info.video_function =  Lp.getValue( "HDDready");
			   }
           }
        }


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
        switch(e.keyCode)
        {
			case UI.KEY.BACKSPACE:
			self.go(PersonalSettingMenuPage);
				ret = true;
			break;
        }
        return ret;
    };
}
SystemInformationPage.prototype = UIModule.baseModule;

