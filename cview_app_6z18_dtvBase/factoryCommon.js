/**
 * 放在其他模块之后
 * @constructor
 */
function FactoryCommon()
{
	this.doFactory = function(){
		languageCommon.reset();
		dtvCommon.reset();
		epgCommon.reset();
		sysCommon.reset();
		scanCommon.reset();
	};


	this.init = function(){

	};

	this.start = function(){

	};
}
var factoryCom = new FactoryCommon();
factoryCom.init();
