
cc.Class({
    extends: cc.Component,

    properties: {
        nodeListGame: cc.Node
    },

    onLoad(){
        this._prefabXocDia  = null;

        this.ROOM_CONFIG = {
            "1000": {
                //1000, 5000, 10000, 100000, 500000
                roomID: '019',
                maxBet: 100000,
                betVals : [1000, 5000, 10000, 50000, 100000],
                betValsServer : [1000, 5000, 10000, [10000,10000,10000,10000,10000], 100000],
            },
            "5000": {
                //1000, 5000, 10000, 100000, 500000
                roomID: '036',
                maxBet: 500000,
                betVals : [5000, 10000, 50000, 100000, 500000],
                betValsServer : [5000, 10000, [10000,10000,10000,10000,10000], 100000, 500000],
            },
            "10000": {
                //1000, 5000, 10000, 100000, 500000
                roomID: '022',
                maxBet: 1000000,
                betVals : [10000, 50000, 100000, 500000, 1000000],
                betValsServer : [10000, [10000,10000,10000,10000,10000], 100000, 500000, [500000,500000]],
            },
            "50000": {
                //1000, 5000, 10000, 100000, 500000
                roomID: '032',
                maxBet: 5000000,
                betVals : [50000, 100000, 500000, 1000000, 5000000],
                betValsServer : [[10000,10000,10000,10000,10000], 100000, 500000, [500000, 500000], [500000,500000,500000,500000,500000,500000,500000,500000,500000,500000]],
            },
        }
    },

    initXocDiaLobby(prefab){
        this.node.active = true;
        this.nodeListGame.active = false;
        this._prefabXocDia = prefab;

    },

    resetXocDiaLobby(){
        this._prefabXocDia = null;
        this.node.active = false;
        this.nodeListGame.active = true;
    },

    onCLickBack(){
        this.resetXocDiaLobby();
    },

    onCLickJoinRoom(event, roomID){
        cc.LobbyController.getInstance().createViewXocDia(this._prefabXocDia, this.ROOM_CONFIG[roomID]);
    }

   

});
