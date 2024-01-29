/**
 * effect ket qua,
 */

(function () {
    cc.TaiXiuResultEffectView = cc.Class({
        "extends": cc.Component,
        properties: {
            lbWin: cc.Label,
        },

        onLoad: function () {
            //setView
            cc.TaiXiuController.getInstance().setTaiXiuResultEffectView(this);
            this.animationWin = this.lbWin.node.getComponent(cc.Animation);
        },

        onDestroy: function () {
            cc.TaiXiuController.getInstance().setTaiXiuResultEffectView(this);
        },

        reset: function () {
            //ẩn text
            this.lbWin.node.active = false;
        },
        
        playEffectWin: function (amount) {
            //hien text
            this.lbWin.node.active = true;
            //play anim
            this.animationWin.play('winFade');
            //gan gia tri
            this.lbWin.string = '+' + cc.Tool.getInstance().formatNumber(amount);           
        }
    });
}).call(this);
