function SMSClient(server, timeout) {
    this.server = server,
        this.timeout = timeout,
        this.onTimeout = null,
        this.request = null,
        this.onQuerySNoResult = null,
        this.onSwapMobilePhoneResult = null,
        this.onAuthorSTBResult = null,
        this.onQueryCmResult = null,
        this.onReturnCmMacResult = null,
        this.onQueryCmMacResult = null,
        this.cancelTimer = function() {
            this.timer && (clearTimeout(this.timer), this.timer = null)
        },
        this.timer = null,
        this.cancelRequest = function() {
            this.request && (this.request.abort(), this.request = null)
        },
        this.timeoutCallback = function() {
            this.onTimeout && this.onTimeout(),
                this.cancelRequest()
        },
        this.getXmlNodeValue = function(xml, tag) {
            var nodes = xml.getElementsByTagName(tag);
            return nodes.length < 1 ? null: nodes[0].childNodes[0].nodeValue
        },
        this.transfer = function(xmlstr) {
            this.cancelTimer(),
                this.cancelRequest();
            var smsobj = this,
                xmlreq = new XMLHttpRequest;
            this.request = xmlreq,
                this.timer = setTimeout(function() {
                        smsobj.timeoutCallback()
                    },
                    this.timeout),
                xmlreq.open("POST", this.server, !0),
                xmlreq.onreadystatechange = function() {
                    4 === xmlreq.readyState && 200 === xmlreq.status ? (console.log("onResultSoap 4 and 200"), smsobj.onResultSoap(xmlreq.responseXML)) : console.log("onResultSoap readyState: " + xmlreq.readyState + " and status:" + xmlreq.status)
                },
                xmlreq.setRequestHeader("Content-Type", "text/xml; charset=utf-8"),
                xmlreq.send(xmlstr),
                console.log("xmlreq.send() done server:" + this.server)
        },
        this.sendTextRequest = function() {
            this.cancelTimer(),
                this.cancelRequest();
            var smsobj = this,
                xmlreq = new XMLHttpRequest;
            this.request = xmlreq,
                this.timer = setTimeout(function() {
                        smsobj.timeoutCallback()
                    },
                    this.timeout),
                xmlreq.open("Get", this.server, !0),
                xmlreq.onreadystatechange = function() {
                    console.log("onResultSoap readyState: " + xmlreq.readyState + " and status:" + xmlreq.status),
                    4 === xmlreq.readyState && (smsobj.cancelTimer(), smsobj.onResultSoap(xmlreq.responseText))
                },
                xmlreq.send(),
                console.log("xmlreq.send() done server:" + this.server)
        },
        this.makeQuerySNoSoap = function(CrmId, CrmWorkShortSNo) {
            var xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
            return xml += '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"\n',
                xml += '  xmlns:xsd="http://www.w3.org/2001/XMLSchema"\n',
                xml += '  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\n',
                xml += "  <soapenv:Body>\n",
                xml += '    <QuerySNo xmlns="CrmStbWebService">\n',
                xml += "      <params><![CDATA[",
                xml += "<DataTable>",
                xml += "<CrmId>" + CrmId + "</CrmId>",
                xml += "<CrmWorkShortSNo>" + CrmWorkShortSNo + "</CrmWorkShortSNo>",
                xml += "</DataTable>",
                xml += "]]></params>\n",
                xml += "    </QuerySNo>\n",
                xml += "  </soapenv:Body>\n",
                xml += "</soapenv:Envelope>\n"
        },
        this.makeSwapMobilePhoneSoap = function(CrmId, CrmWorkShortSNo, MobilePhone) {
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
        this.makeAuthorSTBSoap = function(CrmId, DeviceSNo3, CrmWorkOrder, CrmWorker1, MobilePhone, IncludeHD, HDSerialNo) {
            var xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
            return xml += '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"\n',
                xml += '  xmlns:xsd="http://www.w3.org/2001/XMLSchema"\n',
                xml += '  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\n',
                xml += "  <soapenv:Body>\n",
                xml += '    <AuthorSTB xmlns="CrmStbWebService">\n',
                xml += "      <params><![CDATA[",
                xml += "<DataTable>\n",
                xml += "  <CrmId>" + CrmId + "</CrmId>\n",
                xml += "  <DeviceSNo3>" + DeviceSNo3 + "</DeviceSNo3>\n",
                xml += "  <CrmWorkOrder>" + CrmWorkOrder + "</CrmWorkOrder>\n",
                xml += "  <CrmWorker1>" + CrmWorker1 + "</CrmWorker1>\n",
                xml += "  <MobilePhone>" + MobilePhone + "</MobilePhone>\n",
                xml += "  <IncludeHD>" + IncludeHD + "</IncludeHD>\n",
                xml += "  <HDSerialNo>" + HDSerialNo + "</HDSerialNo>\n",
                xml += "</DataTable>\n",
                xml += "]]></params>\n",
                xml += "    </AuthorSTB>\n",
                xml += "  </soapenv:Body>\n",
                xml += "</soapenv:Envelope>\n"
        },
        this.makeQueryCmSoap = function(CrmId, CrmWorkOrder) {
            var xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
            return xml += '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"\n',
                xml += '  xmlns:xsd="http://www.w3.org/2001/XMLSchema"\n',
                xml += '  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\n',
                xml += "  <soapenv:Body>\n",
                xml += '    <QueryCmModule xmlns="CrmStbWebService">\n',
                xml += "      <params><![CDATA[",
                xml += "<DataTable>\n",
                xml += "  <CrmId>" + CrmId + "</CrmId>\n",
                xml += "  <CrmWorkOrder>" + CrmWorkOrder + "</CrmWorkOrder>\n",
                xml += "</DataTable>\n",
                xml += "]]></params>\n",
                xml += "    </QueryCmModule>\n",
                xml += "  </soapenv:Body>\n",
                xml += "</soapenv:Envelope>\n"
        },
        this.makeReturnCmMacSoap = function(CrmId, CrmWorkOrder, CmSerialNo) {
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
        this.onResultSoap = null,
        this.onQuerySNoResultSoap = function(xml) {
            this.cancelTimer(),
                this.cancelRequest();
            var RetCode, RetMsg, xmlquerysno, xmlstr = this.getXmlNodeValue(xml, "QuerySNoResult");
            try {
                xmlquerysno = (new DOMParser).parseFromString(xmlstr.trim(), "text/xml")
            } catch(e) {
                console.log(e),
                    RetCode = "1",
                    RetMsg = "FAILED"
            }
            RetCode = this.getXmlNodeValue(xmlquerysno, "RetCode"),
                RetMsg = this.getXmlNodeValue(xmlquerysno, "RetMsg");
            var CrmId = this.getXmlNodeValue(xmlquerysno, "CrmId"),
                CrmWorkOrder = this.getXmlNodeValue(xmlquerysno, "CrmWorkOrder"),
                CrmInstallName = this.getXmlNodeValue(xmlquerysno, "CrmInstallName"),
                CrmBpName = this.getXmlNodeValue(xmlquerysno, "CrmBpName"),
                CrmWorker1 = this.getXmlNodeValue(xmlquerysno, "CrmWorker1"),
                MobilePhone = this.getXmlNodeValue(xmlquerysno, "MobilePhone");
            this.onQuerySNoResult && this.onQuerySNoResult(RetCode, RetMsg, CrmId, CrmWorkOrder, CrmInstallName, CrmBpName, CrmWorker1, MobilePhone)
        },
        this.onSwapMobilePhoneResultSoap = function(xml) {
            this.cancelTimer(),
                this.cancelRequest();
            var xmlstr = this.getXmlNodeValue(xml, "SwapMobilePhoneResult"),
                xmlswapmp = (new DOMParser).parseFromString(xmlstr.trim(), "text/xml"),
                RetCode = this.getXmlNodeValue(xmlswapmp, "RetCode"),
                RetMsg = this.getXmlNodeValue(xmlswapmp, "RetMsg"),
                CrmId = this.getXmlNodeValue(xmlswapmp, "CrmId"),
                CrmWorkOrder = this.getXmlNodeValue(xmlswapmp, "CrmWorkOrder"),
                CrmInstallName = this.getXmlNodeValue(xmlswapmp, "CrmInstallName"),
                CrmBpName = this.getXmlNodeValue(xmlswapmp, "CrmBpName"),
                CrmWorker1 = this.getXmlNodeValue(xmlswapmp, "CrmWorker1"),
                MobilePhone = this.getXmlNodeValue(xmlswapmp, "MobilePhone");
            this.onSwapMobilePhoneResult && this.onSwapMobilePhoneResult(RetCode, RetMsg, CrmId, CrmWorkOrder, CrmInstallName, CrmBpName, CrmWorker1, MobilePhone)
        },
        this.onAuthorSTBResultSoap = function(xml) {
            this.cancelTimer(),
                this.cancelRequest();
            var xmlstr = this.getXmlNodeValue(xml, "AuthorSTBResult"),
                xmlauthorstb = (new DOMParser).parseFromString(xmlstr.trim(), "text/xml"),
                RetCode = this.getXmlNodeValue(xmlauthorstb, "RetCode"),
                RetMsg = this.getXmlNodeValue(xmlauthorstb, "RetMsg");
            this.onAuthorSTBResult && this.onAuthorSTBResult(RetCode, RetMsg)
        },
        this.onQueryCmResultSoap = function(xml) {
            this.cancelTimer(),
                this.cancelRequest();
            var RetCode, RetMsg, Flag, xmlstr, xmlquerycm;
            try {
                xmlstr = this.getXmlNodeValue(xml, "QueryCmModuleResult"),
                    xmlquerycm = (new DOMParser).parseFromString(xmlstr.trim(), "text/xml"),
                    Flag = this.getXmlNodeValue(xmlquerycm, "Flag"),
                    RetCode = this.getXmlNodeValue(xmlquerycm, "RetCode"),
                    RetMsg = this.getXmlNodeValue(xmlquerycm, "RetMsg")
            } catch(e) {
                console.log(e),
                    RetCode = "1",
                    RetMsg = "SOAP :: 作業失敗",
                    Flag = "0"
            }
            console.log("RESULT: " + Flag + RetCode + RetMsg),
            this.onQueryCmResult && this.onQueryCmResult(Flag, RetCode, RetMsg)
        },
        this.onReturnCmMacResultSoap = function(xml) {
            this.cancelTimer(),
                this.cancelRequest();
            var RetCode, RetMsg, xmlstr, xmlquerycm;
            try {
                xmlstr = this.getXmlNodeValue(xml, "ReturnCmMacResult"),
                    xmlquerycm = (new DOMParser).parseFromString(xmlstr.trim(), "text/xml"),
                    RetCode = this.getXmlNodeValue(xmlquerycm, "RetCode"),
                    RetMsg = this.getXmlNodeValue(xmlquerycm, "RetMsg")
            } catch(e) {
                console.log(e),
                    RetCode = "1",
                    RetMsg = "SOAP :: 作業失敗"
            }
            console.log("RESULT: " + RetCode + RetMsg),
            this.onReturnCmMacResult && this.onReturnCmMacResult(RetCode, RetMsg)
        },
        this.onQueryCmMacResponse = function(strResp) {
            this.cancelTimer(),
                this.cancelRequest(),
            this.onQueryCmMacResult && this.onQueryCmMacResult(strResp)
        },
        this.querySNo = function(onQuerySNoResult, onTimeout, CrmId, CrmWorkShortSNo) {
            this.onTimeout = onTimeout,
                this.onQuerySNoResult = onQuerySNoResult,
                this.onResultSoap = this.onQuerySNoResultSoap;
            var xml = this.makeQuerySNoSoap(CrmId, CrmWorkShortSNo);
            this.transfer(xml)
        },
        this.swapMobilePhone = function(onSwapMobilePhoneResult, onTimeout, CrmId, CrmWorkShortSNo, MobilePhone) {
            this.onTimeout = onTimeout,
                this.onSwapMobilePhoneResult = onSwapMobilePhoneResult,
                this.onResultSoap = this.onSwapMobilePhoneResultSoap;
            var xml = this.makeSwapMobilePhoneSoap(CrmId, CrmWorkShortSNo, MobilePhone);
            this.transfer(xml)
        },
        this.authorSTB = function(onAuthorSTBResult, onTimeout, CrmId, DeviceSNo3, CrmWorkOrder, CrmWorker1, MobilePhone, IncludeHD, HDSerialNo) {
            this.onTimeout = onTimeout,
                this.onAuthorSTBResult = onAuthorSTBResult,
                this.onResultSoap = this.onAuthorSTBResultSoap;
            var xml = this.makeAuthorSTBSoap(CrmId, DeviceSNo3, CrmWorkOrder, CrmWorker1, MobilePhone, IncludeHD, HDSerialNo);
            this.transfer(xml)
        },
        this.queryCm = function(onQueryCmResult, onTimeout, CrmId, CrmWorkOrder) {
            this.onTimeout = onTimeout,
                this.onQueryCmResult = onQueryCmResult,
                this.onResultSoap = this.onQueryCmResultSoap;
            var xml = this.makeQueryCmSoap(CrmId, CrmWorkOrder);
            this.transfer(xml)
        },
        this.returnCmMac = function(onReturnCmMacResult, onTimeout, CrmId, CrmWorkOrder, CmSerialNo) {
            this.onTimeout = onTimeout,
                this.onReturnCmMacResult = onReturnCmMacResult,
                this.onResultSoap = this.onReturnCmMacResultSoap;
            var xml = this.makeReturnCmMacSoap(CrmId, CrmWorkOrder, CmSerialNo);
            this.transfer(xml)
        },
        this.queryCmMac = function(onQueryCmMacResult, onTimeout) {
            this.onTimeout = onTimeout,
                this.onQueryCmMacResult = onQueryCmMacResult,
                this.onResultSoap = this.onQueryCmMacResponse,
                this.sendTextRequest()
        }
}