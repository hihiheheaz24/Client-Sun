// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

(function () {
    cc.TayDuThanKhiCol = cc.Class({
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
                let random = Math.floor(4+Math.random() * 7);
                this.listNodeSymbol[index].getComponent(cc.ItemTayDuThanKhi).symbolSkeleton.skeletonData = this.listSymbolSkeletonData[random];                    
                this.listNodeSymbol[index].getComponent(cc.ItemTayDuThanKhi).playStatic(random);
            }
        },
        startSpin:function()
        {
            this.nearBonus = false;
            this.anim.play('beginStartNormal')
        },
        spinNormal:function()
        {
            if (this.isStop==false||this.nearBonus==true) {
                this.anim.play('spinNormal')
            }
            else
            {
                this.anim.play('stopSpinNormal')
            }
            
        },
        stopSpinNormal:function()
        {
            if (this.nearBonus==true) {
                
                cc.TayDuThanKhiController.getInstance().playEffect(cc.AudioTayDuClipIndex.SOUND_NEAR_WIN,false,1);
                var animState = this.anim.play('nearBonus');
                animState.speed = 3;
                for (let index = 0; index < 30; index++) {
                    cc.director.getScheduler().schedule(function () {
                        animState.speed -=0.06;
                    }.bind(this), this,0 , 0, index*0.04, false);
                }
                return;
            }
            if (this.isStop) {
                this.anim.play('stopSpinNormal');
            }
        },
        onStopLastCol:function()
        {
            if (this.nearBonus==true) {
                cc.TayDuThanKhiController.getInstance().hideNearBonusEffect();
            }
            cc.TayDuThanKhiController.getInstance().playEffect(cc.AudioTayDuClipIndex.SOUND_REEL_STOP,false,1);
            if (this.colIndex==5) {
                cc.TayDuThanKhiController.getInstance().showWinCombo();
                cc.TayDuThanKhiController.getInstance().showCurrentWinAmount();
                if (cc.TayDuThanKhiController.getInstance().getCurrentJackPotWinData()!=null) {
                    cc.TayDuThanKhiController.getInstance().showMiniGameJackpot();
                }
            }
        },
        changeSymbolRandom:function(position)
        {
            let random = Math.floor(4+Math.random() * 7);
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
