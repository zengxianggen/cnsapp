/*
音量加减：
        var p1 = {
            max: 32,
            time: 5000,
            background: "../cview_app_common_pic/volumn_bar.png",
            ico_sound: "../cview_app_common_pic/ico_sound.png",
        }
        this.vol = new Volume(p1);

        var p2 = {
            v: 16,
        }
        this.vol.show(p2);

静音：
        var p={
            background:"../cview_app_common_pic/mute.png"       //静音背景
        }
        var mute = new Mute(p);
        mute.show();
        mute.close();
*/

function setStyle(obj,css){
    for(var atr in css){
        obj.style[atr] = css[atr];
    }
}
//音量控制
function Volume(p1) {
    var self = this;
    this.timeoutID = null;
    this.flag = false;
    self.p1 = p1;
    this.show = function (p2) {

        self.p2 = p2;

        if (self.p1.max && !isNaN(self.p1.max)) {
            var maxVol = self.p1.max;
        }
        else {
            var maxVol = 32;
        }
        var averageWidth = 640 / maxVol;

        if (self.p1.time && !isNaN(self.p1.time)) {
            var time = self.p1.time;
        }
        else {
            var time = 5000;
        }

        if (self.p2.v && !isNaN(self.p2.v)) {
            var v = self.p2.v;
        }
        else {
            var v = 0;
        }

        if (v < 0) {
            v = 0;
        }
        else if (v > maxVol) {
            v = maxVol;
        }

        //添加volume
        var addVolume = function () {
            var html = '<img id="ico_sound" src="">';
            html += '<div id="volDlg"></div>';
            html += '<div id="volNum">';
            html += '<span id="num">30</span>';
            html += '</div>';

            var v = window.top.document.createElement("div");
            v.id = "volume";
            window.top.document.body.appendChild(v);
            v.innerHTML += html;


            //设置css属性
            setStyle(window.top.document.getElementById("volume"),{
                'backgroundSize': '809px 98px', width: '809px', height: '98px', display: 'block', overflow: 'hidden',
                position: 'absolute', zIndex: '4', overflow: 'hidden', top: '550px', left: '235px'
            });

            setStyle(window.top.document.getElementById("ico_sound"),{
                float: 'left', marginTop: '23px', marginLeft: '35px', 'marginRight': '7.5px'
            });

            setStyle(window.top.document.getElementById("volDlg"),{
                float: 'left', marginTop: '34px', height: '28px', borderRadius: '3px',
                backgroundColor: '#1C86EE'
            });
            setStyle(window.top.document.getElementById("volNum"),{
                'paddingTop': '20px', width: '63px', height: 'auto', float: 'right', fontSize: '45px',
                color: 'white', textAlign: 'center', verticalAlign: 'middle', display: 'tableCell'
            });

            //设置图片
            if (self.p1.background) {
                setStyle(window.top.document.getElementById("volume"),{backgroundImage: "url(" + self.p1.background + ")"});
            }
            if (self.p1.ico_sound) {
                window.top.document.getElementById("ico_sound").setAttribute('src', self.p1.ico_sound);
            }
        };

        //判断div是否已经存在
        if (window.top.document.getElementById("volume") == null) {
            addVolume();
            this.flag = true;
        }

        //设置延时消失
        if (this.timeoutID) {
            clearTimeout(this.timeoutID);
        }
        this.timeoutID = setTimeout(self.close, time);

        //设置音量数字
        window.top.document.getElementById("num").innerText=v;

        //设置音量条长度
        setStyle(window.top.document.getElementById("volDlg"),{ width:averageWidth * v + 'px'});
    };

    this.close = function () {
        if (self.flag) {
            var n = window.top.document.getElementById("volume");
            n.parentNode.removeChild(n);
            self.flag = false;
        }
        self.timeoutID = null;
    };

    return this;
}

//静音
function Mute(p)
{
    var self = this;
    this.flag = false;
    self.p = p;
    this.show = function () {
        //判断div是否已经存在
        if (self.flag)
        {
            self.close();
        }
        else {
            //添加mute
            var v = window.top.document.createElement("div");
            v.id = "mute";
            window.top.document.body.appendChild(v);
            this.flag = true;

            //设置css
            setStyle(window.top.document.getElementById("mute"),{
                backgroundSize: '100px 70px', width: '100px', height: '70px', top: '40px', right: '40px',
                display: 'block', position: 'absolute', zIndex: '4', overflow: 'hidden'
            });

            //设置图片
            if (self.p.background) {
                setStyle(window.top.document.getElementById("mute"),{backgroundImage: 'url(' + self.p.background + ')'});
            }
        }
    };

    this.close = function () {
        if (self.flag) {
            var n = window.top.document.getElementById("mute");
            n.parentNode.removeChild(n);
            self.flag = false;
        }
    };

    return this;
}
