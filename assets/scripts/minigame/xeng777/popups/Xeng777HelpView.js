
(function () {
    cc.Xeng777HelpView = cc.Class({
        "extends": cc.PopupBase,
        properties: {

        },

        onLoad: function () {
            this.animation = this.node.getComponent(cc.Animation);
            this.node.zIndex = cc.NoteDepth.POPUP_SICBO;
        },

		openMd5Service() {
			cc.sys.openURL(cc.Config.getInstance().md5Service());
		},
		
        closeFinished: function () {
            cc.Xeng777Controller.getInstance().destroyHelpView();
        },
    });
}).call(this);
