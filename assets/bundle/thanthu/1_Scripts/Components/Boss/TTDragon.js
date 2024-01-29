const Emitter = require("TTEventEmitter");
const Config = require("TTConfig");
const DataStore = require("TTDataStore");
const EventCode = require("TTEventsCode");
const { registerEvent, removeEvents, formatMoney, convertSymbolIndexToMatrix } = require("TTUtils");
cc.Class({
    extends: cc.Component,

    properties: {
        mainSpine: sp.Skeleton,
        vfxFadeIn: sp.Skeleton,
        vfxFadeOut: sp.Skeleton,
        vfxActionLeft: sp.Skeleton,
        vfxActionRight: sp.Skeleton,

        egg: cc.Node,
        eggFly: cc.Node,
        listSmallEgg: [cc.Node],
    },

    playAnimation(stepData) {
        const { matrix, matrixBoss } = stepData;
        this.node.active = true;
        this.node.runAction(cc.sequence(
            cc.callFunc(() => {
                this.egg.active = false;
                this.eggFly.position = this.egg.position;
                this.eggFly.active = true;
                this.eggFly.getComponent(sp.Skeleton).setAnimation(0, "Rong", false);
            }),
            cc.delayTime(0.4),
            cc.callFunc(() => {
                this.mainSpine.node.active = true;
                this.vfxFadeIn.node.active = true;
                this.vfxFadeIn.setAnimation(0, "animation", false);
                this.mainSpine.setAnimation(0, "Idle", true);
                Emitter.instance.emit(EventCode.SOUND.SOUND_DRAGON_APPEAR);

                let listSymbolDisable = [1, 2, 3, 4, 5, 6, 8, 10, 11, 12, 13, 14, 15, 16, 18, 20, 21, 22, 23, 24, 25];
                listSymbolDisable.forEach((symbolIndex, index) => {
                    listSymbolDisable[index] = convertSymbolIndexToMatrix(symbolIndex);
                });
                Emitter.instance.emit(EventCode.TABLE.TABLE_DISABLE_HIGHLIGHT, listSymbolDisable);
            }),
            cc.delayTime(0.4),
            cc.callFunc(() => {
                this.mainSpine.setAnimation(0, "Skill", false);
                this.mainSpine.addAnimation(0, "Idle", true);
            }),
            cc.delayTime(1),
            cc.callFunc(() => {
                this.vfxActionLeft.node.active = true;
                this.vfxActionLeft.setAnimation(0, "animation", false);
                Emitter.instance.emit(EventCode.SOUND.SOUND_DRAGON_HIT);
                let listSymbolChange = [{ x: 1, y: 1, symbolName: 1 }, { x: 1, y: 3, symbolName: 1 }]
                let obj = {
                    type: Config.instance.BOSS_IDS.DRAGON,
                    oldMatix: matrix,
                    listChange: listSymbolChange
                }

                Emitter.instance.emit(EventCode.TABLE.TABLE_CHANGE_SYMBOLS_BY_TYPE, obj);
            }),
            cc.delayTime(0.5),
            cc.callFunc(() => {
                this.vfxActionRight.node.active = true;
                this.vfxActionRight.setAnimation(0, "animation", false);
                Emitter.instance.emit(EventCode.SOUND.SOUND_DRAGON_HIT);
                let listSymbolChange = [{ x: 3, y: 1, symbolName: 1 }, { x: 3, y: 3, symbolName: 1 }]
                let obj = {
                    type: Config.instance.BOSS_IDS.DRAGON,
                    oldMatix: matrix,
                    listChange: listSymbolChange
                }
                Emitter.instance.emit(EventCode.TABLE.TABLE_CHANGE_SYMBOLS_BY_TYPE, obj);
            }),
            cc.delayTime(1.5),
            cc.callFunc(() => {
                this.vfxFadeOut.node.active = true;
                this.vfxFadeOut.setAnimation(0, "animation", false);
                this.mainSpine.setAnimation(0, "Disappear", false);
                Emitter.instance.emit(EventCode.SOUND.SOUND_BOSS_DISAPPEAR);
            }),
            cc.delayTime(0.8),
            cc.callFunc(() => {
                this.listSmallEgg.forEach((smallEgg) => {
                    smallEgg.active = true;
                    smallEgg.runAction(cc.spawn(
                        cc.moveTo(0.2, smallEgg.originPos),
                        cc.fadeIn(0.05)
                    ))
                })
            }),

        ))

    },



    reset() {
        this.node.stopAllActions();
        this.node.active = false;
        this.eggFly.active = false;
        this.egg.active = true;
        this.mainSpine.node.active = false;
        this.vfxFadeIn.node.active = false;
        this.vfxActionRight.node.active = false;
        this.vfxActionLeft.node.active = false;
        this.listSmallEgg.forEach(item => {
            item.active = false;
            item.position = cc.v2(-10, 441);
            item.stopAllActions();
            item.opacity = 0;
            item.scale = 1;
        })
    },
    onDestroy() {
        removeEvents(this);
    },
});
