
cc.Class({
    extends: cc.Component,

    properties: {
        lblResult: cc.Label,
    },
    onLoad () {
        this.node.play = this.play.bind(this);
        this.node.reset = this.reset.bind(this);
    },
    
    play(){
        this.node.active = true;
        this.node.runAction(cc.sequence(
            cc.callFunc(()=>{
                this.bonusResponse = cc.BonusGameController.getInstance().getData();
                cc.BonusGameController.getInstance().updateTotalWin(this.bonusResponse.PrizeValue);
                let stringTotalWin =  cc.Tool.getInstance().formatNumber(this.bonusResponse.PrizeValue);
                let numberWin = 0;
                this.bonusResponse.BonusData.forEach(bonusData =>{
                    numberWin = numberWin + bonusData.PrizeValue;
                })
                let stringWin =cc.Tool.getInstance().formatNumber(numberWin);
                this.lblResult.string = stringTotalWin;//stringWin + " X " + this.bonusResponse.Multiplier + " = " + stringTotalWin;
                cc.BonusGameController.getInstance().setData(null);
            }),
            cc.delayTime(4),
            cc.callFunc(()=>{
                cc.SpinController.getInstance().updateTotalWinFromBonus(this.bonusResponse.PrizeValue);
                cc.MainController.getInstance().destroyBonusGameView();
              
            }),
        ))
    },

    onClickClose(){
        this.node.stopAllActions();
        cc.BonusGameController.getInstance().updateTotalWin(this.bonusResponse.PrizeValue);
        cc.SpinController.getInstance().updateTotalWinFromBonus(this.bonusResponse.PrizeValue);
        cc.MainController.getInstance().destroyBonusGameView();

    },

    reset(){
        this.node.active = false;
        this.node.stopAllActions();
        this.callback = null;
    }
   
});
