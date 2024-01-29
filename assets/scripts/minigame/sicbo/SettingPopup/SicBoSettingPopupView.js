/*
 * Generated by BeChicken
 * on 11/15/2019
 * version v1.0
 */
(function () {
    cc.SicBoSettingPopupView = cc.Class({
        "extends": cc.Component,
        properties: {
            animation: cc.Animation,
            nodeChatOn:cc.Node,
            nodeMusicOn:cc.Node,
            nodeSoundOn:cc.Node
        },

        start: function () {
            //Check Sound            
            this.chat = cc.sys.localStorage.getItem("@ChatSicBo")=='true';
            this.sound = cc.sys.localStorage.getItem("@SoundSicBo")=='true';
            this.music = cc.sys.localStorage.getItem("@MusicSicBo")=='true';
            this.nodeChatOn.active = this.chat;
            this.nodeMusicOn.active = this.music;
            this.nodeSoundOn.active = this.sound;
        },

        openSettingClicked: function () {
            this.animation.play('openPopup');
            cc.AudioController.getInstance().playSound(cc.AudioTypes.SICBO_OPEN_POPUP);
        },

        closeSettingClicked: function () {
            this.animation.play('closePopup');
            cc.AudioController.getInstance().playSound(cc.AudioTypes.SICBO_CLOSE_POPUP);
            setTimeout(() => {
                cc.SicBoPopupController.getInstance().destroySettingView();
            }, 500);
        },

        soundClicked: function () {
            this.sound = !this.sound;
            localStorage.setItem("@SoundSicBo", this.sound?'true':'false');
            this.nodeSoundOn.active = this.sound;
            cc.AudioController.getInstance().enableSound(this.sound);
        },

        musicClicked: function () {
            this.music = !this.music;
            localStorage.setItem("@MusicSicBo", this.music?'true':'false');
            this.nodeMusicOn.active = this.music;
            cc.AudioController.getInstance().enableMusic(this.music);
        },
        chatClicked: function () {
            this.chat = !this.chat;
            localStorage.setItem("@ChatSicBo", this.chat?'true':'false');
            this.nodeChatOn.active = this.chat;
            cc.SicBoController.getInstance().enableChat(this.chat);
        },

    });
}).call(this)
