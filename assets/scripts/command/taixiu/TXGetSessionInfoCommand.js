

(function () {
    var TXGetSessionInfoCommand;

    TXGetSessionInfoCommand = (function () {
        function TXGetSessionInfoCommand() {

        }

        TXGetSessionInfoCommand.prototype.execute = function (controller, sessionId) {
            var url = 'api/luckydice/GetSessionInfo?sessionId=' + sessionId;
            let currentTableIndex = cc.LocalStorage.getInstance().getData("mainTXTable","0");

            switch (currentTableIndex) {
                case "0":
                    url = 'api/luckydice/GetSessionInfo?sessionId=' + sessionId;
                    break;
                case "1":
                    url = 'api/luckydice1/GetSessionInfo?sessionId=' + sessionId;
                        break;
                case "2":
                    url = 'api/luckydice2/GetSessionInfo?sessionId=' + sessionId;
                    break;
                default:
                    url = 'api/luckydice/GetSessionInfo?sessionId=' + sessionId;

                    break;
            }
            return cc.ServerConnector.getInstance().sendRequest(cc.TaiXiuController.getInstance().getSubDomain(), url, function (response) {
                var obj = JSON.parse(response);
                return controller.onTXGetSessionInfoResponse(obj);
            });
        };

        return TXGetSessionInfoCommand;

    })();

    cc.TXGetSessionInfoCommand = TXGetSessionInfoCommand;

}).call(this);
