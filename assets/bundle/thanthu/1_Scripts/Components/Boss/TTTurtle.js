const Emitter = require("TTEventEmitter");
const Config = require("TTConfig");
const DataStore = require("TTDataStore");
const EventCode = require("TTEventsCode");
const { registerEvent, removeEvents, formatMoney } = require("TTUtils");
cc.Class({
    extends: cc.Component,

    properties: {
        mainSpine: sp.Skeleton,
        vfxFadeIn: sp.Skeleton,
        vfxFadeOut: sp.Skeleton,
        egg: cc.Node,
        eggFly: cc.Node,
        listSmallEgg: [cc.Node],
        groupTable: cc.Node,
    },

    playAnimation(stepData) {
        const { matrix, matrixBoss } = stepData;
        this.node.active = true;
        this.node.runAction(cc.sequence(
            cc.callFunc(() => {
                this.egg.active = false;
                this.eggFly.position = this.egg.position;
                this.eggFly.active = true;
                this.eggFly.getComponent(sp.Skeleton).setAnimation(0, "Rua", false);
            }),
            cc.delayTime(0.4),
            cc.callFunc(() => {
                Emitter.instance.emit(EventCode.SOUND.SOUND_TURTLE_APPEAR);
                this.mainSpine.node.active = true;
                this.vfxFadeIn.node.active = true;
                this.vfxFadeIn.setAnimation(0, "animation", false);
                this.mainSpine.setAnimation(0, "Idle", true);
            }),
            cc.delayTime(0.4),
            cc.callFunc(() => {
                this.mainSpine.setAnimation(0, "Skill", false);
                this.mainSpine.addAnimation(0, "Idle", true);
            }),
            cc.delayTime(1),
            cc.callFunc(() => {
                this.shakingTable(0);
                Emitter.instance.emit(EventCode.SOUND.SOUND_TURTLE_HIT_1);
            }),
            cc.delayTime(0.4),
            cc.callFunc(() => {
                let listSymbolRemove = []
                matrix.forEach((col, indexCol) => {
                    col.forEach((row, indexRow) => {
                        if ([2, 3, 4, 5].includes(matrix[indexCol][indexRow])) {
                            listSymbolRemove.push({ x: indexCol, y: indexRow })
                        }
                    })
                })
                Emitter.instance.emit(EventCode.TABLE.TABLE_REMOVE_SYMBOLS_FOR_FALLING, listSymbolRemove);
                Emitter.instance.emit(EventCode.TABLE.TABLE_TURTLE_STONE, listSymbolRemove, matrix);
            }),
            cc.delayTime(1),
            cc.callFunc(() => {
                Emitter.instance.emit(EventCode.SOUND.SOUND_TURTLE_HIT_2);
                this.shakingTable(1);
            }),
            cc.delayTime(1),
            cc.callFunc(() => {
                Emitter.instance.emit(EventCode.TABLE.TABLE_FALLING_SYMBOLS, matrixBoss, () => { })
            }),
            cc.delayTime(1),
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

    shakingTable(type) {
        const time = 0.25;
        if (type == 0) {
            cc.tween(this.groupTable)
                .by(time / 4, { position: cc.v2(0, -10) }, { easing: "sineOut" })
                .by(time / 4, { position: cc.v2(0, 10) }, { easing: "sineOut" })
                .start();
        } else {
            cc.tween(this.groupTable)
                .by(time / 8, { position: cc.v2(0, 15) }, { easing: "sineOut" })
                .by(time / 8, { position: cc.v2(0, -30) }, { easing: "sineOut" })
                .by(time / 8, { position: cc.v2(0, 30) }, { easing: "sineOut" })
                .by(time / 8, { position: cc.v2(0, -15) }, { easing: "sineOut" })
                .start();
        }
    },

    reset() {
        this.groupTable.stopAllActions();
        this.groupTable.position = cc.v2(0, 0);
        this.node.stopAllActions();
        this.node.active = false;
        this.eggFly.active = false;
        this.egg.active = true;
        this.mainSpine.node.active = false;
        this.vfxFadeIn.node.active = false;
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
