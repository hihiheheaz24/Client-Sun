

(function () {
    var CaoThapStopGameCommand;

    CaoThapStopGameCommand = (function () {
        function CaoThapStopGameCommand() {
        }

        CaoThapStopGameCommand.prototype.execute = function (controller) {
            var url = 'api/caothap/stopGame';

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.CAO_THAP, url, function (response) {
                var obj = JSON.parse(response);
                return controller.onCaoThapStopGameResponse(obj);
            });
        };

        return CaoThapStopGameCommand;

    })();

    cc.CaoThapStopGameCommand = CaoThapStopGameCommand;

}).call(this);
