
(function () {
    var CrazyGameController;

    CrazyGameController = (function () {
        var instance;

        function CrazyGameController() {
        }

        instance = void 0;

        CrazyGameController.getInstance = function () {
            if (instance === void 0) {
                instance = this;
            }
            return instance.prototype;
        };

        CrazyGameController.prototype.setCrazyGame = function (crazyView) {
            return this.crazyView = crazyView;
        };

        CrazyGameController.prototype.getData = function () {
            return this.crazyGameResponse;
        };

        CrazyGameController.prototype.setData = function (crazyGameResponse) {
            return this.crazyGameResponse = crazyGameResponse;
        };

        CrazyGameController.prototype.getCurrentStep = function () {
            return this.currentStep;
        };

        CrazyGameController.prototype.setCurrentStep = function (currentStep) {
            return this.currentStep = currentStep;
        };

        CrazyGameController.prototype.getTotalWin = function () {
            return this.crazyTotalWin;
        };

        CrazyGameController.prototype.updateTotalWin = function (totalWin) {
            return this.crazyTotalWin = totalWin;
        };

        CrazyGameController.prototype.getMultiplierCrazy = function () {
            return this.crazyMultiplierCrazy;
        };

        CrazyGameController.prototype.updateMultiplierCrazy = function (multiplier) {
            return this.crazyMultiplierCrazy = multiplier;
        };

        CrazyGameController.prototype.getTotalMultiplier = function () {
            return this.crazyTotalMultiplier;
        };

        CrazyGameController.prototype.updateTotalMultiplier = function (multiplier) {
            return this.crazyTotalMultiplier = multiplier;
        };

        CrazyGameController.prototype.getAmountWin = function () {
            return this.crazyAmountWin;
        };

        CrazyGameController.prototype.updateAmountWin = function (amountWin) {
            return this.crazyAmountWin = amountWin;
        };

        CrazyGameController.prototype.getCrazyGameState = function () {
            return this.crazyGameState;
        };

        CrazyGameController.prototype.changeView = function (crazyGameState) {
            this.crazyGameState = crazyGameState;
            return this.crazyView.changeView(crazyGameState);
        };

        return CrazyGameController;

    })();

    cc.CrazyGameController = CrazyGameController;

}).call(this);
