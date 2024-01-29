/**
 * Created by Nofear on 6/21/2017.
 */

(function () {
    var TaiXiuControllerRight;

    TaiXiuControllerRight = (function () {
        var instance;

        function TaiXiuControllerRight() {

        }

        instance = void 0;

        TaiXiuControllerRight.getInstance = function () {
            if (instance === void 0) {
                instance = this;
            }
            return instance.prototype;
        };

        TaiXiuControllerRight.prototype.setTaiXiuPortalView = function (taiXiuPortalView) {
            return this.taiXiuPortalView = taiXiuPortalView;
        };

        TaiXiuControllerRight.prototype.setTaiXiuView = function (taiXiuView) {
            return this.taiXiuView = taiXiuView;
        };

        TaiXiuControllerRight.prototype.setTaiXiuInfoView = function (taiXiuInfoView) {
            return this.taiXiuInfoView = taiXiuInfoView;
        };

        TaiXiuControllerRight.prototype.setTaiXiuResultView = function (taiXiuResultView) {
            return this.taiXiuResultView = taiXiuResultView;
        };

        TaiXiuControllerRight.prototype.setTaiXiuResultEffectView = function (taiXiuResultEffectView) {
            return this.taiXiuResultEffectView = taiXiuResultEffectView;
        };

        TaiXiuControllerRight.prototype.setTaiXiuInputBetView = function (taiXiuInputBetView) {
            return this.taiXiuInputBetView = taiXiuInputBetView;
        };

        TaiXiuControllerRight.prototype.setTaiXiuButtonView = function (taiXiuButtonView) {
            return this.taiXiuButtonView = taiXiuButtonView;
        };

        TaiXiuControllerRight.prototype.setTaiXiuBetView = function (taiXiuBetView) {
            return this.taiXiuBetView = taiXiuBetView;
        };

        TaiXiuControllerRight.prototype.setTaiXiuSessionHistoryView = function (taiXiuSessionHistoryView) {
            return this.taiXiuSessionHistoryView = taiXiuSessionHistoryView;
        };

        TaiXiuControllerRight.prototype.setTaiXiuEventView = function (taiXiuEventView) {
            return this.taiXiuEventView = taiXiuEventView;
        };

        TaiXiuControllerRight.prototype.setIsOpen = function (isOpen) {
            return this.isOpen = isOpen;
        };

        TaiXiuControllerRight.prototype.getIsOpen = function () {
            return this.isOpen;
        };

        TaiXiuControllerRight.prototype.setSID = function (sID) {
            return this.sID = sID;
        };

        TaiXiuControllerRight.prototype.getSID = function () {
            return this.sID;
        };

        //set ket qua Summon Dragon Event
        TaiXiuControllerRight.prototype.setEventWinnerResult = function (eventWinnerResult) {
            return this.eventWinnerResult = eventWinnerResult;
        };

        TaiXiuControllerRight.prototype.getEventWinnerResult = function () {
            return this.eventWinnerResult;
        };

        TaiXiuControllerRight.prototype.openEndDiaNanView = function () {
            if (this.taiXiuResultView)
                return this.taiXiuResultView.openEndDiaNan();
        };
		
        //RESET
        TaiXiuControllerRight.prototype.reset = function () {
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

        TaiXiuControllerRight.prototype.resetBetAndResultInfo = function () {
            if (this.taiXiuResultEffectView)
                this.taiXiuResultEffectView.reset();

            if (this.taiXiuResultView)
                this.taiXiuResultView.reset();

            if (this.taiXiuBetView)
                this.taiXiuBetView.reset();

            if (this.taiXiuInputBetView)
                this.taiXiuInputBetView.reset();
        };

        TaiXiuControllerRight.prototype.resetBetInfo = function () {
            if (this.taiXiuBetView)
                this.taiXiuBetView.reset();

            if (this.taiXiuInputBetView)
                this.taiXiuInputBetView.reset();
        };
        //EVENT VIEW
        TaiXiuControllerRight.prototype.clickUIEventPH = function () {
            if (this.taiXiuEventView)
                return this.taiXiuEventView.clickUIEventPH();
        };

        TaiXiuControllerRight.prototype.activeEventPH = function (enable) {
            if (this.taiXiuEventView)
                return this.taiXiuEventView.activeEventPH(enable);
        };

        TaiXiuControllerRight.prototype.setUserCord = function (cordWin, cordLost) {
            if (this.taiXiuEventView)
                return this.taiXiuEventView.setUserCord(cordWin, cordLost);
        };


        //PORTAL VIEW
        //ket noi luc dau chua login
        TaiXiuControllerRight.prototype.connectHubTx = function () {
            if (this.taiXiuPortalView)
                return this.taiXiuPortalView.connectHubTx();
        };

        //ket noi sau khi da Login
        TaiXiuControllerRight.prototype.connectHubTxAuthorize = function () {
            if (this.taiXiuPortalView)
                return this.taiXiuPortalView.connectHubTxAuthorize();
        };

        TaiXiuControllerRight.prototype.disconnectAndLogout = function () {
            if (this.taiXiuPortalView)
                return this.taiXiuPortalView.disconnectAndLogout();
        };

        TaiXiuControllerRight.prototype.sendRequestOnHub = function (method, data1, data2) {
            if (this.taiXiuPortalView)
                return this.taiXiuPortalView.sendRequestOnHub(method, data1, data2);
        };

        //INFO VIEW
        TaiXiuControllerRight.prototype.updateInfoView = function (sessionInfo) {
            if (this.taiXiuInfoView)
                return this.taiXiuInfoView.updateInfo(sessionInfo);
        };

        TaiXiuControllerRight.prototype.updateTimerInfoView = function (time) {
            if (this.taiXiuInfoView)
                return this.taiXiuInfoView.updateTimerInfo(time);
        };

        //SESSION HISTORY VIEW
        TaiXiuControllerRight.prototype.updateSessionHistory = function (gameHistory) {
            if (this.taiXiuSessionHistoryView)
            return this.taiXiuSessionHistoryView.updateSessionHistory(gameHistory);
        };

        //BUTTON VIEW
        TaiXiuControllerRight.prototype.lightOnEvent = function () {
            if (this.taiXiuButtonView)
            return this.taiXiuButtonView.lightOnEvent();
        };

        //RESULT EFFECT VIEW
        TaiXiuControllerRight.prototype.playEffectWin = function (amount) {
            if (this.taiXiuResultEffectView)
            return this.taiXiuResultEffectView.playEffectWin(amount);
        };

        //BET VIEW
        TaiXiuControllerRight.prototype.updateBetInfoView = function (betInfo) {
            if (this.taiXiuBetView)
                return this.taiXiuBetView.updateBetInfo(betInfo);
        };

        TaiXiuControllerRight.prototype.getBetSide = function () {
            if (this.taiXiuBetView)
                return this.taiXiuBetView.getBetSide();
        };

        //TAI XIU VIEW
        TaiXiuControllerRight.prototype.resetPositionTX = function () {
            if (this.taiXiuView)
                return this.taiXiuView.resetPositionTX();
        };

        //RESULT VIEW
        TaiXiuControllerRight.prototype.getIsBowl = function () {
            if (this.taiXiuResultView)
                return this.taiXiuResultView.getIsBowl();
        };

        TaiXiuControllerRight.prototype.diceAnimFinish = function () {
            if (this.taiXiuResultView)
            return this.taiXiuResultView.diceAnimFinish();
        };

        TaiXiuControllerRight.prototype.updateResultView = function (sessionInfo) {
            if (this.taiXiuResultView)
                return this.taiXiuResultView.updateResult(sessionInfo);
        };


        //PROPERTY
        TaiXiuControllerRight.prototype.setIsNan = function (isNan) {
            return this.isNan = isNan;
        };

        TaiXiuControllerRight.prototype.getIsNan = function () {
            return this.isNan;
        };

        TaiXiuControllerRight.prototype.getSessionId = function () {
            return this.sessionId;
        };

        TaiXiuControllerRight.prototype.setDetailIndex= function (detailIndex) {
            return this.detailIndex = detailIndex;
        };

        TaiXiuControllerRight.prototype.getDetailIndex = function () {
            return this.detailIndex;
        };

        TaiXiuControllerRight.prototype.setGameHistory = function (gameHistory) {
            return this.gameHistory = gameHistory;
        };

        TaiXiuControllerRight.prototype.getGameHistory = function () {
            return this.gameHistory;
        };



        return TaiXiuControllerRight;

    })();

    cc.TaiXiuControllerRight = TaiXiuControllerRight;

}).call(this);

