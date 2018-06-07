function RecordedPlay(params, srcModule)
{
    var self = this;

    this.dlgParam = [
        {uiType: UIFrame, id: "recordedlive", l: 0, t: 0, w: UI.width, h: UI.height, type: "none"}
    ];

    this.open = function ()
    {
        this.defOpen();
        console.log("RecordedPlay Open!");
    };

    this.close = function ()
    {
        this.defClose();
        console.log("RecordedPlay Close");
    };

    this.start = function ()
    {
        console.log("RecordedPlay start");
        var p = {
            "id": 0,
            "url": "pvrplayback://localhost/player?resId="+params.resId
        };
        var ret = PVR.replayStart(p,function(){
            var rect = {
                l:0,
                t:0,
                w:1280,
                h:720
            };
            var r = getVideoRect(rect,sysCom.config.Reslution);
            dtvCom.mp.mpSetVideoSize(r.l, r.t, r.w, r.h, false);
        });

        var p = {
            mp:new MPlayer(0),
            title: params.userData.epg ? params.userData.epg.name : params.userData.ch.name,
            detailsInfo: params.userData.epg ? params.userData.epg.name : params.userData.ch.name
        };
        self.playBanner = new MediaPlayBanner(p);
        self.playBanner.start();
        this.win.update();
    };

    this.stop = function ()
    {
        self.playBanner.close();
        dtvCom.mp.mpStop();
        console.log("RecordedPlay stop");
    };

    this.onkey = function (e)
    {
        console.log("In Template module keyCode =" + e.keyCode);
        var ret = false;
        if(self.playBanner){
            if(self.playBanner.onkey(e)){
                return true;
            }
        }
        switch (e.keyCode) {
            case UI.KEY.BACKSPACE:
                self.go(srcModule);
                ret = true;
                break;
            default:
                ret = false;
                break;
        }
        return ret;
    }

}

RecordedPlay.prototype = UIModule.baseModule;