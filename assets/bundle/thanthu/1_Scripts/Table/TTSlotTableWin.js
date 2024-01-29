
const { registerEvent, removeEvents } = require('TTUtils');
const Emitter = require('TTEventEmitter');
const EventCode = require('TTEventsCode');
const DataStore = require('TTDataStore');
const Config = require('TTConfig');
cc.Class({
    extends: cc.Component,
    properties: {
        table: cc.Node,
        symbolPrefab: cc.Prefab,
    },
    onLoad() {
        registerEvent(EventCode.COMMON.GAME_INIT, this.init, this);
        registerEvent(EventCode.TABLE.TABLE_SHOW_SYMBOL_WIN, this.showSymbolWin, this);
        registerEvent(EventCode.TABLE.TABLE_TURTLE_STONE, this.playTableStone, this);
        registerEvent(EventCode.TABLE.TABLE_CHANGE_SYMBOLS_BY_TYPE, this.playTableChangeSymbolByType, this);

    },
    init() {
        this.node.reels = [];
        this.tableFormat = Config.instance.TABLE_FORMAT;
        for (let col = 0; col < this.tableFormat.length; ++col) {
            this.node.reels[col] = [];
            let symbolStartY = (Config.instance.TABLE_FORMAT[col] / 2 - 0.5) * Config.instance.SYMBOL_HEIGHT;
            const rowNum = this.tableFormat[col];
            for (let row = 0; row < rowNum; ++row) {
                const symbol = cc.instantiate(this.symbolPrefab);
                symbol.name = "Symbol_" + col + "_" + row;
                symbol.parent = this.table;
                symbol.setPosition(this.getXPosition(col), symbolStartY - row * Config.instance.SYMBOL_HEIGHT);
                this.node.reels[col][row] = symbol;
            }
        }
        DataStore.instance.setSlotTableWin(this);
    },

    showSymbolWin(listSymbol, matrix) {
        Emitter.instance.emit(EventCode.SOUND.SOUND_SHOW_PAYLINE);
        for (let i = 0; i < listSymbol.length; i++) {
            let item = listSymbol[i];
            const symbolName = matrix[item.x][item.y];
            this.node.reels[item.x][item.y].showSymbol(symbolName);
        }
    },

    playTableStone(listSymbol, matrix) {
        for (let i = 0; i < listSymbol.length; i++) {
            let item = listSymbol[i];
            const symbolName = matrix[item.x][item.y];
            this.node.reels[item.x][item.y].playSymbolStone(symbolName, item.y);
        }
    },

    playTableChangeSymbolByType(data) {
        let { type, oldMatix, listChange } = data;
        for (let i = 0; i < listChange.length; i++) {
            let item = listChange[i];
            const obj = {
                type: type,
                oldSymbol: oldMatix[item.x][item.y],
                newSymbol: item.symbolName,
                pos: item,
            }
            this.node.reels[item.x][item.y].playSymbolChangeByType(obj);
        }
    },


    getXPosition(index) {
        let startX = -(this.tableFormat.length / 2 - 0.5) * Config.instance.SYMBOL_WIDTH;
        return (startX + Config.instance.SYMBOL_WIDTH * index);
    },

    resetOnExit() {

    },

    onDestroy() {
        removeEvents(this);
    },
});