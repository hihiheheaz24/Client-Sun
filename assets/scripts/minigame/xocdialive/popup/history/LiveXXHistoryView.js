/**
 * Created by Nofear on 3/15/2019.
 */

(function () {
    cc.LiveXXHistoryView = cc.Class({
        "extends": cc.PopupBase,
        properties: {
            LiveXXHistoryListView: cc.LiveXXHistoryListView,
        },

        onLoad: function () {
            this.animation = this.node.getComponent(cc.Animation);
            this.node.zIndex = cc.NoteDepth.POPUP_PORTAL;
        },

        onEnable: function () {
            this.getTopSessionWinners();
            cc.LobbyController.getInstance().setActiveLiveXocDia(false);
        },

        getTopSessionWinners: function () {
            var LiveXXGetHistoryCommand = new cc.LiveXXGetHistoryCommand;
            LiveXXGetHistoryCommand.execute(this);
        },

        onLiveXXGetHistoryResponse: function (response) {
            var list = response;
            //var list = slotsHistoryListData;
            if (list !== null && list.length > 0) {
                this.LiveXXHistoryListView.resetList();
                this.LiveXXHistoryListView.initialize(list);
            }
        },

        closeClicked: function () {
            this.LiveXXHistoryListView.resetList();
            cc.LiveXXPopupController.getInstance().destroyHistoryView();
            cc.LobbyController.getInstance().setActiveLiveXocDiaFromLobby();
        },
    });
}).call(this);
