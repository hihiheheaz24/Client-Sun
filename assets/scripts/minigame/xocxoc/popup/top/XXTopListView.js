/**
 * Created by Nofear on 3/15/2019.
 */


(function () {
    cc.XXTopListView = cc.Class({
        "extends": cc.ListView,
        properties: {

        },

        initialize: function (messages) {
            this.messages = messages;

            for (var i = 0; i < messages.length; ++i) {
                var item = cc.instantiate(this.itemTemplate);
                this.content.addChild(item);
                item.getComponent(cc.XXTopItem).updateItem(this.messages[i], i);
                this.items.push(item);
            }
        }
    });
}).call(this);
