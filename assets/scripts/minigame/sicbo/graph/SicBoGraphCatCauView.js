/**
 * Created by Nofear on 3/15/2019.
 */

/**
    Draw tu phai qua trai
    Draw tu duoi len tren
 */


(function () {
    cc.SicBoGraphCatCauView = cc.Class({
        "extends": cc.Component,
        properties: {
            nodeParent: cc.Node,
            nodeTaiTemp: cc.Node,
            nodeXiuTemp: cc.Node,
            nodeBaoTemp: cc.Node,
            lastItemGlow: cc.Node
        },

        onLoad: function () {
            this.rootPosX = -22; //toa do goc
            this.rootPosY = -70; //toa do goc
            this.spaceX = 44;
            this.spaceY = 35;

            this.maxItemPerCol = 5;
            this.isFirst = true;
        },

        convertToMatrix: function (list) {
            this.totalLoop = 0;
            var self = this;
            let diceSum = list[0].FirstDice+list[0].SecondDice + list[0].ThirdDice;
                let result = diceSum>10?0:1;
                if (list[0].FirstDice==list[0].SecondDice&&list[0].SecondDice==list[0].ThirdDice) {
                    result = 2;
                }
            //luu lai side dau tien
            var currentSide = result==2?1:result;

            var matrix = [];
            var arrCols = [];
            list.forEach(function (item) {
                let diceSum = item.FirstDice+item.SecondDice + item.ThirdDice;
                let result = diceSum>10?0:1;
                if (item.FirstDice==item.SecondDice&&item.SecondDice==item.ThirdDice) {
                    result = 2;
                }
                if (arrCols.length === self.maxItemPerCol) {
                    //du 6 thi dua vao matrix + chuyen sang cot khac
                    matrix.push(arrCols);
                    //reset cols
                    arrCols = [];
                    //push vao cols
                    arrCols.push(item);
                    if (matrix.length<20) {
                        self.totalLoop+=1;
                    }
                    //set lai currentSide
                    currentSide = result==2?currentSide:result;
                } else if (result == currentSide) {
                    if (matrix.length<20) {
                        self.totalLoop+=1;
                    }                    //giong thi them vao
                    arrCols.push(item);
                } else {
                    //khac thi push vao matrix + reset cols
                    matrix.push(arrCols);
                    //reset cols
                    arrCols = [];
                    //set lai currentSide
                    currentSide = result==2?currentSide:result;
                    if (matrix.length<20) {
                        self.totalLoop+=1;
                    }                    //push vao cols
                    arrCols.push(item);
                }
            });
            //push arr cuoi vao matrix
            matrix.push(arrCols);

            return matrix;
        },

        draw: function (list) {
            var matrix = this.convertToMatrix(list);
            for (var i = 0; i < matrix.length; i++) {
                this.drawCol(matrix[i], i);
            }
            this.nodeParent.width = Math.max(matrix.length * 20, 782);
            return this.countTaiXiuBao(list,this.totalLoop)
        },
        drawCol: function (cols, colIndex) {
            //vi tri X
            var posX = this.rootPosX - (colIndex * this.spaceX);
            //toa do Y bat dau ve
            var starY = this.rootPosY + (this.maxItemPerCol - cols.length) * this.spaceY;

            for (var i = 0; i < cols.length; i++) {
                this.createNode(cols[i], cc.v2(posX, starY + (this.spaceY * i)));
            }
        },
        countTaiXiuBao:function(list,totalLoop)
        {
            var tai = 0;
            var xiu = 0;
            var bao = 0;
            list.forEach(function (item,index) {
                if(index<totalLoop)
                {
                    let diceSum = item.FirstDice+item.SecondDice + item.ThirdDice;
                    let result = diceSum>10?0:1;
                    if (item.FirstDice==item.SecondDice&&item.SecondDice==item.ThirdDice) {
                        result = 2;
                    }
                    if (result==0) {
                        tai++;
                    } else if (result==1) {
                        xiu++;
                    } else {
                        bao++;
                    }
                }
                
            });
            var count = {
                taiCount:tai,
                xiuCount:xiu,
                baoCount:bao
            };
            return count;
        },
        createNode: function (item, pos) {
            let diceSum = item.FirstDice+item.SecondDice + item.ThirdDice;
                let result = diceSum>10?0:1;
                if (item.FirstDice==item.SecondDice&&item.SecondDice==item.ThirdDice) {
                    result = 2;
                }
            if (result==0) {
                var nodeView = cc.instantiate(this.nodeTaiTemp);
            } else if(result==1) {
                nodeView = cc.instantiate(this.nodeXiuTemp);
            } else nodeView = cc.instantiate(this.nodeBaoTemp);
            nodeView.parent = this.nodeParent;
            nodeView.position = pos;
            nodeView.getComponentInChildren(cc.Label).string = diceSum;
            if (this.isFirst) {
                this.isFirst = false;
                let outline = cc.instantiate(this.lastItemGlow);
                outline.parent = nodeView;
                outline.setPosition(0,0);
            }
            // nodeView.getComponentInChildren(cc.Label).string = item.DiceSum;
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
