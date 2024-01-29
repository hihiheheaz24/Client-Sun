/**
 * Created by Nofear on 3/15/2019.
 */


(function () {
    cc.ChatItem = cc.Class({
        "extends": cc.Component,
        properties: {
            nodeUser: cc.Node,
            //lbSID: cc.Label,
            lbMessage: cc.Label,
            lbMessageTaiXiu: cc.RichText,
            lbUser: cc.Label,
            spriteVIP: cc.Sprite,

            rtAdmin: cc.RichText,
            gameId: 'normal'
        },

        onLoad: function () {
            this.gameAssets = cc.LobbyController.getInstance().getGameAssets();
        },

        updateItem: function(item, itemID) {

            this.item = item;
            this.itemID = itemID;
            if (item.ad) {
                if (this.gameId=='xocdialive') {
                    console.log(item);
                    let topTipNode = this.nodeUser.getChildByName('TopTip');
                    topTipNode.getChildByName('icon').active = false;
                    topTipNode.getChildByName('vipIcon').active = false;

                    if (item.ic&&item.ic>0) {
                        topTipNode.active = true;
                        let sfTopTip = cc.LiveXXController.getInstance().getTopTipIcon();
                        let skeDataTopTip = cc.LiveXXController.getInstance().getSkeletonTopTipData();
                        if (item.ic>3) {
                            topTipNode.getChildByName('icon').getComponent(cc.Sprite).spriteFrame = sfTopTip[item.ic-1];
                            topTipNode.getChildByName('icon').active = true;
                        }
                        else
                        {
                            topTipNode.getChildByName('vipIcon').active = true;
                            topTipNode.getChildByName('vipIcon').getComponent(sp.Skeleton).skeletonData = skeDataTopTip[item.ic-1];
                            topTipNode.getChildByName('vipIcon').getComponent(sp.Skeleton).setAnimation(0,'animation', true);
                        }
                        let chat = item.c.split(' ');
                        let userName = chat[0];
                        let money = chat[chat.length-1];
                        let message = item.c.replace(userName,'');
                        message = message.replace(money,'');
                        let extraSpace = '';
                        switch (item.ic) {
                            case 1:
                                extraSpace = "                          "
                                break;
                            case 2:
                                extraSpace = "                        "
                                break;
                            case 3:
                                extraSpace = "                       "
                                break;
                            default:
                                extraSpace = "            "
                                break;
                        }
                        this.lbMessageTaiXiu.string = extraSpace+'<color=#FFF500>' + userName + ': </color>' + message+ ' <color=#FFF500>' + money + '</color>';
                        this.nodeUser.active = true;
                    }
                    else{
                        this.lbMessageTaiXiu.string = '<color=#FFF500>' + "Hệ thống" + ': </color>' + item.c;
                    }
                return;
            }
            this.nodeUser.active = false;
            this.rtAdmin.node.active = true;
            this.rtAdmin.string = this.formatChatUser(item);
                
            } else {
               // this.nodeUser.active = true;
                this.rtAdmin.node.active = false;

                //this.lbSID.string = cc.Config.getInstance().getServiceNameNoFormat(item.s);
                // this.lbName.string = item.n + ':';
                if (this.gameId=='taixiu') {
                    this.lbMessageTaiXiu.string = '<color=#00FF2B>' + item.n + ': </color>' + item.c;
                }
                else if (this.gameId=='xocdialive') {
                    let topTipNode = this.nodeUser.getChildByName('TopTip');
                    topTipNode.getChildByName('icon').active = false;
                    topTipNode.getChildByName('vipIcon').active = false;
                    if (item.ic&&item.ic>0) {
                        topTipNode.active = true;
                        let sfTopTip = cc.LiveXXController.getInstance().getTopTipIcon();
                        let skeDataTopTip = cc.LiveXXController.getInstance().getSkeletonTopTipData();
                        if (item.ic>3) {
                            topTipNode.getChildByName('icon').getComponent(cc.Sprite).spriteFrame = sfTopTip[item.ic-1];
                            topTipNode.getChildByName('icon').active = true;
                        }
                        else
                        {
                            topTipNode.getChildByName('vipIcon').active = true;
                            topTipNode.getChildByName('vipIcon').getComponent(sp.Skeleton).skeletonData = skeDataTopTip[item.ic-1];
                            topTipNode.getChildByName('vipIcon').getComponent(sp.Skeleton).setAnimation(0,'animation', true);
                        }
                        let extraSpace = '';
                        switch (item.ic) {
                            case 1:
                                extraSpace = "                          "
                                break;
                            case 2:
                                extraSpace = "                        "
                                break;
                            case 3:
                                extraSpace = "                       "
                                break;
                            default:
                                extraSpace = "            "
                                break;
                        }
                        this.lbMessageTaiXiu.string = extraSpace+'<color=#FFF500>' + item.n + ': </color>' + item.c;
                        return;
                    }
                    else{
                        this.lbMessageTaiXiu.string = '<color=#00FF2B>' + item.n + ': </color>' + item.c;
                    }
                }
                else{
                    this.lbMessage.string = item.c;
                    this.lbUser.string = item.n + ":" ;
                }
            }

        },


        formatChatUser: function (chatItem) {//
            //var hubName = cc.Config.getInstance().getServiceName(chatItem.s.toString());
            //chat cua admin
            if (chatItem.ad) {//
                return '<color=#FCE700>' + chatItem.n + ': </color>' + chatItem.c;
            } else {
                return '<color=#06EEFA>' + chatItem.n + ': </color>' + chatItem.c;
            }
        },
    });
}).call(this);
