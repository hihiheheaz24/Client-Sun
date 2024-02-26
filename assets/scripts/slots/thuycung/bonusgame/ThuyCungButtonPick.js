
cc.Class({
    extends: cc.Component,

    properties: {
        //0 = key, 1 = x4, 2 = multi
        sfPrizes: [cc.SpriteFrame],
        nodeIdle: cc.Node,
        resultImage: cc.Sprite,
        txtValue: cc.Label,
        button: cc.Button,
        mainNodePick: cc.Node,
        openDefault : cc.SpriteFrame
    },


    onLoad () {
        this.node.init = this.init.bind(this);
        this.node.pick = this.pick.bind(this);
        this.node.updateUI = this.updateUI.bind(this);  
        this.node.interactableButton = this.interactableButton.bind(this);  
    },

    interactableButton(interactable){
        if(!this._isShowed){
            this.button.interactable = interactable;
        } else {
            this.button.interactable = false;
        }
    },

    init(index){
        this.resultImage.node.active = false;
        this.txtValue.node.active = false;
        this._index = index;
        this._isShowed = false;
        this.interactableButton(true);
    },

    updateUI(value, tpye){
        this.nodeIdle.active = false;
        this.resultImage.node.active = true;
        this.txtValue.node.active = true;
        this._isShowed = true;
        this.interactableButton(false);
        switch (tpye) {
            case cc.BonusPrizeId.P_KEY:  //210
            {
                this.resultImage.node.active = true;
                this.txtValue.node.active = false;
                this.resultImage.spriteFrame = this.sfPrizes[0]; 
                break;
            }   
            case cc.BonusPrizeId.P_X4: //220
            {
                //set tien
                this.txtValue.node.active = true;
                this.txtValue.node.y = -34;
                this.txtValue.string = cc.Tool.getInstance().formatNumber(value);
                this.resultImage.node.active = true;
                this.resultImage.spriteFrame = this.sfPrizes[1];
                break;
            }
               
            default: // Diễn multi
            {
                //set tien
                this.resultImage.node.active = true;
                this.resultImage.spriteFrame = this.openDefault;
                this.txtValue.node.active = true;
                this.txtValue.node.y = -34;
                this.txtValue.string = cc.Tool.getInstance().formatNumber(value);
            }    
        }
    },

    pick(){
        cc.AudioController.getInstance().playSound(cc.AudioTypes.NORMAL_CLICK);
        this._isShowed = true;
        this.mainNodePick.stopTimer();  
        this.mainNodePick.interactableButtonPick(false);
      
        //Lay ve step hien tai
        let currentStep = cc.BonusGameController.getInstance().getCurrentStep();
        currentStep+=1;
        //set lai current step
        cc.BonusGameController.getInstance().setCurrentStep(currentStep);

        //lay du lieu
        let bonusResponse = cc.BonusGameController.getInstance().getData();
        let bonusData = bonusResponse.BonusData[currentStep - 1];

        let prizeId = bonusData.PrizeID;
        let pickValue = bonusData.PrizeValue;
        this.nodeIdle.active = false;
        switch (prizeId) {
            case cc.BonusPrizeId.P_KEY:
                //cc.AudioController.getInstance().playSound(cc.AudioTypes.BONUS_MISS);
                this.mainNodePick.updateMulti();    
                cc.RoomController.getInstance().sendRequestOnHub(cc.MethodHubName.PLAY_BONUS, currentStep, (this._index+1));
                this.txtValue.node.active = false;
                this.resultImage.node.active = true;
                this.resultImage.spriteFrame = this.sfPrizes[0];
                this.resultImage.node.scale = 0;
                this.resultImage.node.runAction(cc.sequence(
                    cc.scaleTo(0.3,1),
                    cc.delayTime(0.5),
                    cc.callFunc(()=>{
                        this.checkLastPick();
                    })
                ))
            
             
                break;
            case cc.BonusPrizeId.P_X4:
                //GOi len hub
                cc.RoomController.getInstance().sendRequestOnHub(cc.MethodHubName.PLAY_BONUS, currentStep, (this._index+1));
                //set tien
                this.resultImage.node.active = true;
                this.resultImage.node.scale = 0;
                this.resultImage.spriteFrame = this.sfPrizes[1];
                this.resultImage.node.runAction(cc.sequence(
                    cc.scaleTo(0.3,1),
                    cc.callFunc(()=>{
                        this.txtValue.node.active = true;
                        this.txtValue.node.y = 0;
                        this.txtValue.string = cc.Tool.getInstance().formatNumber(pickValue/this.mainNodePick.getMulti());
                        this.txtValue.node.runAction(cc.sequence(
                            cc.jumpTo(0.15, cc.v2(0,-34), 15, 1),
                            cc.delayTime(0.05),
                            cc.jumpBy(0.15, cc.v2(0,0), 15, 1),
                            cc.callFunc(()=>{
                                this.txtValue.string = cc.Tool.getInstance().formatNumber(pickValue);
                            }),
                       
                            cc.delayTime(0.5),
                            cc.callFunc(()=>{
                                this.checkLastPick();
                            })
                        ))
                      
                    })
                ))
                break;
            default:
                //set tien
                this.resultImage.spriteFrame = this.openDefault;
                this.resultImage.node.active = true;
                this.txtValue.node.active = false;
                this.mainNodePick.showMulti({posIndex: this._index+1, winValue: pickValue/this.mainNodePick.getMulti(), currentStep }, ()=>{
                    this.txtValue.node.active = true;
                    this.txtValue.node.y = 0;
                    this.txtValue.string = cc.Tool.getInstance().formatNumber(pickValue/this.mainNodePick.getMulti());
                    this.txtValue.node.runAction(cc.sequence(
                        cc.jumpTo(0.15, cc.v2(0,-34), 15, 1),
                        cc.delayTime(0.05),
                        cc.jumpBy(0.15, cc.v2(0,0), 15, 1),
                        cc.callFunc(()=>{
                            this.txtValue.string = cc.Tool.getInstance().formatNumber(pickValue);
                        }),
                        cc.delayTime(0.5),
                        cc.callFunc(()=>{
                            this.checkLastPick();
                        })
                    ))
                  
                 
                })
        }

    },

    checkLastPick () {
        let bonusResponse = cc.BonusGameController.getInstance().getData();
        let remaining = bonusResponse.TotalStep - cc.BonusGameController.getInstance().getCurrentStep();
        this.mainNodePick.updatePickRemain(remaining);
        if (remaining > 0) {
            this.mainNodePick.interactableButtonPick(true);
        } else {
            // cc.warn("HET BONUS")
            // cc.director.getScheduler().schedule(function () {
            //     cc.BonusGameController.getInstance().onPlayBonusFinishResponse(10000000);
            // }, this, 0, 0, 3, false);
        }
    },

   
});
