cc.Class({
    extends: require("BaseTopItem"),

    properties: {
        lbCards: cc.Label,
        lbTime: cc.Label,
        lbReward: cc.Label,
        isFormatDay: false,
    },

    updateItem: function (item, itemID) {
        let topUserColor = new cc.Color(144, 105, 65);
        let colorLe = new cc.Color(15, 18, 46);
        let colorChan = new cc.Color(62, 49, 114);
        const normalColor = itemID % 2 === 0 ? colorChan : colorLe;
        this.bgSprite.node.color = itemID < 3 ? topUserColor : normalColor;
        this.lbRank.string = itemID + 1;
        this.lbNickName.string = item.Nickname.slice(0,item.Nickname.length-3)+"***";
        let cardString = "";
        if (item.Cards && item.Cards.length) {
            item.Cards.forEach((cardIndex, index) => {
                cardString+= this.convertCardIDToString(cardIndex);
            });
            this.lbCards.string = cardString;
        }
        this.lbTotalWin.string = item.WinAmount ? cc.Tool.getInstance().formatNumber(item.WinAmount) + " G11-Game" : "";
        if (item.Reward > 0) {
            this.lbReward.string = cc.Tool.getInstance().formatNumber(item.Reward);
        } else {
            this.lbReward.string = item.Reward || "";
        }
        let dateTime = item.Date.slice(11, 19);
        if (this.isFormatDay) {
            let reverDateTime = item.Date.slice(0, 10).split("-").reverse();
            dateTime = `${reverDateTime[1]}/${reverDateTime[0]}/${reverDateTime[reverDateTime.length - 1]}`;
        }
        this.lbTime.string = dateTime;
        this.item = item;
        this.itemID = itemID;
    },

    convertCardIDToString: function (cardID) {
        let finalString = "";
        let begin = Math.floor((cardID - 1) / 4);
        if (begin == 9) {
            finalString += "J";
        }
        if (begin == 10) {
            finalString += "Q";
        }
        if (begin == 11) {
            finalString += "K";
        }
        if (begin == 12) {
            finalString += "A";
        }
        if (begin < 9) finalString += begin + 2;
        let tail = cardID % 4;
        switch (tail) {
            case 0:
                finalString += "♠";

                break;
            case 1:
                finalString += "♣";

                break;
            case 2:
                finalString += "♦";
                break;
            case 3:
                finalString += "♥";
                break;
            default:
                break;
        }
        return finalString;
    },
});
