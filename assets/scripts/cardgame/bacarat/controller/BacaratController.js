/*
 * Generated by BeChicken
 * on 9/27/2019
 * version v1.0
 */
(function () {
    var BacaratController;
    BacaratController = (function () {
        var instance;

        function BacaratController() {

        }

        instance = void 0;

        BacaratController.getInstance = function () {
            if (instance === void 0) {
                instance = this;
            }
            return instance.prototype;
        };

        // Cap nhat game theo HubOn
        //BacaratView
        BacaratController.prototype.setBacaratView = function (view) {
            return this.BacaratView = view;
        };
        BacaratController.prototype.sendRequestOnHub = function (method, data1, data2) {
            if (this.BacaratView)
                return this.BacaratView.sendRequestOnHub(method, data1, data2);
        };
        //Cap nhat so du cua nguoi choi
        BacaratController.prototype.updateBalance = function (balance) {
            this.BacaratView.updateBalance(balance)
        };
        //HUB ON NAME
        BacaratController.prototype.setInfoView = function (infoView) {
            return this.Bacarat_InfoView = infoView;
        };
        //playerLeave
        BacaratController.prototype.playerLeave = function (info) {
            this.BacaratView.playerLeave(info);
            this.Bacarat_InfoView.playerLeave(info);
        };
        //HubOn updateSessionInfo
        BacaratController.prototype.updateSessionInfo = function (data) {
            return this.Bacarat_InfoView.updateSessionInfo(data);
        };
        //HubOn summaryPlayer
        BacaratController.prototype.updatePlayersInGame = function (data) {
            return this.Bacarat_InfoView.updatePlayersInGame(data);
        };


        //HubOn showResult
        BacaratController.prototype.winResult = function (result) {
            return this.Bacarat_InfoView.winResult(result);
        };
        BacaratController.prototype.setWinResult = function (result) {
            return this.winResultResponse = result;
        };
        BacaratController.prototype.getWinResult = function () {
            return this.winResultResponse;
        };
        BacaratController.prototype.setWinVipResult = function (result) {
            return this.winVipResultResponse = result;
        };
        BacaratController.prototype.getWinVipResult = function () {
            return this.winVipResultResponse;
        };
        //HubOn winResultVip
        BacaratController.prototype.winResultVip = function (result) {
            return this.Bacarat_InfoView.winResultVip(result);
        };

        //Hien thi message chat
        BacaratController.prototype.playerShowBubbleChat = function (message) {
            return this.Bacarat_InfoView.playerShowBubbleChat(message);
        };
        //Chia bai
        BacaratController.prototype.moveCards = function (players) {
            return this.Bacarat_InfoView.moveCards(players)
        };

        //Cap nhat thong tin player
        BacaratController.prototype.updatePlayersUI = function (data) {
            return this.Bacarat_InfoView.updatePlayersUI(data);
        };
        //Cap nhat thong tin nguoi choi hien tai
        BacaratController.prototype.updatePlayerInfor = function (data) {
            return this.Bacarat_InfoView.updatePlayerInfor(data);
        };

        //Cap nhat balance
        BacaratController.prototype.updateBalanceCurrPlayer = function (balance) {
            return this.Bacarat_InfoView.updateBalanceCurrPlayer(balance);
        };
        //Hien thi chat
        BacaratController.prototype.playerShowBubbleChat = function (message) {
            return this.Bacarat_InfoView.playerShowBubbleChat(message);
        };
        //Cap nhat balance cua player khac
        BacaratController.prototype.updateBalancePlayer = function (data) {
            return this.Bacarat_InfoView.updateBalancePlayer(data);
        };


        //Cap nhat position Player
        BacaratController.prototype.updatePositionPlayerUI = function (positions) {
            return this.positionsUI = positions;
        };
        BacaratController.prototype.positionPlayerUI = function () {
            return this.positionsUI;
        };

        //Assets
        BacaratController.prototype.setAssetView = function (assetsView) {
            return this.Bacarat_AssetsView = assetsView;
        };

        BacaratController.prototype.getAssetView = function () {
            return this.Bacarat_AssetsView;
        };

        //Lay sprite back
        BacaratController.prototype.getSfBack = function (type) {
            return this.Bacarat_AssetsView.getSfBack(type)
        };
        BacaratController.prototype.getSfBorderCard = function () {
            return this.Bacarat_AssetsView.getSfBorderCard()
        };
        BacaratController.prototype.createChip = function (type) {
            return this.Bacarat_AssetsView.createChip(type);
        };

        BacaratController.prototype.getSfCardBack = function () {
            return this.Bacarat_AssetsView.getSfCardBack();
        };

        // lay sprite bai
        BacaratController.prototype.getSpriteCard = function (cardNunber, suite) {
            return this.Bacarat_AssetsView.getSpriteCard(cardNunber, suite);
        };
        //Lay sprite bai theo value
        BacaratController.prototype.getCardValueByNumber = function (value) {
            return this.Bacarat_AssetsView.getCardValueByNumber(value);
        };
        //Lay mau timer
        BacaratController.prototype.getColorType = function (type) {
            return this.Bacarat_AssetsView.getColorType(type);
        };
        //Luu chip vao pool
        BacaratController.prototype.putChipToPool = function (nodeChip, betValue) {
            return this.Bacarat_AssetsView.putChipToPool(nodeChip, betValue);
        };
        //Clear pools
        BacaratController.prototype.clearPools = function () {
            return this.Bacarat_AssetsView.clearPools();
        };

        //BetView
        BacaratController.prototype.setBetView = function (betView) {
            return this.Bacarat_BetView = betView;
        };
        BacaratController.prototype.onBet = function (betSide) {
            return this.Bacarat_BetView.onBet(betSide);
        };

        //Enable cac cua bet
        BacaratController.prototype.enableClickBet = function (enable) {
            return this.Bacarat_BetView.enableClickBet(enable);
        };

        //Disable button bet lai
        BacaratController.prototype.disableBetAgain = function (isDisable) {
            return this.Bacarat_BetView.disableBetAgain(isDisable);
        };
        //Hien thi hieu ung thang cua cua bet
        BacaratController.prototype.playAnimationWin = function (sideWin) {
            return this.Bacarat_BetView.playAnimationWin(sideWin);
        };
        //Stop hien thi hieu ung thang
        BacaratController.prototype.stopAnimationWin = function () {
            return this.Bacarat_BetView.stopAnimationWin();
        };
        //Cap nhat tong tien bet player
        BacaratController.prototype.updateTotalUserBetSide = function (betSide, total) {
            return this.Bacarat_BetView.updateTotalUserBetSide(betSide, total);
        };
        BacaratController.prototype.updateTotalBet = function (data) {
            return this.Bacarat_BetView.updateTotalBet(data);
        };
        //UpdateBetOfAccount
        BacaratController.prototype.updateBetOfAccount = function (data) {
            return this.Bacarat_BetView.updateBetOfAccount(data);
        };

        //CardView
        BacaratController.prototype.setCardView = function (cardView) {
            return this.Bacarat_CardView = cardView;
        };
        //Active diem
        BacaratController.prototype.activeNodeScore = function (isActive) {
            return this.Bacarat_CardView.activeNodeScore(isActive);
        };
        //Active bai
        BacaratController.prototype.activeNodeCards = function (isActive) {
            return this.Bacarat_CardView.activeNodeCards(isActive);
        };
        //Hien thi diem
        BacaratController.prototype.showScoreSide = function (dataScore) {
            return this.Bacarat_CardView.showScoreSide(dataScore);
        };
        //Reset lai trang thai quan bai
        BacaratController.prototype.resetLayoutCard = function () {
            return this.Bacarat_CardView.resetLayoutCard();
        };
        //Chia bai
        BacaratController.prototype.onSlideCard = function (data) {
            return this.Bacarat_CardView.onSlideCard(data);
        };
        //Chia bai trong luc dat cuoc
        BacaratController.prototype.slideCardOnBet = function () {
            return this.Bacarat_CardView.slideCardOnBet();
        };
        //hien thi bai tren ban
        BacaratController.prototype.initCardOnTable = function () {
            return this.Bacarat_CardView.initCardOnTable();
        };

        //Hien thi ket qua luon
        BacaratController.prototype.forceShowResult = function (data, timeEllapsed) {
            return this.Bacarat_CardView.forceShowResult(data, timeEllapsed);
        };

        //ChipView
        BacaratController.prototype.setChipsView = function (chipsView) {
            return this.Bacarat_ChipsView = chipsView;
        };
        //Di chuyen chip
        BacaratController.prototype.moveChipBet = function (betValue, betSide, type, accID) {
            return this.Bacarat_ChipsView.moveChipBet(betValue, betSide, type, accID);
        };

        //Lay lai chip thua
        BacaratController.prototype.getChipsLose = function (sideLose, isTie) {
            return this.Bacarat_ChipsView.getChipsLose(sideLose, isTie);
        };
        //Tra chip thang
        BacaratController.prototype.refundChips = function (sideWin) {
            return this.Bacarat_ChipsView.refundChips(sideWin);
        };

        //Hoan lai chip hoa
        BacaratController.prototype.refundChipsTie = function () {
            return this.Bacarat_ChipsView.refundChipsTie();
        };
        //ClearAllChip
        BacaratController.prototype.clearAllChips = function () {
            return this.Bacarat_ChipsView.clearAllChips();
        };

        //Khoi tao lai param chip
        BacaratController.prototype.initParamChips = function () {
            return this.Bacarat_ChipsView.initParamChips();
        };

        //Update chip khi vao game
        BacaratController.prototype.updateChipForBetSession = function (data) {
            return this.Bacarat_ChipsView.updateChipForBetSession(data);
        };

        BacaratController.prototype.clearBetLog = function (sessionID) {
            this.betLog = this.betLog.filter(log => log.sessionID > (sessionID - 1));
        };
        BacaratController.prototype.getBetLogBySessionID = function (sessionID) {
            return this.betLog.filter(log => log.sessionID == sessionID - 1);
        };
        //Set betBlog
        BacaratController.prototype.setBetLog = function (betInfo) {
            return this.betLog.push(betInfo);
        };
        //Lay thong tin betLog
        BacaratController.prototype.getBetLog = function () {
            return this.betLog;
        };
        //Khoi tao/ reset betLog
        BacaratController.prototype.initBetLog = function () {
            return this.betLog = [];
        };

        //SoiCauView
        BacaratController.prototype.setSoiCauView = function (soiCauView) {
            return this.Bacarat_SoiCau = soiCauView;
        };
        //List Soi cau
        BacaratController.prototype.initListSoiCau = function (data) {
            return this.Bacarat_SoiCau.initListSoiCau(data);
        };
        //Active graph
        BacaratController.prototype.activeGraph = function (isActive) {
            this.Bacarat_SoiCau.activeGraph(isActive);
            this.Bacarat_CatCau.activeGraph(isActive);
        };
        //CatCauView
        BacaratController.prototype.setCatCauView = function (catCauView) {
            return this.Bacarat_CatCau = catCauView;
        };
        //List CatCau
        BacaratController.prototype.initListCatCau = function (data) {
            return this.Bacarat_CatCau.initListCatCau(data);
        };

        //Set betBlog
        BacaratController.prototype.setChipWin = function (chip, chipType, positionEnd) {
            return this.chipsWin.push([chip, chipType, positionEnd]);
        };
        //Lay thong tin chipWin
        BacaratController.prototype.getChipsWin = function () {
            return this.chipsWin;
        };
        //Khoi tao/ reset chipWin
        BacaratController.prototype.initChipsWin = function () {
            return this.chipsWin = [];
        };

        //Set betBlogSession
        BacaratController.prototype.setBetLogSession = function (sessionId) {
            return this.betLogSession = sessionId;
        };
        //Lay thong tin betLogSession
        BacaratController.prototype.getBetLogSession = function () {
            return this.betLogSession;
        };

        //Set CurrentState
        BacaratController.prototype.setCurrentState = function (state) {
            return this.currentState = state;
        };
        //Get CurrentState
        BacaratController.prototype.getCurrentState = function () {
            return this.currentState;
        };

        return BacaratController;


    })();
    cc.BacaratController = BacaratController;
}).call(this);