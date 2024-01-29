/**
 * Created by Nofear on 3/15/2019.
 */


(function () {
    cc.LiveXXTopTipListView = cc.Class({
        "extends": cc.ListView,
        properties: {

        },

        initialize: function (messages) {
            this.messages = messages;
            var countMessage = this.messages.length;
            var spawnCountReal = Math.min(10, countMessage);

            for (var i = 0; i < spawnCountReal; ++i) {
                var item = cc.instantiate(this.itemTemplate);
                this.content.addChild(item);
                item.getComponent(cc.LiveXXTopTipItem).updateItem(this.messages[i], i);
            }
        },
    });
}).call(this);
