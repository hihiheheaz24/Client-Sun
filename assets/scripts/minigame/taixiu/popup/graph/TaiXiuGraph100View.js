/**
 * Created by Nofear on 3/15/2019.
 */

(function () {
cc.TaiXiuGraph100View = cc.Class({
    "extends": cc.Component,
    properties: {
        nodeParent: cc.Node,
        nodeTaiTemp: cc.Node,
        nodeXiuTemp: cc.Node,
    },

    draw: function (list) {
        var countTai = 0;
        let begin = 0, count = 0;
        for (let i = 0; i < list.length; i = i + 5) {
            if (count % 2 == 0) {
                begin = i;
                for (let j = begin; j < begin + 5; j++) {
                    let item = list[j];
                    if (item) {
                        if (item.BetSide === cc.TaiXiuBetSide.TAI) {
                            countTai++;
                            this.createNode(this.nodeTaiTemp);
                        } else {
                            this.createNode(this.nodeXiuTemp);
                        }
                    }
                }
            } else {
                begin = i + 4;
                for (let j = begin; j >= i; j--) {
                    let item = list[j];
                    if (item) {
                        if (item.BetSide === cc.TaiXiuBetSide.TAI) {
                            countTai++;
                            this.createNode(this.nodeTaiTemp);
                        } else {
                            this.createNode(this.nodeXiuTemp);
                        }
                    }
                }
            }
            count++;
        }
        return countTai;
    },

    createNode: function (nodeTemp) {
        var nodeView = cc.instantiate(nodeTemp);
        nodeView.parent = this.nodeParent;
    },

    resetDraw: function () {
        //xoa cac node con
        var children = this.nodeParent.children;
        for (var i = children.length - 1; i >= 0; i--) {
            this.nodeParent.removeChild(children[i]);
        }
    },
});
}).call(this);
