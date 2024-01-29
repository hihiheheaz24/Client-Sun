const Emitter = require("TTEventEmitter");
const Config = require("TTConfig");
const DataStore = require("TTDataStore");
const EventCode = require("TTEventsCode");
const { registerEvent, removeEvents } = require("TTUtils");
cc.Class({
  extends: cc.Component,

  properties: {
    txtProgress: cc.Label,
    progressBar: cc.ProgressBar,
    bgTopProgress: cc.Node,
    bgBottonProgress: cc.Node,
    bar: cc.Node,
    listBgBar: [cc.SpriteFrame],
    vfxFrame: cc.Node,
    vfxLine: cc.Node,
    vfxBoss: [cc.Node],
  },

  onLoad() {
    this.initEvents();
    this.line_VFX = {
       1: "ef_rua",
       2: "ef_rong",
       3: "ef_ho",
       4: "ef_chu_tuoc",
       5: "ef_jackpot_2",
    }

    this.mapLvl = [
      {
        level: 0,
        max: 10,
        widthProgress: 274,
        widthBar: 296,
        color: cc.Color.BLACK.fromHEX("#0E4D2E"),
      },
      {
        level: 1,
        max: 30,
        widthProgress: 300,
        widthBar: 325,
        color: cc.Color.BLACK.fromHEX("#0E224D"),
      },
      {
        level: 2,
        max: 50,
        widthProgress: 328,
        widthBar: 355,
        color: cc.Color.BLACK.fromHEX("#4D480E"),
      },
      {
        level: 3,
        max: 70,
        widthProgress: 376,
        widthBar: 406,
        color: cc.Color.BLACK.fromHEX("#4D3B0E"),
      },
      {
        level: 4,
        max: 350,
        widthProgress: 468,
        widthBar: 495,
        color: cc.Color.BLACK.fromHEX("#430E4D"),
      },
    ];
  },
  initEvents() {
    registerEvent(EventCode.COMMON.GAME_INIT, this.onReset, this);
    registerEvent(EventCode.TABLE.TABLE_START_SPINNING, this.onReset, this);
    registerEvent(EventCode.PROGRESS_BAR.UPDATE_VALUE, this.updateValue, this);
  },

  updateValue(newValue) {
    Emitter.instance.emit(EventCode.SOUND.SOUND_HIT_PROGRESS_BAR); 
    const TIME = 0.5;
    if(newValue >= 350){
      cc.tween(this.progressBar)
        .to(TIME, { progress: 1 })
        .call(() => {
          this.txtProgress.string = '350/350';
          this._value = 350;
        })
        .start();
       return;
    }
    const currentConfig = this.getConfigLevelByValue(this._value);
    const targetConfig = this.getConfigLevelByValue(newValue);
   
    if (currentConfig.level == targetConfig.level) {
      const oldProgress = this.getProgressValue(
        currentConfig.level,
        this._value
      );
      const newProgress = this.getProgressValue(targetConfig.level, newValue);
      this.progressBar.progress = oldProgress;
      this.txtProgress.string = this._value + "/" + targetConfig.max;
      cc.tween(this.progressBar)
        .to(TIME, { progress: newProgress })
        .call(() => {
          this.txtProgress.string = newValue + "/" + targetConfig.max;
          this._value = newValue;
        })
        .start();
    } else {
      let startLevel = currentConfig.level;
      let endLevel = targetConfig.level;
      for (let i = startLevel; i <= endLevel; i++) {
        const configLevel = this.mapLvl[i];
        if (i != endLevel) {
          cc.tween(this.progressBar)
            .delay((i - startLevel) * TIME + (i - startLevel) * 0.1)
            .call(() => {
              let currentValue = this._value;
              this.txtProgress.string = currentValue + "/" + configLevel.max;
              if (i == startLevel) {
                this.progressBar.progress = this.getProgressValue(i,currentValue);
              } else {
                this.progressBar.progress = 0;
              }
            })
            .to(TIME, { progress: 1 })
            .call(() => {
              this._value = configLevel.max;
              this.txtProgress.string = configLevel.max + "/" + configLevel.max;
            })
            .call(() => {
              this.prepareChangeLevel(this.mapLvl[i+1]);
            })
            .delay(0.1)
            .start();
        } else {
          // end
          const newProgress = this.getProgressValue(i, newValue);
          cc.tween(this.progressBar)
          .delay((i - startLevel) * TIME + (i - startLevel) * 0.1)
            .call(() => {
              this.progressBar.progress = 0;
              this.txtProgress.string = this._value + "/" + configLevel.max;
            })
            .to(TIME, { progress: newProgress })
            .call(() => {
              this.txtProgress.string = newValue + "/" + configLevel.max;
              this._value = newValue;
            })
            .start();
        }
      }
    }
  },

  prepareChangeLevel(configLevel) {
    const { level, max, widthProgress, widthBar, color } = configLevel;
    this.bgBottonProgress.color = color;
    this.progressBar.progress = 0;
    this.txtProgress.string = "0/" + max;
    this.progressBar.totalLength = widthProgress;
    this.bar.x = -widthBar / 2 + 10;
    this.bar.getComponent(cc.Sprite).spriteFrame = this.listBgBar[level];

    cc.tween(this.bgTopProgress).to(0.1, { width: widthBar }).start();
    cc.tween(this.bgBottonProgress).to(0.1, { width: widthBar - 20 }).start();

    this.vfxFrame.active = true;
    this.vfxFrame.scaleX = (widthBar/ this.mapLvl[0].widthBar) * 1.2;
    this.vfxFrame.getComponent(sp.Skeleton).setAnimation(0,'Rays_Frame',false);
    Emitter.instance.emit(EventCode.SOUND.SOUND_PROGRESS_BAR_LEVELUP);

    this.vfxLine.active = true;
    const durLine = this.vfxLine.getComponent(sp.Skeleton).findAnimation(this.line_VFX[level]).duration;
    cc.tween(this.vfxLine)
        .delay(0.05)
        .call(()=>{
          this.vfxLine.getComponent(sp.Skeleton).setAnimation(0,this.line_VFX[level],false);
        })
        .delay(durLine*0.5*0.3)
        .call(()=>{
            this.vfxBoss[level-1].active = true;
            this.vfxBoss[level-1].getComponent(sp.Skeleton).setAnimation(0,'animation',false);
            Emitter.instance.emit(EventCode.FEATURE.OPEN_EGG_BY_LEVEL, level-1);       
        })
        .start();

  },

  getProgressValue(level, value) {
    const config = this.mapLvl[level];
    const max = config.max;
    let min = 0;
    if (level > 0) {
      min = this.mapLvl[level - 1].max;
    }
    return (value - min) / (max - min);
  },

  getConfigLevelByValue(value) {
    let config = this.mapLvl[0];
    for (let i = 0; i < this.mapLvl.length - 1; i++) {
      const item = this.mapLvl[i];
      if (value >= item.max) {
        config = this.mapLvl[i + 1];
      }
    }
    return config;
  },

  onReset() {
    this._value = 0;
    const { max, widthProgress, widthBar, color } = this.mapLvl[0];
    this.txtProgress.string = this._value + "/" + max;
    this.progressBar.progress = 0;
    this.bgTopProgress.width = widthBar;
    this.bgBottonProgress.width = widthBar - 20;
    this.bar.x = -widthBar / 2 + 10;
    this.bgBottonProgress.color = color;
    this.progressBar.totalLength = widthProgress;
    this.bar.getComponent(cc.Sprite).spriteFrame = this.listBgBar[0];

    this.vfxFrame.active = false;
    this.vfxFrame.scale = 1 * 1.2;
    this.vfxLine.active = false;
    this.vfxBoss.forEach(item=>{
        item.active = false;
    });
  },

  onDestroy() {
    removeEvents(this);
  },
});
