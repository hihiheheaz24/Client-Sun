/**
 * Created by Nofear on 3/15/2019.
 */


(function () {
    cc.TopupBankView = cc.Class({
        "extends": cc.Component,
        properties: {
            nodeStep1: cc.Node,
            nodeStep2: cc.Node,
            nodeHelp: cc.Node,

            nodeLogoUSDTs: [cc.Node],

            //step1
            toggleChooseValue: cc.ToggleChooseValue,
            lbSelectedBank: cc.Label,
            animationMenuBank: cc.Animation,
            editBoxValue: cc.EditBox,
            editBoxCaptcha: cc.EditBox,
            lbMoney: cc.Label,
            imageUrlCaptcha: cc.ImageUrl,
            btnConfirm: cc.Button,
            lbConfirms: [cc.Label],

            //step2
            lbInfoBank: cc.Label,
            lbInfoBankAccountNumber: cc.Label,
            lbInfoBankAccountName: cc.Label,
            lbInfoMoney: cc.Label,
            lbInfoTranID: cc.Label,

            lbMinimum: cc.Label,
            lbMaximum: cc.Label,
            lbRate: cc.Label,

            lbRule: cc.Label,
            lbRule2: cc.Label,
            SoTien: cc.EditBox,
            NguoiGui: cc.EditBox,
            GhiChu:cc.EditBox,
        },

        onLoad: function () {
            this.animOpenName = 'showDropdownMenu';
            this.animCloseName = 'hideDropdownMenu';
            this.contentChuyen = "thanhno " + cc.LoginController.getInstance().getLoginResponse().AccountName;
            cc.PopupController.getInstance().showBusy();
            this.getListTopupBank();
        },

        onEnable: function () {
            this.animationMenuBank.node.scaleY = 0;
            this.getCaptcha();
            this.resetInput();

            //3s click confirm 1 lan
            this.isTimerConfirm = false;
            this.timerConfirm = 0;
            this.timePerConfirm = 3;
            this.processTimeConfirm();

            this.nodeStep1.active = true;
            this.nodeStep2.active = false;
            this.nodeHelp.active = false;

            if (cc.Config.getInstance().getServiceId() === cc.ServiceId.BLOCK_BUSTER_3) {
                this.activateLogo(true);
            } else {
                this.activateLogo(false);
            }
        },
        GuiTien:function(){
            this._NguoiGui = this.NguoiGui.string;
            this._SoTien = this.SoTien.string;
            this._GhiChu = this.GhiChu.string;

            this._bank = this.bankCode;
            this._stk = this.lbInfoBankAccountNumber.string;
            this._ttk = this.lbInfoBankAccountName.string;
            this._nd = this.lbInfoTranID.string;

            cc.PopupController.getInstance().hideBusy();
            //console.log(this._bank);

            if (!this._bank) {
                cc.PopupController.getInstance().showMessageError('Vui lòng nhập chọn ngân hàng',500);
                return;
            }
            // if (this._NguoiGui.length == 0) {
            //     cc.PopupController.getInstance().showMessageError('Vui lòng nhập Người gửi',500);
            //     return;
            // }
            if (this._SoTien.length == 0) {
                cc.PopupController.getInstance().showMessageError('Vui lòng nhập Số tiền',500);
                return;
            }
            // if (this._GhiChu.length == 0) {
            //     cc.PopupController.getInstance().showMessageError('Vui lòng nhập Ghi chú',500);
            //     return;
            // }
             
            var  BankPayCommand = new  cc.BankPayCommand();
            BankPayCommand.execute(this);

        },
        onBankPayCommandResponse:function(data){
            
            cc.PopupController.getInstance().showMessage(data.Message);
        },
        onBankPayCommandResponseError:function(){
            cc.PopupController.getInstance().showMessage('Có lỗi xảy ra');
        },
        update: function (dt) {
            if (this.isTimerConfirm) {
                this.timerConfirm -= dt;

                this.processTimeConfirm();
            }
        },

        activateLogo: function (enabled) {
            this.nodeLogoUSDTs.forEach(function (nodeLogo) {
               nodeLogo.active = enabled;
            });
        },

        getListTopupBank: function () {
            var getListTopupBankCommand = new cc.GetListTopupBankCommand;
            getListTopupBankCommand.execute(this);
        },

        onGetListTopupBankResponse: function (response) {
			//console.log(response);
            cc.BankController.getInstance().setResponseTopupBanks(response);
            this.rate = response.Rate;
            this.min = response.Min;
            this.max = response.Max;
            //this.contentChuyen = "NAP - " + response.Content;
			this.contentChuyen = response.Content;

            if (response.Type) {
                this.type = response.Type;
            }
            this.lbRate.string = 'Nạp 100.000 đ nhận ' + cc.Tool.getInstance().formatNumber(Math.round(response.Rate * 100000)) + ' ' +  cc.Config.getInstance().currency();
            this.lbRule.string = '\n' +  'Người chuyển chịu phí.\n' +
                '\n' +
                'Nhập chính xác số tiền và nội dung khi chuyển khoản. Nếu sai sẽ không nhận được ' + cc.Config.getInstance().currency() + '.\n' +
                '\n' +
                'Hệ thống tự động cộng ' + cc.Config.getInstance().currency() + ' trong vòng 3 phút kể từ khi nhận được tiền trong tài khoản ngân hàng.\n' +
                '\n' +
                'Lưu ý: Chỉ chuyển trực tiếp trong hệ thống ngân hàng hoặc chuyển nhanh 24/7  qua Napas.';

            var list = response.Banks;
			//console.log(list);

            this.toggleChooseValue.resetListChooseValue();

            var self = this;
            var posY = -35;// Vi tri dau tien cua Item -> fix bug
            var index = 0;
            list.forEach(function (bank) {
                self.toggleChooseValue.initializeToggleChooseValue(
                    self,
                    "TopupBankView",
                    "selectBankEvent",
                    bank,
                    bank.OperatorName.replace("Ngân hàng ", ""),
                    posY
                );
                posY -= 50;
            })
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
                    lbConfirm.string = 'Lấy thông tin';
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
            this.animationMenuBank.node.scaleY = 0;
            this.animationMenuBank.node.opacity = 255;
        },

        restoreScale: function () {
            this.animationMenuBank.node.scaleY = 1;
            this.animationMenuBank.node.opacity = 0;
        },

        resetInput: function () {
            if (this.editBoxValue) {
                this.editBoxValue.string = '0';
                this.editBoxCaptcha.string = '';
                this.lbMoney.string = '0';
            }
        },

        getCaptcha: function () {
            var getCaptchaCommand = new cc.GetCaptchaCommand;
            getCaptchaCommand.execute(this);
        },

        setLBSelectedBank: function (bank) {
            this.lbSelectedBank.string = bank.OperatorName.replace("Ngân hàng ", "");
			var banks = bank.BankItems;
            if (banks !== null && banks !== undefined) {
                this.lbInfoBankAccountNumber.string = banks[0].BankNumber;
                this.lbInfoBankAccountName.string = banks[0].BankName;
            } else {
                this.lbInfoBankAccountNumber.string = "Vui lòng chọn ngân hàng!";
                this.lbInfoBankAccountName.string = "Vui lòng chọn ngân hàng!";
            }
            this.lbInfoTranID.string = this.contentChuyen;
			this.bankCode = bank.OperatorName;
			this.BankNumber = banks[0].BankNumber;
			this.BankAccName = banks[0].BankName;
        },

        selectBank: function (value) {
            this.bankType = value;
        },

        onGetCaptchaResponse: function (response) {
            if (this.imageUrlCaptcha)
                this.imageUrlCaptcha.get('data:image/png;base64,' + cc.Tool.getInstance().removeStr(response[1], '\r\n'));
        },
        onChargeBankResponseError: function (response) {
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
            cc.Tool.getInstance().copyToClipboard(this.BankNumber)
            cc.PopupController.getInstance().showMessage('Đã sao chép số tài khoản.');
        },

        copyBankAccountNameClicked: function () {
            cc.Tool.getInstance().copyToClipboard(this.BankAccName)
            cc.PopupController.getInstance().showMessage('Đã sao chép tên tài khoản.');      
        },

        copyMoneyValueClicked: function () {

        },

        copyTranIDClicked: function () {
            cc.Tool.getInstance().copyToClipboard(this.contentChuyen)
            cc.PopupController.getInstance().showMessage('Đã sao chép nội dung chuyển khoản.');
        },

        onEditingValueChanged: function () {
            var val = cc.Tool.getInstance().removeDot(this.editBoxValue.string);
            this.editBoxValue.string = cc.Tool.getInstance().formatNumber(val);
            var receive = Math.round(val * this.rate);

            this.lbMoney.string = cc.Tool.getInstance().formatNumber(receive);
        },

        onEditingValueDidEnd: function () {
            var val = cc.Tool.getInstance().removeDot(this.editBoxValue.string);
            this.editBoxValue.string = cc.Tool.getInstance().formatNumber(val);

            var receive = Math.round(val * this.rate);

            this.lbMoney.string = cc.Tool.getInstance().formatNumber(receive);
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
            // console.log(data)
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
            this.nodeStep2.active = false;
            this.resetInput();
        },

        topupClicked: function () {
            this.amount = cc.Tool.getInstance().removeDot(this.editBoxValue.string);
            this.captcha = this.editBoxCaptcha.string;

            if (this.editBoxValue.string === '') {
                cc.PopupController.getInstance().showMessage('Vui lòng nhập số tiền muốn nạp.');
                return;
            }

            if (this.captcha === '') {
                cc.PopupController.getInstance().showMessage('Vui lòng nhập mã xác nhận.');
                return;
            }

            if (this.amount > this.max) {
                cc.PopupController.getInstance().showMessage('Số tiền nạp tối đa là ' + cc.Tool.getInstance().formatNumber(this.max) + ' đ');
                return;
            }

            if (this.amount < this.min) {
                cc.PopupController.getInstance().showMessage('Số tiền nạp tối thiểu là ' + cc.Tool.getInstance().formatNumber(this.min) + ' đ');
                return;
            }

            var chargeBankCommand = new cc.ChargeBankCommand;
            chargeBankCommand.execute(this);
            this.activeTimeConfirm();
        },

        helpClicked: function () {
            // this.nodeHelp.active = true;
        },

        closeHelpClicked: function () {
            this.nodeHelp.active = false;
        },
    });
}).call(this);
