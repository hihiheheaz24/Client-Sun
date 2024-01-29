
cc.Class({
    extends: cc.Component,

    properties: {
        txtValue: cc.LabelIncrement,
    },
    onLoad () {
        this.node.play = this.play.bind(this);
        this.node.reset = this.reset.bind(this);
    },
    
    play(balance){
        this._balance = balance
        this.node.active = true;
        this.node.runAction(cc.sequence(
            cc.callFunc(()=>{
                cc.AudioController.getInstance().playSound(cc.AudioTypes.BONUS_RESULT);
                this.bonusResponse = cc.BonusGameController.getInstance().getData();
                cc.BonusGameController.getInstance().updateTotalWin(this.bonusResponse.PrizeValue);
                this.txtValue.tweenValueto(this.bonusResponse.PrizeValue, 2);
                cc.BonusGameController.getInstance().setData(null);
            }),
            cc.delayTime(4),
            cc.callFunc(()=>{
                cc.BalanceController.getInstance().updateRealBalance(this._balance);
                cc.BalanceController.getInstance().updateBalance(this._balance);
                cc.SpinController.getInstance().updateTotalWinFromBonus(this.bonusResponse.PrizeValue);
                cc.MainController.getInstance().destroyBonusGameView();
                cc.RoomController.getInstance().activeMain();
              
            }),
        ))
    },

    reset(){
        this.node.active = false;
        this.node.stopAllActions();
        this.callback = null;
    }
   
});
