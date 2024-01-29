/**
 * Created by Nofear on 3/15/2019.
 */

(function () {
    cc.Xeng777TopView = cc.Class({
        "extends": cc.PopupBase,
        properties: {
            xeng777TopListView: cc.Xeng777TopListView,
        },

        onLoad: function () {
            this.animation = this.node.getComponent(cc.Animation);
            this.node.zIndex = cc.NoteDepth.POPUP_SICBO;
        },

        onEnable: function () {
            var self = this;
            var delay = 0.2;
            cc.director.getScheduler().schedule(function () {
                self.getTopSessionWinners();
            }, this, 1, 0, delay, false);

            this.animation.play('openPopup');
        },

        getTopSessionWinners: function () {
            var xeng777GetBigWinnersCommand = new cc.Xeng777GetBigWinnersCommand;
            xeng777GetBigWinnersCommand.execute(this);
        },

        onGetBigWinnersResponse: function (response) {
            var list = response;
            //var list = slotsHistoryListData;
            if (list !== null && list.length > 0) {
                this.xeng777TopListView.resetList();
                this.xeng777TopListView.initialize(list);
            }
        },

        closeClicked: function () {
            this.xeng777TopListView.resetList();
            this.animation.play('closePopup');
            var self = this;
            var delay = 0.12;
            cc.director.getScheduler().schedule(function () {
                self.animation.stop();
                cc.Xeng777Controller.getInstance().destroyTopView();
            }, this, 1, 0, delay, false);
        },
    });
}).call(this);
