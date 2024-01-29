/**
 * Created by Nofear on 6/7/2017.
 */

(function () {
    cc.Seven77PopupView = cc.Class({
        "extends": cc.PopupViewBase,
        properties: {
            prefabEventHelp: cc.Prefab,
        },

        onLoad: function () {
            cc.Seven77PopupController.getInstance().setSeven77PopupView(this);
        },

        createEventHelpView: function () {
            this.nodeEventHelpView = this.createView(this.prefabEventHelp);
        },

        destroyEventHelpView: function () {
            if (this.nodeEventHelpView)
                this.nodeEventHelpView.destroy();
        },
    });
}).call(this);
