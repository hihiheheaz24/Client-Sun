/**
 * Created by Nofear on 3/15/2019.
 */

(function () {
    cc.LiveXXTopView = cc.Class({
        "extends": cc.PopupBase,
        properties: {
            LiveXXTopListView: cc.LiveXXTopListView,
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
            var LiveXXGetBigWinnersCommand = new cc.LiveXXGetBigWinnerCommand;
            LiveXXGetBigWinnersCommand.execute(this);
        },

        onLiveXXGetBigWinnerResponse: function (response) {
            var list = response;
            //var list = slotsHistoryListData;
            if (list !== null && list.length > 0) {
                this.LiveXXTopListView.resetList();
                this.LiveXXTopListView.initialize(list);
            }
        },

        closeClicked: function () {
            this.LiveXXTopListView.resetList();
            cc.LiveXXPopupController.getInstance().destroyTopView();
            cc.LobbyController.getInstance().setActiveLiveXocDiaFromLobby();
        },
    });
}).call(this);
