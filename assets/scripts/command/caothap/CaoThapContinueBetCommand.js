

(function () {
    var CaoThapContinueBetCommand;

    CaoThapContinueBetCommand = (function () {
        function CaoThapContinueBetCommand() {
        }

        CaoThapContinueBetCommand.prototype.execute = function (controller,betOption) {
            var url = 'api/caothap/continuebet?betoption='+betOption;

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.CAO_THAP, url, function (response) {
                var obj = JSON.parse(response);
                return controller.onCaoThapContinueBetResponse(obj);
            });
        };

        return CaoThapContinueBetCommand;

    })();

    cc.CaoThapContinueBetCommand = CaoThapContinueBetCommand;

}).call(this);
