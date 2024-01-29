/**
 * Created by Nofear on 6/7/2017.
 */

(function () {
    cc.CaoThapPopupView = cc.Class({
        "extends": cc.PopupViewBase,
        properties: {
            prefabCardHunting: cc.Prefab,
        },

        onLoad: function () {
            cc.CaoThapController.getInstance().setCaoThapPopupView(this);
        },

        createCardHuntingEvent (event, index) {
            this.nodeCardHunting = this.createView(this.prefabCardHunting);
            this.nodeCardHunting.show(parseInt(index))
        },

        destroyCardHuntingEvent: function () {
            if (this.nodeCardHunting) {
                this.nodeCardHunting.destroy();
            }
        },
    });
}).call(this);
