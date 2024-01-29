cc.Class({
    extends: cc.Component,

    properties: {
        x6JackpotItems: [cc.Node],
        blockInput: cc.Node,
    },

    onLoad() {
        this.hasShowing = false;
        this.canJoinGame = false;
        this.isInited = false;
        this.blockInput.active = false;
        this.animation = this.node.getChildByName('layoutX6').getComponent(cc.Animation);
        this.animation.on('finished', this.onFinished, this);
        this.animation.node.active = false;
        this.x6JackpotItems.forEach(item => {
            item.active = false;
        });
    },

    start() {
        var self = this;
        var delay = 0.2;
        cc.director.getScheduler().schedule(function () {
            self.requestGetGameJackpot();
        }, this, 1, 0, delay, false);

        cc.director.getScheduler().schedule(function () {
            self.requestGetGameJackpot();
        }, this, 3, cc.macro.REPEAT_FOREVER, 0, false);
    },

    requestGetGameJackpot() {
        let url = 'api/JackPot/GetGameJackpotInfo';
        cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.PORTAL, url,  (response) =>{
            let obj = JSON.parse(response);
            this.onGetGameJackpotInfoResponse(obj)
        });
    },

    onGetGameJackpotInfoResponse(response) {
        if (response.length <= 0) return;
        if (!this.isInited) {
            this.isInited = true;
            this.onToggleButton();
        }
        let listJackpot = [];
        const config = {
            [cc.GameId.THAN_THU]: -1,
            [cc.GameId.COWBOY]: 3,
            [cc.GameId.GAINHAY]: 3,
            [cc.GameId.TAY_DU_THAN_KHI]: -1,
            [cc.GameId.THUY_CUNG]: 3,
            [cc.GameId.THREE_KINGDOM]: 3,
            [cc.GameId.SEVEN77]: 3,
        }
        // fake data
        // response = fakeData;
        const jackpotInfos = response.filter(({ RoomID, GameID }) => config[GameID] !== undefined && RoomID != config[GameID]);
        for (let index = 0; index < this.x6JackpotItems.length; index++) {
            const jpInfo = jackpotInfos[index];
            if (jpInfo) {
                listJackpot.push(jpInfo);
                this.x6JackpotItems[index].active = true;
                this.x6JackpotItems[index].emit("UPDATE_X6_JACKPOT_ITEM", jpInfo, index);
            } else {
                this.x6JackpotItems[index].active = false;
            }
        }
        cc.LobbyJackpotController.getInstance().setX6JackpotResponse(jackpotInfos);
    },

    onToggleButton() {
        if (!this.isInited) return;
        this.animation.node.active =  true;
        this.hasShowing = !this.hasShowing;
        if (this.hasShowing) {
            this.animation.play('x6ToggleOn');
        } else {
            this.animation.play('x6ToggleOff');
        }
        this.canJoinGame = false;
        this.blockInput.active = this.hasShowing;
    },

    joinGameClicked: function (event, data) {
        if (cc.LoginController.getInstance().checkLogin() && event.target && this.hasShowing && this.canJoinGame) {
            this.onToggleButton();
            cc.LobbyController.getInstance().joinGame(event.target.gameId);
        }
    },

    onFinished() {
        this.animation.node.active = this.hasShowing;
        this.canJoinGame = true;
    },

    onDestroy() {
        this.animation.off('finished', this.onFinished, this);
    }
});

// const fakeData = [
//     { GameID: 3, RoomID: 1, Multiplier: 5, Remain: 0, JackpotRemainInDay: 30 },
//     { GameID: 70, RoomID: 2, Multiplier: 5, Remain: 15, JackpotRemainInDay: 30 },
//     { GameID: 4, RoomID: 3, Multiplier: 5, Remain: 1, JackpotRemainInDay: 30 },
//     { GameID: 4, RoomID: 2, Multiplier: 4, Remain: 2, JackpotRemainInDay: 10 },
//     { GameID: 4, RoomID: 3, Multiplier: 3, Remain: 1, JackpotRemainInDay: 1 },
//     { GameID: 4, RoomID: 4, Multiplier: 3, Remain: 1, JackpotRemainInDay: 1 },
//     { GameID: 3, RoomID: 2, Multiplier: 4, Remain: 2, JackpotRemainInDay: 10 },
//     { GameID: 3, RoomID: 3, Multiplier: 3, Remain: 1, JackpotRemainInDay: 1 },
//     { GameID: 70, RoomID: 2, Multiplier: 4, Remain: 2, JackpotRemainInDay: 10 },
//     { GameID: 70, RoomID: 3, Multiplier: 3, Remain: 1, JackpotRemainInDay: 1 },
//     { GameID: 70, RoomID: 4, Multiplier: 3, Remain: 1, JackpotRemainInDay: 1 },
// ];