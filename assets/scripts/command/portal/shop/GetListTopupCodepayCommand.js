/**
 * Created by Nofear on 3/19/2019.
 */

(function () {
    var GetListTopupCodepay;

    GetListTopupCodepay = (function () {
        function GetListTopupCodepay() {
        }

        GetListTopupCodepay.prototype.execute = function (controller) {
            var url = 'api/charge/GetListBank';

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.PORTAL, url, function (response) {
                cc.PopupController.getInstance().hideBusy();
                var obj = JSON.parse(response);
                if (obj.ResponseCode === 1) {
                    return controller.onGetListTopupBankResponse(obj);
                } else {
                    cc.PopupController.getInstance().showMessageError(obj.Message, obj.ResponseCode);
                }
            });
        };

        return GetListTopupCodepay;

    })();

    cc.GetListTopupCodepay = GetListTopupCodepay;

}).call(this);
