
var slotsConfig = require('SlotsConfig');

(function () {
    cc.BonusGameStartView = cc.Class({
        "extends": cc.Component,
        properties: {

        },

        onLoad: function() {
            this.animation = this.node.getComponent(cc.Animation);
        },

        onEnable: function () {
            this.node.runAction(
                cc.sequence(
                    cc.callFunc(function() {
                        this.animation.play('bonus');
                    }, this),
                    cc.delayTime(1.5),
                    cc.callFunc(function() {
                        this.animation.play('pingpong');
                        cc.AudioController.getInstance().playSound(cc.AudioTypes.BONUS_START);
                    }, this),
                )
            )
            cc.director.getScheduler().schedule(function () {
                cc.BonusGameController.getInstance().changeView(cc.BonusGameState.PICK);
            }, this, 0, 0, slotsConfig.TIME_WAIT_AUTO_START_BONUS_GAME_GAI_NHAY, false);
        },

        onDisable: function () {
            this.unscheduleAllCallbacks();
        },

        startClicked: function () {
            cc.BonusGameController.getInstance().changeView(cc.BonusGameState.PICK);
        },
    });
}).call(this);

