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
        "series_key": "藍色水玲瓏第3季"
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
	* desc:  添加之前要判断冲突以及检查是否过期
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
                    //提示用户
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
                    //删除预约
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
	* desc:检查预约节目是否过期
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
	* desc:检查预约节目是否要提醒
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
	* desc: 目前只判断起始时间是否冲突(分钟级别)
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
	* desc: 检查节目是否是预约节目
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

    //2017/06/01 19:00:00  转换为date
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
