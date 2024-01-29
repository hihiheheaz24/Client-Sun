/**
 * Created by Nofear on 2/27/2019.
 */

(function () {
    var GetThuyCungHistoryCommand;

    GetThuyCungHistoryCommand = (function () {
        function GetThuyCungHistoryCommand() {
        }

        GetThuyCungHistoryCommand.prototype.execute = function (controller) {
            var url = 'api/thuycung20/GetHistory?top=100';

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.THUY_CUNG, url, function (response) {
                var obj = JSON.parse(response);
                return controller.onGetSlotsHistoryResponse(obj);
            });
        };

        return GetThuyCungHistoryCommand;

    })();

    cc.GetThuyCungHistoryCommand = GetThuyCungHistoryCommand;

}).call(this);
