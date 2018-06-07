/**
 * Created by tony_vopo on 2016/9/7.
 */
function ScanChannelPage(params,srcModule)
{
    var self = this;
	
	var width_dialog = 1280*0.7;
	var height_dialog = 720*0.75;

	var font1 = uiCom.font.P20;
	var font2 = uiCom.font.P35;
	
	var operationDlg;
	var operationDlgNo;
	var operationDlgOn;
	var operationList;
	var netSearchDlg;
	var	netSearchDlgNo;
	var netSearchDlgOn;
	var manualSearchDlg;
	var manualSearchDlgNo;
	var manualSearchDlgOn;
	
	var navLeftDlg;
	var navRightDlg;
	
	var imgDlg;
	
	
	var qam_array = [64,128,256];
	
	var is_searching = false;
	var scan_timer;
	var listItems;
    var g_freq = 0;
    var g_sym = 0;
    var g_qam = 0;
	this.initData = function(){
		listItems = new Array();
		listItems[0] = new Array();
		listItems[0][0] = Lp.getValue("Network_Search");
		listItems[1] = new Array();
		listItems[1][0] = Lp.getValue("Manual_Search");
	}

    this.dlgParam =  [
        {uiType:UIFrame,id:"page_bk",l:0,t:0,w:1280,h:720,styleClass:"None"}
    ];
	
	this.dialog_param = [
		{uiType:UIFrame,id:"dialog_bk",l:(1280-width_dialog)/2,t:100,w:width_dialog,h:height_dialog,styleClass:"setting_dialog_bk"},
		{uiType:UILabel,id:"dialog_title",w:300,h:40,ol:(width_dialog-300)/2,ot:10,value:Lp.getValue("System_Setting")+">"+Lp.getValue("Search_Channel"),font:font2,HAlign:"center"}
	];
	
	var left_list = (1280-width_dialog)/2 + 20;
	var top_content = 100 + 60;
	var width_content_left = width_dialog*0.25;
	var height_content = height_dialog*0.77;
	var space_v_list = 8;
	var height_item = 36;
	var space_v_item = space_v_list + height_item;
	var top_item_ot = 8;
	var height_progress = 8;
	
	this.openration_list = [
		{uiType:UIFrame,id:"list_bk",w:width_content_left,h:height_content,l:left_list,t:top_content,styleClass:"None",focusMoveMode:"circle"},
		{uiType:UIFrame,id:"list_bk_normal",w:width_content_left,h:height_content,l:left_list,t:top_content,type:"3imgv",cls:"setting/systemSetLeftGrey"},
		{uiType:UIFrame,id:"list_bk_onfocus",w:width_content_left,h:height_content,l:left_list,t:top_content,type:"3imgv",cls:"setting/systemSetLeftBlue"},
		{uiType:UITable,id:"list_table",w:width_content_left*0.88,h:height_item*2+space_v_list*3,ol:12,ot:top_item_ot,lineRectWidth:0,lineHWidth:0,lineVWidth:0,lineColor:"#505050", cols:1,rows:2,rowsOnePage:2,focusEnlargeV:-10,font:font1,
		skin:{
				normalBar:{type:"none"},
				selectBar:{type:"3imgh",cls:"setting/greybar"},
				focusBar:{type:"3imgh",cls:"setting/bluebar"},
			}
		},
		
	];
	
	var width_content_right = width_dialog*0.61;
	var width_title = width_content_right*0.35;
	var width_item = width_content_right*0.55;
	var left_item = width_title + 10;
	var item_dt = 6;
	this.net_search = [
		{uiType:UIFrame,id:"net_bk",w:width_content_right,h:height_content,l:left_list+width_content_left+10,t:top_content,styleClass:"None",focusMoveMode:"circle"},
		{uiType:UIFrame,id:"net_bk_normal",w:width_content_right,h:height_content,l:left_list+width_content_left+10,t:top_content,type:"3imgv",cls:"setting/systemSetRightGrey"},
		{uiType:UIFrame,id:"net_bk_onfocus",w:width_content_right,h:height_content,l:left_list+width_content_left+10,t:top_content,type:"3imgv",cls:"setting/systemSetRightBlue",visibility:0},
		{uiType:UILabel,id:"frequency_title",w:width_title,h:height_item,ol:2,ot:top_item_ot,dt:item_dt,HAlign:"right",value:Lp.getValue("Frequency")+"(kHz):",font:font1},
		{uiType:UILabel,id:"sym_title",w:width_title,h:height_item,ol:2,ot:top_item_ot+space_v_item,dt:item_dt,HAlign:"right",value:Lp.getValue("Symbol_rate")+"(ks/sec):",font:font1},
		{uiType:UILabel,id:"qam_title",w:width_title,h:height_item,ol:2,ot:top_item_ot+space_v_item*2,dt:item_dt,HAlign:"right",value:"QAM:",font:font1},
		{uiType:UILabel,id:"bid_title",w:width_title,h:height_item,ol:2,ot:top_item_ot+space_v_item*3,dt:item_dt,HAlign:"right",value:"Bouquet ID:",font:font1},
		{uiType:UILabel,id:"signal_title",w:width_title,h:height_item,ol:2,ot:top_item_ot+space_v_item*4,dt:item_dt,HAlign:"right",value:Lp.getValue("Signal")+" BER:",font:font1},
		{uiType:UILabel,id:"snr_title",w:width_title,h:height_item,ol:2,ot:top_item_ot+space_v_item*5,dt:item_dt,HAlign:"right",value:"SNR:",font:font1},
		{uiType:UILabel,id:"signal_strength_title",w:width_title,h:height_item,ol:2,ot:top_item_ot+space_v_item*6,dt:item_dt,HAlign:"right",value:Lp.getValue("Signal_Strength")+":",font:font1},
		{uiType:UILabel,id:"progress_title",w:width_title,h:height_item,ol:2,ot:top_item_ot+space_v_item*7,dt:item_dt,HAlign:"right",value:Lp.getValue("Progress")+":",font:font1},
		
		{uiType:UIEdit,id:"frequency_edit",w:width_item,h:height_item,ol:left_item,ot:top_item_ot,dt:item_dt,HAlign:"center",value:""+405,styleClass:"setting_edit_item",maxChars:6},
		{uiType:UIEdit,id:"sym_edit",w:width_item,h:height_item,ol:left_item,ot:top_item_ot+space_v_item,dt:item_dt,HAlign:"center",value:5217,maxChars:4,styleClass:"setting_edit_item"},
		{uiType:UIButton,id:"qam_edit",w:width_item,h:height_item,ol:left_item,ot:top_item_ot+space_v_item*2,dt:item_dt,HAlign:"center",vIndex:2,value:[qam_array[0],qam_array[1],qam_array[2]],styleClass:"setting_select_item"},
		{uiType:UILabel,id:"bid_item",w:width_item,h:height_item,ol:left_item,ot:top_item_ot+space_v_item*3,dt:item_dt,HAlign:"center",value:25149,font:font1},
		{uiType:UILabel,id:"signal_item",w:width_item,h:height_item,ol:left_item,ot:top_item_ot+space_v_item*4,dt:item_dt,HAlign:"center",value:0,font:font1},
		{uiType:UIProgress,id:"snr_progress",w:width_item+20,h:height_progress,ol:left_item,ot:top_item_ot+space_v_item*5+9,value:0,styleClass:"setting_progress",maxValue:100,suffixValue:"dB",valueW:83,dt:3},
		{uiType:UIProgress,id:"ss_progress",w:width_item+20,h:height_progress,ol:left_item,ot:top_item_ot+space_v_item*6+9,value:0,styleClass:"setting_progress",maxValue:100,suffixValue:"dB",valueW:83,dt:3},
		{uiType:UIProgress,id:"search_progress",w:width_item+20,h:height_progress,ol:left_item,ot:top_item_ot+space_v_item*7+9,value:0,styleClass:"setting_progress",maxValue:100,suffixValue:"%",valueW:83,dt:3},
		
		/*{uiType:UIImg,id:"icon_search",w:30,h:40,ol:220,ot:top_item_ot+space_v_item*8+2,visibility:0,src:"setting/icon_search"},*/
		{uiType:UILabel,id:"search_tip",w:200,h:40,ol:220+30+20,ot:top_item_ot+space_v_item*8+12,HAlign:"left",value:Lp.getValue("Searching")+"...",font:font1,visibility:0},
		{uiType:UILabel,id:"search_result",w:width_content_right,h:40,ol:0,ot:top_item_ot+space_v_item*8+12,HAlign:"center",value:Lp.getValue("Searching")+"...",font:font1,visibility:0},
	];
	
	this.manual_search = [
		{uiType:UIFrame,id:"manual_bk",w:width_content_right,h:height_content,l:left_list+width_content_left+10,t:top_content,styleClass:"None",focusMoveMode:"circle",visibility:0},
		{uiType:UIFrame,id:"manual_bk_normal",w:width_content_right,h:height_content,l:left_list+width_content_left+10,t:top_content,type:"3imgv",cls:"setting/systemSetRightGrey",focusMoveMode:"circle",},
		{uiType:UIFrame,id:"manual_bk_onfocus",w:width_content_right,h:height_content,l:left_list+width_content_left+10,t:top_content,type:"3imgv",cls:"setting/systemSetRightBlue",focusMoveMode:"circle",visibility:0},
		{uiType:UILabel,id:"frequency_title",w:width_title,h:height_item,ol:2,ot:top_item_ot,dt:item_dt,HAlign:"right",value:Lp.getValue("Frequency")+"(kHz):",font:font1},
		{uiType:UILabel,id:"sym_title",w:width_title,h:height_item,ol:2,ot:top_item_ot+space_v_item,dt:item_dt,HAlign:"right",value:Lp.getValue("Symbol_rate")+"(ks/sec):",font:font1},
		{uiType:UILabel,id:"qam_title",w:width_title,h:height_item,ol:2,ot:top_item_ot+space_v_item*2,dt:item_dt,HAlign:"right",value:"QAM:",font:font1},

		{uiType:UILabel,id:"signal_title",w:width_title,h:height_item,ol:2,ot:top_item_ot+space_v_item*4,dt:item_dt,HAlign:"right",value:Lp.getValue("Signal")+" BER:",font:font1},
		{uiType:UILabel,id:"snr_title",w:width_title,h:height_item,ol:2,ot:top_item_ot+space_v_item*5,dt:item_dt,HAlign:"right",value:"SNR:",font:font1},
		{uiType:UILabel,id:"signal_strength_title",w:width_title,h:height_item,ol:2,ot:top_item_ot+space_v_item*6,dt:item_dt,HAlign:"right",value:Lp.getValue("Signal_Strength")+":",font:font1},
		{uiType:UILabel,id:"progress_title",w:width_title,h:height_item,ol:2,ot:top_item_ot+space_v_item*7,dt:item_dt,HAlign:"right",value:Lp.getValue("Progress")+":",font:font1},
		
		{uiType:UIEdit,id:"frequency_edit",w:width_item,h:height_item,ol:left_item,ot:top_item_ot,dt:item_dt,HAlign:"center",value:405,styleClass:"setting_edit_item",maxChars:6},
		{uiType:UIEdit,id:"sym_edit",w:width_item,h:height_item,ol:left_item,ot:top_item_ot+space_v_item,dt:item_dt,HAlign:"center",maxChars:4,value:5217,styleClass:"setting_edit_item"},
		{uiType:UIButton,id:"qam_edit",w:width_item,h:height_item,ol:left_item,ot:top_item_ot+space_v_item*2,dt:item_dt,HAlign:"center",vIndex:2,value:[qam_array[0],qam_array[1],qam_array[2]],styleClass:"setting_select_item"},

		{uiType:UILabel,id:"signal_item",w:width_item,h:height_item,ol:left_item,ot:top_item_ot+space_v_item*4,dt:item_dt,HAlign:"center",value:0,font:font1},
		{uiType:UIProgress,id:"snr_progress",w:width_item+20,h:height_progress,ol:left_item,ot:top_item_ot+space_v_item*5+9,value:0,styleClass:"setting_progress",maxValue:100,suffixValue:"dB",valueW:83,dt:3},
		{uiType:UIProgress,id:"ss_progress",w:width_item+20,h:height_progress,ol:left_item,ot:top_item_ot+space_v_item*6+9,value:0,styleClass:"setting_progress",maxValue:100,suffixValue:"dB",valueW:83,dt:3},
		{uiType:UIProgress,id:"search_progress",w:width_item+20,h:height_progress,ol:left_item,ot:top_item_ot+space_v_item*7+9,value:0,styleClass:"setting_progress",maxValue:100,suffixValue:"%",valueW:83,dt:3},
		
		/*{uiType:UIImg,id:"icon_search",w:30,h:40,ol:220,ot:top_item_ot+space_v_item*8+2,visibility:0,src:"setting/icon_search"},*/
		{uiType:UILabel,id:"search_tip",w:200,h:40,ol:220+30+20,ot:top_item_ot+space_v_item*8+12,HAlign:"left",value:Lp.getValue("Searching")+"...",font:font1,visibility:0},
		{uiType:UILabel,id:"search_result",w:width_content_right,h:40,ol:0,ot:top_item_ot+space_v_item*8+12,HAlign:"center",value:Lp.getValue("Searching")+"...",font:font1,visibility:0},
	];
	
	this.nav_focus_left = [
		{uiType:UIFrame,id:"dialog_bk",l:(1280-width_dialog)/2,t:height_content+180,w:width_dialog,h:60,styleClass:"None"},
		{uiType:UIImg,id:"nav1",w:34,h:26,ol:300,ot:0,src:"setting/ico_rightArrow"},
		{uiType:UILabel,id:"nav1_text",w:200,h:40,ol:300+34+6,ot:-3,value:Lp.getValue("Move_Focus_Right"),font:font1},
		{uiType:UIImg,id:"nav1",w:47,h:26,ol:560,ot:0,src:"setting/ico_back"},
		{uiType:UILabel,id:"nav1_text",w:200,h:40,ol:560+47+6,ot:-3,value:Lp.getValue("UP_Page"),font:font1}
	];
	this.nav_focus_right = [
		{uiType:UIFrame,id:"dialog_bk",l:(1280-width_dialog)/2,t:height_content+180,w:width_dialog,h:60,styleClass:"None",visibility:0},
		{uiType:UIImg,id:"nav1",w:23,h:26,ol:300,ot:0,src:"setting/ico_red"},
		{uiType:UILabel,id:"nav1_text",w:200,h:40,ol:300+23+6,ot:-3,value:Lp.getValue("Search"),font:font1},
		{uiType:UIImg,id:"nav1",w:47,h:26,ol:430,ot:0,src:"setting/ico_back"},
		{uiType:UILabel,id:"nav1_text",w:200,h:40,ol:430+47+6,ot:-3,value:Lp.getValue("UP_Page"),font:font1},
	];
	
	this.initView = function(){
		UI.createGroup(this.dialog_param,"step1Dlg",this.win);	
		operationDlg = UI.createGroup(this.openration_list,"operationDlg",this.win);
		operationList = operationDlg.getChild("list_table");
		operationDlgNo = operationDlg.getChild("list_bk_normal");
		operationDlgOn = operationDlg.getChild("list_bk_onfocus");
		netSearchDlg = UI.createGroup(this.net_search,"netSearchDlg",this.win,null,null,this.right_net_proc);
		netSearchDlgNo = netSearchDlg.getChild("net_bk_normal");
		netSearchDlgOn = netSearchDlg.getChild("net_bk_onfocus");
		manualSearchDlg = UI.createGroup(this.manual_search,"manualSearchDlg",this.win,null,null,this.right_manual_proc);
		manualSearchDlgNo = manualSearchDlg.getChild("manual_bk_normal");
		manualSearchDlgOn = manualSearchDlg.getChild("manual_bk_onfocus");
		navLeftDlg = UI.createGroup(this.nav_focus_left,"navLeftDlg",this.win);	
		navRightDlg = UI.createGroup(this.nav_focus_right,"navRightDlg",this.win);
		
		
		operationList.addItems(listItems);
		operationList.defProc = self.table_proc;
		operationList.curIndex = 0;
		operationList.setFocus(true);
		
		netSearchDlg.getChild("frequency_edit").value = ""+sysCom.config.frequency;
		netSearchDlg.getChild("sym_edit").value = ""+sysCom.config.symbol_rate;
		
		manualSearchDlg.getChild("frequency_edit").value = ""+sysCom.config.frequency;
		manualSearchDlg.getChild("sym_edit").value = ""+sysCom.config.symbol_rate;
		var qam = sysCom.config.qam;
		if(qam == 64 || qam == "64")
		{
			netSearchDlg.getChild("qam_edit").vIndex = 0;
			manualSearchDlg.getChild("qam_edit").vIndex = 0;
		}
		else if(qam == 128 || qam == "128")
		{
			netSearchDlg.getChild("qam_edit").vIndex = 1;
			manualSearchDlg.getChild("qam_edit").vIndex = 1;
		}
		else
		{
			netSearchDlg.getChild("qam_edit").vIndex = 2;
			manualSearchDlg.getChild("qam_edit").vIndex = 2;
		}

		if(caCom && caCom.caParams) {
            netSearchDlg.getChild("bid_item").value = caCom.caParams.bouquetId ? caCom.caParams.bouquetId : sysCom.config.bouquetID;//sysCom.config.bouquetID;
        }
        else {
            netSearchDlg.getChild("bid_item").value = sysCom.config.bouquetID;
		}
		createImg();
	};
	
    this.open = function(){
		this.initData();
        this.defOpen();
		this.initView();
    };

    this.close = function(){

		dtvCom.getChannels();
        this.defClose();
    };

    this.start = function(){
    };

    this.stop = function(){
    };
	
	this.startScan = function(curDlg,mode)
	{
		Scan.scanStop(null,false);

		var freq,sym,qam,params;
			freq = curDlg.getChild("frequency_edit").getNumberValue();
			sym = curDlg.getChild("sym_edit").getNumberValue();
			qam = curDlg.getChild("qam_edit").getNumberValue();
			params = {"mode": mode, "signal": 0, "car": {"freq": freq, "sym": sym, "qam": qam } };
			if(mode == 0 ) {
                params.filter = 1;
                params.bouqId = curDlg.getChild("bid_item").value;//caCom.caParams.bouquetId ? caCom.caParams.bouquetId :sysCom.config.bouquetID;
            }
            else
			{
                params.filter = 0;
			}
			console.log("scanSetParams:"+JSON.stringify(params));

		if(Scan.scanSetParams(params,false) != 0){
			console.log("scanSetParams error ");	
			return 1;
		}

		if(Scan.scanStart(null,false) !=0)
		{
			console.log("scanStart error ");
			return 1;
		}
		
		curDlg.getChild("search_result").visibility = 0;

		imgDlg.style.visibility = "visible";

		curDlg.getChild("search_tip").show();

		is_searching = true;
		return 0;
	}
	
	var width_img = 50;
	var height_img = 50;
	var left_img = left_list+width_content_left+10 + 210;
	var top_img = top_item_ot+space_v_item*8+2+top_content;
	
	function createImg(){
		var body = document.getElementsByTagName('body')[0];
		imgDlg = document.getElementById("search_img");
		if(!imgDlg){
			imgDlg = document.createElement("img");
			imgDlg.setAttribute("id", "search_img");
			imgDlg.style.position = "absolute";
			imgDlg.style.left = left_img;
			imgDlg.style.top = top_img;
			imgDlg.style.width = width_img;
			imgDlg.style.height = height_img;
			body.appendChild(imgDlg);
		}
		
		imgDlg.src = "./black/setting/search_animation.gif";
		imgDlg.style.visibility = "hidden";
	}
	
	
	this.updateScanStatus = function(curDlg){
		self.closeTimer();
		scan_timer = setInterval(function(){

			//
            var curIndex = operationList.curIndex;
            if(curIndex == 0)
            {

                TunerConnect(netSearchDlg);


            }
            else{


                TunerConnect(manualSearchDlg);

            }



			var param_tuner = {
				id:0	
			};
			var sig_ret = Tuner.tunerGetStatus(param_tuner,false);
			var param_scan = {start:0,max:10};
			var sch_ret = Scan.scanGetInfo(param_scan,false);
			console.log(JSON.stringify(sch_ret));
			if(!sig_ret){
				console.log("没有得到tuner 状态");
				return;	
			}
			if(!sch_ret){
				console.log("無法獲節目取搜索信息");
				return;	
			}
			var ber = sig_ret.errRate;
            var testber = ber/1000000000;
            var testber1= testber.toExponential(2);//转换成科学计数

			var snr = sig_ret.snr;
			var strength = sig_ret.strength;
			var percent = sch_ret.status.percent;

			var scan_status = sch_ret.status.status;

            curDlg.getChild("signal_item").value=testber1;
			curDlg.getChild("snr_progress").value = snr;
			curDlg.getChild("ss_progress").value = Math.abs(strength);
			curDlg.getChild("search_progress").value = percent;

			switch(scan_status)
			{
				case 0:
					console.log("空闲");
					return;
				break;
				case 1:
					console.log("进度为 ："+sch_ret.status.percent);
					console.log("搜索到的节目数量为:"+sch_ret.status.num);

                    console.log("system 1 search netwrokname="+sch_ret.status.networkname);
                    if(curIndex == 0)//network search
                    {
                    	if(sch_ret.status.networkname != "")
                           sysCom.config.NetworkName = sch_ret.status.networkname;
                    }
                    else
					{
                        sysCom.config.NetworkName="";//手動搜索清空
					}

				break;
				case 2:
					console.log("搜索结束");
					var totlaNum = sch_ret.status.num;
					var tvNum = sch_ret.status.tvNum;
					var radioNum = sch_ret.status.radioNum;
					var infoNum = totlaNum - tvNum - radioNum;

                    if(curIndex == 0)//network search
                    {
                        if(sch_ret.status.networkname != "")
                            sysCom.config.NetworkName = sch_ret.status.networkname;
                    }
                    else
                    {
                            sysCom.config.NetworkName="";//手動搜索清空
                    }
					curDlg.getChild("search_tip").visibility = 0;
					imgDlg.style.visibility = "hidden";
					curDlg.getChild("search_result").value = Lp.getValue("Search_Over")+"! "+Lp.getValue("TV")+":"+tvNum+" "+Lp.getValue("Music")+":"+radioNum+" "+Lp.getValue("Information")+":"+infoNum;
					curDlg.getChild("search_result").show();
					
					is_searching = false;
					
					if(sch_ret.status.num == 0){
						console.log("節目數為0");
					}
					
					var saveRes = Scan.scanSave({mode:self.mode},false);

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
		
		if(scan_timer){
			console.log("closeTimer");
			clearInterval(scan_timer);
			scan_timer = null;
		}
	}
	
    this.onkey = function(e)
    {
        var ret = false;
        console.log("In ScanChannelPage module keyCode =" +  e.keyCode );
        switch(e.keyCode)
        {
            case UI.KEY.BACKSPACE:
			break;
        }
        return ret;
    };
	
	function TunerConnect(curDlg){
		var freq,sym,qam;
			freq = curDlg.getChild("frequency_edit").getNumberValue();
			sym = curDlg.getChild("sym_edit").getNumberValue();
			qam = qam_array[curDlg.getChild("qam_edit").vIndex];
		var param = {
			id:"0",
			signal:"0",
			car:{
				freq:freq,
				sym:sym,
				qam:qam
			}
		};
		if(g_freq!=	freq || g_sym!=sym ||g_qam!=qam ) {
            Tuner.tunerConnect(param, false);

        }
        g_freq = freq;
        g_sym = sym;
        g_qam = qam;
	}
	
	this.table_proc = function(e){
		var ret = false;
		console.log("channel list tableProc keyCode =="+e.keyCode);
		switch(e.keyCode){
			case UI.KEY.BACKSPACE:
				Scan.scanStop(null,false);
				self.go(SystemSettingMenuPage);
				ret = true;
			break;
			case UI.KEY.UP:
				var curIndex = operationList.curIndex;
				operationList.listUp();
				if(curIndex == 0){
					netSearchDlg.visibility = 0;
					manualSearchDlg.show();
				}
				else{
					manualSearchDlg.visibility = 0;
					netSearchDlg.show();
					
				}
				ret = true;
			break;
			case UI.KEY.DOWN:
				var curIndex = operationList.curIndex;
				operationList.listDown();
				if(curIndex == 0){
					netSearchDlg.visibility = 0;
					manualSearchDlg.show();
				}
				else{
					manualSearchDlg.visibility = 0;
					netSearchDlg.show();
				}
				ret = true;
			break;
			case UI.KEY.RIGHT:
				var curIndex = operationList.curIndex;
				if(curIndex == 0)
				{
					console.log("netSearchDlg.visibility -===="+netSearchDlg.visibility);
					navLeftDlg.visibility = 0;
					navRightDlg.visibility = 1;
					netSearchDlgNo.visibility = 0;
					netSearchDlgOn.visibility = 1;
					operationDlgNo.visibility = 1;
					operationDlgOn.visibility = 0;
					TunerConnect(netSearchDlg);
					self.updateScanStatus(netSearchDlg);
					netSearchDlg.getChild("frequency_edit").setFocus(true);
					self.win.update();
				}
				else{
					
					navLeftDlg.visibility = 0;
					navRightDlg.visibility = 1;
					manualSearchDlgNo.visibility = 0;
					manualSearchDlgOn.visibility = 1;
					operationDlgNo.visibility = 1;
					operationDlgOn.visibility = 0;
					TunerConnect(manualSearchDlg);
					self.updateScanStatus(manualSearchDlg);
					manualSearchDlg.getChild("frequency_edit").setFocus(true);
					self.win.update();
				}
				
				return true;
			break;
		}
		
		console.log("channel list tableProc end ret =="+ret);
        return ret;
	}
	
	function saveParam(){
		sysCom.config.frequency = netSearchDlg.getChild("frequency_edit").getNumberValue();
        sysCom.config.symbol_rate = netSearchDlg.getChild("sym_edit").getNumberValue();
        sysCom.config.qam = netSearchDlg.getChild("qam_edit").getNumberValue();
		sysCom.saveConfig();
	}
	
	this.right_net_proc = function(e){
		if(is_searching)
			return;
		switch(e.keyCode){
			case UI.KEY.BACKSPACE:
				self.closeTimer();
				navLeftDlg.visibility = 1;
				navRightDlg.visibility = 0;
				netSearchDlgNo.visibility = 1;
				netSearchDlgOn.visibility = 0;
				operationDlgNo.visibility = 0;
				operationDlgOn.visibility = 1;
				operationList.setFocus(true);
				self.win.update();
			break;
			case UI.KEY.FUNRED:
				saveParam();
				self.startScan(netSearchDlg,0);
                self.mode = 0;
			break;
		}
	};

	this.mode = 0;
	
	this.right_manual_proc = function(e){
		if(is_searching)return;
		switch(e.keyCode)
		{
			case UI.KEY.BACKSPACE:
				self.closeTimer();
				navLeftDlg.visibility = 1;
				navRightDlg.visibility = 0;
				manualSearchDlgNo.visibility = 1;
				manualSearchDlgOn.visibility = 0;
				operationDlgNo.visibility = 0;
				operationDlgOn.visibility = 1;
				operationList.setFocus(true);
				navRightDlg.hide();
				navLeftDlg.show();
			break;
			case UI.KEY.FUNRED:
				self.startScan(manualSearchDlg,1);
				self.mode = 1;
			break;
		}
	}
}
ScanChannelPage.prototype = UIModule.baseModule;

