/**
 * Created by Nofear on 3/14/2019.
 */

(function () {
    cc.AccountView = cc.Class({
        "extends": cc.Component,
        properties: {
            nodeProfile: cc.Node,
            // nodeVIP: cc.Node,
            nodeSafePlus: cc.Node,
            nodeSecurity: cc.Node,
            nodeChangePass: cc.Node,
            nodeInbox: cc.Node,
        },

        // use this for initialization
        onLoad: function () {
            cc.AccountController.getInstance().setAccountView(this);
            this.nodeTabActive = this.nodeProfile;
            this.currentTab = cc.AccountTab.PROFILE;
            this.node.zIndex =  cc.NoteDepth.POPUP_PORTAL;
            this.animation = this.node.getComponent(cc.Animation);
        },

        onEnable: function () {
            this.animation.play('openPopup');
            var startTab = cc.Tool.getInstance().getItem('@startTab');
            var self = this;
            if (startTab == cc.AccountTab.INBOX || (startTab == cc.AccountTab.SECURITY && cc.Tool.getInstance().getItem('@openFormButton') == 'true')) {
                this.nodeProfile.active = false;
            }
            cc.director.getScheduler().schedule(function () {
                self.activeTab(startTab);
            }, this, 0, 0, 0.3, false);
        },

        changeTabClicked: function (event, data) {
            // if (data.toString() === this.currentTab) return;
            this.activeTab(data.toString());

            // cc.DDNA.getInstance().uiInteraction(cc.DDNAUILocation.ACCOUNT_INFO, data.toString(), cc.DDNAUIType.BUTTON);
        },

        activeTab (tabName) { 
            switch (tabName) {
                case cc.AccountTab.PROFILE:
                    this.nodeTabActive.active = false;
                    this.nodeChangePass.active = false;
                    this.nodeInbox.active = false;
                    this.nodeTabActive = this.nodeProfile;
                    break;
                case cc.AccountTab.VIP:
                    // this.nodeTabActive = this.nodeVIP;
                    break;
                case cc.AccountTab.SAFE_PLUS:
                    this.nodeTabActive = this.nodeSafePlus;
                    break;
                case cc.AccountTab.SECURITY: 
                case cc.AccountTab.KETANTOAN:
                    this.nodeTabActive = this.nodeSecurity;
                    break;
                case cc.AccountTab.CHANGE_PASS:
                    this.nodeTabActive = this.nodeChangePass;
                    break;
                case cc.AccountTab.INBOX:
                    this.nodeTabActive.active = false;
                    this.nodeProfile.active = false;
                    this.nodeChangePass.active = false;
                    this.nodeTabActive = this.nodeInbox;
                    break;
            }
            this.nodeTabActive.active = true;

            this.currentTab = tabName;
        },

        closeClicked: function () {
            //this.showRegister(false);
            this.animation.play('closePopup');
            var self = this;
            var delay = 0.12;
            cc.director.getScheduler().schedule(function () {
                self.animation.stop();
                cc.LobbyController.getInstance().destroyAccountView();
            }, this, 1, 0, delay, false);
        },

        logOutClicked: function () {
            cc.LobbyController.getInstance().showPopupLogout();
        },

        transactionHistoryClicked: function () {
            if (cc.LoginController.getInstance().checkLogin()) {
                cc.LobbyController.getInstance().createHistoryView(cc.HistoryTab.GAME);
            }
        }
    });
}).call(this);
