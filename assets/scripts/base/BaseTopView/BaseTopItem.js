cc.Class({
    extends: cc.Component,
    properties: {
        lbRank: cc.Label,
        lbNickName: cc.Label,
        lbTotalWin: cc.Label,
        spriteTop: cc.Sprite,
        spTop: [cc.SpriteFrame],
        sfsBg: [cc.SpriteFrame],
        bgSprite: cc.Sprite,
    },

    updateItem: function(item, itemID) {
        this.bgSprite.spriteFrame = this.sfsBg[itemID % 2];
        if(itemID < 3) {
            this.lbRank.node.active = false;
            this.spriteTop.node.active = true;
            this.spriteTop.spriteFrame = this.spTop[itemID];
        }else {
            this.lbRank.node.active = true;
            this.spriteTop.node.active = false;
            this.lbRank.string = itemID + 1;
        }

        this.lbNickName.string = item.DisplayName;
        this.lbTotalWin.string = cc.Tool.getInstance().formatNumber(item.Award);

        this.item = item;
        this.itemID = itemID;
    }
});