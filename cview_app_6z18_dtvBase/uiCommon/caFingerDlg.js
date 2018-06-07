function CaFingerDialog(){
    var self = this;
    this.status = false;

	this.timer = null;

    function create(){
        var html = "";
        html += "<div id='CaFingerDialog'>";
        html += "</div>";

        $("body").append(html);

        $("#CaFingerDialog").css({
            'position':'absolute',
            'zIndex':'3',
            'top':'30px',
            'left':'360px',
			'color':'black',
            'background':"white"
        });
    }	

	function RandomNumBoth(Min,Max){
      var Range = Max - Min;
      var Rand = Math.random();
      var num = Min + Math.round(Rand * Range); 
      return num;
	}

    this.show = function(finger){
        if(!finger){

        }
        self.hide();
        if(!self.status)
        {
            create();

			self.timer = setInterval(function(){
				var t = RandomNumBoth(20,600);
				var l = RandomNumBoth(20,1100);
				$("#CaFingerDialog").css('top',""+t+"px");
				$("#CaFingerDialog").css('left',""+l+"px");
			},1000*10);

            self.status = true;
        }
		$("#CaFingerDialog").text(""+finger);
    };

    this.hide = function(){

        if(self.status)
        {
            self.status = false;
			if(self.timer)
			{
				clearInterval(self.timer);
				self.timer = null;
			}
            $('#CaFingerDialog').remove();
        }
    };

    return this;
}