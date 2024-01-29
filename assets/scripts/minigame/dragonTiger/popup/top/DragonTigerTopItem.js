/**
 * Created by Nofear on 3/15/2019.
 */


(function () {
    cc.DragonTigerTopItem = cc.Class({
        "extends": cc.Component,
        properties: {
            // sprite: cc.Sprite,

            lbRank: cc.Label,
            lbSID: cc.Label,
            lbNickName: cc.Label,
            lbTotalWin: cc.Label,
            
        },

        updateItem: function(item, itemID) {
            // this.sprite.enabled = itemID % 2 !== 0;
        
            this.lbRank.node.active = true;
            this.lbRank.string = itemID + 1;

            this.lbSID.string = '[G11]';
            this.lbNickName.string = item.DisplayName;
            this.lbTotalWin.string = cc.Tool.getInstance().formatNumber(item.Award);

            this.item = item;
            this.itemID = itemID;
        },
    });
}).call(this);
