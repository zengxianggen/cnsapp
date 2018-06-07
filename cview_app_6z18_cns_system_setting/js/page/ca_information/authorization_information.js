// JavaScript Document
var authorizationInformation = new AuthorizationInformation();

function AuthorizationInformation()
{

    var self = this;

    var font1 = uiCom.font.F20;

    var mainDlg;

    var tabAuthDlg;
    var tabWalletDlg;
    var tabCharDlg;

    var navNorDlg;
    var navFocusDlg;

    var bkNor;
    var bkFoc;

    var authTable;
    var walletTable;
    var charTable;

    var width_frame = caRightControl.width;
    var height_frame = caRightControl.height;
    var left_frame = caRightControl.left;
    var top_frame = caRightControl.top;

    var authListItems;
    var walletListItems;
    var charListItems;

    var callback;

    var operatorid;

    var left_start1 = 200;
    var top_nav = height_frame + 16;
    this.dlgParam = [
        {
            uiType: UIFrame,
            id: "bk",
            w: width_frame,
            h: height_frame,
            l: left_frame,
            t: top_frame,
            type: "3imgv",
            cls: "setting/systemSetRightBlue",
            focusMoveMode: "circle",
            visibility: 0
        },


        {uiType: UIImg, id: "nav1", w: 47, h: 26, ol: left_start1, ot: top_nav, src: "setting/ico_back"},
        {
            uiType: UILabel,
            id: "nav1_text",
            w: 200,
            h: 40,
            ol: left_start1 + 47 + 6,
            ot: top_nav - 3,
            value: Lp.getValue("Back"),
            font: font1
        }

    ];

    var width_tab = 105;
    var height_tab = 38;
    var left_tab = 30;
    var top_tab = 10;
    var width_space = width_tab + 20;

    var width_table = width_frame * 0.99;
    var height_table = height_frame * 0.73;

    var left_table = left_tab;
    var top_table = top_tab + 50;
    this.authInfoParam = [
        {
            uiType: UIFrame,
            id: "authorization_bk",
            w: width_frame,
            h: height_frame,
            l: left_frame,
            t: top_frame,
            styleClass: "None",
            visibility: 0
        },

        {
            uiType: UILabel,
            w: width_tab,
            h: height_tab,
            ol: left_tab,
            ot: top_tab,
            dt: 6,
            HAlign: "center",
            value: Lp.getValue("Authorization_Information"),
            font: font1,
            styleClass: "tab_current_bk"
        },
        {
            uiType: UILabel,
            w: width_tab,
            h: height_tab,
            ol: left_tab + width_space,
            ot: top_tab,
            dt: 6,
            HAlign: "center",
            value: Lp.getValue("E_Wallet"),
            font: font1,
            styleClass: "tab_dark_bk"
        },
        {
            uiType: UILabel,
            w: width_tab,
            h: height_tab,
            ol: left_tab + width_space * 2,
            ot: top_tab,
            dt: 6,
            HAlign: "center",
            value: Lp.getValue("Characteristic_Value"),
            font: font1,
            styleClass: "tab_dark_bk"
        },

        {
            uiType: UITable,
            id: "auth_table",
            w: width_table,
            h: height_table,
            ol: left_table,
            ot: top_table,
            lineRectWidth: 0,
            lineHWidth: 0,
            lineVWidth: 0,
            lineColor: "#505050",
            cols: 3,
            rows: 5,
            font: font1,
            rowsOnePage: 5,
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

        {
            uiType: UILabel,
            w: 200,
            h: 30,
            ol: 100,
            ot: top_table + height_table + 10,
            dt: 6,
            HAlign: "right",
            value: Lp.getValue("Authorization_Information_Quantity"),
            font: font1
        },

        {
            uiType: UILabel,
            id: "authorization_total",
            w: 50,
            h: 30,
            ol: 300 + 6,
            ot: top_table + height_table + 10,
            dt: 6,
            HAlign: "left",
            value: "0",
            font: font1
        },

    ]

    this.walletParam = [
        {
            uiType: UIFrame,
            id: "authorization_bk",
            w: width_frame,
            h: height_frame,
            l: left_frame,
            t: top_frame,
            styleClass: "None",
            visibility: 0
        },

        {
            uiType: UILabel,
            w: width_tab,
            h: height_tab,
            ol: left_tab,
            ot: top_tab,
            dt: 6,
            HAlign: "center",
            value: Lp.getValue("Authorization_Information"),
            font: font1,
            styleClass: "tab_dark_bk"
        },
        {
            uiType: UILabel,
            w: width_tab,
            h: height_tab,
            ol: left_tab + width_space,
            ot: top_tab,
            dt: 6,
            HAlign: "center",
            value: Lp.getValue("E_Wallet"),
            font: font1,
            styleClass: "tab_current_bk"
        },
        {
            uiType: UILabel,
            w: width_tab,
            h: height_tab,
            ol: left_tab + width_space * 2,
            ot: top_tab,
            dt: 6,
            HAlign: "center",
            value: Lp.getValue("Characteristic_Value"),
            font: font1,
            styleClass: "tab_dark_bk"
        },

        {
            uiType: UITable,
            id: "wallet_table",
            w: width_table,
            h: height_table,
            ol: left_table,
            ot: top_table,
            lineRectWidth: 0,
            lineHWidth: 0,
            lineVWidth: 0,
            lineColor: "#505050",
            cols: 3,
            rows: 5,
            font: font1,
            rowsOnePage: 5,
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
    ]

    this.characterParam = [
        {
            uiType: UIFrame,
            id: "authorization_bk",
            w: width_frame,
            h: height_frame,
            l: left_frame,
            t: top_frame,
            styleClass: "None",
            visibility: 0
        },

        {
            uiType: UILabel,
            w: width_tab,
            h: height_tab,
            ol: left_tab,
            ot: top_tab,
            dt: 6,
            HAlign: "center",
            value: Lp.getValue("Authorization_Information"),
            font: font1,
            styleClass: "tab_dark_bk"
        },
        {
            uiType: UILabel,
            w: width_tab,
            h: height_tab,
            ol: left_tab + width_space,
            ot: top_tab,
            dt: 6,
            HAlign: "center",
            value: Lp.getValue("E_Wallet"),
            font: font1,
            styleClass: "tab_dark_bk"
        },
        {
            uiType: UILabel,
            w: width_tab,
            h: height_tab,
            ol: left_tab + width_space * 2,
            ot: top_tab,
            dt: 6,
            HAlign: "center",
            value: Lp.getValue("Characteristic_Value"),
            font: font1,
            styleClass: "tab_current_bk"
        },

        {
            uiType: UITable,
            id: "char_table",
            w: width_table,
            h: height_table,
            ol: left_table,
            ot: top_table,
            lineRectWidth: 0,
            lineHWidth: 0,
            lineVWidth: 0,
            lineColor: "#505050",
            cols: 2,
            rows: 5,
            font: font1,
            rowsOnePage: 5,
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
    ]

    this.initDlg = function (parent)
    {

        mainDlg = UI.createGroup(self.dlgParam, "mainDlg", parent, null, null, self.proc);

        tabAuthDlg = UI.createGroup(self.authInfoParam, "tabAuthDlg", mainDlg);
        tabWalletDlg = UI.createGroup(self.walletParam, "tabWalletDlg", mainDlg);
        tabCharDlg = UI.createGroup(self.characterParam, "tabAuthDlg", mainDlg);

        authTable = tabAuthDlg.getChild("auth_table");
        walletTable = tabWalletDlg.getChild("wallet_table");
        charTable = tabCharDlg.getChild("char_table");

        authTable.setColWidthArr([authTable.w * 0.35, authTable.w * 0.3, authTable.w * 0.35]);
        authTable.setHeadCols([Lp.getValue("Program_Authorization_ID"), Lp.getValue("Video"), Lp.getValue("End_Time")]);

        walletTable.setColWidthArr([walletTable.w * 0.35, walletTable.w * 0.3, walletTable.w * 0.35]);
        walletTable.setHeadCols([Lp.getValue("Wallet_ID"), Lp.getValue("Credit_Points"), Lp.getValue("Spent_Points")]);

        charTable.setColWidthArr([charTable.w * 0.4, charTable.w * 0.6]);
        charTable.setHeadCols([Lp.getValue("Name"), Lp.getValue("Characteristic_Value")]);

    }

    this.hide = function ()
    {
        mainDlg.visibility = 0;
        mainDlg.update();
    }

    this.show = function (callbackp, id)
    {

        mainDlg.visibility = 1;
        callback = callbackp;
        operatorid = id;
        authShow();
    }

    function authShow()
    {
        authListItems = new Array();
        authTable.removeItems();
        console.log("operatorid == " + operatorid);
        tabAuthDlg.visibility = 1;

        CA.getEntitles(operatorid, function (data)
        {

            if (tabAuthDlg.visibility == 0) {
                return;
            }
            if (data && data.errorcode == 0 && data.entitleinfo) {

                for (var i = 0; i < data.entitleinfo.length; i++) {
                    authListItems[i] = new Array();
                    authListItems[i][0] = data.entitleinfo[i].productid;
                    authListItems[i][1] = data.entitleinfo[i].cantape;
                    authListItems[i][2] = data.entitleinfo[i].expiredDate;
                    console.log("authListItems[i][0] == " + authListItems[i][0]);
                }
                if (authListItems.length > 0) {

                    authTable.addItems(authListItems);
                    authTable.setFocus(true);
                    tabAuthDlg.getChild("authorization_total").value = authListItems.length;
                    tabAuthDlg.update();
                }
            }
        });


        tabAuthDlg.update();
    }


    function authHide()
    {
        tabAuthDlg.visibility = 0;
    }

    function walletShow()
    {
        walletListItems = new Array();
        walletTable.removeItems();
        var params = {
            "cacmd": 532,
            "operatorid": operatorid
        }
        tabWalletDlg.visibility = 1;
        var data = CA.caCommand(params, false);
        if (data && data.errorcode == 0 && data.tokeninfo) {
            for (var i = 0; i < data.tokeninfo.lengthl; i++) {
                walletListItems[i] = new Array();
                walletListItems[i][0] = data.tokeninfo[i].tokenid;
                walletListItems[i][1] = data.tokeninfo[i].creditlimit;
                walletListItems[i][2] = data.tokeninfo[i].balance;
            }
            if (walletListItems.length > 0) {

                walletTable.addItems(walletListItems);
                walletTable.setFocus(true);
            }
        }


        tabWalletDlg.update();
    }

    function walletHide()
    {
        tabWalletDlg.visibility = 0;
    }

    function charShow()
    {
        charListItems = new Array();
        charTable.removeItems();
        tabCharDlg.visibility = 1;
        var data = CA.getAcList(operatorid, false);
        if (data && data.errorcode == 0) {
            var j = 0;
            if (typeof(data.areacode) !="undefined") {
                charListItems[j] = new Array();
                charListItems[j][0] = "AreaCode";
                charListItems[j][1] = data.areacode;
                j++;
            }

            if (typeof(data.bouquetid) !="undefined" ) {
                charListItems[j] = new Array();
                charListItems[j][0] = "BouquetID";
                charListItems[j][1] = data.bouquetid;
                j++;
            }

            if (data.otherdatas && data.otherdatas.length > 0) {
                for (var i = 0; i < data.otherdatas.length; i++) {
                    charListItems[j] = new Array();
                    var json = data.otherdatas[i];
                    for (var key in json) {
                        if (json.hasOwnProperty(key)) {
                            var tmp = i+3;
                            charListItems[j][0] = "AC-"+tmp;
                            charListItems[j][1] = json[key];
                            j++;
                        }
                    }
                }
            }
            if (charListItems.length > 0) {

                charTable.addItems(charListItems);
                charTable.setFocus(true);
            }
        }


        tabCharDlg.update();
    }

    function charHide()
    {
        tabCharDlg.visibility = 0;
    }

    this.setFocus = function ()
    {
        authTable.setFocus(true);
        return true;
    }

    this.loseFocus = function ()
    {
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
                callback();
                self.hide();
                ret = true;
                break;
            case UI.KEY.LEFT:
            case UI.KEY.RIGHT:
                tabControl.switchTab(keyCode);
                ret = true;
                break;
        }
        return ret;
    }

    var tabControl = {
        index: 0,
        total: 3,
        showArr: [authShow, walletShow, charShow],
        hideArr: [authHide, walletHide, charHide],
        switchTab: function (keyCode)
        {
            if (keyCode == UI.KEY.LEFT) {
                this.hideArr[this.index]();
                this.index = (this.index - 1) < 0 ? (this.index - 1) + this.total : (this.index - 1);
                this.showArr[this.index]();
            }

            if (keyCode == UI.KEY.RIGHT) {
                this.hideArr[this.index]();
                this.index = (this.index + 1) % this.total;
                this.showArr[this.index]();
            }
        }
    }
}