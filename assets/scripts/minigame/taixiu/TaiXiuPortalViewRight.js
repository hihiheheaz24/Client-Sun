var taiXiuConfig = require('TaiXiuConfig');
var netConfig = require('NetConfig');
var timeAll=60;
(function () {
    cc.TaiXiuPortalViewRight = cc.Class({
        "extends": cc.Component,
        properties: {
            lbiTotalBetTai: cc.Label, //tong tien bet Tai
            lbiTotalBetXiu: cc.Label, //tong tien bet Xiu
            centerGroup:cc.Node,
            lbCountdown: cc.Label,
            countdownBg: cc.Node,
            lbCountdown2: cc.Label,
            historyGroup: cc.Node,
            resultGroup: cc.Node,
            lbResult: cc.Label,
            resultTai: cc.Node,
            resultXiu: cc.Node,
            spTitle:cc.Node,
            //
            taiWinEffect: cc.Node,
			xiuWinEffect: cc.Node,
        },
        _onHideGameBinding:function()
        {
            this.isHiding = true;
        },
        _onShowGameBinding:function()
        {
            this.isHiding = false; 
            cc.TaiXiuControllerRight.getInstance().reset();
            this.resumeGame(this.getSessionData())
           
        },

        onLoad: function () {
            cc.game.on(cc.game.EVENT_HIDE, this._onHideGameBinding.bind(this));
            cc.game.on(cc.game.EVENT_SHOW, this._onShowGameBinding.bind(this));
            timeAll = 60;
            this.interval = null;
            this.sessionData = {}

            cc.TaiXiuControllerRight.getInstance().setTaiXiuPortalView(this);
            cc.TaiXiuController.getInstance().setTaiXiuRightView(this);
            this.lastTimeReconnect = (new Date()).getTime();

            this.isAuthorized = false;
            this.subName = cc.SubdomainName.TAI_XIU2;
            this.hubName = cc.HubName.LuckyDice2Hub;
            this.isHubOpen = false;
            this.connectHubTx();
            // this.luckyDiceHub = cc.TaiXiuController.getInstance().getHub(2);
            // this.onHubOpen();
        },

        changeConfig:function(subName, hubName){
            this.subName = subName;
            this.hubName = hubName;
        },

        onDestroy: function () {
            timeAll = 60;
            if (this.interval !== null) {
                clearInterval(this.interval);
            }
            this.disconnectAndLogout();
            this.unscheduleAllCallbacks();
            cc.TaiXiuControllerRight.getInstance().setTaiXiuPortalView(null);
        },

        reset: function () {
            timeAll = 60;
            this.isTimer = false;
            this.timer = 0;
            this.currentState = 999;
            if (this.interval !== null) {
                clearInterval(this.interval);
            }
        },
        
        startTimer: function (remaining) {
            //cc.warn("startTimerRight", remaining)
            if(remaining >= timeAll){
                return;
            }else timeAll = remaining;
            if (this.interval !== null) {
                clearInterval(this.interval);
            }

            var self = this;
            this.timer = remaining;
            this.isTimer = true;

            ////update timer UI
            this.updateTimer(remaining);

            this.interval = setInterval(function(){
                if (self.isTimer) {
                    self.timer -= 1;
                    timeAll = self.timer;
                    self.updateTimer(Math.round(self.timer));
                    if(self.timer <=1){
                        timeAll = 60;
                    }
                }
            }, 1000);
        },

        stopTimer: function () {
            this.isTimer = false;
            if (this.interval !== null) {
                clearInterval(this.interval);
            }
            timeAll = 60;
        },

        updateInfo: function (sessionInfo,resume) {
          
            //Dang ko mo tai xiu -> moi can chay fx TX win o Lobby
             //set thong tin
             this.lbiTotalBetTai.string = cc.Tool.getInstance().formatWalletMoney(sessionInfo.TotalBetTai);
             this.lbiTotalBetXiu.string = cc.Tool.getInstance().formatWalletMoney(sessionInfo.TotalBetXiu);

             if (sessionInfo.CurrentState !== this.currentState
                 && sessionInfo.CurrentState === cc.TaiXiuState.RESULT) {
                    let totalResult = sessionInfo.Result.Dice1 + sessionInfo.Result.Dice2 + sessionInfo.Result.Dice3;
                 if (totalResult > 10) {
                    this.showWinResult(true,totalResult);
                 } else {
                    this.showWinResult(false,totalResult);
                 }
                this.lbiTotalBetTai.string = cc.Tool.getInstance().formatWalletMoney(sessionInfo.TotalBetTai);
                this.lbiTotalBetXiu.string = cc.Tool.getInstance().formatWalletMoney(sessionInfo.TotalBetXiu);

             } else if (sessionInfo.CurrentState !== this.currentState) {
                this.taiWinEffect.getComponent(cc.Animation).stop('wineffect');
				this.xiuWinEffect.getComponent(cc.Animation).stop('wineffect');
                this.lbCountdown.node.active = true;
                this.lbResult.node.active = false;
                this.resultTai.active = false;
                this.taiWinEffect.active = false;
                this.resultXiu.active = false;
                this.xiuWinEffect.active = false;
                this.countdownBg.active = false;
            }

            //luu lai state hien tai
            this.currentState = sessionInfo.CurrentState;

           

            if(resume){
                if(sessionInfo.CurrentState === cc.TaiXiuState.RESULT || sessionInfo.CurrentState === cc.TaiXiuState.END_BETTING){
                    this.lbiTotalBetTai.string = cc.Tool.getInstance().formatWalletMoney(sessionInfo.TotalBetTai);
                    this.lbiTotalBetXiu.string = cc.Tool.getInstance().formatWalletMoney(sessionInfo.TotalBetXiu);
                }
            }
           
        },
        showWinResult: function(isTai,totalDices){
            this.lbCountdown.node.active = false;
            this.lbResult.node.active = true;
            this.lbResult.string = `${totalDices}`;
            this.resultTai.active = false;
            this.taiWinEffect.active = false;
            this.resultXiu.active = false;
            this.xiuWinEffect.active = false;
            if(isTai){
                this.resultTai.active = true;
                this.taiWinEffect.active = true;
                this.taiWinEffect.getComponent(cc.Animation).play('wineffect');
            } else {
                this.resultXiu.active = true;
                this.xiuWinEffect.active = true;
                this.xiuWinEffect.getComponent(cc.Animation).play('wineffect');
            }
            this.countdownBg.active = true;
        },

        updateTimer: function (time) {
            if (time < 1) return;
            this.lbCountdown.string = `${time}`;
            this.lbCountdown2.string = `${time}`;
            // cc.TaiXiuControllerRight.getInstance().updateTimerInfoView(time);
            // cc.MINIController.getInstance().updateTimerTx(time, this.currentState);
            // //console.log('updateTimer: ' +time);
        },

        disconnectAndLogout: function () {
            if (this.luckyDiceHub) {
                this.luckyDiceHub.disconnect();
            }
            this.lastTimeReconnect = (new Date()).getTime();
            this.isAuthorized = false;
            timeAll = 60;
        },

        connectHubTxAuthorize: function () {
            if (!this.isAuthorized) {
                if (this.luckyDiceHub) {
                    this.luckyDiceHub.disconnect();
                }

                this.lastTimeReconnect = (new Date()).getTime();
                this.isAuthorized = true;
                //cc.PopupController.getInstance().showBusy();
                var luckyDiceNegotiateCommand = new cc.LuckyDiceNegotiateCommand;
                luckyDiceNegotiateCommand.execute(this,this.subName);

                return false;
            } else {
                return true;
            }
        },

        connectHubTx: function () {
            this.isAuthorized = false;
            let luckyDiceNegotiateCommand = new cc.LuckyDiceNegotiateCommand;
            luckyDiceNegotiateCommand.execute(this,this.subName);
        },

        reconnect: function () {
            // console.log('luckyDiceHub reconnect');
            this.lastTimeReconnect = (new Date()).getTime();
            this.luckyDiceHub.connect(this, this.hubName, this.connectionToken, true);
            timeAll = 60;
        },

        sendRequestOnHub: function (method, data1, data2) {
            switch (method) {
                case cc.MethodHubName.ENTER_LOBBY:
                    this.luckyDiceHub.enterLobby();
                    break;
                case cc.MethodHubName.BET:
                    this.luckyDiceHub.bet(data1, data2);
                    break;
                case cc.MethodHubName.CORD_INFO:
                    this.luckyDiceHub.cordInfo();
                    break;
            }
        },

        onLuckyDiceNegotiateResponse: function (response) {
            this.connectionToken = response.ConnectionToken;
            if (!this.luckyDiceHub) {
                this.luckyDiceHub = new cc.Hub;
                this.luckyDiceHub.connect(this, this.hubName, response.ConnectionToken);
            }
        },
        onHubMessage: function (response) {
            cc.TaiXiuController.getInstance().onMessage(2,response);
         },

         
        resumeGame(data){
            //cc.warn("RESUME RIGHT", data)
            this.sessionData = data;
            this.updateInfo(data,true);
            if(data.buildTick){
                const timeLost = (Date.now() - data.buildTick)/1000;
                const timeRemain = data.Ellapsed - Math.round(timeLost);
                this.startTimer(timeRemain);
            } 
            if(data.GameHistory){
                cc.TaiXiuControllerRight.getInstance().updateSessionHistory(data.GameHistory);
            }
            if(data.BetSuccess){
                cc.TaiXiuControllerRight.getInstance().updateBetInfoView(data.BetSuccess);
            } 
        },
        getSessionData(){
            return this.sessionData
        },

        updateSessionData(type, data){
            // BETTING: 0,
            // RESULT: 1,
            // PREPARE_NEW_SESSION: 2,
            // END_BETTING: 3,
            if(type == "SESSION_INFO"){
                if(this.sessionData.SessionID != data.SessionID){
                    //cc.warn("LEFT RESET SESSION DATA")
                     const GameHistory = this.sessionData.GameHistory;
                    this.sessionData = {};
                    this.sessionData.GameHistory = GameHistory;
                }
                switch (data.CurrentState) {
                    case cc.TaiXiuState.BETTING:{
                        this.sessionData.SessionID = data.SessionID
                        this.sessionData.CurrentState = data.CurrentState;
                        this.sessionData.Ellapsed =  data.Ellapsed;
                        this.sessionData.Result = data.Result;
                        this.sessionData.TotalBetTai = data.TotalBetTai;
                        this.sessionData.TotalBetXiu = data.TotalBetXiu;
                        this.sessionData.TotalTai = data.TotalTai;
                        this.sessionData.TotalXiu = data.TotalXiu;
                        this.sessionData.buildTick = Date.now();
                        break;
                    }
                  
                    case cc.TaiXiuState.RESULT: {
                        this.sessionData.SessionID = data.SessionID
                        this.sessionData.CurrentState = data.CurrentState;
                        this.sessionData.Ellapsed =  data.Ellapsed;
                        this.sessionData.Result = data.Result;
                        this.sessionData.TotalBetTai = data.TotalBetTai;
                        this.sessionData.TotalBetXiu = data.TotalBetXiu;
                        this.sessionData.TotalTai = data.TotalTai;
                        this.sessionData.TotalXiu = data.TotalXiu;
                        this.sessionData.buildTick = Date.now();
                        break;
                    }
                  
    
                }
            }
            if(type == "GAME_HISTORY"){
                this.sessionData.GameHistory = data;
                //cc.warn("GAME_HISTORY", this.sessionData)
            }

            if(type == "BET_SUCCESS"){
               
                this.sessionData.BetSuccess = data;
                //cc.warn("BET_SUCCESS", this.sessionData)
            }
        },
        onMessage: function (response) {
            if (response.M !== undefined && response.M.length > 0) {
                let res = response.M;
                res.map(m => {
                    switch (m.M) {
                        //vao Phong
                        case cc.MethodHubOnName.SESSION_INFO:
                            var data = m.A[0];
                            this.updateSessionData("SESSION_INFO", data);
                            if(!this.isTimer || (data.CurrentState !== this.currentState)){
                                cc.warn("Start timer Right")
                                this.stopTimer();
                                this.resumeGame(this.getSessionData())
                            }
                            this.updateInfo(data);
                            break;
                        case cc.MethodHubOnName.NOTIFY_CHANGE_PHRASE:
                            var data = m.A[0];
                            this.updateInfo(data);
                            this.updateSessionData("SESSION_INFO", data);
                            this.startTimer(data.Ellapsed)
                            break;
                        //vao Phong
                        case cc.MethodHubOnName.GAME_HISTORY:
                            cc.TaiXiuControllerRight.getInstance().updateSessionHistory(m.A[0]);
                            this.updateSessionData("GAME_HISTORY", m.A[0]);
                            //login roi -> moi goi
                            if (cc.LoginController.getInstance().getLoginState() && cc.TaiXiuControllerRight.getInstance().getIsOpen()) {
                                // this.sendRequestOnHub(cc.MethodHubName.CORD_INFO);
                            }
                            break;
                        //vao Phong
                        case cc.MethodHubOnName.BET_OF_ACCOUNT:
                            cc.director.getScheduler().schedule(function () {
                                cc.TaiXiuControllerRight.getInstance().updateBetInfoView(m.A[0]);
                            }, this, 1, 0, 0.2, false);
                            break;

                        //su kien trieu hoi PH
                        case cc.MethodHubOnName.CORD_ACCOUNT_INFO:
                            var data = m.A[0];
                            if (data.IsEventDragon) {
                                cc.TaiXiuControllerRight.getInstance().activeEventPH(true);
                                cc.TaiXiuControllerRight.getInstance().setUserCord(data.CordWin, data.CordLost);
                            } else {
                                cc.TaiXiuControllerRight.getInstance().activeEventPH(false);
                            }
                            break;
                        //su kien trieu hoi PH
                        //bet thanh cong
                        case cc.MethodHubOnName.BET_SUCCESS:
                            var data = m.A[0];
                            cc.TaiXiuControllerRight.getInstance().updateBetInfoView(data);
                            //update lai balance
                            cc.BalanceController.getInstance().updateRealBalance(m.A[1]);
                            cc.BalanceController.getInstance().updateBalance(m.A[1]);

                            cc.DDNA.getInstance().betSummary(cc.DDNAGame.TAI_XIU, data.BetValue, cc.TaiXiuControllerRight.getInstance().getSID());
                            break;
                        case cc.MethodHubOnName.WIN_RESULT:
                            var data = m.A[0];
                            cc.warn("WIN_RESULT", data)
                            var waitTime = taiXiuConfig.TIME_WAIT_DICE_ANIMATION;
                            //dang bat che do Nan
                            if (cc.TaiXiuControllerRight.getInstance().getIsNan()) {
                                //thoi gian doi show ket qua win lau hon
                                waitTime = taiXiuConfig.TIME_WAIT_SHOW_WIN_RESULT_NAN;
                            }

                            cc.director.getScheduler().schedule(function () {
                                //play fx win
                                cc.TaiXiuControllerRight.getInstance().playEffectWin(data.Award);
                                //update lai balance
                                cc.BalanceController.getInstance().updateRealBalance(data.Balance);
                                cc.BalanceController.getInstance().updateBalance(data.Balance);
                            }, this, 0, 0, waitTime, false);

                            break;
                        case cc.MethodHubOnName.MESSAGE:
                            var data = m.A[0];
                            if (data.Description) {
                                cc.PopupController.getInstance().showMessage(data.Description);
                            } else if (data.Message) {
                                cc.PopupController.getInstance().showMessage(data.Message);
                            } else {
                                cc.PopupController.getInstance().showMessage(data);
                            }
                            break;
                        case cc.MethodHubOnName.OTHER_DEVICE:
                            // m.A[0] = ma loi , m.A[1] = message
                            //vao phong choi tren thiet bi khac
                            cc.PopupController.getInstance().showPopupOtherDevice( m.A[1], cc.GameId.TAI_XIU);
                            break;
                    }
                })
            }  else {
                //PING PONG
                if (response.I && this.luckyDiceHub) {
                    this.luckyDiceHub.pingPongResponse(response.I);
                }
            }
        },

        onHubOpen: function () {
            cc.TaiXiuControllerRight.getInstance().setIsOpen(true);
            cc.PopupController.getInstance().hideBusy();
                this.sendRequestOnHub(cc.MethodHubName.ENTER_LOBBY);
            this.isHubOpen = true;
        },

        onHubClose: function () {
            if(this.isHubOpen) {
                cc.TaiXiuControllerRight.getInstance().reset();
                //reconnect
                console.log((new Date()).getTime() - this.lastTimeReconnect);
                if ((new Date()).getTime() - this.lastTimeReconnect >= netConfig.RECONNECT_TIME * 1000) {
                    this.reconnect();
                } else {
                    cc.director.getScheduler().schedule(this.reconnect, this, netConfig.RECONNECT_TIME, 0, 0, false);
                }
            }
            this.isHubOpen = false;
        },

        onHubError: function () {

        },
    });
}).call(this);
