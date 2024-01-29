
var netConfig = require('NetConfig');

(function () {
    cc.HistoryNew = cc.Class({
        "extends": cc.Component,
        properties: {
            tag: cc.Node,
            tag1: cc.Node,
            profileView: cc.Node,

            DN: cc.Node,
            CGVIN: cc.Node,
            PlayHistory: cc.Node,
            NGVIN: cc.Node,
            TGVIN: cc.Node,

            btnDN: cc.Node,
            btnCGVIN: cc.Node,
            btnPlayHistory: cc.Node,
            btnNGVIN: cc.Node,
            btnGVIN: cc.Node,
            historyView:cc.Prefab
        },
        
        onLoad: function () {
            this.nodeTabActive = this.DN;
            this.activeBtn = this.btnDN;
            this.currentTab = cc.AccountTab.DN;
        },

        onEnable: function () {
            this.nodeTabActive = this.DN;
            this.activeBtn = this.btnDN;
            this.currentTab = cc.AccountTab.DN;

            this.nodeTabActive.active = true;
            this.activeBtn.active = true;
            
            this.tag1.active = false;
            this.tag.active = false;
            this.profileView.active = false;
        },
        getHistoryPayment: function (event, data) {
            if (this.historyNode!=null) {
                this.historyNode.destroy();
            }
            localStorage.setItem('historyRechargeCashoutParams',data);
            this.historyNode = cc.instantiate(this.historyView);
            this.historyNode.parent = this.node;
            this.historyNode.setPosition(0,150);
        },
        changeTabClicked: function (event, data) {
            if (data.toString() === this.currentTab) return;
            this.activeTab(data.toString());
        },

        activeTab (tabName) {

            this.nodeTabActive.active = false;     
            switch (tabName) {
                ////////////////////
                case cc.AccountTab.DN:
                    
                    this.nodeTabActive = this.DN;
                    if (this.historyNode!=null) {
                        this.historyNode.destroy();
                    }
                break;
                case cc.AccountTab.PLAY_HISTORY:
                    if (this.historyNode!=null) {
                        this.historyNode.destroy();
                    }
                    this.nodeTabActive = this.PlayHistory;
                    break;
                case cc.AccountTab.CGVIN:
                    if (this.historyNode!=null) {
                        this.historyNode.destroy();
                    }
                    this.nodeTabActive = this.CGVIN;
                break;
                case cc.AccountTab.NGVIN:
                    this.nodeTabActive = this.NGVIN;
                break;
                case cc.AccountTab.TGVIN:
                    this.nodeTabActive = this.TGVIN;
                break;
            }
            this.nodeTabActive.active = true;
            this.setBtnActive(tabName);
            this.currentTab = tabName;
            
        },

        setBtnActive:function(name)
        {
            this.activeBtn.active = false;
            switch(name)
            {
                case cc.AccountTab.DN:
                    this.activeBtn = this.btnDN;
                break;
                case cc.AccountTab.CGVIN:
                    this.activeBtn = this.btnCGVIN;
                break;
                case cc.AccountTab.PLAY_HISTORY:
                    this.activeBtn = this.btnPlayHistory;
                    break;
                case cc.AccountTab.NGVIN:
                    this.activeBtn = this.btnNGVIN;
                break;
                case cc.AccountTab.TGVIN:
                    this.activeBtn = this.btnGVIN;
                break;
            }
            this.activeBtn.active = true;
        },

        backClick: function () {
            this.profileView.active = true;
            this.nodeTabActive.active = false;
            this.activeBtn.active = false;
            this.node.active = false;
        }
    });
}).call(this);
