const Emitter = require('TTEventEmitter');
const Config = require('TTConfig');
const DataStore = require('TTDataStore');
const EventCode = require("TTEventsCode");
const { registerEvent, removeEvents, formatMoney } = require('TTUtils');

cc.Class({
    extends: cc.Component,

    properties: {
        bg: cc.Sprite,
        listBg: [cc.SpriteFrame],
        tipNode: cc.Node,
        winBarNode: cc.Node,
        txtWinValue: cc.Node,
        txtTotalWinValue: cc.Node,
        tipFrames: [cc.SpriteFrame],
    },

    onLoad() {
        this.initEvents();
        this.showTip();
        this.txtWinValue.originPos = this.txtWinValue.position
        this.txtTotalWinValue.originPos = this.txtTotalWinValue.position


    },
    initEvents() {
        registerEvent(EventCode.PAYLINE_INFO.PAYLINE_INFO_SHOW_WIN, this.showWin, this);
        registerEvent(EventCode.PAYLINE_INFO.PAYLINE_INFO_SHOW_TOTAL_WIN, this.showTotalWin, this);
        registerEvent(EventCode.TABLE.TABLE_START_SPINNING, this.onReset, this);
    },

    onReset(){
        this._totalWin = 0;
        Emitter.instance.emit(EventCode.COMMON.UPDATE_TOTAL_WIN_VALUE, this._totalWin);
    },

    showTip() {
        this._totalWin = 0;
        this.node.stopAllActions();
        this.tipNode.active = true;
        this.winBarNode.active = false;
        this.bg.spriteFrame = this.listBg[0];
    },

    showWin(data, playEffect = true) {
        this._totalWin = this._totalWin + data;
        Emitter.instance.emit(EventCode.COMMON.UPDATE_TOTAL_WIN_VALUE, this._totalWin);
        if(playEffect){
            Emitter.instance.emit(EventCode.SOUND.SOUND_HIT_TXT_WIN); 
            this.node.stopAllActions();
            this.tipNode.active = false;
            this.txtTotalWinValue.active = false;
            this.winBarNode.active = true;
            this.txtWinValue.active = true;
            this.txtWinValue.stopAllActions();
            cc.tween(this.txtWinValue)
                .to(0.1, { scale: 1.2, position: cc.v2(this.txtWinValue.originPos.x, this.txtWinValue.originPos.y - 5) })
                .to(0.1, { scale: 1, position: this.txtWinValue.originPos })
                .start();
            this.txtWinValue.getComponent(cc.Label).string = "THẮNG " + formatMoney(data);
            const { BetValue } = DataStore.instance.getPlaySession();
            const rateSmallWin = 3;
            const rateMiddleWin = 4;
            let winAmountSmall = rateSmallWin * BetValue;
            let winAmountMiddle = rateMiddleWin * BetValue;
            if (winAmountMiddle < this._totalWin) {
                this.bg.spriteFrame = this.listBg[2];
            } else if (winAmountSmall < this._totalWin) {
                this.bg.spriteFrame = this.listBg[1];
            } else {
                this.bg.spriteFrame = this.listBg[0];
            }
        }
      
       
    },

    showTotalWin(data) {
        this.node.stopAllActions();
        this.tipNode.active = false;
        this.txtWinValue.active = false;
        this.txtTotalWinValue.active = true;
        this.winBarNode.active = true;
        this.txtTotalWinValue.stopAllActions();
        cc.tween(this.txtTotalWinValue)
            .to(0.1, { scale: 1.2, position: cc.v2(this.txtTotalWinValue.originPos.x, this.txtTotalWinValue.originPos.y - 5) })
            .to(0.1, { scale: 1, position: this.txtTotalWinValue.originPos })
            .start();
        Emitter.instance.emit(EventCode.SOUND.SOUND_HIT_TXT_TOTAL_WIN);
        this.txtTotalWinValue.getComponent(cc.Label).string = "TỔNG THẮNG " + formatMoney(data);
        Emitter.instance.emit(EventCode.COMMON.ON_UPDATE_WALLET, DataStore.instance.getWallet() + data);
        Emitter.instance.emit(EventCode.COMMON.UPDATE_TOTAL_WIN_VALUE, data);
        if(!DataStore.instance.getTryMode()){
            Emitter.instance.emit(EventCode.COMMON.ON_SEND_GET_WALLET);
        }
        this._totalWin = 0;
        this.node.runAction(cc.sequence(
            cc.delayTime(2),
            cc.callFunc(() => {
                this.showTip();
            })
        ))
    },

    onDestroy() {
        removeEvents(this);
    }

});
