
var slotsConfig = require('SlotsConfig');

(function () {
    cc.BonusGameMultiView = cc.Class({
        "extends": cc.Component,
        properties: {
            btnPicks: [cc.Button],
            // lblDoors: [cc.Label],
            // nodeDoors: [cc.Node],
            spriteResults : [cc.Sprite],
            sfMultipliers : [cc.SpriteFrame]
        },

        onEnable: function () {
            //start timer
            cc.BonusGameController.getInstance().startTimer();
            this.btnPicks.forEach(function (btnPick) {
                btnPick.interactable = true;
                btnPick.node.getChildByName("LIGHT").active = false;
            });

            this.spriteResults.forEach(function (spriteResult) {
                spriteResult.node.active = false;
            });
        },

        pickClicked: function (event, data) {
            let self = this;
            //reset timer
            cc.BonusGameController.getInstance().resetTimer();

            //pick 1 phat -> khoa nut pick
            cc.BonusGameController.getInstance().activeButtonQuickPlay(false);
            //Kho ca cac cho pick khac
            this.btnPicks.forEach(function (btnPick) {
                btnPick.interactable = false;
            });

            //send request Hub
            this.position = parseInt(data.toString());

            //
            // cc.RoomController.getInstance().sendRequestOnHub(cc.MethodHubName.PLAY_BONUS, 2, this.position);

            //Lay du lieu
            var bonusResponse = cc.BonusGameController.getInstance().getData();
            var multiplier = bonusResponse.Multiplier;

            var totalWin = cc.BonusGameController.getInstance().getTotalWin();
            totalWin *= multiplier;

            //update lai tong so tien thang UI
            cc.BonusGameController.getInstance().updateTotalWin(totalWin);

            //gan anh tuong ung giai thuong
            var sprite = this.spriteResults[this.position - 1];
            sprite.node.active = true;
            sprite.spriteFrame = this.sfMultipliers[multiplier - 1];
            this.btnPicks[this.position - 1].node.getChildByName("LIGHT").active = true;


            // let unOpenPosition = [];
            // let multiplierArr = [];
            // for(let i = 0; i< this.nodeDoors.length; i++) {
            //     unOpenPosition.push(i);
            //     multiplierArr.push(i + 1);
            // }
            // let lblMultiplier = this.lblDoors[this.position - 1];
            // lblMultiplier.string = `X${multiplier}`;
            // unOpenPosition = unOpenPosition.filter(element => element !== this.position - 1);
            // multiplierArr = multiplierArr.filter(mul => mul !== multiplier);
            // lblMultiplier.node.runAction(cc.sequence(
            //     cc.moveTo(0.7, cc.v2(lblMultiplier.node.x, 130)),
            //     cc.delayTime(0.5),
            //     cc.callFunc(function() {
            //         unOpenPosition.forEach((pos, index) => {
            //             this.lblDoors[pos].string = `X${multiplierArr[index]}`;
            //             this.lblDoors[pos].node.runAction(cc.moveTo(0.7, cc.v2(this.lblDoors[pos].node.x, 130)));
            //             this.nodeDoors[pos].opacity = 120;
            //         });
            //     }, self)
            // ));

            cc.director.getScheduler().schedule(function () {
                cc.BonusGameController.getInstance().changeView(cc.BonusGameState.RESULT);
            }, this, 0, 0, slotsConfig.TIME_WAIT_MULTIPLIER, false);

            //Chuyen qua man ket qua
            //cc.BonusGameController.getInstance().changeView(cc.BonusGameState.MULTI);
        },
    });
}).call(this);
