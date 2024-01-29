/**
 * Created by Nofear on 6/7/2017.
 */

(function () {
    cc.XXPopupView = cc.Class({
        "extends": cc.PopupViewBase,
        properties: {
            prefabGroupUser: cc.Prefab,
            prefabSetting: cc.Prefab
        },

        onLoad: function () {
            cc.XXPopupController.getInstance().setXXPopupView(this);
        },
        createGroupUserView: function () {
            this.nodeGroupUser = this.createView(this.prefabGroupUser);
        },
        destroyGroupUserView: function () {
            if (this.nodeGroupUser)
                this.nodeGroupUser.destroy();
        },
        createSettingView: function () {
            this.nodeSetting = this.createView(this.prefabSetting);
        },
        destroySettingView: function () {
            if (this.nodeSetting)
                this.nodeSetting.destroy();
        },
    });
}).call(this);
