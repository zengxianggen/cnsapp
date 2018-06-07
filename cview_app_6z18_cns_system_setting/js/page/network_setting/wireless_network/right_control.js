// JavaScript Document

var cmRightControl = {
	width:500,
	height:420,
	top:160,
	left:480,
	dl:300,
	dt:60,
	callback:"",
	conArray:[],
	curIndex:0,
	lastIndex:0,
	init:function(parentDlg,callback,index){
		
		ipInformation.initDlg(parentDlg);
		dhcpSetting.initDlg(parentDlg);
		wifiSetting.initDlg(parentDlg);
		wiredDevice.initDlg(parentDlg);
		ipInformation.hide();
		dhcpSetting.hide();
		wifiSetting.hide();
		wiredDevice.hide();
		
		this.callback = callback;
		
		this.conArray[0] = ipInformation;
		this.conArray[1] = dhcpSetting;
		this.conArray[2] = wifiSetting;
		this.conArray[3] = wiredDevice;
		
		this.switchSub(index);
		
	},
	switchSub:function(index){
		
		this.conArray[this.lastIndex].hide();
		this.curIndex = index;
		this.lastIndex = this.curIndex;
		this.conArray[this.curIndex].show();
	},
	
	setSubFocus:function(index){
		return this.conArray[this.curIndex].setFocus();
	},
	subLoseFocus:function(){
		this.conArray[this.curIndex].loseFocus();
		this.callback();
		
	},
	getWirelessCardModule:function(){
		var res = false;
		return res;
	}
}
/*
var cmRightControl = new CMRightControl();
function CMRightControl(){
	var self = this;
	this.width;
	this.height;
	
	this.dt;
	this.dl;
	
	
	this.init = function(parentDlg,backDlg){
		self.width = parentDlg.w*61;
		self.height = parentDlg.h*0.77;
	
		self.dl = parentDlg.w*0.3;
		self.dt = 60;
		
		ipInformation.initDlg(parentDlg);
	}
	
	this.switchSub = function(index){
	}
	
	this.subGetFocus = function(index){
		
	}
	
	this.subLoseFocus = function(){
		backDlg.setFocus(true);
	}
}*/