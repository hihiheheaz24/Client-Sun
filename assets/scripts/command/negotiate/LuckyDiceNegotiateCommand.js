/**
 * Created by Nofear on 2/27/2019.
 */

(function () {
    var LuckyDiceNegotiateCommand;

    LuckyDiceNegotiateCommand = (function () {
        function LuckyDiceNegotiateCommand() {
        }

        LuckyDiceNegotiateCommand.prototype.execute = function (controller,subName,hubIndex) {
            var url = 'signalr/negotiate';

            return cc.ServerConnector.getInstance().sendRequest(subName, url, function (response) {
                var obj = JSON.parse(response);

                return controller.onLuckyDiceNegotiateResponse(obj,hubIndex);

            }, true);
        };

        return LuckyDiceNegotiateCommand;

    })();

    cc.LuckyDiceNegotiateCommand = LuckyDiceNegotiateCommand;

}).call(this);
