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
console.log("changhong.js end :"+(new Date()).getTime());