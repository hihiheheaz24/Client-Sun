
cc.Class({
    extends: cc.Component,

    properties: {
        listButton: [cc.Button],
        listTxtResult: [cc.Node],    
        sprOpen : cc.SpriteFrame,
        sprOff : cc.SpriteFrame

    },

    onLoad () {
        this.node.play = this.play.bind(this);
        this.node.reset = this.reset.bind(this);
        
    },
    
    play(data, callback){
        //cc.AudioController.getInstance().playSound(cc.AudioTypes.BONUS_MULTI);
        this.reset();
        this.node.active = true
        this._data = data;
        this._callback = callback;
    },

    onClickPick(event, indexPick){
        indexPick = parseInt(indexPick.toString())
        this.listButton.forEach(button=>{
            button.interactable = false;
        })
        const {posIndex, winValue, currentStep} = this._data;

        cc.RoomController.getInstance().sendRequestOnHub(cc.MethodHubName.PLAY_BONUS, currentStep, posIndex);
       
        this.node.runAction(cc.sequence(
            cc.callFunc(()=>{
                this.listTxtResult[indexPick].active = true;
                this.listTxtResult[indexPick].getComponent(cc.Label).string = cc.Tool.getInstance().formatNumber(winValue);
                this.listTxtResult[indexPick].runAction(cc.jumpBy(0.15, 0,0, 15, 1))
            }),
            cc.delayTime(0.5),
            cc.callFunc(()=>{
                this.listTxtResult.forEach((txtResult,index)=>{
                    if(index != indexPick){
                        const check = this.randomRangeInt(0,10);
                        let tempWinValue = 0;
                        if(check<=5){
                            tempWinValue = winValue * this.randomRangeInt(1,4);
                        } else {
                            tempWinValue = winValue / this.randomRangeInt(1,4);
                        }
                        txtResult.opacity = 150;
                        txtResult.active = true;
                        // this.listButton[index].node.opacity = 150;
                        this.listButton[index].node.getComponent(cc.Sprite).spiteFrame = this.sprOpen;
                        this.listButton[index].node.getChildByName("light").active = true;
                        txtResult.getComponent(cc.Label).string = cc.Tool.getInstance().formatNumber(tempWinValue);
                        txtResult.runAction(cc.jumpBy(0.15, 0,0, 15, 1));
                       
                      
                    }
                })
            }),
            cc.delayTime(1),
            cc.callFunc(()=>{
                this._callback();
                this.reset();
            }),
        ))     
    },

    reset(){
        this.node.active = false;   
        this.node.stopAllActions();
        this.listButton.forEach(button=>{
            button.interactable = true;
            button.node.opacity = 255;
            button.node.getComponent(cc.Sprite).spiteFrame = this.sprOff;
            button.node.getChildByName("light").active = false;
        })

        this.listTxtResult.forEach(txtResult=>{
            txtResult.opacity = 255;
            txtResult.active = false;
            txtResult.stopAllActions();   
        })
        this._callback = null;
    },

    randomRangeInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }


})