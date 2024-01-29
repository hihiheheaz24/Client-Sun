/**
 * Created by Nofear on 6/7/2017.
 */
var taiXiuConfig = require('TaiXiuConfig');
var netConfig = require('NetConfig');
var timeAll=60;
(function () {
    cc.TaiXiuView = cc.Class({
        "extends": cc.Component,
        properties: {
            //leftTable: cc.Node,
            //lbLeftTable:cc.Sprite,
            //rightTable:cc.Node,
            //lbRightTable:cc.Sprite,
            lbCenterTable:cc.Sprite,
            //LeftTableSprite:cc.Sprite,
            //RightTableSprite:cc.Sprite,
            //sfTableName:[cc.SpriteFrame],
            //sfTable:[cc.SpriteFrame],
            light:cc.Node,
            lightBtn: cc.Sprite,
            lightOnSprite:cc.SpriteFrame,
            lightOffSprite:cc.SpriteFrame

        },

        _onHideGameBinding:function()
        {
            //cc.warn("_onHideGameBinding");
            this.isHiding = true;
          
        },
        _onShowGameBinding:function()
        {
            //cc.warn("_onShowGameBinding");
            this.isHiding = false;
            cc.TaiXiuController.getInstance().reset();
            this.resumeGame(this.getSessionData())
           
        },

        onLoad: function () {
            cc.game.on(cc.game.EVENT_HIDE, this._onHideGameBinding.bind(this));
            cc.game.on(cc.game.EVENT_SHOW, this._onShowGameBinding.bind(this));
            this.sessionData = {}
            this.node.setScale(0.8,0.8)
            this.animation = this.node.getComponent(cc.Animation);

            //set zIndex
            this.node.zIndex = cc.Config.getInstance().getZINDEX();

            cc.TaiXiuController.getInstance().setTaiXiuView(this);
            //--connect hub
            timeAll = 60;
            this.interval = null;
            cc.TaiXiuController.getInstance().setTaiXiuPortalView(this);
            this.lastTimeReconnect = (new Date()).getTime();
            this.isAuthorized = false;
            //--
            this.subName = cc.SubdomainName.TAI_XIU;
            this.hubName = cc.HubName.LuckyDiceHub;
            // let leftTable = this.leftTable.getComponent(cc.TaiXiuPortalViewLeft);
            // let rightTable = this.rightTable.getComponent(cc.TaiXiuPortalViewRight);
            let currentTableIndex = cc.LocalStorage.getInstance().getData("mainTXTable","0");
            if(currentTableIndex == null){
                cc.LocalStorage.getInstance().setData("mainTXTable", 0);
                currentTableIndex = "0"
            }
            switch (currentTableIndex) {
                case "0":
                    this.iLeftTable = 1;
                    this.iRightTable= 2;
                    this.iCenterTable = 0;
                    cc.TaiXiuController.getInstance().setSubDomain(cc.SubdomainName.TAI_XIU);
                    break;
                case "1":
                        this.iLeftTable = 0;
                        this.iRightTable= 2;
                        this.iCenterTable = 1;
                        cc.TaiXiuController.getInstance().setSubDomain(cc.SubdomainName.TAI_XIU1);

                        break;
                case "2":
                    this.iLeftTable = 0;
                    this.iRightTable= 1;
                    this.iCenterTable = 2;
                    cc.TaiXiuController.getInstance().setSubDomain(cc.SubdomainName.TAI_XIU2);

                    break;
                default:
                    this.iLeftTable = 1;
                    this.iRightTable= 2;
                    this.iCenterTable = 0;
                    cc.TaiXiuController.getInstance().setSubDomain(cc.SubdomainName.TAI_XIU);


                    break;
            }
            
            this.isHubOpen = false;
            cc.TaiXiuController.getInstance().setTableIndex(this.iCenterTable,this.iLeftTable,this.iRightTable);
            //--update table name
            this.lbLeftTable.spriteFrame = this.sfTableName[this.iLeftTable];
            this.lbCenterTable.spriteFrame = this.sfTableName[this.iCenterTable];
            this.lbRightTable.spriteFrame = this.sfTableName[this.iRightTable];
            this.LeftTableSprite.spriteFrame = this.sfTable[this.iLeftTable];
            this.RightTableSprite.spriteFrame = this.sfTable[this.iRightTable];
            // leftTable.changeConfig(cc.SubdomainName.TAI_XIU1,cc.HubName.LuckyDice1Hub);
            // rightTable.changeConfig(cc.SubdomainName.TAI_XIU2,cc.HubName.LuckyDice2Hub);
            // leftTable.connectHubTx();  
            // rightTable.connectHubTx();
            cc.TaiXiuController.getInstance().disconnectAndLogout();
            this.connectHubTx();  
            // this.luckyDiceHub = cc.TaiXiuController.getInstance().getHub(0);
            // this.onHubOpen();
        },
        onEnable: function () {
            cc.TaiXiuController.getInstance().setIsOpen(true);
            var self = this;
            
            // this.animation.play('openPopup');        
        },

        onDestroy: function () {
            cc.TaiXiuController.getInstance().setTaiXiuView(null);

            if (cc.sys.isNative) {
                var bundle = cc.assetManager.getBundle('taixiu');
               if(bundle)
                bundle.releaseAll();
            }
            cc.PopupController.getInstance().hideBusy();
            //--
            timeAll = 60;
            if (this.interval !== null) {
                clearInterval(this.interval);
                this.interval = null;
            }
            this.unscheduleAllCallbacks();
            cc.TaiXiuController.getInstance().setTaiXiuPortalView(null);
        },

        resetPositionTX: function () {
            // console.log('this.node.y: ' + this.node.y);
            if (this.node.y < 40) {
                this.node.y = 50;
            }        
        },

        closeClicked: function () {
            // cc.TaiXiuController.getInstance().setIsOpen(false);
            // cc.TaiXiuController.getInstance().reset();
            // cc.TaiXiuControllerLeft.getInstance().setIsOpen(false);
            // cc.TaiXiuControllerLeft.getInstance().reset();
            // cc.TaiXiuControllerRight.getInstance().setIsOpen(false);
            // cc.TaiXiuControllerRight.getInstance().reset();
            // let leftTable = this.leftTable.getComponent(cc.TaiXiuPortalViewLeft);
            // let rightTable = this.rightTable.getComponent(cc.TaiXiuPortalViewRight);
            // leftTable.disconnectAndLogout();
            // rightTable.disconnectAndLogout();
            // this.disconnectAndLogout();
            cc.LobbyController.getInstance().destroyDynamicView(cc.GameId.TAI_XIU);

            // this.animation.play('closePopup');
            // var self = this;
            // var delay = 0.12;
            // cc.director.getScheduler().schedule(function () {
            //     self.animation.stop();
            // }, this, 1, 0, delay, false);
        },

        //--connect hub
        reset: function () {
            timeAll = 60;
            this.isTimer = false;
            this.timer = 0;
            this.currentState = 999;
            if (this.interval !== null) {
                clearInterval(this.interval);
                this.interval = null;
            }
        },
        
        startTimer: function (remaining) {
            //cc.warn("startTimer", remaining)
            if(remaining >= timeAll){
                return;
            }else timeAll = remaining;
            if (this.interval !== null) {
                clearInterval(this.interval);
                this.interval = null;
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
                this.interval = null;
            }
            timeAll = 60;
        },

        updateInfo: function (sessionInfo) {
            // if(sessionInfo.buildTick){
            //     const timeLost = (Date.now() - sessionInfo.buildTick)/1000;
            //     const timeRemain = sessionInfo.Ellapsed - Math.round(timeLost);
            //     this.startTimer(timeRemain);
            // } else {
            //     this.startTimer(sessionInfo.Ellapsed);
            // }
        },


        updateTimer: function (time) {
            if (time < 1) {
                return;
            }
            // this.lbTimer.string = cc.Tool.getInstance().convertSecondToTime2(time);
            cc.TaiXiuController.getInstance().updateTimerInfoView(time);
            // cc.MINIController.getInstance().updateTimerTx(time, this.currentState);
            //console.log('updateTimer: ' +time);
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
            // console.log('connectHubTx');
            //cc.PopupController.getInstance().showBusy();

            this.isAuthorized = false;
            var luckyDiceNegotiateCommand = new cc.LuckyDiceNegotiateCommand;
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


        resumeGame(data){
            //cc.warn("RESUME MAIN", data)
            this.sessionData = data;
            cc.TaiXiuController.getInstance().updateInfoView(data, true);
            cc.TaiXiuController.getInstance().updateResultView(data, true);
            cc.TaiXiuController.getInstance().setSID(data.SessionID);
            if(data.buildTick){
                const timeLost = (Date.now() - data.buildTick)/1000;
                const timeRemain = data.Ellapsed - Math.round(timeLost);
                this.startTimer(timeRemain);
            } 
            if(data.GameHistory){
                cc.TaiXiuController.getInstance().updateSessionHistory(data.GameHistory);
            }
            if(data.BetSuccess){
                cc.TaiXiuController.getInstance().updateBetInfoView(data.BetSuccess);
            } 
           
        },

        getSessionData(){
            return this.sessionData;
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
                    // case cc.TaiXiuState.END_BETTING:{
                    //     this.sessionData.SessionID = data.SessionID
                    //     this.sessionData.CurrentState = data.CurrentState;
                    //     this.sessionData.Ellapsed =  data.Ellapsed;
                    //     this.sessionData.Result = data.Result;
                    //     this.sessionData.TotalBetTai = data.TotalBetTai;
                    //     this.sessionData.TotalBetXiu = data.TotalBetXiu;
                    //     this.sessionData.TotalTai = data.TotalTai;
                    //     this.sessionData.TotalXiu = data.TotalXiu;
                    //     this.sessionData.buildTick = Date.now();
                    //     // if(data.Ellapsed == 1){
                    //     //     let total = data.TotalBetTai < data.TotalBetXiu?data.TotalBetTai:data.TotalBetXiu;
                    //     //     this.sessionData.lbTotalBetTai = total;
                    //     //     this.sessionData.TotalBetXiu = total
                    //     // }
                    //     //cc.warn("LEFT END_BETTING", this.sessionData)
                    //     break;
                    // }
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
                        
                        
                        // let total = data.TotalBetTai < data.TotalBetXiu?data.TotalBetTai:data.TotalBetXiu;
                        // this.sessionData.lbTotalBetTai = total;
                        // this.sessionData.TotalBetXiu = total
                        //cc.warn("LEFT RESULT", this.sessionData)
                        break;
                    }
                    case cc.TaiXiuState.PREPARE_NEW_SESSION:
                    
                        break;
                    case 4://switch table
                        //cc.warn("switch table")
                      
                        break;
    
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
                    //cc.warn("AA",res)
                    switch (m.M) {
                        //vao Phong
                        case cc.MethodHubOnName.SESSION_INFO:
                            var data = m.A[0];
                            cc.TaiXiuController.getInstance().updateInfoView(data);
                            cc.TaiXiuController.getInstance().updateResultView(data);
                            cc.TaiXiuController.getInstance().setSID(data.SessionID);
                            if(!this.isTimer || (this.sessionData && data.CurrentState !== this.sessionData.CurrentState)){
                                cc.warn("Start timer")
                                this.stopTimer();
                                this.updateSessionData("SESSION_INFO", data);
                                this.resumeGame(this.getSessionData())
                            } else {
                                this.updateSessionData("SESSION_INFO", data);
                            }
                            break;
                        //vao Phong
                        case cc.MethodHubOnName.GAME_HISTORY:
                            cc.TaiXiuController.getInstance().updateSessionHistory(m.A[0]);
                            this.updateSessionData("GAME_HISTORY", m.A[0]);
                            //login roi -> moi goi
                            if (cc.LoginController.getInstance().getLoginState() && cc.TaiXiuController.getInstance().getIsOpen()) {
                                // this.sendRequestOnHub(cc.MethodHubName.CORD_INFO);
                            }
                            break;
                        //vao Phong
                        case cc.MethodHubOnName.BET_OF_ACCOUNT:
                            //cc.warn("BET_OF_ACCOUNT",m.A[0])
                            cc.director.getScheduler().schedule(function () {
                                cc.TaiXiuController.getInstance().updateBetInfoView(m.A[0]);
                            }, this, 1, 0, 0.2, false);
                            break;

                        //su kien trieu hoi PH
                        case cc.MethodHubOnName.CORD_ACCOUNT_INFO:
                            //cc.warn("CORD_ACCOUNT_INFO",m.A[0])
                            var data = m.A[0];
                            if (data.IsEventDragon) {
                                cc.TaiXiuController.getInstance().activeEventPH(true);
                                cc.TaiXiuController.getInstance().setUserCord(data.CordWin, data.CordLost);
                            } else {
                                cc.TaiXiuController.getInstance().activeEventPH(false);
                            }
                            break;
                        //su kien trieu hoi PH
                        case cc.MethodHubOnName.EVENT_WINNER_RESULT:
                            //set giai thuong + user goi duoc rong
                            cc.TaiXiuController.getInstance().setEventWinnerResult(m.A[0]);
                            //Khoi tao hieu ung khi dang o portal hoặc đang bật TX
                            if (cc.LobbyController.getInstance().checkLobbyActive() || cc.TaiXiuController.getInstance().getIsOpen()) {
                                cc.LobbyController.getInstance().createFxSummonDragon();
                            }


                            //login roi -> moi goi
                            if (cc.LoginController.getInstance().getLoginState()) {
                                this.sendRequestOnHub(cc.MethodHubName.CORD_INFO);
                            }

                            //Khoi  tao hieu ung khi đang bật TX
                            // if (cc.TaiXiuController.getInstance().getIsOpen()) {
                            //     cc.LobbyController.getInstance().createFxSummonDragon();
                            // }

                            break;
                        //su kien trieu hoi PH
                        case cc.MethodHubOnName.SUMMON_DRAGON_AWARD:
                            //user nam trong TOP dây Win/Lose -> duoc thuong -> lay lai thong tin balance
                            // {
                            //     "AccountID": 100000012,
                            //     "PrizeValue": 1756234,
                            //     "Balance": 243553877
                            // }

                            cc.LobbyController.getInstance().refreshAccountInfo();
                            break;
                        case cc.MethodHubOnName.NOTIFY_CHANGE_PHRASE:
                            console.log(m.A[0]);
                            var data = m.A[0];
                            cc.TaiXiuController.getInstance().updateInfoView(data);
                            cc.TaiXiuController.getInstance().updateResultView(data);
                            cc.TaiXiuController.getInstance().setSID(data.SessionID);
                            this.updateSessionData("SESSION_INFO", data);
                            this.startTimer(data.Ellapsed)
                            break;
                        case cc.MethodHubOnName.UPDATE_ROOM_TIME:
                            //console.log(m.A[0]);
                            break;
                        //bet thanh cong
                        case cc.MethodHubOnName.BET_SUCCESS:
                            var data = m.A[0];
                            this.updateSessionData("BET_SUCCESS", data);
                            cc.TaiXiuController.getInstance().updateBetInfoView(data);
                            //update lai balance
                            cc.BalanceController.getInstance().updateRealBalance(m.A[1]);
                            cc.BalanceController.getInstance().updateBalance(m.A[1]);

                            cc.DDNA.getInstance().betSummary(cc.DDNAGame.TAI_XIU, data.BetValue, cc.TaiXiuController.getInstance().getSID());
                            break;
                        case cc.MethodHubOnName.WIN_RESULT:
                        
                            var data = m.A[0];
                            var waitTime = taiXiuConfig.TIME_WAIT_DICE_ANIMATION;
                            //cc.warn("WIN_RESULT",data)
                            //dang bat che do Nan
                            if (cc.TaiXiuController.getInstance().getIsNan()) {
                                //thoi gian doi show ket qua win lau hon
                                waitTime = taiXiuConfig.TIME_WAIT_SHOW_WIN_RESULT_NAN;
                            }
                            console.log(data.Award);
                            cc.director.getScheduler().schedule(function () {
                                //play fx win
                                cc.TaiXiuController.getInstance().playEffectWin(data.Award);
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
        onHubMessage: function (response) {
           cc.TaiXiuController.getInstance().onMessage(0,response);
        },

        onHubOpen: function () {
            cc.PopupController.getInstance().hideBusy();
            this.sendRequestOnHub(cc.MethodHubName.ENTER_LOBBY);
            this.isHubOpen = true;
        },

        onHubClose: function () {
            if(this.isHubOpen) {
                cc.TaiXiuController.getInstance().reset();
                // reconnect
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

        onChangeTable:function(event, data){
            // this.stopTimer();
            if(data==1){//left
                let leftTable = this.leftTable.getComponent(cc.TaiXiuPortalViewLeft);
                leftTable.stopTimer();
                let temp = this.iLeftTable;
                this.iLeftTable = this.iCenterTable;
                this.iCenterTable = temp;
                // cc.TaiXiuController.getInstance().setTableIndex(this.iCenterTable,this.iLeftTable,this.iRightTable);
                this.lbLeftTable.spriteFrame = this.sfTableName[this.iLeftTable];
                this.lbCenterTable.spriteFrame = this.sfTableName[this.iCenterTable];
                this.LeftTableSprite.spriteFrame = this.sfTable[this.iLeftTable];
                cc.LocalStorage.getInstance().setData("mainTXTable",this.iCenterTable.toString());
                switch(this.iCenterTable)
                {
                    case 0:
                        cc.TaiXiuController.getInstance().setSubDomain(cc.SubdomainName.TAI_XIU);
                        break; 
                    case 1:
                        cc.TaiXiuController.getInstance().setSubDomain(cc.SubdomainName.TAI_XIU1);
                        break; 
                    case 2:
                        cc.TaiXiuController.getInstance().setSubDomain(cc.SubdomainName.TAI_XIU2);
                        break; 
                }
                cc.TaiXiuController.getInstance().switchTable(true);
            } else { //right
                let rightTable = this.rightTable.getComponent(cc.TaiXiuPortalViewRight);
                rightTable.stopTimer();
                let temp = this.iRightTable;
                this.iRightTable = this.iCenterTable;
                this.iCenterTable = temp;
                // cc.TaiXiuController.getInstance().setTableIndex(this.iCenterTable,this.iLeftTable,this.iRightTable);
                this.lbRightTable.spriteFrame = this.sfTableName[this.iRightTable];
                this.RightTableSprite.spriteFrame = this.sfTable[this.iRightTable];
                this.lbCenterTable.spriteFrame = this.sfTableName[this.iCenterTable];
                cc.LocalStorage.getInstance().setData("mainTXTable",this.iCenterTable.toString());
                switch(this.iCenterTable)
                {
                    case 0:
                        cc.TaiXiuController.getInstance().setSubDomain(cc.SubdomainName.TAI_XIU);
                        break; 
                    case 1:
                        cc.TaiXiuController.getInstance().setSubDomain(cc.SubdomainName.TAI_XIU1);
                        break; 
                    case 2:
                        cc.TaiXiuController.getInstance().setSubDomain(cc.SubdomainName.TAI_XIU2);
                        break; 
                }
                cc.TaiXiuController.getInstance().switchTable(false);
            }
            cc.TaiXiuMainController.getInstance().changeGraphView();
        },
        lightSwitch:function()
        {
            this.light.active = !this.light.active;
            this.lightBtn.spriteFrame = this.light.active?this.lightOnSprite:this.lightOffSprite;
        }
    });
}).call(this);
