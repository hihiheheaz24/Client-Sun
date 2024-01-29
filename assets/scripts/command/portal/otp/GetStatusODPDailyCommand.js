/**
 * Created by Nofear on 2/27/2019.
 */

(function () {
    var GetStatusODPDailyCommand;

    GetStatusODPDailyCommand = (function () {
        function GetStatusODPDailyCommand() {
        }

        GetStatusODPDailyCommand.prototype.execute = function (controller) {
            var url = 'api/Account/CheckODPDaily?';
            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.PORTAL, url, function (response) {
                var obj = JSON.parse(response);
                if (obj.ResponseCode === 1) {
                    return controller.onGetStatusODPDailyResponse(obj);
                } else {
                    return controller.onGetStatusODPDailyResponseError(obj);
                }
            });
        };

        return GetStatusODPDailyCommand;

    })();

    cc.GetStatusODPDailyCommand = GetStatusODPDailyCommand;

    var GetStatusODPDailyWithoutLoginCommand;

    GetStatusODPDailyWithoutLoginCommand = (function () {
        function GetStatusODPDailyWithoutLoginCommand() {
        }

        GetStatusODPDailyWithoutLoginCommand.prototype.execute = function (controller, username) {
            var url = 'api/Account/CheckODPDailyWithoutLogin?username='+username;
            let params={};
            return cc.ServerConnector.getInstance().sendRequestPOST(cc.SubdomainName.PORTAL, url, params, function (response) {
                var obj = JSON.parse(response);
                if (obj.ResponseCode === 1) {
                    return controller.onGetStatusODPDailyWithoutLoginResponse(obj);
                } else {
                    return controller.onGetStatusODPDailyWithoutLoginResponseError(obj);
                }
            });
        };

        return GetStatusODPDailyWithoutLoginCommand;

    })();

    cc.GetStatusODPDailyWithoutLoginCommand = GetStatusODPDailyWithoutLoginCommand;
}).call(this);
