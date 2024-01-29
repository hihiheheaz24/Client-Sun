/**
 * Created by Nofear on 3/19/2019.
 */

(function () {
    var CancelCashoutCommand;

    CancelCashoutCommand = (function () {
        function CancelCashoutCommand() {
        }

        CancelCashoutCommand.prototype.execute = function (controller) {
            var url = 'api/CancelCastOut/CancelRequest?id='+controller.cashoutId+'&type='+controller.cashoutType;
            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.PORTAL, url, function (response) {
                var obj = JSON.parse(response);
                if (obj.ResponseCode==1) {
                    return controller.onCancelCashoutSuccess(obj);
                } else {
                    return controller.onCancelCashoutError(obj);
                }
            });
        };

        return CancelCashoutCommand;

    })();

    cc.CancelCashoutCommand = CancelCashoutCommand;

}).call(this);
