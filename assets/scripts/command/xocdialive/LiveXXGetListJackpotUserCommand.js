/*
 * Generated by BeChicken
 * on 10/30/2019
 * version v1.0
 */
(function () {
    var LiveXXGetListJackpotUserCommand;

    LiveXXGetListJackpotUserCommand = (function () {
        function LiveXXGetListJackpotUserCommand() {
        }

        LiveXXGetListJackpotUserCommand.prototype.execute = function (controller,sessionID) {
            var url = 'api/xocdialive/GetHistoryJackpotBySession?sessionId='+sessionID;

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.XOC_DIA_LIVE, url, function (response) {
                var obj = JSON.parse(response);
                return controller.onLiveXXGetListJackpotUserResponse(obj);
            });
        };

        return LiveXXGetListJackpotUserCommand;

    })();

    cc.LiveXXGetListJackpotUserCommand = LiveXXGetListJackpotUserCommand;

}).call(this);