/*
 * Generated by BeChicken
 * on 9/11/2019
 * version v1.0
 */
var netConfig = require('NetConfig');

(function () {
    cc.MB_LobbyView = cc.Class({
        "extends": cc.Component,
        properties: {
            nodeChooseRoomView: cc.Node,
            nodeMainRoomView: cc.Node,

            //chat
            nodeParentChat: cc.Node,
            prefabChat: cc.Prefab,
        },

        onLoad: function () {

            cc.MB_Controller.getInstance().setMBLobbyView(this);
            cc.ChatRoomController.getInstance().setHubView(this);

            this.hubName = cc.HubName.MBHub;
            this.subDomainName = cc.SubdomainName.MAU_BINH;
            this.interval = null;
            this.isActiveChat = false;
            this.lastTimeReconnect = (new Date()).getTime();
            this.currentState = -1;

            //id send playNow
            this.idPlayNow = 0;

            //check jonGame
            this.currAccId = null;

            this.connectHub();

            var nodeChat = cc.instantiate(this.prefabChat);
            this.nodeParentChat.addChild(nodeChat);
        },
        start(){
            this.enableChooseRoom(true);
        },

        // set gia tri bet cho room
        setBetRoom: function (room, betRoom) {
            let bRoom = parseInt(betRoom);
            cc.MB_Controller.getInstance().setBetRoom(bRoom);
            this.sendRequestOnHub(cc.MethodHubName.PLAY_NOW);
        },

        enableChooseRoom: function (enable) {
        
            this.nodeChooseRoomView.active = enable;
            this.nodeMainRoomView.active = !enable;
            cc.LobbyController.getInstance().activeNodeTopBar(enable);
            cc.LobbyController.getInstance().activeCardGame(enable);   
        },

        onDestroy: function () {
            cc.LobbyJackpotController.getInstance().pauseUpdateJackpot(false);

            if (this.interval !== null) {
                clearInterval(this.interval);
            }
            if (this.MBHub)
                this.MBHub.disconnect();

            this.unscheduleAllCallbacks();
            cc.MB_Controller.getInstance().setMBLobbyView(null);

            if (cc.sys.isNative) {
                var bundle = cc.assetManager.getBundle('maubinh');
                if(bundle) bundle.releaseAll();
            }
        },

        disconnectAndLogout: function () {
            if (this.MBHub) {
                this.MBHub.disconnect();
            }
            this.lastTimeReconnect = (new Date()).getTime();
        },

        connectHub: function () {
            var negotiateCommand = new cc.NegotiateCommand;
            negotiateCommand.execute(this, this.subDomainName);
        },

        reconnect: function () {
            this.lastTimeReconnect = (new Date()).getTime();
            this.MBHub.connect(this, this.hubName, this.connectionToken, true);
        },

        //data1 = amount
        //data2 = gate
        sendRequestOnHub: function (method, data1, data2) {
            switch (method) {
                case cc.MethodHubName.ENTER_LOBBY:
                    this.MBHub.enterLobby();
                    break;
                case cc.MethodHubName.PLAY_NOW:
                    let minBet = cc.MB_Controller.getInstance().getBetRoom();
                    this.MBHub.playNow(minBet);
                    break;
                case cc.MethodHubName.REGISTER_LEAVE_ROOM: // Dang ky roi ban
                    this.MBHub.registerLeaveRoom();
                    break;
                case cc.MethodHubName.UNREGISTER_LEAVE_ROOM: // Huy DK roi ban
                    this.MBHub.unRegisterLeaveRoom();
                    break;
                case cc.MethodHubName.SEND_MESSAGE:
                    this.MBHub.sendRoomMessage(data1);
                    break;
                case cc.MethodHubName.CHECK_CHI:
                    this.MBHub.checkChi(data1);
                    break;
                case cc.MethodHubName.FINISH_GAME:
                    this.MBHub.finishGame(data1);
                    break;
                case cc.MethodHubName.START_GAME:
                    this.MBHub.startGame();//Bat dau choi
                    break;
            }
        },

        onSlotsNegotiateResponse: function (response) {
            this.connectionToken = response.ConnectionToken;
            this.MBHub = new cc.Hub;
            this.MBHub.connect(this, this.hubName, response.ConnectionToken);
        },

        onHubMessage: function (response) {
            if (response.M !== undefined && response.M.length > 0) {
                let res = response.M;
                res.map(m => {
                    switch (m.M) {
                        //nguoi choi roi ban
                        case cc.MethodHubOnName.PLAYER_LEAVE:
                            cc.MB_Controller.getInstance().playerLeave(m.A);
                            break;
                        //cap nhat trang thai cua nguoi choi
                        case cc.MethodHubOnName.UPDATE_CONNECTION_STATUS:
                            // console.log("UPDATE_CONNECTION_STATUS", m.A);
                            cc.MB_Controller.getInstance().updateConnectionStatus(m.A);
                            break;

                        //vao phong
                        case cc.MethodHubOnName.JOIN_GAME:
                            this.enableChooseRoom(false);
                            cc.MB_Controller.getInstance().updateNotify("CHỜ NGƯỜI CHƠI");
                            var data = m.A[0];
                            var info = m.A[1];
                            // cc.MB_Controller.getInstance().setBetRoom(m.A[0].MinBet);
                            cc.MB_Controller.getInstance().joinGame(data, info);
                            cc.MB_Controller.getInstance().updateInfo(data);
                            let allowActionsJoin = info.AllowedActions;
                            if (info.Time > 5) {
                                //Kiem tra trang thai game
                                if (allowActionsJoin.includes(cc.MB_ACTIONS_NAME.KET_THUC)) {
                                    cc.MB_Controller.getInstance().updateNotify("XẾP BÀI");
                                    cc.MB_Controller.getInstance().activeLayoutCardPlayer(false);
                                }
                            }
                            //Join game time = 0 thi hien thi ket qua luon
                            if(info.Time == 0 && allowActionsJoin.includes(cc.MB_ACTIONS_NAME.KET_THUC)) {
                                cc.MB_Controller.getInstance().updateNotify("KẾT QUẢ");
                                cc.MB_Controller.getInstance().MB_InfoView.updateResultSumary(data.Players);
                            }

                            //UnRegister roi phong
                            this.sendRequestOnHub(cc.MethodHubName.UNREGISTER_LEAVE_ROOM);
                            cc.PopupController.getInstance().hideBusy();
                            // console.log("JOIN_GAME", m.A);
                            break;
                        //nguoi choi khac vao phong
                        case cc.MethodHubOnName.PLAYER_JOIN:
                            var data = m.A[0];
                            // console.log("PLAYER_JOIN", m.A);
                            cc.MB_Controller.getInstance().playerJoin(data);
                            break;

                        //Thong bao khong du tien
                        case cc.MethodHubOnName.BUY_MANUAL:
                            // console.log("BUY_MANUAL", m.A);
                            this.enableChooseRoom(true);
                            cc.PopupController.getInstance().showMessage(m.A[0]);
                            break;

                        //Trang thai game
                        case cc.MethodHubOnName.START_GAME:
                            //Reset trang thai ban dau cua player
                            cc.MB_Controller.getInstance().resetPlayersResultUI(true);
                            //Time cho hien thi layout chia bai
                            let timeWait = 0;
                            for (let i = 0; i < 7; i++) {
                                timeWait += 0.1 * i;
                            }
                            let timeSort = m.A[0].GameLoop.Elapsed;
                            cc.MB_Controller.getInstance().updateNotify(null);
                            cc.MB_Controller.getInstance().updateInfo(m.A[0]);
                            let baiRacCurrPlayer = m.A[0].Players[cc.LoginController.getInstance().getUserId()].BaiRac;
                            //Lay danh sach bai cua nguoi choi hien tai
                            let listCards = cc.MB_Controller.getInstance().getListCardCurrentPlayer();
                            if (!cc.game.isPaused()) {
                                cc.director.getScheduler().schedule(function () {
                                    cc.MB_Controller.getInstance().updateNotify("XẾP BÀI");
                                    cc.MB_Controller.getInstance().updateProgressOwner([m.A[0].OwnerID, Math.floor(parseInt(timeSort) - timeWait)]);
                                    cc.MB_Controller.getInstance().onShowSortCard(baiRacCurrPlayer, Math.floor(parseInt(timeSort) - timeWait));
                                    cc.MB_Controller.getInstance().showStateSorting(m.A[0]);
                                }, this, 0, 0, timeWait, false);
                            } else {
                                cc.MB_Controller.getInstance().updateNotify("XẾP BÀI");
                                cc.MB_Controller.getInstance().updateProgressOwner([m.A[0].OwnerID, timeSort]);
                                cc.MB_Controller.getInstance().onShowSortCard(baiRacCurrPlayer, timeSort);
                                cc.MB_Controller.getInstance().showStateSorting(m.A[0]);
                            }
                            //Update trang thai cua player
                            cc.MB_Controller.getInstance().setCurrPlayerStatus(cc.MB_PlayerStatus.INGAME);

                            break;

                        //Chuyen phien nguoi choi
                        case cc.MethodHubOnName.START_ACTION_TIMER:
                            //Kiem tra trang thai bat dau game clear het bai
                            let allowActions = m.A[2];
                            if (allowActions.includes(cc.MB_ACTIONS_NAME.START_GAME)) {
                                cc.MB_Controller.getInstance().updateNotify(null);
                                //Reset trang thai ban dau cua player
                                cc.MB_Controller.getInstance().resetPlayersResultUI(true);
                            }
                            cc.MB_Controller.getInstance().updateProgressOwner(m.A);
                            break;
                        //Kiem tra xep chi
                        case cc.MethodHubOnName.CHECK_SORT_CHI:
                            // console.log("CHECK_SORT_CHI");
                            // console.log(m.A);
                            cc.MB_Controller.getInstance().checkSortChi(m.A);
                            break;
                        //Kiem tra xep chi
                        case cc.MethodHubOnName.HA_BAI:
                            // console.log("HA_BAI");
                            // console.log(m.A);

                            if (cc.MB_Controller.getInstance().getCurrPlayerStatus() == cc.MB_PlayerStatus.INGAME) {
                                cc.MB_Controller.getInstance().stopCountTime();
                                //An Layout XepBai
                                cc.MB_Controller.getInstance().activeLayoutSortCard(false);
                                cc.MB_Controller.getInstance().hideBtnXepLai();

                                //An/Hien layout bai hien tai cua player
                                cc.MB_Controller.getInstance().activeLayoutCardPlayer(true);
                            }

                            //Hien thi bai cua player
                            cc.MB_Controller.getInstance().haBai(m.A);
                            //Reset lai bai cua layout xep bai
                            cc.MB_Controller.getInstance().resetSortCards();
                            //Stop updateProgress
                            cc.MB_Controller.getInstance().resetUpdateProgress();
                            break;
                        //Mo bai
                        case cc.MethodHubOnName.SHOW_RESULT:
                            cc.MB_Controller.getInstance().showResult(m.A);
                            break;
                        //Cap nhat tien cuoc cua nguoi choi
                        case cc.MethodHubOnName.UPDATE_ACCOUNT:
                            cc.MB_Controller.getInstance().resetPlayersResultUI(true);
                            cc.MB_Controller.getInstance().updateNotify(null);
                            // cc.MB_Controller.getInstance().updateAccount(m.A);
                            break;
                        //Cap nhat session game
                        case cc.MethodHubOnName.UPDATE_GAME_SESSION:
                            // console.log("UPDATE_GAME_SESSION");
                            // console.log(m.A)
                            cc.MB_Controller.getInstance().updateGameSession(m.A);
                            break;
                        //Hien thi bai cho nguoi choi cung ban nhin thay
                        case cc.MethodHubOnName.FINISH_GAME:
                            // console.log("FINISH_GAME");
                            // console.log(m.A);
                            cc.MB_Controller.getInstance().onFinishGame(m.A);
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
                            cc.MB_Controller.getInstance().playerShowBubbleChat(m.A);
                            break;

                    }
                });

            } else if (response.R && response.R.AccountID) {
                this.currAccId = response.R.AccountID;
                //sau khi enterLobby
                //cc.PopupController.getInstance().showBusy();
                cc.PopupController.getInstance().hideBusy();

            } else {
                //PING PONG
                if (response.I) {
                    this.MBHub.pingPongResponse(response.I);
                }
            }
        },

        onHubOpen: function () {
            cc.PopupController.getInstance().hideBusy();
            this.sendRequestOnHub(cc.MethodHubName.ENTER_LOBBY);
            cc.PopupController.getInstance().showBusy();
        },

        onHubClose: function () {
            //reconnect
            // console.log((new Date()).getTime() - this.lastTimeReconnect);
            if ((new Date()).getTime() - this.lastTimeReconnect >= netConfig.RECONNECT_TIME * 1000) {
                this.reconnect();
            } else {
                cc.director.getScheduler().schedule(this.reconnect, this, netConfig.RECONNECT_TIME, 0, 0, false);
            }
        },

        onHubError: function () {

        },

        //HubOn
        playerLeave: function (info) {

            var accID = info[0];
            if (accID === cc.LoginController.getInstance().getUserId()) {
                //Reset trang thai ban dau cua player
                cc.MB_Controller.getInstance().resetPlayersResultUI(false);
                cc.MB_Controller.getInstance().resetUIBackButton();
                this.enableChooseRoom(true);
                var message = info[1];
                // cc.LobbyController.getInstance().destroyDynamicView(null);
                cc.PopupController.getInstance().showMessage(message)
            }
        },

        //huong dan
        helpClicked: function () {
            cc.BCPopupController.getInstance().createHelpView();
        },

        chatClicked: function () {
            cc.ChatRoomController.getInstance().showChat();
        },
    });
}).call(this);
