/**
 * Created by Nofear on 3/26/2019.
 */

var slotsConfig = require('AquariumConfig');

(function () {
    cc.TKBonusGameView = cc.Class({
        "extends": cc.Component,
        properties: {
            nodeStart: cc.Node,
            nodePick: cc.Node,
        },

        onLoad: function () {
            //Khoi tao
            cc.BonusGameController.getInstance().setBonusGameView(this);
        },


        onEnable: function () {
            //lay data cu
            //cc.warn("BINUS", cc.BonusGameController.getInstance().getData())
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
               // cc.warn("Resume đã chơi bonus", pickPos)
                this.changeView(cc.BonusGameState.PICK);
            }

            //tinh toan lay so so tien dang thang cu
            cc.BonusGameController.getInstance().updateTotalWin(totalWin);
        },

        changeView: function (bonusGameState) {
            this.nodeStart.reset();
            this.nodePick.reset();
            switch (bonusGameState) {
                case cc.BonusGameState.START:
                    this.nodeStart.play(()=>{
                        this.changeView(cc.BonusGameState.PICK);
                    })
                    break;
                case cc.BonusGameState.PICK:
                    this.nodePick.play();
                    break;

            }
        },
        updateTotalWin: function (totalWin) {
           // this.nodePick.updateTotalWin(totalWin);
        },

        //goi khi finish bonus game
        onPlayBonusFinishResponse: function (balance) {
            //cc.warn("onPlayBonusFinishResponse",balance )
            cc.director.getScheduler().schedule(function () {
                this.nodePick.showResult(balance);
            }, this, 0, 0, 3, false);
        },
    });
}).call(this);
