/**
 * Created by Welcome on 5/28/2019.
 */
const players = require('PlayerData').players;

(function () {
    cc.LiveXXInputView = cc.Class({
        "extends": cc.Component,
        properties: {

            btnBetVals: [cc.Button],
            btnChips: [cc.Button],

            // btnChipsTxt: [cc.Label],

            btnX2: cc.Button,
            btnRepeat: cc.Button,
            //totalBet các cửa
            lbTotalBets: [cc.LabelIncrement],

            //totalBet các cửa của user
            lbTotalUserBets: [cc.LabelIncrement],
            lbBtnTip:cc.Label,
            lbDealer:cc.Label,
            jackpotEffect:sp.Skeleton,
            jackpotLabel:cc.LabelIncrement,
            jackpotNode:cc.Node
        },

        onLoad: function () {
            cc.LiveXXController.getInstance().setLiveXXInputView(this);

            //danh dau che do Nan
            this.isNan = false;
            cc.LiveXXController.getInstance().setIsNan(this.isNan);

            this.nodeChipPress = [];
            var self = this;
            this.btnChips.forEach(function (btnChip) {
                self.nodeChipPress.push(btnChip.node.getChildByName('Background'));
            });
            let configLiveXX = {
                betVals:[1000, 5000, 10000, 100000, 500000,1000000,5000000,10000000],
                maxBet: 500000000
            }
            cc.LiveXXController.getInstance().setRoomConfig(configLiveXX);

            //vi tri dealer

            //index chip
            this.chipIndex = 0;

            //mang cac gia tri Bet (map voi button)
            this.betVals = [1000, 5000, 10000, 100000, 500000,1000000,5000000,10000000];
            const config =   cc.LiveXXController.getInstance().getRoomConfig();
            this.betVals = config.betVals;
            this.maxBet = config.maxBet

            // this.btnChipsTxt.forEach((txtBet,index)=>{
            //     txtBet.string =  cc.Tool.getInstance().formatNumberTaiXiu(this.betVals[index]);
            // })
            this.processBetValUI();
            //reset lastBetData
            cc.LiveXXController.getInstance().setLastBetData(null);

            //reset totalBetUI
            this.resetTotalBetUI();

            //thoi gian giua cac lan dat (minisecond)
            this.timePerBet = 100;

            this.currentState = -1;

            //arr timeout reBet
            this.timeouts = [];

            //Vi tri cua groupUser

            this.initGateChip();
            cc.LiveXXController.getInstance().initLogBet();
        },
        initGateChip: function () {
            //Chip cua tung gate
            this.gateChips = [];
            //Khoi tao gateChip tung cua
            for (let i = 0; i <= 5; i++) {
                this.gateChips[i] = [];
            }
        },

        //HubOn - PlayerBet
        playerBet: function (info) {
            //dam bao joinGame xong moi xu ly - tranh loi server neu bi
            if (cc.LiveXXController.getInstance().getPositions()) {
                var accID = info[0];
                var amount = info[1];
                var gate = info[2];
                var chip = info[3];
                let userIndex = cc.LiveXXController.getInstance().getIndexUIBetByAccID(accID);
                }
              
        },
        showLastInput: function (info) {
            // console.log('LiveXXInput showLastInput');
            var self = this;
            var betLogs = info;
            //duyet qua betLog của tat ca player
            betLogs.forEach(function (betLog) {
                //duyet qua cac luot bet cua player
                betLog.forEach(function (bet) {
                    let userIndex = cc.LiveXXController.getInstance().getIndexUIBetByAccID(bet.AccountID);
                    if(userIndex!= -1){
                        //them tong dat o cac cua (cua user)
                        if (bet.AccountID === cc.LoginController.getInstance().getUserId()) {
                            cc.LiveXXController.getInstance().setLogBet({
                                'AccountID': bet.AccountID,
                                'Amount': bet.BetValue,
                                'Gate': bet.BetSide
                            });
                            self.totalUserBets[bet.BetSide - 1] += bet.BetValue;
                            self.lbTotalUserBets[bet.BetSide - 1].tweenValueto(self.totalUserBets[bet.BetSide - 1]);
                        }
                        self.playFxUserBet(
                            cc.LiveXXController.getInstance().getIndexUIBetByAccID(bet.AccountID),
                            bet.BetSide,
                            self.getChipIndexFromValue(bet.BetValue),
                            false
                        );
                    }
                    
                })
            });
        },


        //lay ve player bet
        getPlayerBets: function () {
            return players;
        },

        //lay ve index loai Chip bet
        getChipIndexFromValue: function (betVal) {
            var index = 0;
            var length = this.betVals.length;
            for (var i = 0; i < length; i++) {
                if (betVal === this.betVals[i]) {
                    index = i;
                    break;
                }
            }
            return index;
        },

        //tat/bat cac button chuc nang
        activeAllButtonBet: function (enable) {
            this.btnBetVals.forEach(function (btnBet) {
                btnBet.interactable = enable;
            });
            this.btnX2.interactable = enable;
            this.btnRepeat.interactable = enable;
        },
        disableBtnBetAgain:function(enable)
        {
            this.btnRepeat.interactable = enable;
        },
        //button bet val đang chon ko click duoc
        processBetValUI: function () {
            for (var i = 0; i < this.btnChips.length; i++) {
                this.btnChips[i].interactable = true;                
            }
            this.btnChips[this.chipIndex].interactable = false;
            this.lbBtnTip.string = "TIP DEALER "+cc.Tool.getInstance().formatNumberK(this.betVals[this.chipIndex]);
        },

        //reset mang chip cac player
        resetInput: function () {
            players.forEach(function (player) {
                player.chips = [];
            });
        },
        tipDealer: function () {
            cc.LiveXXController.getInstance().tipDealer(this.betVals[this.chipIndex]);
        },
        updateTotalBet:function(info)
        {
            if (info.Phrase==cc.LiveXXState.BETTING) {
                this.lbTotalBets[0].tweenValueto(info.TotalBetOdd);
                this.lbTotalBets[1].tweenValueto(info.TotalBetThreeUp);
                this.lbTotalBets[2].tweenValueto(info.TotalBetThreeDown);
                this.lbTotalBets[3].tweenValueto(info.TotalBetEven);
                this.lbTotalBets[4].tweenValueto(info.TotalBetFourUp);
                this.lbTotalBets[5].tweenValueto(info.TotalBetFourDown);
                for (let index = 0; index < 6; index++) {
                    this.lbTotalBets[index].getComponent(cc.Animation).play('scaleLoop');
                }
            }
            this.lbDealer.string ="Dealer: "+ info.Dealer;
        },
        updateBetAmountGate:function(data)
        {
            this.totalUserBets[data.BetSide-1] = data.SumaryBet;
            this.lbTotalUserBets[data.BetSide-1].tweenValueto(data.SumaryBet);
            var logBet  =
                {
                    'SId': cc.LiveXXController.getInstance().getSID(),
                    'Amount': data.BetValue,
                    'Gate': data.BetSide
                };
            cc.LiveXXController.getInstance().setLogBet(logBet);
            this.btnX2.interactable = true;
        },
        clearAllTimeOut: function () {
            this.timeouts.forEach(function (timeOut) {
                clearTimeout(timeOut);
            });
            this.timeouts = [];
        },

        resetTotalBetUI: function () {
            this.totalBets = [0, 0, 0, 0, 0, 0];
            this.totalUserBets = [0, 0, 0, 0, 0, 0];

            this.lbTotalBets.forEach(function (lbTotalBet) {
                lbTotalBet.tweenValueto(0);
            });

            for (let index = 0; index < this.lbTotalUserBets.length; index++) {
                this.lbTotalUserBets[index].label.string = "";
            }
        },

        betOfAccount: function (data) {
            console.log(data);
        },
        //save lai du lieu last bet
        saveLastBetData: function () {
            var betLog = [];
            var uID = cc.LoginController.getInstance().getUserId();
            var player = players[0];
            var self = this;
            player.chips.forEach(function (chip) {
                betLog.push(
                    {
                        'AccountID': uID,
                        'Amount': self.betVals[chip.chipIndex],
                        'Gate': chip.gate
                    }
                );
            });
            let logBet = [...cc.LiveXXController.getInstance().getLogBet()];

            cc.LiveXXController.getInstance().setLastBetData(logBet);
        },

        updateInput: function (state) {
            //check state de xu ly hien thi
            switch (state) {
                //giai doan dat cuoc
                case cc.LiveXXState.BETTING: //54
                    if (this.currentState !== state) {
                        this.clearAllTimeOut();
                        this.resetInput();
                        this.activeAllButtonBet(true);
                    }

                    break;
                //giai doan mo bat
                case cc.LiveXXState.OPEN_PLATE:
                    if (this.currentState !== state) {
                        this.clearAllTimeOut();
                        this.activeAllButtonBet(false);
                        this.saveLastBetData();
                    }
                    break;

                //giai doan ket qua
                case cc.LiveXXState.SHOW_RESULT: //15
                    if (this.currentState !== state) {
                        this.activeAllButtonBet(false);
                    }
                    break;

                //giai doan cho phien moi
                case cc.LiveXXState.WAITING:
                    if (this.currentState !== state) {
                        this.resetInput();
                        this.activeAllButtonBet(false);
                        this.resetTotalBetUI();
                        //Khoi tao logBet moi
                    }
                    break;
                //xoc dia
                case cc.LiveXXState.SHAKING:
                    if (this.currentState !== state) {
                        this.resetTotalBetUI();
                        this.resetInput();
                        this.activeAllButtonBet(false);
                    }
                    break;
            }

            //luu lai state hien tai
            this.currentState = state;
        },
        showJackpotEffect:function(amount, gate)
        {
            console.log("Show Jackpot Effect:"+amount+"| GateID: "+gate);
            this.jackpotNode.active = true;
            this.jackpotLabel.node.active = true;
            this.jackpotLabel.label.string = "0";
            this.jackpotLabel.tweenValueto(amount);
            this.jackpotEffect.setSkin("Result_"+gate)
            this.jackpotEffect.clearTracks();
            this.jackpotEffect.setToSetupPose();
            this.jackpotEffect.setAnimation(0,'appear',false);
            this.jackpotEffect.addAnimation(0,'idle',true);
            cc.director.getScheduler().schedule(function () {
                this.jackpotEffect.setAnimation(0,'disappear',false)
                this.jackpotLabel.node.active = false;
                cc.director.getScheduler().schedule(function () {
                    this.jackpotNode.active = false;
                }.bind(this), this, 0, 0, 2, false);
            }.bind(this), this, 0, 0, 5, false);
        },
        //Lay danh sach chip tung gate
        getGateChips: function () {
            return this.gateChips;
        },
        //hieu ung chip khi 1 user bet
        playFxUserBet: function (playerId, gate, chipIndex, isMove) {
            if(playerId == -1) return;
            cc.AudioController.getInstance().playSound(cc.AudioTypes.CHIP_BET);
        },
        //chon muc bet
        betValueClicked: function (event, data) {
            cc.AudioController.getInstance().playSound(cc.AudioTypes.CHIP_SELECT);
            this.chipIndex = parseInt(data.toString());
            this.processBetValUI();
        },

        //dat cua
        betClicked: function (event, data) {
            if (cc.LiveXXController.getInstance().getTime() <= 3) {
                cc.PopupController.getInstance().showMessage('Đã hết thời gian đặt cửa.');
                cc.LiveXXController.getInstance().activeAllButtonBet(false);
                return;
            }

            
            this.indexBet = parseInt(data.toString());
            if (this.indexBet==0&&this.totalUserBets[3]>0) {
                cc.PopupController.getInstance().showMessage('Chỉ được phép đặt chẵn hoặc lẻ.');
                return;
            }
            if (this.indexBet==3&&this.totalUserBets[0]>0) {
                cc.PopupController.getInstance().showMessage('Chỉ được phép đặt chẵn hoặc lẻ.');
                return;
            }
            var betVal = this.betVals[this.chipIndex];
            //cc.warn("betClicked", data, betVal )

            //kiem tra so du
            if (cc.BalanceController.getInstance().getBalance() < betVal) {
                cc.PopupController.getInstance().showMessage('Số dư không đủ');
                return;
            } else {
                //send request
                cc.LiveXXController.getInstance().sendRequestOnHub(cc.MethodHubName.BET, betVal, this.indexBet + 1);
                //dat -> tat luon nut X2 + reBet
                this.btnRepeat.interactable = false;
            }
        },
        x2Clicked: function () {
            if (cc.LiveXXController.getInstance().getTime() <= 3) {
                cc.PopupController.getInstance().showMessage('Đã hết thời gian đặt cửa.');
                cc.LiveXXController.getInstance().activeAllButtonBet(false);
                return;
            }
            var sID = cc.LiveXXController.getInstance().getSID();
            var betData = cc.LiveXXController.getInstance().getLogBetBySID(sID);
            if (betData && betData.length > 0) {
                let totalBet = this.calculatorTotalBet(betData);
                if (cc.BalanceController.getInstance().getBalance() < totalBet) {
                    cc.PopupController.getInstance().showMessage('Số dư không đủ');
                    return;
                } 
                betData.forEach((item,index)=>{
                    setTimeout(() => {
                        cc.LiveXXController.getInstance().sendRequestOnHub(cc.MethodHubName.BET, item.Amount, item.Gate);
                    }, index*100);
                }) 
                    
            } else {
                cc.PopupController.getInstance().showMessage('Không có dữ liệu đặt của phiên trước.');
                this.btnX2.interactable = false;
            }
        },

        repeatClicked: function () {
            if (cc.LiveXXController.getInstance().getTime() <= 3) {
                cc.PopupController.getInstance().showMessage('Đã hết thời gian đặt cửa.');
                cc.LiveXXController.getInstance().activeAllButtonBet(false);
                return;
            }
            var sID = cc.LiveXXController.getInstance().getSID();
            var betData = cc.LiveXXController.getInstance().getLogBetBySID(sID-1);
            if (betData && betData.length > 0) {
                let totalBet = this.calculatorTotalBet(betData);
                if (cc.BalanceController.getInstance().getBalance() < totalBet) {
                    cc.PopupController.getInstance().showMessage('Số dư không đủ');
                    return;
                } 
                betData.forEach((item,index)=>{
                    setTimeout(() => {
                        cc.LiveXXController.getInstance().sendRequestOnHub(cc.MethodHubName.BET, item.Amount, item.Gate);
                    }, index*100);
                })
            } else {
                cc.PopupController.getInstance().showMessage('Không có dữ liệu đặt của phiên trước.');
            }
            this.btnRepeat.interactable = false;
        },
        calculatorTotalBet:function(data)
        {
            let total = 0;
            for (let index = 0; index < data.length; index++) {
                total +=data.Amount;
            }
            return total;
        }
    });
}).call(this);
