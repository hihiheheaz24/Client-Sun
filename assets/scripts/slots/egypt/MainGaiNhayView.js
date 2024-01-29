cc.Class({
    extends: cc.MainView,

    properties: {
        prefabCrazyView: cc.Prefab,
    },



    createCrazyView: function () {
        this.nodeCrazyView = this.createView(this.prefabCrazyView);
    },

    destroyCrazyView: function () {
        if (this.nodeCrazyView)
            this.nodeCrazyView.destroy();
    },
});
