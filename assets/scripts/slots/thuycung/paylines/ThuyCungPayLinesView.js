/**
 * Created by Nofear on 3/14/2019.
 */

(function () {
    cc.ThuyCungPayLinesView = cc.Class({
        "extends": cc.Component,
        properties: {
            nodeLines: [cc.Node],
            iconSkeletons: [cc.Sprite],
            nodeFXWin: [cc.Node],
        },

        onLoad: function () {
            cc.PayLinesController.getInstance().setPayLinesView(this);


            this.nodeFXWin.forEach(function (fxWin) {
                fxWin.active = false;
                fxWin.getComponent(cc.Animation).stop();
            });
        },

        start: function () {
            this.currentLine = this.nodeLines[0];
            this.scheduler = cc.director.getScheduler();
            this.isEffect = false;
            this.interval = 2;
        },

        activeLineByID(lineID){
            this.nodeLines[lineID - 1].active = true;
        },

        onDestroy: function () {
            this.scheduler = null;
        },

        hideAllLines: function () {
            this.nodeLines.forEach(function (nodeLine) {
                nodeLine.active = false;
            });
            this.hideAllFXWin();
        },


        hideAllFXWin: function () {
            this.nodeFXWin.forEach(function (fxWin) {
                fxWin.active = false;
                fxWin.getComponent(cc.Animation).stop();
            });
        },

        showAllLines: function () {
            this.nodeLines.forEach(function (nodeLine) {
                nodeLine.active = true;
            });
        },

        //Hien tat ca cac line thang
        playEffect: function (prizeLines, delay) {
            this.hideAllFXWin();
            //An hieu ung tien thang khi bat dau hieu ung line
            this.isEffect = true;
            this.index = 0;
            this.totalPrizes = prizeLines.length;
            this.prizeLines = prizeLines;
            var self = this;

            //Hien tat ca line thang
            prizeLines.forEach(function (prize) {
                self.nodeLines[prize.LineID - 1].active = true;
                // prize.Items.forEach(function (iconId) {
                 
                //     if (self.nodeFXWin[iconId - 1] !== null && self.nodeFXWin[iconId - 1] !== undefined)
                //         self.nodeFXWin[iconId - 1].active = true;
                //         self.nodeFXWin[iconId - 1].getComponent(cc.Animation).play();
                // });
            });

        

            //delay < 0 -> trung jackpot -> se ko tu stop Effect den khi user tac dong
            if (delay >= 0) {
                //dat lich an hieu ung hien tat ca -> bat dau hien tung line thang
                this.scheduler.schedule(function () {
                    self.stopGameEffect();
                    self.hideAllLines();
                    self.startEffect(delay);
                }, this, 0, 0, delay, false);
            }
        },

        stopGameEffect: function () {
            cc.EffectController.getInstance().stopEffect();
        },

        //bat dau chay effect tung line thang mot
        startEffect: function () {
            this.showLine();
            var self = this;
            this.scheduler.schedule(function () {
                if (self.isEffect) {
                    self.startEffect();
                } else {

                }
            }, this, this.interval, 0, 0, false);

        },

        showLine: function () {
            this.hideAllFXWin();
            var self = this;
            var prize = this.prizeLines[this.index];
            var items = prize.Items;
            this.showLineID(prize.LineID);
            this.stopHighlight();

            this.index++;
            if (this.index === this.totalPrizes) {
                this.index = 0;
            }

            items.forEach(function (iconId) {
                self.nodeFXWin[iconId - 1].active = true;
                self.nodeFXWin[iconId - 1].getComponent(cc.Animation).play();
            });



        },

        showLineID: function (lineID) {
            this.currentLine.active = false;
            this.nodeLines[lineID - 1].active = true;
            this.currentLine = this.nodeLines[lineID - 1];
        },

        stopHighlight: function () {

        },

        stopEffect: function () {
            this.unscheduleAllCallbacks();
            this.isEffect = false;
            this.hideAllLines();
            this.stopHighlight();
        },

        activeLines(count = 1){
            this.nodeLines.forEach( (nodeLine, index) => {
                if(index <= count -1){
                    nodeLine.active = true;
                } else {
                    nodeLine.active = false;
                }
            });
        }
    });
}).call(this);
