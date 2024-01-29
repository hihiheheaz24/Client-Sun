

const TayDuConfig = cc.Class({
    ctor() {
      this.BOSS_IDS = {
        TURTLE: 1,
        DRAGON:2,
        TIGER: 3,
        PHOENIX: 4
      }
      this.TABLE_FORMAT =  [5, 5, 5, 5, 5];
      this.SYMBOL_WIDTH = 144;
      this.SYMBOL_HEIGHT = 124;
      this.TABLE_SYMBOL_BUFFER = {
        TOP: 1,
        BOT: 1,
      }; 

      this.BIG_WIN_RATE= {
        SMALL_WIN: 20,
        MEGA_WIN: 25,
        SUPER_WIN: 40,
        // SMALL_WIN: 1,
        // MEGA_WIN: 3,
        // SUPER_WIN: 5,
        
      }
      this.BET_ID_DEFAULT = 1;
      this.BET_ID = [1,2,3,4,5,6,7,8];
      this.BETS = {
        1: 2000,
        2: 5000,
        3: 10000,
        4: 50000,
        5: 100000,
        6: 500000,
      }

      this.SYMBOL_NAME_LIST = [
        ['2', '3', '4', '5', '6', '7', '8', '9'],
        ['2', '3', '4', '5', '6', '7', '8', '9'],
        ['2', '3', '4', '5', '6', '7', '8', '9'],
        ['2', '3', '4', '5', '6', '7', '8', '9'],
        ['2', '3', '4', '5', '6', '7', '8', '9'],
      ];

      this.Z_INDEX = {
        PARTICLE_SYMBOL_MOVE: 10,
        TXT_WIN_LINE_MOVE: 20,
      }

      this.STATS = {
        NORMAL: {
          TIME: 0.04,
          RUNNING_TIME: 0.04,
          STOPPING_TIME: 0.05,
          REEL_DELAY_START: 0.25,
          REEL_DELAY_STOP: 0.25,
          REEL_DELAY_FALL: 0.1,
          REEL_EASING_DISTANCE: 5,
          REEL_EASING_TIME: 0.08,
          STEP_STOP: 14,        
        },
        TURBO: {
          TIME: 0.035,
          RUNNING_TIME: 0.035,
          STOPPING_TIME: 0.04,
          REEL_DELAY_START: 0,
          REEL_DELAY_STOP: 0,
          REEL_DELAY_FALL: 0.05,
          REEL_EASING_DISTANCE: 5,
          REEL_EASING_TIME: 0.08,
          STEP_STOP: 8,
        }
      };

    },
    destroy() {
        TayDuConfig.instance = null;
    },
});
TayDuConfig.instance = null;
module.exports = TayDuConfig;
