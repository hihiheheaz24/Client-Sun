/**
 * Created by Nofear on 3/15/2019.
 */

// var bankTransactionListData = require('BankTransactionListData');

(function () {
    cc.TopupTransactionView = cc.Class({
        "extends": cc.Component,
        properties: {
            bankTransactionListView: cc.BankTransactionListView,
        },

        onLoad: function () {
            this.getBankTransactionList();
        },

        getBankTransactionList: function () {
            var bankHistoryCommand = new cc.BankHistoryCommand;
            bankHistoryCommand.execute(this);
        },

        onBankHistoryResponse: function (response) {
            var list = response.List;
            // var list = bankTransactionListData;
            if (list !== null && list.length > 0) {
                this.bankTransactionListView.resetList();
                this.bankTransactionListView.initialize(list);
            }
        }
    });
}).call(this);
