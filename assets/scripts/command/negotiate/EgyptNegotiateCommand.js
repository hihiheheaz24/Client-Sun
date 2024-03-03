/**
 * Created by Nofear on 2/27/2019.
 */

(function () {
    var EgyptNegotiateCommand;

    EgyptNegotiateCommand = (function () {
        function EgyptNegotiateCommand() {
        }

        EgyptNegotiateCommand.prototype.execute = function (controller, subdomainName = cc.SubdomainName.EGYPT) {
            var url = 'signalr/negotiate';
            console.log("Check SubdomainName type : ", subdomainName)
            return cc.ServerConnector.getInstance().sendRequest(subdomainName, url, function (response) {
                var obj = JSON.parse(response);
                return controller.onSlotsNegotiateResponse(obj);
            }, true);
        };

        return EgyptNegotiateCommand;

    })();

    cc.EgyptNegotiateCommand = EgyptNegotiateCommand;

}).call(this);
