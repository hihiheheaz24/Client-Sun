/**
 * Input dat cuoc
 */

(function () {
    cc.TaiXiuInputBetView = cc.Class({
        "extends": cc.Component,
        properties: {
            nodeInput: cc.Node, //node input
            nodeInputValue: cc.Node, //node chon so tien de bet
            nodeInputFree: cc.Node, //node tu do chon so tien

            lbBetTaiTemp: cc.Label,
            lbBetXiuTemp: cc.Label,
            audioChonSo: cc.AudioSource,
            editBoxDatTai: cc.EditBox,
            editBoxDatXiu: cc.EditBox,
            //nodeTaiSelect:cc.Node,
            //nodeXiuSelect:cc.Node,

            x2Button:cc.Button,

            lblOther: cc.Label,

            nodeInputValueTai: cc.Node,
            nodeInputValueXiu: cc.Node,
            //buttonInputTai: cc.Button,
            //buttonInputXiu: cc.Button,

            _inputOpen: false,
        },

        enableBetting(enable){
           // this.buttonInputTai.interactable = enable;
           // this.buttonInputXiu.interactable = enable;
            if(!enable && this._inputOpen){
                this.closeInput();
            }

        },

        onLoad: function () {
            this.resetInput();

            this.animation = this.node.getComponent(cc.Animation);
            cc.TaiXiuController.getInstance().setTaiXiuInputBetView(this);

            this.nodeInputValue.active = true;
            this.nodeInputFree.active = false;
            this.isInputValue = true;
            this.lblOther.string = this.isInputValue ? "Số khác":  "Đặt nhanh"
        
            this.reset();
        },
        onClickTaiSelect:function(){
            //this.nodeTaiSelect.active = false;
            this.openInputBetTaiClicked();
        },
        onClickXiuSelect:function(){
            this.nodeXiuSelect.active = false;
            this.openInputBetXiuClicked();
        },
        onDestroy: function () {
            cc.TaiXiuController.getInstance().setTaiXiuInputBetView(null);
        },

        reset: function () {
            /* ko can cua so input
            this.nodeInput.active = false;
            this.isInputValue = true;
            */

            //reset lai gia tri input
            //this.resetInput();
            if (cc.sys.isNative) {
                this.editBoxDatTai.active = false;
                this.editBoxDatXiu.active = false;
            }

            this._x2Value = 0;
        },
        
        setStatusInputValueTX: function (statusTai, statusXiu) {
            this.nodeInputValueTai.active = statusTai;
            this.nodeInputValueXiu.active = statusXiu;
        },

        //reset lai gia tri input
        resetInput: function () {
            // this.lbBetTaiTemp.string = 'Đặt';
            // this.lbBetXiuTemp.string = 'Đặt';
            this.setStatusInputValueTX(false, false);

            // this.lbBetTaiTemp.string = '0';
            // this.lbBetXiuTemp.string = '0';
            this.editBoxDatXiu.string = '';
            this.editBoxDatTai.string = '';

            this.betValue = 0;
        },

        //mo cua so input
        openInput: function () {
            cc.TaiXiuController.getInstance().resetPositionTX();
            this._inputOpen = true;
            this.nodeInput.active = true;

            // this.nodeInputValue.active = true;
            // this.nodeInputFree.active = false;
            // this.isInputValue = true;

            this.animation.play('openBetInput');
            if(this._x2Value > 0){
                this.x2Button.interactable = true;
            } else {
                this.x2Button.interactable = false;
            }
        },

        //dong input
        closeInput: function () {
            this._inputOpen = false;
            this.resetInput();
            this.animation.play('closeBetInput');
        },

        //animation trigger goi sau khi dong cua so input
        closeBetInputEvent: function () {
            this.nodeInput.active = false;
        },

        //cap nhat gia tri bet dua tren so tien Bet
        updateValueBetUI: function () {
            if (this.betSide === cc.TaiXiuBetSide.TAI) {
                this.lbBetTaiTemp.string = cc.Tool.getInstance().formatNumber(this.betValue);
            } else {
                this.lbBetXiuTemp.string = cc.Tool.getInstance().formatNumber(this.betValue);
            }
        },

        //click mo cua so input Tai
        openInputBetTaiClicked: function () {
            if (this.nodeInput.active && this.betSide === cc.TaiXiuBetSide.TAI) {
                this.closeInput();
            } else if (this.nodeInput.active && this.betSide === cc.TaiXiuBetSide.XIU) {
                this.betSide = cc.TaiXiuBetSide.TAI;
                // this.lbBetXiuTemp.string = 'Đặt';
                // this.lbBetXiuTemp.string = '0';
                this.lbBetTaiTemp.string = cc.Tool.getInstance().formatNumber(this.betValue);
                this.setStatusInputValueTX(true, false);
            } else {
                this.betSide = cc.TaiXiuBetSide.TAI;
                this.lbBetTaiTemp.string = 0;
                this.openInput();
                if (!cc.sys.isNative) {
                    this.editBoxDatTai.focus();
                }
                this.setStatusInputValueTX(true, false);
            }
        },

        //click mo cua so input Xiu
        openInputBetXiuClicked: function () {
            if (this.nodeInput.active && this.betSide === cc.TaiXiuBetSide.XIU) {
                this.closeInput();
            } else if (this.nodeInput.active && this.betSide === cc.TaiXiuBetSide.TAI) {
                this.betSide = cc.TaiXiuBetSide.XIU;
                // this.lbBetTaiTemp.string = '0';
                // this.lbBetTaiTemp.string = 'Đặt';
                this.lbBetXiuTemp.string = cc.Tool.getInstance().formatNumber(this.betValue);
                this.setStatusInputValueTX(false, true);
            } else {
                this.betSide = cc.TaiXiuBetSide.XIU;
                this.lbBetXiuTemp.string = 0;
                this.openInput();
                if (!cc.sys.isNative) {
                    this.editBoxDatXiu.focus();
                }
                this.setStatusInputValueTX(false, true);
            }
        },


        //chon gia tri
        betValueClicked: function (event, data) {
            this.betValue += parseInt(data.toString());

            this.updateValueBetUI();
            this.audioChonSo.play();
        },

        //them so
        addValueClicked: function (event, data) {
            this.betValue += data.toString();
            this.betValue = parseInt(this.betValue);

            this.updateValueBetUI();
            this.audioChonSo.play();
        },

        //lui 1 so
        deleteClicked: function () {
            this.betValue = (this.betValue.toString().substring(0, this.betValue.toString().length - 1));
            if (this.betValue === '') {
                this.betValue = 0;
            } else {
                this.betValue = parseInt(this.betValue);
            }

            this.updateValueBetUI();
            this.audioChonSo.play();
        },

        //huy input
        cancelClicked: function () {
            this.closeInput();
            this.audioChonSo.play();
        },
        allInClick(){
            let coin = cc.BalanceController.getInstance().getBalance();
            if(this.betSide ==cc.TaiXiuBetSide.XIU){
                this.onTextXiuChange(coin)
            }else{
                this.onTextTaiChange(coin)
            }
        },
        x2Click(){
            this.x2Button.interactable = false;
            this.betValue = this._x2Value*2;
            this.betValue = parseInt(this.betValue)
            this.updateValueBetUI();
            this.audioChonSo.play();
        },
        //xac nhan bet
        confirmClicked: function (e,val) {
            //goi len Hub params(bet, betValue, betSide)
            
           
            
            if (this.betValue < 1000) {
                cc.PopupController.getInstance().showMessage('Đặt tối thiểu 1.000 ' + cc.Config.getInstance().currency());
            } else if (cc.BalanceController.getInstance().getBalance() < this.betValue) {
                cc.PopupController.getInstance().showMessage('Số dư không đủ');
            } else {
                cc.TaiXiuController.getInstance().sendBetRequest(cc.MethodHubName.BET, this.betValue, this.betSide);
                this._x2Value = this.betValue;
            }
            this.closeInput();
            this.audioChonSo.play();
        },

        //chuyen kieu input
        otherClicked: function () {
            this.betValue = 0;
            this.updateValueBetUI();
            this.nodeInputValue.active = !this.isInputValue;
            this.nodeInputFree.active = this.isInputValue;
            this.isInputValue = !this.isInputValue;
            this.audioChonSo.play();
            this.lblOther.string = this.isInputValue ? "Số khác":  "Đặt nhanh"
        },

        //text xiu change
        onTextXiuChange: function(data) {
            this.betValue = data.toString();
            this.betValue = parseInt(this.betValue);
            this.lbBetXiuTemp.string = cc.Tool.getInstance().formatNumber(this.betValue);
            this.audioChonSo.play();
        },
        //text tai change
        onTextTaiChange: function(data) {
            this.betValue = data.toString();
            this.betValue = parseInt(this.betValue);
            this.lbBetTaiTemp.string = cc.Tool.getInstance().formatNumber(this.betValue);
            this.audioChonSo.play();
        }

    });
}).call(this);
