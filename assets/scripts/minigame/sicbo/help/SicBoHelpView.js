/*
 * Generated by BeChicken
 * on 11/15/2019
 * version v1.0
 */
(function () {
    cc.SicBoHelpView = cc.Class({
        "extends": cc.BacaratHelpView,
        properties: {
            mainSprite:cc.Sprite,
            nodeMaxBet: cc.Node,
            listTextureContent:[cc.SpriteFrame],
            titleSprite:cc.Sprite,
            listTextureTitle:[cc.SpriteFrame],
            listBtnTab:[cc.Button],
            scrollView:cc.ScrollView
        },
        onEnable()
        {
            if(localStorage.getItem("currentRuleSicboTab")!==null&&localStorage.getItem("currentRuleSicboTab")=="rule")
            {
                this.mainSprite.spriteFrame = this.listTextureContent[0];
                this.titleSprite.spriteFrame = this.listTextureTitle[0];
                this.listBtnTab[0].interactable = false;
                this.listBtnTab[1].interactable = true;
                this.nodeMaxBet.active = true;
            }
            else
            {
                this.mainSprite.spriteFrame=this.listTextureContent[1];
                this.titleSprite.spriteFrame=this.listTextureTitle[1];
                this.listBtnTab[1].interactable = false;
                this.listBtnTab[0].interactable = true;
                this.nodeMaxBet.active = false;

            }
        },
        
        closeFinished: function () {
            cc.AudioController.getInstance().playSound(cc.AudioTypes.SICBO_CLOSE_POPUP);
            cc.SicBoPopupController.getInstance().destroyHelpView();
        },
        selectTab:function(event, data)
        {
            if (data=="rule") {
                this.mainSprite.spriteFrame = this.listTextureContent[0];
                this.titleSprite.spriteFrame = this.listTextureTitle[0];
                this.listBtnTab[0].interactable = false;
                this.listBtnTab[1].interactable = true;
                this.nodeMaxBet.active = true;

            }
            else
            {
                this.mainSprite.spriteFrame=this.listTextureContent[1];
                this.titleSprite.spriteFrame=this.listTextureTitle[1];
                this.listBtnTab[1].interactable = false;
                this.listBtnTab[0].interactable = true;
                this.nodeMaxBet.active = false;

            }
            this.scrollView.scrollToTop(0.1);
        }
    });
}).call(this);