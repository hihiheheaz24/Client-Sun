cc.Class({
    extends: cc.Component,

    properties: {
        spriteSound: cc.Sprite,
        sfSounds: [cc.SpriteFrame],
    },

    start: function () {
        //Check Sound
        this.sound = cc.Tool.getInstance().getItem("@Sound").toString() === 'true';
        this.music = this.sound;

        this.spriteSound.spriteFrame = this.sound ? this.sfSounds[0] : this.sfSounds[1];

        // cc.AudioController.getInstance().enableSound(this.sound);
        // cc.AudioController.getInstance().enableMusic(this.sound);
    },

    soundClicked: function () {
        cc.AudioController.getInstance().playSound(cc.AudioTypes.NORMAL_CLICK);
        this.sound = !this.sound;
        this.music = this.sound;
        cc.Tool.getInstance().setItem("@Sound", this.sound);
        cc.Tool.getInstance().setItem("@Music", this.music);
        this.spriteSound.spriteFrame = this.sound ? this.sfSounds[0] : this.sfSounds[1];
        cc.AudioController.getInstance().enableSound(this.sound);
        cc.AudioController.getInstance().enableMusic(this.music);
    },
});
