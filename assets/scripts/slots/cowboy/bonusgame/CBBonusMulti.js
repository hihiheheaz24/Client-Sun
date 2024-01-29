
cc.Class({
    extends: cc.Component,

    properties: {
        listButton: [cc.Button],
        listBGResult: [cc.Node],
        listResult: [cc.Node],
        listImageMulti: [cc.SpriteFrame],
        
    },

    onLoad () {
        this.node.play = this.play.bind(this);
        this.node.reset = this.reset.bind(this);
        
    },
    
    play(){
        this.node.active = true;
        this.listBGResult.forEach((node)=>{
            node.scaleX  = 0;
        });
        this.listResult.forEach((node)=>{
            node.scaleX  = 0;
        });
        this.listButton.forEach((btnPick)=>{
            btnPick.interactable = false;
            btnPick.node.scale = 0;
        });
        this.node.runAction(cc.sequence(
            cc.callFunc(()=>{
                this.listButton.forEach((btnPick)=>{
                    btnPick.node.runAction(cc.scaleTo(0.2,1));
                });
            }),
            cc.delayTime(0.2),
            cc.callFunc(()=>{
                this.listButton.forEach((btnPick)=>{
                    btnPick.interactable = true;
                });
            }),
        ))
     
    },

    onClickPick(event,index){
          //send request Hub
          let buttonIndex = parseInt(index.toString());
          //Kho ca cac cho pick khac
          this.listButton.forEach((btnPick)=>{
              btnPick.interactable = false;
          });
          let bonusResponse = cc.BonusGameController.getInstance().getData();
          let multiplier = bonusResponse.Multiplier;
          let totalWin = cc.BonusGameController.getInstance().getTotalWin();
          totalWin *= multiplier;
          this.listIndex = [0,1,2];
          this.listIndex.splice(this.listIndex.indexOf(buttonIndex),1);


          this.listMulti = [1,2,3,4,5];
          this.listMulti.splice(this.listMulti.indexOf(multiplier),1);
          this.listMulti.sort( () => 0.5 - Math.random() );
          
          //update lai tong so tien thang UI
          cc.BonusGameController.getInstance().updateTotalWin(totalWin);
          this.node.runAction(cc.sequence(
            cc.callFunc(()=>{
                this.listButton[buttonIndex].node.runAction(cc.scaleTo(0.4,0,1))
                this.listBGResult[buttonIndex].runAction(cc.scaleTo(0.4,1,1))
                this.listResult[buttonIndex].runAction(cc.scaleTo(0.4,1,1))
                this.listResult[buttonIndex].getComponent(cc.Sprite).spriteFrame = this.listImageMulti[multiplier-1];
            }),
            cc.delayTime(0.5),
            cc.callFunc(()=>{
                cc.AudioController.getInstance().playSound(cc.AudioTypes.BONUS_MISS);
                this.listIndex.forEach(btnIndex =>{
                    this.listButton[btnIndex].node.runAction(cc.scaleTo(0.4,0,1))
                    this.listBGResult[btnIndex].runAction(cc.scaleTo(0.4,1,1))
                    this.listResult[btnIndex].runAction(cc.scaleTo(0.4,1,1))
                    this.listBGResult[btnIndex].opacity = 150;
                    this.listButton[btnIndex].node.opacity = 150;
                    this.listResult[btnIndex].getComponent(cc.Sprite).spriteFrame = this.listImageMulti[this.listMulti[btnIndex]-1];
                })
            }),
            cc.delayTime(2),
            cc.callFunc(()=>{
                cc.BonusGameController.getInstance().changeView(cc.BonusGameState.RESULT)
            })
          ))
    },

    reset(){
        this.node.active = false;   
        this.node.stopAllActions();
    }
   
});
