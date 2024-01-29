/**
 * Created by Nofear on 3/15/2019.
 */


(function () {
    cc.CTopItem = cc.Class({
        "extends": cc.Component,
        properties: {
            spriteRank: cc.Sprite,
            lbNo: cc.Label,

            // avatar: cc.Avatar,

            // spriteLogo: cc.Sprite,
            lbSID: cc.Label,
            lbNickName: cc.Label,
            lbValue: cc.LabelIncrement,

            sfRanks: [cc.SpriteFrame], //spriteFrame rank 123
        },

        onLoad: function () {
            // if (this.spriteLogo)
            //     this.spriteLogo.spriteFrame = cc.LobbyController.getInstance().getGameAssets().icons[cc.Config.getInstance().getIndexIcon(cc.Config.getInstance().getServiceId())];
        },



        updateItem: function(item, id) {
            var rank = id + 1;

            this.lbSID.string = cc.Config.getInstance().getServiceNameNoFormat(item.ServiceID);
            this.lbNickName.string = item.DisplayName;
            this.lbValue.tweenValue(0, item.Award);

            this.lbNo.string = rank;

            if(id == 0) {
                this.spriteRank.spriteFrame = this.sfRanks[0];
            }
            if(id == 1) {
                this.spriteRank.spriteFrame = this.sfRanks[1];
            }
            if(id == 2) {
                this.spriteRank.spriteFrame = this.sfRanks[2];
            }
        },
    });
}).call(this);
