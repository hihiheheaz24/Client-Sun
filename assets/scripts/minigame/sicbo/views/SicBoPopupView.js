/*
 * Generated by BeChicken
 * on 11/13/2019
 * version v1.0
 */
(function () {
    cc.SicBoPopupView = cc.Class({
        "extends": cc.PopupViewBase,
        properties: {
            prefabGroupUser: cc.Prefab,
            prefabGraph: cc.Prefab,
            chatView:cc.Prefab,
            maxBetView:cc.Prefab,
            settingView:cc.Prefab

        },
        createGroupUserView: function () {
            cc.AudioController.getInstance().playSound(cc.AudioTypes.SICBO_OPEN_POPUP);

            this.nodeGroupUser = this.createView(this.prefabGroupUser); 
        },
        clickSound:function()
        {
            cc.AudioController.getInstance().playSound(cc.AudioTypes.SICBO_OPEN_POPUP);
        },
        destroyGroupUserView: function () {
            if (this.nodeGroupUser)
                this.nodeGroupUser.destroy();
        },
        createChatView: function () {
            cc.AudioController.getInstance().playSound(cc.AudioTypes.SICBO_OPEN_POPUP);
            this.nodeChat = this.createView(this.chatView); 
        },
        destroyChatView: function () {
            if (this.nodeChat)
                this.nodeChat.destroy();
        },
        createMaxBetView: function () {
            cc.AudioController.getInstance().playSound(cc.AudioTypes.SICBO_OPEN_POPUP);
            this.nodeMaxBet = this.createView(this.maxBetView); 
        },
        destroyMaxBetView: function () {
            if (this.nodeMaxBet)
                this.nodeMaxBet.destroy();
        },
        createSettingView: function () {
            cc.AudioController.getInstance().playSound(cc.AudioTypes.SICBO_OPEN_POPUP);
            this.nodeSetting = this.createView(this.settingView); 
        },
        destroySettingView: function () {
            if (this.nodeSetting)
                this.nodeSetting.destroy();
        },
        onLoad: function () {
            cc.SicBoPopupController.getInstance().setPopupView(this);
            
        },
        createGraphView: function () {
            cc.AudioController.getInstance().playSound(cc.AudioTypes.SICBO_OPEN_POPUP);
            this.nodeGraph = this.createView(this.prefabGraph);
        },
        destroyGraphView: function () {
            if (this.nodeGraph)
                this.nodeGraph.destroy();
        },
        selectRuleTab:function(event,data)
        {
            cc.AudioController.getInstance().playSound(cc.AudioTypes.CHIP_SELECT);
                localStorage.setItem("currentRuleSicboTab",data);
        },
    });
}).call(this);