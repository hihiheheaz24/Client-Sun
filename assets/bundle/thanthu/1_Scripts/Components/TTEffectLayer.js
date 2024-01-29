const Emitter = require('TTEventEmitter');
const Config = require('TTConfig');
const DataStore = require('TTDataStore');
const EventCode = require("TTEventsCode");
const { registerEvent, removeEvents, getPositionInOtherNode, getRotation, formatWalletMoney, getRandomInt } = require('TTUtils');

cc.Class({
    extends: cc.Component,
    properties: {
        particleSymbolMove: cc.Prefab,
        txtWinLineAmount: cc.Prefab,
        endPosParticleSymbol: cc.Node,
        endPosWinLineAmount: cc.Node,
        _listFX: [],
    },

    onLoad() {
        this.initEvents();
        this._listFX.length = 0;

    },

    initEvents() {
        registerEvent(EventCode.EFFECT_LAYER.EFFECT_SHOW_RESULT, this.showResult, this);
        registerEvent(EventCode.COMMON.GAME_INIT, this.onReset, this);
        registerEvent(EventCode.TABLE.TABLE_START_SPINNING, this.onReset, this);

    },

    showResult(data, callback) {
        this.callbackResult = callback;
        this.stepIndex = 0;
        this.playEffectByStepIndex(data, this.stepIndex);

    },

    playEffectByStepIndex(data, stepIndex) {
        const { matrix, isFirstStep, isLastItem } = data.Steps[stepIndex];
        //cc.warn("STEP " + stepIndex, data.Steps[stepIndex])
        if (isFirstStep) {
            Emitter.instance.emit(EventCode.TABLE.TABLE_STOP_SPINNING, matrix, () => {
                this.playEffectReward(data.Steps[stepIndex], () => {
                    if (isLastItem) {
                        this.callbackResult();
                        this.callbackResult = null;
                    } else {
                        this.stepIndex++;
                        this.playEffectByStepIndex(data, this.stepIndex);
                    }
                });
            });
        } else {
            Emitter.instance.emit(EventCode.TABLE.TABLE_FALLING_SYMBOLS, matrix, () => {
                this.playEffectReward(data.Steps[stepIndex], () => {
                    if (isLastItem) {
                        this.callbackResult();
                        this.callbackResult = null;
                    } else {
                        this.stepIndex++;
                        this.playEffectByStepIndex(data, this.stepIndex);
                    }
                });
            })
        }
    },

    playEffectReward(stepData, callback) {
        const { matrix, isLastItem, winLine, listSymbolIndexWin, TotalWin, ProcessItem, BossID, matrixBoss, phoenixInited, jackpotAmount } = stepData;
        const listAction = [];
        if (BossID) {
            if (BossID == Config.instance.BOSS_IDS.TURTLE) {
                listAction.push(cc.callFunc(() => {
                    Emitter.instance.emit(EventCode.FEATURE.PLAY_TURTLE, stepData);
                }))
                listAction.push(cc.delayTime(5.5))
            }
            if (BossID == Config.instance.BOSS_IDS.DRAGON) {
                listAction.push(cc.callFunc(() => {
                    Emitter.instance.emit(EventCode.FEATURE.PLAY_DRAGON, stepData);
                }))
                listAction.push(cc.delayTime(4.5))
            }

            if (BossID == Config.instance.BOSS_IDS.TIGER) {
                listAction.push(cc.callFunc(() => {
                    Emitter.instance.emit(EventCode.FEATURE.PLAY_TIGER, stepData);
                }))
                listAction.push(cc.delayTime(3.5))
            }

            if (BossID == Config.instance.BOSS_IDS.PHOENIX) {
                if (phoenixInited) {
                    listAction.push(cc.callFunc(() => {
                        Emitter.instance.emit(EventCode.FEATURE.PHOENIX_PLAY_EFFECT_CHANGE, stepData);
                    }))
                    listAction.push(cc.delayTime(4.5))
                } else {
                    listAction.push(cc.callFunc(() => {
                        Emitter.instance.emit(EventCode.FEATURE.PLAY_PHOENIX, stepData);
                    }))
                    listAction.push(cc.delayTime(4))
                    listAction.push(cc.callFunc(() => {
                        Emitter.instance.emit(EventCode.FEATURE.PHOENIX_PLAY_EFFECT_CHANGE, stepData);
                    }))
                    listAction.push(cc.delayTime(4.5))
                }
               
            }
        }

        if (TotalWin > 0) {
            listAction.push(cc.delayTime(0.5))
            listAction.push(cc.callFunc(() => {
                Emitter.instance.emit(EventCode.TABLE.TABLE_REMOVE_SYMBOLS_FOR_FALLING, listSymbolIndexWin);
                Emitter.instance.emit(EventCode.TABLE.TABLE_ENABLE_ALL_HIGHLIGHT);
                if (BossID == Config.instance.BOSS_IDS.TURTLE || BossID == Config.instance.BOSS_IDS.DRAGON || BossID == Config.instance.BOSS_IDS.TIGER || BossID == Config.instance.BOSS_IDS.PHOENIX || (phoenixInited && BossID == Config.instance.BOSS_IDS.PHOENIX)) {
                    Emitter.instance.emit(EventCode.TABLE.TABLE_SHOW_SYMBOL_WIN, listSymbolIndexWin, matrixBoss);
                } else {
                    Emitter.instance.emit(EventCode.TABLE.TABLE_SHOW_SYMBOL_WIN, listSymbolIndexWin, matrix);
                }
                this.playTxtWinLineAmount(winLine);

            }))
            listAction.push(cc.delayTime(0.4))
            listAction.push(cc.callFunc(() => {
                this.playParticleSymbolMove(listSymbolIndexWin);
            }))
            listAction.push(cc.delayTime(0.2))
            listAction.push(cc.callFunc(() => {
                Emitter.instance.emit(EventCode.PROGRESS_BAR.UPDATE_VALUE, ProcessItem);
                Emitter.instance.emit(EventCode.PAYLINE_INFO.PAYLINE_INFO_SHOW_WIN, TotalWin);
            }))
            listAction.push(cc.delayTime(1.5))

            if (jackpotAmount >= 0) {
                listAction.push(cc.callFunc(() => {
                    Emitter.instance.emit(EventCode.CUT_SCENE.SHOW_CUT_SCENE, "CutSceneJackpot", { jackpotAmount });
                    Emitter.instance.emit(EventCode.FEATURE.HIDE_JACKPOT_EGG);
                }))
                listAction.push(cc.delayTime(7.5))
            }
        }

        if (isLastItem) {
            const { TotalWin, BetValue } = DataStore.instance.getPlaySession();
            const { SMALL_WIN } = Config.instance.BIG_WIN_RATE;
            const isBigWin = TotalWin && TotalWin > BetValue * SMALL_WIN;
            if (isBigWin) {
                listAction.push(cc.callFunc(() => {
                    Emitter.instance.emit(EventCode.CUT_SCENE.SHOW_CUT_SCENE, "CutSceneBigWin", { TotalWin, BetValue });
                }))
                listAction.push(cc.delayTime(7.5))
            }
            if (TotalWin > 0) {
                listAction.push(cc.callFunc(() => {
                    Emitter.instance.emit(EventCode.PAYLINE_INFO.PAYLINE_INFO_SHOW_TOTAL_WIN, TotalWin);
                }))
                listAction.push(cc.delayTime(1))
            } else {
                listAction.push(cc.delayTime(0))
            }

            if (phoenixInited) {
                listAction.push(cc.callFunc(() => {
                    Emitter.instance.emit(EventCode.FEATURE.PHOENIX_PLAY_EFFECT_HIDE);
                }))
                listAction.push(cc.delayTime(1))
            }
        }
        listAction.push(cc.callFunc(() => {
            callback();
            if(isLastItem && DataStore.instance.getAutoSpin()){
                Emitter.instance.emit(EventCode.COMMON.CALL_SPIN);
            }
        }))
        this.node.runAction(cc.sequence(listAction));

    },

    playParticleSymbolMove(listSymbol) { // [{x,y}]
        const tableWin = DataStore.instance.getSlotTableWin();
        for (let i = 0; i < listSymbol.length; i++) {
            let item = listSymbol[i];
            const startPos = getPositionInOtherNode(this.node, tableWin.node.reels[item.x][item.y]);
            const endPos = getPositionInOtherNode(this.node, this.endPosParticleSymbol);
            const angle = getRotation(startPos, endPos) + 90;
            const particle = cc.instantiate(this.particleSymbolMove);
            this.node.addChild(particle);
            this._listFX.push(particle);
            particle.zIndex = Config.instance.Z_INDEX.PARTICLE_SYMBOL_MOVE;
            particle.setPosition(startPos)
            particle.angle = angle
            particle.runAction(cc.sequence(
                cc.moveTo(0.2, endPos),
                cc.removeSelf(true),
            ))
        }
    },

    playTxtWinLineAmount(winLine) {
        winLine.forEach(winLineInfo => {
            const { ItemPosition, WinAmount } = winLineInfo;
            const pos = ItemPosition[getRandomInt(0, ItemPosition.length - 1)];
            const tableWin = DataStore.instance.getSlotTableWin();
            const startPos = getPositionInOtherNode(this.node, tableWin.node.reels[pos.x][pos.y]);
            const endPos = getPositionInOtherNode(this.node, this.endPosWinLineAmount);
            const txtAmount = cc.instantiate(this.txtWinLineAmount);
            this.node.addChild(txtAmount);
            this._listFX.push(txtAmount);
            txtAmount.zIndex = Config.instance.Z_INDEX.TXT_WIN_LINE_MOVE;
            txtAmount.setPosition(startPos)
            txtAmount.getComponent(cc.Label).string = formatWalletMoney(WinAmount)
            txtAmount.runAction(cc.sequence(
                cc.delayTime(0.5),
                cc.moveTo(0.15, endPos),
                cc.removeSelf(true),
            ))
        })

    },


    onReset() {
        this.unscheduleAllCallbacks();
        this._listFX.forEach((item) => {
            item.stopAllActions();
            if (cc.isValid(item)) {
                item.destroy();
            }
        });
        this._listFX.length = 0;
    },
    onDestroy() {
        removeEvents(this);
    },


});
