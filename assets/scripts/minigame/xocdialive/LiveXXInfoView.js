/**
 * Created by Welcome on 5/28/2019.
 */

(function () {
    cc.LiveXXInfoView = cc.Class({
        "extends": cc.Component,
        properties: {
            //phien
            lbSID: cc.Label,
            //thoi gian
            timerSkeleton: sp.Skeleton,
            //giai doan (đặt cửa, kết quả...)
            lbInfo: cc.Label,
            //total user
            lbTotalUser: cc.Label,
            // lbTotalUserWin: cc.Label,
            //players
            LiveXXPlayers: [cc.LiveXXPlayer],
            lbBalance:cc.LabelIncrement
        },

        onLoad: function () {
            this.interval = null;
            this.timeBet = 35;
            this.reset();
            cc.LiveXXController.getInstance().setLiveXXInfoView(this);

            this.maxPlayer = this.LiveXXPlayers.length;

            this.animInfo = this.lbInfo.node.parent.getComponent(cc.Animation);

            this.currPlayer = this.LiveXXPlayers[0];
        },
        //Cap nhat thong tin nguoi choi hien tai
        updateInfoCurrPlayer: function (data) {
            this.currPlayer.registerPlayer(data);
        },
        //HubOn - joinGame
        joinGame: function (info) {
            
            //lay ve mang vi tri player
            this.positions = info.Positions;

            this.countPlayer = 0;
            //luu vi tri player tren UI
            this.positionsUI = [0, 0, 0, 0, 0, 0, 0];

            //tim index của owner
            this.onwerIndex = 0;

            //gan vi tri Owner
            this.positionsUI[this.countPlayer] = cc.LoginController.getInstance().getUserId();

            this.countPlayer++;
            for (var i = 0; i < this.maxPlayer; i++) {
                var accID = this.positions[i];
                //add vi tri cac accID khac vao position tren UI
                if (accID > 0 && accID !== cc.LoginController.getInstance().getUserId()) {
                    this.positionsUI[this.countPlayer] = accID;
                    this.countPlayer++;
                }
            }

            //lay ve players
            var players = info.Players;

            for (var i = 0; i < this.maxPlayer; i++) {
                var accID = this.positions[i];
                //cac vi tri co nguoi choi: accID > 0
                if (accID > 0) {
                    this.registerPlayer(this.getIndexUIBetByAccID(accID), players[accID].Account);
                }
            }
            cc.LiveXXController.getInstance().updatePositionPlayerUI(this.positionsUI);
        },

        //HubOn - playerJoin
        playerJoin: function (info) {
            for (var i = 0; i < this.maxPlayer; i++) {
                var accID = this.positionsUI[i];
                if (accID === 0) {
                    this.positionsUI[i] = info.Account.AccountID;
                    this.registerPlayer(i, info.Account);
                    break;
                }
            }
        },

        //HubOn - playerLeave
        playerLeave: function (info) {
            //dam bao joinGame xong moi xu ly - tranh loi server neu bi
            if (this.positionsUI) {
                var accID = info[0];

                this.unRegisterPlayer(this.getIndexUIBetByAccID(accID));

                var index = -1;
                for (var i = 0; i < this.maxPlayer; i++) {
                    if (accID === this.positionsUI[i]) {
                        index = i;
                        break;
                    }
                }

                this.positionsUI[index] = 0;
            }
        },

        //HubOn - updateConnectionStatus
        updateConnectionStatus: function (info) {
            if (this.positionsUI) {
                var accID = info[0];
                var status = info[1];
                this.LiveXXPlayers[this.getIndexUIBetByAccID(accID)].updateConnectionStatus(status);

                //neu la owner dky rời game -> tắt game
                if (status === cc.LiveXXConnectionStatus.REGISTER_LEAVE_GAME && accID === cc.LoginController.getInstance().getUserId()) {
                    cc.LobbyController.getInstance().destroyDynamicView(null);
                }
            }
        },

        //HubOn - updatePlayerStatus
        updatePlayerStatus: function (playerStatus) {
            if (this.positionsUI) {
                this.LiveXXPlayers[0].updatePlayerStatus(playerStatus);
            }
        },
        //HubOn - summaryPlayer
        summaryPlayer: function (totalUser) {
            this.lbTotalUser.string = totalUser;
        },

        //HubOn - vipPlayer
        vipPlayer: function (dataPlayers) {
            let countPlayer = 0;
            this.positionsUI = [0, 0, 0, 0, 0, 0, 0];
            this.positionsUI[0] = cc.LoginController.getInstance().getUserId();
            countPlayer++;
            dataPlayers.map(player => {
                if (player.AccountID != cc.LoginController.getInstance().getUserId()) {
                    if (countPlayer <= 6) {
                        this.positionsUI[countPlayer] = player.AccountID;
                        countPlayer++;
                    }
                }
            }, this);
        },
        //HubOn - totalUserWin
        totalUserWin: function (amount) {
            // //set gia tri
            // this.lbTotalUserWin.string = cc.Tool.getInstance().formatNumber(amount);
            // //play fx thang
            // this.lbTotalUserWin.node.active = true;
            // this.lbTotalUserWin.node.getComponent(cc.Animation).play('XXWin');
        },
        //HubOn - WinResultVip
        winResultVip: function (dataPlayer) {
            if (!this.positionsUI)
                return;
            if (dataPlayer.length > 0) {
                dataPlayer.map(player => {
                    let indexPlayer = this.positionsUI.indexOf(player.AccountID);
                    if (player.AccountID != cc.LoginController.getInstance().getUserId() && indexPlayer != -1) {
                        this.LiveXXPlayers[indexPlayer].playerResultUI(true, player.Award);
                        this.LiveXXPlayers[indexPlayer].updateChip(player.Balance);
                    }
                });
            }
        },
        //HubOn - WinResult
        winResult: function (dataPlayer) {
            if (!this.currPlayer)
                return;
            if (dataPlayer.JackpotAmount&&dataPlayer.JackpotAmount>0) {
                this.currPlayer.playerResultUI(true, dataPlayer.JackpotAmount+dataPlayer.Award);
                this.currPlayer.updateChip(dataPlayer.Balance);
                let gateName = '';
                switch(dataPlayer.JackpotGateId)
                {
                    case 1:
                        gateName = "Lẻ";
                        break;
                    case 2:
                        gateName = "3 Trắng";
                        break;
                    case 3:
                        gateName = "3 Đỏ";
                        break;
                    case 4:
                        gateName = "Chẵn";
                        break;
                    case 5:
                        gateName = "4 Trắng";
                        break;
                    case 6:
                        gateName = "4 Đỏ";
                        break;
                }
                cc.PopupController.getInstance().showMessage("Chúc mừng bạn đã nổ hũ. Cửa đặt: "+ gateName+". Số tiền: "+dataPlayer.JackpotAmount);
                return;
            }
            this.currPlayer.playerResultUI(true, dataPlayer.Award);
            this.currPlayer.updateChip(dataPlayer.Balance);
        },
        updateChip: function (accID, chip) {
            if (this.positionsUI.indexOf(accID) != -1) {
                this.LiveXXPlayers[this.getIndexUIBetByAccID(accID)].updateChip(chip);
            }
        },
        updateBalance:function(newAmount)
        {
            if (newAmount) {
                this.lbBalance.tweenValueto(newAmount);
                return;
            }
            var getBalanceCommand = new cc.GetBalanceCommand;
            getBalanceCommand.execute(this);
        },
        onGetBalanceResponse: function (response) {
            this.lbBalance.tweenValueto(response.balance);
        },
        getPositions: function () {
            return this.positionsUI;
        },

        //lay ve index bet theo accID
        getIndexUIBetByAccID: function (accID) {
            var indexBet = -1;
            try {
                for (var i = 0; i < this.maxPlayer; i++) {
                    if (this.positionsUI[i] === accID) {
                        indexBet = i;
                        break;
                    }
                }
            } catch (err) {

            }
            // console.log('getIndexUIBetByAccID: ' + indexBet);
            return indexBet;
        },

        //lay ve index bet theo accID
        getIndexUIBetByPosition: function (pos) {
            var indexBet = pos;

            if (indexBet > this.onwerIndex) {
                //map lai theo UI
                indexBet += this.onwerIndex;

                if (indexBet >= this.maxPlayer) {
                    indexBet -= (this.maxPlayer - 1);
                }
            } else if (indexBet < this.onwerIndex) {
                //map lai theo UI
                indexBet -= this.onwerIndex;
                if (indexBet < 0) {
                    indexBet = (this.maxPlayer + indexBet);
                }
            } else {
                indexBet = 0;
            }

            // console.log('getIndexUIBetByPosition: ' + indexBet);
            return indexBet;
        },

        //reset UI ket qua (win/lose) sau moi Phien cua tat ca player
        resetPlayersResultUI: function () {
            // this.lbTotalUserWin.node.active = false;
            for (var i = 0; i < this.maxPlayer; i++) {
                this.LiveXXPlayers[i].resetPlayerResultUI();
            }
        },

        //set ket qua cua player
        playerResultUI: function (playerIndex, isWin, amount) {
            this.LiveXXPlayers[playerIndex].playerResultUI(isWin, amount);
        },

        //player vao phong
        registerPlayer: function (playerIndex, info) {
            this.LiveXXPlayers[playerIndex].registerPlayer(info);
        },

        unRegisterPlayer: function (playerIndex) {
            this.LiveXXPlayers[playerIndex].unRegisterPlayer();
        },

        playerShowBubbleChat: function (message) {
            if (cc.ChatRoomController.getInstance().checkIsEmotion(message)) {
// <<<<<<< HEAD
//                 this.LiveXXPlayers.forEach(function (player) {
//                     if (player.lbName.string === cc.Config.getInstance().formatName(message[0], 7)
//                         && player.lbSID.string === cc.Config.getInstance().getServiceNameNoFormat(message[2])) {
//                         player.showEmotion(cc.ChatRoomController.getInstance().getIndexEmotion(message)
// =======
                this.LiveXXPlayers.forEach(function (LiveXXPlayer) {
                    if (LiveXXPlayer.nickName === message[0]) {
                        LiveXXPlayer.showEmotion(cc.ChatRoomController.getInstance().getIndexEmotion(message)
// >>>>>>> remotes/origin/Update-DgTiger-LiveXX
                            , message);
                    }
                });
            } else {
// <<<<<<< HEAD
//                 this.LiveXXPlayers.forEach(function (player) {
//                     if (player.lbName.string === cc.Config.getInstance().formatName(message[0], 7)
//                         && player.lbSID.string === cc.Config.getInstance().getServiceNameNoFormat(message[2])) {
//                         player.showBubbleChat(message);
// =======
                this.LiveXXPlayers.forEach(function (LiveXXPlayer) {
                    if (LiveXXPlayer.nickName === message[0]) {
                        LiveXXPlayer.showBubbleChat(message);
// >>>>>>> remotes/origin/Update-DgTiger-LiveXX
                    }
                });
            }

        },

        reset: function () {
            this.isTimer = false;
            this.timer = 0;
            this.currentState = 999;
            if (this.interval !== null) {
                clearInterval(this.interval);
            }
            this.timerSkeleton.clearTracks();
            this.timerSkeleton.setToSetupPose();
            this.timerSkeleton.setAnimation(0,"Anim_00",false);
        },

        startTimer: function (remaining) {
            if (this.interval !== null) {
                clearInterval(this.interval);
            }

            var self = this;
            this.timer = remaining;
            this.isTimer = true;

            ////update timer UI
            this.updateTimer(remaining);

            this.interval = setInterval(function () {
                if (self.isTimer) {
                    self.timer -= 1;
                    self.updateTimer(self.timer);
                }
            }, 1000);

        },

        updateTimer: function (time) {
            this.timeInt = time;
            if (this.timeInt <= 3 && this.currentState === cc.LiveXXState.BETTING) {
                cc.LiveXXController.getInstance().activeAllButtonBet(false);
            }
            if (this.currentState==cc.LiveXXState.BETTING) {
                this.timerSkeleton.clearTracks();
                this.timerSkeleton.setToSetupPose();
                console.log("Anim_"+(this.timeInt>9?this.timeInt:"0"+this.timeInt));
                this.timerSkeleton.setAnimation(0,"Anim_"+(this.timeInt>9?this.timeInt:"0"+this.timeInt),false);

            }
            if (time==3&&this.currentState==cc.LiveXXState.BETTING) {
                cc.director.getScheduler().schedule(function () {
                    this.lbInfo.string = 'Dừng đặt cược';
                }.bind(this), this, 0, 0, 1, false);            
            }
            if (time==1&&this.currentState==cc.LiveXXState.BETTING) {
                cc.director.getScheduler().schedule(function () {
                    this.timerSkeleton.clearTracks();
                    this.timerSkeleton.setToSetupPose();
                    this.timerSkeleton.setAnimation(0,"Anim_00",false);
                    this.lbInfo.string = 'Quay jackpot';
                }.bind(this), this, 0, 0, 1, false);            
            }
            
        },

        getTime: function () {
            return this.timeInt;
        },

        updateSessionId: function (sID) {
            this.lbSID.string = '#' + sID;
            const config =   cc.LiveXXController.getInstance().getRoomConfig();
            // this.lbRoomValue.string = cc.Tool.getInstance().formatNumber(config.betVals[0]) + " G_Vin";
            // this.lbRoomID.string  = config.roomID
        },

        updateInfo: function (info, state, time) {
            //check state de xu ly hien thi
            switch (state) {
                //giai doan dat cuoc
                case cc.LiveXXState.BETTING: //54
                    if (this.currentState !== state) {
                        this.updateSessionId(info.SessionID);
                        cc.LiveXXController.getInstance().setSID(info.SessionID);
                        this.resetPlayersResultUI();
                        this.lbInfo.string = 'Đang đặt cược';
                        this.animInfo.play('LiveXXInfo');
                    }
                    break;

                //giai doan mo dia
                case cc.LiveXXState.OPEN_PLATE:
                    if (this.currentState !== state) {
                        this.updateSessionId(info.SessionID);
                        cc.LiveXXController.getInstance().setSID(info.SessionID);
                        this.resetPlayersResultUI();
                        this.animInfo.play('LiveXXInfo');
                    }
                    break;

                //giai doan ket qua
                case cc.LiveXXState.SHOW_RESULT: //15
                    if (this.currentState !== state) {
                        this.updateSessionId(info.SessionID);
                        cc.LiveXXController.getInstance().setSID(info.SessionID);
                        this.lbInfo.string = 'Trả thưởng';
                        this.animInfo.play('LiveXXInfo');
                    }
                    break;

                //giai doan cho phien moi
                case cc.LiveXXState.WAITING:
                    if (this.currentState !== state) {
                        this.updateSessionId(info.SessionID);
                        cc.LiveXXController.getInstance().setSID(info.SessionID);
                        this.resetPlayersResultUI();
                        this.lbInfo.string = 'Chờ phiên mới';
                    }
                    break;

                //giai doan xoc dia
                case cc.LiveXXState.SHAKING:
                    if (this.currentState !== state) {
                        this.updateSessionId(info.SessionID);
                        this.resetPlayersResultUI();
                    }
                    break;

            }

            //luu lai state hien tai
            this.currentState = state;
        },
    });
}).call(this);
