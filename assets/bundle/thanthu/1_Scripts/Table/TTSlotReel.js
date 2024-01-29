

const Config = require('TTConfig');
const DataStore = require('TTDataStore');
const Emitter = require('TTEventEmitter');
const EventCode = require("TTEventsCode");
const { cloneObject } = require('TTUtils');
cc.Class({
    extends: cc.Component,
    properties: {
        reel: cc.Node,
    },

    onLoad() {
        this.node.mainComponent = this;
        this.MAX_STEP = Number.MAX_SAFE_INTEGER;
    },
    init(showNumber, col, symbolPrefab) {
        this.col = col;
        this.node.col = col;
        this.symbolList = Config.instance.SYMBOL_NAME_LIST[col];
        this.symbolPrefab = symbolPrefab;
        this.showNumber = showNumber;
        this.showSymbols = [];
        this.symbols = [];
        this.symbolPos = [];
        const { TOP, BOT } = Config.instance.TABLE_SYMBOL_BUFFER;
        this.totalNumber = this.showNumber + TOP + BOT;
        this.symbolStartY = - (Config.instance.TABLE_FORMAT[col] / 2 + BOT - 0.5) * Config.instance.SYMBOL_HEIGHT;
        for (let i = 0; i < this.totalNumber; ++i) {
            const symbol = cc.instantiate(this.symbolPrefab);
            symbol.name = "Symbol_" + i;
            symbol.parent = this.reel;
            symbol.setPosition(0, this.symbolStartY + i * Config.instance.SYMBOL_HEIGHT);
            const comp = symbol.getComponent('TTSlotSymbol');
            this.symbols.unshift(symbol);
            this.symbolPos.unshift(symbol.y);
            comp.changeToSymbol(this.getRandomSymbolName());
            if (i >= BOT && this.showSymbols.length < this.showNumber) {
                this.showSymbols.unshift(symbol);
            }
        }
        this.index = 0;
        this.reset();
    },

    moveOutSymbolForFalling(listSymbolIndex) {
        // Lấy các symbol bị remove => move lên trên
        if (!listSymbolIndex) listSymbolIndex = [];
        this.removeSymbolsIndex = [];
        listSymbolIndex.forEach(symbolIndex => {
            const symbol = this.getShowSymbol(symbolIndex);
            this.removeSymbolsIndex.push(symbolIndex);
        })
        this.removeSymbolsIndex.sort((a, b) => { return b - a });

        this.removeSymbolsIndex.forEach((symbolIndex, index) => {
            const symbol = this.showSymbols[symbolIndex];
            symbol.changeToSymbol(this.getRandomSymbolName());
            symbol.y = this.reel.y + index * Config.instance.SYMBOL_HEIGHT + (Config.instance.TABLE_FORMAT[this.col] - 1) * Config.instance.SYMBOL_HEIGHT;
        });

        // Sort lớn tới nhỏ
        this.symbols.sort(function (i, t) {
            return t.position.y - i.position.y;
        })
        for (let i = this.symbols.length - 1; i >= 0; i--) {
            const symbol = this.symbols[i];
            symbol.setSiblingIndex(this.symbols.length - 1);
        }
        const deltaY = this.reel.y;
        this.reel.y = 0;
        this.reel.children.forEach((child) => {
            child.y += deltaY;
        });
        this.index = 0;

    },

    fallingSymbols(matrix = [], callback) {
        const curentConfig = Config.instance.STATS[DataStore.instance.getMode()];
        this.showSymbols = [];
        this.matrix = matrix;
        this.callbackStopReel = callback ? callback : () => { };
        for (let i = this.symbols.length - 1; i >= 0; i--) { // từ dưới lên
            const symbol = this.symbols[i];
            if (i != 0 && i != this.symbols.length - 1) {
                this.showSymbols.unshift(symbol);
                symbol.changeToSymbol(this.matrix[this.matrix.length - i]);
                symbol.enableHighlight();
            }
            const posYCurrent = symbol.y;
            const posYEnd = this.symbolPos[i];

            const deltaY = Math.floor((Math.abs(posYCurrent - posYEnd) + 10) / Config.instance.SYMBOL_HEIGHT);
            symbol.runAction(cc.sequence(
                cc.delayTime((this.symbols.length - 1 - i) * curentConfig.REEL_DELAY_FALL),
                cc.moveTo(curentConfig.TIME * deltaY, 0, posYEnd),
                cc.callFunc(() => {
                    if(deltaY > 0){
                        Emitter.instance.emit(EventCode.SOUND.SOUND_DROP_SYMBOL);
                    }
                    if (i == 0) {
                        this.reset();
                        this.callbackStopReel();
                    }
                })
            ))
        }
    },


    disableHighlight(index) {
        this.showSymbols[index].disableHighlight();
    },

    getRandomSymbolName() {
        return this.symbolList[Math.floor(Math.random() * this.symbolList.length)];
    },

    getRandomSymbol() {
        let listSymbol = cloneObject(this.symbolList);
        if (!listSymbol[Math.floor(Math.random() * listSymbol.length)]) {
            cc.log("Error");
        }
        return listSymbol[Math.floor(Math.random() * listSymbol.length)];
    },

    reset() {
        // Sort lớn tới nhỏ
        this.symbols.sort(function (i, t) {
            return t.position.y - i.position.y;
        })
        for (let i = this.symbols.length - 1; i >= 0; i--) {
            const symbol = this.symbols[i];
            symbol.setSiblingIndex(this.symbols.length - 1);
        }
        this.reel.children.forEach((child, index) => {
            child.y = this.symbolPos[this.symbols.length - 1 - index];
        });
        this.reel.y = 0;
        this.index = 0;
        this.stop = 0;
        this.step = this.MAX_STEP;
        this.showResult = 0;
        this.matrix = [];
    },

    startSpinningWithDelay(col) {
        this.step = this.MAX_STEP - 1;
        this.isFastToResult = false;
        const curentConfig = Config.instance.STATS[DataStore.instance.getMode()];
        this.currentSpeed = curentConfig.TIME;

        let delayIndex = 0;
        if (col == 1 || col == 3) {
            delayIndex = 1;
        }
        if (col == 0 || col == 4) {
            delayIndex = 2;
        }
        const action3 = cc.sequence(
            cc.delayTime(delayIndex * curentConfig.REEL_DELAY_START),
            cc.moveBy(this.currentSpeed, 0, 25),
            cc.moveBy(this.currentSpeed, 0, -25),
            cc.callFunc(() => {
                this.runSpinning();
            }),
        );
        this.reel.runAction(action3);
    },
    runSpinning() {
        const curentConfig = Config.instance.STATS[DataStore.instance.getMode()];
        this.runSpinningAnimation(() => {
            if (this.step > this.showNumber) {
                this.runSpinning();
                this.step--;
                if (this.step < this.totalNumber) {
                    this.showResult = 1;
                }
            } else if (this.step == this.showNumber) {
                // check last reel, near win and not fast to result
                if (this.delayIndex === (Config.instance.TABLE_FORMAT.length - 1) && this.isNearWin && !this.isFastToResult) {
                    this.runStopAnimation(50, 0.2);
                } else {
                    this.runStopAnimation(curentConfig.REEL_EASING_DISTANCE, curentConfig.REEL_EASING_TIME);
                }
            }
        });
    },

    stopSpinningWithDelay(delay, matrix = [], callback) {
        const curentConfig = Config.instance.STATS[DataStore.instance.getMode()];
        this.delayIndex = delay;
        this.showSymbols = [];
        this.matrix = matrix;
        this.callbackStopReel = callback ? callback : () => { };
        let delayIndexStop = 0;
        if (delay == 1 || delay == 3) {
            delayIndexStop = 1;
        }
        if (delay == 0 || delay == 4) {
            delayIndexStop = 2;
        }
        let reelDelayStop = delayIndexStop * curentConfig.REEL_DELAY_STOP;
        this.isNearWin = false;
        this.delay = delay;
        cc.director.getScheduler().schedule(this.setStepToStop, this, 0, 0, reelDelayStop, false);

    },
    adjustReelSpeed(speed) {
        this.currentSpeed = speed;
    },

    setStepToStop() {
        const curentConfig = Config.instance.STATS[DataStore.instance.getMode()];
        this.step = curentConfig.STEP_STOP * 2 - this.totalNumber;
    },

    runStopAnimation(indexNearWin, time) {
        const curentConfig = Config.instance.STATS[DataStore.instance.getMode()];
        const timer = time ? time : curentConfig.TIME;
        this.onReelStop();
        const action3 = cc.sequence(
            cc.moveBy(timer, 0, -indexNearWin),
            cc.moveBy(timer, 0, indexNearWin),
            cc.callFunc(() => {
                this.reset();
                this.callbackStopReel();
                Emitter.instance.emit(EventCode.SOUND.SOUND_STOP_REEL, this.col);
                /// stop schedule when reel is stopped
                cc.director.getScheduler().unschedule(this.setStepToStop, this);
                this.currentSpeed = curentConfig.TIME;
            })
        );
        this.reel.runAction(action3);
    },
    onReelStop() {
        this.reel.children.forEach((child) => {
            child.changeToSymbol(child.symbol);
        });
    },

    runSpinningAnimation(callback) {
        let time = this.currentSpeed + this.currentSpeed * this.stop / 4;
        const action0 = cc.sequence(
            cc.moveBy(time, 0, -1 * Config.instance.SYMBOL_HEIGHT),
            cc.callFunc(this.circularSymbols, this),
            cc.callFunc(callback)
        );
        this.reel.runAction(action0);
    },
    circularSymbols() {
        const lastSymbol = this.reel.children[this.index % (this.totalNumber)];
        if (!this.showResult) {
            lastSymbol.changeToBlurSymbol(this.getRandomSymbolName());
        } else if (this.stop < this.totalNumber) {
            let isRealSymbol = this.stop >= Config.instance.TABLE_SYMBOL_BUFFER.TOP && this.stop < this.showNumber + Config.instance.TABLE_SYMBOL_BUFFER.TOP;
            let symbolValue = this.matrix[this.stop];
            this.step = this.totalNumber + this.showNumber - (this.stop + Config.instance.TABLE_SYMBOL_BUFFER.BOT);
            if (isRealSymbol) {
                symbolValue = this.matrix[this.stop - 1];
                lastSymbol.changeToSymbol(symbolValue);
                this.showSymbols.unshift(lastSymbol);
            } else {
                lastSymbol.changeToBlurSymbol(symbolValue);
            }
            this.stop++;
        }
        lastSymbol.y = lastSymbol.y + Config.instance.SYMBOL_HEIGHT * (this.totalNumber);
        this.index++;
    },

    getShowSymbol(index) {
        return this.showSymbols[index];
    },

    updateSymbols(listSymbol) {
        this.showSymbols.forEach((it, index) => {
            const nameSymbol = listSymbol[index];
            it.changeToSymbol(nameSymbol);
        });
    },

    updateSymbol(index, symbolName) {
        this.showSymbols[index].changeToSymbol(symbolName);
    },

    getRandomSymbolNameWithException(exceptionSymbol) {
        let symbol = this.symbolList[Math.floor(Math.random() * this.symbolList.length)];
        if (symbol == exceptionSymbol) {
            symbol = this.getRandomSymbolNameWithException(exceptionSymbol);
        }

        return symbol;
    },

    getRandomSymbolNameWithExceptions(exceptionSymbols) {
        const remainSymbols = [];
        const defaultSymbol = '3';
        if (!this.symbolList) return defaultSymbol; //case haven't init;
        for (let i = 0; i < this.symbolList.length; i++) {
            const symbol = this.symbolList[i];
            let res = true;
            for (let j = 0; j < exceptionSymbols.length; j++) {
                const exception = exceptionSymbols[j];
                if (symbol == exception) {
                    res = false;
                    break;
                }
            }
            if (res) {
                remainSymbols.push(symbol);
            }
        }
        let symbol = remainSymbols[Math.floor(Math.random() * remainSymbols.length)];
        return symbol;
    },
});