function CaSuperOsdDialog(){
    var self = this;

	this.timer = null;

	this.isForce = false;

	var params = null;

	this.fontSize = {
        'default' : '30px',
        'small' :   '20px',
        'big' : '40px'
    };

    function create_0(){
		
        var html = "";
        html += "<div id='CaSuperOsdDialog'>";
		html += "<div class='content'><span class='content_inner'></span>"
		html += "<div class='cardNo'></div>"
		html += "</div>";
        html += "</div>";

        $("body").append(html);  

		var rect = self.getWidthHeight((params.backgroundarea>=20)?params.backgroundarea:20,1280,720);
        $("#CaSuperOsdDialog").css({
			
            'position':'absolute',
            'zIndex':'2',
            'left':rect.l+'px',
			'top':rect.t+'px',
			'width':rect.w+'px',	
			'height':rect.h+'px',
			'background':self.getColor(params.backgroundcolor),
			'border-radius':'15px'
        });
		if(params.fontsize == 1)
		{
			$('#CaSuperOsdDialog').css('font-size',self.fontSize.big);
		}
		else if(params.fontsize == 2)
		{
			$('#CaSuperOsdDialog').css('font-size',self.fontSize.small);
		}
		else
		{
			$('#CaSuperOsdDialog').css('font-size',self.fontSize.default);
		}

		var rect1 = self.getWidthHeight(50,rect.w,rect.h);
		$("#CaSuperOsdDialog").children(".content").css({
            //'display':'table',
            'position':'relative',
            'top':rect1.t+"px",
            'left':rect1.l+"px",
            'width':rect1.w+'px',
            'height':rect1.h+'px',
            'max-height':rect1.h+'px',
            'overflow':'hidden',
            'border':'1px grey solid'
        });

		$("#CaSuperOsdDialog").children(".content").children(".content_inner").css({
			'display':'table-cell',
			'vertical-align': 'middle',
            'word-break':'break-all',
			'color':self.getColor(params.frontcolor),
        });

		$("#CaSuperOsdDialog").children(".content").children(".cardNo").css({
			'display':'table-cell',
			'vertical-align': 'middle',
			'position':'absolute',
			'bottom':'0px',	
			'left':'0px',	
			'color':self.getColor(params.frontcolor),
			'border':'1px grey solid'
        });
		$("#CaSuperOsdDialog").children(".content").children(".content_inner").text(""+params.szcontent);
		$("#CaSuperOsdDialog").children(".content").children(".cardNo").text(""+params.szcardsn);
    }	

	function create_1(){
		var html = "";
        html += "<div id='CaSuperOsdDialog'>";
		html += "<div class='content'></div>"
        html += "</div>";

		$("body").append(html);  
		var top = "30px";
		if(params.position == 1){
			top = "30px";
		}
		else{
			top = "680px";
		}
		$("#CaSuperOsdDialog").css({
			
            'position':'absolute',
            'zIndex':'2',
            'top':top,
            'left':'0px',
			'width':'1280px',
			'background':self.getColor(params.backgroundcolor),
			'border-radius':'15px'
        });

		$("#CaSuperOsdDialog div").css({
			'display':'inline-block', 
			'position':'relative',
			'color':self.getColor(params.frontcolor),
        });

		$("#CaSuperOsdDialog div").text(params.szcontent);

		Move();
	}
	
	function Move()
	{
		$("#CaSuperOsdDialog div").css("left","1280px");

		var left = (1280-$("#CaSuperOsdDialog div").width());
		if(left > 10){
			left = "10px";
		}
		else{
			left = left+"px";
		}

		$("#CaSuperOsdDialog div").animate({left:left},1000*30,Move);
	}

    this.show = function(p){

    	params = p;

    	if(!params){
    		return;
		}

        self.hide();

		if(!params.action){
			if(self.isForce){
                self.isForce = false;
                caCom.lockStatus = false;
			}
			return;
		}
		if(params.position == 0){
			create_0();
		}
		else{

			create_1();
		}

		if(params.showtype){
            self.isForce = true;
			caCom.lockStatus = true;
		}
		
    };	

    this.hide = function(){

        if($('#CaSuperOsdDialog').length > 0)
        {
            $("#CaSuperOsdDialog div").stop();
            $('#CaSuperOsdDialog').remove();
        }
    };

	this.getColor = function(color){
		var str = [0,0,0,0,0,0];
		var col = ""+(color & 0x00FFFFFF).toString(16);
		var i = 6-col.length;
		var j = 0;
		for(; i < 6; i++,j++){
			str[i] = col[j];
		}
		str = "#" + str.join("");
		return str;
	};

	this.getWidthHeight = function(area,width,height){
		var w = 0;
		var h = 0;
		h = Math.sqrt(height * area * height / 100 );
		w = (width * height * area /100 ) / h;
		h = parseInt(h,10);
		w = parseInt(w,10);
		var t = parseInt((height - h)/2,10);
		var l = parseInt((width - w)/2,10);
		var rect = {
			t:t,
			l:l,
			w:w,
			h:h
		};
		console.log("rect:"+JSON.stringify(rect));
		return rect;
	};
    return this;
}