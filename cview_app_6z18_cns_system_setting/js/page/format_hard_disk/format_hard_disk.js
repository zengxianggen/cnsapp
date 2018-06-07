// JavaScript Document

function FormatHardDiskPage(params,srcModule)
{
    var self = this;

	var font1 = uiCom.font.F20;
	var font2 = uiCom.font.F25;
	var font3 = uiCom.font.F35;
	
	var color1 = "grey";
	var color2 = "white";
	
	var selectDlg;
    var formatcount = 0;
    var needmatcount = 0;
    var usblists;
    var formatting = false;
    this.dlgParam =  [
        //{uiType:UIFrame,id:"page_bk",l:0,t:0,w:1280,h:720,type:"hole"},
		 {uiType:UIFrame,id:"page_bk",l:0,t:0,w:1280,h:720,styleClass:"None"},
    ];
	
	var width_frame = 330;
	var height_frame = 200;
	var top_frame = 200;
	
	var width_item = width_frame*0.915;
	var height_item = 40;
	
	var left_itme = (width_frame - width_item)/2;
	var top_item = 63;
	
	var selectParam = [
		{uiType:UIFrame,id:"bk",w:width_frame,h:height_frame,l:(1280 - width_frame)/2,t:top_frame,styleClass:"system_setting_bk",focusMoveMode:"circle",visibility:1},
		{uiType:UILabel,w:width_frame,h:50,ol:0,ot:2,dt:10,HAlign:"center",font:font2,value:Lp.getValue("Format_Hard_Disk")},
		
		{uiType:UIButton,id:"full_format",w:width_item,h:height_item,ol:left_itme,ot:top_item,dt:5,value:Lp.getValue("Full_Format"),HAlign:"center",font:font1,onFocus:true,styleClass:"setting_button_item1"},
		
		{uiType:UIButton,id:"low_level_format",w:width_item,h:height_item,ol:left_itme,ot:top_item+height_item,dt:5,value:Lp.getValue("Low_Level_Format"),HAlign:"center",font:font1,styleClass:"setting_button_item1"},
		
		{uiType:UIImg,w:60,h:22,ol:70,ot:height_frame-40+2,src:"setting/ico_ok"},
		{uiType:UILabel,w:200,h:30,ol:70+46,ot:height_frame-40+3,value:Lp.getValue("OK"),font:font1},
		{uiType:UIImg,w:60,h:22,ol:180,ot:height_frame-40+1,src:"setting/ico_back"},
		{uiType:UILabel,w:80,h:30,ol:170+66,ot:height_frame-40+3,value:Lp.getValue("UP_Page"),font:font1}
	];
	
	
	
	this.initData = function() {

        isRestored = 0;

        eventCom.registerCallback(6,
            function (obj) {
                console.log("[changhog] FORMAT handleEvent=" + obj.code);
                console.log("HDD process=" + obj.data.current);
                console.log("HDD process=" + obj.data.total);
                switch (obj.code) {

                    case eventCom.EVENTCODE.CS_EVT_FS_FORMAT:

                        if (obj.data.current == 100) {
                            formatcallback();
                        }
                        break;
                }


            });
    };
	this.initView = function(){
		selectDlg = UI.createGroup(selectParam,"selectDlg",self.win,null,null,input_proc);
	}
	
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


    function showLoadingDlg( ){
        self.formartDialog = new LoadingDialog();
        self.formartDialog.create();
        var dialogTitle = Lp.getValue("Formatting") ;
        self.formartDialog.show(dialogTitle);
        self.win.update();
    }

    function hideLoadingDlg( ){

        self.formartDialog.hide();
        self.win.update();
    }

    function formatcallback(){

        formatcount++;

        if(formatcount >= needmatcount)
		{
            formatting = false;
            hideLoadingDlg();
		}
	}

	function showtips(tips)
	{
        var p1 = {
            title: Lp.getValue("Format_Hard_Disk"),

            timeout:4*1000,
            background: "../cview_app_common_pic/password_bg.png",


        };
        var p2 = {
            text: Lp.getValue(tips)
        };
        var dia = new Dialog(p1);
        dia.show(p2);
	}

	function fullFormat(){

        console.log("fullFormat test");
		 usblists = FS.fsGetDiskInfo(false);
        console.log("usblists count="+usblists.length );
		if(!usblists || usblists.length <= 0)
		{
            selectDlg.hide();
			showtips("HDDNoready");
            window.setTimeout(selectDlgShow,4000);
            console.log("HD not ready");
			return ;
		}
        formatting = true;
        showLoadingDlg( );
        formatcount = 0;
        needmatcount =0;
		for(var k = 0;k<usblists.length;k++ )
		{
			if(usblists[k].sn!="00000000") {
                needmatcount++;
                fsCom.formatdisk(usblists[k].disk, false);
            }
		}
	}
    function selectDlgShow(){
        selectDlg.show();
    }
    function lowLevelFormat(){

        selectDlg.hide();
        showtips("Noready");
        window.setTimeout(selectDlgShow,4000);
        console.log("lowLevelFormat");
        return ;
		
	}
	
	function keyEnter(){
		var id = UI.focusWin.id;
		if(id == "full_format"){
			fullFormat();
		}
		else{
			lowLevelFormat();
		}
	}
	
	
	function input_proc(e){
		console.log("input_proc key");
		var ret = false;
		if(  formatting == true)
			return;
        switch(e.keyCode)
        {
            case UI.KEY.ENTER:
				ret = true;
				keyEnter();
			break;
			case UI.KEY.BACKSPACE:
				ret = true;
				self.go(SystemSettingMenuPage);
			break;
        }
        return ret;
	}
	

	
	
}
FormatHardDiskPage.prototype = UIModule.baseModule;
