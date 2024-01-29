/**
 * Created by Nofear on 3/15/2019.
 */

(function () {
    cc.LiveXXTopTipView = cc.Class({
        "extends": cc.PopupBase,
        properties: {
            LiveXXTopTipListView: cc.LiveXXTopTipListView,
        },

        onLoad: function () {
            this.animation = this.node.getComponent(cc.Animation);
            this.node.zIndex = cc.NoteDepth.POPUP_PORTAL;
        },

        onEnable: function () {
            this.getTopTip();
            cc.LobbyController.getInstance().setActiveLiveXocDia(false);
        },

        getTopTip: function () {
            var LiveXXGetTopTipCommand = new cc.LiveXXGetTopTipCommand;
            LiveXXGetTopTipCommand.execute(this);
        },

        onLiveXXGetTopTipResponse: function (response) {
            var list = response;
            if (list !== null && list.length > 0) {
                this.LiveXXTopTipListView.resetList();
                this.LiveXXTopTipListView.initialize(list);
            }
        },

        closeClicked: function () {
            this.LiveXXTopTipListView.resetList();
            cc.LiveXXPopupController.getInstance().destroyTopTipView();
            cc.LobbyController.getInstance().setActiveLiveXocDiaFromLobby();
        },
    });
}).call(this);
