/**
 * Input dat cuoc
 */

(function () {
    cc.TaiXiuSessionHistoryViewLeft = cc.Class({
        "extends": cc.Component,
        properties: {
            spriteSides:[cc.Sprite],
            sfSides: [cc.SpriteFrame],
        },

        onLoad: function () {
            cc.TaiXiuControllerLeft.getInstance().setTaiXiuSessionHistoryView(this);
        },

        onDestroy: function () {
            cc.TaiXiuControllerLeft.getInstance().setTaiXiuSessionHistoryView(null);
        },

        updateSessionHistory: function (gameHistory) {
            if (gameHistory) {
                this.gameHistory = gameHistory;
                cc.TaiXiuControllerLeft.getInstance().setGameHistory(gameHistory);
                var self = this;
                var index = 0;
                gameHistory.forEach(function (game) {
                    if (index<19) {
                        var sprite = self.spriteSides[index];
                        sprite.spriteFrame = self.sfSides[game.DiceSum > 10 ? 0 : 1];
                        index++;
                    }
                   
                });
            }
        },

        //Chi tiet 1 phien
        sessionDetailClicked: function (event, index) {
            if (this.gameHistory && this.gameHistory.length > index) {
                cc.TaiXiuControllerLeft.getInstance().setDetailIndex(index);
                cc.TaiXiuMainController.getInstance().createSessionDetailView();
            }
        }
    });
}).call(this);
