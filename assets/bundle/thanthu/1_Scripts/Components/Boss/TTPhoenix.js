const Emitter = require("TTEventEmitter");
const Config = require("TTConfig");
const DataStore = require("TTDataStore");
const EventCode = require("TTEventsCode");
const { changeParent, removeEvents } = require("TTUtils");
cc.Class({
    extends: cc.Component,

    properties: {
        mainSpine: sp.Skeleton,
        vfxFadeIn: sp.Skeleton,
        vfxFly: sp.Skeleton,
        egg: cc.Node,
        eggFly: cc.Node,
        listSmallEgg: [cc.Node],
        jpFlower: cc.Node,
        groupTable: cc.Node,
        belowLayer: cc.Node,
        vfxFadeOut: sp.Skeleton,

    },
    onLoad() {
        this.mainSpine.setMix('Idle', 'Skill_start', 0.2);
        this.mainSpine.setMix('Return', 'Idle', 0.2);
    },

    playAnimation(stepData) {
        this.node.active = true;
        this.node.runAction(cc.sequence(
            cc.callFunc(() => {
                Emitter.instance.emit(EventCode.SOUND.SOUND_TABLE_MOVE);
                DataStore.instance.phoenixInited = true;
                Emitter.instance.emit(EventCode.SOUND.SOUND_PLAY_BACKGROUND_MUSIC, 'bgm2');
                this.groupTable.runAction(cc.moveTo(0.5, cc.v2(0, -80)));
                this.jpFlower.runAction(cc.moveTo(0.5, cc.v2(-496, 290)));
                this.listSmallEgg.forEach(item => {
                    item.active = false;
                })
            }),
            cc.delayTime(1),
            cc.callFunc(() => {
                this.egg.active = false;
                this.eggFly.position = this.egg.position;
                this.eggFly.active = true;
                this.eggFly.getComponent(sp.Skeleton).setAnimation(0, "Chu_Tuoc", false);
            }),
            cc.delayTime(0.4),
            cc.callFunc(() => {
                this.vfxFadeIn.node.active = true;
                this.vfxFadeIn.setAnimation(0, "animation", false);
                Emitter.instance.emit(EventCode.SOUND.SOUND_PHOENIX_APPEAR);
            }),
            cc.delayTime(0.3),
            cc.callFunc(() => {
                this.mainSpine.node.active = true;
                this.mainSpine.setAnimation(0, "Idle", true);
            }),
        ))
    },

    playEffectChange(stepData) {
        const { matrix } = stepData;
        const { listSymbolChange, listSymbolDisable } = this.findSymbolChange(stepData);
        this.node.active = true;
        this.mainSpine.node.active = true;
        const durStart = this.mainSpine.findAnimation("Skill_start").duration;
        const durPlay = this.mainSpine.findAnimation("Skill_play").duration;
        const durReturn = this.mainSpine.findAnimation("Return").duration;
        this.node.runAction(cc.sequence(
            cc.callFunc(() => {
                changeParent(this.mainSpine.node, this.node);
                this.mainSpine.setAnimation(0, "Skill_start", false);
                this.mainSpine.addAnimation(0, "Skill_play", false);
                Emitter.instance.emit(EventCode.TABLE.TABLE_DISABLE_HIGHLIGHT, listSymbolDisable);
                Emitter.instance.emit(EventCode.SOUND.SOUND_PHOENIX_FLY); 
            }),
            cc.delayTime(0.5),
            cc.callFunc(() => {
                Emitter.instance.emit(EventCode.SOUND.SOUND_PHOENIX_CHANGE_SYMBOL); 
            }),
            cc.delayTime(0.5),
            cc.callFunc(() => {
                this.vfxFly.node.active = true;
                this.vfxFly.setAnimation(0, "animation", false);
                let obj = {
                    type: Config.instance.BOSS_IDS.PHOENIX,
                    oldMatix: matrix,
                    listChange: listSymbolChange
                }
                Emitter.instance.emit(EventCode.TABLE.TABLE_CHANGE_SYMBOLS_BY_TYPE, obj);

            }),

            cc.delayTime(durStart + durPlay - 1),
            cc.callFunc(() => {
                changeParent(this.mainSpine.node, this.belowLayer);
                this.mainSpine.setAnimation(0, "Return", false)
                Emitter.instance.emit(EventCode.SOUND.SOUND_PHOENIX_RETURN);
            }),
            cc.delayTime(durReturn - 0.2),
            cc.callFunc(() => {
                this.mainSpine.setAnimation(0, "Idle", true);

            }),
        ))
    },

    playEffectHide() {
        this.node.runAction(cc.sequence(
            cc.callFunc(() => {
                this.groupTable.runAction(cc.moveTo(0.5, cc.v2(0, 0)));
                this.jpFlower.runAction(cc.moveTo(0.5, this.jpFlower.originPos));
                this.vfxFadeOut.node.active = true;
                this.vfxFadeOut.setAnimation(0, "animation", false);
                this.mainSpine.setAnimation(0, "Disappear", false);
                Emitter.instance.emit(EventCode.SOUND.SOUND_TABLE_MOVE);
                DataStore.instance.phoenixInited = false;
                Emitter.instance.emit(EventCode.SOUND.SOUND_PLAY_BACKGROUND_MUSIC, 'bgm');
            }),
            cc.delayTime(0.5),
            cc.callFunc(() => {
                this.listSmallEgg.forEach(item => {
                    item.active = true;
                    item.opacity = 255;
                    item.scale = 1;
                    item.position = item.originPos;
                })
            }),

        ))
    },


    findSymbolChange(stepData) {
        const { matrix, matrixBoss } = stepData;
        const listSymbolChange = [];
        const listSymbolDisable = []
        let tableFormat = Config.instance.TABLE_FORMAT;
        for (let col = 0; col < tableFormat.length; ++col) {
            const rowNum = tableFormat[col];
            for (let row = 0; row < rowNum; ++row) {
                if (matrix[col][row] == matrixBoss[col][row]) {
                    listSymbolDisable.push({ x: col, y: row })
                } else {
                    listSymbolChange.push({ x: col, y: row, symbolName: matrixBoss[col][row] })
                }
            }
        }
        return { listSymbolChange, listSymbolDisable }
    },

    reset() {
        this.node.stopAllActions();
        this.node.active = false;
        this.eggFly.active = false;
        this.egg.active = true;
        this.mainSpine.node.active = false;
        this.vfxFadeIn.node.active = false;
        this.vfxFadeOut.node.active = false;
        this.vfxFly.node.active = false;
        changeParent(this.mainSpine.node, this.belowLayer);
        this.listSmallEgg.forEach(item => {
            item.active = false;
            item.position = cc.v2(-10, 441);
            item.stopAllActions();
            item.opacity = 0;
            item.scale = 1;
        })
        this.groupTable.position = cc.v2(0, 0);
        this.jpFlower.position = this.jpFlower.originPos
        this.vfxFadeIn.node.zIndex = 100;
        this.vfxFadeOut.node.zIndex = 100;
    },
    onDestroy() {
        removeEvents(this);
    },
});
