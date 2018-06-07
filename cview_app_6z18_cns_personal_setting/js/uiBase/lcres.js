
function resInit(){

    var gctx = document.getElementById("canvasMain").getContext("2d");

    var path = "";
    /*if(sysCom.memConfig)
    {
        var app = appCom.getAppInfoById(sysCom.memConfig.current_app_id);

        path = DtvCall.file+app.install_url+"/"+app.launch_app_name +"/";
    }
    else
    {
        path = DtvCall.file+"/data/app/cview_app_6z18_cns_tvportal/";
    }*/

    var res = new UIRes(path+"black/");
    UI.set("frameLength",30);
    UI.set("ctx",gctx);
    UI.set("res",res);
    UI.start();

    return res;
}

function resLoader(res,endProc){
    //setting
	res.loadImgGroup("3imgh","setting/bluebar");
	res.loadImgGroup("3imgh","setting/greybar");
	res.loadImgGroup("3imgv","setting/systemSetFrame");
	res.loadImgGroup("3imgv","setting/systemSetLeftGrey");
	res.loadImgGroup("3imgv","setting/systemSetLeftBlue");
	res.loadImgGroup("3imgv","setting/systemSetRightGrey");
	res.loadImgGroup("3imgv","setting/systemSetRightBlue");
	
	res.loadImgGroup("9img","setting/bootSetBg");
	res.loadImgGroup("9img","dialog/frameBlueBg");

	var defaultImgs = [
        //dialog
        "dialog/password_bg.png",
        "dialog/password_bg1.png",
        "dialog/password_inputBox.png",
        "dialog/password_inputBox1.png",
        "dialog/ico_ok.png",
        "dialog/ico_back.png",
        "dialog/dialog_bg.png",

        //volume
        "dialog/ico_sound.png",
        "dialog/mute.png",
        "dialog/volumn_bar.png",

        //video frame
        "video/DBC_background_picture.jpg",
        "video/eventLocked.jpg",
        "video/no_certification.jpg",
        "video/no_smartCard.jpg",
        "video/noSign.jpg"

	];
    var userImgs = [
        //system_setting
		"setting/blue_select_bar.png",
		"setting/grey_select_bar.png",
		"setting/process_back_bg.png",
		"setting/process_front_bg.png",
		"setting/ico_red.png",
		"setting/ico_yellow.png",
		"setting/ico_blue.png",
		"setting/ico_rightArrow.png",
		"setting/ico_back.png",
		"setting/icon_search.png",
		"setting/ico_ok.png",
		"setting/subNav_selecteditemBg.png",
		"setting/default_background.jpg",
		"setting/ico_four_direction_dark.png",
		"setting/docsis_ico_gray.png",
		"setting/docsis_ico_green.png",
		
		"setting/right_green.png",
		"dialog/dialogue_bg.png",
		"setting/ico_wifi_1.png",
		"setting/ico_wifi_2.png",
		"setting/ico_wifi_3.png",
		"setting/ico_wifi_4.png",
		"setting/ico_wifi_5.png",
		"setting/ico_wifi_6.png",
		"setting/ico_wifi_7.png",
		
		"setting/tab_bg_current.png",
		"setting/tab_bg_dark.png",
		"setting/loading.gif",
		"setting/ico_lock.png",
		"setting/select1_blue.png",
		"setting/select2_blue.png",
		"setting/select1_grey.png",
		"setting/select2_grey.png"
    ];

	var imgs = defaultImgs.concat(userImgs);
    res.load(imgs,endProc);
}
function resUserRegister(res){
	
	res.set("not_select_bk",{skin:{normal:{type:"img",imgNames:["setting/select1_grey"],stretch:"HV"},focus:{type:"img",imgNames:["setting/select1_blue"],stretch:"HV"}}});
	res.set("select_bk",{skin:{normal:{type:"img",imgNames:["setting/select2_grey"],stretch:"HV"},focus:{type:"img",imgNames:["setting/select2_blue"],stretch:"HV"}}});
	
	res.set("rect_white_bk",{type:"rect",color:"white"});
	res.set("block_black_bt",{type:"block",color:"black"});
	res.set("yellow_block_bk",{type:"block",color:"#FF8800"});
	res.set("green_block_bk",{type:"block",color:"#51cc71"});
        //main
	res.set("system_setting_bk",{type:"9img",cls:"setting/bootSetBg"});

	//scan channel
	res.set("setting_dialog_bk",{type:"3imgv",cls:"setting/systemSetFrame"});
	res.set("setting_dialog_bk_blue",{type:"img",imgNames:["dialog/dialogue_bg"],stretch:"HV"});
	
	res.set("dialog_tips",{type:"img",imgNames:["dialog/dialogue_bg"],stretch:"HV"});
	res.set("dialog_select",{type:"img",imgNames:["dialog/dialogue_bg"],stretch:"HV"});
	
	res.set("item_label_bk",{type:"3imgh",cls:"setting/greybar",stretch:"HV"});
	
	res.set("setting_button_item1",{font:uiCom.font.F22,skin:{normal:{type:"none"},focus:{type:"3imgh",cls:"setting/bluebar",stretch:"HV"}}});
	res.set("setting_edit_item",{font:uiCom.font.F22,skin:{normal:{color:"white",type:"3imgh",cls:"setting/greybar",stretch:"HV"},focus:{type:"3imgh",cls:"setting/bluebar",stretch:"HV"}}});
	res.set("setting_select_item",{font:uiCom.font.F22,skin:{normal:{type:"img",imgNames:["setting/grey_select_bar"],stretch:"HV"},focus:{type:"img",imgNames:["setting/blue_select_bar"],stretch:"HV"}}});
	
	res.set("scan_opereation_list",{type:"img",imgNames:["setting/dialog_default1"],stretch:"HV"});
	
	res.set("setting_progress",{
        skin:{
            barRect: {type:"img",imgNames:["setting/process_back_bg"],stretch:"HV"},
            progRect:{type:"img",imgNames:["setting/process_front_bg"],stretch:"HV"}
        }
    });
	
	res.set("tab_current_bk",{skin:{normal:{type:"img",imgNames:["setting/tab_bg_current"],stretch:"HV"},focus:{type:"none"}}});
	
	res.set("tab_dark_bk",{skin:{normal:{type:"img",imgNames:["setting/tab_bg_dark"],stretch:"HV"},focus:{type:"none"}}});
	
}

function resDefaultRegister(res){
	res.set("None",{type:"none"});
    res.set("hole",{type:"hole"});
}


function starter(endProc){
    var res = resInit();
    resLoader(res,function(num)
	{
        resDefaultRegister(res);
		resUserRegister(res);
        endProc(num);
    });
}