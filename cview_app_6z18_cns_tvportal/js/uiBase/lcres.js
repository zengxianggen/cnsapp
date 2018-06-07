
function resInit(){

    var gctx = document.getElementById("canvasMain").getContext("2d");

    var path = "";

    var res = new UIRes(path+"black/");
    UI.set("frameLength",30);
    UI.set("ctx",gctx);
    UI.set("res",res);
    UI.start();
    return res;
}

function resLoader(res,endProc){

    //res.loadImgGroup("3imgh","live/bluebar");
    res.loadImgGroup("9img","setting/bootSetBg");
    res.loadImgGroup("3imgh","setting/greybar");
    res.loadImgGroup("3imgh","setting/bluebar");
	var defaultImgs = [
        //dialog
        "dialog/dialog_bg.png",
        "dialog/password_bg.png",
        "dialog/password_bg1.png",
        "dialog/password_inputBox.png",
        "dialog/password_inputBox1.png",
        "dialog/ico_ok.png",
        "dialog/ico_back.png",

        //video
        "TipImg/no_certification.jpg",
        "TipImg/no_smartCard.jpg",
        "TipImg/noSign.jpg",
        "TipImg/EPG_eventLocked.jpg",

        //volume
        "dialog/ico_sound.png",
        "dialog/mute.png",
        "dialog/volumn_bar.png"
	];
    var userImgs = [
        "tvportal/BBTV_logo.png",
    /*    "tvportal/ico_wifi_1.png",
        "tvportal/ico_wifi_2.png",
        "tvportal/ico_wifi_3.png",
        "tvportal/ico_wifi_4.png",
        "tvportal/ico_wifi_5.png",
        "tvportal/ico_wifi_6.png",
        "tvportal/ico_wifi_7.png",
        "tvportal/ico_wifi_8.png",*/
        "tvportal/icon_ethernet.png",
        "tvportal/icon_ethernet_warning.png",
        "tvportal/live_tv.png",
        "tvportal/next.png",
        "tvportal/ok.png",
        "tvportal/previous.png",
        "tvportal/AD_mainmenu.jpg",

        "setting/grey_select_bar.png",
        "setting/blue_select_bar.png",
        "setting/process_back_bg.png",
        "setting/process_front_bg.png",
        "setting/icon_search.png"
    ];

	var imgs = defaultImgs.concat(userImgs);

    res.load(imgs,endProc);
}

function resUserRegister(res){

}

function resDefaultRegister(res){
    res.set("system_setting_bk",{type:"9img",cls:"setting/bootSetBg"});
    res.set("setting_select_item",{font:uiCom.font.F22,skin:{normal:{type:"img",imgNames:["setting/grey_select_bar"],stretch:"HV"},focus:{type:"img",imgNames:["setting/blue_select_bar"],stretch:"HV"}}});
    res.set("setting_edit_item",{font:uiCom.font.F22,skin:{normal:{type:"3imgh",cls:"setting/greybar",stretch:"HV"},focus:{type:"3imgh",cls:"setting/bluebar",stretch:"HV"}}});

    res.set("setting_progress",{
        skin:{
            barRect: {type:"img",imgNames:["setting/process_back_bg"],stretch:"HV"},
            progRect:{type:"img",imgNames:["setting/process_front_bg"],stretch:"HV"}
        }
    });
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