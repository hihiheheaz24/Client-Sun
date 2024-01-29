
cc.Class({
    extends: require('SpinButtonView'),

    properties: {
        btnBetMinus: cc.Button,
        btnBetAdd: cc.Button, 
        buttonStopAutoSpin: cc.Button,
        btnAutoSpin: cc.Button,
        toggleAutoSpin:cc.Node,
        btnTry: cc.Button,
        btnReal: cc.Button,
    },

    activeButtonSpin: function (enable) {
        //cc.warn("activeButtonSpin",enable )
        this.btnBack.interactable = enable;
        if (this.btnSelectBetLines !== undefined) {
            if(!this.isAutoSpin){
                this.btnAutoSpin.interactable = enable;
                this.btnSelectBetLines.interactable = enable;
                this.btnBetMinus.interactable = enable;
                this.btnBetAdd.interactable = enable;
            }
           
            if (!enable && this.btnX2) {
                this.btnX2.interactable = enable;
                this.spriteX2.spriteFrame = this.sfX2s[1];
            }
         
            this.btnSpin.interactable = enable;
            if(this.isAutoSpin){
                this.btnReal.interactable = false;
                this.btnTry.interactable = false;
            } else {
                this.btnReal.interactable = enable
                this.btnTry.interactable = enable;
            }

            if(cc.SpinController.getInstance().getIsPlayTry()){
                this.btnBetMinus.interactable = false;
                this.btnBetAdd.interactable = false;
                this.btnSelectBetLines.interactable = false;
            }
        }
    },

    activeButtonAutoSpin: function (enable) {
        this.isAutoSpin = enable;
        this.buttonStopAutoSpin.node.active = enable;
        this.toggleAutoSpin.active = enable;
        if(cc.SpinController.getInstance().checkIsSpining()){
            if(enable){

            }
        } else {
            this.btnAutoSpin.interactable = !enable;
            this.btnSelectBetLines.interactable = !enable;
            this.btnBetMinus.interactable = !enable;
            this.btnBetAdd.interactable = !enable;
        }
        
    },


    updateUIButtonTry(isTry = true){
        this.btnReal.node.active = isTry;
        this.btnTry.node.active = !isTry;
        // this.txtBtnTry.string = isTry ? "CHƠI THẬT" : "CHƠI THỬ";  
        this.btnBetMinus.interactable = !isTry;
        this.btnBetAdd.interactable = !isTry;
        this.btnSelectBetLines.interactable = !isTry;
    }

   
});
