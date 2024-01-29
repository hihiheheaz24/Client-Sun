
(function () {
    cc.Seven77EventHelpView = cc.Class({
        "extends": cc.PopupBase,
        properties: {

        },

        onLoad: function () {
            this.node.zIndex = cc.NoteDepth.POPUP_TAIXIU;
        },

        closeFinished: function () {
            cc.Seven77PopupController.getInstance().destroyEventHelpView();
        },
    });
}).call(this);
