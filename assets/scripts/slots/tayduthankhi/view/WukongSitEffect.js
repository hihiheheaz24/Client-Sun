// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

(function () {
    cc.WukongSitEffect = cc.Class({
    extends: cc.Component,

    properties: {
        wukongSpine:sp.Skeleton,
        expandRowEffect:sp.Skeleton,
        powerUpEffect:sp.Skeleton,
        holoSkeleton:sp.Skeleton,
        topFrameSprite:[cc.Node],
    },
    onLoad ()
    {
        this.anim = this.node.getComponent(cc.Animation);
        this.expandRowEffect.node.active = false;
        this.RowExpanded = 0;
        this.PowerCount = 0;
    },
    activeEffect:function (numberRow,rowExpanded) {
        this.RowExpanded+=numberRow;
        cc.TayDuThanKhiController.getInstance().playEffect(cc.AudioTayDuClipIndex.SOUND_LIFT1,false,1);
        if (rowExpanded==0) {
            switch (numberRow) {
                case 1:
                    this.anim.play('wukongUp1');
                    break;
                case 2:
                    this.anim.play('wukongUp2');  
                    break;
                case 3:
                    this.anim.play('wukongUp3');
                    break;
            }
        }
        if (rowExpanded==1) {
            if (numberRow==1) {
                this.anim.play('wukongUp1to2');
            }
            if (numberRow==2) {
                this.anim.play('wukongUp1to3');
            }
        }
        if (rowExpanded==2) {
            if (numberRow==1) {
                this.anim.play('wukongUp2to3');
            }
        }
    },
    backIdle:function () {
        
        if (this.RowExpanded>0) {
            switch (this.RowExpanded) {
            case 1:
                this.anim.play('wukongDown1');
                break;
            case 2:
                this.anim.play('wukongDown2');
                break;
            case 3:
                this.anim.play('wukongDown3');
                break;
            }
            cc.TayDuThanKhiController.getInstance().playEffect(cc.AudioTayDuClipIndex.SOUND_WUKONG_LANDING,false,1);
            if (this.RowExpanded==3) {
                this.topFrameSprite[0].active = true;
                this.topFrameSprite[1].active = false;
                this.holoSkeleton.clearTracks();
                this.holoSkeleton.setToSetupPose();
                this.holoSkeleton.setAnimation(0,'Appear',false);
                this.holoSkeleton.addAnimation(0,'Face_Spin',false);
                this.holoSkeleton.addAnimation(0,'Idle',true);
            }
            this.RowExpanded = 0;
            this.PowerCount = 0;
        }
        
    },
    flyUp:function(pos)
    {
        this.expandRowEffect.node.active = true;
        switch (pos) {
            case 1:
                this.fly1();
                break;
            case 2:
                this.fly2();
                break;
            case 3:
                this.fly3();
                break;
            case 13:
                this.fly1to3();
                break;
            case 23:
                this.fly2to3();
                break;
            case 12:
                this.fly1to2();
                break;
        }
    },
    landing:function(pos)
    {
        cc.TayDuThanKhiController.getInstance().showScatterEffect();
        switch (pos) {
            case 1:
                this.landing1();
                break;
            case 2:
                this.landing2();
                break;
            case 3:
                this.landing3();
                break;
        }
    },
    fallingDown:function()
    {
        this.wukongSpine.clearTracks();
        this.wukongSpine.setToSetupPose();
        this.wukongSpine.setAnimation(0,'idle',true);    
    },
    standIdle:function()
    {
        // this.wukongSpine.clearTracks();
        // this.wukongSpine.setToSetupPose();
        // this.wukongSpine.setAnimation(0,'idle',true);
    },
    fly1:function()
    {
        this.expandRowEffect.clearTracks();
        this.expandRowEffect.setToSetupPose();
        this.expandRowEffect.node.setPosition(0,60);
        this.expandRowEffect.setAnimation(0,'Row_1',false);
        this.wukongSpine.clearTracks();
        this.wukongSpine.setToSetupPose();
        this.wukongSpine.addAnimation(0,'stand_up1',false);
        // this.wukongSpine.addAnimation(0,'back_idle1',false);
        // this.wukongSpine.addAnimation(0,'stand_up1_loop',true);   
     },
    fly2:function()
    {
        this.expandRowEffect.clearTracks();
        this.expandRowEffect.setToSetupPose();
        this.expandRowEffect.node.setPosition(0,120);
        this.expandRowEffect.setAnimation(0,'Row_2',false);
        this.wukongSpine.clearTracks();
        this.wukongSpine.setToSetupPose();
        this.wukongSpine.addAnimation(0,'stand_up2',false);
        // this.wukongSpine.addAnimation(0,'back_idle2',false);

    },
    fly3:function()
    {
        this.expandRowEffect.clearTracks();
        this.expandRowEffect.setToSetupPose();
        this.expandRowEffect.node.setPosition(0,180);
        this.expandRowEffect.setAnimation(0,'Row_3',false);
        this.wukongSpine.clearTracks();
        this.wukongSpine.setToSetupPose();
        this.wukongSpine.setAnimation(0,'stand_up3',false);
    },
    fly1to2:function()
    {
        this.expandRowEffect.clearTracks();
        this.expandRowEffect.setToSetupPose();
        this.expandRowEffect.node.setPosition(0,180);
        this.expandRowEffect.setAnimation(0,'Row_1',false);
        this.wukongSpine.clearTracks();
        this.wukongSpine.setToSetupPose();
        this.wukongSpine.addAnimation(0,'stand_up2',false);

        // this.wukongSpine.addAnimation(0,'back_idle2',false);

    },
    fly2to3:function()
    {
        this.expandRowEffect.clearTracks();
        this.expandRowEffect.setToSetupPose();
        this.expandRowEffect.node.setPosition(0,300);
        this.expandRowEffect.setAnimation(0,'Row_1',false);
        this.wukongSpine.clearTracks();
        this.wukongSpine.setToSetupPose();
        this.wukongSpine.setAnimation(0,'stand_up3',false);
    },
    fly1to3:function()
    {
        this.expandRowEffect.clearTracks();
        this.expandRowEffect.setToSetupPose();
        this.expandRowEffect.node.setPosition(0,240);
        this.expandRowEffect.setAnimation(0,'Row_2',false);
        this.wukongSpine.clearTracks();
        this.wukongSpine.setToSetupPose();
        this.wukongSpine.setAnimation(0,'stand_up3',false);
    },
    landing1:function()
    {
        // this.wukongSpine.clearTracks();
        // this.wukongSpine.setToSetupPose();
        this.wukongSpine.addAnimation(0,'stand_up1_loop',true);
    },
    landing2:function()
    {
        // this.wukongSpine.clearTracks();
        // this.wukongSpine.setToSetupPose();
        this.wukongSpine.addAnimation(0,'stand_up2_loop',true);
    },
    landing3:function()
    {
        // this.wukongSpine.clearTracks();
        // this.wukongSpine.setToSetupPose();
        this.wukongSpine.addAnimation(0,'fly_up',false);
        this.holoSkeleton.clearTracks();
        this.holoSkeleton.setToSetupPose();
        this.holoSkeleton.setAnimation(0,'Explode',false);
        this.topFrameSprite[0].active = false;
        this.topFrameSprite[1].active = true;
    },
    powerUp:function()
    {
        cc.TayDuThanKhiController.getInstance().playEffect(cc.AudioTayDuClipIndex.SOUND_SCATTER_HIT_WUKONG,false,1);
        cc.director.getScheduler().schedule(function () {
            cc.TayDuThanKhiController.getInstance().playEffect(cc.AudioTayDuClipIndex.SOUND_WUKONG_POWER_UP,false,1);
        }.bind(this), this,0 , 0, 0.5, false);
        this.PowerCount+=1;
        switch (this.PowerCount) {
            case 1:
                this.powerUp1();
                break;
            case 2:
                this.powerUp2();
                break;
            case 3:
                this.powerUp3();
                break;
        }
    },
    powerUp1:function()
    {
        
        this.powerUpEffect.clearTracks();
        this.powerUpEffect.setToSetupPose();
        this.powerUpEffect.setAnimation(0,'Light_Wild_WuKong',false);
        this.wukongSpine.clearTracks();
        this.wukongSpine.setToSetupPose();
        this.wukongSpine.setAnimation(0,'next_power_up2',false);
        this.wukongSpine.addAnimation(0,'power_up1',false);
        this.wukongSpine.addAnimation(0,'power_up1_loop',true);
    },
    powerUp2:function()
    {
        this.powerUpEffect.clearTracks();
        this.powerUpEffect.setToSetupPose();
        this.powerUpEffect.setAnimation(0,'Light_Wild_WuKong',false);
        this.wukongSpine.clearTracks();
        this.wukongSpine.setToSetupPose();
        this.wukongSpine.setAnimation(0,'next_power_up3',false);
        this.wukongSpine.addAnimation(0,'power_up2',false);
        this.wukongSpine.addAnimation(0,'power_up2_loop',true);

    },
    powerUp3:function()
    {
        this.powerUpEffect.clearTracks();
        this.powerUpEffect.setToSetupPose();
        this.powerUpEffect.setAnimation(0,'Light_Wild_WuKong',false);
        this.wukongSpine.clearTracks();
        this.wukongSpine.setToSetupPose();
        this.wukongSpine.setAnimation(0,'next_power_up3',false);
        this.wukongSpine.addAnimation(0,'power_up3',false);
        this.wukongSpine.addAnimation(0,'power_up3_loop',true);

    }
});
}).call(this);
