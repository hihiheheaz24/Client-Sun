/**
 * Created by Nofear on 3/27/2019.
 */

(function () {
    cc.FreeSpinView = cc.Class({
        "extends": cc.Component,
        properties: {
            nodeForFreeSpins: [cc.Node], //node se bat khi choi fs
            nodeForMains: [cc.Node], //node se bat khi choi normal

            nodeSlotsScale: [cc.Node], //node can scale lai

            spriteBG: cc.Sprite,
            // spriteBGSlot: cc.Sprite,
            spriteBar: cc.Sprite,
            spriteFrame: cc.Sprite,

            sfBGMain: cc.SpriteFrame,
            sfBGFreeSpin: cc.SpriteFrame,

            sfBGSlotMain: cc.SpriteFrame,
            sfBGSlotFreeSpin: cc.SpriteFrame,

            // sfBarMain: cc.SpriteFrame,
            // sfBarFreeSpin: cc.SpriteFrame,

            sfFrameMain: cc.SpriteFrame,
            sfFrameFreeSpin: cc.SpriteFrame,

            nodeStickyWild: cc.Node,

            lbFreeSpinText: cc.RichText,
        },

        onLoad: function () {
            cc.FreeSpinController.getInstance().setFreeSpinView(this);
        },
        
        activeFreeSpin: function (enable) {
            var self = this;

            //danh dau trang thai freespin
            cc.FreeSpinController.getInstance().setStateFreeSpin(enable);
            cc.SpinController.getInstance().activeButtonSpin(true);

            //bat cac node rieng cho freespin
            this.nodeForFreeSpins.forEach(function (nodeForFreeSpin) {
                nodeForFreeSpin.active = enable;
            });

            //tat cac node rieng cho freespin
            this.nodeForMains.forEach(function (nodeForMain) {
                nodeForMain.active = !enable;
            });

            //set cac UI tuong ung
            if (enable) {
                cc.AudioController.getInstance().playSound(cc.AudioTypes.MINI_GAME_ACTIVE);

                // this.spriteBGSlot.spriteFrame = this.sfBGSlotFreeSpin;
                this.spriteBG.spriteFrame = this.sfBGFreeSpin;
                // this.spriteBar.spriteFrame = this.sfBarFreeSpin;

                this.spriteFrame.spriteFrame = this.sfFrameFreeSpin;

                this.action = cc.scaleTo(1, 0.9);
                this.action.easing(cc.easeOut(3.0));

                this.nodeSlotsScale[0].runAction(this.action);
                this.nodeSlotsScale[1].scale = 0.9;
                this.nodeSlotsScale[2].scale = 0.9;
                //this.nodeSlotsScale[1].runAction(this.action);
                //this.nodeSlotsScale[2].runAction(this.action);

                /*
                this.nodeSlotsScale.forEach(function (nodeSlot) {
                    nodeSlot.runAction(self.action);
                });*/

                this.lbFreeSpinText.node.parent.active = true;
                cc.SpinController.getInstance().randomIcon();

            } else {
                // this.spriteBGSlot.spriteFrame = this.sfBGSlotMain;
                this.spriteBG.spriteFrame = this.sfBGMain;
                // this.sfBarMain.spriteFrame = this.sfBarMain;

                this.spriteFrame.spriteFrame = this.sfFrameMain;

                this.action = cc.scaleTo(0.9, 1);
                this.action.easing(cc.easeOut(3.0));

                this.nodeSlotsScale[0].runAction(this.action);
                this.nodeSlotsScale[1].scale = 1;
                this.nodeSlotsScale[2].scale = 1;
                //this.nodeSlotsScale[1].runAction(this.action);
                //this.nodeSlotsScale[2].runAction(this.action);

                /*
                this.nodeSlotsScale.forEach(function (nodeSlot) {
                    nodeSlot.runAction(self.action);
                });*/

                this.lbFreeSpinText.node.parent.active = false;

                cc.PayLinesController.getInstance().stopEffect();
            }

            //random icon

        },

        updateFreeSpinText: function (totalFreeSpin) {
            this.lbFreeSpinText.string = `Lượt quay miễn phí: <color=#FFFF00>${totalFreeSpin} lượt x 1</color>`;
        },

        getStickyWild: function () {
            return this.nodeStickyWild;
        }
    });
}).call(this);
