/**
 * Created by Nofear on 3/15/2019.
 */

(function () {
    cc.TaiXiuGraphView = cc.Class({
        "extends": cc.PopupBase,
        properties: {
            TaiXiuGraph100View: cc.TaiXiuGraph100View,
            TaiXiuGraphCatCauView: cc.TaiXiuGraphCatCauView,
            TaiXiuGraphDiceSumView: cc.TaiXiuGraphDiceSumView,
            TaiXiuGraphDice3View: cc.TaiXiuGraphDice3View,

            pageView: cc.PageView,
            btnNext: cc.Button,
            btnBack: cc.Button,

            lbTotalTai: cc.Label,
            lbTotalXiu: cc.Label,
        },

        onLoad: function () {
            this.animation = this.node.getComponent(cc.Animation);
            this.timeSwitchPage = 0.3;
            this.totalPages = 2;
            this.currentPageIndex = this.pageView.getCurrentPageIndex();
            this.checkStatusButton();
            this.node.zIndex = cc.NoteDepth.POPUP_TAIXIU_;
        },

        onEnable: function () {
            var self = this;
            var delay = 0.2;
            cc.director.getScheduler().schedule(function () {
                self.getSoiCau();
            }, this, 1, 0, delay, false);

            this.animation.play('openPopup');

            //set tam du lieu de demo
        },

        getSoiCau: function () {
            var txGetSoiCauCommand = new cc.TXGetSoiCauCommand;
            txGetSoiCauCommand.execute(this)
        },

        onTXGetSoiCauResponse: function (list) {
            /*
            {
                "SessionId": 173183,
                "FirstDice": 4,
                "SecondDice": 2,
                "ThirdDice": 4,
                "DiceSum": 10,
                "BetSide": 1,
                "CreatedDate": "2019-04-04T07:10:44.94"
              }
            * */

            var countTai = this.TaiXiuGraph100View.draw(list);
            this.lbTotalTai.string = countTai;
            this.lbTotalXiu.string = 100 - countTai;
            this.TaiXiuGraphCatCauView.draw(list);

            this.TaiXiuGraphDiceSumView.draw(list);
            this.TaiXiuGraphDice3View.draw(list);
        },

        pageEvent: function () {
            this.checkStatusButton();
        },

        closeClicked: function () {
            //reset truoc khi close cho ko lag
            this.TaiXiuGraph100View.resetDraw();
            this.TaiXiuGraphCatCauView.resetDraw();
            this.TaiXiuGraphDiceSumView.resetDraw();
            this.TaiXiuGraphDice3View.resetDraw();

            this.animation.play('closePopup');
            var self = this;
            var delay = 0.12;
            cc.director.getScheduler().schedule(function () {
                self.animation.stop();
                cc.TaiXiuMainController.getInstance().destroyGraphView();
            }, this, 1, 0, delay, false);
        },

        nextPageClicked: function() {
            this.currentPageIndex++;
            this.pageView.scrollToPage(this.currentPageIndex, this.timeSwitchPage);
            this.checkStatusButton();
        },

        backPageClicked: function() {
            this.currentPageIndex--;
            this.pageView.scrollToPage(this.currentPageIndex, this.timeSwitchPage);
            this.checkStatusButton();
        },

        checkStatusButton: function () {
            this.currentPageIndex = this.pageView.getCurrentPageIndex();
            if (this.currentPageIndex <  this.totalPages - 1) {
                // this.btnNext.interactable = true;
                this.btnNext.node.active = true;
            } else {
                // this.btnNext.interactable = false;
                this.btnNext.node.active = false;
            }

            if (this.currentPageIndex > 0) {
                // this.btnBack.interactable = true;
                this.btnBack.node.active = true;
            } else {
                // this.btnBack.interactable = false;
                this.btnBack.node.active = false;
            }
        },
    });
}).call(this);
