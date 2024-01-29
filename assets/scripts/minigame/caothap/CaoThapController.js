/**
 * Created by Nofear on 6/21/2017.
 */

(function () {
    var CaoThapController;

    CaoThapController = (function () {
        var instance;

        function CaoThapController() {

        }

        instance = void 0;

        CaoThapController.getInstance = function () {
            if (instance === void 0) {
                instance = this;
            }
            return instance.prototype;
        };

        CaoThapController.prototype.setCaoThapView = function (CaoThapView) {
            return this.CaoThapView = CaoThapView;
        };

        CaoThapController.prototype.setCaoThapButtonView = function (CaoThapButtonView) {
            return this.CaoThapButtonView = CaoThapButtonView;
        };

        CaoThapController.prototype.setCaoThapPopupView = function (CaoThapPopupView) {
            return this.CaoThapPopupView = CaoThapPopupView;
        };

        CaoThapController.prototype.sendRequestOnHub = function (method, data1, data2) {
            this.CaoThapView.sendRequestOnHub(method, data1, data2);
        };

        CaoThapController.prototype.getMode = function () {
            return this.CaoThapButtonView.getMode();
        };

        CaoThapController.prototype.getRoomId = function () {
            return this.CaoThapButtonView.getRoomId();
        };

        CaoThapController.prototype.getFastSpin = function () {
            return this.CaoThapButtonView.getFastSpin();
        };

        CaoThapController.prototype.activateAllButton = function (enable) {
            this.CaoThapButtonView.activateAllButton(enable);
        };

        CaoThapController.prototype.activateButton = function (enable) {
            this.CaoThapButtonView.activateButton(enable);
        };

        CaoThapController.prototype.activateButtonX = function (enable) {
            this.CaoThapButtonView.activateButtonX(enable);
        };

        CaoThapController.prototype.setMode = function (mode) {
            this.CaoThapButtonView.setMode(mode);
        };

        CaoThapController.prototype.stopAutoSpin = function () {
            this.CaoThapButtonView.stopAutoSpin();
        };

        CaoThapController.prototype.startSpin = function () {
            this.CaoThapButtonView.startSpin();
        };

        CaoThapController.prototype.createTopView = function () {
            this.CaoThapPopupView.createTopView();
        };

        CaoThapController.prototype.createHistoryView = function () {
            this.CaoThapPopupView.createHistoryView();
        };

        CaoThapController.prototype.createHelpView = function () {
            this.CaoThapPopupView.createHelpView();
        };

        CaoThapController.prototype.destroyTopView = function () {
            this.CaoThapPopupView.destroyTopView();
        };

        CaoThapController.prototype.destroyHistoryView = function () {
            this.CaoThapPopupView.destroyHistoryView();
        };

        CaoThapController.prototype.destroyHelpView = function () {
            this.CaoThapPopupView.destroyHelpView();
        };

        CaoThapController.prototype.reset = function () {
            if(this.CaoThapView){
                this.CaoThapView.reset();
            }

        };

        CaoThapController.prototype.onScale = function () {
            this.CaoThapView.onScale();
        };

        return CaoThapController;

    })();

    cc.CaoThapController = CaoThapController;

}).call(this);

