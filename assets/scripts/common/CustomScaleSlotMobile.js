
cc.Class({
    extends: cc.Component,
    onLoad () {
        if(cc.sys.isMobile || cc.sys.isNative){
            switch (cc.RoomController.getInstance().getGameId().toString()){
                case cc.GameId.THUY_CUNG: {
                    this.node.scale = 1.2;
                    break;
                }
                case cc.GameId.COWBOY: {
                    this.node.scale = 1.3;
                    break;
                }
                case cc.GameId.THREE_KINGDOM: {
                    this.node.scale = 1.2;
                    break;
                }
            }
        } else {
            this.node.scale = 1;
        }
    },

});
