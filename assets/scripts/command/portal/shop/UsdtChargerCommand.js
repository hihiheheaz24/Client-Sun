/**
 * Created by Nofear on 3/19/2019.
 */

 (function () {
    var UsdtChargerCommand;

    UsdtChargerCommand = (function () {
        function UsdtChargerCommand() {
        }

        UsdtChargerCommand.prototype.execute = function (controller) {
            var url = 'api/charge/getInfor?chargeType='+controller.chargeType+"&amount="+controller.amount+"&phoneSender="+controller.phoneSender;
            cc.PopupController.getInstance().showBusy();
            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.PORTAL, url, function (response) {
                var obj = JSON.parse(response);
                cc.PopupController.getInstance().hideBusy();
                if (obj.ResponseCode === 1) {
                    return controller.onWalletChargerCommandResponse(obj);
                } else {
                    return controller.onWalletChargerCommandResponseError(obj);
                }
            });
        };
        return UsdtChargerCommand;

    })();
    cc.UsdtChargerCommand = UsdtChargerCommand;

}).call(this);
