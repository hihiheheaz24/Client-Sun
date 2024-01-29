
cc.Class({
    extends: cc.Component,
    properties: {
        musicBackground: cc.AudioSource,
        normalWin: cc.AudioSource,
        bigWin: cc.AudioSource,
        spin: cc.AudioSource,
        stopSpin: cc.AudioSource,
        normalClick: cc.AudioSource,
        moneyCount: cc.AudioSource,
        startFreeSpin: cc.AudioSource,
        jackpot: cc.AudioSource,

        bonusStart: cc.AudioSource,
        bonusMulti: cc.AudioSource,
        bonusMiss: cc.AudioSource,
        bonusResult: cc.AudioSource,
        
    },

    onLoad () {
        cc.AudioController.getInstance().setAudioPool(this);
    },

    enableMusic (enable) {
        if (this.musicBackground) {
            if (enable) {
                if (!this.musicBackground.isPlaying) {
                    this.musicBackground.play();
                }
            } else {
                this.musicBackground.stop();
            }
        }
    },

    enableSound (enable) {
        if (this.normalWin) {
            this.normalWin.mute = !enable;
            this.bigWin.mute = !enable;
            this.spin.mute = !enable;
            this.stopSpin.mute = !enable;    
            this.moneyCount.mute = !enable  
            this.startFreeSpin.mute = !enable  
            this.jackpot.mute = !enable  
            this.bonusStart.mute = !enable  
            this.bonusMulti.mute = !enable  
            this.bonusMiss.mute = !enable  
            this.bonusResult.mute = !enable    
        }
    },

    getAudioClip  (clipType) {
        var audioClip;
        audioClip = null;
        switch (clipType) {
            case cc.AudioTypes.BACKGROUND:
                audioClip = this.musicBackground;
                break;
            case cc.AudioTypes.NORMAL_WIN:
                audioClip = this.normalWin;
                break;
            case cc.AudioTypes.BIG_WIN:
                audioClip = this.bigWin;
                break;
            case cc.AudioTypes.SPIN:{
                audioClip = this.spin;
                cc.AudioController.getInstance().stopSound(cc.AudioTypes.PLAY_COUNT);
                cc.AudioController.getInstance().stopSound(cc.AudioTypes.WIN_JACKPOT);
                break;
            }
            case cc.AudioTypes.STOP_SPIN_1:
                audioClip = this.stopSpin;
                break;
            case cc.AudioTypes.NORMAL_CLICK:
                audioClip = this.normalClick;
                break;
            case cc.AudioTypes.PLAY_COUNT:
                audioClip = this.moneyCount;
                break;
            case cc.AudioTypes.START_FREE_SPIN:
                audioClip = this.startFreeSpin;
                break;
            case cc.AudioTypes.WIN_JACKPOT:
                audioClip = this.jackpot;
                break;

            case cc.AudioTypes.BONUS_START:
                audioClip = this.bonusStart;
                break;
            case cc.AudioTypes.BONUS_MULTI:
                    audioClip = this.bonusMulti;
                    break;
            case cc.AudioTypes.BONUS_MISS:
                audioClip = this.bonusMiss;
                break;
            case cc.AudioTypes.BONUS_RESULT:
                audioClip = this.bonusResult;
                break;
                
                    

                
        }
        return audioClip;
    }
});


