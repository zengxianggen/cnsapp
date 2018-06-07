// JavaScript Document

var lockRightControl = {
	width:550,
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
		
		parentChildLock.initDlg(parentDlg);
		channelLock.initDlg(parentDlg);
		workTimeSetting.initDlg(parentDlg);
		changePassword.initDlg(parentDlg);
		
		this.callback = callback;
		
		this.conArray[0] = parentChildLock;
		this.conArray[1] = channelLock;
		this.conArray[2] = workTimeSetting;
		this.conArray[3] = changePassword;

		this.switchSub(index);
	},

	switchSub:function(index)
	{
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
		
	}
};
