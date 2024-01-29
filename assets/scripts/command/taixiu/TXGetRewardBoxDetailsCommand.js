

(function () {
    var TXGetRewardBoxDetailsCommand;

    TXGetRewardBoxDetailsCommand = (function () {
        function TXGetRewardBoxDetailsCommand() {
        }

        TXGetRewardBoxDetailsCommand.prototype.execute = function (controller) {
            var url = 'api/luckydice/RewardBoxDetails';
            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.TAI_XIU, url, function (response) {
                var obj = JSON.parse(response);
                return controller.onGetRewardBoxDetailsResponse(obj);
            });
        };

        return TXGetRewardBoxDetailsCommand;

    })();

    cc.TXGetRewardBoxDetailsCommand = TXGetRewardBoxDetailsCommand;

}).call(this);
