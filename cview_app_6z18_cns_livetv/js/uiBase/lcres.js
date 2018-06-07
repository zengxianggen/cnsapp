
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
    UI.set("frameLength",50);
    UI.set("ctx",gctx);
    UI.set("res",res);
    UI.start();

    return res;
}

function resLoader(res,endProc){

    res.loadImgGroup("3imgh","live/bluebar");

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
        "dialog/volumn_bar.png"
	];
    var userImgs = [
        //live
        "live/audio_background.jpg",
        "live/icon_fav.png",
        "live/ico_green.png",
        "live/ico_language.png",
        "live/ico_lock.png",
        "live/ico_dolby.png",
        "live/HD.jpg",
        "live/ico_ok.png",
        "live/ico_pay.png",
        "live/ico_red.png",
        "live/ico_sound.png",
        "live/ico_star.png",
        "live/ico_playpause.png",
        "live/mute.png",
        "live/PF_bg.png",
        "live/PF_profile_bottom.png",
        "live/PF_profile_middle.png",
        "live/PF_profile_top.png",
        "live/srcollbar_back_pic.png",
        "live/srcollbar_front_pic.png",
        "live/volumn_bar.png",
        "live/volumn_oneBar.png",
        "live/channel_list_bk.png",
        "live/bat_select.png",
        "live/ico_back.png",
        "live/pf_banner.png",
        "live/ico_home.png",
        "live/process_back_bg.png",
        "live/process_front_bg.png",
        "live/audio_track_bg.png",
        "live/subtitleBg_280x40.png",
        "live/record_icon.png",

        //epg Rate
        "level/ico_pu.png",
        "level/ico_hu.png",
        "level/ico_fu12.png",
        "level/ico_fu15.png",
        "level/ico_bao.png",
        "level/ico_xian.png",
        "level/ico_cheng.png",

            //num
        "live/num/one.png",
        "live/num/two.png",
        "live/num/three.png",
        "live/num/four.png",
        "live/num/five.png",
        "live/num/six.png",
        "live/num/seven.png",
        "live/num/eight.png",
        "live/num/nine.png",
        "live/num/zero.png"
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