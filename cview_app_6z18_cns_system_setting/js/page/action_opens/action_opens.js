// JavaScript Document
function AcitonOpenPage(params,srcModule) {
    var self = this;
	var font1 = uiCom.font.F20;
	var font2 = uiCom.font.F25;
	var font3 = uiCom.font.F35;
	
	var color1 = "grey";
	var color2 = "white";
	
	var queryDlg;
	
	var openedDlg;
	var notOpenDlg;
	var qrDlg;
	var levelDlg;
    var qrContent1;
    var qrContent2;
    var qrContent3;
    var not_opened;
    var already_opened;


    var CM_TIMEOUT = 15e4;
    var REPLACE_STR = "XX";
    var cmUrl = "http://so" + REPLACE_STR + ".totalbb.net.tw/scm/GetHfcMacByRemoteAddr.php";
    var cm = '';

    var isCmQuerying = 0;
    var zipcode = '';
    var isActive = false
    var qrcode = null;
    var incurmenu = true;
    var status_timer = null;
    console.log("AcitonOpenPage star ....");


    var Odiv=document.createElement("div");             //创建一个div
    Odiv.style.cssText="width:350px;  height:350px;  position:absolute;  left:50%;  top:45%;  margin:-175px 0 0 -175px";
    Odiv.id ="qrcode";
    document.body.appendChild(Odiv);
    // Odiv.setAttribute("id", "qrcode");

   /*var f = document.getElementById("qrcode");
    var childs = f.childNodes;
    for(var i = 0; i < childs.length; i++) {
        f.removeChild(childs[i]);
    }*/

   var qrcodeElement = document.getElementById("qrcode");

        qrcode=  new QRCode(qrcodeElement, {
        text: "http://www.changhong.com",
        width: 350,
        height: 350,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.M
    });



    document.getElementById("qrcode").style.visibility="hidden";

    var curLevel = 1;//0,L,1,M,2,H


    this.dlgParam =  [
        //{uiType:UIFrame,id:"page_bk",l:0,t:0,w:1280,h:720,type:"hole"},
		 {uiType:UIFrame,id:"page_bk",l:0,t:0,w:1280,h:720,styleClass:"yellow_block_bk"},
		 {uiType:UILabel,w:200,h:40,ol:160,ot:60,value:Lp.getValue("Open_Status")+":",font:font2,color:"black",HAlign:"right"},
		 {uiType:UILabel,id:"not_opened",w:200,h:40,ol:160+200+3,ot:60,value:Lp.getValue("Not_Opened"),font:font2,color:"red",HAlign:"left",visibility:1},
		 {uiType:UILabel,id:"already_opened",w:200,h:40,ol:160+200+3,ot:60,value:Lp.getValue("Already_Opened"),font:font2,color:"blue",HAlign:"left",visibility:0},
    ];
	
	var width_frame = 460;
	var height_frame = 190;
	var top_frame = 200;
	
	var width_title = width_frame*0.4;
	var width_con = width_frame*0.5;
	
	var height_item = 50;
	var height_title = 30;
	var height_con = height_title;
	
	var top_title = 90;
	var top_con = top_title-6;
	var left_title = 10;
	var left_con = left_title + width_title + 2;
	
	var queryParam = [
		{uiType:UIFrame,id:"bk",w:width_frame,h:height_frame,l:(1280 - width_frame)/2,t:top_frame,styleClass:"system_setting_bk",focusMoveMode:"circle",visibility:1},
		{uiType:UILabel,w:width_frame,h:50,ol:0,ot:2,dt:10,HAlign:"center",font:font2,value:Lp.getValue("Please_Confirm_Company_Alias")},
		
		{uiType:UILabel,w:width_title,h:height_title,ol:left_title,ot:top_title,value:Lp.getValue("Company_Alias")+":",HAlign:"right",font:font1},
		{uiType:UIEdit,id:"company_alias",w:width_con,h:height_con,ol:left_con,ot:top_con,value:"",HAlign:"center",font:font1,styleClass:"setting_edit_item",onFocus:true},
		
		{uiType:UIImg,w:60,h:22,ol:130,ot:height_frame-40,src:"setting/ico_back"},
		{uiType:UILabel,w:80,h:30,ol:130+56,ot:height_frame-40+3,value:Lp.getValue("Cancel"),font:font1},
		{uiType:UIImg,w:60,h:22,ol:280,ot:height_frame-40+1,src:"setting/ico_ok"},
		{uiType:UILabel,w:80,h:30,ol:270+56,ot:height_frame-40+3,value:Lp.getValue("OK"),font:font1}
	];
	
	top_frame = 100;
	var qrParam = [
		{uiType:UIFrame,id:"bk",w:width_frame,h:height_frame,l:(1280 - width_frame)/2,t:top_frame,styleClass:"None",visibility:0},
		//{uiType:UIImg,w:350,h:350,ol:(width_frame - 350)/2,ot:0},
	//	{uiType:UILabel,w:200,h:30,ol:50,ot:350+10,value:Lp.getValue("Correction_Level")+":",HAlign:"right",font:font1},
		{uiType:UILabel,id:"level",w:100,h:90,l:(1280-100)/2,    t:360+175+10,value:Lp.getValue("Correction_Level")+":"+Lp.getValue("Middle"),HAlign:"left",font:font1},
        {uiType:UILabel,id:"qrcode1",w:1000,h:30,l:(1280-1000)/2,t:360+175+10+60,value:Lp.getValue("QRCode_Content")+":",HAlign:"center",font:font1},
        {uiType:UILabel,id:"qrcode2",w:1000,h:30,l:(1280-1000)/2,t:360+175+10+60+40,value:"",HAlign:"center",font:font1},
        {uiType:UILabel,id:"qrcode3",w:1000,h:30,l:(1280-1000)/2,t:360+175+10+60+40+40,value:"",HAlign:"center",font:font1},
	]
	
	
	this.initData = function(){
		isRestored = 0;
	}
	

	this.initView = function(){


		queryDlg = UI.createGroup(queryParam,"queryDlg",self.win,null,null,query_proc);
		notOpenDlg = self.win.getChild("not_opened");
		openedDlg = self.win.getChild("already_opened");
		qrDlg = UI.createGroup(qrParam,"qrDlg",self.win);
		levelDlg = qrDlg.getChild("level");
        qrContent1 = qrDlg.getChild("qrcode1");
       qrContent2 = qrDlg.getChild("qrcode2");
       qrContent3 = qrDlg.getChild("qrcode3");

        //
        showQueryDlg();
	}

    function revoveqrdiv()
    {
        var qrcodeElement = document.getElementById("qrcode");
        if(qrcodeElement) {
            qrcodeElement.parentNode.removeChild(qrcodeElement);
        }
    }

	function changeStaus( opened)
    {
        if(opened == 1) {
            if(openedDlg)
            openedDlg.visibility=1;
            if(notOpenDlg)
            notOpenDlg.visibility =0;
        }
        else
        {
            if(openedDlg)
            openedDlg.visibility=0;
            if(notOpenDlg)
            notOpenDlg.visibility =1;
        }
        if(notOpenDlg)
           notOpenDlg.update();
    }


    function onFtiModeChanged(event) {

    }
    function onFtiModeRemoved() {

           //activationContent.innerText = lang.getText("INACTIVE"),
           //activationContent.style.color = "red"

	}

    function tuneHomeChanel() {
        /*var home_url = getMainFreqUriFromIS();
        null === home_url && (home_url = HOME_URL),
        null == consumer && (consumer = toi.mediaService.createConsumerInstance()),
            console.log("tune to " + home_url),
            consumer.open(home_url),
            consumer.consume()*/
    }

    function textMulLineHandle1(ctx,font,msg,w,firstRowHeadSpace)
    {
        var msgArray = new Array();
        var curRowText = firstRowHeadSpace ? firstRowHeadSpace : "";
        ctx.font = font;
        for(var i = 0; i < msg.length; i++)
        {
            if(msg[i] == "\n")
            {
                msgArray.push(curRowText);
                curRowText = "";
            }
            else if(ctx.measureText(curRowText + msg[i]).width <= w)
            {
                curRowText  += msg[i];
            }
            else
            {
                msgArray.push(curRowText);
                curRowText = msg[i];
            }
        }
        msgArray.push(curRowText);
        return msgArray;
	}

    function  updatePair()
    {


        console.log("sysCom.config.disbaleFTI= " + sysCom.config.disbaleFTI);
        if(sysCom.config.disbaleFTI == 1)
        {
            changeStaus(1);
        }
        else
        {
            changeStaus(0);
        }


    }

	function showQueryDlg(){
        var zipcode = caCom.caParams.so ? caCom.caParams.so : "00";

        //

		queryDlg.visibility = 1;
		if(status_timer == null)
            status_timer = setInterval(updatePair,5000);//啟動更新定時器

        if(zipcode && zipcode.length == 1)
            zipcode="0"+zipcode;
		queryDlg.getChild("company_alias").setFocus(true);
        queryDlg.getChild("company_alias").value = zipcode;
        updatePair();
		queryDlg.update();
	}
	

    
    
    function cmUrlMapping(soNoStr) {
    var ret = "";
    try {
        if (void 0 === soNoStr || null === soNoStr.length)
           return console.log("CmQueryUrlMapping NoStr: " + soNoStr),            ret;
           ret = cmUrl.replace(REPLACE_STR, soNoStr)
    } catch(e) {
              console.log("CmQueryUrlMapping Exception:" + e);
            ret = "";
    }
    return ret
   }
   
   
   function onQueryCmTimeout() {
       isCmQuerying = 0;
       if(    incurmenu == false)
           return;
       showQR();
   }
   
   function onQueryCmResult(strResp) {
    isCmQuerying = 0;

        console.log("onQueryCmResult Resp: " + strResp);
    var replacement = [{
            regexp: /<br\s*[\/]?>/gi,
            texts: " "
        },
            {
                regexp: /(\r\n|\n|\r)/gm,
                texts: ""
            }];
    resp = strResp;
    for (var i in replacement) resp = resp.replace(replacement[i].regexp, replacement[i].texts);
    resp = resp.trim();
        cm = "(" + resp + ")";
       if(    incurmenu == false)
           return;
       showQR();
        
}
   
   function cmQuery(soNoStr) {

    var url = cmUrlMapping(soNoStr);
   
    if(0 != url.length )
    {
        isCmQuerying =1;
      sms = new SMSClient(url, CM_TIMEOUT);
      sms.queryCmMac(onQueryCmResult, onQueryCmTimeout);
    }
    
    
   }
    function count(obj){
        var objType = typeof obj;
        if(objType == "string"){
            return obj.length;
        }else if(objType == "object"){
            var objLen = 0;
            for(var i in obj){
                objLen++;
            }
            return objLen;
        }
        return false;
    }

    function getStbId(){
        //return "01600016B500000001";//"012201703031785469";
        var deviceInfo = utility.getDeviceInfo(false);
        if(deviceInfo){

            return deviceInfo.sn;

        }
        return "";
    }
	function showQR(){


    var stbId = getStbId();

    var signal = "(3.10.40, 0, 0dB, 0dBuV)";//系統版本+信號誤碼率+信號強度+信號質量
    var hddSerialNo ="CMU-8650";
    
    var SPLITER = ", ";
    var STB_ID_PREFIX = "Facisno: ";
    var CM_PREFIX = "CM Mode: ";
    var SIGNAL_PREFIX = "Data: ";
    var HDD_PREFIX = "HDSerialNo: ";
    var hddSerialNo="";

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
        hddSerialNo = sn;
        var param_tuner = {
            id:0
        }
        var sig_ret = Tuner.tunerGetStatus(param_tuner,false);
        if(sig_ret)
        {
            var ber = sig_ret.errRate;
            var testber = ber/1000000000;
            var testber1= testber.toExponential(2);//转换成科学计数

            var deviceInfo = utility.getDeviceInfo(false);
            var ver = "";
            if(deviceInfo){

                ver="C"+deviceInfo.swVersion;

            }
            signal = "("+ver+","+testber1+","+sig_ret.snr+"dB,"+sig_ret.strengthvalue+"dBuV)";
        }

   if(zipcode.length == 1)
       zipcode="0"+zipcode;

    var qrInput = "SO: " + zipcode + SPLITER + STB_ID_PREFIX + stbId + SPLITER + CM_PREFIX + cm + SPLITER + SIGNAL_PREFIX + signal;
     if(hddSerialNo.length != 0)        
        qrInput += SPLITER + HDD_PREFIX + hddSerialNo;
       
		qrDlg.visibility = 1;

        qrcode.makeCode(qrInput);

        document.getElementById("qrcode").style.visibility='visible';
       var qrtext =  Lp.getValue("QRCode_Content")+":"+qrInput;
        var testArray = textMulLineHandle1(UI.ctx, uiCom.font.F20,qrtext,640,"");
        var len =count(testArray);
        if(len == 1)
        {
            qrContent1.value = testArray[0];
        }
        else if(len == 2)
        {
            qrContent1.value = testArray[0];
            qrContent2.value = testArray[1];
        }
        else if(len >= 3)
        {
            qrContent1.value = testArray[0];
            qrContent2.value = testArray[1];
            qrContent3.value = testArray[1];
        }


		qrDlg.setFocus(true);
		qrDlg.update();
        
        
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
            case UI.KEY.ENTER:
                 if(isCmQuerying == 1)
                     return;
                curLevel +=1;
                if(curLevel > 2)
                    curLevel = 0;

                if(curLevel == 0)
                {
                    qrcode.changeLevel( QRCode.CorrectLevel.L);
                    showQR();
                    levelDlg.value = Lp.getValue("Correction_Level")+":"+Lp.getValue("Low");
                }
                else if(curLevel == 1)
                {
                    qrcode.changeLevel( QRCode.CorrectLevel.M);
                    showQR();
                    levelDlg.value = Lp.getValue("Correction_Level")+":"+Lp.getValue("Middle");
                   // changeStaus(0);
                }
                else if(curLevel == 2)
                {
                    qrcode.changeLevel( QRCode.CorrectLevel.H);
                    showQR();
                    levelDlg.value = Lp.getValue("Correction_Level")+":"+Lp.getValue("High");
                   // changeStaus(1);


                }
               // updatePair();
			break;
			case UI.KEY.BACKSPACE:
                incurmenu = false;
                //document.getElementById("qrcode").style.visibility='hidden';
                revoveqrdiv();
                if(status_timer != null) {
                    clearTimeout(status_timer);
                    status_timer = null;
                }
			    self.go(SystemSettingMenuPage);
			break;
        }
        return ret;
    };
	
	
	function query_proc(e){
		var ret = false;
        switch(e.keyCode)
        {
            case UI.KEY.ENTER:
			    queryDlg.visibility = 0;
                zipcode = queryDlg.getChild("company_alias").value+"";
                cmQuery(zipcode);

			break;
			case UI.KEY.BACKSPACE:
                if(status_timer != null) {
                    clearTimeout(status_timer);
                    status_timer = null;
                }
                incurmenu = false;
               // document.getElementById("qrcode").style.visibility='hidden';
                revoveqrdiv();
			self.go(SystemSettingMenuPage);
			break;
        }
        return ret;
	}
	

	
}
AcitonOpenPage.prototype = UIModule.baseModule;
