
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


	


