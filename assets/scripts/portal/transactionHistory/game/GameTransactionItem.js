/**
 * Created by Nofear on 3/15/2019.
 */


(function () {
    cc.GameTransactionItem = cc.Class({
        "extends": cc.Component,
        properties: {
            bg: cc.Node,
            lbGameType: cc.Label, //GameType
            lbBetValue: cc.Label,  //Tien cuoc
            lbRefundValue: cc.Label, //Hoan tra
            lbPrizeValue: cc.Label, //Tien thang
            lbTime: cc.Label, //Thoi gian
            lbDesc: cc.Label, //Mo ta
        },

        onLoad: function () {
            // this.sprite = this.node.getComponent(cc.Sprite);
            this.lbPrizeValue.node.color = cc.Color.YELLOW;
        },

        updateItem: function(item, itemID) {
            this.bg.active = (itemID % 2 == 0) ? false : true;
            let strTime = item.time.split(" ");
            this.lbTime.string = strTime[1] + "\n" + strTime[0];

            switch (item.game) {
                case "Thủy Cung":    
                case "Chiêm Tinh":   
                    this.lbGameType.string = "Ăn Khế Trả Vàng";
                    break;
                case "Cao Bồi":       
                    this.lbGameType.string = "Thần Tài";
                    break;
                case "Ai Cập":    
                case "Bikini":   
                    this.lbGameType.string = "Sơn Tinh Thuỷ Tinh";
                    break;
                case "Tam Quốc":
                case "Đua Xe":
                    this.lbGameType.string = "Tây Du Ký";
                    break;
                case "Songoku":
                case "SonGoku":
                case "Chim Điên":    
                    this.lbGameType.string = "Kho Báu Tứ Linh";
                    break;
                case "Candy":
                case "GEM":       
                    this.lbGameType.string = "Kim Cương";
                    break;
                case "89":       
                    this.lbGameType.string = "Tài Xỉu Live";
                    break;
            
                default:
                    this.lbGameType.string = item.game;
                    break;
            }

            item.BetValue = this.removeDot(item.bet_value);
            item.RefundValue = this.removeDot(item.refund_value);
            item.PrizeValue = this.removeDot(item.prize_value);

            this.lbBetValue.string = cc.Tool.getInstance().formatNumber(item.BetValue);
            this.lbRefundValue.string = cc.Tool.getInstance().formatNumber(item.RefundValue);

            if (item.PrizeValue > 0) {
                this.lbPrizeValue.string = '+' + cc.Tool.getInstance().formatNumber(item.PrizeValue);
                this.lbPrizeValue.node.color = cc.Color.GREEN;
            } else if (item.PrizeValue == 0) {
                this.lbPrizeValue.string = cc.Tool.getInstance().formatNumber(item.PrizeValue);
                this.lbPrizeValue.node.color = cc.Color.WHITE;
            } else {
                this.lbPrizeValue.string = cc.Tool.getInstance().formatNumber(item.PrizeValue);
                this.lbPrizeValue.node.color = cc.Color.RED;
            }
            if (item.description == "") {
                this.lbDesc.string = "";
            } else {
                this.lbDesc.string = item.description;
            }

            this.item = item;
            this.itemID = itemID;
        },

        removeDot: function (val) {
            return parseInt((val.split('.').join("")).split('+').join(""));
        }
    });
}).call(this);
