/**
 * Created by Welcome on 5/28/2019.
 */

var netConfig = require('NetConfig');

(function () {
    cc.LiveXXView = cc.Class({
        "extends": cc.Component,
        properties: {
            spriteSound: cc.Sprite,
            sfSounds: [cc.SpriteFrame], //0=on, 1=off

            spriteBack: cc.Sprite,
            lbJackpotAmount:cc.LabelIncrement,
            screenLive:cc.Node
            // nodeParentChat: cc.Node,
            // prefabChat: cc.Prefab,
        },

        onLoad: function () {
            cc.LiveXXController.getInstance().setLiveXXView(this);
            cc.ChatRoomController.getInstance().setHubView(this);
            cc.LobbyController.getInstance().setLiveXocDiaView(this);

            // var nodeChat = cc.instantiate(this.prefabChat);
            // this.nodeParentChat.addChild(nodeChat);
            // nodeChat.setPosition(0,0);
            cc.LobbyController.getInstance().setActiveLiveXocDiaFromLobby();
            this.interval = null;
            this.isActiveChat = false;

            this.lastTimeReconnect = (new Date()).getTime();

            this.connectHub();

            this.currentState = -1;

            //id send playNow
            this.idPlayNow = 0;

            //dang dang ky leaveRoom
            this.isRegisterLeaveRoom = false;


        },
        setActiveLiveXocDia:function(active)
        {
            if (cc.LiveXXPopupController.getInstance().getPopupCount()>0)
                active = false;
            if (active) {
                this.screenLive.setPosition(0,0);
            }
            else this.screenLive.setPosition(2000,0);

        },
        start: function () {
            //Check Sound
            this.sound = cc.Tool.getInstance().getItem("@Sound").toString() === 'true';

            this.spriteSound.spriteFrame = this.sound ? this.sfSounds[0] : this.sfSounds[1];

            cc.AudioController.getInstance().enableSound(this.sound);
        },


        onEnable: function () {
            cc.BalanceController.getInstance().updateBalance(cc.BalanceController.getInstance().getBalance());
            cc.PopupController.getInstance().showBusy();
        },

        onDestroy: function () {
            cc.LobbyJackpotController.getInstance().pauseUpdateJackpot(false);
            this.sendRequestOnHub(cc.MethodHubName.EXIT_LOBBY);
            cc.LobbyController.getInstance().setLiveXocDiaView(null);
            if (this.interval !== null) {
                clearInterval(this.interval);
            }
            if (this.LiveXXHub)
                this.LiveXXHub.disconnect();

            this.unscheduleAllCallbacks();
            cc.LiveXXController.getInstance().setLiveXXView(null);

            if (cc.sys.isNative) {
                var bundle = cc.assetManager.getBundle('xocdialive');
                if(bundle)
                 bundle.releaseAll();
            }
            cc.PopupController.getInstance().hideBusy();
        },

        reset: function () {
            this.isTimer = false;
            this.timer = 0;
            this.currentState = 999;
            if (this.interval !== null) {
                clearInterval(this.interval);
            }
        },

        stopTimer: function () {
            this.isTimer = false;
            if (this.interval !== null) {
                clearInterval(this.interval);
            }
        },

        updateInfo: function (sessionInfo) {

            //luu lai state hien tai

            switch (sessionInfo.CurrentState) {
                case cc.LiveXXState.BETTING:

                    break;
                case cc.LiveXXState.OPEN_PLATE:

                    break;
                case cc.LiveXXState.SHOW_RESULT:

                    break;
                case cc.LiveXXState.WAITING:

                    break;
                case cc.LiveXXState.SHAKING:

                    break;
            }

            this.currentState = sessionInfo.CurrentState;
            this.startTimer(sessionInfo.Ellapsed);
        },


        updateTimer: function (time) {
            if (time < 1) return;
            // this.lbTimer.string = cc.Tool.getInstance().convertSecondToTime2(time);

            switch (this.currentState) {
                case cc.LiveXXState.BETTING:
                case cc.LiveXXState.OPEN_PLATE:
                    this.lbTimer.string = time;
                    this.lbTimer.font = time > 3 ? this.bmfNormal : this.bmfRed;
                    this.lbTimer.node.parent.active = true;
                    break;
                case cc.LiveXXState.SHOW_RESULT:
                    this.lbTimer.node.parent.active = false;
                    break;
                case cc.LiveXXState.WAITING:
                    this.lbTimer.node.parent.active = false;
                    break;
                case cc.LiveXXState.SHAKING:
                    this.lbTimer.node.parent.active = false;
                    break;
            }
        },

        disconnectAndLogout: function () {
            if (this.LiveXXHub) {
                this.LiveXXHub.disconnect();
            }
            this.lastTimeReconnect = (new Date()).getTime();
        },

        connectHub: function () {
            var negotiateCommand = new cc.NegotiateCommand;
            negotiateCommand.execute(this, cc.SubdomainName.XOC_DIA_LIVE);
        },

        reconnect: function () {
            this.lastTimeReconnect = (new Date()).getTime();
            this.LiveXXHub.connect(this, cc.HubName.XocDiaLiveHub, this.connectionToken, true);
        },

        //data1 = amount
        //data2 = gate
        sendRequestOnHub: function (method, data1, data2) {
            switch (method) {
                case cc.MethodHubName.ENTER_LOBBY:
                    this.LiveXXHub.enterLobby();
                    break;
                case cc.MethodHubName.EXIT_LOBBY:
                    this.LiveXXHub.exitLobby();
                    break;
                case cc.MethodHubName.PLAY_NOW:
                    this.idPlayNow = this.LiveXXHub.getRecentID();
                    this.LiveXXHub.playNow();
                    break;
                case cc.MethodHubName.BET:
                    this.LiveXXHub.bet(data1, data2);
                    break;
                case cc.MethodHubName.REGISTER_LEAVE_ROOM:
                    this.LiveXXHub.registerLeaveRoom();
                    break;
                case cc.MethodHubName.UNREGISTER_LEAVE_ROOM:
                    this.LiveXXHub.unRegisterLeaveRoom();
                    break;
                case cc.MethodHubName.SEND_MESSAGE:
                    this.LiveXXHub.sendRoomMessage(data1);
                    break;
                case cc.MethodHubName.TIP_DEALER:
                    this.LiveXXHub.tipDealer(data1);
                    break;
            }
        },

        onSlotsNegotiateResponse: function (response) {
            this.connectionToken = response.ConnectionToken;
            this.LiveXXHub = new cc.Hub;
            this.LiveXXHub.connect(this, cc.HubName.XocDiaLiveHub, response.ConnectionToken);
        },

        onHubMessage: function (response) {

            if (response.M !== undefined && response.M.length > 0) {
                var mArray = response.M;
                mArray.map(m => {
                    switch (m.M) {
                        //Thong tin phien
                        case cc.MethodHubOnName.SESSION_INFO:
                            cc.LiveXXController.getInstance().updateInfo(m.A[0], m.A[0].Phrase, null);
                            cc.LiveXXController.getInstance().updateInput(m.A[0].Phrase);
                            cc.LiveXXController.getInstance().updateTotalBet(m.A[0]);
                            break;
                        //Lich su choi
                        case cc.MethodHubOnName.GAME_HISTORY:
                            cc.LiveXXController.getInstance().resetDraw();
                            //ve bang Soi Cau
                            cc.LiveXXController.getInstance().draw(m.A[0]);
                            break;
                        //thoi gian + trang thai phien
                        case cc.MethodHubOnName.START_ACTION_TIMER:
                            var data = m.A;
                            cc.LiveXXController.getInstance().updateInfo(data[0], data[2], data[1]);
                            // cc.LiveXXController.getInstance().updateResult(data[0].Players, data[0].GameLoop.Result, data[0].GameLoop.OriginResult, data[2]);
                            cc.LiveXXController.getInstance().updateResult(null, data[0].Result, data[0].Result.ChipsData, data[2]);
                            cc.LiveXXController.getInstance().updateInput(data[2]);
                            cc.LiveXXController.getInstance().updateTotalBet(data[0]);
                            break;
                        //nguoi choi roi ban
                        case cc.MethodHubOnName.PLAYER_LEAVE:
                            //phuc vu cho bot Xoc Xoc -> can thoat nhieu ng choi
                            if (mArray.length === 0) {
                                cc.LiveXXController.getInstance().playerLeave(m.A);
                            }
                            break;

                        //cap nhat trang thai cua nguoi choi
                        case cc.MethodHubOnName.UPDATE_CONNECTION_STATUS:
                            cc.LiveXXController.getInstance().updateConnectionStatus(m.A);
                            break;

                        //cập nhật lại trạng thái player
                        case cc.MethodHubOnName.UPDATE_PLAYER_STATUS:
                            cc.LiveXXController.getInstance().updatePlayerStatus(m.A[0]);
                            break;

                        //vao phong
                        case cc.MethodHubOnName.JOIN_GAME:
                            var data = m.A[0];
                            var info = m.A[1];
                            cc.LiveXXController.getInstance().updateInfoCurrPlayer(data.Account);
                            cc.PopupController.getInstance().hideBusy();
                            break;
                        //Tai hien cac cua da dat
                        case cc.MethodHubOnName.BET_SESSION:
                            cc.LiveXXController.getInstance().showLastInput(m.A[0]);
                            break;
                        //Thong tin bet cua nguoi choi
                        case cc.MethodHubOnName.BET_OF_ACCOUNT:
                            break;
                        //thong tin nguoi choi dat cuoc
                        case cc.MethodHubOnName.PLAYER_BET:
                            var data = m.A;
                            cc.LiveXXController.getInstance().playerBet(data);
                            break;
                        case cc.MethodHubOnName.BET_SUCCESS:
                            console.log(m.A[0]);
                            cc.LiveXXController.getInstance().updateBetAmountGate(m.A[0]);
                            cc.LiveXXController.getInstance().updateBalance();
                            break;
                        //Thong tin win cua vip
                        case cc.MethodHubOnName.WIN_RESULT_VIP:
                            // if (m.A.length > 0) {
                            //     try {
                            //         setTimeout(function () {
                            //             cc.LiveXXController.getInstance().winResultVip(m.A[0]);
                            //         }, 500);
                            //     } catch (e) {

                            //     }

                            // }
                            break;
                        //Thong tin win cua vip
                        case cc.MethodHubOnName.WIN_RESULT:
                            if (m.A.length > 0) {
                                try {
                                    setTimeout(function () {
                                        cc.LiveXXController.getInstance().winResult(m.A[0]);
                                        cc.LiveXXController.getInstance().updateBalance();
                                    }, 500);
                                } catch (e) {

                                }

                            }
                            break;
                        //Tong tien win groupuser
                        case cc.MethodHubOnName.TOTAL_WIN_MONEY:
                            // if(m.A[0] > 0) {
                            //     setTimeout(function () {
                            //         cc.LiveXXController.getInstance().totalUserWin(m.A[0]);
                            //     }, 2500);
                            // }
                            break;
                        //thong bao khi dat cuoc
                        case cc.MethodHubOnName.PLAYER_MESSAGE:
                            cc.PopupController.getInstance().showMessage(m.A[0]);
                            break;

                        //thong bao
                        case cc.MethodHubOnName.MESSAGE:
                            cc.PopupController.getInstance().showMessage(m.A[0]);
                            break;

                        //mo bat
                        case cc.MethodHubOnName.OPEN_PLATE_NOW:
                            cc.LiveXXController.getInstance().updateResult(null, m.A[0], m.A[1], cc.LiveXXState.OPEN_PLATE, true);
                            cc.LiveXXController.getInstance().updateInput(cc.LiveXXState.OPEN_PLATE);
                            break;

                        //nhan message chat
                        case cc.MethodHubOnName.RECEIVE_MESSAGE:
                            let chat = {
                                "i": "xocdialive",
                                "n": "Hệ Thống",
                                "c": m.A[1],
                                "ad": true,
                                "s": 1,
                                "v": 3
                            }
                            cc.ChatController.getInstance().addChatContent(chat);
                            break;
                        case cc.MethodHubOnName.SUMMARY_PLAYER:
                            cc.LiveXXController.getInstance().summaryPlayer(m.A[0]);
                            break;
                        //Cap nhat danh sach player
                        case cc.MethodHubOnName.VIP_PLAYERS:
                            // let dataPlayers = m.A[0];
                            // console.log("VIP_PLAYERS: ", m.A);
                            // if (dataPlayers.length > 0) {
                            //     cc.LiveXXController.getInstance().vipPlayer(dataPlayers);
                            // }
                            break;
                        //FIX BUG
                        case cc.MethodHubOnName.XDL_JACKPOT_INFO:
                            
                                if (m.A[1]!=-1) {
                                    cc.LiveXXController.getInstance().showJackpotEffect(m.A[0],m.A[1]);
                                }
                                // {"C":"d-EE39EAE8-B,665|G,5|H,1","M":[{"H":"sedieLiveHub","M":"jackpotInfor","A":[339400,4]}]}
                                this.lbJackpotAmount.tweenValueto(m.A[0]);
                                break;
                        case cc.MethodHubOnName.UPDATE_ROOM_TIME:
                            cc.LiveXXController.getInstance().updateTimer(m.A[0]);
                            break;
                        case cc.MethodHubOnName.XDL_TIP_SUCCESS:
                            cc.LiveXXController.getInstance().updateBalance(m.A[3]);
                            break;

                    }
                });


                //phuc vu cho bot Xoc Xoc -> can thoat nhieu ng choi
                if (mArray && mArray.length > 0) {
                    mArray.forEach(function (m) {
                        if (m.M === cc.MethodHubOnName.PLAYER_LEAVE) {
                            cc.LiveXXController.getInstance().playerLeave(m.A);
                        }
                    });
                }

            } else if (response.R && response.R.AccountID) {
                //sau khi enterLobby
                cc.PopupController.getInstance().showBusy();
                this.sendRequestOnHub(cc.MethodHubName.PLAY_NOW);
            } else if (response.R && response.I === this.idPlayNow.toString()) {
                this.idPlayNow = 0;
                cc.PopupController.getInstance().hideBusy();
            } else {
                //PING PONG
                if (response.I) {
                    this.LiveXXHub.pingPongResponse(response.I);
                }
            }
        },

        onHubOpen: function () {
            cc.PopupController.getInstance().hideBusy();
            this.sendRequestOnHub(cc.MethodHubName.ENTER_LOBBY);
            cc.PopupController.getInstance().showBusy();
        },

        onHubClose: function () {
            // cc.TaiXiuController.getInstance().reset();
            //reconnect
            // console.log((new Date()).getTime() - this.lastTimeReconnect);
            if ((new Date()).getTime() - this.lastTimeReconnect >= netConfig.RECONNECT_TIME * 1000) {
                this.reconnect();
            } else {
                cc.director.getScheduler().schedule(this.reconnect, this, netConfig.RECONNECT_TIME, 0, 0, false);
            }
        },

        onHubError: function () {
            cc.PopupController.getInstance().hideBusy();
        },

        //HubOn
        playerLeave: function (info) {
            var accID = info[0];
            if (accID === cc.LoginController.getInstance().getUserId()) {
                var message = info[1];
                cc.LobbyController.getInstance().destroyDynamicView(null);
                cc.PopupController.getInstance().showMessage(message)
            }
        },
        tipDealer:function(amount)
        {
            this.sendRequestOnHub(cc.MethodHubName.TIP_DEALER,amount);
        },
        //huong dan
        helpClicked: function () {
            cc.LiveXXPopupController.getInstance().createHelpView();
        },

        //lich su dat cuoc
        historyClicked: function () {
            cc.LiveXXPopupController.getInstance().createHistoryView();
        },

        //bang xep hang dat cuoc
        topClicked: function () {
            cc.LiveXXPopupController.getInstance().createTopView();
        },
        jackpotHistoryClicked: function () {
            cc.LiveXXPopupController.getInstance().createJackpotHistoryView();
        },

        //bieu do chi tiet cac phien
        graphClicked: function () {
            cc.LiveXXPopupController.getInstance().createGraphView();
        },

        soundClicked: function () {
            this.sound = !this.sound;
            cc.Tool.getInstance().setItem("@Sound", this.sound);
            this.spriteSound.spriteFrame = this.sound ? this.sfSounds[0] : this.sfSounds[1];
            cc.AudioController.getInstance().enableSound(this.sound);
        },

        backClicked: function () {
            cc.LobbyController.getInstance().destroyViewXocDia();
        },

        // chatClicked: function () {
        //     cc.ChatRoomController.getInstance().showChat();
        // },
    });
}).call(this);
