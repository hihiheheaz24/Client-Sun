/**
 * Created by Nofear on 2/27/2019.
 */

(function () {
    var ThanThuNegotiateCommand;

    ThanThuNegotiateCommand = (function () {
        function ThanThuNegotiateCommand() {
        }

        ThanThuNegotiateCommand.prototype.execute = function (controller) {
            var url = 'signalr/negotiate';

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.THAN_THU, url, function (response) {
                var obj = JSON.parse(response);

                return controller.onSlotsNegotiateResponse(obj);

            }, true);
        };

        return ThanThuNegotiateCommand;

    })();

    cc.ThanThuNegotiateCommand = ThanThuNegotiateCommand;

}).call(this);
