
cc.Class({
    extends: cc.Component,

    properties: {
        lbiWin: cc.LabelIncrement,
        mainChar: cc.Node,
        effectGround: cc.Node,
        effectBlood: cc.Node,
        effectMoney: cc.Node,
        buttonPick: cc.Button
    },

    onLoad () {
        this.node.play = this.play.bind(this);
        this.node.updateTotalWin = this.updateTotalWin.bind(this);
        this.node.endModePick = this.endModePick.bind(this);
        this.node.reset = this.reset.bind(this);
        
    },
    
    play(){
        this.node.active = true;
        this.effectMoney.getComponent(cc.Label).string = '';
        let bonusResponse = cc.BonusGameController.getInstance().getData();
        let currentStep = bonusResponse.CurrentStep;
        this.buttonPick.interactable = false;
        if (currentStep < 1) {
            this.playAnimMainChar("START", ()=>{
                this.buttonPick.interactable = true;
                this.playAnimMainChar("IDLE");
            });    
        } else {
            this.buttonPick.interactable = true;
            this.playAnimMainChar("IDLE");
        }   
    },


    onClickPick(){
        // const fakeDateBonus = {
        //     BonusData: [
        //         {Step: 1, PrizeID: 201, Multiplier: 0.3, PrizeValue: 7500},
        //         {Step: 2, PrizeID: 202, Multiplier: 0.6, PrizeValue: 15000},
        //         {Step: 3, PrizeID: 200, Multiplier: 0, PrizeValue: 0}
        //     ],
        //     CurrentStep: 0,
        //     Multiplier: 1,
        //     Position: "",
        //     PrizeValue: 22500,
        //     SpinID: 4733170,    
        //     TotalStep: 3
        // }
        this.buttonPick.interactable = false;
        //Lay ve step hien tai
        let currentStep = cc.BonusGameController.getInstance().getCurrentStep();
        currentStep += 1;
        //GOi len hub
        cc.RoomController.getInstance().sendRequestOnHub(cc.MethodHubName.PLAY_BONUS, currentStep, currentStep);
        //set lai current step
        cc.BonusGameController.getInstance().setCurrentStep(currentStep);
        //lay du lieu
        let bonusResponse = cc.BonusGameController.getInstance().getData();
        let bonusData = bonusResponse.BonusData;
        let pickValue = bonusData[currentStep - 1].PrizeValue;

        //xu ly do hoa khi thang / thua
        if (pickValue > 0) {
            //choi tiep duoc -> Cho Pick tiep
            this.effectMoney.getComponent(cc.Label).string =  cc.Tool.getInstance().formatNumber(pickValue);
            this.playAnimMainChar("SHIELD", ()=>{
                this.buttonPick.interactable = true;
                let totalWin = cc.BonusGameController.getInstance().getTotalWin();
                totalWin = totalWin + pickValue;
                //update lai tong so tien thang UI
                cc.BonusGameController.getInstance().updateTotalWin(totalWin);
                this.playAnimMainChar("IDLE");
            })
        } else {
            this.effectMoney.getComponent(cc.Label).string = '';
            this.playAnimMainChar("HIT", ()=>{
                this.buttonPick.interactable = false;
                // FakeBonus
                //cc.BonusGameController.getInstance().onPlayBonusFinishResponse(10000000);
            })
        }
    },


    playAnimMainChar(state = "IDLE", callback){
        switch (state) {
            case 'START' :{
                let animMainChar = this.mainChar.getComponent(cc.Animation).play('cbBonusShow');
                this.effectGround.getComponent(cc.Animation).play('cbBonusEffectGround'); 
                animMainChar.off('finished');
                animMainChar.on('finished', () => {
                    callback();
                });
                break;
            }
            case 'IDLE' :{
                this.mainChar.getComponent(cc.Animation).play('cbBonusIdle');
                break;
            }
            case 'HIT' :{
                let animState =  this.mainChar.getComponent(cc.Animation).play('cbBonusHit');
                animState.off('finished');
                animState.on('finished', () => {
                    callback();
                });
                break;
            }
            case 'SHIELD' :{
                let animState = this.mainChar.getComponent(cc.Animation).play('cbBonusShield');
                this.effectBlood.getComponent(cc.Animation).play('cbEffectBlood');   
                this.effectMoney.getComponent(cc.Animation).play('cbBonusEffectMoney');  
                animState.off('finished');
                animState.on('finished', () => {
                    callback();
                }); 
                break;
            }
            case 'END' :{
                let animState = this.mainChar.getComponent(cc.Animation).play('cbBonusEnd');
                this.effectGround.getComponent(cc.Animation).play('cbBonusEffectGroundEnd');
                animState.off('finished');
                animState.on('finished', () => {
                    callback();
                });
                break;
            }
        }
    },



    updateTotalWin(totalWin){
        this.lbiWin.tweenValueto(totalWin);
    },

    endModePick(){  
        this.playAnimMainChar("END", ()=>{
            cc.BonusGameController.getInstance().changeView(cc.BonusGameState.MULTI);
        });    
    },
    reset(){
        this.node.active = false;
       
    }
   
});
