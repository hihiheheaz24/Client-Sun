/**
 * Created by Nofear on 6/7/2017.
 */


(function () {
cc.ItemEffectTayDuThanKhi = cc.Class({
    "extends": cc.Component,
    properties: {
        symbolSkeleton:sp.Skeleton,
        winBGSkeleton:sp.Skeleton,
        winFGSkeleton:sp.Skeleton,
        itemID:1
    },
    playWin:function(type)
    {
        this.symbolSkeleton.clearTracks();
        this.symbolSkeleton.setToSetupPose();
        this.winBGSkeleton.clearTracks();
        this.winBGSkeleton.setToSetupPose();
        this.winFGSkeleton.clearTracks();
        this.winFGSkeleton.setToSetupPose();
        switch (type) {
            case 'loss':
                if (this.itemID==1||this.itemID==3) {
                    this.symbolSkeleton.setAnimation(0,'Idle',true);
                    this.winBGSkeleton.setAnimation(0,'Frame_Idle',true)
                    // this.winFGSkeleton.setAnimation(0,'Select_Idle',true);
                }
                else
                {
                    this.winBGSkeleton.setAnimation(0,'Symbols_bg idle_B1');
                    this.winFGSkeleton.setAnimation(0,'Select_Idle',true);
                    this.symbolSkeleton.setAnimation(0,'Static',false);
                }
                break;
            case 'win':
                if (this.itemID==1||this.itemID==3) {
                    this.winBGSkeleton.setAnimation(0,'Frame_Idle')
                    this.winFGSkeleton.setAnimation(0,'Frame_Win',true);
                }
                else
                {
                    this.winBGSkeleton.setAnimation(0,'Symbols_bg idle_B2');
                    this.winFGSkeleton.setAnimation(0,'Select_Win',true);
                }
                this.symbolSkeleton.setAnimation(0,'Idle',true);
                break;
            case 'bigWin':
                if (this.itemID==1||this.itemID==3) {
                    this.winBGSkeleton.setAnimation(0,'Frame_Idle')
                    this.winFGSkeleton.setAnimation(0,'Frame_BigWin',true);
                }
                else
                {
                    this.winBGSkeleton.setAnimation(0,'Symbols_bg idle_B3');
                    this.winFGSkeleton.setAnimation(0,'Select_BigWin',true);
                }
                this.symbolSkeleton.setAnimation(0,'Win',false)
                this.symbolSkeleton.addAnimation(0,'Idle',true,0);
                break;
        }
    },
    setSymBolSkeletonData:function(skeletonData)
    {
        this.symbolSkeleton.skeletonData = skeletonData;
    }
});
}).call(this);
