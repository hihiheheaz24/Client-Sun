
cc.Class({
    extends: cc.Component,

    properties: {
        buttonFirst: cc.Button,
        buttonBack: cc.Button,
        listButton: [cc.Button],
        buttonLast: cc.Button,
        buttonNext: cc.Button,
        listItem: [cc.Node],
        gameId: ""
       
    },

    onLoad(){
        this.totalItemOfPage = 10;
        this.resetAllItem();
        this.totalPage = 999;
        this.currentPage = 1;
        this.data = [];
    },

    updateDataByPageIndex(pageIndex){
        if (!this.listItem || !this.listItem.length) return cc.error('Node is destroyed');
        this.resetAllItem();
        const result = this.data.filter(item => item.Page == pageIndex);
        if(this.gameId == cc.GameId.DRAGON_TIGER){
            this.listItem.forEach((item,index)=>{
                if(result[index]){
                    item.active = true;
                    item.getChildByName("lbSession").getComponent(cc.Label).string = '#' + result[index].SessionID;
                    item.getChildByName("lbTime").getComponent(cc.Label).string = cc.Tool.getInstance().convertUTCTime(result[index].CreateTime);
                    let betSide = "";
                    switch(result[index].BetSide) {
                        case cc.DragonTigerBetSide.RONG:
                            betSide = "RỒNG";
                            break;
                        case cc.DragonTigerBetSide.HOA:
                            betSide = "HÒA";
                            break;
                        case cc.DragonTigerBetSide.HO:
                            betSide = "HỔ";
                            break;
                    }
                    item.getChildByName("lbSide").getComponent(cc.Label).string = betSide;
                    let results = "";
                    switch(result[index].Result) {
                        case cc.DragonTigerBetSide.RONG:
                            results = "RỒNG";
                            break;
                        case cc.DragonTigerBetSide.HOA:
                            results = "HÒA";
                            break;
                        case cc.DragonTigerBetSide.HO:
                            results = "HỔ";
                            break;
                        default:
                            results = "";
                            break;
                    }
                    item.getChildByName("lbTotalBet").getComponent(cc.Label).string = cc.Tool.getInstance().formatNumber(result[index].Bet);
                    item.getChildByName("lbResult").getComponent(cc.Label).string = results;
                    item.getChildByName("lbWin").getComponent(cc.Label).string = cc.Tool.getInstance().formatNumber(result[index].Award);
                } else {
                    item.active = false;
                }
            });
            return;
        }

        if(this.gameId == cc.GameId.BACCARAT){
            this.listItem.forEach((item,index)=>{
                if(result[index]){
                    item.active = true;
                    item.getChildByName("lbSession").getComponent(cc.Label).string = '#' + result[index].SessionID;
                    item.getChildByName("lbTime").getComponent(cc.Label).string = cc.Tool.getInstance().convertUTCTime(result[index].CreateTime);
                    let betSide = "";
                    switch (parseInt(result[index].BetGateID)) {
                        case cc.BacaratBetSite.PLAYER_PAIR:
                            betSide = "P.Pair";
                            break;
                        case cc.BacaratBetSite.PLAYER:
                            betSide = "Player";
                            break;
                        case cc.BacaratBetSite.TIE:
                            betSide = "Tie";
                            break;
                        case cc.BacaratBetSite.BANKER:
                            betSide = "Banker";
                            break;
                        case cc.BacaratBetSite.BANKER_PAIR:
                            betSide = "B.Pair";
                            break;
                    }

                    item.getChildByName("lbSide").getComponent(cc.Label).string = betSide;
                   
                   
                    let results = [];
                    if (result[index].GateData === '') {
                        item.getChildByName("lbResult").getComponent(cc.Label).string = '';
                    } else {
                        let lstGateData = result[index].GateData.split(',');
                        lstGateData.map(gateData => {
                            switch (parseInt(gateData)) {
                                case cc.BacaratBetSite.PLAYER_PAIR:
                                    results.push("P.Pair");
                                    break;
                                case cc.BacaratBetSite.PLAYER:
                                    results.push("Player");
                                    break;
                                case cc.BacaratBetSite.TIE:
                                    results.push("Tie");
                                    break;
                                case cc.BacaratBetSite.BANKER:
                                    results.push("Banker");
                                    break;
                                case cc.BacaratBetSite.BANKER_PAIR:
                                    results.push("B.Pair");
                                    break;
                            }
                        });
                        let strResult = "";
                        if(results.length > 1) {
                            strResult = results.join(', ');
                        }  else {
                            strResult = results[0];
                        }
                        item.getChildByName("lbResult").getComponent(cc.Label).string = strResult;
                    }
                    item.getChildByName("lbTotalBet").getComponent(cc.Label).string = cc.Tool.getInstance().formatNumber(result[index].Bet);
                  
                    item.getChildByName("lbWin").getComponent(cc.Label).string = cc.Tool.getInstance().formatNumber(result[index].Award);
                } else {
                    item.active = false;
                }
            });
            return;
        }

        if (this.gameId == cc.GameId.XOC_XOC) {
            this.listItem.forEach((item,index)=>{
                if(result[index]) {
                    item.active = true;
                    this.updateXXHistoryItem(item, result[index]);
                } else {
                    item.active = false;
                }
            });
            return;
        }


        if (this.gameId == cc.GameId.MINI_POKER) {
            this.sfCards = cc.MPSpinController.getInstance().getSFCards();
            this.listItem.forEach((item,index)=>{
                if(result[index]) {
                    item.active = true;
                    this.updateMiniPokerHistoryItem(item, result[index]);
                } else {
                    item.active = false;
                }
            });
            return;
        }

        this.listItem.forEach((item,index)=>{
            if(result[index]){
                item.active = true;
                let roomMapping = [0, 100,1000,5000,10000];
                item.getChildByName("lbSession").getComponent(cc.Label).string = result[index].SpinID;
                let date1 = result[index].CreatedDate.slice(0,10)
                let date2 = result[index].CreatedDate.slice(11,19)
                item.getChildByName("lbTime").getComponent(cc.Label).string = date1 + " " + date2;
                item.getChildByName("lbRoom").getComponent(cc.Label).string = cc.Tool.getInstance().formatNumber(roomMapping[result[index].RoomID]);
                item.getChildByName("lbTotalBet").getComponent(cc.Label).string = cc.Tool.getInstance().formatNumber(result[index].TotalBetValue);
                item.getChildByName("lbResult").getComponent(cc.Label).string = result[index].LineNum != undefined ?  result[index].LineNum + ' dòng': '0 dòng';
                item.getChildByName("lbWin").getComponent(cc.Label).string = cc.Tool.getInstance().formatNumber(result[index].TotalPrizeValue); 
            } else {
                item.active = false;
            }
        });

    },

    
    updateMiniPokerHistoryItem(item, data) {
        const propertyMapping = {
            'co': '♥',
            'bich': '♠',
            'do': '♦',
            'tep': '♣',
            '1': 'A',
            '11': 'J',
            '12': 'Q',
            '13': 'K',
        }
        let date1 = data.CreatedDate.slice(0, 10)
        let date2 = data.CreatedDate.slice(11, 19)
        item.getChildByName("lbSession").getComponent(cc.Label).string = data.SpinID;
        item.getChildByName("lbTime").getComponent(cc.Label).string =" " + date1 + " " + date2 + " ";
        item.getChildByName("lbTotalBet").getComponent(cc.Label).string = cc.Tool.getInstance().formatNumber(data.TotalBetValue);
        item.getChildByName("lbWin").getComponent(cc.Label).string = cc.Tool.getInstance().formatNumber(data.TotalPrizeValue);
        const listDataStr = data.SlotsData.split(';');
        const listData = [];
        listDataStr.forEach(function (dataSlot) {
            listData.push(dataSlot.split(','));
        });
        const names = [];
        for (let i = 0; i < 5; i++) {
            const index = parseInt(listData[0][i]) - 1;
            const cardName = this.sfCards[index].name;
            const number = cardName.replace(/[^\d]/g, "");
            const property = cardName.replace(/[^a-zA-Z]/g, "");

            names.push(`${propertyMapping[number] || number}${propertyMapping[property]}`);
        }
        const combinedNames = names.join(" ");
        item.getChildByName("lbResult").getComponent(cc.Label).string = combinedNames
    },

    updateXXHistoryItem(item, data) {
        item.getChildByName("lbSession").getComponent(cc.Label).string = '#' + data.SessionID;
        item.getChildByName("lbTime").getComponent(cc.Label).string = cc.Tool.getInstance().convertUTCTime(data.CreateTime);

        let betSide = "";
        switch (parseInt(data.GateID)) {
            case cc.XXGate.ODD:
                betSide = "LẺ";
                break;
            case cc.XXGate.THREE_UP:
                betSide = "LẺ (3 ĐEN)";
                break;
            case cc.XXGate.THREE_DOWN:
                betSide = "LẺ (3 TRẮNG)";
                break;
            case cc.XXGate.EVEN:
                betSide = "CHẴN";
                break;
            case cc.XXGate.FOUR_UP:
                betSide = "CHẴN (4 ĐEN)";
                break;
            case cc.XXGate.FOUR_DOWN:
                betSide = "CHẴN (4 TRẮNG)";
                break;
        }
        item.getChildByName("lbSide").getComponent(cc.Label).string = betSide;

        let result = "";
        let gateData = data.GatesData;
        if (gateData) {
            let listGate = gateData.split(',');
            let mainGate = (listGate.includes(cc.XXGate.ODD + "")) ? "LẺ" : "CHẴN";
            if (listGate.length == 1) {
                result = "CHẮN (2 ĐEN, 2 TRẮNG)";
            } else {
                listGate.map(gate => {
                    let strGate = "";
                    switch (parseInt(gate)) {
                        case cc.XXGate.THREE_UP:
                            strGate = " (3 ĐEN)";
                            break;
                        case cc.XXGate.THREE_DOWN:
                            strGate = " (3 TRẮNG)";
                            break;
                        case cc.XXGate.FOUR_UP:
                            strGate = " (4 ĐEN)";
                            break;
                        case cc.XXGate.FOUR_DOWN:
                            strGate = " (4 TRẮNG)";
                            break;
                    }
                    mainGate+=strGate;
                });
                result += mainGate;
            }
        }
        item.getChildByName("lbResult").getComponent(cc.Label).string = result;
        item.getChildByName("lbTotalBet").getComponent(cc.Label).string = cc.Tool.getInstance().formatNumber(data.Bet);
        item.getChildByName("lbWin").getComponent(cc.Label).string = cc.Tool.getInstance().formatNumber(data.Award);
    },

    updateUIButton(pageIndex){
        let buttonActive = 3;
        let numberFrom = pageIndex - 2;

        this.buttonFirst.interactable = true;
        this.buttonBack.interactable = true;

        this.buttonLast.interactable = true;
        this.buttonNext.interactable = true;

        if(pageIndex == 1){
            this.buttonFirst.interactable = false;
            this.buttonBack.interactable = false;
            buttonActive = 1;
            numberFrom = 1;
        }

        if(pageIndex == 2){
            buttonActive = 2
            numberFrom = 1;
        }

        if(pageIndex == this.totalPage){
            this.buttonLast.interactable = false;
            this.buttonNext.interactable = false;
            buttonActive = 5;
            numberFrom = this.totalPage - 4;
        }

        if(pageIndex == this.totalPage - 1){
            buttonActive = 4;
            numberFrom = this.totalPage - 4;
        }
        let color = cc.Color.WHITE;
        let colorActive = new cc.Color(148,19,132) //"#941384"
        let colorNormal = new cc.Color(103,7,91) //"#67075B"
        this.listButton.forEach((button,index)=>{
            if(index == buttonActive - 1){
                button.normalColor  = colorActive
                button.interactable = true;

            } else {
                button.normalColor = colorNormal
                button.interactable = true;

            }
            button.node.getChildByName("Label").getComponent(cc.Label).string = numberFrom + index
            if (numberFrom+index<=0) {
                button.node.active = false;
            }
        });
    },



    clickButtonFirstPage(){
        this.currentPage = 1;
        this.updateUIButton(this.currentPage);
        this.updateDataByPageIndex(this.currentPage);

    },

    clickButtonLastPage(){
        this.currentPage = this.totalPage;
        this.updateUIButton(this.currentPage);
        this.updateDataByPageIndex(this.currentPage);

    },

    clickButtonBackPage(){
        if(this.currentPage == 1) return; 
        this.currentPage--;
        this.updateUIButton(this.currentPage);
        this.updateDataByPageIndex(this.currentPage);
    },
    
    clickButtonNextPage(){
        if(this.currentPage == this.totalPage) return; 
        this.currentPage++;
        this.updateUIButton(this.currentPage);
        this.updateDataByPageIndex(this.currentPage);
    },

    clickButtonPage(event, index){
        let pageString = this.listButton[parseInt(index)].node.getChildByName("Label").getComponent(cc.Label).string;
        this.currentPage = parseInt(pageString)
        this.updateUIButton(this.currentPage);
        this.updateDataByPageIndex(this.currentPage);
    },

    resetAllItem(){
        this.listItem.forEach(item=>{
            item.active = false;
        });
    },

    onEnable () {
        this.node.active = true;
        var gameId = cc.RoomController.getInstance().getGameId();
        if(!this.gameId) {
            this.gameId = gameId;
        }
    
        let getHistoryCommand  = null;
        switch (this.gameId) {
            case cc.GameId.THREE_KINGDOM:
                getHistoryCommand = new cc.GetTKHistoryCommand;
                getHistoryCommand.execute(this);
                break;
            case cc.GameId.THUY_CUNG:
                getHistoryCommand = new cc.GetThuyCungHistoryCommand;
                getHistoryCommand.execute(this);
                break;
            case cc.GameId.COWBOY:
                getHistoryCommand = new cc.GetCowboyHistoryCommand;
                getHistoryCommand.execute(this);
                break;
            case cc.GameId.EGYPT:
                getHistoryCommand = new cc.GetEgyptHistoryCommand;
                getHistoryCommand.execute(this);
                break;
            case cc.GameId.DRAGON_TIGER:
                getHistoryCommand = new cc.DragonTigerGetHistoryCommand;
                getHistoryCommand.execute(this);
                break;
            case cc.GameId.BACCARAT:
                getHistoryCommand = new cc.BacaratHistoryCommand;
                getHistoryCommand.execute(this);
                break;
            case cc.GameId.XOC_XOC:
                getHistoryCommand = new cc.XXGetHistoryCommand;
                getHistoryCommand.execute(this);
                break;
            case cc.GameId.MINI_POKER:
                getHistoryCommand = new cc.MPGetHistoryCommand;
                getHistoryCommand.execute(this);
                break;
                
        }

        this.buttonFirst.interactable = false;
        this.buttonBack.interactable = false;
        this.buttonLast.interactable = false;
        this.buttonNext.interactable = false;
        this.listButton.forEach((button)=>{
            button.interactable = false;
        });
    },

    onGetSlotsHistoryResponse (response) {
        if (response !== null && response.length > 0) {
            response.forEach((item, index) =>{
                item['Page'] = Math.floor(index/this.totalItemOfPage) + 1;   
            })
        //    cc.warn("onGetSlotsHistoryResponse", response)
            var totalPages = Math.ceil(response.length / this.totalItemOfPage); // Tính tổng số trang
            this.totalPage = totalPages;
            this.data = response;
            this.updateUIButton(this.currentPage);
            this.updateDataByPageIndex(this.currentPage);
        }
       
    },

    onGetHistoryResponse(response) {
        if (response !== null && response.length > 0) {
            if (this.gameId == cc.GameId.XOC_XOC) {
                response = response.filter(item => item.GatesData != "");
            }
            response.forEach((item, index) =>{
                item['Page'] = Math.floor(index/this.totalItemOfPage) + 1;   
            })
            this.data = response;
            var totalPages = Math.ceil(response.length / this.totalItemOfPage); // Tính tổng số trang
            this.totalPage = totalPages;
            this.updateUIButton(this.currentPage);
            this.updateDataByPageIndex(this.currentPage);
        }
       
    },

    closeClicked () {
        this.node.destroy();
    },


});
