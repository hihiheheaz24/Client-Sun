/*
 * Generated by BeChicken
 * on 11/14/2019
 * version v1.0
 */
(function () {
    cc.Xeng777HistoryItem = cc.Class({
        "extends": cc.Component,
        properties: {
            sprite: cc.Node,
            lbSession: cc.Label,
            lbTime: cc.Label,
            lbBet: cc.Label,
            lbWin: cc.Label,
            lbNumResult: cc.Label,
            spriteResultSymbol: cc.Sprite,
            lbTaiXiuResult: cc.Label,
            spriteDiceBet: cc.Sprite,
        },

        updateItem: function (item, itemID) {
            // {
            //     "SessionID": 353492,
            //     "GateID": 5,
            //     "Dice1": 2,
            //     "Dice2": 5,
            //     "Dice3": 3,
            //     "Dice4": 0,
            //     "Bet": 5000,
            //     "Award": 0,
            //     "CreateTime": "2023-10-17T02:02:13.09",
            //     "CreateTimeFm": "17/10/2023 02:02:13"
            // }
            this.sprite.active = itemID % 2 !== 0;
            this.lbSession.string = '#' + item.SessionID;
            this.lbTime.string = cc.Tool.getInstance().convertUTCTime(item.CreateTime);
            let controller = cc.Xeng777Controller.getInstance();
            if(item.Dice3!=0) this.spriteResultSymbol.spriteFrame = controller.getSpriteGateWin(parseInt(item.Dice3 - 1));
            else this.spriteResultSymbol.node.active = false;
            if (item.Dice1!=0) this.lbTaiXiuResult.string = item.Dice4>7?"TÀI":item.Dice4<7?"XỈU":"HOÀ";
            else this.lbTaiXiuResult.string = "";
            this.lbNumResult.string = item.Dice4>9?item.Dice4:"0"+item.Dice4;
            this.spriteDiceBet.spriteFrame = controller.getSpriteGateBet(item.GateID - 1);
            this.lbBet.string = cc.Tool.getInstance().formatNumber(item.Bet);
            this.lbWin.string = cc.Tool.getInstance().formatNumber(item.Award );

            this.item = item;
            this.itemID = itemID;
        },
    });
}).call(this);