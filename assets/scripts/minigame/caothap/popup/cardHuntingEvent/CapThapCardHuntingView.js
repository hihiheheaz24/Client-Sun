const CONFIG_PAGE = {
    DAILY_RANKINGS: 0,
    FINAL_RANKINGS: 1,
    EVENT_RULES: 2,
};

cc.Class({
    extends: cc.Component,
    properties: {
        toggleContainer: cc.ToggleContainer,
        pageDailyRankings: require("CaoThapDailyRankings"),
        pageFinalRankings: require("CaoThapFinalRankings"),
        pageEventRuleView: require("CaoThapEventRuleView"),
        _choiceIndex: -1,
    },

    onLoad() {
        this.node.show = this.show.bind(this);
    },

    show(pageIndex = CONFIG_PAGE.DAILY_RANKINGS) {
        this._initialized = false;
        this._choiceIndex = parseInt(pageIndex);
        const toggleChecked = (this.toggleContainer.toggleItems[this._choiceIndex].isChecked = true);
        this.toggleContainer.updateToggles(toggleChecked);
        this._initialized = true;
        this.updatePage(this._choiceIndex);
    },

    updatePage(index) {
        this.pageDailyRankings.hide();
        this.pageFinalRankings.hide();
        this.pageEventRuleView.hide();
        switch (index) {
            case CONFIG_PAGE.DAILY_RANKINGS: {
                this.pageDailyRankings.show();
                break;
            }
            case CONFIG_PAGE.FINAL_RANKINGS: {
                this.pageFinalRankings.show();
                break;
            }
            case CONFIG_PAGE.EVENT_RULES: {
                this.pageEventRuleView.show();
                break;
            }
        }
    },

    onClick(event, index) {
        if (this._choiceIndex == parseInt(index)) return;
        this._choiceIndex = parseInt(index);
        this.updatePage(this._choiceIndex);
    },

    closeClicked() {
        this.node.destroy();
    },
});
