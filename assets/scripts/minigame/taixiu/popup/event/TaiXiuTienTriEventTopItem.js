// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

(function () {
    cc.TaiXiuTienTriEventTopItem = cc.Class({
    extends: cc.Component,

    properties: {
        sttLabel:cc.Label,
        accountLabel:cc.Label,
        chainLabel:cc.Label,
        totalWinLostLabel:cc.Label,
        sessionLabel:cc.Label,
        rewardLabel:cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    updateItem:function(data,itemID)
    {
        this.sttLabel.string = itemID+1;
        this.accountLabel.string = data.NickName.slice(0,data.NickName.length-3)+"***";
        this.sessionLabel.string = "#"+data.SessionEnd;
        this.chainLabel.string = data.Chain;
        this.totalWinLostLabel.string = cc.Tool.getInstance().formatNumber(data.TotalWinLost);
        this.rewardLabel.string = data.DescriptionReward==null?'':data.DescriptionReward;
    }
    // {
    //     "UserID": 200093835,
    //     "NickName": "HFFG454TG",
    //     "Chain": 2,
    //     "IsWin": 1,
    //     "TotalWinLost": 2000,
    //     "SessionEnd": 1,
    //     "NameReward": "20 GP",
    //     "DescriptionReward": null,
    //     "QuantityReward": 1,
    //     "TotalReward": 20000,
    //     "TypeReward": 2
    //   }
});
}).call(this);
