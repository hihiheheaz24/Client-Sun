var netConfig = require('NetConfig');

(function () {
    cc.LoginGroupView = cc.Class({
        "extends": cc.Component,
        properties: {
            editBoxUsername: cc.EditBox,
            editBoxPassword: cc.EditBox,
            lbError: cc.Label
        },

        onLoad: function () {
            cc.LoginController.getInstance().setLoginView(this);
        },

        onEnable: function () {
            this.lbError.string = '';
            var tool = cc.Tool.getInstance();
            if (tool.getItem('@rememberPassword') !== null) {
                if (tool.getItem('@rememberPassword') === 'true') {
                    this.editBoxUsername.string = tool.getItem('@username').toString();
                    this.editBoxPassword.string = tool.getItem('@password').toString();
                }
            }
        },

        showCaptcha: function() {
            this.getCaptcha();
        },

        getCaptcha: function () {
            var getCaptchaCommand = new cc.GetCaptchaCommand;
            getCaptchaCommand.execute(this);
        },

        showLogin: function (enable) {
            this.nodeLogin.active = enable;
        },

        callLogin: function () {
            this.lbError.string = '';
            this.username = this.editBoxUsername.string;
            this.password = this.editBoxPassword.string;

            if (this.username === '') {
                this.lbError.string = 'Vui lòng nhập tên tài khoản';
                return;
            }

            if (this.password === '') {
                this.lbError.string = 'Vui lòng nhập mật khẩu';
                return;
            }

            cc.Tool.getInstance().setItem('@rememberPassword', true);
            cc.Tool.getInstance().setItem('@username', this.username);
            cc.Tool.getInstance().setItem('@password', this.password);
            cc.Tool.getInstance().setItem('@isLanding', false);

            cc.LoginController.getInstance().setUsername(this.username);
            cc.LoginController.getInstance().setPassword(this.password);
            cc.PopupController.getInstance().showBusy();

            var loginCommand = new cc.LoginCommand;
            loginCommand.execute(this);
        },

        editBoxPasswordDidGo: function () {
            this.callLogin();
        },

        //Response
        onGetAccountInfoResponse: function (response) {
            cc.LoginController.getInstance().setLoginResponse(response.AccountInfo);
            cc.LoginController.getInstance().setNextVPResponse(response.NextVIP);
            cc.LoginController.getInstance().setNickname(response.AccountInfo.AccountName);
            cc.LoginController.getInstance().setUserId(response.AccountInfo.AccountID);
            cc.LoginController.getInstance().setTopVPResponse(response.TopVP);

            if (response.AccountInfo.AccountName === null) {
                cc.LoginController.getInstance().showNickname(true);
            } else if (response.AccountInfo.AuthenType === 1) {
                cc.LobbyController.getInstance().loginSuccess();
            } else {
                cc.LobbyController.getInstance().loginSuccess();
            }
        },

        onGetCaptchaResponse: function (response) {
            this.imageUrlCaptcha.get('data:image/png;base64,' + cc.Tool.getInstance().removeStr(response[1], '\r\n'));
        },

        onLoginResponse: function (response) {
            if (response.Token) {
                cc.ServerConnector.getInstance().setToken(response.Token);
            }
            cc.LoginController.getInstance().setLoginResponse(response.AccountInfo);
            cc.LoginController.getInstance().setNextVPResponse(response.NextVIP);
            cc.LoginController.getInstance().setNickname(response.AccountInfo.AccountName);
            cc.LoginController.getInstance().setUserId(response.AccountInfo.AccountID);
            cc.LoginController.getInstance().setTopVPResponse(response.TopVP);

            if (response.AccountInfo.AccountName === null) {
                cc.Tool.getInstance().setItem('@usernameLabel', `${this.username}`);
                cc.LobbyController.getInstance().createLoginView();
                cc.LoginController.getInstance().showLogin(false);
                cc.LoginController.getInstance().showNickname(true);
            } else if (response.AccountInfo.AuthenType === 1) {
                cc.LoginController.getInstance().showOTP(true);
                //Cho qua luon ko hien OTP de
                cc.LobbyController.getInstance().loginSuccess();
            } else {
                cc.LobbyController.getInstance().loginSuccess();
                var getAccountInfoCommand = new cc.GetAccountInfoCommand;
                getAccountInfoCommand.execute(this);

            }
        },

        onLoginResponseError: function (response) {
            console.log(response)
            if (response.ResponseCode === cc.LoginError.REQUIRE_CAPTCHA) {
                this.lbError.string = response.Message;
                cc.LobbyController.getInstance().ShowLoginPopup();
            } else if (response.ResponseCode === cc.LoginError.REQUIRE_OTP) {
                cc.LobbyController.getInstance().ShowLoginPopup();
            } else if (response.ResponseCode === cc.LoginError.OTP_INCORRECT) {
                cc.LobbyController.getInstance().ShowLoginPopup();
            } else {
                this.lbError.string = response.Message;
            }
        },

        //Click
        loginClicked: function () {
            this.callLogin();
        }
    });
}).call(this);
