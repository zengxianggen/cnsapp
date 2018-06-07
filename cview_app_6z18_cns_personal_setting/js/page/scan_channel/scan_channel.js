function ScanChannelPage(params,srcModule)
{
    var self = this;

	var width_List = 630;
	var height_list = 400;
	
	var width_table = width_List - 40;
	
	var font1 = uiCom.font.F18;
	var font2 = uiCom.font.F22;
	var font3 = uiCom.font.F30;
	
	var color1 = "grey";
	var color2 = "white";
	
	var width_title = width_List*0.3;
	var width_con = width_List*0.6;
	var height_item = 60;
	var height_title = 30;
	
	var left_title = 10;
	var left_con = left_title+width_title+6;
	
	var top_item = 80;
	var scan_timer = null;
	
	var mainDlg;
	var selectDlg;
	
	var is_searching = false;
	
	var freArr = [
		405000,
		729000
		
		//235000,
		//331000
	]

    this.dlgParam =  [
		 {uiType:UIFrame,id:"page_bk",l:0,t:0,w:1280,h:720,type:"hole"},
    ];
	
	var left_nav = 230;

	var bidvalue;
    if(caCom && caCom.caParams) {
        bidvalue = caCom.caParams.bouquetId ? caCom.caParams.bouquetId : sysCom.config.bouquetID;//sysCom.config.bouquetID;
    }
    else {
        bidvalue = sysCom.config.bouquetID;
    }
	var mainParam = [
		{uiType:UIFrame,id:"list_bk",l:(1280 - width_List)/2,t:90,w:width_List,h:height_list,styleClass:"system_setting_bk"},
		{uiType:UILabel,w:width_List,h:50,ol:0,ot:2,dt:10,HAlign:"center",font:font3,value:Lp.getValue("Personal_Settings")+">"+Lp.getValue("Channel_Search")},
		{uiType:UILabel,w:width_title,h:height_title,ol:left_title,ot:top_item,dt:10,HAlign:"right",font:font2,value:Lp.getValue("Frequency")+"(KHz):"},
		{uiType:UIButton,id:"freq_select_button",w:width_con,h:40,ol:left_con,ot:top_item,dt:10,font:font2,value:freArr,styleClass:"setting_select_item",onFocus:true},
		{uiType:UILabel,w:width_title,h:height_title,ol:left_title,ot:top_item+height_item,dt:10,HAlign:"right",font:font2,value:"Bouquet ID:"},
		{uiType:UILabel,w:width_con,h:30,ol:left_con,ot:top_item+height_item,dt:10,font:font2,HAlign:"center",value:bidvalue},
		{uiType:UILabel,w:width_title,h:height_title,ol:left_title,ot:top_item+height_item*2,dt:10,HAlign:"right",font:font2,value:Lp.getValue("Progress")+":"},
		{uiType:UIProgress,id:"search_progress",w:width_con,h:6,ol:left_con+3,ot:top_item+height_item*2+15,value:0,styleClass:"setting_progress",maxValue:100,suffixValue:"%",valueW:83,dt:3},
		
		{uiType:UIImg,id:"icon_search",w:30,h:40,ol:230,ot:top_item+height_item*3,src:"setting/icon_search",visibility:0},
		{uiType:UILabel,id:"search_tip",w:200,h:40,ol:230+30+20,ot:top_item+height_item*3+12,HAlign:"left",value:Lp.getValue("Searching")+"...",font:font1,visibility:0},
		{uiType:UILabel,id:"search_result",w:width_List,h:40,ol:0,ot:top_item+height_item*3+12,HAlign:"center",value:Lp.getValue("Searching")+"...",font:font1,visibility:0},
		
		{uiType:UIImg,w:23,h:20,ol:left_nav,ot:top_item+height_item*4+43,src:"setting/ico_red"},
		{uiType:UILabel,w:100,h:40,ol:left_nav=left_nav+23+6,ot:top_item+height_item*4+43-5,HAlign:"left",value:Lp.getValue("Search"),font:font1},
		{uiType:UIImg,w:47,h:20,ol:left_nav=left_nav+100+20,ot:top_item+height_item*4+43,src:"setting/ico_back"},
		{uiType:UILabel,w:100,h:40,ol:left_nav+47+6,ot:top_item+height_item*4+43-5,HAlign:"left",value:Lp.getValue("Up_Page"),font:font1},
		
	]
	
	
	this.initData = function(){
		
	}
	
	this.initView = function(){
		mainDlg = UI.createGroup(mainParam,"mainDlg",self.win);
		selectDlg = mainDlg.getChild("freq_select_button");
	}
	
	function showSearchTips(){
		mainDlg.getChild("icon_search").visibility = 1;
		mainDlg.getChild("search_tip").visibility = 1;
	}
	
	function showResultTips(param){
		mainDlg.getChild("icon_search").visibility = 0;
		mainDlg.getChild("search_tip").visibility = 0;
		mainDlg.getChild("search_result").visibility = 1;
		mainDlg.getChild("search_result").value = Lp.getValue("TV")+":"+param.tvNum+" "+Lp.getValue("Music")+":"+param.musicNum+" "+Lp.getValue("Information")+":"+param.infoNum+" "
	}
	
	this.startScan = function()
	{
		Scan.scanStop(null,false);

		var freq,sym,qam,params;
			freq = selectDlg.getNumberValue();
			sym = parseInt(sysCom.config.symbol_rate);
			qam = parseInt(sysCom.config.qam);
			params = {"mode": 0, "signal": 0, "car": {"freq": freq, "sym": sym, "qam": qam } };

        params.filter = 1;
        params.bouqId = bidvalue;//caCom.caParams.bouquetId ? caCom.caParams.bouquetId :sysCom.config.bouquetID;

		//sysCom.config.frequency
		if(Scan.scanSetParams(params,false) != 0){
			console.log("scanSetParams error ");	
			return 1;
		}

		if(Scan.scanStart(null,false) !=0)
		{
			console.log("scanStart error ");
			return 1;
		}
		
		mainDlg.getChild("search_result").visibility = 0;
		mainDlg.getChild("icon_search").visibility = 1;
		mainDlg.getChild("search_tip").show();

		is_searching = true;
		self.updateScanStatus();
		return 0;
	}
	
	
	this.updateScanStatus = function(){
		self.closeTimer();
		scan_timer = setInterval(function(){
			var param_tuner = {
				id:0	
			}
			var sig_ret = Tuner.tunerGetStatus(param_tuner,false);
			var param_scan = {start:0,max:10};
			var sch_ret = Scan.scanGetInfo(param_scan,false);
			
			if(!sig_ret){
				console.log("没有得到tuner 状态");
				return;	
			}
			if(!sch_ret){
				console.log("無法獲節目取搜尋信息");
				return;	
			}
			
			var strength = sig_ret.strength;
			var percent = sch_ret.status.percent;
			var scan_status = sch_ret.status.status;
			
			mainDlg.getChild("search_progress").value = percent;

			switch(scan_status)
			{
				case 0:
					console.log("空闲");
					return;
				break;
				case 1:
					console.log("进度为 ："+sch_ret.status.percent);
					console.log("搜索到的节目数量为:"+sch_ret.status.num);

                    console.log("2 search netwrokname="+sch_ret.status.networkname);
                    if(sch_ret.status.networkname != "")
                        sysCom.config.NetworkName = sch_ret.status.networkname;

				break;
				case 2:
					console.log("搜索结束");
					var totlaNum = sch_ret.status.num;
					var tvNum = sch_ret.status.tvNum;
					var radioNum = sch_ret.status.radioNum;
					var infoNum = totlaNum - tvNum - radioNum;

                    if(sch_ret.status.networkname != "")
                        sysCom.config.NetworkName = sch_ret.status.networkname;

					mainDlg.getChild("icon_search").visibility = 0;
					mainDlg.getChild("search_tip").visibility = 0;
					mainDlg.getChild("search_result").value = Lp.getValue("Search_Over")+"! "+Lp.getValue("TV")+":"+tvNum+" "+Lp.getValue("Music")+":"+radioNum+" "+Lp.getValue("Information")+":"+infoNum;
					mainDlg.getChild("search_result").show();
					
					
					self.closeTimer();
					if(sch_ret.status.num == 0){
						console.log("節目數為0");
					}
					
					var saveRes = Scan.scanSave({mode:0},false);

					Scan.scanStop(null,false);

					if(saveRes != 0)
					{
						console.log("保存節目失敗");
						tipDlg.show();
					}
					else{
						dtvCom.reset();
						epgCom.reset();
						recordSchCom.reset();
						reservationCom.reset();
					}

				break;
			};
			self.win.update();
		},1000);
	}
	
	this.closeTimer = function(){
		is_searching = false;
		if(scan_timer){
			console.log("closeTimer");
			clearInterval(scan_timer);
			scan_timer = null;
		}
	}
	
	
    this.open = function(){
		this.initData();
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
			case UI.KEY.FUNRED:
			if(is_searching == true){
				return;
			}
			self.startScan();
			break;
			case UI.KEY.BACKSPACE:
			self.go(PersonalSettingMenuPage);
			Scan.scanStop(null,false);
			self.closeTimer();
				ret = true;
			break;
        }
        return ret;
    };
	
	 function select_proc(e){
        var ret = false;
        if(typeof(this.value) == "object" && this.value.length > 0){
            if(e.keyCode == UI.KEY.LEFT || e.keyCode == UI.KEY.RIGHT){
				if(is_searching == true){
					return;
				}
                var step = (e.keyCode == UI.KEY.LEFT ? -1 : 1);
                this.vIndex = (this.vIndex + step + this.value.length) % this.value.length;
                ret = true;
                this.update();
                this.onkey({keyCode : UI.KEY.WM_VALUE_CHANGE, id : this.id, hwin : this});
            }
        }

        return ret;
    };
}
ScanChannelPage.prototype = UIModule.baseModule;

