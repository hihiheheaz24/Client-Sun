/**
 * Created by Nofear on 3/19/2019.
 */

(function () {
    var ChargeBankCommand;

    ChargeBankCommand = (function () {
        function ChargeBankCommand() {
        }

        ChargeBankCommand.prototype.execute = function (controller) {
            var url = 'api/charge/getInfor?amount=' +controller.amount+"&chargeType=bank&subType="+controller.bankCode;

            cc.PopupController.getInstance().showBusy();

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.PORTAL, url, function (response) {
                var obj = JSON.parse(response);

                cc.PopupController.getInstance().hideBusy();

                if (obj.ResponseCode === 1) {
                    //========
                    return controller.onChargeBankResponse(obj);
                } else {
                    return controller.onChargeBankResponseError(obj);

                }

            });
        };

        return ChargeBankCommand;

    })();

    cc.ChargeBankCommand = ChargeBankCommand;

}).call(this);
