/**
 * Created by Nofear on 3/15/2019.
 */
//var miniPokerHistoryData = require('MiniPokerHistoryData');



(function () {
    cc.MiniPokerHistoryView = cc.Class({
        "extends": cc.PopupBase,
        properties: {
            miniPokerHistoryListView: cc.MiniPokerHistoryListView,
            buttonFirst: cc.Button,
            buttonBack: cc.Button,
            listButton: [cc.Button],
            buttonLast: cc.Button,
            buttonNext: cc.Button,
            listItem: [cc.Node],
        },

        onLoad: function () {
            this.sfCards = cc.MPSpinController.getInstance().getSFCards();
            this.animation = this.node.getComponent(cc.Animation);
            this.node.zIndex = cc.NoteDepth.POPUP_TAIXIU;
            this.totalItemOfPage = 10;
            this.resetAllItem();
            this.totalPage = 0;
            this.currentPage = 1;
        },

        onEnable: function () {
            var self = this;
            var delay = 0.2;
            cc.director.getScheduler().schedule(function () {
                self.getHistory();
            }, this, 1, 0, delay, false);

            this.animation.play('openPopup');
        },

        getHistory: function () {
            var mpGetHistoryCommand = new cc.MPGetHistoryCommand;
            mpGetHistoryCommand.execute(this);
        },

        onMPGetHistoryResponse: function (response) {
            var list = response;
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
            
            const result = this.data.filter(item => item.Page == pageIndex);
            this.listItem.forEach((item, index) => {
                if (result[index]) {
                    item.active = true;
                    let date1 = result[index].CreatedDate.slice(0, 10)
                    let date2 = result[index].CreatedDate.slice(11, 19)
                    item.getChildByName("lbSession").getComponent(cc.Label).string = result[index].SpinID;
                    item.getChildByName("lbTime").getComponent(cc.Label).string =" " + date1 + " " + date2 + " ";
                    item.getChildByName("lbTotalBet").getComponent(cc.Label).string = cc.Tool.getInstance().formatNumber(result[index].TotalBetValue);
                    // item.getChildByName("lbResult").getComponent(cc.Label).string = result[index].SlotsData.replace(/,/g, '  ');
                    item.getChildByName("lbWin").getComponent(cc.Label).string = cc.Tool.getInstance().formatNumber(result[index].TotalPrizeValue);

                    const listDataStr = result[index].SlotsData.split(';');
                    const listData = [];
                    listDataStr.forEach(function (data) {
                        listData.push(data.split(','));
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

                } else {
                    item.active = false;
                }
            });


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
            console.log(this.totalPage)
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
            // this.miniPokerHistoryListView.resetList();
            this.animation.play('closePopup');
            var self = this;
            var delay = 0.12;
            cc.director.getScheduler().schedule(function () {
                self.animation.stop();
                cc.MiniPokerController.getInstance().destroyHistoryView();
            }, this, 1, 0, delay, false);
        },
    });
}).call(this);
