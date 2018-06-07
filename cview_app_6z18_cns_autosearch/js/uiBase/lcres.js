
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


	];
    var userImgs = [


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