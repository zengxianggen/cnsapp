// JavaScript Document
var WRCall = {
	"xmlhttp":null,
	"timer":null,
	
    "file":"file://",
   /* "host" : "http://192.168.2.106:18030",
    "path" : "http://192.168.2.106:18030/rpc",*/
    //"host":"http://127.0.0.1:18030",
    //"path": "http://"+rpcUrl+":18030/rpc",
    "id" : 1,
    "callSync" : function(params,path,method){

			
        try{
			if(!path || path == "")return;
			
            var text = "";

            if(params != null){
				text = params;
			}
			
			var method1 = "POST";

            var xmlhttp = new XMLHttpRequest();
			//xmlhttp.timeout = 5000;
            xmlhttp.open(method1, path, false);
			xmlhttp.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
            xmlhttp.send(text);
            console.log("send text = ")
            var ret = xmlhttp.responseXML;
			console.log("send ret =="+ret);
			WorkReport.isSerach = false;
            return ret;
        } catch (e) {
            console.log("error callSync EXP:" + e.name + ": " + e.message);
            return null;
        }
    },

    "callAsync" : function(params,callback,timeoutCB,path){
		
		var self = this;
        if(!path || path == "")return;
			
		var text = "";

		if(params != null){
			text = params;
		}
		
		self.openTimer(callback,60000);//延長到60秒
		
		
		var method1 = "POST";
		
        this.xmlhttp = new XMLHttpRequest();
        self.xmlhttp.open(method1, path, true);
		self.xmlhttp.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
		try {

		self.xmlhttp.send(params);

            console.log("send params=="+params);
		}catch(e){
			console.log(e);
		}

        self.xmlhttp.onreadystatechange = function(){
            if((self.xmlhttp.readyState == 4 && self.xmlhttp.status == 200)){
				self.clearTimer();
				WorkReport.isSerach = false;
                var ret ;
				console.log("WorkReport.isCMMACRquest=="+WorkReport.isCMMACRquest);
				if(WorkReport.isCMMACRquest==false)
					ret = self.xmlhttp.responseXML;
				else {
					ret = self.xmlhttp.responseText;
					WorkReport.isCMMACRquest = false;
				}

                console.log("onreadystatechange.ret=="+ret.toString());

				if(ret){
					callback(ret);
				} else {
					callback(null);
				}
				
            }
        };
    },

    "callRemote" : function(params, cb, path){
        if(cb === false){
            return WRCall.callSync(params, path);
        } else {
			WRCall.callAsync(params, cb,path);
        }
    },
	"openTimer":function(callback,timeout){
		var self = this;
		if(this.timer!=null)this.clearTimer();
		this.timer = setTimeout(function(){
			callback();
			if(this.xmlhttp){
				this.xmlhttp.abort();
				this.xmlhttp = null;
			}
			WorkReport.isSerach = false;
		},timeout);
	},
	"clearTimer":function(){
		if(this.timer){
			clearTimeout(this.timer);
			this.timer = null;
		}
	}
	
};

var WorkReturn  = {
	sendOrder:function(params,callback,timeoutCB,path){
		WorkReport.isSerach = true;
		WRCall.callAsync(params,callback,timeoutCB,path);
	}
}

var WorkReport={
	isSerach:false,
	isCMMACRquest:false,
	
	makeQueryServerUrl : function (CrmId){
		var  server = null;
		if (null === CrmId || 0 === CrmId.length) return null;
		if (CrmId) {
            for (; 0 === CrmId.indexOf("0");) {
                CrmId = CrmId.substring(1);
			}
		}
		var preURL = "http://so",
		postURL = ".myaccount.totaltv.com.tw:8080/myaccount/MyAccount.asmx",
		server = preURL + CrmId + postURL;
		
		return server;
	},
	
	makeQueryParams : function(CrmId, CrmWorkshortsno){
		var xmlRequest = null;
		
		var xmlRequest = '<?xml version="1.0" encoding="UTF-8"?>\n';
        return xmlRequest += '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"\n',
        xmlRequest += '  xmlns:xsd="http://www.w3.org/2001/XMLSchema"\n',
        xmlRequest += '  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\n',
        xmlRequest += "  <soapenv:Body>\n",
        xmlRequest += '    <QuerySNo xmlns="CrmStbWebService">\n',
        xmlRequest += "      <params><![CDATA[",
        xmlRequest += "<DataTable>",
        xmlRequest += "<CrmId>" + CrmId + "</CrmId>",
        xmlRequest += "<CrmWorkShortSNo>" + CrmWorkshortsno + "</CrmWorkShortSNo>",
        xmlRequest += "</DataTable>",
        xmlRequest += "]]></params>\n",
        xmlRequest += "    </QuerySNo>\n",
        xmlRequest += "  </soapenv:Body>\n",
        xmlRequest += "</soapenv:Envelope>\n"
		
		return xmlRequest;
	},
	getXmlNodeValue : function(xml, tag) {
        var nodes = xml.getElementsByTagName(tag);
        return nodes.length < 1 ? null: nodes[0].childNodes[0].nodeValue
    },
	
	getWorkOrderInfo:function(xmlResult){
		var info = {
			RetCode:1,
			RetMsg:"",
			CrmId:"",
			CrmWorkOrder:"",
			CrmInstallName:"",
			CrmBpName:"",
			CrmWorker1:"",
			MobilePhone:""
		}
		var xmlquerysno,xmlstr = this.getXmlNodeValue(xmlResult, "QuerySNoResult");
        try {
            xmlquerysno = (new DOMParser).parseFromString(xmlstr.trim(), "text/xml")
        } catch(e) {
            console.log(e);
            info.RetCode = 1;
            info.RetMsg = "FAILED";
        }
		console.log("this.getXmlNodeValue(xmlquerysno, 'RetCode')=="+this.getXmlNodeValue(xmlquerysno, "RetCode"));
        info.RetCode = this.getXmlNodeValue(xmlquerysno, "RetCode"),
        info.RetMsg = this.getXmlNodeValue(xmlquerysno, "RetMsg");
        info.CrmId = this.getXmlNodeValue(xmlquerysno, "CrmId"),
        info.CrmWorkOrder = this.getXmlNodeValue(xmlquerysno, "CrmWorkOrder"),
        info.CrmInstallName = this.getXmlNodeValue(xmlquerysno, "CrmInstallName"),
        info.CrmBpName = this.getXmlNodeValue(xmlquerysno, "CrmBpName"),
        info.CrmWorker1 = this.getXmlNodeValue(xmlquerysno, "CrmWorker1"),
        info.MobilePhone = this.getXmlNodeValue(xmlquerysno, "MobilePhone");
		
		return info;
	},
	makeQueryCmModuleParams : function(CrmId, CrmWorkOrder) {
        var xmlRequest = '<?xml version="1.0" encoding="UTF-8"?>\n';
        return xmlRequest += '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"\n',
        xmlRequest += '  xmlns:xsd="http://www.w3.org/2001/XMLSchema"\n',
        xmlRequest += '  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\n',
        xmlRequest += "  <soapenv:Body>\n",
        xmlRequest += '    <QueryCmModule xmlns="CrmStbWebService">\n',
        xmlRequest += "      <params><![CDATA[",
        xmlRequest += "<DataTable>\n",
        xmlRequest += "  <CrmId>" + CrmId + "</CrmId>\n",
        xmlRequest += "  <CrmWorkOrder>" + CrmWorkOrder + "</CrmWorkOrder>\n",
        xmlRequest += "</DataTable>\n",
        xmlRequest += "]]></params>\n",
        xmlRequest += "    </QueryCmModule>\n",
        xmlRequest += "  </soapenv:Body>\n",
        xmlRequest += "</soapenv:Envelope>\n"
    },
	
	getQueryCmModuleInfo:function(xmlResult){
		var info = {
			RetCode:1,
			RetMsg:"",
			Flag:0,
		}
		
		var RetCode, RetMsg, Flag, xmlstr, xmlquerycm;
        try {
            var xmlstr = this.getXmlNodeValue(xmlResult, "QueryCmModuleResult"),
            xmlquerycm = (new DOMParser).parseFromString(xmlstr.trim(), "text/xml");
            info.Flag = this.getXmlNodeValue(xmlquerycm, "Flag"),
            info.RetCode = this.getXmlNodeValue(xmlquerycm, "RetCode"),
            info.RetMsg = this.getXmlNodeValue(xmlquerycm, "RetMsg")
        } catch(e) {
            console.log(e),
            info.RetCode = 1;
            info.RetMsg = "SOAP :: 作業失敗";
            info.Flag = null
        }
		
		return info;
	},
	makeAuthorSTBParams : function(CrmId, DeviceSNo3, CrmWorkOrder, CrmWorker1, MobilePhone, IncludeHD, HDSerialNo) {
        var xmlRequest = '<?xml version="1.0" encoding="UTF-8"?>\n';
        return xmlRequest += '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"\n',
        xmlRequest += '  xmlns:xsd="http://www.w3.org/2001/XMLSchema"\n',
        xmlRequest += '  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\n',
        xmlRequest += "  <soapenv:Body>\n",
        xmlRequest += '    <AuthorSTB xmlns="CrmStbWebService">\n',
        xmlRequest += "      <params><![CDATA[",
        xmlRequest += "<DataTable>\n",
        xmlRequest += "  <CrmId>" + CrmId + "</CrmId>\n",
        xmlRequest += "  <DeviceSNo3>" + DeviceSNo3 + "</DeviceSNo3>\n",
        xmlRequest += "  <CrmWorkOrder>" + CrmWorkOrder + "</CrmWorkOrder>\n",
        xmlRequest += "  <CrmWorker1>" + CrmWorker1 + "</CrmWorker1>\n",
        xmlRequest += "  <MobilePhone>" + MobilePhone + "</MobilePhone>\n",
        xmlRequest += "  <IncludeHD>" + IncludeHD + "</IncludeHD>\n",
        xmlRequest += "  <HDSerialNo>" + HDSerialNo + "</HDSerialNo>\n",
        xmlRequest += "</DataTable>\n",
        xmlRequest += "]]></params>\n",
        xmlRequest += "    </AuthorSTB>\n",
        xmlRequest += "  </soapenv:Body>\n",
        xmlRequest += "</soapenv:Envelope>\n"
    },
	getAuthorSTBInfo : function(xml) {
		var info = {
			RetCode:1,
			RetMsg:""
		}
		
        var xmlstr = this.getXmlNodeValue(xml, "AuthorSTBResult"),
       		xmlauthorstb = (new DOMParser).parseFromString(xmlstr.trim(), "text/xml");


        info.RetCode = this.getXmlNodeValue(xmlauthorstb, "RetCode");

        info.RetMsg = this.getXmlNodeValue(xmlauthorstb, "RetMsg");
        console.log("getAuthorSTBInfo RetCode="+ info.RetCode );
        console.log("getAuthorSTBInfo RetMsg="+info.RetMsg);
		return info;
    },
	
	makeSwapMobilePhoneParam : function(CrmId, CrmWorkShortSNo, MobilePhone) {
        var xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        return xml += '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"\n',
        xml += '  xmlns:xsd="http://www.w3.org/2001/XMLSchema"\n',
        xml += '  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\n',
        xml += "  <soapenv:Body>\n",
        xml += '    <SwapMobilePhone xmlns="CrmStbWebService">\n',
        xml += "      <params><![CDATA[",
        xml += "<DataTable>\n",
        xml += "<CrmId>" + CrmId + "</CrmId>\n",
        xml += "  <CrmWorkShortSNo>" + CrmWorkShortSNo + "</CrmWorkShortSNo>\n",
        xml += "  <MobilePhone>" + MobilePhone + "</MobilePhone>\n",
        xml += "</DataTable>\n",
        xml += "]]></params>\n",
        xml += "    </SwapMobilePhone>\n",
        xml += "  </soapenv:Body>\n",
        xml += "</soapenv:Envelope>\n"
    },
	getSwapMobilePhoneResultInfo : function(xml) {
		
		var info={
			RetCode:1,
			RetMsg:"",
			CrmId:0,
			CrmWorkOrder:"",
			CrmInstallName:"",
			CrmBpName:"",
			CrmWorker1:"",
			MobilePhone:""
		}
		
        var xmlstr = this.getXmlNodeValue(xml, "SwapMobilePhoneResult"),
        	xmlswapmp = (new DOMParser).parseFromString(xmlstr.trim(), "text/xml");
        info.RetCode = this.getXmlNodeValue(xmlswapmp, "RetCode");
        info.RetMsg = this.getXmlNodeValue(xmlswapmp, "RetMsg");
        info.CrmId = this.getXmlNodeValue(xmlswapmp, "CrmId");
        info.CrmWorkOrder = this.getXmlNodeValue(xmlswapmp, "CrmWorkOrder");
        info.CrmInstallName = this.getXmlNodeValue(xmlswapmp, "CrmInstallName");
        info.CrmBpName = this.getXmlNodeValue(xmlswapmp, "CrmBpName");
        info.CrmWorker1 = this.getXmlNodeValue(xmlswapmp, "CrmWorker1");
        info.MobilePhone = this.getXmlNodeValue(xmlswapmp, "MobilePhone");
		
		return info;
    },
	parseMac : function(strMac) {
		strMac = strMac.toUpperCase();
		var strTempMac = "";
		try {
			if (strMac.indexOf("OK") > 0 && strMac.indexOf("0X00") > 0 && strMac.indexOf("MAC") > 0) {
				var macArray = strMac.split("<BR>");
				if (macArray.length > 0) {
					strTempMac = macArray[3];
					var lastIndex = strTempMac.lastIndexOf("=");
					strTempMac = strTempMac.substring(lastIndex + 1)
				}
			} else {
				return null;
			}
		} catch(e) {
			console.log("parseMac Exception:" + e);
			return null;
		}
		return strTempMac;
	},
	sendTextRequest : function(server,callback) {
        var xmlreq = new XMLHttpRequest;

        xmlreq.open("Get", server, !0),
        xmlreq.onreadystatechange = function() {
            console.log("onResultSoap readyState: " + xmlreq.readyState + " and status:" + xmlreq.status);
		
            if(4 === xmlreq.readyState ){
				callback(xmlreq.responseText);
			}
        },
        xmlreq.send();
       // DumpLog("xmlreq.send() done server:" + this.server)
    },
	makeReturnCmMacParam : function(CrmId, CrmWorkOrder, CmSerialNo) {
        var xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        return xml += '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"\n',
        xml += '  xmlns:xsd="http://www.w3.org/2001/XMLSchema"\n',
        xml += '  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\n',
        xml += "  <soapenv:Body>\n",
        xml += '    <ReturnCmMac xmlns="CrmStbWebService">\n',
        xml += "      <params><![CDATA[",
        xml += "<DataTable>\n",
        xml += "  <CrmId>" + CrmId + "</CrmId>\n",
        xml += "  <CrmWorkOrder>" + CrmWorkOrder + "</CrmWorkOrder>\n",
        xml += "  <CMSerialNo>" + CmSerialNo + "</CMSerialNo>\n",
        xml += "</DataTable>\n",
        xml += "]]></params>\n",
        xml += "    </ReturnCmMac>\n",
        xml += "  </soapenv:Body>\n",
        xml += "</soapenv:Envelope>\n"
    },
	getReturnCmMacResultInfo : function(xml) {
		var info = {
			RetCode:1,
			RetMsg:"",
		}
        var xmlstr, xmlquerycm;
        try {
            xmlstr = this.getXmlNodeValue(xml, "ReturnCmMacResult"),
            xmlquerycm = (new DOMParser).parseFromString(xmlstr.trim(), "text/xml"),
            info.RetCode = this.getXmlNodeValue(xmlquerycm, "RetCode"),
           info. RetMsg = this.getXmlNodeValue(xmlquerycm, "RetMsg")
        } catch(e) {
			console.log(e);
            info.RetCode = "1",
            info.RetMsg = "SOAP :: 作業失敗"
        }
        
		return info;
    },
}
