
(function () {
    cc.LiveXXHelpView = cc.Class({
        "extends": cc.PopupBase,
        properties: {

        },

        onLoad: function () {
            this.animation = this.node.getComponent(cc.Animation);
            this.node.zIndex = cc.NoteDepth.POPUP_PORTAL;
            cc.LobbyController.getInstance().setActiveLiveXocDia(false);
        },

        closeFinished: function () {
            cc.LiveXXPopupController.getInstance().destroyHelpView();
            cc.LobbyController.getInstance().setActiveLiveXocDiaFromLobby();
        },
    });
}).call(this);
