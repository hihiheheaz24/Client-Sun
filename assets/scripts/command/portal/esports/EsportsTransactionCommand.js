/**
 * Created by Nofear on 2/27/2019.
 */

(function () {
    var EsportsTransactionCommand;
    EsportsTransactionCommand = (function () {
        function EsportsTransactionCommand() {
        }
        EsportsTransactionCommand.prototype.execute = function (controller) {

            var url = '';
            var params;

            if(controller.type == "Withdrawal"){
                url = 'api/livegame/Withdrawal'
            }else{
                url = 'api/livegame/Deposit'
            }
            params = JSON.stringify({
                Amount : controller.amount,
                Wallet : controller.wallet
            });
            console.log(url);
            return cc.ServerConnector.getInstance().sendRequestPOST(cc.SubdomainName.PORTAL, url, params, function (response) {
                var obj = JSON.parse(response);
                if (obj.ResponseCode === 1) {
                    return controller.onTransactionResponse(obj);
                } else {
                    return controller.onTransactionResponseError(obj);

                }
            });
        };
        return EsportsTransactionCommand;

    })();
    cc.EsportsTransactionCommand = EsportsTransactionCommand;
}).call(this);
