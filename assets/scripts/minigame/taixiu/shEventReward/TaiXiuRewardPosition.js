// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

(function () {
    cc.TaiXiuRewardPosition = cc.Class({
    extends: cc.Component,

    properties: {
        boxHide:cc.Sprite,
        boxMain:cc.Sprite
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.anim = this.node.getComponent(cc.Animation);
    },
    
    startSpin: function(sfs){
        this.sfs = sfs;
        this.haveRespone = false;
        this.anim.play('shRewardSpin');
    },
    loopSpin:function(){
        this.anim.play('shRewardSpinLoop');
    },

    loopEnd:function(){
        if(this.haveRespone){
            this.anim.stop('shRewardSpinLoop');
            this.anim.play('shRewardSpinEnd');
        } 
    },


    stopSpin:function(result)
    {
        this.haveRespone = true;  
        this.result = result;
      
    },
    randomIcon:function(data)
    {
        if (data==1) {
            this.boxHide.spriteFrame = this.sfs[Math.round(Math.random()*this.sfs.length)];
        }
        if (data==2) {
            this.boxMain.spriteFrame = this.sfs[Math.round(Math.random()*this.sfs.length)];
        }
    },
    setResult:function(){
            this.boxMain.spriteFrame = this.sfs[this.result];
    }
    // update (dt) {},
});
}).call(this);
