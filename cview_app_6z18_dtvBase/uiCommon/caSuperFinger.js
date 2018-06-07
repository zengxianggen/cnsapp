function CaSuperFingerDialog(){
    var self = this;

    this.isCreated = false;

    this.isForce = false;

    this.ShowTimer = null;

    this.MoveTimer = null;

    this.params = null;

    this.fontSize = {
        'default' : '30px',
        'small' :   '20px',
        'big' : '40px'
    };

    this.isShowTime = true;

    function create(){
        var html = "";
        html += "<div id='CaSuperFingerDialog'>";
        html += "</div>";

        $("body").append(html);

    }

    this.show = function(params){

        this.params = params;

        if(!this.params){
            return;
        }

        self.hide();

        if(params.action == 0)
        {
            if(self.isForce){
                self.isForce = false;
                caCom.lockStatus = false;
            }
            return;
        }

        if(params.isforceshow){
            self.isForce = true;
            caCom.lockStatus = true;
        }

        create();


        $('#CaSuperFingerDialog').css({
            "position"	: "absolute",
            'zIndex':'3',
            'top'   :   '' + params.yposition* 550 / 100 + 10 +'px',
            'left'  :   '' + params.xposition* 1000 / 100 + 10 +'px',
            'color' :   self.getColor(params.frontcolor),
            'background-color'  :  self.getColor(params.backgroundcolor)
        });

        if(params.fontsize == 1)
        {
            $('#CaSuperFingerDialog').css('font-size',self.fontSize.big);
        }
        else if(params.fontsize == 2)
        {
            $('#CaSuperFingerDialog').css('font-size',self.fontSize.small);
        }
        else
        {
            $('#CaSuperFingerDialog').css('font-size',self.fontSize.default);
        }
        //0： 字符串
        if(params.showtype == 0)
        {
            $('#CaSuperFingerDialog').text(self.params.szcontent);
            var w = $("#CaSuperFingerDialog").outerWidth();
            var h = $("#CaSuperFingerDialog").outerHeight();
            var t = params.yposition* (720-h) / 100;
            var l = params.xposition* (1280-w) / 100;
            if(t < 10){
                t = 20;
            }
            if(l < 10){
                l = 40;
            }
            $("#CaSuperFingerDialog").css("top",t + "px");
            $("#CaSuperFingerDialog").css("left",l + "px");
        }//1 : 点阵
        else if(params.showtype == 1)
        {
            var html = '<table id="superFingerPoint">';
            for(var i = 0; i < 10; i++)
            {
                html += '<tr>';
                for(var j = 0; j < 10; j++)
                {
                    html += '<td><div></div></td>';
                }
                html += '</tr>';
            }
            html += '</table>';

            $('#CaSuperFingerDialog').append(html);

            $('#CaSuperFingerDialog table tr td div').css({
                'width' : '10px',
                'height' : '10px',
                'margin' : '2px 2px',
                'padding' : '2px 2px',
                'border-radius':'10px',
                'line-height': '10px',
                'color' : self.getColor(params.frontcolor),
            });
            self.params.szcontent = "" + self.params.szcontent;

            while(self.params.szcontent.length < 16){
                self.params.szcontent += "0";
            }

            for(var i = 0; i < 8; i++)
            {
                //left
                var ln = parseInt(self.params.szcontent[i],10);
                var lns = "" + ln.toString(2);
                lns = this.get16Num(lns);
                for(var k = 0; k < 4; k++)
                {
                    if(lns[k] == 1 || lns[k] == "1")
                    {
                        self.setBlackPoint(i+1,k+1);
                    }
                }

                //right

                var rn = parseInt(self.params.szcontent[i+8],10);
                var rns = "" + rn.toString(2);
                rns = this.get16Num(rns);
                for(var k = 0; k < 4; k++)
                {
                    if(rns[k] == 1 || rns[k] == "1")
                    {
                        self.setBlackPoint(i+1,k+5);
                    }
                }
            }

            $('#CaSuperFingerDialog table tr:eq(0) td:nth-child(1) div').text("+");
            $('#CaSuperFingerDialog table tr:eq(0) td:nth-child(10) div').text("+");
            $('#CaSuperFingerDialog table tr:eq(9) td:nth-child(1) div').text("+");
            $('#CaSuperFingerDialog table tr:eq(9) td:nth-child(10) div').text("+");

            var w = $("#CaSuperFingerDialog").outerWidth();
            var h = $("#CaSuperFingerDialog").outerHeight();
            var t = params.yposition* (720-h) / 100;
            var l = params.xposition* (1280-w) / 100;
            if(t < 10){
                t = 20;
            }
            if(l < 10){
                l = 40;
            }
            $("#CaSuperFingerDialog").css("top",t + "px");
            $("#CaSuperFingerDialog").css("left",l + "px");
        }
        //矩阵
        else if(params.showtype == 2)
        {
            var html = '<table id="superFingerPoint">';
            for(var i = 0; i < 16; i++)
            {
                html += '<tr>';
                for(var j = 0; j < 16; j++)
                {
                    html += '<td><div></div></td>';
                }
                html += '</tr>';
            }
            html += '</table>';

            $('#CaSuperFingerDialog').append(html);

            /*$('#CaSuperFingerDialog table tr  td').css({
                "border":"1px solid black",
                'border-bottom' : 'none',
                'border-right' : 'none'
            });*/

            $('#CaSuperFingerDialog table tr td div').css({
                'width' : '10px',
                'height' : '10px',
                'margin' : '2px 2px',
                'padding' : '2px 2px',
                'border-radius':'10px',
                'line-height': '10px',
                'color' : self.getColor(params.frontcolor),
            });


            for(var i = 0 ;i < params.matrixinnerpos.length && i < self.params.szcontent.length; i++)
            {
                var x = ((params.matrixinnerpos[i] & 0xF0) >> 4);
                var y = (params.matrixinnerpos[i] & 0x0F);
                self.setDivValue(x,y,self.params.szcontent[i]);
            }

            var w = $("#CaSuperFingerDialog").outerWidth();
            var h = $("#CaSuperFingerDialog").outerHeight();
            var t = params.yposition* (720-h) / 100;
            var l = params.xposition* (1280-w) / 100;
            if(t < 10){
                t = 20;
            }
            if(l < 10){
                l = 40;
            }
            $("#CaSuperFingerDialog").css("top",t + "px");
            $("#CaSuperFingerDialog").css("left",l + "px");
        }
        $('#CaSuperFingerDialog').hide();

        self.openShowTimer();

        if(self.params.xposition == 100 || self.params.yposition == 100)
        {
            self.openMoveTimer();
        }

    };

    this.get16Num = function(num)
    {
        if(num.length ==0 )
        {
            return "0000";
        }
        else if(num.length == 1)
        {
            return ("000"+num);
        }
        else if(num.length == 2)
        {
            return ("00"+num);
        }
        else if(num.length == 3)
        {
            return ("0"+num);
        }
        return num;
    }

    this.setBlackPoint = function(x,y){
        x = parseInt(x);
        y = parseInt(y);
        var seletor = "#CaSuperFingerDialog table tr:eq";
        seletor += "(" + x + ") ";
        seletor += "td:nth-child";
        seletor += "(" + (y+1) + ") ";
        seletor += "div";
        $(seletor).css('background-color',self.getColor(self.params.frontcolor));
    };

    this.setDivValue = function(x,y,value){
        x = parseInt(x);
        y = parseInt(y);
        var seletor = "#CaSuperFingerDialog table tr:eq";
        seletor += "(" + x + ") ";
        seletor += "td:nth-child";
        seletor += "(" + (y+1) + ") ";
        seletor += "div";
        $(seletor).text(value);
    };

    this.openShowTimer = function(){
        var timout = self.params.flashshowtime + self.params.flashhidetime;
        var cnt = 0;
        this.closeShowTimer();

        if(self.params.flashhidetime == 0){
            $('#CaSuperFingerDialog').show();
            return;
        }

        if(self.params.flashshowtime == 0){
            return;
        }

        //隐性
        if(self.params.isvisible == 1){
            console.log("self.params.isvisible show");
            $('#CaSuperFingerDialog').show();
            setTimeout(function(){
                console.log("self.params.isvisible hide");
                $('#CaSuperFingerDialog').hide();
            },20);

            self.ShowTimer = setInterval(function(){
                console.log("self.params.isvisible show");
                $('#CaSuperFingerDialog').show();
                setTimeout(function(){
                    console.log("self.params.isvisible hide");
                    $('#CaSuperFingerDialog').hide();
                },20);
            },1000*timout);

        }
        else if(self.params.isvisible == 0){
            $('#CaSuperFingerDialog').show();
            this.ShowTimer = setInterval(function(){
                cnt++;
                if(cnt >= timout)
                {
                    cnt = 0;
                }

                if(cnt < self.params.flashshowtime) {
                    $('#CaSuperFingerDialog').show();
                    if(self.params.isforceshow){
                        caCom.lockStatus = true;
                    }
                }
                else
                {
                    $('#CaSuperFingerDialog').hide();
                    if(self.params.isforceshow){
                        caCom.lockStatus = false;
                    }
                }
            },1000*1);
        }
    };

    this.closeShowTimer = function(){
        if(self.ShowTimer)
        {
            clearInterval(self.ShowTimer);
            self.ShowTimer = null;
        }
    };

    function RandomNumBoth(Min,Max){
        var Range = Max - Min;
        var Rand = Math.random();
        var num = Min + Math.round(Rand * Range);
        return num;
    }

    this.openMoveTimer = function(){
        this.closeMoveTimer();
        this.MoveTimer = setInterval(function () {
            //获取窗口大小尺寸
            console.log("w:"+ $("#CaSuperFingerDialog").outerWidth());
            console.log("h:"+ $("#CaSuperFingerDialog").outerHeight());
            var w = $("#CaSuperFingerDialog").outerWidth();
            var h = $("#CaSuperFingerDialog").outerHeight();
            var t = RandomNumBoth(40,720-h);
            var l = RandomNumBoth(40,1280-w);

            var cl = parseInt($("#CaSuperFingerDialog").css('width')) + l;
            if(cl > 1200)
            {
                l = 1200 - parseInt($("#CaSuperFingerDialog").css('width'));
            }
            var ct = parseInt($("#CaSuperFingerDialog").css('height')) + t;
            if(ct > 700)
            {
                t = 700 - parseInt($("#CaSuperFingerDialog").css('height'));
            }

            $("#CaSuperFingerDialog").css('top',""+t+"px");
            $("#CaSuperFingerDialog").css('left',""+l+"px");
        },1000*5);
    };

    this.closeMoveTimer = function(){
        if(self.MoveTimer)
        {
            clearInterval(self.MoveTimer);
            self.MoveTimer = null;
        }
    };

    this.hide = function(){
        this.closeShowTimer();
        this.closeMoveTimer();
        if($('#CaSuperFingerDialog'))
        {
            $('#CaSuperFingerDialog').remove();
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

    return this;
}




