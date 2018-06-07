function OtaCommon(){

    var self = this;



    this.init = function(){
        self.start();
    };

    this.start = function(){

        eventCom.registerCallback(5, function (obj) {
            var p1 = {
                title: Lp.getValue("update_tips"),
                textok: Lp.getValue("OK"),
                textno: Lp.getValue("Cancel"),
                timeout:20*1000,
                background: "../cview_app_common_pic/password_bg.png",
                dia_ImgOK: "../cview_app_common_pic/ico_ok.png",
                dia_ImgNO: "../cview_app_common_pic/ico_back.png",
                okfun: function () {
                    console.log("ok");
                    OTA.startOTAUpdate(false);
                },
                nofun: function () {
                    console.log("no");
                }
            };
            var p2 = {
                text: Lp.getValue("update_text")
            };
            var dia = new Dialog(p1);
            dia.show(p2);
        });
    };


}
var otaCom = new OtaCommon();
console.log("otaCom init");
setTimeout(otaCom.init,1000);