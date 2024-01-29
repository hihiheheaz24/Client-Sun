import BroadcastReceiver from "./BroadcastReceiver";
import Configs from "./Configs";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AudioManager extends cc.Component {

    private static instance: AudioManager = null;
    public static getInstance(): AudioManager {
        if (this.instance == null) {
            let node = new cc.Node("AudioManager");
            this.instance = node.addComponent(AudioManager);
            this.instance.audioSource = node.addComponent(cc.AudioSource);

            // console.log(cc.director.getScene());
            cc.game.addPersistRootNode(node);
        }
        return this.instance;
    }

    private audioSource: cc.AudioSource = null;
    private playingSounds = [];
    private isOnMusic = true;
    private isOnSound = true;

    start() {
        BroadcastReceiver.register(BroadcastReceiver.ON_AUDIO_CHANGED, () => {
            this.isOnMusic = Configs.App.IsMusic;
            this.isOnSound = Configs.App.IsSound;
            if (this.isOnMusic) {
                cc.audioEngine.setMusicVolume(1);
            } else {
                cc.audioEngine.setMusicVolume(0);
            }
            if (!this.isOnSound) {
                this.stopAllEffects();
            }
        }, this);
        this.isOnMusic = Configs.App.IsMusic;
        this.isOnSound = Configs.App.IsSound;
        if (this.isOnMusic) {
            cc.audioEngine.setMusicVolume(1);
        } else {
            cc.audioEngine.setMusicVolume(0);
        }
    }

    public playEffect(audioClip: cc.AudioClip, volumn: number = 1) {
        if (audioClip == null) {
            cc.warn("AudioManager playEffect audioClip is null");
            return;
        }
        if (this.isOnSound && volumn > 0) {
            let id = null;
            id = cc.audioEngine.playEffect(audioClip, false);
            cc.audioEngine.setVolume(id, volumn);
            const length = this.playingSounds.length;
            if (length > 9) {
                this.playingSounds.splice(0, length - 5);
            }
            this.playingSounds.push(id);
        }
    }

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
    }
    stopEffect(id) {
        if (id !== undefined && id !== null) {
            cc.audioEngine.stopEffect(id);
        }
    }



    public playBackgroundMusic(audioClip: cc.AudioClip, loop: boolean = true, volumn: number = 1) {
        if (audioClip == null) {
            cc.warn("AudioManager playBackgroundMusic audioClip is null");
            return;
        }

       
        cc.audioEngine.playMusic(audioClip, loop);
    }

    public stopBackgroundMusic() {
        cc.audioEngine.stopMusic();
    }
}
