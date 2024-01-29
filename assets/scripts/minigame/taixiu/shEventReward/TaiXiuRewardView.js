(function () {
    cc.TaiXiuRewardView = cc.Class({
        "extends": cc.Component,
        properties: {
            boxSprite:[cc.Sprite],
            pos:[cc.Node],
            sfBox:[cc.SpriteFrame],
            shineEffectWhite:[cc.Node],
            shineEffectGold:[cc.Node],
            sfReward:[cc.SpriteFrame],
            defaultSf: cc.SpriteFrame
        },

        onLoad: function () {
            cc.TaiXiuController.getInstance().setTaiXiuRewardView(this);
            this.getRewardBoxDetails();
        },
        getRewardBoxDetails: function () {
            var txGetRewardBoxDetails = new cc.TXGetRewardBoxDetailsCommand;
            txGetRewardBoxDetails.execute(this);
        },
        getReward: function (event,position) {
            const index = parseInt(position);
            this.boxSprite[index-1].node.getComponent(cc.Button).interactable = false;
            var txGetRewardBoxCommand = new cc.TXGetRewardBoxCommand;
            txGetRewardBoxCommand.execute(this,position);
            this.pos[position-1].getComponent(cc.TaiXiuRewardPosition).startSpin(this.sfReward);
            
        },
        onTXGetRewardBoxResponse:function(response,position){
            console.log(response);
            if (response) {
                var self = this;
                this.pos[position-1].getComponent(cc.TaiXiuRewardPosition).stopSpin(response.Type);
                if (response.Type>16) {
                    this.shineEffectGold[position-1].active = true;
                }
                else{
                    this.shineEffectWhite[position-1].active = true;
                }
                setTimeout(() => {
                    if (response.Type>16) {
                        self.shineEffectGold[position-1].active = false;
                    }
                    else{
                        self.shineEffectWhite[position-1].active = false;
                    }
                }, 500);
            }
        },
        onGetRewardBoxDetailsResponse:function(response){
            this.resetGiftBox();
            console.log(response);
            for (let index = 0; index < response.length; index++) {
                let data = response[index];
                if(this.boxSprite[index]){
                    if (data.Status==false) {
                        this.boxSprite[index].node.getComponent(cc.Button).interactable = true;
                        this.boxSprite[index].spriteFrame = this.sfBox[data.Type+1];
                    }
                    else
                    {
                        this.boxSprite[index].spriteFrame = this.sfReward[data.RewardID>2?data.RewardID-2:data.RewardID-1];
                    }
                }
               
            }
            // [
            //     {
            //         "Name": "Vàng",
            //         "Type": 3,
            //         "Position": 1,
            //         "Status": true,
            //         "ReceiveDate": "2023-09-11T13:16:48.833",
            //         "RewardID": null
            //     }
            // ]
        },
        resetGiftBox:function()
        {
            for (let index = 0; index < 4; index++) {
                this.boxSprite[index].spriteFrame = this.defaultSf;
                this.boxSprite[index].node.getComponent(cc.Button).interactable = false;
            }
        }
    });
}).call(this);
