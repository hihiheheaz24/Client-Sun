
cc.Class({
    extends: require("BaseTopItem"),

    properties: {
        lbTicket: cc.Label,
        lbType: cc.Label,
       
    },

    updateItem: function(item, itemID) {
        let colorLe = new cc.Color(15,18,46);
        let colorChan = new cc.Color(62,49,114);
        let colorTop1 = new cc.Color(144,105,65);
        this.bgSprite.node.color = itemID % 2 ?colorChan : colorLe;
        if(itemID == 0){
            this.bgSprite.node.color = colorTop1;
            this.lbRank.node.color = cc.Color.YELLOW;
            this.lbType.node.color = cc.Color.YELLOW;
            this.lbNickName.node.color = cc.Color.YELLOW;
            this.lbTicket.node.color = cc.Color.YELLOW;
        } else {
            this.lbRank.node.color = cc.Color.WHITE;
            this.lbType.node.color = cc.Color.WHITE;
            this.lbNickName.node.color = cc.Color.WHITE;
            this.lbTicket.node.color = cc.Color.WHITE;
        }
        this.lbRank.string = itemID + 1;
        this.lbType.string = item.type == 1 ? "Giải đặc biệt": "Giải khuyến khích";
        this.lbNickName.string = item.Nickname.slice(0,item.Nickname.length-3)+"***";
        this.lbTicket.string = item.Ticket;
        this.lbTotalWin.string = item.Reward ? cc.Tool.getInstance().formatNumber(item.Reward) + " G11-Game" : "";
        this.item = item;
        this.itemID = itemID;
    }

});
