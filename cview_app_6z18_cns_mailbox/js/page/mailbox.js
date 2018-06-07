function MailboxPage(params, srcModule)
{
    var self = this;
    self.list = null;
    self.mailData = null;
    self.mailSpaceInfo = null;
    self.mailNum = 0;
    self.listLength = 0;
    self.listNum = 0;

    this.dlgParam = [
        {uiType: UIFrame, id: "mailbox", l: 0, t: 0, w: UI.width, h: UI.height, type: "none"}
    ];

    this.open = function ()
    {
        this.defOpen();
        console.log("MailboxPage Open!");
    };

    this.close = function ()
    {
        this.defClose();
        console.log("MailboxPage Close");
    };

    this.start = function ()
    {
        console.log("MailboxPage start");
        setTimeout(function(){

            var rect = {
                l:0,
                t:0,
                w:1280,
                h:720
            };
            var r = getVideoRect(rect,sysCom.config.Reslution);
            dtvCom.mp.mpSetVideoSize(r.l, r.t, r.w, r.h, false);
        }, 300);
        self.showMailbox();
        self.updateMailbox();
    };

    this.getMailListData = function (result)
    {
        self.mailData = result.mailheads;
        self.mailcount = result.mailcount;
        self.updateMailList();
    }
    this.getMailSpaceInfoData = function (result)
    {
        self.mailSpaceInfo = result;
        self.updateMailSpaceInfo();
    }

    this.getMailContentData = function (result)
    {
        self.mailcontent = result.mailcontent;
        self.showContent();
    }

    this.updateMailbox = function ()
    {
        CA.getAllMailHead(self.getMailListData);
        CA.getMailSpaceInfo(self.getMailSpaceInfoData);
    }

    //无CA卡时触发事件
    var noCACardDlg = function ()
    {
        if ($("#noCACardDlg").length > 0) {
            return;
        }
        var html = '<div id="noCACardDlg">';
        html += '<p id="noCACardDlg_title">' + Lp.getValue("mailDlg_title") + '</p>';
        html += '<p id="noCACardDlg_content">' + Lp.getValue("noCACardDlg") + '</p>';
        html += '<div id="noCACardDlg_footer">';
        html += '<img class="noCACardDlg_ico" src="./black/ico_back.png">';
        html += '<p class="noCACardDlg_icoTxt">' + Lp.getValue("Up_Page") + '</p>';
        html += '</div>';
        html += '</div>';
        $("#divMain").append(html);

        $("#noCACardDlg").css({
            'background-image': 'url(./black/mailDialog_bg.png)',
            'background-size': '100% 100%',
            'zIndex': '40',
            'position': 'absolute',
            'top': '230px',
            'left': '455px',
            'width': '370px',
            'height': '212px',
            'text-align': 'center'
        });
        $("#noCACardDlg_title").css({
            'width': '370px', 'height': '40px', 'font-size': '30px', 'color': '#A6A6A6', 'line-height': '40px'
        });
        $("#noCACardDlg_content").css({
            'width': '350px', 'height': '80px', 'font-size': '20px', 'color': 'white', 'line-height': '40px',
            'margin': '30px 10px'
        });
        $("#noCACardDlg_footer").css({
            'width': '210px', 'height': '20px', 'line-height': '20px', 'margin': '15px 0 0 140px',
            'font-size': '20px', 'color': '#A6A6A6'
        });
        $(".noCACardDlg_ico").css({'float': 'left', 'margin-right': '5px'});
        $(".noCACardDlg_icoTxt").css({'float': 'left'});

        $("#noCACardDlg").attr('tabindex', 1);
        $("#noCACardDlg").focus();
        $("#noCACardDlg:focus").css({'outline': 'none'});
        $("#noCACardDlg").keydown(function (e)
        {
            console.log("in noCACardDlg:" + e.keyCode);
            var ret = false;
            switch (e.keyCode) {
                case UI.KEY.BACKSPACE:
                    appCom.goAppByName("tvportal",true);
                    ret = true;
                    break;
                case UI.KEY.FUNRED || UI.KEY.FUNGREEN || UI.KEY.ENTER:
                    ret = true;
                    break;
            }
            if (ret) {
                e.stopPropagation();
                e.preventDefault();
            }
        });
    }

    //有新邮件时触发事件
    var newMailDlg = function ()
    {
        if ($("#newMailDlg").length > 0) {
            return;
        }
        self.updateMailbox();
        var lastFocus = $(":focus");

        var html = '<div id="newMailDlg">';
        html += '<p id="newMailDlg_title">' + Lp.getValue("mailDlg_title") + '</p>';
        html += '<p id="newMailDlg_content">' + Lp.getValue("newMailDlg") + '</p>';
        html += '<div id="newMailDlg_footer">';
        html += '<img class="newMailDlg_ico" src="./black/ico_ok.png">';
        html += '<p class="newMailDlg_icoTxt">' + Lp.getValue("OK") + '</p>';
        html += '<img class="newMailDlg_ico" src="./black/ico_back.png">';
        html += '<p class="newMailDlg_icoTxt">' + Lp.getValue("Cancel") + '</p>';
        html += '</div>';
        html += '</div>';
        $("#divMain").append(html);

        $("#newMailDlg").css({
            'background-image': 'url(./black/mailDialog_bg.png)', 'background-size': '100% 100%',
            'zIndex': '40',
            'position': 'absolute',
            'top': '230px',
            'left': '455px',
            'width': '370px',
            'height': '212px',
            'text-align': 'center'
        });
        $("#newMailDlg_title").css({
            'width': '370px', 'height': '40px', 'font-size': '30px', 'color': '#A6A6A6', 'line-height': '40px'
        });
        $("#newMailDlg_content").css({
            'width': '350px', 'height': '80px', 'font-size': '20px', 'color': 'white', 'line-height': '40px',
            'margin': '30px 10px'
        });
        $("#newMailDlg_footer").css({
            'width': '210px', 'height': '20px', 'line-height': '20px', 'margin': '15px 70px 0 90px',
            'font-size': '20px', 'color': '#A6A6A6'
        });
        $(".newMailDlg_ico").css({'float': 'left', 'margin-right': '5px'});
        $(".newMailDlg_icoTxt").css({'float': 'left', 'margin-right': '15px'});

        $("#newMailDlg").attr('tabindex', 1);
        $("#newMailDlg").focus();
        $("#newMailDlg:focus").css({'outline': 'none'});
        $("#newMailDlg").keydown(function (e)
        {
            console.log("in newMailDlg:" + e.keyCode);
            var ret = false;
            switch (e.keyCode) {
                case UI.KEY.BACKSPACE:
                    keyBackspace();
                    ret = true;
                    break;
                case UI.KEY.ENTER:
                    keyEnter();
                    ret = true;
                    break;
                case UI.KEY.FUNRED || UI.KEY.FUNGREEN:
                    ret = true;
                    break;
            }
            if (ret) {
                e.stopPropagation();
                e.preventDefault();
            }
        });

        var keyBackspace = function ()
        {
            $("#newMailDlg").remove();
            $(lastFocus).focus();
        }
        var keyEnter = function ()
        {
            setUnFocusStyle();
            $("#newMailDlg").remove();
            if ($("#mail").length > 0) {
                $("#mail").remove();
            }
            self.mailNum = 0;
            self.listNum = 0;
            self.showContent();
        }
    }

    this.showMailbox = function ()
    {
        //邮箱列表
        var html = '<div id="divMain">';
        html += '<div id="mailBox">';
        html += '<p id="mailBox_title">' + Lp.getValue("System_mailbox") + '</p>';
        html += '<div id="mailList_title">';
        html += '<p id="t1">ID</p>';
        html += '<p id="t2">' + Lp.getValue("mailbox_title") + '</p>';
        html += '<p id="t3">' + Lp.getValue("importance") + '</p>';
        html += '<p id="t4">' + Lp.getValue("time") + '</p>';
        html += '</div>';
        html += '<ul id="mailList">';
        for (var n = 0; n < 8; n++) {
            html += '<li class="mailOptions">';
            html += '<p class="m1" id=ID' + n + '></p>';
            html += '<p class="m2" id=title' + n + '></p>';
            html += '<div class="m3">';
            html += '<img id=readed' + n + ' src="">';
            html += '</div>';
            html += '<p class="m4" id=importance' + n + '></p>';
            html += '<p class="m5" id=createtime' + n + '></p>';
            html += '</li>';
        }
        html += '</ul>';
        html += '<p id="mailBox_footer"></p>';
        html += '<div id="icoList">';
        html += '<img class="mailBox_ico" src="./black/ico_back.png">';
        html += '<p class="mailBox_icoTxt">' + Lp.getValue("Up_Page") + '</p>';
        html += '<img class="mailBox_ico" src="./black/ico_ok.png">';
        html += '<p class="mailBox_icoTxt">' + Lp.getValue("read") + '</p>';
        html += '<img class="mailBox_ico" src="./black/ico_red.png">';
        html += '<p class="mailBox_icoTxt">' + Lp.getValue("delete") + '</p>';
        html += '<img class="mailBox_ico" src="./black/ico_green.png">';
        html += '<p class="mailBox_icoTxt">' + Lp.getValue("delete_read") + '</p>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        $("body").append(html);

        $("#divMain").css({
            'position': 'absolute', 'top': '0', 'left': '0', 'width': '1280px',
            'height': '720px'
        });
        $("#mailBox").css({
            'background-image': 'url(./black/mailbox_bg_800x440.png)', 'background-size': '100% 100%',
            'position': 'absolute', 'top': '100px', 'left': '230px', 'width': '820px', 'height': '505px',
            'display': 'block'
        });
        $("#mailBox_title").css({
            'width': '820px', 'font-size': '28px', 'color': '#A6A6A6', 'text-align': 'center',
            'line-height': '65px'
        });
        $("#mailList_title").css({'width': '820px', 'height': '30px', 'font-size': '20px', 'color': '#A2CD5A'});
        $("#t1").css({'width': '90px', 'padding-left': '45px', 'float': 'left'});
        $("#t2").css({'width': '350px', 'float': 'left'});
        $("#t3").css({'width': '100px', 'float': 'left'});
        $("#t4").css({'width': '90px', 'float': 'left'});
        $("#mailList").css({
            'width': '820px', 'height': '320px', 'font-size': '18px',
            'color': '#A6A6A6', 'list-style': 'none'
        });
        $(".mailOptions").css({
            'width': '730px', 'height': '40px', 'margin-left': '40px', 'background-size': '100%',
            'line-height': '40px', 'border-radius': '10px', 'display': 'none'
        });
        $(".m1").css({'width': '90px', 'padding-left': '5px', 'float': 'left'});
        $(".m2").css({'width': '290px', 'float': 'left'});
        $(".m3").css({'width': '60px', 'height': '30px', 'float': 'left', 'padding-top': '7px'});
        $(".m4").css({'width': '100px', 'float': 'left'});
        $(".m5").css({'width': '180px', 'float': 'left'});
        $("#mailBox_footer").css({
            'width': '820px', 'font-size': '20px', 'color': '#A6A6A6', 'text-align': 'center',
            'line-height': '30px'
        });
        $("#icoList").css({
            'width': '600px', 'height': '20px', 'line-height': '20px', 'margin': '15px 150px',
            'font-size': '20px', 'color': '#A6A6A6'
        });
        $(".mailBox_ico").css({'float': 'left', 'margin-right': '5px'});
        $(".mailBox_icoTxt").css({'float': 'left', 'margin-right': '40px'});
        self.list = $("li");

        $("#mailBox").attr('tabindex', 1);
        $("#mailBox").focus();
        $("#mailBox:focus").css({'outline': 'none'});
        $("#mailBox").keydown(function (e)
        {
            console.log("in mailBox:" + e.keyCode);

            var ret = false;
            switch (e.keyCode) {
                case UI.KEY.ENTER:
                    keyEnter();
                    ret = true;
                    break;
                case UI.KEY.FUNRED:
                    self.delDialog(0);
                    ret = true;
                    break;
                case UI.KEY.FUNGREEN:
                    self.delDialog(1);
                    ret = true;
                    break;
                case UI.KEY.DOWN:
                    keyDown();
                    ret = true;
                    break;
                case UI.KEY.UP:
                    keyUp();
                    ret = true;
                    break;
            }
            if (ret) {
                e.stopPropagation();
                e.preventDefault();
            }
        });

        var keyEnter = function ()
        {
            if (null == self.mailData || 0 == self.mailData.length) {
                return;
            }
            var mID = self.mailData[self.mailNum + self.listNum].mailid;
            CA.getMailContent(mID, self.getMailContentData);
        }

        var keyDown = function ()
        {
            if (null == self.mailData || 0 == self.mailData.length) {
                return;
            }
            setUnFocusStyle();
            if (self.listNum < self.listLength - 1) {
                self.listNum++;
            }
            else {
                self.listNum = 0;
                if (self.mailNum + self.listLength >= self.mailData.length) {
                    self.mailNum = 0;
                    self.updateMailList();
                }
                else {
                    self.mailNum += self.list.length;
                    self.updateMailList();
                }
            }
            setFocusStyle();
        }

        var keyUp = function ()
        {
            if (null == self.mailData || 0 == self.mailData.length) {
                return;
            }
            if (self.listNum > 0) {
                setUnFocusStyle();
                self.listNum--;
            }
            else {
                if (0 == self.mailNum) {
                    var remainder = self.mailData.length % self.list.length;
                    self.mailNum = self.mailData.length - remainder;
                    self.updateMailList();
                }
                else {
                    self.mailNum -= self.list.length;
                    self.updateMailList();
                }
                setUnFocusStyle();
                self.listNum = self.listLength - 1;
            }
            setFocusStyle();
        }
    }

    var setFocusStyle = function ()
    {
        if (null == self.mailData || 0 == self.mailData.length) {
            return;
        }
        $(self.list[self.listNum]).css({
            'background-image': 'url(./black/blue_edit_bk.png)', 'color': 'white'
        });
    }

    var setUnFocusStyle = function ()
    {
        $(self.list[self.listNum]).css({'background-image': 'none', 'color': '#A6A6A6'});
    }

    self.updateMailList = function ()
    {
        $(".mailOptions").css({'display': 'none'});
        if (null == self.mailData || 0 == self.mailData.length) {
            return;
        }
        var m = self.mailNum;
        for (var n = 0; n < self.list.length; n++) {
            $(self.list[n]).css({'display': 'block'});
            $("#ID" + n).text(self.mailData[m].mailid);
            $("#title" + n).text(self.mailData[m].mailtitle);
            if (self.mailData[m].importance) {
                $("#importance" + n).text(Lp.getValue("importance"));
            }
            else {
                $("#importance" + n).text(Lp.getValue("ordinary"));
            }
            $("#createtime" + n).text(self.mailData[m].createtime);
            if (self.mailData[m].readed) {
                $("#readed" + n).attr('src', './black/open_mail_open.png');
            }
            else {
                $("#readed" + n).attr('src', './black/mail_new.png');
            }
            self.listLength = n + 1;
            if (m < self.mailData.length - 1) {
                m++;
            }
            else {
                setFocusStyle();
                return;
            }
        }
        setFocusStyle();
    };

    this.updateMailSpaceInfo = function ()
    {
        if (null == self.mailData || null == self.mailSpaceInfo) {
            $("#mailBox_footer").text(Lp.getValue("sum") + "：   " + Lp.getValue("unread")
                + "：   " + Lp.getValue("max") + "：");
            return;
        }
        var unreadNum = 0;
        var sum = self.mailData.length ? self.mailData.length : "0";
        var max = (self.mailSpaceInfo.used && self.mailSpaceInfo.unused) ?
            (self.mailSpaceInfo.used + self.mailSpaceInfo.unused) : "";
        for (var i = 0; i < self.mailData.length; i++) {
            if (!self.mailData[i].readed) {
                unreadNum++;
            }
        }
        $("#mailBox_footer").text(Lp.getValue("sum") + "： " + sum + "  " + Lp.getValue("unread")
            + "： " + unreadNum + "  " + Lp.getValue("max") + "： " + max);
    }

    this.showContent = function ()
    {
        $("#mailBox").css({'display': 'none'});

        var html = '<div id="mail">';
        html += '<p id="mail_title">' + Lp.getValue("mailInfo") + '</p>';
        html += '<div id="mail_content">';
        html += '<p id="content_title"></p>';
        html += '<p id="content"></p>';
        html += '</div>';
        html += '<div id="mail_footer">';
        html += '<img class="mail_ico" src="./black/ico_back.png">';
        html += '<p class="mail_icoTxt">' + Lp.getValue("Up_Page") + '</p>';
        html += '</div>';
        html += '</div>';
        $("#divMain").append(html);

        $("#mail").css({
            'background-image': 'url(./black/mailbox_bg_800x440.png)', 'background-size': '100% 100%',
            'position': 'absolute', 'top': '100px', 'left': '230px', 'width': '820px', 'height': '505px'
        });
        $("#mail_title").css({
            'width': '820px', 'height': '60px', 'font-size': '28px', 'color': '#A6A6A6', 'text-align': 'center',
            'line-height': '65px'
        });
        $("#mail_content").css({'width': '690px', 'height': '380px', 'margin': '0 50px'});
        $("#content_title").css({
            'height': '70px', 'font-size': '25px', 'color': 'white', 'text-align': 'center', 'margin-top': '5px'
        });
        $("#content").css({'height': '310px', 'font-size': '20px', 'color': 'white'});
        $("#mail_footer").css({
            'width': '120px', 'height': '20px', 'line-height': '20px', 'margin': '15px 350px',
            'font-size': '18px', 'color': '#A6A6A6'
        });
        $(".mail_ico").css({'float': 'left', 'margin-right': '5px'});
        $(".mail_icoTxt").css({'float': 'left'});

        //邮件内容
        self.mailcontent = self.mailcontent.replace(/(\r\n)|(\n)/g, '<br />');
        $("#content_title").text(self.mailData[self.mailNum + self.listNum].mailtitle);
        $("#content").html(self.mailcontent);

        //設郵件為已讀
        if (!self.mailData[self.mailNum + self.listNum].readed) {
            self.mailData[self.mailNum + self.listNum].readed = true;
        }

        $("#mail").attr('tabindex', 1);
        $("#mail").focus();
        $("#mail:focus").css({'outline': 'none'});
        $("#mail").keydown(function (e)
        {
            console.log("in mail:" + e.keyCode);

            var ret = false;
            switch (e.keyCode) {
                case UI.KEY.BACKSPACE:
                    keyBackspace();
                    ret = true;
                    break;
                case UI.KEY.FUNRED || UI.KEY.FUNGREEN || UI.KEY.ENTER:
                    ret = true;
                    break;
            }
            if (ret) {
                e.stopPropagation();
                e.preventDefault();
            }
        });

        var keyBackspace = function ()
        {
            $("#mail").remove();
            $("#mailBox").css({'display': 'block'});
            $("#mailBox").focus();
            self.updateMailList();
            self.updateMailSpaceInfo();
        }
    }

    this.delDialog = function (a)
    {
        if (null == self.mailData || 0 == self.mailData.length) {
            return;
        }
        var c = "";
        if (0 == a) {
            c = Lp.getValue("delete_this");
        }
        else if (1 == a) {
            c = Lp.getValue("delete_allRead");
        }

        var html = '<div id="mailDialog">';
        html += '<p id="mailDialog_title">' + Lp.getValue("mailDlg_title") + '</p>';
        html += '<p id="mailDialog_content">' + c + '</p>';
        html += '<div id="mailDialog_footer">';
        html += '<img class="mailDialog_ico" src="./black/ico_ok.png">';
        html += '<p class="mailDialog_icoTxt">' + Lp.getValue("OK") + '</p>';
        html += '<img class="mailDialog_ico" src="./black/ico_back.png">';
        html += '<p class="mailDialog_icoTxt">' + Lp.getValue("Cancel") + '</p>';
        html += '</div>';
        html += '</div>';
        $("#divMain").append(html);

        $("#mailDialog").css({
            'background-image': 'url(./black/mailDialog_bg.png)',
            'background-size': '100% 100%',
            'zIndex': '30',
            'position': 'absolute',
            'top': '230px',
            'left': '455px',
            'width': '370px',
            'height': '212px',
            'text-align': 'center'
        });
        $("#mailDialog_title").css({
            'width': '370px', 'height': '40px', 'font-size': '30px', 'color': '#A6A6A6', 'line-height': '40px'
        });
        $("#mailDialog_content").css({
            'width': '350px', 'height': '80px', 'font-size': '20px', 'color': 'white', 'line-height': '40px',
            'margin': '30px 10px'
        });
        $("#mailDialog_footer").css({
            'width': '210px', 'height': '20px', 'line-height': '20px', 'margin': '15px 70px 0 90px',
            'font-size': '20px', 'color': '#A6A6A6'
        });
        $(".mailDialog_ico").css({'float': 'left', 'margin-right': '5px'});
        $(".mailDialog_icoTxt").css({'float': 'left', 'margin-right': '15px'});

        $("#mailDialog").attr('tabindex', 1);
        $("#mailDialog").focus();
        $("#mailDialog:focus").css({'outline': 'none'});
        $("#mailDialog").keydown(function (e)
        {
            console.log("in mailDialog:" + e.keyCode);

            var ret = false;
            switch (e.keyCode) {
                case UI.KEY.BACKSPACE:
                    keyBackspace();
                    ret = true;
                    break;
                case UI.KEY.ENTER:
                    keyEnter();
                    ret = true;
                    break;
                case UI.KEY.FUNRED || UI.KEY.FUNGREEN:
                    ret = true;
                    break;
            }
            if (ret) {
                e.stopPropagation();
                e.preventDefault();
            }
        });

        var keyBackspace = function ()
        {
            $("#mailDialog").remove();
            $("#mailBox").focus();
        }
        var keyEnter = function ()
        {
            if (0 == a) {
                var mID = self.mailData[self.mailNum + self.listNum].mailid;
                CA.delMail(mID);
                self.mailData.splice(self.mailNum + self.listNum, 1);
                setUnFocusStyle();
                if (self.listNum > 0) {
                    self.listNum--;
                }
                else {
                    if (self.mailNum != 0) {
                        self.mailNum -= self.list.length;
                        self.listNum = self.listLength - 1;
                    }
                }
                self.updateMailList();
                self.updateMailSpaceInfo();
            }
            else if (1 == a) {
                var readNum = 0;
                for (var i = 0; i < self.mailData.length; i++) {
                    if (self.mailData[i].readed) {
                        var mID = self.mailData[i].mailid;
                        CA.delMail(mID);
                        self.mailData.splice(i, 1);
                        i--;
                        readNum++;
                    }
                    console.log(i);
                }
                if (readNum != 0) {
                    self.listNum = 0;
                    self.mailNum = 0;
                    setUnFocusStyle();
                    self.updateMailList();
                    self.updateMailSpaceInfo();
                }
            }
            $("#mailDialog").remove();
            $("#mailBox").focus();
        }
    }

    this.stop = function ()
    {
        console.log("MailboxPage stop");
    };

    this.onkey = function (e)
    {
        var ret = false;
        console.log("In MailboxPage module keyCode =" + e.keyCode);

        switch (e.keyCode) {
            case UI.KEY.BACKSPACE:
                appCom.goAppByName("tvportal",true);
                ret = true;
                break;
        }
        return ret;
    };
}

MailboxPage.prototype = UIModule.baseModule;