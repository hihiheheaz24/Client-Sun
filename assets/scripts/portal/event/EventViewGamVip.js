/**
 * Created by Welcome on 4/18/2019.
 */

var netConfig = require('NetConfig');

(function () {
    cc.EventViewGamVip = cc.Class({
        "extends": cc.PopupBase,
        properties: {
            btnTabs: [cc.Node],
            nodeTabEvents: [cc.Node],
            nodeBusy: cc.Node,

            //sprite icon
            spriteIcon: cc.Sprite,
        },

        onLoad: function () {
            if (this.spriteIcon)
                this.spriteIcon.spriteFrame = cc.LobbyController.getInstance().getGameAssets().icons[cc.Config.getInstance().getIndexIcon(cc.Config.getInstance().getServiceId())];

            this.node.zIndex =  cc.NoteDepth.POPUP_EVENT;
        },

        start: function () {
            cc.EventController.getInstance().setEventView(this);
        },

        onEnable: function () {
            // this.animation.play('openPopup');

            //luu ben banner click
            var startTab = cc.Tool.getInstance().getItem('@startTabEvent');
            if (startTab) {
                this.openTab(parseInt(startTab.toString()));
            } else {
                //mac dinh mo tab 0
                this.openTab(0);
            }
        },

        onDestroy: function () {
            cc.EventController.getInstance().setEventView(null);
        },

        showEventBusy: function () {
            if (this.nodeBusy)
                this.nodeBusy.active = true;
        },

        hideEventBusy: function () {
            if (this.nodeBusy)
                this.nodeBusy.active = false;
        },

        openTab: function (tabIndex) {
            this.deActiveAllTab();

            //bat Tab
            this.btnTabs[tabIndex].getComponent(cc.Toggle).isChecked = true;
            this.nodeTabEvents[tabIndex].active = true;
        },

        deActiveAllTab: function () {
            // this.btnTabs.forEach(function (btnTab) {
            //     btnTab.interactable = true;
            // });

            this.nodeTabEvents.forEach(function (nodeTabEvent) {
                nodeTabEvent.active = false;
            })
        },

        //index tab: 0,1,2, ...
        tabClicked: function (event, data) {
            this.openTab(parseInt(data.toString()));
        },

        closeClicked: function () {
            this.animation.play('closePopup');
            var self = this;
            var delay = 0.2;
            cc.director.getScheduler().schedule(function () {
                self.nodeTabEvents.forEach(function (nodeTabEvent) {
                    nodeTabEvent.active = false;
                });
                self.animation.stop();
                self.closeFinished();
            }, this, 1, 0, delay, false);
        },

        closeFinished: function () {
            this.node.destroy();
        },
    });
}).call(this);
