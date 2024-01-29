(function () {
    cc.Xeng777BetView = cc.Class({
        extends: cc.Component,

        properties: {
            spDotLed: sp.Skeleton,
            spBgLed: sp.Skeleton,
            btnBets: [cc.Node],
            items: [cc.Node],
        },

        onLoad() {
            this.controller = cc.Xeng777Controller.getInstance();

            this.controller.setBetView(this);
        },

        onDestroy: function () {
            this.controller.setBetView(null);
        }
    });
}).call(this);