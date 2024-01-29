/**
 * Created by Nofear on 3/15/2019.
 */

(function () {
    cc.SicBoGraph100View = cc.Class({
        "extends": cc.Component,
        properties: {
            nodeParent: cc.Node,
            nodeTaiTemp: cc.Node,
            nodeXiuTemp: cc.Node,
            nodeBaoTemp: cc.Node,
            lastItemGlow: cc.Node
        },

        draw: function (list) {
            
            var tai = 0;
            var xiu = 0;
            var bao = 0;
            var self = this;
            this.listLength = list.length;
            list.forEach(function (item,index) {
                let diceSum = item.FirstDice+item.SecondDice + item.ThirdDice;
                let result = diceSum>10?0:1;
                if (item.FirstDice==item.SecondDice&&item.SecondDice==item.ThirdDice) {
                    result = 2;
                }
                if (result==0) {
                    tai++;
                    self.createNode(self.nodeTaiTemp,index, diceSum);
                } else if (result==1) {
                    xiu++;

                    self.createNode(self.nodeXiuTemp,index, diceSum);
                } else {
                    bao++;

                    self.createNode(self.nodeBaoTemp,index, diceSum);
                }
            });
            var count = {
                taiCount:tai,
                xiuCount:xiu,
                baoCount:bao
            };
            return count;
        },

        createNode: function (nodeTemp,index, diceSum = 0) {
            var nodeView = cc.instantiate(nodeTemp);
            nodeView.parent = this.nodeParent;
            if (index==0) {
                let outline = cc.instantiate(this.lastItemGlow);
                outline.parent = nodeView;
                outline.setPosition(0,0);
            }
            const diceSumLabel = nodeView.getComponentInChildren(cc.Label);
            if (diceSumLabel) {
                diceSumLabel.node.active = true;
                diceSumLabel.string = diceSum;
            }
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
