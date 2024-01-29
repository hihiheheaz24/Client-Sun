/**
 * Created by Nofear on 3/15/2019.
 */

(function () {
    cc.Seven77TopJackpotView = cc.Class({
        "extends": cc.Component,
        properties: {
            seven77JackpotListView: cc.Seven77TopJackpotListView,
            buttonFirst: cc.Button,
            buttonBack: cc.Button,
            listButton: [cc.Button],
            buttonLast: cc.Button,
            buttonNext: cc.Button,
            listItem: [cc.Node],
        },

        onEnable: function () {
            var self = this;
            var delay = 0.2;
            cc.director.getScheduler().schedule(function () {
                self.getList();
            }, this, 1, 0, delay, false);
        },

        getList: function () {
            var seven77GetTopCommand = new cc.Seven77GetTopCommand;
            seven77GetTopCommand.execute(this, cc.BigWinnerType.JACKPOT);
        },

        onSeven77GetTopResponse: function (response) {
            // var list = response;
            // cc.log("nổ hũ")
            // if (list !== null && list.length > 0) {
            //     this.seven77JackpotListView.resetList();
            //     this.seven77JackpotListView.initialize(list);
            // }
        }
    });
}).call(this);
