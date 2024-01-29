/**
 * Created by Nofear on 3/15/2019.
 */

(function () {
    cc.SicBoGraphView = cc.Class({
        "extends": cc.PopupBase,
        properties: {
            SicBoGraph100View: cc.SicBoGraph100View,
            SicBoGraphCatCauView: cc.SicBoGraphCatCauView,
            SicBoGraphDiceSumView: cc.SicBoGraphDiceSumView,
            SicBoGraphDice3View: cc.SicBoGraphDice3View,

            pageView: cc.PageView,
            btnNext: cc.Button,
            btnBack: cc.Button,

            lbTotalTai: cc.Label,
            lbTotalXiu: cc.Label,
            lbTotalBao: cc.Label,
            lbTotalTaiCatCau: cc.Label,
            lbTotalXiuCatCau: cc.Label,
            lbTotalBaoCatCau: cc.Label,
        },

        onLoad: function () {
            this.animation = this.node.getComponent(cc.Animation);
            this.timeSwitchPage = 0.3;
            this.totalPages = 2;
            this.currentPageIndex = this.pageView.getCurrentPageIndex();
            this.checkStatusButton();
            this.node.zIndex = cc.NoteDepth.POPUP_SICBO;
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
            var sicboGetSoiCau = new cc.SicBoSoiCauCommand;
            sicboGetSoiCau.execute(this)
        },

        onResponse: function (list) {
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

            var count = this.SicBoGraph100View.draw(list);
            this.lbTotalTai.string = count.taiCount;
            this.lbTotalXiu.string = count.xiuCount;
            this.lbTotalBao.string = count.baoCount;
            var countCatCau = this.SicBoGraphCatCauView.draw(list);
            this.lbTotalTaiCatCau.string = countCatCau.taiCount;
            this.lbTotalXiuCatCau.string = countCatCau.xiuCount;
            this.lbTotalBaoCatCau.string = countCatCau.baoCount;
            this.SicBoGraphDiceSumView.draw(list);
            this.SicBoGraphDice3View.draw(list);
        },

        pageEvent: function () {
            this.checkStatusButton();
        },

        closeClicked: function () {
            //reset truoc khi close cho ko lag
            this.SicBoGraph100View.resetDraw();
            this.SicBoGraphCatCauView.resetDraw();
            this.SicBoGraphDiceSumView.resetDraw();
            this.SicBoGraphDice3View.resetDraw();

            this.animation.play('closePopup');
            var self = this;
            var delay = 0.12;
            cc.AudioController.getInstance().playSound(cc.AudioTypes.SICBO_CLOSE_POPUP);
            cc.director.getScheduler().schedule(function () {
                self.animation.stop();
                cc.SicBoPopupController.getInstance().destroyGraphView();
            }, this, 1, 0, delay, false);
        },

        nextPageClicked: function() {
            this.currentPageIndex++;
            // this.btnNext.node.active = false;
            // this.btnBack.node.active = true;
            this.pageView.scrollToPage(this.currentPageIndex, this.timeSwitchPage);
            this.checkStatusButton();
        },

        backPageClicked: function() {
            this.currentPageIndex--;
            // this.btnNext.node.active = true;
            // this.btnBack.node.active = false;
            this.pageView.scrollToPage(this.currentPageIndex, this.timeSwitchPage);
            this.checkStatusButton();
        },

        checkStatusButton: function () {
            this.currentPageIndex = this.pageView.getCurrentPageIndex();
            if (this.currentPageIndex <  this.totalPages - 1) {
                this.btnNext.node.active = true;
                this.btnBack.node.active = false;
            } else {
                this.btnNext.node.active = false;
                this.btnBack.node.active = true;            }

            if (this.currentPageIndex > 0) {
                this.btnBack.node.active = true;
            } else {
                this.btnBack.node.active = false;
            }
        },
    });
}).call(this);
