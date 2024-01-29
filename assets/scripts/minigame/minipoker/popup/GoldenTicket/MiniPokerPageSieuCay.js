
cc.Class({
    extends: cc.Component,

    properties: {
        BaseTopListView: require('BaseTopListView'),      
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
        //         "ticket":500,
        //         "reward":200000,
        //       },
        //       {
        //         "nickname": "test",
        //         "ticket":400,
        //         "reward":100000,
        //       },
        //       {
        //         "nickname": "test",
        //         "type":2, 
        //         "ticket":300,
        //         "reward":100000,
        //       },
        //       {
        //         "nickname": "test",
        //         "ticket":200,
        //         "reward":50000,
        //       },
        //       {
        //         "nickname": "test",
        //         "ticket":200,
        //         "reward":50000,
        //       },
        //       {
        //         "nickname": "test", 
        //         "ticket":5,
             
        //       },
        //       {
        //         "nickname": "test", 
        //         "ticket":5,
             
        //       },
        //       {
        //         "nickname": "test", 
        //         "ticket":5,
             
        //       },
        //       {
        //         "nickname": "test", 
        //         "ticket":5,
             
        //       },
        //     ]
        //   }
        var list = response.ListItem;
        //this.lbDate.string =response.date.slice(0, 10); 
       
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
        let currentDate = new Date(Date.now());
        currentDate.setDate(currentDate.getDate() + this.dayAgo);
        this.lbDate2.string = cc.Tool.getInstance().formatDate(currentDate);
        const date = currentDate.getDate() < 10 ? "0" + currentDate.getDate() : currentDate.getDate();
        const openDate = `${currentDate.getMonth() +1}-${date}-${currentDate.getFullYear()}`;
        const url = "api/Xpoker/LotteryTicketGolden/SuperPlow?openDate="+ openDate;
        const subDomain = cc.SubdomainName.MINI_POKER
        cc.ServerConnector.getInstance().sendRequest(subDomain, url,  (response)=> {
            let obj = JSON.parse(response);
            this.onGetResponse(obj);
        });   
        
    },

    hide(){
        this.dayAgo = 0;
        this.BaseTopListView.resetList();
        this.node.active = false;
    }
});
