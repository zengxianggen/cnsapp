function TunerCommon(id,signal)
{
    var self = this;
    this.id = id;
    this.signal = signal;

    this.tunerSignal = [
        {
            name:"DVB-C",
            value:0
        },
        {
            name:"DVB-S",
            value:1
        },
        {
            name:"DVB-T",
            value:2
        }
    ];

    this.init = function()
    {
        console.log("TunerCommon init");
    };

    this.reset = function()
    {
        console.log("TunerCommon reset");
    };

    this.tunerConnect = function(carrier,cb)
    {
        var params = {
            "id":self.id,
            "signal":self.signal,
            "car":carrier
        };
        Tuner.tunerConnect(params,cb);
    };

    this.tunerGetStatus = function(cb)
    {
        var params = {
            "id":self.id,
        };
        Tuner.tunerGetStatus(params,cb)
    };

}
var tunerCom = new TunerCommon(0,0);
console.log("tunerCom init");
tunerCom.init();
