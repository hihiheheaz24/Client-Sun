// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        positionNode:cc.Node,
    },
    onLoad () {
        var posX = -cc.view.getVisibleSize().width / 2;
            var posY = -cc.view.getVisibleSize().height / 2;
            //set vi tri x
            this.positionNode.setPosition(posX,posY);
            this.animation = this.node.getComponent(cc.Animation);
            this.animation.play('swipe').wrapMode = cc.WrapMode.Reverse;
    },
    closeClicked: function () {
        this.animation.play('swipe').wrapMode = cc.WrapMode.Normal;
        var self = this;
        var delay = 0.4;
        cc.AudioController.getInstance().playSound(cc.AudioTypes.SICBO_CLOSE_POPUP);
        cc.director.getScheduler().schedule(function () {
            self.animation.stop();
            cc.SicBoPopupController.getInstance().destroyMaxBetView();
        }, this, 1, 0, delay, false);
    }
});
