
var slotsConfig = require('SlotsConfig');

(function () {
    cc.CrazyGameResultView = cc.Class({
        "extends": cc.Component,
        properties: {
            lbResult: cc.Label,
        },

        onEnable: function () {
            let totalMultiplier = cc.CrazyGameController.getInstance().getTotalMultiplier();
            let totalCrazyMultiplier = cc.CrazyGameController.getInstance().getMultiplierCrazy();
            let totalWin = cc.CrazyGameController.getInstance().getTotalWin();
            let totalAmountIconWin = cc.CrazyGameController.getInstance().getAmountWin();

            this.lbResult.string = `${cc.Tool.getInstance().formatNumber(totalAmountIconWin)} x ${totalMultiplier} x ${totalCrazyMultiplier} = ${cc.Tool.getInstance().formatNumber(totalWin)}`;

            cc.director.getScheduler().schedule(function () {
                cc.GaiNhayController.getInstance().updateIconDataCrazy([]);
                cc.SpinController.getInstance().activeButtonSpin(true);
                cc.SpinController.getInstance().resumeAutoSpin();
                cc.SpinController.getInstance().updateTotalWinFromBonus(cc.CrazyGameController.getInstance().getTotalWin());
                cc.MainController.getInstance().destroyCrazyGameView();
            }, this, 0, 0, slotsConfig.TIME_WAIT_AUTO_CLOSE_BONUS_GAME, false);
        },

        onDisable: function () {
            this.unscheduleAllCallbacks();
        },

        closeClicked: function () {
            cc.GaiNhayController.getInstance().updateIconDataCrazy([]);
            cc.SpinController.getInstance().resumeAutoSpin();
            cc.SpinController.getInstance().updateTotalWinFromBonus(cc.CrazyGameController.getInstance().getTotalWin());
            cc.MainController.getInstance().destroyCrazyGameView();
            cc.SpinController.getInstance().activeButtonSpin(true);
        },
    });
}).call(this);

