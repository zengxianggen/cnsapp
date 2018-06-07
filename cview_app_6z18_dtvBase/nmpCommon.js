function NetworkMediaPlayerCommon()
{
    var self = this;
    this.id = 1;
    this.TYPE = [
        "http://",
        "https:",
        ""
    ];

    this.mp = null;

    this.init = function(){
        if(self.mp)
        {
            self.mp = new MPlayer(self.id);
        }
    };
}
var netMplayer = NetworkMediaPlayerCommon;
console.log("netMplayer init");
//netMplayer.init();
