/**
 * Created by Nofear on 6/7/2017.
 */

(function () {
    cc.LiveXXPopupView = cc.Class({
        "extends": cc.PopupViewBase,
        properties: {
            prefabGroupUser: cc.Prefab,
            TopTipPrefab: cc.Prefab,
            JackpotHistoryPrefab:cc.Prefab
        },

        onLoad: function () {
            cc.LiveXXPopupController.getInstance().setLiveXXPopupView(this);
        },
        createGroupUserView: function () {
            this.nodeGroupUser = this.createView(this.prefabGroupUser);
        },
        destroyGroupUserView: function () {
            if (this.nodeGroupUser)
            {
                this.nodeGroupUser.destroy();
            }
        },
        createTopTipView: function () {
            this.nodeTopTip = this.createView(this.TopTipPrefab);
        },
        destroyTopTipView: function () {
            if (this.nodeTopTip)
            {
                this.nodeTopTip.destroy();

            }
        },
        createJackpotHistoryView: function () {
            this.nodeJackpotHistory = this.createView(this.JackpotHistoryPrefab);
        },
        destroyJackpotHistoryView: function () {
            if (this.nodeJackpotHistory)
            {
                this.nodeJackpotHistory.destroy();
            }
        },

    });
}).call(this);
