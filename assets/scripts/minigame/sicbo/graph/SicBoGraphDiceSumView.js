/**
 * Created by Nofear on 3/15/2019.
 */

(function () {
    cc.SicBoGraphDiceSumView = cc.Class({
        "extends": cc.Component,
        properties: {
            nodeGraphics: cc.Node,
            nodeParent: cc.Node,
            nodeTaiTemp: cc.Node,
            nodeXiuTemp: cc.Node,
            nodeBaoTemp: cc.Node,

            toggleDiceSum: cc.Toggle,

            lbSessionID: cc.Label,
            lbResult: cc.Label,
            lastItemGlow: cc.Node
        },

        onLoad: function () {
            this.rootPosX = 0; //toa do goc
            this.rootPosY = -81; //toa do goc
            this.spaceX = 42;
            this.spaceY = 32.4;

            this.maxItemPerCol = 5;

            this.minSum = 3;
            this.maxSum = 18;

            this.spacePoint = (this.spaceY * this.maxItemPerCol) / (this.maxSum - this.minSum);

            this.drawing = this.nodeGraphics.getComponent(cc.Graphics);
            this.drawing.lineWidth = 2;
            this.drawing.strokeColor = cc.Color.WHITE;
            this.isFirst = false;
        },

        draw: function (list) {
            var lastItem = list[0];
            let diceSum = lastItem.FirstDice+lastItem.SecondDice + lastItem.ThirdDice;
                let result = diceSum>10? 'TÀI' : 'XỈU';
                if (lastItem.FirstDice==lastItem.SecondDice&&lastItem.SecondDice==lastItem.ThirdDice) {
                    result = 'BÃO';
                }
            this.lbSessionID.string = '#' + lastItem.SessionID;
            this.lbResult.string = result+' '+ diceSum+ ' (' + lastItem.FirstDice + '-' + lastItem.SecondDice + '-' + lastItem.ThirdDice + ')';

            this.cacheList = list;

            this.drawPoints = [];

            var self = this;
            var index = 0;
            list.forEach(function (item) {
                if(index>20)
                return;
                self.createNode(item, index);
                index++;
            });

            this.strokeLine();
        },

        createNode: function (item, colIndex) {
            let diceSum = item.FirstDice+item.SecondDice + item.ThirdDice;
                let result = diceSum>10?0:1;
                if (item.FirstDice==item.SecondDice&&item.SecondDice==item.ThirdDice) {
                    result = 2;
                }
            //toa do X
            var posX = this.rootPosX - (colIndex * this.spaceX);
            //toa do Y
            var posY = this.rootPosY + (diceSum - this.minSum) * this.spacePoint;

            //di chuyen den doan goc
            if (colIndex === 0) {
                this.drawing.moveTo(posX, posY);
            }

            if (result==0) {
                var nodeView = cc.instantiate(this.nodeTaiTemp);
            } else if(result==1) {
                nodeView = cc.instantiate(this.nodeXiuTemp);
            }
            else nodeView = cc.instantiate(this.nodeBaoTemp);
            nodeView.parent = this.nodeParent;
            nodeView.position = cc.v2(posX, posY);

            this.drawPoints.push(cc.v2(posX, posY));
			nodeView.getComponentInChildren(cc.Label).string = '';
            if (this.isFirst) {
                this.isFirst = false;
                let outline = cc.instantiate(this.lastItemGlow);
                outline.parent = nodeView;
                outline.setPosition(0,0);
            }
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
