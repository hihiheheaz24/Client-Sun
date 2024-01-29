
//Created by SpiderMan404
(function () {
    var Xeng777GetSessionHistoryDetailsCommand;

    Xeng777GetSessionHistoryDetailsCommand = (function () {
        function Xeng777GetSessionHistoryDetailsCommand() {
        }

        Xeng777GetSessionHistoryDetailsCommand.prototype.execute = function (controller) {
            var url = 'api/sicbo/GetSessionHistoryDetails?top=100';

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.SICBO, url, function (response) {
                var obj = JSON.parse(response);
                return controller.onGetSessionHistoryDetailsResponse(obj);
            });
        };

        return Xeng777GetSessionHistoryDetailsCommand;

    })();

    cc.Xeng777GetSessionHistoryDetailsCommand = Xeng777GetSessionHistoryDetailsCommand;

}).call(this);
