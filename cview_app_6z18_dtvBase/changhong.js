
var g_url = window.location.href;
console.log("changhong.js start cur g_url="+g_url);
alert = function (log) {
    console.log("my alert="+log);
};
var DtvCall = {
    "file":"file://",
    /*"host" : "http://192.168.2.106:18030",
    "path" : "http://192.168.2.106:18030/rpc",*/
    "host":"http://127.0.0.1:18030",
    "path": "http://127.0.0.1:18030/rpc",
    "id" : 1,
    "callSync" : function(method, params, path){

        try{
            var obj = {"jsonrpc" : "2.0", "id" : DtvCall.id, "method" : method};

            if(params != null){
                obj.params = params;
            }

            var text = JSON.stringify(obj);
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("POST", path ? path : DtvCall.path, false);
            xmlhttp.send(text);
            var ret = JSON.parse(xmlhttp.responseText);
            return ret ? ret.result : null;
        } catch (e) {
            console.log("error callSync EXP:" + e.name + ": " + e.message);
            return null;
        }
    },

    "callAsync" : function(method, params, cb, path){

        var obj = {"jsonrpc" : "2.0", "id" : DtvCall.id, "method" : method};

        if(params != null){
            obj.params = params;
        }
        var text = JSON.stringify(obj);

        var xmlhttp = new XMLHttpRequest();

        xmlhttp.open("POST", path ? path : DtvCall.path, true);
        xmlhttp.send(text);

        xmlhttp.onreadystatechange = function(){
            if((xmlhttp.readyState == 4 && xmlhttp.status == 200) || xmlhttp.status == 404){

                if(typeof (cb) == "function"){
                    if(xmlhttp.status == 200){
                        var ret = JSON.parse(xmlhttp.responseText);
                        if(ret){
                            cb(ret.result);
                        } else {
                            cb(null);
                        }
                    } else {
                        cb(null);
                    }
                }
            }
        };
    },

    "callRemote" : function(method, params, cb, path){

        if(cb === false){
            return DtvCall.callSync(method, params, path);
        } else {
            DtvCall.callAsync(method, params, cb, path);
        }
    }
};

var utility = {
    "getVersion" : function(cb){
        return DtvCall.callRemote("getVersion", null, cb);
    },

    "getSystemInfo" : function(cb){
        return DtvCall.callRemote("getSystemInfo", null, cb);
    },

    "getCapacity" : function(cb){
        return DtvCall.callRemote("getCapacity", null, cb);
    },

    "logEnable" : function(cb){
        return DtvCall.callRemote("logEnable", null, cb);
    },

    "logDisable" : function(cb){
        return DtvCall.callRemote("logDisable", null, cb);
    },

    "getDeviceInfo" : function(cb){
        return DtvCall.callRemote("getDeviceInfo", null, cb);
    },

    "setDeviceInfo" : function(cb){
        return DtvCall.callRemote("setDeviceInfo", null, cb);
    },

    "setUpdateInfo" : function(mode, cb){
        return DtvCall.callRemote("setUpdateInfo", {"mode" : mode}, cb);
    },

    "getUpdateInfo" : function(cb){
        return DtvCall.callRemote("getUpdateInfo", null, cb);
    },

    "reboot" : function(cb){
        return DtvCall.callRemote("reboot", null, cb);
    },

    "standby" : function(cb){
        return DtvCall.callRemote("standby", null, cb);
    },

    "wakeup" : function(cb){
        return DtvCall.callRemote("wakeup", null, cb);
    },


    "setled" : function(ledindex,ledstatte){
        return DtvCall.callRemote("setled", {"index" : ledindex,"state":ledstatte}, false);
    },

    "getPropMem" : function(key){
        return DtvCall.callRemote("getPropMem", {"key" : key}, false);
    },
    "setPropMem" : function(key,value){
        return DtvCall.callRemote("setPropMem", {"key" : key,"value" : value}, false);
    },

    "cnsGetFileInfo" : function(path,cb) {
        return DtvCall.callRemote("cnsGetFileInfo", {"path" : path}, cb);
    },

    "cnsCreateFile" : function(path,cb) {
        return DtvCall.callRemote("cnsCreateFile", {"path" : path}, cb);
    },

    "getH5Storage" : function(key)
    {
      // console.log("getH5Storage key=:"+key);
        var ret =  Utility.getkey(key);//sessionStorage.getItem(key);
        if(ret)
        {
          //  console.log("getH5Storage result=:"+ret);
            return JSON.parse(ret);
        }
        else
        {
            return null;
        }
    },
    "setH5Storage" : function(key,value)
    {
        var str="";
        if(typeof value == "object")
        {
            str = JSON.stringify(value);
        }
        else
        {
            str = value;
        }
       // console.log("setH5Storage key=:"+key);
       // console.log("setH5Storage value=:"+str);
        //sessionStorage.setItem(key,str);
        Utility.setkey(key,str);
    },
	"deleteH5Storage" : function(key){
        //sessionStorage.removeItem(key);
        Utility.unsetkey(key);
	},
    "sendVirtualKey" :function(key,cb)
    {
        return DtvCall.callRemote("sendVirtualKey", {"keyCode" : key}, cb);
    }
};

function MPlayer(id){

    if(!id) id = 0;

    this.id = id;

    if(!(this instanceof MPlayer))
        return new MPlayer();

    this.mpGetCapacity = function(cb){
        return DtvCall.callRemote("mpGetCapacity", null, cb);
    };

    this.mpSetDataSource = function(url, cb){
        return DtvCall.callRemote("mpGetCapacity", {"id" : this.id, "url" : url}, cb);
    };

    this.mpStart = function(url, cb){
        return DtvCall.callRemote("mpStart", {"id" : this.id, url : url}, cb);
    };

    this.mpStop = function(cb){
        return DtvCall.callRemote("mpStop", {"id" : this.id}, cb);
    };

    this.mpPause = function(cb){
        return DtvCall.callRemote("mpPause", {"id" : this.id}, cb);
    };

    this.mpResume = function(cb){
        return DtvCall.callRemote("mpResume", {"id" : this.id}, cb);
    };

    this.mpSpeed = function(speed, cb){
        return DtvCall.callRemote("mpSpeed", {"speed" : speed, "id" : this.id}, cb);
    };

    this.mpSeek = function(pos, cb){
        return DtvCall.callRemote("mpSeek", {"pos" : pos, "id" : this.id}, cb);
    };

    this.mpGetDuration = function(cb){
        return DtvCall.callRemote("mpGetDuration", {"id" : this.id}, cb);
    };

    this.mpGetCurTime = function(cb){
        return DtvCall.callRemote("mpGetCurTime", {"id" : this.id}, cb);
    };

    this.mpGetMediaInfo = function(cb){
        return DtvCall.callRemote("mpGetMediaInfo", {"id" : this.id}, cb);
    };

    this.mpGetPlayerInfo = function(cb){
        return DtvCall.callRemote("mpGetPlayerInfo", {"id" : this.id}, cb);
    };

    this.mpSetSyncMode = function(mode, cb){
        return DtvCall.callRemote("mpSetSyncMode", {"mode" : mode, "id" : this.id}, cb);
    };

    this.mpBlank = function(cb){
        return DtvCall.callRemote("mpBlank", {"id" : this.id}, cb);
    };

    this.mpSetVolume = function(vol, cb){
        return DtvCall.callRemote("mpSetVolume", {"vol" : vol, "id" : this.id}, cb);
    };

    this.mpGetVolume = function(cb){
        return DtvCall.callRemote("mpGetVolume", null, cb);
    };

    this.mpSetMute = function(mute, cb){
        return DtvCall.callRemote("mpSetMute", {"mute" : mute, "id" : this.id}, cb);
    };

    this.mpGetMute = function(cb){
        return DtvCall.callRemote("mpGetMute", null, cb);
    };

    this.mpSetSoundChannel = function(channel, cb){
        return DtvCall.callRemote("mpSetSoundChannel", {"channel" : channel, "id" : this.id}, cb);
    };

    this.mpGetSoundChannel = function(cb){
        return DtvCall.callRemote("mpGetSoundChannel", { "id" : this.id}, cb);
    };

    this.mpShowVideo = function(cb){
        return DtvCall.callRemote("mpShowVideo", {"id" : this.id}, cb);
    };

    this.mpHideVideo = function(cb){
        return DtvCall.callRemote("mpHideVideo", {"id" : this.id}, cb);
    };

    this.mpSetVideoSize = function(l, t, w, h, cb){
        return DtvCall.callRemote("mpSetVideoSize", {"l" : l, "t" : t, "w" : w, "h" : h, "id" : this.id}, cb);
    };

    this.mpGetVideoSize = function(cb){
        return DtvCall.callRemote("mpGetVideoSize", {"id" : this.id}, cb);
    };

    this.mpSetStopMode = function(mode, cb){
        return DtvCall.callRemote("mpSetStopMode", {"id" : this.id, "mode" : mode}, cb);
    };

    this.mpGetStopMode = function(cb){
        return DtvCall.callRemote("mpGetStopMode", { "id" : this.id}, cb);
    };

    this.mpSetDecodeMode = function(mode, cb){
        return DtvCall.callRemote("mpSetDecodeMode", {"id" : this.id, "mode" : mode}, cb);
    };

    this.mpGetDecodeMode = function(cb){
        return DtvCall.callRemote("mpGetDecodeMode", { "id" : this.id}, cb);
    };

    this.mpSetDecodeMode = function(mode, cb){
        return DtvCall.callRemote("mpSetDecodeMode", {"id" : this.id, "mode" : mode}, cb);
    };

    this.mpSetAspectMode = function(mode, cb){
        return DtvCall.callRemote("mpSetAspectMode", {"mode" : mode, "id" : this.id}, cb);
    };

    this.mpGetAspectMode = function(cb){
        return DtvCall.callRemote("mpGetAspectMode", { "id" : this.id}, cb);
    };

    this.mpSetAspectRatio = function(ratio, cb){
        return DtvCall.callRemote("mpSetAspectRatio", {"ratio" : ratio, "id" : this.id}, cb);
    };

    this.mpGetAspectRatio = function(cb){
        return DtvCall.callRemote("mpGetAspectRatio", { "id" : this.id}, cb);
    };

    this.setAspectParams = function(ratio,mode,cb){
        return DtvCall.callRemote("setAspectParams", { "ratio" : ratio,"mode" : mode,"id" : this.id}, cb);
    };

    this.mpCommand = function(cmd, data, cb){
        return DtvCall.callRemote("mpCommand", {"id" : this.id, "cmd" : cmd, "data" : data}, cb);
    };


	
	this.mpSetAudioTrack = function(params,cb){
		return DtvCall.callRemote("mpSetAudioTrack", params, cb);
	}
	
	this.mpGetAudioTrack = function(cb){
		return DtvCall.callRemote("mpGetAudioTrack", { "id" : this.id}, cb);
	}
};


var Scan = {

    "scanSetParams" : function(params, cb){
        return DtvCall.callRemote("scanSetParams", params, cb);
    },
    "scanStart" : function(params, cb){
        return DtvCall.callRemote("scanStart", params, cb);
    },
    "scanStop" : function(params, cb){
        return DtvCall.callRemote("scanStop", params, cb);
    },
    "scanGetInfo" : function(params, cb){
        return DtvCall.callRemote("scanGetInfo", params, cb);
    },
    "scanSave" : function(params, cb){
        return DtvCall.callRemote("scanSave", params, cb);
    }
};

var Epg = {

    "start" : function(params, cb){
        return DtvCall.callRemote("epgStart", params, cb);
    },

    "stop" : function(params, cb){
        return DtvCall.callRemote("epgStop", params, cb);
    },

    "epgGetPf" : function(tsId, orgNId, serviceId, cb){
        return DtvCall.callRemote("epgGetPf", {"tsId" : tsId, "orgNId" : orgNId, "serviceId" : serviceId}, cb);
    },

    "epgGetSch" : function(tsId, orgNId, serviceId, cb){

        return DtvCall.callRemote("epgGetSch", {"tsId" : tsId, "orgNId" : orgNId, "serviceId" : serviceId}, cb);
    },
    "epgGetSchMulti" : function(array, cb){
        return DtvCall.callRemote("epgGetSchMulti", array, cb);
    },
};


var Tuner = {

    "tunerConnect" : function(params, cb){
        return DtvCall.callRemote("tunerConnect", params, cb);
    },

    "tunerGetStatus" : function(params, cb){
        return DtvCall.callRemote("tunerGetStatus", params, cb);
    }
};


var CA = {
    "caGetType" : function(params, cb){
        return DtvCall.callRemote("caGetType", params, cb);
    },
    "caCommand" : function(params, cb){
        return DtvCall.callRemote("caCommand", params, cb);
    },

    "caGetZipCode":function(cb){
        var operatorid = 0;
        var so = "";
        var params={
            "cmd": "getOperators"
        };
        var data = CA.caCommand(params,false);
        if(data&&data.errorcode==0&&data.operatorinfo){
            for(var i=0;i<data.operatorinfo.length;i++){
                operatorid = data.operatorinfo[0].operatorid;
                break;
            }
        }

        if(operatorid){
            var params={
                "cmd": "getAcList",
                "Operatorid":operatorid
            };
            var data = CA.caCommand(params,false);
            if(data && data.errorcode==0){
                if(data.otherdatas && data.otherdatas.length>=1){
                    var json = data.otherdatas[0];
                    var str = json["acotherdata"]+"";
                   // so = ""+st.substring(0,2);

                    if(str.length >= 5){
                        so = ""+str.substring(0,2);
                    }
                    else if(str.length == 4){
                        so= "0" + str.substring(0,1);
                    }
                    else{
                        so = "00";
                    }
                }
                else{
                    so = "0";
                }
            }
        }
        return so;
    },



    
    "getCasInfo":function(cb){
        var params = {
            "cmd": "getCasInfo"
        };
        /*
            {errorcode:0,Calibversion: “0x1136FFFF”}
        */
        return CA.caCommand(params,cb);
    },
    "getOperators":function(cb){
        var params = {
            "cmd": "getOperators"
        };
        /*
        {
            Operatorinfo:
            [
                {
                    operatorid:1234,
                    Privateinfo:”1234567890....”
                }
            ]
            errorcode: 0
}
         */
        return CA.caCommand(params,cb);
    },
    "getCardNo":function(cb){
        var params = {
            "cmd": "getCardNo"
        };
        /*
            {errorcode:0,Cardno:”8000302100000333”}
        */
        return CA.caCommand(params,cb);
    },
    "getRating":function(cb){
        var params = {
            "cmd": "getRating"
        };
        /*
            {errorcode:0,Rating:4}
        */
        return CA.caCommand(params,cb);
    },
    "setRating":function(pincode,newrating,cb){
        var params = {
            "cmd": "setRating",
            "pincode":pincode,
            "newrating":newrating
        };
        return CA.caCommand(params,cb);
    },

    "getWorkTime":function(cb){
        var params = {
            "cmd": "getWorkTime"
        };
        /*
            {errorcode:0,Starttime:"10:30:30",Endtime:"23:30:30"}
        */
        return CA.caCommand(params,cb);
    },
    "setWorkTime":function(pincode,sh,sm,ss,eh,em,es,cb){
        var params = {
            "cmd": "setWorkTime",
            "pincode":pincode,
            "starthh":sh,
            "startmm":sm,
            "startss":ss,
            "endhh":eh,
            "endmm":em,
            "endss":es
        };
        return CA.caCommand(params,cb);
    },
    "getAcList":function(Operatorid,cb){
        var params = {
            "cmd": "getAcList",
            "Operatorid":Operatorid
        };
        return CA.caCommand(params,cb);
    },
    "getAllMailHead":function(cb){
        var params = {
            "cmd": "getAllMailHead"
        };
        /*
        {
            mailcount:100
            mailheads:
            [
                {
                    mailid:123,
                    mailtitle:”1st mail...”,
                    createtime:”2017-09-04 13:30:30”,
                    importance:true,
                    readed:true,
                    reserved1:1234,
                    Reserved2:2345
                }
            ]
            errorcode: 0
        }
    */
        return CA.caCommand(params,cb);
    },
    "getMailHead":function(mailid,cb){
        var params = {
            "cmd": "getMailHead",
            "mailid":mailid
        };
        /*
            {
                 Head:{
                    mailid:123,
                    mailtitle:”1st mail...”,createtime:”2017-09-04 13:30:30”,
                    importance:true,
                    readed:true,
                    reserved1:1234,
                    Reserved2:2345
                    }
                 errorcode: 0
             }
        */
        return CA.caCommand(params,cb);
    },
    "getMailContent":function(mailid,cb){
        var params = {
            "cmd": "getMailContent",
            "mailid":mailid
        };
        /*
             {
                mailcontent:”1234567890abcdefghijklmnopqrstuvw.....”,
                errorcode: 0
             }
        */
        return CA.caCommand(params,cb);
    },
    "delMail":function(mailid,cb){
        var params = {
            "cmd": "delMail",
            "mailid":mailid
        };
        return CA.caCommand(params,cb);
    },
    "getMailSpaceInfo":function(cb){
        var params = {
            "cmd": "getMailSpaceInfo"
        };
        /*
            {
                Used: 50,
                Unused: 50,
                errorcode: 0
            }
         */
        return CA.caCommand(params,cb);
    },
    "getEntitles":function(operatorid,cb){
        var params = {
            "cmd": "getEntitles",
            "operatorid":operatorid
        };
        return CA.caCommand(params,cb);
    },
    "getPaired":function(cb){
        var params = {
            "cmd": "getPaired"
        };
        return CA.caCommand(params,cb);
    },
    "getSMCUpgrade":function(cb){
        var params = {
            "cmd": "getSMCUpgrade"
        };
        return CA.caCommand(params,cb);
    },
    "getIPPVProg":function(operatorid,cb){
        var params = {
            "cmd": "getIPPVProg",
            "operatorid":operatorid
        };
        return CA.caCommand(params,cb);
    },
    "setPinCode":function(oldpin,newpin,cb){
        var params = {
            "cmd": "setPinCode",
            "oldpin":oldpin,
            "newpin":newpin
        };
        return CA.caCommand(params,cb);
    },
    "stopIPPVBuyDlg":function(pincode,buyflg,ecmpid,pricetype,price,reserved,cb){
        var params = {
            "cmd": "stopIPPVBuyDlg",
            "pincode":pincode,
            "buyflg":buyflg,
            "ecmpid":ecmpid,
            "pricetype":pricetype,
            "price":price,
            "reserved":reserved
        };
        return CA.caCommand(params,cb);
    },
    "getTokenInfo":function(operatorid,cb){
        var params = {
            "cmd": "getTokenInfo",
            "operatorid":operatorid
        };
        return CA.caCommand(params,cb);
    },
    "readFeedDataFromParent":function(operatorid,cb){
        var params = {
            "cmd": "readFeedDataFromParent",
            "operatorid":operatorid
        };
        return CA.caCommand(params,cb);
    },
    "writeFeedDataToChild":function(operatorid,datalen,data,cb){
        var params = {
            "cmd": "writeFeedDataToChild",
            "operatorid":operatorid,
            "datalen":datalen,
            "data":data
        };
        return CA.caCommand(params,cb);
    },
    "formatCAFlash":function(cb){
        var params = {
            "cmd": "formatCAFlash"
        };
        return CA.caCommand(params,cb);
    },
    "getBouqId":function(operatorid,cb){
        var params = {
            "cmd": "getBouqId",
            "operatorid":operatorid
        };
        return CA.caCommand(params,cb);
    }
};

var FS = {

    "fsDiskFormat" : function(diskvloume,cb){
        var params = {"disk":diskvloume}
        return DtvCall.callRemote("fsDiskFormat", params, cb);
    },



    "fsGetDiskInfo" : function(cb){
        return DtvCall.callRemote("fsGetDiskInfo", null, cb);
    },

    /*
     "params": {
     "path": "/tmp/sda1"
     },
    */
    "fsGetFiles" : function(params, cb){
        return DtvCall.callRemote("fsGetFiles", params, cb);
    }
};

var Teletext = {
    /*
     "params": {
     "type": 1,
     "pid": 2692,
     "langCode": 6647399,
     "magazineNum": 0,
     "pageNum": 99,
     "pageSubcode": 0
     }
    */
    "ttxStart" : function(params, cb){
        return DtvCall.callRemote("ttxStart", params, cb);
    },

    "ttxStop" : function(params, cb){
        return DtvCall.callRemote("ttxStop", params, cb);
    },
    /*
     "params": {
     "type": 0,
     "val": 38
     }
    */
    "ttxCommand" : function(params, cb){
        return DtvCall.callRemote("ttxCommand", params, cb);
    }
};

var Subtitle = {
    /*
     "params": {
     "pid": 1025,
     "pageId": 2,
     "ancillaryId": 0
     }
    */
    "subtStart" : function(params, cb){
        return DtvCall.callRemote("subtStart", params, cb);
    },

    "subtStop" : function(params, cb){
        return DtvCall.callRemote("subtStop", params, cb);
    },
    "subtDebug" : function(params, cb){
        return DtvCall.callRemote("subtDebug", params, cb);
    },


};

var DB = {
    /*�����û�����*/
    /*
     "params": {
     "key": "key1",
     "value": {
         "item0": "item0",
         "item1": "item1",
         "item2": "item2"
         }
     }
    */
    "dbSetValue" : function(key, value, cb){

        return DtvCall.callRemote("dbSetValue", {"key" : key, "value" : value}, cb);
    },

    "dbGetValue" : function(key, cb){
        return DtvCall.callRemote("dbGetValue", {"key" : key}, cb);
    },

    "dbSetChannels" : function(params, cb){
        return DtvCall.callRemote("dbSetChannels", params, cb);
    },

    "dbGetChannels" : function(params, cb){
        return DtvCall.callRemote("dbGetChannels", params, cb);
    },

    /*
    * ����Ƶ���û�����
    * ���ӿ�Ϊ�������ṩ���Ƶ���ĸ��Ի����ݴ洢��
    * "params": {
     "chanId": 10,
     "data": {
     "item0": "item0",
     "item1": "item1",
     "item2": "item2"
     }
     }
    * */
    "dbSetChanUserData" : function(params, cb){
        return DtvCall.callRemote("dbSetChanUserData", params, cb);
    },

    /*
    *��ȡƵ���û�����
    *���ӿ�Ϊ�������ṩ���Ƶ���ĸ��Ի����ݻ�ȡ��
    * "params": {
     "chanId": 10
     }
    * */
    "dbGetChanUserData" : function(params, cb){
        return DtvCall.callRemote("dbGetChanUserData", params, cb);
    },

    /*��ȡƵ����ϸ��Ϣ*/
    "dbGetChanInfo" : function(params, cb){
        return DtvCall.callRemote("dbGetChanInfo", params, cb);
    },

    "dbChanUpdate" : function(params, cb){
        return DtvCall.callRemote("dbChanUpdate", params, cb);
    },

    "dbChanDelete" : function(params, cb){
        return DtvCall.callRemote("dbChanDelete", params, cb);
    },

    "dbChanClear" : function(params, cb){
        return DtvCall.callRemote("dbChanClear", params, cb);
    },
    "dbClearAll" : function( cb){
        return DtvCall.callRemote("dbClearAll", null, cb);
    },
    "appClear" : function( cb){
        return DtvCall.callRemote("appClear", null, cb);
    },
    "DoEvnVars" : function(params, cb){
        return DtvCall.callRemote("DoEvnVars", params, cb);
    },
};

var Disp = {
    "setResolution" : function(value, cb){
        return DtvCall.callRemote("setResolution", {"val" : value}, cb);
    },

    "getResolution" : function(params, cb){
        return DtvCall.callRemote("getResolution", params, cb);
    },

    "setBrightness" : function(params, cb){
        return DtvCall.callRemote("setBrightness", params, cb);
    },

    "getBrightness" : function(params, cb){
        return DtvCall.callRemote("getBrightness", params, cb);
    },

    "setContrast" : function(params, cb){
        return DtvCall.callRemote("setContrast", params, cb);
    },

    "getContrast" : function(params, cb){
        return DtvCall.callRemote("getContrast", params, cb);
    },

    "setChroma" : function(params, cb){
        return DtvCall.callRemote("setChroma", params, cb);
    },

    "getChroma" : function(params, cb){
        return DtvCall.callRemote("getChroma", params, cb);
    },

    "setSaturation" : function(params, cb){
        return DtvCall.callRemote("setSaturation", params, cb);
    },

    "getSaturation" : function(params, cb){
        return DtvCall.callRemote("getSaturation", params, cb);
    },
    "disableBootlogo" : function(params, cb){
        return DtvCall.callRemote("disableBootlogo", params, cb);
    }
};

var  PVR = {
    "recStart" : function(params,cb)
    {
        var ret = DtvCall.callRemote("mpCommand",params, cb);
        console.log("PVR recStart params:"+JSON.stringify(params) + "  Return:"+ret);
        return ret;
    },

    "recStop" : function(id, cb)
    {
        var params = {id:id,cmd:"recStop"};
        var ret = DtvCall.callRemote("mpCommand", params, cb);
        console.log("PVR recStop params:"+JSON.stringify(params) + "  Return:"+ret);
        return ret;
    },

    "replayStart" : function(params,cb)
    {
        return DtvCall.callRemote("mpStart", params, cb);
    },

    "replayStop" : function(id, cb)
    {
        var params = {id:id};
        return DtvCall.callRemote("mpStart", params, cb);
    },

    "fsGetReplayRes" : function(cb){
        var params = {start:0,max:0,path:"C:/PVR"};
        return DtvCall.callRemote("fsGetReplayRes", params, cb);
    },

    "fsDeleteReplayRes" : function(resId,cb){
        return DtvCall.callRemote("fsDeleteReplayRes", {resId:resId}, cb);
    }
};


var AppManager = {
    //"path" : "http://192.168.2.106:18032/rpc",
    "path":"http://127.0.0.1:18032/rpc",

    "setAppStoreUrl" :function(URL,cb){
        return DtvCall.callRemote("setAppStoreUrl", {url:URL}, cb, AppManager.path);
    },

    "getAllAppList" : function(cb){
        return DtvCall.callRemote("getAllAppList", null, cb, AppManager.path);
    },

    "getCurAppList" : function(cb){
        return DtvCall.callRemote("getCurAppList", null, cb, AppManager.path);
    },

    "getAppLayout" : function(cb){
        return DtvCall.callRemote("getAppLayout", null, cb, AppManager.path);
    },

    "installAppById" : function(id,cb){
        return DtvCall.callRemote("installAppById", {"app_id":id}, cb, AppManager.path);
    },

    "installIconById" : function(id,cb){
        return DtvCall.callRemote("installIconById", {"app_id":id}, cb, AppManager.path);
    },

    "uninstallAppById" : function(id,cb){
        return DtvCall.callRemote("uninstallAppById", {"app_id":id}, cb, AppManager.path);
    },

    "getAppIconById" : function(id,cb){
        return DtvCall.callRemote("getAppIconById", {"app_id":id}, cb, AppManager.path);
    },
    "updateLinkpointByname" : function(params,cb){
        return DtvCall.callRemote("updateLinkpointByname", params, cb, AppManager.path);
    },
    "forceUpdate" : function(cb){
        return DtvCall.callRemote("forceUpdate", null, cb, AppManager.path);
    },
    "getStaus" : function(cb){
        return DtvCall.callRemote("getStaus", null, cb, AppManager.path);
    }
};

var NetWork = {
    "networkUp":function(itf,cb){
        return DtvCall.callRemote("networkUp",{"interface":itf},cb);
    },
    "networkDown":function(itf,cb){
        return DtvCall.callRemote("networkDown",{"interface":itf},cb);
    },
    "networkSet":function(itf,dp,cb){
        return DtvCall.callRemote("networkSet",{"interface":itf, "dhcp": dp},cb);
    },
    "networkGet":function(itf,cb){
        return DtvCall.callRemote("networkGet",{"interface":itf},cb);
    },
    "networkCommand":function(cmd,cb){
        return DtvCall.callRemote("networkCommand",cmd,cb);
    }
};

var CableModem = {
    "cmGetIpInfo":function(cb){
        return DtvCall.callRemote("cmGetIpInfo",null,cb);
    },
    "cmGetStatus":function(cb){
        return DtvCall.callRemote("cmGetStatus",null,cb);
    },
    "cmSetManuScanFreq":function(freq,cb){
        return DtvCall.callRemote("cmSetManuScanFreq",{"freq:":freq},cb);
    },
    "cmSetSubNetworkIp":function(cb){
        return DtvCall.callRemote("cmSetSubNetworkIp",null,cb);
    }
};

var Dsmcc = {
    "dsmccSearchOC":function(pid,path,cb){
        var params = {pid:pid,path:path};
        return DtvCall.callRemote("dsmccSearchOC",params,cb);
    },
    "dsmccSearchDC":function(pid,path,cb){
        var params = {pid:pid,path:path};
        return DtvCall.callRemote("dsmccSearchDC",params,cb);
    },
    "dsmccSearchExit":function(cb){
        var params = null;
        return DtvCall.callRemote("dsmccSearchExit",params,cb);
    },
    "dsmccSearchStatus":function(cb){
        var params = null;
        return DtvCall.callRemote("dsmccSearchStatus",params,cb);
    }
};


var Hdmi = {
    "hdmiCecEnable":function(cb){
        return DtvCall.callRemote("hdmiCecEnable",null,cb);
    },
    "hdmiCecDisable":function(cb){
        return DtvCall.callRemote("hdmiCecDisable",null,cb);
    }
};

var OTA = {
    "checkOTAUpdate":function(cb){
        return DtvCall.callRemote("checkOTAUpdate",null,cb);
    },
    "startOTAUpdate":function(cb){
        return DtvCall.callRemote("startOTAUpdate",null,cb);
    },
    "startOTAManual":function(cb){
        return DtvCall.callRemote("startOTAManual",null,cb);
    },
    "startUSBManual":function(cb){
        return DtvCall.callRemote("startUSBManual",null,cb);
    }
};





function SysCommon(){
    var self = this;
    var doConfigTimer = null;
    var setVolumeTimer = null;
    var setMuteTimer = null;

    this.isPowerBoot = false;

    this.memConfig = null;

    this.defaultConfig = {
        "chIndex" : 1,
        "volume" : 15,
        "mute" : 0,
        "menuLanguageIndex" : 0,
        "Reslution" : 4,
        "Brightness" : 0,
        "Contrast" : 0,
        "Chroma" : 0,
        "Saturation" : 0,
        "AspectMode" : 0,
        "AspectRatio" : 0,

        "isCompleteFTI":0,
        "disbaleFTI":0,
        "AutoStandby":1,
        "AdOnLivetv":1,
        "AppStoreURL":'http://172.17.127.8',
        "FTI":"1",
        "vbmReportURL":"http://vbm.totaltv.com.tw:8081/log/upload",

        "PVRService":0,
        "PVRPariedSn":"",
        "PVRSize":0,
        "PVRtunerno":0,
        "PVRkey":"",

        "LockStb":0,
        "HDCP":1,
        "AreaLimit":1,
        "NetworkName":"",
        "boottime":0,
        "Tr069":1,

		"screenRatio":0,    // 0 自動 1 16:9PB 2 16:9PS 3 4:3LB 4 4:3PS
		"mainLanguage":0,  // 0 中文 1 英文
		"hdmiCECStatus":1, // 0 close 1 open
		"dolbyDigit":0,    // 0 立體聲
		"bouquetID":25149,
		
		"SystemSettingPin":"7776",
        "ParentalPin" : "0000",
		"PurchasePIN":"000000",
        "PersonalAuthenticationPin":"0000",
        "ParentLockLevel":9,// >15 14 12 9 6 3 
        "ProgramLevel" : 0,
        "WorkTimeSet" : 0,
        "WorkTimeStart" : {
				hour:0,
				minute:0
        },
        "WorkTimeEnd" : {
				hour:0,
				minute:0
        },

        "LayoutVersion" : "-1",
		"displayTime":3,
		"subtitleStatus":1,// 0 close 1 open
		
        "ip_get_mode":1, //0 Dynamic,1 Static
        "static_ip_info":{
            local_ip:"0.0.0.0",
            subnetwork_mask:"0.0.0.0",
            communication_gateway:"0.0.0.0",
            dns_server:"0.0.0.0"
        },
		
        "frequency":405000,
        "symbol_rate":5217,
        "qam":256,
        "isDebug":0,
		"vbmStatus":0, // 0 close 1 open
        "gongchengmenu":0,
    };

    this.config = null;

    this.deviceInfo ={};


    /*
     * init sysCommon module
     */
    this.init = function(){
        //get mem config
        self.getMemConfig();

        //get config
        self.getConfig();

        //

        //do config :  第一次开机时,执行配置的设置
        if(!self.memConfig)
        {
            console.log("do config!");

            self.isPowerBoot = true;
            var myDate = new Date();
            self.config.boottime = myDate.getTime();
            self.config.gongchengmenu = 0;
            console.log("self.config.boottime="+self.config.boottime );
            self.saveConfig();
            self.doConfig();
        }
        console.log("SysCommon init End!");
    };

    this.reset = function(){
        self.config = self.defaultConfig;
        self.saveConfig();
    };

    this.saveConfig = function(){
        DB.dbSetValue("CNS_DVB_CONFIG", self.config, false);
        utility.setH5Storage("CNS_DVB_CONFIG", self.config);
    };

    this.getConfig = function(){
        var obj = utility.getH5Storage("CNS_DVB_CONFIG");
        if(obj == null)
        {
            var ret = DB.dbGetValue("CNS_DVB_CONFIG", false);
            if(ret == null)
            {

                self.config = self.defaultConfig;
                ret =  self.config;
                self.saveConfig();
            }
            self.config = ret;
            self.config.chIndex = parseInt(self.config.chIndex, 10);
            self.config.volume = parseInt(self.config.volume, 10);
            self.config.mute = parseInt(self.config.mute, 10);
            self.config.menuLanguageIndex = parseInt(self.config.menuLanguageIndex, 10);
            self.config.Reslution = parseInt(self.config.Reslution, 10);
            self.config.Brightness = parseInt(self.config.Brightness, 10);
            self.config.Contrast = parseInt(self.config.Contrast, 10);
            self.config.Chroma = parseInt(self.config.Chroma, 10);
            self.config.Saturation = parseInt(self.config.Saturation, 10);
            self.config.AspectMode = parseInt(self.config.AspectMode, 10);
            self.config.AspectRatio = parseInt(self.config.AspectRatio, 10);
            self.config.ParentLockLevel = parseInt(self.config.ParentLockLevel,10);
			self.config.ProgramLevel = parseInt(self.config.ProgramLevel,10);
			self.config.WorkTimeSet = parseInt(self.config.WorkTimeSet,10);
			self.config.displayTime = parseInt(self.config.displayTime,10);
			self.config.subtitleStatus = parseInt(self.config.subtitleStatus,10);
			self.config.screenRatio = parseInt(self.config.screenRatio,10);
			self.config.pictureQuality = parseInt(self.config.pictureQuality,10);
			self.config.mainLanguage = parseInt(self.config.mainLanguage,10);
			self.config.hdmiCECStatus = parseInt(self.config.hdmiCECStatus,10);
			self.config.dolbyDigit = parseInt(self.config.dolbyDigit,10);
			
			self.config.ip_get_mode = parseInt(self.config.ip_get_mode,10);
			self.config.wifiStatus = parseInt(self.config.wifiStatus,10);
			self.config.cm_wifi_mode = parseInt(self.config.cm_wifi_mode,10);
			
			self.config.frequency = parseInt(self.config.frequency,10);
			self.config.symbol_rate = parseInt(self.config.symbol_rate,10);
			self.config.qam = parseInt(self.config.qam,10);
			self.config.bouquetID = parseInt(self.config.bouquetID,10);
			self.config.isDebug = parseInt(self.config.isDebug,10);

            self.config.boottime =  parseInt(self.config.boottime,10);
            self.config.gongchengmenu =  parseInt(self.config.gongchengmenu,10);

            self.config.PVRService = parseInt(self.config.PVRService,10);
            self.config.PVRSize =  parseInt(self.config.PVRSize,10);
            self.config.PVRtunerno =  parseInt(self.config.PVRtunerno,10);
            self.config.FTI = parseInt(self.config.FTI,10);

        }
        else
        {
            self.config = obj;
            self.config.chIndex = parseInt(self.config.chIndex, 10);
            self.config.volume = parseInt(self.config.volume, 10);
            self.config.mute = parseInt(self.config.mute, 10);
            self.config.menuLanguageIndex = parseInt(self.config.menuLanguageIndex, 10);
            self.config.Reslution = parseInt(self.config.Reslution, 10);
            self.config.Brightness = parseInt(self.config.Brightness, 10);
            self.config.Contrast = parseInt(self.config.Contrast, 10);
            self.config.Chroma = parseInt(self.config.Chroma, 10);
            self.config.Saturation = parseInt(self.config.Saturation, 10);
            self.config.AspectMode = parseInt(self.config.AspectMode, 10);
            self.config.AspectRatio = parseInt(self.config.AspectRatio, 10);
            self.config.ParentLockLevel = parseInt(self.config.ParentLockLevel,10);
			self.config.ProgramLevel = parseInt(self.config.ProgramLevel,10);
			self.config.WorkTimeSet = parseInt(self.config.WorkTimeSet,10);
			self.config.displayTime = parseInt(self.config.displayTime,10);
			self.config.subtitleStatus = parseInt(self.config.subtitleStatus,10);
			self.config.screenRatio = parseInt(self.config.screenRatio,10);
			self.config.pictureQuality = parseInt(self.config.pictureQuality,10);
			self.config.mainLanguage = parseInt(self.config.mainLanguage,10);
			self.config.hdmiCECStatus = parseInt(self.config.hdmiCECStatus,10);
			self.config.dolbyDigit = parseInt(self.config.dolbyDigit,10);
			
			self.config.ip_get_mode = parseInt(self.config.ip_get_mode,10);
			self.config.wifiStatus = parseInt(self.config.wifiStatus,10);
			self.config.cm_wifi_mode = parseInt(self.config.cm_wifi_mode,10);
			
			self.config.frequency = parseInt(self.config.frequency,10);
			self.config.symbol_rate = parseInt(self.config.symbol_rate,10);
			self.config.qam = parseInt(self.config.qam,10);
			self.config.bouquetID = parseInt(self.config.bouquetID,10);
			self.config.isDebug = parseInt(self.config.isDebug,10);
            self.config.boottime =  parseInt(self.config.boottime,10);
            self.config.gongchengmenu =  parseInt(self.config.gongchengmenu,10);

            self.config.PVRService = parseInt(self.config.PVRService,10);
            self.config.PVRSize =  parseInt(self.config.PVRSize,10);
            self.config.PVRtunerno =  parseInt(self.config.PVRtunerno,10);
            self.config.FTI = parseInt(self.config.FTI,10);
        }

        self.deviceInfo = utility.getH5Storage("CNS_DVB_DEVICEINFO");
        if(!self.deviceInfo){
            self.deviceInfo = utility.getDeviceInfo(false);
            utility.setH5Storage("CNS_DVB_DEVICEINFO",self.deviceInfo);
        }
    };

    this.doConfig = function(){
        //self.setResolution();
        self.setHdmiCec();
        doConfigTimer = setInterval(function(){
            if(dtvCom && dtvCom.mp)
            {
                self.setVolume();
                self.setMute();
                clearInterval(doConfigTimer);
            }
        });

    };

    this.setMute = function(){
        if(setMuteTimer)
        {
            clearTimeout(setMuteTimer);
        }
        setMuteTimer = setTimeout(function(){
            dtvCom.mp.mpSetMute(self.config.mute, function(ret){
                self.saveConfig();
                setMuteTimer = null;
            });
        },100);

    };

    this.setHdmiCec = function(){
        if(self.config.hdmiCECStatus){
            Hdmi.hdmiCecEnable(function(){
                utility.wakeup(false);
            });
        }
        else{
            Hdmi.hdmiCecDisable(false);
        }
    };

    this.setVolume = function(){
        if(setVolumeTimer)
        {
            clearTimeout(setVolumeTimer);
        }
        setVolumeTimer = setTimeout(function(){
            dtvCom.mp.mpSetVolume(self.config.volume * 3, function(ret){
                self.saveConfig();
                setVolumeTimer = null;
            });
        },50);

    };

    this.setResolution = function() {
        Disp.setResolution(sysCom.config.Reslution,false);
    };
    /*******************临时存储操作区******************/
    this.getMemConfig = function(key){
        self.memConfig = utility.getH5Storage("CNS_DVB_MEM_CONFIG");
        console.log("memConfig="+self.memConfig );
        if(key && key!="")
        {
            return self.memConfig[key];
        }
    };

    this.setMemConfig = function(key,value){
        if(!self.memConfig)
        {
            self.memConfig = {};
        }
        self.memConfig[key] = value;
        utility.setH5Storage("CNS_DVB_MEM_CONFIG",self.memConfig);
    };
}
var sysCom = new SysCommon();
console.log("sysCom init");
sysCom.init();

function LanguageCommon()
{
    var self = this;
	//current langauge index
	this.menuLanguageIndex = 0;
	this.menuLanguageArray = ["繁体中文","English"];
	

	//languaeg change cb
    this.changeCbArray = [];
    /*
    *	init menu language
    */
    this.init = function ()
    {
        this.changeCbArray = [];
        if(sysCom.config.menuLanguageIndex<0 || sysCom.config.menuLanguageIndex >1)
            sysCom.config.menuLanguageIndex = 0;

        this.menuLanguageIndex = sysCom.config.menuLanguageIndex;
        console.log("menuLanguageIndex:" + self.menuLanguageIndex);
    };

    this.reset = function ()
    {
        this.menuLanguageIndex = sysCom.config.menuLanguageIndex = 0;
    };

    this.registerChangeLanguageCb = function (cb)
    {
        this.changeCbArray.push(cb);
    };

    this.setMenuLanguage = function (index)
    {
        if (index < self.menuLanguageArray.length && index != this.menuLanguageIndex) {
            this.menuLanguageIndex = index;
        }
        sysCom.config.menuLanguageIndex = index;
        sysCom.saveConfig();
        for (var i = 0; i < self.changeCbArray.length; i++) {
            self.changeCbArray[i]();
        }
    };
    this.getMenuLanguage = function ()
    {
        return this.menuLanguageIndex;
    };
}

var languageCom = new LanguageCommon();
languageCom.init();
var Lp;
console.log("LpInit init");
if( g_url.indexOf("cview_app_6z18_cns")  >=0    || g_url.indexOf("/install/1186/")  >=0 ) {
    LpInit();
}
else
    setTimeout(LpInit,50);


function LpInit() {
    Lp =
        {
            Utf8ToUnicode: function (strUtf8) {
                var bstr = "";
                var nTotalChars = strUtf8.length; // total chars to be processed.
                var nOffset = 0; // processing point on strUtf8
                var nRemainingBytes = nTotalChars; // how many bytes left to be converted
                var nOutputPosition = 0;
                var iCode, iCode1, iCode2; // the value of the unicode.
                while (nOffset < nTotalChars) {
                    iCode = strUtf8.charCodeAt(nOffset);
                    if ((iCode & 0x80) == 0) // 1 byte.
                    {
                        if (nRemainingBytes < 1) // not enough data
                        {
                            break;
                        }
                        bstr += String.fromCharCode(iCode & 0x7F);
                        nOffset++;
                        nRemainingBytes -= 1;
                    }
                    else if ((iCode & 0xE0) == 0xC0) // 2 bytes
                    {
                        iCode1 = strUtf8.charCodeAt(nOffset + 1);
                        if (nRemainingBytes < 2 || // not enough data
                            (iCode1 & 0xC0) != 0x80) // invalid pattern
                        {
                            break;
                        }
                        bstr += String
                            .fromCharCode(((iCode & 0x3F) << 6) | (iCode1 & 0x3F));
                        nOffset += 2;
                        nRemainingBytes -= 2;
                    }
                    else if ((iCode & 0xF0) == 0xE0) // 3 bytes
                    {
                        iCode1 = strUtf8.charCodeAt(nOffset + 1);
                        iCode2 = strUtf8.charCodeAt(nOffset + 2);
                        if (nRemainingBytes < 3 || // not enough data
                            (iCode1 & 0xC0) != 0x80 || // invalid pattern
                            (iCode2 & 0xC0) != 0x80) {
                            break;
                        }
                        bstr += String.fromCharCode(((iCode & 0x0F) << 12)
                            | ((iCode1 & 0x3F) << 6) | (iCode2 & 0x3F));
                        nOffset += 3;
                        nRemainingBytes -= 3;
                    }
                    else
                    // 4 or more bytes -- unsupported
                    {
                        break;
                    }
                }
                if (nRemainingBytes != 0) { // bad UTF8 string.
                    return "";
                }
                return bstr;
            },
            getValue: function (name, index) {
                if (!Lp[name]) {
                    return "";
                }

                if (index == 0 || index == 1) {
                    return this.Utf8ToUnicode(Lp[name][index]);
                }

                return this.Utf8ToUnicode(Lp[name][languageCom.menuLanguageIndex]);
            },

            "Traditional_Chinese": ["繁体中文", "繁体中文"],
            //input dialog
            "Input_Invalid_Tip": ["您輸入的頻道不存在，請重新輸入!", "The Input is Invalid,Please input again!"],
            "Pls_Input_Passwd": ["請輸入密碼", "please input passwd"],
            "Please_Input_New_Password": ["請輸入新密碼", "Please Input New Password"],
            "Pls_Input_Passwd_1": ["請輸入工程密碼", "please input passwd"],
            "Pls_Input_Passwd_2": ["請輸入個人密碼", "please input passwd"],
            "Ok": ["確認", "OK"],
            "Cancel": ["取消", "Cancel"],

            //live
            //banner
            "channel_name": ["频道名称", "Channel Name"],
            "Program_synopsis": ["節目簡介", "Prog Synopsis"],
            "Change_channel": ["切換頻道", "Change Channel"],
            "ChangeMultiLanguage": ["雙語切換", "Bilingual Switching"],
            "ChangeSub": ["字幕切換", "Change Subtitle"],
            "Change_Switch": ["字幕開關", "Change Switch"],
            "Timeshift": ["時光平移", "Timeshit"],
            "Channel_List": ["頻道列表", "Channel List"],
            "No_Channels": ["目前沒有任何頻道", "No Channels"],
            "Search_Channels_Frist": ["請先搜尋頻道", "Please Search Channels First"],
            "Main_Menu": ["主畫面", "Main Menu"],
            "NoPfInfo": ["沒有節目資訊", "No Program Information"],
            "audio_track": ["音軌", "Track"],
            "subtitle": ["字幕", "Subtitle"],
            "subtClose": ["字幕關", "Subtitle Close"],
            "pf_lock_msg": ["節目資訊鎖定", "Locked"],

            "w0": ["日", "Sun."],
            "w1": ["一", "Mon."],
            "w2": ["二", "Tue."],
            "w3": ["三", "Wed."],
            "w4": ["四", "Thu."],
            "w5": ["五", "Fri."],
            "w6": ["六", "Sat."],

            //channel list
            "Tv_Channel": ["電視頻道", "Tv Channel"],
            "Add_Favorite": ["新增喜愛", "Add Fav"],
            "Cancel_Favorite": ["取消喜愛", "Cancel Fav"],
            "Switch_Channel": ["切換頻道", "Switch Channel"],
            "last_page": ["返回", "Return"],

            //channel list
            "fav_Channel": ["喜愛頻道", "fav"],
            "All_Channel": ["所有頻道", "ALL"],
            "Public_Welfare_Religion": ["公益/宗教", "Public Welfare/Religion"],
            "Drama_Music": ["戲劇/音樂", "Drama/Music"],
            "News_Finance": ["新聞/財經", "News/Finance"],
            "Leisure_Knowledge": ["休閑/新知", "Leisure/Knowledge"],
            "Children_Animation": ["兒童/卡通", "Children/Animation"],
            "Films_Series": ["電影/影集", "Films/Series"],
            "Variety": ["綜藝/綜合", "Variety"],
            "Home_Shopping": ["購物", "Home Shopping"],
            "Foreign_Language_Learning": ["外語/學習", "Foreign Language/Learning"],
            "HD": ["HD高畫質", "HD"],
            "Sports_Others": ["體育運動/其他", "Sports/Others"],
            "Adult": ["成人", "Adult"],

            //epg
            "epg_program_list": ["節目表", "EPG"],
            "epg_nav_summary": ["簡介", "Summary"],
            "epg_nav_remind_view": ["提醒收視", "Remind TV"],
            "epg_nav_remind": ["預約提醒", "Remind TV"],
            "epg_nav_cancel_remind": ["取消提醒", "Cancel Remind"],
            "epg_nav_remind_channel": ["提醒節目表", "Remind EPG"],
            "epg_nav_record": ["預約錄影", "Record"],
            "epg_nav_lock": ["輸入親子鎖", "Input Lock"],
            "epg_nav_last": ["上一頁", "Last Page"],
            "epg_lock_msg": ["節目資訊鎖定", "Locked"],
 
             "remind_expired":["預約時間已過期，請重新選擇.","Time has expired, please rechoose."],
            "remind_conflict": ["預約衝突", "Remind Conflict"],
            "remind_conflict_ask_str": ["預約發生衝突,您確定要替換已預約的節目嗎?", "Appointment conflicts. Are you sure you want to replace scheduled programs?"],
            "new_remind_conflict": ["新預約:", ""],
            "old_remind_conflict": ["已預約:", ""],

            "remind_single_record": ["預約單集錄制", ""],
            "remind_serial_record": ["預約系列錄制", ""],

            "serial_record_has_record": ["該系列錄製已添加!", "This series of recording has been added!"],

            "cancel_single_record": ["取消單集", ""],
            "cancel_serial_record": ["取消系列", ""],
            "tips": ["提示", "Tips"],

        "isStopRecording":["本節目正在錄影，是否需要停止錄影？",""],
        "noPVRService":["錄影功能未開通",""],
        "noPVRDISK":["影碟未檢測到",""],
        "noSignText":["無訊號或訊號不良，請確認訊號纜線已接妥或洽客服中心 (代碼：E200)","Signal is not stable. Please check your connection of RF cable first. (Code: E200)"],
        "noCardText":["智慧卡未插入，請插入智慧卡 (代碼：E009)","Smartcard is removed! Insert the Smart Card! (Code: E009)"],
        "eventLockText":["節目已鎖定，請輸入親子鎖密碼","The program has been locked, please enter the parent-child lock password"],
        "noCertificationText":["未訂購本節目","Access denied"],

            //reminder list
            "channlNum": ["頻道號", "channelLcn"],
            "channle": ["頻道", "channelName"],
            "programName": ["節目名稱", "programName"],
            "date": ["日期", "Date"],
            "time": ["時間", "Time"],
            "cancel_recording": ["取消預約"],

            //record by time
            "record_list": ["預約錄影清單", "Recording List"],
            "select": ["選擇"],
            "record_by_time": ["錄影 > 定時預約", ""],
            "select_channel": ["選擇頻道", "Channel"],
            "recordMode": ["錄制模式", "Mode"],
            "set_time": ["設置時間", "Set Time"],
            "select_week": ["選擇星期", ""],
            "start_date": ["開始日期", ""],
            "start_time": ["開始時間", ""],
            "record_time": ["錄制時長", ""],
            "oneTimeRecord": ["單次錄", "one time"],
            "everyDayRecord": ["每天錄", "every day"],
            "everyWeekRecord": ["每周錄", "every week"],
            "recording": ["預約", ""],
            "am": ["上午", "AM"],
            "pm": ["下午", "PM"],
            "single": ["單集", ""],
            "serial": ["系列", ""],
            "onetime": ["單次", ""],
            "everyDay": ["每天", ""],
            "everyWeek": ["每週", ""],

  //recorded list
        "videoDuration":["片長:","Duration:"],
        "videoSize":["檔案大小:","Size:"],
        "usedSpace":["已用磁碟空間:","Used:"],
        "totalSize":["總授權:","Total:"],
            //recording list
            "recording_list_title": ["録影 > 我的預約", ""],
            "start_end_time": ["開始,結束時間", ""],
            "cancel_recored": ["取消預約", ""],
            "detail": ["詳情", ""],
            "recorded_list": ["已錄節目清單", ""],
            "recording_prom_info": ["預約節目詳情", ""],
            "confirm_delete": ["刪除確認", ""],
            "all_channel": ["所有頻道", "All Channels"],
            "delete_recording_item_confirm": ["確認刪除該預約錄影?", "Do you make sure to delete"],

            //recorded list
            "recorded_list_title": ["錄影 > 已錄節目", ""],
            "RecordedProm": ["已錄節目", ""],
            "play": ["播放", ""],
            "delete": ["刪除", ""],
            "recording_list": ["預約錄影清單", ""],
            "delete_recorded_item_confirm": ["確認刪除該錄製節目?", "Do you make sure to delete"],

            //mediaPlayBanner
            "playOrPause": ["播放/暫停", "play/pause"],
            "retreat": ["後退", "retreat"],
            "forward": ["前進", "forward"],
            "multiple_forward": ["倍數前進", "multiple forward"],
            "multiple_retreat": ["倍數後退", "multiple retreat"],
            "details": ["詳情", "details"],
            "language_switch": ["聲音切換", "language switch"],
            "audio_track": ["音軌", "audio track"],
            "leave": ["離開", "leave"],
            "play_again": ["再播一遍", "play again"],
            "play_episode": ["繼續播放下一集", "play episode"],
            "langDlg_title": ["提醒", "Remind"],
            "langDlg_content": ["音軌切換中，請稍後。", "Audio track switching,Just a moment,please"],

            //mailbox
            "System_mailbox": ["系統郵箱", "System Mailbox"],
            "mailbox_title": ["標題", "title"],
            "importance": ["重要", "importance"],
            "ordinary": ["普通", "ordinary"],
            "sum": ["總數", "sum"],
            "unread": ["未讀", "unread"],
            "max": ["最多", "max"],
            "read": ["閱讀", "read"],
            "delete_read": ["刪除已讀", "delete read"],
            "mailInfo": ["郵件信息", "Mail Information"],
            "mailDlg_title": ["消息", "Remind"],
            "delete_this": ["確認刪除此郵件？", "Confirm deleting this mail?"],
            "delete_allRead": ["確認刪除所有已讀郵件？", "Confirm to delete all read mail?"],
            "noCACardDlg": ["未檢測到CA卡，請插入卡后再進入", "CA card was not detected,Please insert the card and enter again"],
            "newMailDlg": ["有新的郵件到達，是否立即查看？", "New mail arrives,Will you check it immediately?"],

            //input dialog
            "Enter_New_Password": ["輸入新的密碼", "Enter New Password"],
            "Enter_New_Password_Again": ["重新輸入新的密碼", "Enter New Password Again"],
            "Password_Error_Please_Input_Again": ["密碼不正確，請重新輸入", "Password Error,Please Input Again"],
            "Parameter_is_Illegal_Please_Input_Again": ["參數不合法，請重新輸入", "Parameter is Illegal,Please Input Again"],
            //Personal_Settings Menu
            "Setting": ["設定", "Setting"],
            "Personal_Settings": ["個人化設定", "Personal Settings"],

            "Parent_Child_Channel_Lock": ["親子頻道鎖", "Parent Child Channel Lock"],
            "Personal_Authentication_Code": ["個人認證碼", "Personal Authentication Code"],
            "Language_And_Messaging_Settings": ["語言及訊息設定", "Language And Messaging Settings"],
            "Subtitle_Setting": ["字幕設定", "Subtitle Setting"],
            "Screen_And_Sound_Settings": ["螢幕及音效設定", "Screen And Sound Settings"],
            "Video_Function": ["錄影功能", "Video Function"],
            "Channel_Search": ["搜尋頻道", "Channel Search"],
            "Network_Settings": ["網路設定", "Network Settings"],
            "System_Information": ["系統資訊", "System Information"],

            //Parent Child Channel Lock
            "Parent_Child_Lock": ["親子鎖", "Parent Child Lock"],
            "Channel_Lock": ["頻道鎖", "Channel Lock"],
            "Work_Period_Setting": ["工作時間段設定", "Work Period Setting"],
            "Modify_Password": ["修改親子鎖密碼", "Modify Password"],
            "Unlimited": ["不限制", "Unlimited"],
            "Adult": ["成人級", "Adult"],
            "Limit": ["限制級", "Limit"],
            "Counseling_15": ["輔15", "Counseling 15"],
            "Counseling_12": ["輔12", "Counseling 12"],
            "Protection": ["保護", "Protection"],
            "General": ["普遍(全鎖)", "General"],
            "Unlock": ["解鎖", "Unlock"],
            "Lock": ["上鎖", "Lock"],
            "All_Unlock": ["全部解鎖", "All Unlock"],
            "Unlock_All_Tips": ["將全部頻道鎖解鎖？", "Unlock All Channel Locks ?"],
            "Work_Time_Setting": ["工作時間設定", "Work Time Setting"],
            "Begin_Time": ["開始時間", "Begin Time"],
            "Switch_With_Red": ["以 紅色鍵 開關", "Switch With Red Key"],
            "Save_Sucessful": ["存儲成功", "Save Sucessful"],

            "Picture_Language_Display": ["畫面顯示語言", "Picture Language Display"],
            "Message_Display_Time": ["訊息顯示時間", "Message Display Time"],
            "Traditional_Chinese": ["繁體中文", "繁體中文"],
            "Second": ["秒", "Second"],
            "Open": ["啟動", "Open"],
            "Close": ["關閉", "Close"],

            "Screen_And_Sound": ["螢幕及音效設定", "Screen And Sound"],
            "Screen_Scale": ["螢幕比例", "Screen Scale"],
            "Picture": ["畫質", "Picture"],
            "Major_Sound_Language": ["主要聲音語言", "Major Sound Language"],
            "Dolby_Digital": ["杜比數位", "Dolby Digital"],
            "Automatic": ["自動", "Auto"],
            "Chinese": ["繁體中文", "繁體中文"],
            "English": ["English", "English"],
            "Stereo": ["立體聲", "Stereo"],
            "Dolby": ["杜比音效", "Dolby Audio"],
            "Dual_Channel": ["雙聲道", "Dual Channel"],
            "WiFi_Setting": ["WiFi 設定", "WiFi Setting"],
            "CM_Information": ["CM 資訊", "CM Information"],
            "WiFi_Switch": ["WiFi 開關", "WiFi Switch"],
            "Encryption_Mode": ["加密模式", "Encryption Mode"],
            "Switch_On": ["開啟", "Switch_On"],
            "Switch_Off": ["關閉", "Switch_Off"],
            "Change_Tips": ["請按確認鍵保存更改", "Please Press Ok Key To Save Change"],
            "No_CM_Tips": ["未检测到无线网卡模组，請插入USB無線網卡", "Wireless Card Module Is Not Detected,Please Insert USB Wireless Card"],
            "CM_Mode": ["CM 模式", "CM Mode"],
            "DOCSIS_Status": ["DOCSIS 狀態", "DOCSIS Status"],
            "Already_On_Line": ["已上線", "Already On Line"],
            "Already_Off_Line": ["已上線", "Already On Line"],
            "Down_Frequency_Point_Status": ["下行頻點狀態", "Down Frequency Point Status"],
            "Up_Frequency_Point_Status": ["上行頻點狀", "Up Frequency Point Status"],

            "Normal": ["正常", "Normal"],
            "Very_Weak": ["很弱", "Very Weak"],
            "Commonly": ["一般", "Commonly"],
            "Strong ": ["強", "Strong"],
            "Very_Strong": ["極強", "Very Strong"],
            "Connect_Status": ["連接狀態", "Connect Status"],
            "Security_Type": ["安全類型", "Security Type"],
            "Subnetwork_Mask": ["子網路遮罩", "Subnetwork Mask"],
            "Communication_Gateway": ["通訊閘道", "Communication Gateway"],
            "DNS_Server": ["網路名稱服務器", "DNS Server"],
            "IP_Address": ["IP 地址", "IP Address"],
            "Signal_Strength": ["訊號強度", "Signal Strength"],
            "Manual_Setting": ["手動設定", "Manual Setting"],

            "Hardware_Version": ["硬體版本", "Hardware Version"],
            "Software_Version": ["軟體版本", "Software Version"],
            "Loader_Version": ["載入器版本", "Loader Version"],
            "Smart_Card_Number": ["智慧卡號碼", "Smart Card Number"],
            "CA_Version": ["CA 版本", "CA Version"],
            "System_Version": ["系統版本", "System Version"],
            "The_Device_Is_In_Place": ["裝置已就緒", "The Device Is In Place"],
            "Frequency": ["頻率", "Frequency"],
            "Progress": ["進度", "Progress"],
            "Searching": ["搜尋中", "Searching"],
            "TV": ["電視", "TV"],
            "Music": ["音樂", "Music"],
            "Information": ["資料", "Information"],
            "Search": ["搜尋", "Search"],

            //system setting
            //boot wizard
            "Previous_Step": ["上一步", "Previous Step"],
            "Next": ["下一步", "Next"],
            "Step1": ["步驟一:檢測軟體升級", "Step1:Detect Promotion"],
            "Ota": ["OTA狀態:", "OTA Status:"],
            "UpCheck": ["升級檢測中...剩余", "Detecting...Remaining"],
            "CurSw": ["當前軟體版本:", "Current SW version:"],
            "Wait": ["正在搜尋中,請稍後...", "Seaching,please wait..."],
            "Step2": ["步驟二:個人化設定", "Step2:Configure"],
            "Language": ["語言", "Language"],
            "Chinese_English": ["繁體中文", "English"],
            "Aspect_ratio": ["螢幕比例", "Aspect Ratio"],
            "Auto": ["自動", "Auto"],
            "Video_format": ["影像格式", "Resolution"],
            "Step3": ["步驟三:參數設定", "Step3:Set Params"],
            "Symbol_rate": ["符號率", "Symbol"],
            "Step4": ["步驟四:搜尋頻道", "Step4:Search Channel"],
            "Signal": ["訊號", "Signal"],
            "OK": ["確認", "OK"],
            "Search_Over": ["搜尋完成", "Search Over"],
            "Turn_Main_Tip": ["請按壓\"OK\"鍵進入主頁面", "Please Press \"OK\" Button Turn To Main Page"],
            "Turn_Main": ["移至主頁面", "Turn To Main"],

            //system setting menu
            "system_setting": ["系統設定", "Systen Setting"],
            "System_Update": ["系統升級", "System Update"],
            "Search_Channel": ["搜尋頻道", "Search Channel"],
            "Singal_Check": ["訊號檢測", "Singal Testing"],
            "CA_Information": ["CA 資訊", "CA Information"],
            "Reset_STB": ["重新設定機上盒", "Reset STB"],
            "Work_Order_Return": ["安裝工單回報", "Work Order Return"],
            "Action_Open_QR": ["行動開通 QR", "Action Open QR"],
            "BID_Setting": ["BID 設定", "BID Setting"],
            "app_update": ["九宮格更新", "App Update"],
            "Format_Hard_Disk": ["格式化硬碟", "Format Hard Disk"],
            "HDDNoready":["裝置未就緒（代碼:PVR002）","Device not ready(CODE:PVR002)"],
            "HDDnopair":["裝置未配對（代碼:PVR003）","Device not paried"],
            "HDDready":["裝置已就緒","Device ready"],
            "Noready":["功能暫不支持","Not supported"],
            "Debug_Information": ["Debug 设定", "Debug Setting"],
            "VBM_Switch": ["VBM 開關", "VBM_Switch"],

            //scan channel
            "System_Setting": ["系統設定", "System Setting"],
            "Network_Search": ["網絡搜尋", "Network Search"],
            "Manual_Search": ["手動搜尋", "Manual Search"],
            "Move_Focus_Right": ["向右移動焦點", "move focus to right"],
            "Move_Focus_Left": ["向左移動焦點", "move focus to left"],
            "Up_Page": ["上一頁", "Up Page"],
            "UP_Page": ["上一頁", "Up Page"],

            //system_update
            "USB_Update": ["USB升級", "USB Update"],
            "OTA_Update": ["OTA升級", "OTA Update"],

            //network_setting

            "STB_Mode": ["STB模式", "STB Mode"],
            "Restart_STB_Confirm": ["重啟機上盒確認", "Restart STB Confirm"],
            "Please_Confirm_Restart_STB": ["請確認是否重啟機上盒使新設定生效？", "Please Confirm whether Restart STB?"],
            "IP_Information": ["IP 資訊", "IP Information"],
            "DHCP_Setting": ["DHCP 設定", "DHCP Setting"],
            "Wired_Device": ["連線設備", "Wired Device"],
            "Subnet_Mask": ["子網路遮罩", "Subnet Mask"],
            "Default_Gateway": ["預設閘道", "Default Gateway"],
            "Main_DNS": ["主要", "Main DNS"],
            "Second_DNS": ["次要", "Second DNS"],
            "Subnet_Setting": ["子網域設定", "Subnet Setting"],
            "Switch": ["開關", "Switch"],
            "Name": ["名稱", "Name"],
            "Encrypt_Mode": ["加密模式", "Encrypt Mode"],
            "Input_Password": ["輸入密碼", "Input_Password"],
            "New_Password": ["新密碼", "New Password"],
            "Password": ["密碼", "Password"],
            "Confirm_Password": ["確認密碼", "Confirm Password"],
            "Select": ["選擇", "Select"],
            "Display_Password": ["顯示密碼", "Display Password"],
            "Please_Input_Password": ["請輸入密碼", "Please Input Password"],
            "Please_Input_New_Password": ["請輸新入密碼", "Please Input New Password"],
            "Please_Input_Confirm_Password": ["請輸入確認密碼", "Please Input Confirm Password"],
            "New_And_Confirm_Password_Is_Different": ["新密碼與確認密碼不統一", "New And Confirm Password Is Different"],
            "Change_Password_Failed": ["修改密碼失敗", "Change Password Failed"],
            "Tips": ["提示", "Tips"],
            "Address": ["地址", "Address"],
            "Save": ["儲存", "Save"],
            "Wired_Network": ["有線網絡", "Wired Network"],
            "Wireless_Networks": ["無線網路", "Wireless Networks"],
            "IP_Acquisition_Mode": ["IP 取得方式", "IP_Acquisition Mode"],
            "Dynamic_IP_Configuration": ["動態IP配置", "Dynamic IP Configuration"],
            "Static_IP_Configuration": ["靜態IP配置", "Static IP Configuration"],
            "Local_IP": ["本地IP", "Local IP"],
            "Modify_Settings": ["修改設定", "Modify_Settings"],
            "Detection": ["檢測", "Detection"],

            "Network_Setup_Confirmation": ["網絡設定確認", "Network setup confirmation"],
            "Switch_To_Static_IP_Tips": ["確認將網絡狀態設定為靜態IP設定？", "Verify That The Network Status Is Set To A Static IP Setting"],
            "Switch_To_Dynamic_IP_Tips": ["確認將網絡狀態設定為動態IP設定？", "Verify That The Network Status Is Set To A Static IP Setting"],
            "Setting_Success": ["設定成功", "Setting_Success"],
            "Confirm_Settings": ["確認設定", "Confirm Settings"],
            "Software_Keyboard": ["熒幕小鍵盤", "Software_Keyboard"],
            "Upload": ["上行", "Upload"],
            "Download": ["下行", "Download"],
            "Ranging": ["測距", "Ranging"],
            "Online": ["在線", "Online"],
            "Passageway": ["通道", "Passageway"],
            "Version": ["版本", "Version"],
            "Current_Time": ["目前時間", "Current Time"],

            "Card_Password_Change": ["卡密碼修改", "Password Change"],
            "STB_Card_Pairing": ["機卡配對", "STB Card Pairing"],
            "Operator_Information": ["營運商訊息", "Operator Information"],
            "Card_Information": ["智慧卡訊息", "Card Information"],
            "Card_Update_Information": ["智慧卡升級訊息", "Update Information"],
            "STB_Card_Pairing_Status": ["機卡配對狀態", "Pairing Status"],
            "Serial_Number": ["序號", "Serial Number"],
            "Operator_ID": ["營運商 ID", "Operator ID"],
            "Operator_Name": ["營運商名稱", "Operator Name"],
            "Authorization_Information": ["授權信息", "Authorization Information"],
            "E_Wallet": ["電子錢包", "e-Wallet"],
            "Characteristic_Value": ["特徵值", "Characteristic Value"],
            "Program_Authorization_ID": ["節目授權ID", "Program Authorization ID"],
            "Video": ["錄影", "Video"],
            "End_Time": ["結束時間", "End Time"],
            "Authorization_Information_Quantity": ["授權信息數量", "Authorization Information Quantity"],
            "Wallet_ID": ["錢包ID", "Wallet ID"],
            "Credit_Points": ["信用點數", "Credit Points"],
            "Spent_Points": ["已花點數", "Spent Points"],
            "Update_Time": ["升級時間", "Update Time"],
            "Update_Status": ["升級狀態", "Update Status"],
            "Back": ["返回", "Back"],
            "Verify_Factory_Restored": ["確認恢復出廠預設值？", "Verify The Factory Restored ?"],
            "Status": ["狀態", "Status"],
            "Restored_Tips": ["恢復出廠預設值并系統重新開機中...", "Restore Factory Defaults And Reboot The System..."],
            "Is_Paired": ["智慧卡與目前機上盒配對", "The card is paired with this STB"],
            "Invalid_card": ["無效卡", "Invalid card"],
            "Other_Paired": ["智慧卡與其他機上盒配對", "The card is paired with other STB"],
            "No_Paired": ["智慧卡沒有與任何機上盒配對", "The card is not paired with any STB"],

            "Native_Status": ["本機狀態", "Native Status"],
            "Authorization_Status": ["授權狀態", "Authorization Status"],
            "Corresponding_Master_Card": ["對應母機卡號", "Corresponding Master Card"],
            "Master_Card": ["母卡", "Master Card"],
            "Authorized": ["已授權", "Authorized"],
            "Sub_Card": ["子卡", "Sub Card"],
            "Unauthorized": ["未授權", "Unauthorized"],

            "Company_Alias": ["公司別", ""],
            "Work_Order_Simple_Code": ["工單簡碼", "Work Order Simple Code"],
            "Work_Order_Query": ["工單查詢", "Work Order Query"],
            "Work_Order_Information": ["工單訊息", "Work Order Information"],
            "Return_Value": ["回傳值", "Return Value"],
            "Job_Information": ["作業訊息", "Job Information"],
            "Work_Order_Full_Code": ["工單全碼", "Work Order Full Code"],
            "Installed_Class": ["裝機類別", "Installed Class"],
            "Cycle_Cost": ["週期費用", "Cycle Cost"],
            "Engineering": ["工程人員", "Engineering"],
            "Phone_Number": ["手機號碼", "Phone Number"],
            "STB_Serial_Number": ["機上盒序號", "STB Serial Number"],
            "Build_Hard_Disk": ["是否建硬碟", "Build Hard Disk"],
            "HDD_Serial_Number": ["硬碟序號", "HDD Serial Number"],
            "Submit": ["提交", "Submit"],
            "STB_Authorized": ["機上盒授權開通", "STB Authorized"],
            "STB_IS_Authorizing": ["機上盒授權開通中...", "STB IS Authorizing"],
            "Authorization_Result": ["機上盒授權開通結果", "Authorization Result"],
            "Authorization_Successful": ["機上盒授權開通成功", "Authorization Successful"],
            "Complete": ["完成", "Complete"],
            "Engineering_Change": ["工程人員變更", "Engineering Change"],
            "Engineering_Change_Result": ["變更工程人員結果", "Engineering Change Result"],
            "Change_Failed": ["變更失敗", "Change Failed"],
            "Change_Successful": ["變更成功", "Change Successful"],
            "DTV_Bidirectional_Module_Return": ["DTV雙向模組回填", "DTV Bidirectional Module Return"],
            "Query_DTV_Bidirectional_Module": ["查詢DTV雙向模組", "Query DTV Bidirectional Module"],
            "Query_DTV_Bidirectional_Module_Result": ["查詢DTV雙向模組結果", "Query DTV Bidirectional Module Result"],
            "Read_Return_CM_MAC": ["讀取/回傳 CM MAC 位址", "Read/Return CM MAC"],
            "MAC_Address": ["MAC 位址", "MAC Address"],
            "Pass_Back_Failed": ["回傳結果失敗", "Pass Back Failed"],
            "Reading_Please_Wait": ["讀取中...(請稍候)", "Reading...(Please Wait)"],
            "Read_Return_DTV_Result": ["讀取/回傳 DTV雙向模組結果", "Read/Return DTV Bidirectional Module Result"],
            "Function_Call_Successful": ["功能呼叫成功", ""],
            "Pass_Back": ["回傳", "Pass Back"],

            "Open_Status": ["開通狀態", "Open_Status"],
            "Not_Opened": ["未開通", "Not Opened"],
            "Already_Opened": ["已開通", "Already Opened"],
            "Correction_Level": ["校正等級", "Correction Level"],
            "QRCode_Content": ["QR條碼內容", "QR barcode content"],
            "Please_Confirm_Company_Alias": ["請確認[公司別]", "Please Confirm[Company Alias]"],
            "Low": ["低", "Low"],
            "Middle": ["中", "Middle"],
            "High": ["高", "High"],
            "Save_And_Search": ["儲存并搜尋", "Save And Search"],
            "Current": ["當前", "Current"],

            "update_tips": ["升級提示", "Update Information"],
            "update_text": ["檢測到有新的軟體版本，是否升級？", "A new version of the software is detected. Is it upgraded?"],

            "Full_Format": ["完整格式化", "Full Format"],
            "Low_Level_Format": ["低階格式化", "Low Level Format"],
            "Formatting": ["正在格式化硬碟,請稍等", "formatting hard disk,please wait a moment"],
            "Please_Input_System_Password": ["請輸入工程密碼", "Please Input System Password"],
            "Please_Input_Parent_Password": ["請輸入親子鎖密碼", "Please Input Parent Password"],
            "Please_Input_Persional_Password": ["請輸入個人認證碼", "Please Input Persional Password"],
            "Save_Error": ["儲存失败", "Save Error"],
            "Passwords_Are_Different": ["密碼不一樣", "Passwords Are Different"],
            "Password_Empty": ["密碼為空", "Password Empty"],
            "Password_Must_Be_4_Digits": ["密碼為4位", "Password Must Be 4 Digits"],
            "Password_Change_Sucessful": ["密碼修改成功", "Password Change Sucessful"],
            "Work_Order_Result_Tips": ["查詢工單資訊結果", "Work Order Result Tips"],
            "STB_Work_Order_Inquiry": ["機上盒工單查詢中...", "STB Work Order Inquiry..."],
            "Query_Failed": ["查詢失敗", "Query Failed"],
            "CrmId_Or_WorkNo_Is_Empty": ["公司別或工單簡碼不能為空", "CrmId Or WorkNo Is Empty"],
            "Parameter_MobilePhone_Is_Illegal": ["參數值MobilePhone不合法", "Parameter MobilePhone Is Illegal"],
            "Request_Timeout": ["請求超時", "Request Timeout"],
            "Resolution_Setting": ["解析度設定", "Resolution Setting"],
            "Change_Tips_Before": ["您的解析度已經確定，系統將在", "Your resolution has been determined, the system will be"],
            "Change_Tips_After": ["秒內還原設定，確認保留這些設定么？", "seconds to restore the settings, to confirm the retention of these settings?"],

            "AppUpdateContent": ["請按下OK確認與APP伺服器進行同步", "Press OK to confirm sync with App server"],
            "AppUpdateFail": ["APP伺服器同步失敗", "App server sync failed"],
            "AppUpdateSuccess": ["APP伺服器同步更新完成", "App server sync success"],
            "AppUpdating": ["與APP伺服器進行同步中,請稍等", "it is syncing with App server,please wait a moment"],
            "EdollarFail":["無法透過綫上訂購本頻道，請聯繫客服中心（代碼：E027）","Can not order current channl,please contact customer centre(code:E027)"],
            "NOOTASOFTWARE":["沒有發現OTA升級軟體","Can not find OTA new software"],
            "NOUSB":["沒有發現USB設備","Can not find USB device"],
            "NOUSBSOFTWARE":["沒有發現USB升級軟體","Can not find USB new software"],
        };
}
function DtvCom() {
    var self = this;

    //media player
    this.mp = null;

    //all channel array
    this.chs = [];

    //other service
    this.ots = [];

    this.barkerCh = [];

    this.status = false;
    /*
    * init dtvCommon
    */
    this.init = function () {
        this.mp = new MPlayer(0);

    };

    /*
    *  谁用,谁调用
    */
    this.start = function () {

       /* this.chl = [
            {name: Lp.getValue("fav_Channel"), engName: Lp.getValue("fav_Channel", 1), chs: []},
            {name: Lp.getValue("All_Channel"), engName: Lp.getValue("All_Channel", 1), chs: []},
            {name: Lp.getValue("HD"), engName: Lp.getValue("HD", 1), key: 0x0200, chs: []},
            {name: Lp.getValue("News_Finance"), engName: Lp.getValue("News_Finance", 1), key: 0x0004, chs: []},
            {name: Lp.getValue("Variety"), engName: Lp.getValue("Variety", 1), key: 0x0040, chs: []},
            {name: Lp.getValue("Films_Series"), engName: Lp.getValue("Films_Series", 1), key: 0x0020, chs: []},
            {name: Lp.getValue("Drama_Music"), engName: Lp.getValue("Drama_Music", 1), key: 0x0002, chs: []},
            {name: Lp.getValue("Children_Animation"), engName: Lp.getValue("Children_Animation", 1), key: 0x0010, chs: []},
            {name: Lp.getValue("Leisure_Knowledge"), engName: Lp.getValue("Leisure_Knowledge", 1), key: 0x0008, chs: []},
            {name: Lp.getValue("Sports_Others"), engName: Lp.getValue("Sports_Others", 1), key: 0x0400, chs: []},
            {
                name: Lp.getValue("Public_Welfare_Religion"),
                engName: Lp.getValue("Public_Welfare_Religion", 1),
                key: 0x0001,
                chs: []
            },
            {
                name: Lp.getValue("Foreign_Language_Learning"),
                engName: Lp.getValue("Foreign_Language_Learning", 1),
                key: 0x0100,
                chs: []
            },
            {name: Lp.getValue("Home_Shopping"), engName: Lp.getValue("Home_Shopping", 1), key: 0x0080, chs: []},
            {name: Lp.getValue("Adult"), engName: Lp.getValue("Adult", 1), key: 0x0800, chs: []}
        ];
*/
         console.log("getChannels start");
         self.getChannels();
        console.log("getChannels end");
        console.log("getCategory start");
         self.getCategory();
        console.log("getCategory end");
    };

    this.stop = function () {
        this.mp.mpStop(function () {
        });
    };

    this.reset = function () {
        self.chs = DB.dbGetChannels({"sortId":[1,2,17,22,25]}, false);

        if (!self.chs) {
            self.chs = [];
        }
        //重新排序
        self.barkerCh=[];
        for(var i = 0; i < self.chs.length;i++){
            if(self.chs[i].logicNo >= 1000){
                console.log("reset logicN0="+self.chs[i].logicNo);
                self.barkerCh.push(self.chs[i]);
                self.chs.splice(i, 1);
                i--;
            }
        }

        self.barkerCh.sort(function(a,b){
            return (a.logicNo - b.logicNo);
        });

        utility.setH5Storage("CNS_DVB_BARKERCH", self.barkerCh);
        /////////

        utility.setH5Storage("CNS_DVB_CHS", self.chs);

        this.getCategory();

        sysCom.config.chIndex = 0;

        sysCom.saveConfig();
    };

    this.setAspectRatio = function () {
        self.mp.mpSetAspectRatio(sysCom.config.AspectRatio, false);
    };

    this.setAspectMode = function () {
        self.mp.mpSetAspectMode(sysCom.config.AspectMode, false);
    };

    this.getChannels = function () {
        var obj = utility.getH5Storage("CNS_DVB_CHS");
        if (obj) {
            self.chs = obj;
        }
        else {
            self.chs = DB.dbGetChannels({"sortId":[1,2,17,22,25],"max": 0}, false);

            if (!self.chs) {
                self.chs = [];
            }

            for(var i = 0; i < self.chs.length;i++){
                if(self.chs[i].logicNo >= 1000){
                    self.barkerCh.push(self.chs[i]);
                    self.chs.splice(i, 1);
                    i--;
                }
            }

            self.barkerCh.sort(function(a,b){
                return (a.logicNo - b.logicNo);
            });

            utility.setH5Storage("CNS_DVB_BARKERCH", self.barkerCh);
        }

        obj = utility.getH5Storage("CNS_DVB_BARKERCH");
        if(obj){
            self.barkerCh = obj;
        }

        obj = utility.getH5Storage("CNS_DVB_OTS");
        if (obj) {
            self.ots = obj;
        }
        else {
            self.ots = DB.dbGetChannels({"sortId": [12],"max": 0}, false);
            if (!self.ots) {
                self.ots = [];
            }
            else {
                utility.setH5Storage("CNS_DVB_OTS", self.ots);
            }
        }

    };



    this.getCategory = function () {
        this.chl = [
            {name: Lp.getValue("fav_Channel"), engName: Lp.getValue("fav_Channel", 1), chs: []},
            {name: Lp.getValue("All_Channel"), engName: Lp.getValue("All_Channel", 1), chs: []},
            {name: Lp.getValue("HD"), engName: Lp.getValue("HD", 1), key: 0x0200, chs: []},
            {name: Lp.getValue("News_Finance"), engName: Lp.getValue("News_Finance", 1), key: 0x0004, chs: []},
            {name: Lp.getValue("Variety"), engName: Lp.getValue("Variety", 1), key: 0x0040, chs: []},
            {name: Lp.getValue("Films_Series"), engName: Lp.getValue("Films_Series", 1), key: 0x0020, chs: []},
            {name: Lp.getValue("Drama_Music"), engName: Lp.getValue("Drama_Music", 1), key: 0x0002, chs: []},
            {name: Lp.getValue("Children_Animation"), engName: Lp.getValue("Children_Animation", 1), key: 0x0010, chs: []},
            {name: Lp.getValue("Leisure_Knowledge"), engName: Lp.getValue("Leisure_Knowledge", 1), key: 0x0008, chs: []},
            {name: Lp.getValue("Sports_Others"), engName: Lp.getValue("Sports_Others", 1), key: 0x0400, chs: []},
            {
                name: Lp.getValue("Public_Welfare_Religion"),
                engName: Lp.getValue("Public_Welfare_Religion", 1),
                key: 0x0001,
                chs: []
            },
            {
                name: Lp.getValue("Foreign_Language_Learning"),
                engName: Lp.getValue("Foreign_Language_Learning", 1),
                key: 0x0100,
                chs: []
            },
            {name: Lp.getValue("Home_Shopping"), engName: Lp.getValue("Home_Shopping", 1), key: 0x0080, chs: []},
            {name: Lp.getValue("Adult"), engName: Lp.getValue("Adult", 1), key: 0x0800, chs: []}
        ];


        //init all channel list
        self.chl[1].chs = self.chs;

        //loop all channel  list
        var favCnt = 0;
        for (var i = 0; i < self.chs.length; i++) {
            //init idn
            if(self.chs[i].logicNo>0){
                self.chs[i].idn = self.chs[i].logicNo;
            }
            else {
                self.chs[i].idn = self.chs[i].serviceId;
                self.barkerCh.push(self.chs[i]);
            }

            //add fav list
            if (self.chs[i].userData != null && self.chs[i].userData.fav == 1) {
                self.chl[0].chs[favCnt] = self.chs[i];
                favCnt++;
            }

            //update channel name
            if(languageCom.getMenuLanguage()==0) {
                if(self.chs[i].chiname==="unknown")
                    ;
                else
                    self.chs[i].name= dtvCom.chs[i].chiname;
            }
            else
            {
                if(self.chs[i].engname==="unknown")
                    ;
                else
                  self.chs[i].name = self.chs[i].engname;
            }
        }

        //init channel list category
        for (var i = 0; i < self.chs.length; i++) {
            if (self.chs[i].data && self.chs[i].data.category) {
                for (var k = 2; k < self.chl.length; k++) {
                    if (self.chl[k].key & self.chs[i].data.category) {
                        self.chl[k].chs[self.chl[k].chs.length] = self.chs[i];
                    }
                }
            }
        }

        self.chs.sort(function(a,b){
            return (a.idn - b.idn);
        });

        utility.setH5Storage("CNS_DVB_CHS", self.chs);
    };

    this.getIndexByNo = function (no) {

        for (var i = 0; i < self.chs.length; i++) {
            if (no == self.chs[i].idn) {
                return i;
            }
        }
        return -1;
    };

    this.getChannelByServiceId = function (serviceId) {
        var channel = null;
        if (!serviceId) {
            console.log("getChannelByServiceId param error ");
            return null;
        }

        if (!self.chs && self.chs.length <= 0) {
            console.log("getChannelByServiceId no channels ");
            return null;
        }

        for (var i = 0; i < self.chs.length; i++) {
            if (serviceId == self.chs[i].serviceId) {
                channel = self.chs[i];
            }
        }

        return channel;
    };

    this.getBarkerChannel = function(){
        if(self.barkerCh.length <= 0){
            return null;
        }

        return self.barkerCh[self.barkerCh.length-1];
    };

    this.playBarkerChannel = function(cb){
        if(self.barkerCh.length <= 0){
            return;
        }

        var url = self.getSourceUrlByCh(self.barkerCh[self.barkerCh.length-1]);

        if(url){
            self.mp.mpStart(url,cb);
        }
    };

    this.updateIndex = function(no, step){
        if (self.chs && self.chs.length > 0) {
            if (typeof(no) === "number") {
                var i = self.getIndexByNo(no);
                if (i >= 0) {
                    sysCom.config.chIndex = i;
                }
            }
            else if (typeof(step) === "number") {
                sysCom.config.chIndex += (step + self.chs.length);
                sysCom.config.chIndex %= self.chs.length;
            }
            //数据库保存 当前节目号
            sysCom.saveConfig();
        }
    };
    this.updateIndex_noupdatedbase = function(no, step){
        if (self.chs && self.chs.length > 0) {
            if (typeof(no) === "number") {
                var i = self.getIndexByNo(no);
                if (i >= 0) {
                    sysCom.config.chIndex = i;
                }
            }
            else if (typeof(step) === "number") {
                sysCom.config.chIndex += (step + self.chs.length);
                sysCom.config.chIndex %= self.chs.length;
            }

        }
    };
    /*
    * changeCh
    */
    this.changeCh = function (no, step, real, cb) {
        self.updateIndex(no, step);
        self.doChangeCh(real, cb);
    };

    /*
    * doChangeCh
    */
    this.preUrl = "";
    this.doChangeCh = function (real, cb) {

        var url = this.getSourceUrl();

        //只设置播放地址，不真正播放
        if (typeof real != "undefined" && (real == false)) {
            return;
        }

        console.log("mpStart:"+url);
        self.mp.mpStart(url, function (ret) {
            self.preUrl = url;
            if (!self.status && sysCom.isPowerBoot) {
                self.setAspectRatio();
                self.setAspectMode();
            }
            self.status = true;
            if (cb) {
                cb();
            }
        });
    };

    this.changeChByServiceId = function (serviceId) {

        var url = this.getLiveUrlByServiceId(serviceId);
        console.log("changeChByServiceId url==" + url);
        self.stop();
        self.mp.mpSetDataSource(url, false);
        self.mp.mpStart(url, function (ret) {
            self.status = true;
        });
    };

    this.getCurrentCh = function () {
        var ch = null;
        if (self.chs.length < 0 || sysCom.config.chIndex >= self.chs.length) {
            return ch;
        }
        else {
            ch = self.chs[sysCom.config.chIndex];
        }
        return ch;
    };

    this.getChNameByIdn = function (idn) {
        for (var i = 0; i < dtvCom.chs.length; i++) {
            if (dtvCom.chs[i].idn == idn) {
                if(languageCom.getMenuLanguage()==0) {
                    if(dtvCom.chs[i].chiName=="unknown")
                      return dtvCom.chs[i].name;
                    else
                        return dtvCom.chs[i].chiname;
                }
                else
                {
                    if(dtvCom.chs[i].engname=="unknown")
                        return dtvCom.chs[i].name;
                    else
                        return dtvCom.chs[i].engname;
                }
            }
        }
        return "";
    };

    this.checkChById = function (idn) {
        for (var i = 0; i < dtvCom.chs.length; i++) {
            if (dtvCom.chs[i].idn == idn) {
                return true;
            }
        }
        return false;
    };

    this.getChById = function (idn) {
        for (var i = 0; i < dtvCom.chs.length; i++) {
            if (dtvCom.chs[i].idn == idn) {
                return dtvCom.chs[i];
            }
        }
        return null;
    };
    /*
    * getSourceUrl
    */
    this.getSourceUrl = function (index, no) {
        var url = "";
        if (self.chs && self.chs.length > 0) {
            var channel = self.chs[sysCom.config.chIndex];
            if(!channel){
                return url;
            }
            var audioPid = 0;
            var audioType = 0;

            if (channel.audio && channel.audio.length > 1) {
                if(!channel.userData){
                    channel.userData = {};
                    channel.userData.audioSelect = 0;
                }

                if(!channel.userData.audioSelect){
                    channel.userData.audioSelect = 0;
                }

                if (channel.userData.audioSelect < channel.audio.length) {
                    audioPid = channel.audio[channel.userData.audioSelect].pid;
                    audioType = channel.audio[channel.userData.audioSelect].type;
                }
                else{
                    audioPid = channel.audio[0].pid;
                    audioType = channel.audio[0].type;
                    channel.userData.audioSelect = 0;
                }

                var params = {
                    chanId: channel.idn,
                    data: channel.userData
                };
                DB.dbSetChanUserData(params, function () {
                    utility.setH5Storage("CNS_DVB_CHS", self.chs);
                });
            }
            else if(channel.audio && channel.audio.length == 1){
                audioPid = channel.audio[0].pid;
                audioType = channel.audio[0].type;
            }

            url = "live://"
                + "signal=" + channel.carrier.signal
                + "&freq=" + channel.carrier.freq
                + "&symbol=" + channel.carrier.symbol
                + "&qam=" + channel.carrier.qam
                + "&spectrum" + 0
                + "&aPid=" + audioPid
                + "&vPid=" + channel.video.pid
                + "&pcrPid=" + channel.pcrPid
                + "&aStreamType=" + audioType
                + "&vStreamType=" + channel.video.type
                + "&pmtPid=" + channel.pmtPid
                + "&serviceId=" + channel.serviceId;
        }
        return url;
    };

    this.getChannelByCaLockService = function(chObj){
        for (var i = 0; i < dtvCom.chs.length; i++) {
            var ch = dtvCom.chs[i];
           if( ch.carrier.freq == chObj.frequency &&
               ch.carrier.symbol == chObj.symbolrate &&
               ch.carrier.qam == chObj.modulation &&
               ch.video.pid == chObj.videopid &&
               ch.pcrPid == chObj.pcrpid ){

               return self.getSourceUrlByCh(ch);
           }

        }
        return null;
    };


    this.getSourceUrlByCh = function(channel){
        var url = null;
        if(!channel){
            return url;
        }
        var audioPid = 0;
        var audioType = 0;

        if (channel.audio && channel.audio.length > 1) {
            if(!channel.userData){
                channel.userData = {};
                channel.userData.audioSelect = 0;
            }

            if(!channel.userData.audioSelect){
                channel.userData.audioSelect = 0;
            }

            if (channel.userData.audioSelect < channel.audio.length) {
                audioPid = channel.audio[channel.userData.audioSelect].pid;
                audioType = channel.audio[channel.userData.audioSelect].type;
            }
            else{
                audioPid = channel.audio[0].pid;
                audioType = channel.audio[0].type;
                channel.userData.audioSelect = 0;
            }
        }
        else if(channel.audio && channel.audio.length == 1){
            audioPid = channel.audio[0].pid;
            audioType = channel.audio[0].type;
        }

        url = "live://"
            + "signal=" + channel.carrier.signal
            + "&freq=" + channel.carrier.freq
            + "&symbol=" + channel.carrier.symbol
            + "&qam=" + channel.carrier.qam
            + "&spectrum" + 0
            + "&aPid=" + audioPid
            + "&vPid=" + channel.video.pid
            + "&pcrPid=" + channel.pcrPid
            + "&aStreamType=" + audioType
            + "&vStreamType=" + channel.video.type
            + "&pmtPid=" + channel.pmtPid
            + "&serviceId=" + channel.serviceId;

        return url;
    };

    this.getRecordUrl = function (idn) {
        var url = "";
        if (self.chs && self.chs.length > 0) {
            var index = -1;
            var channel = null;

            if (typeof idn === 'number') {
                index = self.getIndexByNo(idn);
            }

            if (index >= 0 && index < self.chs.length) {
                channel = self.chs[index];
            }

            if (!channel) {
                return "";
            }

            url = "pvrrec://"
                + "signal=" + channel.carrier.signal
                + "&freq=" + channel.carrier.freq
                + "&symbol=" + channel.carrier.symbol
                + "&qam=" + channel.carrier.qam
                + "&spectrum" + 0
                + "&vPid=" + channel.video.pid
                + "&pcrPid=" + channel.pcrPid
                + "&vStreamType=" + channel.video.type
                + "&pmtPid=" + channel.pmtPid
                + "&serviceId=" + channel.serviceId
                + "duration=0";
        }

        return url;
    };

    this.getAudioArray = function(idn){
        var aud = [];
        if (self.chs && self.chs.length > 0) {
            var index = -1;
            var channel = null;

            if (typeof idn === 'number') {
                index = self.getIndexByNo(idn);
            }

            if (index >= 0 && index < self.chs.length) {
                channel = self.chs[index];
            }

            if (!channel) {
                return [];
            }

           aud = channel.audio;
        }

        return aud;
    };
    this.getLiveUrlByServiceId = function (serviceId) {
        var channel = null;
        var url = null;

        if (!serviceId) {
            console.log("getChannelByServiceId param error ");
            return null;
        }

        channel = this.getChannelByServiceId(serviceId);

        if (!channel) {
            console.log("getChannelByServiceId serviceId not in Channels ");
            return null;
        }

        var audioPid = 0;
        var audioType = 0;
        if (channel.audio && channel.audio.length > 1) {
            if(!channel.userData){
                channel.userData = {};
                channel.userData.audioSelect = 0;
            }

            if(!channel.userData.audioSelect){
                channel.userData.audioSelect = 0;
            }

            if (channel.userData.audioSelect < channel.audio.length) {
                audioPid = channel.audio[channel.userData.audioSelect].pid;
                audioType = channel.audio[channel.userData.audioSelect].type;
            }
            else{
                audioPid = channel.audio[0].pid;
                audioType = channel.audio[0].type;
                channel.userData.audioSelect = 0;
            }

            var params = {
                chanId: channel.idn,
                data: channel.userData
            };
            DB.dbSetChanUserData(params, function () {
                utility.setH5Storage("CNS_DVB_CHS", self.chs);
            });
        }
        else if(channel.audio && channel.audio.length == 1){
            audioPid = channel.audio[0].pid;
            audioType = channel.audio[0].type;
        }

        url = "live://"
            + "signal=" + channel.carrier.signal
            + "&freq=" + channel.carrier.freq
            + "&symbol=" + channel.carrier.symbol
            + "&qam=" + channel.carrier.qam
            + "&spectrum" + 0
            + "&aPid=" + audioPid
            + "&vPid=" + channel.video.pid
            + "&pcrPid=" + channel.pcrPid
            + "&aStreamType=" + audioType
            + "&vStreamType=" + channel.video.type
            + "&pmtPid=" + channel.pmtPid
            + "&serviceId=" + channel.serviceId;

        return url;
    };

    this.getChannelByUrl = function (url) {
        if (url.substring(0, 7) != "live://") return null;
        var arr1 = url.split("&");
        var arr2 = arr1[13].split("=");
        var serviceId = parseInt(arr2[1]);

        return this.getChannelByServiceId(serviceId);
    };

    this.getChannelByName = function(name){
        var ch = null;
        for(var i = 0; i < self.ots.length;i++){
            if(self.ots[i].name == name){
                ch  = self.ots[i];
                break;
            }
        }
        return ch;
    };

    /*
    * 检查时段锁：检查当前时段是否加锁
    * return:   true:当前时段加锁     false:当前时段没有加锁
    */
    this.checkTimeLock = function () {
        if(!sysCom.config.WorkTimeSet){
            return false;
        }

        var startDate = new Date();
        startDate.setHours(sysCom.config.WorkTimeStart.hour);
        startDate.setMinutes(sysCom.config.WorkTimeStart.minute);

        var endDate = new Date();
        endDate.setHours(sysCom.config.WorkTimeEnd.hour);
        endDate.setMinutes(sysCom.config.WorkTimeEnd.minute);

        var curDate = new Date();

        if(startDate.getTime() >= endDate.getTime()){
            return false;
        }

        if(startDate.getTime() <= curDate.getTime()  && curDate.getTime() <= endDate.getTime()){
            return false;
        }
        else{
            return true;
        }
    };

    /*
    * 检查亲子锁：查看节目观看等级，与 设置的亲子等级
    * return:   true:观看等级低于亲子等级    false:观看等级高于亲子等级
    */
    this.checkParentalLock = function (epgRating) {
        if (epgRating < sysCom.config.ParentLockLevel) {
            return false;
        }
        else {
            return true;
        }
    };

    /*
     * 检查频道锁：
     * return:   true:有    false:无
     */
    this.checkChannelLock = function (ch) {
        var flag = false;

        if (!ch) {
            return false;
        }

        if (ch.userData && ch.userData.lock) {
            return true;
        }
        else {
            return false;
        }
    };

    /*
    * 设置频道锁
    * ch:频道   flag- true : lock   false: unlcok
    */
    this.setChannelLock = function (index, flag) {
        if (index < 0 || index > dtvCom.chs.length) {
            return;
        }
        //check userData
        if (!self.chs[index].userData) {
            self.chs[index].userData = {};
        }
        self.chs[index].userData.lock = flag ? 1 : 0;


        var params = {
            chanId: self.chs[index].id,
            data: self.chs[index].userData
        };
        DB.dbSetChanUserData(params, function () {
            utility.setH5Storage("CNS_DVB_CHS", self.chs);
        });
    };

    this.setAllChannelUnlock = function () {
        if (!dtvCom.chs.length) {
            return;
        }

        for (var i = 0; i < dtvCom.chs.length; i++) {
            if (!self.chs[i].userData) {
                self.chs[i].userData = {};
                continue;
            }
            self.chs[i].userData.lock = 0;

            var params = {
                chanId: self.chs[i].id,
                data: self.chs[i].userData
            };
            DB.dbSetChanUserData(params, function () {

            });
        }
        //check userData
        utility.setH5Storage("CNS_DVB_CHS", self.chs);

    };

    /*
     * 设置频道喜爱
     * ch:频道   flag- true : fav   false: unfav
     */
    this.setChannleFav = function (index, flag) {
        if (index < 0 || index > dtvCom.chs.length) {
            return;
        }

        //check userData
        if (!self.chs[index].userData) {
            self.chs[index].userData = {};
        }

        self.chs[index].userData.fav = flag ? 1 : 0;

        var params = {
            chanId: self.chs[index].id,
            data: self.chs[index].userData
        };
        //save
        DB.dbSetChanUserData(params, function () {
            utility.setH5Storage("CNS_DVB_CHS", self.chs);
        });

        //init fav channel list
        var favCnt = 0;
        self.chl[0].chs = new Array();
        for (var i = 0; i < self.chs.length; i++) {
            if (self.chs[i].userData != null && self.chs[i].userData.fav == 1) {
                self.chl[0].chs[favCnt] = self.chs[i];
                favCnt++;
            }
        }
    };
    this.checkChannelFav = function (ch) {
        var flag = false;

        if (!ch) {
            return false;
        }

        if (ch.userData && ch.userData.fav) {
            return true;
        }
        else {
            return false;
        }
    };

    this.changeAudio = function (params) {
        this.mp.mpSetAudioTrack(params, false);
    }
}
var dtvCom = new DtvCom();

console.log("DtvCommon init !");
 dtvCom.init();
console.log("DtvCommon init end");
if( g_url.indexOf("cview_app_6z18_cns") >=0) {
    dtvCom.start();//内置应用
}
else {

    setTimeout(dtvCom.start,500);
}
console.log("DtvCommon start end");
function AppCommon(){
    var self = this;

    //this.path = "file://";
    this.path = DtvCall.file;

    this.needLoadIcon = false;
 
    //应用分类
    this.category = [
        {
            value : 0,
            name : "Portal"
        },
        {
            value : 1,
            name : "Folder"
        },
        {
            value : 2,
            name : "Application"
        },
        {
            value : 3,
            name : "Bound"
        },
        {
            value : 4,
            name : "Global"
        }
    ];

    //所有应用列表
    this.allApplist = [];

    //已安装应用列表
    this.curApplist = [];

    this.curApp = -1;

    this.init = function(){

        self.allApplist = [];
        self.curApplist = [];

        //每次开机时,才走这个分支
        if(sysCom.isPowerBoot)
        {
            sysCom.config.mute = 0;
            sysCom.setMemConfig("nostandby",1);

            sysCom.setVolume();
            sysCom.setMemConfig("apprenew",1);
            AppManager.setAppStoreUrl(sysCom.config.AppStoreURL,false);
            console.log("setAppStoreUrl="+sysCom.config.AppStoreURL);

            //sysCom.config.LayoutVersion = 0;
            if(0)//*/self.getServerLayoutVersion() && self.checkLayoutVersion() == false)
            {
                self.getAllApplist();
                var loop_ret = self.loopAllAppList();
                console.log("loopAllAppList="+loop_ret);
                if(self.layout_version && loop_ret == 0)
                {
                  sysCom.config.LayoutVersion = self.layout_version;
                  console.log("saveConfig LayoutVersion="+sysCom.config.LayoutVersion );
                  sysCom.saveConfig();
                }
            }
            else
            {
               self.getCurAppList();
               sysCom.setMemConfig("current_app_list",self.curApplist);
            }
           // var i_ret = AppManager.getStaus(false);
            //console.log("getStaus="+i_ret);
            console.log("isPowerBoot self.curApplist.length="+self.curApplist.length);
            i_ret = AppManager.forceUpdate(false);
            console.log("forceUpdate="+i_ret);


            Disp.disableBootlogo("",false);
            Disp.setResolution(sysCom.config.Reslution);

        }
        else
        {
            //self.getCurAppList();

            self.curApplist = sysCom.getMemConfig("current_app_list");
            var apprenew = sysCom.getMemConfig("apprenew");

            if(!self.curApplist || self.curApplist.length<=0 || (apprenew && apprenew == 1))
            {
                self.getCurAppList();

                sysCom.setMemConfig("current_app_list",self.curApplist);
            }
            console.log("second Boot self.curApplist.length="+self.curApplist.length);
        }
		
        //进入tvportal页面时,才进行导入图标操作
      /*  if( sysCom.isPowerBoot || sysCom.memConfig.current_app_id == self.getAppByName("tvportal").app_id)
        {
            sysCom.setMemConfig("current_app_id",self.getAppByName("tvportal").app_id);

        }*/
        if( g_url.indexOf("cview_app_6z18_cns_tvportal") >=0) {//tv portal才加载
            self.needLoadIcon = true;
            self.loadTvportalIcon();
        }

    };


    this.forceUpdate= function(){
        self.getAllApplist();
        var loop_ret = self.loopAllAppList();
        console.log("loopAllAppList="+loop_ret);
        if(self.layout_version && loop_ret == 0)
        {
            sysCom.config.LayoutVersion = self.layout_version;
            console.log("saveConfig LayoutVersion="+sysCom.config.LayoutVersion );
            sysCom.saveConfig();
            return 0;
        }
        else
        {
            return -1;
        }
    };

    this.reset = function(){

    };

    /************AppCom 应用模块基础相关接口***********/
    this.installAppById = function(appId){
        return AppManager.installAppById(parseInt(appId),false);
    };
    this.installIconById = function(appId){
       return AppManager.installIconById(parseInt(appId),false);
    };
    this.unstallAppById = function(appId){
        return AppManager.uninstallAppById(parseInt(appId),false);
    };
    this.getAllApplist = function()
    {
        var ret = AppManager.getAllAppList(false);
        if(ret){
            self.layout_version = ret.query_reply.app_configuration.layout_version;
            self.allApplist = ret.query_reply.app_configuration.app_list.app_info;
            console.log("getAllApplist LayoutVersion="+self.layout_version);
            return true;
        }
        else
        {
            return false;
        }
    };

    this.getCurAppList = function(){
        var ret =  utility.getH5Storage("CNS_DVB_APP");
        var apprenew = sysCom.getMemConfig("apprenew");
        console.log("test===========>apprenew="+apprenew);
        if(ret && !(apprenew && apprenew == 1))
        {
            console.log("AppCom getAppList From Storage");
        }
        else
        {
            console.log("AppCom getAppList From Server");
            ret  =  {};
            sysCom.setMemConfig("apprenew",0);
            ret = AppManager.getCurAppList(false);
            if(ret)
            {
                utility.setH5Storage("CNS_DVB_APP",ret);
            }
        }

        if(ret && ret.AppLocalList)
        {
            self.curApplist = ret.AppLocalList;
            self.curApplist.forEach(function(data, index, arr){
                console.log("name:"+arr[index].launch_app_name);
                if(arr[index].link_point){
                    arr[index]["link_point_array"] = handleLinkPoint(arr[index].link_point);
                }
            });
            return true;
        }
        else
        {
            return false;
        }
    };

    this.getAppByName = function(name){
        for(var i=0;i < self.curApplist.length;i++)
        {
            if(self.curApplist[i].launch_app_name == name)
            {
                return self.curApplist[i];
            }
        }
        return null;
    };

    this.getAppInfoById = function(id){
        var idx = parseInt(id);
        for(var i=0;i < self.curApplist.length;i++)
        {
            if(self.curApplist[i].app_id == idx)
            {
                return self.curApplist[i];
            }
        }
        return null;
    };

    this.getLinkPointByAppId = function(id)
    {
        var app = self.getAppInfoById(id);
        if(app)
        {
            return app.link_point;
        }
        return null;
    };

    this.checkCurAppIsLocalApp = function(){
        var testurl = window.location.href;
        if(testurl.indexOf("cview_app_6z18_cns")>0){
            return true;
        }
        else{
            return false;
        }
    };

	this.getAppIdByLinkPointArry = function(lpAry){

		for(var i=0;i < self.curApplist.length;i++)
        {
            if(JSON.stringify(self.curApplist[i].link_point_array) == JSON.stringify(lpAry))
            {
                return self.curApplist[i].app_id;
            }
        }
		return null;
	};

	this.clearVolume=function()
    {
        var n = window.top.document.getElementById("volume");
        if(n) {
            n.parentNode.removeChild(n);
        }
    };




    this.BeforeJumpAppDoThings = function(){
        Subtitle.subtStop(null,false);
        dtvCom.stop();
        self.clearVolume();
        var testurl = window.location.href;
        if(testurl.indexOf("cview_app_6z18_cns_system_setting")>=0)
        {
            console.log("close system memu sysCom.config.gongchengmenu="+sysCom.config.gongchengmenu);
            if(sysCom.config.gongchengmenu  ==  1) {
                sysCom.config.gongchengmenu = 0;
                sysCom.saveConfig();
            }
        }
    };

    this.getUrlByName = function(name){

        for(var i=0;i < self.curApplist.length;i++)
        {
            if(self.curApplist[i].launch_app_name == name)
            {

                    return self.path+self.curApplist[i].main_url;


            }
        }
        return "";
    };
    this.goAppByName = function(name,back){
     
        for(var i=0;i < self.curApplist.length;i++)
        {
            if(self.curApplist[i].launch_app_name == name)
            {
                var testurl = window.location.href;
                var new_url = self.path+self.curApplist[i].main_url;
               // if( sysCom.getMemConfig("current_app_id") != self.curApplist[i].app_id || testurl.indexOf("http")>=0)
                if(testurl !=new_url)
                {

                    if(name == "tvportal" ) {//是 返回tvportal,返回tvportal出口位置
                        if(back == true) {
                            var last_app_id = sysCom.getMemConfig("last_app_id");
                            var current_app_id = sysCom.getMemConfig("current_app_id");
                            //    sysCom.setMemConfig("last_app_id",current_app_id);
                            console.log("goAppByName last_app_id=" + last_app_id);
                            console.log("goAppByName current_app_id=" + current_app_id);
                            console.log("goAppByName tvportal back == true" );

                        }
                        else
                        {
                            sysCom.setMemConfig("returnid",0);
                            var curId = appCom.getAppByName("tvportal").app_id;

                            sysCom.setMemConfig("current_app_id", curId);
                            sysCom.setMemConfig("last_app_id", curId);

                            var last_app_id = sysCom.getMemConfig("last_app_id");
                            var current_app_id = sysCom.getMemConfig("current_app_id");
                            console.log("goAppByName last_app_id=" + last_app_id);
                            console.log("goAppByName current_app_id=" + current_app_id);
                            console.log("goAppByName tvportal back == false returnid="+sysCom.getMemConfig("returnid"));

                        }
                    }

                    else
                    {
                        sysCom.setMemConfig("returnid",0);
                        var last_app_id = sysCom.getMemConfig("current_app_id");
                        sysCom.setMemConfig("last_app_id",last_app_id);
                        sysCom.setMemConfig("current_app_id", self.curApplist[i].app_id);

                    }
                    //sysCom.setMemConfig("current_app_id",self.curApplist[i].app_id);
                    console.log("jump  start"+(new Date()).getTime());
                    self.BeforeJumpAppDoThings();
                    window.location.href = new_url;
                    self.curApp = i;
                }
            }
        }
    };



    this.goAppByID = function(id,cb)//从tvportal到其他应用
    {
        for(var i=0;i < self.curApplist.length;i++)
        {
            if(self.curApplist[i].app_id == id)
            {
                //普通应用
                if(sysCom.getMemConfig("current_app_id") != self.curApplist[i].app_id)
                {


                    var last_app_id = sysCom.getMemConfig("last_app_id");
                    var current_app_id = sysCom.getMemConfig("current_app_id");

                    sysCom.setMemConfig("returnid",self.curApplist[i].app_id);

                    console.log("goAppByID last_app_id="+last_app_id);
                    console.log("goAppByID current_app_id="+current_app_id);

                    console.log("goAppByID url:"+self.path+self.curApplist[i].main_url);
                    self.BeforeJumpAppDoThings();
                    window.location.href = self.path+self.curApplist[i].main_url;
                    self.curApp = i;
                }
            }
        }
    };

    this.goAppByUrl = function(url){

	   if(url.substring(0,13)=="#player/main/"){
			var param =  url.substring(13,url.length);
			var app = this.getAppByName("livetv");
			var newURL = self.path+ app.main_url+"?"+param;
            self.BeforeJumpAppDoThings();
			window.location.href = newURL;
			return;
		}
        for(var i=0;i < self.curApplist.length;i++)
        {
            if(self.curApplist[i].main_url == url)
            {
                var testurl = window.location.href;
                console.log("=====>cur url = "+testurl);


                var new_url = self.path+self.curApplist[i].main_url;
                // if( sysCom.getMemConfig("current_app_id") != self.curApplist[i].app_id || testurl.indexOf("http")>=0)
                if(testurl !=new_url)
                {

                    var last_app_id = sysCom.getMemConfig("current_app_id");
                    sysCom.setMemConfig("last_app_id",last_app_id);
                    sysCom.setMemConfig("current_app_id",self.curApplist[i].app_id);
                    /*if(self.checkEmedy(self.curApplist[i].launch_app_name))
                    {
                        self.BeforeJumpAppDoThings();
                        window.location.href = self.checkEmedy(self.curApplist[i].launch_app_name);
                    }
                    else*/
                    {
                        self.BeforeJumpAppDoThings();
                        window.location.href = self.path+self.curApplist[i].main_url;
                    }

                    
                    self.curApp = i;
                }
            }
        }
    };

    /************AppCom 应用升级检测与安装***********/
    this.getStbLayoutVersion = function()
    {
        return sysCom.config.LayoutVersion;
    };

    this.getServerLayoutVersion = function(){
      if(self.layout_version) {
          console.log("getServerLayoutVersion have exist");
          return self.layout_version;
      }
        var serverVersion = AppManager.getAppLayout(false);
        if(serverVersion && serverVersion.query_reply && serverVersion.query_reply.layout_version)
        {
            self.layout_version = serverVersion.query_reply.layout_version;
            console.log("getServerLayoutVersion have got and return");
            return serverVersion.query_reply.layout_version;
        }
        console.log("getServerLayoutVersion null");
        return null;
    };


    this.checkLayoutVersion = function()
    {
       // return true;
        var stbV = parseInt(self.getStbLayoutVersion(),10);
        var serV = parseInt(self.getServerLayoutVersion(),10);
        
        
            console.log("checkLayoutVersion stbV:"+stbV);
            console.log("checkLayoutVersion serV:"+serV);
        
        if(stbV == serV)
        {
            return true;
        }
        else
        {
            return false;
        }
    };

    //true:版本相同     false:版本不同
    this.checkAppVersion = function(id,serverVersion){
        for(var i = 0; i < self.curApplist.length; i++)
        {
            if(parseInt(self.curApplist[i].app_id,10) == parseInt(id,10))
            {
                if(self.curApplist[i].version == serverVersion)
                {
                    return true;
                }
            }
        }
        return false;
    };

    //true:已安装     false:未安装
    this.checkHasInstallApp = function(id){
        for(var i = 0; i < self.curApplist.length; i++)
        {
            if(parseInt(self.curApplist[i].app_id,10) == parseInt(id,10))
            {
                return true;
            }
        }
        return false;
    };

    this.loopAllAppList = function(){
        var i_ret = 0;
        for(var i = 0; i < self.allApplist.length;i++)
        {
            console.log("name:"+self.allApplist[i].launch_app_name+"  link_ponit:"+self.allApplist[i].link_point+"   category:"+self.allApplist[i].category);

            //检查内嵌
			switch(self.allApplist[i].launch_app_name)
            {
				case "tvportal":
				case "livetv":
				case "epg":
				case "pvrScheduledList":
				case "pvrScheduleByTime":
				case "pvrScheduleByEvent":
				case "pvrRecordedList":
				case "systemsetting":
				case "mailbox":
				case "setting":
                case "pvrf":
                case "personalf":
				    console.log("updateLinkpointByname emmba:"+self.allApplist[i].launch_app_name);
                     var params ={lunch_name:self.allApplist[i].launch_app_name,link_point:self.allApplist[i].link_point};
                    i_ret=AppManager.updateLinkpointByname(params,false);
                    console.log("updateLinkpointByname ret="+i_ret);
                    if(i_ret != 0) {
                        console.log("updateLinkpointByname "+params.toString()+" failed");
                    }
					 continue;
				break;
			}

            //检查应用是否强制安装
            if(self.allApplist[i].force_download && (self.allApplist[i].category == "0" || self.allApplist[i].category == "2" || self.allApplist[i].category == "3"|| self.allApplist[i].category == "4"  ))
            {
                console.log("force_download:"+self.allApplist[i].launch_app_name);
                if(self.checkHasInstallApp(self.allApplist[i].app_id) == false)
                {
                    console.log("force_download  not install :"+self.allApplist[i].launch_app_name);
                    //应用尚未安装，安装应用
                    var t_ret = self.installAppById(self.allApplist[i].app_id);
                    console.log("1 installAppById ret="+t_ret);

                    if(t_ret != 0) {
                        console.log("1 installAppById  "+allApplist[i].app_id+" failed and return");
                        break;
                    }
                }
                else if(self.checkAppVersion(self.allApplist[i].app_id,self.allApplist[i].version) == false)
                {
                    onsole.log("force_download  has install :"+self.allApplist[i].launch_app_name);
                    //应用版本不同，升级应用
                    self.unstallAppById(self.allApplist[i].app_id);
                    var t_ret = self.installAppById(self.allApplist[i].app_id);
                    console.log("2 installAppById ret="+t_ret);
                    if(t_ret != 0) {
                        console.log("2 installAppById  "+allApplist[i].app_id+" failed and return");
                        break;
                    }
                }
            }
            //此分支: 非强制安装应用，但是需要在tvportal上显示图标的应用
            else
            {
                console.log("not force_download:"+self.allApplist[i].launch_app_name);
                if(self.checkHasInstallApp(self.allApplist[i].app_id) == false)
                {
                    //应用尚未安装，安装图片
                    console.log("installIconById="+self.allApplist[i].app_id);

                   var  t_ret = self.installIconById(self.allApplist[i].app_id);
                    console.log("3 installAppById ret="+t_ret);
                    if(t_ret != 0) {
                        console.log("3 installIconById  "+allApplist[i].app_id+" failed and return");
                        break;
                    }
                }
                else if(self.checkAppVersion(self.allApplist[i].app_id,self.allApplist[i].version) == false)
                {
                    //应用版本不同 ，升级应用图标
                      console.log("un and installIconById="+self.allApplist[i].app_id);
                    self.unstallAppById(self.allApplist[i].app_id);
                   var t_ret = self.installIconById(self.allApplist[i].app_id);
                    console.log("4 installIconById ret="+t_ret);
                    if(t_ret != 0) {
                        console.log("4 installIconById  "+allApplist[i].app_id+" failed and return");
                        break;
                    }
                }
            }
        }
        self.getCurAppList();
        return 0;
    };

    /************AppCom tvportal服务接口***********/
    this.getIconUrlById = function(id){

        for(var i = 0; i < self.curApplist.length; i++){

            if(id == self.curApplist[i].app_id){
                return self.path + self.curApplist[i].icon_url;
            }
        }
        return "";
    };

    this.loadTvportalIcon = function(){

        self.loadTotalNum = 0;
        self.loadedNum = 0;

        for(var i = 0; i < self.curApplist.length; i++){
            if(self.curApplist[i].category == "1" || self.curApplist[i].category == "2" )
            {
                self.loadTotalNum++;
                var IconUrl = self.getIconUrlById(self.curApplist[i].app_id);
                self.curApplist[i]["IconSrc"] = new Image();
                self.curApplist[i]["IconSrc"].src = IconUrl;
               // console.log("Iconsrc="+IconUrl);
                self.curApplist[i]["IconSrc"].onload = function(){

                    self.loadedNum ++;
                   // console.log("have loadedNum="+self.loadedNum );
                };
            }
        }

        var timeout = 0;
        self.loadImgeOk = false;
        self.loadTimer = setInterval(function(){
            if(self.loadedNum == self.loadTotalNum) {
                self.loadImgeOk = true;
                clearInterval(self.loadTimer);
            }

            if(timeout > 600) {
                clearInterval(self.loadTimer);
            }

            timeout++;
        },200);
    };
    /*
    *根据link_ponit 获取当前tvportal页的所有应用
    */
    this.getAppListByLinkPonit = function(lp){
        var link_point = lp ? lp : "0";
        var curLevelAppArray = [];
        //判读是否为tvportal
        if(parseInt(link_point,10) == self.category[0].value){

            for(var i = 0; i < self.curApplist.length; i++)
            {
                if(self.curApplist[i].link_point && self.curApplist[i].link_point_array && (self.curApplist[i].category == "1" || self.curApplist[i].category == "2"))
                {

                    if(self.curApplist[i].link_point_array.length == 1)
                    {
                        console.log("come");
                        curLevelAppArray[curLevelAppArray.length] = self.curApplist[i];
                    }
                }
            }

            self.sortAppbyLinkPoint(curLevelAppArray);
            return curLevelAppArray;
        }


        for(var i = 0; i < self.curApplist.length; i++)
        {
            if(self.curApplist[i].link_point &&(self.curApplist[i].category == "1" || self.curApplist[i].category == "2"))
            {
                if(self.checkLinkPointRelationship(self.curApplist[i].link_point, link_point)){
                    curLevelAppArray[curLevelAppArray.length] = self.curApplist[i];
                }
            }
        }
        self.sortAppbyLinkPoint(curLevelAppArray);
        return curLevelAppArray;
    };

    this.checkLinkPointRelationship = function(childLp, parentLp){
        var childLpArray = handleLinkPoint(childLp);
        var parentLpArray = handleLinkPoint(parentLp);
        childLpArray.pop();
        if(childLpArray.join("") == parentLpArray.join(""))
        {
            return true;
        }
        return false;
    };

    this.sortAppbyLinkPoint = function(appList)
    {
        appList.sort(function(a, b)
        {
            var alpIndex = a.link_point_array[a.link_point_array.length-1];
            var blpIndex = b.link_point_array[b.link_point_array.length-1];

            if(alpIndex > blpIndex){
                return 1;
            }
            else {
                return -1;
            }
        });
    };


    
    function handleLinkPoint(linkPoint){
        var lpArray = new Array();
        if(linkPoint){
            lpArray = linkPoint.split(":");
        }

        lpArray.forEach(function(data, index, arr){
            arr[index] = parseInt(data, 10);
        });
        return lpArray;
    }
}

var appCom = new AppCommon();
console.log("appCom init");
if( g_url.indexOf("cview_app_6z18_cns_tvportal") >=0) {
    console.log("appCom init in tvportal");
    appCom.init();
}
else {
    console.log("appCom init timout");
    setTimeout(appCom.init, 500);
}
console.log("appCom init end");
function EpgCommon(){
    var self = this;
    this.timer = null;

    this.gIndex = 0;

    this.multiChannelNum = 5;

    //EPG data
    this.chsEpgData = [
        {"ch":"","shc":null,"shcFormat":[],"pf":null,"pfFormat":[]}
    ];

    /*
    * init Epg
    */
    this.init = function()
    {
        //start epg
        /*if(!sysCom.memConfig)
        {
            Epg.start(null,false);
        }*/
    };

    /**
     * epg模块开始操作
     */
    this.start = function()
    {
        self.initChannelEpgList();

        /*self.openTimer();

        var ret = utility.getH5Storage("CNS_DVB_EPG");
        if(ret)
        {
            self.chsEpgData = ret;
        }

        ret = utility.getH5Storage("CNS_DVB_EPG_INDEX");

        if(ret)
        {
            self.gIndex = ret;
        }
        else
        {
            self.gIndex = 0;
        }*/
    };

    /**
     * 根据所有频道,初始化EPG信息存储列表
     */
    this.initChannelEpgList = function()
    {
        self.chsEpgData = new Array();
        for(var i = 0;i < dtvCom.chs.length; i++)
        {
            self.chsEpgData[i] = {};
            self.chsEpgData[i]["ch"] = {
                idn:dtvCom.chs[i].idn,
                name:dtvCom.chs[i].name,
                tsId:dtvCom.chs[i].tsId,
                oriNetworkId:dtvCom.chs[i].oriNetworkId,
                serviceId:dtvCom.chs[i].serviceId
            };
            self.chsEpgData[i]["shc"] = null;
            self.chsEpgData[i]["pf"] = null;
        }
    };

    /**
     * epg模块后台定时更新数据线程
     */
    this.openTimer = function()
    {
        self.closeTimer();
        if(dtvCom.chs.length > 0)
        {
            self.timer = setInterval(function()
            {
                doGetMultiChannelShc();

            },1000*10);
        }
    };


    this.closeTimer = function()
    {
        if(self.timer)
        {
            clearInterval(self.timer);
        }
    };

    /**
     * epg模块恢复出厂设置
     */
    this.reset = function()
    {
        self.gIndex = 0;
        self.initChannelEpgList();
        self.openTimer();
    };

    /*
    * stop Epg
    */
    this.stop = function()
    {
        Epg.stop(null,false);

    };

    this.getEpgBySerialKey = function(ch,startTime,serialKey){
        var flag = false;
        var data = [];
        var shc = Epg.epgGetSch(ch.tsId,ch.oriNetworkId,ch.serviceId,false);
        if(shc && shc.length > 0){
            for(var i = 0; i < shc.length; i++){
                if(shc[i].seriesLinking && (shc[i].seriesLinking.series_key == serialKey) && (shc[i].startTime >= startTime)) {
                    flag = false;
                    for(var j = 0; j < data.length; j++){
                        if(data[j].seriesLinking.episode_key == shc[i].seriesLinking.episode_key){
                            flag = true;
                            break;
                        }
                    }
                    if(!flag){
                        data.push(shc[i]);
                    }
                }
            }
        }
        return data;
    };


    /**
     * UI获取EPG周报信息的接口,此接口是在已查询的数组中获取EPG信息
     * @param ch
     * @param date
     * @returns {Array}
     */
    this.getChannelSch = function(ch,date)
    {
        var index = getIndexbyId(ch);
        var ret = [];
        if(index >= 0)
        {
            var shcFormatArray = getShcFormat(self.chsEpgData[index].shc,self.chsEpgData[index].ch);
            ret = self.getShcByDate(shcFormatArray,date);
        }
        return ret;
    };
    /**
     * UI直接获取EPG周报信息的接口,此接口直接获取底层EPG数据
     * @param ch    频道
     * @param date  日期
     * @param callback  回调函数
     */
    this.getChannelSchDirect = function(ch ,date,cb){

        Epg.epgGetSch(ch.tsId,ch.oriNetworkId,ch.serviceId,function(ret)
        {
            var index = getIndexbyId(ch);
            if(index >= 0)
            {
                var mCh = self.chsEpgData[index].ch;
                self.chsEpgData[index].shc = ret;

                cb(true,self.getShcByDate(getShcFormat(ret,mCh),date),ch,date);
            }
        });
    };

    /*
    * UI 获取PF信息接口
    * */
    this.getChannelPf = function(ch,cb)
    {
        var index = getIndexbyId(ch);
        if(cb)
        {
            Epg.epgGetPf(ch.tsId,ch.oriNetworkId,ch.serviceId,function(ret){
                cb(self.getPfFormat(ret,ch));
            });
        }
        else
        {
            var ret = Epg.epgGetPf(ch.tsId,ch.oriNetworkId,ch.serviceId,false);
            return self.getPfFormat(ret,ch)
        }
    };



    this.getPfFormat = function(pf,ch)
    {
        var pfArray = new Array();

        if(pf && pf.length == 2)
        {
            for(var i = 0; i < 2;i ++)
            {
                pfArray[i] = {};
                pfArray[i].startDate = getEpgStartDate(pf[i].startTime);
                pfArray[i].endDate = getEpgEndDate(pfArray[i].startDate,pf[i].duration);
                pfArray[i].name = "" + pf[i].name;
                pfArray[i].timeStr = formatTime2(pfArray[i].startDate,pfArray[i].endDate);
                pfArray[i].process = bannerPfProcess(pfArray[i].startDate,pf[i].duration);
                pfArray[i]["idn"] = ch.idn;
                pfArray[i]["chname"] = ch.name;
                if(pf[i].parentRating && pf[i].parentRating.rating){
                    pfArray[i]["level"] = pf[i].parentRating.rating;
                }
                else{
                    pfArray[i]["level"] = 0;
                }
                pfArray[i]["rawData"] = pf[i];
            }
        }
        return pfArray;
    };

    /**
     *
     */
    function doGetMultiChannelShc()
    {
        var  paramsArray = [];
        for(var i = self.gIndex; i < self.chsEpgData.length;i++,self.gIndex++)
        {
            var ch = self.chsEpgData[i].ch;
            if(paramsArray.length >= self.multiChannelNum)
            {
                break;
            }
            var o = {
                "tsId": ch.tsId,
                "orgNId": ch.oriNetworkId,
                "serviceId": ch.serviceId
            };

            paramsArray.push(o);
        }


        self.gIndex %= self.chsEpgData.length;

        utility.setH5Storage("CNS_DVB_EPG_INDEX",self.gIndex);

        //get shc from ts
        Epg.epgGetSchMulti(paramsArray,function(ret)
        {
            for(var i = 0; i < ret.length;i++)
            {
                var obj = ret[i];
                var index = getIndexBy3Id(obj.chan.tsId,obj.chan.orgNId,obj.chan.serviceId);

                if(index >= 0)
                {
                    //self.chsEpgData[index].shc = obj.sch;
                }
            }
            //Utility.setH5Storage("CNS_DVB_EPG",self.chsEpgData);
        });
        console.log("CNS_DVB_EPG length:"+JSON.stringify(self.chsEpgData).length);
    };

    function getIndexbyId(ch)
    {
        for(var i = 0;i < self.chsEpgData.length;i++)
        {
            if(self.chsEpgData[i].ch.idn == ch.idn)
            {
                return i;
            }
        }
        return -1;
    }

    function getIndexBy3Id(tsId,onId,serviceId)
    {
        for(var i = 0;i < self.chsEpgData.length;i++)
        {
            var obj = self.chsEpgData[i];
            if(obj.ch.tsId == tsId && obj.ch.oriNetworkId == onId && obj.ch.serviceId == serviceId)
            {
                return i;
            }
        }
        return -1;
    }

    function getShcFormat(shc,ch)
    {
        var shcArray = new Array();
        if(shc && shc.length > 0)
        {
            for(var i=0; i < shc.length;i++)
            {

                shcArray[i] = {};
                shcArray[i]["startDate"] = getEpgStartDate(shc[i].startTime);
                shcArray[i]["endDate"] = getEpgEndDate(shcArray[i]["startDate"],shc[i].duration);
                shcArray[i]["str"] = formatTime2(shcArray[i]["startDate"],shcArray[i]["endDate"]) + "  " + shc[i]["name"];
                shcArray[i]["idn"] = ch.idn;
                shcArray[i]["chname"] = ch.name;
                if(shc[i].parentRating && shc[i].parentRating.rating){
                    shc[i]["level"] = shc[i].parentRating.rating;
                }
                else{
                    shc[i]["level"] = 0;
                }

                shc[i]["ch"] = ch;
                shcArray[i]["rawData"] = shc[i];

            }
        }
        return shcArray;
    }

    this.getShcByDate = function(shcFormatArray,date)
    {
        var ary = new Array();
        for(var i = 0; i < shcFormatArray.length;i++)
        {
            if( (shcFormatArray[i].startDate.getFullYear() == date.getFullYear()) &&
                (shcFormatArray[i].startDate.getMonth() == date.getMonth()) &&
                (shcFormatArray[i].startDate.getDate() == date.getDate())
            )
            {
                var d = new Date();
                if( (d.getFullYear() == date.getFullYear()) &&
                    (d.getMonth() == date.getMonth()) &&
                    (d.getDate() == date.getDate())

                ){
                    if(shcFormatArray[i].endDate >= date){
                        ary[ary.length] = shcFormatArray[i];
                    }
                }
                else{
                    ary[ary.length] = shcFormatArray[i];
                }

            }
        }
        return ary;
    }
}

var epgCom = new EpgCommon();
console.log("epgCom init");
epgCom.init();
epgCom.start();
function EventCommon(){

    var self = this;
    this.timer = null;
    this.ws = null;
    this.url = "ws://127.0.0.1:18100";
    this.callback = {
        HEART:{
            code:0,
            cb:[]
        },
        SIGNAL:{
            code:1,
            cb:[]
        },
        NETWORK:{
            code:2,
            cb:[]
        },
        CA:{
            code:3,
            cb:[]
        },
        MP:{
            code:4,
            cb:[]
        },
        OTA:{
            code:5,
            cb:[]
        },
        FORMAT:{
            code:6,
            cb:[]
        },
    };

    this.CS_EVT_BASE = 0xF0000;
    this.EVENTCODE = {
        //983040
        CS_EVT_HEART:self.CS_EVT_BASE+ 0x0000,
        CS_EVT_DVB_SIGNAL_LOST:self.CS_EVT_BASE+ 0x0001,
        CS_EVT_DVB_SIGNAL_LOCK:self.CS_EVT_BASE+ 0x0002,
        CS_EVT_NETWORK_DISCONNECT:self.CS_EVT_BASE+ 0x0003,
        CS_EVT_NETWORK_CONNECTED:self.CS_EVT_BASE+ 0x0004,
        CS_EVT_FS_FORMAT : self.CS_EVT_BASE+ 0x0008,
        CS_EVT_OTA_UPDATE : self.CS_EVT_BASE+ 0x0009,

        //987136
        CS_EVT_CA_BASE:self.CS_EVT_BASE+ 0x1000,
        CS_EVT_CA_CARD_INSERT:self.CS_EVT_BASE+ 0x1001,
        CS_EVT_CA_CARD_REMOVE:self.CS_EVT_BASE+ 0x1002,
        CS_EVT_CA_SHOW_MESSAGE:self.CS_EVT_BASE+ 0x1003,
        CS_EVT_CA_HIDE_MESSAGE:self.CS_EVT_BASE+ 0x1004,
        CS_EVT_CA_SHOW_FINGER:self.CS_EVT_BASE+ 0x1005,
        CS_EVT_CA_HIDE_FINGER:self.CS_EVT_BASE+ 0x1006,
        CS_EVT_CA_SHOW_MAIL:self.CS_EVT_BASE+ 0x1007,
        CS_EVT_CA_HIDE_MAIL:self.CS_EVT_BASE+ 0x1008,
        CS_EVT_CA_SHOW_OSD:self.CS_EVT_BASE+ 0x1009,
        CS_EVT_CA_HIDE_OSD:self.CS_EVT_BASE+ 0x100A,
        CS_EVT_CA_LOCK_SERVICE:self.CS_EVT_BASE+ 0x100B,
        CS_EVT_CA_UNLOCK_SERVICE:self.CS_EVT_BASE+ 0x100C,
        CS_EVT_CA_SHOW_IPPV_DLG:self.CS_EVT_BASE + 0x100D,
        CS_EVT_CA_HIDE_IPPV_DLG:self.CS_EVT_BASE + 0x100E,
        CS_EVT_CA_PARENT_FEED:self.CS_EVT_BASE + 0x100F,
        CS_EVT_CA_PROGRESS_DISPLAY:self.CS_EVT_BASE + 0x1010,
        CS_EVT_CA_ACTION_REQUEST:self.CS_EVT_BASE + 0x1011,
        CS_EVT_CA_SHOW_CURTAIN_NOTIFY:self.CS_EVT_BASE + 0x1012,
        CS_EVT_CA_SHOW_SUPOSD:self.CS_EVT_BASE + 0x1013,
        CS_EVT_CA_SHOW_SUPFINGER:self.CS_EVT_BASE + 0x1014,
        CS_EVT_CA_ContinuesWatchLimit:self.CS_EVT_BASE + 0x1015,
        CS_EVT_CA_DETITLE:self.CS_EVT_BASE + 0x1016,
        CS_EVT_CA_ENTITLE_NOTIFY:self.CS_EVT_BASE + 0x1017,



        CS_EVT_MP_BASE:self.CS_EVT_BASE+ 0x2000,
        CS_EVT_MP_PLAY_START:self.CS_EVT_BASE+ 0x2001,
        CS_EVT_MP_PLAY_END:self.CS_EVT_BASE+ 0x2002,
        CS_EVT_MP_BUFFERING_START:self.CS_EVT_BASE+ 0x2003,
        CS_EVT_MP_BUFFERING_END:self.CS_EVT_BASE+ 0x2004,
        CS_EVT_MP_PLAY_ERROR:self.CS_EVT_BASE+ 0x2005,




    };

    this.start = function(){
        self.timer = setInterval(function(){
            if(!self.ws){
                self.init();
            }
        },1000);
    };
    this.stop = function(){

    };
    this.init = function(){
        self.ws = new WebSocket(self.url);

        console.log("eventCommon init");
        self.ws.onopen = function()
        {
            // Web Socket 已连接上
            console.log("webSocket open...");
        };

        self.ws.onclose = function()
        {
            self.ws = null;
            // 关闭 websocket
            console.log("webSocket close...");
        };

        self.ws.onmessage = function(evt){
            // web socket 收到消息
            var msg = evt.data;
            var obj = JSON.parse(msg);
            if(obj.code  > self.EVENTCODE.CS_EVT_DVB_SIGNAL_LOCK)
            {
                console.log("webSocket getMsg...:"+msg);
            }
            self.handleEvent(obj);
        };
    };

    this.reset = function(){

    };

    this.registerCallback = function(type,cb){

        for(var a in self.callback)
        {
            if(type == self.callback[a].code)
            {
               for(var i = 0;i < self.callback[a].cb.length;i++)
                {
                   if(self.callback[a].cb[i] === cb)
                     break;
                }
                if(i < self.callback[a].cb.length){
                    self.callback[a].cb.splice(i,1);
                }
                self.callback[a].cb.push(cb);
            }
        }
    };

    this.deleteCallback = function(type,cb){
        for(var a in self.callback)
        {
            if(type == self.callback[a].code)
            {
                for(var i = 0;i < self.callback[a].cb.length;i++)
                {
                    if(self.callback[a].cb[i] === cb)
                        break;
                }
                if(i < self.callback[a].cb.length){
                    self.callback[a].cb.splice(i,1);
                }
            }
        }
    };

    this.handleEvent = function(obj)
    {
        switch(obj.code)
        {
            case self.EVENTCODE.CS_EVT_HEART:
                for(var i = 0;i < self.callback.HEART.cb.length;i++)
                {
                    self.callback.HEART.cb[i](obj);
                }
                break;
            case self.EVENTCODE.CS_EVT_DVB_SIGNAL_LOST:
            case self.EVENTCODE.CS_EVT_DVB_SIGNAL_LOCK:
                for(var i = 0;i < self.callback.SIGNAL.cb.length;i++)
                {
                    self.callback.SIGNAL.cb[i](obj);
                }
                break;
            case self.EVENTCODE.CS_EVT_NETWORK_DISCONNECT:
            case self.EVENTCODE.CS_EVT_NETWORK_CONNECTED:
                for(var i = 0;i < self.callback.NETWORK.cb.length;i++)
                {
                    self.callback.NETWORK.cb[i](obj);
                }
                break;
            case self.EVENTCODE.CS_EVT_OTA_UPDATE:
                console.log("CS_EVT_OTA_UPDATE");
                for(var i = 0;i < self.callback.OTA.cb.length;i++)
                {
                    self.callback.OTA.cb[i](obj);
                }
                break;
            case self.EVENTCODE.CS_EVT_FS_FORMAT:
                console.log("CS_EVT_FS_FORMAT");
                for(var i = 0;i < self.callback.FORMAT.cb.length;i++)
                {
                    self.callback.FORMAT.cb[i](obj);
                }
                 break;
            case self.EVENTCODE.CS_EVT_CA_BASE:
            case self.EVENTCODE.CS_EVT_CA_CARD_INSERT:
            case self.EVENTCODE.CS_EVT_CA_CARD_REMOVE:
            case self.EVENTCODE.CS_EVT_CA_SHOW_MESSAGE:
            case self.EVENTCODE.CS_EVT_CA_HIDE_MESSAGE:
            case self.EVENTCODE.CS_EVT_CA_SHOW_FINGER:
            case self.EVENTCODE.CS_EVT_CA_HIDE_FINGER:
            case self.EVENTCODE.CS_EVT_CA_SHOW_MAIL:
            case self.EVENTCODE.CS_EVT_CA_HIDE_MAIL:
            case self.EVENTCODE.CS_EVT_CA_SHOW_OSD:
            case self.EVENTCODE.CS_EVT_CA_HIDE_OSD:
            case self.EVENTCODE.CS_EVT_CA_LOCK_SERVICE:
            case self.EVENTCODE.CS_EVT_CA_UNLOCK_SERVICE:
            case self.EVENTCODE.CS_EVT_CA_SHOW_IPPV_DLG:
            case self.EVENTCODE.CS_EVT_CA_HIDE_IPPV_DLG:
            case self.EVENTCODE.CS_EVT_CA_PARENT_FEED:
            case self.EVENTCODE.CS_EVT_CA_PROGRESS_DISPLAY:
            case self.EVENTCODE.CS_EVT_CA_ACTION_REQUEST:
            case self.EVENTCODE.CS_EVT_CA_SHOW_CURTAIN_NOTIFY:
            case self.EVENTCODE.CS_EVT_CA_SHOW_SUPOSD:
            case self.EVENTCODE.CS_EVT_CA_SHOW_SUPFINGER:
            case self.EVENTCODE.CS_EVT_CA_ContinuesWatchLimit:
            case self.EVENTCODE.CS_EVT_CA_DETITLE:
            case self.EVENTCODE.CS_EVT_CA_ENTITLE_NOTIFY:
                for(var i = 0;i < self.callback.CA.cb.length;i++)
                {
                    self.callback.CA.cb[i](obj);
                }
                break;
            case self.EVENTCODE.CS_EVT_MP_BASE:
            case self.EVENTCODE.CS_EVT_MP_PLAY_START:
            case self.EVENTCODE.CS_EVT_MP_PLAY_END:
            case self.EVENTCODE.CS_EVT_MP_BUFFERING_START:
            case self.EVENTCODE.CS_EVT_MP_BUFFERING_END:
            case self.EVENTCODE.CS_EVT_MP_PLAY_ERROR:
                for(var i = 0;i < self.callback.MP.cb.length;i++) {
                    self.callback.MP.cb[i](obj);
                }
                break;
            default:

                break;
        }
    };

    this.NetworkMonitor = function(){
        var timer = setInterval(function(){
            CableModem.cmGetStatus(function(obj){
                if(obj.online == 12){

                }
            });
        },5000);
    };
}
var eventCom = new EventCommon();
console.log("eventCom init");
window.setTimeout(eventCom.init,2000);
window.setTimeout(eventCom.start,2500);function CaCommon()
{
    var self = this;

    self.loadTimer = null;

    this.lockStatus = false;

    self.ContinuesWatchLimit = null;

    this.osdfinger = {
        "osd":null,
        "superOsd":null,
        "finger":null,
        "superFinger":null
    };

    this.caParams = {
        "cardNum":null,
        "operatorinfo":null,
        "calibversion":null,
        "areacode":null,
        "bouquetId":null,
        "zipCode":null
    };

    this.init = function(){
        if(!sysCom.isPowerBoot){
            self.caParams = utility.getH5Storage("CNS_DVB_CAINFO");
        }
        else{
            var ret = CA.getCardNo(false);
            if(ret.errorcode == 0){
                self.getParams();
            }
        }
        //连续观看限制
        self.ContinuesWatchLimit = DB.dbGetValue("CNS_DVB_CA_CONTINUESWATCHLIMIT",false);

        //osd 指纹数据
        self.osdfinger = utility.getH5Storage("CNS_DVB_CA_OSDFINGER");
        if(!self.osdfinger){
            self.osdfinger = {
                "osd":null,
                "superOsd":null,
                "finger":null,
                "superFinger":null
            };
            utility.setH5Storage("CNS_DVB_CA_OSDFINGER",self.osdfinger);
        }

        //导入osd finger窗口,并显示
        if(appCom.checkCurAppIsLocalApp()){
            self.osdFingerDlgInit();
        }

        self.start();
    };

    this.reset = function(){
        DB.dbSetValue("CNS_DVB_CA_CONTINUESWATCHLIMIT", "", false);
        self.osdfinger = {
            "osd":null,
            "superOsd":null,
            "finger":null,
            "superFinger":null
        };
    };

    this.osdFingerDlgInit = function(){
        self.loadTimer = setInterval(function(){
            if(typeof CaFingerDialog == "undefined"){
                return;
            }
            if(typeof CaSuperFingerDialog == "undefined"){
                return;
            }
            if(typeof CaOsdDialog == "undefined"){
                return;
            }
            if(typeof CaSuperOsdDialog == "undefined"){
                return;
            }
            if(CaFingerDialog && CaSuperFingerDialog && CaOsdDialog && CaSuperOsdDialog){

                self.caFingerDlg = new CaFingerDialog();

                self.caSuperFingerDlg = new CaSuperFingerDialog();

                self.caOsdDlg = new CaOsdDialog("../cview_app_common_pic/osd_bac.png");

                self.caSuperOsdDlg = new CaSuperOsdDialog();

                clearInterval(self.loadTimer);

                self.loadTimer= null;

                self.osdFingerDlgShow();
            }
        },1000);

    };

    this.osdFingerDlgShow = function(){
        
        self.osdfinger = utility.getH5Storage("CNS_DVB_CA_OSDFINGER");
        if(!self.osdfinger){
            self.osdfinger = {
                "osd":null,
                "superOsd":null,
                "finger":null,
                "superFinger":null
            };
            utility.setH5Storage("CNS_DVB_CA_OSDFINGER",self.osdfinger);
        }
        else{
            if(self.osdfinger.finger){
                setTimeout(function(){
                    console.log("show caFingerDlg");
                    self.caFingerDlg.show(self.osdfinger.finger);
                },4000);
            }
            if(self.osdfinger.superFinger){
                setTimeout(function(){
                    console.log("show caSuperFingerDlg");
                    self.caSuperFingerDlg.show(self.osdfinger.superFinger);
                },4000);
            }
            if(self.osdfinger.osd){
                setTimeout(function(){
                    console.log("show caOsdDlg");
                    self.caOsdDlg.show(self.osdfinger.osd);
                },4000);
            }
            if(self.osdfinger.superOsd){
                setTimeout(function(){
                    console.log("show caSuperOsdDlg");
                    self.caSuperOsdDlg.show(self.osdfinger.superOsd);
                },4000);
            }
        }
    };

    this.getParams = function(){
        var ret = CA.getCardNo(false);
        if(ret.errorcode == 0){
            self.caParams.cardNum = ret.cardno;
        }

        ret = CA.getOperators(false);
        if(ret.errorcode == 0){
            self.caParams.operatorinfo = ret.operatorinfo;
        }

        ret = CA.getCasInfo(false);
        if(ret.errorcode == 0){
            self.caParams.calibversion = ret.calibversion;
        }

        if(self.caParams.operatorinfo.length > 0){
            ret = CA.getAcList(self.caParams.operatorinfo[0].operatorid,false);
            if(ret.errorcode == 0){
                self.caParams.areacode = ret.areacode;
                self.caParams.bouquetId = ret.bouquetid;
                self.caParams.zipCode = ret.otherdatas[0].acotherdata+"";
                var str = self.caParams.zipCode + "";
                if(str.length >= 5){
                    self.caParams.so = str.substring(0,2);
                }
                else if(str.length == 4){
                    self.caParams.so = "0" + str.substring(0,1);
                }
                else{
                    self.caParams.so = "00";
                }
            }
        }
        utility.setH5Storage("CNS_DVB_CAINFO",self.caParams);
        console.log("caParams:"+JSON.stringify(self.caParams));
    };

    this.resetParams = function(){
        self.caParams = {
            "cardNum":null,
            "operatorinfo":null,
            "calibversion":null,
            "areacode":null,
            "bouquetId":null,
            "zipCode":null
        };
        self.osdfinger = {
            "osd":null,
            "superOsd":null,
            "finger":null,
            "superFinger":null
        };
        utility.setH5Storage("CNS_DVB_CA_OSDFINGER",self.osdfinger);
        utility.setH5Storage("CNS_DVB_CAINFO",self.caParams);
    };

    this.start = function(){
        self.registCaEvent();
    };

    this.registCaEvent = function(){

        eventCom.registerCallback(3,function(obj){

            if(obj.code == eventCom.EVENTCODE.CS_EVT_CA_CARD_REMOVE){

                self.resetParams();
            }else if(obj.code == eventCom.EVENTCODE.CS_EVT_CA_CARD_INSERT){
                self.getParams();
            }
            else if(obj.code == eventCom.EVENTCODE.CS_EVT_CA_ACTION_REQUEST)
            {
                if(obj.data.cnsird){
                    self.IRD_Command(obj.data.cnsird);
                }
            }
            if(obj.code == eventCom.EVENTCODE.CS_EVT_CA_SHOW_FINGER)
            {
                self.osdfinger.finger = obj.data.finger;
                utility.setH5Storage("CNS_DVB_CA_OSDFINGER",self.osdfinger);
                if(appCom.checkCurAppIsLocalApp() && self.loadTimer == null){
                    self.caFingerDlg.show(obj.data.finger);
                }
            }

            if (obj.code == eventCom.EVENTCODE.CS_EVT_CA_HIDE_FINGER) {
                self.osdfinger.finger = null;
                utility.setH5Storage("CNS_DVB_CA_OSDFINGER",self.osdfinger);
                if(appCom.checkCurAppIsLocalApp() && self.loadTimer == null){
                    self.caFingerDlg.hide();
                }
            }

            if (obj.code == eventCom.EVENTCODE.CS_EVT_CA_SHOW_SUPFINGER) {
                self.osdfinger.superFinger = obj.data;
                utility.setH5Storage("CNS_DVB_CA_OSDFINGER",self.osdfinger);
                if(appCom.checkCurAppIsLocalApp() && self.loadTimer == null){
                    self.caSuperFingerDlg.show(obj.data);
                }
            }

            if (obj.code == eventCom.EVENTCODE.CS_EVT_CA_SHOW_OSD) {
                self.osdfinger.osd = obj.data;
                utility.setH5Storage("CNS_DVB_CA_OSDFINGER",self.osdfinger);
                if(appCom.checkCurAppIsLocalApp() && self.loadTimer == null){
                    self.caOsdDlg.show(obj.data);
                }
            }

            if (obj.code == eventCom.EVENTCODE.CS_EVT_CA_HIDE_OSD) {
                self.osdfinger.osd = null;
                utility.setH5Storage("CNS_DVB_CA_OSDFINGER",self.osdfinger);
                if(appCom.checkCurAppIsLocalApp() && self.loadTimer == null){
                    self.caOsdDlg.hide();
                }
            }

            if (obj.code == eventCom.EVENTCODE.CS_EVT_CA_SHOW_SUPOSD) {
                self.osdfinger.superOsd = obj.data;
                utility.setH5Storage("CNS_DVB_CA_OSDFINGER",self.osdfinger);
                if(appCom.checkCurAppIsLocalApp() && self.loadTimer == null){
                    self.caSuperOsdDlg.show(obj.data);
                }
            }

            //{"code":987157,"data":{"action":1,"worktime":1,"stoptime":30}}     //1:启用   0:禁用   2:取消
            if(obj.code == eventCom.EVENTCODE.CS_EVT_CA_ContinuesWatchLimit){
                if(obj.data.action == 0  || obj.data.action == 2){
                    self.ContinuesWatchLimit = "";
                }
                else if(obj.data.action == 1) {
                    self.ContinuesWatchLimit = obj.data;
                }
                console.log("app CNS_DVB_CA_CONTINUESWATCHLIMIT");
                DB.dbSetValue("CNS_DVB_CA_CONTINUESWATCHLIMIT", self.ContinuesWatchLimit, false);
            }
        });  
    };

    /***********同方CA提示消息定义**************/




    /***********IRD命令 实现**************/

    this.IRD_Command = function(params){
        console.log("IRD_Command = "+params);
        if(params) {
            var arr = params.split(",");
            console.log("arr="+arr[0]);

            switch(arr[0])
            {
                case "7":
                     self.IRD_ResetPIN1(params);
                      break;
                case "8":
                     self.IRD_ResetPIN2(params);
                     break;
                case "9":
                    self.IRD_SetPIN(params);
                    break;
                case "10":
                    self.IRD_DisableAutoStandby(params);
                     break;
                case "11":
                    self.IRD_EnableAutoStandby(params);
                    break;
                case "12":
                    self.IRD_RebootSTB(params);
                    break;
                case "13":
                    self.IRD_EnableDynamicIp(params);
                     break;
                case "14":

                     break;
                case "15":
                     break;
                case "16":
                    self.IRD_EnableStaticIp(params);
                    break;
                case "17":
                    self.IRD_FactoyResetWithFTISkip(params);
                    break;
                case "18":
                    self.IRD_ResetDownloadAppFromStore(params);
                    break;
                case "19":
                    self.IRD_DisableADInLiveTv(params);
                    break;
                case "20":
                    self.IRD_EnableADInLiveTv(params);
                     break;
                case "21":
                    self.IRD_ResetAppStoreURLToDefault(params);
                    break;
                case "22":
                    self.IRD_ChangeAppStoreURL(params);
                    break;
                case "23":
                    self.IRD_SetAPRouter(params);
                    break;
                case "24":
                    self.IRD_UpdateEntitledListByDefaultURL(params);
                     break;
                case "25":
                     break
                case "26":
                    self.IRD_DisableFTI(params);
                     break;
                case "27":
                    self.IRD_ChangeVBMReportURL(params);
                    break;
                case "28":
                    self.IRD_EnableAntiPirate(params);
                    break;
                case "29":
                    self.IRD_DisableAntiPirate(params);
                    break;
                case "30":
                    self.IRD_HDDPairing(params);
                     break;
                case "31":
                    self.IRD_HDDProvision(params);
                     break;
                case "32":
                    self.IRD_HDDFormatting(params);
                     break;
                case "33":
                    self.IRD_ResetSTBDownloadMode(params);
                    break;
                case "34":
                    self.IRD_HDMICECFuntion(params);
                    break;
                case "35":
                    self.IRD_TVFeeReminder(params);
                    break;
                case "36":
                    self.IRD_HDCPFunction(params);
                    break;
                case "37":
                    self.IRD_AreaLimitation(params);
                    break;
                case "38":
                    self.IRD_Tr069Function(params);
                    break;
                case "39":
                    self.IRD_RescanChannel(params);
                    break;
            }

        }
    };


        /*
        Description: Reset the Parental PIN code
        Title: __IRD_COMMAND__
        Body: 7,0
        */
    this.IRD_ResetPIN1 = function(params){
        var arr = params.split(",");
        if(arr.length != 2 || parseInt(arr[0],10) != 7 || parseInt(arr[1],10) != 0){
            return;
        }
        sysCom.config.ParentalPin = sysCom.defaultConfig.ParentalPin;
        sysCom.saveConfig();
    };

    /*
    Description: Reset the Purchase PIN code
    Title: __IRD_COMMAND__
    Body: 8,0
    */
    this.IRD_ResetPIN2 = function(params){
      var arr = params.split(",");
        if(arr.length != 2 || parseInt(arr[0],10) != 8 || parseInt(arr[1],10) != 0){
            return;
        }
        sysCom.config.PersonalAuthenticationPin = sysCom.defaultConfig.PersonalAuthenticationPin;
        sysCom.saveConfig();
    };

    /*
    Description: Set PIN code
    Title: __IRD_COMMAND__
    Body: 9,2,[PIN],[password]
    Definition:
    - [PIN] = the nth PIN
     PIN = 1 => Parental PIN
     PIN = 2 => Purchase PIN
     PIN = 3 or others => Reserve
    - [password]= text
    */
    this.IRD_SetPIN = function(params){
        var arr = params.split(",");
      if(arr.length != 4 || parseInt(arr[0],10) != 9 || parseInt(arr[1],10) != 2){
            return;
        }
    if(parseInt(arr[1]) == 1 && arr[3].length == 4)
        {
            sysCom.config.ParentalPin = arr[3];
            sysCom.saveConfig();
        }


        if(parseInt(arr[1]) == 2 && arr[3].length == 4)
        {
            sysCom.config.PersonalAuthenticationPin = arr[3];
            sysCom.saveConfig();
        }

    };

    /*
        6.4 Disable STB Auto-standby function
        Description: Cancel the mechanism to let STB awake all the time
        Title: __IRD_COMMAND__
        Body: 10,0
    */
    this.IRD_DisableAutoStandby = function(params){
     var arr = params.split(",");
        if(arr.length != 2 || parseInt(arr[0],10) != 10 || parseInt(arr[1],10) != 0){
            return;
        }
        sysCom.config.AutoStandby = 0;
        sysCom.saveConfig();
    };

    /*
        6.5 Enable STB Auto-standby function
        Description: Cancel the mechanism to let STB awake all the time
        Title: __IRD_COMMAND__
        Body: 11,0
    */
    this.IRD_EnableAutoStandby = function(params){
    var arr = params.split(",");
        if(arr.length != 2 || parseInt(arr[0],10) != 11 || parseInt(arr[1],10) != 0){
            return;
        }
        sysCom.config.AutoStandby = 1;
        sysCom.saveConfig();
    };

    /*
        6.6 Reboot STB
        Description: Remote to power cycle STB
        Title: __IRD_COMMAND__
        Body: 12,0
    */
    this.IRD_RebootSTB = function(params){
     var arr = params.split(",");
        if(arr.length != 2 || parseInt(arr[0],10) != 12 || parseInt(arr[1],10) != 0){
            return;
           }
                           utility.reboot();
    };

    /*
        6.7 Enable dynamic IP in Physical network
        Description: Let STB get the IP by DHCP with physical ethernet cable
        Title: __IRD_COMMAND__
        Body: 13,0
    */
    this.IRD_EnableDynamicIp = function(params){
        var arr = params.split(",");
        if(arr.length != 2 || parseInt(arr[0],10) != 13 || parseInt(arr[1],10) != 0){
            return;
        }
        sysCom.config.ip_get_mode = 0;
        sysCom.saveConfig();
        //dosomething
    };

    /*
     Enable dynamic IP in Physical network
    Description: Let STB get the IP by DHCP with physical ethernet cable
    Title: __IRD_COMMAND__
    Body: 13,0
    */
    this.IRD_EnableStaticIp = function(params){
        var arr = params.split(",");
        if(arr.length != 2 || parseInt(arr[0],10) != 13 || parseInt(arr[1],10) != 0){
            return;
        }
        sysCom.config.ip_get_mode = 1;
        sysCom.saveConfig();
        //dosomething
    };

    /*
    Enable static IP in Physical network for Master STB
    Description: Set static IP for Master STB
    Title: __IRD_COMMAND__
    Body: 14,4,192.168.0.100,255.255.255.0,192.168.0.100,192.168.0.100
    */
    this.IRD_EnableStaticIpForMaster = function(params) {
        var arr = params.split(",");
        if(arr.length != 6 || parseInt(arr[0],10) != 14 || parseInt(arr[1],10) != 4){
            return;
        }
    };

    /*
    Enable static IP in Physical network for Slave STB
    Description: Set static IP for Slave STB
    Title: __IRD_COMMAND__
    Body: 15,4,192.168.0.101,255.255.255.0,192.168.0.100,192.168.0.100
    */
    this.IRD_EnableStaticIpForSlave = function(params){
        var arr = params.split(",");
        if(arr.length != 6 || parseInt(arr[0],10) != 15 || parseInt(arr[1],10) != 4){
            return;
        }
    };

    /*
    Set static IP in Physical network for specific STB
    Description: Set static IP for STB
    Title: __IRD_COMMAND__
    Body: 16,4,[ip1],[ip2],[ip3],[ip4]
    Definition:
    - [ip1]/[ip2]/[ip3]/[ip4] = text
    Ex: 16,4,192.168.100.100,255.255.0.0,192.168.100.254,192.168.100.1
    */
    this.IRD_SetStaticIp = function(params){
        var arr = params.split(",");
        if(arr.length != 6 || parseInt(arr[0],10) != 16 || parseInt(arr[1],10) != 4){
            return;
        }
        var ip = arr[2];
        var mask = arr[3];
        var dns1 = arr[4];
        var dns2 = arr[5];
    };

    /*
    Factory reset with FTI skip (First Time Installation)
    Description: Do a STB factory reset and re-scan but do not perform FTI
    Title: __IRD_COMMAND__
    Body: 17,0
    */
    this.IRD_FactoyResetWithFTISkip = function(params){
        var arr = params.split(",");
        if(arr.length != 2 || parseInt(arr[0],10) != 17 || parseInt(arr[1],10) != 0){
            return;
        }
        DB.DoEvnVars({
            "opt": "write",
            "var": "resolution",
            "value": 3
        });
        DB.dbClearAll(false);
        sysCom.config.FTI = 0;
        sysCom.saveConfig();
        window.location.href = "file:////application/cview/cview_app_6z18_cns_autosearch/index.html";
        //Utility.reboot(false);
    };

    /*
    Reset the download applications from App Store
    Description: Clean the download applications and re-download it again
    Title: __IRD_COMMAND__
    Body: 18,0
    */
    this.IRD_ResetDownloadAppFromStore = function(params){
     var arr = params.split(",");
        if(arr.length != 2 || parseInt(arr[0],10) != 18 || parseInt(arr[1],10) != 0){
            return;
        }
        DB.appClear(false);
    };

    /*
    Disable AD (advertisement) in Live TV
    Description: Disable the Live TV AD and display the default one
    Title: __IRD_COMMAND__
    Body: 19,0
    */
    this.IRD_DisableADInLiveTv = function(params){
        var arr = params.split(",");
        if(arr.length != 2 || parseInt(arr[0],10) != 19 || parseInt(arr[1],10) != 0){
            return;
        }
        sysCom.config.AdOnLivetv = 0;
        sysCom.saveConfig();
    };

    /*
    Enable AD (advertisement) in Live TV
    Description: Disable the Live TV AD and display the default one
    Title: __IRD_COMMAND__
    Body: 20,0
    */
    this.IRD_EnableADInLiveTv = function(params){
        var arr = params.split(",");
        if(arr.length != 2 || parseInt(arr[0],10) != 20 || parseInt(arr[1],10) != 0){
            return;
        }
        sysCom.config.AdOnLivetv = 1;
        sysCom.saveConfig();
    };

    /*
    Reset App Store URL to default
    Description: Reset the original URL for App Store
    Title: __IRD_COMMAND__
    Body: 21,0
    */
    this.IRD_ResetAppStoreURLToDefault = function(params){
        var arr = params.split(",");
        if(arr.length != 2 || parseInt(arr[0],10) != 21 || parseInt(arr[1],10) != 0){
            return;
        }
        sysCom.config.AppStoreURL = sysCom.defaultConfig.AppStoreURL;
        sysCom.saveConfig();
    };

    /*
    Change App Store URL
    Description: Change the App Store URL for specific purpose
    Title: __IRD_COMMAND__
    Body: 22,1,[url]
    Definition:
    - [url] = text
    Ex: 22,1,http://appstore.totaltv.com.tw
    */
    this.IRD_ChangeAppStoreURL = function(params){
        var arr = params.split(",");
        if(arr.length != 3 || parseInt(arr[0],10) != 22 || parseInt(arr[1],10) != 1){
            return;
        }
        sysCom.config.AppStoreURL = arr[2];
        sysCom.saveConfig();
    };

    /*
    Set AP Router – Home Gateway
    Description: Configure AP Router module remotely
    Title: __IRD_COMMAND__
    Body: 23,4,[interface],[ssid],[password],[security]
    Definition:
    - [interface] = 1/2/3/…/N
    - [ssid] = text
    - [password]= text
    - [security] = WEP/WPA/WPA2/…/etc
    Ex: 23,4,1,bbhome_123456,12345678,WPA
    */
    this.IRD_SetAPRouter = function(params){
        var arr = params.split(",");
        if(arr.length != 6 || parseInt(arr[0],10) != 23 || parseInt(arr[1],10) != 4){
            return;
        }
    };

    /*
     Update Entitled List by default URL – Home Gateway
    Description: Ask home gateway set-top box to update the Entitled List by
    default URL
    Title: __IRD_COMMAND__
    Body: 24,2,[seqno],[irdcmdseqno]
    Definition:
    - [seqno] = text
    - [irdcmdseqno] = text
    EX: 24,2,12345678,
    */
    this.IRD_UpdateEntitledListByDefaultURL = function(params){
        var arr = params.split(",");
        if(arr.length != 3 || parseInt(arr[0],10) != 24 || parseInt(arr[1],10) != 2){
            return;
        }
    };

    /*
    Disable First Time Installation/FTI
    Description: Disable first time installation steps
    Title: __IRD_COMMAND__
    Body: 26,0
    */
    this.IRD_DisableFTI = function(params){
        var arr = params.split(",");
        if(arr.length != 2 || parseInt(arr[0],10) != 26 || parseInt(arr[1],10) != 0){
            return;
        }
        sysCom.config.FTI = 0;
        config.saveConfig();
    };

    /*
    Description: Change URL for VBM Client reports to VBM Server
    Title: __IRD_COMMAND__
    Body: 27,1,[url]
    Definition:
    - [url] = text
    Ex: 27,1,http://vbm.totaltv.com.tw
    */
    this.IRD_ChangeVBMReportURL = function(params){
        var arr = params.split(",");
        if(arr.length != 3 || parseInt(arr[0],10) != 27 || parseInt(arr[1],10) != 1){
            return;
        }
        sysCom.config.vbmReportURL = arr[2];
        config.saveConfig();
    };

    /*

    */
    this.IRD_EnableAntiPirate = function(params){

    };

    /*

    */
    this.IRD_DisableAntiPirate = function(params){

    };

    /*
    HDD Pairing and Provision – PVR   硬碟與機上盒配對授權指令
    Description: Ask STB to pair with specific serial number HDD and provision
    PVR service
    Title: __IRD_COMMAND__
    Body: 30,5,[seialno],[onoff],[size],[tunerno],[key]
    Definition:
    - [serialno] = text HDD serial number
    - [onoff] = 0/1 0-Disable PVR, 1-Enable PVR
    - [size] = text PVR logical capacity; Unit-GB
    - [tunerno] = text PVR tuner resource
    - [key] = text PVR contents sharing key*
    *Reserve for future use
    EX: 30,5,WD-WX1234567890,1,1000,2,12345678
    */
    this.IRD_HDDPairing = function(params){


        var arr = params.split(",");
  if(arr.length != 7 || parseInt(arr[0],10) != 30 || parseInt(arr[1],10) != 5)
        {
            return;
        }
        sysCom.config.PVRPariedSn = arr[2];
        sysCom.config.PVRService = parseInt(arr[3]);
        sysCom.config.PVRSize = parseInt(arr[4]);
        sysCom.config.PVRtunerno = parseInt(arr[5]);
        sysCom.config.PVRkey = arr[6];
        sysCom.saveConfig();

    };

    /*
        HDD Provision – PVR   硬碟授權功能指令
        Description: To provision or disable PVR service
        Title: __IRD_COMMAND__
        Body: 31,4,[onoff],[size],[tunerno],[key]
        Definition:
        - [onoff] = 0/1 0-Disable PVR, 1-Enable PVR
        - [size] = text PVR logical capacity; Unit-GB
        - [tunerno] = text PVR tuner resource
        - [key] = text PVR contents sharing key*
        *Reserve for future use
        EX: 31,4,1,1000,2,12345678
    */
    this.IRD_HDDProvision = function(params){

        var arr = params.split(",");
        if(arr.length != 6 || parseInt(arr[0],10) != 31 || parseInt(arr[1],10) != 4)
        {
            return;
        }

        sysCom.config.PVRService = parseInt(arr[2]);
        sysCom.config.PVRSize = parseInt(arr[3]);
        sysCom.config.PVRtunerno = parseInt(arr[4]);
        sysCom.config.PVRkey = arr[5];
        sysCom.saveConfig();

    };

    /*
        HDD Formatting – PVR
        Description: Ask STB to format specific serial number HDD
        Title: __IRD_COMMAND__
        Body: 32,1,[serialno]
        Definition:
        - [serialno] = text HDD serial number
        EX: 32,1,WD-WX1234567890
    */
    this.IRD_HDDFormatting = function(params){

        var arr = params.split(",");
        if(arr.length != 3 || parseInt(arr[0],10) != 32 || parseInt(arr[1],10) != 1)
        {
            return;
        }
        var serialno =  arr[2];



        console.log("IRD_HDDFormatting ");
        usblists = FS.fsGetDiskInfo(false);
        console.log("usblists count="+usblists.length );
        if(!usblists || usblists.length <= 0)
        {

            console.log("HD not ready");
            return ;
        }


        for(var k = 0;k<usblists.length;k++ )
        {
            if(usblists[k].sn==serialno) {
                fsCom.formatdisk(usblists[k].disk, false);
            }
        }

    };

    /*
        Reset STB Download Mode
        Description: When STB receives this command, it will go to Detecting mode
        Title: __IRD_COMMAND__
        Body: 33,0
        EX: 33,0
    */
    this.IRD_ResetSTBDownloadMode = function(params){
        var arr = params.split(",");
        if(arr.length != 2 || parseInt(arr[0],10) != 33 || parseInt(arr[1],10) != 0){
            return;
        }
    };

    /*
    HDMI CEC Function
    Description: Ask STB to enable or disable HDMI CEC feature
    Title: __IRD_COMMAND__
    Body: 34,1,[onoff]
    Definition:
    - [onoff] = 0/1 0-Disable HDMI CEC, 1-Enable HDMI CEC
    EX: 34,1,1
    */
    this.IRD_HDMICECFuntion = function(params){
        var arr = params.split(",");
        if(arr.length != 3 || parseInt(arr[0],10) != 34 || parseInt(arr[1],10) != 1){
            return;
        }

        sysCom.comfig.hdmiCECStatus=parseInt(parseInst(arr[2]));
        sysCom.saveConfig();
    };

    /*
    TV Fee Reminder - STB Locked Function
    Description: Put set-top box to specific Locked Page
    Title: __IRD_COMMAND__
    Body: 35,2,[onoff],[message]
    Definition:
    - [onoff] = 0/1 0-UnLock STB, 1-Lock STB
    - [message] = text Message displays on locked page
    EX: 35,2,1,請繳費
    */
    this.IRD_TVFeeReminder = function(params){
        var arr = params.split(",");
        if(arr.length != 4 || parseInt(arr[0],10) != 35 || parseInt(arr[1],10) != 2){
            return;
        }
        sysCom.config.LockStb = arr[2];
        sysCom.saveConfig();

    };

    /*
        HDCP Function
        Description: Ask STB to enable or disable HDCP
        Title: __IRD_COMMAND__
        Body: 36,1,[onoff]
        Definition:
        - [onoff] = 0/1 0-Disable HDCP, 1-Enable HDCP
        EX: 36,1,1
    */
    this.IRD_HDCPFunction = function(params){
        var arr = params.split(",");
        if(arr.length != 3 || parseInt(arr[0],10) != 36 || parseInt(arr[1],10) != 1){
            return;
        }
        sysCom.config.HDCP = parseInt(arr[2]);
        sysCom.saveConfig();
    };

    /*
        Area Limitation Function
        Description: Ask STB to enable or disable Area Limitation (AL)
        Title: __IRD_COMMAND__
        Body: 37,1,[onoff]
        Definition:
        - [onoff] = 0/1 0-Disable AL, 1-Enable AL
        EX: 37,1,1
    */
    this.IRD_AreaLimitation = function(params){
        var arr = params.split(",");
        if(arr.length != 3 || parseInt(arr[0],10) != 37 || parseInt(arr[1],10) != 1){
            return;
        }
        sysCom.config.AreaLimit = parseInt(arr[2]);
        sysCom.saveConfig();
    };

    /*
    TR069 Function
    Description: Ask STB to enable or disable TR069 function
    Title: __IRD_COMMAND__
    Body: 38,2,[onoff],[url]
    Definition:
    - [onoff] = 0/1 0-Disable TR069, 1-Enable TR069
    - [url] = text text or 0-Keep current URL
    EX: 38,2,1,http://acs.totaltv.com.tw
    EX: 38,2,0,0
    */
    this.IRD_Tr069Function = function(params){
        var arr = params.split(",");
        if(arr.length != 4 || parseInt(arr[0],10) != 38 || parseInt(arr[1],10) != 2){
            return;
        }
        sysCom.config.Tr069 = parseInt(arr[2],10);
        sysCom.saveConfig();
    };

    /*
    Rescan Channel
    Description: Ask STB to rescan channel with assigned parameters
    Title: __IRD_COMMAND__
    Body: 39,4,[frequency],[symbolrate],[modulation],[bid]
    Definition:
    - [frequency] = text (MHz) or 0-Keep current parameter
    - [symbolrate] = text (KS/s) or 0-Keep current parameter
    - [modulation] = text (QAM) or 0-Keep current parameter
    - [bid] = text or 0-Keep current parameter
    EX: 39,4,405,5217,256,25148
    EX: 39,4,405,5217,256,0
    EX: 39,4,0,0,0,0
    */
    this.IRD_RescanChannel = function(params){
        var arr = params.split(",");
        if(arr.length != 6 || parseInt(arr[0],10) != 39 || parseInt(arr[1],10) != 0){
            return;
        }
    };
}
var caCom = new CaCommon();
console.log("caCom init");
caCom.init();
function LockCommon(){
	var self = this;
	
	this.isUnlockTimeLock = false;
	this.channelLockTimer = null;
	this.parentalLockTimer = null;

	this.currentInfo = {
		"currentCh":null,
		"currentRating":0
	};


	this.init = function(){};

	this.reset = function(){};

	this.checkAllLock = function(targetCh,targetRating){

		var chlType = dtvCom.checkChannelLock(targetCh);
		var parType = dtvCom.checkParentalLock(targetRating);

		//time lock
		if(!self.isUnlockTimeLock && dtvCom.checkTimeLock()){
			return true;
		}

		//channel lock
		if(chlType && !self.channelLockTimer){
			return true;
		}

		//parental lock
		if(parType && !self.parentalLockTimer){
			return true;
		}else if(self.parentalLockTimer){
            if(targetRating >= 14 && self.currentInfo.currentRating < 14){
                return true;
            }
        }
		return false;
	};
	
	this.unLockCallback = function(targetCh,targetRating){

		if(dtvCom.checkTimeLock() && !self.isUnlockTimeLock ){
			self.isUnlockTimeLock = true;
		}

		if(dtvCom.checkChannelLock(targetCh) && !self.channelLockTimer){
			self.openChannelLockTimer();
		}

		if(dtvCom.checkParentalLock(targetRating) && !self.parentalLockTimer){
			self.openParentalLockTimer();
		}

		//如果节目仅为channel lock
		if(dtvCom.checkChannelLock(targetCh) && !dtvCom.checkParentalLock(targetRating)){
			self.closeParentalLockTimer();
		}

		//如果节目仅为parental lock
		if(dtvCom.checkParentalLock(targetRating) && !dtvCom.checkChannelLock(targetCh)){
			self.closeChannelLockTimer();
		}

		self.currentInfo = {
			"currentCh":targetCh,
			"currentRating":targetRating
		};
	};
    
	this.openChannelLockTimer = function(){
		self.closeChannelLockTimer();
		self.channelLockTimer = setTimeout(function(){
			self.closeChannelLockTimer();
		},120*1000);
	};

	this.closeChannelLockTimer = function(){
		clearTimeout(self.channelLockTimer);
		self.channelLockTimer = null;
	};

	this.openParentalLockTimer = function(){
		self.closeParentalLockTimer();
		self.parentalLockTimer = setTimeout(function(){
			self.closeParentalLockTimer();
		},120*1000)
	};

	this.closeParentalLockTimer = function(){
		clearTimeout(self.parentalLockTimer);
		self.parentalLockTimer = null;
	};
}
var lockCom = new LockCommon();
console.log("lockCom init");
lockCom.init();
function RecordSchCommon(){
    var self = this;

    self.ERROR_TIME = 10;

    self.loopTimer = null;

    this.tunerRes = [
        {
            id : 1,
            status : 0
        },
        {
            id : 2,
            status : 0
        }
    ];

    this.recordType = {
        "SINGLE" : 1,
        "SERIAL" : 2,
        "ONETIME" : 3,
        "DAYTIME" : 4,
        "WEEKTIME" : 5
    };

    this.eventList = {};

    this.taskList = {};

    this.init = function(){
        self.eventList = {
            "array" : []
        };

        self.taskList = {
            "array" : []
        };

        self.loopTimer = null;

        self.eventList = utility.getH5Storage("CNS_DVB_RECORDING_EVENTLIST");
        self.taskList = utility.getH5Storage("CNS_DVB_RECORDING_TASKLIST");

        if(sysCom.isPowerBoot == false)
        {
            console.log("app jump mode");
        }
        else
        {
            console.log("power on mode");
            self.getListFromFlash();
            //清理上次关机时正在录制的事件 clear events which
            self.clearEvent();
        }
        self.openTimer();
    };

    this.start = function(){

    };

    this.reset = function(){
        //关闭所有录制任务
        for(var i = 0; i < self.eventList.array.length; i++){
            var ce = self.eventList.array[i];
            if(ce.status){
                self.stopRecord(ce);
            }
        }
        //清空列表
        self.eventList = {
            "array" : []
        };

        self.taskList = {
            "array" : []
        };
        self.saveListToFlash();
        self.getListFromFlash();
        console.log("self.taskList.array.length:"+self.taskList.array.length);
    };

    this.openTimer = function(){
        self.loopTimer = setInterval(function(){

            for(var i = 0; i < self.eventList.array.length; i++){
                var e = self.eventList.array[i];
                self.loopEvent(e);
            }

            for(var i = 0; i < self.taskList.array.length; i++){
                var t = self.taskList.array[i];
                self.loopTask(t);
            }

        }, 1000 * 10);
    };

    this.loopEvent = function(e){

        //检查录制时间  1:未到录制时间   2:可以开始录制   3:可以结束   4:已过期  5:录制中
        var temp = self.checkTimeSolt(e.startTime,e.duration);
        if(temp == 1){
            e.status = 0;
        }
        else if(temp == 2){
            //开始录制
            if(e.status != 1){
                self.printE(e,"Event Start Recording:");
                if(self.startRecord(e)){
                    self.printE(e,"startRecord Failed ,Event delete");
                    self.deleteEvent(e);
                }
            }
        }
        else if(temp == 3){
            //结束录制
            if(e.status == 1){
                self.printE(e,"Event Stop Recording:");
                self.stopRecord(e);
            }
            //删除录制事件(从order中删除，添加到cancellist中,其实不应该添加到cancel中，但时间都已到期)
            self.deleteEvent(e);

        }
        else if(temp == 4){
            self.printE(e,"Event Expired");
            //改变录制状态，防止删除事件时，关闭其他正在录制的事件
            e.status = 0;
            //删除录制事件
            self.deleteEvent(e);

        }
        else if(temp == 5){
            if(!e.status){
                //删除录制事件
                self.printE(e,"Event delete");
                self.deleteEvent(e);
            }
        }
    };

    this.loopTask = function(task){
        if(task.type == self.recordType.SERIAL){
            //获取EPG
            var epgData = epgCom.getEpgBySerialKey(dtvCom.getChById(task.ch.idn),task.constraint.startTime,task.constraint.series_key);
            for(var i = 0; i < epgData.length;i++){
                //得到录制时间以及时长
                var startTime = epgData[i].startTime;
                var duration = epgData[i].duration;

                //检查时间是否到期
                var ret = self.checkTimeSolt(startTime,duration);
                if(ret > 2){
                    continue;
                }

                //查看cancellist中是否已添加
                var hasAdd = false;
                for(var j = 0; j < task.cancelList.length;j++)
                {
                    if(task.cancelList[j].startTime == startTime)
                    {
                        hasAdd = true;
                        break;
                    }
                }
                if(hasAdd){
                    continue;
                }


                //查看orderlist中是否已添加
                hasAdd = false;
                for(var j = 0; j < task.orderList.length;j++){
                    if(task.orderList[j].startTime == startTime)
                    {
                        hasAdd = true;
                        break;
                    }
                }
                if(hasAdd){
                    continue;
                }

                //生成event
                var e = self.getEventByTask(task);
                e.startTime = startTime;
                e.duration = duration;
                e.epg.series_key = task.constraint.series_key;
                e.epg.episode_key = epgData[i].seriesLinking.episode_key;
                e.epg.episode_status = epgData[i].seriesLinking.episode_status;
                e.epg.episode_last = epgData[i].seriesLinking.episode_last;
                e.epg.eventId = epgData[i].eventId;
                e.epg.name = epgData[i].name;
                e.epg.level = epgData[i].parentRating.rating;

                //添加事件到录制列表上
                if(self.addEvent(e) != 0)
                {
                    console.log("add Event Failed!");
                    continue;
                }

                //添加到orderList
                task.orderList.push(e);

                //存储到flash
                self.saveListToFlash();
            }
        }
        else if(task.type == self.recordType.DAYTIME){

            //得到录制时间以及时长
            var mydate = new Date();
            mydate.setHours(task.constraint.hour);
            mydate.setMinutes(task.constraint.mintue);
            mydate.setSeconds(0);
            var startTime = getTimeStrfromDate(mydate);
            //检查时间是否到期
            var ret = self.checkTimeSolt(startTime,task.constraint.duration);
            if(ret > 2){
                return;
            }

            //查看cancellist中是否已添加
            var hasAdd = false;
            for(var j = 0; j < task.cancelList.length;j++)
            {
                if(task.cancelList[j].startTime == startTime)
                {
                    hasAdd = true;
                    break;
                }
            }
            if(hasAdd){
                return;
            }

            //查看orderlist中是否已添加
            hasAdd = false;
            for(var j = 0; j < task.orderList.length;j++){
                if(task.orderList[j].startTime == startTime)
                {
                    hasAdd = true;
                    break;
                }
            }
            if(hasAdd){
                return;
            }

            //生成event
            var e = self.getEventByTask(task);
            e.startTime = startTime;
            e.duration = task.constraint.duration;

            //添加事件到录制列表上
            var ret = self.addEvent(e);
            if(ret != 0)
            {
                return;
            }

            //添加到orderList
            task.orderList.push(e);

            //存储到flash
            self.saveListToFlash();
        }
        else if(task.type == self.recordType.WEEKTIME){
            //得到录制时间以及时长
            var mydate = new Date();
            mydate.setHours(task.constraint.hour);
            mydate.setMinutes(task.constraint.mintue);
            mydate.setSeconds(0);
            var startTime = getTimeStrfromDate(mydate);
            //检查时间是否到期
            var ret = self.checkTimeSolt(startTime,task.constraint.duration);
            if(ret > 2){
                return;
            }

            //检查今日录制是否需要添加
            var flag = false;
            for(var j = 0;j < task.constraint.week.length;j++){
                if(mydate.getDay() == task.constraint.week[j])
                {
                    flag = true;
                    break;
                }
            }
            if(flag == false)
            {
                return;
            }

            //查看cancellist中是否已添加
            flag = false;
            for(var j = 0; j < task.cancelList.length;j++)
            {
                if(task.cancelList[j].startTime == startTime)
                {
                    flag = true;
                    break;
                }
            }
            if(flag){
                return;
            }

            //查看orderlist中是否已添加
            flag = false;
            for(var j = 0; j < task.orderList.length;j++){
                if(task.orderList[j].startTime == startTime){
                    flag = true;
                    break;
                }
            }
            if(flag){
                return;
            }

            //生成event
            var e = self.getEventByTask(task);
            e.startTime = startTime;
            e.duration = task.constraint.duration;


            //添加事件到录制列表上
            if(self.addEvent(e) != 0)
            {
                console.log("add WEEKTIME Event Failed");
                return;
            }

            //添加到orderList
            task.orderList.push(e);

            //存储到flash
            self.saveListToFlash();
        }
    };

    this.addEvent = function(e){
        //检查时间是否已过期   1:未到录制时间   2:可以开始录制   3:可以结束   4:已过期  5:录制中
        if(self.checkTimeSolt(e.startTime,e.duration) == 4)
        {
            return 1;
        }

        //检查事件冲突
        var list = self.checkEventConflict(e);
        console.log("addEvent list:"+JSON.stringify(list));
        if(e.resId < 0){
            return 2;
        }
        console.log("getTunerIndexByResId:"+e.resId);
        var index = self.getTunerIndexByResId(e.resId);
        if( index < 0 ){
            return 3;
        }

        if(list[index].length != 0){
            return 4;
        }

        //添加到列表中"startTime":"2018/04/02 15:00:00"
        self.eventList.array.push(e);

        //对事件列表排序
        self.sortList(self.eventList.array);

        //存储到flash
        self.saveListToFlash();

        return 0;
    };

    this.checkEventConflict = function(ie){
        var conflictList = [];

        //循环检查每一路上的冲突
        for(var i = 0; i < self.tunerRes.length; i++){

            conflictList[i] = new Array();
            //查看是否已分配录制资源,如果已分配资源，则只查看此路资源上的冲突
            if(ie.resId >= 0){
                if(self.tunerRes[i].id != ie.resId){
                    continue;
                }
            }

            //检查事件列表上已添加事件的冲突
            for(var j = 0; j < self.eventList.array.length;j++)
            {

                if(self.eventList.array[j].resId != self.tunerRes[i].id){
                    continue;
                }

                var ce = self.eventList.array[j];

                //检查时间段是否重叠
                if(self.checkTimeOverlap(ce.startTime,ce.duration,ie.startTime,ie.duration) == 0)
                {
                    console.log("EventConflict True");
                    conflictList[i].push(ce);
                }
            }

            //检查任务列表上 尚未添加的事件 冲突
            for(var j = 0; (j < self.taskList.array.length) && (self.taskList.array[j].resId == self.tunerRes[i].id);j++){
                var task = self.taskList.array[j];
                if(task.type == self.recordType.DAYTIME){
                    //查看是不是该任务的子事件
                    if(ie.taskHangle == task.taskHangle){
                        continue;
                    }

                    //仅检查 时间段(不包含日期) 是否重叠 (是:下一步    否:continue)
                    if(self.checkTimeOverlapIgnoreDate(task.constraint.startTime,task.constraint.duration,ie.startTime,ie.duration) != 0){
                        continue;
                    }

                    //得到 冲突的 任务事件的 时间(ie的日期 +  task的时间)
                    var  taskStartTime = ie.startTime.split(" ")[0] + " " +task.constraint.startTime.split(" ")[1];

                    //查看任务的取消列表中，是否含有此事件(是:continue    否:下一步)
                    var cancelFlag = false;
                    for(var k = 0; k < task.cancelList.length; k++){
                        if(task.cancelList[k].startTime == taskStartTime){
                            cancelFlag = true;
                            break;
                        }
                    }
                    if(cancelFlag){
                        continue;
                    }

                    //查看conflictList[i]是否已经添加该事件(是:continue  否:下一步)
                    var addFlag = false;
                    for(var k = 0; k < conflictList[i].length; k++){
                        if(conflictList[i][k].taskHangle == task.taskHangle && conflictList[i][k].startTime == taskStartTime){
                            addFlag = true;
                            break;
                        }
                    }
                    if(addFlag){
                        continue;
                    }

                    //生成event
                    var ce = self.getEventByTask(task);
                    ce.startTime = taskStartTime;

                    //添加到冲突列表
                    conflictList[i].push(ce);
                }
                else if(task.type == self.recordType.WEEKTIME){

                    //查看是不是该任务的子事件
                    if(ie.taskHangle == task.taskHangle){
                        continue;
                    }

                    //检查ie录制的星期，是否在task的星期中     (是:下一步    否:continue)
                    var  dayDulicaFlag = false;
                    for(var k = 0; k < task.constraint.week.length; k++)
                    {
                        if(task.constraint.week[k] == getEpgStartDate(ie.startTime).getDay())
                        {
                            dayDulicaFlag = true;
                            break;
                        }
                    }
                    if(!dayDulicaFlag){
                        continue;
                    }

                    //仅检查 时间段(不包含日期) 是否重叠 (是:下一步    否:continue)
                    if(self.checkTimeOverlapIgnoreDate(task.constraint.startTime,task.constraint.duration,ie.startTime,ie.duration) != 0){
                        continue;
                    }

                    //得到 冲突的 任务事件的 时间(ie的日期 +  task的时间)
                    var  taskStartTime = ie.startTime.split(" ")[0] +" "+ task.constraint.startTime.split(" ")[1];

                    //查看任务的取消列表中，是否含有此事件(是:continue    否:下一步)
                    var cancelFlag = false;
                    for(var k = 0; k < task.cancelList.length; k++){
                        if(task.cancelList[k] == taskStartTime){
                            cancelFlag = true;
                            break;
                        }
                    }
                    if(cancelFlag){
                        continue;
                    }

                    //查看conflictList[i]是否已经添加该事件(是:continue  否:continue)
                    var addFlag = false;
                    for(var k = 0; k < conflictList[i].length; k++){
                        if(conflictList[i][k].taskHangle == task.taskHangle && conflictList[i][k].startTime == taskStartTime){
                            addFlag = true;
                            break;
                        }
                    }
                    if(addFlag){
                        continue;
                    }

                    //生成event
                    var ce = self.getEventByTask(task);
                    ce.startTime = taskStartTime;

                    //添加到冲突列表
                    conflictList[i].push(ce);
                }
            }
        }
        return 	conflictList;
    };

    this.addTask = function(iTask){

        //检查冲突
        var list = self.checkTaskConflict(iTask);
        if(iTask.resId < 0){
            return 2;
        }
        console.log("getTunerIndexByResId:"+iTask.resId);
        var index = self.getTunerIndexByResId(iTask.resId);
        if( index < 0 ){
            return 3;
        }

        if(list[index].length != 0){
            return 4;
        }
        //添加到列表中
        self.taskList.array.push(iTask);

        //如果是系列录制添加录制子事件到列表中
        if(iTask.type == self.recordType.SERIAL){
            for(var i = 0; i < iTask.orderList.length; i++){
                //添加到列表中
                self.eventList.array.push(iTask.orderList[i]);
            }
            //对事件列表排序
            self.sortList(self.eventList.array);
        }

        //对事件列表排序
        self.sortList(self.taskList.array);

        //存储到flash
        self.saveListToFlash();

        return 0;
    };

    this.checkTaskConflict = function(iTask){
        var conflictList = [];
        //循环检查每一路上的冲突
        for(var i = 0; i < self.tunerRes.length; i++){
            conflictList[i] = new Array();
            //循环事件列表冲突
            for(var j = 0; (j < self.eventList.array.length) && (self.eventList.array[j].resId == self.tunerRes[i].id);j++){
                var ce = self.eventList.array[j];
                //如果是任务类型则忽略
                if(ce.type == self.recordType.SERIAL || ce.type == self.recordType.DAYTIME || ce.type == self.recordType.WEEKTIME){
                    continue;
                }
                //系列录制
                if(iTask.type == self.recordType.SERIAL){
                    //循环检查系列录制中的所有事件
                    for(var k = 0; k < iTask.orderList.length;k++){
                        var se = iTask.orderList[k];
                        //检查时间段是否重叠
                        if(self.checkTimeOverlap(ce.startTime,ce.duration,se.startTime,se.duration) == 0){
                            conflictList[i].push(ce);
                        }
                    }
                }
                //每天录制
                else  if(iTask.type == self.recordType.DAYTIME){
                    if(self.checkTimeOverlapIgnoreDate(iTask.constraint.startTime,iTask.constraint.duration,ce.startTime,ce.duration) != 0){
                        continue;
                    }
                    conflictList[i].push(ce);
                }
                //每周录制
                else  if(iTask.type == self.recordType.WEEKTIME){
                    if(self.checkTimeOverlapIgnoreDate(iTask.constraint.startTime,iTask.constraint.duration,ce.startTime,ce.duration) != 0){
                        continue;
                    }

                    var  dayDulicaFlag = false;

                    for(var k = 0; k < task.constraint.week.length; k++)
                    {
                        if(task.constraint.week[k] == getEpgStartDate(ce.startTime).getDay())
                        {
                            dayDulicaFlag = true;
                            break;
                        }
                    }
                    if(!dayDulicaFlag){
                        continue;
                    }

                    conflictList[i].push(ce);
                }
            }

            //循环检查任务列表冲突
            for(var j = 0; (j < self.taskList.array.length) && (self.taskList.array[j].resId == self.tunerRes[i].id);j++){
                var ct = self.taskList.array[j];
                if(iTask.type == self.recordType.SERIAL)
                {
                    //系列录制 系列录制
                    if(ct.type == self.recordType.SERIAL)
                    {
                        for(var n = 0; n < iTask.orderList.length;n++){
                            var temp1 = iTask.orderList[n];
                            for(var m = 0; m < ct.orderList.length;m++){
                                var temp2 = ct.orderList[m];
                                if(self.checkTimeOverlap(temp1.startTime,temp1.duration,temp2.startTime,temp2.duration) != 0){
                                    continue;
                                }

                                conflictList[i].push(ct);
                                m = ct.orderList.length;
                                n = iTask.orderList.length;
                            }
                        }
                    }
                    //系列录制 每周录制
                    else if(ct.type == self.recordType.WEEKTIME){
                        for(var n = 0; n < iTask.orderList.length;n++){
                            var temp1 = iTask.orderList[n];
                            if(self.checkTimeOverlapIgnoreDate(temp1.startTime,temp1.duration,ct.constraint.startTime,ct.constraint.duration) != 0){
                                continue;
                            }

                            var  dayDulicaFlag = false;
                            for(var k = 0; k < ct.constraint.week.length; k++){
                                if(ct.constraint.week[k] == getEpgStartDate(temp1.startTime).getDay()){
                                    dayDulicaFlag = true;
                                    break;
                                }
                            }
                            if(!dayDulicaFlag){
                                continue;
                            }

                            conflictList[i].push(ct);

                            n = iTask.orderList.length;
                        }
                    }
                    //系列录制 每天录制
                    else if(ct.type == self.recordType.DAYTIME){
                        for(var n = 0; n < iTask.orderList.length;n++){
                            var temp1 = iTask.orderList[n];
                            if(self.checkTimeOverlapIgnoreDate(temp1.startTime,temp1.duration,ct.constraint.startTime,ct.constraint.duration) != 0){
                                continue;
                            }

                            conflictList[i].push(ct);

                            n = iTask.orderList.length;
                        }
                    }
                }
                else if(iTask.type == self.recordType.WEEKTIME){
                    //每周录制 系列录制
                    if(ct.type == self.recordType.SERIAL){
                        for(var n = 0; n < ct.orderList.length;n++){
                            var temp1 = ct.orderList[n];
                            if(self.checkTimeOverlapIgnoreDate(temp1.startTime,temp1.duration,iTask.constraint.startTime,iTask.constraint.duration) != 0){
                                continue;
                            }
                            var  dayDulicaFlag = false;
                            for(var k = 0; k < iTask.constraint.week.length; k++){
                                if(ct.constraint.week[k] == getEpgStartDate(temp1.startTime).getDay()){
                                    dayDulicaFlag = true;
                                    break;
                                }
                            }
                            if(!dayDulicaFlag){
                                continue;
                            }

                            conflictList[i].push(ct);

                            n = ct.orderList.length;
                        }
                    }
                    //每周录制 每周录制
                    else if(ct.type == self.recordType.WEEKTIME){
                        if(self.checkTimeOverlapIgnoreDate(ct.constraint.startTime,ct.constraint.duration,iTask.constraint.startTime,iTask.constraint.duration) != 0){
                            continue;
                        }

                        var  dayDulicaFlag = false;
                        for(var n = 0; n < iTask.constraint.week.length; n++){
                            for(var m = 0; m < ct.constraint.week.length; m++){
                                if(iTask.constraint.week[n] == ct.constraint.week[m]){
                                    dayDulicaFlag = true;
                                    m = ct.constraint.week.length;
                                    n = iTask.constraint.week.length;
                                }
                            }
                        }
                        if(!dayDulicaFlag){
                            continue;
                        }

                        conflictList[i].push(ct);
                    }
                    //每周录制 每天录制
                    else if(ct.type == self.recordType.DAYTIME){
                        if(self.checkTimeOverlapIgnoreDate(ct.constraint.startTime,ct.constraint.duration,iTask.constraint.startTime,iTask.constraint.duration) != 0){
                            continue;
                        }
                        conflictList[i].push(ct);
                    }
                }
                else if(iTask.type == self.recordType.DAYTIME){
                    //每天录制 系列录制
                    if(ct.type == self.recordType.SERIAL)
                    {
                        for(var n = 0; n < ct.orderList.length;n++){
                            var temp1 = ct.orderList[n];
                            if(self.checkTimeOverlapIgnoreDate(temp1.startTime,temp1.duration,iTask.constraint.startTime,iTask.constraint.duration) != 0){
                                continue;
                            }

                            conflictList[i].push(ct);

                            n = ct.orderList.length;
                        }
                    }
                    //每天录制 每周录制
                    else if(ct.type == self.recordType.WEEKTIME){
                        if(self.checkTimeOverlapIgnoreDate(ct.constraint.startTime,ct.constraint.duration,iTask.constraint.startTime,iTask.constraint.duration) != 0){
                            continue;
                        }
                        conflictList[i].push(ct);
                    }
                    //每天录制 每天录制
                    else if(ct.type == self.recordType.DAYTIME){
                        if(self.checkTimeOverlapIgnoreDate(ct.constraint.startTime,ct.constraint.duration,iTask.constraint.startTime,iTask.constraint.duration) != 0){
                            continue;
                        }
                        conflictList[i].push(ct);
                    }
                }
            }
        }
        return conflictList;
    };

    this.getOptimalConflictBylist = function(conflictList){
        var ret =[];
        for(var i = 0; i < conflictList.length; i++){
            ret[i] = {
                "resId":self.tunerRes[i].id,
                "weight":0,
                "optimalList":[]
            };

            //如果某一路上，没有冲突事件，直接返回
            if(conflictList[i].length == 0){
                continue;
                //return ret;
            }

            //计算出每一路上冲突的权重
            for(var j = 0; j < conflictList[i].length; j++){
                switch(conflictList[i][j].type)
                {
                    case self.recordType.SINGLE:
                        ret[i].weight += 5;
                        break;
                    case self.recordType.SERIAL:
                        if(self.eventHangle){
                            ret[i].weight += 1;
                        }
                        else{
                            ret[i].weight += 3;
                        }
                        break;
                    case self.recordType.ONETIME:
                        ret[i].weight += 5;
                        break;
                    case self.recordType.DAYTIME:
                        if(self.eventHangle){
                            ret[i].weight += 1;
                        }
                        else{
                            ret[i].weight += 3;
                        }
                        break;
                    case self.recordType.WEEKTIME:
                        if(self.eventHangle){
                            ret[i].weight += 1;
                        }
                        else{
                            ret[i].weight += 3;
                        }
                        break;
                }
            }

            //添加列表
            ret[i].optimalList = conflictList[i];
        }

        //找出权重最小的一路
        var minIndex = 0;
        for(var i = 0; i < ret.length; i++){
            if(ret[minIndex].weight > ret[i].weight){
                minIndex = i;
            }
        }

        return ret[minIndex];
    };

    this.deleteEvent = function(ie){

        //1.在事件列表上删除
        for(var i = 0; i < self.tunerRes.length; i++){

            for(var j = 0; j < self.eventList.array.length;j++){

                if(self.eventList.array[j].resId != self.tunerRes[i].id){
                    continue;
                }
                var ce = self.eventList.array[j];

                if(ie.eventHangle == ce.eventHangle){

                    //判断此事件是否已开始录制,如果已经开始录制，则停止录制
                    if(ce.status){
                        self.stopRecord(ce);
                    }
                    //在列表上删除此事件
                    self.eventList.array.splice(j,1);
                    //保存列表
                    self.saveListToFlash();

                    //跳出循环
                    j = self.eventList.array.length;
                    i = self.tunerRes.length;
                    break;
                }
            }
        }

        //2.在任务列表上删除
        for(var i = 0; i < self.tunerRes.length; i++){
            for(var j = 0; j < self.taskList.array.length;j++){
                if(self.taskList.array[j].resId != self.tunerRes[i].id){
                    continue;
                }
                var ct = self.taskList.array[j];
                //判断是哪一个任务
                if(ie.taskHangle != ct.taskHangle){
                    continue;
                }

                //在预约列表orderList上删除该事件
                for(var k = 0; k < ct.orderList.length;k++){
                    var ce = ct.orderList[k];
                    if(ie.eventHangle == ce.eventHangle){
                        if(ce.status){
                            //停止录制
                        }
                        //在预约列表orderList上删除该事件
                        ct.orderList.splice(k,1);
                        //保存列表
                        self.saveListToFlash();
                        break;
                    }
                }

                //在取消列表cancelList上添加该事件
                var hasAdd = false;
                for(var k = 0; k < ct.cancelList.length;i++){
                    var ce = ct.cancelList[k];
                    if(ie.eventHangle == ce.eventHangle){
                        hasAdd = true;
                        break;
                    }
                }
                if(!hasAdd){
                    ct.cancelList.push(ce);
                }
            }
        }
    };

    this.deleteEventByTaskHangle = function(taskHangle){
        for(var i = 0; i < self.eventList.array.length;i++){
            var e = self.eventList.array[i];
            if(e.taskHangle == taskHangle){
                //判断此事件是否已开始录制,如果已经开始录制，则停止录制
                if(e.status){
                    self.stopRecord(e);
                }
                //在列表上删除此事件
                self.eventList.array.splice(i,1);
                i--;
            }
        }
        //保存列表
        self.saveListToFlash();
    };

    this.deleteTask = function(itask){
        for(var i = 0; i < self.tunerRes.length; i++){
            for(var j = 0; (j < self.taskList.array.length) && (self.taskList.array[j].resId == self.tunerRes[i].id);j++){
                var ct = self.taskList.array[i];
                //判断任务
                if(ct.taskHangle != itask.taskHangle){
                    continue;
                }

                //删除预约列表上的所有预约事件
                self.deleteEventByTaskHangle(ct.taskHangle);

                //从任务列表上删除该任务
                self.taskList.array.splice(j,1);

                //保存列表
                self.saveListToFlash();

                //跳出循环
                j = self.taskList.array.length;
                i = self.tunerRes.length;
            }
        }
    };

    this.deleteConflictList = function(conflictList){
        for(var i = 0; i < conflictList.length;i++){
            var et = conflictList[i];
            if(et.eventHangle){
                self.deleteEvent(et);
                continue;
            }

            if(et.taskHangle){
                self.deleteTask(et);
            }
        }
    };

    /**
     * 此函数用于重新开机时,一些关机前正在录制的事件应该清理掉
     */
    this.clearEvent = function(){

        for(var i = 0; i < self.eventList.array.length;i++)
        {
            var ie = self.eventList.array[i];

            if(ie.status)
            {
                i--;
                self.deleteEvent(ie);
            }
        }
    };

    this.getEventTemplate = function(type){
        var e = {};
        if(type == self.recordType.SINGLE){
            e = {
                type : self.recordType.SINGLE,
                epg : {
                    //保存eventID,是为了在EPG界面上显示预约录制图标时,方便在列表中查找
                    eventId : "",
                    name : "",
                    shortEvent: "",
                    level : ""
                }
            };
        }
        else if(type == self.recordType.SERIAL)
        {
            e = {
                type : self.recordType.SERIAL,
                taskHangle: "",
                epg : {
                    //系列的名稱  :康熙王朝
                    series_key : "",
                    //15        :第十五集
                    episode_key:"",
                    //0=normal 一般, 1=premier首播, 2=finale 最後
                    episode_status : "",
                    //0 非最後一集    1 最後一集
                    episode_last :  "" ,
                    eventId : "",
                    name : "",
                    shortEvent: "",
                    level : ""
                }
            };
        }
        else if(type == self.recordType.ONETIME)
        {
            e = {
                type : self.recordType.ONETIME
            };
        }
        else if(type == self.recordType.DAYTIME){
            e = {
                type : self.recordType.DAYTIME,
                taskHangle : ""
            };
        }
        else if(type == self.recordType.WEEKTIME){
            e = {
                type : self.recordType.WEEKTIME,
                taskHangle : ""
            };
        }
        e.ch = null;
        e.startTime = "";
        e.duration = 0;
        e.resId = -1;
        e.status = 0;
        e.eventHangle = generateUUID();
        return e;
    };

    /**
     * 根据 类型 获取任务模板
     * @param type
     * @returns
     */
    this.getTaskTemplate = function(type){
        var task = {};
        if(type == self.recordType.SERIAL){
            task = {
                type : self.recordType.SERIAL,
                taskHangle : generateUUID(),
                //系列描述参数
                constraint : {
                    //录制任务开始的日期
                    startTime : "",
                    //系列的名字 :康熙王朝
                    series_key : ""
                }
            };
        }
        else if(type == self.recordType.DAYTIME)
        {
            task = {
                type : self.recordType.DAYTIME,
                constraint : {
                    //录制任务开始的日期
                    startTime : "",
                    //录制时间:几点?
                    hour:"",
                    //录制时间:几分?
                    mintue:"",
                    //录制时间:多长时间?
                    duration : ""
                }
            };
        }
        else if(type == self.recordType.WEEKTIME){
            task = {
                type : self.recordType.WEEKTIME,
                constraint : {
                    //[1,3,4]   -星期天  星期六  一周内哪几天开始录制?
                    week : [],
                    //录制任务开始的日期
                    startTime : "",
                    //录制时间:几点?
                    hour:"",
                    //录制时间:几分?
                    mintue:"",
                    duration : ""
                }
            };
        }
        task.taskHangle = generateUUID();
        task.ch = null;
        task.resId = -1;
        task.orderList = [];
        task.cancelList = [];
        return task;
    };

    this.getEventByTask = function(task){
        var e = self.getEventTemplate(task.type);
        e.resId = task.resId;
        e.taskHangle = task.taskHangle;
        e.ch = task.ch;
        if(task.type == self.recordType.SERIAL)
        {
            e.epg.series_key = task.constraint.series_key;
        }
        else if(task.type == self.recordType.DAYTIME)
        {
            e.duration = task.constraint.duration;
        }
        else if(task.type == self.recordType.WEEKTIME)
        {
            e.duration = task.constraint.duration;
        }
        return e;
    };

    this.getTaskByHandle = function(taskHangle){
        for(var i = 0; i < self.taskList.array.length;i++)
        {
            if(self.taskList.array[i].taskHangle == taskHangle)
            {
                return self.taskList.array[i];
            }
        }
        return null;
    };

    this.startRecord = function(e){
        //获取录制URL
        var url = dtvCom.getRecordUrl(e.ch.idn);
        if(!url){
            console.log("Start Error! Can't get RecUrl!");
            return -1;
        }
        //获取录制的音频数据
        var aud = dtvCom.getAudioArray(e.ch.idn);

        //获取tunerId
        var tunerId = e.resId;

        //获取 serviceName
        var serviceName ="TS_"+e.ch.idn;

        //获取录制事件的私有数据
        var userData = e;


        //判断是否需要更新录制时间
        var curdate = new Date();
        var staDate = getEpgStartDate(e.startTime);
        var off = curdate.getTime() - staDate.getTime();
        if(off > 60 * 1000){
            e.startTime = getTimeStrfromDate(curdate);
        }

        var diskArray = FS.fsGetDiskInfo();
        var pvrDisk = null;
        for(var i = 0;i < diskArray.length;i++){
            if(diskArray[i].sn == sysCom.PVRPariedSn){
                pvrDisk = diskArray[i];
                break;
            }
        }

        /*if(!pvrDisk){
            self.deleteEvent(e);
            return 0;
        }*/


        var folder = "C:/PVR";

        //设置录制参数
        var params = {
            id:tunerId,
            cmd:"recStart",
            folder:"C:/PVR",
            serviceName:serviceName,
            url:url,
            audio:aud,
            userData:userData
        };

        //开始录制
        PVR.recStart(params,function(ret ){
            console.log("PVR.recStart callback");
            if(ret != 0){
                //启动录制失败
                console.log("startRecord Failed!");
                self.deleteEvent(e);
            }
        });

        for(var i = 0; i < self.eventList.array.length;i++){
            if(e.eventHangle == self.eventList.array[i].eventHangle){
                self.eventList.array[i].status = 1;
                self.saveListToFlash();
                break;
            }
        }

        return 0;
    };

    this.stopRecord = function(e){
        //获取tunerId
        var tunerId = e.resId;

        PVR.recStop(tunerId,function(){
            console.log("PVR.recStop callback");
        });

        e.status = 0;

        return 0;
    };

    this.getTunerIndexByResId = function(resId){
        for(var i = 0; i < self.tunerRes.length;i++){
            if(resId == self.tunerRes[i].id){
                return i;
            }
        }
        return -1;
    };

    this.sortList = function(list){

        list.sort(function(a, b){
            var aDate = getEpgStartDate(a.startTime ? a.startTime : a.constraint.startTime);
            var bDate = getEpgStartDate(b.startTime ? b.startTime : b.constraint.startTime);
            if(aDate.getTime() < bDate.getTime()){
                return -1;
            }
            else {
                return 1;
            }
        });
    };

    /**
     * 检查输入的开始时间段
     * @param startTime
     * @returns {number} 1:未到录制时间   2:可以开始录制   3:可以结束   4:已过期  5:录制中
     */
    this.checkTimeSolt = function(startTime,duration){
        var curDate = new Date();
        var startDate = getEpgStartDate(startTime);
        var endDate = getEpgEndDate(startDate, duration);

        if(startDate.getTime() > curDate.getTime())
        {
            return 1;
        }
        else if(curDate.getTime() >= startDate.getTime() && curDate.getTime() <= (endDate.getTime() - self.ERROR_TIME * 1000))
        {
            return 2;
        }
        else if(curDate.getTime() <= endDate.getTime()  && (curDate.getTime() + self.ERROR_TIME * 1000 ) >= endDate.getTime())
        {
            return 3;
        }
        else if(curDate.getTime() > endDate.getTime() )
        {
            return 4;
        }

        return 5;
    };

    /**
     * 检查两个唯一的时间段是否有冲突
     * @param startTime
     * @param duration
     * @param testStartTime
     * @param testDuration
     * @returns {number}
     */
    this.checkTimeOverlap = function(startTime, duration, testStartTime, testDuration){
        var startDate = getEpgStartDate(startTime);
        var endDate = getEpgEndDate(startDate, duration);
        var testStartDate = getEpgStartDate(testStartTime);
        var testEndDate = getEpgEndDate(testStartDate, testDuration);

        if(testEndDate <= startDate.getTime())
        {
            return -1;
        }
        else if(endDate.getTime() <= testStartDate.getTime())
        {
            return 1;
        }
        else
        {
            return 0;
        }
    };

    /**
     * 忽略年月日检测时间段是否重复
     * @param startTime
     * @param duration
     * @param testStartTime
     * @param testDuration
     * @returns {number}  -1:不重复   1:不重复   0:重复
     */
    this.checkTimeOverlapIgnoreDate = function(startTime, duration, testStartTime, testDuration) {
        var startDate = getEpgStartDate(startTime);
        var endDate = getEpgEndDate(startDate, duration);

        var testStartDate = getEpgStartDate(startTime.split(" ")[0] + " " + testStartTime.split(" ")[1]);
        var testEndDate = getEpgEndDate(testStartDate, testDuration);

        if(testEndDate <= startDate.getTime())
        {
            return -1;
        }
        else if(endDate.getTime() <= testStartDate.getTime())
        {
            return 1;
        }
        else
        {
            return 0;
        }
    };

    /**
     * 根据EPG shc获取,当前频道,当前节目的是否有添加录制
     * @param epgInfo
     */
    this.checkEpgRecord = function(epgInfo){
        for(var i = 0; i < self.eventList.array.length; i++)
        {
            var e = self.eventList.array[i];
            if(e.epg && (e.epg.eventId == epgInfo.eventId))
            {
                return e;
            }
        }
        return null;
    };

    this.checkSeriesRecord = function(series_key){
        for(var i = 0; i < self.taskList.array.length;i++){
            var t = self.taskList.array[i];
            if(t.type == self.recordType.SERIAL && t.constraint.series_key == series_key){
                return true;
            }
        }
        return false;
    };

    this.printE = function(e,str){
        console.log(str+JSON.stringify(e));
    };

    this.checkRecordingByTime = function(idn){
        for(var i = 0; i < self.eventList.array.length;i++){
            var e = self.eventList.array[i];
            if(e.status == 1 && e.ch.idn == idn){
                return e;
            }
        }
        return null;
    };

    this.checkRecordingByEvent = function(epgInfo){
        for(var i = 0; i < self.eventList.array.length; i++)
        {
            var e = self.eventList.array[i];
            if(e.epg && (e.epg.eventId == epgInfo.eventId) && e.status == 1)
            {
                return e;
            }
        }
        return null;
    };


    this.saveListToFlash = function(){
        //保存到机顶盒存储
        var ret = DB.dbSetValue("CNS_DVB_RECORDING_EVENTLIST", self.eventList, false);
        //console.log("save CNS_DVB_RECORDING_EVENTLIST:"+ret);
        ret = DB.dbSetValue("CNS_DVB_RECORDING_TASKLIST", self.taskList, false);
        //console.log("save CNS_DVB_RECORDING_TASKLIST:"+ret);
        //保存到浏览器
        utility.setH5Storage("CNS_DVB_RECORDING_EVENTLIST", self.eventList);
        utility.setH5Storage("CNS_DVB_RECORDING_TASKLIST", self.taskList);
    };

    this.getListFromFlash = function(){
        var obj = DB.dbGetValue("CNS_DVB_RECORDING_EVENTLIST", false);
        if(obj)
        {
            utility.setH5Storage("CNS_DVB_RECORDING_EVENTLIST", obj);
            self.eventList = obj;
        }
        else
        {
            self.eventList = {
                "array" : []
            };
            utility.setH5Storage("CNS_DVB_RECORDING_EVENTLIST", self.eventList);
        }

        obj = DB.dbGetValue("CNS_DVB_RECORDING_TASKLIST", false);
        if(obj){
            utility.setH5Storage("CNS_DVB_RECORDING_TASKLIST", obj);
            self.taskList = obj;
        }
        else
        {
            self.taskList = {
                "array" : []
            };
            utility.setH5Storage("CNS_DVB_RECORDING_TASKLIST", self.taskList);
        }
    };

    return this;
}

var recordSchCom = new RecordSchCommon();
recordSchCom.init();



/*
{
    "eventId": 7952,
    "nibbles": 0,
    "startTime": "2017/10/18 09:16:00",
    "startTimeUnix": 1508317680,
    "week": 3,
    "duration": 1560,
    "lang": 6514793,
    "serviceId": 4070,
    "name": "?????????",
    "parentRating":
    {
        "countryCode": 0,
        "rating": 0
    },
    "content":
    [
        {
            "level": 0,
            "user": 0
        }
    ],
    "seriesLinking":
    {
        "episode_key": 2,
        "episode_status": 0,
        "episode_last": 0,
        "series_key": "�{ɫˮ�ᭇ��3��"
    },
    "level": 8,
    "ch":
    {
        "idn": 139,
        "name": "???",
        "tsId": 32,
        "oriNetworkId": 0,
        "serviceId": 4070
    }
}
*/
function ReservationCommon()
{
    var self = this;

    this.timer = null;

    this.reservationArray =  {
        array: [],
        version:"1.0.0"
    };
    /*
	* init ReservationCommon  module
	*/
    this.init = function(){
        self.getAllReservation();
        self.openTimer();
    };

    /*
	* reset ReservationCommon  module
	*/
    this.reset = function(){
        self.reservationArray = {
            array: [],
            version:"1.0.0"
        };
        self.setAllReservation();
    };

    /*
	* add a new reservation
	* desc:  ����֮ǰҪ�жϳ�ͻ�Լ�����Ƿ����
	*/
    this.add = function(obj){
        console.log("obj:"+JSON.stringify(obj));
        self.reservationArray.array.push(obj);

        self.reservationArray.array.sort(function(a,b){
            var aDate = getEpgStartDate(a.startTime);
            var bDate = getEpgStartDate(b.startTime);
            if(aDate.getTime() < bDate.getTime())
            {
                return -1;
            }
            else
            {
                return 1;
            }
        });
        self.setAllReservation();
    };


    this.openTimer = function(){
        self.stopTimer();
        self.timer = setInterval(function(){
            for(var i = 0; i < self.reservationArray.array.length; i++){
                var flag = self.checkExpiration(self.reservationArray.array[i]);
                if(flag)
                {
                    console.log("openTimer-checkExpiration-true");
                    self.delete(self.reservationArray.array[i]);
                    i--;
                    continue;
                }

                flag = self.checkRemind(self.reservationArray.array[i]);

                if(flag)
                {
                    var e = self.reservationArray.array[i];
                    //��ʾ�û�
                    var p1 = {
                        title: Lp.getValue("epg_nav_remind_view"),
                        textok: Lp.getValue("OK"),
                        textno: Lp.getValue("Cancel"),
                        timeout:20*1000,
                        background: "../cview_app_common_pic/password_bg.png",
                        dia_ImgOK: "../cview_app_common_pic/ico_ok.png",
                        dia_ImgNO: "../cview_app_common_pic/ico_back.png",
                        okfun: function () {
                            if(typeof (LivePage) != "undefined")
                            {

                                if(sysCom.config.chIndex != dtvCom.getIndexByNo(e.ch.idn))
                                {
                                    LivePage.changeCh(e.ch.idn, 1, true, LivePage.passwdCb, LivePage.bannerPasswdOnkey);
                                }
                            }
                            else
                            {
                                sysCom.config.chIndex = dtvCom.getIndexByNo(e.ch.idn);
                                sysCom.saveConfig();
                                appCom.goAppByName("livetv",false);
                            }
                        },
                        nofun: function () {
                            console.log("no");
                        }
                    };

                    var p2 = {

                        text: Lp.getValue("epg_nav_remind") + "\n" + Lp.getValue("channel_name") +":"
                        + e.ch.name + " \n" + Lp.getValue("programName")+  ":"+ e.name
                    };

                    var dia = new Dialog(p1);

                    dia.show(p2);
                    //ɾ��ԤԼ
                    console.log("delete reminder");
                    self.delete(e);
                }
            }
        },1000*30);
    };

    this.stopTimer = function(){
        if(self.timer)
        {
            clearInterval(self.timer);
            self.timer = null;
        }
    };

    /*
	* delete a reservation
	*/
    this.delete = function(obj){

        for(var i = 0;i < self.reservationArray.array.length;i++){
            var item = self.reservationArray.array[i];
            if(item.eventId == obj.eventId)
            {
                self.reservationArray.array.splice(i,1);
                self.setAllReservation();
                break;
            }
        }
    };

    /*
	* get all reservation from DB
	*/
    this.getAllReservation = function(){
        var flag = false;
        var obj = utility.getH5Storage("CNS_DVB_RESERVATION");
        if(obj)
        {
            console.log("RESERVATION getConfig From Storage");
        }
        else
        {
            console.log("RESERVATION getConfig From Server");
            obj = DB.dbGetValue("CNS_DVB_RESERVATION", false);
            if(obj)
            {
                utility.setH5Storage("CNS_DVB_RESERVATION",obj);

            }
        }

        if(obj)
        {
            self.reservationArray = obj;
        }

        for(var i = 0;i < self.reservationArray.array.length;i++)
        {
            if(self.checkExpiration(self.reservationArray.array[i]))
            {
                flag = true;
                self.reservationArray.array.splice(i, 1);
            }
        }
        if(flag)
        {
            self.setAllReservation();
        }
    };


    /*
	* set all reservation to DB
	*/
    this.setAllReservation = function(){
        var ret = DB.dbSetValue("CNS_DVB_RESERVATION", self.reservationArray, false);
        utility.setH5Storage("CNS_DVB_RESERVATION",self.reservationArray);
    };

    /*
	* Check expired reservation
	* desc:���ԤԼ��Ŀ�Ƿ����
	*/
    this.checkExpiration = function(obj){
        var objDate = getEpgStartDate(obj.startTime);
        var curDate = new Date();
        if(objDate.getTime() <= curDate.getTime())
        {
            return true;
        }
        return false;
    };

    /*
	* Check expired reservation
	* desc:���ԤԼ��Ŀ�Ƿ�Ҫ����
	*/
    this.checkRemind = function(obj){
        var objDate = getEpgStartDate(obj.startTime);
        var curDate = new Date();

        var sp = (objDate.getTime() - curDate.getTime());
        if(sp  <= 60000   &&  sp  >  0)
        {
            return true;
        }
        return false;
    };

    /*
	* Check Conflicted reservation
	* desc: Ŀǰֻ�ж���ʼʱ���Ƿ��ͻ(���Ӽ���)
	* Return:    true - yes     false - no
	*/
    this.checkConflict = function(obj){
        var ret = false;
        if(!obj)
        {
            return ret;
        }

        var objDate = getEpgStartDate(obj.startTime);

        for(var i = 0;i < self.reservationArray.array.length;i++)
        {

            var item = self.reservationArray.array[i];

            var itemDate = getEpgStartDate(item.startTime);

            if(itemDate.getTime() == objDate.getTime())
            {
                ret = item;
                break;
            }
        }
        return ret;
    };

    /*
	* Check program is reserved
	* desc: ����Ŀ�Ƿ���ԤԼ��Ŀ
	*/
    this.checkReserved = function(obj){
        if(!obj)
        {
            return false;
        }

        for(var i = 0; i < self.reservationArray.array.length; i++)
        {
            var item = self.reservationArray.array[i];
            if(item.eventId == obj.eventId)
            {
                return true;
            }
        }
        return false;
    };

    //2017/06/01 19:00:00  ת��Ϊdate
    function getEpgStartDate(time){
        var t = time.split(" ");
        var t1 = t[0].split("/");
        var t2 = t[1].split(":");
        var date = (new Date(parseInt(t1[0]),parseInt(t1[1])-1,parseInt(t1[2]),parseInt(t2[0]),parseInt(t2[1]),parseInt(t2[2])));
        return date;
    }
}
var reservationCom = new ReservationCommon();
console.log("reservationCom init");
reservationCom.init();
function fsCommon()
{
    var self = this;

    this.start = function(){

    };

    this.init = function(){

    };

    this.reset = function(){

    };

    this.formatdisk =  function(disk,cb)
    {
        FS.fsDiskFormat(disk, cb);
    };

    this.getUsbPartiotions = function(){
        var usbArray = FS.fsGetDiskInfo(false);
    };


    this.getUsbFiles = function(path){
        var fileArray = FS.fsGetFiles(
            {
                "start": 0,
                "max": 0,
                "path": path
            },false);
    };

    this.getPairedDisk = function() {



        var usbArray = FS.fsGetDiskInfo(null,false);

        if(usbArray == null || usbArray.length <= 0)//
        {
            return "no disk";
        }
        if(SystemConfig.config.PVRService == 0)
        {
            return "no active";
        }


        if(usbArray) {
            for (var i = 0; i <usbArray.length;i++)
            {
               var item = usbArray[i];
               if(item.sn ==  SystemConfig.config.PVRPariedSn)
               {
                   return item;
               }

            }
        }
        return "no pair";
    }
}
var fsCom = new fsCommon();
console.log("fsCom init");function NetworkMediaPlayerCommon()
{
    var self = this;
    this.id = 1;
    this.TYPE = [
        "http://",
        "https:",
        ""
    ];

    this.mp = null;

    this.init = function(){
        if(self.mp)
        {
            self.mp = new MPlayer(self.id);
        }
    };
}
var netMplayer = NetworkMediaPlayerCommon;
console.log("netMplayer init");
//netMplayer.init();
function ScanCommon(signal)
{
	var self = this;

	this.signal = signal;

	this.scanStatus = 0;

	this.scanSignal = [
		{
			name:"DVB-C",
			value:0
		},
        {
            name:"DVB-S",
            value:1
        },
		{
            name:"DVB-T",
            value:2
        }
	];
	this.scanMode = [
		{
			name:"NIT",
			value:0
		},
        {
            name:"Manual",
            value:1
        },
		{
            name:"List",
            value:2
        }
	];

	this.scanQam = [
		64,128,256
	];

	this.saveMode = [
		{
			name:"Delete Previous Data",
			value:0
		},
		{
			name:"Keep Previous Data",
			value:1
		}
	];

	this.getUIQam = function(sQam){
	    var ret = "64";
        switch(sQam)
        {
            case 5:
                ret = "64";
                break;
            case 6:
                ret = "128";
                break;
            case 7:
                ret = "256";
                break;
        }
        return ret;
    };

	this.init = function()
	{
		//get default scan params
	};

	this.reset= function()
	{
		
	};

	this.stopScan = function(){
        this.scanStatus = 0;
		Scan.scanStop(null,false);
	};

	this.setScanParams = function(mode,car)
	{
		var params = {
			"signal":self.signal,
			"mode":mode,
			"car":car
		};
		Scan.scanSetParams(params,false);
	};

	this.startScan = function(){
        this.scanStatus = 1;
		Scan.scanStart(null,false);
	};

	this.getScanInfo = function(start,max,cb)
	{
		var param = {
			"start":start,
			"max":max
		};
		Scan.scanGetInfo(param,cb);
	};

	this.saveScan = function(mode){
		var param = {
			"mode":0
		};
		if(mode)
		{
			param.mode = mode;
		}
		Scan.scanSave(param,false);
	};

}

var scanCom = new ScanCommon(0);
console.log("scanCom init");
scanCom.init();
function TunerCommon(id,signal)
{
    var self = this;
    this.id = id;
    this.signal = signal;

    this.tunerSignal = [
        {
            name:"DVB-C",
            value:0
        },
        {
            name:"DVB-S",
            value:1
        },
        {
            name:"DVB-T",
            value:2
        }
    ];

    this.init = function()
    {
        console.log("TunerCommon init");
    };

    this.reset = function()
    {
        console.log("TunerCommon reset");
    };

    this.tunerConnect = function(carrier,cb)
    {
        var params = {
            "id":self.id,
            "signal":self.signal,
            "car":carrier
        };
        Tuner.tunerConnect(params,cb);
    };

    this.tunerGetStatus = function(cb)
    {
        var params = {
            "id":self.id,
        };
        Tuner.tunerGetStatus(params,cb)
    };

}
var tunerCom = new TunerCommon(0,0);
console.log("tunerCom init");
tunerCom.init();
function DsmccCommon()
{
    var self = this;

    //0:DSMCC_STATUS_INITIAL
    //1:DSMCC_STATUS_PARTIAL
    //2:DSMCC_STATUS_DOWNLOADING
    //3:DSMCC_STATUS_TIMEDOUT
    //4:DSMCC_STATUS_DONE
    this.tickerStatus = "0";
    this.adStatus = "0";
    this.tickerPath = "/data/app/download/ticker";
    this.adPath = "/data/app/download/ad";
    this.init = function(){
        self.getTickerData();
        self.orderTimer = setInterval(function(){
            if(self.tickerStatus == "4" || self.tickerStatus == "3")
            {
                clearInterval(self.orderTimer);
                self.getAdData();
            }
        },1000);
        /*this.tickerStatus = 4;
        this.adStatus = "4";
        utility.setH5Storage("TickerStatus",4);
        utility.setH5Storage("adStatus","4");*/
    };


    this.getTickerData = function(){
        //如果是第一次开机,则搜索ticker数据
        var obj = 0;
        if(sysCom.isPowerBoot)
        {
            //1.get PID
            var ch = dtvCom.getChannelByName("CNS-TICKER");
            if(!ch){
                return;
            }
            var pid = 0;
            if(ch.data && ch.data.privateEs && ch.data.privateEs.length>0){
                pid = ch.data.privateEs[0].pid;
            }
            else{
                return;
            }


            Dsmcc.dsmccSearchExit(false);

            obj = Dsmcc.dsmccSearchOC(pid,self.tickerPath,false);

            utility.setH5Storage("TickerStatus","2");
        }

        self.tickerStatus = utility.getH5Storage("TickerStatus");


        if(self.tickerStatus == "2")
        {
            //查询ticker搜索状态
            self.tickerTimer = setInterval(function(){
                //0:DSMCC_STATUS_INITIAL
                //1:DSMCC_STATUS_PARTIAL
                //2:DSMCC_STATUS_DOWNLOADING
                //3:DSMCC_STATUS_TIMEDOUT
                //4:DSMCC_STATUS_DONE
                var obj = Dsmcc.dsmccSearchStatus(false);
                switch(obj)
                {
                    case 0:
                        self.tickerStatus = "0";
                        utility.setH5Storage("TickerStatus","0");
                        break;
                    case 1:
                        self.tickerStatus = "1";
                        utility.setH5Storage("TickerStatus","1");
                        break;
                    case 2:
                        self.tickerStatus = "2";
                        utility.setH5Storage("TickerStatus","2");
                        break;
                    case 3:
                        clearInterval(self.tickerTimer);
                        self.tickerStatus = "3";
                        utility.setH5Storage("TickerStatus","3");
                        Dsmcc.dsmccSearchExit(false);
                        break;
                    case 4:
                        clearInterval(self.tickerTimer);
                        self.tickerStatus = "4";
                        console.log("TickerStatus OK");
                        utility.setH5Storage("TickerStatus","4");
                        Dsmcc.dsmccSearchExit(false);
                        break;
                }
            },1000);
        }

    };

    this.getAdData = function(){
        //如果是第一次开机,则搜索AD数据
        var obj = 0;
        if(sysCom.isPowerBoot)
        {
            //1.get PID
            var ch = dtvCom.getChannelByName("CNS-AD");
            if(!ch){
                return;
            }
            var pid = 0;
            if(ch.data && ch.data.privateEs && ch.data.privateEs.length>0){
                pid = ch.data.privateEs[0].pid;
            }
            else{
                return;
            }

            Dsmcc.dsmccSearchExit(false);

            obj = Dsmcc.dsmccSearchOC(pid,self.adPath,false);

            utility.setH5Storage("adStatus","2");
        }

        self.adStatus = utility.getH5Storage("adStatus");


        if(self.adStatus == "2")
        {
            //查询AD搜索状态
            self.adTimer = setInterval(function(){
                var obj = Dsmcc.dsmccSearchStatus(false);
                switch(obj)
                {
                    case 0:
                        self.adStatus = "0";
                        utility.setH5Storage("adStatus","0");
                        break;
                    case 1:
                        self.adStatus = "1";
                        utility.setH5Storage("adStatus","1");
                        break;
                    case 2:
                        self.adStatus = "2";
                        utility.setH5Storage("adStatus","2");
                        break;
                    case 3:
                        clearInterval(self.adTimer);
                        self.adStatus = "3";
                        utility.setH5Storage("adStatus","3");
                        Dsmcc.dsmccSearchExit(false);
                        break;
                    case 4:
                        clearInterval(self.adTimer);
                        self.adStatus = "4";
                        console.log("adStatus OK");
                        utility.setH5Storage("adStatus","4");
                        Dsmcc.dsmccSearchExit(false);
                        break;
                }
            },1000);
        }
    };


    this.getTickerDat = function(so){
        var fileInfo = "";
        if(self.tickerStatus != "4")
        {
            return "";
        }

        so = parseInt(so,10);

        var filePath = self.tickerPath+"/resources/cnsSO"+(so < 10 ? "0"+so : ""+so) + ".dat";

        fileInfo = utility.cnsGetFileInfo(filePath,false);

        if(fileInfo &&  fileInfo.status == 0)
        {
            return fileInfo.value;
        }
        else
        {
            return "";
        }
    };

    this.getTickerBasePath = function(){
        return self.tickerPath+"/resources/";
    };

    this.getAdXml = function(so){
        var fileInfo = "";
        if(self.adStatus != "4")
        {
            return "";
        }

        so = parseInt(so,10);

        var filePath = self.adPath+"/SO"+(so < 10 ? "0"+so : ""+so) + "/data.xml";

        fileInfo = utility.cnsGetFileInfo(filePath,false);

        if(fileInfo &&  fileInfo.status == 0 && fileInfo.value)
        {
            return fileInfo.value;
        }
        else
        {
            return "";
        }

        return "";
    };

    this.getAdBasePath = function(so){
        return self.adPath+"/SO"+(so < 10 ? "0"+so : ""+so)+"/";
    };

    return this;
}
var dsmssCom = new DsmccCommon();
console.log("dsmssCom init");
setTimeout(dsmssCom.init,500);


/*var p1 = {
    title: "提醒",
    textok: "確認",
    textno: "取消",
    background: "../cview_app_common_pic/password_bg.png",
    dia_ImgOK: "../cview_app_common_pic/ico_ok.png",
    dia_ImgNO: "../cview_app_common_pic/ico_back.png",
    okfun: function () {
        console.log("ok");
    },
    nofun: function () {
        console.log("no");
    }
};
var p2 = {
    text: "频道名称:CCTV-1\n节目名称:康熙王朝第一集\n尼玛花擦的\n是打算空间打开手机打开就"
}
var dia = new Dialog(p1);
dia.show(p2);*/
function setStyle(obj,css){
    for(var atr in css){
        obj.style[atr] = css[atr];
    }
}
//预约节目提醒
function Dialog(p1) {
    var self = this;
    this.flag = false;
    this.p1 = p1;

    this.show = function (p2) {
        self.close();

        this.p2 = p2;
        //添加dialog

        var html = '<div id="dia_Title">';
        html += '<div id="dia_TextTitle"></div>';
        html += '</div>';
        html += '<div id="dia_Content">';
        html += '<diV id="dia_Text"></div>';
        html += '</div>';

        html += '<div id="dia_Foot">';
        if (this.p1.dia_ImgOK) {
            html += '<img id="dia_ImgOK" src="">';
            html += '<span id="dia_TextOK" ></span>&nbsp;&nbsp;';
        }
        if (this.p1.dia_ImgNO) {

        html += '<img id="dia_ImgNO" src="" class="footImg">';
        html += '<span id="dia_TextNO"></span>';
    }
        html += '</div>';

        var v = document.createElement("div");
        v.id = "ch_dialog";
        document.body.appendChild(v);
        v.innerHTML += html;

        this.flag = true;

        //设置css属性
        setStyle(document.getElementById("ch_dialog"),{
            'backgroundSize': '430px 210px', 'position': 'absolute', height: '210px', overflow: 'hidden','width':'430px',
            zIndex: '1', 'position': 'absolute', top: '200px', left: '425px',
            'backgroundImage':'url(' + self.p1.background + ')'
        });

        setStyle(document.getElementById("dia_TextTitle"),{
			'fontSize': '25px',
            'color':'#FFF',
			'position': 'absolute','top':'8px','left':'0px','width':'420px','textAlign': 'center',
			
        });

        setStyle(document.getElementById("dia_Content"),{
            'color':'#FFF','position': 'absolute','top':'53px','left':'20px','width':'380px','height': '110px',
            'textAlign': 'center','fontSize': '18px','overflow':'hidden'
        });

        setStyle(document.getElementById("dia_Text"),{
            'word-break':'break-all',
        });

        setStyle(document.getElementById("dia_Foot"),{
			'position': 'absolute','top':'175px','left':'0px','width':'420px','height': '44px',
				'marginLeft': '20px','textAlign': 'center'
        });
        if (this.p1.dia_ImgOK) {
            setStyle(document.getElementById("dia_TextOK"), {
                color: 'white', position: 'relative', top: '-4px',
                'fontSize': '18px', 'marginRight': '20px'
            });
        }
        if (this.p1.dia_ImgNO)
        {
            setStyle(document.getElementById("dia_TextNO"),{
            color: 'white', position: 'relative', top: '-4px',
            'fontSize': '18px', 'marginLeft': '0px'
           });
        }
        //设置内容
        document.getElementById("dia_TextTitle").innerText = this.p1.title ? this.p1.title : "";
        if (this.p1.dia_ImgOK)
        document.getElementById("dia_TextOK").innerText = this.p1.textok ? this.p1.textok : "";
        if (this.p1.dia_ImgNO)
        document.getElementById("dia_TextNO").innerText = this.p1.textno ? this.p1.textno : "";


        var txt = "";
        var text = this.p2.text.split("\n");
        for (i = 0; i < text.length; i++) {
            txt += text[i] + "<br/>";
        }
        document.getElementById("dia_Text").innerHTML = txt;

        //设置图片
        if (this.p1.dia_ImgOK)
            document.getElementById("dia_ImgOK").src=this.p1.dia_ImgOK;
        if (this.p1.dia_ImgNO)
            document.getElementById("dia_ImgNO").src=this.p1.dia_ImgNO;

        //设置按键处理
        document.getElementById("ch_dialog").setAttribute('tabindex', 1);
        document.getElementById("ch_dialog").focus();

        document.getElementById("ch_dialog").onkeydown=function (e) {
            console.log("in dialog:" + e.keyCode);
            if (e.keyCode == 13) {
                self.close();
                //do ok cb
                if (self.p1.okfun) {
                    self.p1.okfun();
                }
            }

            if (e.keyCode == 8) {
                self.close();
                //do no cb
                if (self.p1.nofun) {
                    self.p1.nofun();
                }
            }

            e.stopPropagation();
            e.preventDefault();
        };

        if(self.p1.timeout)
        {
            self.timer = setTimeout(function(){
                self.close();
            },self.p1.timeout);
        }
    };

    this.close = function () {
        clearTimeout(self.timer);

        var n = document.getElementById("ch_dialog");
        if(n && n.parentNode){
            n.parentNode.removeChild(n);
        }
    };
    return this;
}function OtaCommon(){

    var self = this;



    this.init = function(){
        self.start();
    };

    this.start = function(){

        eventCom.registerCallback(5, function (obj) {
            var p1 = {
                title: Lp.getValue("update_tips"),
                textok: Lp.getValue("OK"),
                textno: Lp.getValue("Cancel"),
                timeout:20*1000,
                background: "../cview_app_common_pic/password_bg.png",
                dia_ImgOK: "../cview_app_common_pic/ico_ok.png",
                dia_ImgNO: "../cview_app_common_pic/ico_back.png",
                okfun: function () {
                    console.log("ok");
                    OTA.startOTAUpdate(false);
                },
                nofun: function () {
                    console.log("no");
                }
            };
            var p2 = {
                text: Lp.getValue("update_text")
            };
            var dia = new Dialog(p1);
            dia.show(p2);
        });
    };


}
var otaCom = new OtaCommon();
console.log("otaCom init");
setTimeout(otaCom.init,1000);/*
音量加减：
        var p1 = {
            max: 32,
            time: 5000,
            background: "../cview_app_common_pic/volumn_bar.png",
            ico_sound: "../cview_app_common_pic/ico_sound.png",
        }
        this.vol = new Volume(p1);

        var p2 = {
            v: 16,
        }
        this.vol.show(p2);

静音：
        var p={
            background:"../cview_app_common_pic/mute.png"       //静音背景
        }
        var mute = new Mute(p);
        mute.show();
        mute.close();
*/

function setStyle(obj,css){
    for(var atr in css){
        obj.style[atr] = css[atr];
    }
}
//音量控制
function Volume(p1) {
    var self = this;
    this.timeoutID = null;
    this.flag = false;
    self.p1 = p1;
    this.show = function (p2) {

        self.p2 = p2;

        if (self.p1.max && !isNaN(self.p1.max)) {
            var maxVol = self.p1.max;
        }
        else {
            var maxVol = 32;
        }
        var averageWidth = 640 / maxVol;

        if (self.p1.time && !isNaN(self.p1.time)) {
            var time = self.p1.time;
        }
        else {
            var time = 5000;
        }

        if (self.p2.v && !isNaN(self.p2.v)) {
            var v = self.p2.v;
        }
        else {
            var v = 0;
        }

        if (v < 0) {
            v = 0;
        }
        else if (v > maxVol) {
            v = maxVol;
        }

        //添加volume
        var addVolume = function () {
            var html = '<img id="ico_sound" src="">';
            html += '<div id="volDlg"></div>';
            html += '<div id="volNum">';
            html += '<span id="num">30</span>';
            html += '</div>';

            var v = window.top.document.createElement("div");
            v.id = "volume";
            window.top.document.body.appendChild(v);
            v.innerHTML += html;


            //设置css属性
            setStyle(window.top.document.getElementById("volume"),{
                'backgroundSize': '809px 98px', width: '809px', height: '98px', display: 'block', overflow: 'hidden',
                position: 'absolute', zIndex: '4', overflow: 'hidden', top: '550px', left: '235px'
            });

            setStyle(window.top.document.getElementById("ico_sound"),{
                float: 'left', marginTop: '23px', marginLeft: '35px', 'marginRight': '7.5px'
            });

            setStyle(window.top.document.getElementById("volDlg"),{
                float: 'left', marginTop: '34px', height: '28px', borderRadius: '3px',
                backgroundColor: '#1C86EE'
            });
            setStyle(window.top.document.getElementById("volNum"),{
                'paddingTop': '20px', width: '63px', height: 'auto', float: 'right', fontSize: '45px',
                color: 'white', textAlign: 'center', verticalAlign: 'middle', display: 'tableCell'
            });

            //设置图片
            if (self.p1.background) {
                setStyle(window.top.document.getElementById("volume"),{backgroundImage: "url(" + self.p1.background + ")"});
            }
            if (self.p1.ico_sound) {
                window.top.document.getElementById("ico_sound").setAttribute('src', self.p1.ico_sound);
            }
        };

        //判断div是否已经存在
        if (window.top.document.getElementById("volume") == null) {
            addVolume();
            this.flag = true;
        }

        //设置延时消失
        if (this.timeoutID) {
            clearTimeout(this.timeoutID);
        }
        this.timeoutID = setTimeout(self.close, time);

        //设置音量数字
        window.top.document.getElementById("num").innerText=v;

        //设置音量条长度
        setStyle(window.top.document.getElementById("volDlg"),{ width:averageWidth * v + 'px'});
    };

    this.close = function () {
        if (self.flag) {
            var n = window.top.document.getElementById("volume");
            n.parentNode.removeChild(n);
            self.flag = false;
        }
        self.timeoutID = null;
    };

    return this;
}

//静音
function Mute(p)
{
    var self = this;
    this.flag = false;
    self.p = p;
    this.show = function () {
        //判断div是否已经存在
        if (self.flag)
        {
            self.close();
        }
        else {
            //添加mute
            var v = window.top.document.createElement("div");
            v.id = "mute";
            window.top.document.body.appendChild(v);
            this.flag = true;

            //设置css
            setStyle(window.top.document.getElementById("mute"),{
                backgroundSize: '100px 70px', width: '100px', height: '70px', top: '40px', right: '40px',
                display: 'block', position: 'absolute', zIndex: '4', overflow: 'hidden'
            });

            //设置图片
            if (self.p.background) {
                setStyle(window.top.document.getElementById("mute"),{backgroundImage: 'url(' + self.p.background + ')'});
            }
        }
    };

    this.close = function () {
        if (self.flag) {
            var n = window.top.document.getElementById("mute");
            n.parentNode.removeChild(n);
            self.flag = false;
        }
    };

    return this;
}
function DlgCom()
{

    var self = this;

    this.start = function(){
        var volParams = {
            max : 32,
            time : 5000,
            background : "file:///application/cview/cview_app_common_pic/volumn_bar.png",
            ico_sound :  "file:///application/cview/cview_app_common_pic/ico_sound.png"
        };
        self.volDlg = new Volume(volParams);

        var muteParams = {
            background:"file:///application/cview/cview_app_common_pic/mute.png"
        };

        self.muteDlg = new Mute(muteParams);
        if(sysCom.config.mute)
        {
            setTimeout(function(){
                console.log("self.muteDlg.show");
                self.muteDlg.show();
            },1000*10);
        }
    };
}
var dlgCom = new DlgCom();
console.log("dlgCom init");
setTimeout(dlgCom.start,1000);

function keyCommon() {
    var self = this;
    var gongcheng_mode = 0;
    var last_green_key = 0;
    var lastkeytime = 0;


    this.checkAutoStandby = function () {
        var nowtime = new Date().getTime();
        var diff = nowtime - lastkeytime;
        if (sysCom.config.AutoStandby == 0) {
            return;
        }
        if (diff >= 5 * 60 * 60 * 1000)//五小时无操作自动进入待机
        {
            var nostandby = sysCom.getMemConfig("nostandby");
            if (nostandby == 1) {
                sysCom.setMemConfig("nostandby", 0);
                window.location.href = "file:////application/cview/cview_app_6z18_cns_standby/index.html";

            }
        }
    };

    this.init = function () {

        lastkeytime = new Date().getTime();

        setTimeout(self.checkAutoStandby, 10 * 60 * 1000);


        document.onkeydown = function (e) {


            lastkeytime = new Date().getTime();

            if (e.keyCode == self.KEY.FUNGREEN) {
                self.last_green_key++;
                if (self.last_green_key == 5) {
                    //进入工程菜单模式
                    sysCom.config.gongchengmenu = 1;
                    sysCom.saveConfig();
                    appCom.goAppByName("systemsetting", false);
                    ////////////////
                    self.last_green_key = 0;
                }

            }
            else {
                self.last_green_key = 0;
            }

            if (arealimit && arealimit.getArealimitStatus() == 1 && self.KEY.POWER != e.keyCode && sysCom.config.gongchengmenu == 0) {
                console.log("keyCode arealimit return");
                e.stopPropagation();
                e.preventDefault();
                return;
            }

            //CA Lock Service
            if (caCom && caCom.lockStatus && self.KEY.POWER != e.keyCode) {
                console.log("keyCode ca lock serivce return");
                e.stopPropagation();
                e.preventDefault();
                return;
            }

            console.log(e.keyCode + " start.");
            var ret = false;

            if ((typeof UI == "object") && (typeof UI.onKey == "function")) {
                ret = UI.onKey(e);
            }

            console.log(e.keyCode + " end.");


            if (ret == false) {
                self.onkey(e);
            }
            if (g_url.indexOf("cview_app_6z18_cns") >= 0) {
                e.stopPropagation();
                e.preventDefault();
            }
         };
        };

        this.KEY = {
            POWER: 0xe0035,
            UP: 38,
            DOWN: 40,
            LEFT: 37,
            RIGHT: 39,
            ENTER: 13,

            BACKSPACE: 0x08,
            MENU: 0xe0033,
            LIVETV: 27,

            RECORD: 0xe0017,
            EPG: 0xe0110,
            PVR: 0xe0114,
            MUTE: 0xe00f0,
            PLAY: 0xe0010,
            STOP: 0xe0011,

            LANG: 0xe0200,
            INFO: 0xe0034,

            CHAR0: 48,
            CHAR1: 49,
            CHAR2: 50,
            CHAR3: 51,
            CHAR4: 52,
            CHAR5: 53,
            CHAR6: 54,
            CHAR7: 55,
            CHAR8: 56,
            CHAR9: 57,

            CHNUP: 0xe0030,
            CHNDOWN: 0xe0031,
            VOLUP: 0xe00f3,
            VOLDOWN: 0xe00f4,

            FUNRED: 0xe0000,
            FUNGREEN: 0xe0001,
            FUNYELLOW: 0xe0002,
            FUNBLUE: 0xe0003
        };

        this.onkey = function (e) {
            var ret = true;

            if (e.keyCode == self.KEY.POWER) {

                var nostandby = sysCom.getMemConfig("nostandby");
                if (nostandby == 1) {
                    sysCom.setMemConfig("nostandby", 0);
                     window.location.href = "file:////application/cview/cview_app_6z18_cns_standby/index.html";
                }
                else {
                    sysCom.setMemConfig("nostandby", 1);
                    appCom.goAppByName("tvportal", false);
                }
                return;
            }
            else {
                var nostandby = sysCom.getMemConfig("nostandby");
                if (nostandby == 0) {
                   if( e.keyCode == UI.KEY.FUNYELLOW)
                   {
                       DB.DoEvnVars({
                           "opt": "write",
                           "var": "HdmiTxMode",
                           "value": 0
                       });
                   }
                   else   if( e.keyCode == UI.KEY.FUNBLUE)
                   {
                       DB.DoEvnVars({
                           "opt": "write",
                           "var": "HdmiTxMode",
                           "value": 1
                       });
                   }
                    return;
                }
            }

            switch (e.keyCode) {

                case self.KEY.VOLUP:

                    console.log("keyCom volume +");
                    self.handleVolume(1);
                    break;

                case self.KEY.VOLDOWN:
                    console.log("keyCom volume -");
                    self.handleVolume(-1);
                    break;
                case self.KEY.MUTE:
                    console.log("keyCom mute");
                    self.handleMute();
                    break;
                case self.KEY.LIVETV:
                    console.log("keyCom livetv");
                    appCom.goAppByName("livetv", false);
                    break;
                case self.KEY.MENU:
                    console.log("keyCom tvportal");
                    appCom.goAppByName("tvportal", false);
                    break;
                case self.KEY.ENTER:
                    console.log("keyCom OK");
                    var focusedElement = document.activeElement;
                    if (focusedElement) {
                        console.log("keyCom OK have focus");
                        if (typeof  focusedElement.onclick === "function")
                            focusedElement.onclick();
                        else if (typeof focusedElement.click === "function")
                            focusedElement.click();
                    }
                    else 
                    {
                        console.log("keyCom OK no focus");
                    }
                    break;
                case self.KEY.EPG:
                    appCom.goAppByName("epg", false);
                    break;
                case self.KEY.POWER:

                    break;
                default:
                    ret = false;
                    break;
            }
            return ret;
        };

        this.handleMute = function () {
            sysCom.config.mute = sysCom.config.mute ? 0 : 1;
            sysCom.setMute();
            if (sysCom.config.mute) {
                dlgCom.volDlg.close();
                dlgCom.muteDlg.show();
            }
            else 
            {
                dlgCom.muteDlg.close();
            }
        };

        this.handleVolume = function (step) {

            if (!sysCom.config.mute) {
                sysCom.config.mute = 0;
                sysCom.setMute();
            }

            sysCom.config.volume += step;

            if (sysCom.config.volume > 32) {
                sysCom.config.volume = 32;
            }

            if (sysCom.config.volume < 0) {
                sysCom.config.volume = 0;
            }
            sysCom.setVolume();
            dlgCom.volDlg.show({v: sysCom.config.volume});
            dlgCom.muteDlg.close();
        };
        return this;

}

var keyCom = new keyCommon();
console.log("keyCom init");
setTimeout(keyCom.init(),1000);

/**
 * Created by zengxianggen on 2017/7/12.
 */

jsf = {};
jsf.TS = {
MODULATION_QAM16 : 0,
MODULATION_QAM32 : 1,
MODULATION_QAM64 : 2,
MODULATION_QAM128 : 3,
MODULATION_QAM256 : 4,
MODULATION_QAM512 : 5,
MODULATION_QAM1024 : 6,
};

function Cns() {

    var self = this;

    //Event
    this.Event = {
        lisfuc:null,
        listener: function (func )
        {
            console.log("[changhog] Log.setLevel");
            lisfuc = func;
        },
        listenerzxg : function (func )
		{
            console.log("[changhog] Log.setLevel");
            lisfuc = func;
        },
		testvent:"xcxcxcxcxx"
    };


	Object.defineProperty(this.Event, 'CHANNEL_NAME_CHANGED',  {writable: false, value: 100});
	Object.defineProperty(this.Event, 'CHANNEL_PMTPID_CHANGED',  {writable: false, value: 101});
	Object.defineProperty(this.Event, 'CHANNEL_LIST_CHANGE',  {writable: false, value: 102});
	Object.defineProperty(this.Event, 'CHANNEL_GROUP_CHANGE',  {writable: false, value: 103});
	
	Object.defineProperty(this.Event, 'MEDIAPLAYER_START_OK',  {writable: false, value: 200});
	Object.defineProperty(this.Event, 'MEDIAPLAYER_START_ERROR',  {writable: false, value: 201});
	Object.defineProperty(this.Event, 'MEDIAPLAYER_FINLISH',  {writable: false, value: 202});
	Object.defineProperty(this.Event, 'MEDIAPLAYER_ERROR',  {writable: false, value: 203});
	Object.defineProperty(this.Event, 'MEDIAPLAYER_BUFFERING_START',  {writable: false, value: 204});
	Object.defineProperty(this.Event, 'MEDIAPLAYER_BUFFERING_PROGRESS',  {writable: false, value: 205});
	Object.defineProperty(this.Event, 'MEDIAPLAYER_BUFFERING_END',  {writable: false, value: 206});
	
	Object.defineProperty(this.Event, 'NETWORK_CONNECT_SUCCESS',  {writable: false, value: 301});
	Object.defineProperty(this.Event, 'NETWORK_CONNECT_FAIL',  {writable: false, value: 302});
	Object.defineProperty(this.Event, 'NETWORK_CONNECT_PLUGI',  {writable: false, value: 303});
	Object.defineProperty(this.Event, 'NETWORK_CONNECT_PLUGO',  {writable: false, value: 304});
	Object.defineProperty(this.Event, 'NETWORK_PING_SUCCESS',  {writable: false, value: 305});
	Object.defineProperty(this.Event, 'NETWORK_PING_FAIL',  {writable: false, value: 306});
	Object.defineProperty(this.Event, 'NETWORK_SCAN_AP_SUCCES',  {writable: false, value: 307});
	
	Object.defineProperty(this.Event, 'TUNER_LOCKED',  {writable: false, value: 401});
	Object.defineProperty(this.Event, 'TUNER_UNLOCKED',  {writable: false, value: 402});
	
	Object.defineProperty(this.Event, 'CA_CARD_PLUGOUT',  {writable: false, value: 501});
	Object.defineProperty(this.Event, 'CA_CARD_PLUGIN',  {writable: false, value: 502});
	Object.defineProperty(this.Event, 'CA_BUYMESSGE_DISPLAY',  {writable: false, value: 503});
	Object.defineProperty(this.Event, 'CA_BUYMESSGE_HIDE',  {writable: false, value: 504});

    this.Eventzxg = {
        lisfuc:"",
        listenerzxg : function (func )
        {
            console.log("[changhog] Log.setLevel");
            lisfuc = func;
        },
        testvent:"xcxcxcxcxx"
    };

    //App
    this.App = {
        id:"",
        name:"",
        url:"",
        version:"",
        dependVersion:"",
        showName:"",
        category:"",
        goPortal: function (isSavePos) {
            console.log("[changhog] AppManage.goPortal");
            appCom.goAppByName("tvportal",true);
        },

    };

    //AppManage
    this.AppManage = {};
    this.AppManage.getAll = function () {
        console.log("[changhog] AppManage.getAll");
        var temp=[];
        var curApplist = appCom.curApplist;
        if(curApplist == null)
            return null;
        for(var i = 0; i < curApplist.length;i++)
        {
                temp[i] = cn.App;
                temp[i].id = curApplist[i].app_id;
                temp[i].name = curApplist[i].launch_app_name;
                temp[i].url = curApplist[i].main_url;
                temp[i].version = curApplist[i].version;
                temp[i].dependVersion = "";
                temp[i].showName = curApplist[i].app_name;
                temp[i].category = curApplist[i].category;
        }
        return temp;
    };
    this.AppManage.getByName = function (name) {
        console.log("[changhog] zxg AppManage.getByName");
        var temp = cns.App;
        var curApplist = appCom.curApplist;
        if(curApplist == null) {
            console.log("[changhog] curApplist.is null");
            return null;
        }
         for(var i = 0; i < curApplist.length;i++)
         {
              console.log("[changhog] findname.is "+name );
              if(curApplist[i].launch_app_name == name) {

				 temp.id = curApplist[i].app_id;
				 temp.name = curApplist[i].launch_app_name;
				 temp.url = curApplist[i].main_url;
				 temp.version = curApplist[i].version;
				 temp.dependVersion = "";
				 temp.showName = curApplist[i].app_name;
				 temp.category = curApplist[i].category;
				 console.log("[changhog] getByName.is "+temp.url );
				 return temp;
			  }

        }
        console.log("[changhog] getByName no found "+ name);
        return null;
        
    };

    this.AppManage.getById = function (id) {
        console.log("[changhog] AppManage.getById");

       var temp =cn.App;
        var curApplist =appCom.curApplist;
        if(curApplist == null)
            return null;
        for(var i = 0; i < curApplist.length;i++)
        {
            if(curApplist[i].app_id == id) {
                temp.id = curApplist[i].app_id;
                temp.name = curApplist[i].launch_app_name;
                temp.url = curApplist[i].main_url;
                temp.version = curApplist[i].version;
                temp.dependVersion = "";
                temp.showName = curApplist[i].app_name;
                temp.category = curApplist[i].category;
                return temp;
            }

    	}
    	return null;
    };



    this.AppManage.getByUrl = function (url) {
        console.log("[changhog] AppManage.getByUrl");
       var temp = cn.App;
        var curApplist =appCom.curApplist;
        if(curApplist == null)
            return null;
        for(var i = 0; i < curApplist.length;i++)
        {
            if(curApplist[i].main_url == url) {
                temp.id = curApplist[i].app_id;
                temp.name = curApplist[i].launch_app_name;
                temp.url = curApplist[i].main_url;
                temp.version = curApplist[i].version;
                temp.dependVersion = "";
                temp.showName = curApplist[i].app_name;
                temp.category = curApplist[i].category;
                return temp;
            }

        }
        return null;
    };

    this.AppManage.getCurrent = function () {
        var temp = cn.App;
        console.log("[changhog] AppManage.getCurrent");
        var curApplist =appCom.curApplist;
        if(curApplist == null) {
            return null;
        }
        if(appCom.curApp >= 0 && self.curApp < curApplist.length)
        {
            temp.id = curApplist[appCom.curApp].app_id;
            temp.name = curApplist[appCom.curApp].launch_app_name;
            temp.url = curApplist[appCom.curApp].main_url;
            temp.version = curApplist[appCom.curApp].version;
            temp.dependVersion = "";
            temp.showName = curApplist[appCom.curApp].app_name;
            temp.category = curApplist[appCom.curApp].category;
            return temp;
        }
    };

    this.AppManage.go = function (url) {
        console.log("[changhog] AppManage.go");
        appCom.goAppByUrl(url);
    };

    this.AppManage.goPortal = function (isSavePos) {
        console.log("[changhog] AppManage.goPortal");
        appCom.goAppByName("tvportal",true);
    };
    //Log
    this.Log = {
		setLevel : function (module, level) {
			console.log("[changhog] Log.setLevel");
		},
		getLevel : function (module) {
			console.log("[changhog] Log.getLevel");
		},
		v : function (text) {
			console.log(text);
		},
		d : function (text) {
			console.log(text);
		},
		i : function (text) {
			console.log(text);
		},
		w : function (text) {
			console.log(text);
		},
		e : function (text) {
			console.log(text);
		}

    };
	
	Object.defineProperty(this.Log, 'LEVEL_CLOSE',  {writable: false, value: 100});
	Object.defineProperty(this.Log, 'LEVEL_VERBOSE',  {writable: false, value: 101});
	Object.defineProperty(this.Log, 'LEVEL_DEBUG',  {writable: false, value: 102});
	Object.defineProperty(this.Log, 'LEVEL_INFO',  {writable: false, value: 103});
	Object.defineProperty(this.Log, 'LEVEL_WARN',  {writable: false, value: 104});
	Object.defineProperty(this.Log, 'LEVEL_ERROR',  {writable: false, value: 105});

	
    //ChannelManage
    this.ChannelManage = {
		
		getChannelList : function (keyArray, valueArray, rule) {
			console.log("[changhog] getChannelList");
			if(!keyArray||!valueArray||keyArray.length<=0||keyArray.length>2||valueArray.length<=0||valueArray.length>2||keyArray.length!=valueArray.length){
				console.log("getChannelList params error");
				return null;
			}
			if(dtvCom.chs.length<=0)
			{
				dtvCom.start();
				if(dtvCom.chs.length<=0)
				{
					console.log("[changhog] getChannelList dtvCom.chs.length<=0");
					return null;
				}
			}
			
			console.log("[changhog] getChannelList come here");
			
			var channelList = cns.ChannelList;
			
			//console.log("[changhog] getChannelList channelList =="+JSON.stringify(channelList));
			var j = 0;
			var isadd = false;
			for(var i=0;i<dtvCom.chs.length;i++){
				isadd = false;
				if(keyArray.length == 1){
					if(keyArray[0] == cns.ChannelManage.FILTER_KEY_CHANNELTYPE){
						switch(valueArray[0]){
							case cns.Channel.TYPE_TV:
								if(dtvCom.chs[i].sortId == cns.Channel.TYPE_TV){
									
									isadd = true;
								}
							break;
							case cns.Channel.TYPE_SDTV:
								if(!dtvCom.chs[i].data||!dtvCom.chs[i].data.category)continue;
								if(dtvCom.chs[i].sortId == cns.Channel.TYPE_TV){
									if(!0x0200&dtvCom.chs[i].data.category){
										isadd = true;
									}
								}
							break;
							case cns.Channel.TYPE_HDTV:
								if(!dtvCom.chs[i].data||!dtvCom.chs[i].data.category)continue;
								if(dtvCom.chs[i].sortId == cns.Channel.TYPE_TV){
									if(0x0200&dtvCom.chs[i].data.category){
										isadd = true;
									}
								}
							break;
							case cns.Channel.TYPE_RADIO:
								if(dtvCom.chs[i].sortId == cns.Channel.TYPE_RADIO){
									isadd = true;
								}
							break;
							case cns.Channel.TYPE_DATA_BROADCAST:
								if(dtvCom.chs[i].sortId == cns.Channel.TYPE_DATA_BROADCAST){
									isadd = true;
								}
							break;
						}
					}
					else{
						if(valueArray[0] == true){
							if(!dtvCom.chs[i].userData&&!dtvCom.chs[i].userData.fav&&dtvCom.chs[i].userData.fav==1){
								isadd = true;
							}
						}
						else{
							if(!!dtvCom.chs[i].userData||!dtvCom.chs[i].userData.fav||dtvCom.chs[i].userData.fav==0){
								isadd = true;
							}
						}
					}
				}
				else {
					if(rule==0){
						switch(valueArray[0]){
							case cns.Channel.TYPE_TV:
								if(dtvCom.chs[i].sortId == cns.Channel.TYPE_TV){
									isadd = true;
								}
							break;
							case cns.Channel.TYPE_SDTV:
								if(!dtvCom.chs[i].data||!dtvCom.chs[i].data.category)continue;
								if(dtvCom.chs[i].sortId == cns.Channel.TYPE_TV){
									if(!0x0200&dtvCom.chs[i].data.category){
										isadd = true;
									}
								}
							break;
							case cns.Channel.TYPE_HDTV:
								if(!dtvCom.chs[i].data||!dtvCom.chs[i].data.category)continue;
								if(dtvCom.chs[i].sortId == cns.Channel.TYPE_TV){
									if(0x0200&dtvCom.chs[i].data.category){
										isadd = true;
									}
								}
							break;
							case cns.Channel.TYPE_RADIO:
								if(dtvCom.chs[i].sortId == cns.Channel.TYPE_RADIO){
									isadd = true;
								}
							break;
							case cns.Channel.TYPE_DATA_BROADCAST:
								if(dtvCom.chs[i].sortId == cns.Channel.TYPE_DATA_BROADCAST){
									isadd = true;
								}
							break;
						}
						if(valueArray[0] == true){
							if(!dtvCom.chs[i].userData&&!dtvCom.chs[i].userData.fav&&dtvCom.chs[i].userData.fav==1){
								isadd = true;
							}
						}
						else{
							if(!!dtvCom.chs[i].userData||!dtvCom.chs[i].userData.fav||dtvCom.chs[i].userData.fav==0){
								isadd = true;
							}
						}
						
					}
					else{
						switch(valueArray[0]){
							case cns.Channel.TYPE_TV:
								if(dtvCom.chs[i].sortId != cns.Channel.TYPE_TV){
									continue;
								}
							break;
							case cns.Channel.TYPE_SDTV:
								if(!dtvCom.chs[i].data||!dtvCom.chs[i].data.category)continue;
								if(dtvCom.chs[i].sortId == cns.Channel.TYPE_TV){
									if(0x0200&dtvCom.chs[i].data.category){
										continue;
									}
								}
							break;
							case cns.Channel.TYPE_HDTV:
								if(!dtvCom.chs[i].data||!dtvCom.chs[i].data.category)continue;
								if(dtvCom.chs[i].sortId == cns.Channel.TYPE_TV){
									if(!0x0200&dtvCom.chs[i].data.category){
										continue;
									}
								}
							break;
							case cns.Channel.TYPE_RADIO:
								if(dtvCom.chs[i].sortId != cns.Channel.TYPE_RADIO){
									continue;
								}
							break;
							case cns.Channel.TYPE_DATA_BROADCAST:
								if(dtvCom.chs[i].sortId != cns.Channel.TYPE_DATA_BROADCAST){
									continue;
								}
							break;
						}
						
						if(valueArray[0] == true){
							if(!dtvCom.chs[i].userData&&!dtvCom.chs[i].userData.fav&&dtvCom.chs[i].userData.fav==1){
									isadd = true;
							}
						}
						else{
							if(!!dtvCom.chs[i].userData||!dtvCom.chs[i].userData.fav||dtvCom.chs[i].userData.fav==0){
								isadd = true;
							}
						}
					}
				}
				if(isadd == true){
					
					
					var channel = cns.Channel;
				
					channel.name=dtvCom.chs[i].name;
					channel.type=dtvCom.chs[i].sortId; // ?
					channel.id=dtvCom.chs[i].id;
					channel.frequency=dtvCom.chs[i].carrier.freq;
					channel.symbolRate=dtvCom.chs[i].carrier.symbol;
					channel.modulation=dtvCom.chs[i].carrier.qam;
					channel.networkId=dtvCom.chs[i].oriNetworkId;
					channel.tsId=dtvCom.chs[i].tsId;
					channel.serviceId=dtvCom.chs[i].serviceId;
					channel.number = dtvCom.chs[i].serviceId;
					channel.logicNumber=dtvCom.chs[i].logicNo;
					channel.videoPID=dtvCom.chs[i].video.pid;
					if(dtvCom.chs[i].audio&&dtvCom.chs[i].audio.length>0)
					{
						channel.audioPID=dtvCom.chs[i].audio[0].pid;
						channel.audioDecodeType=dtvCom.chs[i].audio[0].type;
					}
					else{
						channel.audioPID = 0;
						channel.audioDecodeType=0;
					}
					channel.PCRPID=dtvCom.chs[i].pcrPid;
					channel.isFree=true;
					channel.playUrl=dtvCom.getLiveUrlByServiceId(channel.serviceId);
					channel.videoDecodeType=dtvCom.chs[i].video.type;
					
					var jsonString = JSON.stringify(channel);//不能直接拷贝
					channelList._listArr[j] = JSON.parse(jsonString);
					
					j++;
				}
			}

			return channelList;
			
    	},
		addListener : function (callback) {
        	console.log("[changhog] addListener");

    	},

		removeListener : function (callback) {
        	console.log("[changhog] removeListener");
    	},
	};
	
	Object.defineProperty(this.ChannelManage, 'FILTER_KEY_CHANNELTYPE',  {writable: false, value: 100});
	Object.defineProperty(this.ChannelManage, 'FILTER_KEY_FAV',  {writable: false, value: 101});
	Object.defineProperty(this.ChannelManage, 'CNS_DVB_CHS',  {writable: false, value: "CNS_DVB_CHS"});
	
	
	var stKey = "CNS_CURRENT_CHANNEL";
	this.ChannelList = {
		length:0,
		_listArr:[],
		lastChannel:null,
		nextChannel:null,
		get:function(index){
			if(!this._listArr || !this._listArr.length <= 0)return null;
			
			return this._listArr[index];
		},
		getByServiceId:function(serviceId){
			if(!this._listArr || this._listArr.length <= 0)
			{
				console.log("getByServiceId !this._listArr || this._listArr.length <= 0");
				return null;
			}
			
			console.log("getByServiceId serviceId=="+serviceId);
			
			for(var i=0;i<this._listArr.length;i++){
				if(this._listArr[i].serviceId == serviceId){
					return this._listArr[i];
				}
			}
			
			console.log("getByServiceId not find");
			
			return null;
		},
		getByLogicNumber:function(logicNumber){
			if(!this._listArr)return null;
			
			for(var i=0;i<this._listArr.length;i++){
				if(this._listArr[i].logicNumber == logicNumber){
					return this._listArr[i];
				}
			}
			
			return null;
		},
		getCurrentChannel:function(){
			var jsonString = DB.dbGetValue(stKey,false);
			var channel = JSON.parse(jsonString);
			return channel;
		},
		setCurrentChannel:function(channel){
			DB.dbSetValue(stKey,JSON.stringify(stKey),false);
		},
		find:function(channel){
			var failed = -1;
			if(this.list.length<=0)return failed;
			for(var i=0;i<this.list.length;i++){
				if(channel.serviceId == this.list[i].serviceId)
				return i;
			}
			
			return failed;
		}
	};

    //Channel
	
	
    this.Channel = {
        name:"",
        type:0,
        id:0,
		number:"",
        frequency:0,
        symbolRate:0,
        modulation:0,
        networkId:0,
        tsId:0,
        serviceId:0,
        logicNumber:0,
        videoPID:0,
        audioPID:0,
        PCRPID:0,
        isFree:false,
        playUrl:"",
        videoDecodeType:"",
        audioDecodeType:"",

        getPF : function () {
            console.log("[changhog] getPF");
        },

        getLock : function () {
            console.log("[changhog] getLock");
        },

        getFav : function () {
            console.log("[changhog] getFav");
        },

        getAudioPids : function () {
            console.log("[changhog] getAudioPids");
        },

        getSoundTrack : function () {
            console.log("[changhog] getSoundTrack");
        },

        setSoundTrack : function (soundTrack) {
            console.log("[changhog] setSoundTrack");
        },

    };
	
	Object.defineProperty(this.Channel, 'TYPE_TV',  {writable: false, value: 0x1});
	Object.defineProperty(this.Channel, 'TYPE_SDTV',  {writable: false, value: 0x10});
	Object.defineProperty(this.Channel, 'TYPE_HDTV',  {writable: false, value: 0x11});
	Object.defineProperty(this.Channel, 'TYPE_RADIO',  {writable: false, value: 0x2});
	Object.defineProperty(this.Channel, 'TYPE_DATA_BROADCAST',  {writable: false, value: 0x0c});
    
	
	this.Program = {
		name:"",
		startTime:new Date(),
		endTime:new Date(),
		duration:0,
		description:0,
		parentRating:0,
	}	

    //MediaPlayerManage
    this.MediaPlayerManage = {
		players:new Array(),
		getMediaPlayers:function () {
			console.log("[changhog] getMediaPlayers");
			return [];
    	}
    };
	
	

    //MediaPlayer
    this.MediaPlayer = {
        //澹伴亾绫诲瀷 绔嬩綋澹?宸﹀０閬?鍙冲０閬?娣峰悎澹?
        
        handle : null,
		mp:null,
        httpmp:null,
        duration : 0,
        playUrl : "",
        create : function () {
            console.log("[changhog] MediaPlayer create");
			var num = cns.MediaPlayerManage.players.length;
			
			var mediaPlayer = cns.MediaPlayer;
				mediaPlayer.handle = "mediaPlayer"+num;
				mediaPlayer.mp = dtvCom.mp;
            mediaPlayer.httpmp = new MPlayer(1);
			cns.MediaPlayerManage.players[num] = mediaPlayer;
				
            return mediaPlayer;
        },

        bind : function (mhandle) {
            console.log("[changhog] MediaPlayer bind");
			var mediaPlayer = null;
            for(var i=0;i<cns.MediaPlayerManage.players.length;i++){
				if(cns.MediaPlayerManage.players[i].handle == mhandle)
				{
					mediaPlayer = cns.MediaPlayerManage.players[i];
					break;
				}
			}
            return mediaPlayer;
        },

        release : function () {
            console.log("[changhog] MediaPlayer release");
			cns.MediaPlayerManage.players = new Array();
            return 1;
        },

        httpplay : function (url) {
            console.log("[changhog] MediaPlayer play url");
            if(this.mp)
            {
                var ret = this.mp.mpStart(url,false);
                return 1;
            }
			this.playUrl = url;
            return 0;
        },

        play : function (channel) {
            console.log("[changhog] MediaPlayer play channel channel="+JSON.stringify(channel));
			if(!channel || !this.mp){
                console.log("MediaPlayer play param error");
				return 0;
			}
			if(!channel.serviceId)
			{
                console.log("[changhog] MediaPlayer play url this.mp1="+this.mp);
                this.mp = this.httpmp;
                console.log("[changhog] MediaPlayer play url this.mp2="+this.mp);
                if(this.mp)
                {
                    url = JSON.stringify(channel).replace(/\"/g,"");
                    var ret = this.mp.mpStart(url,false);
                    return 1;
                }
                this.playUrl = url;
                return 0;

			}
            this.mp = dtvCom.mp;
			var url = dtvCom.getLiveUrlByServiceId(channel.serviceId);
			if(!url){
                console.log("MediaPlayer play make url error");
				return 0;
			}
			this.playUrl = url;
			this.mp.mpStart(url,false);
			return 1;
        },

        stop : function () {
            console.log("[changhog] MediaPlayer stop");
            if(!this.mp)
            {
                return 0;
            }
            
			this.mp.mpStop(false);
                return 1;
        },

        pause : function () {
            console.log("[changhog] MediaPlayer pause");
			
			if(!this.mp)
            {
                return 0;
            }
            
			this.mp.mpPause(false);
                return 1;
			
        },

        resume : function () {
            console.log("[changhog] MediaPlayer resume");
			
			if(!this.mp)
            {
                return 0;
            }
            
			this.mp.mpResume(false);
                return 1;
        },

        forward : function (speed) {
            console.log("[changhog] MediaPlayer forward");
			
			
			if(!this.mp)
            {
                return 0;
            }
            
			this.mp.mpSpeed(speed,false);
                return 1;
        },

        backward : function (speed) {
            console.log("[changhog] MediaPlayer backward");
			
			if(!this.mp)
            {
                return 0;
            }
            
			this.mp.mpSpeed(-speed,false);
                return 1;
        },

        seek : function (seconds) {
            console.log("[changhog] MediaPlayer seek");
			
			
			if(!this.mp)
            {
                return 0;
            }
            
			this.mp.mpSeek(seconds,false);
                return 1;
        },

        clearFrame : function () {
            console.log("[changhog] MediaPlayer clearFrame");
			
			if(!this.mp)
            {
                return 0;
            }
            
			this.mp.mpBlank(false);
                return 1;
        },

        getCurrentPlayTime : function () {
            console.log("[changhog] MediaPlayer getCurrentPlayTime");
			
			if(!this.mp)
            {
                return 0;
            }
            
			this.mp.mpGetCurTime(false);
            return 1;
        },

        getMute : function () {
            console.log("[changhog] MediaPlayer getMute");
			
			if(!this.mp)
            {
                return 0;
            }

			var ret = this.mp.mpGetMute(false);
                return ret ? true : false;
            return 1;
        },


        setMute : function (isMute) {
            console.log("[changhog] MediaPlayer setMute");
			
			if(!this.mp)
            {
                return 0;
            }
			
                var mute = 0;
                if(isMute)
                {
                    mute = 1;
                }
			var ret = this.mp.mpSetMute(mute,false);
                return 1;
        },

        getSoundTrack : function () {
            console.log("[changhog] MediaPlayer getSoundTrack");
			if(!this.mp)
            {
                return 0;
            }
           var res = this.mp.mpGetSoundChannel(false);
		   var ret = 0;
		   switch(res){
				case 0:
				ret = this.SOUNDTRACK_STEREO;
				break;
				case 1:
				ret = this.SOUNDTRACK_LEFT;
				break;
				case 2:
				ret = this.SOUNDTRACK_RIGHT;
				break;
				case 3:
				ret = this.SOUNDTRACK_MIX;
				break;
		    }
		   
                return ret;
        },

        setSoundTrack : function (track) {
            console.log("[changhog] MediaPlayer setSoundTrack");
			if(this.SOUNDTRACK_STEREO>track||this.SOUNDTRACK_STEREO<track || !this.mp)
            {
				console.log("setSoundTrack params error");
				return 0;
            }
			var sound = 0;
			switch(track){
				case this.SOUNDTRACK_STEREO:
					sound = 0;
				break;
				case this.SOUNDTRACK_LEFT:
					sound = 1;
				break;
				case this.SOUNDTRACK_RIGHT:
					sound = 2;
				break;
				case this.this.SOUNDTRACK_STEREO:
					sound = 3;
				break;
				default:
                    console.log("setSoundTrack track error");
            return 0;
				break;
			}
			
			this.mp.mpSetSoundChannel(track,false);
			return 1;
        },

        getAudioType : function () {
            console.log("[changhog] MediaPlayer getAudioType");
            return 1;
        },

        setAudioType : function (type) {
            console.log("[changhog] MediaPlayer setAudioType");
            return 1;
        },

        getVolume : function () {
            console.log("[changhog] MediaPlayer getVolume");
			if(!this.mp)
            {
                return 0;
            }
			
			return this.mp.mpGetVolume(false);
        },

        setVolume : function (volume) {
            console.log("[changhog] MediaPlayer setVolume");
			if(!this.mp)
            {
                return 0;
            }
			
			this.mp.mpSetVolume(volume,false);
        },

        getSubtitle : function () {
            console.log("[changhog] MediaPlayer getSubtitle");
        },

        setSubtitle : function (isEnable) {
            console.log("[changhog] MediaPlayer setSubtitle");
        },

        getPosition : function () {
            console.log("[changhog] MediaPlayer getPosition");
			if(!this.mp){
				return null;
			}
			
			var rect = this.mp.mpGetVideoSize(false);
			if(!rect)return null;
			var ret = {
				x:rect.l,
				y:rect.t,
				z:0,
				width:rect.w,
				height:rect.h,
			}
                return ret;
        },

        setPosition : function (x, y, z, width, height) {
            console.log("[changhog] MediaPlayer setPosition");
			if(!this.mp){
				return 0;
			}
			
                var json = {l:x,t:y,w:width,h:height};
			this.mp.mpSetVideoSize(json,false);
			
            return 1;
        },

        getFullScreen : function () {
            console.log("[changhog] MediaPlayer getFullScreen");
			if(!this.mp){
				return false;
			}
			var rect = this.mp.mpGetVideoSize(false);
			var res = Disp.getResolution(null,false);
			if(res){
				switch(res){
					case 0:
						if(rect.l==0&&rect.t==0&&rect.w==720&&rect.h==480)
						return true;
						else return false;
					break;
					case 4:
						if(rect.l==0&&rect.t==0&&rect.w==720&&rect.h==480)
						return true;
						else return false;
					break;
					case 6:
						if(rect.l==0&&rect.t==0&&rect.w==1280&&rect.h==720)
						return true;
						else return false;
					break;
					case 8:
						if(rect.l==0&&rect.t==0&&rect.w==1920&&rect.h==1080)
						return true;
						else return false;
					break;
					case 10:
						if(rect.l==0&&rect.t==0&&rect.w==1920&&rect.h==1080)
						return true;
						else return false;
					break;
				}
			}
			return false;
        },

        setFullScreen : function () {
            console.log("[changhog] MediaPlayer setFullScreen");
			
			if(!this.mp){
				return 0;
			}
			var res = Disp.getResolution(null,false);
			if(res){
				switch(res){
					case 0:
						var rect = {
							l:0,
							t:0,
							w:720,
							h:480
						};
						this.mp.mpSetVideoSize(rect,false);
						return 1;
					break;
					case 4:
						var rect = {
							l:0,
							t:0,
							w:720,
							h:480
						};
						this.mp.mpSetVideoSize(rect,false);
						return 1;
						return 1;
					break;
					case 6:
						var rect = {
							l:0,
							t:0,
							w:1280,
							h:720
						};
						this.mp.mpSetVideoSize(rect,false);
						return 1;
					break;
					case 8:
						var rect = {
							l:0,
							t:0,
							w:1920,
							h:1080
						};
						this.mp.mpSetVideoSize(rect,false);
						return 1;
					break;
					case 10:
						var rect = {
							l:0,
							t:0,
							w:1920,
							h:1080
						};
						this.mp.mpSetVideoSize(rect,false);
						return 1;
					break;
				}
			}
			return false;
        },


        getFrameMode : function () {
            console.log("[changhog] MediaPlayer getFrameMode");
			if(!this.mp){
				return 0;
			}
			
			var res = this.mp.mpGetStopMode(false);
			if(res){
				if(res == 0){
					return false;
				}
				
				if(res == 1){
					return true;
				}
            }
			
            return false;
        },

        setFrameMode : function (isKeep) {
            console.log("[changhog] MediaPlayer setFrameMode");
            if(!this.mp){
				return 0;
			}
			
			if(isKeep){
				this.mp.mpSetStopMode(1,false);
				return 1;
			}
			else{
				this.mp.mpSetStopMode(0,false);
                return 1;
            }
        },

        getAspectRatio : function () {
            console.log("[changhog] MediaPlayer getAspectRatio");
			if(!this.mp){
				return 0;
			}
            var res = this.mp.mpGetAspectRatio(false);
			if(res){
				switch(res){
					case 0:
						return this.ASPECTRATIO_16_9;
					break;
					case 1:
						return this.ASPECTRATIO_4_3;
					break;
					default:
						return this.ASPECTRATIO_16_9;
					break;
				}
            }
			return this.ASPECTRATIO_16_9;
        },
        setAspectRatio : function (mode) {
            console.log("[changhog] MediaPlayer getAspectRatio");
			if(!this.mp){
				return 0;
			}
			var val = 0;
			switch(mode){
				case this.ASPECTRATIO_4_3:
					val = 1;
				break;
				default:
					val = 0;
				break;
            }
           this.mp.mpSetAspectMode(val,false);
        },

        getAspectMatch : function () {
            console.log("[changhog] MediaPlayer getAspectMatch");
			if(!this.mp){
				return 0;
			}
			var res = this.mp.mpGetAspectMode(false);
			if(res){
				switch(res){
					case 0:
					return this.ASPECTMATCH_AUTO;
					break;
					case 1:
					return this.ASPECTMATCH_LETTERBOX;
					break;
					case 2:
					return this.ASPECTMATCH_PANSCAN;
					break;
					case 3:
					return this.ASPECTMATCH_COMBINED;
					break;
				}
			}
			return 0;
        },

        setAspectMatch : function (mode) {
            console.log("[changhog] MediaPlayer setAspectMatch");
			if(!this.mp){
				return 0;
			}
			
			var val = 0;
			switch(mode){
				case this.ASPECTMATCH_AUTO:
					val = 0;
				break;
				case this.ASPECTMATCH_LETTERBOX:
					val = 0;
				break;
				case this.ASPECTMATCH_PANSCAN:
					val = 0;
				break;
				case this.ASPECTMATCH_COMBINED:
					val = 0;
				break;
			}
			this.mp.mpSetDecodeMode(val,false);
        },

        getAudioPid : function () {
            console.log("[changhog] MediaPlayer getAudioPid");
			if(!this.mp){
				return 0;
			}
			
			var pids = new Array();
			if(this.playUrl.substring(0,7) == "live://"){
				var channel = dtvCom.getChannelByUrl(this.playUrl);
				if(channel&&channel.audio){
					for(var i=0;i<channel.audio.length;i++){
						pids[i] = channel.audio[i].pid;
					}
				}
			}
			return pids;
			
        },

        setAudioPid : function (audioDcodeType, pid) {
            console.log("[changhog] MediaPlayer setAudioPid");
			
			if(!this.mp){
				return 0;
			}
			var params = {
				aStreamType:-1,
				pid:-1,
			
			};
			if(this.playUrl.substring(0,7) == "live://"){
				var channel = dtvCom.getChannelByUrl(this.playUrl);
				if(channel&&channel.audio){
					for(var i=0;i<channel.audio.length;i++){
						if(pid == channel.audio[i].pid){
							params.aStreamType = channel.audio[i].type;
							params.pid = channel.audio[i].pid;
						}
					}
				}
			}
			
			if(params.pid!=-1&&params.aStreamType!=-1){
				this.mp.mpSetAudioTrack(params,false);
				return 1;
			}
			
			return 0;
        },

        addListener : function (callback) {
            console.log("[changhog] MediaPlayer addListener");
        },

        removeListener : function (callback) {
            console.log("[changhog] MediaPlayer removeListener");
        },


    };
	
	Object.defineProperty(this.MediaPlayer, 'SOUNDTRACK_STEREO',  {writable: false, value: 100});
	Object.defineProperty(this.MediaPlayer, 'SOUNDTRACK_LEFT',  {writable: false, value: 101});
	Object.defineProperty(this.MediaPlayer, 'SOUNDTRACK_RIGHT',  {writable: false, value: 102});
	Object.defineProperty(this.MediaPlayer, 'SOUNDTRACK_MIX',  {writable: false, value: 103});
	
	Object.defineProperty(this.MediaPlayer, 'ASPECTRATIO_4_3',  {writable: false, value: 200});
	Object.defineProperty(this.MediaPlayer, 'ASPECTRATIO_16_9',  {writable: false, value: 201});
	Object.defineProperty(this.MediaPlayer, 'ASPECTRATIO_AUTO',  {writable: false, value: 202});
	Object.defineProperty(this.MediaPlayer, 'ASPECTRATIO_SQUARE',  {writable: false, value: 203});
	
	Object.defineProperty(this.MediaPlayer, 'ASPECTMATCH_AUTO',  {writable: false, value: 300});
	Object.defineProperty(this.MediaPlayer, 'ASPECTMATCH_LETTERBOX',  {writable: false, value:301});
	Object.defineProperty(this.MediaPlayer, 'ASPECTMATCH_PANSCAN',  {writable: false, value: 302});
	Object.defineProperty(this.MediaPlayer, 'ASPECTMATCH_COMBINED',  {writable: false, value: 303});
    
    //SystemInfo
    this.SystemInfo = {
		serNo : "",
		hwVer : "",
		swVer : "",
		loaderVer : "",
		kernelVer : "",
		middlewareVer : "",
		swDate : "",
		cpu : "MSD6Z18",
		ramSize : "1024*1024 KB",
		flashSize : "256*1024 KB",
		hdcp : "",
		mac : "",
		audioLanguage : "",
		dolbyMode : "",
		resolution : "",
		aspectRatio : "",
		aspectCVRS : "",
		zipCode : "",
		set:function (key, value) {
        	switch(key){
				case "currentVolume":
					dtvCom.mp.mpSetVolume(value,false);
				break;
				case "mute":
					dtvCom.mp.mpSetMute(value,false);
				break;
				case "menuLanguage":
					if(typeof(value)=="number"&&value==0&&value!=sysCom.config.menuLanguageIndex)
					{
						sysCom.config.menuLanguageIndex = 0;
						sysCom.saveConfig();
						break;
					}
					
					if(typeof(value)=="number"&&value==1&&value!=sysCom.config.menuLanguageIndex)
					{

						sysCom.saveConfig();
						break;
					}
					
				break;
				case "menuTimeout":
					if(typeof(value)=="number"&&value!=sysCom.config.menuLanguageIndex)
					{
						sysCom.config.menuLanguageIndex = 0;
						sysCom.saveConfig();
						break;
					}
				break;
			}
    	},
		get:function(key){
			switch(key){
				case "currentVolume":
					return dtvCom.mp.mpGetVolume(false);
				break;
				case "mute":
					return dtvCom.mp.mpGetMute(false);
				break;
				case "menuLanguage":
					return sysCom.config.menuLanguageIndex;
					
				break;
				case "menuTimeout":
					return sysCom.config.displayTime;
				break;
			}
		},
	};
	
	
	
	this.dataInit = function(){



		//var res = Utility.getDeviceInfo(false);
		//if(res){
		self.SystemInfo.serNo = sysCom.deviceInfo.sn+"";// res.sn+"";
        self.SystemInfo.hwVer = sysCom.deviceInfo.hwVersion+"";//res.hwVersion+"";
        self.SystemInfo.swVer = sysCom.deviceInfo.swVersion+"";//res.swVersion+"";


		//}
		
		var res = sysCom.config.menuLanguageIndex;
		if(res != null){
            self.SystemInfo.audioLanguage = res==0?"Chinese":"English";
		}
		
		var res = sysCom.config.Reslution;//; Disp.getResolution(null,false);
		if(res){
			switch(res){
				case 0:
                    self.SystemInfo.resolution = "480i";
				break;
				case 4:
                    self.SystemInfo.resolution = "480p";
				break;
				case 6:
                    self.SystemInfo.resolution = "720p";
				break;
				case 8:
                    self.SystemInfo.resolution = "1080i";
				break;
				case 10:
                    self.SystemInfo.resolution = "1080p";
				break;
			}
		}
        if(caCom &&caCom.caParams )
            self.SystemInfo.zipCode = caCom.caParams.zipCode;
        else
            self.SystemInfo.zipCode="";


	};
  

    //Setting
    this.Setting = {
		setEnv : function (key, value) {
			
			//Utility.setH5Storage(key, value);
            sessionStorage.setItem(key,value);
			console.log("[changhog] Setting.setEnv key="+key);
            console.log("[changhog] Setting.setEnv value="+value);
		},
		getEnv : function (key) {
			console.log("[changhog] Setting.getEnv key="+key);
            var envvalue = sessionStorage.getItem(key);//Utility.getH5Storage(key);


			return envvalue;
		},
		deleteEnv : function (key) {
			console.log("[changhog] Setting.deleteEnv");
			//Utility.deleteH5Storage(key);
            sessionStorage.removeItem(key);
		},
		setLocalStorage : function (key, value) {
			console.log("[changhog] Setting.setLocalStorage");
			var storage = utility.getH5Storage("CNS_LOCAL_STORAGE");
			if(!storage){
				storage = {};
			}
			storage[key] = value;
            utility.setH5Storage("CNS_LOCAL_STORAGE", storage);
			DB.dbSetValue("CNS_LOCAL_STORAGE", storage, false);
		},
		getLocalStorage : function (key) {
			console.log("[changhog] Setting.getLocalStorage");
			var storage = utility.getH5Storage("CNS_LOCAL_STORAGE");
			if(storage==null)return null;
			if(storage[key])return storage[key];
			
			return null;
			
		},
		deleteLocalStorage : function (key) {
			console.log("[changhog] Setting.deleteLocalStorage");
			var storage = utility.getH5Storage("CNS_LOCAL_STORAGE");
			if(storage==null)return;
			var newStroage={};
			var exist = false;
			for(var p in storage){
				if(p==key){
					exist = true;
					continue;
				}
				newStroage[p] = storage[p]; 
			}
			if(exist){
                utility.setH5Storage("CNS_LOCAL_STORAGE", newStroage);
				DB.dbSetValue("CNS_LOCAL_STORAGE", newStroage, false);
			}
		},
		setGlobalKeyMode : function (mode) {
			console.log("[changhog] Setting.setGlobalKeyMode");
		},
	
		getParentalPIN : function () {
			return sysCom.config.ParentalPin;
		},
		getPurchasePIN : function () {
			console.log("[changhog] Setting.getPurchasePIN");
			return sysCom.config.PersonalAuthenticationPin;
		},
		wmRestart : function () {
            utility.reboot(false);
		}
	};
	
		    //NetworkManage
			
	
			
    this.NetworkManage = {
		getNetworks:function(){
			var networks = new Array();
			var res = utility.getDeviceInfo(false);
			
			if(res!=null&&res.netInf){
				for(var i=0;i<res.netInf.length;i++){
					networks[i] = cns.Network;
					console.log("cns.Network=="+JSON.stringify(cns.Network));
					networks[i].name = res.netInf[i].inf;
					if(networks[i].name.substring(0,3)=="eth"){
						networks[i].deviceType = "wlan";
					}
					else{
						networks[i].deviceType = "eth";
					}
					networks[i].mac = res.netInf[i].mac;
					
					
					
					var data = NetWork.networkGet({interface:networks[i].name},false);
					if(data!=null){
						if(data.ip!="0.0.0.0")networks[i].isConnected = true;
						else
						if(data.ip!="0.0.0.0")networks[i].isConnected = false;
					}
				}
			}
			return networks;
		},
		addListener:function(){
			
		},
		removeListener:function(){
			
		}
	};
	
    //Network
    this.Network = {
		name:"",
		deviceType:"",
		mac:"",
		plugStatus:"",
		isConnected:false,

        getConnectType : function () {
            console.log("[changhog] Network.getConnectType");
			return null;
        },
        getIPs : function () {
            console.log("[changhog] Network.getIPs");
			var data = NetWork.networkGet({interface:this.name},false);
			if(!data)return [];
			var ips = new Array();
			ips[0] = cns.IP;
			ips[0].ip = data.ip;
			ips[0].mask = data.mask;
			ips[0].gateway = data.gateway;
			ips[0].dnsArray = data.dns; 
			
			return ips;		
        },
        ping : function (url) {
            console.log("[changhog] Network.ping");
        },
    };
	
	Object.defineProperty(this.Network, 'CONNECTTYPE_STATIC',  {writable: false, value: 100});
	Object.defineProperty(this.Network, 'CONNECTTYPE_DHCP',  {writable: false, value: 101});
	Object.defineProperty(this.Network, 'CONNECTTYPE_PPPOE',  {writable: false, value: 102});
	Object.defineProperty(this.Network, 'CONNECTTYPE_PPPOECA',  {writable: false, value: 103});
	Object.defineProperty(this.Network, 'CONNECTTYPE_DHCPPLUS',  {writable: false, value: 104});
	
	Object.defineProperty(this.Network, 'ENCRPTYPE_NONE',  {writable: false, value: 200});
	Object.defineProperty(this.Network, 'ENCRPTYPE_WEP',  {writable: false, value: 201});
	Object.defineProperty(this.Network, 'ENCRPTYPE_WPAPSK',  {writable: false, value: 202});
	Object.defineProperty(this.Network, 'ENCRPTYPE_WPA2PSK',  {writable: false, value: 203});
	
    //IP
    this.IP = {
        ip:"",
        mask:"",
        gateway:"",
        dnsArray:new Array()
    };




    //Tuner
    this.Tuner = {
		addListener : function (callback) {
        	console.log("[changhog] Tuner.addListener");
    	},
		removerListener : function (callback) {
        	console.log("[changhog] Tuner.removerListener");
    	}
	};

    //CA
    this.CA = {
		name : "",
		cardId : "",
		areaCode : "",
		provider : "",
		expireDate : "",
		addListener:function(callback){
			
		},
		removerListener:function(){
		
		},
	};


    this.ADManager={
    	allAd:[],
        createAD:function(dom,type)
		{
         console.log("ADManager dom="+dom+",type="+type);
         var ad = new CHAdvertise();
         ad.init(dom,type);
         allAd.push(ad);
         return ad;
		},

        destroyAll:function()
        {
            console.log("ADManager destroyAll");
            for(var i  = 0;i < allAd.length;i++)
			{
                allAd[i].destroy();
			}
            allAd = [];
        },
	};
    this.CHAdvertise = {
        dom:"",
		type:"",

    	init:function (dom,type) {
           self.dom = dom;
           self.type= type;
        },
        show:function()
        {
            console.log("ADManager show");
        },
        keyEnter:function()
        {
            console.log("ADManager keyEnter");
        },
        pause:function()
        {
            console.log("ADManager pause");
        },
        resume:function()
        {
            console.log("ADManager resume");
        },
        stop:function()
        {
            console.log("ADManager stop");
        },
        exit:function()
        {
            console.log("ADManager exit");
        },
        destroy:function()
        {
            console.log("ADManager destroy");
        },
	};




    return this;
}

if (typeof  top.window.cns == "undefined")
   top.window.cns  = new Cns();

console.log("cns init");
if( top.window.cns) {
	top.window.cns.dataInit();
}
/*console.log = function (log) {
	if(log && log.toString().length <1000)
       console.log("my log="+log);
}*/


	





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
	
	



/*
 	VMB Client 機制
	1.開機後以一亂數x300秒起算(防止大停電後，一票STB同時送)
	2.累積128筆或3小時到後開始試著上傳
	3.若上傳失敗，每5分鐘重試
	4.記憶總數達255筆後，再有資料進來開始砍掉舊資料，並保留一筆記錄砍掉了多少筆 
	
	2013/12/12
		change PERMANENT to VOLATILE 
		add version 
		add log to console.log
		
	2014/02/05
		修正中文傳輸問題
		增加取 MAC ADDRESS 的功能
		
    2014/02/13		
		將主機網址設為 http://vbm.totaltv.com.tw
		
	2014/02/17
       增加上傳檔名到時間(分)的格式	
	   INIT_DELAY_TIME 改為 600
	   
	2014/02/20
	   增加版本控制
	   
	2014/03/256
		增加 setting.cardSn 變數

    2014/04/02
        version 增加到 1.4.0    
    2014/04/04
        add getBoxMac function
		
	2014/09/24
		change the url to ip
		
	2014/12/12
		change Time_Backup to 1*60*6        	
	2014/01/30
		add signal status in value 6 of agent9/type0
        	
    2015/09/18
        add firmware version log to Agent ID: 9
        
    2015/11/02
        reduce STB to check CM status.
    
    2015/12/07
        Add Cust_Id/Area_Code/Node_No values.
        
    2015/12/11
        Fix software version information will change line issue.
        
    2016/02/19
        Delete MAC Address data in AgentID 9.
    
    2017/04/26
        Change SERVER_API from ip address to DNS address.
 */

(function() {

var VbmCall = {
	"path": "http://127.0.0.1:18031/rpc",
    "id":1,
    "callSync":function (method,params){
        
        try {
            var obj={"jsonrpc":"2.0","id":VbmCall.id,"method":method};

            if(params != null){
                obj.params = params;
            }

            var text = JSON.stringify(obj);
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("POST",VbmCall.path, false);
            xmlhttp.send(text);
            var ret = JSON.parse(xmlhttp.responseText);
            return ret?ret.result:null;
        }catch(e){
            //console.log("error callSync EXP:" + e.name + ": " + e.message);
            return null;
        }
    },

    "callAsync":function(method,params,cb) {

        var obj={"jsonrpc":"2.0","id":VbmCall.id,"method":method};

        if(params != null){
            obj.params = params;
        }
        var text = JSON.stringify(obj);

        var xmlhttp = new XMLHttpRequest();

        xmlhttp.open("POST", VbmCall.path, true);
        xmlhttp.send(text);

        xmlhttp.onreadystatechange = function () {
            if ((xmlhttp.readyState == 4 && xmlhttp.status == 200) || xmlhttp.status == 404) {

                if(typeof (cb) == "function") {
                    if(xmlhttp.status == 200){
                        var ret = JSON.parse(xmlhttp.responseText);
                        if(ret) {
                            cb(ret.result);
                        }else{
                            cb(null);
                        }
                    }else {
                        cb(null);
                    }
                }
            }
        };
    },

    "callRemote":function(method,params,cb){
        if(cb === false){
            return VbmCall.callSync(method,params);
        }else{
            VbmCall.callAsync(method,params,cb);
        }
    }
};




var vbm_client = {
    "getrecords":function(cb){
        return VbmCall.callRemote("vbm_getrecords",null,cb);
    },
    
    "vbm_reset":function(cb){
        return VbmCall.callRemote("vbm_reset",null,cb);
    },
	
	"vbm_update":function(params,cb){
        return VbmCall.callRemote("vbm_update", params, cb);
    },
  
};

var isFirst = true;

var setting = {
    DEBUG : false,
    ZIPCODE:'',
    seriesNumber : '012201306030000418',
    SO: '05',
    CONST_RECORD : 'cns.log',
    NEW_LINE: '\n',
    SUBMIT_COUNT: (128 * 1), // 128
    MAX_COUNT: (256 * 1), // 256
    TIME_BACKUP :(1 * 60 * 60),
    AGENT_DROP : 99,
    AGENT_INFO : 9,
    RETRY_TIME : 5,
    INIT_DELAY_TIME : 600,
    SERVER_API: 'http://vbm.totaltv.com.tw:8081/log/upload',//SERVER_API: 'http://172.17.128.153:8080/log/upload',
    MAC_ADDRESS_API : null,
    VERSION : '1.4.2',
    VERSION_OBJECT : 'cns.log.vbmclient.version',
    DEFAULT_UPLOAD_API: 'http://vbm.totaltv.com.tw:8081/log/upload', //'http://172.17.128.153:8080/log/upload', /* 此系統預設值由 CNS 決定 */
    CONST_UPLOAD : 'cns.log.upload',
    MAC_TIME : null,
    MAC_ADDRESS:null,
    MAC_IP :null,
    BOX_MAC :null,
    CUST_ID :null,
    AREA_CODE :null,
    NODE_NO :null,
    signal : '000/0/0dB/0dBuV',
    firmware_version: "adsf8"
};

/*
 * encodeURI replaces each instance of certain characters by one, two, three, or four escape sequences
 * representing the UTF-8 encoding of the character.
 * Each one in the escape sequences is represented in the format of ‘%NN’, where ‘N’ is one Hex number.
 *
 * @return the UTF-8 byte length of a string.
*/
function utf8ByteLength(str) {
    if (!str) return 0;
    var escapedStr = encodeURI(str);
    var match = escapedStr.match(/%/g);
    return match ? (escapedStr.length - match.length *2) : escapedStr.length;
}

function getTimeFormatString (date) {

var s = date.getSeconds();
var mm = date.getMinutes();
var h = date.getHours();
var d = date.getDate();
var m = date.getMonth() + 1;

return date.getFullYear() + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d) + ' ' +
       (h <= 9 ? '0' + h : h) + ':' + (mm <= 9 ? '0' + mm : mm) + ':' + (s <= 9 ? '0' + s : s);

}

function getCurrentTimeStamp(){
    return new Date().getTime()
}

function EventDispatcher() {
    var events = {};

    this.addEventListener = function (key, func) {
        if (!events.hasOwnProperty(key)) {
            events[key] = [];
        }
        l('addEventListener '+key+'='+func);
        events[key].push(func);
    };

    this.fire = function (key, data) {

        if (events.hasOwnProperty(key)) {
            data = data || {};
            for (var i in events[key]) {
                events[key][i]( {data:data,target:this});
            }
        }
    };
}

function Convert() {

    this.objToString = function (obj) {

        var result = '';

        for (var name in obj) {
            if (obj.hasOwnProperty(name)) {
                if (result.length != 0) {
                    result += ',';
                }
                result += name + '=' + obj[name];
            }
        }

        return result;
    };

    this.dataStringToObject = function (data) {
        return data.split(setting.NEW_LINE);
    };

    this.parse = function(str) {

        var fields = str.split(',');

        var obj = {};

        for (var i=0;i<fields.length;i++) {
            var field = fields[i].split('=');
            obj[field[0]] = field[1];
        }

        return obj;
    };
}
//var signal = "(0, 0dB, 0dBuV)";

function MacAddressUtil() {

    this.getAddress = function(callback) {

        var time = setting.MAC_TIME;
        var isThisSameDay = false;

        if (time == null) {
            time = new Date();
        }
        else
        {
            var now = new Date();
            oldMonth = time.getMonth();
            newMonth = now.getMonth();
            oldDay = time.getDate();
            newDay = now.getDate();

            if ((now.getHours() >= 8) || ((oldMonth == newMonth) && (oldDay == newDay)))
            {
                isThisSameDay = true;
            }
        }

        var msec = Math.floor( (new Date().getTime() - time.getTime()) / 1000 / 60 / 60);

        //l('check setting.MAC_TIME:' + setting.MAC_TIME  + ',sec :' + msec);

        if (setting.MAC_TIME == null || ((msec > 12) && (isThisSameDay == false))) {
            //('try get new mac address -> time:' + msec + ' hr');
            getMacAddress(callback);
        } else {
            //l('get exist mac address ' + setting.MAC_ADDRESS);
            // pass false to return exist values
            callback( getInfoObject( false,'') );
        }
    };

    function getInfoObject(success,text) {


        function trim(str) {
            return str.replace(/(^\s*)|(\s*$)/g, "");
        }

        function parseText(str) {

            var fields = str.split('<BR>');
            var obj = [];

            for (var i=0;i<fields.length-1;i++) {

                var field = fields[i].split('=');
                console.log("field[0] == "+field[0]);
                obj[i] = field[1];

            }

            setting.MAC_ADDRESS = obj[3];
        };


        function fetchSignal()
        {
            var SPLITER = "/";
          try {
            var frontendId = toi.frontendService.getFrontends()[0];
            var frontendInfo = toi.frontendService.getFrontendInfo(frontendId);
            if (frontendInfo.isLocked === true) {
              var bitErrorRate = frontendInfo.bitErrorRate / 1000000000;
              var freq=frontendInfo.centreFrequency/10000;
              var berString =
                bitErrorRate != 0 ? bitErrorRate.toExponential(1).toUpperCase() : "0";
                setting.signal = freq+"/" + berString + SPLITER +
                + (frontendInfo.signalNoiseRatio / 10) + "dB" + SPLITER
                + frontendInfo.rFLevel + "dBuV";
              return true;
            }
            else {
              setting.signal = "000/" + 0 + SPLITER +
                + 0 + "dB" + SPLITER
                + 0 + "dBuV/";
            }
          }
          catch (e) {
              console.log("error: "+e);
            console.log(e);
          }
          return false;
        }

        function getSignalStatus(){
            var params = {
                id:0
            }
            var json = tuner.tunerGetStatus(params,false);
            console.log("getSignalStatus json =="+JSON.stringify(json));
        }

        parseText(text);
        getSignalStatus();

        var jsonResult = {
                // cancel to access MAC address data  2016/02/18  by Ricky
                /*'AgentId':'9', // COUNT agent identification
                'EventType':'0', // COUNT agent event id
                'StbId':setting.seriesNumber, // STB’s serial number
                'EventTimeStamp':new Date().getTime(), // Time of event occurrence
                'Value_0': setting.cardSn, // Smartcard number
                'Value_1':fields[0], // RetCode
                'Value_2':fields[1], // RetMsg
                'Value_3':fields[2], // IP
                'Value_4':fields[3], // MAC Address ,CM connected to STB
                'Value_5':setting.BOX_MAC, // MAC Address ,STB’s Mac Address
                'Value_6':setting.signal,
                'Value_7':setting.firmware_version,
                'Value_8':setting.CUST_ID,
                'Value_9':setting.AREA_CODE,
                'Value_10':setting.NODE_NO*/
                'StbId':setting.seriesNumber,
                'AgentId':'9', // COUNT agent identification
                'EventType':'0', // COUNT agent event id
                'EventTimeStamp':getCurrentTimeStamp(), // Time of event occurrence
                'Value_0': '8122603610013630', // Smartcard number
                'Value_1':'', // RetCode
                'Value_2':'', // RetMsg
                'Value_3':'', // IP
                'Value_4':'', // MAC Address ,CM connected to STB
                'Value_5':setting.MAC_ADDRESS, // MAC Address ,STB’s Mac Address
                'Value_6':setting.signal,
                'Value_7':'A9.5B',
            };

        return jsonResult;

    }

    function getMacAddress(callback) {
        // cancel to access MAC address data  2016/02/18  by Ricky
        var xhr = new XMLHttpRequest();

        console.log("setting.MAC_ADDRESS_API =="+setting.MAC_ADDRESS_API);
        xhr.open("POST", setting.MAC_ADDRESS_API, false);
        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded;charset=UTF-8");

        xhr.onreadystatechange = function () {

            if (xhr.readyState == 4) {
                var info = getInfoObject( (xhr.status == 200),xhr.responseText);
                callback(info);
            }
            else{callback(getInfoObject( true ,""));}
        };
        xhr.send(null);
        /*
        try {
            xhr.send("seriesNumber=" + setting.seriesNumber);
        } catch (e) {
            l('err :' + e);
        }
       */

    }

}

function LogStorage()
{

    var convert = new Convert();

    function records() {

        var records = null;

        if (setting.DEBUG) {
            records = window.localStorage[setting.CONST_RECORD];
        } else {
            //修改成从本地文件获取
            records = vbm_client.getrecords(false);
        }
        if (records == "[]") {
            return [];
        } else {
            return convert.dataStringToObject(records);
        }
    }

    this.empty = function () {

        if (setting.DEBUG) {
            window.localStorage.removeItem(setting.CONST_RECORD);
        } else {
            vbm_client.vbm_reset(false);
        }

        //l('logStorage empty success');
    };

    this.add = function (record) {

        var exist = records();

        if (exist.length >= (setting.MAX_COUNT) ) {

            var lastRecord = convert.parse( exist[exist.length-1] );

            if (lastRecord.AgentId != null && lastRecord.AgentId == setting.AGENT_DROP) {

                lastRecord.Value_0 =  lastRecord.Value_0 * 1 + 1;
                exist[exist.length-1] = convert.objToString(lastRecord);

                //l('storage update ' + convert.objToString(lastRecord) + ' size:' + exist.length);

            } else {

                lastRecord = {
                        AgentId : setting.AGENT_DROP,
                        EventType : 0,
                        EventTimeStamp : new Date().getTime(),
                        Value_0 : 1
                };

                exist[exist.length-1] = convert.objToString(lastRecord);

                //l('storage add ' + convert.objToString(lastRecord) + ' size:' + exist.length);
            }

        } else {

            var str = convert.objToString(record);

            exist.push(str);

            //l('storage add ' + str + ' size:' + exist.length);
        }

        var strValue = exist.join(setting.NEW_LINE);

        //l('check byte ' + utf8ByteLength(strValue));

        if (setting.DEBUG) {
            window.localStorage[setting.CONST_RECORD] = strValue; //exist.join(setting.NEW_LINE);
        } else {
            try {
                //toi.informationService.setObject(setting.CONST_RECORD,strValue,toi.informationService.STORAGE_VOLATILE);
            vbm_client.vbm_update(strValue,false);
            } catch (e) {
                //l('set obj error:'+ e.message);
            }
        }

        this.check();
    };

    this.check = function () {

        var exist = records();
        if (exist.length >= setting.SUBMIT_COUNT) {
            this.fire(LogStorage.BackupCountEvent, exist);
        }

    };

    this.records = records;

};

LogStorage.prototype = new EventDispatcher();
LogStorage.BackupCountEvent = 'csn.event.backup.count';
LogStorage.BackupTimeEvent = 'csn.event.backup.time';

function l(msg)
{
    return;


    if (document.getElementById('cns-log-console')) {

        var str = document.getElementById('cns-log-console').innerHTML;

        if (str.length> 1000000) {
            str = msg;
        } else {
            str = str + '<br>' + msg;
        }

        document.getElementById('cns-log-console').innerHTML = str;
        document.getElementById('cns-log-console').scrollTop = document.getElementById('cns-log-console').scrollHeight ;

    } else {

        if (setting.DEBUG) {
            console.log(msg);
        } else {
            console.log(msg);
        }
    }
}

function UploadJob()
{
    //    	var isFetch=new fetchSignal();
    var JobStatus = {
        COMMON: 'common',
        RUNNING: 'running'
    };

    var currStatus = JobStatus.COMMON;

    var macAddressUtil = new MacAddressUtil();


    function changeStatus(value) {
        currStatus = value;
    }

    this.isBusy = function (value) {
        return currStatus == JobStatus.RUNNING;
    };

    function getTimeString () {

        var date = new Date();

        var h = date.getHours();
        var d = date.getDate();
        var m = date.getMonth() + 1;
        var mm = date.getMinutes();

        return date.getFullYear() + '' + (m <= 9 ? '0' + m : m) + '' + (d <= 9 ? '0' + d : d) + (h <= 9 ? '0' + h : h) + (mm <= 9 ? '0' + mm : mm) ;
    }

    this.isOnline = function () {
        return navigator.onLine;
    };

    function uploadFile(data) {

        macAddressUtil.getAddress(function(info) {
            console.trace();
            //console.log("macAddressUtil.getAddress info =="+JSON.stringify(info));
            uploadFileToServer(data,info);
        });
    }

    function uploadFileToServer(data,info) {

        //控制上传
        if(sysCom.config.vbmStatus == 0)return;
        if (data.before) {
            data.before();
        }

        // copy records to new array
        var clone = data.records.slice(0);

        clone.push( new Convert().objToString(info));


        var content = clone.join(setting.NEW_LINE);

        var xhr = new XMLHttpRequest();
        xhr.open("POST", setting.SERVER_API, true);
        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded;charset=UTF-8");

        //console.log("content == "+content);

        xhr.onreadystatechange = function () {

            if (xhr.readyState == 4) {

               /* l('success:' + (xhr.status == 200) + ' xhr.status:' + xhr.status + ' responseText:' + xhr.responseText +
                    " url:" + setting.SERVER_API);*/

                if (data.callback) {

                    try {
                        data.callback(xhr.status == 200,xhr.responseText);
                    } catch (err) {
                        l('err:'+err.message);
                    }

                } else {
                    l('not found callback');
                }
            }
        };

        var time = getTimeString();
        //console.log("seriesNumber =="+setting.seriesNumber);
        //console.log("SO =="+setting.SO);
        //console.log("time =="+time);
        //console.log("content =="+content);
        //console.log("encodeURIComponent(content) == "+encodeURIComponent(content));

        xhr.send("seriesNumber=" + setting.seriesNumber +
                 "&SO=" + setting.SO +
                 "&time=" +time +
                 "&content=" + encodeURIComponent(content));

    }

    this.execute = function (records,target) {

        l('job execute at ' + getTimeFormatString(new Date()) + ' records:' + records.length);

        uploadFile({
            records: records,
            before: function () {
                console.log("currStatus =="+currStatus);
                if (currStatus == JobStatus.COMMON) {
                    changeStatus(JobStatus.RUNNING);
                }
            },
            callback: function (success, response) {
                if (success) {
                    target.empty();
                }
                changeStatus(JobStatus.COMMON);
            }
        });
    };
}

function LogService() {

    var logStorage = new LogStorage();

    var job = new UploadJob();

    var schedule = null;

    var defaultSchedule = null;

    function getTime() {

        var t = Math.ceil(Math.random() * (setting.INIT_DELAY_TIME - 1) + 1);

        l('random :' + t);

        return t;
    }

    function getSeriesnumber() {

        if (setting.DEBUG) {
            return "123456789000004900";
        }

    /*	try {
            return toi.informationService.getObject("rawflashdata.stb.id");
        } catch (err) {
            l('get stb id error:' + err.message);
        }
        */
        return "012201306030000418";
    }

    function getBoxMac() {

    if (setting.DEBUG) {
            return "00-22-33-44-55-66";
        }
       /*
        try {
            return toi.informationService.getObject("rawflashdata.mac");
        } catch (err) {
            l('toi.novelService.getBoxMac() error:' + err.message);
        }
        */
        return null;

    }

    function getFirmwareVersion()
    {
        if (setting.DEBUG) {
            return "CH01.01";
        }
        /*
        var firmware_version = "null";
        if(typeof qin!="undefined")
        {
            firmware_version = qin.settings.get("sys:info:['swVer']");
        }
        else
        {
            var is = toi.informationService;

            try{
                console.log("hw version = "+is.getObject("rawflashdata.hw.ver"));
                if(is.getObject("rawflashdata.hw.ver") == "0x0371666f")
                {
                    firmware_version = getSoftRelVer_HMC3000();
                    console.log("firmware_version = "+firmware_version);
                }
            }
            catch(e)
            {
                console.log("this box is not HMC 3000!!!!");
            }

            try{
                console.log("hw version = "+is.getObject("const.hw.version"));
                if (is.getObject("const.hw.version") == "0x2371676f")
                {
                    firmware_version = getSoftRelVer_HMC4000();
                }
            }
            catch (e)
            {
                console.log("this box is not HMC 4000!!!!");
            }
        }
        return firmware_version;
        */
    }

    function getCardSn() {
        if (setting.DEBUG) {
            return "012345678";
        }
        /*try {
            return toi.novelService.getCardSn();
        } catch (err) {
            l('toi.novelService.getCardSn() error:' + err.message);
        }
        */
        return "674567465";
        return null;
    }

    function getSoftRelVer_HMC3000()
    {
        if (setting.DEBUG) {
            return "01.01";
        }
     /* var url = "file:///usr/applications/webapp/soft_release_ver";
      var content = null;
      var xmlreq = createXMLHttpRequest();
      if (null == xmlreq) {
        return null;
      }
      try{
          xmlreq.open("GET", url, false);
          //xmlreq.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
          xmlreq.send();
          content = xmlreq.responseText;
          content = content.replace("\n", "");
      }catch(e){
        console.log(e);
      }
      return content;*/
    }

    function getSoftRelVer_HMC4000()
    {
   /*   var url = "file:///usr/applications/webapp/app/soft_release_ver";
      var content = null;
      var xmlreq = createXMLHttpRequest();
      if (null == xmlreq) {
        return null;
      }
      try{
          xmlreq.open("GET", url, false);
          //xmlreq.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
          xmlreq.send();
          content = xmlreq.responseText;
          content = content.replace("\n", "");
      }catch(e){
        console.log(e);
      }
      return content;*/
    }

    function createXMLHttpRequest()
    {
      var xmlreq = null;
      try
      {
        xmlreq = new XMLHttpRequest();
      } catch (e)
      {
        console.log(e);
      }

      if (null == xmlreq)
      {
        console.log("system info createXMLHttpRequest failed");
      }

      return xmlreq;
    }

    function getSystemUnit()
    {
        if (setting.DEBUG)
        {
            return "20";
        }

    /*	try {

            setting.ZIPCODE = toi.informationService.getObject("cfg.custom.sms.zipcode");

            if (setting.ZIPCODE.length == 5) {
                return setting.ZIPCODE.substring(0,2);
            } else {
                return setting.ZIPCODE.substring(0,1);
            }
        } catch (err) {
            l('get zipcode error:' + err.message);
        }
        */
        return "05";
    }

    function cancelDefaultSchedule()
    {

        if (defaultSchedule != null)
        {
            clearTimeout(defaultSchedule);
            defaultSchedule = null;
        }
    }

    function startDefaultSchedule()
    {

        defaultSchedule = setTimeout(function() {
            //l('default schedule execute (' + defaultSchedule + ') ' + getTimeFormatString(new Date()));
            logStorage.fire(LogStorage.BackupTimeEvent,logStorage.records());
        } , setting.TIME_BACKUP * 1000/100);
        if(isFirst){
            logStorage.fire(LogStorage.BackupTimeEvent,logStorage.records());
            isFirst = false;
        }

        //l('start default schedule ' + defaultSchedule + ' after ' + setting.TIME_BACKUP + ' second');
    }

    function startSchedule(time,callback) {

        if (schedule != null) {
            clearTimeout(schedule);
            schedule = null;
        }

        schedule = setTimeout(function() {

            //l('');
            //l('schedule execute (' + schedule + ') ' + getTimeFormatString(new Date()));

            cancelDefaultSchedule();

            //l('********* start ********* ');
            callback();
            //l('********* end ********* ');
            //l('');

            startDefaultSchedule();

        } , time * 1000/1000);

        l('new schedule ' + schedule + ' after ' + time + ' second');
    }

    function doJob(event,data) {

        //l('[ ' + event + ' ] , do job');

        startSchedule(0 , function() {

            if (job.isBusy()) {
               // l('job is busy, skip');
            } else if (data.data.length == 0) {
                l('records is empty, skip');
            } else {
                try {
                    job.execute(data.data, data.target);
                    //l('job execute success');
                } catch (err) {
                    //l('job execute fail <font color="red">' + err.message + '</font>, retry after ' + setting.RETRY_TIME + ' min');
                    startSchedule(setting.RETRY_TIME * 60 , function() {
                        //l('retry .. ' + getTimeFormatString(new Date()));
                        logStorage.check();
                    });
                }
            }

        });
    }

    this.init = function () {

        setting.seriesNumber = getSeriesnumber();

        setting.BOX_MAC = getBoxMac();
        setting.cardSn = getCardSn();
        //console.log("vbm check card number = "+setting.cardSn);
        setting.SO = getSystemUnit();
        //http://so05.totalbb.net.tw/WishSCM/GetHfcMacByRemoteAddr.aspx
        //http://so05.totalbb.net.tw/scm/GetHfcMacByRemoteAddr.php
        //setting.MAC_ADDRESS_API = 'http://so' + setting.SO + '.totalbb.net.tw/scm/GetHfcMacByRemoteAddr.php';
       setting.MAC_ADDRESS_API = 'http://10.81.0.220/scm/GetHfcMacByRemoteAddr.php';

        setting.firmware_version = getFirmwareVersion();
/*
        try {

            // able to reset UPLOAD_API if VBM-Client's version is changed.
            if (toi.informationService.isObjectDefined(setting.VERSION_OBJECT) == false) {
              toi.informationService.unsetObject(setting.CONST_UPLOAD, toi.informationService.STORAGE_PERMANENT);
              toi.informationService.setObject(setting.VERSION_OBJECT, setting.VERSION, toi.informationService.STORAGE_PERMANENT);
            } else {
              var version = toi.informationService.getObject(setting.VERSION_OBJECT);
              if (version !== setting.VERSION) {
                toi.informationService.unsetObject(setting.CONST_UPLOAD, toi.informationService.STORAGE_PERMANENT);
                toi.informationService.setObject(setting.VERSION_OBJECT, setting.VERSION, toi.informationService.STORAGE_PERMANENT);
              }
            }

            if (toi.informationService.isObjectDefined(setting.CONST_UPLOAD) == false) {
                // 若information service 無定義則存入預設值
                toi.informationService.setObject(setting.CONST_UPLOAD, setting.DEFAULT_UPLOAD_API, toi.informationService.STORAGE_PERMANENT);
                setting.SERVER_API = setting.DEFAULT_UPLOAD_API;
                l('save setting.SERVER_API :' + setting.SERVER_API);
            } else {
                setting.SERVER_API = toi.informationService.getObject(setting.CONST_UPLOAD);
                l('load exist setting.SERVER_API :' + setting.SERVER_API);
            }

        } catch (err) {
            l('err:'+err.message);
        }
        */
        setting.SERVER_API = setting.DEFAULT_UPLOAD_API;
        // show setting
       /* for (var name in setting) {
            l('setting.' + name + ':' + setting[name]);
        }
        l('');*/

        logStorage.addEventListener(LogStorage.BackupCountEvent, function (data) {
            doJob(LogStorage.BackupCountEvent,data);
        });

        logStorage.addEventListener(LogStorage.BackupTimeEvent, function (data) {
            doJob(LogStorage.BackupTimeEvent,data);
        });

        var delayTime = getTime() + (3 * 60 * 60);
        //l('log service init at ' + getTimeFormatString(new Date()) + ' and delay second is ' + delayTime);

        startSchedule(delayTime,function() {
            //l('system init check storage');
            logStorage.check();
        });
    };

    this.push = function (record) {
        logStorage.add(record);
    };

    this.empty = function() {
        logStorage.empty();
        //toi.informationService.unsetObject(setting.CONST_UPLOAD,toi.informationService.STORAGE_PERMANENT);
    };

    this.version = function() {
        return setting.VERSION;
    };


};
  //  window.cns = {};
    top.window.cns.logService = new LogService();
    console.log("window.cns.logService="+top.window.cns);
    console.log("logService init, version=" + top.window.cns.logService.version());
})();


function vbm_onload()
{
    /*
    var caPlugin = document.createElement("embed"); //embed the plugin
    caPlugin.id = "embed";
    caPlugin.type = "application/x-motorola-novel";
    caPlugin.setAttribute("hidden", "true");
    document.body.appendChild(caPlugin);
    try {
      IdentifyBrowser();
      EmbedToi();
    }
    catch (e) {
      console.log("err: " +e);
    }
    */
    try {
        top.window.cns.logService.init();
        console.log("vbm_onload cns.logService.version="+top.window.cns.logService.version());
      //console.log("logService init, version=" + cns.logService.version());
    }
    catch (e) {
      //console.log("logService init exception: " + e);
    }
}

function vbm_onunload()
{
    //cns.logService = null;
    //cns = null;
}


// JavaScript Document

var VbmCall = {
	"path": "http://127.0.0.1:18031/rpc",
    "id":1,
    "callSync":function (method,params){
        
        try {
            var obj={"jsonrpc":"2.0","id":VbmCall.id,"method":method};

            if(params != null){
                obj.params = params;
            }

            var text = JSON.stringify(obj);
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("POST",VbmCall.path, false);
            xmlhttp.send(text);
            var ret = JSON.parse(xmlhttp.responseText);
            return ret?ret.result:null;
        }catch(e){
            console.log("error callSync EXP:" + e.name + ": " + e.message);
            return null;
        }
    },

    "callAsync":function(method,params,cb) {

        var obj={"jsonrpc":"2.0","id":VbmCall.id,"method":method};

        if(params != null){
            obj.params = params;
        }
        var text = JSON.stringify(obj);

        var xmlhttp = new XMLHttpRequest();

        xmlhttp.open("POST", VbmCall.path, true);
        xmlhttp.send(text);

        xmlhttp.onreadystatechange = function () {
            if ((xmlhttp.readyState == 4 && xmlhttp.status == 200) || xmlhttp.status == 404) {
                if(typeof (cb) == "function") {
                    if(xmlhttp.status == 200){
                        var ret = JSON.parse(xmlhttp.responseText);
                        if(ret) {
                            cb(ret.result);
                        }else{
                            cb(null);
                        }
                    }else {
                        cb(null);
                    }
                }
            }
        };
    },

    "callRemote":function(method,params,cb)
	{
		if(sysCom.config.vbmStatus == 0)
		{
            return;
		}
        if(cb === false)
        {
            return VbmCall.callSync(method,params);
        }else{
            VbmCall.callAsync(method,params,cb);
        }
    }
};

var vbmRemote = {
    "zappingRecord":function(params,cb){
        return VbmCall.callRemote("zappingRecord",params,cb);
    },
    "bootRecord":function(params,cb){
        return VbmCall.callRemote("bootRecord",params,cb);
    },
    "statusRecord":function(params,cb){
        return VbmCall.callRemote("statusRecord",params,cb);
    },
    "errorRecord":function(params,cb){
        return VbmCall.callRemote("errorRecord",params,cb);
    },
    "appRecord":function(params,cb){
        return VbmCall.callRemote("appRecord",params,cb);
    },
    "pvrRecord":function(params,cb){
        return VbmCall.callRemote("pvrRecord",params,cb);
    },
    "timeshiftRecord":function(params,cb){
        return VbmCall.callRemote("timeshiftRecord",params,cb);
    },
    "pvrOperateEpgRecord":function(params,cb){
        return VbmCall.callRemote("pvrOperateEpgRecord",params,cb);
    },
    "pvrOperateBytimeRecord":function(params,cb){
        return VbmCall.callRemote("pvrOperateBytimeRecord",params,cb);
    },
    "pvrOperateRecordingRecord":function(params,cb){
        return VbmCall.callRemote("pvrOperateRecordingRecord",params,cb);
    },
    "pvrOperateRecordListRecord":function(params,cb){
        return VbmCall.callRemote("pvrOperateRecordListRecord",params,cb);
    },
    "pvrOperateStatusRecord":function(params,cb){
        return VbmCall.callRemote("pvrOperateStatusRecord",params,cb);
    },
    "stbinformationRecord":function(params,cb){
        return VbmCall.callRemote("stbinformationRecord",params,cb);
    },
    "dropcountRecord":function(params,cb){
        return VbmCall.callRemote("dropcountRecord",params,cb);
    },
    "smcerrorRecord":function(params,cb){
        return VbmCall.callRemote("smcerrorRecord",params,cb);
    },
    "vbm_getrecords":function(params,cb){
        return VbmCall.callRemote("vbm_getrecords",params,cb);
    },
    "vbm_reset":function(params,cb){
        return VbmCall.callRemote("vbm_reset",params,cb);
    },
    "vbm_update":function(params,cb){
        return VbmCall.callRemote("vbm_update",params,cb);
    },
    "rpc_device_ctrl":function(params,cb){
        return VbmCall.callRemote("rpc_device_ctrl",params,cb);
    }
};

function VBMCommon()
{
	var self = this;

	this.config = {
		zappingRecord:{
            enterTime:""
		}
	};

	this.init = function(){

        vbm_onload();

		if(sysCom.isPowerBoot)
		{
            self.config = {
                zappingRecord:{
                    enterTime:(new Date()).getTime()
                }
            };

            utility.setH5Storage("VBM_MEM_CONFIG",self.config);
		}
		else
		{
			self.config = utility.getH5Storage("VBM_MEM_CONFIG");
		}
	};

	this.zappingRecord = function(p){
		//相同节目,表示开机或者应用跳转
		if(p.currentServiceId == p.lastServiceId)
		{
			return;
		}
		var params = {
            StbId:'012201306030000418',
            AgentId:''+3,
            EventType:''+0,
            EventTimeStamp:''+self.config.zappingRecord.enterTime,
            Value_0:''+self.config.zappingRecord.enterTime,
            Value_1:''+(new Date()).getTime(),
            Value_2:''+p.currentServiceId,
            Value_3:''+p.lastServiceId,
            Value_4:''+p.way,
            Value_5:''+"No",
            Value_6:''+"Yes",
            Value_7:'',
            Value_8_9:''
		};
		//fav
		var ch = dtvCom.getChannelByServiceId(p.currentServiceId);
		if(ch)
		{
			var ret = dtvCom.checkChannelFav(ch);
            params.Value_5 = "" + (ret ? "Yes" : "No");
		}
        //auth
        params.Value_6 = p.auth ? p.auth : "Yes";

        //stayTime
        params.Value_7 = ""+(params.Value_1 - params.Value_0);
        self.config.zappingRecord.enterTime = params.Value_1;
        utility.setH5Storage("VBM_MEM_CONFIG",self.config);
        console.log("zappingRecord:"+JSON.stringify(params));
        //vbmRemote.zappingRecord(params,false);
	};

    this.bootRecord = function(p){
        var params = {
            StbId:'012201306030000418',
            AgentId :'' + 1,
            EventType :'' + 0,
            EventTimeStamp : '',
            Value_0 :'' + p.status,
            Value_1 :'' + p.lastTime,
            Value_2_9 : ''
        };
        vbmRemote.bootRecord(params,false);
    };

    this.statusRecord = function(p){
        var params = {
            StbId:'012201306030000418',
            AgentId :'' + 2,
            EventType :'' + 0,
            EventTimeStamp : '',
            Value_0 :'' + p.diskSerialNum,
            Value_1 :'' + p.diskSize,
            Value_2 :'' + p.diskUsed,
            Value_3 :'' + p.SOId,
            Value_4 :'' + p.ip,
            Value_5 :'' + p.resolution,
            Value_6 :'' + p.audioType,
            Value_7 :'' + p.audioTrack,
            Value_8 :'' + p.bootTime,
            Value_9 :'' + p.BouquetID
        };
        vbmRemote.statusRecord(params,false);
    };

    this.errorRecord = function(p){
        var params = {
            StbId:'012201306030000418',
            AgentId :'' + 4,
            EventType :'' + 0,
            EventTimeStamp : '',
            Value_0 :'' + p.owner,
            Value_1 :'' + p.serviceId,
            Value_2 :'' + p.code,
            Value_3 :'' + p.descript,
            Value_4 :'' + p.tunerStatus,
            Value_5_9 :''
        };
        vbmRemote.errorRecord(params,false);
    };

    this.appRecord = function(p){
        var params = {
            StbId:'012201306030000418',
            AgentId :'' + 5,
            EventType :'' + 0,
            EventTimeStamp : '',
            Value_0 :'' + p.appName,
            Value_1 :'' + p.enterFrom,
            Value_2 :'' + p.serviceUrl,
            Value_3 :'' + p.stayTime,
            Value_4_9 :''
        };
        vbmRemote.appRecord(params,false);
    };
}
var vbmCom = new VBMCommon();
console.log("vbmCom init");
if(sysCom.vbmStatus == 1) {
    setTimeout(vbmCom.init, 500);
}
console.log("changhong.js end :"+(new Date()).getTime());function Arealimit()
{
    var self = this;
    this.flag = false;
    this.timer = null;
    this.start = function()
    {
        console.log("Arealimit start..............");
        window.setTimeout(self.checkArealimit,4000);
        self.timer = window.setInterval(self.checkArealimit,10000);
    };
    this.getArealimitStatus= function()
    {
      return self.flag;

    };
    this.checkArealimit=function()
    {
        var myDate = new Date();
        var nowtime  = myDate.getTime();
        var networkname = sysCom.config.NetworkName;

        if(1514736000 > sysCom.config.boottime && nowtime > 1514736000)//获取第一次收到TDT正确时间
        {
            sysCom.config.boottime = nowtime;
            sysCom.saveConfig();
        }



        console.log("nowtime="+nowtime);
        console.log("boottime="+sysCom.config.boottime );
        console.log("networkname="+networkname );





        var nostandby = sysCom.getMemConfig("nostandby");
        if(nostandby == 0) {
            console.log("checkArealimit standby return");
            self.deacvive();
            return;
        }

        if( sysCom.config.gongchengmenu == 1)
        {
            console.log("checkArealimit gongchengmenu return");
            self.deacvive();
            return;
        }


        //检查tvfeee
        if(sysCom.config.LockStb == 1)
        {
            console.log("acvivetvfee return");
            self.acvivetvfee();
            return;
        }
        else
        {
            self.deacvive();
        }
        ///////////////

        if( !networkname || networkname == "")
        {
            console.log("checkArealimit networkname return");
            self.deacvive();
            return;
        }


        if(sysCom.config.AreaLimit == 0)
        {
            console.log("checkArealimit AreaLimit=0 return");
            self.deacvive();
            return;
        }

        if(sysCom.config.FTI == 1 )
        {
            console.log("checkArealimit FTI return");
            self.deacvive();
            return;
        }




        if(!caCom || !caCom.caParams || !caCom.caParams.so)
        {
            console.log("checkArealimit zipCode return");
            self.deacvive();
            return;
        }
        var soid = ""+caCom.caParams.so ;
        console.log("soid="+soid);
        if( nowtime - sysCom.config.boottime >300000)
        {

            console.log("netwokename="+networkname);
            var soarr = networkname.split(",");
            for (i=0;i<soarr.length ;i++ )
            {
                var tmp = soarr[i].replace(/@/g,'');
                console.log(i+"soarr ="+tmp);

                if(tmp == soid)
                {
                    console.log("have so = "+soid);
                    self.deacvive();
                    return;
                }
            }
            console.log("checkArealimit acvive=");
            self.acvive();

        }
    };


    this.acvivetvfee = function () {
        //判断div是否已经存在
        if (self.flag)
        {
            return;
        }
        else {
            appCom.goAppByName("tvportal",false);
            //添加arealimit
            var v = window.top.document.createElement("div");
            v.id = "arealimit";
            window.top.document.body.appendChild(v);
            this.flag = true;

            //设置css
            setStyle(window.top.document.getElementById("arealimit"),{
                backgroundSize: '640px 360px', width: '640px', height: '360px', top: '180px', right: '320px',
                display: 'block', position: 'absolute', zIndex: '4', overflow: 'hidden'
            });

            //设置图片
            setStyle(window.top.document.getElementById("arealimit"),{backgroundImage: 'url(' + "file:///application/cview/cview_app_common_pic/tvfee.jpg" + ')'});

        }
    };

    this.acvive = function () {
        //判断div是否已经存在
        if (self.flag)
        {
           return;
        }
        else {
            appCom.goAppByName("tvportal",false);
            //添加arealimit
            var v = window.top.document.createElement("div");
            v.id = "arealimit";
            window.top.document.body.appendChild(v);
            this.flag = true;

            //设置css
            setStyle(window.top.document.getElementById("arealimit"),{
                backgroundSize: '640px 360px', width: '640px', height: '360px', top: '180px', right: '320px',
                display: 'block', position: 'absolute', zIndex: '4', overflow: 'hidden'
            });

            //设置图片
            setStyle(window.top.document.getElementById("arealimit"),{backgroundImage: 'url(' + "file:///application/cview/cview_app_common_pic/arealimit.jpg" + ')'});

        }
    };




    this.deacvive = function () {
        if (self.flag)
        {
            var n = window.top.document.getElementById("arealimit");
            n.parentNode.removeChild(n);
            self.flag = false;
        }
    };

    return this;
};
var arealimit = new Arealimit();
console.log("arealimit init");
setTimeout(arealimit.start,1000);function Debuginfo()
{

    var self = this;
    this.flag = false;
    this.timer = null;
    this.start = function()
    {
        console.log("Debuginfo start..............");
        self.timer = window.setInterval(self.checkDebug,4000);
    };
    this.checkDebug=function() {

        //console.log("checkDebug sysCom.config.isDebug="+sysCom.config.isDebug);
        if(sysCom.config.isDebug == 1)
        {
            self.show();
        }
        else
        {
            self.hide();
        }

    };
    this.show = function () {
        //判断div是否已经存在
        if (self.flag == false)
        {
            var v = window.top.document.createElement("chdebug");
            v.id = "chdebug";
            window.top.document.body.appendChild(v);
            this.flag = true;
        }


        //设置css
        setStyle(window.top.document.getElementById("chdebug"),{
            backgroundSize: '200px 100px', width: '160px', height: '80px', top: '100px', right: '100px',
            display: 'block', position: 'absolute', zIndex: '4', overflow: 'hidden',backgroundColor :'#666',
            color: 'white'
        });

        var info_ret= utility.getSystemInfo(false);
   if(info_ret) {
       var txt= " \n"+"    "+"CPU:  "+info_ret.cpu+"%\n";
       txt=txt+"    "+"MEM:  "+info_ret.memTotal+" KB \n";
       txt=txt+"    "+"FREE: "+info_ret.memFree+" KB \n";
       window.top.document.getElementById("chdebug").innerText = txt;
   }


    };

    this.hide = function () {
        if (self.flag) {
            var n = window.top.document.getElementById("chdebug");
            n.parentNode.removeChild(n);
            self.flag = false;
        }
    };
    return this;
};
var debuginfo = new Debuginfo();
console.log("Debuginfo init");
setTimeout(debuginfo.start,1000);