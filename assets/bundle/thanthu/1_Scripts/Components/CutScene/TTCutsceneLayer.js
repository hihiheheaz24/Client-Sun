const Emitter = require('TTEventEmitter');
const Config = require('TTConfig');
const DataStore = require('TTDataStore');
const EventCode = require("TTEventsCode");
const {registerEvent, removeEvents, convertAssetArrayToObject } = require('TTUtils');
cc.Class({
    extends: cc.Component,

    properties: {
        listCutScene: [cc.Prefab],
        _listNodeCutScene : []
    },

    onLoad() {
        this.cutSceneAssets = convertAssetArrayToObject(this.listCutScene);
        this.initEvents();
    },

    initEvents() {
        registerEvent(EventCode.CUT_SCENE.SHOW_CUT_SCENE, this.showCutScene, this);
    },

    showCutScene(name = "", content = null, callback) {
        const cutScenePrefab = this.cutSceneAssets[name];
        if (!cutScenePrefab) return;
        const cutSceneItem = cc.instantiate(cutScenePrefab);
        cutSceneItem.parent = this.node;
        cutSceneItem.show(content, callback);
        this._listNodeCutScene.push(cutSceneItem);
    },
    
    hideCutScene() {
        
    },

    hideAllCutScene() {
        this._listNodeCutScene.forEach((item)=> {
            if(cc.isValid(item)){
                item.resetOnExit();
                item.destroy();
            }
        });
        this._listNodeCutScene.length = 0;
    },

    onDestroy() {
        removeEvents(this);
    },
});
