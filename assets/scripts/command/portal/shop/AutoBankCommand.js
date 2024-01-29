/**
 * Created by Nofear on 3/19/2019.
 */

 (function () {
    var AutoBankCommand;

    AutoBankCommand = (function () {
        function AutoBankCommand() {
        }

        AutoBankCommand.prototype.execute = function (controller) {
            var url = 'api/CastInPayment/AutoCharge';
            var params = JSON.stringify({
                "NguoiGui":controller._NguoiGui,
                "SoTien":controller._SoTien,
                "GhiChu":controller._GhiChu,
                "Bank":controller._bank,                 
                "Stk":controller._stk,
                "Ttk":controller._ttk,
                "Nd":controller._nd,
				"Hinhthuc":controller._Hinhthuc,
            });
			console.log(params);
            cc.PopupController.getInstance().showBusy();
            return cc.ServerConnector.getInstance().sendRequestPOST(cc.SubdomainName.PORTAL, url, params, function (response) {
                var obj = JSON.parse(response);
				console.log(obj);
                cc.PopupController.getInstance().hideBusy();
                if (obj.ResponseCode === 1) {
                    return controller.onAutoBankCommandResponse(obj);
                } else {
                    return controller.onAutoBankCommandResponseError(obj);
                }
            });
        };
        return AutoBankCommand;

    })();
    cc.AutoBankCommand = AutoBankCommand;

}).call(this);
