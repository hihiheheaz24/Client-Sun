cc.Class({
    extends: cc.Component,

    properties: {
        sprGameArray: [cc.SpriteFrame],
        lblGameName: cc.Label,
        sprGame: cc.Sprite,
        lblJackpot: [cc.LabelIncrement],
        buttonPlay: [cc.Button],
    },

    initializeJackpotItem(gameName, jackpotInformation) {
        this.lblGameName.string = gameName;
        switch (jackpotInformation[0].GameID.toString()) {
            case cc.GameId.MINI_POKER:
                this.sprGame.spriteFrame = this.sprGameArray[0];
                break;
            case cc.GameId.BLOCK_BUSTER:
                this.sprGame.spriteFrame = this.sprGameArray[1];
                break;
            case cc.GameId.AQUARIUM:
                this.sprGame.spriteFrame = this.sprGameArray[2];
                break;
            case cc.GameId.EGYPT:
                this.sprGame.spriteFrame = this.sprGameArray[3];
                break;
            case cc.GameId.THREE_KINGDOM:
                this.sprGame.spriteFrame = this.sprGameArray[4];
                break;
            case cc.GameId.DRAGON_BALL:
                this.sprGame.spriteFrame = this.sprGameArray[5];
                break;
            case cc.GameId.COWBOY:
                this.sprGame.spriteFrame = this.sprGameArray[6];
                break;
        }
        this.lblJackpot.forEach((jpValue, index) => {
            if(jackpotInformation[index]) {
                jpValue.tweenValueto(jackpotInformation[index].JackpotFund);
            }
        });

        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this; //This node is the node to which your event handler code component belongs
        clickEventHandler.component = 'JackpotGamVipItem';//This is the code file name
        clickEventHandler.handler = 'buttonPlayClick';
        clickEventHandler.customEventData = jackpotInformation[0].GameID;

        this.buttonPlay.forEach(button => {
            button.clickEvents.push(clickEventHandler);
        })
    },

    buttonPlayClick(event, data) {
        cc.LobbyController.prototype.joinGame(data);
        cc.TopController.getInstance().closeTopView();
    }
});
