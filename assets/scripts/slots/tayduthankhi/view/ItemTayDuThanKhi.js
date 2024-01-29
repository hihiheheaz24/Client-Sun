/**
 * Created by Nofear on 6/7/2017.
 */


(function () {
    cc.ItemTayDuThanKhi = cc.Class({
        "extends": cc.Component,
        properties: {
            symbolSkeleton:sp.Skeleton
        },

        playStatic:function(SymbolID)
        {
            this.symbolSkeleton.clearTracks();
            this.symbolSkeleton.setToSetupPose();
            
            if (SymbolID==0||SymbolID==1) {
                this.symbolSkeleton.setAnimation(0,'Idle',true)
            }
            else this.symbolSkeleton.setAnimation(0,'Static',false)
        },
        playWin:function()
        {
            this.symbolSkeleton.clearTracks();
            this.symbolSkeleton.setToSetupPose();
            this.symbolSkeleton.setAnimation(0,'Win',false)
            this.symbolSkeleton.addAnimation(0,'Idle',true,0);
        }
    });
}).call(this);
