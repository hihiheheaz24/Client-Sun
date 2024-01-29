/**
 * Created by Nofear on 3/14/2019.
 */

(function () {
    cc.ShopTopupView = cc.Class({
        "extends": cc.Component,
        properties: {
            nodeCard: cc.Node,
            nodeBank: cc.Node,
            nodeMoMo: cc.Node,

            nodeTabCard: cc.Node,
            nodeTabBank: cc.Node,
            nodeUSDT: cc.Node,

            nodeTransfer: cc.Node,

            nodeBusy: cc.Node,
            loadingIcon: cc.Node,

            // lbCardBonus: cc.Label,
            // nodeViettelPay: cc.Node,
            nodeGiftCode: cc.Node,
            
    
           
            listNodeHelp: [cc.Node]
        },

        // use this for initialization
        onLoad: function () {
            cc.ShopController.getInstance().setShopTopupView(this);
            this.nodeTabActive = this.nodeCard;
            this.currentTab = cc.ShopTab.TOPUP;
            this.node.zIndex = cc.NoteDepth.POPUP_PORTAL;
            this.animation = this.node.getComponent(cc.Animation);
            this.animationPopupHelp = this.nodePopupHelp.getComponent(cc.Animation);

            this.nodeTabCard.active = true;
            this.nodeTabBank.active = true;
            this.nodeTransfer.active = false;
            this.nodeUSDT.active = true;
            this.nodeGiftCode.active = true;
            
        },

        onEnable: function () {
            this.animation.play('openPopup');
            var startTab = cc.Tool.getInstance().getItem('@startShopTab');
            var self = this;
            cc.director.getScheduler().schedule(function () {
                // self.activeTopupTab(startTab);
                if (startTab == cc.ShopTab.GIFT_CODE) {
                    self.activeTopupTab(cc.ShopTab.GIFT_CODE);
                    cc.Tool.getInstance().setItem('@startShopTab', cc.ShopTab.BANK);
                } else {   
                    self.activeTopupTab(cc.ShopTab.BANK);
                }
            }, this, 0, 0, 0.3, false);

            this.getTotalCardBonus();

           // this.nodePopupHelp.active = false;
        },

        changeTabClicked: function (event, data) {
            if (data.toString() === this.currentTab) return;
            this.activeTopupTab(data.toString());

            cc.DDNA.getInstance().uiInteraction(cc.DDNAUILocation.SHOP, data.toString(), cc.DDNAUIType.BUTTON);
        },

        showHistoryNap: function () {
            if (cc.LoginController.getInstance().checkLogin()) {
                this.closeClicked();
                cc.LobbyController.getInstance().createHistoryView(cc.HistoryTab.TOPUP);
            }
        },

        activeTopupTab(tabName, nickName) {
            if (nickName === undefined) {
                cc.Tool.getInstance().setItem('@nickNameAgency', '');
            } else {
                cc.Tool.getInstance().setItem('@nickNameAgency', nickName);
            }

            this.nodeTabActive.active = false;
            switch (tabName) {
                case cc.ShopTab.TOPUP:
                    this.nodeTabActive = this.nodeCard;
                    break;
                case cc.ShopTab.BANK:
                    this.nodeTabActive = this.nodeBank;
                    break;
                case cc.ShopTab.MOMO:
                    this.nodeTabActive = this.nodeMoMo;
                    break;
                case cc.ShopTab.USDT:
                    this.nodeTabActive = this.nodeUSDT;
                    break;
                case cc.ShopTab.TRANSFER:
                    this.nodeTabActive = this.nodeTransfer;
                    break;
                case cc.ShopTab.GIFT_CODE:
                    this.nodeTabActive = this.nodeGiftCode;
                    break;
            }
            this.nodeTabActive.active = true;

            this.currentTab = tabName;
        },

        getTotalCardBonus: function () {
            var getTotalCardBonusCommand = new cc.GetTotalCardBonusCommand;
            getTotalCardBonusCommand.execute(this);
        },

        onGetTotalCardBonusResponse: function (obj) {
            if (this.lbCardBonus) {
                this.lbCardBonus.string = obj.TotalCard;
                if (this.totalCard !== undefined) {
                    //refresh lai list card khi so the cao khuyen mai tư 1 -> 0
                    if (this.totalCard === 1 && obj.TotalCard === 0) {
                        cc.TopupController.getInstance().refreshListCard();
                    }
                    this.totalCard = obj.TotalCard;
                } else {
                    //lan dau tien chua co -> set du lieu
                    this.totalCard = obj.TotalCard;
                }
            }
        },

        showShopBusy: function () {
            this.nodeBusy.active = true;
            this.loadingIcon.stopAllActions();
            this.loadingIcon.runAction(cc.repeatForever(cc.rotateBy(1.5, 360)));
        },

        hideShopBusy: function () {
            if (this.nodeBusy)
                this.nodeBusy.active = false;
        },

        closeClicked: function () {
            //this.showRegister(false);
            this.animation.play('closePopup');
            var self = this;
            var delay = 0.12;
            cc.director.getScheduler().schedule(function () {
                self.animation.stop();
                cc.LobbyController.getInstance().destroyShopTopupView();
            }, this, 1, 0, delay, false);
        },

        openPopupHelp: function (event, customData) {
            this.nodePopupHelp.active = true;
            this.listNodeHelp.forEach(element => {
                element.active = false;
            });
            this.listNodeHelp[parseInt(customData)].active = true;
            
            this.animationPopupHelp.play('openPopup');
        },

        hidePopupHelp: function () {
            this.animationPopupHelp.play('closePopup');
            var self = this;
            var delay = 0.12;
            cc.director.getScheduler().schedule(function () {
                self.animationPopupHelp.stop();
                self.nodePopupHelp.active = false;
            }, this, 1, 0, delay, false);
        }

    });
}).call(this);
