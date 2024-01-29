
//Created by SpiderMan404
(function () {
    var Xeng777GetAccountBetHistoryCommand;

    Xeng777GetAccountBetHistoryCommand = (function () {
        function Xeng777GetAccountBetHistoryCommand() {
        }

        Xeng777GetAccountBetHistoryCommand.prototype.execute = function (controller, sessionId) {
            var url = 'api/xeng777/GetAccountBetHistory?sessionId=' + sessionId;

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.XENG_777, url, function (response) {
                var obj = JSON.parse(response);
                return controller.onGetAccountBetHistoryResponse(obj);
            });
        };

        return Xeng777GetAccountBetHistoryCommand;

    })();

    cc.Xeng777GetAccountBetHistoryCommand = Xeng777GetAccountBetHistoryCommand;

}).call(this);
