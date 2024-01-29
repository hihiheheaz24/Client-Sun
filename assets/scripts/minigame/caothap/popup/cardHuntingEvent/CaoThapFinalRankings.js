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
        this.monthAgo--;
        this.getHistoryResult();
    },

    getNextResult() {
        if (this.monthAgo === 0) return;
        this.monthAgo++;
        this.getHistoryResult();
    },

    getHistoryResult() {
        this.BaseTopListView.resetList();
        const currentDay = new Date(Date.now());
        currentDay.setMonth(currentDay.getMonth() + this.monthAgo);
        const currentMonth = currentDay.getMonth() + 1;
        const currentYear = currentDay.getFullYear();
        this.lbDate2.string = `${currentMonth}/${currentYear}`;

        const url = "api/caothap/Minigame/RankingAll?openDate=" + currentMonth;
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
        this.monthAgo = 0;
        this.BaseTopListView.resetList();
        this.node.active = false;
    },
});
