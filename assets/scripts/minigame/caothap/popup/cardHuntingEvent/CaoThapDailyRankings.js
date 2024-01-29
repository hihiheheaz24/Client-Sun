cc.Class({
    extends: cc.Component,

    properties: {
        BaseTopListView: require("BaseTopListView"),
        lbDate2: cc.Label,
    },

    show() {
        this.node.active = true;
        this.getHistoryResult();
    },

    onGetResponse(response) {
        if (!cc.isValid(this.node) || !this.node.active) return;
        var list = [...response];

        if (list !== null && list.length > 0) {
            this.BaseTopListView.resetList();
            this.BaseTopListView.initialize(list);
        }
    },

    getPreviousResult() {
        this.dayAgo--;
        this.getHistoryResult();
    },

    getNextResult() {
        if (this.dayAgo === 0) return;
        this.dayAgo++;
        this.getHistoryResult();
    },

    getHistoryResult() {
        this.BaseTopListView.resetList();
        let currentDate = new Date(Date.now());
        currentDate.setDate(currentDate.getDate() + this.dayAgo);
        this.lbDate2.string = cc.Tool.getInstance().formatDate(currentDate);
        const date = currentDate.getDate() < 10 ? "0" + currentDate.getDate() : currentDate.getDate();
        const openDate = `${currentDate.getMonth() + 1}-${date}-${currentDate.getFullYear()}`;
        const url = "api/caothap/Minigame/RankingDay?openDate=" + openDate;
        const subDomain = cc.SubdomainName.CAO_THAP;
        cc.ServerConnector.getInstance().sendRequest(subDomain, url,  (response)=> {
            let obj = JSON.parse(response);
            this.onGetResponse(obj);
        });
        // test
        // this.scheduleOnce(() => {
        //     this.onGetResponse();
        // }, 0.5);
    },

    hide() {
        this.dayAgo = 0;
        this.BaseTopListView.resetList();
        this.node.active = false;
    },
});
