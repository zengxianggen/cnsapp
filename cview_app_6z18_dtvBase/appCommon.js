
function AppCommon(){
    var self = this;

    //this.path = "file://";
    this.path = DtvCall.file;

    this.needLoadIcon = false;
 
    //应用分类
    this.category = [
        {
            value : 0,
            name : "Portal"
        },
        {
            value : 1,
            name : "Folder"
        },
        {
            value : 2,
            name : "Application"
        },
        {
            value : 3,
            name : "Bound"
        },
        {
            value : 4,
            name : "Global"
        }
    ];

    //所有应用列表
    this.allApplist = [];

    //已安装应用列表
    this.curApplist = [];

    this.curApp = -1;

    this.init = function(){

        self.allApplist = [];
        self.curApplist = [];

        //每次开机时,才走这个分支
        if(sysCom.isPowerBoot)
        {
            sysCom.config.mute = 0;
            sysCom.setMemConfig("nostandby",1);

            sysCom.setVolume();
            sysCom.setMemConfig("apprenew",1);
            AppManager.setAppStoreUrl(sysCom.config.AppStoreURL,false);
            console.log("setAppStoreUrl="+sysCom.config.AppStoreURL);

            //sysCom.config.LayoutVersion = 0;
            if(0)//*/self.getServerLayoutVersion() && self.checkLayoutVersion() == false)
            {
                self.getAllApplist();
                var loop_ret = self.loopAllAppList();
                console.log("loopAllAppList="+loop_ret);
                if(self.layout_version && loop_ret == 0)
                {
                  sysCom.config.LayoutVersion = self.layout_version;
                  console.log("saveConfig LayoutVersion="+sysCom.config.LayoutVersion );
                  sysCom.saveConfig();
                }
            }
            else
            {
               self.getCurAppList();
               sysCom.setMemConfig("current_app_list",self.curApplist);
            }
           // var i_ret = AppManager.getStaus(false);
            //console.log("getStaus="+i_ret);
            console.log("isPowerBoot self.curApplist.length="+self.curApplist.length);
            i_ret = AppManager.forceUpdate(false);
            console.log("forceUpdate="+i_ret);


            Disp.disableBootlogo("",false);
            Disp.setResolution(sysCom.config.Reslution);

        }
        else
        {
            //self.getCurAppList();

            self.curApplist = sysCom.getMemConfig("current_app_list");
            var apprenew = sysCom.getMemConfig("apprenew");

            if(!self.curApplist || self.curApplist.length<=0 || (apprenew && apprenew == 1))
            {
                self.getCurAppList();

                sysCom.setMemConfig("current_app_list",self.curApplist);
            }
            console.log("second Boot self.curApplist.length="+self.curApplist.length);
        }
		
        //进入tvportal页面时,才进行导入图标操作
      /*  if( sysCom.isPowerBoot || sysCom.memConfig.current_app_id == self.getAppByName("tvportal").app_id)
        {
            sysCom.setMemConfig("current_app_id",self.getAppByName("tvportal").app_id);

        }*/
        if( g_url.indexOf("cview_app_6z18_cns_tvportal") >=0) {//tv portal才加载
            self.needLoadIcon = true;
            self.loadTvportalIcon();
        }

    };


    this.forceUpdate= function(){
        self.getAllApplist();
        var loop_ret = self.loopAllAppList();
        console.log("loopAllAppList="+loop_ret);
        if(self.layout_version && loop_ret == 0)
        {
            sysCom.config.LayoutVersion = self.layout_version;
            console.log("saveConfig LayoutVersion="+sysCom.config.LayoutVersion );
            sysCom.saveConfig();
            return 0;
        }
        else
        {
            return -1;
        }
    };

    this.reset = function(){

    };

    /************AppCom 应用模块基础相关接口***********/
    this.installAppById = function(appId){
        return AppManager.installAppById(parseInt(appId),false);
    };
    this.installIconById = function(appId){
       return AppManager.installIconById(parseInt(appId),false);
    };
    this.unstallAppById = function(appId){
        return AppManager.uninstallAppById(parseInt(appId),false);
    };
    this.getAllApplist = function()
    {
        var ret = AppManager.getAllAppList(false);
        if(ret){
            self.layout_version = ret.query_reply.app_configuration.layout_version;
            self.allApplist = ret.query_reply.app_configuration.app_list.app_info;
            console.log("getAllApplist LayoutVersion="+self.layout_version);
            return true;
        }
        else
        {
            return false;
        }
    };

    this.getCurAppList = function(){
        var ret =  utility.getH5Storage("CNS_DVB_APP");
        var apprenew = sysCom.getMemConfig("apprenew");
        console.log("test===========>apprenew="+apprenew);
        if(ret && !(apprenew && apprenew == 1))
        {
            console.log("AppCom getAppList From Storage");
        }
        else
        {
            console.log("AppCom getAppList From Server");
            ret  =  {};
            sysCom.setMemConfig("apprenew",0);
            ret = AppManager.getCurAppList(false);
            if(ret)
            {
                utility.setH5Storage("CNS_DVB_APP",ret);
            }
        }

        if(ret && ret.AppLocalList)
        {
            self.curApplist = ret.AppLocalList;
            self.curApplist.forEach(function(data, index, arr){
                console.log("name:"+arr[index].launch_app_name);
                if(arr[index].link_point){
                    arr[index]["link_point_array"] = handleLinkPoint(arr[index].link_point);
                }
            });
            return true;
        }
        else
        {
            return false;
        }
    };

    this.getAppByName = function(name){
        for(var i=0;i < self.curApplist.length;i++)
        {
            if(self.curApplist[i].launch_app_name == name)
            {
                return self.curApplist[i];
            }
        }
        return null;
    };

    this.getAppInfoById = function(id){
        var idx = parseInt(id);
        for(var i=0;i < self.curApplist.length;i++)
        {
            if(self.curApplist[i].app_id == idx)
            {
                return self.curApplist[i];
            }
        }
        return null;
    };

    this.getLinkPointByAppId = function(id)
    {
        var app = self.getAppInfoById(id);
        if(app)
        {
            return app.link_point;
        }
        return null;
    };

    this.checkCurAppIsLocalApp = function(){
        var testurl = window.location.href;
        if(testurl.indexOf("cview_app_6z18_cns")>0){
            return true;
        }
        else{
            return false;
        }
    };

	this.getAppIdByLinkPointArry = function(lpAry){

		for(var i=0;i < self.curApplist.length;i++)
        {
            if(JSON.stringify(self.curApplist[i].link_point_array) == JSON.stringify(lpAry))
            {
                return self.curApplist[i].app_id;
            }
        }
		return null;
	};

	this.clearVolume=function()
    {
        var n = window.top.document.getElementById("volume");
        if(n) {
            n.parentNode.removeChild(n);
        }
    };




    this.BeforeJumpAppDoThings = function(){
        Subtitle.subtStop(null,false);
        dtvCom.stop();
        self.clearVolume();
        var testurl = window.location.href;
        if(testurl.indexOf("cview_app_6z18_cns_system_setting")>=0)
        {
            console.log("close system memu sysCom.config.gongchengmenu="+sysCom.config.gongchengmenu);
            if(sysCom.config.gongchengmenu  ==  1) {
                sysCom.config.gongchengmenu = 0;
                sysCom.saveConfig();
            }
        }
    };

    this.getUrlByName = function(name){

        for(var i=0;i < self.curApplist.length;i++)
        {
            if(self.curApplist[i].launch_app_name == name)
            {

                    return self.path+self.curApplist[i].main_url;


            }
        }
        return "";
    };
    this.goAppByName = function(name,back){
     
        for(var i=0;i < self.curApplist.length;i++)
        {
            if(self.curApplist[i].launch_app_name == name)
            {
                var testurl = window.location.href;
                var new_url = self.path+self.curApplist[i].main_url;
               // if( sysCom.getMemConfig("current_app_id") != self.curApplist[i].app_id || testurl.indexOf("http")>=0)
                if(testurl !=new_url)
                {

                    if(name == "tvportal" ) {//是 返回tvportal,返回tvportal出口位置
                        if(back == true) {
                            var last_app_id = sysCom.getMemConfig("last_app_id");
                            var current_app_id = sysCom.getMemConfig("current_app_id");
                            //    sysCom.setMemConfig("last_app_id",current_app_id);
                            console.log("goAppByName last_app_id=" + last_app_id);
                            console.log("goAppByName current_app_id=" + current_app_id);
                            console.log("goAppByName tvportal back == true" );

                        }
                        else
                        {
                            sysCom.setMemConfig("returnid",0);
                            var curId = appCom.getAppByName("tvportal").app_id;

                            sysCom.setMemConfig("current_app_id", curId);
                            sysCom.setMemConfig("last_app_id", curId);

                            var last_app_id = sysCom.getMemConfig("last_app_id");
                            var current_app_id = sysCom.getMemConfig("current_app_id");
                            console.log("goAppByName last_app_id=" + last_app_id);
                            console.log("goAppByName current_app_id=" + current_app_id);
                            console.log("goAppByName tvportal back == false returnid="+sysCom.getMemConfig("returnid"));

                        }
                    }

                    else
                    {
                        sysCom.setMemConfig("returnid",0);
                        var last_app_id = sysCom.getMemConfig("current_app_id");
                        sysCom.setMemConfig("last_app_id",last_app_id);
                        sysCom.setMemConfig("current_app_id", self.curApplist[i].app_id);

                    }
                    //sysCom.setMemConfig("current_app_id",self.curApplist[i].app_id);
                    console.log("jump  start"+(new Date()).getTime());
                    self.BeforeJumpAppDoThings();
                    window.location.href = new_url;
                    self.curApp = i;
                }
            }
        }
    };



    this.goAppByID = function(id,cb)//从tvportal到其他应用
    {
        for(var i=0;i < self.curApplist.length;i++)
        {
            if(self.curApplist[i].app_id == id)
            {
                //普通应用
                if(sysCom.getMemConfig("current_app_id") != self.curApplist[i].app_id)
                {


                    var last_app_id = sysCom.getMemConfig("last_app_id");
                    var current_app_id = sysCom.getMemConfig("current_app_id");

                    sysCom.setMemConfig("returnid",self.curApplist[i].app_id);

                    console.log("goAppByID last_app_id="+last_app_id);
                    console.log("goAppByID current_app_id="+current_app_id);

                    console.log("goAppByID url:"+self.path+self.curApplist[i].main_url);
                    self.BeforeJumpAppDoThings();
                    window.location.href = self.path+self.curApplist[i].main_url;
                    self.curApp = i;
                }
            }
        }
    };

    this.goAppByUrl = function(url){

	   if(url.substring(0,13)=="#player/main/"){
			var param =  url.substring(13,url.length);
			var app = this.getAppByName("livetv");
			var newURL = self.path+ app.main_url+"?"+param;
            self.BeforeJumpAppDoThings();
			window.location.href = newURL;
			return;
		}
        for(var i=0;i < self.curApplist.length;i++)
        {
            if(self.curApplist[i].main_url == url)
            {
                var testurl = window.location.href;
                console.log("=====>cur url = "+testurl);


                var new_url = self.path+self.curApplist[i].main_url;
                // if( sysCom.getMemConfig("current_app_id") != self.curApplist[i].app_id || testurl.indexOf("http")>=0)
                if(testurl !=new_url)
                {

                    var last_app_id = sysCom.getMemConfig("current_app_id");
                    sysCom.setMemConfig("last_app_id",last_app_id);
                    sysCom.setMemConfig("current_app_id",self.curApplist[i].app_id);
                    /*if(self.checkEmedy(self.curApplist[i].launch_app_name))
                    {
                        self.BeforeJumpAppDoThings();
                        window.location.href = self.checkEmedy(self.curApplist[i].launch_app_name);
                    }
                    else*/
                    {
                        self.BeforeJumpAppDoThings();
                        window.location.href = self.path+self.curApplist[i].main_url;
                    }

                    
                    self.curApp = i;
                }
            }
        }
    };

    /************AppCom 应用升级检测与安装***********/
    this.getStbLayoutVersion = function()
    {
        return sysCom.config.LayoutVersion;
    };

    this.getServerLayoutVersion = function(){
      if(self.layout_version) {
          console.log("getServerLayoutVersion have exist");
          return self.layout_version;
      }
        var serverVersion = AppManager.getAppLayout(false);
        if(serverVersion && serverVersion.query_reply && serverVersion.query_reply.layout_version)
        {
            self.layout_version = serverVersion.query_reply.layout_version;
            console.log("getServerLayoutVersion have got and return");
            return serverVersion.query_reply.layout_version;
        }
        console.log("getServerLayoutVersion null");
        return null;
    };


    this.checkLayoutVersion = function()
    {
       // return true;
        var stbV = parseInt(self.getStbLayoutVersion(),10);
        var serV = parseInt(self.getServerLayoutVersion(),10);
        
        
            console.log("checkLayoutVersion stbV:"+stbV);
            console.log("checkLayoutVersion serV:"+serV);
        
        if(stbV == serV)
        {
            return true;
        }
        else
        {
            return false;
        }
    };

    //true:版本相同     false:版本不同
    this.checkAppVersion = function(id,serverVersion){
        for(var i = 0; i < self.curApplist.length; i++)
        {
            if(parseInt(self.curApplist[i].app_id,10) == parseInt(id,10))
            {
                if(self.curApplist[i].version == serverVersion)
                {
                    return true;
                }
            }
        }
        return false;
    };

    //true:已安装     false:未安装
    this.checkHasInstallApp = function(id){
        for(var i = 0; i < self.curApplist.length; i++)
        {
            if(parseInt(self.curApplist[i].app_id,10) == parseInt(id,10))
            {
                return true;
            }
        }
        return false;
    };

    this.loopAllAppList = function(){
        var i_ret = 0;
        for(var i = 0; i < self.allApplist.length;i++)
        {
            console.log("name:"+self.allApplist[i].launch_app_name+"  link_ponit:"+self.allApplist[i].link_point+"   category:"+self.allApplist[i].category);

            //检查内嵌
			switch(self.allApplist[i].launch_app_name)
            {
				case "tvportal":
				case "livetv":
				case "epg":
				case "pvrScheduledList":
				case "pvrScheduleByTime":
				case "pvrScheduleByEvent":
				case "pvrRecordedList":
				case "systemsetting":
				case "mailbox":
				case "setting":
                case "pvrf":
                case "personalf":
				    console.log("updateLinkpointByname emmba:"+self.allApplist[i].launch_app_name);
                     var params ={lunch_name:self.allApplist[i].launch_app_name,link_point:self.allApplist[i].link_point};
                    i_ret=AppManager.updateLinkpointByname(params,false);
                    console.log("updateLinkpointByname ret="+i_ret);
                    if(i_ret != 0) {
                        console.log("updateLinkpointByname "+params.toString()+" failed");
                    }
					 continue;
				break;
			}

            //检查应用是否强制安装
            if(self.allApplist[i].force_download && (self.allApplist[i].category == "0" || self.allApplist[i].category == "2" || self.allApplist[i].category == "3"|| self.allApplist[i].category == "4"  ))
            {
                console.log("force_download:"+self.allApplist[i].launch_app_name);
                if(self.checkHasInstallApp(self.allApplist[i].app_id) == false)
                {
                    console.log("force_download  not install :"+self.allApplist[i].launch_app_name);
                    //应用尚未安装，安装应用
                    var t_ret = self.installAppById(self.allApplist[i].app_id);
                    console.log("1 installAppById ret="+t_ret);

                    if(t_ret != 0) {
                        console.log("1 installAppById  "+allApplist[i].app_id+" failed and return");
                        break;
                    }
                }
                else if(self.checkAppVersion(self.allApplist[i].app_id,self.allApplist[i].version) == false)
                {
                    onsole.log("force_download  has install :"+self.allApplist[i].launch_app_name);
                    //应用版本不同，升级应用
                    self.unstallAppById(self.allApplist[i].app_id);
                    var t_ret = self.installAppById(self.allApplist[i].app_id);
                    console.log("2 installAppById ret="+t_ret);
                    if(t_ret != 0) {
                        console.log("2 installAppById  "+allApplist[i].app_id+" failed and return");
                        break;
                    }
                }
            }
            //此分支: 非强制安装应用，但是需要在tvportal上显示图标的应用
            else
            {
                console.log("not force_download:"+self.allApplist[i].launch_app_name);
                if(self.checkHasInstallApp(self.allApplist[i].app_id) == false)
                {
                    //应用尚未安装，安装图片
                    console.log("installIconById="+self.allApplist[i].app_id);

                   var  t_ret = self.installIconById(self.allApplist[i].app_id);
                    console.log("3 installAppById ret="+t_ret);
                    if(t_ret != 0) {
                        console.log("3 installIconById  "+allApplist[i].app_id+" failed and return");
                        break;
                    }
                }
                else if(self.checkAppVersion(self.allApplist[i].app_id,self.allApplist[i].version) == false)
                {
                    //应用版本不同 ，升级应用图标
                      console.log("un and installIconById="+self.allApplist[i].app_id);
                    self.unstallAppById(self.allApplist[i].app_id);
                   var t_ret = self.installIconById(self.allApplist[i].app_id);
                    console.log("4 installIconById ret="+t_ret);
                    if(t_ret != 0) {
                        console.log("4 installIconById  "+allApplist[i].app_id+" failed and return");
                        break;
                    }
                }
            }
        }
        self.getCurAppList();
        return 0;
    };

    /************AppCom tvportal服务接口***********/
    this.getIconUrlById = function(id){

        for(var i = 0; i < self.curApplist.length; i++){

            if(id == self.curApplist[i].app_id){
                return self.path + self.curApplist[i].icon_url;
            }
        }
        return "";
    };

    this.loadTvportalIcon = function(){

        self.loadTotalNum = 0;
        self.loadedNum = 0;

        for(var i = 0; i < self.curApplist.length; i++){
            if(self.curApplist[i].category == "1" || self.curApplist[i].category == "2" )
            {
                self.loadTotalNum++;
                var IconUrl = self.getIconUrlById(self.curApplist[i].app_id);
                self.curApplist[i]["IconSrc"] = new Image();
                self.curApplist[i]["IconSrc"].src = IconUrl;
               // console.log("Iconsrc="+IconUrl);
                self.curApplist[i]["IconSrc"].onload = function(){

                    self.loadedNum ++;
                   // console.log("have loadedNum="+self.loadedNum );
                };
            }
        }

        var timeout = 0;
        self.loadImgeOk = false;
        self.loadTimer = setInterval(function(){
            if(self.loadedNum == self.loadTotalNum) {
                self.loadImgeOk = true;
                clearInterval(self.loadTimer);
            }

            if(timeout > 600) {
                clearInterval(self.loadTimer);
            }

            timeout++;
        },200);
    };
    /*
    *根据link_ponit 获取当前tvportal页的所有应用
    */
    this.getAppListByLinkPonit = function(lp){
        var link_point = lp ? lp : "0";
        var curLevelAppArray = [];
        //判读是否为tvportal
        if(parseInt(link_point,10) == self.category[0].value){

            for(var i = 0; i < self.curApplist.length; i++)
            {
                if(self.curApplist[i].link_point && self.curApplist[i].link_point_array && (self.curApplist[i].category == "1" || self.curApplist[i].category == "2"))
                {

                    if(self.curApplist[i].link_point_array.length == 1)
                    {
                        console.log("come");
                        curLevelAppArray[curLevelAppArray.length] = self.curApplist[i];
                    }
                }
            }

            self.sortAppbyLinkPoint(curLevelAppArray);
            return curLevelAppArray;
        }


        for(var i = 0; i < self.curApplist.length; i++)
        {
            if(self.curApplist[i].link_point &&(self.curApplist[i].category == "1" || self.curApplist[i].category == "2"))
            {
                if(self.checkLinkPointRelationship(self.curApplist[i].link_point, link_point)){
                    curLevelAppArray[curLevelAppArray.length] = self.curApplist[i];
                }
            }
        }
        self.sortAppbyLinkPoint(curLevelAppArray);
        return curLevelAppArray;
    };

    this.checkLinkPointRelationship = function(childLp, parentLp){
        var childLpArray = handleLinkPoint(childLp);
        var parentLpArray = handleLinkPoint(parentLp);
        childLpArray.pop();
        if(childLpArray.join("") == parentLpArray.join(""))
        {
            return true;
        }
        return false;
    };

    this.sortAppbyLinkPoint = function(appList)
    {
        appList.sort(function(a, b)
        {
            var alpIndex = a.link_point_array[a.link_point_array.length-1];
            var blpIndex = b.link_point_array[b.link_point_array.length-1];

            if(alpIndex > blpIndex){
                return 1;
            }
            else {
                return -1;
            }
        });
    };


    
    function handleLinkPoint(linkPoint){
        var lpArray = new Array();
        if(linkPoint){
            lpArray = linkPoint.split(":");
        }

        lpArray.forEach(function(data, index, arr){
            arr[index] = parseInt(data, 10);
        });
        return lpArray;
    }
}

var appCom = new AppCommon();
console.log("appCom init");
if( g_url.indexOf("cview_app_6z18_cns_tvportal") >=0) {
    console.log("appCom init in tvportal");
    appCom.init();
}
else {
    console.log("appCom init timout");
    setTimeout(appCom.init, 500);
}
console.log("appCom init end");
