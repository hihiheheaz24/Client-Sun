
const { registerEvent, removeEvents } = require('TTUtils');
const Emitter = require('TTEventEmitter');
const EventCode = require('TTEventsCode');
const DataStore = require('TTDataStore');
const Config = require('TTConfig');

const ANIM_CONFIG = {
    ACTIVE: "Active",
    IDLE: "Idle",
    DISAPPEAR: "Disappear"
}

cc.Class({
    extends: cc.Component,

    properties: {
        spineSymbol: sp.Skeleton,
        symbols: {
            default: [],
            type: sp.SkeletonData,
        },
        particle: cc.Node,
        vfxTurtleBroken: sp.Skeleton,
        vfxAction: sp.Skeleton,
        vfxIdle: sp.Skeleton,
        vfxAppear: sp.Skeleton,
        spineVfxActions: [sp.SkeletonData],
        spineVfxAppears: [sp.SkeletonData],
        spineVfxIdles: [sp.SkeletonData],
    },

    onLoad() {
        this.node.mainComponent = this;
        this.node.showSymbol = this.showSymbol.bind(this);
        this.node.playSymbolStone = this.playSymbolStone.bind(this);
        this.node.playSymbolChangeByType = this.playSymbolChangeByType.bind(this);
        this.node.reset = this.reset.bind(this);
        this.reset();
    },
    showSymbol(symbolName) {
        this.reset();
        const asset = this.symbols[symbolName - 1];
        if (asset) {
            this.node.active = true;
            this.particle.active = true;
            this.spineSymbol.skeletonData = asset;
            this.spineSymbol.setAnimation(0, ANIM_CONFIG.ACTIVE, false);
            this.spineSymbol.addAnimation(0, ANIM_CONFIG.IDLE, true);
            this.node.runAction(cc.sequence(
                cc.delayTime(0.5),
                cc.fadeOut(0.1),
            ))
        }
    },

    playSymbolStone(symbolName, row) {
        this.reset();
        const asset = this.symbols[symbolName - 1];
        if (asset) {
            this.node.active = true;
            this.particle.active = false;
            this.spineSymbol.skeletonData = asset;
            this.spineSymbol.setAnimation(0, ANIM_CONFIG.IDLE, true);
            this.node.runAction(cc.sequence(
                cc.delayTime(row * 0.05),
                cc.callFunc(() => {
                    this.vfxTurtleBroken.node.active = true;
                    this.spineSymbol.setAnimation(0, "Broken_1", false);
                    this.vfxTurtleBroken.setAnimation(0, 'stone_symbol_' + symbolName, false);
                }),
                cc.delayTime(1.1),
                cc.callFunc(() => {
                    this.spineSymbol.setAnimation(0, "Broken_2", false);
                }),
                cc.delayTime(0.5),
                cc.callFunc(() => {
                    this.reset();
                })
            ))
        }
    },

    playSymbolChangeByType(data) {
        this.reset();
        switch (data.type) {
            case Config.instance.BOSS_IDS.DRAGON: {
                this.playFXDragon(data);
                break;
            }
            case Config.instance.BOSS_IDS.TIGER: {
                this.playFXTiger(data);
                break;
            }
            case Config.instance.BOSS_IDS.PHOENIX: {
                this.playFXPhoenix(data);
                break;
            }
        }

    },


    playFXDragon(data) {
        const { oldSymbol, newSymbol, pos } = data;
        const asset = this.symbols[oldSymbol - 1];
        if (asset) {
            this.node.active = true;
            this.particle.active = false;
            this.spineSymbol.skeletonData = asset;
            this.spineSymbol.setAnimation(0, ANIM_CONFIG.IDLE, true);
            this.vfxIdle.node.active = true;
            this.vfxIdle.skeletonData = this.spineVfxIdles[0];
            this.vfxIdle.setAnimation(0, 'animation', false);
            const durIdle = this.vfxIdle.findAnimation('animation').duration;
            this.node.runAction(cc.sequence(
                cc.delayTime(durIdle * 0.7),
                cc.callFunc(() => {
                    this.vfxAppear.node.active = true;
                    this.vfxAppear.skeletonData = this.spineVfxAppears[0];
                    this.vfxAppear.setAnimation(0, 'animation', false);
                    Emitter.instance.emit(EventCode.SOUND.SOUND_DRAGON_CHANGE_SYMBOL);
                }),
                cc.delayTime(0.2),
                cc.callFunc(() => {
                    this.spineSymbol.skeletonData = this.symbols[newSymbol - 1];
                    this.spineSymbol.setAnimation(0, ANIM_CONFIG.IDLE, true);
                    Emitter.instance.emit(EventCode.TABLE.UPDATE_SYMBOL, pos, newSymbol);
                }),
                cc.delayTime(0.5),
                cc.callFunc(() => {
                    this.reset();
                })
            ))
        }

    },

    playFXTiger(data) {
        const { oldSymbol, newSymbol, pos } = data;
        const asset = this.symbols[oldSymbol - 1];
        if (asset) {
            this.node.active = true;
            this.particle.active = false;
            this.spineSymbol.skeletonData = asset;
            this.spineSymbol.setAnimation(0, ANIM_CONFIG.IDLE, true);
            this.vfxAction.node.active = true;
            this.vfxAction.skeletonData = this.spineVfxActions[1];
            this.vfxAction.setAnimation(0, 'animation', false);
            this.node.runAction(cc.sequence(
                cc.delayTime(0.2),
                cc.callFunc(() => {
                    this.vfxIdle.node.active = true;
                    this.vfxIdle.skeletonData = this.spineVfxIdles[1];
                    this.vfxIdle.setAnimation(0, 'animation', false);
                }),
                cc.delayTime(0.4),
                cc.callFunc(() => {
                    this.vfxAppear.node.active = true;
                    this.vfxAppear.skeletonData = this.spineVfxAppears[1];
                    this.vfxAppear.setAnimation(0, 'animation', false);
                }),
                cc.delayTime(0.1),
                cc.callFunc(() => {
                    this.spineSymbol.skeletonData = this.symbols[newSymbol - 1];
                    this.spineSymbol.setAnimation(0, ANIM_CONFIG.IDLE, true);
                    Emitter.instance.emit(EventCode.TABLE.UPDATE_SYMBOL, pos, newSymbol);
                }),
                cc.delayTime(0.5),
                cc.callFunc(() => {
                    this.reset();
                })
            ))
        }
    },

    playFXPhoenix(data) {
        const { oldSymbol, newSymbol, pos } = data;
        const asset = this.symbols[oldSymbol - 1];
        if (asset) {
            this.node.active = true;
            this.particle.active = false;
            this.spineSymbol.skeletonData = asset;
            this.spineSymbol.setAnimation(0, ANIM_CONFIG.IDLE, true);
            this.node.runAction(cc.sequence(
                cc.delayTime(0.2),
                cc.callFunc(() => {
                    this.vfxIdle.node.active = true;
                    this.vfxIdle.skeletonData = this.spineVfxIdles[2];
                    this.vfxIdle.setAnimation(0, 'animation', false);
                }),
                cc.delayTime(0.4),
                cc.callFunc(() => {
                    this.vfxAppear.node.active = true;
                    this.vfxAppear.skeletonData = this.spineVfxAppears[2];
                    this.vfxAppear.setAnimation(0, 'animation', false);
                }),
                cc.delayTime(0.1),
                cc.callFunc(() => {
                    this.spineSymbol.skeletonData = this.symbols[newSymbol - 1];
                    this.spineSymbol.setAnimation(0, ANIM_CONFIG.IDLE, true);
                    Emitter.instance.emit(EventCode.TABLE.UPDATE_SYMBOL, pos, newSymbol);
                }),
                cc.delayTime(0.5),
                cc.callFunc(() => {
                    this.reset();
                })
            ))
        }
    },

    hideSymbol() {
        this.reset();
    },

    reset() {
        this.node.stopAllActions();
        this.node.opacity = 255;
        this.node.active = false;
        this.particle.active = false;
        this.vfxTurtleBroken.node.active = false;
        this.vfxAction.node.active = false;
        this.vfxIdle.node.active = false;
        this.vfxAppear.node.active = false;
    },

});
