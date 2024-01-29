

const { registerEvent, removeEvents } = require('TTUtils');
const Emitter = require('TTEventEmitter');
const EventCode = require('TTEventsCode');
const DataStore = require('TTDataStore');
const Config = require('TTConfig');

cc.Class({
    extends: cc.Component,

    properties: {
        spineSymbol: sp.Skeleton,
        staticPayable: cc.Sprite,
        symbols: {
            default: [],
            type: sp.SkeletonData,
        },
        payablses: {
            default: [],
            type: cc.SpriteFrame,
        },
        overlay: cc.Node,
        overlayTop: cc.Node,
        nodeSymbol: cc.Node,
    },

    onLoad() {
        registerEvent(EventCode.TABLE.SHOW_PAYABLE_SYMBOL, this.showPayableSymbol, this);
        registerEvent(EventCode.TABLE.TABLE_START_SPINNING, this.hidePayableSymbol, this);
    },


    showPayableSymbol(data) {
        const asset = this.symbols[data.symbolName - 1];
        if (asset) {
            this.overlay.active = true;
            this.overlayTop.active = true;
            this.nodeSymbol.active = true;
            this.spineSymbol.skeletonData = asset;
            this.staticPayable.spriteFrame = this.payablses[data.symbolName - 1];
            this.spineSymbol.setAnimation(0, "Active", false);
            this.spineSymbol.addAnimation(0, "Idle", true);
            const frameBG = this.nodeSymbol.getChildByName("FrameBg")
            const layout = this.nodeSymbol.getChildByName("Layout")
            const description = layout.getChildByName("Description")
            let direction = cc.Layout.HorizontalDirection.LEFT_TO_RIGHT;

            if (data.symbolName == 1) { // Wild
                frameBG.width = 480;
                description.width = 300;
            } else {
                frameBG.width = 320;
                description.width = 144;
            }
            if (data.reelIndex == 3 || data.reelIndex == 4) {
                direction = cc.Layout.HorizontalDirection.RIGHT_TO_LEFT;
                data.pos.x = data.pos.x - (description.width + 124) / 2 + 124 / 2
            } else {
                data.pos.x = data.pos.x + (description.width + 124) / 2 - 124 / 2
            }
            layout.getComponent(cc.Layout).horizontalDirection = direction;
            layout.getComponent(cc.Layout).updateLayout();
            this.nodeSymbol.position = data.pos;
        }
    },


    hidePayableSymbol(event) {
        if (event) {
            Emitter.instance.emit(EventCode.SOUND.SOUND_CLICK);
        }
        this.overlay.active = false;
        this.overlayTop.active = false;
        this.nodeSymbol.active = false;
    },

    onDestroy() {
        removeEvents(this);
    },





});
