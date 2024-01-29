/**
 * Created by Nofear on 1/14/2019.
 */

 (function () {
    cc.TouchMoveBat = cc.Class({
        "extends": cc.Component,
        properties: {
            touchParent: cc.TouchMoveMiniGame,
        },

        onLoad: function() {
            var self = this;

            this.isTouch = false;

            this.lastX = this.node.x;
            this.lastY = this.node.y;
            this.countTouch = 0;

            this.node.on('touchstart', function () {
                //this.opacity = 255;
                self.isTouch = true;
                self.node.zIndex = cc.Config.getInstance().getZINDEX();
            }, this.node);

            this.node.on('touchmove', function (event) {
                if (self.touchParent !== undefined && self.touchParent !== null) {
                    self.touchParent.isTouch = false;
                }
                if (self.isTouch) {
                    var delta = event.touch.getDelta();
                    self.countTouch ++;
                    this.x += delta.x;
                    this.y += delta.y;
                }

                if ((Math.abs(self.node.x - self.lastX) > 220 || Math.abs(self.node.y - self.lastY) > 220)) {
                    self.node.active = false;
                    if (self.node.name == "bat") {
                        cc.TaiXiuController.getInstance().showResultWhenMoveBowl();
                    }
                    if (self.node.name == "batmd5") {
                        cc.TaiXiuMd5Controller.getInstance().showResultWhenMoveBowl();
                    }
                }
            }, this.node);

            this.node.on('touchend', function (event) {
                if (self.touchParent !== undefined && self.touchParent !== null) {
                    self.touchParent.isTouch = true;
                }
                if (self.isTouch) {
                    self.countTouch = 0;
                    self.lastX = this.x;
                    self.lastY = this.y;
                    self.isTouch = false;
                }
            }, this.node);
        },

        disableTouch: function () {
            this.isTouch = false;
        }
    });
}).call(this);
