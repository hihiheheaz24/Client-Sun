// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

(function () {
    cc.ScatterItemEffect = cc.Class({
    extends: cc.Component,

    properties: {
        scatterSpine:sp.Skeleton,
        scatterStoneEffect:cc.Node,
        wukongNode:cc.Node,
        wukongSitEffect:cc.WukongSitEffect,
        columIndex: 1
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.scatterSpine.node.active = false;
        this.scatterStoneEffect.active = false;
    },

    start () {
        // this.activeEffect(2);
    },

    activeEffect:function(position,isFinishStep,rowExpanded,numberRowToExpand)
    {
        this.isFinishStep = false;
        this.scatterSpine.node.active = true;
        this.scatterStoneEffect.active = false;
        this.scatterSpine.clearTracks();
        this.scatterSpine.setToSetupPose();
        this.scatterSpine.addAnimation(0,'Appear_Fire',true);
        switch (position) {
            case 1:
                this.node.getComponent(cc.Animation).play('scatterEffect1');
                this.scatterPos = 1;
                break;
            case 2:
                this.node.getComponent(cc.Animation).play('scatterEffect2');
                this.scatterPos = 2;

                break;
            case 3:
                this.node.getComponent(cc.Animation).play('scatterEffect3');
                this.scatterPos = 3;
                break;
            case 4:
                this.node.getComponent(cc.Animation).play('scatterEffect4');
                this.scatterPos = 4;

                break;
            case 5:
                this.node.getComponent(cc.Animation).play('scatterEffect5');
                this.scatterPos = 5;
                break;
        }
        if (isFinishStep) {
            this.isFinishStep = isFinishStep;
            this.numberRowToExpand =  numberRowToExpand;
            this.rowExpanded = rowExpanded;
        }
    },
    startEffect:function()
    {
        this.scatterSpine.clearTracks();
        this.scatterSpine.setToSetupPose();
        this.scatterSpine.setEndListener(()=>{
            if (this.scatterSpine.animation=='Static') {
                
                this.scatterStoneEffect.parent = this.wukongSitEffect.wukongSpine.node;
                this.scatterStoneEffect.setPosition(this.columIndex*133-266,(this.scatterPos-4)*120-this.wukongSitEffect.wukongSpine.node.y);
                this.scatterStoneEffect.active = true;
                this.moveTo(cc.v2(this.wukongSitEffect.wukongSpine.node.x,0));
            }
        });
        switch (this.columIndex) {
            case 1:
                cc.TayDuThanKhiController.getInstance().playEffect(cc.AudioTayDuClipIndex.SOUND_SCATTER_COL_1,false,1);
                break;
            case 2:
                cc.TayDuThanKhiController.getInstance().playEffect(cc.AudioTayDuClipIndex.SOUND_SCATTER_COL_2,false,1);
                break;
            case 3:
                cc.TayDuThanKhiController.getInstance().playEffect(cc.AudioTayDuClipIndex.SOUND_SCATTER_COL_3,false,1);
                break;
        }
        this.scatterSpine.addAnimation(0,'Appear_in',false);
        this.scatterSpine.addAnimation(0,'Static',false);
        this.scatterSpine.addAnimation(0,'Active',false,1);
        this.scatterSpine.addAnimation(0,'Idle',true);
    },
    update: function (dt) {
        this.rotate();
    },
    
    rotate: function () {
        var angle = Math.atan2(this.wukongSitEffect.wukongSpine.node.position.x-this.scatterStoneEffect.position.x,this.wukongSitEffect.wukongSpine.node.position.y-this.scatterStoneEffect.position.y);
        this.scatterStoneEffect.angle = -this.radians_to_degrees(angle);
    },
     radians_to_degrees:function(radians)
    {
        var pi = Math.PI;
        return radians * (180/pi);
    },
    moveTo: function (endPosition) {
        var action = cc.moveTo(0.4, endPosition);
        action.easing(cc.easeOut(1));

        var callback = cc.callFunc(this.moveFinished, null, this.scatterStoneEffect);

        this.scatterStoneEffect.runAction(cc.sequence(action, callback));
        if (this.isFinishStep==true) {
            cc.director.getScheduler().schedule(function () {
                this.wukongSitEffect.activeEffect(this.numberRowToExpand,this.rowExpanded);
            }.bind(this), this,0 , 0, 1.5, false);
        }
    },

    moveToEnd: function (endPosition) {

            var action = cc.moveTo(0.3, endPosition);
            action.easing(cc.easeOut(1.0));

            var callback = cc.callFunc(this.moveToEndFinished, null, this);

            this.scatterStoneEffect.runAction(cc.sequence(action, callback));
    },

    moveFinished: function (node) {
        // node.destroy();
        
        node.active = false;
        node.position = cc.v2(0,0);
        cc.TayDuThanKhiController.getInstance().wukongPowerUpEffect();
    },
    moveToEndFinished: function (node) {
        // node.stopAllActions();
        // cc.BCController.getInstance().putToPool(node);
    },
    resetPostion:function()
    {
        this.node.getComponent(cc.Animation).play('scatterEffect0');
        this.scatterStoneEffect.parent = this.node;
        this.scatterStoneEffect.position = cc.v2(0,0);
    }
});
}).call(this);
