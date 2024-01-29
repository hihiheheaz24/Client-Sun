// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

(function () {
    cc.xxLiveJackpotUserWinItem = cc.Class({
    extends: cc.Component,
    properties: {
        bg:cc.Sprite,
        sfsBg:[cc.SpriteFrame],
        lbTop:cc.Label,
        spriteTop:cc.Sprite,
        sfsTop:[cc.SpriteFrame],
        lbName:cc.Label,
        lbAmount:cc.Label
    },

    updateItem:function(data,index)
    {
        this.bg.spriteFrame = this.sfsBg[index%2];
        if(index<3)
        {
            this.spriteTop.spriteFrame = this.sfsTop[index];
            this.lbTop.node.active = false;
        }
        else
        {
            this.spriteTop.node.active = false;
            this.lbTop.string = index+1;
        }
        this.lbName.string = data.DisplayName;
        this.lbAmount.string = cc.Tool.getInstance().formatNumber(data.JackpotAmount);
        
    }

})}).call(this);
