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
