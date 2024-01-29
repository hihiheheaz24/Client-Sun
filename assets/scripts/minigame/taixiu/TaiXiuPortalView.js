/**
 * Created by Nofear on 6/7/2017.
 */
var taiXiuConfig = require('TaiXiuConfig');
var netConfig = require('NetConfig');
var timeAll=60;
(function () {
    cc.TaiXiuPortalView = cc.Class({
        "extends": cc.Component,
        properties: {
            
        },

        onLoad: function () {
            timeAll = 60;
            this.interval = null;

            cc.TaiXiuController.getInstance().setTaiXiuPortalView(this);
            this.lastTimeReconnect = (new Date()).getTime();
            this.isAuthorized = false;
            this.connectHubTx();
        },

        onDestroy: function () {
            timeAll = 60;
            if (this.interval !== null) {
                clearInterval(this.interval);
            }
            this.disconnectAndLogout();
            this.unscheduleAllCallbacks();
            cc.TaiXiuController.getInstance().setTaiXiuPortalView(null);
        },

        reset: function () {
            this.unscheduleAllCallbacks();
            timeAll = 60;
            this.isTimer = false;
            this.timer = 0;
            this.currentState = 999;
            if (this.interval !== null) {
                clearInterval(this.interval);
            }
        },
        
        startTimer: function (remaining) {
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

        updateInfo: function (sessionInfo) {
            // console.log(sessionInfo);
            this.currentState = sessionInfo.CurrentState;
            if(sessionInfo.CurrentState==cc.TaiXiuState.RESULT)
            this.currentResult = sessionInfo.Result.Dice1+ sessionInfo.Result.Dice2 + sessionInfo.Result.Dice3>=11?'TÀI':'XỈU';
            this.startTimer(sessionInfo.Ellapsed);
        },


        updateTimer: function (time) {
            if (time < 1) return;
            // this.lbTimer.string = cc.Tool.getInstance().convertSecondToTime2(time);
            // cc.TaiXiuController.getInstance().updateTimerInfoView(time);
            cc.MINIController.getInstance().updateTimerTx(time, this.currentState,this.currentResult);
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
                luckyDiceNegotiateCommand.execute(this,cc.SubdomainName.TAI_XIU);

                return false;
            } else {
                return true;
            }
        },

        connectHubTx: function () {
            // console.log('connectHubTx');
            //cc.PopupController.getInstance().showBusy();
            this.hubName = cc.HubName.LuckyDiceHub;
            this.subName = cc.SubdomainName.TAI_XIU;
            let currentTableIndex = cc.LocalStorage.getInstance().getData("mainTXTable","0");
            switch (currentTableIndex) {
                case "0":
                    this.hubName = cc.HubName.LuckyDiceHub;
                    this.subName = cc.SubdomainName.TAI_XIU;
                    break;
                case "1":
                    this.hubName = cc.HubName.LuckyDice1Hub;
                    this.subName = cc.SubdomainName.TAI_XIU1;
                        break;
                case "2":
                    this.hubName = cc.HubName.LuckyDice2Hub;
                    this.subName = cc.SubdomainName.TAI_XIU2;
                    break;
                default:
                    this.hubName = cc.HubName.LuckyDiceHub;
                    this.subName = cc.SubdomainName.TAI_XIU;
                    break;
            }
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
            this.luckyDiceHub = new cc.Hub;
            this.luckyDiceHub.connect(this, this.hubName, response.ConnectionToken);
        },

        onHubMessage: function (response) {            
            if (response.M !== undefined && response.M.length > 0) {
                var m = (response.M)[0];

                switch (m.M) {
                    //vao Phong
                    case cc.MethodHubOnName.SESSION_INFO:
                        var data = m.A[0];
                        this.updateInfo(data);
                        break;

                    case cc.MethodHubOnName.WIN_RESULT:
                        var data = m.A[0];
                        cc.warn("WIN_RESULT", data)
                        break;
                }
            }  else {
                //PING PONG
                if (response.I && this.luckyDiceHub) {
                    this.luckyDiceHub.pingPongResponse(response.I);
                }
            }
        },

        onHubOpen: function () {
            cc.PopupController.getInstance().hideBusy();
            if (this.isAuthorized) {
                this.sendRequestOnHub(cc.MethodHubName.ENTER_LOBBY);

            }
        },

        onHubClose: function () {
            cc.TaiXiuController.getInstance().reset();
            //reconnect
            // console.log((new Date()).getTime() - this.lastTimeReconnect);
            if ((new Date()).getTime() - this.lastTimeReconnect >= netConfig.RECONNECT_TIME * 1000) {
                this.reconnect();
            } else {
                cc.director.getScheduler().schedule(this.reconnect, this, netConfig.RECONNECT_TIME, 0, 0, false);
            }
        },

        onHubError: function () {

        },
    });
}).call(this);
