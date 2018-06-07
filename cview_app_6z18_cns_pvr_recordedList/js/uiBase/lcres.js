
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

        //epg level
        "level/ico_pu.png",
        "level/ico_hu.png",
        "level/ico_fu12.png",
        "level/ico_fu15.png",
        "level/ico_bao.png",
        "level/ico_xian.png",
        "level/ico_cheng.png",

        //video frame
        "video/DBC_background_picture.jpg",
        "video/eventLocked.jpg",
        "video/no_certification.jpg",
        "video/no_smartCard.jpg",
        "video/noSign.jpg"

	];
    var userImgs = [
        //recordingByTime
        "user/pvrScheT_background.jpg",
        "user/channelList_bg_345x536.png",
        "user/eventList_bg_820x536.png",
        "user/folderList_bg_820x500.png",
        "user/title_bg.png",

        "user/ico_back.png",
        "user/ico_blue.png",
        "user/ico_ok.png",
        "user/ico_red.png",
        "user/ico_yellow.png",
        "user/ico_infoKey.png",
        "user/ico_folder.png",

        "user/recordWayBtn_highlight.png",
        "user/recordWayBtn_normal.png",

        "user/epgList_markselected.png",
        "user/epgList_selected.png"

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