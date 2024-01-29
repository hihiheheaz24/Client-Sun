/**
 * Created by Nofear on 2/27/2019.
 */

(function () {
    var GetVersionCommand;

    GetVersionCommand = (function () {
        function GetVersionCommand() {
        }

        GetVersionCommand.prototype.execute = function (controller) {
            var url = 'api/configs/getversion';

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.PORTAL, url, function (response) {
                var obj = JSON.parse(response);
                if (obj.version) {
                    return controller.onGetVersionResponse(obj);
                } else {
                    return controller.onGetVersionResponse(null);
                }
            });
        };

        return GetVersionCommand;

    })();

    cc.GetVersionCommand = GetVersionCommand;

}).call(this);
