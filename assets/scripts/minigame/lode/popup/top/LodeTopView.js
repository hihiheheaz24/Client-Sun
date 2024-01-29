(function () {
    cc.LodeTopView = cc.Class({
        "extends": cc.PopupBase,
        properties: {
            topListView: require('BaseTopListView'),
        },

        onEnable: function () {
            this.activeTab("TOP_USERS");
        },

        changeTabClicked: function (event, data) {
            if (data.toString() === this.currentTab) return;
            this.activeTab(data.toString());
        },

        activeTab(tabName) {
            switch (tabName) {
                case "TOP_USERS":
                    this.getTopSessionWinners();
                    break;
                case "LO":
                    this.getTopLoWinners();
                    break;
                case "DE":
                    this.getTopDeWinners();
                    break;
            }
            this.currentTab = tabName;
        },

        getTopSessionWinners: function () {
            let currOpenDate = new Date(cc.LodeController.getInstance().getOpenDate());
            currOpenDate.setDate(currOpenDate.getDate() - 1);
            const openDate = `${currOpenDate.getMonth() + 1}-${currOpenDate.getDate()}-${currOpenDate.getFullYear()}`;
            const url = 'api/Xoso/GetBigWinner?openDate=' + openDate;
            const subDomain = cc.SubdomainName.LODE;
            cc.ServerConnector.getInstance().sendRequest(subDomain, url,  (response)=> {
                let obj = JSON.parse(response);
                this.onGetTopWinnerResponse(obj);
            });
        },

        getTopLoWinners: function () {
            const url = "api/Xoso/GetTopWinLoDe?Lo_De=4";
            const subDomain = cc.SubdomainName.LODE;
            cc.ServerConnector.getInstance().sendRequest(subDomain, url,  (response)=> {
                let obj = JSON.parse(response);
                this.onGetTopWinnerResponse(obj);
            });
        },

        getTopDeWinners: function () {
            const url = "api/Xoso/GetTopWinLoDe?Lo_De=1";
            const subDomain = cc.SubdomainName.LODE;
            cc.ServerConnector.getInstance().sendRequest(subDomain, url,  (response)=> {
                let obj = JSON.parse(response);
                this.onGetTopWinnerResponse(obj);
            });
        },

        onGetTopWinnerResponse: function (response) {
            var list = response;
            //var list = slotsHistoryListData;
            try {
                this.topListView.resetList();
            } catch(e) {

            }
            if (list !== null && list.length > 0) {
                this.topListView.initialize(list);
            }
        },
    });
}).call(this);
