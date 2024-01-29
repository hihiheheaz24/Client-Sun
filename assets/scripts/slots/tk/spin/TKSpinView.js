/**
 * Created by Nofear on 3/22/2019.
 */

var slotsConfig = require('TKConfig');
var gameMessage = require('GameMessage');

(function () {
    cc.TKSpinView = cc.Class({
        extends: cc.SpinViewBase,
        properties: {
            spinColumnViews: [cc.TKSpinColumnView],
            //anh nen cua phong
            spriteBGRoom: cc.Sprite,
            //gia tri dat cuoc
            lbBetVal: cc.Label,
            //logo fast spin active
            fastSpinNode: cc.Node,
        },


        onLoad: function () {
            this._super();
            this.currentIndex = 0;
            this.listRoomID = [1,2,4];
        },

        updateBetLinesText: function (betLinesText) {
            this.betLinesText = betLinesText;
            let betLines = betLinesText.split(',');
            cc.PayLinesController.getInstance().hideAllLines();
            betLines.forEach(function (line) {
                if (line !== '') {
                    cc.PayLinesController.getInstance().activeLineByID(line);
                }
            });

        },


        betLinesClicked(){
            cc.AudioController.getInstance().playSound(cc.AudioTypes.NORMAL_CLICK);
            if( cc.SpinController.getInstance().getIsPlayTry()){
                cc.PopupController.getInstance().showSlotsMessage('Bạn vui lòng vào phòng chơi để thực hiện chức năng này!');
            } else {
                cc.MainController.getInstance().betLinesClicked();
            }
        },



        btnNextRoom(){
            cc.AudioController.getInstance().playSound(cc.AudioTypes.NORMAL_CLICK);
            if( cc.SpinController.getInstance().getIsPlayTry()){
                cc.PopupController.getInstance().showSlotsMessage('Bạn vui lòng vào phòng chơi để thực hiện chức năng này!');
            } else {
                this.currentIndex++;
                if(this.currentIndex == this.listRoomID.length){
                    this.currentIndex = 0;
                }
                this.updateRoom(this.listRoomID[this.currentIndex]);
            }
          
        },
    
        btnBackRoom(){
            cc.AudioController.getInstance().playSound(cc.AudioTypes.NORMAL_CLICK);
            if( cc.SpinController.getInstance().getIsPlayTry()){
                cc.PopupController.getInstance().showSlotsMessage('Bạn vui lòng vào phòng chơi để thực hiện chức năng này!');
            } else {
                this.currentIndex--;
                if(this.currentIndex == -1 ){
                    this.currentIndex = this.listRoomID.length - 1;
                }
                this.updateRoom(this.listRoomID[this.currentIndex]);
            }
        },


        updateRoom(room = 0){
            let roomId = parseInt(room);
            cc.RoomController.getInstance().updateUIByRoomID(roomId);
            cc.RoomController.getInstance().setRoomId(roomId);
            this.roomController.sendRequestOnHub(cc.MethodHubName.PLAY_NOW, roomId);
           
        },


        updateBGRoomUI: function () {
            if (this.spriteBGRoom) {
                //Lay roomIndex
                this.roomIndex = cc.RoomController.getInstance().getRoomId() - 1;
                var sfRooms = cc.SpinController.getInstance().getIconView().bgRooms;
                this.spriteBGRoom.spriteFrame = sfRooms[Math.min(this.roomIndex, 2)];
            }
        },

        updateBetUI: function (betVal) {
            //this.lbBetVal.string = 'ĐẶT: ' + cc.Tool.getInstance().formatNumber(betVal);
            this.lbBetVal.string = cc.Tool.getInstance().formatNumber(betVal);
        },

        //khi click SPIN goi ham nay
        callSpin: function () {

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
                this.roomController.sendRequestOnHub(cc.MethodHubName.SPIN, this.betLinesText);
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

                //Lay ve ket qua de hien giai thuong + hieu ung + xu ly neu co bonus game hoac minigame
                this.spinResponse = cc.SpinController.getInstance().getSpinResponse();
                this.spinData = this.spinResponse.SpinData;
                this.bonusGameData = this.spinResponse.BonusGame;
                var account = this.spinResponse.Account;

                //Bat lai Click cac button chuc nang
                if (this.bonusGameData.BonusData === null) {
                    //ko co bonus game thi bat lai cac button
                    this.spinController.activeButtonSpin(true);
                }

                //Update lai balance sau khi SPIN
                if (this.spinResponse.AccountID < 0) {
                    cc.BalanceController.getInstance().updateTryBalance(account.TotalStar);

                } else {
                    cc.BalanceController.getInstance().updateBalance(account.TotalStar);
                }

                this.playEffect(this.spinData);
            }
        },

        playEffect: function (spinData) {
            var self = this;

            var timeWaitJackpot = 0;
            //kiem tra co trung jackpot ko?
            if (spinData.IsJackpot) {
                cc.EffectController.getInstance().playEffect(cc.EffectType.JACKPOT, spinData.PaylinePrize, 4);
                cc.PayLinesController.getInstance().playEffect(spinData.PrizeLines, -1); //jackpot delay = -1

                //stop autoSpin
                this.isAutoSpin = false;
                this.spinController.activeButtonAutoSpin(this.isAutoSpin);
                timeWaitJackpot = 2;
            }
            //neu co jackpot thi hien Jackpot 2s sau do moi check tiep
            this.scheduler.schedule(function () {
                //check bonus game
                if (self.checkHaveBonusGame()) {
                    var isBonus = true;
                } else {
                    isBonus = false;
                }


                //Bat lai Click cac button chuc nang
                //this.spinController.activeButtonSpin(true);

                //dang ko phai la freeSpin thi moi check
                if (cc.FreeSpinController.getInstance().getStateFreeSpin() === false && spinData.TotalFreeSpin > 0) {
                    // //tat auto SPIN - game Tam quoc ko can tat vi freespin giong quay binh thuong
                    // this.isAutoSpin = false;
                    // this.spinController.activeButtonAutoSpin(this.isAutoSpin);

                    //Tam quoc van hien thi tien thang bt
                    this.lbiTotalWin.tweenValueto(this.spinData.PaylinePrize);

                    //duoc freespin -> kich hoạt freespin sau xx giay
                    
                    cc.AudioController.getInstance().playSound(cc.AudioTypes.START_FREE_SPIN);
                    cc.EffectController.getInstance().playEffect(cc.EffectType.FREE_SPIN_NOTI, null, 2);
                    cc.FreeSpinController.getInstance().updateFreeSpinText(spinData.TotalFreeSpin);
                    this.scheduler.schedule(function () {
                        cc.FreeSpinController.getInstance().activeFreeSpin(true);
                        cc.FreeSpinController.getInstance().updateFreeSpinText(spinData.TotalFreeSpin);
                    }, this, 0, 0, slotsConfig.TIME_WAIT_START_FREE_SPIN, false);

                    this.scheduler.schedule(function () {
                        //Neu tu dong quay thi tu goi SPIN tiep
                        if (self.isAutoSpin && this.bonusGameData.BonusData === null) {
                            self.callSpin();
                        }
                    }, this, 0, 0, slotsConfig.TIME_WAIT_RESULT_FREE_SPIN, false);

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
                }
            
                if (spinData.PaylinePrize > 0) { //PaylinePrize //TotalPrize
                    if (!spinData.IsJackpot) {
                        if (spinData.PaylinePrize >= this.spinResponse.BetValue * this.spinResponse.TotalLine * 5) {
                            cc.EffectController.getInstance().playEffect(cc.EffectType.BIG_WIN, spinData.PaylinePrize, self.isFastSpin ? slotsConfig.TIME_TWEEN_MONEY_FAST : slotsConfig.TIME_TWEEN_MONEY_BIGWIN); //PaylinePrize
                            cc.PayLinesController.getInstance().playEffect(spinData.PrizeLines, self.isFastSpin ? slotsConfig.TIME_MONEY_EFFECT_BIG_WIN_FAST : slotsConfig.TIME_MONEY_EFFECT_BIG_WIN);
                         
                            this.scheduler.schedule(function () {
                               
                                self.checkHaveFreeSpin(spinData);
                            }, this, 0, 0, self.isFastSpin ? slotsConfig.TIME_MONEY_EFFECT_BIG_WIN_FAST : slotsConfig.TIME_MONEY_EFFECT_BIG_WIN, false);
                        } else {
                            cc.EffectController.getInstance().playEffect(cc.EffectType.NORMAL_WIN, spinData.PaylinePrize, self.isFastSpin ? slotsConfig.TIME_TWEEN_MONEY_FAST : null); //PaylinePrize
                            cc.PayLinesController.getInstance().playEffect(spinData.PrizeLines, self.isFastSpin ? slotsConfig.TIME_MONEY_EFFECT_NORMAL_WIN_FAST : slotsConfig.TIME_MONEY_EFFECT_NORMAL_WIN);
                            cc.AudioController.getInstance().playSound(cc.AudioTypes.NORMAL_WIN);
                            this.scheduler.schedule(function () {
                                self.checkHaveFreeSpin(spinData);
                            }, this, 0, 0, self.isFastSpin ? slotsConfig.TIME_MONEY_EFFECT_NORMAL_WIN_FAST : slotsConfig.TIME_MONEY_EFFECT_NORMAL_WIN, false);
                        }
                    }
                } else {
                    //THua -> ko lam gi
                    this.scheduler.schedule(function () {
                        self.checkHaveFreeSpin(spinData);
                    }, this, 0, 0, self.isFastSpin ? slotsConfig.TIME_WAIT_LOST_FAST : slotsConfig.TIME_WAIT_LOST, false);
                }

            }, this, 0, 0, timeWaitJackpot, false);
        },

        fastSpinActiveSprite: function () {
            return this.fastSpinNode.active = this.fastSpinNode.active ? !1 :!0;
        },


        autoSpinClicked: function () {
            this._super();
            cc.AudioController.getInstance().playSound(cc.AudioTypes.NORMAL_CLICK);
        },
    });
}.call(this));
