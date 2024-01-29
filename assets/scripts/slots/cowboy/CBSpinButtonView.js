
cc.Class({
    extends: require('SpinButtonView'),

    properties: {
        btnSelectBetLines2: cc.Button,
        btnBetMinus: cc.Button,
        btnBetAdd: cc.Button,
        spriteSelectBetLines2: cc.Sprite,

        btnAutoSpinMinus: cc.Button,
        btnAutoSpinAdd: cc.Button,
        btnAutoSpinMain: cc.Button,

        btnTry: cc.Button,
        btnReal: cc.Button,
        btnKhoBao: cc.Button,
   
    },


  
    activeButtonSelectBetLines: function (enable) {
        this.btnSelectBetLines.interactable = enable;
        this.btnSelectBetLines2.interactable = enable;
    },

    activeButtonSpin: function (enable) {
        //this.btnBack.interactable = enable;
        if (this.btnSelectBetLines !== undefined) {

            this.btnBack.interactable = enable;

            if(!this.isAutoSpin){
                this.activeButtonAutoSpinMain(enable);
            }
         
            this.btnBetMinus.interactable = enable;
            this.btnBetAdd.interactable = enable;
            this.btnSelectBetLines.interactable = enable;
            this.btnSelectBetLines2.interactable = enable;
            if (!enable && this.btnX2) {
                this.btnX2.interactable = enable;
                this.spriteX2.spriteFrame = this.sfX2s[1];
            }


            this.btnSpin.interactable = enable;
            this.spriteSpin.spriteFrame = enable ? this.sfSpins[0] : this.sfSpins[1];
            if (this.spriteSelectBetLines !== null && this.spriteSelectBetLines !== undefined)
                this.spriteSelectBetLines.spriteFrame = enable ? this.sfSelectBetLines[0] : this.sfSelectBetLines[1];   
            if (this.spriteSelectBetLines2 !== null && this.spriteSelectBetLines2 !== undefined)
                this.spriteSelectBetLines2.spriteFrame = enable ? this.sfSelectBetLines[0] : this.sfSelectBetLines[1]; 
                
                
            if(this.isAutoSpin){
                this.btnTry.interactable = false
                this.btnReal.interactable = false
            } else {
                this.btnTry.interactable = enable;
                this.btnReal.interactable = enable;
            }
        

            if(cc.SpinController.getInstance().getIsPlayTry()){
                this.btnBetMinus.interactable = false;
                this.btnBetAdd.interactable = false;
                this.btnSelectBetLines.interactable = false;
                this.btnSelectBetLines2.interactable = false; 
            }
        }
      
       
    },

    activeButtonAutoSpin: function (enable) {
        this.isAutoSpin = enable;
        this.spriteAutoSpin.spriteFrame = enable ? this.sfAutoSpins[1] : this.sfAutoSpins[0];
        this.spriteSpin.node.active = !enable;
        this.spriteAutoSpin.node.active = enable;
    },

    activeButtonAutoSpinMain: function (enable) {
        if(enable && cc.SpinController.getInstance().checkIsSpining()) return;
        this.btnAutoSpinMinus.interactable = enable;
        this.btnAutoSpinAdd.interactable = enable;
        this.btnAutoSpinMain.interactable = enable;
        this.btnTry.interactable = enable;
        this.btnReal.interactable = enable;
    },


    updateUIButtonTry(isTry = true){
        if(isTry){
            this.btnReal.node.active = true;
        } else {
            this.btnReal.node.active = false;
        }

        this.btnBetMinus.interactable = !isTry;
        this.btnBetAdd.interactable = !isTry;
        this.btnSelectBetLines.interactable = !isTry;
        this.btnSelectBetLines2.interactable = !isTry;
        this.btnKhoBao.node.active = !isTry
    }
   
});
