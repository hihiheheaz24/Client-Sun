// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        animationMenuBank: cc.Animation,
        animationMenuOTP:cc.Animation,
        lbNameBank:cc.Label,
        itemToggle:cc.Node,
        toggleContainer:cc.Node,
        SoTK:cc.EditBox,
        TenTK:cc.EditBox,
        Amount:cc.EditBox,
        Otp:cc.EditBox,
       
        CoinCasout:cc.Label,
        lbOTPType:cc.Label,

        btnGetOTPs: [cc.Button],
        lbBtnGetOTPs: [cc.Label],

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    update: function (dt) {
        if (this.isTimer) {
            this.timer -= dt;
            this.updateTimer += dt;

            if (this.updateTimer < this.updateInterval) return; // we don't need to do the math every frame
            this.updateTimer = 0;
            this.processTimeOTPButton();
        }
    },

    onLoad: function () {
        this.rate = 1;
        this.isTimer = false;
        this.timer = 0;
        this.timePerGetOTP = 120;
        this.updateInterval = 1;
        this.updateTimer = 0;
        this.otpType = cc.OTPType.TELEGRAM;
        this.lbSelectedBankCode = "";
        var CastoutGetListBankCode = new  cc.CastoutGetListBankCode;
        CastoutGetListBankCode.execute(this);
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

    processTimeOTPButton: function () {
        if (this.timer <= 0) {
            this.isTimer = false;
            this.btnGetOTPs.forEach(function (btnGetOTP) {
                btnGetOTP.interactable = true;
            });
            this.lbBtnGetOTPs.forEach(function (lbBtnGetOTP) {
                lbBtnGetOTP.string = 'OTP Free';
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

    start: function(){
        this.bankSelect = [];
    },
    onEnable: function () {
        this.bankSelect = [];
        this.lbNameBank.string = "Chọn ngân hàng";
    },
    activeTimeOTPButton: function () {
        this.isTimer = true;
        this.updateTimer = 1;
        this.timer = this.timePerGetOTP;
    },
    selectBankNameEvent: function(event, data) {
        console.log(event);
        if( this.bankSelect.length > 0){
        
            let _nodeView = this.bankList[this.bankSelect[0]];
            let _varNode = _nodeView.getComponent(cc.VarNode);
            _varNode.nodes[1].active = false;
        }
        var val = data.toString().split("|");
        this.bankSelect  = val;
        this.lbSelectedBankCode = val[0];

        this.lbNameBank.string = val[1];
        this.animationMenuBank.play('hideDropdownMenu');

        if(val.length > 1){
            var nodeView = this.bankList[val[0]];
            var varNode = nodeView.getComponent(cc.VarNode);
            varNode.nodes[1].active = true;
        }
    },

    openMenuBankNameClicked: function () {
        console.log("openMenuBankNameClicked");
        this.animationMenuBank.play('showDropdownMenu');
    },

    hideMenuBankNameClicked: function () {
        this.animationMenuBank.play('hideDropdownMenu');
    },
    onEnable: function () {
    //    var CastoutGetListBankCode = new  cc.CastoutGetListBankCode;
    //    CastoutGetListBankCode.execute(this);
    },
    onCastOutBankGetListBankCodeResponse:function(data){
        // console.log("data: " + JSON.stringify(data));
        // this.rate = data.Rate;
        var dataBank = data.data;
        this.bankList = {};
        for(let i =0 ; i < dataBank.length; i++){
            var nodeView = cc.instantiate(this.itemToggle);
            nodeView.active = true;

            var varNode = nodeView.getComponent(cc.VarNode);
            varNode.nodes[0].getComponent(cc.Label).string =  dataBank[i].code;
            varNode.nodes[1].getComponent(cc.Label).string = dataBank[i].code;
            var _toggle = nodeView.getComponent(cc.Button);
         
             _toggle.clickEvents[0].customEventData  = dataBank[i].code+"|"+dataBank[i].name;

            nodeView.parent = this.toggleContainer;
            this.bankList[dataBank[i].code] = nodeView;
        }
    },
    onCastoutBankChargeOutResponse:function(data){
        cc.PopupController.getInstance().showMessage(data.message);
    },
    onCastoutBankChargeOutResponseError:function(data){
        cc.PopupController.getInstance().showMessageError(data.message);
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
    onSubmit : function(){
        if (this.bankSelect.length == 0) {
            cc.PopupController.getInstance().showMessage('Vui lòng nhập chọn ngân hàng');
            return;
        }
        if (this.SoTK.string === '') {
            cc.PopupController.getInstance().showMessage('Vui lòng nhập Số tài khoản');
            return;
        }
        if (this.TenTK.string === '') {
            cc.PopupController.getInstance().showMessage('Vui lòng nhập Tên tài khoản');
            return;
        }
        // if (this.Otp.string === '') {
        //     cc.PopupController.getInstance().showMessage('Vui lòng nhập Otp');
        //     return;
        // }
        if (this.Amount.string === '') {
            cc.PopupController.getInstance().showMessage('Vui lòng nhập số tiền cần rút');
            return;
        }
 
        this.VarSoTk = this.SoTK.string;
        this.VarNameTk = this.TenTK.string.split(' ').join("%20");
        this.VarAmount = this.Amount.string;
        this.VarOtp = this.Otp.string;
        this.VarBankCode = this.bankSelect[0];
        this.VarBankName = this.bankSelect[1];
        var  CastoutBankChargeOut = new  cc.CastoutBankChargeOut();
        CastoutBankChargeOut.execute(this,this.otpType);
    },
    
    onTotalAmount:function(){
        let coin = this.Amount.string;
        // coin = parseFloat(coin); 
        // this.CoinCasout.string =  cc.Tool.getInstance().formatNumber(coin + this.rate*coin/100);
        this.CoinCasout.string = cc.Tool.getInstance().formatNumber(coin);
    }
    // update (dt) {},
});
