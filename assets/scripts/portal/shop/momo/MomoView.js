/**
 * Created by Nofear on 3/15/2019.
 */

 (function () {
    cc.MomoView = cc.Class({
        "extends": cc.Component,
        properties: {
            editBoxValueMomo: cc.EditBox,
            editBoxValueVTP: cc.EditBox,
            lbNameMomo:cc.Label,
            lbNameVTP:cc.Label,
            lbPhoneMomo:cc.Label,
            lbPhoneVTP:cc.Label,
            lbCodeMomo:cc.Label,
            lbCodeVTP:cc.Label,
            lbTimeOutMomo: cc.Label,
            lbTimeOutVTP: cc.Label,
            lbMoneyMomo:cc.Label,
            lbMoneyVtp:cc.Label,
            QRMomoCode:cc.Sprite,
            scroll: cc.Node,
            black: cc.Node,
            btnWallet: [cc.Node],
            form: [cc.Node],
            defaultQR:cc.SpriteFrame
        },
        onEnable: function () {
            this.clickBTN(null, "MOMO");
            this.momoOrder = null;
            this.resetAll();
        },
        clickBTN: function (event, data) {
            switch (data.toString()) {
                case "MOMO":
                    this.form.forEach((value, index) => {
                        if (index === 0) {
                            value.active = true;
                        } else {
                            value.active = false;
                        }
                    });
                    this.btnWallet.forEach((value, index) => {
                        if (index === 0) {
                            value.opacity = 255;
                            value.children[1].active = true;
                        } else {
                            value.opacity = 130;
                            value.children[1].active = false;
                        }
                    });
                    cc.tween(this.scroll).to(0.15, {y: 268.733}, {easing: "smooth"}).start();
                    cc.tween(this.black).to(0.15, {y: 266.775}, {easing: "smooth"}).start();
                break;
                case "ZALO":
                    this.form.forEach((value, index) => {
                        if (index === 1) {
                            value.active = true;
                        } else {
                            value.active = false;
                        }
                    });
                    this.btnWallet.forEach((value, index) => {
                        if (index === 1) {
                            value.opacity = 255;
                            value.children[1].active = true;
                        } else {
                            value.opacity = 130;
                            value.children[1].active = false;
                        }
                    });
                    
                    cc.tween(this.scroll).to(0.15, {y: 76.877}, {easing: "smooth"}).start();
                    cc.tween(this.black).to(0.15, {y: 76.709}, {easing: "smooth"}).start();
                break;
                case "VIETTEL":
                    this.form.forEach((value, index) => {
                        if (index === 2) {
                            value.active = true;
                        } else {
                            value.active = false;
                        }
                    });
                    this.btnWallet.forEach((value, index) => {
                        if (index === 2) {
                            value.opacity = 255;
                            value.children[1].active = true;
                        } else {
                            value.opacity = 130;
                            value.children[1].active = false;
                        }
                    });
                    cc.tween(this.scroll).to(0.15, {y: 175}, {easing: "smooth"}).start();
                    cc.tween(this.black).to(0.15, {y: 172.194}, {easing: "smooth"}).start();
                break;
            }
        },
        updateTimeCountMomo: function () {			
            if (!this.fixTimeMomo) {
                return;
            }

            this.fixTimeMomo--;
            if(this.fixTimeMomo <= 0) {
                this.fixTimeMomo = 0;
                clearInterval(this.intervalMomo);
            }
            let msec = this.fixTimeMomo * 1000;
            let hh = Math.floor(msec / 1000 / 60 / 60);
            msec -= hh * 1000 * 60 * 60;
            let mm = Math.floor(msec / 1000 / 60);
            msec -= mm * 1000 * 60;
            let ss = Math.floor(msec / 1000);
            msec -= ss * 1000;

            hh = hh < 10 ? "0" + hh : hh;
            mm = mm < 10 ? "0" + mm : mm;
            ss = ss < 10 ? "0" + ss : ss;

            this.lbTimeOutMomo.string = mm+":"+ss;
        },
        updateTimeCountVTP: function () {			
            if (!this.fixTimeVTP) {
                return;
            }

            this.fixTimeVTP--;
            if(this.fixTimeVTP <= 0) {
                this.fixTimeVTP = 0;
                clearInterval(this.intervalVtp);
            }
            let msec = this.fixTimeVTP * 1000;
            let hh = Math.floor(msec / 1000 / 60 / 60);
            msec -= hh * 1000 * 60 * 60;
            let mm = Math.floor(msec / 1000 / 60);
            msec -= mm * 1000 * 60;
            let ss = Math.floor(msec / 1000);
            msec -= ss * 1000;

            hh = hh < 10 ? "0" + hh : hh;
            mm = mm < 10 ? "0" + mm : mm;
            ss = ss < 10 ? "0" + ss : ss;

            this.lbTimeOutVTP.string = mm+":"+ss;
        },
        
        onWalletChargerCommandResponse: function (response) {
            
            let data = response.Data;
            if (data.chargeType=='momo') {
                this.momoOrder = response.Data;
                this.fixTimeMomo = 600;
				let self = this;
                if (this.intervalMomo) {
                    clearInterval(this.intervalMomo);
                }
                self.updateTimeCountMomo();
				this.intervalMomo = setInterval(function () {
					self.updateTimeCountMomo();
				}, 1000);
                this.lbCodeMomo.string = data.chargeCode;
                this.lbCodeMomo.node.parent.active = true;
                this.lbNameMomo.string = data.phoneName;
                this.lbPhoneMomo.string = data.phoneNum;
                this.lbMoneyMomo.string = cc.Tool.getInstance().formatNumber(data.regAmount);
                var remoteUrl= data.qr_url;
                cc.assetManager.loadRemote(remoteUrl,{ext:".png"},(err, texture)=>{
                    console.log("err"+err);
                    var spriteFrame=new cc.SpriteFrame(texture);
                    this.QRMomoCode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                    this.QRMomoCode.active = true;
                });
            }
            if (data.chargeType=='vtpay') {
                this.vtpOrder = response.Data;
                this.fixTimeVTP = 600;
				let self = this;
                if (this.intervalVtp) {
                    clearInterval(this.intervalVtp);
                }
				self.updateTimeCountVTP();
				this.intervalVtp = setInterval(function () {
					self.updateTimeCountVTP();
				}, 1000);
                this.lbCodeVTP.string = data.chargeCode;
                this.lbCodeVTP.node.parent.active = true;
                this.lbNameVTP.string = data.phoneName;
                this.lbPhoneVTP.string = data.phoneNum;
                this.lbMoneyVtp.string = cc.Tool.getInstance().formatNumber(data.regAmount);
            }
            console.log(response);
            // let dataNew = {
            //     "requestID": "dRxElqzeiRHZyH9",
            //     "chargeType": "momo",
            //     "chargeCode": "06kt5804",
            //     "userID": 200100053,
            //     "regAmount": 1000000,
            //     "chargeAmount": 0,
            //     "usdRate": 0,
            //     "status": -1,
            //     "momoTransId": null,
            //     "result": null,
            //     "usdAmount": 0,
            //     "resID": 2702420,
            //     "qr_url": "https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=2|99|0585919751|0585919751|0585919751|0|0|1000000|06kt5804|transfer_myqr",
            //     "payment_url": "2|99|0585919751|058591975",
            //     "phoneNum": "0585919751",
            //     "phoneName": "LÊ TH? THÂN",
            //     "redirect": "/payment/2702420?token=a4b03a6357ea1803e6dbc54fcd3d975f5daba4",
            //     "redirect_ssl": "https://mopay.info/payment8/2702420?token=a4b03a6357ea1803e6dbc54fcd3d975f5daba4",
            //     "bank_provider": "momo",
            //     "timeToExpired": 900,
            //     "deeplink": "momo://?action=p2p&extra=%22%7B%5C%22dataExtract%5C%22:%5C%22eyJhbW91bnQiOjEwMDAwMDAsImFnZW50SWQiOiI2NTk4MTg0MiIsImVuYWJsZUVkaXRBbW91bnQiOnRydWUsInJlY2VpdmVyVHlwZSI6IjE0IiwidHJhbnNmZXJTb3VyY2UiOiJ0cmFuc2Zlcl92aWFfbGluayIsIm5hbWUiOiJMw4ogVEjhu4ogVEjDgk4iLCJtZXNzYWdlIjoiMDZrdDU4MDQiLCJ1c2VySWQiOiIqKioqKioqKjc1MSIsICJzaWduSGFzaCI6IjhmMjEwN2Q0OGNmZjdhOWE4YTEyYjk1MDQ0OTU0ZTI3In0=%5C%22%7D%22&url=https://momo.vn/download&serviceCode=transfer_p2p&refId=TransferInputMoney",
            //     "subType": "momo                ",
            //     "phoneSender": null,
            //     "createdDate": "2023-09-30T17:44:43.717",
            //     "updatedDate": null,
            //     "cardCode": null,
            //     "cardSerial": null
            // }
            
        },
        onWalletChargerCommandResponseError: function (response) {
            console.log(response);
        },

        copyMoMoAccountClicked: function () {
            if(cc.Tool.getInstance().copyToClipboard(this.lbPhoneMomo.string)&&this.momoOrder) {
                cc.PopupController.getInstance().showMessage('Đã sao chép số tài khoản.');
            }
        },

        copyMoMoContentClicked: function () {
            if(cc.Tool.getInstance().copyToClipboard(this.lbCodeMomo.string)&&this.momoOrder) {
                cc.PopupController.getInstance().showMessage('Đã sao chép nội dung chuyển khoản.');
            }
        },
        copyVTPAccountClicked: function () {
            if(this.vtpOrder&&cc.Tool.getInstance().copyToClipboard(this.lbPhoneVTP.string)) {
                cc.PopupController.getInstance().showMessage('Đã sao chép số tài khoản.');
            }
        },

        copyVTPContentClicked: function () {
            if(this.vtpOrder&&cc.Tool.getInstance().copyToClipboard(this.lbCodeVTP.string)) {
                cc.PopupController.getInstance().showMessage('Đã sao chép nội dung chuyển khoản.');
            }
        },
        copyMomoMoneyClicked: function () {
            if(this.momoOrder&&cc.Tool.getInstance().copyToClipboard(this.momoOrder.regAmount)) {
                cc.PopupController.getInstance().showMessage('Đã sao chép số tiền.');
            }
        },

        copyVTPMoneyClicked: function () {
            if(this.vtpOrder&&cc.Tool.getInstance().copyToClipboard(this.vtpOrder.regAmount)) {
                cc.PopupController.getInstance().showMessage('Đã sao chép số tiền.');
            }
        },
        openMomoApp:function()
        {
            if (this.momoOrder) {
                cc.sys.openURL(this.momoOrder.deeplink);
            }
        },
        napMomo: function () {
            this.amount = cc.Tool.getInstance().removeDot(this.editBoxValueMomo.string);
            if (!this.amount||this.amount<20000) {
                cc.PopupController.getInstance().showMessage('Vui lòng nhập số tiền hợp lệ.');
                return;
            }
            this.chargeType = 'momo';
            var momoChargeCommand = new cc.MomoChagerCommand;
            momoChargeCommand.execute(this);
        },
        napVTP: function () {

            this.amount = cc.Tool.getInstance().removeDot(this.editBoxValueVTP.string);
            if (!this.amount||this.amount<20000) {
                cc.PopupController.getInstance().showMessage('Vui lòng nhập số tiền hợp lệ.');
                return;
            }
            this.chargeType = 'vtpay';
            var momoChargeCommand = new cc.MomoChagerCommand;
            momoChargeCommand.execute(this);
        },
        onEditingMomoValueChanged: function () {
            var val = cc.Tool.getInstance().removeDot(this.editBoxValueMomo.string);
            this.editBoxValueMomo.string = cc.Tool.getInstance().formatNumber(val);
        },

        onEditingMomoValueDidEnd: function () {
            var val = cc.Tool.getInstance().removeDot(this.editBoxValueMomo.string);
            this.editBoxValueMomo.string = cc.Tool.getInstance().formatNumber(val);
        },
        onEditingVTPValueChanged: function () {
            var val = cc.Tool.getInstance().removeDot(this.editBoxValueVTP.string);
            this.editBoxValueVTP.string = cc.Tool.getInstance().formatNumber(val);
        },

        onEditingVTPValueDidEnd: function () {
            var val = cc.Tool.getInstance().removeDot(this.editBoxValueVTP.string);
            this.editBoxValueVTP.string = cc.Tool.getInstance().formatNumber(val);
        },
        resetAll:function()
        {
            this.lbCodeVTP.string = "";
            this.lbCodeVTP.node.parent.active = false;
            this.lbNameVTP.string = "...";
            this.lbPhoneVTP.string = "...";
            this.lbMoneyVtp.string = "0";
            this.lbCodeMomo.string = "";
            this.lbCodeMomo.node.parent.active = false;
            this.lbNameMomo.string = "...";
            this.lbPhoneMomo.string = "...";
            this.lbMoneyMomo.string = "0";
            this.QRMomoCode.spriteFrame = this.defaultQR;
            this.momoOrder = null;
            this.vtpOrder = null;
        }

    });
}).call(this);
