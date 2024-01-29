/**
 * Created by Nofear on 3/15/2019.
 */


(function () {
    cc.DoiThe = cc.Class({
        "extends": cc.Component,
        properties: {
            topupRateView: cc.DoiTheRateView,

            lbCardType: cc.Label,
            lbCardValue: cc.Label,

            animationMenuCardType: cc.Animation,
            animationMenuCardValue: cc.Animation,

            editBoxPINCard: cc.EditBox,
            editBoxSeriCard: cc.EditBox,
            editBoxCaptcha: cc.EditBox,

            imageUrlCaptcha: cc.ImageUrl,

            btnConfirm: cc.Button,
        },

        // onLoad: function () {
        //     this.animOpenName = 'showDropdownMenu';
        //     this.animCloseName = 'hideDropdownMenu';

        //     this.topupRateView.init(this.node);
        //     cc.TopupController.getInstance().setTopupView(this);

        // },

        onEnable: function () {
            this.animOpenName = 'showDropdownMenu';
            this.animCloseName = 'hideDropdownMenu';

            this.topupRateView.init(this.node);
            cc.TopupController.getInstance().setTopupView(this);
            this.animationMenuCardValue.node.scaleY = 0;
            this.animationMenuCardType.node.scaleY = 0;
            // this.getCaptcha();
            this.resetInput();

            // //3s click confirm 1 lan
            // this.isTimerConfirm = false;
            // this.timerConfirm = 0;
            // this.timePerConfirm = 3;
            // this.processTimeConfirm();

            cc.ShopController.getInstance().getTotalCardBonus();
        },

        update: function (dt) {
            if (this.isTimerConfirm) {
                this.timerConfirm -= dt;

                this.processTimeConfirm();
            }
        },

        refreshListCard: function () {
            this.topupRateView.getListCard();
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
                    lbConfirm.string = 'NẠP';
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

        resetInput: function () {
            if (this.editBoxPINCard) {
                this.editBoxPINCard.string = '';
                this.editBoxSeriCard.string = '1';
            }
        },

        getCaptcha: function () {
            var getCaptchaCommand = new cc.GetCaptchaCommand;
            getCaptchaCommand.execute(this);
        },

        setLBCardType: function (value) {
            this.lbCardType.string = value;
        },

        setLBCardValue: function (ID) {
            this.cardSelect = this.topupRateView.getCardFromID(ID);
            this.lbCardValue.string = cc.Tool.getInstance().formatNumber(this.cardSelect.CardValue);
        },

        selectCard: function (cardType) {
            switch (cardType) {
                case cc.CardType.VIETTEL:
                    this.topupRateView.updateList(cc.CardOperatorCode.VIETTEL);
                    break;
                case cc.CardType.MOBIFONE:
                    this.topupRateView.updateList(cc.CardOperatorCode.MOBIFONE);
                    break;
                case cc.CardType.VINAPHONE:
                    this.topupRateView.updateList(cc.CardOperatorCode.VINAPHONE);
                    break;
            }
        },

        onGetCaptchaResponse: function (response) {
            if (this.imageUrlCaptcha)
                this.imageUrlCaptcha.get('data:image/png;base64,' + cc.Tool.getInstance().removeStr(response[1], '\r\n'));
        },

        onChargeCardResponse: function (response) {
            if (response.Message)
                cc.PopupController.getInstance().showMessage(response.Message);
            else if (response.Description)
                cc.PopupController.getInstance().showMessage(response.Description);
            else
                cc.PopupController.getInstance().showMessage('Nạp thành công');

            cc.LobbyController.getInstance().refreshAccountInfo();
            cc.ShopController.getInstance().getTotalCardBonus();
            this.getCaptcha();
            this.resetInput();
        },

        onChargeCardResponseError: function (response) {
            if (response.Description)
                cc.PopupController.getInstance().showMessageError(response.Description);
            else
                cc.PopupController.getInstance().showMessageError(response.Message, response.ResponseCode);

            this.getCaptcha();
            //nap that bai thi reset captcha
            this.editBoxCaptcha.string = '';
        },

        onEditingValueChanged: function () {
            var val = cc.Tool.getInstance().removeDot(this.editBoxSeriCard.string);
            this.editBoxSeriCard.string = cc.Tool.getInstance().formatNumber(val);
        },

        onEditingValueDidEnd: function () {
            var val = cc.Tool.getInstance().removeDot(this.editBoxSeriCard.string);
            this.editBoxSeriCard.string = cc.Tool.getInstance().formatNumber(val);
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
            let lowerCase = data.toString().toLowerCase();
            this.setLBCardType(this.jsUcfirst(lowerCase));
            this.animationMenuCardType.play(this.animCloseName);
        },

        selectCardValueEvent: function(event, data) {
            this.setLBCardValue(parseInt(data.toString()));
            this.animationMenuCardValue.play(this.animCloseName);
        },

        chooseCardTypeClicked: function (event, data) {
            this.selectCard(data.toString());
            let lowerCase = data.toString().toLowerCase();
            this.setLBCardType(this.jsUcfirst(lowerCase));
            this.animationMenuCardType.play(this.animCloseName);
        },

        chooseCardValueClicked: function (event, data) {

        },
        
        refreshCaptchaClicked: function () {
            this.getCaptcha();
        },
        
        topupClicked: function () {
            if (this.cardSelect === undefined) {
                cc.PopupController.getInstance().showMessage('Vui lòng chọn mệnh giá.');
                return;
            }

            this.pin = this.editBoxPINCard.string;
            this.serial = this.editBoxSeriCard.string;
            this.captcha = this.editBoxCaptcha.string;
            this.cardType = this.cardSelect.OperatorCode;
            this.cardCode = this.cardSelect.CardCode;

            if (this.pin === '') {
                cc.PopupController.getInstance().showMessage('Vui lòng nhập mã thẻ.');
                return;
            }

            if (this.serial === '') {
                cc.PopupController.getInstance().showMessage('Vui lòng nhập seri thẻ.');
                return;
            }

            // if (this.captcha === '') {
            //     cc.PopupController.getInstance().showMessage('Vui lòng nhập mã xác nhận.');
            //     return;
            // }

            var chargeCardCommand = new cc.ChargeCardCommand;
            chargeCardCommand.execute(this);
            // this.activeTimeConfirm();
        },

        jsUcfirst: function (string) 
            {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
    });
}).call(this);
