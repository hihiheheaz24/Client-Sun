(function () {
    cc.USDTCharge = cc.Class({
        extends: cc.Component,
    
        properties: {
            lbWalletAddress: cc.Label,
            lbAmountTransaction:cc.Label,
            editBoxValueTransfer: cc.EditBox,
            editBoxTrc20Address: cc.EditBox,
            lbTimeOut:cc.Label,
            qrCode:cc.Sprite
        },
        onEnable() {
            this.resetInput();
        },
        updateTimeCount: function () {			
            if (!this.fixTime) {
                return;
            }

            this.fixTime--;
            if(this.fixTime <= 0) {
                this.fixTime = 0;
                clearInterval(this.intervalMomo);
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

            this.lbTimeOut.string = mm+":"+ss;
        },
        onWalletChargerCommandResponse: function (response) {
            
            let data = response.Data;
            this.Orders = response.Data;
            this.fixTime = 600;
            let self = this;
            if (this.intervalMomo) {
                clearInterval(this.intervalMomo);
            }
            self.updateTimeCount();
            this.intervalMomo = setInterval(function () {
                self.updateTimeCount();
            }, 1000);
            this.lbWalletAddress.string = data.payment_url;
            this.lbAmountTransaction.string = "Số USDT: "+cc.Tool.getInstance().formatNumber(data.regAmount);
            var remoteUrl= data.qr_url;
            cc.assetManager.loadRemote(remoteUrl,{ext:".png"},(err, texture)=>{
                var spriteFrame=new cc.SpriteFrame(texture);
                this.qrCode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                this.qrCode.active = true;
            });
            // let dataNew = {
            //     "requestID": "QGNGooKfu6F0dEK",
            //     "chargeType": "usdt",
            //     "chargeCode": "fjdsfahskjfhdas",
            //     "userID": 200100053,
            //     "regAmount": 5,
            //     "chargeAmount": 0,
            //     "usdRate": 0,
            //     "status": -1,
            //     "momoTransId": null,
            //     "result": null,
            //     "usdAmount": 0,
            //     "resID": 2710852,
            //     "qr_url": "https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=TZGZDWreqQotYnFAJ8zJntPFhVrjGtjU25",
            //     "payment_url": "TZGZDWreqQotYnFAJ8zJntPFh",
            //     "phoneNum": "TZGZDWreqQotYnFAJ8zJntPFh",
            //     "phoneName": "",
            //     "redirect": "/payment/2710852?token=a204f2ae0f3c5db877d912f16295752f964257",
            //     "redirect_ssl": "https://mopay.info/payment8/2710852?token=a204f2ae0f3c5db877d912f16295752f964257",
            //     "bank_provider": "trc20",
            //     "timeToExpired": 900,
            //     "deeplink": "",
            //     "subType": "usdt                ",
            //     "phoneSender": "fjdsfahskjfhdasfjsdjfaldksfjadsklfjasldkfj",
            //     "createdDate": "2023-10-02T10:31:06.707",
            //     "updatedDate": null,
            //     "cardCode": null,
            //     "cardSerial": null
            // }
            
        },
        onWalletChargerCommandResponseError: function (response) {
            console.log(response);
        },

        copyWallet: function () {
            if(cc.Tool.getInstance().copyToClipboard(this.lbWalletAddress.string)) {
                cc.PopupController.getInstance().showMessage('Đã sao chép địa chỉ ví USDT.');
            }
        },

        copyAmount: function () {
            if(cc.Tool.getInstance().copyToClipboard(this.amount)) {
                cc.PopupController.getInstance().showMessage('Đã sao chép số tiền.');
            }
        },

        onEditingValueChanged: function () {
            var val = cc.Tool.getInstance().removeDot(this.editBoxValueTransfer.string);
            this.editBoxValueTransfer.string = cc.Tool.getInstance().formatNumber(val);
        },

        onEditingValueDidEnd: function () {
            var val = cc.Tool.getInstance().removeDot(this.editBoxValueTransfer.string);
            this.editBoxValueTransfer.string = cc.Tool.getInstance().formatNumber(val);
        },
        resetInput: function () {
            this.editBoxValueTransfer.string = '';
            this.editBoxTrc20Address.string = '';
            this.lbWalletAddress.string = 'Trc20 Address...';
            this.lbAmountTransaction.string = 'Số USDT: ...';
        },

        confirmTransferClicked: function () {
            this.amount = cc.Tool.getInstance().removeDot(this.editBoxValueTransfer.string);
            this.chargeType = 'usdt';
            this.phoneSender = this.editBoxTrc20Address.string;
            if (this.editBoxValueTransfer.string === ''||this.amount<5) {
                cc.PopupController.getInstance().showMessage('Vui lòng nhập số USDT hợp lệ.');
                return;
            } else if (this.editBoxTrc20Address.string=='') {
                cc.PopupController.getInstance().showMessage('Vui lòng nhập địa chỉ chính xác.');
                return;
            } else {
                this.chargeType = 'usdt';
                var usdtChargerCommand = new cc.UsdtChargerCommand;
                usdtChargerCommand.execute(this);
            }
        },

    });
}).call(this);
