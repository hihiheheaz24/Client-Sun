/**
 * Created by Nofear on 3/15/2019.
 */

(function () {
    cc.Seven77TopBigWinView = cc.Class({
        "extends": cc.Component,
        properties: {
            seven77BigWinListView: cc.Seven77TopBigWinListView,
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
            seven77GetTopCommand.execute(this, cc.BigWinnerType.BIG_WIN);
        },

        onSeven77GetTopResponse: function (response) {
            var list = response;
            cc.log("thắng lớn")
            cc.log(list)
            if (list !== null && list.length > 0) {
                this.seven77BigWinListView.resetList();
                this.seven77BigWinListView.initialize(list);
            }
        }
    });
}).call(this);
