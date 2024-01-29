

(function () {
    var CaoThapGetTopCommand;

    CaoThapGetTopCommand = (function () {
        function CaoThapGetTopCommand() {
        }

        CaoThapGetTopCommand.prototype.execute = function (controller) {
            var url = 'api/caothap/topWin?totalRecord=50';

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.CAO_THAP, url, function (response) {
                var obj = JSON.parse(response);
                return controller.onCaoThapGetTopResponse(obj);
            });
        };

        return CaoThapGetTopCommand;

    })();

    cc.CaoThapGetTopCommand = CaoThapGetTopCommand;

}).call(this);
