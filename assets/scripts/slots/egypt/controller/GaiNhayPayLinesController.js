
(function () {
    var GaiNhayPayLinesController;

    GaiNhayPayLinesController = (function () {
        var instance;

        function GaiNhayPayLinesController() {
        }

        instance = void 0;

        GaiNhayPayLinesController.getInstance = function () {
            if (instance === void 0) {
                instance = this;
            }
            return instance.prototype;
        };

        GaiNhayPayLinesController.prototype.setPayLinesView = function (payLineView) {
            return this.payLineView = payLineView;
        };

        GaiNhayPayLinesController.prototype.showSelectedLines = function(numberOfLines) {
            return this.payLineView.showSelectedLines(numberOfLines);
        }

        return GaiNhayPayLinesController;

    })();

    cc.GaiNhayPayLinesController = GaiNhayPayLinesController;

}).call(this);
