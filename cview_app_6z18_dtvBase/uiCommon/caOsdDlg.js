function CaOsdDialog(bkImg){
    var self = this;

    this.timer = null;

    self.params = null;

    function create(){
        var html = "";
        html += "<div id='CaOsdDialog'>";
        html += "<div id='CaOsdText'></div>"
        html += "</div>";

        $("body").append(html);

        $("#CaOsdDialog").css({
            'position':'absolute',
            'zIndex':'2',
            'top':'30px',
            'left':'0px',
            'color':'black',
            'width':'1280px'
        });

        $("#CaOsdText").css({
            'position':'relative'
        });
    }
    this.show = function(params){
        self.params = params;

        if(!self.params){
            return;
        }

        self.hide();

        if($('#CaOsdDialog').length <= 0){
            create();
        }

        $("#CaOsdText").text(""+self.params.osd);

        if(self.params.pos == 1)
        {
            $('#CaOsdDialog').css("top","30px");
            $("#CaOsdDialog").css('background-image',"url("+bkImg+")");
            Move();
        }
        else if(self.params.pos == 2)
        {
            $('#CaOsdDialog').css("top","680px");
            $("#CaOsdDialog").css('background-image',"url("+bkImg+")");
            Move();
        }
        else if(self.params.pos == 3){
            $("#CaOsdDialog").css({
                'position':'absolute',
                'zIndex':'2',
                'top':'0px',
                'left':'0px',
                'width':'1280px',
                'height':'720px',
                'color':'black',
                'width':'1280px',
                'word-break':'break-all',
                'background-color':"white",
                'overflow':'hidden',
                'display':'table'
            });

            $("#CaOsdText").css({
                'text-align':'center',
                'display':'table-cell',
                'vertical-align':'middle'
            });
        }
        else if(self.params.pos == 4){
            $("#CaOsdDialog").css({
                'position':'absolute',
                'zIndex':'2',
                'top':'0px',
                'left':'0px',
                'width':'1280px',
                'height':'360px',
                'color':'black',
                'width':'1280px',
                'word-break':'break-all',
                'background-color':"white",
                'overflow':'hidden',
                'display':'table'
            });

            $("#CaOsdText").css({
                'text-align':'center',
                'display':'table-cell',
                'vertical-align':'middle'
            });
        }
    };
    function Move()
    {
        $('#CaOsdText').css("left","1280px");
        $("#CaOsdText").animate({left:'10px'},1000*30,Move);
    }

    this.hide = function(){

        if($('#CaOsdDialog').length > 0)
        {
            $("#CaOsdText").stop();
            $('#CaOsdDialog').remove();
        }
    };

    return this;
}
