

(function () {
    var TXGetBigWinnersCommand;

    TXGetBigWinnersCommand = (function () {
        function TXGetBigWinnersCommand() {
        }

        TXGetBigWinnersCommand.prototype.execute = function (controller,indexCurrentTable) {
            var url = 'api/luckydice/GetBigWinner';
            var SubdomainName = cc.SubdomainName.TAI_XIU;
            switch (indexCurrentTable) {
                case "0":
                    url = 'api/luckydice/GetBigWinner';
                    SubdomainName = cc.SubdomainName.TAI_XIU;
                    break;
                case "1":
                    url = 'api/luckydice1/GetBigWinner';
                    SubdomainName = cc.SubdomainName.TAI_XIU1;
                        break;
                case "2":
                    url = 'api/luckydice2/GetBigWinner';
                    SubdomainName = cc.SubdomainName.TAI_XIU2;
                    break;
                default:
                    url = 'api/luckydice/GetBigWinner';
                    SubdomainName = cc.SubdomainName.TAI_XIU;
                    break;
            }
            return cc.ServerConnector.getInstance().sendRequest(SubdomainName, url, function (response) {
                var obj = JSON.parse(response);
                return controller.onTXGetBigWinnersResponse(obj,indexCurrentTable);
            });
        };

        return TXGetBigWinnersCommand;

    })();

    cc.TXGetBigWinnersCommand = TXGetBigWinnersCommand;

}).call(this);
