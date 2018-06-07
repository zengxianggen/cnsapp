/*
var p = {
 win:self.win,
 title:"温馨提示",
 msg:"恢复出场设置？",
 defaultFocus:true,
 okFun:function(){},
 noFun:function(){},
 };
*/
function ConfirmDlg(params)
{
	var self = this;
	this.timer = null;
	this.dlg = null;
	this.params = params;

	this.defaultTitle = "Information";
	this.defaultTitleFont = "35px Arial";
	this.defaultTitleColor = "white";
	this.defaultContentFont = "25px Arial";
	this.defaultContentColor= "white";
	this.defaultBtFocusColor = "white";
	this.defaultnoBtValue = "No";
	this.defaultokBtValue = "Ok";

	this.isNoBtOnFocus =  false;

	this.w = 500;
	this.h = 250;
	this.l = (UI.width - this.w)/2 +(self.params.dl?self.params.dl:0);
	this.t = (UI.height - this.h)/2 + +(self.params.dt?self.params.dt:0);

	this.dlgParam=[
		{
			uiType:UIFrame,
			id:"confirmDlgFrame",
			l:self.l,
			t:self.t,
			w:self.w,
			h:self.h,
			type:"img",
			imgNames:["dialog/dialogBg"],
			stretch:"HV"
		},
		{
			uiType:UILabel,
			id:"dlgTitle",
			ol:self.titleDl ? self.titleDl : 0,
			ot:self.titleDt ? self.titleDt : 0,
			w:self.w,
			h:self.h * 0.3,
			value:self.params.title ? self.params.title : self.defaultTitle,
			font:self.params.titleFont ? self.params.titleFont:self.defaultTitleFont,
			color:self.params.titleColor ? self.params.titleColor :　self.defaultTitleColor,
			HAlign:"center"
		},
		{
			uiType:UILabel,
			id:"dlgContent0",
			ol:self.params.contentDl ? self.params.contentDl : 0,
			ot:self.params.contentDt ? (self.params.contentDt + self.h * 0.3 ):self.h * 0.3,
			w:self.w,
			h:self.h * 0.15,
			value:"",
			font:self.params.contentFont ? self.params.contentFont : self.defaultContentFont,
			color:self.params.contentColor ? self.params.contentColor : self.defaultContentColor,
			HAlign:"center",
		},
        {
            uiType:UILabel,
            id:"dlgContent1",
            ol:self.params.contentDl ? self.params.contentDl : 0,
            ot:self.params.contentDt ? (self.params.contentDt + self.h * 0.45 ):self.h * 0.45,
            w:self.w,
            h:self.h * 0.15,
            value:"",
            font:self.params.contentFont ? self.params.contentFont : self.defaultContentFont,
            color:self.params.contentColor ? self.params.contentColor : self.defaultContentColor,
            HAlign:"center",
        },
        {
            uiType:UILabel,
            id:"dlgContent2",
            ol:self.params.contentDl ? self.params.contentDl : 0,
            ot:self.params.contentDt ? (self.params.contentDt + self.h * 0.6 ):self.h * 0.6,
            w:self.w,
            h:self.h * 0.15,
            value:"",
            font:self.params.contentFont ? self.params.contentFont : self.defaultContentFont,
            color:self.params.contentColor ? self.params.contentColor : self.defaultContentColor,
            HAlign:"center",
        },
		{
			uiType:UIButton,
			id:"okBt",
			ol:0,
			ot:self.h * 0.76,
			w:self.w * 0.49,
			h:self.h * 0.25,
			value:self.params.okValue?self.params.okValue:self.defaultokBtValue,
			dt:10,
			font:self.params.contentFont ? self.params.contentFont : self.defaultContentFont,
			color:"#497897",
			focusColor:self.params.btFocusColor?self.params.btFocusColor:self.defaultBtFocusColor,
			styleClass:"Button01"
		},
		{
			uiType:UIButton,
			id:"noBt",
			ol:self.w * 0.51,
			ot:self.h * 0.76,
			w:self.w * 0.49,
			h:self.h * 0.25,
			value:self.params.noValue?self.params.noValue:self.defaultnoBtValue,
			dt:10,
			font:self.params.contentFont ? self.params.contentFont : self.defaultContentFont,
			color:"#497897",
			focusColor:self.params.btFocusColor?self.params.btFocusColor:self.defaultBtFocusColor,
			styleClass:"Button01"
		}
	];

	this.show = function()
	{
		var dp = self.dlgParam;
		self.saveFocus();
		//判断是否有显示内容
		if(self.params.msg)
		{
			UI.ctx.font = self.params.contentFont ? self.params.contentFont : self.defaultContentFont;

			var textArray = textMulLineHandle(UI.ctx,self.params.msg,self.dlgParam[2].w,3);

			if(textArray.length == 1)
			{
				dp[3].value = textArray[0];
			}

			if(textArray.length == 2)
			{
				dp[2].value = textArray[0];
				dp[3].value = textArray[1];
			}

			if(textArray.length == 3)
			{
				dp[2].value = textArray[0];
				dp[3].value = textArray[1];
				dp[4].value = textArray[2];
			}
		}
		else
		{
			return false;
		}

		//创建弹窗
		self.dlg = UI.createGroup(dp,"confirmDlg",self.params.win);

		//设置弹窗事件
		if(self.params.proc)
		{
			self.dlg.proc = self.params.proc;
		}
		else
		{
			self.dlg.proc = self.onKey;
		}

		//设置焦点
		self.focus();

		if(self.params.timeout)
		{
			self.timer = setTimeout(function()
			{
				self.close();
			},parseInt(self.params.timeout));
		}

		self.params.win.update();
		return true;
	};


	this.focus = function(){
		if(self.isNoBtOnFocus)
		{
			self.dlg.getChild("noBt").setFocus(true);
		}
		else {
			self.dlg.getChild("okBt").setFocus(true);
		}
	};

	this.saveFocus = function()
	{
		var w = self.params.win.getFocusWin();
		if(w)
		{
			self.preFocusWin = w;
		}
		else
		{
            self.preFocusWin = null;
		}
	};

	this.close = function(flag)
	{
        self.dlg.destroy();
        self.dlg = null;
        if(self.timer)
        {
            clearTimeout(self.timer);
            self.timer = null;
        }

        if(self.params.win)
        {
        	if(self.preFocusWin){
                self.preFocusWin.setFocus(true);
			}
            self.params.win.update();
        }

        if(flag == -1 && self.params.noFun)
		{
            self.params.noFun();
		}
		else if(flag == 1 && self.params.okFun)
		{
            self.params.okFun();
		}
	};

	this.onkeyMove = function()
	{
        if(self.timer)
        {
            clearTimeout(self.timer);
            self.timer = setTimeout(function(){
                self.close(0);
            },parseInt(self.params.timeout));
        }

        self.isNoBtOnFocus = !self.isNoBtOnFocus;
        self.focus();
        self.params.win.update();
	};

	this.onKeyReturn = function()
	{
		if(self.isNoBtOnFocus)
		{
			self.close(-1);
		}
		else
		{
			self.close(1);
		}
	};

	this.onKey = function(e)
	{
		var ret = false;
		console.log("In confirmDlg  keyCode:"+e.keyCode);
		switch(e.keyCode)
		{
			case UI.KEY.BACKSPACE:
			case UI.KEY.MENU:
			case UI.KEY.EXIT:
					self.close(0);
				ret = true;
				break;
			case UI.KEY.ENTER:
				self.onKeyReturn();
				ret = true;
				break;
			case UI.KEY.UP:
			case UI.KEY.DOWN:
			case UI.KEY.LEFT:
			case UI.KEY.RIGHT:
				self.onkeyMove();
				ret = true;
				break;
		}
		return ret;
	};
	return this;
}
