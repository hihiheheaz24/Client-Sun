
(function () {
    var TayDuThanKhiController;

    TayDuThanKhiController = (function () {
        var instance;

        function TayDuThanKhiController() {
        }

        instance = void 0;

        TayDuThanKhiController.getInstance = function () {
            if (instance === void 0) {
                instance = this;
            }
            return instance.prototype;
        };

        TayDuThanKhiController.prototype.setSpinView = function (spinView) {
            return this.spinView = spinView;
        };
        TayDuThanKhiController.prototype.showCurrentWinAmount = function () {
            return this.spinView.showCurrentWinAmount();
        };
        
        TayDuThanKhiController.prototype.sendRequestOnHub = function (method,data1,data2) {
            return this.spinView.sendRequestOnHub(method,data1,data2);
        };

        TayDuThanKhiController.prototype.setButtonView = function (buttonView) {
            return this.buttonView = buttonView;
        };
        TayDuThanKhiController.prototype.setActiveAllButton = function (isActive) {
            return this.buttonView.setActiveAllButton(isActive);
        };
        TayDuThanKhiController.prototype.setAutoSpinCount = function (count) {
            return this.autoSpinCount = count;
        };
        TayDuThanKhiController.prototype.setQuickMode = function (isQuick) {
            return this.isQuickMode = isQuick;
        };
        TayDuThanKhiController.prototype.getQuickMode = function () {
            return this.isQuickMode;
        };
        TayDuThanKhiController.prototype.setIsBonusing = function (isBonus) {
            return this.isBonus = isBonus;
        };
        TayDuThanKhiController.prototype.getIsBonusing = function () {
            return this.isBonus;
        };
        TayDuThanKhiController.prototype.getAutoSpinCount = function () {
            return this.autoSpinCount;
        };
        TayDuThanKhiController.prototype.setIconView = function (iconView) {
            return this.iconView = iconView;
        };
        TayDuThanKhiController.prototype.setFreeGameView = function (view) {
            return this.freeGameView = view;
        };
        TayDuThanKhiController.prototype.wildFreeGameEffect = function () {
            return this.freeGameView.wildFreeGameEffect();
        };
        TayDuThanKhiController.prototype.showFreeGameWinCombo = function () {
            return this.freeGameView.showWinCombo();
        };
        TayDuThanKhiController.prototype.closeFreeGameView = function () {
            return this.freeGameView.closeFreeGameView();
        };
        TayDuThanKhiController.prototype.transitionScene = function (isOpen) {
            if (isOpen) {
                this.playEffect(cc.AudioTayDuClipIndex.SOUND_DOOR_OUT,false,1)
            }else{
                this.playEffect(cc.AudioTayDuClipIndex.SOUND_DOOR_IN,false,1)
            }
            return this.spinView.transitionScene(isOpen);
        };
        TayDuThanKhiController.prototype.setCurrentWinCombo = function (data,TotalWin) {
            this.currentTotalWin = TotalWin;
            return this.currentWinCombo = data;
        };
        TayDuThanKhiController.prototype.setCurrentJackPotWinData = function (data) {
            return  this.currentJackpotData = data;
        };
        TayDuThanKhiController.prototype.getCurrentJackPotWinData = function () {
            return  this.currentJackpotData;
        };
        TayDuThanKhiController.prototype.showMiniGameJackpot = function () {
            if (this.currentJackpotData!=null) {
                return  this.spinView.showMiniGameJackpot();
            }
        };
        TayDuThanKhiController.prototype.openFreeGameView = function () {
            if (this.currentBonusData!=null) {
                return  this.spinView.openFreeGameView();
            }
        };
        TayDuThanKhiController.prototype.hideFreeGameView = function () {
                return  this.spinView.closeFreeGameView();
        };
        TayDuThanKhiController.prototype.setCurrentBonusData = function (data) {
            return  this.currentBonusData = data;
        };
        TayDuThanKhiController.prototype.getCurrentBonusData = function () {
            return  this.currentBonusData;
        };
        TayDuThanKhiController.prototype.showWinCombo = function () {
            return this.iconView.showWinCombo(this.currentWinCombo,this.currentTotalWin);
        };
        TayDuThanKhiController.prototype.getIconView = function () {
            return this.iconView;
        };
        TayDuThanKhiController.prototype.getListSymbolSkeleton = function () {
            return this.iconView.getListSymbolSkeleton();
        };
        TayDuThanKhiController.prototype.spinNormal = function (data) {
            return this.iconView.spinNormal(data,this.isQuickMode);
        };
        TayDuThanKhiController.prototype.stopSpinNormal = function () {
            return this.iconView.stopSpinNormal();
        };
        TayDuThanKhiController.prototype.spinFreeGameNormal = function () {
            return this.freeGameView.spinNormal();
        };
        TayDuThanKhiController.prototype.stopSpinFreeGame = function () {
            return this.freeGameView.stopSpinNormal();
        };
        TayDuThanKhiController.prototype.showScatterEffect = function () {
            return this.iconView.showScatterEffect();
        };
        TayDuThanKhiController.prototype.wukongPowerUpEffect = function () {
            return this.iconView.wukongPowerUpEffect();
        };
        TayDuThanKhiController.prototype.hideNearBonusEffect = function () {
            return this.iconView.hideNearBonusEffect();
        };
        TayDuThanKhiController.prototype.setRoomID = function (roomID) {
            return this.roomID = roomID;
        };
        TayDuThanKhiController.prototype.getBetAmount = function () {
            let betAmount = 0;
            switch (this.roomID) {
                case 1:
                betAmount = 2000;
                break;
            case 2:
                betAmount = 5000;
                break;
            case 3:
                betAmount = 10000;
                break;
            case 4:
                betAmount = 50000;
                break;
            case 5:
                betAmount = 100000;
                break;
            case 6:
                betAmount = 500000;
                break;
            }
            return betAmount;
        };
        TayDuThanKhiController.prototype.getCurrentWinType = function () {
            let betAmount = this.getBetAmount();
            if (this.currentTotalWin<betAmount) {
                return 0;
            }
            if (this.currentTotalWin>=betAmount&&this.currentTotalWin/betAmount<5) {
                return 1;
            }
            if (this.currentTotalWin/betAmount>=5) {
                return 2;
            }
        };
        TayDuThanKhiController.prototype.getWinTypebyWinAmount = function (winAmount) {
            let betAmount = this.getBetAmount();
            if (winAmount<betAmount) {
                return 0;
            }
            if (winAmount>=betAmount&&winAmount/betAmount<5) {
                return 1;
            }
            if (winAmount/betAmount>=5) {
                return 2;
            }
        };
        TayDuThanKhiController.prototype.getRoomID = function () {
            return this.roomID;
        };
        TayDuThanKhiController.prototype.doneAllEffect = function () {
            this.setActiveAllButton(true);
            if (this.autoSpinCount>0) {
                setTimeout(() => {
                    this.autoSpinCount--;
                    return this.buttonView.spin();  
                }, 1500);
                
            }
        };
        TayDuThanKhiController.prototype.setPopUpView = function (view) {
            return this.popUpView = view;
        };
        TayDuThanKhiController.prototype.showPopUpJackPotEffect = function () {
            return this.popUpView.showPopUpJackPotEffect(this.currentJackpotData);
        };
        TayDuThanKhiController.prototype.showPopUpBigWin = function (type,money) {
            return this.popUpView.showPopUpBigWin(type,money);
        };
        TayDuThanKhiController.prototype.showPopUpFreeGameWin = function (multiple,money) {
            return this.popUpView.showPopUpFreeGameWin(multiple,money);
        };
        TayDuThanKhiController.prototype.showPopUpMiniMessage = function (message) {
            return this.popUpView.showPopUpMiniMessage(message);
        };
        TayDuThanKhiController.prototype.showPopUpNotify = function (message) {
            return this.popUpView.showPopUpNotify(message);
        };
        TayDuThanKhiController.prototype.setJackpotFundDetail = function (data) {
            this.jackpotFundDetail = data;
            return this.updateLabelJackpot();
        };
        TayDuThanKhiController.prototype.getJackpotFundDetail = function (data) {
            return this.jackpotFundDetail;
        };
        TayDuThanKhiController.prototype.updateLabelJackpot = function () {
            return this.spinView.updateLabelJackpot(this.jackpotFundDetail[this.roomID-1]);
        };
        //Audio Pool
        TayDuThanKhiController.prototype.setAudioPool = function (view) {
            return this.audioPool = view;
        };
        TayDuThanKhiController.prototype.playMusic = function (type,loop) {
            if (this.audioPool) {
                return this.audioPool.playMusic(type,loop);
            }
        };
        TayDuThanKhiController.prototype.playBackGroundMusic = function (type) {
            if (this.audioPool) {
                return this.audioPool.playBackGroundMusic(type);
            }
        };
        TayDuThanKhiController.prototype.playEffect = function (type,loop,volume) {
           if (this.audioPool) {
            return this.audioPool.playEffect(type,loop,volume);
           }
        };
        TayDuThanKhiController.prototype.sfxJackpotLoop = function () {
            if (this.audioPool) {
             return this.audioPool.sfxJackpotLoop();
            }
         };
         TayDuThanKhiController.prototype.stopJackpotLoop = function () {
            if (this.audioPool) {
             return this.audioPool.stopJackpotLoop();
            }
         };
         TayDuThanKhiController.prototype.sfxBigwinLoop = function () {
            if (this.audioPool) {
             return this.audioPool.sfxBigwinLoop();
            }
         };
         TayDuThanKhiController.prototype.sfxStopBigwinLoop = function () {
            if (this.audioPool) {
             return this.audioPool.sfxStopBigwinLoop();
            }
         };
        return TayDuThanKhiController;

    })();

    cc.TayDuThanKhiController = TayDuThanKhiController;

}).call(this);
