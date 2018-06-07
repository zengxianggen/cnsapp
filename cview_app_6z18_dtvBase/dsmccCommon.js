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

