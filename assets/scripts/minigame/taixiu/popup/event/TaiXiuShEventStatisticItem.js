// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

(function () {
    cc.TaiXiuShEventStatisticItem = cc.Class({
    extends: cc.Component,

    properties: {
        timeLabel:cc.Label,
        accountLabel:cc.Label,
        boxTypeSprite:cc.Sprite,
        boxTypeSpriteFrame:[cc.SpriteFrame],
        rewardLabel:cc.Label,
        oddColor:cc.Color,
        evenColor:cc.Color
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    updateItem:function(data,itemID)
    {
        if(itemID%2==0)
        {
            this.node.color = this.oddColor;
        }
        else
        {                
            this.node.color = this.evenColor;
        }
        this.timeLabel.string = data.OpenBoxDate;
        this.accountLabel.string = data.DisplayName.slice(0,data.DisplayName.length-3)+"***";
        this.boxTypeSprite.spriteFrame = this.boxTypeSpriteFrame[data.TypeBox];
        this.rewardLabel.string = data.Description?data.Description:'';
    }

    // [{
    //     "OpenBoxDate":"2023-04-16T20:19:00",// Thời gian mở
    //     "DisplayName":"lucid2341", // Nickname mở
    //     "TypeBox":3,// Loại hộp
    //     "Description":"100M" // Phần thưởng (mô tả của lọai thưởng)
    //     }]
});
}).call(this);
