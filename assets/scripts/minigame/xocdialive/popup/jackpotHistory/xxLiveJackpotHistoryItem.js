// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

(function () {
    cc.xxLiveJackpotHistoryItem = cc.Class({
    extends: cc.Component,
    properties: {
        lbSessionID:cc.Label,
        lbFundAmount:cc.Label,
        spriteJackpotGate:[cc.Sprite],
        sfJackpotGate:[cc.SpriteFrame],
        lbTime:cc.Label,
        listUserNode:cc.Node
    },

    updateItem:function(data)
    {
        this.resetInfo();
        this.itemData = data;
        this.lbSessionID.string ="Phiên: #"+ data.SessionID;
        this.lbFundAmount.string = cc.Tool.getInstance().formatNumber(data.FundAmount);
        this.lbTime.string = data.CreateTimeFm;
        this.spriteJackpotGate.forEach(element => {
            element.spriteFrame = this.sfJackpotGate[data.JackpotGateId-1];
        });
    },
    onListUserClick:function(event)
    {
        var liveXXGetListJackpotUserCommand = new  cc.LiveXXGetListJackpotUserCommand;
        liveXXGetListJackpotUserCommand.execute(this,this.itemData.SessionID);
        cc.PopupController.getInstance().showBusy();
    },
    onLiveXXGetListJackpotUserResponse:function(data)
    {
        cc.LiveXXController.getInstance().setJackPotUserList(data);
        this.listUserNode.active = true;
    },
    resetInfo:function(){
        this.itemData = null;
        this.lbSessionID.string = "...";
        this.lbFundAmount.string = 0;
        this.lbTime.string = "...";
    }

})}).call(this);
