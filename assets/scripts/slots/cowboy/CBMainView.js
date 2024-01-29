
cc.Class({
    extends: require('MainView'),

    properties: {
        prefabTreasure: cc.Prefab,
    },


    createTreasureView: function () {
        this.nodeTreasureView = this.createView(this.prefabTreasure);
    },

    destroyTreasureView: function () {
        if (this.nodeTreasureView)
            this.nodeTreasureView.destroy();
    },

    destroyHelpView: function () {
        this._super();
        this.destroyTreasureView();
      
    },

    treasureClicked: function () {
        this.createTreasureView();
    },


});
