cc.Class({
    extends: cc.Component,
    properties: {
        itemTemplate: cc.Node,
        scrollView: cc.ScrollView,
        spawnCount: 0,
        spacing: 0, // space between each item
        bufferZone: 0 // when item is away from bufferZone, we relocate it
    },

   
    onLoad: function () {
        //set so item khoi tao default
        this.spawnCount = 15;
        if (this.scrollView === null) return;
        this.content = this.scrollView.content;
        this.items = []; // array to store spawned items
        this.updateTimer = 0;
        this.updateInterval = 0.1;
        this.lastContentPosY = 0; // use this variable to detect if we are scrolling up or down

        //save height root
        this.rootContentY = this.content.y;
    },

    resetList: function () {
        if (this.scrollView === null) return;
        this.items = []; //

        this.scrollView.stopAutoScroll();
        this.content = this.scrollView.content;
        this.content.y = this.rootContentY;

        var children = this.content.children;
        for (var i = children.length - 1; i >= 0; i--) {
            this.content.removeChild(children[i]);
        }
    },

    getPositionInView: function (item) { // get item position in scrollview's node space
        var worldPos = item.parent.convertToWorldSpaceAR(item.position);
        var viewPos = this.scrollView.node.convertToNodeSpaceAR(worldPos);
        return viewPos;
    },
    initialize: function (messages) {
        this.messages = messages;
        var countMessage = this.messages.length;
        var spawnCountReal = Math.min(10, countMessage);

        for (var i = 0; i < spawnCountReal; ++i) {
            var item = cc.instantiate(this.itemTemplate);
            this.content.addChild(item);
            item.getComponent(require('BaseTopItem')).updateItem(this.messages[i], i);
        }
    },

});