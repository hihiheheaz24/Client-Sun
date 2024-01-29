
cc.Class({
    extends: cc.Component,

    properties: {
        BaseTopListView: require('BaseTopListView'),      
        lbDate2: cc.Label,
        lbGoldTicket: cc.Label
    },

    show(){
        this.node.active = true;
        this.getHistoryResult();
    },

    onGetResponse (response) {
        if(!cc.isValid(this.node) || !this.node.active) return;
        //cheat
        // response = {
        //    "ListTicket":[ 12345,75166,75234,12345],
        //    "WinTicket": 12345 // Giải trúng ngày hôm đó
        // }
        var list = response.ListTicket;
        this.lbGoldTicket.string = response.WinTicket ? response.WinTicket: ""
       
        if (list !== null && list.length > 0) {
            this.BaseTopListView.resetList();
            this.BaseTopListView.initialize(list);
        }
    },

    getPreviousResult () {
        this.dayAgo--;
        this.getHistoryResult();
    },
   
    getNextResult () {
        this.dayAgo++;
        this.getHistoryResult();
    },

    getHistoryResult () {
        this.BaseTopListView.resetList();
        this.lbGoldTicket.string = "";
        let currentDate = new Date(Date.now());
        currentDate.setDate(currentDate.getDate() + this.dayAgo);
        this.lbDate2.string = cc.Tool.getInstance().formatDate(currentDate);
        const date = currentDate.getDate() < 10 ? "0" + currentDate.getDate() : currentDate.getDate();
        const openDate = `${currentDate.getMonth() +1}-${date}-${currentDate.getFullYear()}`;
        const url = "api/Xpoker/LotteryTicketGolden/MyTicker?openDate="+ openDate;
        const subDomain = cc.SubdomainName.MINI_POKER
        cc.ServerConnector.getInstance().sendRequest(subDomain, url,  (response)=> {
            let obj = JSON.parse(response);
            this.onGetResponse(obj);
        });   
        
    },

    hide(){
        this.lbGoldTicket.string = "";
        this.dayAgo = 0;
        this.BaseTopListView.resetList();
        this.node.active = false;
    }
});
