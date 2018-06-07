

function ReservationConflictDialog() {
    var self = this;
    var dialogName = "ReservationConflictDialog";
    this.index = 0;
    this.flag = false;
    this.timer = null;
    this.params = null;

    this.show = function (params) {
        this.params = params;
        //判断参数
        if(!params){
            return;
        }

        //如果有同类弹窗则删除
        self.deleteDialogFromDom();

        //添加dialog
        var elementBk = document.createElement("div");
        elementBk.id = "RecordingConflictDialog";
        document.body.appendChild(elementBk);

        var html = '<div id="'+dialogName+"_titleArea"+'"></div>';

        html += '<div id="'+dialogName+"_contentArea"+'">';
        html += '<p id="'+dialogName+"_contentTips"+'"></p >';
        html += '<table id="'+dialogName+"_table"+'">';
        var length = 1 + self.params.oldItem.length;
        for(var i = 0; i < length; i++){
            html += '<tr id="'+dialogName+"_table_tr"+i+'">';
            if(i == 0){
                html += '<td id="'+dialogName+"_table_td_"+i+"0"+'">'+self.params.newTips+'</td>';
                html += '<td id="'+dialogName+"_table_td_"+i+"1"+'">'+self.params.newItem.dateStr+'</td>';
                html += '<td id="'+dialogName+"_table_td_"+i+"2"+'">'+self.params.newItem.timeStr+'</td>';
                html += '<td id="'+dialogName+"_table_td_"+i+"3"+'">'+self.params.newItem.chName+'</td>';
                html += '<td id="'+dialogName+"_table_td_"+i+"4"+'">'+self.params.newItem.schName+'</td>';
                html += '<td id="'+dialogName+"_table_td_"+i+"5"+'">'+self.params.newItem.type+'</td>';
                html += '</tr>';
            }
            else{
                html += '<td id="'+dialogName+"_table_td_"+i+"0"+'">'+self.params.oldTips+'</td>';
                html += '<td id="'+dialogName+"_table_td_"+i+"1"+'">'+self.params.oldItem[i-1].dateStr+'</td>';
                html += '<td id="'+dialogName+"_table_td_"+i+"2"+'">'+self.params.oldItem[i-1].timeStr+'</td>';
                html += '<td id="'+dialogName+"_table_td_"+i+"3"+'">'+self.params.oldItem[i-1].chName+'</td>';
                html += '<td id="'+dialogName+"_table_td_"+i+"4"+'">'+self.params.oldItem[i-1].schName+'</td>';
                html += '<td id="'+dialogName+"_table_td_"+i+"5"+'">'+self.params.oldItem[i-1].type+'</td>';
                html += '</tr>';
            }
        }
        html += '</table></div >';

        html += '<div id="'+dialogName+"_footArea"+'">';
        html += '<div id="'+dialogName+"_footInner"+'">';
        html += '<img id="'+dialogName+"_IconOK"+ '"/>';
        html += '<span id="'+dialogName+"_TextOk"+ '"/></span>';
        html += '<img id="'+dialogName+"_IconBack"+ '"/>';
        html += '<span id="'+dialogName+"_TextBack"+ '"/></span>';
        html += '</div></div>';

        elementBk.innerHTML += html;


        //设置CSS属性
        elementBk.setAttribute('style', 'position: absolute;height: 440px; width: 880px; top: 160px; left: 200px;outline:0;'+
            'background-color:rgba(0,0,0,0.8); border:4px solid #0080FF; border-radius:10px; ');

        var elementTitle = document.getElementById(dialogName+"_titleArea");
        elementTitle.setAttribute('style','height:52px; width:880px; display:table-cell; vertical-align:middle;'+
            'text-align: center;  text-align: center; font-size:32px; color:#EEEEEE;');
        elementTitle.innerText = "预约录制冲突";

        var elementCont = document.getElementById(dialogName+"_contentArea");
        elementCont.setAttribute('style','height:340px; width:840px; margin:0 auto;overflow: hidden;'+
            'border-radius:10px; background-color: #104E8B; overflow:hidden; font-size:24px; color:#EEEEEE;');

        var elelmetTips = document.getElementById(dialogName+"_contentTips");
        elelmetTips.setAttribute('style','margin-left:30px;');
        elelmetTips.innerText=self.params.text1;

        var elementTable = document.getElementById(dialogName+"_table");
        elementTable.setAttribute('style','width:800px;margin-left:30px;font-size:22px;table-layout:fixed;  border-collapse: collapse;color:white;');

        for(var i = 0; i < length; i++){
            var eleTr = document.getElementById(dialogName+"_table_tr"+i);
            if(i == 0){
                eleTr.setAttribute('style','width:100%;height:50px;border-bottom:1px dashed grey;marign-top:5px;');
            }else{
                if(i == (self.index+1)){
                    eleTr.setAttribute('style','width:100%;height:50px;background-color:#333333;');
                }
                else{
                    eleTr.setAttribute('style','width:100%;height:50px;border-radius:25px;');
                }
            }

            var eleTd0 = document.getElementById(dialogName+"_table_td_"+i+"0");
            eleTd0.setAttribute('style','width:15%;overflow: hidden;text-overflow: ellipsis;border-top-left-radius:10px;border-bottom-left-radius:10px;');
            var eleTd1 = document.getElementById(dialogName+"_table_td_"+i+"1");
            eleTd1.setAttribute('style','width:15%;overflow: hidden;text-overflow: ellipsis;;');
            var eleTd2 = document.getElementById(dialogName+"_table_td_"+i+"2");
            eleTd2.setAttribute('style','width:20%;overflow: hidden;text-overflow: ellipsis;');
            var eleTd3 = document.getElementById(dialogName+"_table_td_"+i+"3");
            eleTd3.setAttribute('style','width:25%;overflow: hidden;text-overflow: ellipsis;');
            var eleTd4 = document.getElementById(dialogName+"_table_td_"+i+"4");
            eleTd4.setAttribute('style','width:25%;overflow: hidden;text-overflow: ellipsis;');
            var eleTd5 = document.getElementById(dialogName+"_table_td_"+i+"5");
            eleTd5.setAttribute('style','width:10%;overflow: hidden;text-overflow: ellipsis;border-top-right-radius:10px;border-bottom-right-radius:10px;');
        }


        var elementFoot = document.getElementById(dialogName+"_footArea");
        elementFoot.setAttribute('style','height:52px; width:880px;');

        var elementfootInner = document.getElementById(dialogName+"_footInner");
        elementfootInner.setAttribute('style','display: block; text-align:center; width:840px; margin:10 auto;');


        var elementIconOK = document.getElementById(dialogName+"_IconOK");
        elementIconOK.setAttribute('style',' vertical-align:text-top;');
        elementIconOK.setAttribute('src',"ico_ok.png")

        var elementTextOk = document.getElementById(dialogName+"_TextOk");
        elementTextOk.setAttribute('style','font-size:18px; color:grey; margin-right:10px; margin-left:5px; margin-top:-10px;');
        elementTextOk.innerText = self.params.okText;

        var elementIconBack = document.getElementById(dialogName+"_IconBack");
        elementIconBack.setAttribute('style','margin-left:10px; vertical-align:text-top;');
        elementIconBack.setAttribute('src','ico_back.png');

        var elementTextBack = document.getElementById(dialogName+"_TextBack");
        elementTextBack.setAttribute('style','font-size:18px; color:grey; margin-left:5px;');
        elementTextBack.innerText = self.params.backText;



        //设置焦点
        elementBk.setAttribute('tabindex', 1);
        elementBk.focus();

        //设置按键处理
        elementBk.onkeydown=function (e) {
            console.log("in ConfirmDialog:" + e.keyCode);
            if (e.keyCode == 13) {
                self.close();
                //do ok cb
                if (params.okfun) {
                    params.okfun();
                }
                e.stopPropagation();
                e.preventDefault();
            }
            else if (e.keyCode == 8) {
                self.close();
                //do no cb
                if (params.nofun) {
                    params.nofun();
                }
                e.stopPropagation();
                e.preventDefault();
            }
            else if(e.keyCode == 38){
                self.index--;
                if(self.index < 0){
                    self.index = self.params.oldItem.length-1;
                }
                for(var i = 0; i < length; i++){
                    var eleTr = document.getElementById(dialogName+"_table_tr"+i);
                    if(i == 0){
                        eleTr.setAttribute('style','width:100%;height:50px;border-bottom:1px dashed grey;marign-top:5px;');
                    }else{
                        if(i == (self.index+1)){
                            eleTr.setAttribute('style','width:100%;height:50px;background-color:#333333;border-radius:25px;');
                        }
                        else{
                            eleTr.setAttribute('style','width:100%;height:50px;border-radius:25px;');
                        }
                    }
                }
                e.stopPropagation();
                e.preventDefault();
            }
            else if(e.keyCode == 40){
                self.index++;
                if(self.index >= self.params.oldItem.length){
                    self.index = 0;
                }
                for(var i = 0; i < length; i++){
                    var eleTr = document.getElementById(dialogName+"_table_tr"+i);
                    if(i == 0){
                        eleTr.setAttribute('style','width:100%;height:50px;border-bottom:1px dashed grey;marign-top:5px;');
                    }else{
                        if(i == (self.index+1)){
                            eleTr.setAttribute('style','width:100%;height:50px;background-color:#333333;border-radius:5px;');
                        }
                        else{
                            eleTr.setAttribute('style','width:100%;height:50px;border-radius:25px;');
                        }
                    }
                }
                e.stopPropagation();
                e.preventDefault();
            }
        };

        //设置timer
        if(params.timeout){
            self.timer = setTimeout(function(){
                self.close();
            },params.timeout);
        }

        this.flag = true;
    };


    this.close = function () {
        clearTimeout(self.timer);
        if (this.flag) {
            self.deleteDialogFromDom();
            this.flag = false;
        }
    };

    this.deleteDialogFromDom = function(){
        var n = document.getElementById(dialogName);
        if(n){
            n.parentNode.removeChild(n);
        }
    };
    return this;
}


function RecordingConflictDialog() {
    var self = this;

    var dialogName = "RecordingConflictDialog";

    this.index = 0;
    this.flag = false;
    this.timer = null;
    this.params = null;

    this.show = function (params) {
        this.params = params;
        //判断参数
        if(!params){
            return;
        }

        //如果有同类弹窗则删除
        self.deleteDialogFromDom();

        //添加dialog
        var elementBk = document.createElement("div");
        elementBk.id = "RecordingConflictDialog";
        document.body.appendChild(elementBk);

        var html = '<div id="'+dialogName+"_titleArea"+'"></div>';

        html += '<div id="'+dialogName+"_contentArea"+'">';
        html += '<p id="'+dialogName+"_contentTips"+'"></p >';
        html += '<table id="'+dialogName+"_table"+'">';
        var length = 1 + self.params.oldItem.length;
        for(var i = 0; i < length; i++){
            html += '<tr id="'+dialogName+"_table_tr"+i+'">';
            if(i == 0){
                html += '<td id="'+dialogName+"_table_td_"+i+"0"+'">'+self.params.newTips+'</td>';
                html += '<td id="'+dialogName+"_table_td_"+i+"1"+'">'+self.params.newItem.dateStr+'</td>';
                html += '<td id="'+dialogName+"_table_td_"+i+"2"+'">'+self.params.newItem.timeStr+'</td>';
                html += '<td id="'+dialogName+"_table_td_"+i+"3"+'">'+self.params.newItem.chName+'</td>';
                html += '<td id="'+dialogName+"_table_td_"+i+"4"+'">'+self.params.newItem.schName+'</td>';
                html += '<td id="'+dialogName+"_table_td_"+i+"5"+'">'+self.params.newItem.type+'</td>';
                html += '</tr>';
            }
            else{
                html += '<td id="'+dialogName+"_table_td_"+i+"0"+'">'+self.params.oldTips+'</td>';
                html += '<td id="'+dialogName+"_table_td_"+i+"1"+'">'+self.params.oldItem[i-1].dateStr+'</td>';
                html += '<td id="'+dialogName+"_table_td_"+i+"2"+'">'+self.params.oldItem[i-1].timeStr+'</td>';
                html += '<td id="'+dialogName+"_table_td_"+i+"3"+'">'+self.params.oldItem[i-1].chName+'</td>';
                html += '<td id="'+dialogName+"_table_td_"+i+"4"+'">'+self.params.oldItem[i-1].schName+'</td>';
                html += '<td id="'+dialogName+"_table_td_"+i+"5"+'">'+self.params.oldItem[i-1].type+'</td>';
                html += '</tr>';
            }
        }
        html += '</table></div >';

        html += '<div id="'+dialogName+"_footArea"+'">';
        html += '<div id="'+dialogName+"_footInner"+'">';
        html += '<img id="'+dialogName+"_IconOK"+ '"/>';
        html += '<span id="'+dialogName+"_TextOk"+ '"/></span>';
        html += '<img id="'+dialogName+"_IconBack"+ '"/>';
        html += '<span id="'+dialogName+"_TextBack"+ '"/></span>';
        html += '</div></div>';

        elementBk.innerHTML += html;


        //设置CSS属性
        elementBk.setAttribute('style', 'position: absolute;height: 440px; width: 880px; top: 160px; left: 200px;outline:0;'+
            'background-color:rgba(0,0,0,0.8); border:4px solid #0080FF; border-radius:10px; ');

        var elementTitle = document.getElementById(dialogName+"_titleArea");
        elementTitle.setAttribute('style','height:52px; width:880px; display:table-cell; vertical-align:middle;'+
            'text-align: center;  text-align: center; font-size:32px; color:#EEEEEE;');
        elementTitle.innerText = self.params.title;

        var elementCont = document.getElementById(dialogName+"_contentArea");
        elementCont.setAttribute('style','height:340px; width:840px; margin:0 auto;overflow: hidden;'+
            'border-radius:10px; background-color: #104E8B; overflow:hidden; font-size:24px; color:#EEEEEE;');

        var elelmetTips = document.getElementById(dialogName+"_contentTips");
        elelmetTips.setAttribute('style','margin-left:30px; margin-top:10px;');
        elelmetTips.innerText=self.params.text1;

        var elementTable = document.getElementById(dialogName+"_table");
        elementTable.setAttribute('style','width:800px;margin-left:30px;font-size:22px;table-layout:fixed;  border-collapse: collapse;color:white;');

        for(var i = 0; i < length; i++){
            var eleTr = document.getElementById(dialogName+"_table_tr"+i);
            if(i == 0){
                eleTr.setAttribute('style','width:100%;height:50px;border-bottom:1px dashed grey;marign-top:5px;');
            }else{
                if(i == (self.index+1)){
                    eleTr.setAttribute('style','width:100%;height:50px;background-color:#333333;');
                }
                else{
                    eleTr.setAttribute('style','width:100%;height:50px;border-radius:25px;');
                }
            }

            var eleTd0 = document.getElementById(dialogName+"_table_td_"+i+"0");
            eleTd0.setAttribute('style','width:15%;padding-left:5px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;border-top-left-radius:10px;border-bottom-left-radius:10px;');
            var eleTd1 = document.getElementById(dialogName+"_table_td_"+i+"1");
            eleTd1.setAttribute('style','width:15%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;');
            var eleTd2 = document.getElementById(dialogName+"_table_td_"+i+"2");
            eleTd2.setAttribute('style','width:20%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;');
            var eleTd3 = document.getElementById(dialogName+"_table_td_"+i+"3");
            eleTd3.setAttribute('style','width:25%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;');
            var eleTd4 = document.getElementById(dialogName+"_table_td_"+i+"4");
            eleTd4.setAttribute('style','width:25%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;');
            var eleTd5 = document.getElementById(dialogName+"_table_td_"+i+"5");
            eleTd5.setAttribute('style','width:10%;overflow: hidden;text-overflow: ellipsis;border-top-right-radius:10px;border-bottom-right-radius:10px;white-space: nowrap;');
        }


        var elementFoot = document.getElementById(dialogName+"_footArea");
        elementFoot.setAttribute('style','height:52px; width:880px;');

        var elementfootInner = document.getElementById(dialogName+"_footInner");
        elementfootInner.setAttribute('style','display: block; text-align:center; width:840px; margin:10 auto;');


        var elementIconOK = document.getElementById(dialogName+"_IconOK");
        elementIconOK.setAttribute('style',' vertical-align:text-top;');
        elementIconOK.setAttribute('src',self.params.okIcon);

        var elementTextOk = document.getElementById(dialogName+"_TextOk");
        elementTextOk.setAttribute('style','font-size:18px; color:grey; margin-right:10px; margin-left:5px; margin-top:-10px;');
        elementTextOk.innerText = self.params.okText;

        var elementIconBack = document.getElementById(dialogName+"_IconBack");
        elementIconBack.setAttribute('style','margin-left:10px; vertical-align:text-top;');
        elementIconBack.setAttribute('src',self.params.backIcon);

        var elementTextBack = document.getElementById(dialogName+"_TextBack");
        elementTextBack.setAttribute('style','font-size:18px; color:grey; margin-left:5px;');
        elementTextBack.innerText = self.params.backText;



        //设置焦点
        elementBk.setAttribute('tabindex', 1);
        elementBk.focus();

        //设置按键处理
        elementBk.onkeydown=function (e) {
            console.log("in ConfirmDialog:" + e.keyCode);
            if (e.keyCode == 13) {
                self.close();
                //do ok cb
                if (params.okfun) {
                    params.okfun();
                }
                e.stopPropagation();
                e.preventDefault();
            }
            else if (e.keyCode == 8) {
                self.close();
                //do no cb
                if (params.nofun) {
                    params.nofun();
                }
                e.stopPropagation();
                e.preventDefault();
            }
            else if(e.keyCode == 38){
                self.index--;
                if(self.index < 0){
                    self.index = self.params.oldItem.length-1;
                }
                for(var i = 0; i < length; i++){
                    var eleTr = document.getElementById(dialogName+"_table_tr"+i);
                    if(i == 0){
                        eleTr.setAttribute('style','width:100%;height:50px;border-bottom:1px dashed grey;marign-top:5px;');
                    }else{
                        if(i == (self.index+1)){
                            eleTr.setAttribute('style','width:100%;height:50px;background-color:#333333;border-radius:25px;');
                        }
                        else{
                            eleTr.setAttribute('style','width:100%;height:50px;border-radius:25px;');
                        }
                    }
                }
                e.stopPropagation();
                e.preventDefault();
            }
            else if(e.keyCode == 40){
                self.index++;
                if(self.index >= self.params.oldItem.length){
                    self.index = 0;
                }
                for(var i = 0; i < length; i++){
                    var eleTr = document.getElementById(dialogName+"_table_tr"+i);
                    if(i == 0){
                        eleTr.setAttribute('style','width:100%;height:50px;border-bottom:1px dashed grey;marign-top:5px;');
                    }else{
                        if(i == (self.index+1)){
                            eleTr.setAttribute('style','width:100%;height:50px;background-color:#333333;border-radius:5px;');
                        }
                        else{
                            eleTr.setAttribute('style','width:100%;height:50px;border-radius:25px;');
                        }
                    }
                }
                e.stopPropagation();
                e.preventDefault();
            }
        };

        //设置timer
        //设置timer
        if(!params.timeout){
            params.timeout = 20*1000;

        }
        self.timer = setTimeout(function(){
            self.close();
        },params.timeout);

        this.flag = true;
    };


    this.close = function () {
        clearTimeout(self.timer);
        if (this.flag) {
            self.deleteDialogFromDom();
            this.flag = false;
        }
    };

    this.deleteDialogFromDom = function(){
        var n = document.getElementById(dialogName);
        if(n){
            n.parentNode.removeChild(n);
        }
    };
    return this;
}