/**
 * Created by Welcome on 5/28/2019.
 */

(function () {
    cc.LiveXXResultView = cc.Class({
        "extends": cc.Component,
        properties: {

            nodeTimer: cc.Node,
            nodeChan: cc.Node,
            nodeLe: cc.Node,

            nodeChan1: cc.Node,
            nodeChan2: cc.Node,
            nodeChan3: cc.Node,

            nodeLe1: cc.Node,
            nodeLe2: cc.Node,
            nodeLe3: cc.Node,
            nodeFxResult: cc.Node
        },

        onLoad: function () {
            cc.LiveXXController.getInstance().setLiveXXResultView(this);

            this.currentState = -1;
            //node parent Vi
        },

        reset: function () {
            this.nodeFxResult.active = false;
        },

        updateResult: function (players, result, originResult, state, openNow) {
          

            //check state de xu ly hien thi
            switch (state) {
                //giai doan dat cuoc
                case cc.LiveXXState.BETTING: //54
                cc.warn("cc.LiveXXState.BETTING")
                    if (this.currentState !== state) {

                        this.nodeFxResult.active = false;
                    }

                    break;
                //giai doan mo bat
                case cc.LiveXXState.OPEN_PLATE:
                    cc.warn("cc.LiveXXState.OPEN_PLATE")
                    if (this.currentState !== state) {
                      
                        this.nodeFxResult.active = false;
                        this.playFxResult();
                    }
                    break;

                //giai doan ket qua
                case cc.LiveXXState.SHOW_RESULT: //15
                cc.warn("cc.LiveXXState.SHOW_RESULT")
                    if (this.currentState !== state) {
                        this.playPayFx(result);
                    }
                    break;

                //giai doan cho phien moi
                case cc.LiveXXState.WAITING:
                    cc.warn("cc.LiveXXState.WAITING")
                    if (this.currentState !== state) {
                        cc.LiveXXController.getInstance().initGateChip();
                        this.nodeFxResult.active = false;
                    }
                    break;
                //xoc dia
                case cc.LiveXXState.SHAKING:
                    cc.warn("cc.LiveXXState.SHAKING")
                    if (this.currentState !== state) {
                        this.nodeFxResult.active = false;
                    }
                    break;
            }

            //luu lai state hien tai
            this.currentState = state;
        },

        playFxResult: function () {
            this.nodeFxResult.active = true;
            this.nodeChan1.active = false;
            this.nodeChan2.active = false;
            this.nodeChan3.active = false;
            this.nodeLe1.active = false;
            this.nodeLe2.active = false;
            this.nodeLe3.active = false;
        },

        playPayFx: function ( result) {
            console.log(result);
            //lay ve danh sach cac player
            var self = this;
            let bigGate = parseInt(result.BigGate);
            let smallGate = parseInt(result.SmallGate);
            console.log(bigGate);
            console.log(smallGate);
            switch (bigGate) {
                case cc.LiveXXGate.EVEN:
                    self.nodeChan1.active = true;
                    break;
                case cc.LiveXXGate.ODD:
                    self.nodeLe1.active = true;
                    break;
            }
            switch (smallGate) {
                case cc.LiveXXGate.THREE_UP:
                    self.nodeLe1.active = true;
                    self.nodeLe2.active = true;
                    break;
                case cc.LiveXXGate.THREE_DOWN:
                    self.nodeLe1.active = true;
                    self.nodeLe3.active = true;
                    break;
                case cc.LiveXXGate.FOUR_DOWN:
                    self.nodeChan1.active = true;
                    self.nodeChan3.active = true;
                    break;
                case cc.LiveXXGate.FOUR_UP:
                    self.nodeChan1.active = true;
                    self.nodeChan2.active = true;
                    break;
            }

        },
    });

}).call(this);
