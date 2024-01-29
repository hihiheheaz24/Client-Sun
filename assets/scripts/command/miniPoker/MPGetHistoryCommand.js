

(function () {
    var MPGetHistoryCommand;

    MPGetHistoryCommand = (function () {
        function MPGetHistoryCommand() {
        }

        MPGetHistoryCommand.prototype.execute = function (controller) {
            var url = 'api/xpoker/GetHistory?top=50';

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.MINI_POKER, url, function (response) {
                var obj = JSON.parse(response);
                return controller.onGetHistoryResponse(obj);
            });
        };

        return MPGetHistoryCommand;

    })();

    cc.MPGetHistoryCommand = MPGetHistoryCommand;

}).call(this);
