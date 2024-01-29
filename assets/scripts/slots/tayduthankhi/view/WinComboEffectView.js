// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

(function () {
    cc.WinComboEffectView = cc.Class({
    extends: cc.Component,

    properties: {
        handlerNode:cc.Node,
        listItem:[cc.ItemEffectTayDuThanKhi],
        totalWinAnim:cc.Animation,
        totalWinLabel:cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.handlerNode.active = false;
        this.currentData = [];
    },

    setSymbolSkeletonData:function(data,skeletonData)
    {
        for (let index = 0; index < this.listItem.length; index++) {
            this.listItem[index].setSymBolSkeletonData(skeletonData[data[index]-1]);
        }
        this.listSymbolID = data;
    },
    activeEffect:function(data,TotalWin,isFreeGame)
    {
        let betAmount = cc.TayDuThanKhiController.getInstance().getBetAmount();
        if (TotalWin<betAmount) {
            this.betType = 'loss';
            cc.TayDuThanKhiController.getInstance().playEffect(cc.AudioTayDuClipIndex.SOUND_WIN_NORMAL,false,1);
        }else if (TotalWin/betAmount<5) {
            this.betType = 'win';
            cc.TayDuThanKhiController.getInstance().playEffect(cc.AudioTayDuClipIndex.SOUND_WIN_BIG,false,1);
        }else {
            this.betType = 'bigWin';
            cc.TayDuThanKhiController.getInstance().playEffect(cc.AudioTayDuClipIndex.SOUND_WIN_HUGE,false,1);

        }
        if (this.currentData!=data&&data!=null) {
            let allComboPos = this.combineAllWinCombo(data);
            if (isFreeGame) {
                data = [{Position:allComboPos,WinAmount:TotalWin}];
            }else data.unshift({Position:allComboPos,WinAmount:TotalWin});
            this.reset();
            this.handlerNode.active = true;
            let count = 0;
            this.showEffect(data[count].Position,data[count].WinAmount);
            if (this.interval) {
                clearInterval(this.interval);
            }
            if (cc.TayDuThanKhiController.getInstance().currentBonusData!=null&&!isFreeGame&&cc.TayDuThanKhiController.getInstance().currentJackpotData==null) {
                cc.TayDuThanKhiController.getInstance().openFreeGameView();
                cc.TayDuThanKhiController.getInstance().setIsBonusing(true);
            }
            if (!isFreeGame&&cc.TayDuThanKhiController.getInstance().currentJackpotData==null) {
                if (cc.TayDuThanKhiController.getInstance().getIsBonusing()==false) {
                    this.interval = setInterval(function () {
                        if (count==data.length) {
                                count=0;
                                this.showEffect(data[count].Position,data[count].WinAmount);
                        }else
                        {
                            cc.TayDuThanKhiController.getInstance().playEffect(cc.AudioTayDuClipIndex.SOUND_WIN,false,1);
                            this.showEffect(data[count].Position,data[count].WinAmount);
                        }
                        count++;
                    }.bind(this), 3000)
                    cc.TayDuThanKhiController.getInstance().doneAllEffect();
                }
            }
            else{
                if (isFreeGame) {
                    if (cc.TayDuThanKhiController.getInstance().getQuickMode()) {
                        cc.director.getScheduler().schedule(function () {
                            cc.TayDuThanKhiController.getInstance().spinFreeGameNormal();       
                        }.bind(this), this, 0, 0, 1, false);
                    }
                    else
                    {
                        cc.director.getScheduler().schedule(function () {
                            cc.TayDuThanKhiController.getInstance().spinFreeGameNormal();       
                        }.bind(this), this, 0, 0, 2, false);
                    }
                    
                }else{
                    this.interval = setInterval(function () {
                        if (count==data.length) {
                            count=0;
                            this.showEffect(data[count].Position,data[count].WinAmount);
                        }else
                        {
                            cc.TayDuThanKhiController.getInstance().playEffect(cc.AudioTayDuClipIndex.SOUND_WIN,false,1);
                            this.showEffect(data[count].Position,data[count].WinAmount);
                        }
                        count++;
                    }.bind(this), 3000)
                }
            }
            
        }
        else{
            if (this.interval) {
                clearInterval(this.interval);
            }
        }
    },
    showEffect:function(data,WinAmount)
    {
        this.reset();
        this.totalWinAnim.node.active = false;
        for (let index = 0; index < data.length; index++) {
            this.listItem[data[index]-1].node.active = true;
            this.listItem[data[index]-1].itemID = this.listSymbolID[data[index]-1];
            this.listItem[data[index]-1].playWin(this.betType);
            if (data[index]%5==3) {
                this.totalWinAnim.node.setPosition(cc.v2(0,-300+120*Math.floor(data[index]/5)));
                this.totalWinLabel.string = cc.Tool.getInstance().formatNumberK(WinAmount);
                this.totalWinAnim.play('totalWinLabel');
                this.totalWinAnim.node.active = true;
            }
        }
        this.handlerNode.active = true;
    },
    openView:function(enable)
    {
        this.handlerNode.active = enable;
        if (this.interval) {
            clearInterval(this.interval);
        }
    },
    onDestroy()
    {
        clearInterval(this.interval);
    }
    ,
    reset:function()
    {
        for (let index = 0; index < this.listItem.length; index++) {
            this.listItem[index].node.active = false;  
        }
    },
    combineAllWinCombo:function(data)
    {
        let array = [];
        for (let index = 0; index < data.length; index++) {
            array = this.joinArray(array,data[index].Position);
        }
        return array;
    },
    joinArray:function (arr, arr2) {
	
		// A counter for adding element
		let k = arr.length
	
		// Checking every element and
		// adding required element
		arr2.forEach(element => {
			if (arr.indexOf(element) == -1) {
				arr[k] = element
				k++
			}
		});
	
		// Returning resultant array
		return arr
	},
});
}).call(this);
