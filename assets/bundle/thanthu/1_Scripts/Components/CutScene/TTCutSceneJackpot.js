const Emitter = require('TTEventEmitter');
const Config = require('TTConfig');
const DataStore = require('TTDataStore');
const EventCode = require("TTEventsCode");
const {registerEvent, removeEvents, convertAssetArrayToObject } = require('TTUtils');
cc.Class({
    extends: cc.Component,
    properties: {
        overlay: cc.Component,
        txtCoin: cc.Node,
        mainSpine: sp.Skeleton,
    },
    
    onLoad() {
        this.node.active = false;
        this.node.opacity = 0;
        this.node.show = this.show.bind(this);
        this.node.hide = this.hide.bind(this);
        this.node.resetOnExit = this.resetOnExit.bind(this);
        this.CONFIG_TIME = {
            IDLE: 6,
            END: 0.25
        };
    },

    show(content, callback) {
        this.node.active = true;
        this.node.opacity = 255;
        this.extendShow(content, callback);
    },

    extendShow(content, callback) {
        this.resetCutScene();
        this.callbackFunc = callback;
        this.winValue = content.jackpotAmount;
        const durStart = this.mainSpine.findAnimation('Win').duration;
        this.node.runAction(cc.sequence(
            cc.callFunc(() => {
                Emitter.instance.emit(EventCode.SOUND.SOUND_JACKPOT_START);
                this.mainSpine.setAnimation(0,'Win',true);
                this.mainSpine.addAnimation(0,'Idle',true);
            }),
            cc.fadeIn(0.25),
            cc.delayTime(durStart - 0.25),
            cc.callFunc(() => {
                Emitter.instance.emit(EventCode.SOUND.SOUND_JACKPOT_LOOP);
                this.txtCoin.active = true;
                this.txtCoin.onUpdateValue(this.winValue, (this.CONFIG_TIME.IDLE - 2) * 1000);
            }),
            cc.delayTime(this.CONFIG_TIME.IDLE),
            cc.callFunc(() => {
                this.animEnd();
            })
        ));
    },

    animEnd() {
        this.node.stopAllActions();
        this.node.runAction(cc.sequence(
            cc.delayTime(this.CONFIG_TIME.END),
            cc.callFunc(() => {
                Emitter.instance.emit(EventCode.PAYLINE_INFO.PAYLINE_INFO_SHOW_WIN, this.winValue);
                Emitter.instance.emit(EventCode.SOUND.SOUND_STOP_JACKPOT_LOOP);
                if (this.callbackFunc && typeof this.callbackFunc === 'function') {
                    this.callbackFunc();
                }
                this.node.destroy();
            }),
        ));
    },

    resetCutScene() {
        //this.overlay.getComponent(cc.Button).interactable = false;
        this.txtCoin.resetValue();
        this.txtCoin.active = false;
        this.node.stopAllActions();
    },

    hide() {
        this.node.stopAllActions();
        this.node.active = false;
        this.node.opacity = 0;
        this.node.removeFromParent(true);
        this.node.destroy();
    },


    resetOnExit(){

    }


});

