// JavaScript Document

var orderStorage = {
		server:"",
		CrmId:0,
		CrmWorkOrder:"",
		CrmInstallName:"",
		CrmBpName:"",
		CrmWorker1:"",
		MobilePhone:""
};

function WorkOrderReturnPage(params,srcModule)
{
    var self = this;

	
    this.dlgParam =  [
        {uiType:UIFrame,id:"page_bk",l:0,t:0,w:1280,h:720,type:"hole"},
		 //{uiType:UIFrame,id:"page_bk",l:0,t:0,w:1280,h:720,type:"img",imgNames:["setting/default_background"]},
    ];
	
	
	this.initView = function(){
		queryWorkOrder.create(self.win);
		showWorkOrder.create(self.win);
		cmQuery.create(self.win);
		queryCMMAC.create(self.win);
		showCMMAC.create(self.win);
		submitWorkOrder.create(self.win);
		loadingDialog.create(self.win);
		reportTipsDialog.create(self.win);
		queryWorkOrder.show();
	}
	
    this.open = function(){
        this.defOpen();
		this.initView();
    };

    this.close = function(){
        this.defClose();
    };

    this.start = function(){
    };
	
    this.onkey = function(e)
    {
        var ret = false;
        switch(e.keyCode)
        {
            case UI.KEY.ENTER:
			break;
			case UI.KEY.BACKSPACE:
			self.go(SystemSettingMenuPage);
			break;
        }
        return ret;
    };
}
WorkOrderReturnPage.prototype = UIModule.baseModule;
