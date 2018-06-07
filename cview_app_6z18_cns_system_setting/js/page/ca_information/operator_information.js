// JavaScript Document
var operatorInformation = new OperatorInformation();

function OperatorInformation()
{

    var self = this;

    var font1 = uiCom.font.F20;

    var mainDlg;
    var navNorDlg;
    var navFocusDlg;

    var bkNor;
    var bkFoc;

    var operatorTable;

    var width_frame = caRightControl.width;
    var height_frame = caRightControl.height;
    var left_frame = caRightControl.left;
    var top_frame = caRightControl.top;


    var width_table = width_frame * 0.8;
    var height_table = height_frame * 0.9;
    var top_table = 10;
    var left_table = 33;

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
            uiType: UITable,
            id: "operator_table",
            w: width_table,
            h: height_table,
            ol: left_table,
            ot: top_table,
            lineRectWidth: 0,
            lineHWidth: 0,
            lineVWidth: 0,
            lineColor: "#505050",
            cols: 2,
            rows: 7,
            font: font1,
            rowsOnePage: 7,
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
            visibility: 0
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
            ol: left_start1 + 260 + 47,
            ot: -3,
            value: Lp.getValue("Authorization_Information"),
            font: font1
        }
    ];

    this.initData = function ()
    {
        listItems = new Array();

    }


    this.initDlg = function (parent)
    {

        mainDlg = UI.createGroup(self.dlgParam, "mainDlg", parent, null, null, self.proc);
        authorizationInformation.initDlg(parent);
        navNorDlg = UI.createGroup(self.navNormalParam, "navNorDlg", mainDlg);
        navFocusDlg = UI.createGroup(self.navFocusParam, "navFocusDlg", mainDlg);

        bkNor = mainDlg.getChild("bk_grey");
        bkFoc = mainDlg.getChild("bk_blue");


        operatorTable = mainDlg.getChild("operator_table");

        operatorTable.setColWidthArr([operatorTable.w * 0.4, operatorTable.w * 0.6]);
        operatorTable.setHeadCols([Lp.getValue("Operator_ID"), Lp.getValue("Operator_Name")]);


    }

    function updateView()
    {
        listItems = new Array();
        var data = CA.getOperators(false);

        if (data && data.errorcode == 0 && data.operatorinfo) {
            for (var i = 0; i < data.operatorinfo.length; i++) {
                listItems[i] = new Array();
                listItems[i][0] = data.operatorinfo[i].operatorid;
                listItems[i][1] = data.operatorinfo[i].privateinfo;
            }
        }

        if (listItems.length > 0) {
            operatorTable.removeItems();
            operatorTable.addItems(listItems);
        }
    }

    this.hide = function ()
    {
        mainDlg.visibility = 0;
    }

    this.show = function ()
    {
        updateView();
        mainDlg.visibility = 1;

    }

    this.setFocus = function ()
    {
        operatorTable.setFocus(true);
        bkNor.visibility = 0;
        bkFoc.visibility = 1;
        navNorDlg.visibility = 0;
        navFocusDlg.visibility = 1;
        mainDlg.visibility = 1;
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

    function keyEnter()
    {
        var index = operatorTable.curIndex;
        self.hide();
        authorizationInformation.show(self.setFocus, listItems[index][0]);
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
            case UI.KEY.ENTER:
                keyEnter();
                break;
        }

        return ret;
    }
}