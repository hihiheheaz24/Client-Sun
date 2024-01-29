/**
 * Created by Nofear on 3/15/2019.
 */


(function () {
    cc.LiveXXHistoryItem = cc.Class({
        "extends": cc.Component,
        properties: {
            sprite: cc.Sprite,
            sfsBg:[cc.SpriteFrame],
            lbSession: cc.Label,
            lbTime: cc.Label,
            lbSide: cc.Label,
            lbResult: cc.Label,
            lbBet: cc.Label,
            lbWin: cc.Label,
        },

        updateItem: function (item, itemID) {
            this.sprite.spriteFrame = this.sfsBg[itemID%2];
            this.lbSession.string = item.SessionID;
            this.lbTime.string = cc.Tool.getInstance().convertUTCTime(item.CreateTime);
            let betSide = "";
            switch (parseInt(item.GateID)) {
                case cc.LiveXXGate.ODD:
                    betSide = "LẺ";
                    break;
                case cc.LiveXXGate.THREE_UP:
                    betSide = "LẺ (3 ĐỎ)";
                    break;
                case cc.LiveXXGate.THREE_DOWN:
                    betSide = "LẺ (3 TRẮNG)";
                    break;
                case cc.LiveXXGate.EVEN:
                    betSide = "CHẴN";
                    break;
                case cc.LiveXXGate.FOUR_UP:
                    betSide = "CHẴN (4 ĐỎ)";
                    break;
                case cc.LiveXXGate.FOUR_DOWN:
                    betSide = "CHẴN (4 TRẮNG)";
                    break;
            }
            this.lbSide.string = betSide;

            let result = "";
            let gateData = item.GatesData;
            if (gateData) {
                let listResult = [];
                let listGate = gateData.split(',');
                let mainGate = (listGate.includes(cc.LiveXXGate.ODD+"")) ? "LẺ" : "CHẴN";
                if(listGate.length == 1) {
                    result = "CHẮN (2 TRẮNG, 2 ĐỎ)";
                }else {
                    listGate.map(gate => {
                        let strGate = "";
                        switch (parseInt(gate)) {
                            case cc.LiveXXGate.THREE_UP:
                                strGate = " (3 ĐỎ, 1 TRẮNG)";
                                break;
                            case cc.LiveXXGate.THREE_DOWN:
                                strGate = " (3 TRẮNG, 1 ĐỎ)";
                                break;
                            case cc.LiveXXGate.FOUR_UP:
                                strGate = " (4 ĐỎ)";
                                break;
                            case cc.LiveXXGate.FOUR_DOWN:
                                strGate = " (4 TRẮNG)";
                                break;
                        }
                        mainGate+=strGate;
                    });
                    result += mainGate;
                }


            }
            this.lbResult.string = result;
            this.lbBet.string = cc.Tool.getInstance().formatNumber(item.Bet);
            this.lbWin.string = cc.Tool.getInstance().formatNumber(item.Award);

            this.item = item;
            this.itemID = itemID;
        },
    });
}).call(this);
