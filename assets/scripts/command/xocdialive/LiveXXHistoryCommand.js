/*
 * Generated by BeChicken
 * on 10/30/2019
 * version v1.0
 */
(function () {
    var LiveXXGetHistoryCommand;

    LiveXXGetHistoryCommand = (function () {
        function LiveXXGetHistoryCommand() {
        }

        LiveXXGetHistoryCommand.prototype.execute = function (controller) {
            var url = 'api/XocDiaLive/GetHistory';

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.XOC_DIA_LIVE, url, function (response) {
                var obj = JSON.parse(response);
                return controller.onLiveXXGetHistoryResponse(obj);
            });
        };

        return LiveXXGetHistoryCommand;

    })();

    cc.LiveXXGetHistoryCommand = LiveXXGetHistoryCommand;

}).call(this);