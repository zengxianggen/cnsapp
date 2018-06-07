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