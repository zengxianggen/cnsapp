function UITimeEdit(obj,id,value,l,t,w,h,attr) {

    this.dl = 20;
    this.dt = 5;

    this.editType = "number";
    this.maxChars = 9;

    this.value = "";

    this.initArgsDef(obj,id,value,l,t,w,h,attr);

    // console.log("UIEdit [" + this.l + "," + this.t + "," + this.w + "," + this.h + "]");

    if(typeof(this.value) == "number"){
        this.value = "" + this.value;
    }

    this.initSkinDef(this.defSkin);

    if(this.editType == "number"){
        if(this.maxChars > 15) 
        {
            //this.maxChars = 15;
        }
    }

    this.draw = function(){

        if(this.visibility > 0) {
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

        if(this.value || this.suffixValue){
            this.ctx.font = this.font;
            this.ctx.fillStyle = (this.onFocus?this.focusColor:this.color);
            this.ctx.textAlign = this.textAlign;
            this.ctx.textBaseline = this.textBaseline;

            var vx = "";


            if(this.passwdSpace)
            {
                for(var i = 0; i < this.value.length;i++)
                {
                    if(i < this.value.length-1)
                    {
                        vx += this.value[1];
                        vx += this.passwdSpace;
                    }
                }
            }
            else
            {
                vx = this.value;
            }

            if(this.onFocus)
            {
                vx;
            }

            var a = this.ctx.measureText(vx);

            var xl = pos.l + this.dl;

            if(this.HAlign == "center") {
                xl = (pos.l + (pos.w - a.width) / 2);
            }
            else if(this.HAlign == "right")
            {
                xl = pos.l + pos.w - this.dl - a.width;
            }

            var vy = pos.t + pos.h / 2 + this.dt;

            if(this.password)
            {
                vx = "";
                
                for(var i = 0; i < this.value.length;i++)
                {

                    vx += "*";


                    if(this.passwdSpace && (i < this.value.length-1))
                    {
                        vx += this.passwdSpace;
                    }
                }

                if(this.onFocus) vx;
            }

            this.ctx.fillText(vx, xl,vy , pos.w);

            if(this.suffixValue){
                a = this.ctx.measureText(this.suffixValue);
                xl = pos.l + pos.w - this.dl - a.width;
                this.ctx.fillText(this.suffixValue, xl,vy, pos.w);
            }
        }
    };

    this.getNumberValue = function(){
        return parseFloat(this.value);
    };

    this.getIntValue = function(){
        return parseInt(this.value);
    };
	
	this.getValue = function(){
		this.value;
	}

    this.defProc = function(e){
        var ret = false;
        var kechars = ['0','1','2','3','4','5','6','7','8','9'];
        if(e.keyCode >= UI.KEY.CHAR0 && e.keyCode <= UI.KEY.CHAR9){
            if(this.value.length < 2){
                this.value += kechars[e.keyCode - UI.KEY.CHAR0];
                ret = true;
            }
			else{
				this.value = ""+kechars[e.keyCode - UI.KEY.CHAR0];
				 ret = true;
			}
        }

        if(ret == true){
            this.update();
            this.onkey({keyCode:UI.KEY.WM_VALUE_CHANGE,id:this.id,hwin:this});
        }
        return ret;
    };

}

UITimeEdit.prototype = new UIWm();