(function () {
    let Xeng777Controller;

    Xeng777Controller = (function () {
        let instance;

        function Xeng777Controller() {
            this.sumaryAllSideBet = 0;
        }

        instance = void 0;

        Xeng777Controller.getInstance = function () {
            if (instance === void 0) {
                instance = this;
            }

            return instance.prototype;
        }

        Xeng777Controller.prototype.setView = function (view) {
            this.view = view;
        }

        Xeng777Controller.prototype.getView = function () {
            return this.view;
        }

        Xeng777Controller.prototype.sendRequestOnHub = function (method, data1, data2) {
            return this.view.sendRequestOnHub(method, data1, data2);
        };

        Xeng777Controller.prototype.getSpriteFrameSound = function (active) {
            return this.view.getSpriteFrameSound(active);
        }

        Xeng777Controller.prototype.getSpriteFrameMusic = function (active) {
            return this.view.getSpriteFrameMusic(active);
        }

        Xeng777Controller.prototype.muteSound = function (status) {
            return this.view.muteSound(status);
        }

        Xeng777Controller.prototype.muteMusic = function (status) {
            return this.view.muteMusic(status);
        }

        Xeng777Controller.prototype.soundStartBet = function () {
            return this.view.soundStartBet();
        }

        Xeng777Controller.prototype.soundStartResult = function () {
            return this.view.soundStartResult();
        }

        Xeng777Controller.prototype.soundEndResult = function () {
            return this.view.soundEndResult();
        }

        Xeng777Controller.prototype.soundBet = function () {
            return this.view.soundBet();
        }

        Xeng777Controller.prototype.soundResult = function (value) {
            return this.view.soundResult(value);
        }        

        Xeng777Controller.prototype.setInputView = function (inputView) {
            this.inputView = inputView;
        }

        Xeng777Controller.prototype.getInputView = function () {
            return this.inputView;
        }

        Xeng777Controller.prototype.setAnimationView = function (animationView) {
            this.animationView = animationView;
        }

        Xeng777Controller.prototype.getAnimationView = function () {
            return this.animationView;
        }

        Xeng777Controller.prototype.setBetView = function (betView) {
            this.betView = betView;
        }

        Xeng777Controller.prototype.getBetView = function () {
            return this.betView;
        }

        Xeng777Controller.prototype.showResult = function (result) {
            return this.animationView.showResult(result);
        }

        Xeng777Controller.prototype.showReward = function () {
            return this.animationView.showReward();
        }

        Xeng777Controller.prototype.resetUI = function () {
            return this.animationView.resetUI();
        }

        Xeng777Controller.prototype.showAniBetting = function () {
            return this.animationView.showAniBetting();
        }

        Xeng777Controller.prototype.setInfoView = function (infoView) {
            this.infoView = infoView;
        }

        Xeng777Controller.prototype.getInfoView = function () {
            return this.infoView;
        }

        Xeng777Controller.prototype.setChipView = function (chipView) {
            this.chipView = chipView;
        }

        Xeng777Controller.prototype.getChipViewView = function () {
            return this.chipView;
        }

        Xeng777Controller.prototype.onNotifyChangePhrase = function (info) {
            return this.infoView.onNotifyChangePhrase(info);
        }

        Xeng777Controller.prototype.getCurrentState = function () {
            return this.infoView.getCurrentState();
        }

        Xeng777Controller.prototype.updateTimer = function (time) {
            return this.infoView.updateTime(time)
        }

        Xeng777Controller.prototype.updatePlayerInfor = function (playerInfo) {
            return this.infoView.updatePlayerInfor(playerInfo);
        }

        Xeng777Controller.prototype.updatePlayersUI = function (playerInfos) {
            return this.infoView.updatePlayersUI(playerInfos);
        }

        Xeng777Controller.prototype.updateSessionId = function (sessionId) {
            return this.infoView.updateSessionId(sessionId);
        }

        Xeng777Controller.prototype.updatePlayersInGame = function (totalPlayer) {
            return this.infoView.updatePlayersInGame(totalPlayer);
        }

        Xeng777Controller.prototype.updateTotalUserBetSide = function (info) {
            return this.infoView.updateTotalUserBetSide(info);
        }

        Xeng777Controller.prototype.updateBetOfAccount = function (betValue, betSide) {
            this.sumaryAllSideBet += betValue;

            return this.infoView.updateBetOfAccount(betValue, betSide);
        }

        Xeng777Controller.prototype.updateTotalUserWin = function (amount) {
            return this.infoView.updateTotalUserWin(amount);
        };

        Xeng777Controller.prototype.setElapsed = function (elapsed ) {
            return this.elapsed = elapsed;
        };

        Xeng777Controller.prototype.getElapsed = function (elapsed ) {
            return this.elapsed;
        };

        // Xeng777Controller.prototype.winResultVip = function (dataPlayers) {
        //     return this.infoView.winResultVip(dataPlayers);
        // };

        Xeng777Controller.prototype.setJackpot = function (jackpot) {
            return this.infoView.setJackpot(jackpot);
        };

        // Xeng777Controller.prototype.winResult = function (dataPlayers) {
        //     return this.infoView.winResult(dataPlayers);
        // };

        Xeng777Controller.prototype.setWinResult = function (winResult) {
            this.winResult = winResult;
        }

        Xeng777Controller.prototype.getWinResult = function () {
            return this.winResult;
        }

        Xeng777Controller.prototype.setWinVipResult = function (winVipResult) {
            this.winVipResult = winVipResult;
        }

        Xeng777Controller.prototype.getWinVipResult = function () {
            return this.winVipResult;
        }

        Xeng777Controller.prototype.setTotalWinResult = function (totalWinResult) {
            this.totalWinResult = totalWinResult;
        }

        Xeng777Controller.prototype.getTotalWinResult = function () {
            return this.totalWinResult;
        }

        Xeng777Controller.prototype.updatePositionPlayerUI = function (positions) {
            return this.positionsUI = positions;
        }

        Xeng777Controller.prototype.positionPlayerUI = function () {
            return this.positionsUI;
        }

        Xeng777Controller.prototype.enableClickBet = function (enable) {
            return this.inputView.activeAllButtonBet(enable);
        }

        Xeng777Controller.prototype.getBtnBets = function () {
            return this.inputView.getBtnBets();
        }

        Xeng777Controller.prototype.getBtnBet = function (betSide) {
            return this.inputView.getBtnBet(betSide);
        }

        Xeng777Controller.prototype.resetBet = function () {
            return this.inputView.resetBet();
        }

        Xeng777Controller.prototype.activeBetX2 = function (enable) {
            return this.inputView.activeBetX2(enable);
        }

        Xeng777Controller.prototype.activeBetAgain = function (status) {
            return this.inputView.activeBetAgain(status);
        }

        Xeng777Controller.prototype.updateTotalBet = function (info) {
            return this.infoView.updateTotalBet(info);
        }

        Xeng777Controller.prototype.updateBalanceCurrPlayer = function (balance) {
            return this.infoView.updateBalanceCurrPlayer(balance);
        }

        Xeng777Controller.prototype.resetUserBets = function () {
            return this.infoView.resetUserBets();
        }

        Xeng777Controller.prototype.updateBalancePlayer = function (infos) {
            return this.infoView.updateBalancePlayer(infos);
        }

        Xeng777Controller.prototype.winResult = function (info) {
            return this.infoView.winResult(info);
        }

        Xeng777Controller.prototype.winResult2 = function (info) {
            return this.infoView.winResult(info);
        }

        Xeng777Controller.prototype.winResultVip = function (infos) {
            return this.infoView.winResultVip(infos);
        }

        Xeng777Controller.prototype.getTime = function () {
            return this.infoView.getTime();
        };

        Xeng777Controller.prototype.nFormatter = function (num, digits) {
            if (!digits) {
                digits = 2;
            }

            const lookup = [
                { value: 1, symbol: "" },
                { value: 1e3, symbol: "K" },
                { value: 1e6, symbol: "M" },
                { value: 1e9, symbol: "G" },
                { value: 1e12, symbol: "T" },
                { value: 1e15, symbol: "P" },
                { value: 1e18, symbol: "E" }
            ];
            const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
            var item = lookup.slice().reverse().find(function (item) {
                return num >= item.value;
            });
            return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
        }

        Xeng777Controller.prototype.formatNumber = function (num) {
            return cc.Tool.getInstance().formatNumber(num);
        }

        Xeng777Controller.prototype.clearBetLog = function (sessionID) {
            this.betLog = this.betLog.filter(log => log.sessionID > (sessionID - 1));
        };
        Xeng777Controller.prototype.getBetLogBySessionID = function (sessionID) {
            return this.betLog.filter(log => log.sessionID == sessionID - 1);
        };
        //Set betBlog
        Xeng777Controller.prototype.setBetLog = function (betInfo) {
            return this.betLog.push(betInfo);
        };
        //Lay thong tin betLog
        Xeng777Controller.prototype.getBetLog = function () {
            return this.betLog;
        };
        //Khoi tao/ reset betLog
        Xeng777Controller.prototype.initBetLog = function () {
            return this.betLog = [];
        };

        Xeng777Controller.prototype.setBetLogSession = function (sessionId) {
            return this.betLogSession = sessionId;
        };

        Xeng777Controller.prototype.getBetLogSession = function () {
            return this.betLogSession;
        };

        //Di chuyen chip
        Xeng777Controller.prototype.moveChipBet = function (betValue, betSide, type, accID) {
            return this.chipView.moveChipBet(betValue, betSide, type, accID);
        };

        //Lay lai chip thua
        Xeng777Controller.prototype.getChipsLose = function (sideLose, isTie) {
            return this.chipView.getChipsLose(sideLose, isTie);
        };
        //Tra chip thang
        Xeng777Controller.prototype.refundChips = function (sideWin) {
            return this.chipView.refundChips(sideWin);
        };

        //ClearAllChip
        Xeng777Controller.prototype.clearAllChips = function () {
            return this.chipView.clearAllChips();
        };

        //Khoi tao lai param chip
        Xeng777Controller.prototype.initParamChips = function () {
            return this.chipView.initParamChips();
        };

        //Update chip khi vao game
        Xeng777Controller.prototype.updateChipForBetSession = function (data) {
            return this.chipView.updateChipForBetSession(data);
        };

        Xeng777Controller.prototype.setBetView = function (betView) {
            return this.betView = betView;
        };

        Xeng777Controller.prototype.getBetView = function () {
            return this.betView;
        };

        Xeng777Controller.prototype.stopAnimationWin = function () {
            return this.betView.stopAnimationWin();
        };


        Xeng777Controller.prototype.setAssetView = function (assetView) {
            this.assetview = assetView;
        }

        Xeng777Controller.prototype.createChip = function (type) {
            return this.assetview.createChip(type);
        }

        Xeng777Controller.prototype.clearPools = function () {
            this.assetview.clearPools();
        }

        Xeng777Controller.prototype.setSoiCauView = function (soicauView) {
            this.soiCauView = soicauView;
        }

        Xeng777Controller.prototype.getSoiCauView = function () {
            return this.soiCauView;
        }

        Xeng777Controller.prototype.initListSoiCau = function (data) {
            return this.soiCauView.initListSoiCau(data);
        }

        Xeng777Controller.prototype.setMenuView = function (menuView) {
            this.menuView = menuView;
        }

        Xeng777Controller.prototype.getMenuView = function () {
            return this.menuView;
        }

        Xeng777Controller.prototype.destroyTopView = function () {
            return this.menuView.destroyTopView();
        };

        Xeng777Controller.prototype.destroyHelpView = function () {
            return this.menuView.destroyHelpView();
        };
		
		Xeng777Controller.prototype.destroyHistoryView = function () {
            return this.menuView.destroyHistoryView();
        };

        Xeng777Controller.prototype.createView = function (prefab, posY) {
            var nodeView = cc.instantiate(prefab);
            nodeView.parent = this.view.node;
            if (posY) {
                nodeView.setPosition(0, posY);
            } else {
                nodeView.setPosition(0, 0);
            }

            return nodeView;
        };

        Xeng777Controller.prototype.setHistoryView = function (historyView) {
            return this.historyView = historyView;
        };

        Xeng777Controller.prototype.getSpriteGateBet = function (gateBetId) {
            return this.historyView.getSpriteGateBet(gateBetId);
        };

        Xeng777Controller.prototype.getSpriteGateWin = function (gateWinId) {
            return this.historyView.getSpriteGateWin(gateWinId);
        };

        Xeng777Controller.prototype.setLastBetData = function (lastBetData) {
            return this.lastBetData = lastBetData;
        };

        Xeng777Controller.prototype.getLastBetData = function () {
            return this.lastBetData;
        };

        return Xeng777Controller;
    })();

    cc.Xeng777Controller = Xeng777Controller;
}).call(this);