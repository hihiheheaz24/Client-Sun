/**
 * Created by Nofear on 3/19/2019.
 */

(function () {
    var GetDetailRechargeByRequestIDCommand;

    GetDetailRechargeByRequestIDCommand = (function () {
        function GetDetailRechargeByRequestIDCommand() {
        }

        GetDetailRechargeByRequestIDCommand.prototype.execute = function (controller) {
            var url = 'api/Charge/DetailRecharge?requestID='+controller.requestId;
            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.PORTAL, url, function (response) {
                var obj = JSON.parse(response);
                if (obj.ResponseCode==1) {
                    return controller.onGetDetailRechargeSuccess(obj);
                } else {
                    return controller.onGetDetailRechargeError(obj);
                }
            });
        };

        return GetDetailRechargeByRequestIDCommand;

    })();

    cc.GetDetailRechargeByRequestIDCommand = GetDetailRechargeByRequestIDCommand;

}).call(this);
