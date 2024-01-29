/**
 * Created by Nofear on 2/27/2019.
 */

(function () {
    var CaoThapNegotiateCommand;

    CaoThapNegotiateCommand = (function () {
        function CaoThapNegotiateCommand() {
        }

        CaoThapNegotiateCommand.prototype.execute = function (controller) {
            var url = 'signalr/negotiate';

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.CAO_THAP, url, function (response) {
                var obj = JSON.parse(response);

                return controller.onCaoThapNegotiateResponse(obj);

            }, true);
        };

        return CaoThapNegotiateCommand;

    })();

    cc.CaoThapNegotiateCommand = CaoThapNegotiateCommand;

}).call(this);
