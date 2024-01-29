/**
 * Created by Nofear on 3/15/2019.
 */


(function () {
    cc.LiveXXTopTipItem = cc.Class({
        "extends": cc.Component,
        properties: {
            bg:cc.Node,
            lbNickName: cc.Label,
            lbTotalWin: cc.Label,
            skeletonTop: sp.Skeleton,
            spriteTop: cc.Sprite
        },

        updateItem: function(item, itemID) {
            this.bg.color = itemID%2==0?cc.Color.BLACK.fromHEX('#160E2A'):cc.Color.BLACK.fromHEX('#4B0087');
            let sfTopTip = cc.LiveXXController.getInstance().getTopTipIcon();
            let skeDataTopTip = cc.LiveXXController.getInstance().getSkeletonTopTipData();
            if (itemID>2) {
                this.spriteTop.spriteFrame = sfTopTip[itemID];
                this.spriteTop.node.active = true;
            }
            else
            {
                this.skeletonTop.node.active = true;
                this.skeletonTop.skeletonData = skeDataTopTip[itemID];
                this.skeletonTop.setAnimation(0,'animation', true);
            }
            this.lbNickName.string = item.DisplayName;
            this.lbTotalWin.string = cc.Tool.getInstance().formatNumber(item.TotalTip);
        },
    });
}).call(this);
