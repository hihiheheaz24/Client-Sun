
//Minh Tran - 24/04/2023
(function () {
    cc.SupportView = cc.Class({
        "extends": cc.Component,
    
        properties: {

        },
    
        onLoad () {
            this.animation = this.node.getComponent(cc.Animation);
            this.node.zIndex =  cc.NoteDepth.POPUP_GIFTCODE;
        },
    
        onEnable () {
            this.animation.play('openPopup');
        },
    
        backClicked: function () {
            //this.showRegister(false);
            this.animation.play('closePopup');
            var self = this;
            var delay = 0.12;
            cc.director.getScheduler().schedule(function () {
                self.animation.stop();
                self.node.destroy();
            }, this, 1, 0, delay, false);
        },

        downloadApp: function () {
            cc.sys.openURL(cc.Config.getInstance().taigame());
        }
    });
}).call(this);
