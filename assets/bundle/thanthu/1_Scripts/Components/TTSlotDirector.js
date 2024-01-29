const netConfig = require('NetConfig');
const Emitter = require('TTEventEmitter');
const Config = require('TTConfig');
const DataStore = require('TTDataStore');
const EventCode = require("TTEventsCode");
const { registerEvent, removeEvents } = require('TTUtils');

cc.Class({
    extends: cc.Component,
    properties: {
        loading:cc.Animation
    },
    onLoad() {
        this.inited = false;
        this.initInstances();
        setTimeout(() => {
            this.initGame();
        }, 100)
    },
    initInstances() {
        //Init Event Emitter
        Emitter.instance = new Emitter();
        //Init GameConfig
        Config.instance = new Config();
        //Init Datastore
        DataStore.instance = new DataStore();
    },
    initGame() {
        this.gameId = '73';
        this.hubName = cc.HubName.ThanThuHub;
        let thanThuNegotiateCommand = new cc.ThanThuNegotiateCommand;
        thanThuNegotiateCommand.execute(this);
        this.lastTimeReconnect = (new Date()).getTime();
        Emitter.instance.emit(EventCode.COMMON.GAME_INIT);
        this.initEvents();
    },

    initEvents() {
        registerEvent(EventCode.COMMON.ON_SEND_SPIN, this.onSendSpin, this);
        registerEvent(EventCode.COMMON.ON_SEND_GET_WALLET, this.onSendGetWallet, this);
        registerEvent(EventCode.COMMON.EXIT_GAME, this.onExitGame, this);

    },

    onSendSpin(roomID) {
        if (this.slotsHub === undefined || this.slotsHub === null) return;
        this.slotsHub.spin(null, roomID);
    },

    reconnect() {
        this.lastTimeReconnect = (new Date()).getTime();
        this.slotsHub.connect(this, this.hubName, this.connectionToken, true);
    },

    onGetBalanceResponse(response) {
        cc.warn("onGetBalanceResponse", response)
        Emitter.instance.emit(EventCode.COMMON.ON_UPDATE_WALLET, response.balance, true);
    },

    onSlotsNegotiateResponse(response) {
        this.connectionToken = response.ConnectionToken;
        this.slotsHub = new cc.Hub;
        this.slotsHub.connect(this, this.hubName, response.ConnectionToken);
    },

    onHubMessage(response) {
        if (response.M !== undefined && response.M.length > 0) {
            var m = (response.M)[0];
            switch (m.M) {
                //vao Phong
                case cc.MethodHubOnName.JOIN_GAME: {
                    let data = m.A[0];
                    //cc.warn("JOIN_GAME", data);
                    let listJP = '';
                    data.JackpotInfos.forEach(item=>{listJP = listJP + "|" + item.JackpotFund;});
                    DataStore.instance.setListJP(listJP);
                    Emitter.instance.emit(EventCode.COMMON.ON_UPDATE_JACKPOT);

                    Emitter.instance.emit(EventCode.COMMON.GAME_CONNECTED_SERVER, data);
                    break;
                }
                case cc.MethodHubOnName.RESULT_SPIN: {
                    let data = m.A[0];
                    Emitter.instance.emit(EventCode.COMMON.ON_RECEIVE_RESULT_SPIN, data);
                    break;
                }
                case cc.MethodHubOnName.UPDATE_JACKPOT: {
                    let data = m.A[0];
                    //cc.warn("UPDATE_JACKPOT", data)
                    DataStore.instance.setListJP(data);
                    Emitter.instance.emit(EventCode.COMMON.ON_UPDATE_JACKPOT);
                    break;
                }
                case cc.MethodHubOnName.MESSAGE: {
                    let data = m.A[0];
                    cc.warn("MESSAGE", data)
                    if (data.Description) {
                        Emitter.instance.emit(EventCode.POPUP.SHOW_POPUP_PROMPT, data.Description);
                    } else if (data.Message) {
                        Emitter.instance.emit(EventCode.POPUP.SHOW_POPUP_PROMPT, mdata.Messagegs);
                    } else {
                        Emitter.instance.emit(EventCode.POPUP.SHOW_POPUP_PROMPT, data);
                    }
                    //da co loi xay ra -> hien message -> out khoi phong choi
                    cc.director.getScheduler().schedule(function () {
                        this.onExitGame();
                        cc.LobbyController.getInstance().destroyDynamicView(null);
                    }, this, 4, 0, 0, false);
                    break;
                }
                case cc.MethodHubOnName.OTHER_DEVICE: {
                    // m.A[0] = ma loi , m.A[1] = message
                
                    cc.PopupController.getInstance().showPopupOtherDevice( m.A[1], cc.RoomController.getInstance().getGameId());
                    break;
                }
                default:
                    //Error
                    if (response.E !== undefined) {

                    }
                    break;
            }
        } else {
            //PING PONG
            if (response.I) {
                this.slotsHub.pingPongResponse(response.I);
            }
        }
    },

    onHubOpen() {
        //cc.warn("onHubOpen")
        this.slotsHub.enterLobby();
        this.slotsHub.playNow(1);
        cc.PopupController.getInstance().showBusy();
        this.loading.play('bgLoadingIntro');
    },

    onSendGetWallet() {
        cc.warn("onSendGetWallet")
        let getBalanceCommand = new cc.GetBalanceCommand;
        getBalanceCommand.execute(this);
    },

    onHubClose() {
        //reconnect
        if ((new Date()).getTime() - this.lastTimeReconnect >= netConfig.RECONNECT_TIME * 1000) {
            this.reconnect();
        } else {
            cc.director.getScheduler().schedule(this.reconnect, this, netConfig.RECONNECT_TIME, 0, 0, false);
        }
    },

    onHubError() {
        // cc.SpinController.getInstance().activeButtonSpin(true);
    },

    onExitGame() {
        Emitter.instance?.destroy()
        Config.instance?.destroy()
        DataStore.instance?.destroy()
    },

    onDestroy() {
        if (this.slotsHub) {
            this.slotsHub.disconnect();
        }

        if (cc.sys.isNative) {
            var bundle = cc.assetManager.getBundle('thanthu');
            if (bundle) bundle.releaseAll();
        }
        cc.PopupController.getInstance().hideBusy();
        this.unscheduleAllCallbacks();
        //removeEvents(this);   
    },


});
