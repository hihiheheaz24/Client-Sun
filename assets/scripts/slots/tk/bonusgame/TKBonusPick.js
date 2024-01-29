let slotsConfig = require('SlotsConfig');
cc.Class({
    extends: cc.Component,

    properties: {
        txtPickRemain: cc.Label,
        txtMulti: cc.Label,
        nodeMulti: cc.Node,
        nodeResult: cc.Node,
        listButtonPick: [cc.Node],
        lbTime: cc.Label,
    },

    onLoad () {
        this.node.play = this.play.bind(this);
        this.node.reset = this.reset.bind(this);  
        this.node.interactableButtonPick = this.interactableButtonPick.bind(this);  
        this.node.updatePickRemain = this.updatePickRemain.bind(this);  
        this.node.updateMultiValue = this.updateMultiValue.bind(this);  
        this.node.showResult = this.showResult.bind(this);  
        this.node.showMulti = this.showMulti.bind(this);  
        this.node.updateMulti = this.updateMulti.bind(this);  
        this.node.getMulti = this.getMulti.bind(this); 
        this.node.stopTimer = this.stopTimer.bind(this); 
         
    },

    resetTimer () {
        this.timer = 0;
    },

    startTimer () {
        this.isTimer = true;
    },

    stopTimer () {
        this.isTimer = false;
        this.lbTime.string = '';
    },

    update: function (dt) {
        if (this.isTimer) {
            this.timer += dt;
            this.lbTime.string = 'Hệ thống sẽ tự chơi sau ' + Math.round(slotsConfig.TIME_WAIT_AUTO_FINISH_BONUS_GAME - this.timer) + ' giây';
            if (this.timer >= slotsConfig.TIME_WAIT_AUTO_FINISH_BONUS_GAME) {
                this.interactableButtonPick(false);
                cc.RoomController.getInstance().sendRequestOnHub(cc.MethodHubName.PLAY_BONUS, 20, 1);
                this.stopTimer();
            }
        }
    },

    showMulti(data, callback){
        this.nodeMulti.play(data, callback)
    },
    

    showResult(balance){
        this.nodeMulti.reset();
        this.nodeResult.play(balance)
    },

    updatePickRemain(value){
        this.txtPickRemain.string = value;
    },

    updateMultiValue(value){
        this.txtMulti.string = value;
    },

    init(){
        this.listButtonPick.forEach((node,index)=>{
            node.init(index)
        });
        this.nodeMulti.reset();
        this.nodeResult.reset();
        this.timer = 0;
        this.isTimer = false;
    },

    interactableButtonPick(interactable){
        this.listButtonPick.forEach(node=>{
            node.interactableButton(interactable)
        });
    },
    
    play(){
        this.init();
        this.node.active = true;
        this.startTimer();
        let bonusResponse = cc.BonusGameController.getInstance().getData();
        let currentStep = bonusResponse.CurrentStep;
        let pickRemain = bonusResponse.TotalStep - currentStep
        //cc.BonusGameController.getInstance().updatePickRemaining(pickRemain);
        this.updatePickRemain(pickRemain)
        this._key = 1;
        this._multiplierBase = bonusResponse.Multiplier;
        this._multiplier = bonusResponse.Multiplier;

        //Da pick 1 lan roi moi can setup
        if (currentStep >= 1) {
            let position = bonusResponse.Position;
            let bonusData = bonusResponse.BonusData;
            //Kiem tra da chon o vi tri nao
            let posStr = position.substring(0, position.length - 1); //cat dau , o cuoi
            let pickPos = cc.Tool.getInstance().convertStringArrayToIntArray(posStr);
            pickPos.forEach((pos, indexData) =>{
                let index = pos - 1;
                switch (bonusData[indexData].PrizeID) {
                    case cc.BonusPrizeId.P_KEY:  //210
                       
                        // self.spriteSprites[index].spriteFrame = self.sfPrizes[0];
                        //them he so nhan (confirm lai)
                        this._key += 1;
                        this._multiplier = this._multiplierBase * this._key;
                        this.listButtonPick[index].updateUI(0, bonusData[indexData].PrizeID);

                        break;
                    case cc.BonusPrizeId.P_X4: //220
                        //set tien
                        this.listButtonPick[index].updateUI(bonusData[indexData].PrizeValue, bonusData[indexData].PrizeID);
                        break;
                    default: // Diễn multi
                        //set tien
                        this.listButtonPick[index].updateUI(bonusData[indexData].PrizeValue, bonusData[indexData].PrizeID);
                }
            })
        }
        this.updateMultiValue(this._multiplier)
    },


    updateMulti(){
        this._key += 1;
        this._multiplier = this._multiplierBase * this._key;
        this.updateMultiValue(this._multiplier)
    },

    getMulti(){
        return this._multiplier;
    },



   
    reset(){
        this.node.active = false;
    }
   
});
