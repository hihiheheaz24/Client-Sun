// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

(function () {
    cc.DetailRecharge = cc.Class({
    extends: cc.Component,
    properties: {
        lbBank:cc.Label,
        lbAccount:cc.Label,
        lbName:cc.Label,
        lbDescription:cc.Label,
        lbAmount:cc.Label,
        lbTime:cc.Label,
        qrCode:cc.Sprite
    },
    show:function(data)
    {
        this.node.getComponent(cc.Animation).play('openPopup');
        this.resetInfo();
        this.data = data;
        this.lbBank.string = data.bank_provider;
        this.lbAccount.string = data.phoneNum;
        this.lbName.string = data.phoneName;
        this.lbDescription.string = data.chargeCode;
        this.lbAmount.string = cc.Tool.getInstance().formatNumber(data.regAmount);
        this.lbTime.string = "Thời gian tạo lệnh: "+ data.createdDate.slice(0,19).replace('T',' ');
        var remoteUrl= data.qr_url;
        cc.assetManager.loadRemote(remoteUrl,{ext:".png"},(err, texture)=>{
            var spriteFrame=new cc.SpriteFrame(texture);
            this.qrCode.spriteFrame = spriteFrame;
            this.qrCode.active = true;
        });
    },
    copyBankAccountNumberClicked: function () {
        if(this.data != null && cc.Tool.getInstance().copyToClipboard(this.data.phoneNum)) {
            cc.PopupController.getInstance().showMessage('Đã sao chép số tài khoản.');
        }
    },

    copyBankAccountNameClicked: function () {
        if(this.data != null && cc.Tool.getInstance().copyToClipboard(this.data.phoneName)) {
            cc.PopupController.getInstance().showMessage('Đã sao chép tên tài khoản.');
        }
    },

    copyMoneyValueClicked: function () {
        if(this.data != null && cc.Tool.getInstance().copyToClipboard(this.data.regAmount)) {
            cc.PopupController.getInstance().showMessage('Đã sao chép số tiền.');
        }
    },

    copyTranIDClicked: function () {
        if(this.data != null && cc.Tool.getInstance().copyToClipboard(this.data.chargeCode)) {
            cc.PopupController.getInstance().showMessage('Đã sao chép nội dung chuyển khoản.');
        }
    },
    resetInfo:function(){
        this.data = null;
        this.lbBank.string = '...';
        this.lbAccount.string = '...';
        this.lbName.string = '...';
        this.lbAmount.string = '...';
        this.lbTime.string = "Thời gian tạo lệnh: .. : .. : ..  .. : ..";
        this.qrCode.active = false;
    },
    closeClicked(){
        this.node.active = false;
    }

})}).call(this);
