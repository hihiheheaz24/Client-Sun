

(function () {
    var TXGetHistoryCommand;

    TXGetHistoryCommand = (function () {
        function TXGetHistoryCommand() {
        }

        TXGetHistoryCommand.prototype.execute = function (controller,indexCurrentTable) {
            var url = 'api/luckydice/GetHistory';
            var SubdomainName = cc.SubdomainName.TAI_XIU;
            switch (indexCurrentTable) {
                case "0":
                    url = 'api/luckydice/GetHistory';
                    SubdomainName = cc.SubdomainName.TAI_XIU;
                    break;
                case "1":
                    url = 'api/luckydice1/GetHistory';
                    SubdomainName = cc.SubdomainName.TAI_XIU1;
                        break;
                case "2":
                    url = 'api/luckydice2/GetHistory';
                    SubdomainName = cc.SubdomainName.TAI_XIU2;
                    break;
                default:
                    url = 'api/luckydice/GetHistory';
                    SubdomainName = cc.SubdomainName.TAI_XIU;
                    break;
            }
            return cc.ServerConnector.getInstance().sendRequest(SubdomainName, url, function (response) {
                var obj = JSON.parse(response);
                return controller.onTXGetHistoryResponse(obj,indexCurrentTable);
            });
        };

        return TXGetHistoryCommand;

    })();

    cc.TXGetHistoryCommand = TXGetHistoryCommand;

}).call(this);
