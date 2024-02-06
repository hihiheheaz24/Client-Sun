/**
 * Created by Nofear on 3/14/2019.
 */


(function () {
    cc.CBPayLinesView = cc.Class({
        "extends": cc.PayLinesViewBase,
        properties: {

        },

        onLoad: function () {
            cc.PayLinesController.getInstance().setPayLinesView(this);
        },

        showLine: function () {

            var self = this;
            var prize = this.prizeLines[this.index];
            var items = prize.Items;
            this.showLineID(prize.LineID);
            this.stopHighlight();

            if (self.iconSkeletons.length > 0) {
                items.forEach(function (iconId) {
                    if(self.iconSkeletons[iconId - 1]) {
                        self.iconSkeletons[iconId - 1].setAnimation(0, 'animation', true);
                    }
                });
            }

            this.index++;
            if (this.index === this.totalPrizes) {
                this.index = 0;
            }
        },

        //Hien tat ca cac line thang
        playEffect: function (prizeLines, delay) {

            //An hieu ung tien thang khi bat dau hieu ung line
            this.isEffect = true;
            this.index = 0;
            this.totalPrizes = prizeLines.length;
            this.prizeLines = prizeLines;
            var self = this;

            //Hien tat ca line thang
            prizeLines.forEach(function (prize) {
                self.nodeLines[prize.LineID - 1].active = true;
                //prize co power
                //tao power
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

        stopEffect: function () {
            this.unscheduleAllCallbacks();
            this.isEffect = false;
            this.hideAllLines();
            this.stopHighlight();
        },

        stopGameEffect: function () {
            cc.EffectController.getInstance().stopEffect();
        },
    });
}).call(this);
