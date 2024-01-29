/**
 * Created by Nofear on 3/19/2019.
 */

(function () {
    var GetHistoryPaymentCommand;

    GetHistoryPaymentCommand = (function () {
        function GetHistoryPaymentCommand() {
        }

        GetHistoryPaymentCommand.prototype.execute = function (controller) {
            var url = 'api/Account/GetHistoryCasoutRecharge'+controller.urlParams;
            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.PORTAL, url, function (response) {
                var obj = JSON.parse(response);
                if (obj.ResponseCode==1) {
                    return controller.onGetHistoryPaymentSuccess(obj);
                } else {
                    return controller.onGetHistoryPaymentError(obj);
                }
            });
        };

        return GetHistoryPaymentCommand;

    })();

    cc.GetHistoryPaymentCommand = GetHistoryPaymentCommand;

}).call(this);
