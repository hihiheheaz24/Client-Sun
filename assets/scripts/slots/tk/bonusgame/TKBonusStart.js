
cc.Class({
    extends: cc.Component,

    onLoad () {
        this.node.play = this.play.bind(this);
        this.node.reset = this.reset.bind(this);
    },
    
    play(callback){
        this.node.active = true;
        cc.AudioController.getInstance().playSound(cc.AudioTypes.BONUS_START);
        let anim = this.node.getComponent(cc.Animation).play('tkBonusStart');
        anim.off('finished');
        anim.on('finished', () => {
            cc.AudioController.getInstance().playSound(cc.AudioTypes.BONUS_MULTI);
            callback();
        });
    },
    reset(){
        this.node.active = false;
      
    }
   
});
