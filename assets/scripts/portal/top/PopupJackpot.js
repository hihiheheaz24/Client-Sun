cc.Class({
    extends: cc.Component,

    properties: {
        nodeListJackpot: cc.Node,
        nodeEvent: cc.Node,
        nodeHonor: cc.Node,
        nodeMyJackpot: cc.Node,
        nodeGuide: cc.Node,
    },

    onLoad() {
        this.nodeTabActive = this.nodeListJackpot;
        this.currentTab = cc.PopupJackpotEnum.JACKPOT;
        this.nodeTabActive.active = true;
        this.node.zIndex = cc.NoteDepth.POPUP_SYSTEM;
        this.node.runAction(cc.fadeIn(0.2));
        cc.TopController.getInstance().setTopView(this);
    },

    changeTabClicked: function (event, data) {
        if (data.toString() === this.currentTab) return;
        this.activeTab(data.toString());
    },

    onEnable() {
        this.activeTab(cc.PopupJackpotEnum.JACKPOT);
    },

    activeTab (tabName) {
        this.nodeTabActive.active = false;
        switch (tabName) {
            case cc.PopupJackpotEnum.JACKPOT:
                this.nodeTabActive = this.nodeListJackpot;
                break;
            case cc.PopupJackpotEnum.EVENT:
                this.nodeTabActive = this.nodeEvent;
                break;
            case cc.PopupJackpotEnum.HONOR:
                this.nodeTabActive = this.nodeHonor;
                break;
            case cc.PopupJackpotEnum.MY_JACKPOT:
                this.nodeTabActive = this.nodeMyJackpot;
                break;
            case cc.PopupJackpotEnum.GUIDE:
                this.nodeTabActive = this.nodeGuide;
                break;
        }
        this.nodeTabActive.active = true;
        this.currentTab = tabName;
    },

    closeClicked: function () {
        this.node.runAction(cc.fadeOut(0.2));
        this.scheduleOnce(() => {
            cc.LobbyController.getInstance().destroyPopupJackpotView();
        }, 0.2);
    }
});
