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
window.setTimeout(eventCom.start,2500);