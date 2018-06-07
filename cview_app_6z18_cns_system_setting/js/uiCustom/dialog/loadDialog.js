// JavaScript Document

var loadingDialog = new LoadingDialog();
function LoadingDialog(){
	
	var fontTitle = uiCom.font.F22;
	
	var width_dialog = 360;
	var height_dialog = 200;
	
	var left_dialog = (UI.width-width_dialog)/2;
	var top_dialog = 260;
	
	var top_title = 10;
	
	var width_img = 86;
	var height_img = 86;
	
	var left_img = left_dialog+(width_dialog-width_img)/2;
	var top_img = top_dialog+66;
	
	var mainDlg;
	var imgDlg;
	
	var uiParam = [
		{uiType:UIFrame,w:width_dialog,h:height_dialog,l:left_dialog,t:top_dialog,type:"9img",cls:"dialog/frameBlueBg",visibility:0},
		{uiType:UILabel,id:"title",w:width_dialog,h:50,ol:0,ot:6,font:fontTitle,value:Lp.getValue("STB_Work_Order_Inquiry"),HAlign:"center"}
	]
	
	this.create = function(parentDlg){
		mainDlg = UI.createGroup(uiParam,"mainDlg",parentDlg,null,null,proc);
		createImg();
	};
	
	function createImg(){
		var body = document.getElementsByTagName('body')[0];
		imgDlg = document.getElementById("loading_img");
		if(!imgDlg){
			imgDlg = document.createElement("img");
			imgDlg.setAttribute("id", "loading_img");
			imgDlg.style.position = "absolute";
			imgDlg.style.left = left_img;
			imgDlg.style.top = top_img;
			imgDlg.style.width = width_img;
			imgDlg.style.height = height_img;
			body.appendChild(imgDlg);
		}
		
		imgDlg.src = "./black/setting/loading.gif";
		imgDlg.style.visibility = "hidden";
		
		
	}
	
	this.show = function(title){
		if(title){
			mainDlg.getChild("title").value = title;
		}
		mainDlg.visibility = 1;
		imgDlg.style.visibility = "visible";
		mainDlg.update();
	};
	this.hide = function(){
		mainDlg.visibility = 0;
		imgDlg.style.visibility = "hidden";
	};
	
	function proc(e){
		
	};
	
}