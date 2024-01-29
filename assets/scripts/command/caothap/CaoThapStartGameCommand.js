

(function () {
    var CaoThapStartGameCommand;

    CaoThapStartGameCommand = (function () {
        function CaoThapStartGameCommand() {
        }

        CaoThapStartGameCommand.prototype.execute = function (controller,roomID) {
            var url = 'api/caothap/startgame?roomID='+roomID;

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.CAO_THAP, url, function (response) {
                var obj = JSON.parse(response);
                return controller.onCaoThapStartGameResponse(obj);
            });
        };

        return CaoThapStartGameCommand;

    })();

    cc.CaoThapStartGameCommand = CaoThapStartGameCommand;

}).call(this);
