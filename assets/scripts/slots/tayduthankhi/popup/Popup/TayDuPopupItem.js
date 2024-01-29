
const Emitter = require('TayDuEventEmitter');
const EventCode = require("TayDuEventsCode");
cc.Class({
    extends: cc.Component,
    properties: {  
        contents: cc.Node,
        btnClose: cc.Node,
        _callback: null,
    },
    onLoad() {
        this.node.scale = 0;
        this.node.show = this.show.bind(this);
        this.node.hide = this.hide.bind(this);
        this.node.resetState = this.onResetState.bind(this);
        this.initObj();
        this.onResetState();
    },
    initObj() {
        if (this.contents == null) {
            this.contents = this.node;
        }
        if (this.btnClose) {
            this.btnClose.off('click');
            this.btnClose.on('click', (() => {
                this.btnClose.getComponent(cc.Button).interactable = false;
                this.onClose();
            }), this);
        }
      
    },

    show() {
        this.node.stopAllActions();
        this.contents.stopAllActions();
        this.node.active = true;
        this.contents.opacity = 0;
        this.node.scale = cc.v2(1, 1);
        if (this.btnClose) {
            this.btnClose.getComponent(cc.Button).interactable = true;
        }
        this.contents.runAction(cc.sequence(
            cc.fadeIn(0.3),
            cc.callFunc(() => {
            })
        ));
    },


    hide() {
        this.contents.runAction(cc.sequence(
            cc.fadeOut(0.2),
            cc.callFunc(()=>{
                this.node.active = false;
                this.onResetState();
                if (this._callback) {
                    this._callback();
                }
            })

        ));
    },
    onResetState() {
        if (!cc.isValid(this.node)) return;
        if (this.contents) {
            this.contents.opacity = 255;
        }
        this.node.scale = 0;
    },
    onClose() {
        Emitter.instance.emit(EventCode.POPUP.CLOSE_TOP_POPUP);
    },
});
