function NumChangeCh(params)
{
    var self = this;

    this.numArray = [];
    self.timer = null;

    self.numPicArray = [
        "live/num/zero",
        "live/num/one",
        "live/num/two",
        "live/num/three",
        "live/num/four",
        "live/num/five",
        "live/num/six",
        "live/num/seven",
        "live/num/eight",
        "live/num/nine"
    ];

    this.dlgParams = [
        {
            uiType:UIFrame,
            id:"numChangechFrame",
            l:1000,
            t:150,
            w:120,
            h:60,
            type:"none",
            visibility:-1
        },
        {
            uiType:UIImg,
            id:"num2",
            ol:0,
            ot:0,
            src:""
        },
        {
            uiType:UIImg,
            id:"num1",
            ol:40,
            ot:0,
            src:""
        },
        {
            uiType:UIImg,
            id:"num0",
            ol:80,
            ot:0,
            src:""
        }

    ];

    this.create = function()
    {
        this.dlg = UI.createGroup(self.dlgParams, "channelListDlg", params.win);
        this.dlg.proc = self.onkey;
    };

    this.show = function(num){
        if(dtvCom.chs.length <= 0)
        {
            return;
        }

        if(params.live.chlist.chlDlg.visibility > 0)
        {
            params.live.chlist.close(true);
        }
        self.closeTimer();
        self.addNum(num);
        self.setPic();
        self.dlg.visibility = 1;
        self.dlg.setFocus(true);
        params.win.update();

        if(self.numArray.length >= 3)
        {
            self.openTimer(500);
        }
        else
        {
            self.openTimer();
        }
    };

    this.close = function(updateFlag)
    {
        self.closeTimer();
        self.numArray = new Array();
        self.setPic();
        self.dlg.visibility = -1;
        if(updateFlag)
        {
            self.dlg.update();
        }
    };

    this.addNum = function(num){
        if(self.numArray.length >= 3)
        {
            self.numArray = new Array();
        }
        self.numArray.push(num);
    };

    this.setPic = function()
    {
        for(var i = 0; i < 3;i++)
        {
            if(self.numArray.length > i)
            {
                self.dlg.getChild("num"+(2-i)).setSrc(self.numPicArray[self.numArray[i]]);
            }
            else
            {
                self.dlg.getChild("num"+(2-i)).setSrc(1);
            }

        }
    };

    this.checkNum = function()
    {
        var num = parseInt(self.numArray.join(""),10);
        for(var i = 0; i < dtvCom.chs.length;i++)
        {
            if(dtvCom.chs[i].idn == num)
            {
                return true;
            }
        }
        return false;
    };

    this.changeCh = function()
    {
        var num = parseInt(self.numArray.join(""),10);
        if(self.checkNum() &&  sysCom.config.chIndex !=  dtvCom.getIndexByNo(num))
        {
            params.live.changeCh(num, null, true, params.live.passwdCb, params.live.bannerPasswdOnkey);
        }
        else
        {
            params.live.banner.show(true,true,null);
        }
    };


    this.onkeyEnter = function()
    {
        self.changeCh();
        self.close(true);
    };

    this.openTimer = function(timeout)
    {
        self.closeTimer();
        self.timer = setTimeout(function(){
            self.changeCh();
            self.close(true);
        },timeout?timeout:2000);

    };

    this.closeTimer = function()
    {
        if(self.timer)
        {
            clearTimeout(self.timer);
            self.timer = null;
        }
    };

    this.onkey = function(e)
    {
        var ret = true;
        switch(e.keyCode)
        {
            case UI.KEY.ENTER:
                self.onkeyEnter();
                break;
            case UI.KEY.CHAR0:
            case UI.KEY.CHAR1:
            case UI.KEY.CHAR2:
            case UI.KEY.CHAR3:
            case UI.KEY.CHAR4:
            case UI.KEY.CHAR5:
            case UI.KEY.CHAR6:
            case UI.KEY.CHAR7:
            case UI.KEY.CHAR8:
            case UI.KEY.CHAR9:
                self.show(e.keyCode - 48);
                break;
            default:
                ret = false;
                break;
        }
        return ret;
    };

    this.create();
    return this;
}
