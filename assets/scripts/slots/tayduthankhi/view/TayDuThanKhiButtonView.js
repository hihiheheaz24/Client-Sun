// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        betAmountLabel:cc.LabelIncrement,
        btnBetPlus:cc.Button,
        btnBetMinus:cc.Button,
        btnSpin:sp.Skeleton,
        btnSpinBtn:cc.Button,
        autoSpinBtnNode:cc.Node,
        autoSpinCountLabel:cc.Label,
        btnQuick:cc.Sprite,
        sfsQuick:[cc.SpriteFrame],
        btnAuto:cc.Button,
        layoutChooseAutoSpinCount:cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.TayDuThanKhiController.getInstance().setButtonView(this);
        cc.TayDuThanKhiController.getInstance().setRoomID(1);
        this.roomID = 1;
        this.btnBetMinus.interactable = false;
        this.currentBetAmount = 2000;
        this.betAmountLabel.tweenValue(0,2000);
        this.isAutoSpin = false;
        cc.TayDuThanKhiController.getInstance().setAutoSpinCount(0);
        cc.TayDuThanKhiController.getInstance().setQuickMode(false);
        this.isQuickSpin = false;
        this.btnQuick.spriteFrame = this.sfsQuick[1];
    },
    betPlus:function()
    {
        this.btnBetMinus.interactable = true;
        this.roomID++;
        if (this.roomID>=6) {
            this.btnBetPlus.interactable = false;
        }
        this.changeBetAmountLabel(this.roomID)
        cc.TayDuThanKhiController.getInstance().setRoomID(this.roomID);
        cc.TayDuThanKhiController.getInstance().updateLabelJackpot();
        cc.TayDuThanKhiController.getInstance().playEffect(cc.AudioTayDuClipIndex.SOUND_CLICK_BTN,false,1);
    },
    betMinus:function()
    {
        this.btnBetPlus.interactable = true;
        this.roomID--;
        if (this.roomID<=1) {
            this.btnBetMinus.interactable = false;
        }
        this.changeBetAmountLabel(this.roomID)
        cc.TayDuThanKhiController.getInstance().setRoomID(this.roomID);
        cc.TayDuThanKhiController.getInstance().updateLabelJackpot();
        cc.TayDuThanKhiController.getInstance().playEffect(cc.AudioTayDuClipIndex.SOUND_CLICK_BTN,false,1);

    },
    changeBetAmountLabel:function(roomID)
    {
        switch (roomID) {
            case 1:
                this.betAmountLabel.tweenValue(this.currentBetAmount,2000);
                this.currentBetAmount = 2000;
                break;
            case 2:
                this.betAmountLabel.tweenValue(this.currentBetAmount,5000);
                this.currentBetAmount = 5000;
                break;
            case 3:
                this.betAmountLabel.tweenValue(this.currentBetAmount,10000);
                this.currentBetAmount = 10000;
                break;
            case 4:
                this.betAmountLabel.tweenValue(this.currentBetAmount,50000);
                this.currentBetAmount = 50000;
                break;
            case 5:
                this.betAmountLabel.tweenValue(this.currentBetAmount,100000);
                this.currentBetAmount = 100000;
                break;
            case 6:
                this.betAmountLabel.tweenValue(this.currentBetAmount,500000);
                this.currentBetAmount = 500000;
                break;
            default:
                break;
        }
    },
    spin:function()
    {
        this.btnSpin.clearTracks();
        this.btnSpin.setToSetupPose();
        this.btnSpin.setAnimation(0, 'SeLect', false);
        cc.TayDuThanKhiController.getInstance().playEffect(cc.AudioTayDuClipIndex.SOUND_SPIN,false,1);
        this.roomID = cc.TayDuThanKhiController.getInstance().getRoomID();
        this.setActiveAllButton(false);
        cc.TayDuThanKhiController.getInstance().sendRequestOnHub(cc.MethodHubName.SPIN,null,this.roomID);
        if (cc.TayDuThanKhiController.getInstance().getAutoSpinCount()>0) {
            if (!this.autoSpinBtnNode.active) {
                this.autoSpinBtnNode.active = true;
                this.btnSpinBtn.node.active = false;
            }
            const autoSpinCount = cc.TayDuThanKhiController.getInstance().getAutoSpinCount();
            this.autoSpinCountLabel.string = autoSpinCount > 1000 ? "∞": autoSpinCount;
        }
        else
        {
            if (this.autoSpinBtnNode.active) {
                this.autoSpinBtnNode.active = false;
                this.btnSpinBtn.node.active = true;
            }
        }
    },
    setActiveAllButton:function(isActive)
    {
        if (isActive) {
            this.btnSpinBtn.interactable = true;
            this.btnBetMinus.interactable = this.roomID==1?false:true;
            this.btnBetPlus.interactable = this.roomID==6?false:true;;
            this.btnAuto.interactable = true;
        }
        else
        {
            this.btnSpinBtn.interactable = false;
            this.btnBetMinus.interactable = false;
            this.btnBetPlus.interactable = false;
            this.btnAuto.interactable = false;
        }
        
    },
    setAutoSpin:function(event,number){
        cc.TayDuThanKhiController.getInstance().playEffect(cc.AudioTayDuClipIndex.SOUND_CLICK_BTN,false,1);
        this.openPopupChooseAutoSpinCount();
        let spinCount = parseInt(number);
        cc.TayDuThanKhiController.getInstance().setAutoSpinCount(spinCount);
        this.spin();
    },
    stopAutoSpin:function(event){
        cc.TayDuThanKhiController.getInstance().setAutoSpinCount(0);
        this.autoSpinBtnNode.active = false;
        this.btnSpinBtn.node.active = true;
        cc.TayDuThanKhiController.getInstance().playEffect(cc.AudioTayDuClipIndex.SOUND_CLICK_BTN,false,1);
    },
    openPopupChooseAutoSpinCount:function()
    {
        if (this.layoutChooseAutoSpinCount.active) {
            this.layoutChooseAutoSpinCount.getComponent(cc.Animation).play('autospinSelectorClose');
            setTimeout(() => {
                this.layoutChooseAutoSpinCount.active = false;
            }, 500);
        }
        else
        {
            this.layoutChooseAutoSpinCount.active = true;
            this.layoutChooseAutoSpinCount.getComponent(cc.Animation).play('autospinSelector');
        }
        cc.TayDuThanKhiController.getInstance().playEffect(cc.AudioTayDuClipIndex.SOUND_CLICK_BTN,false,1);
    },
    setQuickMode:function(){
        cc.TayDuThanKhiController.getInstance().playEffect(cc.AudioTayDuClipIndex.SOUND_CLICK_BTN,false,1);
        this.isQuickSpin=!this.isQuickSpin;
        this.btnQuick.spriteFrame = this.sfsQuick[this.isQuickSpin?0:1];
        cc.TayDuThanKhiController.getInstance().setQuickMode(this.isQuickSpin);
    },
});
