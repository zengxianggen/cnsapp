function SignalCheckPage(params,srcModule)
{
    var self = this;

    this.dlgParam=[
        {uiType:UIFrame,id:"bg",l:0,t:0,w:1280,h:720,styleClass:"hole"}
    ];


    var dialog_w = 600;
    var dialog_h = 410;
    var dialog_l = (UI.width - dialog_w)/2;
    var dialog_t = (UI.height - dialog_h)/2;

    var head_h = 70;
    var head_space = 50;


    var timer = null;

    this.stepParam = [
        {uiType:UIFrame,id:"stepFrame",l:dialog_l,t:dialog_t,w:dialog_w,h:dialog_h,styleClass:"system_setting_bk",focusMoveMode:"circle"},
        {uiType:UILabel,id:"title",ol:0,ot:20,w:dialog_w,h:40,color:"white",HAlign:"center",
            value:Lp.getValue("system_setting")+ " > " + Lp.getValue("Singal_Check"),
            font:uiCom.font.F25},

        {uiType:UILabel,id:"head1",ol:0,ot:head_h+head_space*0+10,w:dialog_w*0.4,h:40,color:"grey",HAlign:"right",value:Lp.getValue("Frequency")+"(KHz)"+":",font:uiCom.font.F20},
        {uiType:UILabel,id:"head2",ol:0,ot:head_h+head_space*1+10,w:dialog_w*0.4,h:40,color:"grey",HAlign:"right",value:Lp.getValue("Symbol_rate")+"(Ks/sec)"+":",font:uiCom.font.F20},
        {uiType:UILabel,id:"head3",ol:0,ot:head_h+head_space*2,w:dialog_w*0.4,h:40,color:"grey",HAlign:"right",value:"QAM:",font:uiCom.font.F20},
        {uiType:UILabel,id:"head4",ol:0,ot:head_h+head_space*3,w:dialog_w*0.4,h:40,color:"grey",HAlign:"right",value:Lp.getValue("Signal")+"BER:",font:uiCom.font.F20},
        {uiType:UILabel,id:"head5",ol:0,ot:head_h+head_space*4,w:dialog_w*0.4,h:40,HAlign:"right",color:"grey",value:"SNR:",font:uiCom.font.F20},
        {uiType:UILabel,id:"head6",ol:0,ot:head_h+head_space*5,w:dialog_w*0.4,h:40,HAlign:"right",color:"grey",value:Lp.getValue("Signal_Strength")+":",font:uiCom.font.F20},


        {uiType:UIEdit,id:"cont1",ol:dialog_w*0.41,ot:head_h+head_space*0,w:dialog_w*0.4,h:30,dt:13,HAlign:"center",value:"405000",maxChars:6,styleClass:"setting_edit_item",onFocus:true},
        {uiType:UIEdit,id:"cont2",ol:dialog_w*0.41,ot:head_h+head_space*1,w:dialog_w*0.4,h:30,dt:13,HAlign:"center",value:"5217",maxChars:4,styleClass:"setting_edit_item"},
        {uiType:UIButton,id:"cont3",ol:dialog_w*0.41,ot:head_h+head_space*2,w:dialog_w*0.4,h:30,dt:6,HAlign:"center",value:["QAM64","QAM128","QAM256"],styleClass:"setting_select_item"},
        {uiType:UILabel,id:"cont4",ol:dialog_w*0.41,ot:head_h+head_space*3,w:dialog_w*0.4,h:30,dt:5,color:"white",HAlign:"center",value:"0",font:uiCom.font.F20},
        {uiType:UIProgress,id:"cont5",ol:dialog_w*0.41,ot:head_h+head_space*4+10,w:dialog_w*0.58,h:10,value:0,styleClass:"setting_progress",maxValue:100,suffixValue:" dB",valueW:100,font:uiCom.font.F20},
        {uiType:UIProgress,id:"cont6",ol:dialog_w*0.41,ot:head_h+head_space*5+10,w:dialog_w*0.58,h:10,value:0,styleClass:"setting_progress",maxValue:100,suffixValue:" dbuV",valueW:100,font:uiCom.font.F20},


        {uiType:UIImg,id:"icon_ok",ol:dialog_w*0.36,ot:head_h+head_space*6 + 4 ,src:"setting/ico_ok"},
        {uiType:UILabel,id:"botCont1",ol:dialog_w*0.36+UI.res.imgs["setting/ico_ok"].width+10,ot:head_h+head_space*6,
            w:dialog_w*0.4,h:40,dt:0,color:"grey",HAlign:"left",value:Lp.getValue("Detection"),font:uiCom.font.F20},

        {uiType:UIImg,id:"icon_back",ol:dialog_w*0.6,ot:head_h+head_space*6 + 4 ,src:"setting/ico_back"},
        {uiType:UILabel,id:"botCont2",ol:dialog_w*0.6+UI.res.imgs["setting/ico_back"].width+10,ot:head_h+head_space*6,
            w:dialog_w*0.4,h:40,dt:0,color:"grey",HAlign:"left",value:Lp.getValue("last_page"),font:uiCom.font.F20}

    ];


    this.open = function()
    {
        this.defOpen();
    };

    this.start = function()
    {
        self.dlg = UI.createGroup(this.stepParam,"stepDlg",self.win);
        self.process1 = self.dlg.getChild("cont5");
        self.process2 = self.dlg.getChild("cont6");
    };

    this.stop = function()
    {
        if(timer)
        {
            clearInterval(timer);
            timer =null;
        }
    };

    this.close = function()
    {
        this.defClose();
    };


    this.onkeyReturn = function()
    {

        var param = {
            "id": 0,
            "signal": 0,
            "car":
            {
                "freq":parseInt(self.dlg.getChild("cont1").value,10),
                "sym":parseInt(self.dlg.getChild("cont2").value,10),
                "qam": 64
            }
        };



        self.qamDlg = self.dlg.getChild("cont3");

        if(self.qamDlg.vIndex == 0)
        {
            param.car.qam = 64;
        }
        else if(self.qamDlg.vIndex == 1)
        {
            param.car.qam = 128;
        }
        else
        {
            param.car.qam = 256;
        }

        var ret = Tuner.tunerConnect(param,false);
		
		if(timer == null)
		{
			timer = setInterval(function(){
				var ret = Tuner.tunerGetStatus({"id":0},false);
				self.process1.value = ret.snr;
				self.process2.value = Math.abs(ret.strength);
				self.dlg.update();
        	},1000*2);
		}
    };
    this.onkey = function(e)
    {
        var ret = false;
        console.log("In SignalCheckPage  module keyCode =" +  e.keyCode );

        switch(e.keyCode)
        {
            case UI.KEY.ENTER:
                self.onkeyReturn();
                ret = true;
                break;
            case UI.KEY.BACKSPACE:
                self.go(SystemSettingMenuPage);
                break;
        }
        return ret;
    };
}
SignalCheckPage.prototype = UIModule.baseModule;