/**
 * Created by tony_vopo on 2016/9/7.
 */
var PersonalSettingMenuPage_Index = 0;
function PersonalSettingMenuPage(params,srcModule)
{
    var self = this;
    // constructor
    // Constructed end
	
	var width_List = 430;
	var height_list = 530;
	
	var width_table = width_List - 40;
	
	var font1 = uiCom.font.F18;
	var font2 = uiCom.font.F22;
	var font3 = uiCom.font.F35;
	
	var color1 = "grey";
	var color2 = "white";
	
	var listDlg;
	var listTable;
	
	var listItems;

    this.dlgParam =  [
        {uiType:UIFrame,id:"page_bk",l:0,t:0,w:1280,h:720,type:"hole"},
		 //{uiType:UIFrame,id:"page_bk",l:0,t:0,w:1280,h:720,type:"img",imgNames:["setting/default_background"]},
    ];
	
	this.listParam = [
		{uiType:UIFrame,id:"list_bk",l:(1280 - width_List)/2,t:90,w:width_List,h:height_list,styleClass:"system_setting_bk"},
		{uiType:UILabel,w:width_List,h:50,ol:0,ot:2,dt:10,HAlign:"center",font:font3,value:Lp.getValue("Personal_Settings")},
		{uiType:UITable,id:"list_table",w:width_table,h:height_list*0.78,ol:(width_List-width_table)/2,ot:60,lineRectWidth:0,lineHWidth:0,lineVWidth:0,lineColor:"#505050", cols:1,rows:9,rowsOnePage:9,HAlign:"center",dl:0,color:color1,focusColor:color2,font:font2,
		skin:{
				normalBar:{type:"none"},
				focusBar:{type:"img",imgNames:["setting/subNav_selecteditemBg"],stretch:"HV",},
			}
		},
		{uiType:UIImg,w:36,h:22,ol:100,ot:height_list-40,src:"setting/ico_ok"},
		{uiType:UILabel,w:50,h:30,ol:100+40,ot:height_list-40+3,value:Lp.getValue("Ok"),font:font1},
		{uiType:UIImg,w:60,h:22,ol:100+40+50+50,ot:height_list-40,src:"setting/ico_back"},
		{uiType:UILabel,w:80,h:30,ol:100+40+50+50+62,ot:height_list-40+3,value:Lp.getValue("Up_Page"),font:font1}
	];
	
	this.initData = function(){
		listItems = new Array();
		listItems[0] = new Array();
		listItems[0][0] = Lp.getValue("Parent_Child_Channel_Lock");
		listItems[0][1] = LockMenuPage;
		
		listItems[1] = new Array();
		listItems[1][0] = Lp.getValue("Personal_Authentication_Code");
		listItems[1][1] = PersonalPasswordPage;
		
		listItems[2] = new Array();
		listItems[2][0] = Lp.getValue("Language_And_Messaging_Settings");
		listItems[2][1] = LanguageInformationPage;


        listItems[3] = new Array();
        listItems[3][0] = Lp.getValue("Screen_And_Sound_Settings");
        listItems[3][1] = ScreenSoundPage;

		listItems[4] = new Array();
		listItems[4][0] = Lp.getValue("Subtitle_Setting");
		listItems[4][1] = SubtitleSettingPage;
		

		
		/*listItems[5] = new Array();
		listItems[5][0] = Lp.getValue("Video_Function");
		listItems[5][1] = VideoFunctionPage;
		*/
		listItems[5] = new Array();
		listItems[5][0] = Lp.getValue("Channel_Search");
		listItems[5][1] = ScanChannelPage;
		
		listItems[6] = new Array();
		listItems[6][0] = Lp.getValue("Network_Settings");
		listItems[6][1] = CMSettingMenuPage;
		
		listItems[7] = new Array();
		listItems[7][0] = Lp.getValue("System_Information");
		listItems[7][1] = SystemInformationPage;
	};


    this.initData = function(){
        listItems = new Array();
        listItems[0] = new Array();
        listItems[0][0] = Lp.getValue("Parent_Child_Channel_Lock");
        listItems[0][1] = null;

        listItems[1] = new Array();
        listItems[1][0] = Lp.getValue("Personal_Authentication_Code");
        listItems[1][1] = null;

        listItems[2] = new Array();
        listItems[2][0] = Lp.getValue("Language_And_Messaging_Settings");
        listItems[2][1] = null;


        listItems[3] = new Array();
        listItems[3][0] = Lp.getValue("Screen_And_Sound_Settings");
        listItems[3][1] = null;

        listItems[4] = new Array();
        listItems[4][0] = Lp.getValue("Subtitle_Setting");
        listItems[4][1] = null;



        /*listItems[5] = new Array();
        listItems[5][0] = Lp.getValue("Video_Function");
        listItems[5][1] = VideoFunctionPage;
        */
        listItems[5] = new Array();
        listItems[5][0] = Lp.getValue("Channel_Search");
        listItems[5][1] = null;

        listItems[6] = new Array();
        listItems[6][0] = Lp.getValue("Network_Settings");
        listItems[6][1] = null;

        listItems[7] = new Array();
        listItems[7][0] = Lp.getValue("System_Information");
        listItems[7][1] = null;
    };
    this.initDataPage = function(){
        if(listItems[0][1] == null) {
            listItems[0][1] = LockMenuPage;


            listItems[1][1] = PersonalPasswordPage;


            listItems[2][1] = LanguageInformationPage;


            listItems[3][1] = ScreenSoundPage;


            listItems[4][1] = SubtitleSettingPage;


            /*
            listItems[5][1] = VideoFunctionPage;
            */

            listItems[5][1] = ScanChannelPage;


            listItems[6][1] = CMSettingMenuPage;


            listItems[7][1] = SystemInformationPage;
        }
    };
	this.initView = function(){
		listDlg = UI.createGroup(self.listParam,"listDlg",self.win);
		listTable = listDlg.getChild("list_table");
		
		listTable.addItems(listItems);
		listTable.curIndex = PersonalSettingMenuPage_Index;
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
		console.log("key_return index == "+index);
		switch(index){
			case 0:
			case 3:
			case 5:
			case 6:
			//case 7:
			var passwd = sysCom.config.ParentalPin;
			var p = {
						 win:self.win,
						 rightPasswd:passwd,
						 titleCont:Lp.getValue("Please_Input_Parent_Password"),
						 rightDo:function(){
							var page = listItems[index][1];
							self.go(page);
						},
						backDo:function(){
							listTable.setFocus(true);
						}
					 };
					 var pd = new PasswdDialog(p);
					 pd.show();
			
			break;
			case 1:
			var passwd = sysCom.config.PersonalAuthenticationPin;
			var p = {
						 win:self.win,
						 rightPasswd:passwd,
						 titleCont:Lp.getValue("Please_Input_Persional_Password"),
						 rightDo:function(){
							var page = listItems[index][1];
							self.go(page);
						},
						backDo:function(){
							listTable.setFocus(true);
						}
					 };
					 var pd = new PasswdDialog(p);
					 pd.show();
			break;
			default:
				var page = listItems[index][1];
				self.go(page);
			break;
		}
	};

    this.onkey = function(e)
    {
        var ret = false;
        switch(e.keyCode)
        {
            case UI.KEY.ENTER:
				PersonalSettingMenuPage_Index = listTable.curIndex;
                self.initDataPage();
				self.key_return();
			break;
			case UI.KEY.BACKSPACE:
				PersonalSettingMenuPage_Index = 0;
				appCom.goAppByName("tvportal",true);
			break;

			case UI.KEY.FUNRED:
				/*console.log("FUNRED");
                utility.cnsCreateFile("/ch_flash_data/fctflag.txt",function(){
                    Utility.reboot(false);
				});
				ret = true;*/
            	break;
        }
        return ret;
    };
}
PersonalSettingMenuPage.prototype = UIModule.baseModule;

