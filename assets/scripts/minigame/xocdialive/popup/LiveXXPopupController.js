
(function () {
    var LiveXXPopupController;

    LiveXXPopupController = (function () {
        var instance;

        function LiveXXPopupController() {
        }

        instance = void 0;

        LiveXXPopupController.getInstance = function () {
            if (instance === void 0) {
                instance = this;
            }
            return instance.prototype;
        };

        LiveXXPopupController.prototype.setLiveXXPopupView = function (LiveXXPopupView) {
            this.countPopup = 0;
            return this.LiveXXPopupView = LiveXXPopupView;
        };
        LiveXXPopupController.prototype.getPopupCount = function () {
            return  this.countPopup?this.countPopup:0;
        };
        LiveXXPopupController.prototype.addPopupCount = function (number) {
            this.countPopup+=number;
            return  this.countPopup;
        };


        LiveXXPopupController.prototype.createSessionDetailView = function () {
            this.countPopup +=1;
            return this.LiveXXPopupView.createSessionDetailView();
        };

        LiveXXPopupController.prototype.destroySessionDetailView = function () {
            this.countPopup -=1;
            return this.LiveXXPopupView.destroySessionDetailView();
        };

        LiveXXPopupController.prototype.createTopView = function () {
            this.countPopup +=1;

            return this.LiveXXPopupView.createTopView();
        };

        LiveXXPopupController.prototype.destroyTopView = function () {
            this.countPopup -=1;

            return this.LiveXXPopupView.destroyTopView();
        };

        LiveXXPopupController.prototype.createTopTipView = function () {
            this.countPopup +=1;

            return this.LiveXXPopupView.createTopTipView();
        };

        LiveXXPopupController.prototype.destroyTopTipView = function () {
            this.countPopup -=1;

            return this.LiveXXPopupView.destroyTopTipView();
        };
        LiveXXPopupController.prototype.createJackpotHistoryView = function () {
            this.countPopup +=1;

            return this.LiveXXPopupView.createJackpotHistoryView();
        };

        LiveXXPopupController.prototype.destroyJackpotHistoryView = function () {
            this.countPopup -=1;

            return this.LiveXXPopupView.destroyJackpotHistoryView();
        };



        LiveXXPopupController.prototype.createHelpView = function () {
            this.countPopup +=1;

            return this.LiveXXPopupView.createHelpView();
        };

        LiveXXPopupController.prototype.destroyHelpView = function () {
            this.countPopup -=1;

            return this.LiveXXPopupView.destroyHelpView();
        };

        LiveXXPopupController.prototype.createHistoryView = function () {
            this.countPopup +=1;

            return this.LiveXXPopupView.createHistoryView();
        };

        LiveXXPopupController.prototype.destroyHistoryView = function () {
            this.countPopup -=1;

            return this.LiveXXPopupView.destroyHistoryView();
        };

        LiveXXPopupController.prototype.createGroupUserView = function () {
            this.countPopup +=1;

            return this.LiveXXPopupView.createGroupUserView();
        };
        LiveXXPopupController.prototype.destroyGroupUserView = function () {
            this.countPopup -=1;
            return this.LiveXXPopupView.destroyGroupUserView();
        };

        //property
        LiveXXPopupController.prototype.setDetailIndex = function (detailIndex) {
            return this.detailIndex = detailIndex;
        };

        LiveXXPopupController.prototype.getDetailIndex = function () {
            return this.detailIndex;
        };


        LiveXXPopupController.prototype.setGameHistory = function (gameHistory) {
            return this.gameHistory = gameHistory;
        };

        LiveXXPopupController.prototype.getGameHistory = function () {
            return this.gameHistory;
        };

        return LiveXXPopupController;

    })();

    cc.LiveXXPopupController = LiveXXPopupController;

}).call(this);
