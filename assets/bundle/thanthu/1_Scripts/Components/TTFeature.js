const Emitter = require("TTEventEmitter");
const Config = require("TTConfig");
const DataStore = require("TTDataStore");
const EventCode = require("TTEventsCode");
const { registerEvent, removeEvents, formatMoney } = require("TTUtils");
cc.Class({
  extends: cc.Component,

  properties: {
    bgGalaxy: cc.Sprite,
    listBgGalaxy: [cc.SpriteFrame],
    smallEggs: [cc.Node],
    eggs: [sp.Skeleton],
    rays: [cc.Node],
    bossTurtle: require("TTTurtle"),
    bossDragon: require("TTDragon"),
    bossTiger: require("TTTiger"),
    bossPhoenix: require("TTPhoenix"),
  },

  onLoad() {
    this.initEvents();
    this.COFIG_EGGS = [
      { idle: "Idle", idleNext: "Idle_Next", open: "Open", win: "Win" },
      { idle: "Idle", idleNext: "Idle_Next", open: "Open", win: "Win" },
      { idle: "Idle", idleNext: "Idle_Next", open: "Open", win: "Win" },
      { idle: "Idle", idleNext: "Idle_Next", open: "Open", win: "Win" },
      { idle: "Idle", idleNext: "Next", open: "Fade_Out" },
    ];
    this.smallEggs.forEach((smallEgg) => {
      smallEgg.originPos = smallEgg.position;
    });

    this.eggs.forEach((egg) => {
      egg.node.originPos = egg.node.position;
    });

  },
  initEvents() {
    registerEvent(EventCode.COMMON.GAME_INIT, this.onReset, this);
    registerEvent(EventCode.TABLE.TABLE_START_SPINNING, this.onReset, this);
    registerEvent(EventCode.TABLE.TABLE_START_SPINNING, this.onReset, this);
    registerEvent(EventCode.FEATURE.OPEN_EGG_BY_LEVEL, this.openEggByLevel, this);
    registerEvent(EventCode.FEATURE.PLAY_TURTLE, this.playFeatureTurtle, this);
    registerEvent(EventCode.FEATURE.PLAY_DRAGON, this.playFeatureDragon, this);
    registerEvent(EventCode.FEATURE.PLAY_TIGER, this.playFeatureTiger, this);
    registerEvent(EventCode.FEATURE.PLAY_PHOENIX, this.playFeaturePhoenix, this);
    registerEvent(EventCode.FEATURE.PHOENIX_PLAY_EFFECT_CHANGE, this.playFeaturePhoenixEffectChange, this);
    registerEvent(EventCode.FEATURE.PHOENIX_PLAY_EFFECT_HIDE, this.playFeaturePhoenixEffectHide, this);
    registerEvent(EventCode.FEATURE.HIDE_JACKPOT_EGG, this.hideJackpotEgg, this);

  },

  hideJackpotEgg() {
    this.eggs[4].node.active = false;
  },

  playFeatureTurtle(stepData) {
    this.bgGalaxy.spriteFrame = this.listBgGalaxy[0];
    this.bossTurtle.playAnimation(stepData);
  },

  playFeatureDragon(stepData) {
    this.bgGalaxy.spriteFrame = this.listBgGalaxy[1];
    this.bossDragon.playAnimation(stepData);
  },

  playFeatureTiger(stepData) {
    this.bgGalaxy.spriteFrame = this.listBgGalaxy[2];
    this.bossTiger.playAnimation(stepData);
  },

  playFeaturePhoenix(stepData) {
    this.bossPhoenix.playAnimation(stepData);
  },

  playFeaturePhoenixEffectChange(stepData) {
    this.bossPhoenix.playEffectChange(stepData);
  },

  playFeaturePhoenixEffectHide() {
    this.bossPhoenix.playEffectHide();
  },

  openEggByLevel(level) {
    if (level == Config.instance.BOSS_IDS.PHOENIX) {
      this.eggs[level].setAnimation(0, this.COFIG_EGGS[level].open, true);
    } else {
      this.eggs[level].setAnimation(0, this.COFIG_EGGS[level].win, false);
      this.eggs[level].addAnimation(0, this.COFIG_EGGS[level].open, true);
      this.rays[level].active = false;
    }

    if (this.eggs[level + 1]) {
      this.eggs[level + 1].setAnimation(0, this.COFIG_EGGS[level].idleNext, true);
    }
  },

  onReset() {
    this.bgGalaxy.spriteFrame = this.listBgGalaxy[0];
    this.bossTurtle.reset();
    this.bossDragon.reset();
    this.bossTiger.reset();
    this.bossPhoenix.reset();
    this.eggs.forEach((egg, index) => {
      egg.node.active = true;
      if (index == 0) {
        if (egg._animationName != this.COFIG_EGGS[index].idleNext) {
          egg.setAnimation(0, this.COFIG_EGGS[index].idleNext, true);
        }
      } else {
        if (egg._animationName != this.COFIG_EGGS[index].idle) {
          egg.setAnimation(0, this.COFIG_EGGS[index].idle, true);
        }

      }
    });

    this.rays.forEach((ray) => {
      ray.active = true;
    });
  },

  onDestroy() {
    removeEvents(this);
  },
});
