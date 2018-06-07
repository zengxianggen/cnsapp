// JavaScript Document

var caRightControl = {
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
		
		cardPasswordChange.initDlg(parentDlg);
		stbCardPair.initDlg(parentDlg);
		operatorInformation.initDlg(parentDlg);
		cardInformation.initDlg(parentDlg);
		cardUpdateInformation.initDlg(parentDlg);
		this.callback = callback;
		
		this.conArray[0] = cardPasswordChange;
		this.conArray[1] = stbCardPair;
		this.conArray[2] = operatorInformation;
		this.conArray[3] = cardInformation;
		this.conArray[4] = cardUpdateInformation;

		
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
}
