
const Emitter = require('TTEventEmitter');
const EventCode = require('TTEventsCode');
const DataStore = require('TTDataStore');
const Config = require('TTConfig');
const { registerEvent, removeEvents, convertAssetArrayToObject } = require('TTUtils');
cc.Class({
    extends: cc.Component,

    properties: {
        staticSymbol: cc.Node,
        spineSymbol: cc.Node,
        symbols: {
            default: [],
            type: cc.SpriteFrame,
        },
        spineSymbols: {
            default: [],
            type: sp.SkeletonData,
        },

        blurSymbols: [cc.SpriteFrame]
    },

    onLoad() {
        registerEvent(EventCode.TABLE.TABLE_START_SPINNING, this.turnOffEventTouch, this);
        registerEvent(EventCode.TABLE.TABLE_CAN_SPIN, this.turnOnEventTouch, this);
        this.turnOnEventTouch();
        this.assets = convertAssetArrayToObject(this.symbols);
        this.blurAssets = convertAssetArrayToObject(this.blurSymbols);
        this.node.mainComponent = this;
        this.node.changeToSymbol = this.changeToSymbol.bind(this);
        this.node.changeToBlurSymbol = this.changeToBlurSymbol.bind(this);
        this.node.enableHighlight = this.enableHighlight.bind(this);
        this.node.disableHighlight = this.disableHighlight.bind(this);
        this.node.reset = this.reset.bind(this);
        
    },
    changeToSymbol(symbolName) {
        if (!this.assets) this.assets = convertAssetArrayToObject(this.symbols);
        if (!this.blurAssets) this.blurAssets = convertAssetArrayToObject(this.blurSymbols);
        const asset = this.assets[symbolName];
        this.symbolName = symbolName;
        this.staticSymbol.active = false;
        this.spineSymbol.active = true;

        const spineAsset = this.spineSymbols[symbolName - 1];
        if(spineAsset){
            this.spineSymbol.getComponent(sp.Skeleton).skeletonData = spineAsset;
            this.spineSymbol.getComponent(sp.Skeleton).setAnimation(0, "Idle", true);
        }

        if (this.assets[symbolName]) {
            this.node.symbol = symbolName; // for easy debug
            this.staticSymbol.opacity = 255;
            this.staticSymbol.getComponent(cc.Sprite).spriteFrame = asset;
            if (symbolName == '9') {
                this.staticSymbol.y = 19;
            } else if (symbolName == '1') {
                this.staticSymbol.y = -10;
            } else {
                this.staticSymbol.y = 0
            }
        } else {
            this.staticSymbol.opacity = 0;
        }
    },
    getSymbolName() {
        return this.symbolName;
    },
    changeToBlurSymbol(symbolName) {
        if (this.blurAssets["blur_" + symbolName]) {
            this.staticSymbol.active = true;
            this.spineSymbol.active = false;
            this.node.symbol = symbolName;
            this.staticSymbol.opacity = 255;
            this.staticSymbol.getComponent(cc.Sprite).spriteFrame = this.blurAssets["blur_" + symbolName];
            if (symbolName == '9') {
                this.staticSymbol.y = 19;
            } else {
                this.staticSymbol.y = 0
            }
        } else {
            this.changeToSymbol(symbolName);
        }
    },
    enableHighlight() {
        this.node.opacity = 255;
    },
    disableHighlight() {
        this.node.opacity = 180;
    },
    reset() {
        this.staticSymbol.stopAllActions();
        this.staticSymbol.opacity = 255;
        this.node.opacity = 255;
        this.staticSymbol.active = false;
        this.spineSymbol.active = true;
    },

    turnOnEventTouch(){
        this.node.getComponent(cc.Button).interactable = true;
    },

    turnOffEventTouch(){
        this.node.getComponent(cc.Button).interactable = false;
    },

    onClick(){
        const data = {
            pos: cc.v2(this.node.parent.parent.position.x, this.node.position.y),
            symbolName: this.symbolName,
            reelIndex: this.node.parent.parent.col
        }
        Emitter.instance.emit(EventCode.SOUND.SOUND_CLICK);
        Emitter.instance.emit(EventCode.TABLE.SHOW_PAYABLE_SYMBOL, data);
    },

    onDestroy() {
        removeEvents(this);
    },

});
