/**
 * Created by Nofear on 3/15/2019.
 */

(function () {
    cc.MyJackpotView = cc.Class({
        "extends": cc.Component,
        properties: {
            nodeTaiXiu: cc.Node,
            nodeMinipoker: cc.Node,
            nodeCaoThap: cc.Node,
            nodePhucSinh: cc.Node,
            nodeLuckyWild: cc.Node,
            nodeBauCua: cc.Node,
            nodeXoSo: cc.Node,
            nodeBaCay: cc.Node,
            nodePoker: cc.Node,
            nodeTLMN: cc.Node,
            nodeSam: cc.Node,
            nodeMB: cc.Node,
            nodeCatte: cc.Node,
            nodeXocDia: cc.Node,
            nodeBlackJack: cc.Node,
            nodeRongHo: cc.Node,
            nodeBacarrat: cc.Node,
            nodeSicBo: cc.Node,
            nodeRoulette: cc.Node,
        },

        onLoad() {
            this.nodeTabActive = this.nodeTaiXiu;
            this.currentTab = cc.GuideEnum.TAIXIU;
            this.nodeTabActive.active = true;
            this.node.zIndex = cc.NoteDepth.POPUP_SYSTEM;
        },

        changeTabClicked: function (event, data) {
            if (data.toString() === this.currentTab) return;
            this.activeTab(data.toString());
        },

        onEnable() {
            this.activeTab(cc.GuideEnum.TAIXIU);
        },

        activeTab (tabName) {
            this.nodeTabActive.active = false;
            switch (tabName) {
                case cc.GuideEnum.TAIXIU:
                    this.nodeTabActive = this.nodeTaiXiu;
                    break;
                case cc.GuideEnum.MINIPOKER:
                    this.nodeTabActive = this.nodeMinipoker;
                    break;
                case cc.GuideEnum.CAO_THAP:
                    this.nodeTabActive = this.nodeCaoThap;
                    break;
                case cc.GuideEnum.PHUC_SINH:
                    this.nodeTabActive = this.nodePhucSinh;
                    break;
                case cc.GuideEnum.LUCKY_WILD:
                    this.nodeTabActive = this.nodeLuckyWild;
                    break;
                case cc.GuideEnum.BAUCUA:
                    this.nodeTabActive = this.nodeBauCua;
                    break;
                case cc.GuideEnum.XOSO:
                    this.nodeTabActive = this.nodeXoSo;
                    break;
                case cc.GuideEnum.BACAY:
                    this.nodeTabActive = this.nodeBaCay;
                    break;
                case cc.GuideEnum.POKER:
                    this.nodeTabActive = this.nodePoker;
                    break;
                case cc.GuideEnum.TLMN:
                    this.nodeTabActive = this.nodeTLMN;
                    break;
                case cc.GuideEnum.MAUBINH:
                    this.nodeTabActive = this.nodeMB;
                    break;
                case cc.GuideEnum.CATTE:
                    this.nodeTabActive = this.nodeCatte;
                    break;
                case cc.GuideEnum.XOCDIA:
                    this.nodeTabActive = this.nodeXocDia;
                    break;
                case cc.GuideEnum.BLACKJACK:
                    this.nodeTabActive = this.nodeBlackJack;
                    break;
                case cc.GuideEnum.RONG_HO:
                    this.nodeTabActive = this.nodeRongHo;
                    break;
                case cc.GuideEnum.BACARRAT:
                    this.nodeTabActive = this.nodeBacarrat;
                    break;
                case cc.GuideEnum.SICBO:
                    this.nodeTabActive = this.nodeSicBo;
                    break;
                case cc.GuideEnum.ROULETTE:
                    this.nodeTabActive = this.nodeRoulette;
                    break;
                case cc.GuideEnum.SAM:
                    this.nodeTabActive = this.nodeSam;
                    break;
            }
            this.nodeTabActive.active = true;
            this.currentTab = tabName;
        },
    });
}).call(this);
