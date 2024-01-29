/**
 * Dat cuoc
 */

(function () {
    cc.TaiXiuBetView = cc.Class({
        "extends": cc.Component,
        properties: {
            lbBetTai: cc.Label,
            lbBetXiu: cc.Label,
            nodetai: cc.Node,
            nodexiu: cc.Node,
        },

        onLoad: function () {
            cc.TaiXiuController.getInstance().setTaiXiuBetView(this);
            //this.reset();
        },
        
        onDestroy: function () {
            cc.TaiXiuController.getInstance().setTaiXiuBetView(null);
        },

        reset: function () {
            this.lbBetTai.string = '';
            this.lbBetXiu.string = '';
            this.nodetai.active = false;
            this.nodexiu.active = false;

        },

        updateBetInfo: function (betInfo) {
            this.betSide = betInfo.BetSide;

            if (betInfo.BetSide === cc.TaiXiuBetSide.TAI) {
                this.nodetai.active = true;

                this.lbBetTai.string = cc.Tool.getInstance().formatNumber(betInfo.BetValue);
            } else {
                this.nodexiu.active = true;
                this.lbBetXiu.string = cc.Tool.getInstance().formatNumber(betInfo.BetValue);
            }

        },

        getBetSide: function () {
            return this.betSide;
        },
    });
}).call(this);
