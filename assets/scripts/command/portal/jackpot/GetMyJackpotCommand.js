/**
 * Created by Nofear on 2/27/2019.
 */

(function () {
    var GetMyJackpotCommand;

    GetMyJackpotCommand = (function () {
        function GetMyJackpotCommand() {
        }

        GetMyJackpotCommand.prototype.execute = function (controller) {
            var url = 'api/Jackpot/GetUserAward'; //-1 tat ca cac game

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.PORTAL, url, function (response) {
                var obj = JSON.parse(response);
                return controller.onGetMyJackpotResponse(obj);
            });
        };

        return GetMyJackpotCommand;

    })();

    cc.GetMyJackpotCommand = GetMyJackpotCommand;

}).call(this);
