


const GameConfig = require('TTConfig');
const Config = require('TTConfig');
const { convertSlotMatrixTBLR, duplicateElements, convertSymbolIndexToMatrix, cloneObject } = require('TTUtils');
const TTDataStore = cc.Class({
    ctor() {

        this.PLAYER_DATA = {
            wallet: 0,
            tryWallet: 20000000
        }

        this.ROOM_DATA = {
            Mode: "NORMAL",
            BetID: null,
            List_JP: [],
            IsAutoSpin: false,
            IsTurboMode: false,
            IsTry: false,
            tryIndex: -1,

        }

        this.readyToPlay = false;
        this.playSession = {},
        this.phoenixInited = false;
        this.slotTableWin = null;
        this.isEnableBGM = false,
        this.isEnableSFX = false;
        this.tryData = [];
        this.tryDataIndex = -1;
    },

    setTryData(tryData) {
        this.tryData = tryData;
    },

    getTryData() {
        this.ROOM_DATA.tryIndex++;
        if(this.ROOM_DATA.tryIndex == this.tryData.length){
            this.ROOM_DATA.tryIndex = 0; 
        }
        return cloneObject(this.tryData[this.ROOM_DATA.tryIndex]);
    },

    setTryMode(IsTry) {
        this.ROOM_DATA.IsTry = IsTry;
        if(IsTry){
            this.ROOM_DATA.tryIndex = -1;
        }
    },

    getTryMode() {
        return this.ROOM_DATA.IsTry;
    },


    setSlotTableWin(table) {
        this.slotTableWin = table;
    },

    getSlotTableWin() {
        return this.slotTableWin;
    },

    getPlaySession() {
        return this.playSession;
    },

    formatData(playSession) {
        const TABLE_FORMAT = Config.instance.TABLE_FORMAT;
        //cc.warn(cloneObject(playSession));
        this.playSession = playSession;
        let phoenixInited = false;
        let checkJP = false;
        let { TotalWin, Steps, JackpotData } = playSession;
        if (Array.isArray(Steps)) {
            let newStepsData = []
            for (let i = 0; i < Steps.length; i++) {
                let newData = {};
                newData.index = i;
                if (i == 0) {
                    newData.isFirstStep = true
                };
                let { ItemID, ItemIDNew, ThanThu, WinGroup, ProcessItem } = Steps[i];
                newData.matrix = convertSlotMatrixTBLR(ItemID, TABLE_FORMAT);
                if (phoenixInited) {
                    newData.phoenixInited = phoenixInited;
                }
                if (i == Steps.length - 1) {
                    newData.isLastItem = true;
                }
                if (ThanThu > 0) {
                    newData.BossID = ThanThu;
                    if (ThanThu == Config.instance.BOSS_IDS.PHOENIX) {
                        phoenixInited = true;
                    }
                }

                if (ItemIDNew) {
                    newData.matrixBoss = convertSlotMatrixTBLR(ItemIDNew, TABLE_FORMAT);
                }
                if (ProcessItem >= 350 && !checkJP && JackpotData) {
                    checkJP = true;
                    newData.jackpotAmount = JackpotData.Amount;
                }
                newData.ProcessItem = ProcessItem;
                if (Array.isArray(WinGroup)) {
                    let TotalWin = 0;
                    newData.winLine = [];
                    let listSymbolIndexWin = [];
                    WinGroup.forEach(winItem => {
                        let { ItemPosition, WinAmount } = winItem;
                        ItemPosition.forEach((symbolIndex, index) => {
                            ItemPosition[index] = convertSymbolIndexToMatrix(symbolIndex);
                            listSymbolIndexWin.push(ItemPosition[index]);
                        })
                        TotalWin = TotalWin + WinAmount
                        newData.winLine.push(winItem);
                    });
                    newData['TotalWin'] = TotalWin;
                    newData.listSymbolIndexWin = duplicateElements(listSymbolIndexWin);
                }
                newStepsData.push(newData)
            }
            playSession.Steps = newStepsData;
        }

        //cc.warn("%c data-update ", "color: red", this.playSession);
        return this.playSession;
    },

    setReadyToPlay(readyToPlay) {
        this.readyToPlay = readyToPlay;
    },

    isReadyToPlay() {
        return this.readyToPlay;
    },

    setWallet(wallet, forceUpdateRealWallet) {
        if(this.getTryMode() && !forceUpdateRealWallet){
            this.PLAYER_DATA.tryWallet = wallet;
        } else {
            this.PLAYER_DATA.wallet = wallet;
        } 
    },
    getWallet() {
        if(this.getTryMode()){
            return this.PLAYER_DATA.tryWallet;
        }
        return this.PLAYER_DATA.wallet;
    },

    getJPValue() {
        let betIndex = Config.instance.BET_ID.indexOf(this.ROOM_DATA.BetID);
        if(betIndex>=0){
            return parseInt(this.ROOM_DATA.List_JP[betIndex]);
        }
        return null;
    },
    setListJP(data) {
        const arrayJP = data.split('|');
        this.ROOM_DATA.List_JP = arrayJP;
    },


    getCurrentBetValue(){
        return Config.instance.BETS[this.ROOM_DATA.BetID];
    },
    setBetID(BetID) {
        this.ROOM_DATA.BetID = BetID;
    },
    getBetID() {
        return this.ROOM_DATA.BetID;
    },
    setMode(modeName = 'NORMAL') {
        this.ROOM_DATA.Mode = modeName;
    },
    getMode() {
        return this.ROOM_DATA.Mode;
    },

    setTurboMode(IsTurboMode) {
        this.ROOM_DATA.IsTurboMode = IsTurboMode;
    },
    getTurboMode() {
        return this.ROOM_DATA.IsTurboMode;
    },

    setAutoSpin(IsAutoSpin) {
        this.ROOM_DATA.IsAutoSpin = IsAutoSpin;
    },
    getAutoSpin() {
        return this.ROOM_DATA.IsAutoSpin;
    },

    calculateWalletAfterClickSpin() {
        if(this.getTryMode()) return true;
        return this.PLAYER_DATA.wallet - Config.instance.BETS[this.ROOM_DATA.BetID] >= 0;
    },

    destroy() {
        TTDataStore.instance = null;
    }
});

TTDataStore.instance = null;
module.exports = TTDataStore;
