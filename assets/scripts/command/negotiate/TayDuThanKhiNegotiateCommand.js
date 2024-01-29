/**
 * Created by Nofear on 2/27/2019.
 */

(function () {
    var TayDuThanKhiNegotiateCommand;

    TayDuThanKhiNegotiateCommand = (function () {
        function TayDuThanKhiNegotiateCommand() {
        }

        TayDuThanKhiNegotiateCommand.prototype.execute = function (controller) {
            var url = 'signalr/negotiate';

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.TAY_DU_THAN_KHI, url, function (response) {
                var obj = JSON.parse(response);

                return controller.onSlotsNegotiateResponse(obj);

            }, true);
        };

        return TayDuThanKhiNegotiateCommand;

    })();

    cc.TayDuThanKhiNegotiateCommand = TayDuThanKhiNegotiateCommand;

}).call(this);
