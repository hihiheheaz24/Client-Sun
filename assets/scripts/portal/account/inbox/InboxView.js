/**
 * Created by Nofear on 3/15/2019.
 */
//var InboxListData = require('InboxListData');

(function () {
    cc.InboxView = cc.Class({
        "extends": cc.Component,
        properties: {
            inboxTemp: cc.Node,
            inboxParent: cc.Node,

            lbInfo: cc.Label,
        },

        onLoad: function () {
            cc.InboxController.getInstance().setInboxView(this);
            this.getInbox();
        },

        getInbox: function () {
            var children = this.inboxParent.children;
            for (var i = children.length - 1; i >= 0; i--) {
                this.inboxParent.removeChild(children[i]);
            }
            this.inboxItems = [];

            var userMailCommand = new cc.UserMailCommand;
            userMailCommand.execute(this);
        },

        onUserMailResponse: function (response) {
            var list = response.List;
            //list = InboxListData; //test

            if (list !== null && list.length > 0) {
                this.lbInfo.string = '';

                var self = this;
                list.forEach(function (item) {
                    var nodeInbox = cc.instantiate(self.inboxTemp);
                    nodeInbox.parent = self.inboxParent;
                    var inboxItem = nodeInbox.getComponent(cc.InboxItem);
                    inboxItem.initItem(item);
                    self.inboxItems.push(inboxItem);
                });
            } else {
                this.lbInfo.string = 'Không có thông báo nào';
            }
        },

        onSystemMailResponseError: function (response) {
            this.lbInfo.string = 'Không có thông báo nào';
        }
    });
}).call(this);
