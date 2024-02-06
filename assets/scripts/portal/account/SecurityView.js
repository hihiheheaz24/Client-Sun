/**
 * Created by Nofear on 3/15/2019.
 */

var netConfig = require('NetConfig');

(function () {
    cc.SecurityView = cc.Class({
        "extends": cc.Component,
        properties: {
            nodeGroupNoPhoneNumber: cc.Node,
            nodeGroupUpdatePhoneNumber: cc.Node,
            editBoxPhoneNumber: cc.EditBox,
            editBoxOTP: cc.EditBox,
            editBoxOTPSecurityAccount: cc.EditBox,
            btnGetOTPs: [cc.Button],
            lbBtnGetOTPs: [cc.Label],
            toggleLoginSecurity: cc.Toggle,
            lbPhoneNumber: cc.Label,
            lbTeleID: cc.Label,
            titlePhoneNumber: cc.Label,
            titleTeleID: cc.Label,
            titleSecurity: cc.Label,

            //group hien khi da dky so dien thoai
            nodeGroupHavePhoneNumber: cc.Node,
            //group kichhoat/huy BM Login va xoa so dien thoai
            nodeGroupDeActive: cc.Node,
            //confirm huy BM Login
            nodeGroupConfirmDeActive: cc.Node,
            nodeGroupConfirmDeActiveSMS: cc.Node,

            //confirm xoa so dt
            nodeGroupConfirmDeletePhone: cc.Node,

            //node button kich hoat BM Login
            nodeActive: cc.Node,
            //node button Huy kich hoat BM Login
            nodeDeActive: cc.Node,


            //#KingViet
            nodeBtnLinkAppSafe: cc.Node,

            //node Huy SĐT Bao mat
            nodeDeletePhone: cc.Node,
            //node Them SĐT Bao Mat
            nodeAddPhone: cc.Node,


            //editboxOTP khi confirm huy BM Login
            editBoxOTPDeActiveTele: cc.EditBox,
            editBoxOTPDeActiveSMS: cc.EditBox,


            editBoxOTPDeletePhone: cc.EditBox,

            //dropdown menu
            nodeTeleSafes: [cc.Node],

            animationMenuOTPDeletePhone: cc.Animation,
            animationMenuOTPCancelLoginSecurity: cc.Animation,

            lbOTPDeletePhone: cc.Label,
            lbOTPCancelLoginSecurity: cc.Label,

            groupNodeVNs: [cc.Node],
            groupNodeKVs: [cc.Node],

            lbNickName: cc.Label,
            lbPhoneNumberInfo: cc.Label,
            nodeButtonPhoneNumber: cc.Node, //bat len khi chua co sdt thay cho lbPhoneNumber
            // nodeButtonTelegram: cc.Node,
            
            nodeInfo: cc.Node,
            nodeSercurity: cc.Node,
            nodeSercurityLogin: cc.Node,
            nodeKetAnToan: cc.Node,
            lbOTPTypeNoPhone: cc.Label,
            lbOTPTypeUpdatePhone: cc.Label,
            animationMenuOTPNoPhone: cc.Animation,
            animationMenuMaVung : cc.Animation,
            animationMenuOTPUpdatePhone : cc.Animation,
            lbMaVung:cc.Label,
            lbMaPhone:cc.Label,
            btnOTPFree:cc.Node,
            noteTxt:cc.Node,
           
            btnActiveSecurityTele:cc.Node,
            btnActiveSecuritySMS:cc.Node,

            btnDeActiveSecurityTele:cc.Node,
            btnDeActiveSecuritySMS:cc.Node,

            lbActiveSMS: cc.Node,
            lbDeActiveSMS: cc.Node,

            avatar: cc.Avatar,
            lbBalance :  cc.Label,
            lbNameInfo: cc.Label,
            SDT: cc.Label,
            SDTDeletePhone: cc.Label,
            SDTSecurityAccount: cc.Label,



            titleSecuritySdt: cc.Node,
            titleSecurityTele: cc.Node,




        },
        openMenuCardTypeClicked: function () {
            this.animationMenuMaVung.play(this.animOpenName);
        },
        hideMenuCardTypeClicked: function () {
            this.animationMenuMaVung.play(this.animCloseName);
        },
        setLBMaVung: function (value) {
            this.lbMaVung.string = value;
        },
        selectMaVung: function(event, data) {
            this.setLBMaVung(data.toString());
            this.animationMenuMaVung.play(this.animCloseName);
            if(this.lbMaVung.string == '+886(Đài Loan)'){
                this.lbMaPhone.string = '886'
            }else if(this.lbMaVung.string == '+82(Hàn Quốc)'){
                this.lbMaPhone.string = '82'
            }else if(this.lbMaVung.string == '+81(Nhật Bản)'){
                this.lbMaPhone.string = '81'
            }else if(this.lbMaVung.string == '+84(Việt Nam)'){
                this.lbMaPhone.string = '84'
            }else{
                this.lbMaPhone.string = 'Khác'

            }

        },
        onLoad: function () {
            this.animOpenName = 'showDropdownMenu';
            this.animCloseName = 'hideDropdownMenu';
            this.isTimer = false;
            this.timer = 0;
            this.timePerGetOTP = 120;
            this.updateInterval = 1;
            this.updateTimer = 0;
            this.otpType = cc.OTPType.TELEGRAM; //default
            // this.lbOTPDeletePhone.string = 'OTP TELE';
    
            this.nodeTabActive = this.nodeSercurity;
            this.nodeTabActive.active = true;
            this.isOpenFromLobby = false;
            this.node.zIndex =  cc.NoteDepth.POPUP_PORTAL;

            this.animation = this.node.getComponent(cc.Animation);

            //#KingViet
            if (cc.Config.getInstance().getDomainVK().includes(netConfig.HOST)) {
                this.groupNodeVNs.forEach(function (node) {
                    node.active = false;
                });
                this.groupNodeKVs.forEach(function (node) {
                    node.active = true;
                });
            } else {
                this.groupNodeVNs.forEach(function (node) {
                    // node.active = true;
                });
                this.groupNodeKVs.forEach(function (node) {
                    node.active = false;
                });
            }
        },

        onEnable: function () {
            var startTab = cc.Tool.getInstance().getItem('@startTabSecurity');
            if (startTab != null) {
                this.activeTap(null, startTab);
            }

            if (cc.Tool.getInstance().getItem('@openFormButton') == 'true') {
                this.isOpenFromLobby = true;
            }

            this.animation.play('openPopup');
            this.init();        
            // var loginResponse = cc.LoginController.getInstance().getLoginResponse();
            // this.avatar.setAvatar(cc.AccountController.getInstance().getAvatarImage(loginResponse.AvatarID));  
            // this.lbNameInfo.string = loginResponse.AccountName; 
            // this.lbBalance.string = cc.Tool.getInstance().formatNumber(loginResponse.Balance);
        },

        onDisable: function () {
            cc.Tool.getInstance().setItem("@TimeGetOTPSecurity", Math.round(this.timer));
        },

        onDestroy: function () {
            cc.Tool.getInstance().setItem("@TimeGetOTPSecurity", Math.round(this.timer));
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

        init: function () {
            this.nodeGroupUpdatePhoneNumber.active = false;
            this.timer = parseInt(cc.Tool.getInstance().getItem("@TimeGetOTPSecurity"));
            this.processTimeOTPButton();

            var loginResponse = cc.LoginController.getInstance().getLoginResponse();

            // this.lbNickName.string = loginResponse.AccountName;
            // if (loginResponse.PhoneNumber == null) {
            //     this.lbPhoneNumberInfo.node.active = false;
            //     // this.titlePhoneNumber.node.active = false;
            //     // this.titleTeleID.node.active = false;
            //     // if(this.titleSecurity != null) this.titleSecurity.node.active = true;
            //     this.nodeButtonPhoneNumber.active = false;
            //     // this.nodeButtonTelegram.active = true;
            // } else {
            //     var phoneNum = loginResponse.PhoneNumber.substring(loginResponse.PhoneNumber.length - 3);
            //     this.lbPhoneNumberInfo.string = '*******' + phoneNum;
            //     this.lbPhoneNumberInfo.node.active = true;
            //     // this.nodeButtonTelegram.active = false;
            //     this.nodeButtonPhoneNumber.active = false;
            //     // if (loginResponse.TeleID === null) {
            //     //     this.nodeButtonTelegram.active = true;
            //     // }
            // }

            //#KingViet
            if (cc.Config.getInstance().getDomainVK().includes(netConfig.HOST)) {
                if (loginResponse.PhoneNumber === null) {
                    if (loginResponse.UserNameSafeNo === null) {
                        this.nodeGroupNoPhoneNumber.active = true;
                        // this.nodeGroupHavePhoneNumber.active = false;

                        // this.nodeGroupConfirmDeActive.active = false;
                        this.nodeGroupConfirmDeletePhone.active = false;
                        // this.nodeGroupDeActive.active = true;

                    } else {
                        if (loginResponse.TeleID != null){
                            // this.lbTeleID.string = loginResponse.TeleID;
                            this.titleSecurity.node.active = false;
                        }else{
                            // // this.lbTeleID.string = 'Chưa Kích Hoạt';
                            // this.titleSecurity.node.active = true;
                        }
                       //  this.lbPhoneNumber.string = 'App OTP của bạn: ' + loginResponse.UserNameSafeNo;
                        this.nodeGroupNoPhoneNumber.active = false;
                        // this.nodeGroupHavePhoneNumber.active = true;
                        if (loginResponse.AuthenType === null || loginResponse.AuthenType === 0) {
                            // this.nodeActive.active = true;
                            // this.nodeDeActive.active = false;

                            // this.nodeGroupDeActive.active = true;
                            // this.nodeGroupConfirmDeActive.active = false;
                            this.nodeGroupConfirmDeletePhone.active = false;
                        } else {
                            // this.nodeActive.active = false;
                            // this.nodeDeActive.active = true;

                            // this.nodeGroupDeActive.active = true;
                            // this.nodeGroupConfirmDeActive.active = false;
                            this.nodeGroupConfirmDeletePhone.active = false;
                        }

                    }

                    // this.nodeDeletePhone.active = false;
                    // this.nodeAddPhone.active = true;
                } else {
                    var phoneNum = loginResponse.PhoneNumber.substring(loginResponse.PhoneNumber.length - 3); 
                    if (loginResponse.TeleID != null){
                        // this.lbTeleID.string = loginResponse.TeleID;
                        this.titleSecurity.node.active = false;
                    }else{
                        // this.lbTeleID.string = 'Chưa Kích Hoạt';
                        this.titleSecurity.node.active = true;
                    }               
                   //  this.lbPhoneNumber.string = 'Số điện thoại của bạn: ' + '*******' + phoneNum;
                    this.nodeGroupNoPhoneNumber.active = false;
                    // this.nodeGroupHavePhoneNumber.active = true;
                    if (loginResponse.AuthenType === null || loginResponse.AuthenType === 0) {
                        // this.nodeActive.active = true;
                        // this.nodeDeActive.active = false;

                        // this.nodeGroupDeActive.active = true;
                        // this.nodeGroupConfirmDeActive.active = false;
                        this.nodeGroupConfirmDeletePhone.active = false;
                    } else {
                        // this.nodeActive.active = false;
                        // this.nodeDeActive.active = true;

                        // this.nodeGroupDeActive.active = true;
                        // this.nodeGroupConfirmDeActive.active = false;
                        this.nodeGroupConfirmDeletePhone.active = false;
                    }

                    // this.nodeDeletePhone.active = false;
                    // this.nodeAddPhone.active = false;
                }

                this.nodeTeleSafes.forEach(function (nodeTeleSafe) {
                    nodeTeleSafe.active = false;
                });
                this.otpType = cc.OTPType.TELE_SAFE;
                // this.lbOTPCancelLoginSecurity.string = 'App OTP';

                if (loginResponse.UserNameSafeNo === null) {
                    this.nodeBtnLinkAppSafe.active = true;
                } else {
                    // this.nodeBtnLinkAppSafe.active = false;
                }
            } else {
                this.nodeGroupConfirmDeletePhone.active = false;
                // this.nodeGroupConfirmDeActiveSMS.active = false
                // this.nodeBtnLinkAppSafe.active = false;
                if (loginResponse.PhoneNumber === null) {
                    if (loginResponse.PhoneSafeNo === null) {
                        this.nodeGroupNoPhoneNumber.active = true;
                        this.nodeGroupUpdatePhoneNumber.active = false;
                        // // this.nodeGroupHavePhoneNumber.active = false;
                        // this.nodeGroupConfirmDeActive.active = false;
                        this.nodeGroupConfirmDeletePhone.active = false;
                        // this.nodeGroupDeActive.active = true;


                    } else {
                        if (loginResponse.TeleID != null){

                            // this.lbTeleID.string = loginResponse.TeleID;
                            // this.titleSecurity.node.active = false;
                        }else{

                            // this.lbTeleID.string = 'Chưa Kích Hoạt';
                            // this.titleSecurity.node.active = true;
                        }
                       //  this.lbPhoneNumber.string = 'App OTP của bạn: ' + loginResponse.PhoneSafeNo;
                        this.nodeGroupNoPhoneNumber.active = false;
                        // this.nodeGroupHavePhoneNumber.active = true;
                        if (loginResponse.AuthenType === null || loginResponse.AuthenType === 0) {

                            // this.nodeActive.active = true;
                            // this.nodeDeActive.active = false;

                            // this.btnActiveSecurityTele.active = true;
                            // this.btnActiveSecuritySMS.active = true;

                            // this.btnDeActiveSecurityTele.active = false;
                            // this.btnDeActiveSecuritySMS.active = false;

                            // this.nodeGroupDeActive.active = true;
                            // this.nodeGroupConfirmDeActive.active = false;
                            this.nodeGroupConfirmDeletePhone.active = false;
                        } else {

                            // this.nodeActive.active = false;
                            // this.nodeDeActive.active = true;

                            // this.btnActiveSecurityTele.active = false;
                            // this.btnActiveSecuritySMS.active = false;

                            // this.btnDeActiveSecurityTele.active = true;
                            // this.btnDeActiveSecuritySMS.active = true;


                            // this.nodeGroupDeActive.active = true;
                            // this.nodeGroupConfirmDeActive.active = false;
                            this.nodeGroupConfirmDeletePhone.active = false;
                        }
                    }
                    // this.btnActiveSecurityTele.active = true;
                    // this.btnActiveSecuritySMS.active = true;

                    // this.btnDeActiveSecurityTele.active = false;
                    // this.btnDeActiveSecuritySMS.active = false;

                    // this.nodeDeletePhone.active = false;
                    // this.nodeAddPhone.active = true;
                    //  this.lbActiveSMS.active = true;
                    // this.lbDeActiveSMS.active = false;

                } else {
                    var phoneNum = loginResponse.PhoneNumber.substring(loginResponse.PhoneNumber.length - 3);
                    if (loginResponse.TeleID > 0){
                        // this.lbTeleID.string = loginResponse.TeleID;
                        // this.titleSecurity.node.active = false;
                        // this.nodeButtonTelegram.active = false;
                    }else{
                        // this.lbTeleID.string = 'Chưa Kích Hoạt';
                        // this.titleSecurity.node.active = true;
                        // this.nodeButtonTelegram.active = true;
                    }
                    this.SDTSecurityAccount.string = 'Số điện thoại của bạn: ' + '*******' + phoneNum;
                    this.SDTSecurityAccount.node.active = true;
                   //  this.lbPhoneNumber.string = 'Số điện thoại của bạn: ' + '*******' + phoneNum;
                    // this.lbPhoneNumberActionLogin.string = '*******' + phoneNum;
                    // this.lbNameActionLogin.string = "[" + cc.LoginController.getInstance().getCountry().trim().toUpperCase() + "]" + "  " + loginResponse.AccountName;
                    // this.lbTeleIDActionLogin.string = loginResponse.TeleID;
                    this.nodeGroupNoPhoneNumber.active = false;
                    // this.nodeGroupHavePhoneNumber.active = true;
                    if (loginResponse.AuthenType === null || loginResponse.AuthenType === 0) {
                        // this.nodeActive.active = true;
                        // this.nodeDeActive.active = false;
                        this.nodeGroupNoPhoneNumber.active = true;


                        // this.btnActiveSecurityTele.active = true;
                        // this.btnActiveSecuritySMS.active = true;
                        
                        // this.btnDeActiveSecurityTele.active = false;
                        // this.btnDeActiveSecuritySMS.active = false;

                        //  this.lbActiveSMS.active = true;
                        // this.lbDeActiveSMS.active = false;


                        // this.nodeGroupDeActive.active = true;
                        // this.nodeGroupConfirmDeActive.active = false;
                        // this.nodeGroupConfirmDeletePhone.active = true;

                        // this.titleSecuritySdt.active = false
                        // this.titleSecurityTele.active = false

                    } else {
                        // this.titleSecuritySdt.active = false
                        // this.titleSecurityTele.active = false


                        // this.nodeActive.active = false;
                        // this.nodeDeActive.active = false;
                        this.nodeGroupNoPhoneNumber.active = true;
                        this.nodeGroupUpdatePhoneNumber.active = false;
      

                        //  this.lbActiveSMS.active = false;
                        // this.lbDeActiveSMS.active = true;


                        // this.nodeGroupDeActive.active = true;
                        // this.nodeGroupConfirmDeActive.active = false;
                        // this.nodeGroupConfirmDeletePhone.active = true;

                        if(loginResponse.AuthenType === 10){
                            // this.btnDeActiveSecurityTele.active = true;
                            // this.btnActiveSecuritySMS.active = true;
                        }
                        else if(loginResponse.AuthenType === 1){
                            // this.btnDeActiveSecuritySMS.active = true;
                            // this.btnActiveSecurityTele.active = true;
                        }
                        else if(loginResponse.AuthenType === 11){
                            // this.btnDeActiveSecuritySMS.active = true;
                            // this.btnDeActiveSecurityTele.active = true;
                        }
 
                    }

                    // this.nodeDeletePhone.active = false;
                    // this.nodeAddPhone.active = false;
                }
                if (loginResponse.TeleID === 0) {
                    this.nodeTeleSafes.forEach(function (nodeTeleSafe) {
                        nodeTeleSafe.active = false;
                    });
                    this.otpType = cc.OTPType.TELEGRAM;
                    // this.lbOTPCancelLoginSecurity.string = 'OTP TELE';
                    this.lbOTPTypeNoPhone.string = 'OTP TELE';
                } else {
                    this.otpType = cc.OTPType.TELEGRAM;
                    // this.lbOTPCancelLoginSecurity.string = 'OTP TELE';
                    this.lbOTPTypeNoPhone.string = 'OTP TELE';
                }
                // if (loginResponse.PhoneSafeNo === null) {
                //     this.nodeTeleSafes.forEach(function (nodeTeleSafe) {
                //         nodeTeleSafe.active = false;
                //     });
                //     this.otpType = cc.OTPType.TELE_GRAM;
                //     // this.lbOTPCancelLoginSecurity.string = 'OTP TELE';
                //     this.lbOTPTypeNoPhone.string = 'OTP TELE';
                // } else {
                //     this.otpType = cc.OTPType.TELE_SAFE;
                //     // this.lbOTPCancelLoginSecurity.string = 'App OTP';
                //     this.lbOTPTypeNoPhone.string = 'App OTP';
                // }
                
                var isHasPhone = loginResponse.PhoneNumber == null ? false : true;
                this.nodeGroupUpdatePhoneNumber.active = isHasPhone;
                this.nodeGroupNoPhoneNumber.active = !isHasPhone;
                if (loginResponse.PhoneNumber != null) {
                    this.SDT.string =  "84" + loginResponse.PhoneNumber.slice(1);
                }
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

        onGetOTPResponse: function (response) {
            this.activeTimeOTPButton();
            if (response.Message) {
                cc.PopupController.getInstance().showMessage(response.Message);
            } else {
                cc.PopupController.getInstance().showMessage('Lấy OTP thành công');
            }
        },

        onGetOTPResponseError: function (response) {
            setTimeout(function(){
                if(response.ResponseCode == -4 && response.Type && response.Type == cc.OTPType.TELEGRAM){
                    cc.sys.openURL(cc.Config.getInstance().taiotpx6());
                }
            },1000);
            cc.PopupController.getInstance().showMessageError(response.Message, response.ResponseCode);
        },

        onUpdatePhoneResponse: function (response) {
            let phone = this.editBoxPhoneNumber.string;
            this.loginResponse = cc.LoginController.getInstance().getLoginResponse();

            this.loginResponse.PhoneNumber = phone;
           
            cc.LoginController.getInstance().setLoginResponse(this.loginResponse);

            this.init();
            cc.DDNA.getInstance().updatePhoneNumber(phone);
            cc.LobbyController.getInstance().destroyAccountView();

            cc.PopupController.getInstance().showMessage(response.message);
        },

        onUpdatePhoneResponseError: function (response) {
            cc.PopupController.getInstance().showMessageError(response.message);
        },

        onUpdateAuthenTypeResponse: function (response, authenType) {

            this.loginResponse = cc.LoginController.getInstance().getLoginResponse();
            this.loginResponse.AuthenType = authenType;
            cc.LoginController.getInstance().setLoginResponse(this.loginResponse);

            this.init();

            cc.DDNA.getInstance().updateAuthenType(authenType);
            cc.LobbyController.getInstance().destroyAccountView();
            cc.PopupController.getInstance().showMessage(response.Message);

        },

        onUpdateAuthenTypeResponseError: function (response) {
            cc.PopupController.getInstance().showMessageError(response.Message, response.ResponseCode);
        },

        onDeletePhoneResponse: function (response, authenType) {
            this.editBoxPhoneNumber.string = '';
            this.loginResponse = cc.LoginController.getInstance().getLoginResponse();
            this.loginResponse.PhoneNumber = null;
            cc.LoginController.getInstance().setLoginResponse(this.loginResponse);

            this.init();

            cc.DDNA.getInstance().updatePhoneNumber('null');
            cc.LobbyController.getInstance().destroyAccountView();

            cc.PopupController.getInstance().showMessage(response.Messages);

        },

        selectOTPDeletePhoneEvent: function(event, data) {
            this.otpType = "";
            if(data.toString() === 'OTP TELE'){
                this.otpType = cc.OTPType.TELEGRAM;
            }else{
                this.otpType = cc.OTPType.SMS;
            }
            this.lbOTPDeletePhone.string = data.toString();
            this.animationMenuOTPDeletePhone.play('hideDropdownMenu');
        },

        selectOTPCancelLoginSecurityEvent: function(event, data) {
            this.otpType = "";
            if(data.toString() === 'OTP TELE'){
                this.otpType = cc.OTPType.TELEGRAM;
            }else{
                this.otpType = cc.OTPType.SMS;
            }
            // this.lbOTPCancelLoginSecurity.string = data.toString();
            this.animationMenuOTPCancelLoginSecurity.play('hideDropdownMenu');
        },

        openMenuOTPDeletePhoneClicked: function () {
            this.animationMenuOTPDeletePhone.play('showDropdownMenu');
        },

        openMenuOTPCancelLoginSecurityClicked: function () {
            this.animationMenuOTPCancelLoginSecurity.play('showDropdownMenu');
        },

        hideMenuOTPDeletePhoneClicked: function () {
            this.animationMenuOTPDeletePhone.play('hideDropdownMenu');
        },

        hideMenuOTPCancelLoginSecurityClicked: function () {
            this.animationMenuOTPCancelLoginSecurity.play('hideDropdownMenu');
        },

        openMenuChonvungClicked: function () {
            this.animationMenuMaVung.play('showDropdownMenu');
        },



        getOTPClicked: function () {
            //this.btnGetOTP.interactable = false;
            this.phoneNumber = this.editBoxPhoneNumber.string;
            if (this.phoneNumber === '') {
                cc.PopupController.getInstance().showMessage('Vui lòng nhập số điện thoại');
                return;
            }
            if (this.otpType == 1) { //if otpType is SMS
                this.activeTimeOTPButton();
                var getOTPCommand = new cc.GetOTPCommand;
                getOTPCommand.execute(this, '', this.otpType);
            } else {
                var getOTPCommand = new cc.GetOTPCommand;
                getOTPCommand.execute(this, this.phoneNumber, this.otpType);
            }
        },

        updatePhoneNumberClicked: function () {
            this.otp = this.editBoxOTP.string;
            var phone = this.editBoxPhoneNumber.string;
            
            if (phone === '') {
                cc.PopupController.getInstance().showMessage('Vui lòng nhập số điện thoại');
                return;
            }
           
            var ma_vung = this.lbMaVung.string;
            if(phone[0] == "0"){
                phone = phone.substring(1);
            }
            var str= "";
            if(ma_vung[0] == "+"){
                var i = 0;
               
                while((i+1) < ma_vung.length && Number(ma_vung[i+1])){
                    str+=ma_vung[i+1];
                    i++;
                }
            }
            this.phoneNumber =str+phone;
            console.log(this.phoneNumber);
            //#KingViet
            if (!cc.Config.getInstance().getDomainVK().includes(netConfig.HOST)) {
                if (this.otp === '') {
                    cc.PopupController.getInstance().showMessage('Vui lòng nhập mã OTP');
                    return;
                }
            }

            var updatePhoneCommand = new cc.UpdatePhoneCommand;
            updatePhoneCommand.execute(this);
        },

        activeLoginSecurityTeleClicked: function () {
            // var updateAuthenTypeCommand = new cc.UpdateAuthenTypeCommand;
            // updateAuthenTypeCommand.execute(this, 1);
            var loginResponse = cc.LoginController.getInstance().getLoginResponse();
            if (loginResponse.PhoneNumber === null) {
                this.nodeTabActive.active = false;
                this.nodeTabActive = this.nodeSercurity;
                this.nodeTabActive.active = true;
            }else{
                var updateAuthenTypeCommand = new cc.UpdateAuthenTypeCommand;
                updateAuthenTypeCommand.execute(this, 1 , 10);
            }
        },

        activeLoginSecuritySMSClicked: function () {
            // var updateAuthenTypeCommand = new cc.UpdateAuthenTypeCommand;
            // updateAuthenTypeCommand.execute(this, 1);
            var loginResponse = cc.LoginController.getInstance().getLoginResponse();
            if (loginResponse.PhoneNumber === null) {
                this.nodeTabActive.active = false;
                this.nodeTabActive = this.nodeSercurity;
                this.nodeTabActive.active = true;
            }else{
                var updateAuthenTypeCommand = new cc.UpdateAuthenTypeCommand;
                updateAuthenTypeCommand.execute(this, 1 , 1);
            }
        },

        deActiveLoginSecurityClickedTele: function () {
            this.otpType = cc.OTPType.TELEGRAM;
            this.nodeGroupDeActive.active = false;
            this.nodeGroupConfirmDeActive.active = true;
        },


        deActiveLoginSecurityClickedSMS: function () {
            this.otpType = cc.OTPType.SMS;
            this.nodeGroupDeActive.active = false;
            // this.nodeGroupConfirmDeActiveSMS.active = true;
        },

        backDeActiveLoginSecurityClicked: function () {
            this.nodeGroupConfirmDeletePhone.active = false;
            this.nodeGroupNoPhoneNumber.active = true;
        },
        
        backDeActiveLoginSecurityClickedTele: function () {
            // this.nodeGroupDeActive.active = true;
            // this.nodeGroupConfirmDeActive.active = false;
        },

        backDeActiveLoginSecurityClickedSMS: function () {
            // this.nodeGroupDeActive.active = true;
            // this.nodeGroupConfirmDeActiveSMS.active = false;
        },

        deletePhoneNumberClicked: function () {
            this.nodeGroupDeActive.active = false;
            this.nodeGroupConfirmDeletePhone.active = true;
        },

        addPhoneClick: function () {
            this.nodeTabActive.active = false;
            this.nodeTabActive = this.nodeSercurity;
            this.nodeTabActive.active = true;  
            this.addPhoneNumberClicked();
        },

        addPhoneNumberClicked: function () {
            this.nodeGroupNoPhoneNumber.active = true;
            // this.nodeGroupHavePhoneNumber.active = false;
        },

        getOTPDeActiveLoginSecurityClicked: function () {
            console.log(this.otpType)
          
                this.activeTimeOTPButton();
                var getOTPCommand = new cc.GetOTPCommand;
                getOTPCommand.execute(this, '', this.otpType);
            
        },


        getOTPDeActiveLoginSecurityClickedSMS: function () {
            console.log(this.otpType)
          
                this.activeTimeOTPButton();
                var getOTPCommand = new cc.GetOTPCommand;
                getOTPCommand.execute(this, '', this.otpType);
            
        },

        getOTPDeletePhoneClicked: function () {
            if (this.otpType == 1) { //if otpType is SMS
                this.activeTimeOTPButton();
                var getOTPCommand = new cc.GetOTPCommand;
                getOTPCommand.execute(this, '', this.otpType);
            } else {
                this.activeTimeOTPButton();
                var getOTPCommand = new cc.GetOTPCommand;
                getOTPCommand.execute(this, '', this.otpType);
            }
        },


        getOTPUpdatePhoneClicked: function () {
            if (this.otpType == 1) { //if otpType is SMS
                this.activeTimeOTPButton();
                var getOTPCommand = new cc.GetOTPCommand;
                getOTPCommand.execute(this, '', this.otpType);
            } else {
                this.openTelegramClicked()
            }
        },

        getUpdataPhone: function(){
            var Phone = this.SDT.string;
            var otp = this.editBoxOTPSecurityAccount.string

            var updatePhoneCommand = new cc.UpdatePhoneCommand;
            updatePhoneCommand.execute(this,Phone, this.otpType, otp);
        },

        confirmDeActiveLoginSecurityTeleClicked: function () {
            this.otp = this.editBoxOTPDeActiveTele.string;

            if (this.otp === '') {
                cc.PopupController.getInstance().showMessage('Vui lòng nhập mã OTP');
                return;
            }

            var updateAuthenTypeCommand = new cc.UpdateAuthenTypeCommand;
            updateAuthenTypeCommand.execute(this, 0, 10, 10);
        },


        confirmDeActiveLoginSecuritySMSClicked: function () {
            this.otp = this.editBoxOTPDeActiveSMS.string;

            if (this.otp === '') {
                cc.PopupController.getInstance().showMessage('Vui lòng nhập mã OTP');
                return;
            }

            var updateAuthenTypeCommand = new cc.UpdateAuthenTypeCommand;
            updateAuthenTypeCommand.execute(this, 0, 1, 1);
        },

        confirmDeletePhoneClicked: function () {
            this.otp = this.editBoxOTPDeletePhone.string;

            //#KingViet
            if (!cc.Config.getInstance().getDomainVK().includes(netConfig.HOST)) {
                if (this.otp === '') {
                    cc.PopupController.getInstance().showMessage('Vui lòng nhập mã OTP');
                    return;
                }
            }

            var deletePhoneCommand = new cc.DeletePhoneCommand;
            deletePhoneCommand.execute(this, 10);
        },

        addTeleSafeClicked: function () {
            cc.AccountController.getInstance().activeTab(cc.AccountTab.SAFE_PLUS);
        },

        activeTap: function (event, data) {
            this.nodeTabActive.active = false;
            switch(data) {
                case "Info":
                    this.nodeTabActive = this.nodeInfo;        
                    break;
                case "SECURITY":
                    this.nodeTabActive = this.nodeSercurity;
                    this.nodeGroupConfirmDeletePhone.active = false;
                    this.nodeGroupUpdatePhoneNumber.active = false;
                    this.nodeGroupNoPhoneNumber.active = true;
                break;
                case "KETANTOAN":
                    this.nodeTabActive = this.nodeKetAnToan;
                break;
                case "SECURITYLOGIN":
                    this.nodeTabActive = this.nodeSercurityLogin;
                break;
            }
            this.nodeTabActive.active = true;
        }, 

        //Click
        backClicked: function () {
            //this.showRegister(false);
            this.animation.play('closePopup');
            var self = this;
            var delay = 0.12;
            cc.director.getScheduler().schedule(function () {
                self.animation.stop();
                if (self.isOpenFromLobby) {
                    cc.Tool.getInstance().setItem('@openFormButton', 'false');
                    cc.LobbyController.getInstance().destroyAccountView();
                } else
                    self.node.active = false;
            }, this, 1, 0, delay, false);
        },

        selectOTPEvent: function(event, data) {
            this.otpType = "";
            if(data.toString() === 'OTP TELE'){
                this.otpType = cc.OTPType.TELEGRAM;
            }else{
                this.otpType = cc.OTPType.SMS;
            }
            // if(this.otpType == cc.OTPType.SMS){
            //     this.btnOTPFree.active = true;
            //     this.noteTxt.active = true;
            //     this.lbBtnGetOTPs.forEach(function (lbBtnGetOTP) {
            //         lbBtnGetOTP.string = 'OTP';
            //     });
            // }else{
            //     this.btnOTPFree.active = true;
            //     this.noteTxt.active = false;
            //     this.lbBtnGetOTPs.forEach(function (lbBtnGetOTP) {
            //         lbBtnGetOTP.string = 'OTP Free';
            //     });
            // }
            this.lbOTPTypeUpdatePhone.string = data.toString();
            this.animationMenuOTPUpdatePhone.play('hideDropdownMenu');
        },

        openMenuOTPNoPhoneClicked: function () {
            this.animationMenuOTPUpdatePhone.play('showDropdownMenu');
        },

        hideMenuOTPClicked: function () {
            this.animationMenuOTPUpdatePhone.play('hideDropdownMenu');
        },

        openMenuChonvungClicked: function () {
            this.animationMenuMaVung.play('showDropdownMenu');
        },

        openTelegramClicked: function () {
          if (this.otpType == 1) {
                var getOTPCommand = new cc.GetOTPCommand;
                getOTPCommand.execute(this, '', this.otpType);
            }else{
               
                // this.UpdatePhone();
                // if( this.editBoxPhoneNumber.string.charAt( 0 ) === '0' && this.lbMaPhone.string != 'Khác' ){
                //     var phoneNum = this.editBoxPhoneNumber.string.slice( 1 )
                //     cc.sys.openURL(cc.LobbyController.getInstance().getConfigServer().telegram_otp_bot + '?start=' + cc.LoginController.getInstance().getUserId() + 'p' + MaVung + phoneNum);
                // }
                // else if(this.lbMaPhone.string == 'Khác'){
                //     var phoneNum = this.editBoxPhoneNumber.string
                //     cc.sys.openURL(cc.LobbyController.getInstance().getConfigServer().telegram_otp_bot + '?start=' + cc.LoginController.getInstance().getUserId() + 'p' + phoneNum);
                // }
                // else{
                //     var phoneNum = this.editBoxPhoneNumber.string
                //     cc.sys.openURL(cc.LobbyController.getInstance().getConfigServer().telegram_otp_bot + '?start=' + cc.LoginController.getInstance().getUserId() + 'p' + MaVung + phoneNum);
                // }
                cc.sys.openURL(cc.LobbyController.getInstance().getConfigServer().telegram_otp_bot + '?start=' + cc.LoginController.getInstance().getUserId());
            }
        },

        UpdatePhone: function(){
            if (this.editBoxPhoneNumber.string === '') {
                cc.PopupController.getInstance().showMessage('Vui lòng nhập số điện thoại');
                return;
            }

            var params = {
                phone: this.editBoxPhoneNumber.string
            };
            var self = this;

            cc.PopupController.getInstance().showBusy();
            var url = 'https://api.zanews24h.com/api/v1/verify/register-phone';
            cc.ServerConnector.getInstance().sendGetNew(url, params, function (response) {
                cc.PopupController.getInstance().hideBusy();
                var obj = JSON.parse(response);
                if (obj.success == true) {
                    self.nodeGroupNoPhoneNumber.active = false;
                    self.nodeGroupUpdatePhoneNumber.active = true;
                    if( self.editBoxPhoneNumber.string.charAt( 0 ) === '0'){
                        self.SDT.string =  self.lbMaPhone.string + self.editBoxPhoneNumber.string.slice( 1 );
                    }else{
                        self.SDT.string =  self.lbMaPhone.string + self.editBoxPhoneNumber.string;
                    }
                } else {
                    cc.PopupController.getInstance().showMessage(obj.message);
                }
            });
            // cc.ServerConnector.getInstance().sendRequestPOST(cc.SubdomainName.PORTAL, "api/Account/AddPhone", params, function (response) {
            //     var obj = JSON.parse(response);
            //     if (obj.ResponseCode === 1) {
            //         self.nodeGroupNoPhoneNumber.active = false;
            //         self.nodeGroupUpdatePhoneNumber.active = true;
            //         if( self.editBoxPhoneNumber.string.charAt( 0 ) === '0'){
            //             self.SDT.string =  self.lbMaPhone.string + self.editBoxPhoneNumber.string.slice( 1 );
            //         }else{
            //             self.SDT.string =  self.lbMaPhone.string + self.editBoxPhoneNumber.string;
            //         }
            //     } else {
            //         cc.PopupController.getInstance().showMessage('Số điện thoại đã tồn tại trên hệ thống.');
            //     }
            // });
        },

        DeletePhone: function(){
            this.otpType = cc.OTPType.TELEGRAM;
            var loginResponse = cc.LoginController.getInstance().getLoginResponse();
            if( loginResponse.PhoneNumber == null){
                cc.PopupController.getInstance().showMessage('Tài khoản của bạn chưa bảo mật');
                return;
            }else{
                this.SDTDeletePhone.string = loginResponse.PhoneNumber
            }
            this.nodeGroupConfirmDeletePhone.active = true;
            this.nodeGroupNoPhoneNumber.active = false;
        },

        backGroundNoPhone: function(){
            this.nodeGroupNoPhoneNumber.active = true;
            this.nodeGroupUpdatePhoneNumber.active = false;
        }
    });
}).call(this);
