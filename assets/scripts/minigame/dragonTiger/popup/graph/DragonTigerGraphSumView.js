/**
 * Created by Nofear on 3/15/2019.
 */

(function () {
    cc.DragonTigerGraphDiceSumView = cc.Class({
        "extends": cc.Component,
        properties: {
            nodeGraphics: cc.Node,
            nodeParent: cc.Node,
            nodeTaiTemp: cc.Node,
            nodeXiuTemp: cc.Node,

            toggleDiceSum: cc.Toggle,

            lbSessionID: cc.Label,
            lbResult: cc.Label,
        },

        onLoad: function () {
            this.rootPosX = -22; //toa do goc
            this.rootPosY = -81; //toa do goc
            this.spaceX = 40;
            this.spaceY = 40;

            this.maxItemPerCol = 5;

            this.minSum = 3;
            this.maxSum = 18;

            this.spacePoint = (this.spaceY * this.maxItemPerCol) / (this.maxSum - this.minSum);

            this.drawing = this.nodeGraphics.getComponent(cc.Graphics);
            this.drawing.lineWidth = 2;
            this.drawing.strokeColor = cc.Color.WHITE;
        },

        draw: function (list) {
            var lastItem = list[0];
            var result = "";
            switch(lastItem.Result) {
                case cc.DragonTigerBetSide.RONG:
                    result =  'RỒNG';
                    break;
                case cc.DragonTigerBetSide.HOA:
                    result =  'HÒA';
                    break;
                case cc.DragonTigerBetSide.HO:
                    result =  'HỔ';
                    break;
            }
            this.lbSessionID.string = 'Phiên gần nhất (#' + lastItem.SessionId + ') - ';
            //this.lbResult.string = result + ' ' + lastItem.DiceSum + ' (' + lastItem.FirstDice + '-' + lastItem.SecondDice + '-' + lastItem.ThirdDice + ')';

            this.cacheList = list;

            this.drawPoints = [];

            var self = this;
            var index = 0;
            list.forEach(function (item) {
                self.createNode(item, index);
                index++;
            });

            this.strokeLine();
        },

        createNode: function (item, colIndex) {
            //toa do X
            var posX = this.rootPosX - (colIndex * this.spaceX);
            //toa do Y
            var posY = this.rootPosY + (item.DiceSum - this.minSum) * this.spacePoint;

            //di chuyen den doan goc
            if (colIndex === 0) {
                this.drawing.moveTo(posX, posY);
            }

            if (item.BetSide === cc.DragonTigerBetSide.TAI) {
                var nodeView = cc.instantiate(this.nodeTaiTemp);
            } else {
                nodeView = cc.instantiate(this.nodeXiuTemp);
            }
            nodeView.parent = this.nodeParent;
            nodeView.position = cc.v2(posX, posY);

            this.drawPoints.push(cc.v2(posX, posY));
        },

        strokeLine: function () {
            var self = this;
            this.drawPoints.forEach(function (point) {
                self.drawing.lineTo(point.x, point.y);
                self.drawing.stroke();
                self.drawing.moveTo(point.x, point.y);
            });
        },

        resetDraw: function () {
            //xoa cac node con
            var children = this.nodeParent.children;
            for (var i = children.length - 1; i >= 0; i--) {
                this.nodeParent.removeChild(children[i]);
            }
            this.drawing.clear();
        },

        toggleDrawDiceSumClicked: function () {
            if (!this.toggleDiceSum.isChecked) {
                this.resetDraw();
            } else {
                this.draw(this.cacheList);
            }
        },
    });
}).call(this);
