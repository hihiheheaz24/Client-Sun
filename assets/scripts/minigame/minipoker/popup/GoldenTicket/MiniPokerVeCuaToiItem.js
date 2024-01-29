
cc.Class({
    extends: require("BaseTopItem"),

    properties: {
        lbTicket: cc.Label, 
    },

    updateItem: function(item, itemID) {
        this.lbRank.string = itemID + 1;
        this.lbTicket.string = item;
       
    }

});
