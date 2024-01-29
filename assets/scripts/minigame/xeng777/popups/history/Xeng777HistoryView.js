/*
 * Generated by BeChicken
 * on 11/14/2019
 * version v1.0
 */
(function () {
    cc.Xeng777HistoryView = cc.Class({
        "extends": cc.PopupBase,
        properties: {
            historyListView: cc.Xeng777HistoryListView,
            spGateBets: [cc.SpriteFrame],
            spGateWins: [cc.SpriteFrame]
        },

        onLoad: function () {
            this.animation = this.node.getComponent(cc.Animation);
            this.node.zIndex = cc.NoteDepth.POPUP_TAIXIU;

            this.controller = cc.Xeng777Controller.getInstance();

            this.controller.setHistoryView(this);
        },

        onEnable: function () {
            var self = this;
            var delay = 0.2;
            cc.director.getScheduler().schedule(function () {
                self.getHistory();
            }, this, 1, 0, delay, false);

            this.animation.play('openPopup');
        },

        getHistory: function () {
            var getHistoryCommand = new cc.Xeng777GetHistoryCommand;
            getHistoryCommand.execute(this);
        },

        onGetHistoryResponse: function (response) {
            var list = response;
            //var list = slotsHistoryListData;
            if (list !== null && list.length > 0) {
                this.historyListView.resetList();
                this.historyListView.initialize(list);
            }
        },

        closeClicked: function () {
            this.historyListView.resetList();
            this.animation.play('closePopup');
            var self = this;
            var delay = 0.12;
            cc.director.getScheduler().schedule(function () {
                self.animation.stop();
                cc.Xeng777Controller.getInstance().destroyHistoryView();
            }, this, 1, 0, delay, false);
        },

        getSpriteGateBet: function (gateBetId) {
            return this.spGateBets[gateBetId];
        },

        getSpriteGateWin: function (gateWinId) {
            return this.spGateWins[gateWinId];
        }
    });
}).call(this);