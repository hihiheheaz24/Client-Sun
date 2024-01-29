/**
 * Created by Nofear on 3/14/2019.
 */


(function () {
    cc.Seven77TopView = cc.Class({
        "extends": cc.Component,
        properties: {
            seven77JackpotListView: cc.Seven77TopJackpotListView,
            seven77BigWinListView: cc.Seven77TopBigWinListView,
            btnJackpot: cc.Button,
            btnBigWin: cc.Button,
            nodeJackpot: cc.Node,
            nodeBigWin: cc.Node,

            seven77BigWinView: cc.Seven77TopBigWinView,
            seven77JackpotView: cc.Seven77TopJackpotView,
            buttonFirst: cc.Button,
            buttonBack: cc.Button,
            listButton: [cc.Button],
            buttonLast: cc.Button,
            buttonNext: cc.Button,
            listItem: [cc.Node],
        },

        onLoad: function () {
            // this.animation = this.node.getComponent(cc.Animation);
            this.totalItemOfPage = 10;
            this.resetAllItem();
            this.totalPage = 999;
            this.currentPage = 1;
            // this.onSeven77GetTopResponse();
            // this.onEnable();
        },
        onSeven77GetTopResponse: function (response) {
            if (!this.data) {
                this.data = response
                return
            } else {
                this.data = [...this.data, ...response]
                .sort(function(a, b) {
                        let dateA = new Date(a.CreatedDate);
                        let dateB = new Date(b.CreatedDate);
                        return dateB - dateA;
                    })
                    .splice(0, 50)
            }
            var list = this.data;
            cc.log("data", list)
            if (list !== null && list.length > 0) {
                this.data.forEach((item, index) => {
                    item['Page'] = Math.floor(index / this.totalItemOfPage) + 1;
                });
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
                    item.active = true;
                    let date1 = result[index].CreatedDate.slice(0, 10)
                    let date2 = result[index].CreatedDate.slice(11, 19)
                    item.getChildByName("lblTime").getComponent(cc.Label).string = date1 + " " + date2;
                    item.getChildByName("lblNickName").getComponent(cc.Label).string = result[index].Username.substring(5, 0)+ "***";
                    item.getChildByName("lbTotalBet").getComponent(cc.Label).string = cc.Tool.getInstance().formatNumber(result[index].RoomValue);
                    item.getChildByName("lbResult").getComponent(cc.Label).string = cc.Tool.getInstance().formatNumber(result[index].PrizeValue);
                    item.getChildByName("lbWin").getComponent(cc.Label).string = result[index].IsJackpot ? cc.MiniPokerTopType.JACKPOT : cc.MiniPokerTopType.BIG_WIN;
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
        
        getList: function () {
            var seven77GetTopCommand = new cc.Seven77GetTopCommand;
            seven77GetTopCommand.execute(this, cc.BigWinnerType.JACKPOT);
            seven77GetTopCommand.execute(this, cc.BigWinnerType.BIG_WIN);
        },

        onEnable: function () {
            var self = this;
            var delay = 0.2;
            cc.director.getScheduler().schedule(function () {
                self.getList();
            }, this, 1, 0, delay, false);
            // this.animation.play('openPopup');
            this.btnBigWin.interactable = true;
            this.btnJackpot.interactable = false;

            this.nodeJackpot.active = true;
            this.nodeBigWin.active = false;
        },

        bigWinTabClicked: function () {
            this.btnBigWin.interactable = false;
            this.btnJackpot.interactable = true;

            this.nodeJackpot.active = false;
            this.nodeBigWin.active = true;
        },

        jackpotTabClicked: function () {
            this.btnBigWin.interactable = true;
            this.btnJackpot.interactable = false;

            this.nodeJackpot.active = true;
            this.nodeBigWin.active = false;
        },

        backClicked: function () {
            this.seven77BigWinView.seven77BigWinListView.resetList();
            this.seven77JackpotView.seven77JackpotListView.resetList();
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
