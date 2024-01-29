/**
 * Created by Nobita on 01/09/2022.
 */

const players = require('PlayerData').players;

(function () {
    cc.Xeng777InputView = cc.Class({
        extends: cc.Component,

        properties: {
            nodeParentChip: cc.Node,
            btnBets: [cc.Button],
            btnChips: [cc.Button],
            lbTotalBets: [cc.Label],
            lbTotalUserBets: [cc.Label],
            poolListContent: cc.Node,
            btnNextChipPool: cc.Button,
            btnPrevChipPool: cc.Button,
            btnBetX2: cc.Button,
            btnRepeat: cc.Button,
        },

        // LIFE-CYCLE CALLBACKS:

        onLoad() {
            this.controller = cc.Xeng777Controller.getInstance();
            this.controller.setInputView(this);
            this.betValue = 5000;
            this.nodeChipPress = [];
            let self = this;
            this.btnChips.forEach(function (btnChip) {
                self.nodeChipPress.push(btnChip.node.getChildByName('chipPress'));
            });
            // this.btnNextChipPool.interactable = false;
        },

        onDestroy: function () {
            this.controller.setInputView(null);
        },

        start() {

        },

        onChipClicked: function (event, value) {
            value = parseInt(value);
            if (value != this.betValue) {
                this.betValue = value;

                cc.AudioController.getInstance().playSound(cc.AudioTypes.CHIP_SELECT);
                this.resetChipSelected();
                this.updateCurrentChipSelected(event.target);
            }
        },

        resetChipSelected: function () {
            const self = this;
            this.btnChips.forEach(function (btnChip, index) {
                btnChip.interactable = true;
                cc.tween(btnChip.node).to(0.15, { scale: 1 }).start();

                self.getChipPress(btnChip.node).active = false;
            })

        },

        updateCurrentChipSelected: function (btnChip) {
            btnChip.interactable = false;
            cc.tween(btnChip).to(0.3, { scale: 1.1 }).start();

            this.getChipPress(btnChip).active = true;
        },

        getChipPress: function (btnChip) {
            // console.log(btnChip);
            const chipPress = btnChip.getChildByName("chipPress");

            return chipPress;
        },

        onNextPoolClicked: function () {
            const poolListView = this.poolListContent.parent;
            const minX = poolListView.width;
            let newX = this.poolListContent.x - 86;
            if (newX <= minX) {
                newX = minX;
                this.btnNextChipPool.interactable = false;
            }

            cc.tween(this.poolListContent).to(0.3, { position: cc.v2(newX, this.poolListContent.y) }).start();
            this.btnPrevChipPool.interactable = true;
        },

        onPrevPoolClicked: function () {
            const poolListView = this.poolListContent.parent;
            const maxX = this.poolListContent.width;
            let newX = this.poolListContent.x + 86;

            if (newX >= maxX) {
                newX = maxX;
                this.btnPrevChipPool.interactable = false;
            }

            cc.tween(this.poolListContent).to(0.3, { position: cc.v2(newX, this.poolListContent.y) }).start();
            this.btnNextChipPool.interactable = true;
        },

        // update (dt) {},
        activeAllButtonBet: function (active) {
            this.btnBets.forEach(function (btnBet) {
                btnBet.interactable = active;
            });
        },

        resetTable: function () {

        },

        onBetClick: function (event, betSide) {
            this.activeBetAgain(false);
            this.activeBetX2(false);
            cc.AudioController.getInstance().playSound(cc.AudioTypes.CHIP_BET);

            this.sendRequestBet(this.betValue, betSide);
        },

        activeBetAgain: function (active) {
            this.btnRepeat.node.active = active;
        },

        activeBetX2: function (active) {
            this.btnBetX2.node.active = active;
        },

        sendRequestBet: function (betValue, betSide) {
            return this.controller.sendRequestOnHub(cc.MethodHubName.BET, betValue, betSide);
        },

        playAnimationWin: function (sideWin) {

        },

        getBtnBets: function () {
            return this.btnBets;
        },

        getBtnBet: function (betSide) {
            return this.btnBets[betSide];
        },

        resetBet: function () {
            this.btnBets.forEach(function (btnBet) {
                const node = btnBet.node;
                const lbUserBet = node.getChildByName("lbUserBet").getComponent(cc.Label);
                const lbTotalUserBet = node.getChildByName("lbTotalUserBet").getComponent(cc.Label);
                lbUserBet.string = '';
                lbTotalUserBet.string = '';
            });
        },

        x2Clicked: function () {
            var unit = 2; //He so bet
            let logBet = this.controller.getBetLogBySessionID(this.controller.getBetLogSession());
            if (logBet.length === 0) {
                cc.PopupController.getInstance().showMessage("Chưa có dữ liệu của phiên trước.")
                return;
            }
            let currLog = this.getLogBetInfo(unit);
            currLog.map((betData, index) => {
                let timeOut = setTimeout(function () {
                    if (this.controller.getCurrentState() === cc.Xeng777Pharse.Betting && betData.sessionID === this.controller.getBetLogSession() - 1) {
                        this.sendRequestBet(betData.value, betData.betSide);
                    } else {
                        try {
                            clearTimeout(timeOut);
                        } catch (e) {
                            console.log(e);
                        }
                    }
                }.bind(this), index * 300);
            }, this);

            if (this.controller.getCurrentState() != cc.Xeng777Pharse.Waiting) {
                this.activeBetAgain(false);
                this.activeBetX2(false);
            }
        },

        repeatClicked: function () {
            var unit = 1; //He so bet
            let logBet = this.controller.getBetLogBySessionID(this.controller.getBetLogSession());
            if (logBet.length === 0) {
                cc.PopupController.getInstance().showMessage("Chưa có dữ liệu của phiên trước.")
                return;
            }
            let currLog = this.getLogBetInfo(unit);
            currLog.map((betData, index) => {
                let timeOut = setTimeout(function () {
                    if (this.controller.getCurrentState() === cc.Xeng777Pharse.Betting && betData.sessionID === this.controller.getBetLogSession() - 1) {
                        this.sendRequestBet(betData.value, betData.betSide);
                    } else {
                        try {
                            clearTimeout(timeOut);
                        } catch (e) {
                            console.log(e);
                        }
                    }
                }.bind(this), index * 300);
            }, this);

            if (this.controller.getCurrentState() != cc.Xeng777Pharse.Waiting) {
                this.activeBetAgain(false);
                this.activeBetX2(false);
            }
        },

        //Lay thong tin lich su bet
        getLogBetInfo: function (unit) {

            let logBet = this.controller.getBetLogBySessionID(this.controller.getBetLogSession());
            let listSide = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            let dataLogSide = [];

            //Map thong tin log bet cac cua bet
            if (logBet.length > 0) {
                listSide.map(side => {
                    dataLogSide[side] = logBet.filter(betData => betData.betSide == side);
                }, this);
            }

            //Tinh toan chip tung cua bet
            let finalLog = [];

            //Test Total
            dataLogSide.map((logSide) => {
                if (logSide.length > 0) {
                    let bet = this.calcLogBet(logSide, unit);
                    finalLog.push(...bet);
                }
            }, this);

            return finalLog;
        },
        //Tinh tong tien bet cua tung cua
        getTotalMoneyBetSide: function (logsBetSide, unit) {
            let totalMoney = 0;
            logsBetSide.map(betData => {
                totalMoney += parseInt(betData.value);
            }, this);
            return totalMoney * unit;
        },
        //Tinh toan luot bet
        calcLogBet: function (logsBetSide, unit) {

            let listChip = [5000000, 10000000, 5000000, 1000000, 500000, 100000, 50000, 10000, 5000, 1000];
            let totalMoney = this.getTotalMoneyBetSide(logsBetSide, unit);
            let listCalc = [];

            // Duyet tung chip trong danh sach chip
            for (let i in listChip) {
                let chip = listChip[i];
                // So luong chip tuong ung voi tong tien hien tai
                let countBets = Math.floor(totalMoney / chip);
                // Tinh toan so luong chip con lai tuong ung voi so tien con lai
                totalMoney -= countBets * chip;
                // gan chip vao list
                listCalc.push([chip, countBets]);
            }
            // Lay chip co so luong > 0
            let listLogBet = listCalc.filter(chip => chip[1] !== 0);

            //Chuyen data sang thong tin bet
            let logsBet = [];
            listLogBet.map(chipItem => {
                let countBets = chipItem[1];
                let value = chipItem[0];
                for (let i = 0; i < countBets; i++) {
                    logsBet.push({ value: value, betSide: logsBetSide[0].betSide, sessionID: logsBetSide[0].sessionID });
                }
            }, this);
            return logsBet;
        },

        sendRequestReBet: function (bet) {
            //kiem tra so du
            if (cc.BalanceController.getInstance().getBalance() < bet.Amount) {
                cc.PopupController.getInstance().showMessage('Số dư không đủ');
                return;
            } else {
                //send request
                cc.Xeng777Controller.getInstance().sendRequestOnHub(cc.MethodHubName.BET, bet.Amount, bet.Gate);
            }
        },
    });
}).call(this);
