
/*var p1 = {
    title: "提醒",
    textok: "確認",
    textno: "取消",
    background: "../cview_app_common_pic/password_bg.png",
    dia_ImgOK: "../cview_app_common_pic/ico_ok.png",
    dia_ImgNO: "../cview_app_common_pic/ico_back.png",
    okfun: function () {
        console.log("ok");
    },
    nofun: function () {
        console.log("no");
    }
};
var p2 = {
    text: "频道名称:CCTV-1\n节目名称:康熙王朝第一集\n尼玛花擦的\n是打算空间打开手机打开就"
}
var dia = new Dialog(p1);
dia.show(p2);*/
function setStyle(obj,css){
    for(var atr in css){
        obj.style[atr] = css[atr];
    }
}
//预约节目提醒
function Dialog(p1) {
    var self = this;
    this.flag = false;
    this.p1 = p1;

    this.show = function (p2) {
        self.close();

        this.p2 = p2;
        //添加dialog

        var html = '<div id="dia_Title">';
        html += '<div id="dia_TextTitle"></div>';
        html += '</div>';
        html += '<div id="dia_Content">';
        html += '<diV id="dia_Text"></div>';
        html += '</div>';

        html += '<div id="dia_Foot">';
        if (this.p1.dia_ImgOK) {
            html += '<img id="dia_ImgOK" src="">';
            html += '<span id="dia_TextOK" ></span>&nbsp;&nbsp;';
        }
        if (this.p1.dia_ImgNO) {

        html += '<img id="dia_ImgNO" src="" class="footImg">';
        html += '<span id="dia_TextNO"></span>';
    }
        html += '</div>';

        var v = document.createElement("div");
        v.id = "ch_dialog";
        document.body.appendChild(v);
        v.innerHTML += html;

        this.flag = true;

        //设置css属性
        setStyle(document.getElementById("ch_dialog"),{
            'backgroundSize': '430px 210px', 'position': 'absolute', height: '210px', overflow: 'hidden','width':'430px',
            zIndex: '1', 'position': 'absolute', top: '200px', left: '425px',
            'backgroundImage':'url(' + self.p1.background + ')'
        });

        setStyle(document.getElementById("dia_TextTitle"),{
			'fontSize': '25px',
            'color':'#FFF',
			'position': 'absolute','top':'8px','left':'0px','width':'420px','textAlign': 'center',
			
        });

        setStyle(document.getElementById("dia_Content"),{
            'color':'#FFF','position': 'absolute','top':'53px','left':'20px','width':'380px','height': '110px',
            'textAlign': 'center','fontSize': '18px','overflow':'hidden'
        });

        setStyle(document.getElementById("dia_Text"),{
            'word-break':'break-all',
        });

        setStyle(document.getElementById("dia_Foot"),{
			'position': 'absolute','top':'175px','left':'0px','width':'420px','height': '44px',
				'marginLeft': '20px','textAlign': 'center'
        });
        if (this.p1.dia_ImgOK) {
            setStyle(document.getElementById("dia_TextOK"), {
                color: 'white', position: 'relative', top: '-4px',
                'fontSize': '18px', 'marginRight': '20px'
            });
        }
        if (this.p1.dia_ImgNO)
        {
            setStyle(document.getElementById("dia_TextNO"),{
            color: 'white', position: 'relative', top: '-4px',
            'fontSize': '18px', 'marginLeft': '0px'
           });
        }
        //设置内容
        document.getElementById("dia_TextTitle").innerText = this.p1.title ? this.p1.title : "";
        if (this.p1.dia_ImgOK)
        document.getElementById("dia_TextOK").innerText = this.p1.textok ? this.p1.textok : "";
        if (this.p1.dia_ImgNO)
        document.getElementById("dia_TextNO").innerText = this.p1.textno ? this.p1.textno : "";


        var txt = "";
        var text = this.p2.text.split("\n");
        for (i = 0; i < text.length; i++) {
            txt += text[i] + "<br/>";
        }
        document.getElementById("dia_Text").innerHTML = txt;

        //设置图片
        if (this.p1.dia_ImgOK)
            document.getElementById("dia_ImgOK").src=this.p1.dia_ImgOK;
        if (this.p1.dia_ImgNO)
            document.getElementById("dia_ImgNO").src=this.p1.dia_ImgNO;

        //设置按键处理
        document.getElementById("ch_dialog").setAttribute('tabindex', 1);
        document.getElementById("ch_dialog").focus();

        document.getElementById("ch_dialog").onkeydown=function (e) {
            console.log("in dialog:" + e.keyCode);
            if (e.keyCode == 13) {
                self.close();
                //do ok cb
                if (self.p1.okfun) {
                    self.p1.okfun();
                }
            }

            if (e.keyCode == 8) {
                self.close();
                //do no cb
                if (self.p1.nofun) {
                    self.p1.nofun();
                }
            }

            e.stopPropagation();
            e.preventDefault();
        };

        if(self.p1.timeout)
        {
            self.timer = setTimeout(function(){
                self.close();
            },self.p1.timeout);
        }
    };

    this.close = function () {
        clearTimeout(self.timer);

        var n = document.getElementById("ch_dialog");
        if(n && n.parentNode){
            n.parentNode.removeChild(n);
        }
    };
    return this;
}