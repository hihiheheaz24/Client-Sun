(function () {
    cc.LodeHistoryView = cc.Class({
        "extends": cc.PopupBase,
        properties: {
            historyListView: cc.LodeHistoryListView,
        },

        onEnable: function () {
            var self = this;
            var delay = 0.2;
            cc.director.getScheduler().schedule(function () {
                self.getHistory();
            }, this, 1, 0, delay, false);

        },

        getHistory: function () {
            var getHistoryCommand = new cc.LodeHistoryCommand;
            getHistoryCommand.execute(this);
        },

        onGetHistoryResponse: function (response) {
            var list = response;
            //var list = slotsHistoryListData;
            try {
                this.historyListView.resetList();
            }catch(e) {

            }
            if (list !== null && list.length > 0) {
                this.historyListView.initialize(list);
            }
        },

        onGetHistory() {
            this.historyListView.resetList();
        },
    });
}).call(this);
