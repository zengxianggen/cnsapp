function keyCommon() {
    var self = this;
    var gongcheng_mode = 0;
    var last_green_key = 0;
    var lastkeytime = 0;


    this.checkAutoStandby = function () {
        var nowtime = new Date().getTime();
        var diff = nowtime - lastkeytime;
        if (sysCom.config.AutoStandby == 0) {
            return;
        }
        if (diff >= 5 * 60 * 60 * 1000)//五小时无操作自动进入待机
        {
            var nostandby = sysCom.getMemConfig("nostandby");
            if (nostandby == 1) {
                sysCom.setMemConfig("nostandby", 0);
                window.location.href = "file:////application/cview/cview_app_6z18_cns_standby/index.html";

            }
        }
    };

    this.init = function () {

        lastkeytime = new Date().getTime();

        setTimeout(self.checkAutoStandby, 10 * 60 * 1000);


        document.onkeydown = function (e) {


            lastkeytime = new Date().getTime();

            if (e.keyCode == self.KEY.FUNGREEN) {
                self.last_green_key++;
                if (self.last_green_key == 5) {
                    //进入工程菜单模式
                    sysCom.config.gongchengmenu = 1;
                    sysCom.saveConfig();
                    appCom.goAppByName("systemsetting", false);
                    ////////////////
                    self.last_green_key = 0;
                }

            }
            else {
                self.last_green_key = 0;
            }

            if (arealimit && arealimit.getArealimitStatus() == 1 && self.KEY.POWER != e.keyCode && sysCom.config.gongchengmenu == 0) {
                console.log("keyCode arealimit return");
                e.stopPropagation();
                e.preventDefault();
                return;
            }

            //CA Lock Service
            if (caCom && caCom.lockStatus && self.KEY.POWER != e.keyCode) {
                console.log("keyCode ca lock serivce return");
                e.stopPropagation();
                e.preventDefault();
                return;
            }

            console.log(e.keyCode + " start.");
            var ret = false;

            if ((typeof UI == "object") && (typeof UI.onKey == "function")) {
                ret = UI.onKey(e);
            }

            console.log(e.keyCode + " end.");


            if (ret == false) {
                self.onkey(e);
            }
            if (g_url.indexOf("cview_app_6z18_cns") >= 0) {
                e.stopPropagation();
                e.preventDefault();
            }
         };
        };

        this.KEY = {
            POWER: 0xe0035,
            UP: 38,
            DOWN: 40,
            LEFT: 37,
            RIGHT: 39,
            ENTER: 13,

            BACKSPACE: 0x08,
            MENU: 0xe0033,
            LIVETV: 27,

            RECORD: 0xe0017,
            EPG: 0xe0110,
            PVR: 0xe0114,
            MUTE: 0xe00f0,
            PLAY: 0xe0010,
            STOP: 0xe0011,

            LANG: 0xe0200,
            INFO: 0xe0034,

            CHAR0: 48,
            CHAR1: 49,
            CHAR2: 50,
            CHAR3: 51,
            CHAR4: 52,
            CHAR5: 53,
            CHAR6: 54,
            CHAR7: 55,
            CHAR8: 56,
            CHAR9: 57,

            CHNUP: 0xe0030,
            CHNDOWN: 0xe0031,
            VOLUP: 0xe00f3,
            VOLDOWN: 0xe00f4,

            FUNRED: 0xe0000,
            FUNGREEN: 0xe0001,
            FUNYELLOW: 0xe0002,
            FUNBLUE: 0xe0003
        };

        this.onkey = function (e) {
            var ret = true;

            if (e.keyCode == self.KEY.POWER) {

                var nostandby = sysCom.getMemConfig("nostandby");
                if (nostandby == 1) {
                    sysCom.setMemConfig("nostandby", 0);
                     window.location.href = "file:////application/cview/cview_app_6z18_cns_standby/index.html";
                }
                else {
                    sysCom.setMemConfig("nostandby", 1);
                    appCom.goAppByName("tvportal", false);
                }
                return;
            }
            else {
                var nostandby = sysCom.getMemConfig("nostandby");
                if (nostandby == 0) {
                   if( e.keyCode == UI.KEY.FUNYELLOW)
                   {
                       DB.DoEvnVars({
                           "opt": "write",
                           "var": "HdmiTxMode",
                           "value": 0
                       });
                   }
                   else   if( e.keyCode == UI.KEY.FUNBLUE)
                   {
                       DB.DoEvnVars({
                           "opt": "write",
                           "var": "HdmiTxMode",
                           "value": 1
                       });
                   }
                    return;
                }
            }

            switch (e.keyCode) {

                case self.KEY.VOLUP:

                    console.log("keyCom volume +");
                    self.handleVolume(1);
                    break;

                case self.KEY.VOLDOWN:
                    console.log("keyCom volume -");
                    self.handleVolume(-1);
                    break;
                case self.KEY.MUTE:
                    console.log("keyCom mute");
                    self.handleMute();
                    break;
                case self.KEY.LIVETV:
                    console.log("keyCom livetv");
                    appCom.goAppByName("livetv", false);
                    break;
                case self.KEY.MENU:
                    console.log("keyCom tvportal");
                    appCom.goAppByName("tvportal", false);
                    break;
                case self.KEY.ENTER:
                    console.log("keyCom OK");
                    var focusedElement = document.activeElement;
                    if (focusedElement) {
                        console.log("keyCom OK have focus");
                        if (typeof  focusedElement.onclick === "function")
                            focusedElement.onclick();
                        else if (typeof focusedElement.click === "function")
                            focusedElement.click();
                    }
                    else 
                    {
                        console.log("keyCom OK no focus");
                    }
                    break;
                case self.KEY.EPG:
                    appCom.goAppByName("epg", false);
                    break;
                case self.KEY.POWER:

                    break;
                default:
                    ret = false;
                    break;
            }
            return ret;
        };

        this.handleMute = function () {
            sysCom.config.mute = sysCom.config.mute ? 0 : 1;
            sysCom.setMute();
            if (sysCom.config.mute) {
                dlgCom.volDlg.close();
                dlgCom.muteDlg.show();
            }
            else 
            {
                dlgCom.muteDlg.close();
            }
        };

        this.handleVolume = function (step) {

            if (!sysCom.config.mute) {
                sysCom.config.mute = 0;
                sysCom.setMute();
            }

            sysCom.config.volume += step;

            if (sysCom.config.volume > 32) {
                sysCom.config.volume = 32;
            }

            if (sysCom.config.volume < 0) {
                sysCom.config.volume = 0;
            }
            sysCom.setVolume();
            dlgCom.volDlg.show({v: sysCom.config.volume});
            dlgCom.muteDlg.close();
        };
        return this;

}

var keyCom = new keyCommon();
console.log("keyCom init");
setTimeout(keyCom.init(),1000);
