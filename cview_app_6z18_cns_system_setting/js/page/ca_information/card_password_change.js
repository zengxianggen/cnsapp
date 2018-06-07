// JavaScript Document
var cardPasswordChange = new CardPasswordChange();

function CardPasswordChange()
{

    var self = this;

    var font1 = uiCom.font.F20;

    var mainDlg;
    var navNorDlg;
    var navFocusDlg;

    var bkNor;
    var bkFoc;

    var stbTable;

    var tipsDlg;

    var width_frame = caRightControl.width;
    var height_frame = caRightControl.height;
    var left_frame = caRightControl.left;
    var top_frame = caRightControl.top;

    var width_title = width_frame * 0.30;
    var width_con = width_frame * 0.60;
    var height_title = 30;
    var height_con = 40;
    var height_item = 50;
    var left_title = 16;
    var left_con = left_title + width_title + 5;
    var top_title = 80;
    var top_con = top_title - 5;

    var item_dt = 6;

    var timer = null;


    this.dlgParam = [
        {
            uiType: UIFrame,
            id: "bk",
            w: width_frame,
            h: height_frame,
            l: left_frame,
            t: top_frame,
            styleClass: "None",
            focusMoveMode: "circle"
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
            h: height_title,
            ol: left_title,
            ot: top_title,
            dt: item_dt,
            HAlign: "right",
            value: Lp.getValue("Input_Password") + ":",
            font: font1
        },
        {
            uiType: UIEdit,
            id: "password_edit",
            w: width_con,
            h: height_con,
            ol: left_con,
            ot: top_con,
            dt: item_dt,
            HAlign: "left",
            value: "",
            font: font1,
            styleClass: "setting_edit_item",
            password: true
        },

        {
            uiType: UILabel,
            w: width_title,
            h: height_title,
            ol: left_title,
            ot: top_title + height_item,
            dt: item_dt,
            HAlign: "right",
            value: Lp.getValue("New_Password") + ":",
            font: font1
        },
        {
            uiType: UIEdit,
            id: "new_password_edit",
            w: width_con,
            h: height_con,
            ol: left_con,
            ot: top_con + height_item,
            dt: item_dt,
            HAlign: "left",
            value: "",
            font: font1,
            styleClass: "setting_edit_item",
            password: true
        },

        {
            uiType: UILabel,
            w: width_title,
            h: height_title,
            ol: left_title,
            ot: top_title + height_item * 2,
            dt: item_dt,
            HAlign: "right",
            value: Lp.getValue("Confirm_Password") + ":",
            font: font1
        },
        {
            uiType: UIEdit,
            id: "confirm_password_edit",
            w: width_con,
            h: height_con,
            ol: left_con,
            ot: top_con + height_item * 2,
            dt: item_dt,
            HAlign: "left",
            value: "",
            font: font1,
            styleClass: "setting_edit_item",
            password: true
        },

    ];


    var width_tips = width_frame * 2 / 3;
    var height_tips = 170;
    var left_tips = 30 + (width_frame - width_tips) / 2;
    var top_tips = (height_frame - height_tips) / 2;
    left_start1 = 20;
    var tipsParam = [
        {
            uiType: UIFrame,
            id: "dialog_bk",
            w: width_tips,
            h: height_tips,
            ol: left_tips,
            ot: top_tips,
            styleClass: "system_setting_bk",
            visibility: 0
        },
        {
            uiType: UILabel,
            id: "tips_title",
            w: width_tips,
            h: 40,
            ol: 0,
            ot: 6,
            value: Lp.getValue("Tips"),
            font: font1,
            HAlign: "center"
        },
        {
            uiType: UILabel,
            id: "tips_label",
            w: width_tips,
            h: 40,
            ol: 0,
            ot: 70,
            value: Lp.getValue("Save_Sucessful"),
            font: font1,
            HAlign: "center"
        },
    ]

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
        }];


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
            value: Lp.getValue("Tips"),
            font: font1
        }
    ];

    this.initData = function ()
    {

    }


    this.initDlg = function (parent)
    {
        this.initData();
        mainDlg = UI.createGroup(self.dlgParam, "mainDlg", parent, null, null, self.proc);
        navNorDlg = UI.createGroup(self.navNormalParam, "navNorDlg", mainDlg);
        navFocusDlg = UI.createGroup(self.navFocusParam, "navFocusDlg", mainDlg);

        bkNor = mainDlg.getChild("bk_grey");
        bkFoc = mainDlg.getChild("bk_blue");

        tipsDlg = UI.createGroup(tipsParam, "tipsDlg", mainDlg);
    }

    this.hide = function ()
    {
        mainDlg.visibility = 0;
    }

    this.show = function ()
    {
        mainDlg.visibility = 1;
    }

    this.setFocus = function ()
    {
        mainDlg.getChild("password_edit").setFocus(true);
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

    function getOldPassword()
    {
        return "9999";
    }

    function setNewPassword()
    {

    }

    function keyEnter()
    {
        var p1 = mainDlg.getChild("password_edit").value;
        var p2 = mainDlg.getChild("new_password_edit").value;
        var p3 = mainDlg.getChild("confirm_password_edit").value;

        if (p1 == "") {
            tipsDlg.getChild("tips_label").value = Lp.getValue("Pls_Input_Passwd");
            openTimer();
            return;
        }

        if (p2 == "") {
            tipsDlg.getChild("tips_label").value = Lp.getValue("Please_Input_New_Password");
            openTimer();
            return;
        }

        if (p3 == "") {
            tipsDlg.getChild("tips_label").value = Lp.getValue("Please_Input_Confirm_Password");
            openTimer();
            return;
        }

        if (p2 != p3) {
            tipsDlg.getChild("tips_label").value = Lp.getValue("New_And_Confirm_Password_Is_Different");
            openTimer();
            return;
        }

        console.log(sysCom.config.PurchasePIN);

        var data = CA.setPinCode(sysCom.config.PurchasePIN, p2, false);
        if (data && data.errorcode == 0) {
            tipsDlg.getChild("tips_label").value = Lp.getValue("Password_Change_Sucessful");
            sysCom.config.PurchasePIN = p2;
            openTimer();
            return;
        }
        else {
            tipsDlg.getChild("tips_label").value = Lp.getValue("Change_Password_Failed");
            openTimer();
            return;
        }
    }

    function openTimer()
    {
        if (timer != null) {
            clearTimer();
        }
        tipsDlg.visibility = 1;
        tipsDlg.update();
        timer = setTimeout(function ()
        {
            tipsDlg.visibility = 0;
            tipsDlg.update();
            clearTimer();
        }, sysCom.config.displayTime * 1000);
    }

    function clearTimer()
    {
        if (timer != null) {
            clearTimeout(timer);
            timer = null;
        }
    }

    function tipsFastHide()
    {
        tipsDlg.visibility = 0;
        tipsDlg.update();
        clearTimer();
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