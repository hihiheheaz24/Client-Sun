
(function () {
    cc.TaiXiuShEventHistoryItem = cc.Class({
    extends: cc.Component,

    properties: {
        idLabel:cc.Label,
        sessionLabel:cc.Label,
        totalBetLabel:cc.Label,
        timeLabel:cc.Label,
        boxTypeSprite:cc.Sprite,
        boxTypeSpriteFrame:[cc.SpriteFrame],
        statusLabel:cc.Label,
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
        this.idLabel.string = data.ID;
        this.sessionLabel.string = "#"+data.SessionReceive;
        this.totalBetLabel.string = cc.Tool.getInstance().formatNumber(data.BetSessionReceive);
        this.timeLabel.string = data.ReceiveDate.slice(0,10);
        this.boxTypeSprite.spriteFrame = this.boxTypeSpriteFrame[data.TypeBox];
        this.statusLabel.string = data.Status?'Đã nhận':'Chưa mở';
        this.rewardLabel.string = data.Description?data.Description:'';
    }

    // [{
    //     "ID": 123,//Id quà
    //     "SessionReceive": 123,// Phiên nhận được hộp quà
    //     "BetSessionReceive": 123,//Tổng đặt ở phiên đó
    //     "ReceiveDate": "2023-04-16T20:19:00",// Ngày nhận quà
    //     "TypeBox": 1,// Loại hộp quà
    //     "TypeReward":1,// Phần thưởng
    //     "Status": true// Trạng thái mở hộp
    //     }]
});
}).call(this);
