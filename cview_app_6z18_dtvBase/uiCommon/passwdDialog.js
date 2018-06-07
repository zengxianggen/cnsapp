/*
* var p = {
 win:self.win,
 rightPasswd:"1234",
 rightDo:function(){
 self.go(MenuPage);
 }
 };
 var pd = new PasswdDialog(p);
 pd.show();
*
* */

function PasswdDialog(params)
{
    var self = this;

    var dialog_w = 430;
    var dialog_h = 212;
    var dialog_l = (UI.width - dialog_w + (params.dl?params.dl:0) )/2;
    var dialog_t = (UI.height - dialog_h +(params.dt?params.dt:0) )/2;

    var input_w = 250;
    var input_h = 47;
    var input_l = (dialog_w-input_w)/2;
    var input_t = (dialog_h-input_h)/2;


    this.dlgParams = [
        {
            uiType:UIFrame,id:"passwdFrame",l:dialog_l,t:dialog_t,w:dialog_w,h:dialog_h,
            type:"img",imgNames:["dialog/password_bg"],stretch:"HV"
        },
        {
            uiType:UILabel,id:"titleLabel",ol:0, ot:dialog_h*0.05,w:dialog_w,h:40,
            font:params.titleFont?params.titleFont:uiCom.font.P20, HAlign:"center",color:"white",
            value:params.titleCont?params.titleCont:Lp.getValue("Pls_Input_Passwd")
        },
        {
            uiType:UIEdit,id:"passwdEdit",ol:input_l,ot:input_t,w:input_w,h:input_h,
            font:params.passwdFont?params.font:uiCom.font.P20, HAlign:"center",value:"",
            password:true,maxChars:params.macChars?params.macChars:4,dt:14,
            focusColor:"black",passwdSpace:"   ",styleClass:"dialog_edit_item"
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
                normal:{type:"block",color:"white"},
                focus:{type:"block",color:"white"}
            }
        });
        self.preFocusWin = params.win.getFocusWin();
        self.dlg = UI.createGroup(self.dlgParams,"passwdDlg",params.win);
        self.dlg.proc = params.proc?params.proc:self.onKey;
        self.inputDlg = self.dlg.getChild("passwdEdit");
        self.inputDlg.setFocus(true);
        self.dlg.update();


    };

    this.close = function(updateFlag)
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

        if(updateFlag)
        {
            params.win.update();
        }

    };

    this.onkeyReturn = function()
    {
        var curPasswd = self.inputDlg.value;
        var rightPasswd = params.rightPasswd?params.rightPasswd:"";
        var maxC = params.macChars?params.macChars:4;
        if(curPasswd.length == maxC && curPasswd == rightPasswd)
        {
            self.close(true);
            if(params.rightDo)
            {
                params.rightDo();
            }
        }
        else
        {
            self.inputDlg.focusColor  =  "red";
            self.inputDlg.update();
            setTimeout(function(){
                self.inputDlg.focusColor  =  "black";
                self.inputDlg.update();
            },1000);
        }



    };

    this.onKey = function(e)
    {
        var ret = true;
        switch(e.keyCode)
        {
            case UI.KEY.ENTER:
                self.onkeyReturn();
                break;
            case UI.KEY.BACKSPACE:
                self.close();
                break;
            default:
                ret = false;
                break;
        }

        return ret;
    };

    return this;
}
