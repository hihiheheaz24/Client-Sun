/**
 * Created by Nofear on 3/15/2019.
 */


(function () {
    cc.Xeng777TopItem = cc.Class({
        "extends": cc.Component,
        properties: {
            nodeBG: cc.Node,
            lbRank: cc.Label,
            lbNickName: cc.Label,
            lbTotalWin: cc.Label,
            rankSprite: cc.Sprite,
            rankSfs: [cc.SpriteFrame]
        },

        updateItem: function (item, itemID) {
            this.nodeBG.active = itemID % 2 !== 0;
            if (itemID<3)
            {
                this.rankSprite.spriteFrame = this.rankSfs[itemID];
                this.rankSprite.node.active = true;
                this.lbRank.node.active = false;
            }
            else {
                this.lbRank.string = itemID + 1;
            }
            this.lbNickName.string = item.DisplayName;
            this.lbTotalWin.string = cc.Tool.getInstance().formatNumber(item.Award);
            this.item = item;
            this.itemID = itemID;
        },
    });
}).call(this);