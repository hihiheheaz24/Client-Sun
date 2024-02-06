/**
 * Created by Nofear on 3/14/2019.
 */


(function () {
    cc.ThuyCungHelpView = cc.Class({
        "extends": cc.HelpView,
        properties: {
            // spriteHelp: cc.Sprite,
            // sfHelps: [cc.SpriteFrame],
        },

        // onEnable: function () {
        //     this.node.active = true;
        //     // var roomIndex = cc.RoomController.getInstance().getRoomId() - 1;
        //     this.spriteHelp.spriteFrame = this.sfHelps[0];
        // },

        closeClicked: function () {
            cc.MainController.getInstance().destroyHelpView();
        },
    });
}).call(this);
