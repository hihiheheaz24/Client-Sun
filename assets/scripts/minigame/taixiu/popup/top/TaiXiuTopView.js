/**
 * Created by Nofear on 3/15/2019.
 */

(function () {
    cc.TaiXiuTopView = cc.Class({
        "extends": cc.PopupBase,
        properties: {
            taiXiuTopListView: cc.TaiXiuTopListView,
            btnTabLasvegas:cc.Button,
            btnTabHongKong:cc.Button,
            btnTabMacau:cc.Button
        },

        onLoad: function () {
            this.animation = this.node.getComponent(cc.Animation);
            this.node.zIndex = cc.NoteDepth.POPUP_TAIXIU;
        },

        onEnable: function () {
            this.lasvegasTop = [];
            this.hongkongTop = [];
            this.macauTop = [];
            this.currentTableIndex = cc.LocalStorage.getInstance().getData("mainTXTable","0");
            switch (this.currentTableIndex) {
                case "0":
                    this.currentBtn = this.btnTabLasvegas;
                    break;
                case "1":
                    this.currentBtn = this.btnTabHongKong;
                    break;
                case "2":
                    this.currentBtn = this.btnTabMacau;
                    break;
                default:
                    this.currentBtn = this.btnTabLasvegas;
                    break;
            }
            this.currentBtn.interactable = false;
            this.getTopSessionWinners("0");
            this.getTopSessionWinners("1");
            this.getTopSessionWinners("2");

        },
        changeTabClicked:function(event, index)
        {
            this.taiXiuTopListView.resetList();
            this.currentBtn.interactable = true;
            switch (index) {
                case "0":
                    this.currentBtn = this.btnTabLasvegas;
                    break;
                case "1":
                    this.currentBtn = this.btnTabHongKong;
                    break;
                case "2":
                    this.currentBtn = this.btnTabMacau;
                    break;
                default:
                    this.currentBtn = this.btnTabLasvegas;
                    break;
            }
            this.currentBtn.interactable = false;
            this.renderTop(index);
        },

        getTopSessionWinners: function (index) {
            cc.PopupController.getInstance().showBusy();
            var txGetBigWinnersCommand = new cc.TXGetBigWinnersCommand;
            txGetBigWinnersCommand.execute(this,index);
        },

        onTXGetBigWinnersResponse: function (response,tableIndex) {
            switch (tableIndex) {
                case "0":
                    this.lasvegasTop = response;
                    break;
                case "1":
                    this.hongkongTop = response;
                    break;
                case "2":
                    this.macauTop = response;
                    break;
            }
            if (tableIndex==this.currentTableIndex)
            {
                this.renderTop(tableIndex);
                cc.PopupController.getInstance().hideBusy();
            }

        },
        renderTop:function(tableIndex)
        {
            var list = [];
            switch (tableIndex)
            {
                case "0":
                    list = this.lasvegasTop;
                    break;
                case "1":
                    list = this.hongkongTop;
                    break;
                case "2":
                    list = this.macauTop;
                    break;
            }
            //var list = slotsHistoryListData;
            if (list !== null && list.length > 0) {
                this.taiXiuTopListView.resetList();
                this.taiXiuTopListView.initialize(list);
            }
        },
        closeClicked: function () {
            this.taiXiuTopListView.resetList();
            // this.animation.play('closePopup');
            var self = this;
            var delay = 0.12;
            cc.director.getScheduler().schedule(function () {
                self.animation.stop();
                cc.TaiXiuMainController.getInstance().destroyTopView();
            }, this, 1, 0, delay, false);
        },
    });
}).call(this);
