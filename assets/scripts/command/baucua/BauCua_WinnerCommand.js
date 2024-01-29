/*
 * Generated by BeChicken
 * on 11/13/2019
 * version v1.0
 */
(function () {
    var BauCuaWinnerCommand;

    BauCuaWinnerCommand = (function () {
        function BauCuaWinnerCommand() {
        }

        BauCuaWinnerCommand.prototype.execute = function (controller) {
            let url = 'api/BauCua/GetBigWinner';
            let subDomainName = cc.SubdomainName.BAUCUA;
            return cc.ServerConnector.getInstance().sendRequest(subDomainName, url, function (response) {
                var obj = JSON.parse(response);
                return controller.onGetBigWinnerResponse(obj);
            });
        };

        return BauCuaWinnerCommand;

    })();

    cc.BauCuaWinnerCommand = BauCuaWinnerCommand;

}).call(this);