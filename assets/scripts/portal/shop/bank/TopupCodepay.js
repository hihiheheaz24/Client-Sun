/**
 * Created by Nofear on 3/15/2019.
 */


(function () {
    cc.TopupCodepay = cc.Class({
        "extends": cc.Component,
        properties: {
            nodeStep1: cc.Node,
			nodeCreateCode: cc.Node,
			lbTimeout: cc.Label,
            toggleChooseValue: cc.ToggleChooseValue,
            lbSelectedBank: cc.Label,
            animationMenuBank: cc.Animation,
            editBoxValue: cc.EditBox,
            editBoxCaptcha: cc.EditBox,
            lbMoney: cc.Label,
            imageUrlCaptcha: cc.ImageUrl,
            QRCode:cc.Node,
            QRCodeZoom:cc.Sprite,
            lbInfoBankAccountNumber: cc.Label,
            lbInfoBankAccountName: cc.Label,
            lbInfoTranID: cc.Label,
            lbInfoMoney:cc.Label,
            lbInfoBankName:cc.Label,
            blankQR:cc.SpriteFrame
        },

        onLoad: function () {
            this.animOpenName = 'showDropdownMenu';
            this.animCloseName = 'hideDropdownMenu';
            this.contentChuyen = "thanhno " + cc.LoginController.getInstance().getLoginResponse().AccountName;
            this.isCharging = false;
            cc.PopupController.getInstance().showBusy();
            this.getListTopupBank();
        },

        onEnable: function () {
            this.animationMenuBank.node.scaleY = 0;
            this.getCaptcha();
            this.resetInput();
            //3s click confirm 1 lan
            this.nodeStep1.active = true;
			this.nodeCreateCode.active = true;
            this.lbInfoBankAccountNumber.string = '';
            this.lbInfoBankAccountName.string = '';
			this.lbInfoTranID.string = '';
			this.lbInfoMoney.string = '';
			this.lbInfoBankName.string = '';
            this.QRCode.getComponent(cc.Sprite).spriteFrame = this.blankQR;
            this.QRCodeZoom.spriteFrame = this.blankQR;
            this.QRCode.active = false;
        },
        onDisable:function()
        {
            clearInterval(this.interval);
        },
        updateTimeCount: function () {			
            if (!this.fixTime) {
                return;
            }

            this.fixTime--;
            if(this.fixTime <= 0) {
                this.fixTime = 0;
                clearInterval(this.interval);
            }
            let msec = this.fixTime * 1000;
            let hh = Math.floor(msec / 1000 / 60 / 60);
            msec -= hh * 1000 * 60 * 60;
            let mm = Math.floor(msec / 1000 / 60);
            msec -= mm * 1000 * 60;
            let ss = Math.floor(msec / 1000);
            msec -= ss * 1000;

            hh = hh < 10 ? "0" + hh : hh;
            mm = mm < 10 ? "0" + mm : mm;
            ss = ss < 10 ? "0" + ss : ss;

            this.lbTimeout.string = mm+":"+ss;
        },
        getListTopupBank: function () {
            var GetListTopupCodepay = new cc.GetListTopupCodepay;
            GetListTopupCodepay.execute(this);
        },

        onGetListTopupBankResponse: function (response) {
            cc.BankController.getInstance().setResponseTopupBanks(response);
            var list = response.Orders.List;

            this.toggleChooseValue.resetListChooseValue();

            var self = this;
            var posY = -35;// Vi tri dau tien cua Item -> fix bug
            list.forEach(function (bank) {
                self.toggleChooseValue.initializeToggleChooseValue(
                    self,
                    "TopupCodepay",
                    "selectBankEvent",
                    bank,
                    bank.name,
                    posY
                );
                posY -= 50;
            })
        },

        resetScale: function () {
            this.animationMenuBank.node.scaleY = 0;
            this.animationMenuBank.node.opacity = 255;
        },

        restoreScale: function () {
            this.animationMenuBank.node.scaleY = 1;
            this.animationMenuBank.node.opacity = 0;
        },

        resetInput: function () {
            if (this.editBoxValue) {
                this.editBoxValue.string = '';
                this.editBoxCaptcha.string = '';
                this.lbSelectedBank.string = 'CHỌN NGÂN HÀNG';
                this.lbMoney.string = 'Số ' + cc.Config.getInstance().currency() + ' nhận được: ' + '0';
            }
        },

        getCaptcha: function () {
            var getCaptchaCommand = new cc.GetCaptchaCommand;
            getCaptchaCommand.execute(this);
        },
        openQRCodeZoom:function()
        {
            this.QRCodeZoom.node.parent.active = true;
        },
        closeQRCodeZoom:function()
        {
            this.QRCodeZoom.node.parent.active = false;
        },
        openAppBank:function()
        {

        },
        setLBSelectedBank: function (bank) {
            this.lbSelectedBank.string = bank.name;
            this.selectedBank = bank;
			this.bankCode = bank.code;
        },

        selectBank: function (value) {
            this.bankType = value;
        },

        onGetCaptchaResponse: function (response) {
            if (this.imageUrlCaptcha)
                this.imageUrlCaptcha.get('data:image/png;base64,' + cc.Tool.getInstance().removeStr(response[1], '\r\n'));
        },

        onChargeBankResponse: function (response) {
            // let data = {
            //     "ResponseCode": 1,
            //     "Data": {
            //         "requestID": "TKeUzj4ViJyKym3",
            //         "chargeType": "bank",
            //         "chargeCode": "qwe48vc7378",
            //         "userID": 200100053,
            //         "regAmount": 50000,
            //         "chargeAmount": 0,
            //         "usdRate": 0,
            //         "status": -1,
            //         "momoTransId": null,
            //         "result": null,
            //         "usdAmount": 0,
            //         "resID": 2686629,
            //         "qr_url": "https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=00020101021238580010A000000727012800069704180114679100005902340208QRIBFTTA53037045405500005802VN62150811qwe48vc73786304E5BE",
            //         "payment_url": "00020101021238580010A0000",
            //         "phoneNum": "67910000590234",
            //         "phoneName": "NGUYEN THI NGUYET THU",
            //         "redirect": "/payment/2686629?token=ea8ba1e2a354dd1a38df4a845acbc8cc377da6",
            //         "redirect_ssl": "https://mopay.info/payment8/2686629?token=ea8ba1e2a354dd1a38df4a845acbc8cc377da6",
            //         "bank_provider": "BIDV",
            //         "timeToExpired": 900,
            //         "deeplink": "",
            //         "subType": "bank                ",
            //         "phoneSender": null,
            //         "createdDate": "2023-09-27T14:55:49.127",
            //         "updatedDate": null,
            //         "cardCode": null,
            //         "cardSerial": null
            //     }
            // };
            this.isCharging = false;
			if(response != null){
				this.fixTime = 600;
				let self = this;
				self.updateTimeCount();
				this.interval = setInterval(function () {
					self.updateTimeCount();
				}, 1000);
                var orders = response.Data;
                this.orders = orders;
                this.banks = orders;
                var remoteUrl= orders.qr_url;
                cc.assetManager.loadRemote(remoteUrl,{ext:".png"},(err, texture)=>{
                    console.log("err"+err);
                    var spriteFrame=new cc.SpriteFrame(texture);
                    this.QRCode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                    this.QRCodeZoom.spriteFrame = spriteFrame;
                    this.QRCode.active = true;
                });
                this.lbInfoBankName.string = this.selectedBank.name;
                this.lbInfoBankAccountNumber.string = orders.phoneNum;
                this.lbInfoBankAccountName.string = orders.phoneName;
                this.lbInfoTranID.string = orders.chargeCode;
                this.lbInfoMoney.string = cc.Tool.getInstance().formatNumber(orders.regAmount);
            }
            this.resetInput();
        },

        onChargeBankResponseError: function (response) {
            console.log(response);
            if (response.Description)
                cc.PopupController.getInstance().showMessageError(response.Description);
            else
                cc.PopupController.getInstance().showMessageError(response.Message, response.ResponseCode);

            this.getCaptcha();
            //nap that bai thi reset captcha
            this.editBoxCaptcha.string = '';
        },

        copyBankClicked: function () {

        },

        copyBankAccountNumberClicked: function () {
            if(this.banks != null && cc.Tool.getInstance().copyToClipboard(this.banks.phoneNum)) {
                cc.PopupController.getInstance().showMessage('Đã sao chép số tài khoản.');
            }
        },

        copyBankAccountNameClicked: function () {
            if(this.banks != null && cc.Tool.getInstance().copyToClipboard(this.banks.phoneName)) {
                cc.PopupController.getInstance().showMessage('Đã sao chép tên tài khoản.');
            }
        },

        copyMoneyValueClicked: function () {
            if(this.banks != null && cc.Tool.getInstance().copyToClipboard(this.banks.regAmount)) {
                cc.PopupController.getInstance().showMessage('Đã sao chép số tiền.');
            }
        },

        copyTranIDClicked: function () {
            if(this.banks != null && cc.Tool.getInstance().copyToClipboard(this.banks.chargeCode)) {
                cc.PopupController.getInstance().showMessage('Đã sao chép nội dung chuyển khoản.');
            }
        },

        onEditingValueChanged: function () {
            var val = cc.Tool.getInstance().removeDot(this.editBoxValue.string);
            this.editBoxValue.string = cc.Tool.getInstance().formatNumber(val);
            var receive = Math.round(val);

            this.lbMoney.string = 'Số ' + cc.Config.getInstance().currency() + ' nhận được: ' + cc.Tool.getInstance().formatNumber(receive);
        },

        onEditingValueDidEnd: function () {
            var val = cc.Tool.getInstance().removeDot(this.editBoxValue.string);
            this.editBoxValue.string = cc.Tool.getInstance().formatNumber(val);
            var receive = Math.round(val);

            this.lbMoney.string = 'Số ' + cc.Config.getInstance().currency() + ' nhận được: ' + cc.Tool.getInstance().formatNumber(receive);
        },

        createCodeClicked: function () {
            var chargeBankCommand = new cc.ChargeBankCommand;
            chargeBankCommand.execute(this);
        },
        openMenuBankClicked: function () {
            this.animationMenuBank.play(this.animOpenName);
        },

        hideMenuBankClicked: function () {
            this.animationMenuBank.play(this.animCloseName);
        },

        selectBankEvent: function(event, data) {
			this.bankCode = data.bankCode;
            this.selectBank(data.BankName);
            this.setLBSelectedBank(data);
            this.animationMenuBank.play(this.animCloseName);
        },

        chooseBankClicked: function (event, data) {
            this.selectBank(data.toString());
            this.setLBSelectedBank(data.toString());
        },

        refreshCaptchaClicked: function () {
            this.getCaptcha();
        },

        historyClicked: function () {
            cc.LobbyController.getInstance().createHistoryView(cc.HistoryTab.BANK);
        },

        continueClicked: function () {
            this.nodeStep1.active = true;
            this.resetInput();
        },

        topupClicked: function () {
            if (this.isCharging) {
                return;
            }
            this.amount = cc.Tool.getInstance().removeDot(this.editBoxValue.string);
            this.captcha = this.editBoxCaptcha.string;

            if (this.lbSelectedBank.string == 'CHỌN NGÂN HÀNG') {
                cc.PopupController.getInstance().showMessage('Vui lòng chọn ngân hàng.');
                return;
            }

            if (this.editBoxValue.string === '') {
                cc.PopupController.getInstance().showMessage('Vui lòng nhập số tiền muốn nạp.');
                return;
            }

            if (this.amount < 20000) {
                cc.PopupController.getInstance().showMessage('Số tiền nạp tối thiểu là ' + cc.Tool.getInstance().formatNumber(20000) + ' đ');
                return;
            }
            this.isCharging = true;
            var chargeBankCommand = new cc.ChargeBankCommand;
            chargeBankCommand.execute(this);
        },
    });
}).call(this);
