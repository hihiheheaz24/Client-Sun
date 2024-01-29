/*
 * Generated by BeChicken
 * on 6/10/2019
 * version v1.0
 */
(function () {
    cc.DragonTigerPopupView = cc.Class({
        "extends": cc.PopupViewBase,
        properties: {
            prefabGraph: cc.Prefab, //soi cau
            prefabGroupUser: cc.Prefab,
            popUpWin: cc.Node,
            labelWin: cc.Label
        },

        onLoad: function () {
            cc.DragonTigerPopupController.getInstance().setDragonTigerPopupView(this);
            //this.lbWin =  this.labelWin.node.getComponent(cc.LabelIncrement);
        },
        showPopupWin: function (amount) {
            if(!this.popUpWin) return;
            this.popUpWin.active = true;
            this.popUpWin.getComponent(cc.Animation).play('openPopupWin');
            //this.lbWin.tweenValue(0, amount);
            let self = this;
            setTimeout(function () {
                self.hidePopupWin();
            }, 3000);
        },
        hidePopupWin: function () {
            if(this.popUpWin)
                this.popUpWin.active = false;
        },
        createGraphView: function () {
            this.nodeprefabGraphView = this.createView(this.prefabGraph);
        },
        destroyGraphView: function () {
            if (this.nodeprefabGraphView)
                this.nodeprefabGraphView.destroy();
        },
        createGroupUserView: function () {
            this.nodeGroupUser = this.createView(this.prefabGroupUser);
        },
        destroyGroupUserView: function () {
            if (this.nodeGroupUser)
                this.nodeGroupUser.destroy();
        },

    });
}).call(this);
