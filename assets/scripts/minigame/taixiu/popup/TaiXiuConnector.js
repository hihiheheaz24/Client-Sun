/**
 * Created by Nofear on 6/7/2017.
 */
(function () {
    cc.TaiXiuConnector = cc.Class({
        "extends": cc.Component,
        properties: {
            

        },

        onLoad: function () {
            // this.connectHubTx(cc.SubdomainName.TAI_XIU,0);  
            // this.connectHubTx(cc.SubdomainName.TAI_XIU1,1);  
            // this.connectHubTx(cc.SubdomainName.TAI_XIU2,2);  
        },
        disconnectAndLogout: function () {
            if (this.luckyDiceHub) {
                this.luckyDiceHub.disconnect();
            }
            this.lastTimeReconnect = (new Date()).getTime();
            this.isAuthorized = false;
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

        connectHubTx: function (subName,hubIndex) {
            this.isAuthorized = false;
            let luckyDiceNegotiateCommand = new cc.LuckyDiceNegotiateCommand;
            luckyDiceNegotiateCommand.execute(this,subName,hubIndex);
        },

        reconnect: function (hubName) {
            // console.log('luckyDiceHub reconnect');
            this.lastTimeReconnect = (new Date()).getTime();
            this.luckyDiceHub.connect(this, hubName, this.connectionToken, true);
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

        onLuckyDiceNegotiateResponse: function (response,hubIndex) {
            this.connectionToken = response.ConnectionToken;
            if (hubIndex==0) {
                this.luckyDiceHub = new cc.Hub;
                cc.TaiXiuController.getInstance().setUpHub(0,this.luckyDiceHub);
                this.luckyDiceHub.connect(this, cc.HubName.LuckyDiceHub, response.ConnectionToken);
            }
            if (hubIndex==1) {
                this.luckyDice1Hub = new cc.Hub;
                cc.TaiXiuController.getInstance().setUpHub(1,this.luckyDice1Hub);
                this.luckyDice1Hub.connect(this, cc.HubName.LuckyDice1Hub, response.ConnectionToken);
            }
            if (hubIndex==2) {
                this.luckyDice2Hub = new cc.Hub;

                cc.TaiXiuController.getInstance().setUpHub(2,this.luckyDice2Hub);

                this.luckyDice2Hub.connect(this, cc.HubName.LuckyDice2Hub, response.ConnectionToken);
            }
        },
        onHubMessage: function (response,hubIndex) {
           cc.TaiXiuController.getInstance().onMessage(hubIndex,response);
        },

        onHubOpen: function () {
            cc.PopupController.getInstance().hideBusy();
            // this.sendRequestOnHub(cc.MethodHubName.ENTER_LOBBY);
            this.isHubOpen = true;
        },

        onHubClose: function () {
            if(this.isHubOpen) {
                cc.TaiXiuController.getInstance().reset();
                //reconnect
                // console.log((new Date()).getTime() - this.lastTimeReconnect);
                // if ((new Date()).getTime() - this.lastTimeReconnect >= netConfig.RECONNECT_TIME * 1000) {
                //     this.reconnect();
                // } else {
                //     cc.director.getScheduler().schedule(this.reconnect, this, netConfig.RECONNECT_TIME, 0, 0, false);
                // }
            }
            this.isHubOpen = false;
        },

        onHubError: function () {

        }
    });
}).call(this);
