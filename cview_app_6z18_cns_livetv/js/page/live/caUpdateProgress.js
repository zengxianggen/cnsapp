function CaUpdateProgress()
{
	var self = this;
	
	self.params = null;

	var diaId = "CaUpdateProgress";

	function create(){
		var html = "";
		html += "<div id='"+diaId+"'>";
		
		html += "<div id='"+diaId+"_title"+"'>update</div>";
		html += "<div id='"+diaId+"_progress_bk"+"'>";
		html += "<div id='"+diaId+"_progress_po"+"'></div>";
		html +="</div>";
		html +="</div>";
			
		 $("body").append(html);
		var rect = {w:800,h:100};
		 rect = self.getCenterPosition(rect,1280,720);
		 $("#"+diaId).css({
            'position':'absolute',
            'zIndex':'2',
            'left':rect.l+'px',
			'top':rect.t-260+'px',
			'width':rect.w+'px',	
			'height':rect.h+'px',
			'background-color':'rgba(0,0,0,0.8)',	
			'border':'4px solid #0080FF',
			'border-radius':'10px',
			
        });

		 $("#"+diaId+"_title").css({
				'color':"white",
				"font-size":"24px",
				'text-align':"center"
		 });

		 $("#"+diaId+"_progress_bk").css({
				'width':rect.w*0.8+'px',	
				'height':rect.h*0.5+'px',
				'border':'1px solid #0080FF',
				'margin':"0 auto"
		 });

		 $("#"+diaId+"_progress_po").css({
				'width':rect.w*0.0+'px',	
				'height':rect.h*0.5+'px',
				'background-color':'#0080FF',	
		 });
	}

	this.show = function(params){
		self.hide();
		self.params = params;
		create();
		self.update();
	};

	this.update = function(){
		if(self.params.progress > 100){
			self.hide();
			return;
		}
		if(self.params.mark == 0){
			$("#"+diaId+"_title").text("升級數據接收");
		}

		if(self.params.mark == 1){
			$("#"+diaId+"_title").text("向CA卡寫入升級數據");
		}

		
		$("#"+diaId+"_progress_po").css("width",$("#"+diaId+"_progress_bk").outerWidth()*self.params.progress/100+"px");
	};

	this.hide = function(){
		if($("#"+diaId).length > 0)
        {
            $("#"+diaId).remove();
        }
	};

	this.getCenterPosition = function(rect,w,h){
		rect.t = (h-rect.h)/2;
		rect.l = (w-rect.w)/2;
		return rect;
	};
}