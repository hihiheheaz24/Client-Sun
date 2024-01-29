/**
 * Created by Nofear on 6/21/2017.
 */

(function () {
    var MainController;

    MainController = (function () {
        var instance;

        function MainController() {

        }

        instance = void 0;

        MainController.getInstance = function () {
            if (instance === void 0) {
                instance = this;
            }
            return instance.prototype;
        };

        MainController.prototype.setMainView = function (mainView) {
            return this.mainView = mainView;
        };


        MainController.prototype.betLinesClicked = function () {
            return this.mainView.betLinesClicked()
        };

        MainController.prototype.destroyHelpView = function () {
            return this.mainView.destroyHelpView();
        };

        MainController.prototype.destroyHelpMiniView = function () {
            return this.mainView.destroyHelpMiniView();
        };

        MainController.prototype.destroyBetLinesView = function () {
            return this.mainView.destroyBetLinesView();
        };

        MainController.prototype.destroyLeaderboardView = function () {
            return this.mainView.destroyLeaderboardView();
        };

        MainController.prototype.destroyHistoryView = function () {
            return this.mainView.destroyHistoryView();
        };

        MainController.prototype.createSessionDetailView = function () {
            return this.mainView.createSessionDetailView();
        };

        MainController.prototype.destroySessionDetailView = function () {
            return this.mainView.destroySessionDetailView();
        };

        MainController.prototype.createBonusGameView = function () {
            return this.mainView.createBonusGameView();
        };

        MainController.prototype.destroyBonusGameView = function () {
            return this.mainView.destroyBonusGameView();
        };

        MainController.prototype.createX2GameView = function () {
            return this.mainView.createX2GameView();
        };

        MainController.prototype.destroyX2GameView = function () {
            return this.mainView.destroyX2GameView();
        };

        MainController.prototype.createCrazyGameView = function () {
            return this.mainView.createCrazyView();
        };

        MainController.prototype.destroyCrazyGameView = function () {
            return this.mainView.destroyCrazyView();
        };

        return MainController;

    })();

    cc.MainController = MainController;

}).call(this);

