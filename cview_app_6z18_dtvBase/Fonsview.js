


/**
 * Created by zengxianggen on 2017/9/23.
 */

 
 
function Fonsview() {

    var self = this;
    //Event
    this.Event = {};


    //MediaPlayer
    this.player = {

        handle : null,
        duration : 0,
        playUrl : "",
        createjsonParam:"",
        startjsonParam:"",

        create : function (jsonParam) {
            console.log("[changhog] STB MediaPlayer create jsonParam="+jsonParam);
            createjsonParam = jsonParam;
            var mp = new MPlayer(1);
            handle = mp;
            return mp;
        },


        destroy : function (mhandle) {
            console.log("[changhog] STB  MediaPlayer destroy");
            if(mhandle !=handle ) {
                console.log("[changhog] STB destroy handle invalid");
                return -1;
            }
            return mhandle;
        },

        start : function (mhandle,jsonParam) {
            console.log("[changhog] STB MediaPlayer play jsonParam = "+jsonParam);
            if(mhandle !=handle ) {
                console.log("[changhog] STB Start handle invalid");
                return -1;
            }

            if(handle == mhandle)
            {

                startjsonParam = jsonParam;
                var jsonobj = JSON.parse(startjsonParam);
                console.log("mpStart="+jsonobj.url);

                handle.mpStop(false);

                var ret = handle.mpStart(jsonobj["url"],false);

                var volume = jsonobj.volume;
                    console.log("mpStart volume="+volume);
                 handle.mpSetVolume(volume);
                
                
                var type =   jsonobj.type;

            }
            return mhandle;
        },


        stop : function (mhandle) {
            console.log("[changhog] STB MediaPlayer stop");
            if(mhandle !=handle ) {
                console.log("[changhog] STB stop handle invalid");
                return -1;
            }
            if(handle)
            {
                var ret = handle.mpStop(false);
            }
            return 0;
        },

        pause : function (mhandle) {
            console.log("[changhog]STB  MediaPlayer pause");
            if(mhandle !=handle ) {
                console.log("[changhog] STB pause handle invalid");
                return -1;
            }
            if(handle)
            {
                var ret = handle.mpPause(false);
            }
            return 0;
        },

        resume : function (mhandle ) {
            console.log("[changhog] STB MediaPlayer resume");
            if(mhandle !=handle ) {
                console.log("[changhog] STB resume handle invalid");
                return -1;
            }
            if(handle)
            {
                var ret = handle.mpResume(false);
            }
            return 0;
        },

        forward : function (mhandle,speed) {
            console.log("[changhog] STb MediaPlayer forward");
            if(mhandle !=handle ) {
                console.log("[changhog] STB forward handle invalid");
                return -1;
            }
            if(handle)
            {
                var ret = handle.mpSpeed(speed,false);
            }
            return 0;
        },



        seek : function (mhandle,seconds) {
            console.log("[changhog] STb MediaPlayer seek");
            if(mhandle !=handle ) {
                console.log("[changhog] STB seek handle invalid");
                return -1;
            }
            if(handle)
            {
                var ret = handle.mpSeek(seconds,false);

            }
            return 0;
        },

        getMute : function () {
            console.log("[changhog] STB MediaPlayer getMute");
            if(handle)
            {
                var ret = handle.mpGetMute(false);

                return ret ? true : false;

            }
            return 0;
        },


        mute : function (mhandle) {
            console.log("[changhog] MediaPlayer STB mute");

            if(mhandle !=handle ) {
                console.log("[changhog] STB mute handle invalid");
                return -1;
            }
            if(handle)
            {
                mute = 1;
                var ret = handle.mpSetMute(mute,false);

            }
            return 0;
        },
        unmute : function (mhandle) {
            console.log("[changhog] MediaPlayer STB unmute");

            if(mhandle !=handle ) {
                console.log("[changhog] STB unmute handle invalid");
                return -1;
            }
            if(handle)
            {
              mute = 0;
                var ret = handle.mpSetMute(mute,false);

            }
            return 0;
        },


        getCurrentPlayTime : function () {
            console.log("[changhog] MediaPlayer getCurrentPlayTime");
            if(handle)
            {
                var ret = handle.mpGetCurTime(false);
                return ret;
            }
            return 0;
        },

        set : function (mhandle, jsonParam) {
            console.log("[changhog] MediaPlayer STb set jsonParam="+jsonParam);

            if(mhandle !=handle ) {
                console.log("[changhog] STB set handle invalid");
                return -1;
            }
            if(handle) {
                var volume = jsonParam["volume"];
                if(volume)
                  handle.mpSetVolume(volume);
            }
            return 0;

        },

        setVolume : function (mhandle, volume) {
          
            if(handle) {
   
                  handle.mpSetVolume(volume);
            }
            return 0;

        },
        
        
        get : function (mhandle,param ) {
            console.log("[changhog] MediaPlayer STb get param="+param);

            if(mhandle !=handle ) {
                console.log("[changhog] STB get handle invalid");
                return null;
            }
         //   var volume = param.volume;
        //    var duration = param.duration;
         //   var position = param.position;
          //  var playStatus = param.playStatus;

            if(param == "volume")
            {
                if(handle) {
                    var ret = {"volume":30};
                    ret.volume = handle.mpGetVolume(false);
                    var str = JSON.stringify(ret);
                    console.log("STB get volume str=" + str);
                    return str;
               }

            }
            else if(param == "duration")
            {
                if(handle) {
                    var ret = {"duration":30};
                    ret.duration = handle.mpGetDuration(false);
                    var str = JSON.stringify(ret);
                    console.log("STB get duration str=" + str);
                    return str;
                }
            }
            else  if(param == "position")
            {
                if(handle) {
                    var ret = {"position":30};
                    ret.position = handle.mpGetCurTime(false);
                    var str = JSON.stringify(ret);
                    console.log("STB get position str=" + str);
                    return str;

                }
            }
            else if(param == "playStatus")
            {
                if(handle) {
                    var ret = {"playStatus":30};
                    var info =  handle.mpGetPlayerInfo(false);

                    /*
                    * case CH_MPLAY_STATUS_IDLE:
		{
			val = 0;
			break;
		}
		case CH_MPLAY_STATUS_PAUSE:
		{
			val = 2;
			break;
		}
		case CH_MPLAY_STATUS_PLAYING:
		{
			val = 1;
			break;
		}
		case CH_MPLAY_STATUS_FFW:
		{
			val = 3;
			break;
		}
		case CH_MPLAY_STATUS_FBW:
		{
			val = 4;
			break;
		}
		case CH_MPLAY_STATUS_SFW:
		{
			val = 5;
			break;
		}
		case CH_MPLAY_STATUS_SBW:
		{
			val = 6;
			break;
		}
		case CH_MPLAY_STATUS_FSTEP:
		{
			val = 7;
			break;
		}
		case CH_MPLAY_STATUS_BSTEP:
		{
			val = 8;
			break;
		}
		case CH_MPLAY_STATUS_ERROR:
		{
			val = 9;
			break;
		}
		default:
		{
			val = 0xff;
			break;
		}*/
                    console.log("stb play info.status="+info.status);
                    if(info.status <= 2)
                    {
                        ret.playStatus=info.status;
                    }
                    else
                    {
                        ret.playStatus = 4;
                    }

                    var str = JSON.stringify(ret);
                    console.log("STB get status str=" + str);
                    return str;

                }
            }
            return null;
        },

        getPosition : function () {
            console.log("[changhog] MediaPlayer getPosition");
            if(handle)
            {
                var ret = handle.mpGetVideoSize(false);
                return ret;
            }
            return 0;
        },

        setPosition : function (x, y, z, width, height) {
            console.log("[changhog] MediaPlayer setPosition");
            if(handle)
            {
                var json = {l:x,t:y,w:width,h:height};
                var ret = handle.mpSetVideoSize(json,false);
                return ret;
            }
            return 0;
        },

        getFullScreen : function () {
            console.log("[changhog] MediaPlayer getFullScreen");
        },

        setFullScreen : function () {
            console.log("[changhog] MediaPlayer setFullScreen");
        },


        getFrameMode : function () {
            console.log("[changhog] MediaPlayer getFrameMode");
            if(handle)
            {
                var ret = handle.mpGetStopMode(false);
                return ret ? true : false;
            }
            return 0;
        },

        setFrameMode : function (isKeep) {
            console.log("[changhog] MediaPlayer setFrameMode");
            if(handle)
            {
                var value = isKeep ? 1 : 0;
                var ret = handle.mpGetStopMode(value,false);
                return 1;
            }
        },

        getAspectRatio : function () {
            console.log("[changhog] MediaPlayer getAspectRatio");
            if(handle)
            {
                var ret = handle.mpGetAspectRatio(false);
                return ret;
            }
            return 0;
        },
        setAspectRatio : function (mode) {
            console.log("[changhog] MediaPlayer getAspectRatio");
            if(handle)
            {

                var ret = handle.mpSetAspectRatio({"ratio" : mode},false);
                return 1;
            }
            return 0;
        },

        getAspectMatch : function () {
            console.log("[changhog] MediaPlayer getAspectMatch");
        },

        setAspectMatch : function (mode) {
            console.log("[changhog] MediaPlayer setAspectMatch");
        },

        getAudioPid : function () {
            console.log("[changhog] MediaPlayer getAudioPid");
        },

        setAudioPid : function (audioDcodeType, pid) {
            console.log("[changhog] MediaPlayer setAudioPid");
        },

    };
	
  
	this.evt={
        eventjsFunctionName:"",

        setEventCallback : function (jsFunctionName) {

            console.log("[changhog] STB MediaPlayer addListener jsFunctionName="+jsFunctionName);
            eventjsFunctionName = jsFunctionName;
            if(eventCom)

              eventCom.registerCallback(4,
                  function(obj){
                  console.log("[changhog] STB MediaPlayer handleEvent="+obj.code);
                  switch(obj.code)
                  {

                    case eventCom.EVENTCODE.CS_EVT_DVB_SIGNAL_LOST:
                    case eventCom.EVENTCODE.CS_EVT_DVB_SIGNAL_LOCK:

                        break;
                    case eventCom.EVENTCODE.CS_EVT_NETWORK_DISCONNECT:
                        if(typeof jeventjsFunctionName === 'function')
                            jeventjsFunctionName(0,"NETWORK_CONNECT_FAIL","");
                         break;
                    case eventCom.EVENTCODE.CS_EVT_NETWORK_CONNECTED:
                        if(typeof jeventjsFunctionName === 'function')
                            jeventjsFunctionName(0,"NETWORK_CONNECT_PLUGIN","");

                        break;
                    case eventCom.EVENTCODE.CS_EVT_CA_BASE:
                    case eventCom.EVENTCODE.CS_EVT_CA_CARD_INSERT:
                         break;
                    case eventCom.EVENTCODE.CS_EVT_CA_CARD_REMOVE:
                         if(typeof jeventjsFunctionName === 'function')
                            jeventjsFunctionName(0,"PLAYER_PLAY_ERROR_4009","");
                         break;
                    case eventCom.EVENTCODE.CS_EVT_CA_SHOW_MESSAGE:
                    case eventCom.EVENTCODE.CS_EVT_CA_HIDE_MESSAGE:
                    case eventCom.EVENTCODE.CS_EVT_CA_SHOW_FINGER:
                    case eventCom.EVENTCODE.CS_EVT_CA_HIDE_FINGER:
                    case eventCom.EVENTCODE.CS_EVT_CA_SHOW_MAIL:
                    case eventCom.EVENTCODE.CS_EVT_CA_HIDE_MAIL:
                    case eventCom.EVENTCODE.CS_EVT_CA_SHOW_OSD:
                    case eventCom.EVENTCODE.CS_EVT_CA_HIDE_OSD:
                    case eventCom.EVENTCODE.CS_EVT_CA_LOCK_SERVICE:
                    case eventCom.EVENTCODE.CS_EVT_CA_UNLOCK_SERVICE:
                    case eventCom.EVENTCODE.CS_EVT_CA_SHOW_IPPV_DLG:
                    case eventCom.EVENTCODE.CS_EVT_CA_HIDE_IPPV_DLG:
                    case eventCom.EVENTCODE.CS_EVT_CA_PARENT_FEED:
                    case eventCom.EVENTCODE.CS_EVT_CA_PROGRESS_DISPLAY:
                    case eventCom.EVENTCODE.CS_EVT_CA_ACTION_REQUEST:
                    case eventCom.EVENTCODE.CS_EVT_CA_SHOW_CURTAIN_NOTIFY:
                    case eventCom.EVENTCODE.CS_EVT_CA_SHOW_SUPOSD:
                    case eventCom.EVENTCODE.CS_EVT_CA_SHOW_SUPFINGER:
                    case eventCom.EVENTCODE.CS_EVT_CA_ContinuesWatchLimit:
                    case eventCom.EVENTCODE.CS_EVT_CA_DETITLE:
                    case eventCom.EVENTCODE.CS_EVT_CA_ENTITLE_NOTIFY:

                        break;
                    case eventCom.EVENTCODE.CS_EVT_MP_BASE:
                    case eventCom.EVENTCODE.CS_EVT_MP_PLAY_START:
                    case eventCom.EVENTCODE.CS_EVT_MP_PLAY_END:
                         break;
                    case eventCom.EVENTCODE.CS_EVT_MP_BUFFERING_START:
                          if(typeof jeventjsFunctionName === 'function')
                            jeventjsFunctionName(0,"PLAYER_BUFFERING_START","");
                            break;

                    case eventCom.EVENTCODE.CS_EVT_MP_BUFFERING_END:
                     if(typeof jeventjsFunctionName === 'function')
                            jeventjsFunctionName(0,"PLAYER_BUFFERING_END","");
                         break;
                    case eventCom.EVENTCODE.CS_EVT_MP_PLAY_ERROR:
                         if(typeof jeventjsFunctionName === 'function')
                            jeventjsFunctionName(0,"PLAYER_PLAY_ERROR_4021","");
                         break;
                    default:

                        break;
                  }
        });

        },

    };
	
	
	this.dataInit = function(){
		if(sysCom.deviceInfo){
			cns.SystemInfo.serNo = sysCom.deviceInfo.sn;
			cns.SystemInfo.hwVer = sysCom.deviceInfo.hwVersion;
			cns.SystemInfo.swVer = sysCom.deviceInfo.swVersion;
		}
        cns.SystemInfo.zipCode = caCom.caParams.zipCode;
	};
  


    //CA
    this.ca = {
		name : "",
		cardId : "",
		areaCode : "",
		provider : "",
		expireDate : "",

        cardID:function(){
			var ret = {innerCardID:"560521",cardID:"8000020231658"};
            ret.cardID = caCom.caParams.cardNum;
            var str = JSON.stringify(ret);
            console.log("STB cardID:" + str);
            return str;
		},
        pinVerify:function(type,password){

            console.log("STB CA pinVerify type"+type+",password="+password);
            if( type == 0)   //订购密码校验
            {
                if(password.length == 4)
                    password = "00"+password;


                if(sysCom.config.PurchasePIN != password)
                {

                    console.log("PurchasePIN incorrect ");
                    console.log("PurchasePIN old= "+sysCom.config.PurchasePIN);
                    console.log("PurchasePIN check= "+password);
                    return -1;
                }
            }
            else if(type == 1)
            {
              if(sysCom.config.ParentalPin!= password)
              {
                  console.log("ParentalPin incorrect ");
                  console.log("ParentalPin old= "+sysCom.config.ParentalPin);
                  console.log("ParentalPin check= "+password);
                  return -1;
              }
            }
            return 0;
		},
        getCrmID:function(){
            var ret = {soId:"00"};
            ret.soId = caCom.caParams.so ? caCom.caParams.so : "00";
            var str = JSON.stringify(ret);
            console.log("STB CA SO:" + str);

            return str;
        },
        getDeviceSN:function(){
            var ret = {serNo:"16B500000001"};

            ret.serNo = sysCom.deviceInfo.sn;
            var str = JSON.stringify(ret);
            console.log("getDeviceSN:"+str);
            return str;
        }
	};

    this.data={
        getSystem:function(param){
            console.log("STB data getSystem param="+param);
            if("menuLanguage" == param) {
                if(sysCom.config.menuLanguageIndex == 0 )
                    return "chi";
                else
                    return "eng";
            }
            else if("watchLevel" == param)
            {
                console.log("watchLevel="+sysCom.config.ParentLockLevel);
                return sysCom.config.ParentLockLevel+"";
            }
            return null;
        }
    };

    this.wm={
        gotoSTB:function(str1,str2){
            console.log("STB wm gotoSTB str1="+str1+",str2"+str2);
            appCom.goAppByName("tvportal",true);
        },
        switchToThirdApp:function(launchName, productId){
            console.log("STB wm switchToThirdApp launchName="+launchName+",productId="+productId);
            appCom.goAppByName("launchName");
        }
    };
    return this;
};


if (typeof stb == "undefined")
    var stb = new Fonsview();
 
	if(stb){

    }
console.log("fonsview init");
	
	


