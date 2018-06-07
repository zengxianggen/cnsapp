console.log("uiCom  start"+(new Date()).getTime());
function uiCommon()
{
   this.font = {
       F15:"15px SimHei",
       F18:"18px SimHei",
       F20:"20px SimHei",
       F22:"20px SimHei",
       F25:"25px SimHei",
       F30:"30px SimHei",
       F35:"35px SimHei",
       F40:"40px SimHei",
       F45:"45px SimHei",
       F50:"50px SimHei"
   };
}
var uiCom = new uiCommon();

/*
 *函数名：textMulLineHandle
 *描述：  根据显示行长度，处理一段文本，返回一个数组，数组中每一个元素就是一行内容。
 *参数：
 *   ctx:         画笔
 *   text：       字符串
 *   maxWidth:    一行的最大宽度
 *   maxR:        总共的行数
 *使用： 使用前需要画笔的字体属性
 *返回值：返回一个数组
 */
function textMulLineHandle(ctx,text,maxWidth,maxR)
{
    var text_arr = new Array();
    var text_word = "";
    var text_r = "";
    var r=0;

    var exp=/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/;
    for(var i=0;i<text.length;i++)
    {
        var reg = text[i].match(exp);
        if(reg != null)
        {
            if(r<maxR-1)
            {
                if(ctx.measureText(text_r+text_word).width<=maxWidth)
                {

                    text_r = text_r+text_word;

                    text_word = "";
                }
                else
                {
                    text_arr[r] = text_r;
                    text_r = text_word;
                    text_word = "";
                    r++;

                }
            }
            else
            {
                if(ctx.measureText(text_r+text_word).width<=maxWidth-ctx.measureText(" ...").width)
                {
                    text_r = text_r+text_word;

                    text_word = "";
                }
                else
                {
                    text_arr[r] = text_r+" ...";
                    return text_arr;
                }
            }

        }

        text_word = text_word + text[i];

        if(i==text.length-1)
        {
            if(r<maxR-1)
            {
                if(ctx.measureText(text_r+text_word).width<=maxWidth)
                {
                    text_r = text_r+text_word;
                    text_arr[r] = text_r;
                }
                else
                {
                    text_arr[r] = text_r;
                    r++;
                    text_arr[r] = text_word;
                }
            }
            else
            {
                if(ctx.measureText(text_r+text_word).width<=maxWidth-ctx.measureText(" ...").width)
                {
                    text_r = text_r+text_word;
                    text_arr[r] = text_r;
                }
                else
                {
                    text_arr[r] = text_r+" ...";
                }
            }

        }
    }

    return text_arr;
}

function textMulLineHandle1(ctx,font,msg,w,firstRowHeadSpace)
{
    var msgArray = new Array();
    var curRowText = firstRowHeadSpace ? firstRowHeadSpace : "";
    ctx.font = font;
    for(var i = 0; i < msg.length; i++)
    {
        if(msg[i] == "\n")
        {
            msgArray.push(curRowText);
            curRowText = "";
        }
        else if(ctx.measureText(curRowText + msg[i]).width <= w)
        {
            curRowText  += msg[i];
        }
        else
        {
            msgArray.push(curRowText);
            curRowText = msg[i];
        }
    }

    msgArray.push(curRowText);
    return msgArray;
}

function format3ChannelNo(no)
{
    if(no < 10)
    {
        return "00"+no;
    }
    else if(no < 100)
    {
        return "0"+no;
    }
    else{
        return no;
    }
}


//return   "03/02(一)"
function formatWeekDate (date){
    var wkArray = ["日", "一", "二", "三", "四", "五", "六"];
    var month = (date.getMonth() + 1) >= 10 ? "" + (date.getMonth() + 1) : "0" + (date.getMonth() + 1);
    var day = date.getDate() >= 10 ? "" + date.getDate() : "0" +  date.getDate();
    var week = wkArray[date.getDay()];

    return (month + "/" + day + "(" + week + ")");
};

//return  03/02(一)  19:31
function formatTitleDate(date){
    var month = (date.getMonth() + 1) >= 10 ? "" + (date.getMonth() + 1) : "0" + (date.getMonth() + 1);
    var day = date.getDate() >= 10 ? "" + date.getDate() : "0" + date.getDate();
    var hour = date.getHours() >= 10 ? "" + date.getHours() : "0" + date.getHours();
    var minute = date.getMinutes() >= 10 ? "" + date.getMinutes() : "0" + date.getMinutes();
    var week = date.getDate();
    return (formatWeekDate(date) + " " + hour + ":" + minute);
};

//format date    05/16
function formatDate1(date)
{
    var month = (date.getMonth()+1) < 10 ? "0"+(date.getMonth()+1) : (date.getMonth()+1);
    var day = date.getDate()  < 10 ? "0" + date.getDate() :date.getDate();
    return month+"/"+day;
}

//format time:  12:30
function formatTime1(date){
    var myDate = date ? date : new Date();
    var hours = myDate.getHours();  hours = hours >= 10 ? hours : "0"+hours;
    var minutes = myDate.getMinutes(); minutes = minutes>=10 ? minutes : "0"+minutes;
    return (hours + ":" + minutes);
}

//format time:   11:30 - 12:30
function formatTime2(startDate,endDate)
{
    return ( formatTime1(startDate) + "-" + formatTime1(endDate) );
}

//2017/06/01 19:00:00  转换为date
function getEpgStartDate(time){
    var t = time.split(" ");
    var t1 = t[0].split("/");
    var t2 = t[1].split(":");
    var date = (new Date(parseInt(t1[0]),parseInt(t1[1])-1,parseInt(t1[2]),parseInt(t2[0]),parseInt(t2[1]),parseInt(t2[2])));
    return date;
}

//date  转换为  2017/06/01 19:00:00
function getTimeStrfromDate(date)
{
    var str = "";
    str += date.getFullYear()+"/";
    var m = (date.getMonth()+1);
    str += ((m > 9) ? (""+m) : ("0"+ m )) + "/";
    str += ((date.getDate() > 9) ? ""+date.getDate() : ("0"+date.getDate()) )+ " ";

    str +=  ((date.getHours() > 9) ? date.getHours() : ("0"+date.getHours()) )+ ":";
    str +=  ((date.getMinutes() > 9) ? date.getMinutes() : ("0"+date.getMinutes()) )+ ":";
    str +=  (date.getSeconds() > 9) ? date.getSeconds() : ("0"+date.getSeconds());

    return str;
}

//输入 duration:3600  转换为: 01:00:00
function getFormatTimeStr(s){

    var t;
    if(s > -1){
        var hour = Math.floor(s/3600);
        var min = Math.floor(s/60) % 60;
        var sec = s % 60;
        if(hour < 10) {
            t = '0'+ hour + ":";
        } else {
            t = hour + ":";
        }

        if(min < 10){t += "0";}
        t += min + ":";
        if(sec < 10){t += "0";}
        t += sec;
    }
    return t;
}

function GetPercent(num, total) {
    num = parseFloat(num);
    total = parseFloat(total);
    if (isNaN(num) || isNaN(total)) {
        return "-";
    }
    return total <= 0 ? "0%" : (Math.round((num / total * 100)) + "%");
}

//输入 111120 (kB) 转换为  57MB 或 1.7GB
function  getFormatSize(k){
    var str = "";

    if(k > 0){
        if(k >= 1048576){
            var G = (k / 1024 / 1024).toFixed(1);
            str = "" + G + "GB";
        }
        else if(k >= 1024){
            var M = Math.floor(k / 1024);
            str = "" + M +"MB";
        }
        else{
            str = "" + k +"KB";
        }
    }
    return str;
}

//date  转换为  2017/06/01
function getDateStrfromDate(date){
    var str = "";
    str += date.getFullYear()+"/";
    var m = (date.getMonth()+1);
    str += ((m > 9) ? (""+m) : ("0"+ m )) + "/";
    str += ((date.getDate() > 9) ? ""+date.getDate() : ("0"+date.getDate()) )+ " ";
    return str;
}


function getEpgEndDate(date,dur)
{
    var t=date.getTime();
    t += dur * 1000;
    var endDate=new Date(t);
    return endDate;
}


function checkSameDay(startTime1,startTime2)
{
    var t1 = startTime1.split(" ");
    var t2 = startTime2.split(" ");
    if(t1[0] == t2[0])
    {
        return true;
    }
    return false;
}


function bannerPfProcess(startDate,dur)
{
    var t=startDate.getTime();
    t += dur * 1000;
    var endDate=new Date(t);
    var curDate = new Date();
    if(curDate.getTime() <= startDate.getTime()){
        return 0;
    }
    else if(curDate.getTime() >= endDate.getTime()){
        return 100;
    }
    else{
        var dif = curDate.getTime() - startDate.getTime();
        var process = parseInt(dif / (dur*10) );
        return  process;
    }
}



function deleteArrayItem(list,item)
{
    var index = -1;
    for(var i = 0; i < list.length; i++)
    {
        if(list[i] == item)
        {
            index = i;
            break;
        }
    }
    if(index >= 0)
    {
        list.splice(index,1);
    }
}

function addArrayItem(list,item){
    list.push(item);
}


function getTypeText(type)
{
    if(type == recordSchCom.recordType.SINGLE)
    {
        return Lp.getValue("single");
    }
    else if(type == recordSchCom.recordType.SERIAL)
    {
        return Lp.getValue("serial");
    }
    else if(type == recordSchCom.recordType.ONETIME)
    {
        return Lp.getValue("onetime");
    }
    else if(type == recordSchCom.recordType.DAYTIME)
    {
        return Lp.getValue("everyDay");
    }
    else if(type == recordSchCom.recordType.WEEKTIME)
    {
        return Lp.getValue("everyWeek");
    }
}
function makeEventToData(e){
    var data = {};
    if(e.constraint)
    {
        data.startDate = getEpgStartDate(e.constraint.startTime);
        data.endDate = getEpgEndDate(data.startDate, e.constraint.duration);
        data.firstStr = getFixedLengthString(uiCom.font.F20,160,dtvCom.getChNameByIdn(e.ch.idn));
        data.timeSolt = formatTime2(data.startDate, data.endDate);
        data.secondStr = getTypeText(e.type) + Lp.getValue("recordMode");
        data.thirdStr = "";
        data.str = formatTime2(data.startDate, data.endDate) + "  " + dtvCom.getChNameByIdn(e.ch.idn);
    }
    else
    {
        data.startDate = getEpgStartDate(e.startTime);
        data.endDate = getEpgEndDate(data.startDate, e.duration );
        data.firstStr = getFixedLengthString(uiCom.font.F20,160,dtvCom.getChNameByIdn(e.ch.idn));
        data.timeSolt = formatTime2(data.startDate, data.endDate);
        data.secondStr = getFixedLengthString(uiCom.font.F20,200,e.epg ?  e.epg.name : dtvCom.getChNameByIdn(e.ch.idn));
        data.thirdStr = getTypeText(e.type);
        data.str = formatTime2(data.startDate, data.endDate) + "  " + dtvCom.getChNameByIdn(e.ch.idn)
    }

    return data;
}
function getConflictText(we){
    var str = "";
    var data = makeEventToData(we);
    str += formatWeekDate(data.startDate) + " ";
    str += data.timeSolt + " ";
    str += data.firstStr +" ";
    str += data.secondStr +" ";
    str += data.thirdStr;
    str  += "\n";
    return str;
}

function checkArrayItem(list,item){
    var index = -1;
    for(var i = 0; i < list.length; i++)
    {
        if(list[i] == item)
        {
            index = i;
            break;
        }
    }
    return index;
}

//检查两个数组,是否有重复项
function checkArrayDuplicate(list1,list2)
{
    var flag = false;
    for(var i = 0; i < list1.length; i++)
    {
        if(flag)
        {
            break;
        }

        for(var j = 0; j < list2.length; j++)
        {
            if(list1[i] == list2[j])
            {
                flag = true;
                break;
            }
        }
    }
    return flag;
}

//得到定长字符串，如果长度超出，用...代替,如果长度不超出,用空格补全
function getFixedLengthString(font,w,str)
{
    UI.ctx.font = font;
    var s = getEllipsisString(font,w,str);
    while(UI.ctx.measureText(s).width < w)
    {
        s += " ";
    }
    return s;
}
//得到定长字符串，如果长度超出，用...代替
function getEllipsisString(font,w,str)
{
    UI.ctx.font = font;
    var s;
    var w1;
    for(var i = 0; i < str.length;i ++)
    {
        s = str.substr(0, i);
        w1 = UI.ctx.measureText(s).width;
        if(w1 >= w)
        {
            if(i > 3)
            {
                s = str.substr(0, i - 3) + "...";
                break;
            }
            else
            {
                s = "";
                break;
            }
        }
    }

    if(i < str.length)
    {
        return s;
    }
    else
    {
        return str;
    }
}

//获取字符串长度
function getStrLength(font,str)
{
    UI.ctx.font = font;
    return UI.ctx.measureText(str).width;
}



function getNavParams(params){

    var navParam = [
        {uiType : UIFrame, id : "navFrame", l : params.l, t : params.t, w : params.w, h : params.h, type : "none"},
    ];

    var startOL = params.startOL ? params.startOL : 0;
    var imgOt = params.imgOt ? params.imgOt : 0;
    var txtOt = params.txtOt ? params.txtOt : 0;
    var txtImgSpace = params.txtImgSpace ? params.txtImgSpace : 0;
    var groupSpace = params.groupSpace ? params.groupSpace : 0;
    var font = params.font ? params.font : uiCom.font.F18;
    var color = params.color ? params.color : "#96b4be" ;
    for(var i = 0; i < params.dataArray.length;i++)
    {
        var srcImg = UI.res.imgs[params.dataArray[i].img];
        var img = {
            uiType : UIImg,
            id : "NavImg"+i,
            ol : startOL,
            ot : imgOt,
            w : srcImg.width,
            h : srcImg.h,
            src : params.dataArray[i].img,
            stretch : "HV"
        };
        startOL += (srcImg.width + txtImgSpace);

        navParam.push(img);
        UI.ctx.font = font;
        var text = params.dataArray[i].text;
        var label = {
            uiType : UILabel,
            id : "NavLabel"+i,
            ol : startOL,
            ot : txtOt,
            w : UI.ctx.measureText(text).width,
            h : 40,
            value : params.dataArray[i].text,
            font : font,
            HAlign : "left",
            color : color
        };
        startOL += (UI.ctx.measureText(text).width + groupSpace);

        navParam.push(label);
    }

    return navParam;
};

function getEpgImgByRate (rate){
    var imgArray = [
        "level/ico_pu",
        "level/ico_hu",
        "level/ico_fu12",
        "level/ico_fu15",
        "level/ico_xian"
    ];
    if(rate <= 5){
        return imgArray[0];
    }
    else if(rate <= 8){
        return imgArray[1];
    }
    else if(rate <= 11){
        return imgArray[2];
    }
    else if(rate <= 13){
        return imgArray[3];
    }
    else if(rate >= 14){
        return imgArray[4];
    }
    else{
        return imgArray[0];
    }
};

function getVideoRect(rect,resolution)
{
    var r = {
        l:0,
        t:0,
        w:1280,
        h:720
    };
    //480p
    if(resolution == 1)
    {
        r.l = rect.l * 720 / 1280;
        r.t = rect.t * 480 / 720;
        r.w = rect.w * 720 / 1280;
        r.h = rect.h * 480 / 720;
    }
    //720p
    else if(resolution == 3 || resolution == 4)
    {
        r.l = rect.l * 1280 / 1280;
        r.t = rect.t * 720 / 720;
        r.w = rect.w * 1280 / 1280;
        r.h = rect.h * 720 / 720;
    }
    //1080p
    else if(resolution == 6 || resolution == 8)
    {
        r.l = rect.l * 1920 / 1280;
        r.t = rect.t * 1080 / 720;
        r.w = rect.w * 1920 / 1280;
        r.h = rect.h * 1080 / 720;
    }
    else if(resolution == 11 || resolution == 3)
    {
        r.l = rect.l * 4096 / 1280;
        r.t = rect.t * 2160 / 720;
        r.w = rect.w * 4096 / 1280;
        r.h = rect.h * 2160 / 720;
    }
    return r;
}


function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}


function getCountryByCode(code) {
    var first = code >> 16;
    var second = code >> 8 & 0xff;
    var third = code & 0xff;
    var lang = String.fromCharCode(first) + String.fromCharCode(second) + String.fromCharCode(third);
    return lang;
}


function getQamMode(index){
    var qam = 64;
    switch(index){
        case 1:
            qam = 16;
            break;
        case 2:
            qam = 32;
            break;
        case 3:
            qam = 64;
            break;
        case 4:
            qam = 128;
            break;
        case 5:
            qam = 256;
            break;
        default:
            qam = 256;
            break;
    }
    return qam;
}

function getVideoType(index){
    var videoType = 0x01;
    switch(index){
        case 0:
            videoType = 0x01;
            break;
        case 2:
            videoType = 0x10;
            break;
        case 8:
            videoType = 0x1B;
            break;
        case 9:
            videoType = 0x42;
            break;
        case 7:
            videoType = 0xEA;
            break;
        case 17:
            videoType = 0x01;
            break;
        default:
            videoType = 256;
            break;
    }
    return videoType;
}

function getAudioType(index){
    var audioType = 0x01;
    switch(index){
        case 0:
            audioType = 0x03;
            break;
        case 1:
            audioType = 0x04;
            break;
        case 3:
            audioType = 0x06;
            break;
        case 4:
            audioType = 0x0F;
            break;
        case 11:
            audioType = 0x11;
            break;
        case 9:
            audioType = 0x87;
            break;
        default:
            audioType = 0x04;
            break;
    }
    return audioType;
}


