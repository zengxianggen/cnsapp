function LockCommon(){
	var self = this;
	
	this.isUnlockTimeLock = false;
	this.channelLockTimer = null;
	this.parentalLockTimer = null;

	this.currentInfo = {
		"currentCh":null,
		"currentRating":0
	};


	this.init = function(){};

	this.reset = function(){};

	this.checkAllLock = function(targetCh,targetRating){

		var chlType = dtvCom.checkChannelLock(targetCh);
		var parType = dtvCom.checkParentalLock(targetRating);

		//time lock
		if(!self.isUnlockTimeLock && dtvCom.checkTimeLock()){
			return true;
		}

		//channel lock
		if(chlType && !self.channelLockTimer){
			return true;
		}

		//parental lock
		if(parType && !self.parentalLockTimer){
			return true;
		}else if(self.parentalLockTimer){
            if(targetRating >= 14 && self.currentInfo.currentRating < 14){
                return true;
            }
        }
		return false;
	};
	
	this.unLockCallback = function(targetCh,targetRating){

		if(dtvCom.checkTimeLock() && !self.isUnlockTimeLock ){
			self.isUnlockTimeLock = true;
		}

		if(dtvCom.checkChannelLock(targetCh) && !self.channelLockTimer){
			self.openChannelLockTimer();
		}

		if(dtvCom.checkParentalLock(targetRating) && !self.parentalLockTimer){
			self.openParentalLockTimer();
		}

		//如果节目仅为channel lock
		if(dtvCom.checkChannelLock(targetCh) && !dtvCom.checkParentalLock(targetRating)){
			self.closeParentalLockTimer();
		}

		//如果节目仅为parental lock
		if(dtvCom.checkParentalLock(targetRating) && !dtvCom.checkChannelLock(targetCh)){
			self.closeChannelLockTimer();
		}

		self.currentInfo = {
			"currentCh":targetCh,
			"currentRating":targetRating
		};
	};
    
	this.openChannelLockTimer = function(){
		self.closeChannelLockTimer();
		self.channelLockTimer = setTimeout(function(){
			self.closeChannelLockTimer();
		},120*1000);
	};

	this.closeChannelLockTimer = function(){
		clearTimeout(self.channelLockTimer);
		self.channelLockTimer = null;
	};

	this.openParentalLockTimer = function(){
		self.closeParentalLockTimer();
		self.parentalLockTimer = setTimeout(function(){
			self.closeParentalLockTimer();
		},120*1000)
	};

	this.closeParentalLockTimer = function(){
		clearTimeout(self.parentalLockTimer);
		self.parentalLockTimer = null;
	};
}
var lockCom = new LockCommon();
console.log("lockCom init");
lockCom.init();
