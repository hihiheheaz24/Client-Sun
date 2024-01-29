cc.Class({
    extends: cc.Component,

    properties: {
        gameIcons: [cc.SpriteFrame],
        icon: cc.Sprite,
        lbTitle: cc.Label,
        lbRoom: cc.Label,
        multiple: sp.Skeleton,
        xLineJackpot: sp.Skeleton,
        xJackpotInfo: cc.Node,
        lbMultiple: cc.Label,
        lbJpTimes: cc.Label
    },

    onLoad() {
        this.node.on("UPDATE_X6_JACKPOT_ITEM", this.updateJackpotItem, this);
    },

    updateJackpotItem({ GameID, JackpotRemainInDay, Multiplier, Remain, RoomID }) {
        const config = {
            [cc.GameId.THAN_THU]: 0,
            [cc.GameId.COWBOY]: 1,
            [cc.GameId.TAY_DU_THAN_KHI]: 2,
            [cc.GameId.GAINHAY]: 3,
            [cc.GameId.THUY_CUNG]: 4,
            [cc.GameId.THREE_KINGDOM]: 5,
        }
        this.icon.spriteFrame = this.gameIcons[config[GameID]];
        this.node.gameId = GameID;
        this.lbTitle.string = cc.Config.getInstance().getGameName(GameID);
        const roomValue = cc.Config.getInstance().getRoomValue(GameID, RoomID) || 100;
        this.lbRoom.string = cc.Tool.getInstance().formatNumber(roomValue);
        // case dang co x hu
        if (Multiplier && !Remain) {
            this.multiple.node.active = true;
            this.multiple.setAnimation(0, `x${Multiplier}`, true);
            this.xJackpotInfo.active = false;
            this.xLineJackpot.setAnimation(0, "animation", true);
        } else if (Remain) {
            this.lbMultiple.string = `X${Multiplier}`;
            this.multiple.node.active = false;
            this.xLineJackpot.node.active = false;
            this.xJackpotInfo.active = true;
            this.lbJpTimes.string = Remain;
        }
    }
});
