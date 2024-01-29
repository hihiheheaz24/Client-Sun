
cc.Class({
    extends: require('SpinButtonView'),

    properties: {
        btnBetMinus: cc.Button,
        btnBetAdd: cc.Button, 
        buttonStopAutoSpin: cc.Button,
        btnAutoSpin: cc.Button,
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
            this.spriteSpin.spriteFrame = enable ? this.sfSpins[0] : this.sfSpins[1];
            if (this.spriteSelectBetLines !== null && this.spriteSelectBetLines !== undefined)
                this.spriteSelectBetLines.spriteFrame = enable ? this.sfSelectBetLines[0] : this.sfSelectBetLines[1];   
        }
    },

    activeButtonAutoSpin: function (enable) {
        //cc.warn("activeButtonAutoSpin",enable )
        this.isAutoSpin = enable;
    
     //   this.spriteAutoSpin.spriteFrame = enable ? this.sfAutoSpins[1] : this.sfAutoSpins[0];
        this.buttonStopAutoSpin.node.active = enable;
     
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

   
});
