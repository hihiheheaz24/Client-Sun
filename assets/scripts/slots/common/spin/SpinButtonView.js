/**
 * Created by Nofear on 6/7/2017.
 */

(function () {
    cc.SpinButtonView = cc.Class({
        "extends": cc.Component,
        properties: {
            btnBack: cc.Button,
            btnSelectBetLines: cc.Button,
            // btnSelectBetLines3: cc.Button,
            btnX2: cc.Button,
            btnSpin: cc.Button,

            spriteSelectBetLines: cc.Sprite,
            spriteSpin: cc.Sprite,
            spriteAutoSpin: cc.Sprite,
            spriteFastSpin: cc.Sprite,
            spriteX2: cc.Sprite,

            sfSpins: [cc.SpriteFrame],
            sfAutoSpins: [cc.SpriteFrame],//0 = normal
            sfFastSpins: [cc.SpriteFrame],
            sfX2s: [cc.SpriteFrame],
            sfSelectBetLines: [cc.SpriteFrame],
            btnBetBack: cc.Button,
            btnBetNext: cc.Button,

            btnSpinTry: cc.Button,
            btnSpinReal: cc.Button,
            buttonStopAutoTriggerSpin: cc.Button,

        },

        onLoad: function () {
            cc.SpinController.getInstance().setButtonView(this);
            if (this.btnX2) {
                this.btnX2.interactable = false;
                this.spriteX2.spriteFrame = this.sfX2s[1];
            }
            this.isAutoSpin = false;
        },

        activeButtonSelectBetLines: function (enable) {
            // this.btnSelectBetLines.interactable = enable;
            // if( this.btnSelectBetLines3){
            //     this.btnSelectBetLines3.interactable = enable;
            // }
        },

        activeButtonSpin: function (enable) {
            if (this.btnSelectBetLines !== undefined) {
               
                if (!enable && this.btnX2) {
                    this.btnX2.interactable = enable;
                    this.spriteX2.spriteFrame = this.sfX2s[1];
                }

                if(!this.isAutoSpin){
                    if (this.btnSelectBetLines3 !== undefined) {
                        this.btnSelectBetLines3.interactable = enable;
                    }
                    // this.btnSelectBetLines.interactable = enable;
    
                    if (this.btnBetBack)this.btnBetBack.interactable = enable;
                    if (this.btnBetNext)this.btnBetNext.interactable = enable;
    
                }

               
                // if (cc.RoomController.getInstance().getGameId() == cc.GameId.COWBOY) {
                //     this.spriteSpin.node.active = !this.isAutoSpin;
                //     this.spriteAutoSpin.node.active = this.isAutoSpin;
                // }

                this.btnSpin.interactable = enable;
                this.spriteSpin.spriteFrame = enable ? this.sfSpins[0] : this.sfSpins[1];
                if (this.spriteSelectBetLines !== null && this.spriteSelectBetLines !== undefined){
                    this.spriteSelectBetLines.spriteFrame = enable ? this.sfSelectBetLines[0] : this.sfSelectBetLines[1];
                }
                if(this.isAutoSpin){
                    if(this.btnSpinTry) this.btnSpinTry.interactable = false
                    if(this.btnSpinReal) this.btnSpinReal.interactable = false
                } else {
                    if(this.btnSpinTry) this.btnSpinTry.interactable = enable;
                    if(this.btnSpinReal) this.btnSpinReal.interactable = enable;
                }
            
                   
        
                if(cc.SpinController.getInstance().getIsPlayTry()){
                    if(this.btnBetBack) this.btnBetBack.interactable = false;
                    if(this.btnBetNext) this.btnBetNext.interactable = false;
                    if(this.btnSelectBetLines) this.btnSelectBetLines.interactable = false;
                    if(this.btnSelectBetLines3) this.btnSelectBetLines3.interactable = false; 
                }
            
                }

          
        },

        activeButtonX2: function (enable) {
            if (this.btnX2) {
                if (enable) {
                    if (!this.isAutoSpin) {
                        this.btnX2.interactable = enable;
                        this.spriteX2.spriteFrame = enable ? this.sfX2s[0] : this.sfX2s[1];
                    }
                } else {
                    this.btnX2.interactable = enable;
                    this.spriteX2.spriteFrame = enable ? this.sfX2s[0] : this.sfX2s[1];
                }
            }
        },

        activeButtonAutoSpin: function (enable) {
            this.isAutoSpin = enable;
            if(this.buttonStopAutoTriggerSpin) this.buttonStopAutoTriggerSpin.node.active = enable;
            this.spriteAutoSpin.spriteFrame = enable ? this.sfAutoSpins[1] : this.sfAutoSpins[0];
            // if (cc.RoomController.getInstance().getGameId() == cc.GameId.COWBOY) {
            //     this.spriteSpin.node.active = !enable;
            //     this.spriteAutoSpin.node.active = enable;
            // }


            if(cc.SpinController.getInstance().checkIsSpining()){
                if(enable){
    
                }
            } else {
                if(this.btnBetBack) this.btnBetBack.interactable = !enable;
                if(this.btnBetNext) this.btnBetNext.interactable = !enable;
                if(this.btnSelectBetLines) this.btnSelectBetLines.interactable = !enable;
                if(this.btnSelectBetLines3) this.btnSelectBetLines3.interactable = !enable;
            }
        },

        activeButtonAutoSpinMain: function (enable) {
            if(enable && cc.SpinController.getInstance().checkIsSpining()) return;
            if(this.btnSpinTry) this.btnSpinTry.interactable = enable
            if(this.btnSpinReal) this.btnSpinReal.interactable = enable
        },

        updateUIButtonTry: function (isTry) {
            if(isTry){
                if(this.btnSpinReal) this.btnSpinReal.node.active = true;
            } else {
                if(this.btnSpinReal) this.btnSpinReal.node.active = false;
            }
            if(this.btnBetBack) this.btnBetBack.interactable = !isTry;
            if(this.btnBetNext) this.btnBetNext.interactable = !isTry;
            // this.btnSelectBetLines.interactable = !isTry;
            if(this.btnSelectBetLines3) this.btnSelectBetLines3.interactable = !isTry; 
        },

       

        activeButtonFastSpin: function (enable) {
            this.spriteFastSpin.spriteFrame = enable ? this.sfFastSpins[1] : this.sfFastSpins[0];
        }
    });
}).call(this);
