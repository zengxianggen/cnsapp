
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





