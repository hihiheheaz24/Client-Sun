
cc.Class({
    extends: cc.Component,

    properties: {
        logo: cc.Node,
    },


    onLoad () {
        this.node.play = this.play.bind(this);
        this.node.reset = this.reset.bind(this);
    },
    
    play(callback){
        this.node.active = true;
        this.logo.scale = 0;
        cc.AudioController.getInstance().playSound(cc.AudioTypes.BONUS_WIN);
        this.logo.runAction(cc.sequence(
            cc.scaleTo(0.2, 1),
            cc.callFunc(()=>{
                this.logo.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.3, 1), cc.scaleTo(0.3, 1.1))));
            }),
            cc.delayTime(3),
            cc.callFunc(()=>{
                cc.AudioController.getInstance().playSound(cc.AudioTypes.BONUS_CLICK);
                callback();
            }),
        ))
    },
    reset(){
        this.node.active = false;
        this.logo.scale = 0;
        this.logo.stopAllActions();
    }
   
});
