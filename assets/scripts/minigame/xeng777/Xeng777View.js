/**
 * Created by Nobita on 01/09/2022.
 */

var netConfig = require('NetConfig');

(function () {
    cc.SicBoView = cc.Class({
        extends: cc.Component,

        properties: {
            nodeParentChat: cc.Node,
            prefabChat: cc.Prefab,
            spSounds: [cc.SpriteFrame],
            spMusics: [cc.SpriteFrame],
            audioBg: cc.AudioSource,
            audioBet: cc.AudioSource,
            audioSpin: cc.AudioSource,
            audioSpined: cc.AudioSource,
            audioTai: cc.AudioSource,
            audioXiu: cc.AudioSource,
            audioWin: cc.AudioSource,
            bgLoadingIntro:cc.Node,
        },

        onLoad() {
            this.controller = cc.Xeng777Controller.getInstance();
            this.controller.setView(this);
            this.controller.initBetLog();
            this.controller.setBetLogSession(1);
            this.lastTimeReconnect = (new Date()).getTime();
            this.currentState = -1;
            this.isAuthorized = false;
            cc.PopupController.getInstance().showBusy();
            this.connectHubXeng777();
            //var nodeChat = cc.instantiate(this.prefabChat);
            //this.nodeParentChat.addChild(nodeChat);
        },

        disconnectAndLogout: function () {
            if (this.xeng777Hub) {
                this.xeng777Hub.disconnect();
            }
            this.lastTimeReconnect = (new Date()).getTime();
            this.isAuthorized = false;
            this.lastTimeReconnect = (new Date()).getTime();
            //timeAll = 60;
        },

        connectHubSicBoAuthorize: function () {
            if (!this.isAuthorized) {
                if (this.xeng777Hub) {
                    this.xeng777Hub.disconnect();
                }

                this.lastTimeReconnect = (new Date()).getTime();
                this.isAuthorized = true;
                cc.PopupController.getInstance().showBusy();
                var xeng777NegotiateCommand = new cc.Xeng777NegotiateCommand;
                xeng777NegotiateCommand.execute(this);

                return false;
            } else {
                return true;
            }
        },

        connectHubXeng777: function () {
            //console.log('connectHubSicBo');
            cc.PopupController.getInstance().showBusy();
            this.isAuthorized = false;
            var xeng77NegotiateCommand = new cc.Xeng777NegotiateCommand;
            xeng77NegotiateCommand.execute(this);
        },

        reconnect: function () {
            console.log('xeng777Hub reconnect');
            this.lastTimeReconnect = (new Date()).getTime();
            this.xeng777Hub.connect(this, cc.HubName.Xeng777Hub, this.connectionToken, true);
            this.lastTimeReconnect = (new Date()).getTime();
            //timeAll = 60;
        },

        onEnable: function () {
            cc.BalanceController.getInstance().updateBalance(cc.BalanceController.getInstance().getBalance());
            cc.PopupController.getInstance().showBusy();
        },

        onDestroy: function () {
            cc.LobbyJackpotController.getInstance().pauseUpdateJackpot(false);
            cc.Xeng777Controller.getInstance().sendRequestOnHub(cc.MethodHubName.EXIT_LOBBY);

            if (this.interval !== null) {
                clearInterval(this.interval);
            }

            if (this.xeng777Hub) {
                this.xeng777Hub.disconnect();
            }

            this.unscheduleAllCallbacks();
            cc.Xeng777Controller.getInstance().setView(null);

            if (cc.sys.isNative) {
                cc.loader.releaseResDir('xeng777/prefabs');
                cc.loader.releaseResDir('xeng777/images');
            }
            cc.PopupController.getInstance().hideBusy();
        },

        sendRequestOnHub: function (method, data1, data2) {
            switch (method) {
                case cc.MethodHubName.ENTER_LOBBY:
                    this.xeng777Hub.enterLobby();
                    break;
                case cc.MethodHubName.EXIT_LOBBY:
                    this.xeng777Hub.exitLobby();
                    break;
                case cc.MethodHubName.BET:
                    this.xeng777Hub.bet(data1, data2);
                    break;
                case cc.MethodHubName.PLAY_NOW:
                    this.xeng777Hub.playNow();
                    break;
                case cc.MethodHubName.REGISTER_LEAVE_ROOM:
                    this.xeng777Hub.registerLeaveRoom();
                    break;
                case cc.MethodHubName.UNREGISTER_LEAVE_ROOM:
                    this.xeng777Hub.unRegisterLeaveRoom();
                    break;
                case cc.MethodHubName.SEND_MESSAGE:
                    this.xeng777Hub.sendRoomMessage(data1);
                    break;
            }
        },

        onXeng777NegotiateResponse: function (response) {
            this.connectionToken = response.ConnectionToken;
            this.xeng777Hub = new cc.Hub;
            this.xeng777Hub.connect(this, cc.HubName.Xeng777Hub, response.ConnectionToken);
        },

        onHubMessage: function (response) {
            // console.log(response);
            if (response.M !== undefined && response.M.length > 0) {
                let res = response.M;
                res.map(m => {
                    switch (m.M) {
                        //Thoat game
                        case cc.MethodHubOnName.PLAYER_LEAVE:
                            this.playerLeave(m.A);
                            break;
                        //Thong tin game
                        case cc.MethodHubOnName.SESSION_INFO:
                            let info = m.A[0];
                            this.controller.onNotifyChangePhrase(info);
                            //Cap nhat tong tien bet
                            this.controller.updateTotalBet(info);
                            this.controller.setJackpot(info.JackPot);
                            this.controller.setElapsed(info.Elapsed);
                            break;
                        //Thong tin game
                        case cc.MethodHubOnName.NOTIFY_CHANGE_PHRASE:
                            this.controller.onNotifyChangePhrase(m.A[0]);
                            break;
                        case cc.MethodHubOnName.UPDATE_ROOM_TIME:
                            this.controller.updateTimer(parseInt(m.A[0]));
                            break;
                        //Danh sach nguoi choi
                        case cc.MethodHubOnName.SUMMARY_PLAYER:
                            this.controller.updatePlayersInGame(m.A[0]);
                            break;
                        //Thong tin game
                        case cc.MethodHubOnName.JOIN_GAME:
                            this.controller.updatePlayerInfor(m.A[0]);
                            this.controller.onNotifyChangePhrase(m.A[1]);
                            // //Cap nhat tong tien bet cua user
                            if (m.A[3].length > 0) {
                                m.A[3].map(betData => {
                                    this.controller.updateBetOfAccount(betData.BetSide, betData.SummaryBet);
                                }, this);
                            }
                            this.controller.setJackpot(m.A[1].JackPot);
                            this.controller.initListSoiCau(m.A[2]);
                            // //Cap nhat chip cua phien
                            this.controller.activeBetAgain(false);
                            this.controller.activeBetX2(false);
                            break;
                        //Cap nhat danh sach player
                        case cc.MethodHubOnName.VIP_PLAYERS:
                            let dataPlayer = m.A[0];
                            if (dataPlayer.length > 0) {
                                this.controller.updatePlayersUI(dataPlayer);
                            }
                            break;
                        //Lich su bet
                        case cc.MethodHubOnName.GAME_HISTORY:
                            this.controller.initListSoiCau(m.A[0]);
                            break;
                        //Thong tin bet cua player
                        case cc.MethodHubOnName.BET_OF_ACCOUNT:
                            this.controller.updateBetOfAccount(m.A[0]);
                            break;
                        //Bet thanh cong
                        case cc.MethodHubOnName.BET_SUCCESS:
                            let sessionID = this.controller.getBetLogSession();
                            this.controller.setBetLog({
                                sessionID: sessionID,
                                value: m.A[0].BetValue,
                                betSide: m.A[0].BetSide
                            });
                            //Cap nhat balance
							console.log(m.A[1]);
                            this.controller.updateBalanceCurrPlayer(m.A[1]);
                            cc.BalanceController.getInstance().updateRealBalance(m.A[1]);
                            this.controller.updateBetOfAccount(m.A[0].BetSide, m.A[0].SummaryBet);
                            this.controller.moveChipBet(m.A[0].BetValue, m.A[0].BetSide, cc.Xeng777ChipOf.PLAYER, m.A[0].AccountID);
                            this.controller.soundBet();
                            break;
                        //Nguoi choi bet
                        case cc.MethodHubOnName.PLAYER_BET:
                            if (m.A[0] != cc.LoginController.getInstance().getUserId()) {
                                //Update chip player
                                this.controller.updateBalancePlayer(m.A);
                                //Move Chip
                                this.controller.moveChipBet(m.A[1], m.A[2], cc.Xeng777ChipOf.USERS, m.A[0]);
                                this.controller.soundBet();
                            }
                            break;
                        //Ket qua
                        case cc.MethodHubOnName.WIN_RESULT:
                            this.controller.setWinResult(m.A[0]);
                            cc.BalanceController.getInstance().updateRealBalance(m.A[0].Balance);
                            break;
                        case cc.MethodHubOnName.WIN_RESULT_VIP:
                            if (m.A.length > 0) {
                                this.controller.setWinVipResult(m.A[0]);
                            }
                            break;
                        case cc.MethodHubOnName.TOTAL_WIN_MONEY:
                            this.controller.setTotalWinResult(parseInt(m.A[0]));
                            break;
                        //thong bao khi dat cuoc
                        case cc.MethodHubOnName.PLAYER_MESSAGE:
                            cc.PopupController.getInstance().showMessage(m.A[0]);
                            break;
                        //thong bao
                        case cc.MethodHubOnName.MESSAGE:
                            if (!cc.game.isPaused())
                                cc.PopupController.getInstance().showMessage(m.A[0]);
                            break;
                        //nhan message chat
                        case cc.MethodHubOnName.RECEIVE_MESSAGE:
                            cc.ChatRoomController.getInstance().addChatContent(m.A);
                            this.controller.playerShowBubbleChat(m.A);
                            break;

                    }
                });

            } else if (response.R && response.R.AccountID) {
                this.currAccId = response.R.AccountID;
                this.sendRequestOnHub(cc.MethodHubName.PLAY_NOW);
                //sau khi enterLobby
                cc.PopupController.getInstance().hideBusy();

            } else {
                //PING PONG
                if (response.I) {
                    this.xeng777Hub.pingPongResponse(response.I);
                }
            }
        },

        onHubOpen: function () {
            cc.PopupController.getInstance().hideBusy();
            this.sendRequestOnHub(cc.MethodHubName.ENTER_LOBBY);
            cc.PopupController.getInstance().showBusy();
            this.bgLoadingIntro.getComponent(cc.Animation).play('bgLoadingIntro');
        },

        onHubClose: function () {
            if ((new Date()).getTime() - this.lastTimeReconnect >= netConfig.RECONNECT_TIME * 1000) {
                this.reconnect();
            } else {
                cc.director.getScheduler().schedule(this.reconnect, this, netConfig.RECONNECT_TIME, 0, 0, false);
            }
        },

        onHubError: function () {

        },

        playerLeave: function (info) {
            var accID = info[0];
            if (accID === cc.LoginController.getInstance().getUserId()) {
                var message = info[1];
                cc.LobbyController.getInstance().destroyDynamicView(null);
                cc.PopupController.getInstance().showMessage(message)
            }
        },

        chatClicked: function () {
            cc.ChatRoomController.getInstance().showChat();
        },

        getSpriteFrameSound: function (active) {
            if (active) {
                return this.spSounds[0];
            }

            return this.spSounds[1];
        },

        getSpriteFrameMusic: function (active) {
            if (active) {
                return this.spMusics[0];
            }

            return this.spMusics[1];
        },

        muteSound: function (status) {
            this.audioBet.mute = status;
            this.audioSpin.mute = status;
            this.audioSpined.mute = status;
            this.audioTai.mute = status;
            this.audioXiu.mute = status;
            this.audioWin.mute = status;
        },

        muteMusic: function (status) {
            this.audioBg.mute = status;
        },

        soundStartBet: function () {
            this.audioBg.mute = false;
            this.audioBg.play();

            this.audioSpin.stop();

            this.audioSpined.stop();

            this.audioTai.stop();

            this.audioXiu.stop();

            this.audioWin.stop();
        },

        soundStartResult: function () {
            this.audioBg.stop();

            this.audioSpin.play();
        },

        soundEndResult: function () {
            this.audioSpin.stop();

            this.audioSpined.play();
        },

        soundBet: function () {
            this.audioBet.play();
        },

        soundResult: function (value) {
            var self = this;
            if (value <= 6) {
                this.audioXiu.play();
            } else if (value >= 8) {
                this.audioTai.play();
            }

            cc.director.getScheduler().schedule(() => {
                self.audioWin.play();
            }, self, 0, 0, 2, false);
        }

    });
}).call(this);