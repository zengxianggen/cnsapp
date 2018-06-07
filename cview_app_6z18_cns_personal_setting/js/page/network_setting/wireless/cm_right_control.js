// JavaScript Document

var cmRightControl = {
	width:660,
	height:420,
	top:160,
	left:430,
	dl:300,
	dt:60,
	callback:"",
	conArray:[],
	curIndex:0,
	lastIndex:0,
	init:function(parentDlg,callback,index){

		//wifiSetting.initDlg(parentDlg);
		cmInformation.initDlg(parentDlg);
		
		this.callback = callback;
		
		//this.conArray[1] = wifiSetting;
		this.conArray[0] = cmInformation;

		
		this.switchSub(index);
		
	},
	switchSub:function(index){

		console.log("this.lastIndex="+this.lastIndex);
        console.log("this.conArray[this.lastIndex]="+this.conArray[this.lastIndex]);
		//this.conArray[this.lastIndex].hide();
        console.log("this.curIndex="+this.curIndex);
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
