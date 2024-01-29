
var slotsConfig = require('SlotsConfig');

(function () {
    cc.BonusGamePickView = cc.Class({
        "extends": cc.Component,
        properties: {
            btnPicks: [cc.Button],
            lbiPrizes: [cc.LabelIncrement],
            fakeLbiPrizes: [cc.LabelIncrement],
            lightBalloonTouch: [cc.Node],
            // cardSkeletons: [sp.Skeleton],
            nodeLayoutBalloon: cc.Node,
            nodeLblTotalWin: cc.Node,
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
            cc.BonusGameController.getInstance().startTimer();

            var bonusResponse = cc.BonusGameController.getInstance().getData();
            var currentStep = bonusResponse.CurrentStep;

            //Da pick 1 lan roi moi can setup
            if (currentStep >= 1) {
                this.nodeLayoutBalloon.runAction(cc.moveTo(1.5, cc.v2(0,0)));
                var position = bonusResponse.Position;
                var bonusData = bonusResponse.BonusData;

                var self = this;
                var indexData = 0;
                //Kiem tra da chon o vi tri nao
                var posStr = position.substring(0, position.length - 1); //cat dau , o cuoi
                var pickPos = cc.Tool.getInstance().convertStringArrayToIntArray(posStr);

                pickPos.forEach(function (pos) {
                    var index = pos - 1;
                    self.btnPicks[index].interactable = false;

                    //remove button da pick
                    self.btnPicks[index] = null;

                    self.sprites[index].spriteFrame = null;
                    //set tien
                    self.lbiPrizes[index].tweenValueto(bonusData[indexData].PrizeValue);
                    indexData++;
                })
            } else {
                this.nodeLayoutBalloon.runAction(cc.moveTo(1.5, cc.v2(0,0)));
            }
        },

        pickClicked: function (event, data) {
            var self = this;

            cc.AudioController.getInstance().playSound(cc.AudioTypes.BONUS_CLICK);

            //reset timer
            cc.BonusGameController.getInstance().resetTimer();

            //pick 1 phat -> khoa nut pick
            cc.BonusGameController.getInstance().activeButtonQuickPlay(false);
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

            //remove button da pick
            this.btnPicks[indexPick] = null;
            this.lightBalloonTouch[indexPick].getComponent(cc.Animation).play('balloon_touch');
            //Lay ve step hien tai
            var currentStep = cc.BonusGameController.getInstance().getCurrentStep();
            currentStep+=1;

            //GOi len hub
            cc.RoomController.getInstance().sendRequestOnHub(cc.MethodHubName.PLAY_BONUS, currentStep, this.position);

            //set lai current step
            cc.BonusGameController.getInstance().setCurrentStep(currentStep);

            //lay du lieu
            var bonusResponse = cc.BonusGameController.getInstance().getData();
            var bonusData = bonusResponse.BonusData;

            var pickValue = bonusData[currentStep - 1].PrizeValue;

            //tam bo sprite card de chay animtion
            this.sprites[indexPick].spriteFrame = null;

            //xu ly do hoa khi thang / thua
            if (pickValue > 0) {
                //chat animation open
                // this.cardSkeletons[indexPick].node.active = true;

                cc.director.getScheduler().schedule(function () {
                    //chay xong animation thi an di
                    // self.cardSkeletons[indexPick].node.active = false;

                    // self.sprites[indexPick].spriteFrame = self.sfPicked;
                    //choi tiep duoc -> Cho Pick tiep
                    self.btnPicks.forEach(function (btnPick) {
                        if (btnPick !== null) {
                            btnPick.interactable = true;
                        }

                    });
                    //set tien
                    self.lbiPrizes[indexPick].label.string = cc.Tool.getInstance().formatNumber(pickValue);
                    self.fakeLbiPrizes[indexPick].label.string = cc.Tool.getInstance().formatNumber(pickValue);
                    self.playAnimationBalloonAndMove(self.fakeLbiPrizes[indexPick].node, self.nodeLblTotalWin);
                    var totalWin = cc.BonusGameController.getInstance().getTotalWin();
                    totalWin = totalWin + pickValue;

                    //update lai tong so tien thang UI
                    cc.BonusGameController.getInstance().updateTotalWin(totalWin);

                    // cc.AudioController.getInstance().playSound(cc.AudioTypes.BONUS_WIN);
                }, this, 0, 0, slotsConfig.TIME_ANIMATION_OPEN_CARD, false);

                //bat nut QuickPlay len
                cc.BonusGameController.getInstance().activeButtonQuickPlay(true);

            } else {
                //chat animation open
                // this.cardSkeletons[indexPick].node.active = true;

                cc.director.getScheduler().schedule(function () {
                    //chay xong animation thi an di
                    // self.cardSkeletons[indexPick].node.active = false;

                    //gan sprite pick truot
                    // self.sprites[indexPick].spriteFrame = self.sfMiss;

                    // cc.AudioController.getInstance().playSound(cc.AudioTypes.BONUS_MISS);
                }, this, 0, 0, slotsConfig.TIME_ANIMATION_OPEN_CARD, false);

                //Pick truot -> se tu ban ve UpdateUserBalance -> xu ly tiep o BonusGameView
            }


        },

        playAnimationBalloonAndMove(currentNode, destNode) {
            currentNode.runAction(cc.sequence(
                cc.spawn(
                    cc.scaleTo(0.4, 0.8),
                    cc.moveTo(0.4, cc.v2(destNode.x, destNode.y)),
                ),
                cc.callFunc(() => {
                    currentNode.scale = 0;
                }))
            );
        },
    });
}).call(this);
