/**
 * Created by Nofear on 3/15/2019.
 */

var netConfig = require('NetConfig');

(function () {
    cc.SafeView = cc.Class({
        "extends": cc.Component,
        properties: {
            availableBalance: cc.Label,
            freezeBalance: cc.Label,

            lbBalanceInfo: cc.Label,
            lbSafeBalanceInfo: cc.Label,

            editBoxFreezeValue: cc.EditBox,

            editBoxOpenValue: cc.EditBox,
            editBoxOTP: cc.EditBox,

            btnGetOTPs: [cc.Button],
            lbBtnGetOTPs: [cc.Label],

            //menu otp
            nodeTeleSafes: [cc.Node],

            animationMenuOTP: cc.Animation,
            lbOTPType: cc.Label,
        },

        onLoad: function () {
            this.isTimer = false;
            this.timer = 0;
            this.timePerGetOTP = 120;
            this.updateInterval = 1;
            this.updateTimer = 0;

            this.freezeBalance.string = '0';
            this.availableBalance.string = '0';

            this.otpType = cc.OTPType.TELEGRAM;

            // this.editBoxFreezeValue.placeholder = 'Số tiền đóng băng';
            // this.editBoxOpenValue.placeholder = 'Số tiền mở băng';
        },

        onEnable: function () {
            this.editBoxFreezeValue.string = '';
            this.editBoxOpenValue.string = '';
            this.editBoxOTP.string = '';
            this.timer = parseInt(cc.Tool.getInstance().getItem("@TimeGetOTPSafe"));
            this.processTimeOTPButton();

            var getBalanceCommand = new cc.GetBalanceCommand;
            getBalanceCommand.execute(this);

            var loginResponse = cc.LoginController.getInstance().getLoginResponse();

            //#KingViet
            if (cc.Config.getInstance().getDomainVK().includes(netConfig.HOST)) {
                this.nodeTeleSafes.forEach(function (nodeTeleSafe) {
                    nodeTeleSafe.active = false;
                });
                this.otpType = cc.OTPType.TELEGRAM;
                this.lbOTPType.string = 'App OTP';
            } else {
                if (loginResponse.PhoneSafeNo === null) {
                    this.nodeTeleSafes.forEach(function (nodeTeleSafe) {
                        nodeTeleSafe.active = false;
                    });
                    this.otpType = cc.OTPType.TELEGRAM;
                    this.lbOTPType.string = 'OTP TELE';
                }
            }

        },

        onDisable: function () {
            cc.Tool.getInstance().setItem("@TimeGetOTPSafe", Math.round(this.timer));
        },

        onDestroy: function () {
            cc.Tool.getInstance().setItem("@TimeGetOTPSafe", Math.round(this.timer));
        },

        update: function (dt) {
            if (this.isTimer) {
                this.timer -= dt;
                this.updateTimer += dt;

                if (this.updateTimer < this.updateInterval) return; // we don't need to do the math every frame
                this.updateTimer = 0;
                this.processTimeOTPButton();
            }
        },

        activeTimeOTPButton: function () {
            this.isTimer = true;
            this.updateTimer = 1;
            this.timer = this.timePerGetOTP;
        },

        processTimeOTPButton: function () {
            if (this.timer <= 0) {
                this.isTimer = false;
                this.btnGetOTPs.forEach(function (btnGetOTP) {
                    btnGetOTP.interactable = true;
                });
                this.lbBtnGetOTPs.forEach(function (lbBtnGetOTP) {
                    lbBtnGetOTP.string = 'Lấy OTP';
                });
            } else {
                this.isTimer = true;
                var timeBtn = this.timer;
                this.btnGetOTPs.forEach(function (btnGetOTP) {
                    btnGetOTP.interactable = false;
                });
                this.lbBtnGetOTPs.forEach(function (lbBtnGetOTP) {
                    lbBtnGetOTP.string = Math.round(timeBtn);
                });
            }
        },

        onEditingFreezeValueChanged: function () {
            var val = cc.Tool.getInstance().removeDot(this.editBoxFreezeValue.string);
            this.editBoxFreezeValue.string = cc.Tool.getInstance().formatNumber(val);
        },

        onEditingOpenValueChanged: function () {
            var val = cc.Tool.getInstance().removeDot(this.editBoxOpenValue.string);
            this.editBoxOpenValue.string = cc.Tool.getInstance().formatNumber(val);
        },

        onGetBalanceResponse: function (response) {
            this.availableBalance.string = cc.Tool.getInstance().formatNumber(response.balance);
            this.freezeBalance.string = cc.Tool.getInstance().formatNumber(response.safebalance);
        },

        onGetOTPResponse: function (response) {
            if (response.Message) {
                cc.PopupController.getInstance().showMessage(response.Message);
            } else {
                cc.PopupController.getInstance().showMessage('Lấy OTP thành công');
            }
        },

        onGetOTPResponseError: function (response) {
            cc.PopupController.getInstance().showMessageError(response.Message, response.ResponseCode);
        },

        onDepositResponse: function (response) {
            this.editBoxFreezeValue.string = '';
            cc.PopupController.getInstance().showMessage('Gửi két thành công');
            this.availableBalance.string = cc.Tool.getInstance().formatNumber(response.data.Balance);
            this.freezeBalance.string = cc.Tool.getInstance().formatNumber(response.data.SafeBalance);

            if (this.lbBalanceInfo) {
                this.lbBalanceInfo.string = cc.Tool.getInstance().formatNumber(response.data.Balance);
                this.lbSafeBalanceInfo.string = cc.Tool.getInstance().formatNumber(response.data.SafeBalance);
            }

            cc.LobbyController.getInstance().refreshAccountInfo();
        },

        onWithdrawResponse: function (response) {
            this.editBoxOpenValue.string = '';
            this.editBoxOTP.string = '';
            cc.PopupController.getInstance().showMessage('Rút két thành công');
            this.availableBalance.string = cc.Tool.getInstance().formatNumber(response.data.Balance);
            this.freezeBalance.string = cc.Tool.getInstance().formatNumber(response.data.SafeBalance);

            if (this.lbBalanceInfo) {
                this.lbBalanceInfo.string = cc.Tool.getInstance().formatNumber(response.data.Balance);
                this.lbSafeBalanceInfo.string = cc.Tool.getInstance().formatNumber(response.data.SafeBalance);
            }

            cc.LobbyController.getInstance().refreshAccountInfo();
        },

        selectOTPEvent: function(event, data) {
            if(data.toString() === 'OTP TELE'){
                this.otpType = cc.OTPType.TELEGRAM;
            }else{
                this.otpType = cc.OTPType.SMS;
            }
            this.lbOTPType.string = data.toString();
            this.animationMenuOTP.play('hideDropdownMenu');
        },

        openMenuOTPClicked: function () {
            this.animationMenuOTP.play('showDropdownMenu');
        },

        hideMenuOTPClicked: function () {
            this.animationMenuOTP.play('hideDropdownMenu');
        },

        getOTPClicked: function () {
            // if (this.otpType == 1) { //if otpType is SMS
            //     this.activeTimeOTPButton();
            //     var getOTPCommand = new cc.GetOTPCommand;
            //     getOTPCommand.execute(this, '', this.otpType);
            // }
            // else {
            //     this.activeTimeOTPButton();
            //     var getOTPCommand = new cc.GetOTPCommand;
            //     getOTPCommand.execute(this, '', this.otpType);
            // }
            var loginResponse = cc.LoginController.getInstance().getLoginResponse();
            if (loginResponse.IsFirstUseOtp == true) {
                this.activeTimeOTPButton();
                cc.sys.openURL(cc.LobbyController.getInstance().getConfigServer().telegram_otp_bot + '?start=' + cc.LoginController.getInstance().getUserId());
            } else {
                cc.PopupController.getInstance().showMessageError("Bạn chưa xác thực số điện thoại.");
            }
        },
        
        freezeClicked: function () {
            this.amount = cc.Tool.getInstance().removeDot(this.editBoxFreezeValue.string);
            if (this.amount === '') {
                cc.PopupController.getInstance().showMessageError('Vui lòng nhập số tiền');
                return;
            }

            var depositCommand = new cc.DepositCommand;
            depositCommand.execute(this);
        },
        
        openClicked: function () {
            console.log(this.otpType)
            this.amount = cc.Tool.getInstance().removeDot(this.editBoxFreezeValue.string);
            // this.otp = this.editBoxOTP.string;

            if (this.amount === '') {
                cc.PopupController.getInstance().showMessageError('Vui lòng nhập số tiền');
                return;
            }

            // if (this.otp === '') {
            //     cc.PopupController.getInstance().showMessage('Vui lòng nhập mã OTP');
            //     return;
            // }

            var withdrawCommand = new cc.WithdrawCommand;
            withdrawCommand.execute(this, this.otpType);
        }
    });
}).call(this);
