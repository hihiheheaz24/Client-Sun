/**
 * Created by Nofear on 6/7/2017.
 */

(function () {
    cc.MiniPokerPopupView = cc.Class({
        "extends": cc.PopupViewBase,
        properties: {
            prefabGoldenTicket: cc.Prefab,
        },

        onLoad: function () {
            cc.MiniPokerController.getInstance().setMiniPokerPopupView(this);
        },

        createGoldenTicketView (event, index) {
            this.nodeGoldenTicket = this.createView(this.prefabGoldenTicket);
            this.nodeGoldenTicket.show(parseInt(index))
        },

        destroyGoldenTicketView: function () {
            if (this.nodeGoldenTicket)
                this.nodeGoldenTicket.destroy();
        },



    });
}).call(this);
