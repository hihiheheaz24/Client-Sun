/**
 * Created by Nofear on 3/15/2019.
 */
 
// Edit and update by ZGAMETEAM
// telegram: https://t.me/zgameteam

var netConfig = require('NetConfig');

(function () {
    cc.TransferView = cc.Class({
        "extends": cc.Component,
        properties: {
            lbBalance: cc.Label,
            lbValueTransfer: cc.Label,

            editBoxNickNameReceive: cc.EditBox,
            editBoxNickNameReType: cc.EditBox,
            editBoxValueTransfer: cc.EditBox,
            editBoxReason: cc.EditBox,
            editBoxOTP: cc.EditBox,

            editBoxExchangeRate: cc.EditBox,//KingViet

            btnGetOTPs: [cc.Button],
            lbBtnGetOTP: cc.Label,

            nodeIsAgency: cc.Node,

            //menu otp
            animationMenuOTP: cc.Animation,
            lbOTPType: cc.Label,

            //tick
            tickNickNameReType: cc.Node,
            lbSmsHelp:cc.Node,
        },

        onLoad: function () {
            cc.TransferController.getInstance().setTransferView(this);
            this.isTimer = false;
            this.timer = 0;
            this.timePerGetOTP = 120;
            this.updateInterval = 1;
            this.updateTimer = 0;
            this.otpType = cc.OTPType.TELE_GRAM;

            // this.editBoxValueTransfer.string = "0";        
        },

        onEnable: function () {
            this.resetInput();
            this.lbValueTransfer.string = '0';

            this.timer = parseInt(cc.Tool.getInstance().getItem("@TimeGetOTPTransfer"));
            this.processTimeOTPButton();

            var loginResponse = cc.LoginController.getInstance().getLoginResponse();
            this.lbBalance.string = 'Số dư G11-Game: ' + cc.Tool.getInstance().formatNumber(loginResponse.Balance);

            var nickNameAgency = cc.Tool.getInstance().getItem('@nickNameAgency');
            this.editBoxNickNameReceive.string = nickNameAgency;
            var checkAgency = cc.ShopController.getInstance().checkNickNameAgency(nickNameAgency);
            this.isAgency = checkAgency;
            this.nodeIsAgency.active = checkAgency;

            //#KingViet
            if (cc.Config.getInstance().getDomainVK().includes(netConfig.HOST)) {
                this.otpType = cc.OTPType.TELE_SAFE;
                this.lbOTPType.string = 'App OTP';
            } else {
                if (loginResponse.PhoneSafeNo === null) {
                    this.otpType = cc.OTPType.TELE_GRAM;
                    this.lbOTPType.string = 'OTP TELE';
                }
            }

            this.tickNickNameReType.children.forEach((value) => {
                value.active = false;
            });
        },


        onDisable: function () {
            cc.Tool.getInstance().setItem("@TimeGetOTPTransfer", Math.round(this.timer));
        },

        onDestroy: function () {
            cc.Tool.getInstance().setItem("@TimeGetOTPTransfer", Math.round(this.timer));
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

        resetInput: function () {
            this.editBoxValueTransfer.string = '0';
            if (this.editBoxExchangeRate) {
                this.editBoxExchangeRate.string = '';
            }
            this.editBoxNickNameReceive.string = '';
            this.editBoxNickNameReType.string = '';
            this.editBoxReason.string = '';
            this.editBoxOTP.string = '';
            this.lbValueTransfer.string = '0';
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
                if (this.otpType == cc.OTPType.TELE_GRAM) {
                    this.lbBtnGetOTP.string = 'Lấy OTP';
                }
                else
                {
                    this.lbBtnGetOTP.string = 'Lấy ODP';
                }
                
            } else {
                this.isTimer = true;
                var timeBtn = this.timer;
                this.btnGetOTPs.forEach(function (btnGetOTP) {
                    btnGetOTP.interactable = false;
                });
                this.lbBtnGetOTP.string = Math.round(timeBtn);
            }
        },

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
            cc.PopupController.getInstance().showMessageError(response.Message, response.ResponseCode);
        },

        onUserTransferResponse: function (response) {
            this.timer = 0;
            cc.Tool.getInstance().setItem("@TimeGetOTPTransfer", Math.round(this.timer));
            this.processTimeOTPButton();

            this.lbBalance.string = 'Số dư G11-Game: ' + cc.Tool.getInstance().formatNumber(response.Balance);
            this.resetInput();

            var loginResponse = cc.LoginController.getInstance().getLoginResponse();
            loginResponse.Balance = response.Balance;
            cc.LoginController.getInstance().setLoginResponse(loginResponse);
            cc.LobbyController.getInstance().refreshAccountInfo();

            cc.PopupController.getInstance().showMessage(response.Message);
        },

        onUserTransferResponseError: function (response) {
            if(response.ResponseCode == 200){
                this.timer = 0;
                cc.Tool.getInstance().setItem("@TimeGetOTPTransfer", Math.round(this.timer));
                this.processTimeOTPButton();
                this.resetInput();
            }else{
                cc.PopupController.getInstance().showMessageError(response.Message, response.ResponseCode);
            }
        },

        onEditingNickNameReceiveChanged: function () {
            var checkAgency = cc.ShopController.getInstance().checkNickNameAgency(this.editBoxNickNameReceive.string);
            this.isAgency = checkAgency;
            this.nodeIsAgency.active = checkAgency;
        },

        onEditingReTypeBegan: function () {
            if (this.editBoxNickNameReType.string != "") {
                if (this.editBoxNickNameReceive.string === this.editBoxNickNameReType.string) {
                    this.tickNickNameReType.children.forEach((value) => {
                        if(value.name === "true") {
                            value.active = true;
                        } else {
                            value.active = false;
                        }
                    });
                } else {
                    this.tickNickNameReType.children.forEach((value) => {
                        if(value.name === "true") {
                            value.active = false;
                        } else {
                            value.active = true;
                        }
                    });
                }
            }
        },

        onEditingNickNameReTypeChanged: function () {
            if (this.editBoxNickNameReceive.string === this.editBoxNickNameReType.string) {
                this.tickNickNameReType.children.forEach((value) => {
                    if(value.name === "true") {
                        value.active = true;
                    } else {
                        value.active = false;
                    }
                });
            } else {
                this.tickNickNameReType.children.forEach((value) => {
                    if(value.name === "true") {
                        value.active = false;
                    } else {
                        value.active = true;
                    }
                });
            }
        },

        onEditingValueChanged: function () {
            var val = cc.Tool.getInstance().removeDot(this.editBoxValueTransfer.string);
            this.editBoxValueTransfer.string = cc.Tool.getInstance().formatNumber(val);
            var realReceive = val*98/100;
            this.lbValueTransfer.string = cc.Tool.getInstance().formatNumber(realReceive);
        },

        onEditingValueDidEnd: function () {
            var val = cc.Tool.getInstance().removeDot(this.editBoxValueTransfer.string);
            this.editBoxValueTransfer.string = cc.Tool.getInstance().formatNumber(val);
            var realReceive = val*98/100;
            this.lbValueTransfer.string = cc.Tool.getInstance().formatNumber(realReceive);        },

        selectOTPEvent: function(event, data) {
            this.otpType = "";
            if(data.toString() === 'App OTP'){
                this.otpType = cc.OTPType.TELE_SAFE;
            }else if(data.toString() === 'OTP TELE'){
                this.otpType = cc.OTPType.TELE_GRAM;
                this.lbSmsHelp.active = false;
                this.lbBtnGetOTP
            }else{
                this.otpType = cc.OTPType.SMS;
                this.lbSmsHelp.active = true;
            }
            if (this.otpType == cc.OTPType.TELE_GRAM) {
                this.lbBtnGetOTP.string = 'Lấy OTP';
            }
            else
            {
                this.lbBtnGetOTP.string = 'Lấy ODP';
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
            this.activeTimeOTPButton();
            var getOTPCommand = new cc.GetOTPCommand;
            getOTPCommand.execute(this, '', this.otpType);
        },
        
        confirmTransferClicked: function () {
            this.nickName = this.editBoxNickNameReceive.string.toLowerCase();
            this.nickNameReType = this.editBoxNickNameReType.string.toLowerCase();
            this.amount = cc.Tool.getInstance().removeDot(this.editBoxValueTransfer.string);
            this.reason = this.editBoxReason.string;
            this.otp = this.editBoxOTP.string;

            if (this.editBoxExchangeRate) {
                this.exchangeRate = this.editBoxExchangeRate.string;
            }

            if (this.nickName === '') {
                cc.PopupController.getInstance().showMessage('Vui lòng nhập NickName người nhận');
                return;
            }

            if (this.nickName != this.nickNameReType) {
                cc.PopupController.getInstance().showMessage('Vui lòng kiểm tra lại Nickname');
                return;
            }

            if (this.amount === '') {
                cc.PopupController.getInstance().showMessage('Vui lòng nhập số ' + cc.Config.getInstance().currency() + ' cần chuyển');
                return;
            }

            //nếu là ĐL và cổng VK thì check
            if (cc.Config.getInstance().getDomainVK().includes(netConfig.HOST) && this.isAgency) {
                if (this.editBoxExchangeRate && this.editBoxExchangeRate.string === '') {
                    cc.PopupController.getInstance().showMessage('Vui lòng nhập chính xác tỷ giá bán cho Đại Lý');
                    return;
                }
            } else {

            }

            if (this.reason === '') {
                cc.PopupController.getInstance().showMessage('Vui lòng nhập lý do chuyển');
                return;
            }

            // if (this.otp === '') {
            //     cc.PopupController.getInstance().showMessage('Vui lòng nhập mã OTP');
            //     return;
            // }

            cc.PopupController.getInstance().showBusy();
            var userTransferCommand = new cc.UserTransferCommand;
            userTransferCommand.execute(this);
        },

        agencyListClicked: function () {
            cc.ShopController.getInstance().activeTab(cc.ShopTab.AGENCY);
        }, 
        
        bindNickName: function (nickName) {        
            this.editBoxNickNameReceive.string = nickName;
            var checkAgency = cc.ShopController.getInstance().checkNickNameAgency(nickName);
            this.isAgency = checkAgency;
            this.nodeIsAgency.active = checkAgency;
        }
    });
}).call(this);
