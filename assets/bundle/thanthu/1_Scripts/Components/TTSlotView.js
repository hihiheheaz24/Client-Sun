const Emitter = require('TTEventEmitter');
const Config = require('TTConfig');
const DataStore = require('TTDataStore');
const EventCode = require("TTEventsCode");
const { registerEvent, removeEvents, formatMoney } = require('TTUtils');

cc.Class({
    extends: cc.Component,

    properties: {
        txtWallet: cc.Node,
        txtTryWallet: cc.Node,
        txtBet: cc.Node,
        txtWinAmount: cc.Node,
        txtJackpot: cc.Node,
        jsonTryData: cc.JsonAsset,
    },

    onLoad() {
        this.initEvents();
    },

    initEvents() {
        registerEvent(EventCode.COMMON.GAME_CONNECTED_SERVER, this.gameStart, this);
        registerEvent(EventCode.COMMON.CALL_SPIN, this.callSpin, this);
        registerEvent(EventCode.COMMON.ON_RECEIVE_RESULT_SPIN, this.resultReceive, this);
        registerEvent(EventCode.COMMON.ON_UPDATE_WALLET, this.onUpdateWallet, this);
        registerEvent(EventCode.COMMON.UPDATE_BET_VALUE, this.onUpdateBetValue, this);
        registerEvent(EventCode.COMMON.UPDATE_TOTAL_WIN_VALUE, this.onUpdateTotalWinValue, this);
        registerEvent(EventCode.COMMON.ON_UPDATE_JACKPOT, this.onUpdateJackpot, this);
    },


    gameStart(data) {
        Emitter.instance.emit(EventCode.COMMON.ON_UPDATE_WALLET, data.Account.TotalStar);
        Emitter.instance.emit(EventCode.BUTTON.BUTTON_INIT);
        const betID = Config.instance.BET_ID_DEFAULT;
        const betValue = Config.instance.BETS[betID];
        this.txtBet.getComponent(cc.Label).string = formatMoney(betValue);
        this.txtWinAmount.getComponent(cc.Label).string = formatMoney(0);
        DataStore.instance.setBetID(betID);
        DataStore.instance.setTryData(this.jsonTryData.json.data);
    },

    onUpdateJackpot(){
        this.txtJackpot.onUpdateValue(DataStore.instance.getJPValue(), 200);
    },

    onUpdateTotalWinValue(data) {
        this.txtWinAmount.getComponent(cc.Label).string = formatMoney(data);
    },

    resultReceive(data) {
        if(!DataStore.instance.getTryMode()){
            Emitter.instance.emit(EventCode.COMMON.ON_SEND_GET_WALLET);
        }
        this.onUpdateWallet(DataStore.instance.getWallet() - data.BetValue);
        const dataSpin = DataStore.instance.formatData(data);
        Emitter.instance.emit(EventCode.EFFECT_LAYER.EFFECT_SHOW_RESULT, dataSpin, () => {
            if(!DataStore.instance.getTryMode()){
                Emitter.instance.emit(EventCode.COMMON.ON_SEND_GET_WALLET);
            }
            Emitter.instance.emit(EventCode.TABLE.TABLE_CAN_SPIN);
        });
    },

    callSpin() {
        let canISpin = DataStore.instance.calculateWalletAfterClickSpin();
        if (canISpin) {
            const isTry = DataStore.instance.getTryMode();
            if(isTry){
                Emitter.instance.emit(EventCode.TABLE.TABLE_ENABLE_ALL_HIGHLIGHT);
                Emitter.instance.emit(EventCode.TABLE.TABLE_START_SPINNING);
                let data = DataStore.instance.getTryData();
                Emitter.instance.emit(EventCode.COMMON.ON_RECEIVE_RESULT_SPIN, data);
            } else {
                Emitter.instance.emit(EventCode.COMMON.ON_SEND_SPIN, DataStore.instance.getBetID());
                Emitter.instance.emit(EventCode.TABLE.TABLE_ENABLE_ALL_HIGHLIGHT);
                Emitter.instance.emit(EventCode.TABLE.TABLE_START_SPINNING);                
            }
        } else {
            if(DataStore.instance.getAutoSpin()){
                Emitter.instance.emit(EventCode.BUTTON.STOP_AUTO_SPIN);
            }
            const mgs = "Số dư trong ví không đủ,\nVui lòng nạp thêm để chơi tiếp."
            Emitter.instance.emit(EventCode.POPUP.SHOW_POPUP_PROMPT, mgs);
        }
    },

    onUpdateBetValue(value) {
        this.txtJackpot.onUpdateValue(DataStore.instance.getJPValue(), 200);
        this.txtBet.getComponent(cc.Label).string = formatMoney(value);
    },

    onUpdateWallet(wallet, forceUpdateRealWallet = false) {
        cc.warn("onUpdateWallet", wallet, forceUpdateRealWallet)
        DataStore.instance.setWallet(wallet, forceUpdateRealWallet);
        if(DataStore.instance.getTryMode()){
            if(!forceUpdateRealWallet){
                this.txtTryWallet.active = true;
                this.txtWallet.active = false;
                this.txtTryWallet.onUpdateValue(wallet, 200);
            }
        } else {
            this.txtTryWallet.active = false;
            this.txtWallet.active = true;
            this.txtWallet.onUpdateValue(wallet, 200);
        }
        if(forceUpdateRealWallet || !DataStore.instance.getTryMode()){
            cc.BalanceController.getInstance().updateRealBalance(wallet);
            cc.BalanceController.getInstance().updateBalance(wallet);
        }
      
    },

    onDestroy() {
        removeEvents(this);
    },
});
