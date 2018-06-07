// JavaScript Document
var workTimeSetting = new WorkTimeSetting();
function WorkTimeSetting()
{
	
	var self = this;
	
	var font1 = uiCom.font.F20;
	var font2 = uiCom.font.F22;
	
	var color1 = "grey";
	var color2 = "white";
	
	var mainDlg;
	var navNorDlg;
	var navFocusDlg;
	
	var bkNor;
	var bkFoc;
	
	var notSelectDlg;
	var selectedDlg;
	var curDlg;
	
	var startHourDlg;
	var startMinuteDlg;
	var endHourDlg;
	var endMinuteDlg;
	
	var tipsDlg;
	var timer;
	
	var width_frame = lockRightControl.width;
	var height_frame = lockRightControl.height;
	var left_frame = lockRightControl.left;
	var top_frame = lockRightControl.top;

	var item_dt = 6;
	this.dlgParam = [
		{uiType:UIFrame,id:"bk",w:width_frame,h:height_frame,l:left_frame,t:top_frame,styleClass:"None",visibility:0},
		{uiType:UIFrame,id:"bk_grey",w:width_frame,h:height_frame,l:left_frame,t:top_frame,type:"3imgv",cls:"setting/systemSetRightGrey",},
		{uiType:UIFrame,id:"bk_blue",w:width_frame,h:height_frame,l:left_frame,t:top_frame,type:"3imgv",cls:"setting/systemSetRightBlue",visibility:0},
		
		
	];
	
	var width_title = 200;
	var width_edit = 60;
	var height_label = 30;
	var height_item = 50;
	var top_title = 80;
	var top_con = top_title-6;
	var left_title = 10;
	var left_con = left_title+width_title+3;
	var notStatusParam = [
		{uiType:UIFrame,id:"not_select_bk",w:width_frame,h:height_frame,ol:0,ot:0,styleClass:"None",focusMoveMode:"circle",visibility:1},
		{uiType:UILabel,id:"nav1_text",w:width_title,h:height_label,ol:left_title,ot:top_title,value:Lp.getValue("Work_Time_Setting")+":",font:font1,HAlign:"right"},
		{uiType:UILabel,id:"nav2_text",w:width_title,h:height_label,ol:left_title,ot:top_title+height_item,value:Lp.getValue("Begin_Time")+":",font:font1,HAlign:"right",color:color1},
		{uiType:UILabel,id:"nav3_text",w:width_title,h:height_label,ol:left_title,ot:top_title+height_item*2,value:Lp.getValue("End_Time")+":",font:font1,HAlign:"right",color:color1},
		{uiType:UIButton,id:"select_button",w:31,h:31,ol:left_con,ot:top_con,value:"",dt:10,font:font1,color:"#497897",styleClass:"not_select_bk"},
		{uiType:UILabel,id:"nav4_text",w:260,h:height_label,ol:left_con+31+3,ot:top_title,value:"("+Lp.getValue("Switch_With_Red")+")",font:font1,HAlign:"left",color:color1},
		{uiType:UITimeEdit,id:"start_hour",w:width_edit,h:30,ol:left_con,ot:top_con+height_item,value:"",dt:10,font:font1,color:"#497897",styleClass:"setting_edit_item",focusStop:false},
		{uiType:UILabel,w:5,h:height_label,ol:left_con+width_edit+3,ot:top_title+height_item,value:":",font:font1,HAlign:"center",color:color2},
		{uiType:UITimeEdit,id:"start_minute",w:width_edit,h:30,ol:left_con+width_edit+12,ot:top_con+height_item,value:"",dt:10,font:font1,color:"#497897",styleClass:"setting_edit_item",focusStop:false},
		
		{uiType:UITimeEdit,id:"end_hour",w:width_edit,h:30,ol:left_con,ot:top_con+height_item*2,value:"",dt:10,font:font1,styleClass:"setting_edit_item",focusStop:false},
		{uiType:UILabel,w:5,h:height_label,ol:left_con+width_edit+3,ot:top_title+height_item*2,value:":",font:font1,HAlign:"center",color:color2},
		{uiType:UITimeEdit,id:"end_minute",w:width_edit,h:30,ol:left_con+width_edit+12,ot:top_con+height_item*2,value:"",dt:10,font:font1,color:"#497897",styleClass:"setting_edit_item",focusStop:false},
		
	];
	
	var selectParam = [
		{uiType:UIFrame,id:"select_bk",w:width_frame,h:height_frame,ol:0,ot:0,styleClass:"None",focusMoveMode:"circle",visibility:1},
		{uiType:UILabel,id:"nav1_text",w:width_title,h:height_label,ol:left_title,ot:top_title,value:Lp.getValue("Work_Time_Setting")+":",font:font1,HAlign:"right"},
		{uiType:UILabel,id:"nav2_text",w:width_title,h:height_label,ol:left_title,ot:top_title+height_item,value:Lp.getValue("Begin_Time")+":",font:font1,HAlign:"right"},
		{uiType:UILabel,id:"nav3_text",w:width_title,h:height_label,ol:left_title,ot:top_title+height_item*2,value:Lp.getValue("End_Time")+":",font:font1,HAlign:"right"},
		{uiType:UIButton,id:"select_button",w:31,h:31,ol:left_con,ot:top_con,value:"",dt:10,font:font1,color:"#497897",styleClass:"select_bk"},
		{uiType:UILabel,id:"nav4_text",w:260,h:height_label,ol:left_con+31+3,ot:top_title,value:"("+Lp.getValue("Switch_With_Red")+")",font:font1,HAlign:"left",color:color1},
		{uiType:UITimeEdit,id:"start_hour",w:width_edit,h:30,ol:left_con,ot:top_con+height_item,value:"",dt:10,font:font1,styleClass:"setting_edit_item"},
		{uiType:UILabel,w:5,h:height_label,ol:left_con+width_edit+3,ot:top_title+height_item,value:":",font:font1,HAlign:"center",color:color2},
		{uiType:UITimeEdit,id:"start_minute",w:width_edit,h:30,ol:left_con+width_edit+12,ot:top_con+height_item,value:"",dt:10,font:font1,styleClass:"setting_edit_item"},
		
		{uiType:UITimeEdit,id:"end_hour",w:width_edit,h:30,ol:left_con,ot:top_con+height_item*2,value:"",dt:10,font:font1,styleClass:"setting_edit_item"},
		{uiType:UILabel,w:5,h:height_label,ol:left_con+width_edit+3,ot:top_title+height_item*2,value:":",font:font1,HAlign:"center",color:color2},
		{uiType:UITimeEdit,id:"end_minute",w:width_edit,h:30,ol:left_con+width_edit+12,ot:top_con+height_item*2,value:"",dt:10,font:font1,styleClass:"setting_edit_item"},
	];
	
	var left_start1 = 100;
	this.navNormalParam = [
		{uiType:UIFrame,id:"dialog_bk",w:width_frame,h:60,ol:0,ot:height_frame+18,styleClass:"None",visibility:1},
		{uiType:UIImg,id:"nav1",w:34,h:26,ol:left_start1,ot:0,src:"setting/ico_rightArrow"},
		{uiType:UILabel,id:"nav1_text",w:100,h:40,ol:(left_start1=left_start1+34 + 10),ot:-3,value:Lp.getValue("Move_Focus_Right"),font:font1},
		{uiType:UIImg,id:"nav2",w:47,h:26,ol:(left_start1=left_start1+100+10),ot:0,src:"setting/ico_back"},
		{uiType:UILabel,id:"nav2_text",w:200,h:40,ol:(left_start1=left_start1+47+10),ot:-3,value:Lp.getValue("Up_Page"),font:font1}
	];
	
	left_start1 = 100;
	this.navFocusParam = [
		{uiType:UIFrame,id:"dialog_bk",w:width_frame,h:60,ol:0,ot:height_frame+18,styleClass:"None",visibility:0},
		{uiType:UIImg,id:"nav1",w:47,h:20,ol:left_start1,ot:0,src:"setting/ico_back"},
		{uiType:UILabel,id:"nav1_text",w:100,h:40,ol:(left_start1=left_start1+47 + 10),ot:-3,value:Lp.getValue("Move_Focus_Left"),font:font1},
		{uiType:UIImg,id:"nav2",w:34,h:20,ol:(left_start1=left_start1+100+10),ot:0,src:"setting/ico_ok"},
		{uiType:UILabel,id:"nav2_text",w:200,h:40,ol:(left_start1=left_start1+34+10),ot:-3,value:Lp.getValue("Save"),font:font1}
	];
	
	var width_tips = width_frame/2;
	var height_tips = 170;
	var left_tips = (width_frame - width_tips)/2;
	var top_tips = (height_frame-height_tips)/2;
	left_start1 = 20;
	var tipsParam = [
		{uiType:UIFrame,id:"dialog_bk",w:width_tips,h:height_tips,ol:left_tips,ot:top_tips,styleClass:"system_setting_bk",visibility:0},
		{uiType:UILabel,w:width_tips,h:40,ol:0,ot:6,value:Lp.getValue("Tips"),font:font1,HAlign:"center"},
		{uiType:UILabel,id:"tips_value",w:width_tips,h:40,ol:0,ot:70,value:Lp.getValue("Save_Sucessful"),font:font1,HAlign:"center"},
	];
	
	this.initData = function(){
		
	};
	
	
	this.initDlg = function(parent){
		self.initData();
		mainDlg = UI.createGroup(self.dlgParam,"mainDlg",parent,null,null,self.proc);
		
		
		notSelectDlg = UI.createGroup(notStatusParam,"notSelectDlg",mainDlg,null,null,self.not_proc);
		selectedDlg = UI.createGroup(selectParam,"selectedDlg",mainDlg,null,null,self.select_proc);
		
		tipsDlg = UI.createGroup(tipsParam,"tipsDlg",mainDlg);
		
		navNorDlg = UI.createGroup(self.navNormalParam,"navNorDlg",mainDlg);
		navFocusDlg = UI.createGroup(self.navFocusParam,"navFocusDlg",mainDlg);

        //update language
        notSelectDlg.getChild("nav1_text").value=Lp.getValue("Work_Time_Setting");
        notSelectDlg.getChild("nav2_text").value=Lp.getValue("Begin_Time");
        notSelectDlg.getChild("nav3_text").value=Lp.getValue("End_Time");
        notSelectDlg.getChild("nav4_text").value=Lp.getValue("Switch_With_Red");

        selectedDlg.getChild("nav1_text").value=Lp.getValue("Work_Time_Setting");
        selectedDlg.getChild("nav2_text").value=Lp.getValue("Begin_Time");
        selectedDlg.getChild("nav3_text").value=Lp.getValue("End_Time");
        selectedDlg.getChild("nav4_text").value=Lp.getValue("Switch_With_Red");

        navNorDlg.getChild("nav1_text").value=Lp.getValue("Move_Focus_Right");
        navNorDlg.getChild("nav2_text").value=Lp.getValue("Up_Page");

        navFocusDlg.getChild("nav1_text").value=Lp.getValue("Move_Focus_Left");
        navFocusDlg.getChild("nav2_text").value=Lp.getValue("Save");


        bkNor = mainDlg.getChild("bk_grey");
		bkFoc = mainDlg.getChild("bk_blue");
		
		startHourDlg = selectedDlg.getChild("start_hour");
		startMinuteDlg = selectedDlg.getChild("start_minute");
		
		endHourDlg =selectedDlg.getChild("end_hour");
		endMinuteDlg = selectedDlg.getChild("end_minute");

		if(sysCom.config.WorkTimeSet){
            startHourDlg.value =sysCom.config.WorkTimeStart.hour >= 10 ? ""+sysCom.config.WorkTimeStart.hour : ""+sysCom.config.WorkTimeStart.hour;
            startMinuteDlg.value =sysCom.config.WorkTimeStart.minute >= 10 ? ""+sysCom.config.WorkTimeStart.minute : ""+sysCom.config.WorkTimeStart.minute;
            endHourDlg.value =sysCom.config.WorkTimeEnd.hour >= 10 ? ""+sysCom.config.WorkTimeEnd.hour : ""+sysCom.config.WorkTimeEnd.hour;
            endMinuteDlg.value =sysCom.config.WorkTimeEnd.minute >= 10 ? ""+sysCom.config.WorkTimeEnd.minute : ""+sysCom.config.WorkTimeEnd.minute;
            if(startHourDlg.value == "0"){
                startHourDlg.value="00";
            }
            if(startMinuteDlg.value == "0"){
                startMinuteDlg.value="00";
            }
            if(endHourDlg.value == "0"){
                endHourDlg.value="00";
            }
            if(endMinuteDlg.value == "0"){
                endMinuteDlg.value="00";
            }
		}
		
		startHourDlg.defProc = hour_proc;
		startMinuteDlg.defProc = minute_proc;
		endHourDlg.defProc = hour_proc;
		endMinuteDlg.defProc = minute_proc;
	};
	
	
	
	
	function closeTime(){
		if(timer)clearTimeout(timer);
		timer = null;
	}
	
	this.hide = function(){
		mainDlg.visibility = 0;
		closeTime();
	};
	
	this.show = function(){
		mainDlg.visibility = 1;
		if(getOpenStatus()){
			notSelectDlg.visibility = 0;
			selectedDlg.visibility = 1;
			curDlg = selectedDlg; 
		}
		else{
			notSelectDlg.visibility = 1;
			selectedDlg.visibility = 0;
			curDlg = notSelectDlg;
		}
		
		
	};

	this.setFocus = function(){
		curDlg.getChild("select_button").setFocus(true);
		bkNor.visibility = 0;
		bkFoc.visibility = 1;
		navNorDlg.visibility = 0;
		navFocusDlg.visibility = 1;
		return true;
	};
	
	this.loseFocus = function(){
		bkNor.visibility = 1;
		bkFoc.visibility = 0;
		navFocusDlg.visibility = 0;
		navNorDlg.visibility = 1;
	};
	
	function getOpenStatus(){
		return sysCom.config.WorkTimeSet;
	}
		
	this.proc = function(e){
		var keyCode = e.keyCode;

		var ret =false;
		switch(keyCode){
			case UI.KEY.BACKSPACE:
			ret =true;
			lockRightControl.subLoseFocus();
			break;
		}	
		
		return ret;
	};
	
	this.not_proc = function(e){
		var keyCode = e.keyCode;

		var ret =false;
		switch(keyCode){
			case UI.KEY.FUNRED:
			ret =true;
			notSelectDlg.visibility = 0;
			selectedDlg.visibility = 1;
			curDlg = selectedDlg;
			curDlg.getChild("select_button").setFocus(true);
			curDlg.update(); 
			break;
			case UI.KEY.ENTER:
			keyEnter();
			break;
		}	
		
		return ret;
	};
	
	function saveTime(){
		var start_hour = startHourDlg.value;
		var start_minute = startMinuteDlg.value;
		var end_hour = endHourDlg.value;
		var end_minute = endMinuteDlg.value;
		
		if(start_hour == ""||start_minute ==""||end_hour==""||end_minute==""){
			return false;
		}
		
		sysCom.config.WorkTimeStart.hour = parseInt(start_hour,10);
		sysCom.config.WorkTimeStart.minute = parseInt(start_minute,10);
		
		sysCom.config.WorkTimeEnd.hour = parseInt(end_hour,10);
		sysCom.config.WorkTimeEnd.minute = parseInt(end_minute,10);
		
		
		
		return true;
	}
	
	function keyEnter(){
		if(curDlg.id=="notSelectDlg")
		{
			sysCom.config.WorkTimeSet = 0;
			sysCom.saveConfig();
			showTips(1);
			return;
		}
		
		if(curDlg.id=="selectedDlg"){
			sysCom.config.WorkTimeSet = 1;
			if(saveTime())
			{
				sysCom.saveConfig();
				showTips(1);
			}
			else{
				showTips(0);
			}
			return;
		}
		
	}
	
	function showTips(flag){
		if(flag)
		{tipsDlg.getChild("tips_value").value = Lp.getValue("Save_Sucessful");
		}
		else{
			tipsDlg.getChild("tips_value").value = Lp.getValue("Save_Error");
		}
		tipsDlg.show();
		timer = setTimeout(function(){
			tipsDlg.hide();
		},sysCom.config.displayTime*1000);
	}
	
	
	this.select_proc = function(e){
		var keyCode = e.keyCode;
		console.log("select_proc keyCode == "+keyCode);
		var ret = false;
		switch(keyCode){
			case UI.KEY.ENTER:
			keyEnter();
			ret = true;
			break;
			case UI.KEY.FUNRED:
			notSelectDlg.visibility = 1;
			selectedDlg.visibility = 0;
			curDlg = notSelectDlg;
			curDlg.getChild("select_button").setFocus(true);
			curDlg.update();
			ret = true;
			break;
		}	
		return ret;
	};
	
	function hour_proc(e){
		var ret = false;
        var kechars = ['0','1','2','3','4','5','6','7','8','9'];
        if(e.keyCode >= UI.KEY.CHAR0 && e.keyCode <= UI.KEY.CHAR9){
            if(this.value.length < 2){
                this.value += kechars[e.keyCode - UI.KEY.CHAR0];
                ret = true;
            }
			else{
				this.value = ""+kechars[e.keyCode - UI.KEY.CHAR0];
				 ret = true;
			}
        }
		if(this.value!=""){
			if(e.keyCode == UI.KEY.RIGHT||e.keyCode == UI.KEY.LEFT||e.keyCode == UI.KEY.UP||e.keyCode == UI.KEY.DOWN){
				var hour = parseInt(this.value,10);
				if(hour>24){
					this.value = "";
				}
			}	
		}

        if(ret == true){
            this.update();
            this.onkey({keyCode:UI.KEY.WM_VALUE_CHANGE,id:this.id,hwin:this});
        }
        return ret;
	}
	
	function minute_proc(e){
		var ret = false;
        var kechars = ['0','1','2','3','4','5','6','7','8','9'];
        if(e.keyCode >= UI.KEY.CHAR0 && e.keyCode <= UI.KEY.CHAR9){
            if(this.value.length < 2){
                this.value += kechars[e.keyCode - UI.KEY.CHAR0];
                ret = true;
            }
			else{
				this.value = ""+kechars[e.keyCode - UI.KEY.CHAR0];
				 ret = true;
			}
        }
		if(this.value!=""){
			if(e.keyCode == UI.KEY.RIGHT||e.keyCode == UI.KEY.LEFT||e.keyCode == UI.KEY.UP||e.keyCode == UI.KEY.DOWN){
				var hour = parseInt(this.value,10);
				if(hour>59){
					this.value = "";
				}
			}	
		}

        if(ret == true){
            this.update();
            this.onkey({keyCode:UI.KEY.WM_VALUE_CHANGE,id:this.id,hwin:this});
        }
        return ret;
	}
	return this;
}
