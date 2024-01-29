/**
 * Created by Nofear on 6/21/2017.
 */

(function () {
    var LiveXXController;

    LiveXXController = (function () {
        var instance;

        function LiveXXController() {

        }

        instance = void 0;

        LiveXXController.getInstance = function () {
            if (instance === void 0) {
                instance = this;
            }
            return instance.prototype;
        };


        //SET VIEW
        LiveXXController.prototype.setLiveXXView = function (LiveXXView) {
            return this.LiveXXView = LiveXXView;
        };

        LiveXXController.prototype.setLiveXXSoiCauView = function (LiveXXSoiCauView) {
            return this.LiveXXSoiCauView = LiveXXSoiCauView;
        };

        LiveXXController.prototype.setLiveXXAssets = function (LiveXXAssets) {
            return this.LiveXXAssets = LiveXXAssets;
        };

        LiveXXController.prototype.setLiveXXChipPool = function (LiveXXChipPool) {
            return this.LiveXXChipPool = LiveXXChipPool;
        };


        LiveXXController.prototype.setLiveXXInfoView = function (LiveXXInfoView) {
            return this.LiveXXInfoView = LiveXXInfoView;
        };

        LiveXXController.prototype.setLiveXXInputView = function (LiveXXInputView) {
            return this.LiveXXInputView = LiveXXInputView;
        };

        LiveXXController.prototype.setLiveXXResultView = function (LiveXXResultView) {
            return this.LiveXXResultView = LiveXXResultView;
        };

        //PROPERTY

        LiveXXController.prototype.setRoomConfig = function (config) {
            //cc.warn("setRoomConfig", config)
            return this.roomConfig = config;
        };

        LiveXXController.prototype.getRoomConfig = function () {
            //cc.warn("getRoomConfig", this.roomConfig)
            return this.roomConfig;
        };

        LiveXXController.prototype.setIsNan = function (isNan) {
            return this.isNan = isNan;
        };

        LiveXXController.prototype.getIsNan = function () {
            return this.isNan;
        };
        LiveXXController.prototype.setJackPotUserList = function (data) {
            return this.jackpotUserList = data;
        };

        LiveXXController.prototype.getJackPotUserList = function () {
            return this.jackpotUserList;
        };

        LiveXXController.prototype.setLastBetData = function (lastBetData) {
            return this.lastBetData = lastBetData;
        };

        LiveXXController.prototype.getLastBetData = function () {
            return this.lastBetData;
        };

        LiveXXController.prototype.setSID = function (sID) {
            return this.sID = sID;
        };

        LiveXXController.prototype.getSID = function () {
            return this.sID;
        };


        //ASSETS
        LiveXXController.prototype.getAssets = function () {
            return this.LiveXXAssets;
        };

        LiveXXController.prototype.getWinFont = function () {
            return this.LiveXXAssets.getWinFont();
        };

        LiveXXController.prototype.getLoseFont = function () {
            return this.LiveXXAssets.getLoseFont();
        };

        LiveXXController.prototype.getChips = function () {
            return this.LiveXXAssets.getChips();
        };

        LiveXXController.prototype.getNans = function () {
            return this.LiveXXAssets.getNans();
        };

        LiveXXController.prototype.getAvatarDef = function () {
            return this.LiveXXAssets.getAvatarDef();
        };
        LiveXXController.prototype.getTopTipIcon = function () {
            return this.LiveXXAssets.getTopTipIcon();
        };
        LiveXXController.prototype.getSkeletonTopTipData = function () {
            return this.LiveXXAssets.getSkeletonTopTipData();
        };

        //LiveXX VIEW
        LiveXXController.prototype.sendRequestOnHub = function (method, data1, data2) {
            if (this.LiveXXView)
                return this.LiveXXView.sendRequestOnHub(method, data1, data2);
        };

        //INFO
        //HubOn joinGame
        LiveXXController.prototype.joinGame = function (info) {
            return this.LiveXXInfoView.joinGame(info);
        };
        //HubOn playerJoin
        LiveXXController.prototype.playerJoin = function (info) {
            return this.LiveXXInfoView.playerJoin(info);
        };

        //HubOn playerLeave
        LiveXXController.prototype.playerLeave = function (info) {
            this.LiveXXInfoView.playerLeave(info);
            this.LiveXXView.playerLeave(info);
        };

        //HubOn updateConnectionStatus
        LiveXXController.prototype.updateConnectionStatus = function (info) {
            return this.LiveXXInfoView.updateConnectionStatus(info);
        };

        LiveXXController.prototype.updatePlayerStatus = function (status) {
            return this.LiveXXInfoView.updatePlayerStatus(status);
        };
        //Cap nhat thong tin nguoi choi hien tai
        LiveXXController.prototype.updateInfoCurrPlayer = function (data) {
            return this.LiveXXInfoView.updateInfoCurrPlayer(data);
        };
        //Update user balance
        LiveXXController.prototype.updateBalance = function (newAmount) {
            return this.LiveXXInfoView.updateBalance(newAmount);
        };

        LiveXXController.prototype.updateChip = function (accID, chip) {
            //neu la owner thi update ca realBal
            if (accID === cc.LoginController.getInstance().getUserId()) {
                cc.BalanceController.getInstance().updateRealBalance(chip);
            }
            return this.LiveXXInfoView.updateChip(accID, chip);
        };

        LiveXXController.prototype.getPositions = function () {
            return this.LiveXXInfoView.getPositions();
        };

        LiveXXController.prototype.updateSessionId = function (sID) {
            this.sessionId = sID;
            return this.LiveXXInfoView.updateSessionId(sID);
        };

        LiveXXController.prototype.updateInfo = function (info, state, time) {
            return this.LiveXXInfoView.updateInfo(info, state, time);
        };

        LiveXXController.prototype.getIndexUIBetByAccID = function (accID) {
            return this.LiveXXInfoView.getIndexUIBetByAccID(accID);
        };

        LiveXXController.prototype.getIndexUIBetByPosition = function (position) {
            return this.LiveXXInfoView.getIndexUIBetByPosition(position);
        };

        LiveXXController.prototype.getTime = function () {
            return this.LiveXXInfoView.getTime();
        };

        LiveXXController.prototype.playerShowBubbleChat = function (message) {
            return this.LiveXXInfoView.playerShowBubbleChat(message);
        };

        //player vao phong
        LiveXXController.prototype.registerPlayer = function (playerIndex) {
            return this.LiveXXInfoView.registerPlayer(playerIndex);
        };

        //player thoat khoi phong
        LiveXXController.prototype.unRegisterPlayer = function (playerIndex) {
            return this.LiveXXInfoView.unRegisterPlayer(playerIndex);
        };
        LiveXXController.prototype.tipDealer = function (amount) {
            return this.LiveXXView.tipDealer(amount);
        };

        //reset UI ket qua (win/lose) sau moi Phien cua tat ca player
        LiveXXController.prototype.resetPlayersResultUI = function () {
            return this.LiveXXInfoView.resetPlayersResultUI();
        };
        LiveXXController.prototype.totalUserWin = function (amout) {
            return this.LiveXXInfoView.totalUserWin(amout);
        };


        //set ket qua cua player
        LiveXXController.prototype.playerResultUI = function (playerIndex, isWin, amount) {
            return this.LiveXXInfoView.playerResultUI(playerIndex, isWin, amount);
        };

        // HubOn - summaryPlayer
        LiveXXController.prototype.summaryPlayer = function (total) {
            return this.LiveXXInfoView.summaryPlayer(total);
        };
        // HubOn - vipPlayer
        LiveXXController.prototype.vipPlayer = function (dataPlayers) {
            return this.LiveXXInfoView.vipPlayer(dataPlayers);
        };
        // HubOn - winResultVip
        LiveXXController.prototype.winResultVip = function (dataPlayers) {
            return this.LiveXXInfoView.winResultVip(dataPlayers);
        };

        // HubOn - winResult
        LiveXXController.prototype.winResult = function (dataPlayers) {
            return this.LiveXXInfoView.winResult(dataPlayers);
        };

        LiveXXController.prototype.updateTimer = function (time) {
            return this.LiveXXInfoView.updateTimer(time);
        };


        //INPUT
        //HubOn playerBet
        LiveXXController.prototype.playerBet = function (info) {
            return this.LiveXXInputView.playerBet(info);
        };
        LiveXXController.prototype.updateTotalBet = function (info) {
            return this.LiveXXInputView.updateTotalBet(info);
        };
        LiveXXController.prototype.updateInput = function (state) {
            return this.LiveXXInputView.updateInput(state);
        };
        LiveXXController.prototype.resetTotalBetUI = function () {
            return this.LiveXXInputView.resetTotalBetUI();
        };
        LiveXXController.prototype.updateBetAmountGate = function (data) {
            return this.LiveXXInputView.updateBetAmountGate(data);
        };

        LiveXXController.prototype.getGateChips = function () {
            return this.LiveXXInputView.getGateChips();
        };

        LiveXXController.prototype.playFXChipResult = function (data) {
            return this.LiveXXInputView.playFXChipResult(data);
        };

        


        LiveXXController.prototype.showLastInput = function (info) {
            return this.LiveXXInputView.showLastInput(info);
        };

        LiveXXController.prototype.getPlayerBets = function () {
            return this.LiveXXInputView.getPlayerBets();
        };

        LiveXXController.prototype.playFxDealerPay = function (chipBet) {
            return this.LiveXXInputView.playFxDealerPay(chipBet);
        };

        LiveXXController.prototype.initGateChip = function () {
            return this.LiveXXInputView.initGateChip();
        };


        LiveXXController.prototype.playFxPay = function (chipBet) {
            return this.LiveXXInputView.playFxPay(chipBet);
        };

        LiveXXController.prototype.playFxLost = function (playFxLost) {
            return this.LiveXXInputView.playFxLost(playFxLost);
        };

        LiveXXController.prototype.playFxUserBet = function (playerId, indexBet) {
            return this.LiveXXInputView.playFxUserBet(playerId, indexBet);
        };

        LiveXXController.prototype.resetInput = function () {
            return this.LiveXXInputView.resetInput();
        };

        LiveXXController.prototype.activeAllButtonBet = function (enable) {
            return this.LiveXXInputView.activeAllButtonBet(enable);
        };

        LiveXXController.prototype.clearAllChip = function () {
            return this.LiveXXInputView.clearAllChip();
        };
        LiveXXController.prototype.showJackpotEffect = function (amount, gate) {
            return this.LiveXXInputView.showJackpotEffect(amount,gate);
        };
        

        //RESULT
        LiveXXController.prototype.updateResult = function (players, result, originResult, state, openNow) {
            return this.LiveXXResultView.updateResult(players, result, originResult, state, openNow);
        };

        //SOI CAU
        LiveXXController.prototype.draw = function (list) {
            return this.LiveXXSoiCauView.draw(list);
        };

        LiveXXController.prototype.resetDraw = function () {
            return this.LiveXXSoiCauView.resetDraw();
        };

        //CHIP POOL
        LiveXXController.prototype.createChip = function () {
            return this.LiveXXChipPool.createChip();
        };

        LiveXXController.prototype.putToPool = function (node) {
            return this.LiveXXChipPool.putToPool(node);
        };

        LiveXXController.prototype.clearPool = function () {
            return this.LiveXXChipPool.clearPool();
        };

        LiveXXController.prototype.updatePositionPlayerUI = function (positions) {
            return this.positionsUI = positions;
        };

        LiveXXController.prototype.getPositionsUI = function () {
            return this.positionsUI;
        };

        LiveXXController.prototype.initLogBet = function () {
            return this.logBet = [];
        };
        LiveXXController.prototype.setLogBet = function (betData) {
            return this.logBet.push(betData);
        };
        LiveXXController.prototype.getLogBet = function () {
            return this.logBet;
        };
        LiveXXController.prototype.getLogBetBySID = function (sID) {
            let betOfSession = this.logBet.filter(item=>item.SId==sID);
            return betOfSession;
        };
        return LiveXXController;

    })();

    cc.LiveXXController = LiveXXController;

}).call(this);

