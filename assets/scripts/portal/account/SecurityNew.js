
var netConfig = require('NetConfig');

(function () {
    cc.SecurityNew = cc.Class({
        "extends": cc.Component,
        properties: {
            tag: cc.Node,
            tag1: cc.Node,
            profileView: cc.Node,

            TTBM: cc.Node,
            Safe: cc.Node,
            BMDN: cc.Node,
            KAT: cc.Node,
            QLG: cc.Node,

            btnTTBM: cc.Node,
            btnSafe: cc.Node,
            btnBMDN: cc.Node,
            btnKAT: cc.Node,
            btnQLG: cc.Node,

            lbUserName: cc.Label,
            lbUserName1: cc.Label,
            lbBalance: cc.Label,
        },
        
        onLoad: function () {
            this.nodeTabActive = this.TTBM;
            this.activeBtn = this.btnTTBM;
            this.currentTab = cc.AccountTab.TTBM;
        },

        onEnable: function () {
            this.nodeTabActive = this.TTBM;
            this.activeBtn = this.btnTTBM;
            this.currentTab = cc.AccountTab.TTBM;
            this.nodeTabActive.active = true;
            this.activeBtn.active = true;
            
            this.tag1.active = false;
            this.tag.active = false;
            this.profileView.active = false;

            this.lbUserName.string = `${cc.Tool.getInstance().getItem('@username').toString()}`;
            this.lbUserName1.string = `${cc.Tool.getInstance().getItem('@username').toString()}`;
            this.lbBalance.string = cc.Tool.getInstance().formatNumber(cc.LoginController.getInstance().getLoginResponse().Balance);
        },

        changeTabClicked: function (event, data) {
            if (data.toString() === this.currentTab) return;
            this.activeTab(data.toString());
        },

        activeTab (tabName) {   
            this.nodeTabActive.active = false;     
            switch (tabName) {
                ////////////////////
                case cc.AccountTab.TTBM:
                    this.nodeTabActive = this.TTBM;
                break;
                case cc.AccountTab.SAFE:
                    this.nodeTabActive = this.Safe;
                break;
                case cc.AccountTab.BMDN:
                    this.nodeTabActive = this.BMDN;
                break;
                case cc.AccountTab.KAT:
                    this.nodeTabActive = this.KAT;
                break;
                case cc.AccountTab.QLG:
                    this.nodeTabActive = this.QLG;
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
                case cc.AccountTab.TTBM:
                    this.activeBtn = this.btnTTBM;
                break;
                case cc.AccountTab.SAFE:
                    this.activeBtn = this.btnSafe;
                break;
                case cc.AccountTab.BMDN:
                    this.activeBtn = this.btnBMDN;
                break;
                case cc.AccountTab.KAT:
                    this.activeBtn = this.btnKAT;
                break;
                case cc.AccountTab.QLG:
                    this.activeBtn = this.btnQLG;
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
