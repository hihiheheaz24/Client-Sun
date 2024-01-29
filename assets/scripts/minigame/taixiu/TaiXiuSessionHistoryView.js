/**
 * Input dat cuoc
 */

(function () {
    cc.TaiXiuSessionHistoryView = cc.Class({
        "extends": cc.Component,
        properties: {
            spriteSides:[cc.Sprite],
            sfSides: [cc.SpriteFrame],
            toolTip: cc.Node,
        },

        onLoad: function () {
            cc.TaiXiuController.getInstance().setTaiXiuSessionHistoryView(this);
            this.spriteSides.forEach((item, index)=>{
                let nodeResult = item.node;
                if(item.node._name == 'dot-outline'){
                    nodeResult = item.node.parent.parent
                };
                nodeResult.on(cc.Node.EventType.MOUSE_ENTER,(e) => {
                    if(item.node.data){
                        this.toolTip.position = e.target.getPosition();
                        this.toolTip.active = true;
                        const {DiceSum, FirstDice, SecondDice, SessionId, ThirdDice} = item.node.data; 
                        const txtString = "#" + SessionId+ ": " + (DiceSum>=11? "TÀI - ": "XỈU - ") + DiceSum + " ("+ FirstDice + " " + SecondDice + " " + ThirdDice + ")";
                        this.toolTip.getChildByName("txt").getComponent(cc.Label).string = txtString;
                    }
                   
                });
                nodeResult.on(cc.Node.EventType.MOUSE_LEAVE,() => {
                    this.toolTip.active = false;
                });
            })
        },

        onDestroy: function () {
            cc.TaiXiuController.getInstance().setTaiXiuSessionHistoryView(null);
        },

        updateSessionHistory: function (gameHistory) {
            if (gameHistory) {
                this.gameHistory = gameHistory;
                cc.TaiXiuController.getInstance().setGameHistory(gameHistory);
                var self = this;
                var index = 0;
                gameHistory.forEach(function (game) {
                    if (index<22) {
                        let sprite = self.spriteSides[index];
                        if(sprite.node._name == 'dot-outline'){
                            sprite.node.parent.parent.getComponent(cc.Button).clickEvents[0].customEventData = index;
                        } else {
                            sprite.node.getComponent(cc.Button).clickEvents[0].customEventData = index;
                        }

                        sprite.spriteFrame = self.sfSides[game.DiceSum > 10 ? 0 : 1];
                        sprite.node.data = game
                        index++;
                    }
                    
                });
            }
        },

        //Chi tiet 1 phien
        sessionDetailClicked: function (event, index) {
            if (this.gameHistory && this.gameHistory.length > index) {
                cc.TaiXiuController.getInstance().setDetailIndex(index);
                cc.TaiXiuMainController.getInstance().createSessionDetailView();
            }
        }
    });
}).call(this);
