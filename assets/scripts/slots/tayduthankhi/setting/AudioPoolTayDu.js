// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
const SoundStateEnum = {
    NONE: 0,
    PLAYING: 1
};
cc.Class({
    extends: cc.Component,

    properties: {
        audioClips:[cc.AudioClip],
        spriteBGMusicBtn:cc.Sprite,
        sfsBGMusicBtn:[cc.SpriteFrame],
        spriteSoundFxBtn:cc.Sprite,
        sfsSoundFxBtn:[cc.SpriteFrame],
    },
    onLoad()
    {
        cc.TayDuThanKhiController.getInstance().setAudioPool(this);
        this.bgMusicStatus = (localStorage.getItem("bgMusicStatus")||"On")=="On";
        this.soundFxStatus = (localStorage.getItem("soundFxStatus")||"On")=="On";
        this.spriteBGMusicBtn.spriteFrame = this.sfsBGMusicBtn[this.bgMusicStatus?0:1];
        this.spriteSoundFxBtn.spriteFrame = this.sfsSoundFxBtn[this.soundFxStatus?0:1];
        localStorage.setItem("bgMusicStatus",this.bgMusicStatus?"On":"Off");
        localStorage.setItem("soundFxStatus",this.soundFxStatus?"On":"Off");
        this.curBGMusic = null;
        this.playingSounds = [];
        this.jackpotLoop = null;
        this.bigwinLoop = null;
        this.playBackGroundMusic(cc.AudioTayDuClipIndex.MAIN_BG_MUSIC);
    },
    onDestroy()
    {
        cc.audioEngine.stopAll();
    },
    sfxJackpotLoop() {
        this.setMusicVolume(0);
        this.jackpotLoop = this.playEffect(cc.AudioTayDuClipIndex.SOUND_JACKPOT, true);
    },

    stopJackpotLoop() {
        this.setMusicVolume(1);
        const state = this.getPlayState(this.jackpotLoop);
        if (state == SoundStateEnum.PLAYING) {
            this.stopEffect(this.jackpotLoop);
            this.jackpotLoop = null;
            this.playEffect(cc.AudioTayDuClipIndex.SOUND_JACKPOT_END, false);
        }
    },

    sfxBigwinLoop() {
        this.setMusicVolume(0);
        this.bigwinLoop = this.playEffect(cc.AudioTayDuClipIndex.SOUND_BIGWIN, true);
    },

    sfxStopBigwinLoop() {
        this.setMusicVolume(1);
        const state = this.getPlayState(this.bigwinLoop);
        if (state == SoundStateEnum.PLAYING) {
            this.stopEffect(this.bigwinLoop);
            this.bigwinLoop = null;
            this.playEffect(cc.AudioTayDuClipIndex.SOUND_BIGWIN_END, false);
        }
    },
    playBackGroundMusic(data) {
        if (!this.bgMusicStatus) return;
        if (this.curBGMusic == data) return;
        this.playMusic(data, true);
        this.curBGMusic = data;
    },
    playMusic(type, loop = true) {
        if (!this.bgMusicStatus) return;
        const audio = this.audioClips[type]
        if (!audio) {
            cc.log("playMusic invalid audio", audio);
            return;
        }
        cc.audioEngine.playMusic(audio, loop);
    },

    stopMusic() {
        this.curBGMusic = null;
        cc.audioEngine.stopMusic();
    },

    playEffect(type, loop = false, volume = 1) {
        if (!this.soundFxStatus) return;
        if (!this.audioClips) return;
        const sfx = this.audioClips[type];
        if (!sfx) {
            cc.log("playEffect invalid sfx");
            return;
        }
        let id = null;
        id = cc.audioEngine.playEffect(sfx, loop,);
        cc.audioEngine.setVolume(id, volume);

        const length = this.playingSounds.length;
        if (length > 9) {
            this.playingSounds.splice(0, length - 5);
        }
        this.playingSounds.push(id);
        return id;
    },

    stopAllEffects() {
        for (let i = 0; i < this.playingSounds.length; i++) {
            const soundId = this.playingSounds[i];
            if (soundId) {
                const state = cc.audioEngine.getState(soundId);
                if (state == cc.audioEngine.AudioState.PLAYING) {
                    this.stopEffect(soundId);
                }
            }
        }
        this.playingSounds = [];
    },

    stopEffect(id) {
        if (id !== undefined && id !== null) {
            cc.audioEngine.stopEffect(id);
        }
    },

    getPlayState(id) {
        if (id !== 0 && !id) return SoundStateEnum.NONE;
        let state = SoundStateEnum.NONE;
        switch (cc.audioEngine.getState(id)) {
            case cc.audioEngine.AudioState.PLAYING:
                state = SoundStateEnum.PLAYING;
                break;
        }
        return state;
    },

    setMusicVolume(volume) {
        if (!this.bgMusicStatus) return;
        cc.audioEngine.setMusicVolume(volume);
    },

    changeStatusBGMusic:function()
    {
        this.bgMusicStatus = !this.bgMusicStatus;
        this.spriteBGMusicBtn.spriteFrame = this.sfsBGMusicBtn[this.bgMusicStatus?0:1];
        localStorage.setItem("bgMusicStatus",this.bgMusicStatus?"On":"Off");
        if (this.bgMusicStatus) {
            this.playBackGroundMusic(cc.AudioTayDuClipIndex.MAIN_BG_MUSIC);
        }
        else
        {
            this.stopMusic();
        }
    },
    changeStatusSoundFx:function()
    {
        this.soundFxStatus = !this.soundFxStatus;
        this.spriteSoundFxBtn.spriteFrame = this.sfsSoundFxBtn[this.soundFxStatus?0:1];
        localStorage.setItem("soundFxStatus",this.soundFxStatus?"On":"Off");
    }
    
});
