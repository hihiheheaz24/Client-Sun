
(function () {
    cc.SicBoInfoView = cc.Class({
        "extends": cc.Component,
        properties: {
            lbSessionId: cc.Label,
            lbTimer: cc.Label,
            lbTotalPlayer: cc.Label,
            spState: sp.Skeleton,
            players: [cc.Xeng777Player],
            lbTotalUserWin: cc.Label,
            lbJackpot: cc.Label,
            blackMask:cc.Node
        },
        onLoad: function () {
            this.controller = cc.Xeng777Controller.getInstance();
            this.controller.setInfoView(this);

            this.currentState = null;
            this.interval = null;
            this.time = 0;

            this.currPlayer = this.players[0];
            this.animTotalUserWin = this.lbTotalUserWin.node.getComponent(cc.Animation);
        },
        onEnable: function () {
            //this.resetPlate();
        },

        onDestroy: function () {
            this.controller.setInfoView(null);

            try {
                if (this.interval) {
                    clearInterval(this.interval);
                }
            } catch (e) {

            }
        },

        onNotifyChangePhrase: function (info) {
            const state = parseInt(info.Phrase);
            const time = parseInt(info.Elapsed);

            switch (state) {
                case cc.Xeng777Pharse.None:
                    if (this.currentState !== state) {
                        this.updateTime(time);

                    }
                    break;
                case cc.Xeng777Pharse.Waiting:
                    if (this.currentState !== state) {
                        this.updateTime(time);

                        this.spState.node.active = false;
                        this.controller.soundStartBet();

                        this.controller.resetUI();
                        this.controller.clearAllChips();
                        //Khoi tao lai paramchip
                        this.controller.initParamChips();

                        this.controller.resetUserBets();

                        //Clear session truoc
                        this.controller.clearBetLog(this.controller.getBetLogSession());
                        //Tao session betlog
                        this.controller.setBetLogSession(this.controller.getBetLogSession() + 1);
                        this.resetPlayerUI();
                        this.updateTotalUserWin(null);
                        //this.showStatus("CHỜ PHIÊN MỚI");
                    }
                    break;

                case cc.Xeng777Pharse.Betting:
                    if (this.currentState !== state) {
                        this.updateTime(time);

                        this.blackMask.active = true;
                        this.spState.node.active = true;
                        this.controller.setWinResult(null);
                        this.controller.setWinVipResult(null);
                        this.controller.setTotalWinResult(null);
                        this.controller.enableClickBet(true);
                        this.controller.showAniBetting();
                        this.setStateAnim(state);
                    }
                    break;
                case cc.Xeng777Pharse.ShowResult:
                    if (this.currentState !== state) {
                        this.updateTime(time);

                        this.blackMask.active = false;
                        this.spState.node.active = true;
                        this.setStateAnim(state);

                        if (this.currentState != null) {
                            this.controller.showResult(info.Result);
                        }
                    }
                    break;
                case cc.Xeng777Pharse.Reward:
                    if (this.currentState !== state) {
                        this.updateTime(time);

                        this.spState.node.active = true;
                        this.setStateAnim(state);
                        this.controller.showReward();
                    }
                    break;
            }


            this.currentState = state;
            this.updateSessionId(info.SessionID);
        },

        getCurrentState: function () {
            return this.currentState;
        },

        setStateAnim: function (state) {
            switch (state) {
                case cc.Xeng777Pharse.Betting:
                    this.spState.setAnimation(0, cc.Xeng777StateAnim.BETTING, true);
                    break;
                case cc.Xeng777Pharse.ShowResult:
                    this.spState.setAnimation(0, cc.Xeng777StateAnim.SHOW_RESULT, true);
                    break;
                case cc.Xeng777Pharse.Reward:
                    this.spState.setAnimation(0, cc.Xeng777StateAnim.REWARD, true);
                    break;
            }
        },

        updateTime: function (time) {
            //Clear interval
            if (this.interval) {
                clearInterval(this.interval);
            }
            this.time = parseInt(time);
            this.startTimer();

            this.interval = setInterval(function () {
                this.startTimer();
            }.bind(this), 1000)
        },

        startTimer: function () {
            if (this.time < 0) {
                this.time = 0;
                return;
            }
            this.lbTimer.string = (this.time < 10 ? '0' : '') + this.time;
            this.time--;
        },

        //Cap nhat thong tin nguoi choi hien tai
        updatePlayerInfor: function (playerInfo) {
            this.currPlayer.registerPlayer(playerInfo.Account);
        },

        updatePlayersUI: function (playerInfos) {
            this.positionsUI = [0, 0, 0, 0, 0, 0, 0];
            let countPlayer = 0;
            this.positionsUI[countPlayer] = cc.LoginController.getInstance().getUserId();
            countPlayer++;
            playerInfos.map(player => {
                if (player.AccountID != cc.LoginController.getInstance().getUserId()) {
                    if (countPlayer <= 6) {
                        this.positionsUI[countPlayer] = player.AccountID;
                        countPlayer++;
                    }
                }
            }, this);

            //Hien thi player
            this.positionsUI.forEach(function (accID, index) {
                if (accID != 0) {
                    try {
                        let playerInfo = playerInfos.filter(player => player.AccountID == accID);
                        //Loai tru player hien tai
                        if (playerInfo.length > 0 && index != 0) {
                            this.players[index].registerPlayer(playerInfo[0].Account);
                        }
                    } catch (e) {
                        console.log(e);
                    }
                } else {
                    try {
                        //Reset lai vi tri cua player
                        this.players[index].unRegisterPlayer();
                    } catch (e) {
                        console.log(e);
                    }
                }
            }, this);
            this.controller.updatePositionPlayerUI(this.positionsUI);
        },

        updatePlayersInGame: function (totalPlayer) {
            this.lbTotalPlayer.string = totalPlayer;
        },

        //Cap nhat phien
        updateSessionId: function (sessionId) {
            this.lbSessionId.string = "#" + sessionId;
        },

        updatePlayersInGame: function (totalPlayer) {
            this.lbTotalPlayer.string = totalPlayer;
        },

        updateTotalBet: function (info) {
            this.updateTotalUserBetSide(info.Totals);
        },

        //Cap nhat balance cua player hien tai
        updateBalanceCurrPlayer: function (balance) {
            this.currPlayer.updateChipNormal(balance);
        },

        //Cap nhat balance player khac
        updateBalancePlayer: function (data) {
            let accID = data[0];
            let balance = data[3];
            if (this.positionsUI) {
                let indexPlayer = this.positionsUI.indexOf(accID);
                if (indexPlayer != -1) {
                    this.players[indexPlayer].updateChip(balance);
                }
            }

        },

        //Hien thi ket qua thang
        winResult: function (data) {
            this.currPlayer.playerResultUI(data.Award, data.Balance);
        },

        //Hien thi tien thang cua nguoi choi ngoi trong ban
        winResultVip: function (data) {
            data.map(player => {
                //Kiem tra player co trong mang hay ko
                if (this.positionsUI.includes(player.AccountID) && player.AccountID != cc.LoginController.getInstance().getUserId()) {
                    let indexPlayer = this.positionsUI.indexOf(player.AccountID);
                    this.players[indexPlayer].playerResultUI(player.Award, player.Balance);
                }
            }, this);
        },

        updateTotalUserWin: function (amount) {
            this.lbTotalUserWin.node.active = false;
            if (amount != null && amount != 0) {
                this.lbTotalUserWin.string = "+" + cc.Tool.getInstance().formatNumber(amount);
                this.lbTotalUserWin.node.active = true;
                this.lbTotalUserWin.node.scaleY = 0;
                this.animTotalUserWin.play('xxWin');
            }
        },

        //Update betValue
        updateBetOfAccount: function (betSide, totalBet) {
            if (totalBet <= 0) {
                return;
            }

            betSide = parseInt(betSide);
            //this.enableUserBet(betSide);
            let label = this.getLabelAccountBetBySide(betSide - 1);

            label.string = this.controller.formatNumber(totalBet);

        },

        updateTotalUserBetSide: function (data) {
            for (let i = 1; i <= 10; i++) {
                const betValue = data[i];
                if (betValue > 0) {
                    let betSide = i - 1;

                    this.enableUserBet(betSide);

                    let label = this.getLabelTotalBetBySide(betSide);
                    label.string = this.controller.formatNumber(betValue);
                }
            }
        },

        enableUserBet: function (betSide) {
            if (betSide > 9 || betSide < 0) {
                return;
            }

            const nodeBtnBet = this.controller.getBtnBet(betSide).node;

            const lbUserBet = nodeBtnBet.getChildByName("lbUserBet").getComponent(cc.Label);

            lbUserBet.node.active = true;
        },

        getLabelTotalBetBySide: function (betSide) {
            if (betSide > 9 || betSide < 0) {
                return;
            }

            const nodebtnBet = this.controller.getBtnBet(betSide).node;
            const lbTotalUserBet = nodebtnBet.getChildByName("lbTotalUserBet").getComponent(cc.Label);
            return lbTotalUserBet;
        },

        getLabelAccountBetBySide: function (betSide) {
            if (betSide > 9 || betSide < 0) {
                return;
            }

            // console.log('betSide', betSide);
            const nodebtnBet = this.controller.getBtnBet(betSide).node;
            //console.log(nodebtnBet);
            const lbTotalUserBet = nodebtnBet.getChildByName("lbUserBet").getComponent(cc.Label);
            //console.log(lbTotalUserBet);
            return lbTotalUserBet;
        },

        setJackpot: function (jackpot) {
            this.lbJackpot.string = 'X' + jackpot;
        },

        resetPlayerUI: function () {
            this.players.map(player => {
                player.resetPlayerResultUI();
            }, this)
        },

        resetUserBets: function () {
            const btnBets = this.controller.getBtnBets();
            for (let i = 0; i < btnBets.length; i++) {
                const item = btnBets[i];


                const userBet = item.node.getChildByName("lbUserBet");
                userBet.getComponent(cc.Label).string = "";
                userBet.active = false;
            }
            this.controller.activeBetAgain(true);
            this.controller.activeBetX2(true);
        },

        getTime: function () {
            return this.time;
        },
    })
}).call(this);