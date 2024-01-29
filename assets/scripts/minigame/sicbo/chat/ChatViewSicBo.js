// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        itemChatText:cc.Node,
        itemChatEmoji:cc.Node,
        content:cc.Node,
        layoutEmoji:cc.Node,
        textChat:cc.EditBox
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.controller = cc.SicBoController.getInstance();
        this.controller.setChatView(this);
        this.animation = this.node.getComponent(cc.Animation);
        this.animation.play('swipe').wrapMode = cc.WrapMode.Normal;
    },
    resetList:function()
    {
        for (let index = 0; index < this.content.children.length; index++) {
            this.content.children[index].destroy(); 
        }
    },
    insertChat:function(data)
    {
        if (data[1].startsWith('emojitxt')) {
            let itemChat = cc.instantiate(this.itemChatEmoji);
            itemChat.getComponent('ChatItemEmoji').updateMessage(data);
            itemChat.parent = this.content;
        }
        else
        {
            let itemChat = cc.instantiate(this.itemChatText);
            itemChat.getComponent('ChatItemText').updateMessage(data);
            itemChat.parent = this.content;
        }
    },
    sendChat:function()
    {
        if (this.textChat.string=="") {
            return;
        }
        this.controller.sendChat(this.textChat.string);
        this.textChat.string = "";
    },
    sendEmoji:function(event,data)
    {
        this.controller.sendChat("emojitxt:"+data);
        this.closeEmojiList();
    },
    closeClicked: function () {
        this.resetList();
        this.animation.play('swipe').wrapMode = cc.WrapMode.Reverse;
        var self = this;
        var delay = 0.4;
        cc.AudioController.getInstance().playSound(cc.AudioTypes.SICBO_CLOSE_POPUP);
        cc.director.getScheduler().schedule(function () {
            self.animation.stop();
            cc.SicBoPopupController.getInstance().destroyChatView();
        }, this, 1, 0, delay, false);
    },
    openEmojiList:function()
    {
        this.layoutEmoji.getComponent(cc.Animation).play('OpenLayoutEmoji').wrapMode = cc.WrapMode.Normal;
        this.isOpenLayoutEmoji = true;
    },
    closeEmojiList:function()
    {
        if (this.isOpenLayoutEmoji) {
            this.layoutEmoji.getComponent(cc.Animation).play('OpenLayoutEmoji').wrapMode = cc.WrapMode.Reverse;
            this.isOpenLayoutEmoji = false;

        }
    }
});
