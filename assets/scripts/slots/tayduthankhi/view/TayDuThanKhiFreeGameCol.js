// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

(function () {
    cc.TayDuThanKhiFreeGameCol = cc.Class({
        extends: cc.Component,

        properties: {
            listNodeSymbol:[cc.Node],
            colIndex:1
        },

        // LIFE-CYCLE CALLBACKS:

        onLoad () {
            this.anim = this.node.getComponent(cc.Animation);
            this.isStop = false;
            this.symbolData = [1,3,5,1,4,7];  
        },
        start()
        {
            this.listSymbolSkeletonData = cc.TayDuThanKhiController.getInstance().getListSymbolSkeleton();
            for (let index = 0; index < this.listNodeSymbol.length; index++) {
                let random = Math.floor(7+Math.random() * 8);
                this.listNodeSymbol[index].getComponent(cc.ItemTayDuThanKhi).symbolSkeleton.skeletonData = this.listSymbolSkeletonData[random];                    
                this.listNodeSymbol[index].getComponent(cc.ItemTayDuThanKhi).playStatic(random);
            }
        },
        startSpin:function()
        {
            this.anim.play('beginStartNormal')
        },
        spinNormal:function()
        {
            this.anim.play('spinNormal')
        },
        stopSpinNormal:function()
        {
            if (this.isStop) {
                this.anim.play('stopSpinNormal')
            }
        },
        onStopLastCol:function()
        {
            cc.TayDuThanKhiController.getInstance().playEffect(cc.AudioTayDuClipIndex.SOUND_REEL_STOP,false,1);
            if (this.colIndex==5) {
                cc.TayDuThanKhiController.getInstance().showFreeGameWinCombo();
            }
        },
        stopButton:function()
        {
            this.isStop = !this.isStop;
        },
        changeSymbolRandom:function(position)
        {
            let random = Math.floor(7+Math.random() * 8);
            this.listNodeSymbol[position].getComponent(cc.ItemTayDuThanKhi).symbolSkeleton.skeletonData = this.listSymbolSkeletonData[random];
            this.listNodeSymbol[position].getComponent(cc.ItemTayDuThanKhi).playStatic(random);
        },
        setSymbolData:function(data)
        {
            this.symbolData = data;
        },
        displaySymbol:function(position)
        {
            this.listNodeSymbol[position].getComponent(cc.ItemTayDuThanKhi).symbolSkeleton.skeletonData = this.listSymbolSkeletonData[this.symbolData[position-1]-1];
            this.listNodeSymbol[position].getComponent(cc.ItemTayDuThanKhi).playStatic(this.symbolData[position-1]-1);
        },
    });
}).call(this);
