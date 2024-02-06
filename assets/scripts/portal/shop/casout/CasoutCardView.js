/**
 * Created by Nofear on 3/15/2019.
 */


cc.Class({
    extends: cc.Component,
    properties: {
        // topupRateView: cc.TopupRateView,

        lbCardType: cc.Label,
        lbCardValue: cc.Label,

        Otp:cc.EditBox,

        animationMenuCardType: cc.Animation,
        animationMenuCardValue: cc.Animation,

        btnViettel: cc.Button,
        btnMobifone: cc.Button,
        btnVina: cc.Button,

        btnConfirm: cc.Button,
        lbConfirms: [cc.Label],

        contentValue: cc.Node,
    },

    onLoad: function () {
        this.animOpenName = 'showDropdownMenu';
        this.animCloseName = 'hideDropdownMenu';
        this.listCardsSelect = [];

        cc.ShopCastOutControler.getInstance().setShopCastOutView(this);
    },

    onEnable: function () {
        this.animationMenuCardValue.node.scaleY = 0;
        this.animationMenuCardType.node.scaleY = 0;
        this.Otp.string = "";
        this.cardSelected = null;

        //3s click confirm 1 lan
        this.isTimerConfirm = false;
        this.timerConfirm = 0;
        this.timePerConfirm = 3;
        this.processTimeConfirm();

        var self = this;
        var url = 'https://pm.zanews24h.com/api/v1/payments/get-withdraw-cards';
        cc.ServerConnector.getInstance().sendGetNew(url, null, function (response) {
            var obj = JSON.parse(response);
            if (obj.success == true) {
                self.onGetListCardResponse(obj.data);
            } else {
                cc.PopupController.getInstance().showMessageError(obj.message);
            }
        });
    },

    onGetListCardResponse: function (response) {
        this.listCards = response.data;
        this.cardType = cc.CardOperatorCode.VIETTEL;
        this.updateList(cc.CardOperatorCode.VIETTEL);
        var event = {};
        event.target = this.contentValue.children[0];
        this.selectCardValueEvent(event);
    },
    
    updateList: function (cardOperatorCode) {
        this.listCardsSelect = [];
        var cardType = "";
        if (cardOperatorCode == cc.CardOperatorCode.VIETTEL) {
            this.listCardsSelect = this.listCards[0].List;
            cardType = this.listCards[0].cardType;
        } else if (cardOperatorCode == cc.CardOperatorCode.MOBIFONE) {
            this.listCardsSelect = this.listCards[1].List;
            cardType = this.listCards[1].cardType;
        } else if (cardOperatorCode == cc.CardOperatorCode.VINAPHONE) {
            this.listCardsSelect = this.listCards[2].List;
            cardType = this.listCards[2].cardType;
        }

        var children = this.contentValue.children;
        for (var i = 0; i < children.length; i++) {
            children[i].active = false;
        }

        for (var i = 0; i < this.listCardsSelect.length; i++) {
            if (children[i]) {
                let card = this.listCardsSelect[i];
                children[i].active = true;
                children[i]._cardID = card.id;
                children[i]._amount = card.Amount;
                children[i]._cardType = cardType;
                children[i].getChildByName("lbActive").getComponent(cc.Label).string =  cc.Tool.getInstance().formatNumber(card.Amount);
            }
        }
    },

    selectCardValueEvent: function (event) {
        this.cardSelected = event.target;
        this.setLBCardValue(event.target._amount);
        this.animationMenuCardValue.play(this.animCloseName);
    },

    getOTPClicked: function () {
        var loginResponse = cc.LoginController.getInstance().getLoginResponse();
        if (loginResponse.IsFirstUseOtp == true) {
            cc.sys.openURL(cc.LobbyController.getInstance().getConfigServer().telegram_otp_bot + '?start=' + cc.LoginController.getInstance().getUserId());
        } else {
            cc.PopupController.getInstance().showMessage("Bạn chưa xác thực số điện thoại.");
        }
    },

    update: function (dt) {
        if (this.isTimerConfirm) {
            this.timerConfirm -= dt;

            this.processTimeConfirm();
        }
    },

    refreshListCard: function () {
        // this.topupRateView.getListCard();
    },

    activeTimeConfirm: function () {
        this.isTimerConfirm = true;
        this.timerConfirm = this.timePerConfirm;
    },

    processTimeConfirm: function () {
        if (this.timerConfirm <= 0) {
            this.isTimerConfirm = false;
            this.btnConfirm.interactable = true;

            this.lbConfirms.forEach(function (lbConfirm) {
                lbConfirm.string = 'XÁC NHẬN';
            });
        } else {
            var self = this;
            var time = Math.round(self.timerConfirm);
            this.isTimerConfirm = true;
            this.btnConfirm.interactable = false;
            this.lbConfirms.forEach(function (lbConfirm) {
                lbConfirm.string = time;
            });
        }
    },

    resetScale: function () {
        this.animationMenuCardValue.node.scaleY = 0;
        this.animationMenuCardValue.node.opacity = 255;
    },

    restoreScale: function () {
        this.animationMenuCardValue.node.scaleY = 1;
        this.animationMenuCardValue.node.opacity = 0;
    },

    setLBCardType: function (value) {
        this.lbCardType.string = value;
    },

    setLBCardValue: function (amount) {
        // this.cardSelect = this.topupRateView.getCardFromID(ID);
        this.lbCardValue.string = cc.Tool.getInstance().formatNumber(amount);
    },

    selectCard: function (cardType) {
        this.btnViettel.interactable = true;
        this.btnMobifone.interactable = true;
        this.btnVina.interactable = true;
        switch (cardType) {
            case cc.CardOperatorCode.VIETTEL:
                // this.topupRateView.updateList(cc.CardOperatorCode.VIETTEL);
                this.btnViettel.interactable = false;
                this.cardType = cc.CardOperatorCode.VIETTEL;
                break;
            case cc.CardOperatorCode.MOBIFONE:
                // this.topupRateView.updateList(cc.CardOperatorCode.MOBIFONE);
                this.btnMobifone.interactable = false;
                this.cardType = cc.CardOperatorCode.MOBIFONE;
                break;
            case cc.CardOperatorCode.VINAPHONE:
                // this.topupRateView.updateList(cc.CardOperatorCode.VINAPHONE);
                this.btnVina.interactable = false;
                this.cardType = cc.CardOperatorCode.VINAPHONE;
                break;
        }
        this.updateList(cardType);
    },

    onChargeCardResponse: function (response) {
        if (response.message)
            cc.PopupController.getInstance().showMessage(response.message);
        else if (response.Description)
            cc.PopupController.getInstance().showMessage(response.Description);
        else
            cc.PopupController.getInstance().showMessage('Gửi thẻ thành công. Vui lòng chờ hệ thống xử lý...');

        cc.LobbyController.getInstance().refreshAccountInfo();
        cc.ShopController.getInstance().getTotalCardBonus();
    },

    onChargeCardResponseError: function (response) {
        // if (response.Description)
        //     cc.PopupController.getInstance().showMessageError(response.Description);
        // else
        //     cc.PopupController.getInstance().showMessageError(response.message, response.ResponseCode);

        cc.PopupController.getInstance().showMessageError(response.message);
        //nap that bai thi reset captcha
        this.editBoxCaptcha.string = '';
    },

    openMenuCardTypeClicked: function () {
        this.animationMenuCardType.play(this.animOpenName);
    },

    openMenuCardValueClicked: function () {
        this.animationMenuCardValue.play(this.animOpenName);
    },

    hideMenuCardTypeClicked: function () {
        this.animationMenuCardType.play(this.animCloseName);
    },

    hideMenuCardValueClicked: function () {
        this.animationMenuCardValue.play(this.animCloseName);
    },

    selectCardTypeEvent: function(event, data) {
        this.selectCard(data.toString());
        this.setLBCardType(data.toString());
        this.animationMenuCardType.play(this.animCloseName);
    },

    chooseCardTypeClicked: function (event, data) {
        this.selectCard(data.toString());
        this.setLBCardType(data.toString());
    },
    
    rutCardClicked: function () {
        let value = cc.Tool.getInstance().removeDot(this.lbCardValue.string);
        if (value <= 0) {
            cc.PopupController.getInstance().showMessage('Vui lòng chọn mệnh giá.');
            return;
        }

        // if (this.Otp.string === '') {
        //     cc.PopupController.getInstance().showMessage('Vui lòng nhập Otp');
        //     return;
        // }

        var params = {
            card_amount: this.cardSelected._amount,
            card_type: this.cardSelected._cardType,
            card_id: this.cardSelected._cardID,
            otp: this.Otp.string,
        }

        var self = this;
        cc.PopupController.getInstance().showBusy();
        var url = 'https://pm.zanews24h.com/api/v1/payments/buy-card';
        cc.ServerConnector.getInstance().sendGetNew(url, params, function (response) {
            cc.PopupController.getInstance().hideBusy();
            var obj = JSON.parse(response);
            if (obj.success == true) {
                self.Otp.string = "";
                cc.PopupController.getInstance().showMessage(obj.message);
            } else {
                cc.PopupController.getInstance().showMessageError(obj.message);
            }
        });

        this.activeTimeConfirm();
    }

});

