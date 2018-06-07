function ScanCommon(signal)
{
	var self = this;

	this.signal = signal;

	this.scanStatus = 0;

	this.scanSignal = [
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
	this.scanMode = [
		{
			name:"NIT",
			value:0
		},
        {
            name:"Manual",
            value:1
        },
		{
            name:"List",
            value:2
        }
	];

	this.scanQam = [
		64,128,256
	];

	this.saveMode = [
		{
			name:"Delete Previous Data",
			value:0
		},
		{
			name:"Keep Previous Data",
			value:1
		}
	];

	this.getUIQam = function(sQam){
	    var ret = "64";
        switch(sQam)
        {
            case 5:
                ret = "64";
                break;
            case 6:
                ret = "128";
                break;
            case 7:
                ret = "256";
                break;
        }
        return ret;
    };

	this.init = function()
	{
		//get default scan params
	};

	this.reset= function()
	{
		
	};

	this.stopScan = function(){
        this.scanStatus = 0;
		Scan.scanStop(null,false);
	};

	this.setScanParams = function(mode,car)
	{
		var params = {
			"signal":self.signal,
			"mode":mode,
			"car":car
		};
		Scan.scanSetParams(params,false);
	};

	this.startScan = function(){
        this.scanStatus = 1;
		Scan.scanStart(null,false);
	};

	this.getScanInfo = function(start,max,cb)
	{
		var param = {
			"start":start,
			"max":max
		};
		Scan.scanGetInfo(param,cb);
	};

	this.saveScan = function(mode){
		var param = {
			"mode":0
		};
		if(mode)
		{
			param.mode = mode;
		}
		Scan.scanSave(param,false);
	};

}

var scanCom = new ScanCommon(0);
console.log("scanCom init");
scanCom.init();
