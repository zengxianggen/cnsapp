function CaMailDialog(iconUrl,okDo){
    var self = this;

    function create(){
        var html = "";
        html += "<div id='CaMailDialog'>";
        html += "<img id='mailIcon' src=''/>";
        html += "</div>";

        $("body").append(html);

        $("#CaMailDialog").css({
            'position':'absolute',
            'zIndex':'2',
            'top':'30px',
            'left':'360px',
            'margin':'30px auto'
        });
        console.log("iconUrl:"+iconUrl);
        $("#mailIcon").attr('src', iconUrl);
        $("#CaMailDialog").attr('tabindex', 1);
        $("#CaMailDialog").focus();
        $("#CaMailDialog").keydown(function (e){

            if(e.keyCode == 13)
            {
                if(okDo)
                {
                    okDo();
                }
            }

            e.stopPropagation();
            e.preventDefault();
        });
    }

    this.show = function(){

        if($('#CaMailDialog').length <= 0)
        {
            console.log("create caMailDlg");
            create();
        }
    };

    this.close = function(){

        if($('#CaMailDialog').length > 0)
        {
            console.log("close caMailDlg");
            $('#CaMailDialog').remove();
        }
    };

    return this;
}