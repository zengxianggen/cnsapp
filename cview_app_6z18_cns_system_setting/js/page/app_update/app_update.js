// JavaScript Document

function AppUpdatePage(params,srcModule)
{
    var self = this;

	var font1 = uiCom.font.F20;
	var font2 = uiCom.font.F25;
	var font3 = uiCom.font.F35;
	
	var color1 = "grey";
	var color2 = "white";
	
	var queryDlg;

	var width_frame = 460;
	var height_frame = 230;
	var top_frame = 200;
	
	var width_title = width_frame*0.4;
	var width_con = width_frame*0.5;
	
	var height_item = 50;
	var height_title = 30;
	var height_con = height_title;
	
	var top_title = 90;
	var top_con = top_title-6;
	var left_title = 10;
	var left_con = left_title + width_title + 2;

	var updating = false;
    var updatingimer  = null;

    this.dlgParam =  [
        {uiType:UIFrame,id:"page_bk",l:0,t:0,w:1280,h:720,type:"hole"},
        //{uiType:UIFrame,id:"page_bk",l:0,t:0,w:1280,h:720,type:"img",imgNames:["setting/default_background"]},
    ];
	var queryParam = [
		{uiType:UIFrame,id:"bk",w:width_frame,h:height_frame,l:(1280 - width_frame)/2,t:top_frame,styleClass:"system_setting_bk",focusMoveMode:"circle",visibility:0},
		{uiType:UILabel,id:"title",w:width_frame,h:50,ol:0,ot:2,dt:10,HAlign:"center",font:font2,value:Lp.getValue("app_update")},
		
		{uiType:UILabel,id:"content",w:width_title+180,h:height_title,ol:left_title,ot:top_title,value:Lp.getValue("AppUpdateContent"),HAlign:"center",font:font1},
	
	
		{uiType:UIImg,w:60,h:22,ol:130,ot:height_frame-40,src:"setting/ico_ok"},
		{uiType:UILabel,w:80,h:30,ol:130+56,ot:height_frame-40+3,value:Lp.getValue("Ok"),font:font1},
		{uiType:UIImg,w:60,h:22,ol:280,ot:height_frame-40+1,src:"setting/ico_back"},
		{uiType:UILabel,w:80,h:30,ol:270+56,ot:height_frame-40+3,value:Lp.getValue("Up_Page"),font:font1}
	];

	
	this.initData = function(){

	};

	this.initView = function(){


		queryDlg = UI.createGroup(queryParam,"queryDlg",self.win,null,null,query_proc);


		console.log("initView queryDlg="+queryDlg);
        showQueryFirstDlg();

	};
	
	function showQueryFirstDlg(){
		queryDlg.visibility = 1;
        queryDlg.getChild("content").value =Lp.getValue("AppUpdateContent");
        self.win.update();
	}

    function UpdateLoadingDialog(){

        var fontTitle = uiCom.font.F22;

        var width_dialog = 360;
        var height_dialog = 200;

        var left_dialog = (UI.width-width_dialog)/2;
        var top_dialog = 260;

        var top_title = 10;

        var width_img = 86;
        var height_img = 86;

        var left_img = left_dialog+(width_dialog-width_img)/2;
        var top_img = top_dialog+66;

        var mainDlg;
        var imgDlg;

        var uiParam = [
            {uiType:UIFrame,w:width_dialog,h:height_dialog,l:left_dialog,t:top_dialog,type:"9img",cls:"dialog/frameBlueBg",visibility:0},
            {uiType:UILabel,id:"title",w:width_dialog,h:50,ol:0,ot:6,font:fontTitle,value:Lp.getValue("app_update"),HAlign:"center"}
        ]

        this.create = function(parentDlg){
            mainDlg = UI.createGroup(uiParam,"mainDlg",parentDlg,null,null,proc);
            createImg();
        };

        function createImg(){
            var body = document.getElementsByTagName('body')[0];
            imgDlg = document.getElementById("loading_img");
            if(!imgDlg){
                imgDlg = document.createElement("img");
                imgDlg.setAttribute("id", "loading_img");
                imgDlg.style.position = "absolute";
                imgDlg.style.left = left_img;
                imgDlg.style.top = top_img;
                imgDlg.style.width = width_img;
                imgDlg.style.height = height_img;
                body.appendChild(imgDlg);
            }

            imgDlg.src = "./black/setting/loading.gif";
            imgDlg.style.visibility = "hidden";


        }

        this.show = function(title){
            if(title){
                mainDlg.getChild("title").value = title;
            }
            mainDlg.visibility = 1;
            imgDlg.style.visibility = "visible";
            mainDlg.update();
        };
        this.hide = function(){
            mainDlg.visibility = 0;
            imgDlg.style.visibility = "hidden";
        };

        function proc(e){

        };

    }

    function showQueryResultDlg( result){

        queryDlg.visibility = 1;
        if(result == -1 )
           queryDlg.getChild("content").value =Lp.getValue("AppUpdateFail");
        else {
            sysCom.setMemConfig("current_app_list",[]);
            sysCom.setMemConfig("apprenew",1);//強制列表不存在，需要重新獲取
            queryDlg.getChild("content").value = Lp.getValue("AppUpdateSuccess");
        }

        self.win.update();
    }

    function showLoadingDlg( ){
        self.UpdateDialog = new LoadingDialog();
        self.UpdateDialog.create();
        var dialogTitle = Lp.getValue("AppUpdating") ;
        self.UpdateDialog.show(dialogTitle);
        self.win.update();
    }

    function hideLoadingDlg( ){

        self.UpdateDialog.hide();
    }
    this.open = function(){
    	console.log("AppUpdatePage 1");
		this.initData();
        this.defOpen();
        console.log("AppUpdatePage 2");
		this.initView();
        console.log("AppUpdatePage 3");
    };

    this.close = function(){
        this.defClose();
    };

    this.start = function(){
    };

    this.UpdateStatusTimer = function(){

        var update_ret = AppManager.getStaus(false);
        console.log("update_ret="+update_ret);
        if(update_ret != 1) {
            hideLoadingDlg();
            showQueryResultDlg(update_ret);
            self.updating = false;
        }
    }

    this.onkey = function(e)
    {
        var ret = false;

        if(self.updating == true)
        {
            return ret;
        }
        switch(e.keyCode)
        {

            case UI.KEY.ENTER:
                self.updating = true;
                 console.log("onkey 1");
                 showLoadingDlg();
                 AppManager.forceUpdate(false);
                 self.updatingimer= setInterval(self.UpdateStatusTimer,2000);
                 console.log("onkey 4");
			     break;
			case UI.KEY.BACKSPACE:
                if(self.updatingimer) {
                    clearInterval(self.updatingimer);
                    self.updatingimer = null;
                }
			      self.go(SystemSettingMenuPage);
			break;
        }
        return ret;
    };
	
	
	function query_proc(e){
		var ret = false;
        switch(e.keyCode)
        {
            case UI.KEY.ENTER:
				break;
			case UI.KEY.BACKSPACE:
			    //  self.go(SystemSettingMenuPage);
			break;
        }
        return ret;
	};

}
AppUpdatePage.prototype = UIModule.baseModule;
