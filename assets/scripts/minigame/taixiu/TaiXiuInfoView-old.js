/**
 * Thong tin phien
 */

var taiXiuConfig = require('TaiXiuConfig');

(function () {
    cc.TaiXiuInfoView = cc.Class({
        "extends": cc.Component,
        properties: {

            nodeTornado: cc.Node,
            //animationBigTimer: cc.Animation,

            nodeBGTimer: cc.Node,

            lbSessionID: cc.Label,
            lbBigTimer: cc.Label, //thoi gian to chinh giua
            lbTimer: cc.Label, //thoi gian nho khi dang o man ket qua,
            lbTotalBetTai: cc.Label, //tong tien bet Tai
            lbTotalBetXiu: cc.Label, //tong tien bet Xiu
            lbUserBetTai: cc.Label, //so user bet Tai
            lbUserBetXiu: cc.Label, //so user bet Xiu
            nodeMain: cc.Node,
        },

        onLoad: function () {
            cc.TaiXiuController.getInstance().setTaiXiuInfoView(this);

            this.reset();
            this.animationTornado = this.nodeTornado.getComponent(cc.Animation);
            //cc.TaiXiuController.getInstance().sendRequestOnHub(cc.MethodHubName.ENTER_LOBBY);

        },

        onEnable: function () {
            if (cc.sys.isNative && this.nodeMain !== null && this.nodeMain !== undefined) {
                this.nodeMain.scaleX = 0.9;
                this.nodeMain.scaleY = 0.9;
            }
        },
        
        onDestroy: function () {
            cc.TaiXiuController.getInstance().setTaiXiuInfoView(null);
        },

        reset: function () {
            this.isShowTornado1 = false;
            this.isShowTornado2 = false;
            this.isShowTornado3 = false;
            this.currentState = 999;
            this.lastTime = 999;
        },

        updateInfo: function (sessionInfo) {
            //this.currentState = cc.TaiXiuState.BETTING;
            //sessionInfo.Ellapsed = 32;

            //check state de xu ly hien thi
            switch (sessionInfo.CurrentState) {
                //giai doan dat cuoc
                case cc.TaiXiuState.BETTING: //54
                    if (this.currentState !== sessionInfo.CurrentState) {
                        //goi reset thong tin betInfo
                        cc.TaiXiuController.getInstance().resetBetAndResultInfo();
                        //dem thoi gian o local
                        //this.startTimer(sessionInfo.Ellapsed);
                        //this.animationBigTimer.play('timer');
                    }
                    this.lbBigTimer.node.active = true;
                    this.lbTimer.node.active = false;
                    this.nodeBGTimer.active = false;
                    break;
                //giai doan cho ket qua (ko cho dat cuoc)
                case cc.TaiXiuState.END_BETTING:
                    this.lbBigTimer.node.active = true;
                    this.lbTimer.node.active = false;
                    this.nodeBGTimer.active = false;
                    break;

                //giai doan ket qua
                case cc.TaiXiuState.RESULT: //15
                    //dem thoi gian o local
                    //this.startTimer(sessionInfo.Ellapsed);

                    this.lbBigTimer.node.active = false;
                    this.lbTimer.node.active = true;
                    this.nodeBGTimer.active = true;
                    break;

                //giai doan cho phien moi
                case cc.TaiXiuState.PREPARE_NEW_SESSION:
                    //kiem tra neu chua start timer -> start
                    //this.startTimer(sessionInfo.Ellapsed);

                    cc.TaiXiuController.getInstance().resetBetInfo();
                    this.lbBigTimer.node.active = false;
                    this.lbTimer.node.active = true;
                    this.nodeBGTimer.active = true;
                    break;

            }


            //luu lai state hien tai
            this.currentState = sessionInfo.CurrentState;

            //set thong tin
            this.lbSessionID.string = '#' + sessionInfo.SessionID;
            this.lbTotalBetTai.string = cc.Tool.getInstance().formatNumber(sessionInfo.TotalBetTai);
            this.lbTotalBetXiu.string = cc.Tool.getInstance().formatNumber(sessionInfo.TotalBetXiu);
            this.lbUserBetTai.string = cc.Tool.getInstance().formatNumber(sessionInfo.TotalTai);
            this.lbUserBetXiu.string = cc.Tool.getInstance().formatNumber(sessionInfo.TotalXiu);
        },

        updateTimerInfo: function (time) {
            //console.log('updateTimer: ' +time);
            switch (this.currentState) {
                case cc.TaiXiuState.BETTING: //54
                    this.lbBigTimer.string = time;
                    this.lbBigTimer.node.color = time > 5 ? cc.Color.WHITE : cc.Color.RED;
                    this.lbTimer.string = cc.Tool.getInstance().convertSecondToTime2(time);

                    if (time <= taiXiuConfig.TIME_FAST) {
                        this.nodeTornado.active = true;
                        //chua play -> play
                        if (this.lastTime !== time) {
                            if (!this.isShowTornado2) {
                                this.animationTornado.play('iconRotateReverse2x');
                                this.isShowTornado2 = true;
                            }
                            //this.animationBigTimer.play('timerFast');
                        }
                    } else if (time <= taiXiuConfig.TIME_ENABLE_TORNADO) {
                        this.nodeTornado.active = true;
                        //chua play -> play
                        if (this.lastTime !== time) {
                            if (!this.isShowTornado1) {
                                this.animationTornado.play('iconRotateReverse');
                                this.isShowTornado1 = true;
                            }
                            //this.animationBigTimer.play('timer');
                        }
                    } else {
                        this.isShowTornado1 = false;
                        this.isShowTornado2 = false;
                        this.isShowTornado3 = false;
                        //chua play -> play
                        if (this.lastTime !== time) {
                            //this.animationBigTimer.play('timer');
                        }
                    }

                    break;
                case cc.TaiXiuState.END_BETTING: //15
                    //kiem tra thoi gian de dieu chinh animation
                    this.nodeTornado.active = true;
                    //chua play -> play
                    if (this.lastTime !== time) {
                        if (!this.isShowTornado3) {
                            this.animationTornado.play('iconRotateReverse3x');
                            this.isShowTornado3 = true;
                        }
                        //this.animationBigTimer.play('timerFast'); //timerSuperFast
                    }

                    this.lbBigTimer.node.color = cc.Color.RED;
                    this.lbBigTimer.string = time;
                    if (time === 1 || time <= 2)
                        this.lbTimer.string = cc.Tool.getInstance().convertSecondToTime2(25);
                    else
                        this.lbTimer.string = cc.Tool.getInstance().convertSecondToTime2(time);

                    break;
                case cc.TaiXiuState.RESULT: //15
                    this.lbTimer.string = cc.Tool.getInstance().convertSecondToTime2(time);
                    this.lbBigTimer.node.color = cc.Color.WHITE;
                    this.lbBigTimer.string = time;
                    this.nodeTornado.active = false;
                    this.elapsedTime = 0;
                    if (time === 10 || time === 5) {
                        cc.LobbyController.getInstance().refreshAccountInfo();
                    }

                    this.isShowTornado1 = false;
                    this.isShowTornado2 = false;
                    this.isShowTornado3 = false;
                    break;

                case cc.TaiXiuState.PREPARE_NEW_SESSION:
                    this.lbTimer.string = cc.Tool.getInstance().convertSecondToTime2(time);
                    this.lbBigTimer.node.color = cc.Color.WHITE;
                    if (time === 1)
                        this.lbBigTimer.string = 54;
                    else this.lbBigTimer.string = time;
                    this.nodeTornado.active = false;

                    this.isShowTornado1 = false;
                    this.isShowTornado2 = false;
                    this.isShowTornado3 = false;
                    break;
            }
            this.lastTime = time;
        }
        
    });
}).call(this);