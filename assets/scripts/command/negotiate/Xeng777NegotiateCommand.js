/**
 * Created by Nobita on 01/15/2022.
 */

(function () {
    var Xeng777NegotiateCommand;

    Xeng777NegotiateCommand = (function () {
        function Xeng777NegotiateCommand() {
        }

        Xeng777NegotiateCommand.prototype.execute = function (controller) {
            var url = 'signalr/negotiate';

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.XENG_777, url, function (response) {				
                var obj = JSON.parse(response);
				//console.log(obj);
                return controller.onXeng777NegotiateResponse(obj);

            }, true);
        };

        return Xeng777NegotiateCommand;

    })();

    cc.Xeng777NegotiateCommand = Xeng777NegotiateCommand;

}).call(this);
