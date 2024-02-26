/**
 * Created by Nofear on 3/22/2019.
 */

var slotsConfig = require('SlotsConfig');
var gameMessage = require('GameMessage');
const Configs = require("../../../shootFish/common/Configs");
var roomIdGaiNhay = [1,2,4];

var autoSpinNumbers = [10, 25, 50, 100, 200, 500, 1000, 2000, 5000];

(function () {
    cc.SpinView = cc.Class({
        extends: cc.SpinViewBase,
        properties: {
            spinColumnViews: [cc.SpinColumnView],
            lblDisplayName: cc.Label,
            sprTrial: [cc.SpriteFrame],
            btnSpin: cc.Node,
            lbBetVal: cc.Label,
            lbAutoSpinTimes: cc.Label,
            sprCrazyProcess: [cc.SpriteFrame],
            sprCrazyProcessNormal: [cc.SpriteFrame],
            // nodeCrazyProcess: [cc.Node],
            lbiBigWinAmount: cc.LabelIncrement,

            effectBigWin: cc.Node,
            _isTrial: false,
            _currentRoomID: 1,
            _autoSpinIndex: 0,
            _currentAutoSpinNumber: 0,
        },

        onEnable: function() {
            cc.GaiNhayController.getInstance().setSpinView(this);
            cc.SpinController.getInstance().randomIcon();


            this.lblDisplayName.string = cc.LoginController.getInstance().getNickname();


            // this.btnSpin.on(cc.Node.EventType.MOUSE_ENTER, function() {
            //     this.btnSpin.children[0].runAction(cc.rotateBy(0.3, -720));
            // }.bind(this));
            // this.btnSpin.on(cc.Node.EventType.MOUSE_LEAVE, function() {
            //     this.btnSpin.children[0].runAction(cc.rotateBy(0.3, 720));
            //     cc.director.getScheduler().schedule(function() {
            //         this.btnSpin.children[0].runAction(cc.rotateTo(0, 0));
            //     },this, 0, 0, 0.5, false);
            // }.bind(this));
            this._autoSpinIndex = 0;
            this._currentAutoSpinNumber = autoSpinNumbers[8];
        },

        //khi click SPIN goi ham nay
        callSpin: function () {
            cc.log("click spin gameeee ")
            this.effectBigWin.active = false;
            if (this.betLinesText === '') {
                cc.PopupController.getInstance().showSlotsMessage(gameMessage.YOU_NOT_CHOOSE_BET_LINES);
                return;
            }

            //kiem tra so du
            if (!this.checkBalance()) return;

            cc.AudioController.getInstance().playSound(cc.AudioTypes.SPIN);
            //danh danh trang thai dang SPIN
            this.isSpining = true;
            var self = this;
            this.indexSpin = 0;

            //Set time goi STOP va time goi SPIN cot theo mode
            if (this.isFastSpin) {
                this.timeBetweenCol = slotsConfig.TIME_COLUMN_FAST;
                this.timeStop = slotsConfig.TIME_CALL_STOP_FAST;
            } else {
                this.timeBetweenCol = slotsConfig.TIME_COLUMN_NORMAL;
                this.timeStop = slotsConfig.TIME_CALL_STOP_NORMAL;
            }

            //Stop tat ca cac Effect
            this.resetSpin();

            //Khoa Click cac button chuc nang
            this.spinController.activeButtonSpin(false);

            //Request len server de lay ket qua
            if (this.spinAccountID < 0) {
                this.roomController.sendRequestOnHub(cc.MethodHubName.SPIN_TRY);
            } else {
                if (cc.FreeSpinController.getInstance().getStateFreeSpin()) {
                    this.roomController.sendRequestOnHub(cc.MethodHubName.FREE_SPIN);
                } else {
                    this.roomController.sendRequestOnHub(cc.MethodHubName.SPIN, this.betLinesText);
                }
            }

            //this.startSpin();
        },

        //goi khi STOP SPIN xong
        stopSpinFinish: function () {
            this.indexStopFinish++;
            //Khi ca 5 cot deu dung thi cho SPIN tiep
            if (this.indexStopFinish === 5) {
                //doi lai trang thai
                this.isSpining = false;

                /*
                //Bat lai Click cac button chuc nang
                this.spinController.activeButtonSpin(true);*/

                //Lay ve ket qua de hien giai thuong + hieu ung + xu ly neu co bonus game hoac minigame
                this.spinResponse = cc.SpinController.getInstance().getSpinResponse();
                this.bonusGameData = this.spinResponse.BonusGame;
                var account = this.spinResponse.Account;


                if (cc.FreeSpinController.getInstance().getStateFreeSpin()) {
                    this.spinData = this.spinResponse.FreeSpinData;
                } else {
                    this.spinData = this.spinResponse.SpinData;
                    //Bat lai Click cac button chuc nang
                    if (this.bonusGameData.BonusData === null) {
                        //ko co bonus game. Ko co freespin thi bat lai cac button
                        this.spinController.activeButtonSpin(true);
                    }

                    if (this.spinData.CrazyBousData === null) {
                        //ko co bonus game. Ko co freespin thi bat lai cac button
                        this.spinController.activeButtonSpin(true);
                    } else {
                        this.spinController.activeButtonSpin(false);
                    }
                }

                //Update lai balance sau khi SPIN
                if (this.spinResponse.AccountID < 0) {
                    cc.BalanceController.getInstance().updateTryBalance(account.TotalStar);

                } else {
                    cc.BalanceController.getInstance().updateBalance(account.TotalStar);
                }

                var haveWILD = false;
                //Check xem cos WILD ko thi hien Expand WILD truoc
                this.spinColumnViews.forEach(function (spinColumnView) {
                    if (spinColumnView.checkActiveWild()) {
                        haveWILD = true;
                    }
                });

                //co WILD thi cho xong hieu ung WILD moi hien hieu ung thang
                if (haveWILD) {
                    //this.spinController.activeButtonSpin(true);
                    if (cc.FreeSpinController.getInstance().getStateFreeSpin()) {
                        var timePlayEffectWild = slotsConfig.TIME_PLAY_EFFECT_EXPAND_WILD_FREE_SPIN;
                    } else {
                        if (this.isFastSpin) {
                            timePlayEffectWild = slotsConfig.TIME_PLAY_EFFECT_EXPAND_WILD_FAST;
                        } else {
                            timePlayEffectWild = slotsConfig.TIME_PLAY_EFFECT_EXPAND_WILD;
                        }
                        cc.AudioController.getInstance().playSound(cc.AudioTypes.EXPAND_WILD);
                    }
                    var self = this;
                    this.scheduler.schedule(function () {
                        self.playEffect(self.spinData);
                    }, this, 0, 0, timePlayEffectWild, false);
                } else {
                    this.playEffect(this.spinData);
                }


            }
        },


        playEffect: function (spinData) {
            var self = this;

            var timeWaitJackpot = 0;
            //kiem tra co trung jackpot ko?
            if (spinData.IsJackpot) {
                cc.EffectController.getInstance().playEffect(cc.EffectType.JACKPOT, spinData.PaylinePrize);
                cc.PayLinesController.getInstance().playEffect(spinData.PrizeLines, -1); //jackpot delay = -1
                cc.AudioController.getInstance().playSound(cc.AudioTypes.WIN_JACKPOT);

                //stop autoSpin
                this.isAutoSpin = false;
                this.spinController.activeButtonAutoSpin(this.isAutoSpin);
                timeWaitJackpot = 2;
            }

            //neu co jackpot thi hien Jackpot 2s sau do moi check tiep
            this.scheduler.schedule(function () {
                self.checkHaveBonusGame();

                //dang ko phai la freeSpin thi moi check
                if (cc.FreeSpinController.getInstance().getStateFreeSpin() === false && spinData.TotalFreeSpin > 0) {
                    //tat auto SPIN
                    this.isAutoSpin = false;
                    this.spinController.activeButtonAutoSpin(this.isAutoSpin);

                    this.lbiTotalWin.tweenValueto(this.spinData.PaylinePrize);

                    //duoc freespin -> kich hoạt freespin sau xx giay
                    cc.PopupController.getInstance().showSlotsMessage(
                        gameMessage.GET_FREE_SPIN
                        + spinData.FreeCoefficient
                    );
                    this.scheduler.schedule(function () {
                        cc.FreeSpinController.getInstance().activeFreeSpin(true);
                        cc.FreeSpinController.getInstance().updateFreeSpinText(spinData.TotalFreeSpin);
                        //reset totalWin UI ve 0
                        self.lbiTotalWin.setValue(0);
                    }, this, 0, 0, slotsConfig.TIME_WAIT_START_FREE_SPIN, false);

                    return;
                } else if (cc.FreeSpinController.getInstance().getStateFreeSpin()) {
                    cc.FreeSpinController.getInstance().updateFreeSpinText(spinData.TotalFreeSpin);
                }

                if (cc.FreeSpinController.getInstance().getStateFreeSpin()) {
                    //update Win UI = totalPrize
                    this.lbiTotalWin.tweenValueto(this.spinData.TotalPrize);
                } else {
                    //choi normal = PaylinePrize
                    this.lbiTotalWin.tweenValueto(this.spinData.PaylinePrize);
                }


                //Van con freespin thi bat lai nut quay luon (truong hop = 0 phai cho het anim)
                if (cc.FreeSpinController.getInstance().getStateFreeSpin() && spinData.TotalFreeSpin > 0) {
                    //Bat lai Click cac button chuc nang
                    this.spinController.activeButtonSpin(true);
                } else if (!cc.FreeSpinController.getInstance().getStateFreeSpin()) {
                    //Bat lai Click cac button chuc nang
                    this.spinController.activeButtonSpin(true);
                }

                if (spinData.PaylinePrize > 0) { //PaylinePrize //TotalPrize
                    if (!spinData.IsJackpot) {
                        if (spinData.PaylinePrize >= this.spinResponse.BetValue * cc.Config.getInstance().getMultiplierByRoomId(this.spinResponse.RoomID)) {
                            this.node.runAction(
                                cc.sequence(
                                    cc.callFunc(
                                        function() {
                                            cc.EffectController.getInstance().playEffect(cc.EffectType.BIG_WIN, this.spinResponse.BetValue * cc.Config.getInstance().getMultiplierByRoomId(this.spinResponse.RoomID), self.isFastSpin ? slotsConfig.TIME_TWEEN_MONEY_STEP_1 : slotsConfig.TIME_TWEEN_MONEY_STEP_1);
                                            cc.AudioController.getInstance().playSound(cc.AudioTypes.COUNT);
                                        }, this),
                                    cc.delayTime(3.5),
                                    cc.callFunc(
                                        function() {
                                            this.effectBigWin.active = true;
                                            this.lbiBigWinAmount.tweenValueto(spinData.PaylinePrize, slotsConfig.TIME_TWEEN_MONEY_FAST);
                                            cc.AudioController.getInstance().playSound(cc.AudioTypes.COUNT_END);
                                        },this),
                                )
                            )
                            // cc.EffectController.getInstance().playEffect(cc.EffectType.BIG_WIN, spinData.PaylinePrize, self.isFastSpin ? slotsConfig.TIME_TWEEN_MONEY_FAST : null); //PaylinePrize
                            cc.PayLinesController.getInstance().playEffect(spinData.PrizeLines, self.isFastSpin ? slotsConfig.TIME_MONEY_EFFECT_BIG_WIN_GAI_NHAY : slotsConfig.TIME_MONEY_EFFECT_BIG_WIN_GAI_NHAY);
                            cc.AudioController.getInstance().playSound(cc.AudioTypes.BIG_WIN);
                            this.scheduler.schedule(function () {
                                self.checkHaveFreeSpin(spinData);
                            }, this, 0, 0, self.isFastSpin ? slotsConfig.TIME_MONEY_EFFECT_BIG_WIN_GAI_NHAY : slotsConfig.TIME_MONEY_EFFECT_BIG_WIN_GAI_NHAY, false);
                        } else {
                            cc.EffectController.getInstance().playEffect(cc.EffectType.NORMAL_WIN, spinData.PaylinePrize, self.isFastSpin ? slotsConfig.TIME_TWEEN_MONEY_FAST : null); //PaylinePrize
                            cc.PayLinesController.getInstance().playEffect(spinData.PrizeLines, self.isFastSpin ? slotsConfig.TIME_MONEY_EFFECT_NORMAL_WIN_FAST : slotsConfig.TIME_MONEY_EFFECT_NORMAL_WIN);
                            cc.AudioController.getInstance().playSound(cc.AudioTypes.NORMAL_WIN);
                            this.scheduler.schedule(function () {
                                self.checkHaveFreeSpin(spinData);
                            }, this, 0, 0, self.isFastSpin ? slotsConfig.TIME_MONEY_EFFECT_NORMAL_WIN_FAST : slotsConfig.TIME_MONEY_EFFECT_NORMAL_WIN, false);
                        }
                    }

                    //set gia tri base phuc vu cho viec choi X2
                    cc.X2GameController.getInstance().setBaseValue(this.spinResponse.SpinData.DoubleSet);
                    //da khi quay xong -> chua co data
                    cc.X2GameController.getInstance().setX2GameData(this.spinResponse.X2Game);

                    //Tk that moi choi duoc x2
                    if (this.spinResponse.AccountID > 0 && this.spinResponse.SpinData.DoubleSet > 0) {
                        //Neu thang thi bat button X2 len
                        cc.SpinController.getInstance().activeButtonX2(true);
                    } else {
                        cc.SpinController.getInstance().activeButtonX2(false);
                    }
                } else {
                    //THua -> ko lam gi
                    this.scheduler.schedule(function () {
                        self.checkHaveFreeSpin(spinData);
                    }, this, 0, 0, self.isFastSpin ? slotsConfig.TIME_WAIT_LOST_FAST : slotsConfig.TIME_WAIT_LOST, false);
                }
            }, this, 0, 0, timeWaitJackpot, false);

            this.updateIconDataCrazy(spinData.CrazyProcess);

            if(this.checkHaveCrazyGame(spinData)) {
                this.scheduler.schedule(function() {
                    cc.MainController.getInstance().createCrazyGameView();
                    cc.AudioController.getInstance().playSound(cc.AudioTypes.CRAZY_GAME);
                    //set gia tri bonus
                    cc.CrazyGameController.getInstance().setData(spinData.CrazyBousData);
                }, this, 0, 0, timeWaitJackpot, false);
            }
        },

        x2Clicked: function () {
            cc.SpinController.getInstance().activeButtonX2(false);
            cc.MainController.getInstance().createX2GameView();
        },

        onClickNextLine() {
            let maxLinesText = cc.SpinController.getInstance().getMaxLinesText();
            let minLinesText = cc.SpinController.getInstance().getMinLinesText();
            let betLinesText = cc.SpinController.getInstance().getBetLinesText();
            let betLines = betLinesText.split(',');
            let betLinesLength = betLines.length;
            betLinesLength++;
            let maxLines = maxLinesText.split(',');
            let minLines = minLinesText.split(',');
            if(betLinesLength > maxLines.length) {
                betLinesLength = minLines.length;
                betLinesText = minLinesText;
            } else {
                betLines.push(betLinesLength);
                betLinesText = betLines.join(",");
            }

            cc.SpinController.getInstance().updateTotalLines(betLinesLength);
            cc.SpinController.getInstance().updateBetLinesText(betLinesText);
            cc.GaiNhayPayLinesController.getInstance().showSelectedLines(betLinesLength);
        },

        onClickPreviousLine() {
            let maxLinesText = cc.SpinController.getInstance().getMaxLinesText();
            let minLinesText = cc.SpinController.getInstance().getMinLinesText();
            let betLinesText = cc.SpinController.getInstance().getBetLinesText();
            let betLines = betLinesText.split(',');
            let betLinesLength = betLines.length;
            betLinesLength--;
            let maxLines = maxLinesText.split(',');
            let minLines = minLinesText.split(',');
            if(betLinesLength < minLines.length) {
                betLinesLength = maxLines.length;
                betLinesText = maxLinesText;
            } else {
                betLines.pop();
                betLinesText = betLines.join(",");
            }
            cc.SpinController.getInstance().updateTotalLines(betLinesLength);
            cc.SpinController.getInstance().updateBetLinesText(betLinesText);
            cc.GaiNhayPayLinesController.getInstance().showSelectedLines(betLinesLength);
        },

        onClickNextRoom() {
            this._currentRoomID *= 2;
            if(roomIdGaiNhay.indexOf(this._currentRoomID) <= -1) {
                this._currentRoomID = roomIdGaiNhay[0];
            }
            this.updateBetUI(cc.SpinController.getInstance().getBetValue());
            cc.RoomController.getInstance().setRoomId(this._currentRoomID);
            cc.RoomController.getInstance().sendRequestOnHub(cc.MethodHubName.PLAY_NOW, this._currentRoomID);
        },

        onClickPreviousRoom() {
            this._currentRoomID /= 2;
            if(roomIdGaiNhay.indexOf(this._currentRoomID) <= -1) {
                this._currentRoomID = roomIdGaiNhay[roomIdGaiNhay.length - 1];
            }
            this.updateBetUI(cc.SpinController.getInstance().getBetValue());
            cc.RoomController.getInstance().setRoomId(this._currentRoomID);
            cc.RoomController.getInstance().sendRequestOnHub(cc.MethodHubName.PLAY_NOW, this._currentRoomID);
        },


        onClickTrialRoom: function(event) {
            if(this.isSpining) {
                cc.PopupController.getInstance().showMessage(gameMessage.MP_CANT_SWITCH_ROOM_SPINNING);
            } else {
                if(!this._isTrial) {
                    this._isTrial = true;
                    this._lastCurrentRoomId = this._currentRoomID;
                    this._currentRoomID = 3;
                    cc.RoomController.getInstance().sendRequestOnHub(cc.MethodHubName.PLAY_TRY);
                    cc.RoomController.getInstance().setRoomId(this._currentRoomID);
                    cc.SpinController.getInstance().updateUIButtonTry(true);
                } else {
                    this._isTrial = false;
                    cc.RoomController.getInstance().setRoomId(this._lastCurrentRoomId);
                    this._currentRoomID = this._lastCurrentRoomId;
                    cc.RoomController.getInstance().sendRequestOnHub(cc.MethodHubName.PLAY_NOW, cc.RoomController.getInstance().getRoomId());
                    cc.SpinController.getInstance().updateUIButtonTry(false);
                }
            }

        },

        updateBetUI: function (betVal) {
            //this.lbBetVal.string = 'ĐẶT: ' + cc.Tool.getInstance().formatNumber(betVal);
            this.lbBetVal.string = cc.Tool.getInstance().formatNumber(betVal);
        },

        onClickNextAutoSpin() {
            this._autoSpinIndex++;
            if(this._autoSpinIndex >= autoSpinNumbers.length) {
                this._autoSpinIndex = 0;
            }
            this._currentAutoSpinNumber = autoSpinNumbers[this._autoSpinIndex];
            this.lbAutoSpinTimes.string = this._currentAutoSpinNumber.toString();
        },

        onClickPreviousAutoSpin() {
            this._autoSpinIndex--;
            if(this._autoSpinIndex < 0) {
                this._autoSpinIndex = autoSpinNumbers.length - 1;
            }
            this._currentAutoSpinNumber = autoSpinNumbers[this._autoSpinIndex];
            this.lbAutoSpinTimes.string = this._currentAutoSpinNumber.toString();
        },

        setCrazyProcess(crazyProcess) {
            return;
            if(crazyProcess.CrazyProcess == null) return;
            this.nodeCrazyProcess.forEach((node, index) => {
                node.getComponent(cc.Sprite).spriteFrame = this.sprCrazyProcessNormal[index];
            });

            crazyProcess.CrazyProcess.forEach((process, index) => {
                this.nodeCrazyProcess[index].getComponent(cc.Sprite).spriteFrame = this.sprCrazyProcess[index];
            });

            if (crazyProcess && crazyProcess.CrazyBousData !== null) {
                cc.AudioController.getInstance().playSound(cc.AudioTypes.CRAZY_GAME);
            }
        },

        checkHaveCrazyGame: function (spinData) {
            //Kiem tra xem co bonus ko
            if (spinData && spinData.CrazyBousData !== null) {
                if (this.isAutoSpin) {
                    this.isResumeAutoSpin = true;
                }
                this.isAutoSpin = false;
                this.spinController.activeButtonAutoSpin(this.isAutoSpin);
                return true;
            } else {
                return false;
            }
        },

        updateIconDataCrazy: function (crazyProcess) {
            return;
            if(crazyProcess == null) return;
            this.nodeCrazyProcess.forEach((crazyProcess, index) => {
                crazyProcess.getComponent(cc.Sprite).spriteFrame = this.sprCrazyProcessNormal[index];
            });

            crazyProcess.forEach((process, index) => {
                this.nodeCrazyProcess[index].getComponent(cc.Sprite).spriteFrame = this.sprCrazyProcess[index];
            });
        },

        autoSpinClicked: function () {
            //kiem tra so du
            cc.log("click spin game")
            if (!this.checkBalance()) return;

            this.isAutoSpin = !this.isAutoSpin;
            this.spinController.activeButtonAutoSpin(this.isAutoSpin);

            if(this._currentAutoSpinNumber === 0) {
                this.isAutoSpin = false;
                cc.SpinController.getInstance().activeButtonAutoSpin(this.isAutoSpin);
                //bat lai button SPIN
                cc.SpinController.getInstance().activeButtonSpin(true);
            }

            if (this.isAutoSpin && !this.isSpining && this._currentAutoSpinNumber > 0) {
                this.updateAutoSpin();
                cc.AudioController.getInstance().playSound(cc.AudioTypes.SPIN);
            }
            //this.unscheduleAllCallbacks();
        },

        updateAutoSpin(){
            this._currentAutoSpinNumber--;
            if(this._currentAutoSpinNumber < 0) {
                this._autoSpinIndex = 0;
                this._currentAutoSpinNumber = autoSpinNumbers[0];
                this.lbAutoSpinTimes.string = this._currentAutoSpinNumber.toString();
                this.isAutoSpin = false;
                cc.SpinController.getInstance().activeButtonAutoSpin(this.isAutoSpin);
                //bat lai button SPIN
                cc.SpinController.getInstance().activeButtonSpin(true);
                return;
            }
            this.lbAutoSpinTimes.string = this._currentAutoSpinNumber.toString();
            this.callSpin();
        },
    });
}.call(this));
