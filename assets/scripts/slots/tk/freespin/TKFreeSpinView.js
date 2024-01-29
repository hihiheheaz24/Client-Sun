/**
 * Created by Nofear on 3/27/2019.
 */

(function () {
    cc.FreeSpinView = cc.Class({
        "extends": cc.Component,
        properties: {
            lbFreeSpinText: cc.Label,
        },

        onLoad: function () {
            cc.FreeSpinController.getInstance().setFreeSpinView(this);
        },

        activeFreeSpin: function (enable) {
            //danh dau trang thai freespin
            cc.FreeSpinController.getInstance().setStateFreeSpin(enable);

            //set cac UI tuong ung
            if (enable) {
                this.lbFreeSpinText.node.parent.active = true;

            } else {
                this.lbFreeSpinText.node.parent.active = false;
            }
        },

       
        updateFreeSpinText: function (totalFreeSpin) {
            this.lbFreeSpinText.string = 'Lượt quay miễn phí: ' + totalFreeSpin;

            if (totalFreeSpin === 0) {
                this.lbFreeSpinText.node.parent.active = false;
            } else {
                this.lbFreeSpinText.node.parent.active = true;
            }
        },
    });
}).call(this);