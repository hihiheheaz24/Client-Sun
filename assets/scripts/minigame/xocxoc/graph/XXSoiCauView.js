/**
 * Created by Nofear on 3/15/2019.
 */

/**
 Draw tu phai qua trai
 Draw tu duoi len tren
 */


(function () {
    cc.XXSoiCauView = cc.Class({
        "extends": cc.Component,
        properties: {
            lbTotalChan: cc.Label,
            lbTotalLe: cc.Label,
            nodeTotal: cc.Node,

            sfDots: [cc.SpriteFrame],
        },

        onLoad: function () {
            cc.XXController.getInstance().setXXSoiCauView(this);
        },

        getSide: function (gate) {
            switch (gate) {
                case cc.XXResult.EVEN:
                    return 'EVEN';
                case cc.XXResult.EVEN_FOUR_DOWN:
                    return 'EVEN';
                case cc.XXResult.EVEN_FOUR_UP:
                    return 'EVEN';
                case cc.XXResult.ODD_THREE_DOWN:
                    return 'ODD';
                case cc.XXResult.ODD_THREE_UP:
                    return 'ODD';
            }
        },

        draw: function (list) {
            if (list.length === 0) return;

            let totalChan = 0;
            let totalLe = 0;

            let children = this.nodeTotal.children;
            for (let i = 0; i < children.length; i++) {
                let gate = this.getSide(list[i]);
                let indexSF = 0;
                if (gate == 'EVEN') {
                    totalChan++;
                    indexSF = 1;
                } else {
                    totalLe++;
                    indexSF = 0;
                }
                if (this.nodeTotal.getChildByName(i.toString())) {
                    this.nodeTotal.getChildByName(i.toString()).getComponent(cc.Sprite).spriteFrame = this.sfDots[indexSF];
                }
            }

            this.lbTotalChan.string = totalChan;
            this.lbTotalLe.string = totalLe;
        },

        resetDraw: function () {
            cc.log("resetDraw");
        }
    });
}).call(this);
