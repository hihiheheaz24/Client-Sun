// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        listIcon:[sp.SkeletonData],
        colum:[cc.TayDuThanKhiFreeGameCol],
        winComboEffectView:cc.WinComboEffectView,
        wildItem:[cc.FreeGameWildItem],
        mainWildItem:sp.Skeleton,
        changeSymbolEffect:sp.Skeleton,
        stoneEffect:sp.Skeleton,
        multiplierSprite:cc.Sprite,
        multiplierPopUpSprite:cc.Sprite,
        multiplierSf:[cc.SpriteFrame],
        wukongSkeleton:sp.Skeleton,
        tuongSkeleton:[sp.Skeleton],
        stepSprite:[cc.Node],
        btnSpin: sp.Skeleton,
        fgSpinSprite:cc.Node,
        normalSpinSprite:cc.Node,
        numberSpinLabel:cc.Label,
        currentWinLabel:cc.Label,
        boardCurrentWin:sp.Skeleton,
        kimCoBongEffect: sp.Skeleton,
        totalWinLable:cc.LabelIncrement
        // tuongWinAmount
        },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.TayDuThanKhiController.getInstance().setFreeGameView(this);
        this.tempData = [13,13,13,8,11,13,8,12,1,10,11,11,13,15,11];
    },
    onEnable()
    {
        this.BonusData = cc.TayDuThanKhiController.getInstance().getCurrentBonusData();
        cc.TayDuThanKhiController.getInstance().setCurrentBonusData(null);
        cc.TayDuThanKhiController.getInstance().playBackGroundMusic(cc.AudioTayDuClipIndex.FREE_GAME_BG_MUSIC);
        this.resetAll();
        this.wukongSkeleton.clearTracks();
        this.wukongSkeleton.setToSetupPose();
        
        // cc.TayDuThanKhiController.getInstance().playEffect(cc.AudioTayDuClipIndex.SOUND_FREE_GAME_WUKONG_OUT,false,1);
        this.wukongSkeleton.addAnimation(0,'appear',false);
        this.wukongSkeleton.addAnimation(0,'idle',true);
        cc.director.getScheduler().schedule(function () {
            this.spinNormal();
        }.bind(this), this, 0, 0, 2, false);
        for (let index = 0; index < this.tuongSkeleton.length; index++) {
            this.tuongSkeleton[index].node.active = true;
            this.tuongSkeleton[index].clearTracks();
            this.tuongSkeleton[index].setToSetupPose();
            this.tuongSkeleton[index].addAnimation(0,'In',false);
            this.tuongSkeleton[index].addAnimation(0,'Idle',true);
        }

    },
    changeTemplateData:function(event, type)
    {
        if (type=='x45') {
            this.tempData = [9,1,4,8,10,9,6,6,11,10,8,10,11,11,4,6,9,1,4,7,11,5,4,5,4,6,5,5,4,5]
        }
        if (type=='xx4') {
            this.tempData = [9,1,1,8,10,9,6,6,11,10,8,10,11,11,4,6,9,3,1,7,11,5,4,4,4,6,5,5,4,5]
        }
        if (type=='x4x') {
            this.tempData = [9,1,4,1,10,9,6,6,11,10,8,10,11,11,4,6,9,1,4,7,11,5,4,4,4,6,5,5,4,5]
        }
        if (type=='x44') {
            this.tempData = [9,1,4,8,10,9,6,6,11,10,8,10,11,11,4,6,9,1,1,7,11,5,4,4,4,6,5,5,4,5]
        }

    },
    spinNormal:function()
    {
        console.log(this.currentStep);

        if (this.currentStep==8) {
            this.normalSpinSprite.active = true;
            this.fgSpinSprite.active = false;
            cc.TayDuThanKhiController.getInstance().playEffect(cc.AudioTayDuClipIndex.SOUND_FREE_GAME_SMASH,false,1);
            cc.director.getScheduler().schedule(function () {
                for (let index = 0; index < this.tuongSkeleton.length; index++) {
                    this.tuongSkeleton[index].setAnimation(0,'Out',false);
                }            
            }.bind(this), this, 0, 0, 0.5, false);
            cc.director.getScheduler().schedule(function () {
                for (let index = 0; index < this.tuongSkeleton.length; index++) {
                    this.tuongSkeleton[index].node.active = false;
                }
                cc.TayDuThanKhiController.getInstance().showPopUpFreeGameWin(this.BonusData.Multiplier,this.BonusData.TotalWin*(this.BonusData.Multiplier-1)+this.totalWin);
                this.totalWinLable.tweenValueto(this.BonusData.TotalWin*(this.BonusData.Multiplier-1)+this.totalWin,1);
            }.bind(this), this, 0, 0, 1.5, false);
            this.wukongSkeleton.setAnimation(0,'attack_all',false);
            this.wukongSkeleton.addAnimation(0,'idle',true);            
            return;
        }
        let data = this.BonusData.Step[this.currentStep].SymbolID;
        this.winComboEffectView.openView(false);
        this.currentWildData = [7];
        for (let index = 0; index < this.colum.length; index++) {
                this.colum[index].isStop = false;
                this.colum[index].symbolData = [];
        }
        this.stepSprite[this.currentStep].active = false;
        this.btnSpin.clearTracks();
        this.btnSpin.setToSetupPose();
        cc.TayDuThanKhiController.getInstance().playEffect(cc.AudioTayDuClipIndex.SOUND_FREE_GAME_SPIN_POWER,false,1);
        this.btnSpin.setAnimation(0, 'SeLect', false);
        this.wukongSkeleton.setAnimation(0,'spin',false);
        this.wukongSkeleton.addAnimation(0,'idle',true);
        this.numberSpinLabel.string = 8-this.currentStep;
        let newData = this.ConvertTo30ElementForm(data);
        for (let index = 0; index < newData.length; index++) {
            if (newData[index]==1) {
                if (index!=7) {
                    this.currentWildData.push(index);
                }
                newData[index]=3;
            }
            switch (index%5) {
                case 0:
                    this.colum[0].symbolData.unshift(newData[index]);
                    break;
                case 1:
                    this.colum[1].symbolData.unshift(newData[index]);
                    break;
                case 2:
                    this.colum[2].symbolData.unshift(newData[index]);
                    break;
                case 3:
                    this.colum[3].symbolData.unshift(newData[index]);
                    break;
                case 4:
                    this.colum[4].symbolData.unshift(newData[index]);
                    break;
            }
        }
        this.winComboEffectView.setSymbolSkeletonData(newData,this.listIcon);
        let wildNew = this.arrayCompare(this.currentWildData,this.lastWildData)
        if (wildNew.length>0) {
            this.lastWildData = this.currentWildData;
            this.showWildEffect(wildNew);
        }
        else this.stopSpinNormal();
        if (cc.TayDuThanKhiController.getInstance().getQuickMode()) {
            for (let index = 0; index < this.colum.length; index++) {
                cc.director.getScheduler().schedule(function () {
                    this.colum[index].startSpin();
                }.bind(this), this, 0, 0, 0.15*index, false);
            }
        }
        else
        {
            for (let index = 0; index < this.colum.length; index++) {
                cc.director.getScheduler().schedule(function () {
                    this.colum[index].startSpin();
                }.bind(this), this, 0, 0, 0.5*index, false);
            }
        }
    },
    stopSpinNormal:function()
    {
        if (cc.TayDuThanKhiController.getInstance().getQuickMode()) {

            for (let index = 0; index < this.colum.length; index++) {
                cc.director.getScheduler().schedule(function () {
                    this.colum[index].isStop = true;
                }.bind(this), this, 0, 0, 0.15*index, false);
            }
        }else
        {
            for (let index = 0; index < this.colum.length; index++) {
                cc.director.getScheduler().schedule(function () {
                    this.colum[index].isStop = true;
                }.bind(this), this, 0, 0, 0.5*index, false);
            }
        }
    },
    showWildEffect:function(data)
    {
        let index = 0;
        let angle = 0;
        cc.TayDuThanKhiController.getInstance().playEffect(cc.AudioTayDuClipIndex.SOUND_WILD_CLONE,false,1);
        switch (data[0]) {
            case 1:
                index = 0;
                angle = 135;
                break;
            case 2:
                index = 1;
                angle = 180;
                break;
            case 3:
                index = 2;
                angle = -135;
                break;
            case 6:
                index = 3;
                angle = 90;
                break;
            case 8:
                index = 4;
                angle = -90;
                break;
            case 11:
                index = 5;
                angle = 45;
                break;
            case 12:
                index = 6;
                angle = 0;
                break;
            case 13:
                index = 7;
                angle = -45;
                break;
        }
        this.changeSymbolEffect.node.active = true;
        this.changeSymbolEffect.clearTracks();
        this.changeSymbolEffect.setToSetupPose();
        this.changeSymbolEffect.setCompleteListener(()=>{
                this.stoneEffect.node.active = true;
                this.stoneEffect.clearTracks();
                this.stoneEffect.setToSetupPose();
                this.stoneEffect.node.parent.angle = angle;
                this.stoneEffect.setCompleteListener(()=>{
                        this.wildItem[index].node.active = true;
                        this.wildItem[index].playAnim();
                        this.stoneEffect.node.active  = false;
                });
                this.stoneEffect.addAnimation(0,'Fly_Line',false);
                this.changeSymbolEffect.node.active = false;
        });
        this.changeSymbolEffect.addAnimation(0,'Frame_Out',false);
    },

    showWinCombo:function()
    {
        if (this.BonusData!=null) {
            let data = this.BonusData.Step[this.currentStep];
            let winAmount = 0;
            for (let index = 0; index < data.WinCombination.length; index++) {
                winAmount+=data.WinCombination[index].WinAmount;
            }
            this.totalWin +=winAmount;
            this.totalWinLable.tweenValueto(this.totalWin,1);
            let winType = cc.TayDuThanKhiController.getInstance().getWinTypebyWinAmount(winAmount);
            cc.TayDuThanKhiController.getInstance().playEffect(cc.AudioTayDuClipIndex.SOUND_FREE_GAME_TOTAL_WIN,false,1);
            this.currentWinLabel.node.active = false;
            this.currentWinLabel.string = "+"+cc.Tool.getInstance().formatNumber(winAmount);
            this.boardCurrentWin.node.active = true;
            this.boardCurrentWin.clearTracks();
            this.boardCurrentWin.setToSetupPose();
            this.boardCurrentWin.setStartListener(()=>{
                if (this.boardCurrentWin.animation=='Appear_Board') {
                    this.currentWinLabel.node.active = true;
                    this.currentWinLabel.node.getComponent(cc.Animation).play('totalWinLabel');
                }
                if (this.boardCurrentWin.animation=='Appear_Green') {
                    this.currentWinLabel.node.active = true;
                    this.currentWinLabel.node.getComponent(cc.Animation).play('totalWinLabel');
                }
                if (this.boardCurrentWin.animation=='Appear_Red') {
                    this.currentWinLabel.node.active = true;
                    this.currentWinLabel.node.getComponent(cc.Animation).play('totalWinLabel');
                }
            })
            switch (winType) {
                case 0:
                    this.boardCurrentWin.addAnimation(0,'Appear_Board',false);
                    this.boardCurrentWin.addAnimation(0,'Static_Board',false,0);
                    break;
                case 1:
                    this.boardCurrentWin.addAnimation(0,'Appear_Green',false);
                    this.boardCurrentWin.addAnimation(0,'Static_Green',false,0);
                    break;
                case 2:
                    this.boardCurrentWin.addAnimation(0,'Appear_Red',false);
                    this.boardCurrentWin.addAnimation(0,'Static_Red',false,0);
                    break;
            }
            
            //ngộ không đánh tướng
            console.log(data);
            if (data.MultiplierState.MultiplierSymbolID.length>0) {
                this.winComboEffectView.activeEffect(data.WinCombination,winAmount,false);
                cc.director.getScheduler().schedule(function () {
                    this.kimCoBongEffect.node.active = true;
                    this.kimCoBongEffect.clearTracks();
                    this.kimCoBongEffect.setToSetupPose();
                    this.kimCoBongEffect.setAnimation(0,'Appear_kcb',false)
                    cc.TayDuThanKhiController.getInstance().playEffect(cc.AudioTayDuClipIndex.SOUND_KIM_CO_BONG,false,1);
                    this.kimCoBongEffect.setCompleteListener(()=>{
                        let anim = 'skill'+data.MultiplierState.MultiplierSymbolID.length;
                        this.kimCoBongEffect.node.active = false;
                        if (anim=='skill1') {
                            cc.TayDuThanKhiController.getInstance().playEffect(cc.AudioTayDuClipIndex.SOUND_WUKONG_ATTACK_HUGE_WIN,false,1);
                        }else if (anim=='skill2') {
                            cc.TayDuThanKhiController.getInstance().playEffect(cc.AudioTayDuClipIndex.SOUND_WUKONG_ATTACK_COMBO_1,false,1);
                        }else{
                            cc.TayDuThanKhiController.getInstance().playEffect(cc.AudioTayDuClipIndex.SOUND_WUKONG_ATTACK_COMBO_2,false,1);
                        }
                        this.wukongSkeleton.setAnimation(0,anim,false);
                        this.wukongSkeleton.addAnimation(0,'idle',true);
                        cc.director.getScheduler().schedule(function () {
                            let animChoang = this.node.getComponent(cc.Animation).play('freeGameChoang');
                            animChoang.wrapMode = cc.WrapMode.PingPong;
                            animChoang.repeatCount = 2;
                            for (let index = 0; index < this.tuongSkeleton.length; index++) {
                                this.tuongSkeleton[index].clearTracks();
                                this.tuongSkeleton[index].setToSetupPose();
                                this.tuongSkeleton[index].addAnimation(0,'Hit',false);
                                this.tuongSkeleton[index].addAnimation(0,'Idle',true);
                            }
                        }.bind(this), this, 0, 0, 0.5, false);
                        this.currentMultiplier=data.MultiplierState.CurrentMultiplier;
                        this.multiplierSprite.spriteFrame = this.multiplierSf[this.currentMultiplier-1];
                        this.multiplierPopUpSprite.spriteFrame = this.multiplierSf[this.currentMultiplier-1];
                        
                        this.currentStep++;
                        cc.director.getScheduler().schedule(function () {
                            this.spinNormal();
                        }.bind(this), this, 0, 0, 2, false);
                    })
                }.bind(this), this, 0, 0, 0.5, false);
                
                
            }
            else
            {
                let nextAnim = '';
                let randomTuong = Math.floor(Math.random()*4)
                switch (randomTuong) {
                    case 0:
                        nextAnim = 'attack_1';
                        break;
                    case 1:
                        nextAnim = 'attack_2';
                        break;
                    case 2:
                        nextAnim = 'attack_3';
                        break;
                    case 3:
                        nextAnim = 'attack_4';
                        break;
                }
                
                this.wukongSkeleton.setAnimation(0,nextAnim,false);
                this.wukongSkeleton.addAnimation(0,'idle',true);
                cc.director.getScheduler().schedule(function () {
                    this.currentStep++;
                    if (winAmount>0) {
                        let betAmount = cc.TayDuThanKhiController.getInstance().getBetAmount();
                        if (winAmount<betAmount) {
                            cc.TayDuThanKhiController.getInstance().playEffect(cc.AudioTayDuClipIndex.SOUND_WUKONG_ATTACK_NORMAL_WIN,false,1);
                        }else if (winAmount/betAmount<5) {
                            cc.TayDuThanKhiController.getInstance().playEffect(cc.AudioTayDuClipIndex.SOUND_WUKONG_ATTACK_BIG_WIN,false,1);
                        }else {
                            cc.TayDuThanKhiController.getInstance().playEffect(cc.AudioTayDuClipIndex.SOUND_WUKONG_ATTACK_HUGE_WIN,false,1);

                        }
                        this.winComboEffectView.activeEffect(data.WinCombination,winAmount,true);
                        this.tuongSkeleton[randomTuong].node.getComponentInChildren(cc.Label).string = cc.Tool.getInstance().formatNumber(winAmount);
                        this.tuongSkeleton[randomTuong].setAnimation(0,'Hit',false);
                        this.tuongSkeleton[randomTuong].addAnimation(0,'Idle',true);
                        this.tuongSkeleton[randomTuong].node.getComponent(cc.Animation).play('tuongHitWin');
                    }else{
                        this.tuongSkeleton[randomTuong].setAnimation(0,'Dodge',false);
                        this.tuongSkeleton[randomTuong].addAnimation(0,'Idle',true);
                        this.tuongSkeleton[randomTuong].node.getComponent(cc.Animation).play('tuongNe');
                        switch (randomTuong) {
                            case 0:
                                cc.TayDuThanKhiController.getInstance().playEffect(cc.AudioTayDuClipIndex.SOUND_WUKONG_MISS_1,false,1);
                                break;
                            case 1:
                                cc.TayDuThanKhiController.getInstance().playEffect(cc.AudioTayDuClipIndex.SOUND_WUKONG_MISS_2,false,1);
                                break;
                            case 2:
                                cc.TayDuThanKhiController.getInstance().playEffect(cc.AudioTayDuClipIndex.SOUND_WUKONG_MISS_3,false,1);
                                break;
                            case 3:
                                cc.TayDuThanKhiController.getInstance().playEffect(cc.AudioTayDuClipIndex.SOUND_WUKONG_MISS_4,false,1);
                                break;
                        }
                        cc.TayDuThanKhiController.getInstance().playEffect(cc.AudioTayDuClipIndex.SOUND_BLOCK_ATTACK,false,1);

                        cc.director.getScheduler().schedule(function () {
                            this.spinNormal();
                        }.bind(this), this, 0, 0, 1, false);
                    }
                }.bind(this), this, 0, 0, 0.2, false);
                
                
            }
        }
        
        
    },
    showPopUpWinFreeGame:function(multiple, winAmount)
    {
        cc.director.getScheduler().schedule(function () {
            cc.TayDuThanKhiController.getInstance().showMiniGameJackpot();
        }.bind(this), this, 0, 0, 10, false);
    },
    arrayCompare:function(arr1,arr2)
    {
        let unique1 = arr1.filter((o) => arr2.indexOf(o) === -1);
        let unique2 = arr2.filter((o) => arr1.indexOf(o) === -1);

        const unique = unique1.concat(unique2);
        return unique;
    },
    ConvertTo30ElementForm:function(data)
    {
        switch (data.length) {
            case 15:
                for (let index = 0; index < 15; index++) {
                    let randomID = 7+Math.floor(Math.random() *8);
                    data.push(randomID);
                }
                break;

            case 20:
                for (let index = 0; index < 10; index++) {
                    let randomID = 7+Math.floor(Math.random() *8)
                    data.push(randomID);
                }
                break;
            case 25:
                for (let index = 0; index < 5; index++) {
                    let randomID = 7+Math.floor(Math.random() *8)
                    data.push(randomID);
                }
                break;
        }
        return data;
    },
     radians_to_degrees:function(radians)
    {
        var pi = Math.PI;
        return radians * (180/pi);
    },
    resetAll:function()
    {
        for (let index = 0; index < this.wildItem.length; index++) {
            this.wildItem[index].reset();
        }
        this.boardCurrentWin.node.active = false;
        this.currentStep = 0;
        let currentNormalWin = cc.Tool.getInstance().removeDot(this.totalWinLable.label.string);
        this.totalWin = currentNormalWin;
        this.lastWildData = [7];
        this.currentMultiplier = 1;
        this.multiplierSprite.spriteFrame = this.multiplierSf[this.currentMultiplier-1];
        this.multiplierPopUpSprite.spriteFrame = this.multiplierSf[this.currentMultiplier-1];
        for (let index = 0; index < this.stepSprite.length; index++) {
            this.stepSprite[index].active = true;
        }
        this.kimCoBongEffect.node.active = false;
        this.fgSpinSprite.active = true;
        this.normalSpinSprite.active = false;
        this.numberSpinLabel.string = 8;
        this.changeSymbolEffect.node.active = false;
        this.stoneEffect.node.active = false;
    },
    closeFreeGameView:function()
    {
        console.log("close freegame view");
        this.wukongSkeleton.setAnimation(0,'attack_kct',false);
        cc.TayDuThanKhiController.getInstance().playEffect(cc.AudioTayDuClipIndex.SOUND_FREE_GAME_WUKONG_OUT,false,1);
        cc.TayDuThanKhiController.getInstance().setIsBonusing(false);
        cc.director.getScheduler().schedule(function () {
            cc.TayDuThanKhiController.getInstance().transitionScene(false);
        }.bind(this), this, 0, 0, 2, false);
        cc.director.getScheduler().schedule(function () {
            cc.TayDuThanKhiController.getInstance().hideFreeGameView();
            cc.TayDuThanKhiController.getInstance().transitionScene(true);
        }.bind(this), this, 0, 0, 4, false);
    }
    // update (dt) {},
});
