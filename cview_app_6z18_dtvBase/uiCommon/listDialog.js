function ListDialog(params)
{
	var self = this;

	var dialog_w = params.w ? params.w : 100;
	var dialog_h = params.h ? params.h : 140;
	var dialog_l = params.l?params.l:500;
    var dialog_t = params.t?params.t:200;

	this.dlgParams = [
		{uiType:UIFrame,id:"listFrame",l:dialog_l,t:dialog_t,w:dialog_w,h:dialog_h,type:"block",color:"#646464"},
		{
		    uiType:UITable,id:"listTable",ol:dialog_w*0.05,ot:dialog_h*0.05,w:dialog_w*0.9,h:dialog_h*0.9,
            styleClass:"listDialogClass"
        }
	];

	this.initStyleClass = function(){
        var tableClassNormal = {
            headUse : false,
            font : uiCom.font.F20,
            cols : params.type,
            rowsOnePage : params.maxSize ? params.maxSize : 3,
            color : "#96b4be",
            lineVWidth : 0,
            lineHWidth : 0,
            lineRectWidth : 0,
            LeaveFocusColor : "white",
            focusColor : "white",
            HAlign : "center",
            skin:{
                evenBar :{ type: "none" },
                oddBar :{ type : "none" },
                focusBar : {type : "img", imgNames : [params.background_img], stretch : "HV"},
            }
        };
        UI.res.set("listDialogClass",tableClassNormal);
    };

	this.initData = function()
    {
        self.paramsData = new Array();
        for(var i=0; i < params.data.length;i++)
        {
            var a = {
                value:params.data[i],
                select:false
            };
            self.paramsData[i] = a;
        }

        if(params.type > 1)
        {
            self.tb.setColWidthArr([self.tb.w*0.2,self.tb.w*0.8]);
        }
        self.addData();
	    self.tb.curIndex = params.index;
    };

	this.addData = function(){
        self.listData= new Array();
        var index = self.tb.curIndex;
        self.tb.removeItems();
        if(self.paramsData.length > 0)
        {
            for(var i = 0; i < self.paramsData.length;i++)
            {
                self.listData[i] = new Array();
                if(params.type == 1)
                {
                    self.listData[i][0] = self.paramsData[i].value;
                }
                else
                {
                    if(self.paramsData[i].select)
                    {
                        self.listData[i][0] = {type:"img",img:params.selectImg,stretch:"HV"};
                    }
                    else
                    {
                        self.listData[i][0] = "";
                    }
                    self.listData[i][1] = self.paramsData[i].value;
                }
            }
        }
        self.tb.addItems(self.listData);
        self.tb.curIndex=index;
    };

	this.show = function()
    {
        self.initStyleClass();
		self.preFocusWin = params.win.getFocusWin();
        self.dlg = UI.createGroup(self.dlgParams,"passwdDlg",params.win);
		self.dlg.proc = params.proc?params.proc:self.proc;
		self.tb = self.dlg.getChild("listTable");
        self.tb.setFocus(true);
        self.initData();
        self.tb.setFocus(true);
        params.win.update();
    };

	this.close = function()
    {
        self.dlg.destroy();

        if(self.preFocusWin.visibility >= 0)
        {
            self.preFocusWin.setFocus(true);
        }
        else
        {
            params.win.setFocus(true);
        }

        params.win.update();
    };

	this.getReturnArr = function(){
	    var data = new Array();
	    for(var i = 0; i < self.paramsData.length;i++)
        {
            if(self.paramsData[i].select)
            {
                data[data.length] = i;
            }
        }
        return data;
    };

	this.proc = function(e)
    {
        var ret = true;
	    switch(e.keyCode)
        {
            case UI.KEY.UP:
            case UI.KEY.DOWN:
            case UI.KEY.RIGHT:
            case UI.KEY.LEFT:

                break;
            case UI.KEY.ENTER:
                if(params.type > 1)
                {
                    if(self.paramsData[self.tb.curIndex].select)
                    {
                        self.paramsData[self.tb.curIndex].select = false;
                    }
                    else
                    {
                        self.paramsData[self.tb.curIndex].select = true;
                    }
                    self.addData();
                    params.win.update();
                }
                else
                {
                    self.paramsData[self.tb.curIndex].select = true;
                    if(params.cb)
                    {
                        params.cb(self.getReturnArr());
                    }
                    self.close();
                }
                break;
            case UI.KEY.BACKSPACE:
                if(params.type > 1)
                {
                    if(params.cb)
                    {
                        params.cb(self.getReturnArr());
                    }
                }
                self.close();
                break;
            default:
                ret =false;
                break;
        }
		return false;
	};
}