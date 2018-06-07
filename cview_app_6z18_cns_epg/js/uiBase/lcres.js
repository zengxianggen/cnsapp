
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
    

	var defaultImgs = [
        //dialog
        "dialog/dialog_bg.png",
        "dialog/password_bg.png",
        "dialog/password_bg1.png",
        "dialog/password_inputBox.png",
        "dialog/password_inputBox1.png",
        "dialog/ico_ok.png",
        "dialog/ico_back.png",

        //volume
        "dialog/ico_sound.png",
        "dialog/mute.png",
        "dialog/volumn_bar.png",

        //video
        "TipImg/DBC_background_picture.jpg",
        "TipImg/EPG_eventLocked.jpg",
        "TipImg/EPG_no_certification.jpg",
        "TipImg/EPG_no_smartCard.jpg",
        "TipImg/EPG_noSign.jpg"
	];
    var userImgs = [
        //epg
		"epg/epg_background.jpg",

        "epg/channelGroup_markselected.png",
        "epg/channelList_markselected.png",
        "epg/epgList_markselected.png",
        "epg/weeklyDate_markselected.png",

        "epg/channelGroup_selected.png",
        "epg/channelList_selected.png",
        "epg/epgList_selected.png",
        "epg/weeklyDate_selected.png",

        "epg/ad_frame.png",
        "epg/video_frame.png",

        "epg/ico_back.png",
        "epg/ico_green.png",
        "epg/ico_ok.png",
        "epg/ico_red.png",
        "epg/ico_REC.png",
        "epg/ico_yellow.png",
        "epg/ico_blue.png",
        "epg/ico_clock.png",
        "epg/ico_lock.png",
        "epg/ico_star.png",
        "epg/ico_leftArrow.png",
        "epg/ico_rightArrow.png",
        "epg/ico_once_record.png",
        "epg/ico_series_record_byTime.png",
        "epg/ico_recording.png",

        "level/ico_pu.png",
        "level/ico_hu.png",
        "level/ico_fu12.png",
        "level/ico_fu15.png",
        "level/ico_bao.png",
        "level/ico_xian.png",
        "level/ico_cheng.png",

        "epg/EPG_eventLocked.jpg",
        "epg/EPG_no_certification.jpg",
        "epg/EPG_no_smartCard.jpg",
        "epg/EPG_noSign.jpg",

        "epg/AD_sanple.jpg",
        "epg/channel_focus.jpg",

        "epg/pop_up_bg_302x162.png",
        "epg/popUp_itemBg_highlight.png",
        "epg/popUp_itemBg_normal.png",

        "epg/reminder_background.jpg"
    ];

	var imgs = defaultImgs.concat(userImgs);
    res.load(imgs,endProc);
}
function resUserRegister(res){
    
}

function resDefaultRegister(res){

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
