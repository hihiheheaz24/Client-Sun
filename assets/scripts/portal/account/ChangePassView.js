/**
 * Created by Nofear on 3/15/2019.
 */

var netConfig = require('NetConfig');

(function () {
    cc.ChangePassView = cc.Class({
        "extends": cc.Component,
        properties: {
            editBoxOldPassword: cc.EditBox,
            editBoxNewPassword: cc.EditBox,
            editBoxRePassword: cc.EditBox,
            editBoxCaptcha: cc.EditBox,
            editBoxOTP: cc.EditBox,

            imageUrlCaptcha: cc.ImageUrl,

            btnGetOTPs: [cc.Button],
            lbBtnGetOTPs: [cc.Label],

            lbError: cc.Label,

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
            this.otpType = cc.OTPType.TELEGRAM;
            this.animation = this.node.getComponent(cc.Animation);
        },

        onEnable: function () {
            this.animation.play('openPopup');

            this.lbError.string = '';
            this.getCaptcha();
            this.timer = parseInt(cc.Tool.getInstance().getItem("@TimeGetOTPChangePass"));
            this.processTimeOTPButton();

            var loginResponse = cc.LoginController.getInstance().getLoginResponse();

            //#KingViet
            if (cc.Config.getInstance().getDomainVK().includes(netConfig.HOST)) {
                this.nodeTeleSafes.forEach(function (nodeTeleSafe) {
                    nodeTeleSafe.active = false;
                });
                this.otpType = cc.OTPType.TELE_SAFE;
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

        backClicked: function () {
            this.animation.play('closePopup');
            var self = this;
            var delay = 0.12;
            cc.director.getScheduler().schedule(function () {
                self.animation.stop();
                self.node.active = false;
            }, this, 1, 0, delay, false);
        },

        onDisable: function () {
            cc.Tool.getInstance().setItem("@TimeGetOTPChangePass", Math.round(this.timer));
        },

        onDestroy: function () {
            cc.Tool.getInstance().setItem("@TimeGetOTPChangePass", Math.round(this.timer));
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
                    lbBtnGetOTP.string = 'LẤY OTP';
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

        getCaptcha: function () {
            var getCaptchaCommand = new cc.GetCaptchaCommand;
            getCaptchaCommand.execute(this);
        },

        //Response
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

        onGetCaptchaResponse: function (response) {
            this.imageUrlCaptcha.get('data:image/png;base64,' + cc.Tool.getInstance().removeStr(response[1], '\r\n'));
        },

        onChangePasswordResponse: function (response) {
            cc.PopupController.getInstance().showMessage(response.Message, response.ResponseCode);
            this.getCaptcha();
        },

        onChangePasswordResponseError: function (response) {
            this.lbError.string = response.Message;
            this.getCaptcha();
        },

        selectOTPEvent: function(event, data) {
            this.otpType = "";
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

        changePasswordClicked: function () {
            this.lbError.string = '';

            this.oldPass = this.editBoxOldPassword.string;
            this.newPass = this.editBoxNewPassword.string;
            this.rePassword = this.editBoxRePassword.string;
            this.captcha = this.editBoxCaptcha.string;
            this.otp = this.editBoxOTP.string;

            if (this.oldPass === '') {
                this.lbError.string = 'Vui lòng nhập mật khẩu cũ';
                return;
            }

            if (this.newPass === '') {
                this.lbError.string = 'Vui lòng nhập mật khẩu mới';
                return;
            }

            if (this.rePassword === '') {
                this.lbError.string = 'Vui lòng nhập lại mật khẩu mới';
                return;
            }

            if (this.rePassword !== this.newPass) {
                this.lbError.string = 'Nhập lại mật khẩu không khớp';
                return;
            }

            if (this.captcha === '') {
                this.lbError.string = 'Vui lòng nhập mã xác nhận';
                return;
            }

            if (this.otp === '') {
                this.lbError.string = 'Vui lòng nhập mã OTP';
                return;
            }

            var changePasswordCommand = new cc.ChangePasswordCommand;
            changePasswordCommand.execute(this, this.otpType);
        },

        getOTPClicked: function () {
            // if (this.otpType == 1) { //if otpType is SMS
            //     this.activeTimeOTPButton();
            //     var getOTPCommand = new cc.GetOTPCommand;
            //     getOTPCommand.execute(this, '', this.otpType);
            // } else {
            //     this.activeTimeOTPButton();
            //     var getOTPCommand = new cc.GetOTPCommand;
            //     getOTPCommand.execute(this, '', this.otpType);
            // }
            var loginResponse = cc.LoginController.getInstance().getLoginResponse();
            if (loginResponse.IsFirstUseOtp == true) {
                this.activeTimeOTPButton();
                cc.sys.openURL(cc.LobbyController.getInstance().getConfigServer().telegram_otp_bot + '?start=' + cc.LoginController.getInstance().getUserId());
            } else {
                cc.PopupController.getInstance().showMessage("Bạn chưa xác thực số điện thoại.");
            }
        },

        refreshCaptchaClicked: function () {
            this.getCaptcha();
        },
    });
}).call(this);
