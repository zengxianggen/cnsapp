function fsCommon()
{
    var self = this;

    this.start = function(){

    };

    this.init = function(){

    };

    this.reset = function(){

    };

    this.formatdisk =  function(disk,cb)
    {
        FS.fsDiskFormat(disk, cb);
    };

    this.getUsbPartiotions = function(){
        var usbArray = FS.fsGetDiskInfo(false);
    };


    this.getUsbFiles = function(path){
        var fileArray = FS.fsGetFiles(
            {
                "start": 0,
                "max": 0,
                "path": path
            },false);
    };

    this.getPairedDisk = function() {



        var usbArray = FS.fsGetDiskInfo(null,false);

        if(usbArray == null || usbArray.length <= 0)//
        {
            return "no disk";
        }
        if(SystemConfig.config.PVRService == 0)
        {
            return "no active";
        }


        if(usbArray) {
            for (var i = 0; i <usbArray.length;i++)
            {
               var item = usbArray[i];
               if(item.sn ==  SystemConfig.config.PVRPariedSn)
               {
                   return item;
               }

            }
        }
        return "no pair";
    }
}
var fsCom = new fsCommon();
console.log("fsCom init");