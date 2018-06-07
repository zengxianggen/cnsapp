/*
var params = {
    win:self.win,(父窗口，必选)
    proc:按键处理函数
    frame:{
        w:500,(对话框的总宽度，可选，默认500)
        h:300,(对话框的总高度，可选，默认300)
        l:10,(对话框的在水平居中的位置偏移，可选，默认水平居中)
        t:10,(对话框的在垂直居中的位置偏移，可选，默认垂直居中)
    },
    title:{
        dw:(对话框标题的水平显示范围的变化，可选，默认标题宽度占总宽度100%)
        dh:(对话框标题的垂直显示范围的变化，可选，默认标题宽度占总高度15%)
        dl:(对话框标题水平位置的偏移，可选，默认0)
        dt:(对话框标题垂直位置的偏移，可选，默认0)
        font:(对话框标题的字体，可选，默认uiCom.font.F25)
        color:(对话框标题的颜色,可选，默认white)
        HAlign:(对话框标题的居中模式，可选，默认center)
        value:(对话框标题内容，可选，默认”“)
    },
    content:{
        dw:(对话框内容区水平显示范围的变化，可选，默认内容区宽度占总宽度100%)
        dh:(对话框内容区垂直显示范围的变化，可选，默认内容区宽度占总高度70%)
        dl:(对话框内容区水平位置的偏移，可选，默认0)
        dh:(对话框内容区垂直位置的偏移，可选，默认0)
        font:(对话框内容区的字体，可选，默认uiCom.font.F20)
        color:(对话框内容区的颜色,可选，默认black)
        HAlign:(对话框内容区的居中模式，可选，默认center)
        msg:(显示的文本，必选)
        rowHeight:(每行的显示高度，可选，默认30)
        labelDt:(内容区文本垂直方向的偏移，可选，默认0)
        firstRowHeadSpace:(第一行文本头部字符串，可选，默认”“)
        bgColor:
    },
    nav:{
        dw:(底部导航区水平显示范围的变化，可选，底部导航区宽度占总宽度100%)
        dh:(底部导航区垂直显示范围的变化，可选，底部导航区宽度占总高度15%)
        dl:(底部导航区水平位置的偏移，可选，默认0)
        dt:(底部导航区垂直位置的偏移，可选，默认0)
        color:(底部导航区的颜色,可选，默认black)
        font:(底部导航区的颜色的字体，可选，默认uiCom.font.F20)
        groupSpace:(底部导航区每一组图片文字之间的距离，可选，默认80)
        group:[   (底部导航区图片文字组，可选)
            {
                img:   (图片路径)
                text:  (文字内容)
                fun:   (执行的操作)
                key:   (键值)
            }
        ]
    }
};

示例：
var text = "Bootstrap是一款由Twitter推出的开源CSS框架，它的核心是由一系列用于Web前端开发的工具包组成。Bootstrap基于HTML、CSS和JavaScript，是一款非常适合敏捷Web开发的CSS框架，Bootstrap同时也是Github上最热门的开源项目之一。前端开发是一项非常繁琐的工作，你不仅需要拥有和别人不一样的审美观和设计观，而且需要了解诸如HTML、CSS、JavaScript等错综复杂的技术，因此选择一些优秀的CSS框架或许可以帮助你大大提高工作效率。本文向你推荐了9个还不错的CSS框架，希望对你有所帮助。";
        var pr = {
            win:self.win,
            frame:{
                w:300,
                h:210
            },
            title:{
                dt:10,
                color:"red",
                value:"Information"
            },
            content:{
                dw:-40,
                dt:10,
                labelDt:20,
                firstRowHeadSpace:"   ",
                font:uiCom.font.F20,
                msg:text
            },
            nav:{
                dt:10,
                dl:30,
                group:[
                    {
                        img:"live/ico_ok",
                        text:"确认",
                        fun:function(){
                            console.log("ok");
                        },
                        key:UI.KEY.ENTER
                    },
                    {
                        img:"live/ico_green",
                        text:"上一页",
                        fun:function(){
                            console.log("green");
                        },
                        key:UI.KEY.BACKSPACE
                    }
                ]
            }
        };
        var ss = new TextDialog(pr);
        ss.show();
*/

function TextDialog(params){
    var self = this;

    this.dlgParams = [];

    //label的个数
    self.rows = 0;
    //Text的行数
    self.msgArray = new Array();
    //当前起始行数
    self.startRow = 0;

    this.initFrame = function(){
        self.position = {
            w : 500,
            h : 300,
            l : (UI.width - 500) / 2,
            t : (UI.height - 300) / 2
        };

        if(params && params.frame){
            self.position.w = params.frame.w ? params.frame.w : 500;
            self.position.h = params.frame.h ? params.frame.h : 300;
            self.position.l = (UI.width - self.position.w) / 2 + (params.frame.l ? params.frame.l : 0);
            self.position.t = (UI.height - self.position.h) / 2 + (params.frame.t ? params.frame.t : 0);
        }

        var dp = {
            uiType : UIFrame,
            id : "TextDialogFrame",
            l : self.position.l,
            t : self.position.t,
            w : self.position.w,
            h : self.position.h,
            type : "img",
            imgNames:[params.frame.bg ? params.frame.bg : "dialog/password_bg"],
            stretch:"HV",
            visibility : -1
        };

        self.dlgParams.push(dp);
    };

    this.initTitle = function(){
        var w = self.position.w;
        var h = self.position.h * 0.15;
        var dw = 0;
        var dh = 0;
        var dl = 0;
        var dt = 0;
        var font = uiCom.font.F25;
        var color = "white";
        var HAlign = "center";
        var value = "";
        if(params && params.title){
            dw = params.title.dw ? params.title.dw : 0;
            dh = params.title.dh ? params.title.dh : 0;
            dl = params.title.dl ? params.title.dl : 0;
            dt += params.title.dt ? params.title.dt : 0;
            font = params.title.font ? params.title.font : uiCom.font.F25;
            color = params.title.color ? params.title.color : "white";
            HAlign = params.title.HAlign ? params.title.HAlign : "center";
            value = params.title.value ? params.title.value : "";
        }
        var dp = {
            uiType : UILabel,
            id : "TextDialogTitle",
            ol : dl,
            ot : dt,
            w : w + dw,
            h : h + dh,
            font : font,
            color : color,
            HAlign : HAlign,
            value : value
        };
        self.titlePosition = {
            w : w + dw,
            h : h + dh,
            l : dl,
            t : dt
        };
        self.dlgParams.push(dp);
    };

    this.initContent = function(){
        var w = self.position.w;
        var h = self.position.h * 0.7;
        var dw = 0;
        var dh = 0;
        var dl = 0;
        var dt = self.titlePosition.h;
        var msg = "";
        var font = uiCom.font.F20;
        var color = "black";
        var HAlign = "center";
        var firstRowHeadSpace = "";
        var rowHeight = 30;
        var labelDt = 0;
        self.rows = 0;

        if(params && params.content){
            dw = params.content.dw ? params.content.dw : 0;
            dh = params.content.dh ? params.content.dh : 0;
            dl = params.content.dl ? params.content.dl : 0;
            dt += params.content.dt ? params.content.dt : 0;
            msg = params.content.msg ? params.content.msg : "";
            font = params.content.font ? params.content.font : uiCom.font.F20;
            color = params.content.color ? params.content.color : "black";
            HAlign = params.content.HAlign ? params.content.HAlign : "center";
            rowHeight = params.content.rowHeight ? params.content.rowHeight : 30;
            labelDt = params.content.labelDt ? params.content.labelDt : 0;
            firstRowHeadSpace = params.content.firstRowHeadSpace ? params.content.firstRowHeadSpace : "";

            self.msgArray = textMulLineHandle1(UI.ctx, font, msg, w + dw, firstRowHeadSpace);
            self.rows = parseInt((h + dh) / rowHeight);
        }

        self.contentPosition = {
            w : w + dw,
            h : h + dh,
            l : dl - dw / 2,
            t : dt
        };

        var dpFrame = {
            uiType : UIFrame,
            id : "contentFrame",
            ol : self.contentPosition.l,
            ot : self.contentPosition.t,
            w : self.contentPosition.w,
            h : self.contentPosition.h,
            type : "block",
            color : params.content.bgColor ? params.content.bgColor : "#1E5990"
        };


        self.dlgParams.push(dpFrame);

        for(var i = 0; i < self.rows; i++){
            var dp = {
                uiType : UILabel,
                id : "Label" + i,
                ol : dl - dw / 2,
                ot : dt + rowHeight * i + labelDt,
                w : w + dw,
                h : rowHeight,
                font : font,
                color : color,
                HAlign : HAlign,
                value : ""
            };

            if(i < self.msgArray.length){
                dp.value = self.msgArray[i];
            }
            self.dlgParams.push(dp);
        }
    };

    this.initNav = function(){
        var w = self.position.w;
        var h = self.position.h * 0.15;
        var dw = 0;
        var dh = 0;
        var dl = 0;
        var dt = self.titlePosition.h + self.contentPosition.h;
        var rowHeight = 30;
        var font = uiCom.font.F20;
        var color = "white";
        var imgTextSpace = 3;
        var groupSpace = 80;
        var curOl = 0;

        if(params && params.nav){
            dw = params.nav.dw ? params.nav.dw : 0;
            dh = params.nav.dh ? params.nav.dh : 0;
            dl = params.nav.dl ? params.nav.dl : 0;
            dt += params.nav.dt ? params.nav.dt : 0;
            font = params.nav.font ? params.nav.font : uiCom.font.F20;
            color = params.nav.color ? params.nav.color : "white";
            groupSpace = params.nav.groupSpace ? params.nav.groupSpace : 80;
        }

        self.navPosition = {
            w : w + dw,
            h : h + dh,
            l : dl,
            t : dt
        };

        if(params && params.nav && params.nav.group){
            curOl = dl;
            for(var i = 0; i < params.nav.group.length; i++){
                var dp1 = {
                    uiType : UIImg,
                    id : "navImg" + i,
                    ol : curOl,
                    ot : dt,
                    src : params.nav.group[i].img
                };
                curOl += UI.res.imgs[params.nav.group[i].img].width + imgTextSpace;
                self.dlgParams.push(dp1);

                var labelW = getStrLength(font, params.nav.group[i].text);
                var dp2 = {
                    uiType : UILabel,
                    id : "navLabel" + i,
                    ol : curOl,
                    ot : dt,
                    w : labelW,
                    h : rowHeight,
                    font : font,
                    color : color,
                    HAlign : "left",
                    value : params.nav.group[i].text
                };
                curOl += labelW + groupSpace;
                self.dlgParams.push(dp2);
            }
        }
    };

    this.create = function(){
        self.initFrame();
        self.initTitle();
        self.initContent();
        self.initNav();

        self.dlg = UI.createGroup(self.dlgParams, "TextDialog", params.win);
        self.dlg.proc = params.proc ? params.proc : self.onkey;
    };


    this.show = function(){
        self.preFocusWin = params.win.getFocusWin() ? params.win.getFocusWin() : params.win;
        self.dlg.visibility = 1;
        self.dlg.setFocus(true);
        self.dlg.update();
    };

    this.close = function(updateFlag){
        self.dlg.destroy();
        self.preFocusWin.setFocus(true);
        params.win.update();
    };

    this.onkeyUp = function(){
        if(self.msgArray.length <= self.rows){
            return;
        }
        if(self.startRow > 0){
            self.startRow--;
            for(var i = 0; i < self.rows; i++){
                var dp = self.dlg.getChild("Label" + i);
                if(i < self.msgArray.length){
                    dp.value = self.msgArray[self.startRow + i];
                }
            }
            self.dlg.update();
        }
    };

    this.onkeyDown = function(){
        if(self.msgArray.length <= self.rows){
            return;
        }
        if(self.startRow < (self.msgArray.length - self.rows)){
            self.startRow++;
            for(var i = 0; i < self.rows; i++){
                var dp = self.dlg.getChild("Label" + i);
                if(i < self.msgArray.length){
                    dp.value = self.msgArray[self.startRow + i];
                }
            }
            self.dlg.update();
        }
    };

    this.onkeyDefault = function(keyCode){
        var ret = false;
        if(params && params.nav && params.nav.group){
            for(var i = 0; i < params.nav.group.length; i++){
                if(params.nav.group[i].key == keyCode && params.nav.group[i].fun){
                    self.close();
                    params.nav.group[i].fun();
                    ret = true;
                }
            }
        }
    };

    this.onkey = function(e){
        var ret = true;

        switch(e.keyCode){
            case UI.KEY.UP:
                self.onkeyUp();
                break;
            case UI.KEY.DOWN:
                self.onkeyDown();
                break;
            default:
                self.onkeyDefault(e.keyCode);
                ret = false;
                break;
        }
        return ret;
    };

    this.create();
}
