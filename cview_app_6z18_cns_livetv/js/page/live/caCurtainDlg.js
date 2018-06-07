function CaCurtainDialog(bkImg,blueImg,iconImg){
    var self = this;

	this.params = null;

    function create(){
        var html = "<div id='CaCurtainDialog'>";
		html += "<div id='CaCurtainDialog_2'>";
        html += "<div id='CaCurtainDialog_content'>";

        html += "<div id='CaCurtainDialog_left'>";
        html += "<img id='CaCurtainDialog_icon' src=''>";
        html += "</div>";

        html += "<div id='CaCurtainDialog_special' class='right'>";
		html += "<span id='CaCurtainDialog_textFront' class='myText'></span>";
		html += "</div>";

        html += "</div>";
		html += "</div>";
        html += "</div>";

        $("body").append(html);

		 $("#CaCurtainDialog").css({
            'position':'absolute',
            'zIndex':'2',
            'width':'1000px',
            'height':'600px',
            'top':'60px',
            'left':'140px',
            'background-color':"black",
        });

        $("#CaCurtainDialog_2").css({
            'position':'relative',
            'width':'845px',
            'height':'488px',
            'top':'50px',
            'left':'70px',
            'background-image':"url("+bkImg+")",
        });

		$("#CaCurtainDialog_content").css({
            'position':'relative',
			'display':'table',
            'width':'560px',
            'height':'150px',
            'top':'150px',
            'left':'140px',
			'text-align':'center'
        });

		$("#CaCurtainDialog_left").css({
			'display': 'table-cell',
			'padding-right':'20px',
			'left':'0px',
            'width':'34%',
            'height':'200px',
			'border-right':'1px solid gray'
        });

        $("#CaCurtainDialog_icon").css({
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
            $('#CaCurtainDialog_icon').attr('src',iconImg);
        }
    }

	this.msg = {
			caChi:"高級預覽節目， 該階段不能免費觀看",
			caEng:"CA_NOVEL_MESSAGE_CURTAIN_TYPE",
			cnsChi:"未訂購本節目，請按"+"<img src="+blueImg+">"+"藍色鍵訂購 (代碼：E025)",
			cnsEng:"Access denied, please subscribe this program by pressing "+"<img src="+blueImg+">"+" button. (Code: E025)"
	};

    this.show = function(params){
		self.params = params;

		self.hide();

		if(self.params.curtaincode == 0){
			return;
		}

        if($('#CaCurtainDialog').length <= 0){
            create();
			if(languageCom.menuLanguageIndex==0){
			   $(".myText").html(self.msg.cnsChi);

			}else{
			   $(".myText").html(self.msg.cnsEng);

			}
        }
    };

    this.hide = function(){

        if($('#CaCurtainDialog').length > 0)
        {
            $('#CaCurtainDialog').remove();
        }
    };

    return this;
}