/**
 * Created by Nofear on 6/7/2017.
 */

var portalConfig = require('PortalConfig');

(function () {
    cc.LobbyJackpotView = cc.Class({
        "extends": cc.Component,
        properties: {
            lbJPVuongQuoc: [cc.LabelIncrement],
            lbJPSamTruyen: [cc.LabelIncrement],
            lbJPThuyCung: [cc.LabelIncrement],
            lbJPGaiNhay: [cc.LabelIncrement],
            lbJPThanThu: [cc.LabelIncrement],
            lbJPTayDu: [cc.LabelIncrement],
            lbiShootFishs: [cc.LabelIncrement],
        },

        onLoad: function () {
            this.mount = 0;
            cc.LobbyJackpotController.getInstance().setLobbyJackpotView(this);

            this.getJackpot();
            this.isPauseUpdateJackpot = false;
            cc.director.getScheduler().schedule(this.getJackpot, this, portalConfig.TIME_GET_JACKPOT, cc.macro.REPEAT_FOREVER, 0, this.isPauseUpdateJackpot);
        },

        getJackpot: function () {
            var getJackpotInfoCommand = new cc.GetJackpotInfoCommand;
            getJackpotInfoCommand.execute(this, cc.GameId.ALL);

            this.getJackpotShootFish();
        },

        getJackpotShootFish: function () {
            // this.onGetJackpotShootFishResponse();
            var GetJackpotShootFishCommand = new cc.GetJackpotShootFishCommand;
            GetJackpotShootFishCommand.execute(this);
        },

        onGetJackpotShootFishResponse: function (response) {
            if (response !== null) {
                for (var i = 0; i < response.length; i++) {
                    switch (response[i].Name) {
                        // case 14:
                        //     this.lbiShootFishs[0].tweenValueto(Math.round(response[i].Value));
                        //     break;
                        // case 24:
                        //     this.lbiShootFishs[1].tweenValueto(Math.round(response[i].Value));
                        //     break;
                        // case 34:
                        //     this.lbiShootFishs[2].tweenValueto(Math.round(response[i].Value));
                        //     break;

                    }
                }
            }
        },

        onGetJackpotInfoResponse: function (response) {
            if (response !== null) {
                var self = this;
                var gameListData = response.GameList;

                cc.LobbyJackpotController.getInstance().setJackpotResponse(gameListData);

                gameListData.forEach(function (game) {
                    var roomIndex = game.RoomID - 1;
                    var jackpotFund = game.JackpotFund;

                    switch (game.GameID.toString()) {
                        case cc.GameId.EGYPT:
                            if (roomIndex < 2) {
                                if(jackpotFund!==cc.Tool.getInstance().removeDot(self.lbJPGaiNhay[roomIndex].label.string))
                                    self.lbJPGaiNhay[roomIndex].tweenValueto(jackpotFund, 10);
                            }
                            else if (roomIndex ==3)
                                if(jackpotFund!==cc.Tool.getInstance().removeDot(self.lbJPGaiNhay[2].label.string))
                                    self.lbJPGaiNhay[2].tweenValueto(jackpotFund, 10);
                            break;
                        case cc.GameId.THREE_KINGDOM:
                            if (roomIndex < 2) {
                                if(jackpotFund!==cc.Tool.getInstance().removeDot(self.lbJPVuongQuoc[roomIndex].label.string))
                                    self.lbJPVuongQuoc[roomIndex].tweenValueto(jackpotFund, 10);
                            }
                            else if (roomIndex ==3)
                                if(jackpotFund!==cc.Tool.getInstance().removeDot(self.lbJPVuongQuoc[2].label.string))
                                    self.lbJPVuongQuoc[2].tweenValueto(jackpotFund, 10);
                            break;
                        case cc.GameId.THUY_CUNG:
                            if (roomIndex < 2) {
                                if(jackpotFund!==cc.Tool.getInstance().removeDot(self.lbJPThuyCung[roomIndex].label.string))
                                    self.lbJPThuyCung[roomIndex].tweenValueto(jackpotFund, 10);
                            }
                            else if (roomIndex ==3)
                                if(jackpotFund!==cc.Tool.getInstance().removeDot(self.lbJPThuyCung[2].label.string))
                                    self.lbJPThuyCung[2].tweenValueto(jackpotFund, 10);
                            break;

                        case cc.GameId.COWBOY:
                            if (roomIndex < 2) {
                                if(jackpotFund!==cc.Tool.getInstance().removeDot(self.lbJPSamTruyen[roomIndex].label.string))
                                    self.lbJPSamTruyen[roomIndex].tweenValueto(jackpotFund, 10);
                            }
                            else if (roomIndex ==3)
                                if(jackpotFund!==cc.Tool.getInstance().removeDot(self.lbJPSamTruyen[2].label.string))
                                    self.lbJPSamTruyen[2].tweenValueto(jackpotFund, 10);
                            break;
                    }
                    if (game.GameID.toString()==cc.GameId.THAN_THU&&roomIndex>4)
                    {
                        if(jackpotFund!==cc.Tool.getInstance().removeDot(self.lbJPThanThu[roomIndex-5].label.string))
                            self.lbJPThanThu[roomIndex-5].tweenValueto(jackpotFund,10);
                    }
                    if (game.GameID.toString()==cc.GameId.TAY_DU_THAN_KHI&&roomIndex>2)
                    {
                        if(jackpotFund!==cc.Tool.getInstance().removeDot(self.lbJPTayDu[roomIndex-3].label.string))
                            self.lbJPTayDu[roomIndex-3].tweenValueto(jackpotFund,10);
                    }
                });
            }
        },
        pauseUpdateJackpot: function (isPause) {
            this.isPauseUpdateJackpot = isPause;
            if (isPause) {
                this.unscheduleAllCallbacks();
            } else {
                cc.director.getScheduler().schedule(this.getJackpot, this, portalConfig.TIME_GET_JACKPOT, cc.macro.REPEAT_FOREVER, 0, this.isPauseUpdateJackpot);
            }
        }
    });
}).call(this);