/**
 * Created by Nofear on 6/7/2017.
 */

var netConfig = require('NetConfig');

(function () {
    cc.BottomBarView = cc.Class({
        "extends": cc.Component,
        properties: {
            nodeTabbar: cc.Node,
            nodeGroup:cc.Node
        },

        onLoad: function () {
            cc.LobbyController.getInstance().setBottomBarView(this);
            if (cc.sys.isNative) {
                this.nodeTabbar.active = true;
            }
            let getUrlCommand = new cc.GetHotUrlCommand;
            getUrlCommand.execute(this);
        },

        redeemClicked: function () {
            if (cc.LoginController.getInstance().checkLogin()) {
                if (cc.find("Canvas/shopTopupView3")) {
                    cc.LobbyController.getInstance().destroyShopTopupView();
                }
                if (!cc.Config.getInstance().getDomainVK().includes(netConfig.HOST)) {
                    cc.LobbyController.getInstance().createShopView(cc.ShopTab.TRANSFER);
                    cc.DDNA.getInstance().shopEntered(cc.DDNAShopName.CASH_OUT);
                    cc.DDNA.getInstance().uiInteraction(cc.DDNAUILocation.PORTAL, 'CASH_OUT', cc.DDNAUIType.BUTTON);
                } else {
                    cc.LobbyController.getInstance().createShopView(cc.ShopTab.AGENCY);
                    cc.DDNA.getInstance().shopEntered(cc.DDNAShopName.AGENCY);
                    cc.DDNA.getInstance().uiInteraction(cc.DDNAUILocation.PORTAL, 'AGENCY', cc.DDNAUIType.BUTTON);
                }
            }
        },

        vipClicked: function () {
            if (cc.LoginController.getInstance().checkLogin()) {
                cc.LobbyController.getInstance().createAccountView(cc.AccountTab.VIP);
                cc.DDNA.getInstance().uiInteraction(cc.DDNAUILocation.PORTAL, 'VIP', cc.DDNAUIType.BUTTON);
            }
        },

        x2Clicked: function () {
            if (cc.LoginController.getInstance().checkLogin()) {
                cc.LobbyController.getInstance().createX2RewardView(cc.X2Tab.PROGRESS);
            }
        },

        transferClicked: function () {
            if (cc.LoginController.getInstance().checkLogin()) {
                if (cc.find("Canvas/shopTopupView3")) {
                    cc.LobbyController.getInstance().destroyShopTopupView();
                }
                cc.LobbyController.getInstance().createShopView(cc.ShopTab.TRANSFER);
                cc.DDNA.getInstance().shopEntered(cc.DDNAShopName.TRANSFER);
                cc.DDNA.getInstance().uiInteraction(cc.DDNAUILocation.PORTAL, 'TRANSFER', cc.DDNAUIType.BUTTON);
            }
        },

        agencyClicked: function () {
            if (cc.LoginController.getInstance().checkLogin()) {
                cc.LobbyController.getInstance().createShopView(cc.ShopTab.AGENCY);
                cc.DDNA.getInstance().shopEntered(cc.DDNAShopName.AGENCY);
                cc.DDNA.getInstance().uiInteraction(cc.DDNAUILocation.PORTAL, 'AGENCY', cc.DDNAUIType.BUTTON);
            }
        },

        giftcodeClicked: function () {
            if (cc.LoginController.getInstance().checkLogin()) {
                cc.LobbyController.getInstance().destroyGiftcodeView();
                cc.LobbyController.getInstance().createGiftcodeView();
                cc.DDNA.getInstance().uiInteraction(cc.DDNAUILocation.PORTAL, 'GIFTCODE', cc.DDNAUIType.BUTTON);
            }
        },
        onGetHotUrlResponse:function(response)
        {
            console.log(response);
            this.hotUrl = response;
            // LinkGroupFacebook = "https://facebook.com",
            //     LinkGroupTelegram = "https://t.me",
            //     LinkSupportFacebook = "https://facebook.com",
            //     LinkLiveChat = "https://t.me",
            //     LinkYoutube = "https://youtube.com",
            //     LinkTwitter = "https://twitter.com",
            //     HotUpdateUrl = "https://abc.com"
        },
        groupButtonClicked: function (event, type) {
            if (cc.LoginController.getInstance().checkLogin()) {

                switch (type) {
                    case "GRFB":
                        cc.sys.openURL(this.hotUrl.LinkGroupFacebook);
                        break;
                    case "GRTL":
                        cc.sys.openURL(this.hotUrl.LinkGroupTelegram);
                        break;
                    case "FPFB":
                        cc.sys.openURL(this.hotUrl.LinkSupportFacebook);
                        break;
                    case "YT":
                        cc.sys.openURL(this.hotUrl.LinkYoutube);
                        break;
                    case "TW":
                        cc.sys.openURL(this.hotUrl.LinkTwitter);
                        break;
                    case "LC":
                        cc.sys.openURL(this.hotUrl.LinkLiveChat);
                        break;
                    default:
                        cc.sys.openURL("https://exness.exchange");
                        break;
                }
            }
        },

        pageFBClicked: function () {
            if (cc.LoginController.getInstance().checkLogin()) {
                cc.sys.openURL(cc.Config.getInstance().fanPageFB());
            }
        },
        groupClicked:function()
        {
            if (this.nodeGroup.active==false) {
                this.nodeGroup.active = true;
                this.nodeGroup.getComponent(cc.Animation).play('openGroupPopup').wrapMode = cc.WrapMode.Normal;
            }
            else
                this.nodeGroup.active = false;
        },
        pageTaiGame: function () {
            if (cc.LoginController.getInstance().checkLogin()) {
                cc.sys.openURL(cc.Config.getInstance().taigame());
                cc.DDNA.getInstance().uiInteraction(cc.DDNAUILocation.PORTAL, 'TAI_GAME', cc.DDNAUIType.BUTTON);
            }
        },

        clickDownloadGame: function () {
            // if (cc.LoginController.getInstance().checkLogin()) {
                cc.sys.openURL(cc.Config.getInstance().livechat());
                cc.DDNA.getInstance().uiInteraction(cc.DDNAUILocation.PORTAL, 'TAI_GAME', cc.DDNAUIType.BUTTON);
            // }
        },

        clickHoTro: function () {
            if (cc.LoginController.getInstance().checkLogin()) {
                cc.sys.openURL(cc.Config.getInstance().teleHotro());
                cc.DDNA.getInstance().uiInteraction(cc.DDNAUILocation.PORTAL, 'HO_TRO', cc.DDNAUIType.BUTTON);
            }
        },

        clickHoTroBtn: function () {
            if (cc.LoginController.getInstance().checkLogin()) {
                cc.LobbyController.getInstance().createSupportView()
                // cc.sys.openURL(cc.Config.getInstance().teleHotro());
                cc.DDNA.getInstance().uiInteraction(cc.DDNAUILocation.PORTAL, 'HO_TRO', cc.DDNAUIType.BUTTON);
            }
        },
        clickHuongDanBtn: function () {
            if (cc.LoginController.getInstance().checkLogin()) {
                cc.LobbyController.getInstance().createSupportView()
                // cc.sys.openURL(cc.Config.getInstance().teleHotro());
                cc.DDNA.getInstance().uiInteraction(cc.DDNAUILocation.PORTAL, 'HUONG_DAN', cc.DDNAUIType.BUTTON);
            }
        },

		 clickFoneCall: function () {
            if (cc.LoginController.getInstance().checkLogin()) {
                cc.sys.openURL(cc.Config.getInstance().foneSupport());
                cc.DDNA.getInstance().uiInteraction(cc.DDNAUILocation.PORTAL, 'FONE_SUPPORT', cc.DDNAUIType.BUTTON);
            }
        },
        
        casoutClicked: function () {
            if (cc.LoginController.getInstance().checkLogin()) {
                
                  cc.LobbyController.getInstance().createShopCastOutView(cc.ShopTab.SPEND_GVIN);
                  cc.DDNA.getInstance().shopEntered(cc.DDNAShopName.CASH_OUT);
                  cc.DDNA.getInstance().uiInteraction(cc.DDNAUILocation.PORTAL, 'BANK', cc.DDNAUIType.BUTTON);
            }
        },
    });
}).call(this);
