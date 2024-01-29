/**
 * Created by Nofear on 1/14/2019.
 */

(function () {
    cc.TouchMoveMiniGame = cc.Class({
        "extends": cc.Component,
        properties: {
            bgBlur: cc.Node,
        },

        onLoad: function() {
            var self = this;

            this.isTouch = false;

            this.lastX = this.node.x;
            this.lastY = this.node.y;
            this.countTouch = 0;

            this.node.on('touchstart', function () {
                if (self.bgBlur) {
                    self.node.opacity = 255;
                    self.bgBlur.active = true;
                }

                //this.opacity = 255;
                self.isTouch = true;
                self.node.parent.zIndex = cc.Config.getInstance().getZINDEX();
            }, this.node);

            this.node.on('touchmove', function (event) {
                if (self.isTouch) {
                    var delta = event.touch.getDelta();
                    self.countTouch ++;
                    this.x += delta.x;
                    this.y += delta.y;
                }
            }, this.node);

            this.node.on('touchend', function (event) {
                if (self.isTouch) {
                    self.countTouch = 0;
                    self.lastX = this.x;
                    self.lastY = this.y;
                    self.isTouch = false;
                }
            }, this.node);
        },

        hideBlur: function () {
            if (this.bgBlur) {
                this.bgBlur.active = false;
            }
            this.node.opacity = 100;
        },

        disableTouch: function () {
            this.isTouch = false;
        }
    });
}).call(this);
