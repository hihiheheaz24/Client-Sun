/**
 * Created by Nofear on 2/27/2019.
 */

(function () {
    var LuckyDiceRewardCommand;

    LuckyDiceRewardCommand = (function () {
        function LuckyDiceRewardCommand() {
        }

        LuckyDiceRewardCommand.prototype.execute = function (controller,subName) {
            var url = 'api/LuckyDice/RewardBoxDetails';

            return cc.ServerConnector.getInstance().sendRequest(subName, url, function (response) {
                var obj = JSON.parse(response);

                return controller.onLuckyDiceNegotiateResponse(obj);

            }, true);
        };

        return LuckyDiceRewardCommand;

    })();

    cc.LuckyDiceRewardCommand = LuckyDiceRewardCommand;

}).call(this);
