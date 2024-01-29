
var slotsConfig = require('SlotsConfig');

(function () {
    cc.CrazyGamePickView = cc.Class({
        "extends": cc.Component,
        properties: {
            btnPicks: [cc.Button],
            sprIconData: [cc.SpriteFrame],

            lblMultiplier: cc.Label,
            lbiWin: cc.LabelIncrement,

            _currentStep: 0,
            _crazyResponse: null,
        },

        onLoad: function () {
            var self = this;
            this.sprites = [];
            this.btnPicks.forEach(function (btnPick) {
                self.sprites.push(btnPick.node.getComponent(cc.Sprite));
            })
        },

        onEnable: function () {
            //start timer
            this._crazyResponse = cc.CrazyGameController.getInstance().getData();
            cc.CrazyGameController.getInstance().updateTotalWin(this._crazyResponse.TotalWin);
            cc.CrazyGameController.getInstance().updateMultiplierCrazy(this._crazyResponse.MultiplierCrazy);
            cc.CrazyGameController.getInstance().updateTotalMultiplier(this._crazyResponse.TotalMultiplier);
            cc.CrazyGameController.getInstance().updateAmountWin(this._crazyResponse.TotalAmount);
            this._currentStep = 0;
        },

        pickClicked: function (event, data) {
            let isEnded = false;
            this._currentStep++;
            var self = this;
            //Kho ca cac cho pick khac
            this.btnPicks.forEach(function (btnPick) {
                if (btnPick !== null) {
                    btnPick.interactable = false;
                }
            });
            //send request Hub
            this.position = parseInt(data.toString());

            //chuyen sang index
            var indexPick = this.position - 1;
            //lay du lieu
            let crazySteps = this._crazyResponse.Steps;
            if(this._currentStep > crazySteps.length) {
                return;
            }
            let itemID = crazySteps[this._currentStep - 1].ItemID;
            var pickValue = crazySteps[this._currentStep - 1].WinAmount;
            var pickMultiplier = crazySteps[this._currentStep - 1].Multiplier;
            //tam bo sprite card de chay animtion
            
            let duration = slotsConfig.TIME_ANIMATION_OPEN_CARD;
            const dur = duration / 8;
            const distance = 5;
            this.tweenShake = cc.tween(this.btnPicks[indexPick].node)
                .by(dur, { position: cc.v2(0, distance) })
                .by(dur, { position: cc.v2(0, -distance) })
                .by(dur, { position: cc.v2(0, -distance) })
                .by(dur, { position: cc.v2(0, distance) })
                .by(dur, { position: cc.v2(distance, 0) })
                .by(dur, { position: cc.v2(-distance, 0) })
                .by(dur, { position: cc.v2(-distance, 0) })
                .by(dur, { position: cc.v2(distance, 0) })
                .start();
            cc.director.getScheduler().schedule(function () {
                self.btnPicks[indexPick].node.getComponent(cc.Sprite).spriteFrame = self.sprIconData[itemID - 1];
                this.lblMultiplier.string = pickMultiplier;
                //choi tiep duoc -> Cho Pick tiep
                self.btnPicks.forEach(function (btnPick) {
                    if (btnPick !== null) {
                        btnPick.interactable = true;
                    }
                });
                self.btnPicks[indexPick].interactable = false;
                //set tien
                self.lbiWin.tweenValueto(pickValue);
                //update lai tong so tien thang UI
                // cc.AudioController.getInstance().playSound(cc.AudioTypes.BONUS_WIN);
                this.tweenShake && this.tweenShake.stop();
            }, this, 0, 0, duration, false);

            if(this._currentStep === this._crazyResponse.Steps.length) {
                isEnded = true;
                self.btnPicks.forEach(function (btnPick) {
                    if (btnPick !== null) {
                        btnPick.interactable = false;
                    }
                });
            }

            if(isEnded) {
                cc.director.getScheduler().schedule(function () {
                    cc.CrazyGameController.getInstance().changeView(cc.BonusGameState.RESULT);
                }, this, 0, 0, slotsConfig.TIME_WAIT_MULTIPLIER, false);
            }
        },

        playAnimationBalloonAndMove(currentNode, destNode) {
            currentNode.runAction(
                cc.spawn(
                    cc.scaleTo(0.4, 0),
                    cc.moveTo(0.4, cc.v2(destNode.x, destNode.y))
                ));
        },
    });
}).call(this);
