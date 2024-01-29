
(function () {
    var GaiNhayController;

    GaiNhayController = (function () {
        var instance;

        function GaiNhayController() {
        }

        instance = void 0;

        GaiNhayController.getInstance = function () {
            if (instance === void 0) {
                instance = this;
            }
            return instance.prototype;
        };

        GaiNhayController.prototype.setSpinView = function (spinView) {
            return this.spinView = spinView;
        };

        GaiNhayController.prototype.playAnimationDancingGirl = function() {
            return this.spinView.playAnimationDancingGirl();
        };

        GaiNhayController.prototype.getSpining = function () {
            return this.spinView.isSpining;
        };

        GaiNhayController.prototype.setCrazyProcess = function(crazyProcess) {
            return this.spinView.setCrazyProcess(crazyProcess);
        };

        GaiNhayController.prototype.createCrazyView = function(crazyView) {
            return this.spinView.createCrazyView(crazyView);
        };

        GaiNhayController.prototype.updateIconDataCrazy = function(crazyProcess) {
            return this.spinView.updateIconDataCrazy(crazyProcess);
        }

        return GaiNhayController;

    })();

    cc.GaiNhayController = GaiNhayController;

}).call(this);
