
cc.Class({
    extends: cc.Component,

    properties: {
        BaseTopListView: require('BaseTopListView'),
        lbGoldTicket: cc.Label,
        lbDate: cc.Label,
        lbDate2: cc.Label
    },

    show(){
        this.node.active = true;
        this.getHistoryResult();
    },

    onGetResponse (response) {
        if(!cc.isValid(this.node) || !this.node.active) return;
        //cheat
        // response = {
        //     "listItem":[
        //       {
        //         "nickname": "test",
        //         "type":1, 
        //         "ticket":12345,
        //         "reward":2000000,
        //       },
        //       {
        //         "nickname": "test",
        //         "type":1, 
        //         "ticket":12345,
        //         "reward":1000000,
        //       },
        //       {
        //         "nickname": "test",
        //         "type":2, 
        //         "ticket":12345,
        //         "reward":500000,
        //       },
        //       {
        //         "nickname": "test",
        //         "type":2, 
        //         "ticket":12345,
        //         "reward":500000,
        //       },
        //       {
        //         "nickname": "test",
        //         "type":2, 
        //         "ticket":12345,
        //         "reward":50000,
        //       },
        //       {
        //         "nickname": "test",
        //         "type":2, 
        //         "ticket":12345,
        //         "reward":50000,
        //       },
        //       {
        //         "nickname": "test",
        //         "type":2, 
        //         "ticket":12345,
        //         "reward":50000,
        //       },
        //       {
        //         "nickname": "test",
        //         "type":2, 
        //         "ticket":12345,
        //         "reward":50000,
        //       },
        //       {
        //         "nickname": "test",
        //         "type":2, 
        //         "ticket":12345,
        //         "reward":50000,
        //       },
        //       {
        //         "nickname": "test",
        //         "type":2, 
        //         "ticket":12345,
        //         "reward":50000,
        //       },
        //     ],
        //     "date": "2023-10-17T15:19:20.02", //ngày trúng giải
        //     "winTicket": 12345 // Giải trúng ngày hôm đó
        //   }
        var list = response.ListItem;
        //this.lbDate.string =response.date.slice(0, 10); 
        this.lbGoldTicket.string = response.WinTicket ? response.WinTicket: "Chưa có kết quả"
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
        this.lbDate.string = ""; 
        let currentDate = new Date(Date.now());
        currentDate.setDate(currentDate.getDate() + this.dayAgo);
        this.lbDate.string = cc.Tool.getInstance().formatDate(currentDate);
        this.lbDate2.string = cc.Tool.getInstance().formatDate(currentDate);
        const date = currentDate.getDate() < 10 ? "0" + currentDate.getDate() : currentDate.getDate();
        const openDate = `${currentDate.getMonth() +1}-${date}-${currentDate.getFullYear()}`;
        const url = "Api/Xpoker/LotteryTicketGolden/TicketGolden?openDate="+ openDate;
        const subDomain = cc.SubdomainName.MINI_POKER
        cc.ServerConnector.getInstance().sendRequest(subDomain, url,  (response)=> {
            let obj = JSON.parse(response);
            this.onGetResponse(obj);
        });   
        
    },

    hide(){
        this.dayAgo = 0;
        this.lbDate.string = ""; 
        this.lbGoldTicket.string = "";
        this.BaseTopListView.resetList();
        this.node.active = false;
    }
});
