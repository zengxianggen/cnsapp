function Arealimit()
{
    var self = this;
    this.flag = false;
    this.timer = null;
    this.start = function()
    {
        console.log("Arealimit start..............");
        window.setTimeout(self.checkArealimit,4000);
        self.timer = window.setInterval(self.checkArealimit,10000);
    };
    this.getArealimitStatus= function()
    {
      return self.flag;

    };
    this.checkArealimit=function()
    {
        var myDate = new Date();
        var nowtime  = myDate.getTime();
        var networkname = sysCom.config.NetworkName;

        if(1514736000 > sysCom.config.boottime && nowtime > 1514736000)//获取第一次收到TDT正确时间
        {
            sysCom.config.boottime = nowtime;
            sysCom.saveConfig();
        }



        console.log("nowtime="+nowtime);
        console.log("boottime="+sysCom.config.boottime );
        console.log("networkname="+networkname );





        var nostandby = sysCom.getMemConfig("nostandby");
        if(nostandby == 0) {
            console.log("checkArealimit standby return");
            self.deacvive();
            return;
        }

        if( sysCom.config.gongchengmenu == 1)
        {
            console.log("checkArealimit gongchengmenu return");
            self.deacvive();
            return;
        }


        //检查tvfeee
        if(sysCom.config.LockStb == 1)
        {
            console.log("acvivetvfee return");
            self.acvivetvfee();
            return;
        }
        else
        {
            self.deacvive();
        }
        ///////////////

        if( !networkname || networkname == "")
        {
            console.log("checkArealimit networkname return");
            self.deacvive();
            return;
        }


        if(sysCom.config.AreaLimit == 0)
        {
            console.log("checkArealimit AreaLimit=0 return");
            self.deacvive();
            return;
        }

        if(sysCom.config.FTI == 1 )
        {
            console.log("checkArealimit FTI return");
            self.deacvive();
            return;
        }




        if(!caCom || !caCom.caParams || !caCom.caParams.so)
        {
            console.log("checkArealimit zipCode return");
            self.deacvive();
            return;
        }
        var soid = ""+caCom.caParams.so ;
        console.log("soid="+soid);
        if( nowtime - sysCom.config.boottime >300000)
        {

            console.log("netwokename="+networkname);
            var soarr = networkname.split(",");
            for (i=0;i<soarr.length ;i++ )
            {
                var tmp = soarr[i].replace(/@/g,'');
                console.log(i+"soarr ="+tmp);

                if(tmp == soid)
                {
                    console.log("have so = "+soid);
                    self.deacvive();
                    return;
                }
            }
            console.log("checkArealimit acvive=");
            self.acvive();

        }
    };


    this.acvivetvfee = function () {
        //判断div是否已经存在
        if (self.flag)
        {
            return;
        }
        else {
            appCom.goAppByName("tvportal",false);
            //添加arealimit
            var v = window.top.document.createElement("div");
            v.id = "arealimit";
            window.top.document.body.appendChild(v);
            this.flag = true;

            //设置css
            setStyle(window.top.document.getElementById("arealimit"),{
                backgroundSize: '640px 360px', width: '640px', height: '360px', top: '180px', right: '320px',
                display: 'block', position: 'absolute', zIndex: '4', overflow: 'hidden'
            });

            //设置图片
            setStyle(window.top.document.getElementById("arealimit"),{backgroundImage: 'url(' + "file:///application/cview/cview_app_common_pic/tvfee.jpg" + ')'});

        }
    };

    this.acvive = function () {
        //判断div是否已经存在
        if (self.flag)
        {
           return;
        }
        else {
            appCom.goAppByName("tvportal",false);
            //添加arealimit
            var v = window.top.document.createElement("div");
            v.id = "arealimit";
            window.top.document.body.appendChild(v);
            this.flag = true;

            //设置css
            setStyle(window.top.document.getElementById("arealimit"),{
                backgroundSize: '640px 360px', width: '640px', height: '360px', top: '180px', right: '320px',
                display: 'block', position: 'absolute', zIndex: '4', overflow: 'hidden'
            });

            //设置图片
            setStyle(window.top.document.getElementById("arealimit"),{backgroundImage: 'url(' + "file:///application/cview/cview_app_common_pic/arealimit.jpg" + ')'});

        }
    };




    this.deacvive = function () {
        if (self.flag)
        {
            var n = window.top.document.getElementById("arealimit");
            n.parentNode.removeChild(n);
            self.flag = false;
        }
    };

    return this;
};
var arealimit = new Arealimit();
console.log("arealimit init");
setTimeout(arealimit.start,1000);