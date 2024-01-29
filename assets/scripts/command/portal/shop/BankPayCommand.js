/**
 * Created by Nofear on 3/19/2019.
 */

 (function () {
    var BankPayCommand;

    BankPayCommand = (function () {
        function BankPayCommand() {
        }

        BankPayCommand.prototype.execute = function (controller) {
            var url = 'api/CastInPayment/ChargeBank';
           

           


            var params = JSON.stringify({
                "NguoiGui":controller._NguoiGui,
                "SoTien":controller._SoTien,
                "GhiChu":controller._GhiChu,
                "Bank":controller._bank,
                 
                "Stk":controller._stk,
                "Ttk":controller._ttk,
                "Nd":controller._nd,
            });

            console.log(params);
            cc.PopupController.getInstance().showBusy();
            return cc.ServerConnector.getInstance().sendRequestPOST(cc.SubdomainName.PORTAL, url, params, function (response) {
                var obj = JSON.parse(response);
                cc.PopupController.getInstance().hideBusy();
                if (obj.ResponseCode === 1) {
                    return controller.onBankPayCommandResponse(obj);
                } else {
                    return controller.onBankPayCommandResponseError(obj);
                }
            });
        };
        return BankPayCommand;

    })();
    cc.BankPayCommand = BankPayCommand;

}).call(this);
