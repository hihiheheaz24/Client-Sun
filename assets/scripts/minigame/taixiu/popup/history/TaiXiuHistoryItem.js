/**
 * Created by Nofear on 3/15/2019.
 */


(function () {
    cc.TaiXiuHistoryItem = cc.Class({
        "extends": cc.Component,
        properties: {
            // nodeBG: cc.Node,

            lbSession: cc.Label,
            lbTime: cc.Label,
            lbSide: cc.Label,
            lbResult: cc.Label,
            lbBet: cc.Label,
            lbRefund: cc.Label,
            lbWin: cc.Label,
            bgOdd: cc.Node,
            bgEven: cc.Node
        },

        updateItem: function(item, itemID) {
            if(itemID%2==0)
            {
                this.bgOdd.active = true;
                this.bgEven.active = false;
            }
            else
            {
                
                this.bgOdd.active = false;
                this.bgEven.active = true;
            }
            // this.nodeBG.active = itemID % 2 !== 0;
            this.lbSession.string = item.SessionID;
            this.lbTime.string = cc.Tool.getInstance().convertUTCTime(item.CreateTime);
            this.lbSide.string = item.BetSide === cc.TaiXiuBetSide.TAI ? 'TÀI' : 'XỈU';

            this.lbBet.string = cc.Tool.getInstance().formatNumber(item.Bet);
            const listResult = item.Result.split(' ');
            const listDice = listResult[0].split('-');
            let total = 0;
            listDice.forEach(score =>{
                total += parseInt(score)
            })
            this.lbResult.string = listResult[0] + " " + total;
            this.lbRefund.string = cc.Tool.getInstance().formatNumber(item.Refund);
            this.lbWin.string = cc.Tool.getInstance().formatNumber(item.Award);

            this.item = item;
            this.itemID = itemID;
        },
    });
}).call(this);
