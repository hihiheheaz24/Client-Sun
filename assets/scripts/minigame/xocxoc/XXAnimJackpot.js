// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        listAnimation: [cc.Animation],
        listSprites: [cc.Sprite],
        spriteFramesDiceNormal: [cc.SpriteFrame],
        spriteFramesDiceBulr: [cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    playAnimDice: function () {
        for (let i = 0; i < this.listSprites.length; i++) {
            let ran = Math.floor((Math.random() * 6));
            this.listSprites[i].spriteFrame = this.spriteFramesDiceBulr[ran];
        }
        this.listAnimation.forEach(element => {
            element.play("columnSpin");
        });
    },

    showResult: function (result) {
        this.listSprites[1].spriteFrame = this.spriteFramesDiceNormal[result["Dice1"] - 1];
        this.listSprites[3].spriteFrame = this.spriteFramesDiceNormal[result["Dice2"] - 1];
        this.listSprites[5].spriteFrame = this.spriteFramesDiceNormal[result["Dice3"] - 1];
        this.listSprites[7].spriteFrame = this.spriteFramesDiceNormal[result["Dice4"] - 1];
        for (let i = 0; i < this.listAnimation.length; i++) {
            this.scheduleOnce(() => {
                this.listAnimation[i].play("columnStop");
            }, i * 0.1);
        };
    }
});
