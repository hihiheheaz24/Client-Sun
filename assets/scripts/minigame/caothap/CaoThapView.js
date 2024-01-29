/**
 * Created by Nofear on 6/7/2017.
 */
var CaoThapConfig = require('CaoThapConfig');
var netConfig = require('NetConfig');

(function () {
    cc.CaoThapView = cc.Class({
    "extends": cc.Component,
    properties: {
        nodeScale: cc.Node,
        jackpotLabel: cc.LabelIncrement,
        animNewTurn: cc.Animation,
        currentCardSprite:cc.Sprite,
        cardImg:[cc.SpriteFrame],
        predictHighLabel: cc.Label,
        predictLowLabel: cc.Label,
        currentRewardLabel: cc.Label,
        btnHigh: cc.Button,
        btnLow: cc.Button,
        btnNewTurn: cc.Button,
        startText:cc.Sprite,
        stateJackPotSprite:[cc.Node],
        btnRoom:[cc.Button],
        btnRoomLayout:cc.Node,
        notiLabel: cc.Label,
        timeLabel: cc.Label,
        labelWinAmount:cc.Label,
        labelSessionNumber:cc.Label
    },
    onLoad: function () {
        this.animation = this.node.getComponent(cc.Animation);

        //set zIndex
        this.node.zIndex = cc.Config.getInstance().getZINDEX();

        cc.CaoThapController.getInstance().setCaoThapView(this);

        var caoThapNegotiateCommand = new cc.CaoThapNegotiateCommand;
        caoThapNegotiateCommand.execute(this);

        this.lastTimeReconnect = (new Date()).getTime();

        this.roomId = 1;
        this.isScale = false;
        this.currentJPValue = 0;
    },

    onEnable: function () {
        // this.animation.play('openPopup');
    },

    onDestroy: function () {
        if (this.caothapHub)
            this.caothapHub.disconnect();
        this.unscheduleAllCallbacks();
        cc.PopupController.getInstance().hideBusy();
        if (cc.sys.isNative) {
            var bundle = cc.assetManager.getBundle('caothap');
            if(bundle)
            bundle.releaseAll();
        }
    },

    reconnect: function () {
        this.lastTimeReconnect = (new Date()).getTime();
        this.caothapHub.connect(this, cc.SubdomainName.caothapHub, this.connectionToken, true);
    },

    sendRequestOnHub: function (method, lines, roomId) {
        switch (method) {
            case cc.MethodHubName.ENTER_LOBBY:
                this.caothapHub.enterLobby();
                break;
        }
    },

    onCaoThapNegotiateResponse: function (response) {
        this.connectionToken = response.ConnectionToken;
        this.caothapHub = new cc.Hub;
        this.caothapHub.connect(this, cc.HubName.CaoThapHub, response.ConnectionToken);
    },
    
    onHubMessage: function (response) {
        if (response.R !== undefined) {
            let data = response.R;
            if (data.currentState!=null) {
                if(!data.currentState.CurrentCard)
                {
                    this.resetRoom();
                }
                else{
                    this.currentRewardLabel.string = data.currentState.CurrentReward?cc.Tool.getInstance().formatNumber(data.currentState.CurrentReward):'';
                    this.showJackpotState(data.currentState.CurrentJackpotState?data.currentState.CurrentJackpotState:0);
                    this.setInforListCardString(data.currentState.ListCardOnSession);
                    this.startTimer(data.currentState.Time);
                    this.disableBtnRoom();
                    this.predictHighLabel.string = data.currentState.PredictRewardHigh?cc.Tool.getInstance().formatNumber(data.currentState.PredictRewardHigh):'';
                    this.predictLowLabel.string = data.currentState.PredictRewardLow?cc.Tool.getInstance().formatNumber(data.currentState.PredictRewardLow):'';
                    this.startText.node.active = false;
                    this.currentCardSprite.spriteFrame = this.cardImg[data.currentState.CurrentCard?data.currentState.CurrentCard-1:52]
                    this.labelSessionNumber.string = data.currentState.SessionNumber?"#"+data.currentState.SessionNumber:'0';
                    if (data.currentState.CurrentCard<5) {
                        this.btnHigh.interactable = true;
                        this.btnLow.interactable = false;       
                    }
                    else if(data.currentState.CurrentCard>48)
                    {
                        this.btnHigh.interactable = false;
                        this.btnLow.interactable = true;   
                    }
                    else
                    {
                        this.btnHigh.interactable = true;
                        this.btnLow.interactable = true;   
                    }
                    this.btnHigh.node.opacity = this.btnHigh.interactable?255:130;     
                    this.btnLow.node.opacity = this.btnLow.interactable?255:130; 
                    if(data.currentState.LastCard)
                    {
                        this.animNewTurn.play('bgNewTurn').wrapMode = cc.WrapMode.Normal;
                    }  
                }
            }
            if (data.jackpotFund) {
                this.cacheJPData = data.jackpotFund;
                this.setJackpotInfo(this.cacheJPData);
            }
            
        } else if(response.M!=undefined&&response.M.length>0)
        {
            let data = response.M[0].A[0];
            if (data) {
                this.cacheJPData = data;
                this.setJackpotInfo(this.cacheJPData);
            }
        } else {
            //PING PONG
            if (response.I) {
                this.caothapHub.pingPongResponse(response.I);
            }
        }
    },
    switchRoom:function(event,ID)
    {
        if (!this.roomBtnEnable) {
            return;
        }
        this.roomId = parseInt(ID);
        this.setJackpotInfo(this.cacheJPData);
        for (let index = 0; index < this.btnRoom.length; index++) {
            this.btnRoom[index].interactable = true;
        }
        this.btnRoom[this.roomId-1].interactable = false;

        const valueMapping = [1000,10000,50000,100000,500000]

        this.currentRewardLabel.string = cc.Tool.getInstance().formatNumber(valueMapping[this.roomId-1]);
    },
    setJackpotInfo:function(data)
    {
        switch(this.roomId)
        {
            case 1: 
                this.jackpotLabel.tweenValue(this.currentJPValue,data.room1);
                this.currentJPValue = data.room1;
                break;
            case 2: 
                this.jackpotLabel.tweenValue(this.currentJPValue,data.room2);
                this.currentJPValue = data.room2;
            break;
            case 3: 
                this.jackpotLabel.tweenValue(this.currentJPValue,data.room3);
                this.currentJPValue = data.room3;
            break;
            case 4: 
                this.jackpotLabel.tweenValue(this.currentJPValue,data.room4);
                this.currentJPValue = data.room4;
            break;
            case 5: 
                this.jackpotLabel.tweenValue(this.currentJPValue,data.room5);
                this.currentJPValue = data.room5;
            break;
        }
    },
    showJackpotState:function(state)
    {
        for (let index = 0; index < 3; index++) {
            this.stateJackPotSprite[index].active = false;
        }
        for (let index = 0; index < state; index++) {
            this.stateJackPotSprite[index].active = true;
        }
    },
    startGame:function()
    {
        this.isStartGame = true;
        var caothapStartGameCmd = new cc.CaoThapStartGameCommand;
        caothapStartGameCmd.execute(this,this.roomId);
    },
    continueBet:function(event,option)
    {
        if (!this.isStartGame) {
            this.animNewTurn.play('bgNewTurn').wrapMode = cc.WrapMode.Reverse;
        }
        let betOption = parseInt(option);
        var caothapContinueBetCmd = new cc.CaoThapContinueBetCommand;
        caothapContinueBetCmd.execute(this,betOption);
    },
    stopGame:function()
    {
        this.animNewTurn.play('bgNewTurn').wrapMode = cc.WrapMode.Reverse;
        var caothapStopGameCmd = new cc.CaoThapStopGameCommand;
        caothapStopGameCmd.execute(this);
    },
    // {
    //     "LastCard": null,
    //     "CurrentCard": 14,
    //     "PredictRewardHigh": 1306,
    //     "PredictRewardLow": 3920,
    //     "Result": null,
    //     "CurrentReward": 0,
    //     "CurrentJackpotState": null,
    //     "Time": 120
    // }
    onCaoThapStartGameResponse:function(data)
    {
        if (data.Code!=1&&data.Message) {
            console.log(data.Message);
        }else{
            if (this.autoResetRoomCB) {
                this.unschedule(this.autoResetRoomCB);
                this.autoResetRoomCB = null;
            }
            let response = data.Data;
            this.startText.node.active = false;
            this.playAnimCard(response,1);
            this.setInforListCardString(response.ListCardOnSession);
            this.showJackpotState(response.CurrentJackpotState)
            this.startTimer(response.Time)
            this.labelSessionNumber.string = response.SessionNumber?"#"+response.SessionNumber:'#0';
        }
        

    },
    disableBtnRoom:function(enable)
    {
        this.roomBtnEnable = enable;
        this.btnRoomLayout.opacity = enable?255:100;
    },
    playAnimCard:function(response,result)
    {
        this.disableBtnRoom(false);
        let cardIndex = response.CurrentCard;
        this.btnHigh.interactable = false;
        this.btnLow.interactable = false;
        this.btnHigh.node.opacity = this.btnHigh.interactable?255:130;     
        this.btnLow.node.opacity = this.btnLow.interactable?255:130;           
        for (let index = 0; index < 20; index++) {
            cc.director.getScheduler().schedule(function () {
                let randomIndex = Math.floor(Math.random() * (52 - 1) + 1);
                if (index==19) {
                    this.currentCardSprite.spriteFrame = this.cardImg[cardIndex-1];
                    this.predictHighLabel.string = response.PredictRewardHigh?cc.Tool.getInstance().formatNumber(response.PredictRewardHigh):'';
                    this.predictLowLabel.string = response.PredictRewardLow?cc.Tool.getInstance().formatNumber(response.PredictRewardLow):'';
                    this.currentRewardLabel.string = response.CurrentReward?cc.Tool.getInstance().formatNumber(response.CurrentReward):'0';
                    this.showJackpotState(response.CurrentJackpotState);        
                    if (result==1) {
                        if (cardIndex<5) {
                            this.btnHigh.interactable = true;
                            this.btnLow.interactable = false;  
                               
                        }
                        else if(cardIndex>48)
                        {
                            this.btnHigh.interactable = false;
                            this.btnLow.interactable = true;   
                        }
                        else
                        {
                            this.btnHigh.interactable = true;
                            this.btnLow.interactable = true;   
                        }
                        this.btnHigh.node.opacity = this.btnHigh.interactable?255:130;     
                        this.btnLow.node.opacity = this.btnLow.interactable?255:130; 
                        if(response.LastCard)
                            this.animNewTurn.play('bgNewTurn').wrapMode = cc.WrapMode.Normal;
                            this.setInforListCardString(response.ListCardOnSession?response.ListCardOnSession:[]);
                    }
                    else{
                        this.notiLabel.string = 'BẠN ĐÃ THUA';
                    }
                }else 
                this.currentCardSprite.spriteFrame = this.cardImg[randomIndex-1];
            }.bind(this), this, 0, 1, 0.05*index, false);
        }
    },
    onCaoThapContinueBetResponse:function(data)
    {
        if (data.Code!=1&&data.Message) {
            console.log(data.Message);
        }else{
            let response = data.Data;
            this.playAnimCard(response,response.Result);
            this.startTimer(response.Time)
            this.isStartGame = false;
            

            if(response.Result==0) {
                this.autoResetRoomCB = () => {
                    this.resetRoom();
                    this.autoResetRoomCB = null;
                };
                this.scheduleOnce(this.autoResetRoomCB, 3);
                
            }
        }
    },
    onCaoThapStopGameResponse:function(data)
    {
        if (data.Code!=1&&data.Message) {
            console.log(data.Message);
        }else{
            console.log(data.Data.CurrentReward);
            this.showWinAmount(data.Data.CurrentReward);
            if (this.autoResetRoomCB) {
                this.unschedule(this.autoResetRoomCB);
                this.autoResetRoomCB = null;
            }
            this.unscheduleAllCallbacks();
            this.resetRoom();
        }
    },
    showWinAmount:function(amount)
    {
        this.labelWinAmount.string = "+"+cc.Tool.getInstance().formatNumber(amount);
        this.labelWinAmount.getComponent(cc.Animation).play('caothapWinAmountEffect');
        // this.labelWinAmount.node.active = true;
        // setTimeout(() => {
        //     this.labelWinAmount.node.active = false;
        // }, 3000);
    },
    setInforListCardString:function(data)
    {
        let newString = ''
        for (let index = 0; index < data.length; index++) {
            newString+=this.convertCardIDToString(data[index]);
        }
        this.notiLabel.string = newString;
    },
    convertCardIDToString:function(cardID)
    {
        let finalString = '';
        let begin = Math.floor((cardID-1)/4);
        if (begin==9) {
            finalString+="J";
        }
        if (begin==10) {
            finalString+="Q";
        }
        if (begin==11) {
            finalString+="K";
        }
        if (begin==12) {
            finalString+="A";
        }
        if(begin<9)
            finalString+=(begin+2);
        let tail = cardID%4;
        switch (tail) {
            case 0:
                finalString+="♠";

                break;
            case 1:
                finalString+="♣";

                break;
            case 2:
                finalString+="♦";
                break;
            case 3:
                finalString+="♥";
                break;
            default:
                break;
        }
        return finalString;
    },
    roomIDToBetAmount:function(roomID)
    {
        let betAmount = 0;
        switch (roomID) {
            case 1:
                betAmount =  1000;
                break;
            case 2:
                betAmount =  10000;
                break;
            case 3:
                betAmount =  50000;
                break;
            case 4:
                betAmount =  100000;
                break;
            case 5:
                betAmount =  500000;
                break;
        }
        return betAmount;
    },
    startTimer:function(remaining)
    {
        if (this.interval) {
            clearInterval(this.interval);
        }

        var self = this;
        this.timer = remaining;
        this.isCounting = true;

        ////update timer UI
        this.timeLabel.string = cc.Tool.getInstance().convertSecondToTime2(remaining);
        this.interval = setInterval(function(){
            if (self.isCounting) {
                self.timer -= 1;
                self.timeLabel.string = cc.Tool.getInstance().convertSecondToTime2(self.timer);
                if(self.timer <=1){
                    self.timeLabel.string = cc.Tool.getInstance().convertSecondToTime2(0);
                    self.resetRoom();
                }
            }
        }, 1000);
    },
    stopTimer: function () {
        this.isCounting = false;
        if (this.interval !== null) {
            clearInterval(this.interval);
        }
    },
    resetRoom:function()
    {
        this.currentCardSprite.spriteFrame = this.cardImg[52];
        this.showJackpotState(0);
        this.disableBtnRoom(true);
        this.notiLabel.string = 'Bấm CHƠI để bắt đầu';
        this.startText.node.active = true;
        this.btnHigh.interactable = false;
        this.btnLow.interactable = false; 
        this.btnHigh.node.opacity = this.btnHigh.interactable?255:130;     
        this.btnLow.node.opacity = this.btnLow.interactable?255:130; 
        this.predictHighLabel.string = '';
        this.predictLowLabel.string = '';
        this.currentRewardLabel.string = cc.Tool.getInstance().formatNumber(this.roomIDToBetAmount(this.roomId));
        this.stopTimer();
        this.timeLabel.string = '02:00';
    },
    onHubOpen: function () {
        //vao lobby
        this.sendRequestOnHub(cc.MethodHubName.ENTER_LOBBY);

        var self = this;
        cc.director.getScheduler().schedule(function () {
            //goi playnow
            // self.sendRequestOnHub(cc.MethodHubName.PLAY_NOW);
        }, this, 1, 0, 0.1, false);

        cc.PopupController.getInstance().hideBusy();
    },

    onHubClose: function () {
        cc.CaoThapController.getInstance().reset();

        if ((new Date()).getTime() - this.lastTimeReconnect >= netConfig.RECONNECT_TIME * 1000) {
            this.reconnect();
        } else {
            cc.director.getScheduler().schedule(this.reconnect, this, netConfig.RECONNECT_TIME, 0, 0, false);
        }
    },

    onHubError: function () {

    },

    reset(){
        this.stopTimer();
    },

    closeClicked: function () {
        cc.CaoThapController.getInstance().reset();

        // this.animation.play('closePopup');
        cc.LobbyController.getInstance().destroyDynamicView(cc.GameId.CAO_THAP);
    },

    onScale: function() {
        if (!this.isScale) {
            this.isScale = true;
            this.nodeScale.scaleX = 1.0;
            this.nodeScale.scaleY = 1.0;
        } else {
            this.isScale = false;
            this.nodeScale.scaleX = 0.8;
            this.nodeScale.scaleY = 0.8;
        }
    }
});
}).call(this);
