/*
 * Generated by BeChicken
 * on 10/30/2019
 * version v1.0
 */

(function () {
    var CBAccumulateController;

    CBAccumulateController = (function () {
        var instance;

        function CBAccumulateController() {

        }

        instance = void 0;

        CBAccumulateController.getInstance = function () {
            if (instance === void 0) {
                instance = this;
            }
            return instance.prototype;
        };

        CBAccumulateController.prototype.setAccumulateView = function (accumulationView) {
            return this.accumulationView = accumulationView;
        };

        CBAccumulateController.prototype.onUpdateAccumulate = function (data) {
            return this.accumulationView.onUpdateAccumulate(data);
        };

        CBAccumulateController.prototype.initAccumulate = function (data) {
            return this.accumulationView.initAccumulate(data);
        };

        return CBAccumulateController;

    })();

    cc.CBAccumulateController = CBAccumulateController;

}).call(this);