/**
 * Created by Nofear on 3/19/2019.
 */

(function () {
    var ChargeCardCommand;

    ChargeCardCommand = (function () {
        function ChargeCardCommand() {
        }

        ChargeCardCommand.prototype.execute = function (controller) {
            var url = 'api/charge/getInfor?amount='+controller.amount+"&chargeType="+controller.chargeType+"&cardCode="+controller.cardCode+"&cardSerial="+controller.cardSerial+"&subType="+controller.subType;
            cc.PopupController.getInstance().showBusy();

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.PORTAL, url, function (response) {
                var obj = JSON.parse(response);

                cc.PopupController.getInstance().hideBusy();

                if (obj.ResponseCode === 1) {
                    //========
                    return controller.onChargeCardResponse(obj);
                } else {
                    return controller.onChargeCardResponseError(obj);

                }

            });
        };

        return ChargeCardCommand;

    })();

    cc.ChargeCardCommand = ChargeCardCommand;

}).call(this);
