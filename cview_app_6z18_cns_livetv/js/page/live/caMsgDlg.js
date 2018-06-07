function CaMsgDialog(bkImg,blueImg){
    var self = this;

    this.Msg = [

        {id:0x01,caChi:"无法识别卡",caEng:"CA_NOVEL_MESSAGE_BADCARD_TYPE",cnsChi:"智慧卡無效或是非本公司所提供的智慧卡，請與客服中心聯絡 (代碼：E002)",cnsEng:"The Smart Card introduced is not valid for this receiver. Please contact the Service Center. (Code: E002)"},
        {id:0x02,caChi:"智能卡過期， 請更換新卡",caEng:"CA_NOVEL_MESSAGE_EXPICARD_TYPE",cnsChi:"智慧卡配對已經過期，請與客服中心聯絡 (代碼：E007)",cnsEng:"Smartcard is expired. Please contact the Service Center. (Code: E007)"},
        {id:0x03,caChi:"加擾節目， 請插入智能卡",caEng:"CA_NOVEL_MESSAGE_INSERTCARD_TYPE",cnsChi:"智慧卡未插入，請插入智慧卡 (代碼：E009)",cnsEng:"Smartcard is removed! Insert the Smart Card! (Code: E009)"},
        {id:0x04,caChi:"卡中不存在節目運營商",caEng:"CA_NOVEL_MESSAGE_NOOPER_TYPE",cnsChi:"智慧卡無效或是非本公司所提供的智慧卡，請與客服中心聯絡 (代碼：E017)",cnsEng:"The Smart Card introduced is not valid for this receiver. Please contact the Service Center. (Code: E017)"},
        {id:0x05,caChi:"條件禁播",caEng:"CA_NOVEL_MESSAGE_BLACKOUT_TYPE",cnsChi:"智慧卡無法觀看本節目，請與客服中心聯絡 (代碼：E010)",cnsEng:"Smart card not authorized. Please contact the Service Center. (Code: E010)"},
        {id:0x06,caChi:"當前時段被設定為不能觀看",caEng:"CA_NOVEL_MESSAGE_OUTWORKTIME_TYPE",cnsChi:"本頻道目前時段被設置成無法收視，請與客服中心聯絡 (代碼：E018)",cnsEng:"Current service is out of working hours. Please contact the Service Center. (Code: E018)"},
        {id:0x07,caChi:"節目級別高于設定的觀看級別",caEng:"CA_NOVEL_MESSAGE_WATCHLEVEL_TYPE",cnsChi:"目前節目受到分級限制，請與客服中心聯絡 (代碼：E019)",cnsEng:"Current program is limited by watch level. Please contact the Service Center. (Code: E019)"},
        {id:0x08,caChi:"智能卡與本機頂盒不對應",caEng:"CA_NOVEL_MESSAGE_PAIRING_TYPE",cnsChi:"智慧卡未開卡，本卡未與機上盒配對過，請與客服中心聯絡 (代碼：E005)",cnsEng:"Smart card has not been activated. Please contact the Service Center. (Code: E005)"},
        {id:0x09,caChi:"沒有授權",caEng:"CA_NOVEL_MESSAGE_NOENTITLE_TYPE",cnsChi:"未訂購本節目，欲知詳情請按"+"<img src="+blueImg+">"+"藍色鍵 (代碼：E015)",cnsEng:"Access denied, please subscribe this program by pressing "+"<img src="+blueImg+">"+" button. (Code: E015)"},
        {id:0x0a,caChi:"節目解密失敗",caEng:"CA_NOVEL_MESSAGE_DECRYPTFAIL_TYPE",cnsChi:"節目解碼失敗，請與客服中心聯絡 (代碼：E020)",cnsEng:"Descrypt Fail. Please contact the Service Center. (Code: E020)"},
        {id:0x0b,caChi:"卡內金額不足",caEng:"CA_NOVEL_MESSAGE_NOMONEY_TYPE",cnsChi:"",cnsEng:""},
        {id:0x0c,caChi:"子卡需要和母卡對應， 請插入母卡",caEng:"CA_NOVEL_MESSAGE_ERRREGION_TYPE",cnsChi:"",cnsEng:""},
        {id:0x0e,caChi:"智能卡校驗失敗， 請聯系運營商",caEng:"CA_NOVEL_MESSAGE_NEEDFEED_TYPE",cnsChi:"智慧卡通訊錯誤，可能是智慧卡受損，請與客服中心聯絡 (代碼：E000)",cnsEng:"Smart card communication error. Please contact the Service Center. (Code: E000)"},
        {id:0x0f,caChi:"智能卡升級中， 請不要拔卡或者關機",caEng:"CA_NOVEL_MESSAGE_UPDATE_TYPE",cnsChi:"",cnsEng:""},
        {id:0x10,caChi:"請升級智能卡",caEng:"CA_NOVEL_MESSAGE_LOWCARDVER_TYPE",cnsChi:"",cnsEng:""},
        {id:0x11,caChi:"請勿頻繁切換頻道",caEng:"CA_NOVEL_MESSAGE_VIEWLOCK_TYPE",cnsChi:"",cnsEng:""},
        {id:0x12,caChi:"智能卡暫時休眠， 請 5 分鐘後重新開機",caEng:"CA_NOVEL_MESSAGE_MAXRESTART_TYPE",cnsChi:"",cnsEng:""},
        {id:0x13,caChi:"智能卡已凍結， 請聯系運營商",caEng:"CA_NOVEL_MESSAGE_FREEZE_TYPE",cnsChi:"本智慧卡已被暫停使用，請聯絡客服中心 (代碼：E014)",cnsEng:"Smardcard is suspended. Please contact the Service Center. (Code: E014)"},
        {id:0x14,caChi:"智能卡已暫停， 請回傳收視記錄給運營商",caEng:"CA_NOVEL_MESSAGE_CALLBACK_TYPE",cnsChi:"",cnsEng:""},
        {id:0x15,caChi:"高級預覽節目， 該階段不能免費觀看",caEng:"CA_NOVEL_MESSAGE_CURTAIN_TYPE",cnsChi:"未訂購本節目，請按"+"<img src="+blueImg+">"+"藍色鍵訂購 (代碼：E025)",cnsEng:"Access denied, please subscribe this program by pressing "+"<img src="+blueImg+">"+" button. (Code: E025)"},
        {id:0x16,caChi:"升級測試卡測試中",caEng:"CA_NOVEL_MESSAGE_CARDTESTSTART_TYPE",cnsChi:"",cnsEng:""},
        {id:0x17,caChi:"升級測試卡測試失敗， 請檢查機卡通訊模塊",caEng:"CA_NOVEL_MESSAGE_CARDTESTFAILD_TYPE",cnsChi:"",cnsEng:""},
        {id:0x18,caChi:"升級測試卡測試成功",caEng:"CA_NOVEL_MESSAGE_CARDTESTSUCC_TYPE",cnsChi:"",cnsEng:""},
        {id:0x19,caChi:"卡中不存在移植庫定制運營商",caEng:"CA_NOVEL_MESSAGE_NOCALIBOPER_TYPE",cnsChi:"智慧卡無效或是非本公司所提供的智慧卡，請與客服中心聯絡 (代碼：E021)",cnsEng:"The Smart Card introduced is not valid for this receiver. Please contact the Service Center. (Code: E021)"},
        {id:0x20,caChi:"請重啟機頂盒",caEng:"CA_NOVEL_MESSAGE_STBLOCKED_TYPE",cnsChi:"請重新啟動機上盒 (代碼：E022)",cnsEng:"Please restart the Set-top Box. (Code: E022)"},
        {id:0x21,caChi:"機頂盒被凍結",caEng:"CA_NOVEL_MESSAGE_STBFREEZE_TYPE",cnsChi:"機上盒已經被凍結，請與客服中心聯絡 (代碼：E023)",cnsEng:"Set-top Box is locked. Please contact the Service Center. (Code: E023)"},
        {id:0x23,caChi:"DRM 業務被凍結",caEng:"CA_NOVEL_MESSAGE_DRMFREEZE_TYPE",cnsChi:"DRM业务被凍結",cnsEng:"DRM business is freezed. Please contact the operator"},
        {id:0x24,caChi:"網絡錯誤",caEng:"CA_NOVEL_MESSAGE_DRMNETERROR_TYPE",cnsChi:"",cnsEng:""},

        {id:0x40,caChi:"無訊號",caEng:"CA_NOVEL_MESSAGE_BADCARD_TYPE",cnsChi:"無訊號或訊號不良，請確認訊號纜線已接妥或洽客服中心 (代碼：E200)",cnsEng:"Signal is not stable. Please check your connection of RF cable first. (Code: E200)"},
        {id:0x41,caChi:"連續觀看限制",caEng:"CA_NOVEL_MESSAGE__TYPE",cnsChi:"",cnsEng:""},
        {id:0x42,caChi:"請重啟機頂盒",caEng:"Please restart the set-top box",cnsChi:"",cnsEng:""},
        {id:0x43,caChi:"即將恢復出廠設置",caEng:"Resume factory setting",cnsChi:"",cnsEng:""},


        {id:0xff,caChi:"取消當前的顯示",caEng:"CA_NOVEL_MESSAGE_CANCEL_TYPE",cnsChi:"",cnsEng:""}
	];

    function create(){
        var html = "<div id='CaMsgDialog'>";
        html += "<div id='CaMsgDialog_content'>";

        html += "<div id='CaMsgDialog_left'>";
        html += "<img id='CaMsgDialog_icon' src=''>";
        html += "</div>";

        html += "<div id='CaMsgDialog_special' class='right'>";
		html += "<span id='CaMsgDialog_textFront' class='myText'></span>";
		html += "</div>";

        html += "</div>";
        html += "</div>";

        $("body").append(html);

        $("#CaMsgDialog").css({
            'position':'absolute',
            'zIndex':'5',
            'width':'600px',
            'height':'400px',
            'top':'160px',
            'left':'350px',
            'border':'1px solid grey',
            'border-radius':'5px',
            'background-color':'black',
			'display':'none'
        });

		$("#CaMsgDialog_content").css({
            'position':'relative',
			'display':'table',
            'width':'500px',
            'height':'200px',
            'top':'90px',
            'left':'50px',
			'text-align':'center'
        });

		$("#CaMsgDialog_left").css({
			'display': 'table-cell',
			'padding-right':'20px',
			'left':'0px',
            'width':'34%',
            'height':'200px',
			'border-right':'1px solid gray'
        });

        $("#CaMsgDialog_icon").css({
			'position':'relative',
            'marigin':'0 auto',
			'width':'230px',
			'height':'120px',
			'top':'20px'
        });

		$(".right").css({
            'display': 'table-cell',
			'padding-left':'20px',
            'width':'64%',
            'height':'100%',
			'vertical-align':'middle'
        });

		$(".myText").css({
            'color':"yellow",
			'font-size':'25px'
        });

        //if(params && params.icon)
        {
            $('#CaMsgDialog_icon').attr('src',bkImg);
        }

    }

    this.show = function(params)
	{
	    var obj = self.getMsgById(params.msgid);
	    //如果是高级预览则忽略
	    if(params.msgid == 0x15){
	        return;
        }
        if(languageCom.menuLanguageIndex==0){
            if(obj.cnsChi==""){
                $("#CaMsgDialog_textFront").html(obj.caChi);
            }
            else{
                $("#CaMsgDialog_textFront").html(obj.cnsChi);
            }

        }else{
            if(obj.cnsChi==""){
                $("#CaMsgDialog_textFront").html(obj.caEng);
            }
            else{
                $("#CaMsgDialog_textFront").html(obj.cnsEng);
            }

        }

        if($("#CaMsgDialog").css("display") == "none")
		{
			$("#CaMsgDialog").css("display","block");
		}
		
    };

    this.hide = function()
	{
		if($("#CaMsgDialog").css("display") != "none")
		{
			$("#CaMsgDialog").css("display","none");
		}
    };

    this.getMsgById = function(id){
		for(var i =0; i < self.Msg.length;i++)
		{
			if(self.Msg[i].id == id)
			{
				return self.Msg[i];
			}
		}
		return null;
	};

	this.getShowStatus = function(){
		if($("#CaMsgDialog").css("display") == "none")
		{
			return false;
		}
		else
		{
			return true;
		}
	}; 

	create();
}