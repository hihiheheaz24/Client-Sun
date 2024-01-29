/*
 * Generated by BeChicken
 * on 10/30/2019
 * version v1.0
 */
(function () {
    var LiveXXGetTopTipCommand;

    LiveXXGetTopTipCommand = (function () {
        function LiveXXGetTopTipCommand() {
        }

        LiveXXGetTopTipCommand.prototype.execute = function (controller) {
            var url = 'api/XocDiaLive/GetTopTip';

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.XOC_DIA_LIVE, url, function (response) {
                var obj = JSON.parse(response);
                return controller.onLiveXXGetTopTipResponse(obj);
            });
        };

        return LiveXXGetTopTipCommand;

    })();

    cc.LiveXXGetTopTipCommand = LiveXXGetTopTipCommand;

}).call(this);