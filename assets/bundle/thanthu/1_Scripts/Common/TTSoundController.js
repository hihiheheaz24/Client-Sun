const Emitter = require('TTEventEmitter');
const Config = require('TTConfig');
const DataStore = require('TTDataStore');
const EventCode = require("TTEventsCode");
const { registerEvent, removeEvents, convertAssetArrayToObject } = require('TTUtils');
const SoundStateEnum = {
    NONE: 0,
    PLAYING: 1
};
cc.Class({
    extends: cc.Component,

    properties: {
        SFXCheckBox: cc.Node,
        BGMCheckBox: cc.Node,
        lstSoundAsset: {
            default: [],
            type: cc.AudioClip
        },
    },

    onLoad() {
        this.initialized = false;
        this.initEvents();
        this.playingSounds = [];
        this.curBGMusic = null;

        this.jackpotLoop = null;
        this.bigwinLoop = null;
        this.SOUND = convertAssetArrayToObject(this.lstSoundAsset);
        this.isEnableSFX = cc.Tool.getInstance().getItem("@Sound").toString() === 'true';
        this.isEnableBGM = cc.Tool.getInstance().getItem("@Music").toString() === 'true';
        this.SFXCheckBox.getComponent(cc.Toggle).isChecked = this.isEnableSFX;
        this.BGMCheckBox.getComponent(cc.Toggle).isChecked = this.isEnableBGM;
        this.SFXCheckBox.getChildByName('Background').active = !this.SFXCheckBox.getComponent(cc.Toggle).checkMark.node.active;
        this.BGMCheckBox.getChildByName('Background').active = !this.BGMCheckBox.getComponent(cc.Toggle).checkMark.node.active;
        this.playBackGroundMusic("bgm");
        this.initialized = true;
    },

    initEvents() {
        registerEvent(EventCode.SOUND.SOUND_CLICK, this.sfxClick, this);
        registerEvent(EventCode.SOUND.SOUND_SPIN_CLICK, this.sfxSpinClick, this);
        registerEvent(EventCode.SOUND.SOUND_SHOW_PAYLINE, this.sfxShowPayLine, this);
        registerEvent(EventCode.SOUND.SOUND_HIT_TXT_WIN, this.sfxHitTxtWin, this);
        registerEvent(EventCode.SOUND.SOUND_HIT_PROGRESS_BAR, this.sfxHitProgressbar, this);
        registerEvent(EventCode.SOUND.SOUND_DROP_SYMBOL, this.sfxDropSymbol, this);
        registerEvent(EventCode.SOUND.SOUND_PROGRESS_BAR_LEVELUP, this.sfxProgressBarLevelUp, this);
        registerEvent(EventCode.SOUND.SOUND_HIT_TXT_TOTAL_WIN, this.sfxHitTxtTotalWin, this);
        registerEvent(EventCode.SOUND.SOUND_TURTLE_APPEAR, this.sfxTurtleAppear, this);
        registerEvent(EventCode.SOUND.SOUND_TURTLE_HIT_1, this.sfxTurtleHit1, this);
        registerEvent(EventCode.SOUND.SOUND_TURTLE_HIT_2, this.sfxTurtleHit2, this);
        registerEvent(EventCode.SOUND.SOUND_BOSS_DISAPPEAR, this.sfxBossDisappear, this);
        registerEvent(EventCode.SOUND.SOUND_DRAGON_APPEAR, this.sfxDragonAppear, this);
        registerEvent(EventCode.SOUND.SOUND_DRAGON_CHANGE_SYMBOL, this.sfxDragonChangeSymbol, this);
        registerEvent(EventCode.SOUND.SOUND_DRAGON_HIT, this.sfxDragonHit, this);
        registerEvent(EventCode.SOUND.SOUND_TIGER_APPEAR, this.sfxTigerAppear, this);
        registerEvent(EventCode.SOUND.SOUND_TIGER_CHANGE_SYMBOL, this.sfxTigerChangeSymbol, this);
        registerEvent(EventCode.SOUND.SOUND_TIGER_HIT, this.sfxTigerHit, this);
        registerEvent(EventCode.SOUND.SOUND_PHOENIX_APPEAR, this.sfxPhoenixAppear, this);
        registerEvent(EventCode.SOUND.SOUND_PHOENIX_CHANGE_SYMBOL, this.sfxPhoenixChangeSymbol, this);
        registerEvent(EventCode.SOUND.SOUND_PHOENIX_FLY, this.sfxPhoenixFly, this);
        registerEvent(EventCode.SOUND.SOUND_PHOENIX_RETURN, this.sfxPhoenixReturn, this);
        registerEvent(EventCode.SOUND.SOUND_TABLE_MOVE, this.sfxTableMove, this);
        registerEvent(EventCode.SOUND.SOUND_PLAY_BACKGROUND_MUSIC, this.playBackGroundMusic, this);
        registerEvent(EventCode.SOUND.SOUND_JACKPOT_START, this.sfxJackpotStart, this);
        registerEvent(EventCode.SOUND.SOUND_JACKPOT_LOOP, this.sfxJackpotLoop, this);
        registerEvent(EventCode.SOUND.SOUND_STOP_JACKPOT_LOOP, this.stopJackpotLoop, this);
        registerEvent(EventCode.SOUND.SOUND_BIGWIN_LOOP, this.sfxBigwinLoop, this);
        registerEvent(EventCode.SOUND.SOUND_STOP_BIGWIN_LOOP, this.sfxStopBigwinLoop, this);
        registerEvent(EventCode.SOUND.SOUND_STOP_REEL, this.sfxStopReel, this);

    },

    sfxStopReel(index){
        if(index == 0){
            this.playEffect("Reel_0_4")
        }
        if(index == 1){
            this.playEffect("Reel_1_3")
        }
        if(index == 2){
            this.playEffect("Reel_2")
        } 
    },

    sfxJackpotStart() {
        this.setMusicVolume(0);
        this.playEffect("JackpotStart")
    },

    sfxJackpotLoop() {
        this.jackpotLoop = this.playEffect("JackpotLoop", true);
    },

    stopJackpotLoop() {
        this.setMusicVolume(1);
        const state = this.getPlayState(this.jackpotLoop);
        if (state == SoundStateEnum.PLAYING) {
            this.stopEffect(this.jackpotLoop);
            this.jackpotLoop = null;
        }
    },

    sfxBigwinLoop() {
        this.setMusicVolume(0);
        this.bigwinLoop = this.playEffect("Bigwin", true);
    },

    sfxStopBigwinLoop() {
        this.setMusicVolume(1)
        const state = this.getPlayState(this.bigwinLoop);
        if (state == SoundStateEnum.PLAYING) {
            this.stopEffect(this.bigwinLoop);
            this.bigwinLoop = null;
        }
    },

    playBackGroundMusic(data) {
        if (!this.isEnableBGM) return;
        if (this.curBGMusic == data) return;
        this.playMusic(data, true);
        this.curBGMusic = data;
    },

    sfxPhoenixAppear() {
        this.playEffect("PhoenixAppear")
    },

    sfxPhoenixChangeSymbol() {
        this.playEffect("PhoenixChangeSymbol")
    },

    sfxPhoenixFly() {
        this.playEffect("PhoenixFly")
    },

    sfxPhoenixReturn() {
        this.playEffect("PhoenixReturn")
    },

    sfxTableMove() {
        this.playEffect("TableMove")
    },

    sfxTigerAppear() {
        this.playEffect("TigerAppear")
    },

    sfxTigerChangeSymbol() {
        this.playEffect("TigerChangeSymbol")
    },

    sfxTigerHit() {
        this.playEffect("TigerHit")
    },

    sfxDragonAppear() {
        this.playEffect("DragonAppear")
    },

    sfxDragonChangeSymbol() {
        this.playEffect("DragonChangeSymbol", false, 0.7);
    },

    sfxDragonHit() {
        this.playEffect("DragonHit")
    },

    sfxTurtleAppear() {
        this.playEffect("turtleAppear")
    },

    sfxTurtleHit1() {
        this.playEffect("TurtleHit1")
    },

    sfxTurtleHit2() {
        this.playEffect("TurtleHit2")
    },

    sfxBossDisappear() {
        this.playEffect("BossDisapear")
    },

    sfxHitTxtTotalWin() {
        this.playEffect("txtTotalWin")
    },

    sfxProgressBarLevelUp() {
        this.playEffect("prgressBarLevelup")
    },

    sfxDropSymbol() {
        this.playEffect("DropItem", false, 0.3)
    },

    sfxShowPayLine() {
        this.playEffect("PaylineWin")
    },

    sfxHitTxtWin() {
        this.playEffect("winTxt")
    },

    sfxHitProgressbar() {
        this.playEffect("ProgressUpdate")
    },

    sfxClick() {
        this.playEffect("click")
    },

    sfxSpinClick() {
        this.playEffect("StartSpin")
        this.playEffect("spin_click")
    },


    sfxToggleClick() {
        this.isEnableSFX = this.SFXCheckBox.getComponent(cc.Toggle).isChecked;
        this.SFXCheckBox.getChildByName('Background').active = !this.isEnableSFX
        this.setEffectEnable(this.isEnableSFX);
    },

    bgmToggleClick() {
        this.isEnableBGM = this.BGMCheckBox.getComponent(cc.Toggle).isChecked;
        this.BGMCheckBox.getChildByName('Background').active = !this.isEnableBGM
        this.setBgmEnable(this.isEnableBGM);
    },

    setEffectEnable(enable) {
        this.isEnableSFX = enable;
        cc.Tool.getInstance().setItem("@Sound", this.isEnableSFX);
        if (!this.isEnableSFX) {
            this.stopAllEffects();
        }
    },
    setBgmEnable(enable) {
        this.isEnableBGM = enable;
        cc.Tool.getInstance().setItem("@Music", this.isEnableBGM);
        if (this.isEnableBGM) {
            if (DataStore.instance.phoenixInited) {
                this.playBackGroundMusic('bgm2');
            } else {
                this.playBackGroundMusic('bgm');
            }
        } else {
            this.stopMusic();
        }
    },

    playMusic(name, loop = true) {
        if (!this.isEnableBGM) return;
        const audio = this.SOUND[name]
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

    playEffect(name, loop = false, volume = 1) {
        if (!this.isEnableSFX) return;
        const sfx = this.SOUND[name];
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
        if (!this.isEnableBGM) return;
        cc.audioEngine.setMusicVolume(volume);
    },

    onDestroy() {
        this.stopMusic();
        this.stopAllEffects();
        removeEvents(this);
    },

});
