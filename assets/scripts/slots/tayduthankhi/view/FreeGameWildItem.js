// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

(function () {
    cc.FreeGameWildItem = cc.Class({
    extends: cc.Component,

    properties: {
        wildSpine:sp.Skeleton,
        appearEffect:sp.Skeleton,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.wildSpine.node.active = false;
        this.appearEffect.node.active = false;
    },
    playAnim:function()
    {
        this.appearEffect.node.active = true;
        this.wildSpine.node.active = false;
        this.appearEffect.clearTracks();
        this.appearEffect.setToSetupPose();
        this.appearEffect.setCompleteListener(()=>{
            if (this.appearEffect.animation=='Frame_In') {
                
        cc.TayDuThanKhiController.getInstance().playEffect(cc.AudioTayDuClipIndex.SOUND_WILD_ACTIVE,false,1);
                this.wildSpine.node.active = true;
                this.wildSpine.clearTracks();
                this.wildSpine.setToSetupPose();
                this.wildSpine.setCompleteListener(()=>{
                    if (this.wildSpine.animation=='In_Wild') {
                        cc.TayDuThanKhiController.getInstance().stopSpinFreeGame();
                    }
                });
                this.wildSpine.addAnimation(0,'In_Wild',false);
                this.wildSpine.addAnimation(0,'Static',false);
                this.wildSpine.addAnimation(0,'Idle',true);
                this.appearEffect.node.active = false;
            }
        });
        this.appearEffect.addAnimation(0,'Frame_In',false);
        
        cc.TayDuThanKhiController.getInstance().playEffect(cc.AudioTayDuClipIndex.SOUND_WILD_APPEAR,false,1);
        
    },
    reset:function()
    {
        this.wildSpine.node.active = false;
        // this.appearEffect.node.active = false;
    }
});
}).call(this);
