(function () {
    cc.SicBoPopUpNewView = cc.Class({
    extends: cc.Component,

    properties: {
        popUpInfo:cc.Node,
        avatarSprite:cc.Sprite,
        lbName:cc.Label,
        lbBalance:cc.Label,
        //--------------------------------------------------
        popUpSetting:cc.Node,
        //--------------------------------------------------
        popUpMessage:cc.Node,
        labelMessage:cc.Label,
        //--------------------------------------------------
        popUpNoti:cc.Node,
        labelNoti:cc.Label,
        //--------------------------------------------------
        popUpMaxBet:cc.Node,
        popUpBigWin:cc.Node,
        popUpPlayerLeave:cc.Node,
    },
    onLoad:function()
    {
        this.controller = cc.SicBoController.getInstance();
        this.controller.setPopUpView(this);
    },
    showBigWin:function(xWin)
    {
        //TO DO
        this.popUpBigWin.active = true;
    },
    showPlayerLeave:function()
    {
        this.popUpPlayerLeave.active = true;
    },
    closePopUpInfo:function()
    {
        if (this.popUpInfo.active) {
            this.popUpInfo.getComponent(cc.Animation).play('sicboInfoPopupClose');
            let self = this;
            setTimeout(() => {
                self.popUpInfo.active = false;
            }, 300);
            return;
        }
    },
    showMessage:function(message)
    {
        this.labelMessage.string = message;
        cc.director.getScheduler().schedule(function () {
            this.popUpMessage.getComponent(cc.Animation).play("toast").wrapMode = cc.WrapMode.Normal;
        }.bind(this), this, 0, 0, 0, false);
        cc.director.getScheduler().schedule(function () {
            this.popUpMessage.getComponent(cc.Animation).play("toast").wrapMode = cc.WrapMode.Reverse;
        }.bind(this), this, 0, 0, 2, false);

    },
    openMaxBet:function()
    {
        this.popUpMaxBet.getComponent(cc.Animation).play("openMaxBet");
    },
    closeMaxBet:function()
    {
        this.popUpMaxBet.getComponent(cc.Animation).play("closeMaxBet");
    },
});
}).call(this);
