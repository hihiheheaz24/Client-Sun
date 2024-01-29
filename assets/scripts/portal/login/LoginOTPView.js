/**
 * Created by Nofear on 3/14/2019.
 */

var netConfig = require('NetConfig');

(function () {
    cc.LoginOTPView = cc.Class({
        "extends": cc.Component,
        properties: {
            nodeOTP: cc.Node,
            editBoxCode: cc.EditBox,
            animation: cc.Animation,

            btnGetOTPs: [cc.Button],
            lbBtnGetOTPs: [cc.Label],

            animationMenuOTP: cc.Animation,
            lbOTPType: cc.Label,

            //custom
            lbSmsHelp: cc.RichText,
            lbODPStatus:cc.RichText
        },

        // use this for initialization
        onLoad: function () {
            cc.LoginController.getInstance().setOTPView(this);
            this.isTimer = false;
            this.timer = 0;
            this.timePerGetOTP = 120;
            this.updateInterval = 1;
            this.updateTimer = 0;

            this.otpType = cc.OTPType.TELE_GRAM;
            },

        onEnable: function () {
            this.lbODPStatus.string = '';
            this.lbODPStatus.node.active = false;
            this.editBoxCode.string = '';
            this.timer = parseInt(cc.Tool.getInstance().getItem("@TimeGetOTPLoginOTP"));
            this.processTimeOTPButton();

            //#KingViet
            if (cc.Config.getInstance().getDomainVK().includes(netConfig.HOST)) {

            } else {
                var loginResponse = cc.LoginController.getInstance().getLoginResponse();
                if (loginResponse !== undefined && loginResponse.PhoneSafeNo === null) {
                    this.otpType = cc.OTPType.TELE_GRAM;
                }
            }
        },

        onDisable: function () {
            cc.Tool.getInstance().setItem("@TimeGetOTPLoginOTP", Math.round(this.timer));
        },

        onDestroy: function () {
            cc.Tool.getInstance().setItem("@TimeGetOTPLoginOTP", Math.round(this.timer));
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
                if(this.otpType === cc.OTPType.TELE_GRAM){
                    this.lbBtnGetOTPs.forEach(function (lbBtnGetOTP) {
                        lbBtnGetOTP.string = 'LẤY OTP';
                    });
                }else{
                    this.lbBtnGetOTPs.forEach(function (lbBtnGetOTP) {
                        lbBtnGetOTP.string = 'LẤY ODP';
                    });
                }
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

        showOTP: function (enable) {
            this.nodeOTP.active = enable;
            if (enable) {
                this.animation.play('openPopup');
            } else {
                //cc.LoginController.getInstance().stayOnTop(true);
            }
        },

        backClicked: function () {
            this.animation.play('closePopup');
            var self = this;
            var delay = 0.2;
            cc.director.getScheduler().schedule(function () {
                self.animation.stop();
                self.showOTP(false);
            }, this, 1, 0, delay, false);
        },

        //login
        onLoginOTPResponse: function (response) {
            if (response.Token) {
                cc.ServerConnector.getInstance().setToken(response.Token);
            }

            cc.LoginController.getInstance().setUserId(response.AccountInfo.AccountID);
            cc.LoginController.getInstance().setNickname(response.AccountInfo.AccountName);
            cc.LoginController.getInstance().setLoginResponse(response.AccountInfo);
            cc.LoginController.getInstance().setNextVPResponse(response.NextVIP);
            cc.LobbyController.getInstance().loginSuccess();
            cc.LobbyController.getInstance().destroyLoginView();
        },

        onLoginOTPResponseError: function (response) {
            cc.PopupController.getInstance().showMessageError(response.Message);
        },

        //getOTP
        onGetOTPResponse: function (response) {
            if (response.Message) {
                cc.PopupController.getInstance().showMessage(response.Message);
            } else {
                cc.PopupController.getInstance().showMessage('Lấy OTP thành công');
            }
        },

        onGetOTPResponseError: function (response) {
            let self = this;
            setTimeout(function(){
                if(response.ResponseCode == -3 && self.otpType && self.otpType == cc.OTPType.TELE_GRAM){
                    cc.sys.openURL(cc.Config.getInstance().taiotpx6());
                }
            },1000);
            cc.PopupController.getInstance().showMessageError(response.Message);
        },

        onGetLoginOTPResponse: function (response) {
            if (response.Message) {
                cc.PopupController.getInstance().showMessage(response.Message);
            } else {
                cc.PopupController.getInstance().showMessage('Lấy OTP thành công');
            }
        },

        onGetLoginOTPResponseError: function (response) {
            cc.PopupController.getInstance().showMessageError(response.Message);
        },

        selectOTPEvent: function (event, data) {
            this.otpType = "";
            if(data.toString() === 'App OTP'){
                this.otpType = cc.OTPType.TELE_SAFE;
            }else if(data.toString() === 'OTP TELE'){
                this.otpType = cc.OTPType.TELE_GRAM;
                this.lbBtnGetOTPs.forEach(function (lbBtnGetOTP) {
                    lbBtnGetOTP.string = 'LẤY OTP';
                });
                this.lbSmsHelp.node.active = false;
                this.lbODPStatus.node.active = false;

            }else{
                this.otpType = cc.OTPType.SMS;
                this.lbBtnGetOTPs.forEach(function (lbBtnGetOTP) {
                    lbBtnGetOTP.string = 'LẤY ODP';
                });
                this.getStatusODPDailyWithoutLogin();
                this.lbODPStatus.node.active = true;
                this.lbSmsHelp.node.active = true;
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

        loginOTPClicked: function () {
            this.otp = this.editBoxCode.string;

            if (this.otp === '') {
                cc.PopupController.getInstance().showMessageWarning("Vui lòng nhập mã xác thực!");
                return;
            }

            var loginOTPCommand = new cc.LoginOTPCommand;
            loginOTPCommand.execute(this, this.otpType);
        },

        getOTPClicked: function () {
            this.activeTimeOTPButton();


            var getLoginOTPCommand = new cc.GetLoginOTPCommand;
            getLoginOTPCommand.execute(this, this.otpType);

            /*
            var getOTPCommand = new cc.GetOTPCommand;
            getOTPCommand.execute(this);*/
        },
        getStatusODPDailyWithoutLogin: function () {
            var GetStatusODPDailyWithoutLoginCommand = new cc.GetStatusODPDailyWithoutLoginCommand;
            GetStatusODPDailyWithoutLoginCommand.execute(this, cc.LoginController.getInstance().getUsername());
        },
        onGetStatusODPDailyWithoutLoginResponse:function (response)
        {
            this.lbODPStatus.string = "Bạn đã nhận ODP trong ngày, vui lòng kiểm tra lại hộp thư trước khi lấy thêm mã để tránh phát sinh thêm chi phí!";
            this.lbODPStatus.node.active = true;
        },
        onGetStatusODPDailyWithoutLoginResponseError:function (response)
        {
            this.lbODPStatus.string = "";
            this.lbODPStatus.node.active = true;
        },
    });
}).call(this);
