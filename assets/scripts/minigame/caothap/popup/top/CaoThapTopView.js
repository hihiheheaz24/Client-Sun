/**
 * Created by Nofear on 3/15/2019.
 */
(function () {
    cc.CaoThapTopView = cc.Class({
        "extends": cc.PopupBase,
        properties: {
            buttonFirst: cc.Button,
            buttonBack: cc.Button,
            listButton: [cc.Button],
            buttonLast: cc.Button,
            buttonNext: cc.Button,
            listItem: [cc.Node],
        },

        onLoad: function () {
            this.animation = this.node.getComponent(cc.Animation);
            this.node.zIndex = cc.NoteDepth.POPUP_TAIXIU;
            this.totalItemOfPage = 10;
            this.resetAllItem();
            this.totalPage;
            this.currentPage = 1;
        },

        onEnable: function () {
            var self = this;
            var delay = 0.2;
            cc.director.getScheduler().schedule(function () {
                self.getHistory();
            }, this, 1, 0, delay, false);
        },

        getHistory: function () {
            var caoThapGetTopCommand = new cc.CaoThapGetTopCommand;
            caoThapGetTopCommand.execute(this);
        },

        onCaoThapGetTopResponse: function (response) {
            var list = response.Data;
            if (list !== null && list.length > 0) {
                list.forEach((item, index) => {
                    item['Page'] = Math.floor(index / this.totalItemOfPage) + 1;
                });
                this.data = list;
                var totalPages = Math.ceil(list.length / this.totalItemOfPage); // Tính tổng số trang
                this.totalPage = totalPages;
                this.updateUIButton(this.currentPage);
                this.updateDataByPageIndex(this.currentPage);
            }
        },


        resetAllItem() {
            this.listItem.forEach(item => {
                item.active = false;
            });
        },
        updateDataByPageIndex(pageIndex) {
            this.resetAllItem();
            const result = this.data.filter(item => item.Page == pageIndex);
            this.listItem.forEach((item, index) => {
                if (result[index]) {
                    // {
                    //     "SessionId": 509,
                    //     "Time": "2023-06-07T15:10:12.617",
                    //     "RoomID": 1,
                    //     "WinAmount": 7779,
                    //     "AccountName": "driver",
                    //     "Description": "Thắng lớn",
                    //     "Page": 1
                    // }
                    let date1 = result[index].Time.slice(0, 10)
                    let date2 = result[index].Time.slice(11, 19)
                    item.getChildByName("Time").getComponent(cc.Label).string =" " + date1 + " " + date2 + " ";
                    item.getChildByName("AccountName").getComponent(cc.Label).string = result[index].AccountName.slice(0,result[index].AccountName.length-3)+'***';
                    item.getChildByName("Room").getComponent(cc.Label).string = this.roomIDToBetAmount(result[index].RoomID);
                    item.getChildByName("WinAmount").getComponent(cc.Label).string = cc.Tool.getInstance().formatNumber(result[index].WinAmount);
                    item.getChildByName("Description").getComponent(cc.Label).string = result[index].Description;
                    item.active = true;
                } else {
                    item.active = false;
                }
            });


        },
        roomIDToBetAmount:function(roomID)
        {
            let betAmount = 0;
            switch (roomID) {
                case 1:
                    betAmount =  1000;
                    break;
                case 2:
                    betAmount =  10000;
                    break;
                case 3:
                    betAmount =  50000;
                    break;
                case 4:
                    betAmount =  100000;
                    break;
                case 5:
                    betAmount =  500000;
                    break;
            }
            return cc.Tool.getInstance().formatNumber(betAmount);
        },
        convertCardIDToString:function(cardID)
        {
            let finalString = '';
            let begin = Math.floor((cardID-1)/4);
            if (begin==9) {
                finalString+="J";
            }
            if (begin==10) {
                finalString+="Q";
            }
            if (begin==11) {
                finalString+="K";
            }
            if (begin==12) {
                finalString+="A";
            }
            if(begin<9)
                finalString+=(begin+2);
            let tail = cardID%4;
            switch (tail) {
                case 0:
                    finalString+="♠";
    
                    break;
                case 1:
                    finalString+="♣";
    
                    break;
                case 2:
                    finalString+="♦";
                    break;
                case 3:
                    finalString+="♥";
                    break;
                default:
                    break;
            }
            return finalString;
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



        clickButtonFirstPage() {
            this.currentPage = 1;
            this.updateUIButton(this.currentPage);
            this.updateDataByPageIndex(this.currentPage);

        },

        clickButtonLastPage() {
            // this.currentPage = 999;
            this.updateUIButton(this.totalPage);
            this.updateDataByPageIndex(this.totalPage);
            this.currentPage = this.totalPage;

        },

        clickButtonBackPage() {
            if (this.currentPage == 1) return;

            this.currentPage--;
            this.updateUIButton(this.currentPage);
            this.updateDataByPageIndex(this.currentPage);
        },

        clickButtonNextPage() {
            if (this.currentPage == this.totalPage) return;
            this.currentPage++;
            this.updateUIButton(this.currentPage);
            this.updateDataByPageIndex(this.currentPage);
        },

        clickButtonPage(event, index) {
            let pageString = this.listButton[parseInt(index)].node.getChildByName("Label").getComponent(cc.Label).string;
            this.currentPage = parseInt(pageString)
            this.updateUIButton(this.currentPage);
            this.updateDataByPageIndex(this.currentPage);
        },

        closeClicked: function () {
            cc.CaoThapController.getInstance().destroyTopView();
        },
    });
}).call(this);
