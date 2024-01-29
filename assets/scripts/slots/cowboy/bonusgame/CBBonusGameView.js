/**
 * Created by Nofear on 3/26/2019.
 */

var slotsConfig = require('SlotsConfig');

(function () {
    cc.CBBonusGameView = cc.Class({
        "extends": cc.Component,
        properties: {
            nodeStart: cc.Node,
            nodePick: cc.Node,
            nodeMuilti: cc.Node,
            nodeResult: cc.Node,
        
        },


   
        onLoad: function () {
            //Khoi tao
            cc.BonusGameController.getInstance().setBonusGameView(this);
        },

        onEnable: function () {
            //lay data cu
            this._balance = 0;
            let bonusResponse = cc.BonusGameController.getInstance().getData();
            let currentStep = bonusResponse.CurrentStep;
            let position = bonusResponse.Position;
            let bonusData = bonusResponse.BonusData;
            let totalWin = 0;

            //Luu lai currentStep
            cc.BonusGameController.getInstance().setCurrentStep(currentStep);

            //Xem dang o step nao?
            if (currentStep < 1) {
                //chua choi
                this.changeView(cc.BonusGameState.START);
            } else {
                //da choi ròi
                //Kiem tra da chon o vi tri nao
                var posStr = position.substring(0, position.length - 1); //cat dau , o cuoi
                var pickPos = cc.Tool.getInstance().convertStringArrayToIntArray(posStr);
                pickPos.forEach(function (pos, index) {
                    //Tinh so tien dang thang
                    totalWin += bonusData[index].PrizeValue;
                });

                this.changeView(cc.BonusGameState.PICK);
            }

            //tinh toan lay so so tien dang thang cu
            cc.BonusGameController.getInstance().updateTotalWin(totalWin);
        },

     

        changeView: function (bonusGameState) {
            this.nodeStart.reset();
            this.nodePick.reset();
            this.nodeMuilti.reset();
            this.nodeResult.reset();
            switch (bonusGameState) {
                case cc.BonusGameState.START:
                    this.nodeStart.play(()=>{
                        this.changeView(cc.BonusGameState.PICK);
                    })
                    break;
                case cc.BonusGameState.PICK:
                    this.nodePick.play();
                    break;
                case cc.BonusGameState.MULTI:
                    this.nodeMuilti.play();
                    break;
                case cc.BonusGameState.RESULT:
                    this.nodeResult.play(()=>{
                        cc.BalanceController.getInstance().updateRealBalance(this._balance);
                        cc.BalanceController.getInstance().updateBalance(this._balance);
                    });
                    break;
            }
        },

        activeButtonQuickPlay: function (enable) {
            this.btnQuickPlay.interactable = enable;
        },

        updateTotalWin: function (totalWin) {
            this.nodePick.updateTotalWin(totalWin);
        },

        //goi khi finish bonus game
        onPlayBonusFinishResponse: function (balance) {
            cc.warn("onPlayBonusFinishResponse",balance )
            this._balance = balance;
            // cc.BalanceController.getInstance().updateRealBalance(balance);
            // cc.BalanceController.getInstance().updateBalance(balance);
            this.nodePick.endModePick();
        },
    });
}).call(this);
