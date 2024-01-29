/**
 * Created by Welcome on 5/28/2019.
 */

 var XXAnimJackpot = require('XXAnimJackpot');

(function () {
    cc.XXResultView = cc.Class({
        "extends": cc.Component,
        properties: {
            nodeBatNan: cc.Node,
            nodeDia: cc.Node,
            animationBat: sp.Skeleton,

            spriteVis: [cc.Sprite],

            sfVis: [cc.SpriteFrame],
        
            animResult: cc.Animation,
            nodeChan: cc.Node,
            nodeLe: cc.Node,

            nodeChan1: cc.Node,
            nodeChan2: cc.Node,
            nodeChan3: cc.Node,

            nodeLe1: cc.Node,
            nodeLe2: cc.Node,
            nodeLe3: cc.Node,

            nameAnimMoBat: [cc.String],

            lbJackpot1: cc.LabelIncrement,
            lbJackpot2: cc.LabelIncrement,

            nodeAnimJackpot: XXAnimJackpot,
            _resultJackpot: null
        },

        onLoad: function () {
            cc.XXController.getInstance().setXXResultView(this);

            this.currentState = -1;
            this.nodeResult = this.animResult.node;
            this.nodeFxResult = this.nodeChan1.parent;

            //toa do cua bat Nan
            this.batNanPos = cc.v2(0, 43);

            var self = this;
            let gameListData = cc.LobbyJackpotController.getInstance().getJackpotResponse();
            gameListData.forEach(function (game) {
                switch (game.GameID.toString()) {
                    case cc.GameId.XOC_XOC:
                        self.updateJackpot(game.JackpotFund);
                        break;
                }
            });
        },

        reset: function () {
        },

        setResultJacpot: function (data) {
            this._resultJackpot = data;
        },

        updateResult: function (players, result, originResult, state, openNow) {
            // if (!this.nodeBatNan) return;

            //check state de xu ly hien thi
            switch (state) {
                //giai doan dat cuoc
                case cc.XXState.BETTING: //54
                    if (this.currentState !== state) {
                        // this.nodeBatNan.active = false;
                        // this.nodeDia.active = false;
                        // this.nodeBatNan.position = this.batNanPos;

                        this.nodeResult.active = false;
                        // this.nodeViParent.active = false;
                        this.nodeFxResult.active = false;

                        this.nodeAnimJackpot.playAnimDice();
                    }

                    break;
                //giai doan mo bat
                case cc.XXState.OPEN_PLATE:
                    if (this.currentState !== state) {
                        // this.nodeBatNan.active = false;
                        // this.nodeDia.active = false;
                        // this.nodeBatNan.position = this.batNanPos;

                        this.nodeResult.active = false;
                        this.nodeFxResult.active = false;

                        //chay animation
                        this.playFxResult(result, originResult, openNow);

                        if (this._resultJackpot != null) {
                            this.nodeAnimJackpot.showResult(this._resultJackpot);
                        }
                    }
                    break;

                //giai doan ket qua
                case cc.XXState.SHOW_RESULT: //15
                    if (this.currentState !== state) {
                        // if (this.nodeBatNan.active) {
                        // this.nodeBatNan.active = false;
                        // this.nodeDia.active = true;
                        // }
                        // //chay fx pay
                        this.playPayFx(players, result);
                        this.updateJackpot(result.Jackpot);
                    }
                    break;

                //giai doan cho phien moi
                case cc.XXState.WAITING:
                    if (this.currentState !== state) {
                        cc.XXController.getInstance().initGateChip();
                        // an bat Nan di
                        // this.nodeBatNan.active = false;
                        // this.nodeDia.active = false;
                        // this.nodeBatNan.position = this.batNanPos;

                        // An ket qua + fx
                        // this.nodeViParent.active = false;
                        // this.nodeResult.active = false;
                        this.nodeFxResult.active = false;
                        this.playAnimBat("Waiting");
                    }
                    break;
                //xoc dia
                case cc.XXState.SHAKING:
                    //play animation xoc bat
                    if (this.currentState !== state) {
                        //An ket qua + fx
                        this.nodeResult.active = false;
                        this.nodeFxResult.active = false;

                        //an bat Nan di
                        // this.nodeBatNan.active = false;
                        // this.nodeDia.active = false;
                        // this.nodeBatNan.position = this.batNanPos;

                        this.playAnimBat("XocXoc");
                        }
                    break;
            }

            //luu lai state hien tai
            this.currentState = state;
        },

        playAnimBat: function (nameAnim) {
            this.animationBat.clearTracks();
            this.animationBat.setToSetupPose();
            this.animationBat.setAnimation(1, nameAnim, false);
        },

        playFxResult: function (result, originResult, openNow) {
            var self = this;
            this.nodeFxResult.active = true;
            this.nodeResult.active = true;
            this.animResult.stop();
            // this.nodeChan.active = false;
            // this.nodeLe.active = false;

            this.nodeChan1.active = false;
            this.nodeChan2.active = false;
            this.nodeChan3.active = false;
            this.nodeLe1.active = false;
            this.nodeLe2.active = false;
            this.nodeLe3.active = false;


            var results = originResult.split(',');
            //duyet qua ket qua cua tung Vi
            var iWhite = 0;
            results.forEach(function (result, index) {
                // self.spriteVis[index].spriteFrame = self.sfVis[parseInt(result)];
                if (parseInt(result) == 0) iWhite++;
            });

            if (iWhite == 0) {
                this.playAnimBat("4 Red");
            } else if (iWhite == 3) {
                this.playAnimBat("3 White 1 Red");
            } else if (iWhite == 2) {
                this.playAnimBat("2 Red 2 White");
            } else if (iWhite == 1) {
                this.playAnimBat("3 Red 1 White");
            } else {
                this.playAnimBat("4 White");
            }

            //dang o che do Nan
            if (cc.XXController.getInstance().getIsNan() && !openNow) {
                //bat bat Nan
                // this.nodeDia.active = true;
                // this.nodeBatNan.active = true;
                // this.nodeBatNan.position = this.batNanPos;
                //tat cai bat animation
                // this.animationBat.clearTracks();
                // this.animationBat.setToSetupPose();
                // this.animationBat.setAnimation(0, "IdleDia", false);
                // this.animationBat.node.active = false;

                // this.scheduleOnce(function () {
                //     self.nodeBatNan.active = false;
                // }, 5.000);

            } else {
                //tat bat Nan
                // this.nodeBatNan.active = false;
                // this.nodeDia.active = true;
                //play animation mo bat
                // this.animationBat.node.active = true;
                // this.animationBat.clearTracks();
                // this.animationBat.setToSetupPose();
                // this.animationBat.setAnimation(3, "mo", false);

            }
        },

        onDestroy: function () {
            this.unscheduleAllCallbacks();
        },

        updateJackpot: function (jackpot) {
            this.lbJackpot1.tweenValueto(jackpot);
            this.lbJackpot2.tweenValueto(jackpot);
        },

        playPayFx: function (players, result) {
            //lay ve danh sach cac player
            let gateChips = cc.XXController.getInstance().getGateChips();
            var self = this;
            let bigGate = parseInt(result.BigGate);
            let smallGate = parseInt(result.SmallGate);
            switch (bigGate) {
                case cc.XXGate.EVEN:
                    self.animResult.play('chan_blink');
                    break;
                case cc.XXGate.ODD:
                    self.animResult.play('le_blink');
                    break;
            }
            switch (smallGate) {
                case cc.XXGate.THREE_UP:
                    self.nodeLe1.active = true;
                    self.nodeLe2.active = true;
                    smallGate = 2;
                    break;
                case cc.XXGate.THREE_DOWN:
                    self.nodeLe1.active = true;
                    self.nodeLe3.active = true;
                    smallGate = 3;
                    break;
                case cc.XXGate.FOUR_DOWN:
                    self.nodeChan1.active = true;
                    self.nodeChan3.active = true;
                    smallGate = 6;
                    break;
                case cc.XXGate.FOUR_UP:
                    self.nodeChan1.active = true;
                    self.nodeChan2.active = true;
                    smallGate = 5;
                    break;
                default:
                    self.nodeChan1.active = true;
            }

            //Loc danh sach cua thang
            let arrGateWin = [bigGate, smallGate];

            //Loc danh sach cua thua
            let arrGateLose = [];
            gateChips.map((gate, index) => {
                if (!arrGateWin.includes(index)) {
                    arrGateLose.push(index)
                }
            }, this);

            var totalLost = 0;
            //Hieu ung chip thua bay tu table -> dealer
            this.fxMoveChip(arrGateLose, cc.XX_FX.LOSE);


            var totalWin = 0;
            //Hieu ung chip thang bay tu dealer -> table

            this.scheduleOnce(function () {
                this.fxMoveChip(arrGateWin, cc.XX_FX.DEALER_PAY);
            }.bind(this), 1.000);


            var total = 0;
            //Hieu ung chip thang bay tu table -> player
            this.scheduleOnce(function () {
                this.fxMoveChip(arrGateWin, cc.XX_FX.PAY);
            }.bind(this), 2.000);

        },
        //Hieu ung bay chip
        fxMoveChip: function (arrGate, typeFx) {
            try {
                let gateChips = cc.XXController.getInstance().getGateChips();
                arrGate.map(gateIndex => {
                    if (gateChips[gateIndex] && gateChips[gateIndex].length) {
                        gateChips[gateIndex].forEach(function (chip) {
                            switch (typeFx) {
                                case cc.XX_FX.LOSE:
                                    cc.XXController.getInstance().playFxLost(chip);
                                    break;
                                case cc.XX_FX.DEALER_PAY:
                                    cc.XXController.getInstance().playFxDealerPay(chip);
                                    break;
                                case cc.XX_FX.PAY:
                                    cc.XXController.getInstance().playFxPay(chip);
                                    break;
                            }
                        })
                    }
                });
            } catch (e) {

            }

        },
    });

}).call(this);
