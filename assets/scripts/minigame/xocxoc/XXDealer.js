
cc.Class({
    extends: cc.Component,

    properties: {
        dealer: cc.Animation
    },

    onLoad(){
        this.dealer.play('xxDealer');
        this.canClick = true;
    },

    onTouchDealer(){
        if(this.canClick){
            this.canClick = false;
            let animMain = this.dealer.play('xxDealerTouch');
            animMain.off('finished');
            animMain.on('finished', () => {
                this.canClick = true;
                this.dealer.play('xxDealer');
            });
        }
       
    }

});
