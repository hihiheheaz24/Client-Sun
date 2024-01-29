

(function () {
    var CaoThapGetHistoryCommand;

    CaoThapGetHistoryCommand = (function () {
        function CaoThapGetHistoryCommand() {
        }

        CaoThapGetHistoryCommand.prototype.execute = function (controller) {
            var url = 'api/caothap/historygame?totalrecord=50';

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.CAO_THAP, url, function (response) {
                var obj = JSON.parse(response);
                return controller.onCaoThapGetHistoryResponse(obj);
            });
        };

        return CaoThapGetHistoryCommand;

    })();

    cc.CaoThapGetHistoryCommand = CaoThapGetHistoryCommand;

}).call(this);
