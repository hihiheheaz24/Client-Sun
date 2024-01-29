const Emitter = require('TTEventEmitter');
const Config = require('TTConfig');
const DataStore = require('TTDataStore');
const EventCode = require("TTEventsCode");
const { registerEvent, removeEvents } = require('TTUtils');
cc.Class({
    extends: cc.Component,

    properties: {
        spinBtn: cc.Node,
        stopAutoSpinBtn: cc.Node,
        autoSpinBtn: cc.Button,
        turboOnBtn: cc.Node,
        turboOffBtn: cc.Node,
        betNextBtn: cc.Button,
        betBackBtn: cc.Button,
        tryBtn: cc.Button,
        homeBtn: cc.Button,
        bgBtnSpin: cc.Node,
        iconSpin: cc.Node,
        spriteBtnSpin: [cc.SpriteFrame], //0: on ; 1: off
        spriteIconSpin: [cc.SpriteFrame], //0: on ; 1: off
        spriteIconTry: [cc.SpriteFrame], //0: that ; 1: thử
        notiTry: cc.Node,
    },

    onLoad() {
        this.initEvents();
        this.spinBtnComponent = this.spinBtn.getComponent(cc.Button);
        this.spinBtnComponent.interactable = false;
        this.stopAutoSpinBtn.active = false;
        this.interactableSpin(false);
    },

    initEvents() {
        registerEvent(EventCode.TABLE.TABLE_START_SPINNING, this.startSpinning, this);
        registerEvent(EventCode.TABLE.TABLE_CAN_SPIN, this.canSpinning, this);
        registerEvent(EventCode.BUTTON.INTERACTABLE_BET, this.interactableBet, this);
        registerEvent(EventCode.BUTTON.INTERACTABLE_SPIN, this.interactableSpin, this);
        registerEvent(EventCode.BUTTON.BUTTON_INIT, this.initButton, this);
        registerEvent(EventCode.BUTTON.STOP_AUTO_SPIN, this.stopAutoSpinClick, this);
    },

    initButton() {
        DataStore.instance.setTurboMode(false);
        DataStore.instance.setAutoSpin(false);
        DataStore.instance.setMode("NORMAL");
        DataStore.instance.setTryMode(false);
        this.notiTry.active = false;
        this.turboOnBtn.active = false;
        this.turboOffBtn.active = true;
        this.spinBtn.active = true;
        this.stopAutoSpinBtn.active = false;
        this.interactableSpin(true);
        this.tryBtn.node.getComponent(cc.Sprite).spriteFrame = this.spriteIconTry[1];

    },

    startSpinning() {
        this.interactableBet(false);
        this.interactableSpin(false);
    },

    canSpinning() {
        this.interactableBet(true);
        this.interactableSpin(true);
    },

    tryClick(){
        Emitter.instance.emit(EventCode.SOUND.SOUND_CLICK);
        const isTry = DataStore.instance.getTryMode();
        const newIsTry = !isTry;
        DataStore.instance.setTryMode(newIsTry);
        if(newIsTry){
            this.notiTry.active = true;
            this.tryBtn.node.getComponent(cc.Sprite).spriteFrame = this.spriteIconTry[0];
            DataStore.instance.setWallet(50000000);
            Emitter.instance.emit(EventCode.COMMON.ON_UPDATE_WALLET, DataStore.instance.getWallet());
            Emitter.instance.emit(EventCode.COMMON.UPDATE_BET_VALUE, 20000);
            this.interactableBet(false);
            // try
        } else {
            this.notiTry.active = false;
            this.tryBtn.node.getComponent(cc.Sprite).spriteFrame = this.spriteIconTry[1];
            Emitter.instance.emit(EventCode.COMMON.ON_UPDATE_WALLET, DataStore.instance.getWallet());
            Emitter.instance.emit(EventCode.COMMON.UPDATE_BET_VALUE, DataStore.instance.getCurrentBetValue());
            Emitter.instance.emit(EventCode.COMMON.ON_SEND_GET_WALLET);
            this.interactableBet(true);
            // real
        }    
    },

    spinClick() {
        Emitter.instance.emit(EventCode.COMMON.CALL_SPIN);
        Emitter.instance.emit(EventCode.SOUND.SOUND_SPIN_CLICK);
    },

    backClick() {
        Emitter.instance.emit(EventCode.SOUND.SOUND_CLICK);
        Emitter.instance.emit(EventCode.COMMON.EXIT_GAME);
        cc.LobbyController.getInstance().destroyDynamicView(null);
    },

    historyPlayClick(){
        Emitter.instance.emit(EventCode.SOUND.SOUND_CLICK);
        Emitter.instance.emit(EventCode.POPUP.SHOW_HISTORY_PLAY); 
    },

    historyJackpotClick(){
        Emitter.instance.emit(EventCode.SOUND.SOUND_CLICK);
        Emitter.instance.emit(EventCode.POPUP.SHOW_HISTORY_JACKPOT); 
    },

    popupInfoClick(){
        Emitter.instance.emit(EventCode.SOUND.SOUND_CLICK);
        Emitter.instance.emit(EventCode.POPUP.SHOW_POPUP_INFO); 
    },

    startAutoSpinClick() {
        Emitter.instance.emit(EventCode.SOUND.SOUND_CLICK);
        this.showStopAutoSpin();
        DataStore.instance.setAutoSpin(true);
        this.autoSpinBtn.interactable = false;
        this.iconSpin.active = false;
        Emitter.instance.emit(EventCode.COMMON.CALL_SPIN);
    },

    stopAutoSpinClick() {
        Emitter.instance.emit(EventCode.SOUND.SOUND_CLICK);
        this.hideStopAutoSpin();
        DataStore.instance.setAutoSpin(false);
        this.autoSpinBtn.interactable = this.spinBtnComponent.interactable;
        this.iconSpin.active = true;
    },

    turboOnClick() {
        Emitter.instance.emit(EventCode.SOUND.SOUND_CLICK);
        DataStore.instance.setTurboMode(false);
        DataStore.instance.setMode("NORMAL");
        this.turboOnBtn.active = false;
        this.turboOffBtn.active = true;
    },

    turboOffClick() {
        Emitter.instance.emit(EventCode.SOUND.SOUND_CLICK);
        DataStore.instance.setTurboMode(true);
        DataStore.instance.setMode("TURBO");
        this.turboOnBtn.active = true;
        this.turboOffBtn.active = false;
    },

    betNextClick() {
        Emitter.instance.emit(EventCode.SOUND.SOUND_CLICK);
        const betID = DataStore.instance.getBetID();
        let betIndex = Config.instance.BET_ID.indexOf(betID);
        betIndex++;
        if (betIndex == Config.instance.BET_ID.length) {
            betIndex = 0;
        }
        const newBetID = Config.instance.BET_ID[betIndex];
        DataStore.instance.setBetID(newBetID);
        Emitter.instance.emit(EventCode.COMMON.UPDATE_BET_VALUE, Config.instance.BETS[newBetID]);
    },

    betBackClick() {
        Emitter.instance.emit(EventCode.SOUND.SOUND_CLICK);
        const betID = DataStore.instance.getBetID();
        let betIndex = Config.instance.BET_ID.indexOf(betID);
        betIndex--;
        if (betIndex == -1) {
            betIndex = Config.instance.BET_ID.length - 1;
        }
        const newBetID = Config.instance.BET_ID[betIndex];
        DataStore.instance.setBetID(newBetID);
        Emitter.instance.emit(EventCode.COMMON.UPDATE_BET_VALUE, Config.instance.BETS[newBetID]);
    },

    interactableSpin(interactable) {
        this.spinBtnComponent.interactable = interactable;
        this.homeBtn.interactable = interactable;
        this.tryBtn.interactable = interactable;
        this.bgBtnSpin.getComponent(cc.Sprite).spriteFrame = this.spriteBtnSpin[interactable ? 0 : 1];
        this.iconSpin.getComponent(cc.Sprite).spriteFrame = this.spriteIconSpin[interactable ? 0 : 1];
        this.iconSpin.stopAllActions();
        if (interactable) {
            this.iconSpin.runAction(cc.repeatForever(cc.rotateBy(3, 360)));
        }
        if(DataStore.instance.getAutoSpin()){
            this.autoSpinBtn.interactable = false;
        } else {
            this.autoSpinBtn.interactable = interactable;
        } 

    },

    interactableBet(interactable) {
        if(DataStore.instance.getTryMode()){
            this.betBackBtn.interactable = false;
            this.betNextBtn.interactable = false;
        } else {
            this.betBackBtn.interactable = interactable;
            this.betNextBtn.interactable = interactable;
        }
    },


    showStopAutoSpin() {
        this.stopAutoSpinBtn.active = true;
    },
    hideStopAutoSpin() {
        this.stopAutoSpinBtn.active = false;
    },

    showSpin() {
        this.spinBtn.active = true;
    },
    hideSpin() {
        this.spinBtn.active = false;
    },

    onDestroy() {
        removeEvents(this);
    },


});
