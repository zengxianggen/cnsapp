// JavaScript Document
var cmInformation = new CMInformation();

function CMInformation()
{

    var self = this;

    var font1 = uiCom.font.F20;
    var font2 = uiCom.font.F25;

    var color1 = "grey";
    var color2 = "white";
    var color3 = "#51cc71";

    var mainDlg;

    var navNorDlg;
    var navFocusDlg;

    var bkNor;
    var bkFoc;


    var downTable;
    var upTable;
    var ListItems = [];

    var downListItems;
    var upListItems;


    var tipsDlg;


    var width_frame = cmRightControl.width;
    var height_frame = cmRightControl.height;
    var left_frame = cmRightControl.left;
    var top_frame = cmRightControl.top;


    var top_item = 10;
    var height_item = 36;

    var width_table = width_frame * 0.95;
    var height_table = 100;
    var left_table = (width_frame - width_table) / 2;

    var mainParam = [
        {
            uiType: UIFrame,
            id: "right_bk",
            w: width_frame,
            h: height_frame,
            l: left_frame,
            t: top_frame,
            styleClass: "None",
            focusMoveMode: "circle",
            visibility: 0
        },
        {
            uiType: UIFrame,
            id: "bk_grey",
            w: width_frame,
            h: height_frame,
            l: left_frame,
            t: top_frame,
            type: "3imgv",
            cls: "setting/systemSetRightGrey",
            stretch: "HV"
        },
        {
            uiType: UIFrame,
            id: "bk_blue",
            w: width_frame,
            h: height_frame,
            l: left_frame,
            t: top_frame,
            type: "3imgv",
            cls: "setting/systemSetRightBlue",
            stretch: "HV",
            visibility: 0
        },
        {
            uiType: UILabel,
            id: "cm_mode_title1",
            w: width_frame * 0.5,
            h: 30,
            ol: 3,
            ot: top_item,
            dt: 5,
            HAlign: "right",
            value: Lp.getValue("CM_Mode") + ":",
            font: font1,
            color: color3
        },
        {
            uiType: UILabel,
            id: "cm_mode_title2",
            w: width_frame * 0.5,
            h: 30,
            ol: 3 + width_frame * 0.5 + 3,
            ot: top_item,
            dt: 5,
            HAlign: "left",
            value: Lp.getValue("Switch_On"),
            font: font1
        },

        {
            uiType: UILabel,
            id: "cm_mode_title3",
            w: width_frame * 0.5,
            h: 30,
            ol: 3,
            ot: top_item + height_item,
            dt: 5,
            HAlign: "right",
            value: Lp.getValue("DOCSIS_Status") + ":",
            font: font1,
            color: color3
        },
        {
            uiType: UILabel,
            id: "cm_mode_title4",
            w: width_frame * 0.5,
            h: 30,
            ol: 3 + width_frame * 0.5 + 3,
            ot: top_item = top_item + height_item,
            dt: 5,
            HAlign: "left",
            value: Lp.getValue("Searching"),
            font: font1
        },

        {
            uiType: UILabel,
            id: "down_title",
            w: width_frame * 0.5,
            h: 30,
            ol: 20,
            ot: top_item = top_item + height_item,
            dt: 5,
            HAlign: "left",
            value: Lp.getValue("Down_Frequency_Point_Status"),
            font: font1,
            color: color3
        },

        {
            uiType: UIFrame,
            id: "bk",
            w: width_frame * 0.95,
            h: 3,
            ol: (width_frame - width_frame * 0.95) / 2,
            ot: top_item = top_item + 30,
            styleClass: "green_block_bk",
            visibility: 1
        },

        {
            uiType: UITable,
            id: "down_table",
            w: width_table,
            h: height_table,
            ol: left_table,
            ot: (top_item = top_item + 10),
            lineRectWidth: 0,
            lineHWidth: 0,
            lineVWidth: 0,
            lineColor: "#505050",
            font: font1,
            cols: 4,
            rows: 4,
            rowsOnePage: 4,
            HAlign: "left",
            dl: 1,
            dt: -1,
            color: color2,
            focusColor: color2,
            focusStop: false,
            skin: {
                headBar: {type: "none"},
                normalBar: {type: "none"},
            }
        },

        {
            uiType: UILabel,
            id: "up_title",
            w: width_frame * 0.5,
            h: 30,
            ol: 20,
            ot: top_item = top_item + height_table + 20,
            dt: 5,
            HAlign: "left",
            value: Lp.getValue("Up_Frequency_Point_Status"),
            font: font1,
            color: color3
        },

        {
            uiType: UIFrame,
            id: "bk",
            w: width_frame * 0.95,
            h: 3,
            ol: (width_frame - width_frame * 0.95) / 2,
            ot: top_item = top_item + 30,
            styleClass: "green_block_bk",
            visibility: 1
        },

        {
            uiType: UITable,
            id: "up_table",
            w: width_table,
            h: height_table,
            ol: left_table,
            ot: (top_item = top_item + 10),
            lineRectWidth: 0,
            lineHWidth: 0,
            lineVWidth: 0,
            lineColor: "#505050",
            font: font1,
            cols: 4,
            rows: 4,
            rowsOnePage: 4,
            HAlign: "left",
            dl: 1,
            dt: -1,
            color: color2,
            focusColor: color2,
            focusStop: false,
            skin: {
                headBar: {type: "none"},
                normalBar: {type: "none"},
            }
        },

    ];


    var width_tips = width_frame * 0.95;
    var height_tips = height_frame * 0.4;
    var left_tips = (width_frame - width_tips) / 2;
    var top_tips = (height_frame - height_tips) / 2;
    var tipsParam = [
        {
            uiType: UIFrame,
            w: width_tips,
            h: height_tips,
            ol: left_tips,
            ot: top_tips,
            styleClass: "dialog_tips",
            visibility: 0
        },
        {
            uiType: UILabel,
            id: "tips_title",
            w: width_tips,
            h: 30,
            ol: 0,
            ot: 1,
            dt: 5,
            HAlign: "center",
            value: Lp.getValue("Tips"),
            font: font1
        },
        {
            uiType: UILabel,
            id: "tips_con",
            w: width_tips,
            h: 30,
            ol: 0,
            ot: 45,
            HAlign: "center",
            value: Lp.getValue("No_CM_Tips"),
            font: font1
        },
    ];


    var left_start1 = 10;
    this.navNormalParam = [
        {
            uiType: UIFrame,
            id: "dialog_bk",
            w: width_frame,
            h: 60,
            ol: 0,
            ot: height_frame + 18,
            styleClass: "None",
            visibility: 1
        },
        {uiType: UIImg, id: "nav1", w: 34, h: 26, ol: left_start1, ot: 0, src: "setting/ico_rightArrow"},
        {
            uiType: UILabel,
            id: "nav1_text",
            w: 200,
            h: 40,
            ol: left_start1 = left_start1 + 34 + 6,
            ot: -3,
            value: Lp.getValue("Move_Focus_Right"),
            font: font1
        },
        {
            uiType: UIImg,
            id: "nav2",
            w: 47,
            h: 26,
            ol: left_start1 = left_start1 + 200 + 10,
            ot: 0,
            src: "setting/ico_back"
        },
        {
            uiType: UILabel,
            id: "nav1_text",
            w: 80,
            h: 40,
            ol: left_start1 = left_start1 + 47 + 6,
            ot: -3,
            value: Lp.getValue("Up_Page"),
            font: font1
        },
    ];

    left_start1 = 10;
    this.navFocusParam = [
        {
            uiType: UIFrame,
            id: "dialog_bk",
            w: width_frame,
            h: 60,
            ol: 0,
            ot: height_frame + 18,
            styleClass: "None",
            visibility: 0
        },
        {uiType: UIImg, id: "nav1", w: 34, h: 26, ol: left_start1, ot: 0, src: "setting/ico_rightArrow"},
        {
            uiType: UILabel,
            id: "nav1_text",
            w: 200,
            h: 40,
            ol: left_start1 = left_start1 + 34 + 6,
            ot: -3,
            value: Lp.getValue("Move_Focus_Left"),
            font: font1
        },
        {
            uiType: UIImg,
            id: "nav2",
            w: 34,
            h: 26,
            ol: left_start1 = left_start1 + 200 + 10,
            ot: 0,
            src: "setting/ico_four_direction_dark"
        },
        {
            uiType: UILabel,
            id: "nav2_text",
            w: 80,
            h: 40,
            ol: left_start1 = left_start1 + 34 + 6,
            ot: -3,
            value: Lp.getValue("Save"),
            font: font1
        },
        {
            uiType: UIImg,
            id: "nav3",
            w: 23,
            h: 20,
            ol: left_start1 = left_start1 + 80 + 10,
            ot: 0,
            src: "setting/ico_blue"
        },
        {
            uiType: UILabel,
            id: "nav3_text",
            w: 150,
            h: 40,
            ol: left_start1 = left_start1 + 23 + 6,
            ot: -3,
            value: Lp.getValue("Display_Password"),
            font: font1
        },
    ];

    this.initDlg = function (parent)
    {
        mainDlg = UI.createGroup(mainParam, "mainDlg", parent, null, null, self.main_proc);

        navNorDlg = UI.createGroup(self.navNormalParam, "navNorDlg", mainDlg);
        navFocusDlg = UI.createGroup(self.navFocusParam, "navFocusDlg", mainDlg);

        bkNor = mainDlg.getChild("bk_grey");
        bkFoc = mainDlg.getChild("bk_blue");

        downTable = mainDlg.getChild("down_table");
        downTable.setColWidthArr([downTable.w * 0.3, downTable.w * 0.2, downTable.w * 0.25, downTable.w * 0.25]);

        upTable = mainDlg.getChild("up_table");
        upTable.setColWidthArr([upTable.w * 0.3, upTable.w * 0.2, upTable.w * 0.25, upTable.w * 0.25]);

        tipsDlg = UI.createGroup(tipsParam, "tipsDlg", mainDlg);
    };

    function showCMDialog()
    {
        self.CMDialog = new LoadingDialog();
        self.CMDialog.create();
        var dialogTitle = Lp.getValue("CM_Information") + Lp.getValue("Searching");
        self.CMDialog.show(dialogTitle);
    };

    function updateView()
    {
        if (null == self.CMInfo) {
            return;
        }
        var DOCSISStatus = mainDlg.getChild("cm_mode_title4");
        if (self.CMInfo.online == 12) {
            DOCSISStatus.value = Lp.getValue("Already_On_Line");
        }
        else {
            DOCSISStatus.value = Lp.getValue("Searching");
        }
        var downInfos = self.CMInfo.downStreamInfo;
        downListItems = new Array();
        for (var i = 0; i < 4; i++) {
            var j = i + 1;
            if (j <= downInfos.length) {
                downListItems[i] = new Array();
                downListItems[i][0] = "Frequency" + j + ":" + checkData(downInfos[i].freqency);
                downListItems[i][1] = "/ SNR" + i + ":" + checkData(downInfos[i].snr);
                downListItems[i][2] = "/ Power" + i + ":" + checkData(downInfos[i].power);
                var ber = new Number(downInfos[i].ber * 100);
                downListItems[i][3] = "/ BER(%)" + i + ":" + ber.toFixed(4);
            }
            else {
                downListItems[i] = new Array();
                downListItems[i][0] = "Frequency" + j + ":";
                downListItems[i][1] = "";
                downListItems[i][2] = "";
                downListItems[i][3] = "";
            }
        }

        var upInfos = self.CMInfo.upStreamInfo;
        upListItems = new Array();

        for (var i = 0; i < 4; i++) {
            var j = i + 1;
            if (j <= upInfos.length) {
                upListItems[i] = new Array();
                upListItems[i][0] = "Frequency" + j + ":" + checkData(upInfos[i].freqency);
                upListItems[i][1] = "/ SNR" + i + ":N/A";
                upListItems[i][2] = "/ Power" + i + ":" + checkData(upInfos[i].power);
                upListItems[i][3] = "/ BER(%)" + i + ":N/A";
            }
            else {
                upListItems[i] = new Array();
                upListItems[i][0] = "Frequency" + j + ":";
                upListItems[i][1] = "";
                upListItems[i][2] = "";
                upListItems[i][3] = "";
            }
        }

        downTable.removeItems();
        downTable.addItems(downListItems);

        upTable.removeItems();
        upTable.addItems(upListItems);

        downTable.update();

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
    };

    function checkData(a)
    {
        if (a == null) {
            a = "N/A"
        }
        return a;
    }

    function getCMStatus(result)
    {
        console.log("getCMStatus is ok");
        self.CMInfo = result;
        self.CMDialog.hide();
        updateView();
    }

    this.hide = function ()
    {
        self.CMDialog.hide();
        mainDlg.visibility = 0;
        self.clearTimer();
    }

    this.updateStatus = function ()
    {
        CableModem.cmGetStatus(getCMStatus);
    }

    this.show = function ()
    {
        mainDlg.visibility = 1;
        showCMDialog();
        self.updateStatus();
        self.openTimer();
    }

    this.setFocus = function ()
    {
        return false;
    }

    this.loseFocus = function ()
    {

    }

    function showTips()
    {
        tipsDlg.visibility = 1;
    }

    this.main_proc = function (e)
    {
        switch (e.keyCode) {
            case UI.KEY.BACKSPACE:
                cmRightControl.subLoseFocus();
                break;
        }
        return true;
    }
}