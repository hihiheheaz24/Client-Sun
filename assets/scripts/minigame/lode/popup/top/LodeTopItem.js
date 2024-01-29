cc.Class({
    extends: require("BaseTopItem"),

    updateItem: function(item, itemID) {
        if (!item) return;
        const nickName = item.DisplayName || item.UserName;
        const totalWin = item.Profit || item.Award || item.TotalAwardValue;
        if (!nickName || !totalWin) return;
        this.bgSprite.spriteFrame = this.sfsBg[itemID % 2];
        if (itemID < 3) {
            this.lbRank.node.active = false;
            this.spriteTop.node.active = true;
            this.spriteTop.spriteFrame = this.spTop[itemID];
        } else {
            this.lbRank.node.active = true;
            this.spriteTop.node.active = false;
            this.lbRank.string = itemID + 1;
        }

        this.lbNickName.string = nickName;
        this.lbTotalWin.string = cc.Tool.getInstance().formatNumber(totalWin);

        this.item = item;
        this.itemID = itemID;
    }
});