

(function () {
    var TXGetEventTientriCommand;

    TXGetEventTientriCommand = (function () {
        function TXGetEventTientriCommand() {
        }

        TXGetEventTientriCommand.prototype.excute = function (controller,isMonth,dateTime) {
            var url = 'api/luckydice/TienTriTaiXiu?ismonth='+isMonth+'&search='+dateTime.toISOString();
            console.log(url)
            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.TAI_XIU, url, function (response) {
                var obj = JSON.parse(response);
                return controller.onGetEventTienTriResponse(obj);
            });
        };
        
        return TXGetEventTientriCommand;

    })();

    cc.TXGetEventTientriCommand = TXGetEventTientriCommand;

}).call(this);
