/**
 * Created by Nofear on 3/26/2019.
 */

var slotsConfig = require('SlotsConfig');

(function () {
    cc.CrazyGameView = cc.Class({
        "extends": cc.Component,
        properties: {
            nodeStart: cc.Node,
            nodeCrazyGame: cc.Node,
            nodePick: cc.Node,
            nodeResult: cc.Node,
        },

        onLoad: function () {
            //Khoi tao
            cc.CrazyGameController.getInstance().setCrazyGame(this);
        },

        onEnable: function () {
            cc.AudioController.getInstance().playSound(cc.AudioTypes.CRAZY_GAME);
            this.nodeStart.getComponent(cc.Animation).play('pingpong');
            //lay data cu
            this.changeView(cc.BonusGameState.START);
            cc.director.getScheduler().schedule(function() {
                this.changeView(cc.CrazyGameState.PICK);
            },this, 0, 0, slotsConfig.TIME_WAIT_AUTO_START_BONUS_GAME, false)
        },

        resetTimer: function () {
            this.timer = 0;
        },

        startTimer: function () {
            this.isTimer = true;
        },

        stopTimer: function () {
            this.isTimer = false;
        },

        changeView: function (crazyGameState) {

            switch (crazyGameState) {
                case cc.CrazyGameState.START:
                    this.nodePick.active = false;
                    this.nodeResult.active = false;
                    this.nodeCrazyGame.active = false;

                    this.nodeStart.active = true;
                    break;
                case cc.CrazyGameState.PICK:
                    this.nodeStart.active = false;
                    this.nodeResult.active = false;

                    this.nodeCrazyGame.active = true;
                    this.nodePick.active = true;
                    break;
                case cc.CrazyGameState.RESULT:
                    this.nodeStart.active = false;

                    this.nodeCrazyGame.active = true;
                    this.nodeResult.active = true;
                    break;
            }
        },

        activeButtonQuickPlay: function (enable) {
            this.btnQuickPlay.interactable = enable;
        },

        updateTotalWin: function (totalWin) {
            this.lbiWin.tweenValueto(totalWin);
            this.lblBonusMultiWin.tweenValueto(totalWin);
        },


        //goi khi finish bonus game
        onPlayBonusFinishResponse: function (balance) {
            //update lại balanceUI
            cc.BalanceController.getInstance().updateRealBalance(balance);
            cc.BalanceController.getInstance().updateBalance(balance);

            if (this.isCallAutoBonus) {
                cc.BonusGameController.getInstance().changeView(cc.crazyGameState.RESULT);
            } else {
                cc.director.getScheduler().schedule(function () {
                    cc.BonusGameController.getInstance().changeView(cc.crazyGameState.MULTI);
                }, this, 0, 0, slotsConfig.TIME_WAIT_LAST_STEP, false);
            }
        },
    });
}).call(this);
