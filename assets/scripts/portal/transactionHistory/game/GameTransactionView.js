/**
 * Created by Nofear on 3/15/2019.
 */

//var gameTransactionListData = require('GameTransactionListData');

(function () {
    cc.GameTransactionView = cc.Class({
        "extends": cc.Component,
        properties: {
            gameTransactionListView: cc.GameTransactionListView,
            toggleChooseValue: cc.ToggleChooseValue, //tao list dropdown menu
            lbDateSelected: cc.Label,

            animationMenuDate: cc.Animation,
        },

        onLoad: function () {
            //set ngay chon mac dinh
            this.lbDateSelected.string = cc.Tool.getInstance().getLocalDateNow();
            this.createDropDownMenu();

            this.getGameTransactionList();
        },

        onEnable: function () {
            this.animationMenuDate.node.scaleY = 0;
            this.animationMenuDate.node.children[0].width = 0;
            this.animationMenuDate.node.children[0].height = 0;
        },

        getGameTransactionList: function () {
            var gameHistoryCommand = new cc.GameHistoryCommand;
            gameHistoryCommand.execute(this);
        },

        onGameHistoryResponse: function (response) {
            var list = response.list;
            //list = gameTransactionListData;
            this.gameTransactionListView.resetList();

            if (list !== null && list.length > 0) {
                this.gameTransactionListView.initialize(list);
            }
        },

        //Tao list menu dropdown 7 ngay
        createDropDownMenu: function () {
            for (var i = 0; i < 7; i++) {
                this.toggleChooseValue.initializeToggleChooseValue(
                    this,
                    "GameTransactionView",
                    "selectDateValueEvent",
                    cc.Tool.getInstance().getLocalDateNow(i),
                    cc.Tool.getInstance().getLocalDateNow(i),
                );
            }
        },

        selectDateValueEvent: function (event, data) {
            this.lbDateSelected.string = data.toString();
            this.animationMenuDate.play('hideDropdownMenu');
            this.getGameTransactionList();
        },

        openMenuDateClicked: function () {
            this.animationMenuDate.play('showDropdownMenu');
        },

        hideMenuDateClicked: function () {
            this.animationMenuDate.play('hideDropdownMenu');
            console.log('hideMenuDateClicked');
        },
    });
}).call(this);
