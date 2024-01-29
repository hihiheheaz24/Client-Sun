

(function () {
    var TXGetRewardBoxCommand;

    TXGetRewardBoxCommand = (function () {
        function TXGetRewardBoxCommand() {
        }

        TXGetRewardBoxCommand.prototype.execute = function (controller,position) {
            var url = 'api/luckydice/GetReward?position='+position;
            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.TAI_XIU, url, function (response) {
                var obj = JSON.parse(response);
                return controller.onTXGetRewardBoxResponse(obj,position);
            });
        };

        return TXGetRewardBoxCommand;

    })();

    cc.TXGetRewardBoxCommand = TXGetRewardBoxCommand;

}).call(this);
