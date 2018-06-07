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

