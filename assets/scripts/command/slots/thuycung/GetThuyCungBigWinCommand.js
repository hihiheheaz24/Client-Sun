/**
 * Created by Nofear on 2/27/2019.
 */

(function () {
    var GetThuyCungBigWinCommand;

    GetThuyCungBigWinCommand = (function () {
        function GetThuyCungBigWinCommand() {
        }

        GetThuyCungBigWinCommand.prototype.execute = function (controller) {
            var url = 'api/thuycung20/GetBigWinner?top=50&type=' + cc.BigWinnerType.BIG_WIN;

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.THUY_CUNG, url, function (response) {
                var obj = JSON.parse(response);
                return controller.onGetBigWinResponse(obj);
            });
        };

        return GetThuyCungBigWinCommand;

    })();

    cc.GetThuyCungBigWinCommand = GetThuyCungBigWinCommand;

}).call(this);
