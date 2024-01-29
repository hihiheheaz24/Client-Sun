
const { registerEvent, removeEvents } = require('TTUtils');
const Emitter = require('TTEventEmitter');
const EventCode = require('TTEventsCode');
const DataStore = require('TTDataStore');
const Config = require('TTConfig');
cc.Class({
    extends: cc.Component,
    properties: {
        table: cc.Node,
        reelPrefab: cc.Prefab,
        symbolPrefab: cc.Prefab,
    },
    onLoad() {
        registerEvent(EventCode.COMMON.GAME_INIT, this.init, this);
        registerEvent(EventCode.TABLE.TABLE_START_SPINNING, this.startSpinning, this);
        registerEvent(EventCode.TABLE.TABLE_STOP_SPINNING, this.stopSpinning, this);
        registerEvent(EventCode.TABLE.TABLE_FALLING_SYMBOLS, this.fallingSymbols, this);
        registerEvent(EventCode.TABLE.TABLE_REMOVE_SYMBOLS_FOR_FALLING, this.removeSymbolsForFalling, this);
        registerEvent(EventCode.TABLE.TABLE_RESET, this.resetOnExit, this);
        registerEvent(EventCode.TABLE.UPDATE_SYMBOL, this.updateSymbol, this);
        registerEvent(EventCode.TABLE.TABLE_DISABLE_HIGHLIGHT, this.disableHighlightSymbols, this);
        registerEvent(EventCode.TABLE.TABLE_ENABLE_ALL_HIGHLIGHT, this.enableHighlightAllSymbols, this);
    },
    init() {
        this.node.reels = [];
        this.tableFormat = Config.instance.TABLE_FORMAT;
        for (let col = 0; col < this.tableFormat.length; ++col) {
            const reel = cc.instantiate(this.reelPrefab);
            reel.name = "Reel_" + col;
            reel.parent = this.table;
            reel.mainComponent.init(this.tableFormat[col], col, this.symbolPrefab);
            reel.setPosition(this.getXPosition(col), 0);
            this.node.reels[col] = reel.mainComponent;
        }
    },

    updateSymbol(config, symbolName) {
        this.node.reels[config.x].updateSymbol(config.y, symbolName);
    },

    removeSymbolsForFalling(listSymbol = []) {
        const matrixRemove = [];
        listSymbol.forEach(symbolData => {
            const { x, y } = symbolData;
            if (!matrixRemove[x]) matrixRemove[x] = [];
            matrixRemove[x].push(y);
        });
        for (let col = 0; col < this.node.reels.length; ++col) {
            this.node.reels[col].moveOutSymbolForFalling(matrixRemove[col]);
        }


    },
    getXPosition(index) {
        let startX = -(this.tableFormat.length / 2 - 0.5) * Config.instance.SYMBOL_WIDTH;
        return (startX + Config.instance.SYMBOL_WIDTH * index);
    },


    startSpinning() {
        for (let col = 0; col < this.node.reels.length; ++col) {
            this.node.reels[col].startSpinningWithDelay(col);
        }
    },

    fallingSymbols(data, callback) {
        this.matrix = data;
        this.stopSpinningCallbackCount = 0;
        for (let col = 0; col < this.tableFormat.length; ++col) {
            const currentCol = this.matrix[col];
            let matrix = [];
            for (let row = currentCol.length - 1; row >= 0; --row) {
                let symbolValue = currentCol[row];
                matrix.push(symbolValue);
            }
            this.node.reels[col].fallingSymbols(matrix, this.checkStopSpinningCallback.bind(this, matrix, callback));
        }
    },

    stopSpinning(data, callback) {
        this.matrix = data;
        this.stopSpinningCallbackCount = 0;
        for (let col = 0; col < this.tableFormat.length; ++col) {
            const currentCol = this.matrix[col];
            let matrix = [];
            for (let row = currentCol.length - 1; row >= 0; --row) {
                let symbolValue = currentCol[row];
                matrix.push(symbolValue);
            }
            this.node.reels[col].stopSpinningWithDelay(col, matrix, this.checkStopSpinningCallback.bind(this, matrix, callback));
        }
    },
    checkStopSpinningCallback(matrix, callback) {
        this.stopSpinningCallbackCount++;
        const count = this.stopSpinningCallbackCount;
        if (count >= this.node.reels.length && callback && typeof callback == "function") {
            callback();
        }
    },

    showStaticSymbol(col, row, symbol, isShow) {
        if (!this.node.reels || !this.node.reels[col] || !this.node.reels[col].showSymbols) return;
        const staticSymbol = this.node.reels[col].showSymbols[row];
        if (staticSymbol && staticSymbol.symbol === symbol) {
            staticSymbol.opacity = isShow ? 255 : 0;
        }
    },

    disableHighlightSymbols(listSymbol) {
        listSymbol.forEach(item => {
            this.node.reels[item.x].disableHighlight(item.y);
        })
    },

    enableHighlightAllSymbols() {
        for (let col = 0; col < this.tableFormat.length; ++col) {
            this.node.reels[col].reel.children.forEach((symbol) => {
                symbol.enableHighlight();
            });
        }
    },


    resetOnExit() {

    },

    onDestroy() {
        removeEvents(this);
    },
});