/*
 * Generated by BeChicken
 * on 11/6/2019
 * version v1.0
 */
(function () {
    cc.TKEffectView = cc.Class({
        extends: cc.EffectView,
        properties: {
            nodeFreeSpinNoti: cc.Node,
        },

        onLoad: function () {
            this._super();
            this.scheduler = cc.director.getScheduler();
            this.animationFreeSpinNoti = this.nodeFreeSpinNoti.getComponent(cc.Animation);
        },

        playEffect: function (effectType, totalWin, tweenTime) {
            this.nodeJackpot.active = false;
            this.nodeBigWin.active = false;
            this.nodeNormalWin.active = false;
            this.nodeFreeSpinNoti.active = false;
            switch (effectType)  {
                case cc.EffectType.JACKPOT:
                    this.nodeJackpot.active = true;
                    this.animationJackpot.play('tkopenWinFx');
                    this.particleJackpot.resetSystem();
                    this.lbiTotalWins[0].setValue(0);
                    this.lbiTotalWins[0].tweenValueto(totalWin, tweenTime);
                    cc.AudioController.getInstance().playSound(cc.AudioTypes.WIN_JACKPOT);
                    cc.AudioController.getInstance().playSound(cc.AudioTypes.PLAY_COUNT);
                    this.scheduler.schedule(function () {
                        cc.AudioController.getInstance().stopSound(cc.AudioTypes.PLAY_COUNT);
                    }, this, 0, 0, tweenTime, false);
                    break;
                case cc.EffectType.BIG_WIN:
                    cc.AudioController.getInstance().playSound(cc.AudioTypes.PLAY_COUNT);
                    this.scheduler.schedule(function () {
                        cc.AudioController.getInstance().stopSound(cc.AudioTypes.PLAY_COUNT);
                    }, this, 0, 0, tweenTime, false);
                    this.nodeBigWin.active = true;
                    this.animationBigWin.play('tkopenWinFx');
                    this.particleBigWin.resetSystem();
                    this.lbiTotalWins[1].setValue(0);
                    this.lbiTotalWins[1].tweenValueto(totalWin, tweenTime);
                    break;
                case cc.EffectType.NORMAL_WIN:
                    this.nodeNormalWin.active = true;
                    this.animationWin.play('openWinFx');
                    this.particleWin.resetSystem();
                    this.lbiTotalWins[2].setValue(0);
                    this.lbiTotalWins[2].tweenValueto(totalWin, tweenTime);
                    break;
                case cc.EffectType.FREE_SPIN_NOTI:
                    this.nodeFreeSpinNoti.active = true;
                    this.animationFreeSpinNoti.play('tkopenFreeSpin');
                    this.scheduler.schedule(function () {
                        this.nodeFreeSpinNoti.active = false;
                    }, this, 0, 0, tweenTime - 0.2, false);

                    break;    
            }
            this.nodeEffect.active = true;
        },


    })
}).call(this);