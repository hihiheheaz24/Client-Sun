const Emitter = require('TTEventEmitter');
const Config = require('TTConfig');
const DataStore = require('TTDataStore');
const EventCode = require("TTEventsCode");
const { registerEvent, removeEvents, convertAssetArrayToObject } = require('TTUtils');
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
            START: 0.25,
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
        const { TotalWin, BetValue } = content;
        const { MEGA_WIN, SUPER_WIN } = Config.instance.BIG_WIN_RATE;
        this.callbackFunc = callback;
        this.winValue = content.TotalWin;
        if (this.winValue > SUPER_WIN * BetValue) {
            this.mainSpine.setAnimation(0, 'thang_sieu_lon_loop', true)
        } else if (this.winValue > MEGA_WIN * BetValue) {
            this.mainSpine.setAnimation(0, 'thang_cuc_lon_loop', true)
        } else {
            this.mainSpine.setAnimation(0, 'thang_lon_loop', true)
        }

        this.node.runAction(cc.sequence(
            cc.callFunc(() => {
                Emitter.instance.emit(EventCode.SOUND.SOUND_BIGWIN_LOOP);
                this.txtCoin.active = true;
                this.txtCoin.onUpdateValue(this.winValue, (this.CONFIG_TIME.IDLE - 2) * 1000);
            }),
            cc.fadeIn(0.25),
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
                Emitter.instance.emit(EventCode.SOUND.SOUND_STOP_BIGWIN_LOOP);
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


    resetOnExit() {

    },


});

