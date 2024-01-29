// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

(function () {
    cc.PlayHistoryItem = cc.Class({
    extends: cc.Component,
    properties: {
        lbTransactionID:cc.Label,
        lbTime:cc.Label,
        lbService:cc.Label,
        lbAmount: cc.Label,
        lbBalance: cc.Label
    },

    updateItem:function(data,index)
    {
        let dataTemp =  {
            "SessionID": 108554,
            "Balance": 723822647,
            "BetValue": 10000,
            "PrizeValue": 19800,
            "IDGame": "109",
            "CreatedTime": "2023-10-28T16:16:25.723",
            "BalanceFormat": "723.822.647",
            "BetValueFormat": "10.000",
            "PrizeValueFormat": "19.800"
        }
        this.lbTransactionID.string = data.SessionID;
        this.lbService.string = cc.Config.getInstance().getGameName(data.IDGame);
        this.lbTime.string = data.CreatedTime.slice(0,19).replace("T"," ");
        this.lbAmount.string = cc.Tool.getInstance().formatNumber(data.PrizeValue - data.BetValue);
        this.lbBalance.string = cc.Tool.getInstance().formatNumber(data.Balance);
    }

})}).call(this);
