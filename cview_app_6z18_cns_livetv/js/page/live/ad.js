/*
        var p = {
            url:            //广告文件文件夹路径
            block: "epg",   //广告窗口位置:"portal","epg","miniepg"
            win: self.win,  //父窗口
            adWin:adWin     //广告子窗口
            dat:            //xml字符串
        }
        var ad = new AD(p);
        ad.start();
        ad.close();
        ad.onkey(e);


        //this.openBig函数，广告链接为"webpage"时的跳转未完成
*/

function AD(p)
{
    var self = this;
    var params = p;
    self.adParams = null;
    self.blockNum = null;
    self.imgNum = null;
    self.intervalID = null;
    self.focusWin = null;
    self.bigADWin = null;
    self.status = false;

    console.log("AD constructed.");

    //解析xml文件
    this.parseDat = function ()
    {
        var xmlDoc = $.parseXML(params.dat);
        xmlDoc.async = false; //同步,防止后面程序处理时遇到文件还没加载完成出现的错误

        self.adParams = [];
        $(xmlDoc).find("block").each(function ()
        {
            var block = {
                name: $(this).attr("name"),
                type: $(this).find("playMode").attr("type"),
                duration: $(this).find("playMode").attr("value"),
                assetsImg: [],
                action: [],
            }

            $(this).find("asset").each(function ()
            {
                block.assetsImg.push(params.url + $(this).attr("value"));
                var arr = {
                    type1: $(this).attr("type"),
                    type2: $(this).find("action").attr("type"),
                    code: $(this).find("action").attr("code"),
                    value2: $(this).find("action").attr("value"),
                }
                block.action.push(arr);
            });

            if (block.name == "miniepg") {
                delete block.action;
            }

            self.adParams.push(block);
        });
        console.log(self.adParams);
    }

    //加载广告图片
    this.loadImages = function (sources, callback)
    {
        var count = 0,
            i = sources.length,
            images = [sources.length];

        for (var s = 0; s < sources.length; s++) {
            images[s] = new Image();
            count++;
            if (count >= i) {
                images[s].onload = function ()
                {
                    callback(images);
                }
            }
            images[s].src = sources[s];
        }
        console.log("adImg loading ok.");
    }

    //显示广告
    this.show = function ()
    {
        for (var i = 0; i < self.adParams.length; i++) {
            if (self.adParams[i].name == params.block) {
                console.log("AD show.");
                self.blockNum = i;
                var duration = self.adParams[self.blockNum].duration;
                self.loadImages(self.adParams[self.blockNum].assetsImg, function (images)
                {
                    if (self.adParams[self.blockNum].type == "interval") {
                        self.imgNum = 0;
                        params.adWin.setSrc(images[self.imgNum]);
                        params.win.update();
                        self.intervalID = setInterval(function ()
                        {
                            self.imgNum++;
                            if (self.imgNum > images.length) {
                                self.imgNum = 0;
                            }
                            params.adWin.setSrc(images[self.imgNum]);
                            params.win.update();
                        }, duration * 1000);
                    }
                    else if (self.adParams[self.blockNum].type == "random") {
                        var random = new Array();
                        for (var x = 0; x < images.length; x++) {
                            random.push(x);
                        }

                        var ran = function (arr)
                        {
                            var temp = new Array();
                            var count = arr.length;
                            for (i = 0; i < count; i++) {
                                var num = Math.floor(Math.random() * arr.length);
                                temp.push(arr[num]);
                                arr.splice(num, 1);
                            }
                            return temp;
                        }
                        random = ran(random);    //生成随机数组

                        var z = 0;
                        self.imgNum = random[z];
                        params.adWin.setSrc(images[self.imgNum]);
                        params.win.update();
                        self.intervalID = setInterval(function ()
                        {
                            z++;
                            if (z > images.length) {
                                z = 0;
                            }
                            self.imgNum = random[z];
                            params.adWin.setSrc(images[self.imgNum]);
                            params.win.update();
                        }, duration * 1000);
                    }
                });
            }
        }
        console.log("AD showed.");
    }

//打开大广告界面
    this.openBig = function ()
    {
        console.log("big AD start.");
        if (self.adParams[self.blockNum].action[self.imgNum].type2 == "image") {
            console.log("big AD image.");
            var bigAD = [
                {
                    uiType: UIImg,
                    id: "bigAd",
                    ol: 0,
                    ot: 0,
                    w: 1280,
                    h: 720,
                    focusRectLineWidth: 0
                },
            ];

            var bigImg = new Image();
            bigImg.src = params.url + self.adParams[self.blockNum].action[self.imgNum].value2;
            bigImg.onload = function ()
            {
                self.bigADWin = UI.createGroup(bigAD, "bigAd", params.win);
                self.bigADWin.setSrc(bigImg);
                params.win.update();
                self.bigADWin.setFocus(true);
                self.bigADWin.proc = function (e)
                {
                    var ret = true;
                    if (e.keyCode == UI.KEY.BACKSPACE) {
                        self.closeBig();
                    }
                    return ret;
                }
            }
        }
        else if (self.adParams[self.blockNum].action[self.imgNum].type2 == "webpage") {
            console.log("big AD webpage.");
            var webUrl = self.adParams[self.blockNum].action[self.imgNum].value2;          //网页地址
            //网页跳转待完成
            //window.location.href = webUrl;
        }
        else if (self.adParams[self.blockNum].action[self.imgNum].type2 == "app") {
            console.log("big AD app.");
            var appName = self.adParams[self.blockNum].action[self.imgNum].value2;          //app名称
            //console.log("APP Name:"+appName);
            appCom.goAppByName(appName,false);
            //console.log("appInfo:"+JSON.stringify(ret));
        }
    };

//关闭大广告界面
    this.closeBig = function ()
    {
        self.bigADWin.destroy();
        if (self.focusWin) {
            self.focusWin.setFocus(true);
            self.focusWin = null;
        }
        params.win.update();
        console.log("big AD close.");
    }

    this.start = function ()
    {
        if (params.dat != "" && params.url && params.block && params.win && params.adWin) {
            if (params.url.length > 0 && params.url.charAt(params.url.length - 1) == "/") {
                console.log("AD start.");
                self.parseDat();
                self.show();
                self.status = true;
            }
        }
        else {
            self.status = false;
            return;
        }
    };

    this.close = function ()
    {
        clearInterval(self.intervalID);
        console.log("AD close.");
    };

    this.onkey = function (e)
    {
        var ret = false;
        var adCode = null;
        console.log("In AD keyCode:" + e.keyCode);
        if( !self.status){
            return;
        }
        //判断特殊键值
        switch (self.adParams[self.blockNum].action[self.imgNum].code) {
            case "red":
                adCode = UI.KEY.FUNRED;
                break;
            case "green":
                adCode = UI.KEY.FUNGREEN;
                break;
            case "yellow":
                adCode = UI.KEY.FUNYELLOW;
                break;
            case "blue":
                adCode = UI.KEY.FUNBLUE;
                break;
        }

        self.focusWin = params.win.getFocusWin();

        if (e.keyCode == adCode) {      //特殊键
            self.openBig();
            ret = true;
        }
        else if (e.keyCode == 13 && self.focusWin == params.adWin) {     //ok键
            self.openBig();
            ret = true;
        }
        return ret;
    }
}