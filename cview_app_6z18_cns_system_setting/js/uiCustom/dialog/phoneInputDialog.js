/*
* var p = {
 win:self.win,
 rightPasswd:"1234",
 rightDo:function(){
 self.go(MenuPage);
 },
 backDo:function(){}
 };
 var pd = new PasswdDialog(p);
 pd.show();
*
* */

function PhoneInputDialog(params)
{
    var self = this;

    var dialog_w = 430;
    var dialog_h = 212;
    var dialog_l = (UI.width - dialog_w + (params.dl?params.dl:0) )/2;
    var dialog_t = (UI.height - dialog_h +(params.dt?params.dt:0) )/2;

    var input_w = 263;
    var input_h = 47;
    var input_l = (dialog_w-input_w)/2;
    var input_t = (dialog_h-input_h)/2;
	
	var width_tips = dialog_w*0.8;
	var left_tips = (dialog_w-width_tips)/2;
	var tipsDlg;
	
	var timer=null;


    this.dlgParams = [
        {
            uiType:UIFrame,l:dialog_l,t:dialog_t,w:dialog_w,h:dialog_h,
            type:"img",imgNames:["dialog/password_bg"],stretch:"HV"
        },
        {
            uiType:UILabel,id:"titleLabel",ol:0, ot:dialog_h*0.05,w:dialog_w,h:40,
            font:params.titleFont?params.titleFont:uiCom.font.P20, HAlign:"center",color:"white",
            value:params.titleCont?params.titleCont:Lp.getValue("Pls_Input_Passwd")
        },
        {
            uiType:UIDialogPhoneEdit,id:"phoneEdit",ol:input_l,ot:input_t,w:input_w,h:input_h,
            font:params.passwdFont?params.font:uiCom.font.F18, HAlign:"center",value:"",
            password:true,maxChars:params.macChars?params.macChars:10,dt:8,dl:0,
            focusColor:"black",styleClass:"dialog_edit_item"
        },
		{
            uiType:UILabel,id:"tipsLabel",ol:left_tips,
            ot:dialog_h*0.65,w:width_tips,h:40,color:"white",
            font:uiCom.font.P20, HAlign:"center",
            value:Lp.getValue("Parameter_is_Illegal_Please_Input_Again"),visibility:0
        },
        {
            uiType:UIImg,id:"okImg",ol:dialog_l*0.2,ot:dialog_h*0.84,
            src:"dialog/ico_ok"
        },
        {
            uiType:UIImg,id:"backImg",ol:dialog_l*0.6,ot:dialog_h*0.84,
            src:"dialog/ico_back"
        },
        {
            uiType:UILabel,id:"okLabel",ol:dialog_l*0.2+UI.res.imgs["dialog/ico_ok"].width + 10,
            ot:dialog_h*0.84,w:dialog_w*0.3,h:40,color:"grey",
            font:uiCom.font.P20, HAlign:"left",
            value:params.okCont?params.okCont:Lp.getValue("Ok")
        },

        {
            uiType:UILabel,id:"backLabel",ol:dialog_l*0.6+UI.res.imgs["dialog/ico_back"].width + 10,
            ot:dialog_h*0.84,w:dialog_w*0.3,h:40,color:"grey",
            font:uiCom.font.P20, HAlign:"left",
            value:params.backCont?params.backCont:Lp.getValue("Cancel")
        },
    ];

    this.show = function()
    {

        UI.res.set("dialog_edit_item",{
            skin:{
                normal:{type:"img",imgNames:["dialog/password_inputBox"],stretch:"HV"},
                focus:{type:"img",imgNames:["dialog/password_inputBox"],stretch:"HV"}
            }
        });

        self.dlg = UI.createGroup(self.dlgParams,"phoneDlg",params.win);
        self.dlg.proc = params.proc?params.proc:self.onKey;
        self.inputDlg = self.dlg.getChild("phoneEdit");
        self.inputDlg.setFocus(true);
		self.inputDlg.openTimer();
		tipsDlg = self.dlg.getChild("tipsLabel");
    };

    this.close = function()
    {
		self.inputDlg.clearTimer();
        self.dlg.destroy();
		self.dlg.update();
    };
	
	function openTimer(){
		if(timer!=null)clearTimer();
		tipsDlg.visibility = 1;
		timer = setTimeout(function(){
			tipsDlg.visibility = 0;
			clearTimer();
		},1000)
	}
	function clearTimer(){
		if(timer!=null){
			clearTimeout(timer);
			timer = null;
		}
	}
	
    this.onkeyReturn = function()
    {
        var curNumber = self.inputDlg.value;
        var maxC = 10;
		if(curNumber.length != maxC){
			self.inputDlg.value="";
			openTimer();
            self.inputDlg.update();
			return;
		}
		self.close();
		if(params.rightDo)
		{
			params.rightDo(curNumber);
		}
    };
	
	function onkeyBackspace(){
		 if(params.backDo)
            {
                params.backDo();
            }
		self.close();
	}

    this.onKey = function(e)
    {
        var ret = true;
        switch(e.keyCode)
        {
            case UI.KEY.ENTER:
                self.onkeyReturn();
                break;
            case UI.KEY.BACKSPACE:
                onkeyBackspace();
                break;
            default:
                ret = false;
                break;
        }

        return ret;
    };

    return this;
}
