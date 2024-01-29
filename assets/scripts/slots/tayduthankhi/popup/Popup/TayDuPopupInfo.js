cc.Class({
    extends: require('TayDuPopupItem'),
    properties: {
        pageViewContent: cc.ScrollView
    },

    show() {
        this._super();
        this.pageViewContent.scrollToTop();
    },

});
