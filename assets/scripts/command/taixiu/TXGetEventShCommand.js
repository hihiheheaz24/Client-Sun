

(function () {
    var TXGetEventShCommand;

    TXGetEventShCommand = (function () {
        function TXGetEventShCommand() {
        }

        TXGetEventShCommand.prototype.getHistory = function (controller) {
            var url = 'api/luckydice/GetBoxHistory';
            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.TAI_XIU, url, function (response) {
                var obj = JSON.parse(response);
                return controller.onGetEventShHistoryResponse(obj);
            });
        };
        TXGetEventShCommand.prototype.getStatisticByBoxID = function (controller,boxID) {
            var url = 'api/luckydice/GetStatisticByBoxID?boxid='+boxID;
            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.TAI_XIU, url, function (response) {
                var obj = JSON.parse(response);
                return controller.onGetStatisticResponse(obj);
            });
        };
        return TXGetEventShCommand;

    })();

    cc.TXGetEventShCommand = TXGetEventShCommand;

}).call(this);
