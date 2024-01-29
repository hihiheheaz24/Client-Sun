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
        colum:[cc.TayDuThanKhiCol],
        itemScatter:[cc.ScatterItemEffect],
        wukongSitEffect:cc.WukongSitEffect,
        nearBonusEffect:sp.Skeleton,
        winComboEffectView:cc.WinComboEffectView
        },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.TayDuThanKhiController.getInstance().setIconView(this);
        this.nearBonusEffect.node.active = false;
        this.tempData = [2,1,2,5,2,9,6,6,11,10,8,10,11,11,4,6,9,3,3,7,11,5,4,4,4,6,5,5,4,5];
    },

    getListSymbolSkeleton:function () {
        return this.listIcon;
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
    spinNormal:function(data)
    {
        this.wukongSitEffect.backIdle();
        this.winComboEffectView.openView(false);
        this.resetAll();
        this.scatterData = [];
        let bonusCount = 0;
        this.nearBonus = false;
        let isScatter = false;
        for (let index = 0; index < this.colum.length; index++) {
                this.colum[index].isStop = false;
                this.colum[index].symbolData = [];
        }

        let newData = this.ConvertTo30ElementForm(data);
        this.winComboEffectView.setSymbolSkeletonData(newData,this.listIcon);
        for (let index = 0; index < newData.length; index++) {
            switch (index%5) {
                case 0:
                    this.colum[0].symbolData.unshift(newData[index]);
                    if(newData[index]==2)
                    bonusCount++;
                    break;
                case 1:
                    this.colum[1].symbolData.unshift(newData[index]);
                    if (newData[index]==1) {
                        isScatter = true;
                    }
                    break;
                case 2:

                    this.colum[2].symbolData.unshift(newData[index]);
                    if(newData[index]==2)
                    bonusCount++;
                    break;
                case 3:

                    this.colum[3].symbolData.unshift(newData[index]);
                    break;
                case 4:
                    this.colum[4].symbolData.unshift(newData[index]);
                    break;
            }
        }
        if (bonusCount==2) {
            this.nearBonus = true;
        }
        if (isScatter) {
            let scatterNextCol = 1;
            this.scatterStepNumber = 0;
            this.rowExpanded = 0;
            for (let index = 1; index < 4; index++) {
                for (let j = 0; j < this.colum[index].symbolData.length; j++) {
                    let symbolID = this.colum[index].symbolData[j];
                    if (symbolID==1&&scatterNextCol==index) {
                        this.scatterData.push({col:index,row:j});
                        scatterNextCol+=1;
                    }
                }
            }
            this.showScatterEffect();
        }
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
        
        if (isScatter==false) {
            this.stopSpinNormal(false);
        }
    },
    stopSpinNormal:function(isScatter)
    {   
        if (cc.TayDuThanKhiController.getInstance().getQuickMode()) {
            for (let index = 0; index < this.colum.length; index++) {
                cc.director.getScheduler().schedule(function () {
                    if (index==4&&this.nearBonus==true) {
                        this.colum[index].nearBonus = true;
                        this.nearBonusEffect.node.active = true;
                        this.nearBonusEffect.clearTracks();
                        this.nearBonusEffect.setToSetupPose();
                        this.nearBonusEffect.setAnimation(0,'near_win',true);
                    }
                    else
                    this.colum[index].isStop = true;
                }.bind(this), this, 0, 0, 0.05+0.15*index, false);
            }
        }
        else
        {
            if (isScatter) {
                for (let index = 0; index < this.colum.length; index++) {
                    cc.director.getScheduler().schedule(function () {
                        if (index==4&&this.nearBonus==true) {
                            this.colum[index].nearBonus = true;
                            this.nearBonusEffect.node.active = true;
                            this.nearBonusEffect.clearTracks();
                            this.nearBonusEffect.setToSetupPose();
                            this.nearBonusEffect.setAnimation(0,'near_win',true);
                        }
                        else
                        this.colum[index].isStop = true;
                    }.bind(this), this, 0, 0, 0.5*index, false);
                }
            }
            else
            {
                for (let index = 0; index < this.colum.length; index++) {
                    cc.director.getScheduler().schedule(function () {
                        if (index==4&&this.nearBonus==true) {
                            this.colum[index].nearBonus = true;
                            this.nearBonusEffect.node.active = true;
                            this.nearBonusEffect.clearTracks();
                            this.nearBonusEffect.setToSetupPose();
                            this.nearBonusEffect.setAnimation(0,'near_win',true);
                        }
                        else
                        this.colum[index].isStop = true;
                    }.bind(this), this, 0, 0, 2+ 0.5*index, false);
                }
            }
            
        }
    },
    hideNearBonusEffect:function()
    {
        this.nearBonusEffect.node.active = false;
    },
    showScatterEffect:function()
    {
        let step = this.scatterStepCount(this.scatterData);
        if (this.scatterStepNumber>=step.length) {
            this.stopSpinNormal(true);
            return;
        }
        this.delay=0;
        for (let j = 0; j < step[this.scatterStepNumber].length; j++) {
            cc.director.getScheduler().schedule(function () {
                let isFinishStep = j==(step[this.scatterStepNumber].length-1);
                this.itemScatter[step[this.scatterStepNumber][j].col-1].activeEffect(6-step[this.scatterStepNumber][j].row,isFinishStep,this.rowExpanded,step[this.scatterStepNumber].length);
                if (isFinishStep) {
                    this.rowExpanded+=step[this.scatterStepNumber].length;
                    this.scatterStepNumber+=1;
                }
            }.bind(this), this,0 , 0, this.delay, false);
            this.delay+=1.5;
        }
    },
    scatterStepCount:function(data)
    {
        let step = [];
        let currentStepData = [];
        if (data.length==1) {
            currentStepData.push(data[0]);
            step.push(currentStepData);
        }
        else if (data.length==2) {
            if (data[1].row==2) {
                currentStepData.push(data[0]);
                step.push(currentStepData);
                currentStepData = [];
                currentStepData.push(data[1]);
                step.push(currentStepData);
            }
            else{
                currentStepData.push(data[0]);
                currentStepData.push(data[1]);
                step.push(currentStepData);
            }
        }
        else if (data.length==3) {
            if (data[1].row==2&&data[2].row>=2) {
                currentStepData.push(data[0]);
                step.push(currentStepData);
                currentStepData = [];
                currentStepData.push(data[1]);
                currentStepData.push(data[2]);
                step.push(currentStepData);
            }
            if (data[1].row==2&&data[2].row==1) {
                currentStepData.push(data[0]);
                step.push(currentStepData);
                currentStepData = [];
                currentStepData.push(data[1]);
                step.push(currentStepData);
                currentStepData = [];
                currentStepData.push(data[2]);
                step.push(currentStepData);
            }
            if (data[1].row>2&&data[2].row<3) {
                currentStepData.push(data[0]);
                currentStepData.push(data[1]);
                step.push(currentStepData);
                currentStepData = [];
                currentStepData.push(data[2]);
                step.push(currentStepData);
            }
            if (data[1].row>2&&data[2].row>2) {
                currentStepData.push(data[0]);
                currentStepData.push(data[1]);
                currentStepData.push(data[2]);
                step.push(currentStepData);
            }
        }
        return step;
    },
    showWinCombo:function(data,TotalWin)
    {
        if (data!=null) {
            this.winComboEffectView.activeEffect(data,TotalWin,false);
        }
        else
        {   
            if (cc.TayDuThanKhiController.getInstance().currentBonusData==null&&cc.TayDuThanKhiController.getInstance().currentJackpotData==null) {
               console.log("done Effect");
                cc.TayDuThanKhiController.getInstance().doneAllEffect();
            }

        }
    },
    wukongPowerUpEffect:function()
    {
        this.wukongSitEffect.powerUp();
    },
    ConvertTo30ElementForm:function(data)
    {
        switch (data.length) {
            case 15:
                for (let index = 0; index < 15; index++) {
                    let randomID = 4+Math.floor(Math.random() *7);
                    data.push(randomID);
                }
                break;

            case 20:
                for (let index = 0; index < 10; index++) {
                    let randomID = 4+Math.floor(Math.random() *7)
                    data.push(randomID);
                }
                break;
            case 25:
                for (let index = 0; index < 5; index++) {
                    let randomID = 4+Math.floor(Math.random() *7)
                    data.push(randomID);
                }
                break;
        }
        return data;
    },

    resetAll:function()
    {
        for (let index = 0; index < this.itemScatter.length; index++) {
            this.itemScatter[index].resetPostion();

        }
    }
    // update (dt) {},
});
