// Contain Events communicate between components
const TayDuEventsCode = {

    COMMON: {
        GAME_INIT: "GAME_INIT",
        GAME_CONNECTED_SERVER: "GAME_CONNECTED_SERVER",
        CALL_SPIN: "CALL_SPIN",
        ON_SEND_SPIN: "ON_SEND_SPIN",
        ON_RECEIVE_RESULT_SPIN: "ON_RECEIVE_RESULT_SPIN",
        ON_UPDATE_JACKPOT: "ON_UPDATE_JACKPOT",
        ON_UPDATE_WALLET: "ON_UPDATE_WALLET",
        ON_SEND_GET_WALLET: "ON_SEND_GET_WALLET",
        UPDATE_BET_VALUE: "UPDATE_BET_VALUE",
        UPDATE_TOTAL_WIN_VALUE: "UPDATE_TOTAL_WIN_VALUE",
        EXIT_GAME: "EXIT_GAME"
    },

    PAYLINE_INFO: {
        PAYLINE_INFO_SHOW_WIN: "PAYLINE_INFO_SHOW_WIN",
        PAYLINE_INFO_SHOW_TOTAL_WIN: "PAYLINE_INFO_SHOW_TOTAL_WIN"
    },

    PROGRESS_BAR: {
        UPDATE_VALUE: "PROGRESS_BAR_UPDATE_VALUE",
    },

    TABLE: {
        SHOW_PAYABLE_SYMBOL: "SHOW_PAYABLE_SYMBOL",
        TABLE_START_SPINNING: "TABLE_START_SPINNING",
        TABLE_STOP_SPINNING: "TABLE_STOP_SPINNING",
        TABLE_CAN_SPIN: "TABLE_CAN_SPIN",
        TABLE_REMOVE_SYMBOLS_FOR_FALLING: "TABLE_REMOVE_SYMBOLS_FOR_FALLING",
        TABLE_FALLING_SYMBOLS: "TABLE_FALLING_SYMBOLS",
        TABLE_RESET: "TABLE_RESET",
        TABLE_SHOW_SYMBOL_WIN: "TABLE_SHOW_SYMBOL_WIN",
        TABLE_TURTLE_STONE: "TABLE_TURTLE_STONE",
        UPDATE_SYMBOL: "TABLE_UPDATE_SYMBOL",
        TABLE_DISABLE_HIGHLIGHT: "TABLE_DISABLE_HIGHLIGHT",
        TABLE_ENABLE_ALL_HIGHLIGHT: "TABLE_ENABLE_ALL_HIGHLIGHT",
        TABLE_CHANGE_SYMBOLS_BY_TYPE: "TABLE_CHANGE_SYMBOLS_BY_TYPE"
    },

    BUTTON: {
        BUTTON_INIT: "BUTTON_INIT",
        INTERACTABLE_BET: "INTERACTABLE_BET",
        INTERACTABLE_BET: "INTERACTABLE_SPIN",
        STOP_AUTO_SPIN: "STOP_AUTO_SPIN"
    },

    FEATURE: {
        OPEN_EGG_BY_LEVEL: "FEATURE_OPEN_EGG_BY_LEVEL",
        PLAY_TURTLE: "FEATURE_PLAY_TURTLE",
        PLAY_DRAGON: "FEATURE_PLAY_DRAGON",
        PLAY_TIGER: "FEATURE_PLAY_TIGER",
        PLAY_PHOENIX: "FEATURE_PLAY_PHOENIX",
        PHOENIX_PLAY_EFFECT_CHANGE: "PHOENIX_PLAY_EFFECT_CHANGE",
        PHOENIX_PLAY_EFFECT_HIDE: "PHOENIX_PLAY_EFFECT_HIDE",
        HIDE_JACKPOT_EGG: "HIDE_JACKPOT_EGG",
        
    },
    
    EFFECT_LAYER: {
        EFFECT_SHOW_RESULT: "EFFECT_SHOW_RESULT", 
    },

    CUT_SCENE: {
        SHOW_CUT_SCENE : "SHOW_CUT_SCENE"
    },

    POPUP: {
        SHOW_POPUP_PROMPT: "SHOW_POPUP_PROMPT",
        SHOW_POPUP_INFO: "SHOW_POPUP_INFO",
        SHOW_HISTORY_PLAY: "SHOW_HISTORY_PLAY",
        SHOW_HISTORY_JACKPOT: "SHOW_HISTORY_JACKPOT",
        CLOSE_ALL: "POPUP_CLOSE_ALL",
        CLOSE_TOP_POPUP: "CLOSE_TOP_POPUP"
    },

    SOUND: {
        SOUND_CLICK: "SOUND_CLICK",
        SOUND_SPIN_CLICK: "SOUND_SPIN_CLICK",
        SOUND_SHOW_PAYLINE: "SOUND_SHOW_PAYLINE",
        SOUND_HIT_TXT_WIN: "SOUND_HIT_TXT_WIN",
        SOUND_HIT_PROGRESS_BAR: "SOUND_HIT_PROGRESS_BAR",
        SOUND_DROP_SYMBOL: "SOUND_DROP_SYMBOL",
        SOUND_PROGRESS_BAR_LEVELUP: "SOUND_PROGRESS_BAR_LEVELUP",
        SOUND_HIT_TXT_TOTAL_WIN: "SOUND_HIT_TXT_TOTAL_WIN",
        SOUND_TURTLE_APPEAR: "SOUND_TURTLE_APPEAR",
        SOUND_TURTLE_HIT_1: "SOUND_TURTLE_HIT_1",
        SOUND_TURTLE_HIT_2: "SOUND_TURTLE_HIT_2",
        SOUND_BOSS_DISAPPEAR: "SOUND_BOSS_DISAPPEAR",

        SOUND_DRAGON_APPEAR: "SOUND_DRAGON_APPEAR",
        SOUND_DRAGON_CHANGE_SYMBOL: "SOUND_DRAGON_CHANGE_SYMBOL",
        SOUND_DRAGON_HIT: "SOUND_DRAGON_HIT",

        SOUND_TIGER_APPEAR: "SOUND_TIGER_APPEAR",
        SOUND_TIGER_CHANGE_SYMBOL: "SOUND_TIGER_CHANGE_SYMBOL",
        SOUND_TIGER_HIT: "SOUND_TIGER_HIT",

        SOUND_PHOENIX_APPEAR: "SOUND_PHOENIX_APPEAR",
        SOUND_PHOENIX_CHANGE_SYMBOL: "SOUND_PHOENIX_CHANGE_SYMBOL",
        SOUND_PHOENIX_FLY: "SOUND_PHOENIX_FLY",
        SOUND_PHOENIX_RETURN: "SOUND_PHOENIX_RETURN",
        SOUND_TABLE_MOVE: "SOUND_TABLE_MOVE",
        SOUND_PLAY_BACKGROUND_MUSIC: "SOUND_PLAY_BACKGROUND_MUSIC",
        SOUND_JACKPOT_START: "SOUND_JACKPOT_START",
        SOUND_JACKPOT_LOOP: "SOUND_JACKPOT_LOOP",
        SOUND_STOP_JACKPOT_LOOP: "SOUND_STOP_JACKPOT_LOOP",
        SOUND_BIGWIN_LOOP: "SOUND_BIGWIN_LOOP",
        SOUND_STOP_BIGWIN_LOOP: "SOUND_STOP_BIGWIN_LOOP",
        SOUND_STOP_REEL: "SOUND_STOP_REEL",
    }
   
};
module.exports = TayDuEventsCode;