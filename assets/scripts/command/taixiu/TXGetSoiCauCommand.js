

(function () {
    var TXGetSoiCauCommand;

    TXGetSoiCauCommand = (function () {
        function TXGetSoiCauCommand() {
        }

        TXGetSoiCauCommand.prototype.execute = function (controller) {
            var url = 'api/luckydice/GetSoiCau';

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.TAI_XIU, url, function (response) {
                var obj = JSON.parse(response);
                return controller.onTXGetSoiCauResponse(obj);
            });
        };

        return TXGetSoiCauCommand;

    })();

    cc.TXGetSoiCauCommand = TXGetSoiCauCommand;

}).call(this);
