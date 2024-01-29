// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        jackpotEffectView:cc.Node,
        jackpotWukongSkeleton:sp.Skeleton,
        jackpotBGSkeleton:sp.Skeleton,
        jackpotWinAmountLabel:cc.LabelIncrement,
        bigWinEffectView:cc.Node,
        bigWinFGSkeleton:sp.Skeleton,
        bigWinBGSkeleton:sp.Skeleton,
        bigWinWinAmountLabel:cc.LabelIncrement,
        ///////////////////////////////////////////
        freeGameEffectView:cc.Node,
        freeGameFGSkeleton:sp.Skeleton,
        freeGameBGSkeleton:sp.Skeleton,
        freeGameWinAmountLabel:cc.LabelIncrement,
        freeGameMultiplier:cc.Animation,
        freeGameMultiplierEffect:sp.Skeleton
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.TayDuThanKhiController.getInstance().setPopUpView(this);
    },

    showPopUpJackPotEffect:function(data)
    {
        this.jackpotEffectView.active = true;
        this.jackpotWinAmountLabel.tweenValue(0,data.JackpotAmount);
        this.jackpotWukongSkeleton.clearTracks();
        this.jackpotWukongSkeleton.setToSetupPose();
        this.jackpotBGSkeleton.clearTracks();
        this.jackpotBGSkeleton.setToSetupPose();
        switch (data.JackpotType) {
            case 1:
                this.jackpotWukongSkeleton.setAnimation(0,'in_minor',false);
                this.jackpotWukongSkeleton.addAnimation(0,'eat_minor',false);
                this.jackpotWukongSkeleton.addAnimation(0,'bite_minor',false);
                this.jackpotWukongSkeleton.addAnimation(0,'idle_minor',true);
                this.jackpotBGSkeleton.setAnimation(0,'Appear_ThangLon',false);
                this.jackpotBGSkeleton.addAnimation(0,'Idle_ThangLon',true);
                break;
            case 2:
                this.jackpotWukongSkeleton.setAnimation(0,'in_major',false);
                this.jackpotWukongSkeleton.addAnimation(0,'eat_major',false);
                this.jackpotWukongSkeleton.addAnimation(0,'bite_major',false);
                this.jackpotWukongSkeleton.addAnimation(0,'idle_major',true);
                this.jackpotBGSkeleton.setAnimation(0,'Appear_ThangCucLon',false);
                this.jackpotBGSkeleton.addAnimation(0,'Idle_ThangCucLon',true);
                break;
            case 3:
                this.jackpotWukongSkeleton.setAnimation(0,'in_grand',false);
                this.jackpotWukongSkeleton.addAnimation(0,'eat_grand',false);
                this.jackpotWukongSkeleton.addAnimation(0,'bite_grand',false);
                this.jackpotWukongSkeleton.addAnimation(0,'idle_grand',true);
                this.jackpotBGSkeleton.setAnimation(0,'Appear_ThangSieuLon',false);
                this.jackpotBGSkeleton.addAnimation(0,'Idle_ThangSieuLon',true);
                break;
        
        }
        
        cc.TayDuThanKhiController.getInstance().sfxJackpotLoop();
        cc.director.getScheduler().schedule(function () {
            cc.TayDuThanKhiController.getInstance().stopJackpotLoop();
        }.bind(this), this,0 , 0, 15, false);
        cc.director.getScheduler().schedule(function () {
            if (cc.TayDuThanKhiController.getInstance().currentBonusData!=null) {
                cc.TayDuThanKhiController.getInstance().openFreeGameView();
            }
            else{
                cc.TayDuThanKhiController.getInstance().playBackGroundMusic(cc.AudioTayDuClipIndex.MAIN_BG_MUSIC);
                cc.TayDuThanKhiController.getInstance().doneAllEffect();
            }
            this.closeAll();
        }.bind(this), this,0 , 0, 18, false);
    },
    showPopUpBigWin:function(type,amount)
    {
        this.bigWinEffectView.active = true;
        this.bigWinWinAmountLabel.tweenValue(0,amount);
        this.bigWinFGSkeleton.clearTracks();
        this.bigWinFGSkeleton.setToSetupPose();
        this.bigWinBGSkeleton.clearTracks();
        this.bigWinBGSkeleton.setToSetupPose();
        switch (type) {
            case 0:
                this.bigWinFGSkeleton.setAnimation(0,'In_ThangLon',false);
                this.bigWinFGSkeleton.addAnimation(0,'Idle_ThangLon',true);
                this.bigWinBGSkeleton.setAnimation(0,'Appear_ThangLon',false);
                this.bigWinBGSkeleton.addAnimation(0,'Idle_ThangLon',true);
                break;
            case 1:
                this.bigWinFGSkeleton.setAnimation(0,'In_ThangCucLon',false);
                this.bigWinFGSkeleton.addAnimation(0,'Idle_ThangCucLon',true);
                this.bigWinBGSkeleton.setAnimation(0,'Appear_ThangCucLon',false);
                this.bigWinBGSkeleton.addAnimation(0,'Idle_ThangCucLon',true);
                break;
            case 0:
                this.bigWinFGSkeleton.setAnimation(0,'In_ThangSieuLon',false);
                this.bigWinFGSkeleton.addAnimation(0,'Idle_ThangSieuLon',true);
                this.bigWinBGSkeleton.setAnimation(0,'Appear_ThangSieuLon',false);
                this.bigWinBGSkeleton.addAnimation(0,'Idle_ThangSieuLon',true);
                break;
        }
        cc.TayDuThanKhiController.getInstance().sfxBigwinLoop();
        cc.director.getScheduler().schedule(function () {
            cc.TayDuThanKhiController.getInstance().sfxStopBigwinLoop();
        }.bind(this), this,0 , 0, 15, false);
        cc.director.getScheduler().schedule(function () {
            cc.TayDuThanKhiController.getInstance().doneAllEffect();
            this.closeAll();
        }.bind(this), this,0 , 0, 18, false);
    },
    showPopUpFreeGameWin:function(multiple,winAmount)
    {
        console.log(multiple);
        this.freeGameEffectView.active = true;
        this.freeGameMultiplier.node.active = true;
        this.freeGameMultiplier.node.setPosition(0,559);
        this.freeGameFGSkeleton.clearTracks();
        this.freeGameFGSkeleton.setToSetupPose();
        this.freeGameBGSkeleton.clearTracks();
        this.freeGameBGSkeleton.setToSetupPose();
        this.freeGameFGSkeleton.setAnimation(0,'In_ThangLon',false);
        this.freeGameFGSkeleton.addAnimation(0,'Idle_ThangLon',true);
        this.freeGameBGSkeleton.setAnimation(0,'Appear_ThangLon',false);
        this.freeGameBGSkeleton.addAnimation(0,'Idle_ThangLon',true);
        cc.director.getScheduler().schedule(function () {
            this.freeGameMultiplier.play('multiplierFG');
            this.freeGameMultiplierEffect.node.active = true;
            cc.TayDuThanKhiController.getInstance().playEffect(cc.AudioTayDuClipIndex.SOUND_FREE_GAME_MULTIPLY,false,1);
            this.freeGameMultiplierEffect.clearTracks();
            this.freeGameMultiplierEffect.setToSetupPose();
            this.freeGameMultiplierEffect.setCompleteListener(()=>{
                this.freeGameMultiplier.node.active = false;
                this.freeGameFGSkeleton.setAnimation(0,'In_ThangCucLon',false);
                this.freeGameFGSkeleton.addAnimation(0,'Idle_ThangCucLon',true);
                this.freeGameBGSkeleton.setAnimation(0,'Appear_ThangCucLon',false);
                this.freeGameBGSkeleton.addAnimation(0,'Idle_ThangCucLon',true);
                cc.director.getScheduler().schedule(function () {
                    if (multiple>1) {
                        this.freeGameFGSkeleton.setAnimation(0,'In_ThangSieuLon',false);
                        this.freeGameFGSkeleton.addAnimation(0,'Idle_ThangSieuLon',true);
                        this.freeGameBGSkeleton.setAnimation(0,'Appear_ThangSieuLon',false);
                        this.freeGameBGSkeleton.addAnimation(0,'Idle_ThangSieuLon',true);
                    }
                }.bind(this), this,0 , 0, 1, false);
            })
            this.freeGameMultiplierEffect.addAnimation(0,'Total_Win',false);
            this.freeGameWinAmountLabel.tweenValue(0,winAmount);
        }.bind(this), this,0 , 0, 0.5, false);
        cc.TayDuThanKhiController.getInstance().sfxBigwinLoop();
        cc.director.getScheduler().schedule(function () {
            cc.TayDuThanKhiController.getInstance().sfxStopBigwinLoop();
        }.bind(this), this,0 , 0, 15, false);
        cc.director.getScheduler().schedule(function () {
            cc.TayDuThanKhiController.getInstance().closeFreeGameView();
            cc.TayDuThanKhiController.getInstance().playBackGroundMusic(cc.AudioTayDuClipIndex.MAIN_BG_MUSIC);
            cc.TayDuThanKhiController.getInstance().doneAllEffect();
            this.closeAll();
        }.bind(this), this,0 , 0, 18, false);
    },
    showPopUpMiniMessage:function(message)
    {

    },
    showPopUpNotify:function(message)
    {
        
    },
    closeAll:function()
    {
        this.jackpotEffectView.active = false;
        this.bigWinEffectView.active = false;
        this.freeGameEffectView.active = false;
    }
    // update (dt) {},
});
