
cc.Class({
    extends:  require('RoomView'),
    onHubMessage (response) {
        if (response.M !== undefined && response.M.length > 0) {
            var m = (response.M)[0];
            switch (m.M) {
                //vao Phong
                case cc.MethodHubOnName.JOIN_GAME:
                    var data = m.A[0];
                    let linesData = "";
                    let totalLine = 25;
                    //Set RoomID vua vao
                    cc.RoomController.getInstance().setRoomId(data.RoomID);

                    //set Bet value
                    cc.SpinController.getInstance().setBetValue(data.BetValue);
                    cc.SpinController.getInstance().updateBetUI(data.BetValue);

                    //cap nhat jackpot trong game
                    cc.JackpotController.getInstance().updateJackpotInGame(data.SpinData.Jackpot);
                    //Set xem co phai choi thu ko?
                    cc.SpinController.getInstance().setIsPlayTry(data.IsPlayTry);
                    //set accountID
                    cc.SpinController.getInstance().setSpinAccountID(data.AccountID);

                    //random icon phong
                    //cc.SpinController.getInstance().randomIcon();

                    switch (this.gameId) {
                        case cc.GameId.COWBOY:
                            // vao phong la auto set full lines
                            linesData = '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25';
                            //set tong so Line UI
                            totalLine = 25;

                            cc.CBAccumulateController.getInstance().initAccumulate(data.AccumulateGame);
                            break;
                    }

                    cc.SpinController.getInstance().updateTotalLines(totalLine); //data.TotalLine

                    //set betLineText
                    cc.SpinController.getInstance().updateBetLinesText(linesData); //data.SpinData.LinesData
                    //set Total Value
                    cc.SpinController.getInstance().updateTotalBet(totalLine * data.BetValue);

                    //setTotalPrize
                    cc.SpinController.getInstance().setPaylinePrize(data.SpinData.PaylinePrize);


                    // FakeBonus
                    // const fakeDateBonus = {
                    //     BonusData: [
                    //         {Step: 1, PrizeID: 201, Multiplier: 0.3, PrizeValue: 7500},
                    //         {Step: 2, PrizeID: 202, Multiplier: 0.6, PrizeValue: 15000},
                    //         {Step: 3, PrizeID: 200, Multiplier: 0, PrizeValue: 0}
                    //     ],
                    //     CurrentStep: 0,
                    //     Multiplier: 1,
                    //     Position: "",
                    //     PrizeValue: 22500,
                    //     SpinID: 4733170,    
                    //     TotalStep: 3
                    // }
                    // data.BonusGame = fakeDateBonus

                    //Kiem tra xem co bonus ko?
                    if (data.BonusGame && data.BonusGame.BonusData !== null) {
                        //set gia tri bonus
                        cc.BonusGameController.getInstance().setData(data.BonusGame);
                        //Tat button quay
                        cc.SpinController.getInstance().activeButtonSpin(false);
                        //tao bonusgame
                        cc.MainController.getInstance().createBonusGameView();
                    }
                    //Kiem tra xem co freespin (minigame) ko?
                    else if (data.SpinData.TotalFreeSpin > 0) {
                        //Cap nhat UI so freespin dang co
                        cc.FreeSpinController.getInstance().updateFreeSpinText(data.SpinData.TotalFreeSpin);
                        //Kich hoat che do FreeSpin
                        cc.FreeSpinController.getInstance().activeFreeSpin(true);
                        //set lai so tien total Win da choi duoc o FreeSpin
                        switch (this.gameId) {
                            case cc.GameId.EGYPT:
                            case cc.GameId.GAINHAY:
                                cc.SpinController.getInstance().updateTotalWinUI(data.FreeSpinData.FreeSpinsPrize);
                                break;
                            case cc.GameId.AQUARIUM:
                            case cc.GameId.DRAGON_BALL:
                            case cc.GameId.THREE_KINGDOM:
                            case cc.GameId.BUM_BUM:
                            case cc.GameId.COWBOY:
                            case cc.GameId.THUONG_HAI:
                                cc.SpinController.getInstance().updateTotalWinUI(data.SpinData.FreeSpinsPrize);
                                break;
                        }
                    } //Kiem tra xem co freespin event ko?
                    else if (data.SpinData.EventFreeSpin && data.SpinData.EventFreeSpin > 0) {
                        //Cap nhat UI so freespin dang co
                        cc.FreeSpinController.getInstance().updateFreeSpinText(data.SpinData.EventFreeSpin);
                        //Kich hoat che do FreeSpin
                        cc.FreeSpinController.getInstance().activeFreeSpin(true);
                        //set lai so tien total Win da choi duoc o FreeSpin
                        cc.SpinController.getInstance().updateTotalWinUI(data.SpinData.FreeSpinsPrize);
                        // switch (this.gameId) {
                        //     case cc.GameId.EGYPT:
                        //         cc.SpinController.getInstance().updateTotalWinUI(data.SpinData.FreeSpinsPrize);
                        //         break;
                        //     case cc.GameId.THREE_KINGDOM:
                        //         cc.SpinController.getInstance().updateTotalWinUI(data.SpinData.FreeSpinsPrize);
                        //         break;
                        // }
                    }
                    //Kiem tra xem con dang choi x2 ko?
                    else if (data.X2Game && data.X2Game.RoundPrize > 0 && data.X2Game.Step > 0) {
                        //set gia tri bonus
                        cc.X2GameController.getInstance().setBaseValue(data.X2Game.RoundPrize);
                        cc.X2GameController.getInstance().setX2GameData(data.X2Game);
                        //tao bonusgame
                        cc.MainController.getInstance().createX2GameView();
                    } else {
                        cc.FreeSpinController.getInstance().activeFreeSpin(false);
                    }


                    //TryPlayer
                    if (data.AccountID < 0)  {
                        cc.BalanceController.getInstance().updateTryBalance(data.Account.TotalStar);
                        cc.log("check account blanc : ", data.Account.TotalStar)
                        cc.SpinController.getInstance().activeButtonSelectBetLines(false);
                    } else {
                        cc.BalanceController.getInstance().updateRealBalance(data.Account.TotalStar);
                        cc.BalanceController.getInstance().updateBalance(data.Account.TotalStar);
                        cc.SpinController.getInstance().activeButtonSelectBetLines(true);
                    }


                    if(!this.nodeMain.active){
                        cc.SpinController.getInstance().randomIcon();
                    }
                
                    //vao phong thanh cong -> acitve main game
                    this.activeMain();

                    cc.PopupController.getInstance().hideBusy();
                    break;
                case cc.MethodHubOnName.RESULT_SPIN:
                    var data = m.A[0];

                    //Cap nhat jackpot trong game
                    cc.JackpotController.getInstance().updateJackpotInGame(data.SpinData.Jackpot);
                    //cap nhat sessionID
                    cc.SpinController.getInstance().setSessionID('#' + data.SpinData.SpinID);
                    //Luu lai spinResponse
                    cc.SpinController.getInstance().setSpinResponse(data);

                    //update lai so du thuc te
                    cc.BalanceController.getInstance().updateRealBalance(data.Account.TotalStar);


                    //setTotalPrize
                    cc.SpinController.getInstance().setPaylinePrize(data.SpinData.PaylinePrize);

                    //Doi sang kieu cho ket qua -> moi cho Quay
                    cc.SpinController.getInstance().startSpin();
                    //Yeu cau stop SPIN
                    cc.SpinController.getInstance().stopSpin();

                    cc.DDNA.getInstance().spinSummary(this.gameId, cc.SpinController.getInstance().checkIsAutoSpin(), data);
                    break;
                case cc.MethodHubOnName.RESULT_FREE_SPIN:
                    var data = m.A[0];

                    //cc.JackpotController.getInstance().updateJackpotInGame(data.SpinData.Jackpot);
                    //set data response
                    cc.SpinController.getInstance().setSpinResponse(data);
                    //Doi sang kieu cho ket qua -> moi cho Quay
                    cc.SpinController.getInstance().startSpin();
                    //dung quay
                    cc.SpinController.getInstance().stopSpin();
                    break;
                case cc.MethodHubOnName.UPDATE_USER_BALANCE:
                    //method = PlayBonusGame
                    cc.BonusGameController.getInstance().onPlayBonusFinishResponse(m.A[0]);
                    break;
                case cc.MethodHubOnName.RESULT_X2_GAME:
                    //refresh lại balance UI
                    cc.BalanceController.getInstance().updateRealBalance(m.A[0].Balance);
                    cc.BalanceController.getInstance().updateBalance(m.A[0].Balance);
                    cc.X2GameController.getInstance().onResultX2Game(m.A[0]);
                    break;
                case cc.MethodHubOnName.UPDATE_JACKPOT:

                    var jackpots = m.A[0].split('|');
                    //update thong tin jackpot ngoai phong cho
                    cc.JackpotController.getInstance().updateJackpot(jackpots);
                    //update thong tin jackpot trong man choi
                    var jackpotVal = jackpots[cc.RoomController.getInstance().getRoomId() - 1];
                    if (jackpotVal !== undefined && !cc.SpinController.getInstance().getIsPlayTry())
                        cc.JackpotController.getInstance().updateJackpotInGame(parseInt(jackpotVal));
                    break;
                case cc.MethodHubOnName.MESSAGE:
                    //thong bao
                    var data = m.A[0];
                    if (data.Description) {
                        cc.PopupController.getInstance().showSlotsMessage(data.Description);
                    } else if (data.Message) {
                        cc.PopupController.getInstance().showSlotsMessage(data.Message);
                    } else {
                        cc.PopupController.getInstance().showSlotsMessage(data);
                    }

                    //da co loi xay ra -> hien message -> out khoi phong choi
                    cc.director.getScheduler().schedule(function () {
                        cc.LobbyController.getInstance().destroyDynamicView(null);
                    }, this, 2, 0, 0, false);

                    break;
                case cc.MethodHubOnName.OTHER_DEVICE:
                    // m.A[0] = ma loi , m.A[1] = message
                    //vao phong choi tren thiet bi khac
                    cc.PopupController.getInstance().showPopupOtherDevice( m.A[1], cc.RoomController.getInstance().getGameId());
                    break;
                default:
                    //Error
                    if (response.E !== undefined) {
                        /*
                        {
                          "I": "2",
                          "E": "'Spin' method could not be resolved. Potential candidates are: \nSpin(lines:String, deviceId:Int32):Int32"
                        }
                        * */
                    }
                    break;
            }
        } else if (response.G && response.G !== '') {
            //khi nao co response nay -> enterlobby thanh cong -> active button cho chon phong
            if (!this.isActiveButtonRoom) {
                this.btnRooms.forEach(function (btnRoom) {
                    btnRoom.interactable = true;
                });
                this.isActiveButtonRoom = true;
            }
        } else {
            //PING PONG
            if (response.I) {
                this.slotsHub.pingPongResponse(response.I);
            }
        }
    },

    onHubOpen: function () {
        this.slotsHub.enterLobby();
        this.roomClicked(null,1);
    },


    sendRequestOnHub: function (method, data1, data2) {
        if (this.slotsHub === undefined || this.slotsHub === null) return;
        switch (method) {
            case cc.MethodHubName.PLAY_TRY:
                cc.PopupController.getInstance().showBusy(true);
                this.slotsHub.playTry();
                break;
            case cc.MethodHubName.PLAY_NOW:
                cc.PopupController.getInstance().showBusy(true);
                this.slotsHub.playNow(data1);
                break;
            case cc.MethodHubName.SPIN_TRY:
                this.slotsHub.spinTry();
                break;
            case cc.MethodHubName.SPIN:
                this.slotsHub.spin(data1);
                break;
            case cc.MethodHubName.PLAY_BONUS:
                this.slotsHub.playBonus(data1, data2);
                break;
            case cc.MethodHubName.PLAY_X2_GAME:
                this.slotsHub.playX2Game();
                break;
            case cc.MethodHubName.FINISH_X2_GAME:
                this.slotsHub.finishX2Game();
                break;
            case cc.MethodHubName.FREE_SPIN:
                this.slotsHub.freeSpin();
                break;
        }
    },



    roomClicked (event, data) {
        cc.PayLinesController.getInstance().hideAllLines();
        var roomId = parseInt(data.toString());
        cc.RoomController.getInstance().setRoomId(roomId);
        if (roomId === 0) {
            this.sendRequestOnHub(cc.MethodHubName.PLAY_TRY);
            cc.RoomController.getInstance().setRoomId(3);
        } else {    
            this.sendRequestOnHub(cc.MethodHubName.PLAY_NOW, roomId);
        }
    },

    roomTryClicked(){
        if (cc.SpinController.getInstance().getIsPlayTry()) {
            cc.SpinController.getInstance().updateUIButtonTry(false);
            this.roomClicked(null,1);
        } else {
            this.roomClicked(null,0);
            cc.SpinController.getInstance().updateUIButtonTry(true);
        }
        
    } 
});
