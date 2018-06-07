function CMInformationPage(params, srcModule)
{
    var self = this;

    var font0 = uiCom.font.F15;
    var font1 = uiCom.font.F20;
    var font2 = uiCom.font.F25;
    var font3 = uiCom.font.F30;

    var color1 = "grey";
    var color2 = "white";

    var contentDlg;
    var downloadTable;
    var uploadTable;

    var downloadItems;
    var uploadItems;

    this.dlgParam = [
        {uiType: UIFrame, id: "bk", l: 0, t: 0, w: 1280, h: 720, styleClass: "None"},
    ];

    var width_frame = 1000;
    var height_frame = 680;
    var top_item = 0;
    var left_item = 0;
    var width_table = width_frame * 0.94;
    var height_table = 120;
    var height_table2 = (height_table / 5) * 3;
    var width_title = 230;
    var height_title = 30;
    var width_con = width_title;
    var height_con = 30;
    this.contentParam = [
        {
            uiType: UIFrame,
            id: "bk",
            w: width_frame,
            h: height_frame,
            l: (1280 - width_frame) / 2,
            t: (720 - height_frame) / 2,
            styleClass: "system_setting_bk"
        },

        {
            uiType: UILabel,
            w: 300,
            h: 25,
            ol: 370,
            ot: (top_item = top_item + 30),
            value: Lp.getValue("system_setting") + ">" + Lp.getValue("CM_Information"),
            font: font3,
            color: color1
        },
        {
            uiType: UIImg,
            id: "img_download",
            w: 32,
            h: 32,
            ol: (left_item = left_item + 100),
            ot: (top_item = top_item + 30),
            src: "setting/docsis_ico_gray"
        },
        {
            uiType: UIImg,
            id: "img_upload",
            w: 32,
            h: 32,
            ol: (left_item = left_item + 253),
            ot: top_item,
            src: "setting/docsis_ico_gray"
        },
        {
            uiType: UIImg,
            id: "img_ranging",
            w: 32,
            h: 32,
            ol: (left_item = left_item + 253),
            ot: top_item,
            src: "setting/docsis_ico_gray"
        },
        {
            uiType: UIImg,
            id: "img_online",
            w: 32,
            h: 32,
            ol: (left_item = left_item + 253),
            ot: top_item,
            src: "setting/docsis_ico_gray"
        },
        {
            uiType: UILabel,
            w: 120,
            h: 30,
            ol: (left_item = 100 + 16 - 60),
            ot: (top_item = top_item + 37),
            value: Lp.getValue("Download"),
            font: font1,
            color: color1,
            HAlign: "center"
        },
        {
            uiType: UILabel,
            w: 120,
            h: 30,
            ol: (left_item = left_item + 253),
            ot: top_item,
            value: Lp.getValue("Upload"),
            font: font1,
            color: color1,
            HAlign: "center"
        },
        {
            uiType: UILabel,
            w: 120,
            h: 30,
            ol: (left_item = left_item + 253),
            ot: top_item,
            value: Lp.getValue("Ranging"),
            font: font1,
            color: color1,
            HAlign: "center"
        },
        {
            uiType: UILabel,
            w: 120,
            h: 30,
            ol: (left_item = left_item + 253),
            ot: top_item,
            value: Lp.getValue("Online"),
            font: font1,
            color: color1,
            HAlign: "center"
        },
        {
            uiType: UILabel,
            w: 200,
            h: 30,
            ol: (left_item = 30),
            ot: (top_item = top_item + 36),
            value: Lp.getValue("Download") + Lp.getValue("Passageway") + ":",
            font: font1,
            HAlign: "left"
        },
        {
            uiType: UITable,
            id: "download_table",
            w: width_table,
            h: height_table,
            ol: left_item,
            ot: (top_item = top_item + 36),
            lineRectWidth: 1,
            lineHWidth: 1,
            lineVWidth: 1,
            lineColor: "#505050",
            font: font0,
            cols: 6,
            rows: 4,
            rowsOnePage: 4,
            HAlign: "left",
            dl: 5,
            dt: -1,
            color: color2,
            focusColor: color2,
            headColor: "#51cc71",
            headUse: true,
            focusStop: false,
            skin: {
                headBar: {type: "none"},
                normalBar: {type: "none"},
            }
        },
        {
            uiType: UILabel,
            w: 200,
            h: 30,
            ol: left_item,
            ot: (top_item = top_item + 136),
            value: Lp.getValue("Upload") + Lp.getValue("Passageway") + ":",
            font: font1,
            HAlign: "left"
        },
        {
            uiType: UITable,
            id: "upload_table",
            w: width_table,
            h: height_table,
            ol: left_item,
            ot: (top_item = top_item + 36),
            lineRectWidth: 1,
            lineHWidth: 1,
            lineVWidth: 1,
            lineColor: "#505050",
            font: font0,
            cols: 4,
            rows: 4,
            rowsOnePage: 4,
            HAlign: "left",
            dl: 5,
            dt: -1,
            color: color2,
            focusColor: color2,
            headColor: "#51cc71",
            headUse: true,
            focusStop: false,
            skin: {
                headBar: {type: "none"},
                normalBar: {type: "none"},
            }
        },
        {
            uiType: UILabel,
            w: width_title,
            h: height_title,
            ol: left_item,
            ot: (top_item = top_item + 136),
            value: "HFC MAC:",
            font: font1,
            HAlign: "right",
            color: color1
        },
        {
            uiType: UILabel,
            id: "hfc_mac",
            w: width_con,
            h: height_con,
            ol: (left_item = left_item + width_title + 5),
            ot: top_item,
            font: font1,
            HAlign: "left"
        },
        {
            uiType: UILabel,
            w: width_title,
            h: height_title,
            ol: (left_item = left_item + width_con + 5),
            ot: top_item,
            value: "CM IP:",
            font: font1,
            HAlign: "right",
            color: color1
        },
        {
            uiType: UILabel,
            id: "cm_ip",
            w: width_con,
            h: height_con,
            ol: (left_item = left_item + width_con + 5),
            ot: top_item,
            font: font1,
            HAlign: "left"
        },

        {
            uiType: UILabel,
            w: width_title,
            h: height_title,
            ol: (left_item = 30),
            ot: (top_item = top_item + 36),
            value: "CM " + Lp.getValue("Version") + ":",
            font: font1,
            HAlign: "right",
            color: color1
        },
        {
            uiType: UILabel,
            id: "cmversion",
            w: width_con,
            h: height_con,
            ol: (left_item = left_item + width_title + 5),
            ot: top_item,
            font: font1,
            HAlign: "left"
        },
        {
            uiType: UILabel,
            w: width_title,
            h: height_title,
            ol: (left_item = left_item + width_con + 5),
            ot: top_item,
            value: Lp.getValue("Current_Time") + ":",
            font: font1,
            HAlign: "right",
            color: color1
        },
        {
            uiType: UILabel,
            id: "time",
            w: width_con,
            h: height_con,
            ol: (left_item = left_item + width_con + 5),
            ot: top_item,
            font: font1,
            HAlign: "left"
        },
        {
            uiType: UILabel,
            w: width_title,
            h: height_title,
            ol: (left_item = 30),
            ot: (top_item = top_item + 36),
            value: Lp.getValue("Manual_Search") + Lp.getValue("Frequency") + "(KHz):",
            font: font1,
            HAlign: "right",
            color: color1
        },
        {
            uiType: UIEdit,
            id: "frequency_edit",
            w: width_con,
            h: height_con,
            ol: (left_item = left_item + width_title + 5),
            ot: top_item - 7,
            HAlign: "center",
            font: font1,
            value: "",
            styleClass: "setting_edit_item",
            dt: 6
        },

        {uiType: UIImg, w: 60, h: 22, ol: (left_item = 350), ot: (top_item = top_item + 46), src: "setting/ico_ok"},
        {
            uiType: UILabel,
            w: 80,
            h: 30,
            ol: (left_item = left_item + 40),
            ot: top_item + 2,
            value: Lp.getValue("Manual_Search"),
            font: font1
        },

        {uiType: UIImg, w: 60, h: 22, ol: (left_item = left_item + 100), ot: top_item, src: "setting/ico_back"},
        {
            uiType: UILabel,
            w: 80,
            h: 30,
            ol: (left_item = left_item + 60),
            ot: top_item + 2,
            value: Lp.getValue("UP_Page"),
            font: font1
        },
    ]

    this.initData = function ()
    {

    }
    this.initView = function ()
    {
        contentDlg = UI.createGroup(self.contentParam, "contentDlg", self.win);
        downloadTable = contentDlg.getChild("download_table");
        uploadTable = contentDlg.getChild("upload_table");
        downloadTable.setColWidthArr([downloadTable.w * 0.15, downloadTable.w * 0.18, downloadTable.w * 0.13, downloadTable.w * 0.13, downloadTable.w * 0.13, downloadTable.w * 0.18]);
        downloadTable.setHeadCols([Lp.getValue("Frequency") + " MHz", Lp.getValue("Signal_Strength") + " dBmV", "BER(%)", "Octets", "Correcteds", "Uncorrectables"]);
        uploadTable.setColWidthArr([uploadTable.w * 0.2, uploadTable.w * 0.3, uploadTable.w * 0.3, uploadTable.w * 0.2]);
        uploadTable.setHeadCols([Lp.getValue("Frequency") + " MHz", Lp.getValue("Signal_Strength") + " dBmV", Lp.getValue("Symbol_rate") + "kSym/s", Lp.getValue("Passageway") + Lp.getValue("Type")]);

        self.win.update();
    }
    this.open = function ()
    {
        this.defOpen();
        this.initView();
    };

    this.close = function ()
    {
        self.clearTimer();
        self.CMDialog.hide();
        this.defClose();
    };

    this.openTimer = function ()
    {
        if (self.timer != null) {
            self.closeTimer();
        }
        self.timer = setInterval(function ()
        {
            self.updateStatus();
        }, 1000 * 5)
    }

    this.clearTimer = function ()
    {
        if (self.timer != null) {
            clearInterval(self.timer);
        }
        self.timer = null;
    }

    this.start = function ()
    {
        showCMDialog();
        self.updateStatus();
        self.openTimer();
    };

    function getCMStatus(result)
    {
        console.log("getCMStatus is ok");
        self.CMInfo = result;
        self.CMDialog.hide();
        showInfo();
    }


    this.updateStatus = function ()
    {
        CableModem.cmGetStatus(getCMStatus);
    };

    function showCMDialog()
    {
        self.CMDialog = new LoadingDialog();
        self.CMDialog.create();
        var dialogTitle = Lp.getValue("CM_Information") + Lp.getValue("Searching");
        self.CMDialog.show(dialogTitle);
    }

    function showInfo()
    {
        if (null == self.CMInfo) {
            return;
        }
        if (self.CMInfo.downLink) {
            contentDlg.getChild("img_download").setSrc("setting/docsis_ico_green");
        }
        else {
            contentDlg.getChild("img_download").setSrc("setting/docsis_ico_gray");
        }

        if (self.CMInfo.upLink) {
            contentDlg.getChild("img_upload").setSrc("setting/docsis_ico_green");
        }
        else {
            contentDlg.getChild("img_upload").setSrc("setting/docsis_ico_gray");
        }

        if (6 <= self.CMInfo.online && self.CMInfo.online <= 12) {
            contentDlg.getChild("img_ranging").setSrc("setting/docsis_ico_green");
        }
        else {
            contentDlg.getChild("img_ranging").setSrc("setting/docsis_ico_gray");
        }

        if (self.CMInfo.online == 12) {
            contentDlg.getChild("img_online").setSrc("setting/docsis_ico_green");
            contentDlg.getChild("frequency_edit").setFocus(true);
        }
        else {
            contentDlg.getChild("img_online").setSrc("setting/docsis_ico_gray");
        }

        updateDownloadItem();
        updateUploadItem();
        updateIPInfo();

        self.win.update();
    }

    function updateDownloadItem()
    {
        downloadItems = new Array();
        var infoArr = self.CMInfo.downStreamInfo;
        for (var i = 0; i < 4 && i < infoArr.length; i++) {
            downloadItems[i] = new Array();
            downloadItems[i][0] = infoArr[i].freqency;
            downloadItems[i][1] = infoArr[i].power;
            var ber = new Number(infoArr[i].ber * 100);
            downloadItems[i][2] = ber.toFixed(4);
            downloadItems[i][3] = infoArr[i].octets;
            downloadItems[i][4] = infoArr[i].correcteds;
            downloadItems[i][5] = infoArr[i].uncorrectables;
        }

        downloadTable.removeItems();
        downloadTable.addItems(downloadItems);
    }

    function updateUploadItem()
    {
        uploadItems = new Array();
        var infoArr = self.CMInfo.upStreamInfo;
        for (var i = 0; i < 4 && i < infoArr.length; i++) {
            uploadItems[i] = new Array();
            uploadItems[i][0] = infoArr[i].freqency;
            uploadItems[i][1] = infoArr[i].power;
            uploadItems[i][2] = infoArr[i].symbol;
            uploadItems[i][3] = infoArr[i].channeltype;
        }

        uploadTable.removeItems();
        uploadTable.addItems(uploadItems);
    }

    function updateIPInfo()
    {
        var hfc_mac = contentDlg.getChild("hfc_mac");
        var cmIP = contentDlg.getChild("cm_ip");
        var cmversion = contentDlg.getChild("cmversion");
        var nowTime = contentDlg.getChild("time");

        var mac = self.CMInfo.hfcMac.replace(/ /g, ":");
        if (mac.substr(mac.length - 1, 1) == ":") {
            mac = mac.substr(0, mac.length - 1);
        }

        hfc_mac.value = mac;
        cmIP.value = numberToIp(self.CMInfo.cmip);
        cmversion.value = self.CMInfo.cmversion.replace(/"/g, "");
        nowTime.value = getCMTime();
    }

    function numberToIp(number)
    {
        var ip = "";
        if (number <= 0) {
            return ip;
        }
        var ip3 = (number << 0 ) >>> 24;
        var ip2 = (number << 8 ) >>> 24;
        var ip1 = (number << 16) >>> 24;
        var ip0 = (number << 24) >>> 24
        ip += ip3 + "." + ip2 + "." + ip1 + "." + ip0;
        return ip;
    }

    function getCMTime()
    {
        var date = new Date();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var min = date.getMinutes();
        var second = date.getSeconds();

        month = ( month < 10) ? "0" + month : "" + month;
        day = ( day < 10) ? "0" + day : "" + day;
        hour = ( hour < 10) ? "0" + hour : "" + hour;
        min = ( min < 10) ? "0" + min : "" + min;
        second = ( second < 10) ? "0" + second : "" + second;
        var str = month + "/" + day + " " + hour + ":" + min + ":" + second;
        return str;
    };

    function setFrequency()
    {

    }

    this.onkey = function (e)
    {
        var ret = false;
        console.log("onkey module keyCode =" + e.keyCode);
        switch (e.keyCode) {
            case UI.KEY.BACKSPACE:
                self.go(SystemSettingMenuPage);
                ret = true;
                break;
            case UI.KEY.ENTER:
                setFrequency();
                break;
        }
        return ret;
    };
}

CMInformationPage.prototype = UIModule.baseModule;

