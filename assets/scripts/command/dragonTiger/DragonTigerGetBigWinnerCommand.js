/*
 * Generated by BeChicken
 * on 6/10/2019
 * version v1.0
 */
(function () {
    var DragonTigerGetBigWinnerCommand;

    DragonTigerGetBigWinnerCommand = (function () {
        function DragonTigerGetBigWinnerCommand() {
        }

        DragonTigerGetBigWinnerCommand.prototype.execute = function (controller) {
            var url = 'api/Game/GetBigWinner';

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.DRAGON_TIGER, url, function (response) {
                var obj = JSON.parse(response);
                return controller.onDragonTigerGetBigWinnerResponse(obj);
            });
        };

        return DragonTigerGetBigWinnerCommand;

    })();

    cc.DragonTigerGetBigWinnerCommand = DragonTigerGetBigWinnerCommand;

}).call(this);
