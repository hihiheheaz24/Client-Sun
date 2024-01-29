cc.Class({
    extends: require('TTPopupItem'),
    properties: {
        pageViewContent: cc.ScrollView
    },

    show() {
        this._super();
        this.pageViewContent.scrollToTop();
    },

});
