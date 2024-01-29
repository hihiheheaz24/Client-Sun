/**
 * Created by Nofear on 3/15/2019.
 */

(function () {
    cc.TopJackpotGamVipView = cc.Class({
        "extends": cc.Component,
        properties: {
            lbJPVuongQuoc: [cc.LabelIncrement],
            lbJPSamTruyen: [cc.LabelIncrement],
            lbJPThuyCung: [cc.LabelIncrement],
            lbJPGaiNhay: [cc.LabelIncrement],
            lbJPThanThu: [cc.LabelIncrement],
            lbJPTayDu: [cc.LabelIncrement],
            lbiShootFishs: [cc.LabelIncrement],
            lbJPCaoThap: [cc.LabelIncrement],
            lbJPMiniPoker: [cc.LabelIncrement],
            lbJPPhucSinh: [cc.LabelIncrement],
            xJPVuongQuoc: [sp.Skeleton],
            xJPSamTruyen: [sp.Skeleton],
            xJPThuyCung: [sp.Skeleton],
            xJPGaiNhay: [sp.Skeleton],
            xJPThanThu: [sp.Skeleton],
            xJPTayDu: [sp.Skeleton],
        },

        onEnable: function () {
            this.currentRoom = 4;

            var self = this;
            var delay = 0.2;
            cc.director.getScheduler().schedule(function () {
                self.getInfo();
            }, this, 1, 0, delay, false);

            cc.director.getScheduler().schedule(function () {
                self.getInfo();
            }, this, 3, cc.macro.REPEAT_FOREVER, 0, false);
        },

        getInfo: function () {
            var getJackpotInfoCommand = new cc.GetJackpotInfoCommand;
            getJackpotInfoCommand.execute(this, cc.GameId.ALL);
        },
        onJackpotTrigger:function (data) {
          let tempData = {
              "C": "d-6AA9912E-E,11A|Re,0|Rf,3",
              "M": [
                  {
                      "H": "PortalHub",
                      "M": "effectJackpotAll",
                      "A": [
                          {
                              "NickName": "tammaoduy89",
                              "JackpotValue": 999817,
                              "BetValue": 1000,
                              "GameName": "Gái Nhảy",
                              "ServiceID": 1
                          }
                      ]
                  }
              ]
          };
          //TODO làm hiệu ứng khi có người nổ jackpot
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
                            case cc.GameId.CAO_THAP:
                                if (roomIndex < 3) {
                                    if(jackpotFund!==cc.Tool.getInstance().removeDot(self.lbJPCaoThap[roomIndex].label.string))
                                    self.lbJPCaoThap[roomIndex].tweenValueto(jackpotFund, 10);
                                }
                                break;
                            case cc.GameId.MINI_POKER:
                                if (roomIndex < 3) {
                                    if(jackpotFund!==cc.Tool.getInstance().removeDot(self.lbJPMiniPoker[roomIndex].label.string))
                                        self.lbJPMiniPoker[roomIndex].tweenValueto(jackpotFund, 10);
                                }
                                break;
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
                            case cc.GameId.SEVEN77:
                                if (roomIndex < 2) {
                                    if(jackpotFund!==cc.Tool.getInstance().removeDot(self.lbJPPhucSinh[roomIndex].label.string))
                                        self.lbJPPhucSinh[roomIndex].tweenValueto(jackpotFund, 10);
                                }
                                else if (roomIndex ==3)
                                    if(jackpotFund!==cc.Tool.getInstance().removeDot(self.lbJPPhucSinh[2].label.string))
                                        self.lbJPPhucSinh[2].tweenValueto(jackpotFund, 10);
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

                self.onGetX6JackpotInfo();
            }
        },

        onGetX6JackpotInfo() {
            var self = this;
            self.resetAllJackpotEffects();
            const gameListX6JackpotInfo = cc.LobbyJackpotController.getInstance().getX6JackpotResponse();
            if (!gameListX6JackpotInfo || !gameListX6JackpotInfo.length) return;
            gameListX6JackpotInfo.forEach((jackpotInfo) => {
                let roomIndex = jackpotInfo.RoomID - 1;
                switch (jackpotInfo.GameID.toString()) {
                    case cc.GameId.EGYPT:
                        self.updateX6JackpotItem(self.xJPGaiNhay[roomIndex], jackpotInfo);
                        break;
                    case cc.GameId.THREE_KINGDOM:
                        self.updateX6JackpotItem(self.xJPVuongQuoc[roomIndex], jackpotInfo);
                        break;
                    case cc.GameId.THAN_THU:
                        if (roomIndex > 4) {
                            roomIndex = roomIndex - 5;
                        }
                        self.updateX6JackpotItem(self.xJPThanThu[roomIndex], jackpotInfo);
                        break;
                    case cc.GameId.TAY_DU_THAN_KHI:
                        if (roomIndex > 2) {
                            roomIndex = roomIndex - 3;
                        }
                        self.updateX6JackpotItem(self.xJPTayDu[roomIndex], jackpotInfo);
                        break;
                    case cc.GameId.THUY_CUNG:
                        self.updateX6JackpotItem(self.xJPThuyCung[roomIndex], jackpotInfo);
                        break;
                    case cc.GameId.COWBOY:
                        self.updateX6JackpotItem(self.xJPSamTruyen[roomIndex], jackpotInfo);
                        break;
                }
            });
        },

        updateX6JackpotItem(jackpotEffect, { Multiplier, Remain }) {
            if (!jackpotEffect) return;

            if (Multiplier && !Remain) {
                jackpotEffect.node.active = true;
                jackpotEffect.setAnimation(0, `x${Multiplier}`, true);
            } else {
                jackpotEffect.node.active = false;
            }
        },

        resetAllJackpotEffects() {
            this.resetJackpotEffects(this.xJPGaiNhay);
            this.resetJackpotEffects(this.xJPSamTruyen);
            this.resetJackpotEffects(this.xJPTayDu);
            this.resetJackpotEffects(this.xJPThanThu);
            this.resetJackpotEffects(this.xJPThuyCung);
            this.resetJackpotEffects(this.xJPVuongQuoc);
        },

        resetJackpotEffects(jackpotEffects) {
            jackpotEffects.forEach(item => item.node.active = false);
        },

        roomClicked: function (event, data) {
            cc.LobbyController.prototype.joinGame(data);
            cc.TopController.getInstance().closeTopView();
        }
    });
}).call(this);
