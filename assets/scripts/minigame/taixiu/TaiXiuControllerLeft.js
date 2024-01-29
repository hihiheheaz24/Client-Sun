/**
 * Created by Nofear on 6/21/2017.
 */

(function () {
    var TaiXiuControllerLeft;

    TaiXiuControllerLeft = (function () {
        var instance;

        function TaiXiuControllerLeft() {

        }

        instance = void 0;

        TaiXiuControllerLeft.getInstance = function () {
            if (instance === void 0) {
                instance = this;
            }
            return instance.prototype;
        };

        TaiXiuControllerLeft.prototype.setTaiXiuPortalView = function (taiXiuPortalView) {
            return this.taiXiuPortalView = taiXiuPortalView;
        };

        TaiXiuControllerLeft.prototype.setTaiXiuView = function (taiXiuView) {
            return this.taiXiuView = taiXiuView;
        };

        TaiXiuControllerLeft.prototype.setTaiXiuInfoView = function (taiXiuInfoView) {
            return this.taiXiuInfoView = taiXiuInfoView;
        };

        TaiXiuControllerLeft.prototype.setTaiXiuResultView = function (taiXiuResultView) {
            return this.taiXiuResultView = taiXiuResultView;
        };

        TaiXiuControllerLeft.prototype.setTaiXiuResultEffectView = function (taiXiuResultEffectView) {
            return this.taiXiuResultEffectView = taiXiuResultEffectView;
        };

        TaiXiuControllerLeft.prototype.setTaiXiuInputBetView = function (taiXiuInputBetView) {
            return this.taiXiuInputBetView = taiXiuInputBetView;
        };

        TaiXiuControllerLeft.prototype.setTaiXiuButtonView = function (taiXiuButtonView) {
            return this.taiXiuButtonView = taiXiuButtonView;
        };

        TaiXiuControllerLeft.prototype.setTaiXiuBetView = function (taiXiuBetView) {
            return this.taiXiuBetView = taiXiuBetView;
        };

        TaiXiuControllerLeft.prototype.setTaiXiuSessionHistoryView = function (taiXiuSessionHistoryView) {
            return this.taiXiuSessionHistoryView = taiXiuSessionHistoryView;
        };

        TaiXiuControllerLeft.prototype.setTaiXiuEventView = function (taiXiuEventView) {
            return this.taiXiuEventView = taiXiuEventView;
        };

        TaiXiuControllerLeft.prototype.setIsOpen = function (isOpen) {
            return this.isOpen = isOpen;
        };

        TaiXiuControllerLeft.prototype.getIsOpen = function () {
            return this.isOpen;
        };

        TaiXiuControllerLeft.prototype.setSID = function (sID) {
            return this.sID = sID;
        };

        TaiXiuControllerLeft.prototype.getSID = function () {
            return this.sID;
        };

        //set ket qua Summon Dragon Event
        TaiXiuControllerLeft.prototype.setEventWinnerResult = function (eventWinnerResult) {
            return this.eventWinnerResult = eventWinnerResult;
        };

        TaiXiuControllerLeft.prototype.getEventWinnerResult = function () {
            return this.eventWinnerResult;
        };

        TaiXiuControllerLeft.prototype.openEndDiaNanView = function () {
            if (this.taiXiuResultView)
                return this.taiXiuResultView.openEndDiaNan();
        };
		
        //RESET
        TaiXiuControllerLeft.prototype.reset = function () {
            if (this.taiXiuPortalView)
                this.taiXiuPortalView.reset();

            if (this.taiXiuInfoView)
                this.taiXiuInfoView.reset();

            if (this.taiXiuResultView)
                this.taiXiuResultView.reset();

            if (this.taiXiuBetView)
                this.taiXiuBetView.reset();

            if (this.taiXiuInputBetView)
                this.taiXiuInputBetView.reset();

            if (this.taiXiuResultEffectView)
                this.taiXiuResultEffectView.reset();
        };

        TaiXiuControllerLeft.prototype.resetBetAndResultInfo = function () {
            if (this.taiXiuResultEffectView)
                this.taiXiuResultEffectView.reset();

            if (this.taiXiuResultView)
                this.taiXiuResultView.reset();

            if (this.taiXiuBetView)
                this.taiXiuBetView.reset();

            if (this.taiXiuInputBetView)
                this.taiXiuInputBetView.reset();
        };

        TaiXiuControllerLeft.prototype.resetBetInfo = function () {
            if (this.taiXiuBetView)
                this.taiXiuBetView.reset();

            if (this.taiXiuInputBetView)
                this.taiXiuInputBetView.reset();
        };
        //EVENT VIEW
        TaiXiuControllerLeft.prototype.clickUIEventPH = function () {
            if (this.taiXiuEventView)
                return this.taiXiuEventView.clickUIEventPH();
        };

        TaiXiuControllerLeft.prototype.activeEventPH = function (enable) {
            if (this.taiXiuEventView)
                return this.taiXiuEventView.activeEventPH(enable);
        };

        TaiXiuControllerLeft.prototype.setUserCord = function (cordWin, cordLost) {
            if (this.taiXiuEventView)
                return this.taiXiuEventView.setUserCord(cordWin, cordLost);
        };


        //PORTAL VIEW
        //ket noi luc dau chua login
        TaiXiuControllerLeft.prototype.connectHubTx = function () {
            if (this.taiXiuPortalView)
                return this.taiXiuPortalView.connectHubTx();
        };

        //ket noi sau khi da Login
        TaiXiuControllerLeft.prototype.connectHubTxAuthorize = function () {
            if (this.taiXiuPortalView)
                return this.taiXiuPortalView.connectHubTxAuthorize();
        };

        TaiXiuControllerLeft.prototype.disconnectAndLogout = function () {
            if (this.taiXiuPortalView)
                return this.taiXiuPortalView.disconnectAndLogout();
        };

        TaiXiuControllerLeft.prototype.sendRequestOnHub = function (method, data1, data2) {
            if (this.taiXiuPortalView)
                return this.taiXiuPortalView.sendRequestOnHub(method, data1, data2);
        };

        //INFO VIEW
        TaiXiuControllerLeft.prototype.updateInfoView = function (sessionInfo) {
            if (this.taiXiuInfoView)
                return this.taiXiuInfoView.updateInfo(sessionInfo);
        };

        TaiXiuControllerLeft.prototype.updateTimerInfoView = function (time) {
            if (this.taiXiuInfoView)
                return this.taiXiuInfoView.updateTimerInfo(time);
        };

        //SESSION HISTORY VIEW
        TaiXiuControllerLeft.prototype.updateSessionHistory = function (gameHistory) {
            if (this.taiXiuSessionHistoryView)
            return this.taiXiuSessionHistoryView.updateSessionHistory(gameHistory);
        };

        //BUTTON VIEW
        TaiXiuControllerLeft.prototype.lightOnEvent = function () {
            if (this.taiXiuButtonView)
            return this.taiXiuButtonView.lightOnEvent();
        };

        //RESULT EFFECT VIEW
        TaiXiuControllerLeft.prototype.playEffectWin = function (amount) {
            if (this.taiXiuResultEffectView)
            return this.taiXiuResultEffectView.playEffectWin(amount);
        };

        //BET VIEW
        TaiXiuControllerLeft.prototype.updateBetInfoView = function (betInfo) {
            if (this.taiXiuBetView)
                return this.taiXiuBetView.updateBetInfo(betInfo);
        };

        TaiXiuControllerLeft.prototype.getBetSide = function () {
            if (this.taiXiuBetView)
                return this.taiXiuBetView.getBetSide();
        };

        //TAI XIU VIEW
        TaiXiuControllerLeft.prototype.resetPositionTX = function () {
            if (this.taiXiuView)
                return this.taiXiuView.resetPositionTX();
        };

        //RESULT VIEW
        TaiXiuControllerLeft.prototype.getIsBowl = function () {
            if (this.taiXiuResultView)
                return this.taiXiuResultView.getIsBowl();
        };

        TaiXiuControllerLeft.prototype.diceAnimFinish = function () {
            if (this.taiXiuResultView)
            return this.taiXiuResultView.diceAnimFinish();
        };

        TaiXiuControllerLeft.prototype.updateResultView = function (sessionInfo) {
            if (this.taiXiuResultView)
                return this.taiXiuResultView.updateResult(sessionInfo);
        };


        //PROPERTY
        TaiXiuControllerLeft.prototype.setIsNan = function (isNan) {
            return this.isNan = isNan;
        };

        TaiXiuControllerLeft.prototype.getIsNan = function () {
            return this.isNan;
        };

        TaiXiuControllerLeft.prototype.getSessionId = function () {
            return this.sessionId;
        };

        TaiXiuControllerLeft.prototype.setDetailIndex= function (detailIndex) {
            return this.detailIndex = detailIndex;
        };

        TaiXiuControllerLeft.prototype.getDetailIndex = function () {
            return this.detailIndex;
        };

        TaiXiuControllerLeft.prototype.setGameHistory = function (gameHistory) {
            return this.gameHistory = gameHistory;
        };

        TaiXiuControllerLeft.prototype.getGameHistory = function () {
            return this.gameHistory;
        };



        return TaiXiuControllerLeft;

    })();

    cc.TaiXiuControllerLeft = TaiXiuControllerLeft;

}).call(this);

