/**
 * Created by Nofear on 3/19/2019.
 */

 (function () {
    var MomoChagerCommand;

    MomoChagerCommand = (function () {
        function MomoChagerCommand() {
        }

        MomoChagerCommand.prototype.execute = function (controller) {
            var url = 'api/charge/getInfor?chargeType='+controller.chargeType+"&amount="+controller.amount;
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
        return MomoChagerCommand;

    })();
    cc.MomoChagerCommand = MomoChagerCommand;

}).call(this);
