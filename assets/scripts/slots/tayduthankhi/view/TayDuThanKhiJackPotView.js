// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

(function () {
    cc.TayDuThanKhiJackPotView = cc.Class({
        extends: cc.Component,

        properties: {
            listItemPeach:[sp.Skeleton],
            listPeachAppearEffect:[sp.Skeleton],
            holoSkeleton:sp.Skeleton
        },

        onLoad () {
            this.anim = this.node.getComponent(cc.Animation);
        },

        onEnable () {
            this.JackPotData = cc.TayDuThanKhiController.getInstance().getCurrentJackPotWinData();
            cc.TayDuThanKhiController.getInstance().playBackGroundMusic(cc.AudioTayDuClipIndex.BONUS_BG_MUSIC);
            this.peachStatus = [false,false,false,false,false,false,false,false,false];
            this.currentStep = 0;
            this.stepData = this.scheduleStep(this.JackPotData.JackpotType);
            this.holoSkeleton.node.active = true;
            this.holoSkeleton.clearTracks();
            this.holoSkeleton.setToSetupPose();
            for (let index = 0; index < this.listPeachAppearEffect.length; index++) {
                    this.listPeachAppearEffect[index].node.active = false;
                    this.listItemPeach[index].node.active = false;
            }
            this.holoSkeleton.setStartListener(()=>{
                if (this.holoSkeleton.animation=='Appear') {
                    cc.director.getScheduler().schedule(function () {
                        this.anim.play('openJackpotView');
                        this.spawnPeach();
                    }.bind(this), this,0 , 0,4.5, false);
                }
            })
            this.holoSkeleton.setAnimation(0,'Appear',false);
            this.holoSkeleton.addAnimation(0,'Idle',false);
            this.holoSkeleton.addAnimation(0,'Out',false);
            cc.TayDuThanKhiController.getInstance().playEffect(cc.AudioTayDuClipIndex.SOUND_BONUS,false,1);
            cc.director.getScheduler().schedule(function () {
                cc.TayDuThanKhiController.getInstance().playEffect(cc.AudioTayDuClipIndex.SOUND_BONUS_OPEN,false,1);
            }.bind(this), this,0 , 0,1, false);

            
        },
        spawnPeach:function()
        {
            for (let index = 0; index < this.listPeachAppearEffect.length; index++) {
                cc.director.getScheduler().schedule(function () {
                    this.listPeachAppearEffect[index].node.active = true;
                    this.listPeachAppearEffect[index].clearTracks();
                    this.listPeachAppearEffect[index].setToSetupPose();
                    this.listPeachAppearEffect[index].setAnimation(0,'Appear_TraiDao',false);
                }.bind(this), this,0 , 0,0.2+ index*0.15, false);
                cc.director.getScheduler().schedule(function () {
                    this.listItemPeach[index].node.active = true;
                    this.listItemPeach[index].clearTracks();
                    this.listItemPeach[index].setToSetupPose();
                    this.listItemPeach[index].setAnimation(0,'Static_Peach',false);
                }.bind(this), this,0 , 0, 0.3+index*0.15, false);
            }
        },
        onClickPeach:function(event,pos)
        {
            if (this.peachStatus[pos-1]) {
                return;
            }
            cc.director.getScheduler().schedule(function () {
                cc.TayDuThanKhiController.getInstance().playEffect(cc.AudioTayDuClipIndex.SOUND_PEACH_OPEN,false,1);            
            }.bind(this), this,0 , 0, 1.5, false);
            let position = parseInt(pos)-1;
            if (this.currentStep<this.stepData.length) {
                this.listItemPeach[position].addAnimation(0,'Choose_Peach',false);
                switch (this.stepData[this.currentStep]) {
                    case 1:
                        this.listItemPeach[position].addAnimation(0,'Open_Minor',false);
                        this.listItemPeach[position].addAnimation(0,'Idle_Minor',true);
                        break; 
                    case 2:
                        this.listItemPeach[position].addAnimation(0,'Open_Major',false);
                        this.listItemPeach[position].addAnimation(0,'Idle_Major',true);
                        break; 
                    case 3:
                        this.listItemPeach[position].addAnimation(0,'Open_Grand',false);
                        this.listItemPeach[position].addAnimation(0,'Idle_Grand',true);
                        break; 
                }
                this.currentStep++;
                if (this.currentStep==this.stepData.length) {
                    cc.director.getScheduler().schedule(function () {
                        this.anim.play('closeJackpotView');
                        cc.TayDuThanKhiController.getInstance().showPopUpJackPotEffect();
                    }.bind(this), this,0 , 0, 2, false);
                    cc.director.getScheduler().schedule(function () {
                        this.node.active = false;
                    }.bind(this), this,0 , 0, 2.5, false);
                }
                this.peachStatus[pos-1] = true;
            }
        },
        scheduleStep:function(jackpotType)
        {
            let array = [];
            let jpType = jackpotType;
            array.push(jpType);
            array.push(jpType);
            if(jpType ==1)
            {
                array.push(2);
                array.push(3);
                array.push(2);
            }
            if(jpType ==2)
            {
                array.push(3);
                array.push(1);
                array.push(3);
            }
            if(jpType ==3)
            {
                array.push(2);
                array.push(1);
                array.push(2);
            }
            array.sort(() => Math.random() - 0.5)
            array.push(jpType);
            return array;
        }
        
    });
}).call(this);
