/**
 * Created by Nofear on 3/15/2019.
 */


(function () {
    cc.XXHistoryListView = cc.Class({
        "extends": cc.ListView,
        properties: {

        },

        initialize: function (messages) {
            this.messages = messages;
            var countMessage = this.messages.length;

            for (var i = 0; i < countMessage; ++i) {
                var item = cc.instantiate(this.itemTemplate);
                this.content.addChild(item);
                item.getComponent(cc.XXHistoryItem).updateItem(this.messages[i], i);
                this.items.push(item);
            }
        }
    });
}).call(this);
