/**
 * Created by Nofear on 3/15/2019.
 */

(function () {
    cc.TaiXiuHistoryView = cc.Class({
        "extends": cc.PopupBase,
        properties: {
            taiXiuHistoryListView: cc.TaiXiuHistoryListView,
            btnTabLasvegas:cc.Button,
            btnTabHongKong:cc.Button,
            btnTabMacau:cc.Button
        },

        onLoad: function () {
            this.animation = this.node.getComponent(cc.Animation);
            this.node.zIndex = cc.NoteDepth.POPUP_TAIXIU;
        },

        onEnable: function () {
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
            this.getTopSessionWinners(this.currentTableIndex);
        },
        changeTabClicked:function(event, index)
        {
            this.currentBtn.interactable = true;
            this.taiXiuHistoryListView.resetList();
            this.currentTableIndex = index;
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
                    
                    break;
            }

            this.currentBtn.interactable = false;
            this.getTopSessionWinners(this.currentTableIndex);
        },

        getTopSessionWinners: function (index) {
            cc.PopupController.getInstance().showBusy(false,true);
            var txGetHistoryCommand = new cc.TXGetHistoryCommand;
            txGetHistoryCommand.execute(this,index);
        },

        onTXGetHistoryResponse: function (response,tableIndex) {
            switch (tableIndex) {
                case "0":
                    this.lasvegasHistory = response;
                    break;
                case "1":
                    this.hongkongHistory = response;
                    break;
                case "2":
                    this.macauHistory = response;
                    break;
            }
            if (tableIndex==this.currentTableIndex)
            {
                this.renderHistory(tableIndex);
                cc.PopupController.getInstance().hideBusy();
            }
        },
        renderHistory:function(tableIndex)
        {
            var list = [];
            switch (tableIndex)
            {
                case "0":
                    list = this.lasvegasHistory;
                    break;
                case "1":
                    list = this.hongkongHistory;
                    break;
                case "2":
                    list = this.macauHistory;
                    break;
            }
            if (list !== null && list.length > 0) {
                this.taiXiuHistoryListView.resetList();
                this.taiXiuHistoryListView.initialize(list);
            }
        },
        closeClicked: function () {
            this.taiXiuHistoryListView.resetList();
            // this.animation.play('closePopup');
            var self = this;
            var delay = 0.12;
            cc.director.getScheduler().schedule(function () {
                self.animation.stop();
                cc.TaiXiuMainController.getInstance().destroyHistoryView();
            }, this, 1, 0, delay, false);
        },
    });
}).call(this);
