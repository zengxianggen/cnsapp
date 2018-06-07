// JavaScript Document
function UIIPEdit(obj,id,value,l,t,w,h,attr) {

	var self = this;
    this.dl = 20;
    this.dt = 5;

    this.editType = "number";
    this.maxChars = 9;

	valueArr;
	this.selectIndex = 0;
	this.selectStatus = 0; // 0 is the all selected, 1 is normal 
	
	var focusTimer = null;
	var pointerStatus = 0;
	
	var text1 = "000";
	var text2 = " . ";
	var textBase = "000 . 000 . 000 . 000";
	
	var w_text1;
	var w_text2;
	var w_base;
	
	var valueArr = [
			"0",
			"0",
			"0",
			"0"
		]

    this.initArgsDef(obj,id,value,l,t,w,h,attr);
	console.log("initArgsDef");

	/*
    if(typeof(this.value) == "number"){
        this.value = "" + this.value;
    }
*/
    this.initSkinDef(this.defSkin);

    if(this.editType == "number"){
        if(this.maxChars > 15) 
        {
            //this.maxChars = 15;
        }
    }

    this.draw = function(){

        if(this.visibility > 0) {
			
			this.ctx.font = this.font;
            this.ctx.fillStyle = (this.onFocus?this.focusColor:this.color);
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = this.textBaseline;
			
			w_text1 = this.ctx.measureText(text1).width;
			w_text2 = this.ctx.measureText(text2).width;
			w_base = this.ctx.measureText(textBase).width;
			
            //console.log("this.onFocus=" + this.onFocus,"id="+this.id);

            var pos = this.getPosition();
            this.drawSkinDef(pos);
			this.drawPointerStatus(pos);
            this.doDrawValue(pos);
        }
    };
	
	this.drawPointerStatus = function(pos){
		if(!this.onFocus)return;
		
		var w_select = 0;
		var h_select = pos.h - 4;
		var xl = pos.l+(pos.w-w_base)/2;
		var yt = pos.t + (pos.h - h_select)/2;
		
		var value = valueArr[this.selectIndex];
		var w_value = this.ctx.measureText(value).width;
		this.ctx.fillStyle = "black";
		
		if(this.selectStatus == 0){
			
			xl = xl + (w_text1 + w_text2)*this.selectIndex + (w_text1 - w_value)/2;
			w_select = w_value;
			this.ctx.fillRect(xl,yt,w_select,h_select);
		}
		else{
			xl = xl + (w_text1 + w_text2)*this.selectIndex + (w_text1 + w_value)/2 + 1;
			var w_pointer = 2;
			var h_pointer = h_select;
			if(pointerStatus == 0)
			{
				this.ctx.fillRect(xl,yt,w_pointer,h_pointer);
			}
		}
		this.ctx.fillStyle = (this.onFocus?this.focusColor:this.color);
	}

    this.doDrawValue = function(pos){
       if(valueArr){
			var yt = pos.t + pos.h / 2 + this.dt;
			
			if(this.onFocus){
				var xl = pos.l+(pos.w-w_base)/2 - w_text2/2;
				var dl = (w_text1 + w_text2)/2;
				
				for(var i=0;i<valueArr.length;i++){
					var value = ""+valueArr[i];
					xl = xl + dl;
					this.ctx.fillText(value,xl,yt,pos.w);
					if(i == valueArr.length -1)break;
					xl = xl + dl;
					this.ctx.fillText(text2,xl,yt,pos.w);
				}
			}
			else{
				var value = valueArr[0]+"."+valueArr[1]+"."+valueArr[2]+"."+valueArr[3];
				var w_value = this.ctx.measureText(value).width;
				var xl = pos.l+pos.w/2;
				this.ctx.fillText(value,xl,yt,pos.w);
			}
        }
    };
	
	this.setValue = function(value){
		console.log("setValuesetValue == "+value);
		var arr = value.split(".");
		console.log("");
		if(arr.length !=4){
			console.log("setValue error!");
			return;
		}
		valueArr[0] = arr[0];
		valueArr[1] = arr[1];
		valueArr[2] = arr[2];
		valueArr[3] = arr[3];
	}
	
	this.getValue = function(){
		var value = valueArr[0]+"."+valueArr[1]+"."+valueArr[2]+"."+valueArr[3]
        return value;
    };
	
	this.setDefaultValue = function(){
		valueArr[0] = "0";
		valueArr[1] = "0";
		valueArr[2] = "0";
		valueArr[3] = "0";
		
	}
	
	this.iponfocus = function(){
		console.log("UIIPEdit onfocus!!!!!!!!!");
		self.setTimer();
	}
	
	this.iponblur = function(){
		console.log("UIIPEdit onblur!!!!!!!!!");
		self.clearTimer();
		self.selectIndex = 0;
		self.selectStatus = 0;
	}
	
	this.setTimer = function(){
		focusTimer = setInterval(function(){
		
			if(pointerStatus == 0)
				pointerStatus = 1;
			else pointerStatus = 0;
			
			self.update();
		},500)
	}
	
	this.clearTimer = function(){
		clearInterval(focusTimer);
		focusTimer = null;
	}
	
	
	this.setFocus = function(value){
        this.onFocus = value;
        if(value) {
            if(UI.focusWin != this) {
                if (UI.focusWin) {
                    UI.focusWin.onFocus = false;
					if(UI.focusWin.iponblur)UI.focusWin.iponblur();
					if(UI.focusWin.onblur)UI.focusWin.onblur();
                }
				if(this.iponfocus)this.iponfocus();
				if(this.onfocus)this.onfocus();
                UI.focusWin = this;
            }

        }else{
            if(this.parent){
                this.parent.onFocus = true;
                UI.focusWin = this.parent;
            }else{
                UI.focusWin = UI.rootWin[1];
            }
        }
    };

    this.defProc = function(e){
        var ret = false;
        var kechars = ['0','1','2','3','4','5','6','7','8','9'];
		
		var current_value = valueArr[this.selectIndex];
		var current_length = current_value.length;
		switch(e.keyCode){
		
			case UI.KEY.LEFT:
			ret = true;
			if(this.selectStatus == 0){
				valueArr[this.selectIndex] = "";
				this.selectStatus = 1;
			}
			else{
				if(current_length == 0)
				{
					this.selectIndex = this.selectIndex - 1 <0? this.selectIndex - 1+ 4:this.selectIndex - 1;
					if(valueArr[this.selectIndex].length != 0)this.selectStatus = 0;
					break;
				}
				
				valueArr[this.selectIndex] = current_value.substring(0,current_length -1);
			}
			
			break;
			case UI.KEY.RIGHT:
			ret = true;
			if(this.selectStatus == 0){
				this.selectStatus = 1;
			}
			else{
				this.selectIndex = (this.selectIndex + 1)%4;
				if(valueArr[this.selectIndex].length != 0)this.selectStatus = 0;
			}
			
			break;
			case UI.KEY.CHAR0:
			case UI.KEY.CHAR1:
			case UI.KEY.CHAR2:
			case UI.KEY.CHAR3:
			case UI.KEY.CHAR4:
			case UI.KEY.CHAR5:
			case UI.KEY.CHAR6:
			case UI.KEY.CHAR7:
			case UI.KEY.CHAR8:
			case UI.KEY.CHAR9:
			ret = true;
			var value = e.keyCode - UI.KEY.CHAR0;
			if(this.selectStatus == 0){
				this.selectStatus = 1;
				valueArr[this.selectIndex] = value;
				break;
			}
			
			if(current_length == 3)
			{
				this.selectIndex = (this.selectIndex + 1)%4;
				if(valueArr[this.selectIndex].length != 0)this.selectStatus = 0;
				break;
			}
			
			valueArr[this.selectIndex] = ""+valueArr[this.selectIndex]+value;
			
			if(valueArr[this.selectIndex].length == 3){
				this.selectIndex = (this.selectIndex + 1)%4;
				if(valueArr[this.selectIndex].length != 0)this.selectStatus = 0;
				break;
			}
			
			
			break;
		}

        if(ret == true){
            this.update();
            this.onkey({keyCode:UI.KEY.WM_VALUE_CHANGE,id:this.id,hwin:this});
        }
        return ret;
    };

}

UIIPEdit.prototype = new UIWm();
