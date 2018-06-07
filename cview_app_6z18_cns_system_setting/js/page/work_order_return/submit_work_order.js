// JavaScript Document
var submitWorkOrder = new SubmitWorkOrder();
function SubmitWorkOrder(){
	
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
	
	var mainDlg;
	var submitInfoTable;
	
	var uiParam=[
		{uiType:UIFrame,id:"bk",w:width_frame,h:height_frame,l:(1280 - width_frame)/2,t:top_frame,styleClass:"system_setting_bk",focusMoveMode:"circle",visibility:0},
		{uiType:UILabel,w:width_frame,h:50,ol:0,ot:2,dt:10,HAlign:"center",font:font2,value:Lp.getValue("system_setting")+">"+Lp.getValue("Authorization_Status")},
		
		{uiType:UITable,id:"submit_info_table",w:width_table,h:height_table,ol:left_table,ot:top_table,lineRectWidth:0,lineHWidth:0,lineVWidth:0,lineColor:"#505050", font:font2,cols:2,rows:8,rowsOnePage:8,HAlign:"center",dl:2,dt:-10,color:color2,focusColor:color2,textAligns:["right","left"],focusStop:false,
		skin:{
				normalBar:{type:"none"},
				focusBar:{type:"3imgh",cls:"setting/bluebar"},
			}
		},
		
		{uiType:UIImg,w:60,h:22,ol:290,ot:height_frame-40+1,src:"setting/ico_ok"},
		{uiType:UILabel,w:80,h:30,ol:270+62,ot:height_frame-40+3,value:Lp.getValue("Submit"),font:font1},
	];
	
	this.create = function(parentDlg){
		mainDlg = UI.createGroup(uiParam,"mainDlg",parentDlg,null,null,proc);
		submitInfoTable = mainDlg.getChild("submit_info_table");
		submitInfoTable.setColWidthArr([submitInfoTable.w*0.45,submitInfoTable.w*0.55]);
	};
	
	this.show = function(){
		var i = 0;
		var listItems = new Array();
		var info = getSubmitInfo();
		
		var titleArr = [
		Lp.getValue("Company_Alias")+":",
		Lp.getValue("STB_Serial_Number")+":",
		Lp.getValue("Work_Order_Full_Code")+":",
		Lp.getValue("Engineering")+":",
		Lp.getValue("Phone_Number")+":",
		Lp.getValue("Build_Hard_Disk")+":",
		Lp.getValue("HDD_Serial_Number")+":",

		]
		
		for(key in info){
			listItems[i] = new Array();
			listItems[i][0] = titleArr[i];
			listItems[i][1] = info[key];
			i++;
		}
		//listItems[0] = new 
		submitInfoTable.addItems(listItems);
		mainDlg.visibility = 1;
		mainDlg.setFocus(true);
		mainDlg.update();
	};
	this.hide = function(){
		
	};
	
	function getStbId(){
		//return "01600016B500000001";//"012201703031785469";
        var deviceInfo = utility.getDeviceInfo(false);
        if(deviceInfo){

          return deviceInfo.sn;

        }
		return "";
	}
	
	function getSubmitInfo(){
		var info = {
			CrmId:orderStorage.CrmId,
			DeviceSNo3:getStbId(),
			CrmWorkOrder:orderStorage.CrmWorkOrder,
			CrmWorker1:orderStorage.CrmWorker1,
			MobilePhone:orderStorage.MobilePhone,
			IncludeHD:"0",
			HDSerialNo:""
		};
		if(orderStorage.CrmInstallName && orderStorage.CrmInstallName.indexOf("PVR") >=0 )
		{
            info.IncludeHD = "1";

            var sn="";

            usblists = FS.fsGetDiskInfo(false);
            console.log("usblists count="+usblists.length );
            if(!usblists || usblists.length <= 0)
            {

            }
            else {

                    for (var k = 0; k < usblists.length; k++) {
                        if (usblists[k].sn != "00000000") {
                            sn=usblists[k].sn+"";
                            break;
                        }
                    }

                }

            info.HDSerialNo = sn;//需要讀取HD serial no
		}
		return info;
	}
	
	function requestCB(xmlResult){
        console.log("####1");
		if(!xmlResult){
            console.log("======>error 1");

			loadingDialog.hide();
			reportTipsDialog.show(Lp.getValue("Authorization_Result"),Lp.getValue("Query_Failed"),function(){
				mainDlg.setFocus(true);
			});

			return ;
		}
        console.log("####2");
		var info = WorkReport.getAuthorSTBInfo(xmlResult);		
		if(info.RetCode!=0){
            console.log("======>error 2");
			var text = "[RetCode]:"+info.RetCode+"--"+info.RetMsg;
			loadingDialog.hide();
            console.log("####2:"+text);


			reportTipsDialog.show(Lp.getValue("Authorization_Result"),text,function(){
				mainDlg.setFocus(true);
			});

			return;
		}
        console.log("####3:"+info.RetMsg);
		loadingDialog.hide();
		reportTipsDialog.show(Lp.getValue("Authorization_Result"),Lp.getValue("Authorization_Successful"),function(){



			self.hide();
            mainDlg.setFocus(true);
		});
        console.log("####4");
	}
	
	function timeoutCB(){
		reportTipsDialog.show(Lp.getValue("Authorization_Result"),Lp.getValue("Request_Timeout"),function(){
				mainDlg.setFocus(true);
		});
	}
	
	
	function keyEnter(){
		var info = getSubmitInfo();
		var xmlRequest = WorkReport.makeAuthorSTBParams(info.CrmId, info.DeviceSNo3, info.CrmWorkOrder, info.CrmWorker1, info.MobilePhone, info.IncludeHD, info.HDSerialNo);
		loadingDialog.show(Lp.getValue("STB_IS_Authorizing"));
		WorkReturn.sendOrder(xmlRequest, requestCB ,timeoutCB,orderStorage.server);
	}
	
	function proc(e){
		if(WorkReport.isSerach == true)
			return true;
		var ret = false;
        switch(e.keyCode)
        {
            case UI.KEY.ENTER:
				keyEnter();
				ret = true;
			break;
        }
        return ret;
	};
	
	
}