// JavaScript Document
var showWorkOrder = new ShowWorkOrder();
function ShowWorkOrder(){
	var self = this;
	
	var font1 = uiCom.font.F20;
	var font2 = uiCom.font.F25;
	var font3 = uiCom.font.F35;
	
	var color1 = "grey";
	var color2 = "white";
	
	
	var width_frame = 660;
	var height_frame = 460;
	var top_frame = 100;
	
	var width_table = width_frame*0.9;
	var height_table = height_frame*0.7;
	var left_table = (width_frame - width_table)/2;
	var top_table = (height_frame - height_table)/2+10;
	
	this.info;
	
	var mainDlg,orderInfoDlg,orderTable;
	
	var uiParam=[
		{uiType:UIFrame,id:"bk",w:width_frame,h:height_frame,l:(1280 - width_frame)/2,t:top_frame,styleClass:"system_setting_bk",focusMoveMode:"circle",visibility:0},
		{uiType:UILabel,w:width_frame,h:50,ol:0,ot:2,dt:10,HAlign:"center",font:font2,value:Lp.getValue("system_setting")+">"+Lp.getValue("Authorization_Status")},
		
		{uiType:UITable,id:"order_info_table",w:width_table,h:height_table,ol:left_table,ot:top_table,lineRectWidth:0,lineHWidth:0,lineVWidth:0,lineColor:"#505050", font:font2,cols:2,rows:8,rowsOnePage:8,HAlign:"center",dl:2,dt:-10,color:color2,focusColor:color2,textAligns:["right","left"],focusStop:false,
		skin:{
				normalBar:{type:"none"},
				focusBar:{type:"3imgh",cls:"setting/bluebar"},
			}
		},
		{uiType:UIImg,w:60,h:22,ol:150,ot:height_frame-40,src:"setting/ico_back"},
		{uiType:UILabel,w:80,h:30,ol:150+55,ot:height_frame-40+3,value:Lp.getValue("Previous_Step"),font:font1},
		{uiType:UIImg,w:60,h:22,ol:290,ot:height_frame-40+1,src:"setting/ico_ok"},
		{uiType:UILabel,w:80,h:30,ol:270+62,ot:height_frame-40+3,value:Lp.getValue("Next"),font:font1},
		
		{uiType:UIImg,w:60,h:22,ol:410,ot:height_frame-40+2,src:"setting/ico_red"},
		{uiType:UILabel,w:200,h:30,ol:410+32,ot:height_frame-40+3,value:Lp.getValue("Engineering_Change"),font:font1}
	];
	
	this.create = function(parentDlg){
		mainDlg = UI.createGroup(uiParam,"mainDlg",parentDlg,null,null,proc);
		orderTable = mainDlg.getChild("order_info_table");
		orderTable.setColWidthArr([orderTable.w*0.45,orderTable.w*0.55]);
		orderTable.setColClip(1,true);
	};
	
	this.show = function(info){
		var curInfo;
		if(info){
			curInfo = info;
			this.info = info;
		}
		else curInfo = this.info;
		var i = 0;
		var listItems = new Array();
		
		var titleArr = [
		Lp.getValue("Return_Value")+":",
		Lp.getValue("Job_Information")+":",
		Lp.getValue("Company_Alias")+":",
		Lp.getValue("Work_Order_Full_Code")+":",
		Lp.getValue("Installed_Class")+":",
		Lp.getValue("Cycle_Cost")+":",
		Lp.getValue("Engineering")+":",
		Lp.getValue("Phone_Number")+":"
		];
		
		for(key in info){
			listItems[i] = new Array();
			listItems[i][0] = titleArr[i];
			listItems[i][1] = info[key];
			i++;
		}
		//listItems[0] = new 
		orderTable.addItems(listItems);
		mainDlg.visibility = 1;
		mainDlg.setFocus(true);
		mainDlg.update();
	};
	this.hide = function(){
		mainDlg.visibility = 0;
	};
	
	function requestCB(xmlResult){
		if(!xmlResult){
			reportTipsDialog.show(Lp.getValue("Engineering_Change_Result"),Lp.getValue("Change_Failed"),function(){
				mainDlg.setFocus(true);
			});
			return ;
		}

		var info = WorkReport.getSwapMobilePhoneResultInfo(xmlResult);
		
		if(info.RetCode!=0){
			var text = "[RetCode]:"+info.RetCode+"--"+info.RetMsg;
			reportTipsDialog.show(Lp.getValue("Engineering_Change_Result"),text,function(){
				mainDlg.setFocus(true);
			});
			return;
		}
		
		var text = Lp.getValue("Change_Successful");
		reportTipsDialog.show(Lp.getValue("Engineering_Change_Result"),text,function(){
			orderStorage.CrmWorkOrder = info.CrmWorkOrder;
        	orderStorage.CrmInstallName = info.CrmInstallName;
        	orderStorage.CrmBpName = info.CrmBpName;
        	orderStorage.CrmWorker1 = info.CrmWorker1;
        	orderStorage.MobilePhone = info.MobilePhone;
			self.show(info);
		});
	}
	
	function timeoutCB(){
		reportTipsDialog.show(Lp.getValue("Engineering_Change_Result"),Lp.getValue("Request_Timeout"),function(){
				mainDlg.setFocus(true);
		});
	}
	
	function changePhoneNumber(num){
		var xmlRequest = WorkReport.makeSwapMobilePhoneParam(orderStorage.CrmId, orderStorage.CrmWorkShortSNo, num);
		WorkReturn.sendOrder(xmlRequest, requestCB ,timeoutCB,orderStorage.server);
	}
	
	function backDo(){
		mainDlg.setFocus(true);
	}
	
	function showPhoneInputDlg(){
		var p = 
		{
		 win:self.win,
		 titleCont:Lp.getValue("Engineering_Change"),
		 rightDo:changePhoneNumber,
		 backDo:backDo
 		};
		var pd = new PhoneInputDialog(p);
		pd.show();
	}
	
	function proc(e){
		if(WorkReport.isSerach == true)
			return true;
		var ret = false;
		console.log("");
        switch(e.keyCode)
        {
            case UI.KEY.ENTER:
			self.hide();
			//判斷是否CM走不同分支
				console.log("SystemSettingPage_index = "+SystemSettingPage_index);
				if(SystemSettingPage_index == 7) {
                    submitWorkOrder.show();
                }
                else
				{
                    cmQuery.show();
				}
			ret = true;
			break;
			case UI.KEY.BACKSPACE:
			self.hide();
			queryWorkOrder.show();
			ret = true;
			break;
			case UI.KEY.FUNRED:
				showPhoneInputDlg();
			    ret = true;
			break;
        }
        return ret;
	};
	
	
}