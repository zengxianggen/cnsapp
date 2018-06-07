function DlgCom()
{

    var self = this;

    this.start = function(){
        var volParams = {
            max : 32,
            time : 5000,
            background : "file:///application/cview/cview_app_common_pic/volumn_bar.png",
            ico_sound :  "file:///application/cview/cview_app_common_pic/ico_sound.png"
        };
        self.volDlg = new Volume(volParams);

        var muteParams = {
            background:"file:///application/cview/cview_app_common_pic/mute.png"
        };

        self.muteDlg = new Mute(muteParams);
        if(sysCom.config.mute)
        {
            setTimeout(function(){
                console.log("self.muteDlg.show");
                self.muteDlg.show();
            },1000*10);
        }
    };
}
var dlgCom = new DlgCom();
console.log("dlgCom init");
setTimeout(dlgCom.start,1000);

