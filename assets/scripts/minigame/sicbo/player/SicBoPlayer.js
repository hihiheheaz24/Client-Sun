/*
 * Generated by BeChicken
 * on 11/13/2019
 * version v1.0
 */
(function () {
    cc.SicBoPlayer = cc.Class({
        "extends": cc.Component,
        properties: {
            lbSID: cc.Label,
            lbName: cc.Label,
            nickName: "",
            winEffectNode:cc.Node,
            winAmount:cc.Label,
            PopUpView:cc.Node,
            isMyUser:true,
            vipSfs:[cc.SpriteFrame]
        },
        onLoad: function () {
            //avatar cua player
            this.avatar = this.node.getComponentInChildren(cc.Avatar);
            //node win/lose cua player
            this.nodeWin = this.node.getChildByName('win');
            this.nodeLose = this.node.getChildByName('lose');

            this.nodeLbMoney = this.node.getChildByName('lbWin');
            this.nodeLbMoney.active = false;
            this.vipSprite = this.node.getChildByName('iconVip').getComponent(cc.Sprite);
            //node thong tin player (name + chip)
            this.nodeInfo = this.node.getChildByName('ava_money');
            //lbChip cua player
            if (this.isMyUser) {
                this.lbChip = this.nodeInfo.getChildByName('lbChip').getComponent(cc.LabelIncrement);
            }
            else this.lbChip = this.nodeInfo.getChildByName('lbChip').getComponent(cc.Label);
            //lbName cua player
            this.nodeInfo.active = false;

            this.listLbWin = []

        },

        //reset lai UI ket qua
        resetPlayerResultUI: function () {
            this.nodeWin.active = false;
            this.nodeLose.active = false;
            this.nodeWin.stopAllActions();
            this.nodeLose.stopAllActions();
            this.listLbWin.forEach(item =>{
                if(cc.isValid(item)){
                    item.stopAllActions();
                    item.destroy();
                }
            })
            this.listLbWin = []
        },
        //set ket qua cho player
        playerResultUI: function (amount, balance) {
            this.nodeWin.active = false;
            this.nodeLose.active = false;
            this.nodeWin.stopAllActions();
            this.nodeLose.stopAllActions();
            //set gia tri
            if (amount) {
                if (balance) {
                    this.updateChip(balance);
                }
                let lbWin = cc.instantiate(this.nodeLbMoney);
                this.node.addChild(lbWin);
                this.listLbWin.push(lbWin)
                lbWin.getComponent(cc.Label).string ='+' + cc.Tool.getInstance().formatNumber(amount);
                lbWin.position = cc.v2(0,50);
                lbWin.active = true;
                lbWin.runAction(cc.sequence(
                    cc.moveTo(0.5, cc.v2(0,85)),
                    cc.delayTime(0.2),
                    cc.fadeOut(0.2),
                    cc.removeSelf()
                ));
                this.nodeWin.active = true;
                this.nodeWin.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.3, 1), cc.scaleTo(0.3, 1.1))));
            } else {
                this.nodeLose.active = true;
                this.nodeLose.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.3, 1), cc.scaleTo(0.3, 1.1))));
              
            }

        },

        updateChip: function (chip) {
            if (this.isMyUser) {
                this.lbChip.tweenValueto(chip);
            }
            else this.lbChip.string = cc.Tool.getInstance().formatNumberSicbo(chip);
            this.balance = chip;
        },
        updateChipNormal: function (chip) {
            if (this.isMyUser) {
                this.lbChip.tweenValueto(chip);
            }
            else 
            this.lbChip.string = cc.Tool.getInstance().formatNumberSicbo(chip);
        },
        //player vao phong
        registerPlayer: function (accountInfo) {
            this.vipSprite.node.active = false;
            let top = cc.SicBoController.getInstance().getAccountTop();
            if (top && top.length) {
                for (let index = 0; index < 3; index++) {
                    if (top[index].DisplayName==accountInfo.NickName) {
                        this.vipSprite.spriteFrame = this.vipSfs[index];
                        this.vipSprite.node.active = true;
                    }
                }
            } else {
                cc.error("AccountTop is null");
            }
            var avatarID = accountInfo.Avatar;
            if (avatarID <= 0) {
                avatarID = 1;
            }
            this.nickName = accountInfo.NickName;

            //set avatar
            this.avatar.setAvatar(cc.AccountController.getInstance().getAvatarImage(avatarID));

            //set name
            // this.lbName.string = accountInfo.NickName;
            if (accountInfo.ServiceID) {
                this.lbSID.string = ""; // cc.Config.getInstance().getServiceNameNoFormat(accountInfo.ServiceID)
                //set name
                this.lbName.string = cc.Config.getInstance().formatName(accountInfo.NickName, 14);
            } else {
                this.lbSID.string = '';
                //set name
                this.lbName.string = cc.Config.getInstance().formatName(accountInfo.NickName, 14);
            }
            //set chip
            
            if (this.isMyUser) {
                this.lbChip.tweenValueto(accountInfo.Balance);
            }
            else this.lbChip.string = cc.Tool.getInstance().formatNumberSicbo(accountInfo.Balance);
            this.balance = accountInfo.Balance;

            //bat node thong tin
            this.nodeInfo.active = true;
        },
        //player roi phong
        unRegisterPlayer: function () {
           //set = avatar def
           this.avatar.setAvatar( cc.LobbyController.getInstance().getGameAssets().avatarDef);
           //tat node thong tin
           this.nodeInfo.active = false;
        },

        updateConnectionStatus: function (status) {
            switch (status) {
                case cc.ConnectionStatus.DISCONNECTED:
                    break;
                case cc.ConnectionStatus.CONNECTED:
                    break;
            }
        },

        updatePlayerStatus: function (playerStatus) {
            this.playerStatus = playerStatus.toString();
            if (playerStatus.toString() === cc.PlayerStatus.INGAME) {
                this.node.opacity = 255;
            } else {
                this.node.opacity = 150;
            }
        },

        showWinAmount:function(amount,newBalance)
        {
            this.winAmount.string = "+"+cc.Tool.getInstance().formatNumberSicbo(amount);
            this.winEffectNode.getComponent(cc.Animation).play("showWinEffectSicbo");
            if (newBalance) {
                this.updateChip(newBalance);
            }
            this.balance = newBalance;
            var self = this;
            setTimeout(() => {
                self.hideWinAmount();
            }, 5000);
        },
        onDestroy: function () {
            this.unRegisterPlayer();
        },
        hideWinAmount:function()
        {
            this.winEffectNode.getComponent(cc.Animation).play("hideWinEffectSicbo");
        },
        showInfo:function()
        {
            let avatar = this.PopUpView.getChildByName('avatar');
            let lbName = this.PopUpView.getChildByName('lbName');
            let lbChip = this.PopUpView.getChildByName('chip').getChildByName('lbChip');
            avatar.getComponent(cc.Sprite).spriteFrame = this.avatar.node.getComponent(cc.Sprite).spriteFrame;
            lbName.getComponent(cc.Label).string = this.nickName;
            lbChip.getComponent(cc.Label).string = cc.Tool.getInstance().formatNumber(this.balance);
            this.PopUpView.active = true;
            this.PopUpView.getComponent(cc.Animation).play('sicboInfoPopup');
           
        }
    })
}).call(this);