
var netConfig = require('NetConfig');
(function () {
    cc.LobbySettingView = cc.Class({
	"extends": cc.Component,
    properties: {
		//Panel Support
		PanelSetting: {
			type: cc.Node,
			default: null,
		},
		panelSupport: cc.Node,
		animate: false,
    },

		onLoad () {
			cc.LobbyController.getInstance().setLobbySettingView(this);
		},
		
		showSetting: function() {
			if (this.animate) return;
			this.animate = true;
			this.PanelSetting.stopAllActions();
			this.PanelSetting.active = true;
			this.PanelSetting.scaleY = 0;
			this.PanelSetting.runAction(cc.sequence(
				cc.scaleTo(0.2, 1).easing(cc.easeBackOut()),
				cc.callFunc(() => {
					this.animate = false;
				})
			));
		},

		dismissSetting: function() {
			if (this.animate) return;
			this.animate = true;
			this.PanelSetting.stopAllActions();
			this.PanelSetting.runAction(cc.sequence(
				cc.scaleTo(0.2, 1, 0).easing(cc.easeBackIn()),
				cc.callFunc(() => {
					this.PanelSetting.active = false;
					this.animate = false;
				})
			));
		},
		PanelSettingtoggle: function() {
			if (this.PanelSetting.active) {
				this.dismissSetting();
			} else {
				this.showSetting();
			}
		},
		
		actSupport() {
			this.panelSupport.active = !this.panelSupport.active;
			return;
			//cc.sys.openURL(Configs.App.LINK_SUPPORT);
		},
		
        clickTele: function () {
			this.panelSupport.active = !this.panelSupport.active;
            if (cc.LoginController.getInstance().checkLogin()) {
                cc.sys.openURL(cc.Config.getInstance().teleHotro());
                cc.DDNA.getInstance().uiInteraction(cc.DDNAUILocation.PORTAL, 'HO_TRO', cc.DDNAUIType.BUTTON);
            }
        },
		
        clickLivechat: function () {
			this.panelSupport.active = !this.panelSupport.active;
            if (cc.LoginController.getInstance().checkLogin()) {
                cc.sys.openURL(cc.Config.getInstance().liveChat());
                cc.DDNA.getInstance().uiInteraction(cc.DDNAUILocation.PORTAL, 'LIVE_CHAT', cc.DDNAUIType.BUTTON);
            }
        },
		
		clickNews: function () {
			this.PanelSettingtoggle();
			cc.PopupController.getInstance().showMessageError('Tính năng sắp ra mắt');
			return;
		},
		
		clickRank: function () {
			this.PanelSettingtoggle();
			cc.PopupController.getInstance().showMessageError('Tính năng sắp ra mắt');
			return;
		},
		
        settingClicked: function () {
            // if (cc.LoginController.getInstance().checkLogin()) {
                cc.LobbyController.getInstance().openSetting();
                cc.DDNA.getInstance().uiInteraction(cc.DDNAUILocation.PORTAL, 'SETTING', cc.DDNAUIType.BUTTON);
            // }
			this.PanelSettingtoggle();
        }
    });
}).call(this);