/**
 * Thong tin phien
 */

var taiXiuConfig = require('TaiXiuConfig');

(function () {
    cc.TaiXiuInfoView = cc.Class({
        "extends": cc.Component,
        properties: {

            nodeTornado: cc.Node,
            animationBigTimer: cc.Animation,

            nodeBGTimer: cc.Node,
			nodeNotify: cc.Node,

            lbSessionID: cc.Label,
           // parentTimerRight: cc.Node,
           // parentTimerLeft: cc.Node,
           // sfNumber: [cc.SpriteFrame],
          //  sfNumberRed: [cc.SpriteFrame],
            lbBigTimer: cc.Label,
            lbTimer: cc.Label, //thoi gian nho khi dang o man ket qua,
            lbTotalBetTai: cc.Label, //tong tien bet Tai
            lbTotalBetXiu: cc.Label, //tong tien bet Xiu
            lbUserBetTai: cc.Label, //so user bet Tai
            lbUserBetXiu: cc.Label, //so user bet Xiu
            nodeMain: cc.Node,
            btnNan:cc.Node,
            //txCountCircle:cc.Node,
            //timeOutParticle: cc.Node
            // timeOutEffect: cc.Node
        },

        onLoad: function () {
            cc.TaiXiuController.getInstance().setTaiXiuInfoView(this);

            this.reset();
            //this.animationTornado = this.nodeTornado.getComponent(cc.Animation);
            this.lastSecond = -1;
            //cc.TaiXiuController.getInstance().sendRequestOnHub(cc.MethodHubName.ENTER_LOBBY);
            this._sessionInfo = {};
        },

        onEnable: function () {
            // if (cc.sys.isNative && this.nodeMain !== null && this.nodeMain !== undefined) {
            //     this.nodeMain.scaleX = 0.9;
            //     this.nodeMain.scaleY = 0.9;
            // }

            // set data
            let sessionInfo = JSON.parse(cc.Tool.getInstance().getItem("@InfoBetTaiXiu"));
            if (sessionInfo) {
                if (sessionInfo.AmountHuTaiXiu) {
                    this.lbJackpot.string = cc.Tool.getInstance().formatNumber(sessionInfo.AmountHuTaiXiu);
                }
                if (sessionInfo.TotalBetTai) {
                    this.lbTotalBetTai.string = cc.Tool.getInstance().formatNumber(sessionInfo.TotalBetTai);
                }
                if (sessionInfo.TotalBetXiu) {
                    this.lbTotalBetXiu.string = cc.Tool.getInstance().formatNumber(sessionInfo.TotalBetXiu);
                }
                if (sessionInfo.TotalTai) {
                    this.lbUserBetTai.string = cc.Tool.getInstance().formatNumber(sessionInfo.TotalTai);
                }
                if (sessionInfo.TotalXiu) {
                    this.lbUserBetXiu.string = cc.Tool.getInstance().formatNumber(sessionInfo.TotalXiu);
                }
            }
        },
        
        onDestroy: function () {
            cc.TaiXiuController.getInstance().setTaiXiuInfoView(null);
        },

        reset: function () {
            this.unscheduleAllCallbacks();
			this.nodeNotify.active = false;
            this.isShowTornado1 = false;
            this.isShowTornado2 = false;
            this.isShowTornado3 = false;
           // this.timeOutParticle.active = false;
           // this.parentTimerRight.active = false;
           // this.parentTimerLeft.active = false;
          //  this.txCountCircle.active = false;
            this.currentState = 999;
            this.lastTime = 999;
           // this.currentTime = null;
            this._sessionInfo = {};
        },

        updateInfo: function (sessionInfo, resume) {
            //this.currentState = cc.TaiXiuState.BETTING;
            //sessionInfo.Ellapsed = 32;
            this._sessionInfo = sessionInfo;
            if(resume){
                switch (sessionInfo.CurrentState) {
                    case cc.TaiXiuState.BETTING: //54
                        cc.TaiXiuController.getInstance().getTaiXiuInputBetView().enableBetting(true);
                        this.updateLabelTotal(this.lbTotalBetTai, sessionInfo.TotalBetTai);
                    this.updateLabelTotal(this.lbTotalBetXiu, sessionInfo.TotalBetXiu);
                    this.updateLabelTotal(this.lbUserBetTai, sessionInfo.TotalTai);
                    this.updateLabelTotal(this.lbUserBetXiu, sessionInfo.TotalXiu);
                        break;
                    case cc.TaiXiuState.RESULT: //15
                        cc.TaiXiuController.getInstance().getTaiXiuInputBetView().enableBetting(false);
                        this.lbTotalBetTai.string = cc.Tool.getInstance().formatNumberTaiXiu(this._sessionInfo.TotalBetTai);
                        this.lbTotalBetXiu.string = cc.Tool.getInstance().formatNumberTaiXiu(this._sessionInfo.TotalBetXiu);
                        this.lbUserBetTai.string = cc.Tool.getInstance().formatNumberSicbo(sessionInfo.TotalTai);
                        this.lbUserBetXiu.string = cc.Tool.getInstance().formatNumberSicbo(sessionInfo.TotalXiu);
                        break;
                }
            }
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
                    cc.TaiXiuController.getInstance().getTaiXiuInputBetView().enableBetting(true);
                   // this.parentTimerRight.active = true;
                   // this.parentTimerLeft.active = true;
                   this.updateLabelTotal(this.lbTotalBetTai, sessionInfo.TotalBetTai);
                    this.updateLabelTotal(this.lbTotalBetXiu, sessionInfo.TotalBetXiu);
                    this.updateLabelTotal(this.lbUserBetTai, sessionInfo.TotalTai);
                    this.updateLabelTotal(this.lbUserBetXiu, sessionInfo.TotalXiu);
                   this.lbBigTimer.node.active = true;
                    this.btnNan.active = true;
                    this.lbTimer.node.active = false;
                    this.nodeBGTimer.active = false;
                    cc.TaiXiuController.getInstance().hideNodeResult();
                   // if(sessionInfo.Ellapsed > 2){
                      //  this.lbTotalBetTai.string = cc.Tool.getInstance().formatNumberTaiXiu(sessionInfo.TotalBetTai);
                      //  this.lbTotalBetXiu.string = cc.Tool.getInstance().formatNumberTaiXiu(sessionInfo.TotalBetXiu);
                      //  this.lbUserBetTai.string = cc.Tool.getInstance().formatNumberSicbo(sessionInfo.TotalTai);
                      //  this.lbUserBetXiu.string = cc.Tool.getInstance().formatNumberSicbo(sessionInfo.TotalXiu);
                 //   }
                  
                    break;
                //giai doan ket qua
                case cc.TaiXiuState.RESULT: //15
                    //dem thoi gian o local
                    //this.startTimer(sessionInfo.Ellapsed);
                    cc.TaiXiuController.getInstance().getTaiXiuInputBetView().enableBetting(false);
                   // this.parentTimerRight.active = false;
                   // this.parentTimerLeft.active = false;
                   // this.btnNan.active = false;
                    // this.timeOutEffect.getComponent(cc.Animation).play('timeOutEffect');
                    //this.txCountCircle.active = false;
                    this.lbBigTimer.node.active = false;
                    this.lbTimer.node.active = true;
                    this.nodeBGTimer.active = true;
                    break;
            }


            //luu lai state hien tai
            this.currentState = sessionInfo.CurrentState;

            //set thong tin
            this.lbSessionID.string = '#' + sessionInfo.SessionID;
           
        },
        updateInfoCanCua: function(data){
            // this.lbTotalBetTai.string = cc.Tool.getInstance().formatNumber(data.TotalBetTai);
            // this.lbTotalBetXiu.string = cc.Tool.getInstance().formatNumber(data.TotalBetXiu);
            // this.lbUserBetTai.string = cc.Tool.getInstance().formatNumber(data.UserBetTai);
            // this.lbUserBetXiu.string = cc.Tool.getInstance().formatNumber(data.UserBetXiu);
            // TweenCommon.numberToWithLabel(this.lbTotalBetTai, data.TotalBetTai, 0.3);
            // TweenCommon.numberToWithLabel(this.lbTotalBetXiu, data.TotalBetXiu, 0.3);
            // TweenCommon.numberToWithLabel(this.lbUserBetTai, data.UserBetTai, 0.3);
            // TweenCommon.numberToWithLabel(this.lbUserBetXiu, data.UserBetXiu, 0.3);

            this.updateLabelTotal(this.lbTotalBetTai, data.TotalBetTai);
            this.updateLabelTotal(this.lbTotalBetXiu, data.TotalBetXiu);
            this.updateLabelTotal(this.lbUserBetTai, data.UserBetTai);
            this.updateLabelTotal(this.lbUserBetXiu, data.UserBetXiu);
        },
        updateLabelTotal: function (label, value) {
            label.node.runAction(cc.sequence(
                cc.scaleTo(0.2, 1.2),
                cc.callFunc(() => {
                    label.string = cc.Tool.getInstance().formatNumber(value);
                }),
                cc.scaleTo(0.2, 1)
            ))
        },


        updateBigTime(time){
            time = parseInt(time);
          //  let rightTime = parseInt(time%10);
          //  let leftTime = parseInt(time/10);
           // const timeTopLeft = this.parentTimerLeft.getChildByName("lbBigTimerTop").getComponent(cc.Sprite);
           // const timeBotLeft = this.parentTimerLeft.getChildByName("lbBigTimerBot").getComponent(cc.Sprite);
          //  const timeTopRight = this.parentTimerRight.getChildByName("lbBigTimerTop").getComponent(cc.Sprite);
          //  const timeBotRight = this.parentTimerRight.getChildByName("lbBigTimerBot").getComponent(cc.Sprite);

            //if(time< 30 && time != 0){
            ///    this.txCountCircle.active = true;
           // } else {
          //      this.txCountCircle.active = false;
          //  }

        //    const newRound = this.currentTime == null || this.currentTime <= 1;
          
          //  if(rightTime == 9 || newRound){
               // this.parentTimerLeft.getComponent(cc.Animation).stop('txUpdateTime');
               // this.parentTimerLeft.getComponent(cc.Animation).play('txUpdateTime');
          //  }
         //   this.parentTimerRight.getComponent(cc.Animation).stop('txUpdateTime');
         //   this.parentTimerRight.getComponent(cc.Animation).play('txUpdateTime');    
          //  if(time < 10){
             //   this.timeOutParticle.active = true;
              //  timeTopLeft.spriteFrame = this.sfNumberRed[leftTime];
              //  timeBotLeft.spriteFrame = this.sfNumberRed[leftTime == 9 ? 0 : leftTime + 1];
             //   timeTopRight.spriteFrame = this.sfNumberRed[rightTime];
             //   timeBotRight.spriteFrame = this.sfNumberRed[rightTime == 9 ? 0 : rightTime + 1];
          //  } else {
            //    this.timeOutParticle.active = false;
            //   timeTopLeft.spriteFrame = this.sfNumber[leftTime];
           //     timeBotLeft.spriteFrame = this.sfNumber[leftTime == 9 ? 0 : leftTime + 1];
           //     timeTopRight.spriteFrame = this.sfNumber[rightTime];
             //   timeBotRight.spriteFrame = this.sfNumber[rightTime == 9 ? 0 : rightTime + 1];
           // }

          //  if(newRound){
          //      timeBotLeft.spriteFrame = null;
          //      timeBotRight.spriteFrame = null;
         //   }
         //   this.currentTime = time;
        },

       
        updateTimerInfo: function (time) {
            //console.log('updateTimer: ' +time);
            switch (this.currentState) {
                case cc.TaiXiuState.BETTING: //54
                    this.lbBigTimer.string = time;
                    // this.lbBigTimer.node.color = time > 5 ? cc.Color.WHITE : cc.Color.RED;
                    // this.lbTimer.string = cc.Tool.getInstance().convertSecondToTime2(time);
                    this.lbTimer.string = time;

                    if (time <= taiXiuConfig.TIME_FAST) {
                        // this.nodeTornado.active = true;
                        //chua play -> play
                        if (this.lastTime !== time) {
                            if (!this.isShowTornado2) {
                                // this.animationTornado.play('iconRotateReverse2x');
                                this.isShowTornado2 = true;
                            }
                            // this.animationBigTimer.play('timerFast');
                        }
                    } else if (time <= taiXiuConfig.TIME_ENABLE_TORNADO) {
                        // this.nodeTornado.active = true;
                        //chua play -> play
                        if (this.lastTime !== time) {
                            if (!this.isShowTornado1) {
                                // this.animationTornado.play('iconRotateReverse');
                                this.isShowTornado1 = true;
                            }
                            // this.animationBigTimer.play('timer');
                        }
                    } else {
                        this.isShowTornado1 = false;
                        this.isShowTornado2 = false;
                        this.isShowTornado3 = false;
                        //chua play -> play
                        // if (this.lastTime !== time) {
                        //     this.animationBigTimer.play('timer');
                        // }
                    }

                    break;
                case cc.TaiXiuState.END_BETTING: //15
                    //kiem tra thoi gian de dieu chinh animation
                    // this.nodeTornado.active = true;
                    //chua play -> play
                    if (this.lastTime !== time) {
                        if (!this.isShowTornado3) {
                            // this.animationTornado.play('iconRotateReverse3x');
                            this.isShowTornado3 = true;
                        }
                        // this.animationBigTimer.play('timerFast'); //timerSuperFast
                    }

                    // this.lbBigTimer.node.color = cc.Color.RED;
                    this.lbBigTimer.string = time;
                    if (time <= 2)
                        // this.lbTimer.string = cc.Tool.getInstance().convertSecondToTime2(14);
                        this.lbTimer.string = 15;
                    else
                        // this.lbTimer.string = cc.Tool.getInstance().convertSecondToTime2(time);
                        this.lbTimer.string = time;

                    break;
                case cc.TaiXiuState.RESULT: //15
                    // this.lbTimer.string = cc.Tool.getInstance().convertSecondToTime2(time);
                    this.lbTimer.string = (time <= 2) ? 15 : time;
                    this.lbBigTimer.node.color = cc.Color.WHITE;
                    this.lbBigTimer.string = time;
                    // this.nodeTornado.active = false;
                    this.elapsedTime = 0;
                    if (time === 10 || time === 5) {
                        cc.LobbyController.getInstance().refreshAccountInfo();
                    }

                    this.isShowTornado1 = false;
                    this.isShowTornado2 = false;
                    this.isShowTornado3 = false;
                    break;

                case cc.TaiXiuState.PREPARE_NEW_SESSION:
                    // this.lbTimer.string = cc.Tool.getInstance().convertSecondToTime2(time);
                    this.lbTimer.string = time;
                    this.lbBigTimer.node.color = cc.Color.WHITE;
                    if (time === 1)
                        this.lbBigTimer.string = 49;
                    else this.lbBigTimer.string = time;
                    // this.nodeTornado.active = false;

                    this.isShowTornado1 = false;
                    this.isShowTornado2 = false;
                    this.isShowTornado3 = false;
                    break;
            }
            this.lastTime = time;
        },

        getTimeResult: function () {
            return parseInt(this.lbTimer.string);
        }
    });
}).call(this);