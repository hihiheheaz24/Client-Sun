
//Created by SpiderMan404
(function () {
    var Xeng777GetBigWinnersCommand;

    Xeng777GetBigWinnersCommand = (function () {
        function Xeng777GetBigWinnersCommand() {
        }

        Xeng777GetBigWinnersCommand.prototype.execute = function (controller) {
            var url = 'api/xeng777/GetBigWinner';

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.XENG_777, url, function (response) {
                var obj = JSON.parse(response);
                return controller.onGetBigWinnersResponse(obj);
            });
        };

        return Xeng777GetBigWinnersCommand;

    })();

    cc.Xeng777GetBigWinnersCommand = Xeng777GetBigWinnersCommand;

}).call(this);
