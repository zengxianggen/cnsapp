function PvrCommon()
{
    var self = this;

    this.init = function(){

    };

    this.start = function()
    {

    };
    this.reset = function(){

    };

    this.startRec = function(id,serviceName,url,privateStr){
        PVR.recStart(id,seriveName,url,privateStr,false);
    };

    this.stopRec = function(){
        PVR.recStop(id,false);
    };


}
var pvrCom = new PvrCommon();
console.log("pvrCom init");
pvrCom.init();