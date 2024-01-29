(function () {
    cc.LodeHistoryItem = cc.Class({
        "extends": cc.Component,
        properties: {
            spritebBg: cc.Sprite,
            spritebBgFs: [cc.SpriteFrame],
            lbSession: cc.Label,
            lbTime: cc.Label,
            lbTypeBet: cc.Label,
            lbNumberChoose: cc.Label,
            lbTotalBet: cc.Label,
            lbWin: cc.Label,
        },

        updateItem: function (item, itemID) {
            if (!item) return;
            this.spritebBg.spriteFrame = this.spritebBgFs[itemID % 2];
            this.lbSession.string = '#' + item.SessionID;
            this.lbTime.string = cc.Tool.getInstance().convertUTCTime(item.CreatedDate);
            this.lbTypeBet.string = item.GateName;
            const numberList = item.BetData.split(',');
            let newString = '';
            let count = 0
            numberList.forEach((number,index)=>{
                count++;
                if(index == numberList.length - 1 ){
                    newString = newString + number
                } else {
                    newString = newString + number + ",";
                }
                if(count == 4 && (index != numberList.length - 1) ){
                    count = 0;
                    newString = newString + "\n";
                }
            })
            this.lbNumberChoose.string = newString;

            this.scheduleOnce(() => {
                const height = this.lbNumberChoose.node.height + 20;
                this.node.height = height;
                this.spritebBg.node.height = height;
            }, 0);
 
            this.lbTotalBet.string = cc.Tool.getInstance().formatNumber(item.TotalBetValue);
            this.lbWin.string = cc.Tool.getInstance().formatNumber(item.TotalAwardValue);

            this.item = item;
            this.itemID = itemID;
        },
    });
}).call(this);
