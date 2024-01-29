/**
 * Created by Nofear on 3/19/2019.
 */

(function () {
    var GetHistoryLoginCommand;

    GetHistoryLoginCommand = (function () {
        function GetHistoryLoginCommand() {
        }

        GetHistoryLoginCommand.prototype.execute = function (controller) {
            var url = 'api/History/GetLoginHistory';
            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.PORTAL, url, function (response) {
                var obj = JSON.parse(response);
                if (obj.ResponseCode==1) {
                    return controller.onGetHistoryLoginSuccess(obj);
                } else {
                    return controller.onGetHistoryLoginError(obj);
                }
            });
        };

        return GetHistoryLoginCommand;

    })();

    cc.GetHistoryLoginCommand = GetHistoryLoginCommand;

}).call(this);
