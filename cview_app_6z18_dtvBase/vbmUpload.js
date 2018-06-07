
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


