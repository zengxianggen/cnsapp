function Debuginfo()
{

    var self = this;
    this.flag = false;
    this.timer = null;
    this.start = function()
    {
        console.log("Debuginfo start..............");
        self.timer = window.setInterval(self.checkDebug,4000);
    };
    this.checkDebug=function() {

        //console.log("checkDebug sysCom.config.isDebug="+sysCom.config.isDebug);
        if(sysCom.config.isDebug == 1)
        {
            self.show();
        }
        else
        {
            self.hide();
        }

    };
    this.show = function () {
        //判断div是否已经存在
        if (self.flag == false)
        {
            var v = window.top.document.createElement("chdebug");
            v.id = "chdebug";
            window.top.document.body.appendChild(v);
            this.flag = true;
        }


        //设置css
        setStyle(window.top.document.getElementById("chdebug"),{
            backgroundSize: '200px 100px', width: '160px', height: '80px', top: '100px', right: '100px',
            display: 'block', position: 'absolute', zIndex: '4', overflow: 'hidden',backgroundColor :'#666',
            color: 'white'
        });

        var info_ret= utility.getSystemInfo(false);
   if(info_ret) {
       var txt= " \n"+"    "+"CPU:  "+info_ret.cpu+"%\n";
       txt=txt+"    "+"MEM:  "+info_ret.memTotal+" KB \n";
       txt=txt+"    "+"FREE: "+info_ret.memFree+" KB \n";
       window.top.document.getElementById("chdebug").innerText = txt;
   }


    };

    this.hide = function () {
        if (self.flag) {
            var n = window.top.document.getElementById("chdebug");
            n.parentNode.removeChild(n);
            self.flag = false;
        }
    };
    return this;
};
var debuginfo = new Debuginfo();
console.log("Debuginfo init");
setTimeout(debuginfo.start,1000);