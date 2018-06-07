function CASystemInfoDialog()
{
    var self = this;

    self.params = null;

    var diaId = "CASystemInfoDialog";
    function create(){
        var html = "";
        html += "<div id='"+diaId+"'>";

        html += "<div id='"+diaId+"_title'>"+self.params.title;
        html += "</div>";

        html += "<div id='"+diaId+"_content'>";
        html += "<ul id='"+diaId+"_content_ul'>"
        for(var i = 0; i < self.params.itemArray.length; i++){
            html += '<ol id="'+diaId+"_ul_ol_"+i+'">';


            html += "<div class='"+diaId+"_left'>" +self.params.itemArray[i].name+"</div>";
            html += "<div class='"+diaId+"_right'>" +self.params.itemArray[i].content+"</div>";


            html += "</ol>";
        }
        html += "</ul>";
        html += "</div>";

        html += "</div>";

        $("body").append(html);

        var rect = {w:600,h:640};
        rect = self.getCenterPosition(rect,1280,720);
        $("#"+diaId).css({

            'position':'absolute',
            'zIndex':'2',
            'left':rect.l+'px',
            'top':rect.t+'px',
            'width':rect.w+'px',
            'height':rect.h+'px',
            'background-color':'rgba(0,0,0,0.8)',
            'border':'4px solid #0080FF',
            'border-radius':'10px'
        });

        $("#"+diaId+"_title").css({
            'left':'0px',
            'top':'0px',
            'width':rect.w+'px',
            'height':rect.h*0.08+'px',
            'color': 'white',
            'text-align':'center',
            'line-height':rect.h*0.08+'px',
            'font-size':'24px',
            'margin':'0px'
        });

        $("#"+diaId+"_content").css({
            'padding-top':'10px',
            'margin-left':rect.w*0.02+'px',
            'width':rect.w*0.96+'px',
            'height':rect.h*0.88+'px',
            'border-radius':'20px',
            'background-color': 'rgba(88,88,88,0.8)',
            'overflow':'hidden',
        });

        $("#"+diaId+"_content_ul ol").css({
            //'border':'1px solid yellow'
        });

        $("#"+diaId+"_content_ul ol ."+diaId+"_left").css({
            'float':'left',
            'width':rect.w*0.38+'px',
            'height':rect.h*0.063+'px',
            'text-align':'right',
            'color': 'rgba(195,195,195)',
            'font-size':'22px'
        });

        $("#"+diaId+"_content_ul ol ."+diaId+"_right").css({
            'float':'right',
            'width':rect.w*0.58+'px',
            'height':rect.h*0.063+'px',
            'text-align':'left',
            'color':'white',
            'font-size':'22px'
        });

        var ele = document.getElementById(diaId);
        ele.setAttribute('tabindex', 1);
        ele.focus();
        //设置按键处理
        ele.onkeydown=function (e) {
            self.hide();
            e.stopPropagation();
            e.preventDefault();
        };
    }

    this.show = function(params){
        self.params = params;
        self.hide();
        create();
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