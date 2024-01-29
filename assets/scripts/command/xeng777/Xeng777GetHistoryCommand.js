
//Created by SpiderMan404
(function () {
    var Xeng777GetHistoryCommand;

    Xeng777GetHistoryCommand = (function () {
        function Xeng777GetHistoryCommand() {
        }

        Xeng777GetHistoryCommand.prototype.execute = function (controller) {
            var url = 'api/xeng777/GetHistory?top=100';

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.XENG_777, url, function (response) {
                var obj = JSON.parse(response);
                return controller.onGetHistoryResponse(obj);
            });
        };

        return Xeng777GetHistoryCommand;

    })();

    cc.Xeng777GetHistoryCommand = Xeng777GetHistoryCommand;

}).call(this);
