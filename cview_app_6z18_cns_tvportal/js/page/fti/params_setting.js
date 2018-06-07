function SignalCheckPage(params,srcModule)
{
    var self = this;

    this.dlgParam=[
        {uiType:UIFrame,id:"bg",l:0,t:0,w:1280,h:720,type:"hole"}
    ];

    var dialog_w = 600;
    var dialog_h = 310;
    var dialog_l = (UI.width - dialog_w)/2;
    var dialog_t = (UI.height - dialog_h)/2;
    var head_h = 70;
    var head_space = 50;

    var qamArr = [
        [
            "256QAM",
            "128QAM",
            "64QAM",
            "32QAM",
            "16QAM"
        ],
        [
            256,
            128,
            64,
            32,
            16
        ]
    ];

    this.stepParam = [
        {uiType:UIFrame,id:"stepFrame",l:dialog_l,t:dialog_t,w:dialog_w,h:dialog_h,styleClass:"system_setting_bk",focusMoveMode:"circle"},
        {uiType:UILabel,id:"title",ol:0,ot:20,w:dialog_w,h:40,color:"white",HAlign:"center",
            value:Lp.getValue("Step3"), font:uiCom.font.F25},

        {uiType:UILabel,id:"head1",ol:0,ot:head_h+head_space*0+5,w:dialog_w*0.4,h:40,color:"grey",HAlign:"right",value:Lp.getValue("Frequency")+"(KHz)"+":",font:uiCom.font.F20},
        {uiType:UILabel,id:"head2",ol:0,ot:head_h+head_space*1+5,w:dialog_w*0.4,h:40,color:"grey",HAlign:"right",value:Lp.getValue("Symbol_rate")+"(Ks/sec)"+":",font:uiCom.font.F20},
        {uiType:UILabel,id:"head3",ol:0,ot:head_h+head_space*2,w:dialog_w*0.4,h:40,color:"grey",HAlign:"right",value:"QAM:",font:uiCom.font.F20},
        {uiType:UILabel,id:"head4",ol:0,ot:head_h+head_space*3,w:dialog_w*0.4,h:40,color:"grey",HAlign:"right",value:"BID:",font:uiCom.font.F20},


        {uiType:UIEdit,id:"cont1",ol:dialog_w*0.41,ot:head_h+head_space*0+5,w:dialog_w*0.4,h:30,dt:6,HAlign:"center",value:""+sysCom.config.frequency,maxChars:6,styleClass:"setting_edit_item",onFocus:true},
        {uiType:UIEdit,id:"cont2",ol:dialog_w*0.41,ot:head_h+head_space*1+5,w:dialog_w*0.4,h:30,dt:6,HAlign:"center",value:""+sysCom.config.symbol_rate,maxChars:4,styleClass:"setting_edit_item"},
        {uiType:UIButton,id:"cont3",ol:dialog_w*0.41,ot:head_h+head_space*2,w:dialog_w*0.4,h:30,dt:6,HAlign:"center",value:qamArr[0],styleClass:"setting_select_item"},
        {uiType:UILabel,id:"cont4",ol:dialog_w*0.41,ot:head_h+head_space*3,w:dialog_w*0.4,h:30,dt:5,color:"white",HAlign:"center",value:"0",font:uiCom.font.F20},

        {uiType:UIImg,id:"icon_ok",ol:dialog_w*0.42,ot:head_h+head_space*4 + 4 ,src:"dialog/ico_ok"},
        {uiType:UILabel,id:"botCont1",ol:dialog_w*0.42+UI.res.imgs["dialog/ico_ok"].width+10,ot:head_h+head_space*4,
            w:dialog_w*0.4,h:40,dt:0,color:"grey",HAlign:"left",value:Lp.getValue("Next"),font:uiCom.font.F20}
    ];


    this.open = function() {
        this.defOpen();
        self.dlg = UI.createGroup(this.stepParam,"stepDlg",self.win);

        if(caCom && caCom.caParams && caCom.caParams.bouquetId){
            self.dlg.getChild("cont4").value = caCom.caParams.bouquetId;
        }
        else{
            self.dlg.getChild("cont4").value = sysCom.config.bouquetID;
        }
    };

    this.start = function() {

    };

    this.stop = function() {

    };

    this.close = function() {
        this.defClose();
    };

    this.getParams = function(){
        var freq = parseInt(self.dlg.getChild("cont1").value,10);
        var symRate = parseInt(self.dlg.getChild("cont2").value,10);
        var qam = qamArr[1][self.dlg.getChild("cont3").vIndex];
        var bid = parseInt(self.dlg.getChild("cont4").value,10);

        var params =  {
            "mode": 0,
            "signal": 0,
            "car": {
                "freq": freq,
                "sym": symRate,
                "qam": qam
            },
            "filter":1,
            "bouqId":bid
        };
        return params;
    };

    this.onkey = function(e)
    {
        var ret = true;
        switch(e.keyCode)
        {
            case UI.KEY.ENTER:
                self.go(ScanPage,SignalCheckPage,self.getParams());
                break;
        }
        return ret;
    };
}
SignalCheckPage.prototype = UIModule.baseModule;