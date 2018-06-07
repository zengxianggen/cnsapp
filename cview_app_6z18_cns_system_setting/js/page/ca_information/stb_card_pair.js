// JavaScript Document
var stbCardPair = new StbCardPair();

function StbCardPair()
{

    var self = this;

    var font1 = uiCom.font.F20;

    var mainDlg;
    var navNorDlg;
    var navFocusDlg;

    var bkNor;
    var bkFoc;
    var pairedStatus;

    var stbTable;

    var width_frame = caRightControl.width;
    var height_frame = caRightControl.height;
    var left_frame = caRightControl.left;
    var top_frame = caRightControl.top;

    var width_title = width_frame * 0.30;
    var width_con = width_frame * 0.66;
    var left_title = 16;
    var left_con = left_title + width_title + 5;
    var top_label = 10;
    var height_label = 30;
    var item_dt = 6;

    var width_table = width_frame * 0.8;
    var height_table = height_frame * 0.8;
    var top_table = top_label + 50;
    var left_table = left_title + 13;

    var listItems;

    this.dlgParam = [
        {
            uiType: UIFrame,
            id: "bk",
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
            visibility: 0
        },

        {
            uiType: UILabel,
            w: width_title,
            h: height_label,
            ol: left_title,
            ot: top_label,
            dt: item_dt,
            HAlign: "right",
            value: Lp.getValue("STB_Card_Pairing_Status") + ":",
            font: font1
        },

        {
            uiType: UILabel,
            id: "paired_status",
            w: width_con,
            h: height_label,
            ol: left_con,
            ot: top_label,
            dt: item_dt,
            HAlign: "left",
            value: "",
            font: font1
        },

        {
            uiType: UITable,
            id: "stb_table",
            w: width_table,
            h: height_table,
            ol: left_table,
            ot: top_table,
            lineRectWidth: 0,
            lineHWidth: 0,
            lineVWidth: 0,
            lineColor: "#505050",
            cols: 2,
            rows: 6,
            font: font1,
            rowsOnePage: 6,
            HAlign: "left",
            dl: 5,
            dt: -1,
            headColor: "#51cc71",
            headUse: true,
            skin: {
                headBar: {type: "none"},
                normalBar: {type: "none"},
                focusBar: {type: "3imgh", cls: "setting/bluebar"},
            }
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
            ol: left_start1 + 34 + 6,
            ot: -3,
            value: Lp.getValue("Move_Focus_Right"),
            font: font1
        },
        {uiType: UIImg, id: "nav1", w: 47, h: 26, ol: left_start1 + 260, ot: 0, src: "setting/ico_back"},
        {
            uiType: UILabel,
            id: "nav1_text",
            w: 200,
            h: 40,
            ol: left_start1 + 260 + 47 + 6,
            ot: -3,
            value: Lp.getValue("UP_Page"),
            font: font1
        }
    ];

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
        {uiType: UIImg, w: 34, h: 26, ol: left_start1, ot: 0, src: "setting/ico_back"},
        {
            uiType: UILabel,
            id: "nav1_text",
            w: 200,
            h: 40,
            ol: left_start1 + 54 + 6,
            ot: -3,
            value: Lp.getValue("Move_Focus_Left"),
            font: font1
        },
        {uiType: UIImg, w: 47, h: 26, ol: left_start1 + 260, ot: 0, src: "setting/ico_ok"},
        {
            uiType: UILabel,
            id: "nav2_text",
            w: 200,
            h: 40,
            ol: left_start1 + 260 + 47 + 6,
            ot: -3,
            value: Lp.getValue("Select"),
            font: font1
        }
    ];

    this.initData = function ()
    {
        listItems = new Array();
        for (var i = 0; i < 8; i++) {
            listItems[i] = new Array();
            listItems[i][0] = i + 1;
            listItems[i][1] = "10000000000" + i;
        }
    }


    this.initDlg = function (parent)
    {

        mainDlg = UI.createGroup(self.dlgParam, "mainDlg", parent, null, null, self.proc);
        navNorDlg = UI.createGroup(self.navNormalParam, "navNorDlg", mainDlg);
        navFocusDlg = UI.createGroup(self.navFocusParam, "navFocusDlg", mainDlg);

        bkNor = mainDlg.getChild("bk_grey");
        bkFoc = mainDlg.getChild("bk_blue");
        pairedStatus = mainDlg.getChild("paired_status");

        stbTable = mainDlg.getChild("stb_table");

        stbTable.setColWidthArr([stbTable.w * 0.4, stbTable.w * 0.6]);
        stbTable.setHeadCols([Lp.getValue("Serial_Number"), "STB ID"]);


    }

    function updateView()
    {
        listItems = new Array();
        var data = CA.getPaired(false);
        console.log("updateView data == " + JSON.stringify(data));
        switch (data.pairedstate) {
            case 0:
                pairedStatus.value = Lp.getValue("Is_Paired");
                break;
            case 35:
                pairedStatus.value = Lp.getValue("Invalid_card");
                break;
            case 39:
                pairedStatus.value = Lp.getValue("Other_Paired");
                break;
            case 45:
                pairedStatus.value = Lp.getValue("No_Paired");
                break;
        }

        if (data && data.errorcode == 0 && data.pairednum > 0) {

            for (var i = 0; i < data.pairednum; i++) {
                listItems[i] = new Array();
                listItems[i][0] = i + 1;
                listItems[i][1] = data.stbidlist[i].stbid;
            }
        }

        if (listItems.length > 0) {
            stbTable.removeItems();
            stbTable.addItems(listItems);
        }
    }

    this.hide = function ()
    {
        mainDlg.visibility = 0;
    }

    this.show = function ()
    {
        mainDlg.visibility = 1;
        updateView();

    }

    this.setFocus = function ()
    {
        stbTable.setFocus(true);
        bkNor.visibility = 0;
        bkFoc.visibility = 1;
        navNorDlg.visibility = 0;
        navFocusDlg.visibility = 1;
        return true;
    }

    this.loseFocus = function ()
    {

        bkNor.visibility = 1;
        bkFoc.visibility = 0;
        navFocusDlg.visibility = 0;
        navNorDlg.visibility = 1;
    }

    this.getInfo = function ()
    {

        var defaultInfo = {
            range: "192.168.202.1"
        }

        return defaultInfo;
    }


    this.proc = function (e)
    {
        var keyCode = e.keyCode;
        console.log("ip_information keyCode == " + keyCode);
        var ret = false;
        switch (keyCode) {
            case UI.KEY.BACKSPACE:
                caRightControl.subLoseFocus();
                break;
            case UI.KEY.OK:

                break;
        }

        return ret;
    }
}