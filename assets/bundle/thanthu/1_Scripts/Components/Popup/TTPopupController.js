const Emitter = require('TTEventEmitter');
const Config = require('TTConfig');
const DataStore = require('TTDataStore');
const EventCode = require("TTEventsCode");
const { registerEvent, removeEvents } = require('TTUtils');

cc.Class({
    extends: cc.Component,
    properties: {
        popupPrompt: cc.Node,
        popupInfo: cc.Node,
        popupHistoryPlay: cc.Node,
        popupHistoryJackpot: cc.Node,
        overlay: cc.Node,
        _popupQueue: [],
    },

    onLoad() {
        this.overlay.active = false;
        this.node.opacity = 255;
        this.initEvents();
    },

    initEvents() {
        registerEvent(EventCode.POPUP.CLOSE_ALL, this.closeAll, this);
        registerEvent(EventCode.POPUP.SHOW_POPUP_PROMPT, this.showPrompt, this);
        registerEvent(EventCode.POPUP.SHOW_POPUP_INFO, this.showInfo, this);
        registerEvent(EventCode.POPUP.SHOW_HISTORY_PLAY, this.showHistoryPlay, this);
        registerEvent(EventCode.POPUP.SHOW_HISTORY_JACKPOT, this.showHistoryJackpot, this);
        
        registerEvent(EventCode.POPUP.SHOW_POPUP_INFO, this.showInfo, this);
        registerEvent(EventCode.POPUP.CLOSE_TOP_POPUP, this.close, this);
    },

    showHistoryPlay(){
        this._showPopup(this.popupHistoryPlay);
    },

    showHistoryJackpot() {
        this._showPopup(this.popupHistoryJackpot);
    },

    showPrompt(data) {
        this._showPopup(this.popupPrompt, data);
    },

    showInfo() {
        this._showPopup(this.popupInfo);
    },
   
    _showPopup(currentPopup, data = null) {
        if (!currentPopup) {
            return;
        }
        this.onPopupQueue(currentPopup);
        currentPopup.show(data);
    },

   
    onPopupQueue(popup) {
        let isNew = false;
        if (this._popupQueue && this._popupQueue.length > 0) {
            const currPopup = this._popupQueue[this._popupQueue.length - 1];
            if (currPopup != popup) {
                this._popupQueue[this._popupQueue.length - 1].hide();
                isNew = true;
            }
        } else {
            this.overlay.active = true;
            this.overlay.stopAllActions();
            this.overlay.runAction(
                cc.fadeTo(0.3,150)
            );
            isNew = true;
        }
        if (isNew) {
            this._popupQueue.push(popup);
        }
    },
    close() {
        const popup = this._popupQueue.pop();
        if (popup == null) {
            return;
        }
        popup.hide();
        if (this._popupQueue.length < 1) {
            this.overlay.stopAllActions();
            this.overlay.runAction(
                cc.sequence(
                    cc.fadeOut(0.3),
                    cc.callFunc(()=>{
                        this.overlay.active = false;
                    })
                )
            );
            return;
        }
        this._popupQueue[this._popupQueue.length - 1].show();
    },

    closeAll() {
        this.node.children.forEach((popup) => {
            if (popup.active && popup !== this.overlay && popup !== this.blockTouchNode) {
                popup.hide(GameConfig.instance.POPUP_ANIMATION.DEFAULT);
            }
        });
        this.overlay.stopAllActions();
        this.overlay.runAction(
            cc.sequence(
                cc.fadeOut(0.3),
                cc.callFunc(()=>{
                    this.overlay.active = false;
                })
            )
        );
        this._popupQueue = [];
    },

    onDestroy(){
        removeEvents(this);
    },
});
