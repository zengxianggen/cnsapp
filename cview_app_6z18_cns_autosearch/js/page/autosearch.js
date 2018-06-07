function AutosearchPage(params, srcModule) {
    var self = this;

    this.dlgParam = [
        {uiType: UIFrame, id: "bg", l: 0, t: 0, w: 1280, h: 720, type: "hole"}
    ];

    var tipsDlg = null;
    self.status = false;
    var dialog_w = 600;
    var dialog_h = 540;
    var dialog_l = (UI.width - dialog_w) / 2;
    var dialog_t = (UI.height - dialog_h) / 2;

    var head_h = 70;
    var head_space = 50;


    var timer = null;

    this.stepParam = [
        {
            uiType: UIFrame,
            id: "stepFrame",
            l: dialog_l,
            t: dialog_t,
            w: dialog_w,
            h: dialog_h,
            styleClass: "system_setting_bk",
            focusMoveMode: "circle"
        },
        {
            uiType: UILabel, id: "title", ol: 0, ot: 20, w: dialog_w, h: 40, color: "white", HAlign: "center",
            value: Lp.getValue("Search_Channel"),
            font: uiCom.font.F25
        },

        {
            uiType: UILabel,
            id: "head1",
            ol: 0,
            ot: head_h + head_space * 0 + 5,
            w: dialog_w * 0.5,
            h: 40,
            color: "grey",
            HAlign: "right",
            value: Lp.getValue("Frequency") + "(KHz)" + ":",
            font: uiCom.font.F20
        },
        {
            uiType: UILabel,
            id: "head2",
            ol: 0,
            ot: head_h + head_space * 1 + 5,
            w: dialog_w * 0.5,
            h: 40,
            color: "grey",
            HAlign: "right",
            value: Lp.getValue("Symbol_rate") + "(Ks/sec)" + ":",
            font: uiCom.font.F20
        },
        {
            uiType: UILabel,
            id: "head3",
            ol: 0,
            ot: head_h + head_space * 2,
            w: dialog_w * 0.5,
            h: 40,
            color: "grey",
            HAlign: "right",
            value: "QAM:",
            font: uiCom.font.F20
        },
        {
            uiType: UILabel,
            id: "head4",
            ol: 0,
            ot: head_h + head_space * 3,
            w: dialog_w * 0.5,
            h: 40,
            color: "grey",
            HAlign: "right",
            value: Lp.getValue("Signal") + "BER:",
            font: uiCom.font.F20
        },
        {
            uiType: UILabel,
            id: "head5",
            ol: 0,
            ot: head_h + head_space * 4,
            w: dialog_w * 0.5,
            h: 40,
            HAlign: "right",
            color: "grey",
            value: "BID:",
            font: uiCom.font.F20
        },
        {
            uiType: UILabel,
            id: "head6",
            ol: 0,
            ot: head_h + head_space * 5,
            w: dialog_w * 0.3,
            h: 40,
            HAlign: "right",
            color: "grey",
            value: "SNR:",
            font: uiCom.font.F20
        },
        {
            uiType: UILabel,
            id: "head7",
            ol: 0,
            ot: head_h + head_space * 6 - 10,
            w: dialog_w * 0.3,
            h: 30,
            HAlign: "right",
            color: "grey",
            value: Lp.getValue("Signal_Strength") + ":",
            font: uiCom.font.F20
        },
        {
            uiType: UILabel,
            id: "head8",
            ol: 0,
            ot: head_h + head_space * 7 - 20,
            w: dialog_w * 0.3,
            h: 30,
            HAlign: "right",
            color: "grey",
            value: Lp.getValue("Progress") + ":",
            font: uiCom.font.F20
        },

        {
            uiType: UILabel,
            id: "cont1",
            ol: dialog_w * 0.51,
            ot: head_h + head_space * 0 + 5,
            w: dialog_w * 0.4,
            h: 40,
            color: "grey",
            HAlign: "left",
            value: "405000",
            font: uiCom.font.F20,
            color: "white"
        },
        {
            uiType: UILabel,
            id: "cont2",
            ol: dialog_w * 0.51,
            ot: head_h + head_space * 1 + 5,
            w: dialog_w * 0.4,
            h: 40,
            color: "grey",
            HAlign: "left",
            value: "5217",
            font: uiCom.font.F20,
            color: "white"
        },
        {
            uiType: UILabel,
            id: "cont3",
            ol: dialog_w * 0.51,
            ot: head_h + head_space * 2,
            w: dialog_w * 0.4,
            h: 40,
            color: "grey",
            HAlign: "left",
            value: "256QAM",
            font: uiCom.font.F20,
            color: "white"
        },
        {
            uiType: UILabel,
            id: "cont4",
            ol: dialog_w * 0.51,
            ot: head_h + head_space * 3,
            w: dialog_w * 0.4,
            h: 40,
            color: "grey",
            HAlign: "left",
            value: "0",
            font: uiCom.font.F20,
            color: "white"
        },
        {
            uiType: UILabel,
            id: "cont5",
            ol: dialog_w * 0.51,
            ot: head_h + head_space * 4,
            w: dialog_w * 0.4,
            h: 40,
            HAlign: "left",
            color: "grey",
            value: "25149",
            font: uiCom.font.F20,
            color: "white"
        },
        {
            uiType: UIProgress,
            id: "cont6",
            ol: dialog_w * 0.31,
            ot: head_h + head_space * 5,
            w: dialog_w * 0.58,
            h: 10,
            value: 0,
            styleClass: "setting_progress",
            maxValue: 100,
            suffixValue: " dB",
            valueW: 100,
            font: uiCom.font.F20
        },
        {
            uiType: UIProgress,
            id: "cont7",
            ol: dialog_w * 0.31,
            ot: head_h + head_space * 6 - 10,
            w: dialog_w * 0.58,
            h: 10,
            value: 0,
            styleClass: "setting_progress",
            maxValue: 100,
            suffixValue: " dbuV",
            valueW: 100,
            font: uiCom.font.F20
        },
        {
            uiType: UIProgress,
            id: "cont8",
            ol: dialog_w * 0.31,
            ot: head_h + head_space * 7 - 20,
            w: dialog_w * 0.58,
            h: 10,
            value: 0,
            styleClass: "setting_progress",
            maxValue: 100,
            suffixValue: "%",
            valueW: 100,
            font: uiCom.font.F20
        },


        {
            uiType: UIImg,
            id: "icon_ok",
            ol: dialog_w * 0.42,
            ot: head_h + head_space * 7 + 4,
            src: "setting/icon_search"
        },
        {
            uiType: UILabel,
            id: "botCont1",
            ol: dialog_w * 0.43 + UI.res.imgs["dialog/ico_ok"].width + 10,
            ot: head_h + head_space * 7,
            w: dialog_w * 0.4,
            h: 40,
            dt: 10,
            color: "grey",
            HAlign: "left",
            value: Lp.getValue("Wait"),
            font: uiCom.font.F20
        },

        {
            uiType: UILabel,
            id: "resultLabel",
            ol: dialog_w * 0.1,
            ot: head_h + head_space * 7,
            w: dialog_w * 0.8,
            h: 40,
            dt: 10,
            color: "grey",
            HAlign: "center",
            value: "",
            font: uiCom.font.F20,
            visibility: -1
        },
    ];


    var width_tips = 560 / 2;
    var height_tips = 240;
    var left_tips = (560 - width_tips) / 2;
    var top_tips = (270 - height_tips) / 2;
    var tipsParam = [
        {
            uiType: UIFrame,
            id: "dialog_bk",
            w: width_tips,
            h: height_tips,
            ol: left_tips,
            ot: 100,
            styleClass: "system_setting_bk",
            visibility: 0
        },
        {
            uiType: UILabel,
            w: width_tips,
            h: 40,
            ol: 0,
            ot: 6,
            value: Lp.getValue("Tips"),
            font: uiCom.font.F20,
            HAlign: "center"
        },
        {
            uiType: UILabel,
            w: width_tips,
            h: 40,
            ol: 0,
            ot: 70,
            value: Lp.getValue("Search_Over"),
            font: uiCom.font.F20,
            HAlign: "center"
        }
    ];

    this.open = function () {
        this.defOpen();

    };

    this.start = function () {


        self.dlg = UI.createGroup(this.stepParam, "stepDlg", self.win);

        tipsDlg = UI.createGroup(tipsParam, "tipsDlg", self.dlg);


            self.dlg.getChild("cont1").value = 405000;
            self.dlg.getChild("cont2").value = 5217;
            self.dlg.getChild("cont3").value = "256QAM";
            self.dlg.getChild("cont4").value = 0;

            if (caCom && caCom.caParams) {
                self.dlg.getChild("cont5").value = caCom.caParams.bouquetId ? caCom.caParams.bouquetId : sysCom.config.bouquetID;//sysCom.config.bouquetID;
            }
            else {
                self.dlg.getChild("cont5").value = sysCom.config.bouquetID;
            }


            var p = {
                "mode": 0,
                "signal": 0,
                "car": {
                    "freq": 405000,
                    "sym": 5217,
                    "qam": 256
                },
                "filter": 1,
                "bouqId": self.dlg.getChild("cont5").value
            };
            Scan.scanSetParams(p, false);


        Scan.scanStart(null, false);

        self.startTimer();
    };

    this.startTimer = function () {
        timer = setInterval(function () {
            var tuner_ret = Scan.scanGetInfo({
                "start": 0,
                "max": 0
            }, false);


            //singal
            var sig_ret = Tuner.tunerGetStatus({id: 0}, false);
            var ber = sig_ret.errRate;
            var testber = ber / 1000000000;
            var testber1 = testber.toExponential(2);//转换成科学计数
            var snr = sig_ret.snr;
            var strength = sig_ret.strength;
            self.dlg.getChild("cont4").value = testber1;
            self.dlg.getChild("cont6").value = snr;
            self.dlg.getChild("cont7").value = Math.abs(strength);


            self.win.update();

            console.log("auto search tuner_ret=" + tuner_ret);
            if (!tuner_ret) {
                return;
            }
            var percent = tuner_ret.status.percent;
            self.dlg.getChild("cont8").value = percent;

            var scan_status = tuner_ret.status.status;
            switch (scan_status) {
                case 0:

                    break;
                case 1:
                    console.log("auto search netwrokname=" + tuner_ret.status.networkname);

                    if (tuner_ret.status.networkname != "")
                        sysCom.config.NetworkName = tuner_ret.status.networkname;

                    break;
                case 2:
                    console.log("搜索结束");
                    var totlaNum = tuner_ret.status.num;
                    var tvNum = tuner_ret.status.tvNum;
                    var radioNum = tuner_ret.status.radioNum;
                    var infoNum = totlaNum - tvNum - radioNum;

                    if (tuner_ret.status.networkname != "")
                        sysCom.config.NetworkName = tuner_ret.status.networkname;

                    var saveRes = Scan.scanSave({mode: 0}, false);

                    Scan.scanStop(null, false);

                    self.dlg.getChild("resultLabel").value = Lp.getValue("Search_Over") + "! " + Lp.getValue("TV") + ":" + tvNum + " " + Lp.getValue("Music") + ":" + radioNum + " " + Lp.getValue("Information") + ":" + infoNum;
                    self.dlg.getChild("resultLabel").show();

                    self.dlg.getChild("icon_ok").hide();
                    self.dlg.getChild("botCont1").hide();

                    self.win.update();

                    self.stopTimer();

                    self.status = true;


                    dtvCom.reset();
                    epgCom.reset();
                    recordSchCom.reset();
                    reservationCom.reset();

                    tipsDlg.show();
                    setTimeout(function(){
                    history.go(-1);
                    },5000);


                    break;
            }
        }, 1000);
    };

    this.stopTimer = function () {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    };

    this.stop = function () {
        self.stopTimer();
    };

    this.close = function () {
        this.defClose();
    };
   this.onkey = function (e)
    {
        
    };


}
AutosearchPage.prototype = UIModule.baseModule;