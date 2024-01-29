/*
 * Generated by BeChicken
 * on 11/14/2019
 * version v1.0
 */
(function () {
    cc.BauCuaHistoryItem = cc.Class({
        "extends": cc.Component,
        properties: {
            sprite: cc.Sprite,
            lbSession: cc.Label,
            lbTime: cc.Label,
            lbBet: cc.Label,
            lbWin: cc.Label,
            spriteDice1: cc.Sprite,
            spriteDice2: cc.Sprite,
            spriteDice3: cc.Sprite,
            spriteDiceBet: cc.Sprite,
        },

        updateItem: function (item, itemID) {
            this.sprite.enabled = itemID % 2 === 0;
            this.lbSession.string = '#' + item.SessionID;
            this.lbTime.string = cc.Tool.getInstance().convertUTCTime(item.CreateTime);
            let controller = cc.BauCuaController.getInstance();
            let isShowResultDices = item.Dice1 != -1;
            this.activeResultDices(isShowResultDices);
            if (isShowResultDices) {
                this.spriteDice1.spriteFrame = controller.getSfDiceHistory(parseInt(item.Dice1) - 1);
                this.spriteDice2.spriteFrame = controller.getSfDiceHistory(parseInt(item.Dice2) - 1);
                this.spriteDice3.spriteFrame = controller.getSfDiceHistory(parseInt(item.Dice3) - 1);
            }
            this.spriteDiceBet.spriteFrame = controller.getSfDiceHistory(parseInt(item.GateID) - 1);
            this.lbBet.string = cc.Tool.getInstance().formatMoneyToKMB(item.Bet);
            this.lbWin.string = cc.Tool.getInstance().formatMoneyToKMB(item.Award);

            this.item = item;
            this.itemID = itemID;
        },
        activeResultDices: function (isActive) {
            this.spriteDice1.node.active = isActive;
            this.spriteDice2.node.active = isActive;
            this.spriteDice3.node.active = isActive;
        }
    });
}).call(this);