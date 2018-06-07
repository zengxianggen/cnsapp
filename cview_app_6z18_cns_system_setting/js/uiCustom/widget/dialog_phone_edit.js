// JavaScript Document
function UIDialogPhoneEdit(obj, id, value, l, t, w, h, attr){

	var self=this;
    this.dl = 20;
    this.dt = 5;

    this.editType = "number";
    this.maxChars = 10;

    this.value = "";
	this.passwdSpace = "       ";
	
	var timer=null;
	var timerCount = 0;
	var timerInterval = 500;

    this.initArgsDef(obj, id, value, l, t, w, h, attr);

    // console.log("UIEdit [" + this.l + "," + this.t + "," + this.w + "," + this.h + "]");

    if(typeof(this.value) == "number"){
        this.value = "" + this.value;
    }

    this.initSkinDef(this.defSkin);

    if(this.editType == "number"){
        if(this.maxChars > 15){
            //this.maxChars = 15;
        }
    }

    this.draw = function(){

        if(this.visibility > 0){
            //console.log("this.onFocus=" + this.onFocus,"id="+this.id);

            var pos = this.getPosition();

            this.drawSkinDef(pos);
            this.doDrawValue(pos);
        }
    };

    this.doDrawValue = function(pos){

        /*console.log("drawValueDef value=" + this.value + ",pos=" + JSON.stringify(pos)
         + ",this.font=" + this.font + ",this.color=" + this.color
         +",dl="+this.dl + ",dt=" + this.dt + ",pos.w=" + pos.w);
         */

        if(1){
            this.ctx.font = this.font;
            this.ctx.fillStyle = (this.onFocus ? this.focusColor : this.color);
            this.ctx.textAlign = this.textAlign;
            this.ctx.textBaseline = this.textBaseline;

			vx = this.value;

            var xl = pos.l + this.dl;
			var a = this.ctx.measureText(vx);
			
			if(this.HAlign == "center"){
                xl = (pos.l + (pos.w - a.width) / 2);
            }
            else if(this.HAlign == "right"){
                xl = pos.l + pos.w - this.dl - a.width;
            }


            var vy = pos.t + pos.h / 2 + this.dt;

            


			if(timerCount%2 == 0)
			{
				vx += "|";
			}

            this.ctx.fillText(vx, xl, vy, pos.w);

            if(this.suffixValue){
                a = this.ctx.measureText(this.suffixValue);
                xl = pos.l + pos.w - this.dl - a.width;
                this.ctx.fillText(this.suffixValue, xl, vy, pos.w);
            }
        }
    };
	
	this.openTimer = function(){
		if(timer!=null)
		this.closeTimer();
		this.timer = setInterval(function(){
			timerCount++;
			if(timerCount>=1000)timerCount = 0;
			self.update();
		},timerInterval);
		
	}
	
	this.clearTimer = function(){
		if(timer!=null)
		clearInterval(timer);
		timer = null;
	}

    this.getNumberValue = function(){
        return parseFloat(this.value);
    };

    this.getIntValue = function(){
        return parseInt(this.value);
    };

    this.defProc = function(e){
        var ret = false;
        var kechars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

        if(e.keyCode >= UI.KEY.CHAR0 && e.keyCode <= UI.KEY.CHAR9){
            if(this.value.length < this.maxChars){
                this.value += kechars[e.keyCode - UI.KEY.CHAR0];
                ret = true;
            }
        } else if(e.keyCode == UI.KEY.LEFT && this.value.length > 0){
            if(this.value.length > 1){
                this.value = this.value.slice(0, this.value.length - 1);
            } else {
                this.value = "";
            }

            ret = true;
        }

        if(ret == true){
            this.update();
            this.onkey({keyCode : UI.KEY.WM_VALUE_CHANGE, id : this.id, hwin : this});
        }
        return ret;
    };

}

UIDialogPhoneEdit.prototype = new UIWm();