cc.Class({
    extends: cc.Component,

    properties: {

    },

    onEnable: function() {
        let self = this;
        this.node.children.forEach(child => {
            let lastPosition = child.position;
            child.runAction(
                cc.repeatForever(
                    cc.sequence(
                        cc.moveTo(Math.floor(Math.random() * 10 + 5), cc.v2(lastPosition.x, -600)),
                        cc.delayTime(0.5),
                        cc.callFunc(function() {
                            child.position = lastPosition;
                        }, self),
                        cc.delayTime(3),
                    )
                )
            );
        })
    }
});
