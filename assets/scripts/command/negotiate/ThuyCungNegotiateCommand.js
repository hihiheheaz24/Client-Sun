/**
 * Created by Nofear on 2/27/2019.
 */

(function () {
    var ThuyCungNegotiateCommand;

    ThuyCungNegotiateCommand = (function () {
        function ThuyCungNegotiateCommand() {
        }

        ThuyCungNegotiateCommand.prototype.execute = function (controller) {
            var url = 'signalr/negotiate';

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.THUY_CUNG, url, function (response) {
                var obj = JSON.parse(response);

                return controller.onSlotsNegotiateResponse(obj);

            }, true);
        };

        return ThuyCungNegotiateCommand;

    })();

    cc.ThuyCungNegotiateCommand = ThuyCungNegotiateCommand;

}).call(this);
