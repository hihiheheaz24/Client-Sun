/**
 * Created by Nofear on 3/15/2019.
 */

(function () {
    cc.Seven77HistoryView = cc.Class({
        "extends": cc.Component,
        properties: {
            buttonFirst: cc.Button,
            buttonBack: cc.Button,
            listButton: [cc.Button],
            buttonLast: cc.Button,
            buttonNext: cc.Button,
            listItem: [cc.Node],
        },

        onLoad: function () {
            // this.animation = this.node.getComponent(cc.Animation),
                this.totalItemOfPage = 10;
            this.resetAllItem();
            this.totalPage = 999;
            this.currentPage = 1;
        },

        onEnable: function () {
            var self = this;
            var delay = 0.2;
            cc.director.getScheduler().schedule(function () {
                self.getHistoryList();
            }, this, 1, 0, delay, false);

            // this.animation.play('openPopup');

        },

        getHistoryList: function () {
            var seven77GetHistoryCommand = new cc.Seven77GetHistoryCommand;
            seven77GetHistoryCommand.execute(this);
        },

        onSeven77GetHistoryResponse: function (response) {

            var list = response;
            // cc.log(List)
            cc.log("data", list)
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
            if (!this.data || !this.data.length) return;
            const result = this.data.filter(item => item.Page == pageIndex);
            this.listItem.forEach((item, index) => {
                if (result[index]) {
                    console.log(item)
                    item.active = true;
                    item.getChildByName("lblSection").getComponent(cc.Label).string = result[index].SpinID;
                    let date1 = result[index].CreatedDate.slice(0, 10)
                    let date2 = result[index].CreatedDate.slice(11, 19)
                    item.getChildByName("lblTime").getComponent(cc.Label).string = date1 + " " + date2;
                    item.getChildByName("lbRoom").getComponent(cc.Label).string = result[index].BetValue;
                    item.getChildByName("lblLine").getComponent(cc.Label).string = result[index].TotalLines;
                    item.getChildByName("lblBet").getComponent(cc.Label).string = result[index].TotalBetValue;
                    let prize = result[index].PrizesData.split(";");
                    let winLineString = "";
                    for (var j = 0;j<prize.length;j++)
                    {
                        if (j === prize.length-1){
                            winLineString+= prize[j].split(",")[0];
                        }
                        else winLineString+= prize[j].split(",")[0]+",";
                    }
                    item.getChildByName("lblLineResult").getComponent(cc.Label).string = winLineString;
                    item.getChildByName("lblResult").getComponent(cc.Label).string = result[index].TotalPrizeValue;
                    this.item =result[index];
                    // item.getChildByName("lblLine").getComponent(cc.Node) = cc.Tool.getInstance().formatNumber(result[index].RoomValue);
                    // item.getChildByName("lbResult").getComponent(cc.Label).string = cc.Tool.getInstance().formatNumber(result[index].PrizeValue);
                    // item.getChildByName("lbWin").getComponent(cc.Label).string = result[index].IsJackpot ? cc.MiniPokerTopType.JACKPOT : cc.MiniPokerTopType.BIG_WIN;
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
        openDetailClicked: function (_, customEventData) {
            const currentItem = this.data.filter(item => item.Page == this.currentPage);
            cc.Seven77HistoryController.getInstance().setSessionDetailData(currentItem[Number(customEventData)]);
            cc.Seven77PopupController.getInstance().createSessionDetailView();
        },

        backClicked: function () {
            // this.animation.play('closePopup');
            var self = this;
            var delay = 0.12;
            cc.director.getScheduler().schedule(function () {
                // self.animation.stop();
                self.node.destroy();
            }, this, 1, 0, delay, false);
        },
    });
}).call(this);
