
cc.Class({
        "extends": cc.Component,
        properties: {
            BaseTopListView: require('BaseTopListView'),
            url:"api/XocDiaLive/GetBigWinner",
            subDomain: "xocdialive.",

        },

        onLoad: function () {
            this.node.zIndex = cc.NoteDepth.POPUP_PORTAL;
        },

        onEnable: function () {
            this.getTopSessionWinners();
        },

        getTopSessionWinners: function () {
            var self = this;
            cc.ServerConnector.getInstance().sendRequest(this.subDomain, this.url, function (response) {
                var obj = JSON.parse(response);
                self.onGetBigWinnerResponse(obj);
            });
        },

        onGetBigWinnerResponse: function (response) {
            if(!cc.isValid(this.node)) return;
            var list = response;
            if (list !== null && list.length > 0) {
                this.BaseTopListView.resetList();
                this.BaseTopListView.initialize(list);
            }
        },

        closeClicked: function () {
            this.BaseTopListView.resetList();
            this.node.destroy();
        }
})
