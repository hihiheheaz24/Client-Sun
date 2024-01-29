/**
 * Created by Nofear on 2/27/2019.
 */

(function () {
    var GetThuyCungJackpotCommand;

    GetThuyCungJackpotCommand = (function () {
        function GetThuyCungJackpotCommand() {
        }

        GetThuyCungJackpotCommand.prototype.execute = function (controller) {
            var url = 'api/thuycung20/GetBigWinner?top=100&type=' + cc.BigWinnerType.JACKPOT;

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.THUY_CUNG, url, function (response) {
                var obj = JSON.parse(response);
                return controller.onGetJackpotResponse(obj);
            });
        };

        return GetThuyCungJackpotCommand;

    })();

    cc.GetThuyCungJackpotCommand = GetThuyCungJackpotCommand;

}).call(this);
