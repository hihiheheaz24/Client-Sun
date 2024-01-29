/**
 * Created by Welcome on 5/28/2019.
 */

(function () {
    cc.LiveXXPlayer = cc.Class({
        "extends": cc.Component,
        properties: {
            lbSID: cc.Label,
            lbName: cc.Label,
            nickName: ""
        },

        onLoad: function () {
            //animation
            this.animation = this.node.getComponent(cc.Animation);

            //avatar cua player
            this.avatar = this.node.getComponentInChildren(cc.Avatar);
            //node win/lose cua player
            this.nodeWin = this.node.getChildByName('win');
            this.nodeLose = this.node.getChildByName('lose');

            this.nodeLbMoney = this.node.getChildByName('lbWin');
            this.nodeLbMoney.active = false;

            //node thong tin player (name + chip)
            this.nodeInfo = this.node.getChildByName('ava_money');
            //lbChip cua player
            this.lbChip = this.nodeInfo.getChildByName('lbChip').getComponent(cc.LabelIncrement);
            //lbName cua player
            // this.lbName = this.nodeInfo.getChildByName('lbName').getComponent(cc.Label);

            this.nodeInfo.active = false;

            this.listLbWin = []

        },

        //reset lai UI ket qua
        resetPlayerResultUI: function () {
            this.nodeWin.active = false;
            this.nodeLose.active = false;
            this.nodeLbMoney.active = false;
            this.nodeWin.stopAllActions();
            this.nodeLose.stopAllActions();
        },

        //set ket qua cho player
        playerResultUI: function (isWin, amount) {

            cc.warn("playerResultUI", isWin, amount)
            this.nodeLbMoney.active = false;
            this.nodeWin.active = false;
            this.nodeLose.active = false;
            //set gia tri
            if (isWin) {
                this.nodeLbMoney.getComponent(cc.Label).string ='+' + cc.Tool.getInstance().formatNumber(amount);
                this.nodeLbMoney.active = true;
                this.nodeLbMoney.getComponent(cc.Animation).play('xxWin');
                this.nodeWin.active = true;
                this.nodeWin.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.3, 1), cc.scaleTo(0.3, 1.1))));
            } else {
                this.nodeLose.active = true;
                this.nodeLose.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.3, 1), cc.scaleTo(0.3, 1.1))));
              
            }
        },
        updateChip: function (chip) {
            this.lbChip.tweenValueto(chip);
        },

        //player vao phong
        registerPlayer: function (accountInfo) {
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
            this.lbChip.tweenValueto(accountInfo.Balance);

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

    });
}).call(this);
