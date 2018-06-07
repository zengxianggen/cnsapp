/*传入参数
p = {
    ch: getCh(),    //频道获取函数
    areaId: 节点,
    url: logo图片文件地址,
    dat: 信息字符串,
};
启动函数start()，停止函数stop()
调用方法：  this.ticker = new Ticker(p);
            this.ticker.init();
            this.ticker.exit();
*/

function Ticker(p)
{
    var self = this;
    var params = p;

    self.chList = null;
    self.texts = new Array();
    self.showList = new Array();
    self.showID = null;
    self.tickerNum = null;
    self.tickerW = 0;
    self.tickerH = null;

    // constructor
    console.log("Ticker constructed.");
    // Constructed end
    self.flag = true;
    var str = new Array();

    /*解析数据，检验数据是否有误*/
    this.parseText = function ()
    {
        if (params.ch && params.areaId && params.dat && params.url) {
            str = params.dat.split("\r\n");
            if (str[0] && str[1] && str[2]) {
                self.chList = str[0];
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }

        for (var a = 1; a < str.length - 1; a += 2) {
            if (str[a] == "" || str[a + 1] == "") {
                continue;
            }

            var textStyle = null;
            var set = str[a].split(" ");
            var t = set[0].split("/");
            var startAndEnd = t[0];
            var tt = startAndEnd.split("-");
            var c = set[1].split("#");

            if (set.length != 10) {
                continue;
            }

            if (isNaN(tt[0]) || isNaN(tt[1]) || isNaN(t[1])) {      //时间参数是否为合法数字
                continue;
            }
            else if (tt[0] >= tt[1]) {
                continue;
            }

            var b = 2;
            if (b < 7) {
                b++;
                if (isNaN(set[b])) {
                    continue;
                }
            }

            if (set [7] != "000" && params.areaId != set [7]) {
                continue;
            }

            var transTime = function (t)
            {
                var h;
                var m;
                m = t % 100;
                h = (t - m) / 100;
                t = m + h * 60;
                return t;
            }

            var st = parseInt(tt[0], 10);
            var et = parseInt(tt[1], 10);
            st = transTime(st);
            et = transTime(et);

            textStyle = {
                startTime: st,
                endTime: et,
                intervalTime: t[1]/12,
                fontColor: "#" + c[1],
                myShadowColor: "#" + c[2],
                fontSize: set[2],
                runTimes: set [3],
                speedCode: set [4],
                myLocation: set [5],
                sectionNum: set [6],
                areaCode: set [7],
                channelCode: set[8],
                logoCode: set [9],
                txt: str[a + 1],
                timeCode: -1
            };
            if (set[9].indexOf("na") == -1) {
                var coord = set[9].split(",");
                if (!isNaN(coord[1]) && !isNaN(coord[2])) {
                    textStyle.logoCode = coord[0];
                    textStyle.logoX = coord[1];
                    textStyle.logoY = coord[2];
                }
                else {
                    continue;
                }
            }
            self.texts.push(textStyle);
        }

    }

    /*检验当前频道是否显示*/
    this.checkChannel = function ()
    {
        console.log("check ch");
        var nowCh = params.ch();
        console.log(nowCh);
        for (var i = 0; i < self.showList.length; i++) {
            if (self.texts[self.showList[i]].channelCode == "*") {
                if (self.chList.indexOf(nowCh) == -1) {
                    self.showList.splice(i, 1);
                    i--;
                }
            }
            else if (self.texts[self.showList[i]].channelCode.indexOf('^') != -1) {
                if (self.chList.indexOf(nowCh) == -1 || self.texts[self.showList[i]].channelCode.indexOf(nowCh) != -1) {
                    self.showList.splice(i, 1);
                    i--;
                }
            }
            else if (self.texts[self.showList[i]].channelCode.indexOf(nowCh) == -1) {
                self.showList.splice(i, 1);
                i--;
            }
        }
        console.log(self.showList);
        self.checkShowID();
    }

    /*检验当前时间是否显示*/
    this.checkTime = function ()
    {
        console.log("Ticker check");
        var date = new Date(),
            hh = date.getHours(),
            mm = date.getMinutes(),
            nowTime = hh * 60 + mm,
            it = null;
        for (var i = 0; i < self.texts.length; i++) {
            it = self.texts[i].intervalTime;
            if (self.texts[i].startTime <= nowTime && nowTime <= self.texts[i].endTime) {
                self.texts[i].timeCode = (nowTime - self.texts[i].startTime) % it;
            }
            else {
                self.texts[i].timeCode = -1;
            }

            if (self.texts[i].timeCode == 0) {
                self.showList.push(i);
                self.texts[i].timeCode = -1;
            }
        }

        if (self.showList.length <= 0) {
            return;
        }
        console.log(self.showList);
        self.checkChannel();
    };

    this.checkShowID = function ()
    {
        if (!self.showID && self.showList.length > 0) {
            console.log(self.showID);
            self.showTicker();
        }
        else {
            return;
        }
    }

    /*创建并显示跑马灯*/
    this.showTicker = function ()
    {
        self.tickerNum = self.showList[0];
        var s = self.texts[self.tickerNum].speedCode;
        if (s == 1 || s == 2 || s == 3 || s == 4 || s == 5) {
            self.speed = s * 25;
        }
        else if (s == 0) {
            self.showID = false;
            return;
        }
        else {
            self.showID = false;
            console.log("The speedNum is wrong");
            return false;
        }

        console.log("ticker show");
        self.showID = true;
        var html = '<div id="tickerBox">';
        html += '<div id="ticker"></div>';
        html += '</div>';
        $("body").append(html);

        $("#tickerBox").css({
            width: '1230px', height: '690px', position: 'absolute', overflow: 'hidden', zIndex: '10',
            top: '15px', left: '25px', display: 'block', 'white-space': 'nowrap'
        });
        $("#ticker").css(
            {
                 'font-size': self.texts[self.tickerNum].fontSize + 'px',
                color: self.texts[self.tickerNum].fontColor, position: 'relative'
            });

        if (self.texts[self.tickerNum].logoCode.indexOf("na") == -1) {
            var img = '<img id="logo" src="">';
            $("#tickerBox").append(img);
            $("#logo").attr('src', params.url + self.texts[self.tickerNum].logoCode);
            $("#logo").css({
                position: 'absolute',
                left: self.texts[self.tickerNum].logoX,
                top: self.texts[self.tickerNum].logoY
            })
        }

        //判断是否分段
        if (self.texts[self.tickerNum].sectionNum == 0 && self.texts[self.tickerNum].txt) {
            var span = '<span id="txt0"></span>';
            $("#ticker").append(span);
            $("#txt0").text(self.texts[self.tickerNum].txt);
        }
        else if (self.texts[self.tickerNum].sectionNum > 0) {
            var m = self.texts[self.tickerNum].txt.split("[/]");
            if (m.length - 1 == self.texts[self.tickerNum].sectionNum) {
                var span = "";
                for (var i = 0; i < self.texts[self.tickerNum].sectionNum; i++) {
                    var m1 = m[i].split("]");
                    var m2 = m1[0].split("[");

                    span = '<span id=txt' + i + '></span>';

                    $("#ticker").append(span);
                    $("#txt" + i).text(m1[1]);
                    $("#txt" + i).css({'color': m2[1]});
                }
            }
            else {
                console.log("the sectionNum is wrong!")
                self.showID = false;
                return false;
            }
        }

        $("span").css({'text-shadow': '0px 0px 4px' + self.texts[self.tickerNum].myShadowColor});

        self.runNum=self.texts[self.tickerNum].runTimes;

        switch (self.texts[self.tickerNum].myLocation) {
            case "1":
                console.log("ticker at 1");
                self.leftToRight();
                break;
            case "2":
                console.log("ticker at 2");
                self.rightToLeft();
                break;
            case "3":
                console.log("ticker at 3");
                self.bottomToTopAtLeft();
                break;
            case "4":
                console.log("ticker at 4");
                self.bottomToTopAtRight();
                break;
            default:
                return false;
        }
        console.log("Ticker show");
    };

    this.leftToRight = function ()
    {
        self.tickerW = 0;
        for (var i = 0; i < self.texts[self.tickerNum].sectionNum; i++) {
            self.tickerW += $("#txt" + i).width();
        }

        var duration = (self.tickerW + 1280) / self.speed * 1000;

        if (self.runNum > 0) {
            $("#ticker").css({top: '0',"left": -self.tickerW+'px'});
            $("#ticker").animate({'left': '1280px'}, duration, 'linear', function ()
            {
                self.leftToRight();
            });
            self.runNum--;
        }
        else if (self.runNum == 0) {
            self.showList.shift();
            self.stop();
            self.checkShowID();
        }
    }

    this.rightToLeft = function ()
    {
        self.tickerW = 0;
        for (var i = 0; i < self.texts[self.tickerNum].sectionNum; i++) {
            self.tickerW += $("#txt" + i).width();
        }
        var duration = (self.tickerW + 1280) / self.speed * 1000;

        if (self.runNum > 0) {
            $("#ticker").css({top: '0',"left": '1280px'});
            $("#ticker").animate({'left':-self.tickerW+"px"}, duration, 'linear', function ()
            {
                self.leftToRight();
            });
            self.runNum--;
        }
        else if (self.runNum == 0) {
            self.showList.shift();
            self.stop();
            self.checkShowID();
        }
    }

    this.bottomToTopAtLeft = function ()
    {
        self.tickerH = 0;
        $("#tickerBox").css('white-space', 'normal');
        $("#ticker").css({
            width: '5px',
            'word-wrap': 'break-word'
        });
        for (var i = 0; i < self.texts[self.tickerNum].sectionNum; i++) {
            self.tickerH += $("#txt" + i).height();
        }
        var duration = (self.tickerH + 720) / self.speed*1000;

        if (self.runNum > 0) {
            $("#ticker").css({top: '720px',"left": '0'});
            $("#ticker").animate({'top': -self.tickerH+'px'}, duration, 'linear', function ()
            {
                self.leftToRight();
            });
            self.runNum--;
        }
        else if (self.runNum == 0) {
            self.showList.shift();
            self.stop();
            self.checkShowID();
        }
    }

    this.bottomToTopAtRight = function ()
    {
        self.tickerH = 0;
        $("#tickerBox").css('white-space', 'normal');
        $("#ticker").css({
            width: '5px',
            left: 1230 - self.texts[self.tickerNum].fontSize + 'px',
            margin: 0,
            'word-wrap': 'break-word'
        });
        for (var i = 0; i < self.texts[self.tickerNum].sectionNum; i++) {
            self.tickerH += $("#txt" + i).height();
        }
        var duration = (self.tickerH + 720) / self.speed*1000;

        if (self.runNum > 0) {
            $("#ticker").css({top: '720px'});
            $("#ticker").animate({'top': -self.tickerH+'px'}, duration, 'linear', function ()
            {
                self.leftToRight();
            });
            self.runNum--;
        }
        else if (self.runNum == 0) {
            self.showList.shift();
            self.stop();
            self.checkShowID();
        }
    }


    /*载入函数*/
    this.init = function ()
    {
        console.log("Ticker init");
        self.parseText();
        self.start();
    }

    /*运行ticker*/
    this.start = function ()
    {
        console.log("Ticker start");
        self.checkTime();
        self.tickerID = setInterval(function ()
        {
            self.checkTime();
        }, 60000);
    };

    /*停止ticker*/
    this.stop = function ()
    {
        self.showID = false;
        $("#tickerBox").remove();
        console.log("Ticker stop");
    };

    /*退出ticker*/
    this.exit = function ()
    {
        self.stop();
        clearInterval(self.tickerID);
        console.log("Ticker exit");
    }
}
