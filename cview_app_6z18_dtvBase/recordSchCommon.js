function RecordSchCommon(){
    var self = this;

    self.ERROR_TIME = 10;

    self.loopTimer = null;

    this.tunerRes = [
        {
            id : 1,
            status : 0
        },
        {
            id : 2,
            status : 0
        }
    ];

    this.recordType = {
        "SINGLE" : 1,
        "SERIAL" : 2,
        "ONETIME" : 3,
        "DAYTIME" : 4,
        "WEEKTIME" : 5
    };

    this.eventList = {};

    this.taskList = {};

    this.init = function(){
        self.eventList = {
            "array" : []
        };

        self.taskList = {
            "array" : []
        };

        self.loopTimer = null;

        self.eventList = utility.getH5Storage("CNS_DVB_RECORDING_EVENTLIST");
        self.taskList = utility.getH5Storage("CNS_DVB_RECORDING_TASKLIST");

        if(sysCom.isPowerBoot == false)
        {
            console.log("app jump mode");
        }
        else
        {
            console.log("power on mode");
            self.getListFromFlash();
            //清理上次关机时正在录制的事件 clear events which
            self.clearEvent();
        }
        self.openTimer();
    };

    this.start = function(){

    };

    this.reset = function(){
        //关闭所有录制任务
        for(var i = 0; i < self.eventList.array.length; i++){
            var ce = self.eventList.array[i];
            if(ce.status){
                self.stopRecord(ce);
            }
        }
        //清空列表
        self.eventList = {
            "array" : []
        };

        self.taskList = {
            "array" : []
        };
        self.saveListToFlash();
        self.getListFromFlash();
        console.log("self.taskList.array.length:"+self.taskList.array.length);
    };

    this.openTimer = function(){
        self.loopTimer = setInterval(function(){

            for(var i = 0; i < self.eventList.array.length; i++){
                var e = self.eventList.array[i];
                self.loopEvent(e);
            }

            for(var i = 0; i < self.taskList.array.length; i++){
                var t = self.taskList.array[i];
                self.loopTask(t);
            }

        }, 1000 * 10);
    };

    this.loopEvent = function(e){

        //检查录制时间  1:未到录制时间   2:可以开始录制   3:可以结束   4:已过期  5:录制中
        var temp = self.checkTimeSolt(e.startTime,e.duration);
        if(temp == 1){
            e.status = 0;
        }
        else if(temp == 2){
            //开始录制
            if(e.status != 1){
                self.printE(e,"Event Start Recording:");
                if(self.startRecord(e)){
                    self.printE(e,"startRecord Failed ,Event delete");
                    self.deleteEvent(e);
                }
            }
        }
        else if(temp == 3){
            //结束录制
            if(e.status == 1){
                self.printE(e,"Event Stop Recording:");
                self.stopRecord(e);
            }
            //删除录制事件(从order中删除，添加到cancellist中,其实不应该添加到cancel中，但时间都已到期)
            self.deleteEvent(e);

        }
        else if(temp == 4){
            self.printE(e,"Event Expired");
            //改变录制状态，防止删除事件时，关闭其他正在录制的事件
            e.status = 0;
            //删除录制事件
            self.deleteEvent(e);

        }
        else if(temp == 5){
            if(!e.status){
                //删除录制事件
                self.printE(e,"Event delete");
                self.deleteEvent(e);
            }
        }
    };

    this.loopTask = function(task){
        if(task.type == self.recordType.SERIAL){
            //获取EPG
            var epgData = epgCom.getEpgBySerialKey(dtvCom.getChById(task.ch.idn),task.constraint.startTime,task.constraint.series_key);
            for(var i = 0; i < epgData.length;i++){
                //得到录制时间以及时长
                var startTime = epgData[i].startTime;
                var duration = epgData[i].duration;

                //检查时间是否到期
                var ret = self.checkTimeSolt(startTime,duration);
                if(ret > 2){
                    continue;
                }

                //查看cancellist中是否已添加
                var hasAdd = false;
                for(var j = 0; j < task.cancelList.length;j++)
                {
                    if(task.cancelList[j].startTime == startTime)
                    {
                        hasAdd = true;
                        break;
                    }
                }
                if(hasAdd){
                    continue;
                }


                //查看orderlist中是否已添加
                hasAdd = false;
                for(var j = 0; j < task.orderList.length;j++){
                    if(task.orderList[j].startTime == startTime)
                    {
                        hasAdd = true;
                        break;
                    }
                }
                if(hasAdd){
                    continue;
                }

                //生成event
                var e = self.getEventByTask(task);
                e.startTime = startTime;
                e.duration = duration;
                e.epg.series_key = task.constraint.series_key;
                e.epg.episode_key = epgData[i].seriesLinking.episode_key;
                e.epg.episode_status = epgData[i].seriesLinking.episode_status;
                e.epg.episode_last = epgData[i].seriesLinking.episode_last;
                e.epg.eventId = epgData[i].eventId;
                e.epg.name = epgData[i].name;
                e.epg.level = epgData[i].parentRating.rating;

                //添加事件到录制列表上
                if(self.addEvent(e) != 0)
                {
                    console.log("add Event Failed!");
                    continue;
                }

                //添加到orderList
                task.orderList.push(e);

                //存储到flash
                self.saveListToFlash();
            }
        }
        else if(task.type == self.recordType.DAYTIME){

            //得到录制时间以及时长
            var mydate = new Date();
            mydate.setHours(task.constraint.hour);
            mydate.setMinutes(task.constraint.mintue);
            mydate.setSeconds(0);
            var startTime = getTimeStrfromDate(mydate);
            //检查时间是否到期
            var ret = self.checkTimeSolt(startTime,task.constraint.duration);
            if(ret > 2){
                return;
            }

            //查看cancellist中是否已添加
            var hasAdd = false;
            for(var j = 0; j < task.cancelList.length;j++)
            {
                if(task.cancelList[j].startTime == startTime)
                {
                    hasAdd = true;
                    break;
                }
            }
            if(hasAdd){
                return;
            }

            //查看orderlist中是否已添加
            hasAdd = false;
            for(var j = 0; j < task.orderList.length;j++){
                if(task.orderList[j].startTime == startTime)
                {
                    hasAdd = true;
                    break;
                }
            }
            if(hasAdd){
                return;
            }

            //生成event
            var e = self.getEventByTask(task);
            e.startTime = startTime;
            e.duration = task.constraint.duration;

            //添加事件到录制列表上
            var ret = self.addEvent(e);
            if(ret != 0)
            {
                return;
            }

            //添加到orderList
            task.orderList.push(e);

            //存储到flash
            self.saveListToFlash();
        }
        else if(task.type == self.recordType.WEEKTIME){
            //得到录制时间以及时长
            var mydate = new Date();
            mydate.setHours(task.constraint.hour);
            mydate.setMinutes(task.constraint.mintue);
            mydate.setSeconds(0);
            var startTime = getTimeStrfromDate(mydate);
            //检查时间是否到期
            var ret = self.checkTimeSolt(startTime,task.constraint.duration);
            if(ret > 2){
                return;
            }

            //检查今日录制是否需要添加
            var flag = false;
            for(var j = 0;j < task.constraint.week.length;j++){
                if(mydate.getDay() == task.constraint.week[j])
                {
                    flag = true;
                    break;
                }
            }
            if(flag == false)
            {
                return;
            }

            //查看cancellist中是否已添加
            flag = false;
            for(var j = 0; j < task.cancelList.length;j++)
            {
                if(task.cancelList[j].startTime == startTime)
                {
                    flag = true;
                    break;
                }
            }
            if(flag){
                return;
            }

            //查看orderlist中是否已添加
            flag = false;
            for(var j = 0; j < task.orderList.length;j++){
                if(task.orderList[j].startTime == startTime){
                    flag = true;
                    break;
                }
            }
            if(flag){
                return;
            }

            //生成event
            var e = self.getEventByTask(task);
            e.startTime = startTime;
            e.duration = task.constraint.duration;


            //添加事件到录制列表上
            if(self.addEvent(e) != 0)
            {
                console.log("add WEEKTIME Event Failed");
                return;
            }

            //添加到orderList
            task.orderList.push(e);

            //存储到flash
            self.saveListToFlash();
        }
    };

    this.addEvent = function(e){
        //检查时间是否已过期   1:未到录制时间   2:可以开始录制   3:可以结束   4:已过期  5:录制中
        if(self.checkTimeSolt(e.startTime,e.duration) == 4)
        {
            return 1;
        }

        //检查事件冲突
        var list = self.checkEventConflict(e);
        console.log("addEvent list:"+JSON.stringify(list));
        if(e.resId < 0){
            return 2;
        }
        console.log("getTunerIndexByResId:"+e.resId);
        var index = self.getTunerIndexByResId(e.resId);
        if( index < 0 ){
            return 3;
        }

        if(list[index].length != 0){
            return 4;
        }

        //添加到列表中"startTime":"2018/04/02 15:00:00"
        self.eventList.array.push(e);

        //对事件列表排序
        self.sortList(self.eventList.array);

        //存储到flash
        self.saveListToFlash();

        return 0;
    };

    this.checkEventConflict = function(ie){
        var conflictList = [];

        //循环检查每一路上的冲突
        for(var i = 0; i < self.tunerRes.length; i++){

            conflictList[i] = new Array();
            //查看是否已分配录制资源,如果已分配资源，则只查看此路资源上的冲突
            if(ie.resId >= 0){
                if(self.tunerRes[i].id != ie.resId){
                    continue;
                }
            }

            //检查事件列表上已添加事件的冲突
            for(var j = 0; j < self.eventList.array.length;j++)
            {

                if(self.eventList.array[j].resId != self.tunerRes[i].id){
                    continue;
                }

                var ce = self.eventList.array[j];

                //检查时间段是否重叠
                if(self.checkTimeOverlap(ce.startTime,ce.duration,ie.startTime,ie.duration) == 0)
                {
                    console.log("EventConflict True");
                    conflictList[i].push(ce);
                }
            }

            //检查任务列表上 尚未添加的事件 冲突
            for(var j = 0; (j < self.taskList.array.length) && (self.taskList.array[j].resId == self.tunerRes[i].id);j++){
                var task = self.taskList.array[j];
                if(task.type == self.recordType.DAYTIME){
                    //查看是不是该任务的子事件
                    if(ie.taskHangle == task.taskHangle){
                        continue;
                    }

                    //仅检查 时间段(不包含日期) 是否重叠 (是:下一步    否:continue)
                    if(self.checkTimeOverlapIgnoreDate(task.constraint.startTime,task.constraint.duration,ie.startTime,ie.duration) != 0){
                        continue;
                    }

                    //得到 冲突的 任务事件的 时间(ie的日期 +  task的时间)
                    var  taskStartTime = ie.startTime.split(" ")[0] + " " +task.constraint.startTime.split(" ")[1];

                    //查看任务的取消列表中，是否含有此事件(是:continue    否:下一步)
                    var cancelFlag = false;
                    for(var k = 0; k < task.cancelList.length; k++){
                        if(task.cancelList[k].startTime == taskStartTime){
                            cancelFlag = true;
                            break;
                        }
                    }
                    if(cancelFlag){
                        continue;
                    }

                    //查看conflictList[i]是否已经添加该事件(是:continue  否:下一步)
                    var addFlag = false;
                    for(var k = 0; k < conflictList[i].length; k++){
                        if(conflictList[i][k].taskHangle == task.taskHangle && conflictList[i][k].startTime == taskStartTime){
                            addFlag = true;
                            break;
                        }
                    }
                    if(addFlag){
                        continue;
                    }

                    //生成event
                    var ce = self.getEventByTask(task);
                    ce.startTime = taskStartTime;

                    //添加到冲突列表
                    conflictList[i].push(ce);
                }
                else if(task.type == self.recordType.WEEKTIME){

                    //查看是不是该任务的子事件
                    if(ie.taskHangle == task.taskHangle){
                        continue;
                    }

                    //检查ie录制的星期，是否在task的星期中     (是:下一步    否:continue)
                    var  dayDulicaFlag = false;
                    for(var k = 0; k < task.constraint.week.length; k++)
                    {
                        if(task.constraint.week[k] == getEpgStartDate(ie.startTime).getDay())
                        {
                            dayDulicaFlag = true;
                            break;
                        }
                    }
                    if(!dayDulicaFlag){
                        continue;
                    }

                    //仅检查 时间段(不包含日期) 是否重叠 (是:下一步    否:continue)
                    if(self.checkTimeOverlapIgnoreDate(task.constraint.startTime,task.constraint.duration,ie.startTime,ie.duration) != 0){
                        continue;
                    }

                    //得到 冲突的 任务事件的 时间(ie的日期 +  task的时间)
                    var  taskStartTime = ie.startTime.split(" ")[0] +" "+ task.constraint.startTime.split(" ")[1];

                    //查看任务的取消列表中，是否含有此事件(是:continue    否:下一步)
                    var cancelFlag = false;
                    for(var k = 0; k < task.cancelList.length; k++){
                        if(task.cancelList[k] == taskStartTime){
                            cancelFlag = true;
                            break;
                        }
                    }
                    if(cancelFlag){
                        continue;
                    }

                    //查看conflictList[i]是否已经添加该事件(是:continue  否:continue)
                    var addFlag = false;
                    for(var k = 0; k < conflictList[i].length; k++){
                        if(conflictList[i][k].taskHangle == task.taskHangle && conflictList[i][k].startTime == taskStartTime){
                            addFlag = true;
                            break;
                        }
                    }
                    if(addFlag){
                        continue;
                    }

                    //生成event
                    var ce = self.getEventByTask(task);
                    ce.startTime = taskStartTime;

                    //添加到冲突列表
                    conflictList[i].push(ce);
                }
            }
        }
        return 	conflictList;
    };

    this.addTask = function(iTask){

        //检查冲突
        var list = self.checkTaskConflict(iTask);
        if(iTask.resId < 0){
            return 2;
        }
        console.log("getTunerIndexByResId:"+iTask.resId);
        var index = self.getTunerIndexByResId(iTask.resId);
        if( index < 0 ){
            return 3;
        }

        if(list[index].length != 0){
            return 4;
        }
        //添加到列表中
        self.taskList.array.push(iTask);

        //如果是系列录制添加录制子事件到列表中
        if(iTask.type == self.recordType.SERIAL){
            for(var i = 0; i < iTask.orderList.length; i++){
                //添加到列表中
                self.eventList.array.push(iTask.orderList[i]);
            }
            //对事件列表排序
            self.sortList(self.eventList.array);
        }

        //对事件列表排序
        self.sortList(self.taskList.array);

        //存储到flash
        self.saveListToFlash();

        return 0;
    };

    this.checkTaskConflict = function(iTask){
        var conflictList = [];
        //循环检查每一路上的冲突
        for(var i = 0; i < self.tunerRes.length; i++){
            conflictList[i] = new Array();
            //循环事件列表冲突
            for(var j = 0; (j < self.eventList.array.length) && (self.eventList.array[j].resId == self.tunerRes[i].id);j++){
                var ce = self.eventList.array[j];
                //如果是任务类型则忽略
                if(ce.type == self.recordType.SERIAL || ce.type == self.recordType.DAYTIME || ce.type == self.recordType.WEEKTIME){
                    continue;
                }
                //系列录制
                if(iTask.type == self.recordType.SERIAL){
                    //循环检查系列录制中的所有事件
                    for(var k = 0; k < iTask.orderList.length;k++){
                        var se = iTask.orderList[k];
                        //检查时间段是否重叠
                        if(self.checkTimeOverlap(ce.startTime,ce.duration,se.startTime,se.duration) == 0){
                            conflictList[i].push(ce);
                        }
                    }
                }
                //每天录制
                else  if(iTask.type == self.recordType.DAYTIME){
                    if(self.checkTimeOverlapIgnoreDate(iTask.constraint.startTime,iTask.constraint.duration,ce.startTime,ce.duration) != 0){
                        continue;
                    }
                    conflictList[i].push(ce);
                }
                //每周录制
                else  if(iTask.type == self.recordType.WEEKTIME){
                    if(self.checkTimeOverlapIgnoreDate(iTask.constraint.startTime,iTask.constraint.duration,ce.startTime,ce.duration) != 0){
                        continue;
                    }

                    var  dayDulicaFlag = false;

                    for(var k = 0; k < task.constraint.week.length; k++)
                    {
                        if(task.constraint.week[k] == getEpgStartDate(ce.startTime).getDay())
                        {
                            dayDulicaFlag = true;
                            break;
                        }
                    }
                    if(!dayDulicaFlag){
                        continue;
                    }

                    conflictList[i].push(ce);
                }
            }

            //循环检查任务列表冲突
            for(var j = 0; (j < self.taskList.array.length) && (self.taskList.array[j].resId == self.tunerRes[i].id);j++){
                var ct = self.taskList.array[j];
                if(iTask.type == self.recordType.SERIAL)
                {
                    //系列录制 系列录制
                    if(ct.type == self.recordType.SERIAL)
                    {
                        for(var n = 0; n < iTask.orderList.length;n++){
                            var temp1 = iTask.orderList[n];
                            for(var m = 0; m < ct.orderList.length;m++){
                                var temp2 = ct.orderList[m];
                                if(self.checkTimeOverlap(temp1.startTime,temp1.duration,temp2.startTime,temp2.duration) != 0){
                                    continue;
                                }

                                conflictList[i].push(ct);
                                m = ct.orderList.length;
                                n = iTask.orderList.length;
                            }
                        }
                    }
                    //系列录制 每周录制
                    else if(ct.type == self.recordType.WEEKTIME){
                        for(var n = 0; n < iTask.orderList.length;n++){
                            var temp1 = iTask.orderList[n];
                            if(self.checkTimeOverlapIgnoreDate(temp1.startTime,temp1.duration,ct.constraint.startTime,ct.constraint.duration) != 0){
                                continue;
                            }

                            var  dayDulicaFlag = false;
                            for(var k = 0; k < ct.constraint.week.length; k++){
                                if(ct.constraint.week[k] == getEpgStartDate(temp1.startTime).getDay()){
                                    dayDulicaFlag = true;
                                    break;
                                }
                            }
                            if(!dayDulicaFlag){
                                continue;
                            }

                            conflictList[i].push(ct);

                            n = iTask.orderList.length;
                        }
                    }
                    //系列录制 每天录制
                    else if(ct.type == self.recordType.DAYTIME){
                        for(var n = 0; n < iTask.orderList.length;n++){
                            var temp1 = iTask.orderList[n];
                            if(self.checkTimeOverlapIgnoreDate(temp1.startTime,temp1.duration,ct.constraint.startTime,ct.constraint.duration) != 0){
                                continue;
                            }

                            conflictList[i].push(ct);

                            n = iTask.orderList.length;
                        }
                    }
                }
                else if(iTask.type == self.recordType.WEEKTIME){
                    //每周录制 系列录制
                    if(ct.type == self.recordType.SERIAL){
                        for(var n = 0; n < ct.orderList.length;n++){
                            var temp1 = ct.orderList[n];
                            if(self.checkTimeOverlapIgnoreDate(temp1.startTime,temp1.duration,iTask.constraint.startTime,iTask.constraint.duration) != 0){
                                continue;
                            }
                            var  dayDulicaFlag = false;
                            for(var k = 0; k < iTask.constraint.week.length; k++){
                                if(ct.constraint.week[k] == getEpgStartDate(temp1.startTime).getDay()){
                                    dayDulicaFlag = true;
                                    break;
                                }
                            }
                            if(!dayDulicaFlag){
                                continue;
                            }

                            conflictList[i].push(ct);

                            n = ct.orderList.length;
                        }
                    }
                    //每周录制 每周录制
                    else if(ct.type == self.recordType.WEEKTIME){
                        if(self.checkTimeOverlapIgnoreDate(ct.constraint.startTime,ct.constraint.duration,iTask.constraint.startTime,iTask.constraint.duration) != 0){
                            continue;
                        }

                        var  dayDulicaFlag = false;
                        for(var n = 0; n < iTask.constraint.week.length; n++){
                            for(var m = 0; m < ct.constraint.week.length; m++){
                                if(iTask.constraint.week[n] == ct.constraint.week[m]){
                                    dayDulicaFlag = true;
                                    m = ct.constraint.week.length;
                                    n = iTask.constraint.week.length;
                                }
                            }
                        }
                        if(!dayDulicaFlag){
                            continue;
                        }

                        conflictList[i].push(ct);
                    }
                    //每周录制 每天录制
                    else if(ct.type == self.recordType.DAYTIME){
                        if(self.checkTimeOverlapIgnoreDate(ct.constraint.startTime,ct.constraint.duration,iTask.constraint.startTime,iTask.constraint.duration) != 0){
                            continue;
                        }
                        conflictList[i].push(ct);
                    }
                }
                else if(iTask.type == self.recordType.DAYTIME){
                    //每天录制 系列录制
                    if(ct.type == self.recordType.SERIAL)
                    {
                        for(var n = 0; n < ct.orderList.length;n++){
                            var temp1 = ct.orderList[n];
                            if(self.checkTimeOverlapIgnoreDate(temp1.startTime,temp1.duration,iTask.constraint.startTime,iTask.constraint.duration) != 0){
                                continue;
                            }

                            conflictList[i].push(ct);

                            n = ct.orderList.length;
                        }
                    }
                    //每天录制 每周录制
                    else if(ct.type == self.recordType.WEEKTIME){
                        if(self.checkTimeOverlapIgnoreDate(ct.constraint.startTime,ct.constraint.duration,iTask.constraint.startTime,iTask.constraint.duration) != 0){
                            continue;
                        }
                        conflictList[i].push(ct);
                    }
                    //每天录制 每天录制
                    else if(ct.type == self.recordType.DAYTIME){
                        if(self.checkTimeOverlapIgnoreDate(ct.constraint.startTime,ct.constraint.duration,iTask.constraint.startTime,iTask.constraint.duration) != 0){
                            continue;
                        }
                        conflictList[i].push(ct);
                    }
                }
            }
        }
        return conflictList;
    };

    this.getOptimalConflictBylist = function(conflictList){
        var ret =[];
        for(var i = 0; i < conflictList.length; i++){
            ret[i] = {
                "resId":self.tunerRes[i].id,
                "weight":0,
                "optimalList":[]
            };

            //如果某一路上，没有冲突事件，直接返回
            if(conflictList[i].length == 0){
                continue;
                //return ret;
            }

            //计算出每一路上冲突的权重
            for(var j = 0; j < conflictList[i].length; j++){
                switch(conflictList[i][j].type)
                {
                    case self.recordType.SINGLE:
                        ret[i].weight += 5;
                        break;
                    case self.recordType.SERIAL:
                        if(self.eventHangle){
                            ret[i].weight += 1;
                        }
                        else{
                            ret[i].weight += 3;
                        }
                        break;
                    case self.recordType.ONETIME:
                        ret[i].weight += 5;
                        break;
                    case self.recordType.DAYTIME:
                        if(self.eventHangle){
                            ret[i].weight += 1;
                        }
                        else{
                            ret[i].weight += 3;
                        }
                        break;
                    case self.recordType.WEEKTIME:
                        if(self.eventHangle){
                            ret[i].weight += 1;
                        }
                        else{
                            ret[i].weight += 3;
                        }
                        break;
                }
            }

            //添加列表
            ret[i].optimalList = conflictList[i];
        }

        //找出权重最小的一路
        var minIndex = 0;
        for(var i = 0; i < ret.length; i++){
            if(ret[minIndex].weight > ret[i].weight){
                minIndex = i;
            }
        }

        return ret[minIndex];
    };

    this.deleteEvent = function(ie){

        //1.在事件列表上删除
        for(var i = 0; i < self.tunerRes.length; i++){

            for(var j = 0; j < self.eventList.array.length;j++){

                if(self.eventList.array[j].resId != self.tunerRes[i].id){
                    continue;
                }
                var ce = self.eventList.array[j];

                if(ie.eventHangle == ce.eventHangle){

                    //判断此事件是否已开始录制,如果已经开始录制，则停止录制
                    if(ce.status){
                        self.stopRecord(ce);
                    }
                    //在列表上删除此事件
                    self.eventList.array.splice(j,1);
                    //保存列表
                    self.saveListToFlash();

                    //跳出循环
                    j = self.eventList.array.length;
                    i = self.tunerRes.length;
                    break;
                }
            }
        }

        //2.在任务列表上删除
        for(var i = 0; i < self.tunerRes.length; i++){
            for(var j = 0; j < self.taskList.array.length;j++){
                if(self.taskList.array[j].resId != self.tunerRes[i].id){
                    continue;
                }
                var ct = self.taskList.array[j];
                //判断是哪一个任务
                if(ie.taskHangle != ct.taskHangle){
                    continue;
                }

                //在预约列表orderList上删除该事件
                for(var k = 0; k < ct.orderList.length;k++){
                    var ce = ct.orderList[k];
                    if(ie.eventHangle == ce.eventHangle){
                        if(ce.status){
                            //停止录制
                        }
                        //在预约列表orderList上删除该事件
                        ct.orderList.splice(k,1);
                        //保存列表
                        self.saveListToFlash();
                        break;
                    }
                }

                //在取消列表cancelList上添加该事件
                var hasAdd = false;
                for(var k = 0; k < ct.cancelList.length;i++){
                    var ce = ct.cancelList[k];
                    if(ie.eventHangle == ce.eventHangle){
                        hasAdd = true;
                        break;
                    }
                }
                if(!hasAdd){
                    ct.cancelList.push(ce);
                }
            }
        }
    };

    this.deleteEventByTaskHangle = function(taskHangle){
        for(var i = 0; i < self.eventList.array.length;i++){
            var e = self.eventList.array[i];
            if(e.taskHangle == taskHangle){
                //判断此事件是否已开始录制,如果已经开始录制，则停止录制
                if(e.status){
                    self.stopRecord(e);
                }
                //在列表上删除此事件
                self.eventList.array.splice(i,1);
                i--;
            }
        }
        //保存列表
        self.saveListToFlash();
    };

    this.deleteTask = function(itask){
        for(var i = 0; i < self.tunerRes.length; i++){
            for(var j = 0; (j < self.taskList.array.length) && (self.taskList.array[j].resId == self.tunerRes[i].id);j++){
                var ct = self.taskList.array[i];
                //判断任务
                if(ct.taskHangle != itask.taskHangle){
                    continue;
                }

                //删除预约列表上的所有预约事件
                self.deleteEventByTaskHangle(ct.taskHangle);

                //从任务列表上删除该任务
                self.taskList.array.splice(j,1);

                //保存列表
                self.saveListToFlash();

                //跳出循环
                j = self.taskList.array.length;
                i = self.tunerRes.length;
            }
        }
    };

    this.deleteConflictList = function(conflictList){
        for(var i = 0; i < conflictList.length;i++){
            var et = conflictList[i];
            if(et.eventHangle){
                self.deleteEvent(et);
                continue;
            }

            if(et.taskHangle){
                self.deleteTask(et);
            }
        }
    };

    /**
     * 此函数用于重新开机时,一些关机前正在录制的事件应该清理掉
     */
    this.clearEvent = function(){

        for(var i = 0; i < self.eventList.array.length;i++)
        {
            var ie = self.eventList.array[i];

            if(ie.status)
            {
                i--;
                self.deleteEvent(ie);
            }
        }
    };

    this.getEventTemplate = function(type){
        var e = {};
        if(type == self.recordType.SINGLE){
            e = {
                type : self.recordType.SINGLE,
                epg : {
                    //保存eventID,是为了在EPG界面上显示预约录制图标时,方便在列表中查找
                    eventId : "",
                    name : "",
                    shortEvent: "",
                    level : ""
                }
            };
        }
        else if(type == self.recordType.SERIAL)
        {
            e = {
                type : self.recordType.SERIAL,
                taskHangle: "",
                epg : {
                    //系列的名稱  :康熙王朝
                    series_key : "",
                    //15        :第十五集
                    episode_key:"",
                    //0=normal 一般, 1=premier首播, 2=finale 最後
                    episode_status : "",
                    //0 非最後一集    1 最後一集
                    episode_last :  "" ,
                    eventId : "",
                    name : "",
                    shortEvent: "",
                    level : ""
                }
            };
        }
        else if(type == self.recordType.ONETIME)
        {
            e = {
                type : self.recordType.ONETIME
            };
        }
        else if(type == self.recordType.DAYTIME){
            e = {
                type : self.recordType.DAYTIME,
                taskHangle : ""
            };
        }
        else if(type == self.recordType.WEEKTIME){
            e = {
                type : self.recordType.WEEKTIME,
                taskHangle : ""
            };
        }
        e.ch = null;
        e.startTime = "";
        e.duration = 0;
        e.resId = -1;
        e.status = 0;
        e.eventHangle = generateUUID();
        return e;
    };

    /**
     * 根据 类型 获取任务模板
     * @param type
     * @returns
     */
    this.getTaskTemplate = function(type){
        var task = {};
        if(type == self.recordType.SERIAL){
            task = {
                type : self.recordType.SERIAL,
                taskHangle : generateUUID(),
                //系列描述参数
                constraint : {
                    //录制任务开始的日期
                    startTime : "",
                    //系列的名字 :康熙王朝
                    series_key : ""
                }
            };
        }
        else if(type == self.recordType.DAYTIME)
        {
            task = {
                type : self.recordType.DAYTIME,
                constraint : {
                    //录制任务开始的日期
                    startTime : "",
                    //录制时间:几点?
                    hour:"",
                    //录制时间:几分?
                    mintue:"",
                    //录制时间:多长时间?
                    duration : ""
                }
            };
        }
        else if(type == self.recordType.WEEKTIME){
            task = {
                type : self.recordType.WEEKTIME,
                constraint : {
                    //[1,3,4]   -星期天  星期六  一周内哪几天开始录制?
                    week : [],
                    //录制任务开始的日期
                    startTime : "",
                    //录制时间:几点?
                    hour:"",
                    //录制时间:几分?
                    mintue:"",
                    duration : ""
                }
            };
        }
        task.taskHangle = generateUUID();
        task.ch = null;
        task.resId = -1;
        task.orderList = [];
        task.cancelList = [];
        return task;
    };

    this.getEventByTask = function(task){
        var e = self.getEventTemplate(task.type);
        e.resId = task.resId;
        e.taskHangle = task.taskHangle;
        e.ch = task.ch;
        if(task.type == self.recordType.SERIAL)
        {
            e.epg.series_key = task.constraint.series_key;
        }
        else if(task.type == self.recordType.DAYTIME)
        {
            e.duration = task.constraint.duration;
        }
        else if(task.type == self.recordType.WEEKTIME)
        {
            e.duration = task.constraint.duration;
        }
        return e;
    };

    this.getTaskByHandle = function(taskHangle){
        for(var i = 0; i < self.taskList.array.length;i++)
        {
            if(self.taskList.array[i].taskHangle == taskHangle)
            {
                return self.taskList.array[i];
            }
        }
        return null;
    };

    this.startRecord = function(e){
        //获取录制URL
        var url = dtvCom.getRecordUrl(e.ch.idn);
        if(!url){
            console.log("Start Error! Can't get RecUrl!");
            return -1;
        }
        //获取录制的音频数据
        var aud = dtvCom.getAudioArray(e.ch.idn);

        //获取tunerId
        var tunerId = e.resId;

        //获取 serviceName
        var serviceName ="TS_"+e.ch.idn;

        //获取录制事件的私有数据
        var userData = e;


        //判断是否需要更新录制时间
        var curdate = new Date();
        var staDate = getEpgStartDate(e.startTime);
        var off = curdate.getTime() - staDate.getTime();
        if(off > 60 * 1000){
            e.startTime = getTimeStrfromDate(curdate);
        }

        var diskArray = FS.fsGetDiskInfo();
        var pvrDisk = null;
        for(var i = 0;i < diskArray.length;i++){
            if(diskArray[i].sn == sysCom.PVRPariedSn){
                pvrDisk = diskArray[i];
                break;
            }
        }

        /*if(!pvrDisk){
            self.deleteEvent(e);
            return 0;
        }*/


        var folder = "C:/PVR";

        //设置录制参数
        var params = {
            id:tunerId,
            cmd:"recStart",
            folder:"C:/PVR",
            serviceName:serviceName,
            url:url,
            audio:aud,
            userData:userData
        };

        //开始录制
        PVR.recStart(params,function(ret ){
            console.log("PVR.recStart callback");
            if(ret != 0){
                //启动录制失败
                console.log("startRecord Failed!");
                self.deleteEvent(e);
            }
        });

        for(var i = 0; i < self.eventList.array.length;i++){
            if(e.eventHangle == self.eventList.array[i].eventHangle){
                self.eventList.array[i].status = 1;
                self.saveListToFlash();
                break;
            }
        }

        return 0;
    };

    this.stopRecord = function(e){
        //获取tunerId
        var tunerId = e.resId;

        PVR.recStop(tunerId,function(){
            console.log("PVR.recStop callback");
        });

        e.status = 0;

        return 0;
    };

    this.getTunerIndexByResId = function(resId){
        for(var i = 0; i < self.tunerRes.length;i++){
            if(resId == self.tunerRes[i].id){
                return i;
            }
        }
        return -1;
    };

    this.sortList = function(list){

        list.sort(function(a, b){
            var aDate = getEpgStartDate(a.startTime ? a.startTime : a.constraint.startTime);
            var bDate = getEpgStartDate(b.startTime ? b.startTime : b.constraint.startTime);
            if(aDate.getTime() < bDate.getTime()){
                return -1;
            }
            else {
                return 1;
            }
        });
    };

    /**
     * 检查输入的开始时间段
     * @param startTime
     * @returns {number} 1:未到录制时间   2:可以开始录制   3:可以结束   4:已过期  5:录制中
     */
    this.checkTimeSolt = function(startTime,duration){
        var curDate = new Date();
        var startDate = getEpgStartDate(startTime);
        var endDate = getEpgEndDate(startDate, duration);

        if(startDate.getTime() > curDate.getTime())
        {
            return 1;
        }
        else if(curDate.getTime() >= startDate.getTime() && curDate.getTime() <= (endDate.getTime() - self.ERROR_TIME * 1000))
        {
            return 2;
        }
        else if(curDate.getTime() <= endDate.getTime()  && (curDate.getTime() + self.ERROR_TIME * 1000 ) >= endDate.getTime())
        {
            return 3;
        }
        else if(curDate.getTime() > endDate.getTime() )
        {
            return 4;
        }

        return 5;
    };

    /**
     * 检查两个唯一的时间段是否有冲突
     * @param startTime
     * @param duration
     * @param testStartTime
     * @param testDuration
     * @returns {number}
     */
    this.checkTimeOverlap = function(startTime, duration, testStartTime, testDuration){
        var startDate = getEpgStartDate(startTime);
        var endDate = getEpgEndDate(startDate, duration);
        var testStartDate = getEpgStartDate(testStartTime);
        var testEndDate = getEpgEndDate(testStartDate, testDuration);

        if(testEndDate <= startDate.getTime())
        {
            return -1;
        }
        else if(endDate.getTime() <= testStartDate.getTime())
        {
            return 1;
        }
        else
        {
            return 0;
        }
    };

    /**
     * 忽略年月日检测时间段是否重复
     * @param startTime
     * @param duration
     * @param testStartTime
     * @param testDuration
     * @returns {number}  -1:不重复   1:不重复   0:重复
     */
    this.checkTimeOverlapIgnoreDate = function(startTime, duration, testStartTime, testDuration) {
        var startDate = getEpgStartDate(startTime);
        var endDate = getEpgEndDate(startDate, duration);

        var testStartDate = getEpgStartDate(startTime.split(" ")[0] + " " + testStartTime.split(" ")[1]);
        var testEndDate = getEpgEndDate(testStartDate, testDuration);

        if(testEndDate <= startDate.getTime())
        {
            return -1;
        }
        else if(endDate.getTime() <= testStartDate.getTime())
        {
            return 1;
        }
        else
        {
            return 0;
        }
    };

    /**
     * 根据EPG shc获取,当前频道,当前节目的是否有添加录制
     * @param epgInfo
     */
    this.checkEpgRecord = function(epgInfo){
        for(var i = 0; i < self.eventList.array.length; i++)
        {
            var e = self.eventList.array[i];
            if(e.epg && (e.epg.eventId == epgInfo.eventId))
            {
                return e;
            }
        }
        return null;
    };

    this.checkSeriesRecord = function(series_key){
        for(var i = 0; i < self.taskList.array.length;i++){
            var t = self.taskList.array[i];
            if(t.type == self.recordType.SERIAL && t.constraint.series_key == series_key){
                return true;
            }
        }
        return false;
    };

    this.printE = function(e,str){
        console.log(str+JSON.stringify(e));
    };

    this.checkRecordingByTime = function(idn){
        for(var i = 0; i < self.eventList.array.length;i++){
            var e = self.eventList.array[i];
            if(e.status == 1 && e.ch.idn == idn){
                return e;
            }
        }
        return null;
    };

    this.checkRecordingByEvent = function(epgInfo){
        for(var i = 0; i < self.eventList.array.length; i++)
        {
            var e = self.eventList.array[i];
            if(e.epg && (e.epg.eventId == epgInfo.eventId) && e.status == 1)
            {
                return e;
            }
        }
        return null;
    };


    this.saveListToFlash = function(){
        //保存到机顶盒存储
        var ret = DB.dbSetValue("CNS_DVB_RECORDING_EVENTLIST", self.eventList, false);
        //console.log("save CNS_DVB_RECORDING_EVENTLIST:"+ret);
        ret = DB.dbSetValue("CNS_DVB_RECORDING_TASKLIST", self.taskList, false);
        //console.log("save CNS_DVB_RECORDING_TASKLIST:"+ret);
        //保存到浏览器
        utility.setH5Storage("CNS_DVB_RECORDING_EVENTLIST", self.eventList);
        utility.setH5Storage("CNS_DVB_RECORDING_TASKLIST", self.taskList);
    };

    this.getListFromFlash = function(){
        var obj = DB.dbGetValue("CNS_DVB_RECORDING_EVENTLIST", false);
        if(obj)
        {
            utility.setH5Storage("CNS_DVB_RECORDING_EVENTLIST", obj);
            self.eventList = obj;
        }
        else
        {
            self.eventList = {
                "array" : []
            };
            utility.setH5Storage("CNS_DVB_RECORDING_EVENTLIST", self.eventList);
        }

        obj = DB.dbGetValue("CNS_DVB_RECORDING_TASKLIST", false);
        if(obj){
            utility.setH5Storage("CNS_DVB_RECORDING_TASKLIST", obj);
            self.taskList = obj;
        }
        else
        {
            self.taskList = {
                "array" : []
            };
            utility.setH5Storage("CNS_DVB_RECORDING_TASKLIST", self.taskList);
        }
    };

    return this;
}

var recordSchCom = new RecordSchCommon();
recordSchCom.init();



