/*
 * Generated by BeChicken
 * on 11/15/2019
 * version v1.0
 */
(function () {
    cc.BauCuaMenuView = cc.Class({
        "extends": cc.Component,
        properties: {
            animation: cc.Animation
        },

        onLoad: function () {
            this.openPopup = false;
        },

        openSettingClicked: function () {
            if (this.openPopup == false) {
                this.openPopup = true;
                this.animation.play('openSetting');
            } else {
                this.openPopup = false;
                this.animation.play('closeSetting');
            }
        }
    });
}).call(this)
