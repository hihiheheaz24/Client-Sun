
(function () {
    cc.OptimizeScrollviewVertical = cc.Class({
        "extends": cc.Component,
        properties: {
            scrollview: cc.ScrollView,
        },
        update(dt) {
            var viewRect = cc.rect(- this.scrollview.node.width / 2, - this.scrollview.content.y - this.scrollview.node.height, this.scrollview.node.width, this.scrollview.node.height);
            for (let i = 0; i < this.scrollview.content.children.length; i++) {
                const node = this.scrollview.content.children[i];
                if (viewRect.intersects(node.getBoundingBox())) {
                    node.opacity = 255;
                }
                else {
                    node.opacity = 0;
                }
            }
        }
    })
}).call(this);