/*
        var p = {
            playState: function ()
            {
                return true;    //获取播放状态
            },
            LanguageList: function ()
            {
                return ["中文", "英文", "日語"];      //语言列表
            },
            videoLength: function ()
            {
                return 4200;    //视频总长度
            },
            videoNowTime: function ()
            {
                return 321;     //当前播放长度
            },
            videoStop: function ()
            {
                    //停止播放函数
            },
            videoPlay: function ()
            {
                    //开始播放函数
            },
            fastForward: function ()
            {
                    //快进函数
            },
            fastBackward: function ()
            {
                    //快退函数
            },
            dragForward: function ()
            {
                    //拖拽快进
            },
            dragBackward: function ()
            {
                    //拖拽快退
            },
            playTypes: "timeshift",
            title: "康熙王朝",
            detailsInfo: "康熙王朝第1360集",
        }

        self.playBanner = new MediaPlayBanner(p);
        self.playBanner.showBanner();
*/

function MediaPlayBanner(p)
{
    var self = this;
	var hasCreate = false;
    var params = p;
    var ico_FFList = ["ico_FF_x2.png", "ico_FF_x4.png", "ico_FF_x8.png", "ico_FF_x16.png", "ico_FF_x32.png"];
    var ico_FBList = ["ico_FB_X2.png", "ico_FB_X4.png", "ico_FB_X8.png", "ico_FB_X16.png", "ico_FB_X32.png"];
    var processbar_blue_width = null;
    self.languageList = null;
    self.languageNum = 0;
    self.playStatus = 0;
    self.detailFlag = false;
    self.bannerFlag = false;
    self.langDlgFlag = false;

    self.fastTowardFlag = 0;
    self.fastTowardNum = 1;

    var checkTime = function (i)
    {
        if (i < 10) {
            i = "0" + i
        }
        return i
    }

    var transformTime = function (i)
    {
        var s = i % 60;
        var m = parseInt((i / 60) % 60);
        var h = parseInt(i / 3600);
        return checkTime(h) + ":" + checkTime(m) + ":" + checkTime(s);
    }

    var getNowTime = function ()
    {
        var date = new Date();
        return checkTime(date.getHours()) + ":" + checkTime(date.getMinutes()) + ":" + checkTime(date.getSeconds());
    }

    var getNowTimeBySecond = function ()
    {
        var date = new Date();
        return (date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds());
    }

    console.log("mediaPlayBanner constructed.");
	this.createBanner = function(){
		var html = '<div id="mediaPlayBanner">';
        html += '<div id="ico_playTypes"></div>';
        html += '<div id="languageBar">';
        html += '<p id="languageTxt"></p>';
        html += '</div>';
        html += '<div id="banner1">';
        html += '<p id="bannerTitle"></p>';
        html += '<img id="ico_playState" src="">';
        html += '<span id="bannerStartTime"></span>';
        html += '<img id="processbar_black_bg" src="">';
        html += '<img id="processbar_blue_bg" src="">';
        html += '<span id="bannerEndTime"></span>';
        html += '<span id="playTime"></span>';
        html += '</div>';
        html += '<div id="banner2">';
        html += '<div id="icoList">';
        html += '<img id="ico_playpause" src="">';
        html += '<span class="banner2_txt" id="">播放/暫停</span>';
        html += '<img class="banner2_ico" id="ico_backward" src="">';
        html += '<span class="banner2_txt" id="">後退</span>';
        html += '<img class="banner2_ico" id="ico_forward" src="">';
        html += '<span class="banner2_txt" id="">前進</span>';
        html += '<img class="banner2_ico" id="ico_red" src="">';
        html += '<span class="banner2_txt" id="">倍數後退</span>';
        html += '<img class="banner2_ico" id="ico_blue" src="">';
        html += '<span class="banner2_txt" id="">倍數前進</span>';
        html += '<img class="banner2_ico" id="ico_infoKey" src="">';
        html += '<span class="banner2_txt" id="">詳情</span>';
        html += '<img class="banner2_ico" id="ico_language" src="">';
        html += '<span class="banner2_txt" id="ico_languageTxt"></span>';
        html += '<img class="banner2_ico" id="ico_back" src="">';
        html += '<span class="banner2_txt" id="">返回</span>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        $("body").append(html);

        //设置css
        $("#mediaPlayBanner").css({
            'width': '1280px', 'height': '720px', 'top': '0', 'left': '0', 'position': 'absolute', 'zIndex': '1'
        });

        $("#ico_playTypes").css({
            'width': '80px', 'height': '58px', 'top': '70px', 'left': '90px', 'position': 'absolute'
        });
        $("#banner1").css({
            'width': '1100px', 'height': '114px', 'position': 'absolute', 'top': '510px', 'left': '90px'
        });
        $("#bannerTitle").css({
            'margin-top': '12px', 'font-size': '22px', 'text-align': 'center', 'color': 'white',
        });
        $("#ico_playState").css({
            'float': 'left', 'margin-left': '35px', 'margin-top': '-4px'
        });
        $("#bannerStartTime").css({
            'font-size': '20px', 'margin-top': '8px', 'margin-left': '10px', 'color': '#969696', 'float': 'left'
        });
        $("#processbar_black_bg").css({
            'width': '790px', 'height': '10px', 'margin-top': '15px', 'margin-left': '17px', 'position': 'absolute'
        });
        $("#processbar_blue_bg").css({
            'width': '0', 'height': '10px', 'margin-top': '15px', 'margin-left': '17px', 'position': 'absolute'
        });
        $("#bannerEndTime").css({
            'font-size': '20px', 'margin-top': '8px', 'margin-right': '22px', 'color': '#969696',
            'float': 'right'
        });
        $("#playTime").css({
            'width': '104px', 'height': '26px', 'margin-top': '35px', 'margin-left': '323px', 'position': 'absolute',
            'border-radius': '4px', 'font-size': '22px', 'color': 'white', 'background-color': '#707070',
            'text-align': 'center', 'padding-top': '4px'
        });
        $("#banner2").css({
            'width': '1100px', 'height': '40px', 'position': 'absolute', 'top': '629px', 'left': '90px',
            'text-align': 'center'
        });
        $("#icoList").css({'margin-top': '10px', 'display': 'inline-block'});
        $("#ico_playpause").css({'float': 'left'});
        $(".banner2_ico").css({'margin-left': '20px', 'float': 'left'});
        $(".banner2_txt").css({
            'margin-top': '2px', 'margin-left': '10px', 'font-size': '17px', 'color': '#969696', 'float': 'left'
        });

        //设置图片
		 $("#ico_playTypes").css({'background-image': 'url(./black/images/ico_playback.png)'});
        
		 $("#ico_playState").attr('src', './black/images/ico_play.png');
        
        $("#banner1").css({'background-image': 'url(./black/images/contrl_pannel_bg_1100x114.png)'});
        $("#banner2").css({'background-image': 'url(./black/images/contrl_pannel_bg_1100x40.png)'});
        $("#processbar_black_bg").attr('src', './black/images/processbar_black_bg.png');
        $("#processbar_blue_bg").attr('src', './black/images/processbar_blue_bg.png');
        $("#ico_playpause").attr('src', './black/images/ico_playpause.png');
        $("#ico_backward").attr('src', './black/images/ico_backward.png');
        $("#ico_forward").attr('src', './black/images/ico_forward.png');
        $("#ico_red").attr('src', './black/images/ico_red.png');
        $("#ico_blue").attr('src', './black/images/ico_blue.png');
        $("#ico_infoKey").attr('src', './black/images/ico_infoKey.png');
        $("#ico_back").attr('src', './black/images/ico_back.png');

        //设置文字
        $("#bannerTitle").text(params.title);

        if (self.languageList && self.languageList.length > 1) {
            $("#ico_language").attr('src', './black/images/ico_language.png');
            $("#ico_languageTxt").text('聲音切換');

            $("#languageBar").css({
                'background-image': 'url(./black/images/trackBg_280x40.png)',
                'width': '280px', 'height': '40px', 'top': '460px', 'right': '95px', 'position': 'absolute'
            });
            $("#languageTxt").css({
                'font-size': '20px', 'color': 'white', 'text-align': 'center', 'line-height': '40px'
            });
            $("#languageTxt").text('音軌 ' + (self.languageNum + 1) + ' : ' + self.languageList[self.languageNum]);
        }

        //快进快退 图标
        if( $("#ico_fastToward") ){
            var html = '<div id="ico_fastToward"></div>';
            $("#mediaPlayBanner").append(html);
        }

		$("#mediaPlayBanner").hide();
		hasCreate = true;
	};

    //获取更新当前播放状态
    this.getMplayerStatus = function ()
    {
		var duration = params.mp.mpGetDuration(false);
		var curTime = params.mp.mpGetCurTime(false);
        $("#bannerStartTime").text("00:00:00");
        $("#bannerEndTime").text(transformTime(duration));
        $("#playTime").text(transformTime(curTime));

        processbar_blue_width = 790 * (curTime / duration);
        $("#processbar_blue_bg").css('width', processbar_blue_width + 'px');
    };


    this.openMplayTimer = function ()
    {
        self.stopMplayTimer();
        self.mplayTimer = setInterval(function ()
        {
            self.getMplayerStatus();
        }, 500);
    };

    this.stopMplayTimer = function ()
    {
        if (self.mplayTimer) {
            clearInterval(self.mplayTimer);
            self.mplayTimer = null;
        }
    };

    //播放完畢彈出
    this.videoOver = function ()
    {
        
        var html = '<div id="videoOverBg">';
        html += '<ul id="videoOverDlg">';
        html += '<li class="videoOverBtn">離開</li>';
        html += '<li class="videoOverBtn">再播一遍</li>';
        html += '<li class="videoOverBtn">繼續播放下一集</li>';
        html += '<li class="videoOverBtn">刪除</li>';
        html += '</ul>';
        html += '</div>';
        $("body").append(html);

        $("#videoOverBg").css({
            'width': '1280px', 'height': '720px', 'top': '0', 'right': '0', 'position': 'absolute',
            'background-color': 'black', 'zIndex': '4'
        });
        $("#videoOverDlg").css({
            'width': '300px', 'height': '260px', 'top': '210px', 'right': '490px',
            'position': 'absolute', 'background-size': '100%100%', 'list-style': 'none',
            'background-image': 'url(./black/images/end_dialogue_bg_300x150.png)',
        });
        $(".videoOverBtn").css({
            'width': '280px', 'height': '45px', 'background-size': '100%100%', 'margin': '15px 9px 0px 9px',
            'font-size': '20px', 'color': '#969696', 'text-align': 'center', 'font-size': '20px',
            'line-height': '45px', 'background-image': 'url(./black/images/recordWayBtn_normal.png)'
        });
        var list = $("li");
        var i = 0;
        $(list[i]).css({'background-image': 'url(./black/images/recordWayBtn_highlight.png)', 'color': 'white'});

        //设置按键处理
        $("#videoOverDlg").attr('tabindex', 1);
        $("#videoOverDlg").focus();
        $("#videoOverDlg:focus").css({'outline': 'none'});
        $("#videoOverDlg").keydown(function (e)
        {
            console.log("in videoOverDlg:" + e.keyCode);
            switch (e.keyCode) {
                case UI.KEY.ENTER:
                    keyEnter();
                    break;
                case UI.KEY.DOWN:
                    keyDown();
                    break;
                case UI.KEY.UP:
                    keyUp();
                    break;
            }
            $(list[i]).css({'background-image': 'url(./black/images/recordWayBtn_highlight.png)', 'color': 'white'});
            e.stopPropagation();
            e.preventDefault();
        });

        var keyEnter = function ()
        {
            switch (i) {
                case 0:
                    closeSelf();
                    break;
                case 1:
                    break;
                case 2:
                    break;
                case 3:
                    break;
            }
        }

        var keyDown = function ()
        {
            $(list[i]).css({'background-image': 'url(./black/images/recordWayBtn_normal.png)', 'color': '#969696'});
            if (i < list.length - 1) {
                i++;
            }
            else {
                i = 0;
            }
        }

        var keyUp = function ()
        {
            $(list[i]).css({'background-image': 'url(./black/images/recordWayBtn_normal.png)', 'color': '#969696'});
            if (0 < i) {
                i--;
            }
            else {
                i = list.length - 1;
            }
        }

        var closeSelf = function ()
        {
            $("#videoOverBg").remove();
        }
    };

    //詳情彈窗
    this.showDetail = function ()
    {
        if (self.fastTowardFlag || self.detailFlag) {
            return;
        }

        if (!self.bannerFlag) {
            self.showBanner();
        }

        if (self.langDlgFlag) {
            self.closeLangDlg();
        }

        self.stopTimer();
        var html = '<div id="details">';
        html += '<p id="details_title">節目詳情</p>'
        html += '<div id="details_content">';
        html += '<img id="content_img" src="./black/images/ico_pu.png">';
        html += '<span id="content_txt"></span>'
        html += '</div>';
        html += '</div>';
        $("#mediaPlayBanner").append(html);

        self.detailFlag = true;

        $("#details").css({
            'width': '500px', 'height': '275px', 'top': '210px', 'left': '390px', 'position': 'absolute', 'zIndex': '4',
            'background-size': '100%', 'background-image': 'url(./black/images/more_detail_bg_800x440.png)'
        });
        $("#details_title").css({
            'margin-top': '5px', 'font-size': '25px', 'height': '35px',
            'text-align': 'center', 'color': 'white'
        });
        $("#details_content").css({
            'width': '460px',
            'height': '188px',
            'padding': '10px 20px 40px 20px',
            'font-size': '20px',
            'position': 'absolute'
        });
        $("#content_txt").css({'margin-left': '8px', 'position': 'absolute'});

        $("#content_txt").text(params.detailsInfo);
    };

    //語言切換彈窗
    this.languageSwitch = function ()
    {
        if (self.languageList == null || self.languageList.length == 1) {
            return;
        }

        if (self.langDlgFlag || self.fastTowardFlag) {
            return;
        }

        if (!self.bannerFlag) {
            self.showBanner();
        }

        if (self.detailFlag) {
            self.closeDetail();
        }

        self.stopTimer();

        if (self.languageNum < self.languageList.length - 1) {
            self.languageNum++;
        }
        else {
            self.languageNum = 0;
        }
        $("#languageTxt").text('音軌 ' + (self.languageNum + 1) + ' : ' + self.languageList[self.languageNum]);

        var html = '<div id="langDlg">';
        html += '<p id="langDlg_title">提醒</p>'
        html += '<p id="langDlg_content">音軌切換中，請稍後。</p>'
        html += '</div>';
        $("#mediaPlayBanner").append(html);

        self.langDlgFlag = true;

        $("#langDlg").css({
            'width': '490px', 'height': '282px', 'top': '210px', 'left': '395px', 'position': 'absolute',
            'background-image': 'url(./black/images/allert_info_bg.png)'
        });
        $("#langDlg_title").css({
            'margin-top': '10px', 'height': '45px', 'font-size': '27px',
            'text-align': 'center', 'color': '#B8B8B8'
        });
        $("#langDlg_content").css({
            'margin-top': '15px',
            'font-size': '25px',
            'text-align': 'center',
            'color': 'white'
        });
        self.langDlgTimer = setTimeout(function ()
        {
            self.closeLangDlg();
        }, 1000);
    }

    //快進
    this.fastForward = function ()
    {
        if (self.detailFlag) {
            self.closeDetail();
        }

        if(self.fastTowardFlag < 0){
            self.fastTowardNum = 0;
            self.fastTowardFlag = 1;
        }

        self.fastTowardNum++;
        if(self.fastTowardNum > 5){
            self.fastTowardNum = 0;
            $("#ico_fastToward").hide();
        }
        else{
            $("#ico_fastToward").show();
            $("#ico_fastToward").css({
                'width': '50px', 'height': '50px', 'top': '100px', 'right': '90px', 'position': 'absolute',
                'background-image': 'url(./black/images/' + ico_FFList[self.fastTowardNum-1] + ')'
            });
        }

        params.mp.mpSpeed(Math.pow(2,self.fastTowardNum),false);
        self.show();
    };

    //快退
    this.fastBackward = function ()
    {
        if (self.detailFlag) {
            self.closeDetail();
        }

        if(self.fastTowardFlag > 0){
            self.fastTowardNum = 0;
            self.fastTowardFlag = -1;
        }

        self.fastTowardNum++;
        if(self.fastTowardNum > 5){
            self.fastTowardNum = 0;
            $("#ico_fastToward").hide();

        }
        else{
            $("#ico_fastToward").show();
            $("#ico_fastToward").css({
                'width': '50px', 'height': '50px', 'top': '100px', 'right': '90px', 'position': 'absolute',
                'background-image': 'url(./black/images/' + ico_FBList[self.fastTowardNum-1] + ')'
            });
        }
        params.mp.mpSpeed(0-Math.pow(2,self.fastTowardNum),false);
        self.show();

    };

    //拖拽快進
    this.dragForward = function ()
    {
        self.show();
    };

    //拖拽快退
    this.dragBackward = function ()
    {
        self.show();

    };

    //播放暫停
    this.videoPause = function ()
    {
		params.mp.mpPause(false);
        self.fastTowardNum = 0;
        self.fastTowardFlag = 0;
        $("#ico_fastToward").hide();
        $("#ico_playState").attr('src', './black/images/ico_pause.png');
        self.show();
    };

    //繼續播放
    this.videoResume = function ()
    {
        self.fastTowardNum = 0;
        self.fastTowardFlag = 0;
        $("#ico_fastToward").hide();
        params.mp.mpResume(false);
        $("#ico_playState").attr('src', './black/images/ico_play.png');
        self.show();
    };

    //關閉語言切換彈窗
    this.closeLangDlg = function ()
    {
        $("#langDlg").remove();
        self.langDlgFlag = false;
        self.show();
    };

    //關閉詳情彈窗
    this.closeDetail = function ()
    {
        $("#details").remove();
        self.detailFlag = false;
        self.show();
    }

	//banner演示关闭
    this.openShowTimer = function ()
    {
        self.stopShowTimer();
        self.showTimer = setTimeout(function ()
        {
            self.hide();
        }, 1000 * 5);
    };

    this.stopShowTimer = function ()
    {
        if (self.showTimer) {
            clearTimeout(self.showTimer);
            self.showTimer = null;
        }
    };

    //控制Banner條
    this.showBanner = function ()
    {
        if(!hasCreate){
            self.createBanner();
        }
        $("#mediaPlayBanner").show();
    };

    this.start = function ()
    {
        self.showBanner();
		self.openShowTimer();
		self.openMplayTimer();
    };

    this.show = function(){
        self.showBanner();
        self.openShowTimer();
    };

	this.hide = function(){
		self.stopShowTimer();
		$("#mediaPlayBanner").hide();
	};

	this.close = function ()
    {
        self.stopShowTimer();
        self.stopMplayTimer();
        self.langDlgFlag = false;
        self.fastTowardNum = 0;
        self.fastTowardFlag = 0;
        self.detailFlag = false;
        $("#mediaPlayBanner").remove();
        console.log("mediaPlayBanner close");
    };

    //Enter鍵按鍵處理
    this.onkeyEnter = function ()
    {
        if(self.detailFlag){
            self.closeDetail();
        }

        var status = params.mp.mpGetPlayerInfo(false).status;
        if(status == 1){
            self.videoPause();
        }
        else if(status == 3){
            self.videoResume();
        }
        else if(status == 2){
            self.videoPause();
        }
        self.show();
    };

    //按鍵處理
    this.onkey = function (e)
    {
        var ret = true;
        console.log("In mediaPlayBanner keyCode:" + e.keyCode);
        switch (e.keyCode) {
            case UI.KEY.FUNRED:
                self.fastBackward();
                break;
            case UI.KEY.FUNBLUE:
                self.fastForward();
                break;
            case UI.KEY.UP:
            case UI.KEY.DOWN:
                self.show();
                break;
            case UI.KEY.LEFT:
                //self.dragBackward();
                break;
            case UI.KEY.RIGHT:
                //self.dragForward();
                break;
            case UI.KEY.ENTER:
                self.onkeyEnter();
                break;
            case UI.KEY.LANG:
                //self.languageSwitch();
                break;
            case UI.KEY.INFO:
                //self.showDetail();
                break;
            default:
                ret = false;
                break;
        }
        return ret;
    };
}