/**
 * Ket qua, effect ket qua,
 */


var taiXiuConfig = require('TaiXiuConfig');

(function () {
    cc.TaiXiuResultView = cc.Class({
        "extends": cc.Component,
        properties: {
			audioDice:cc.AudioSource,
			audioShowresult:cc.AudioSource,
            //node ket qua
            nodeResult: cc.Node,
            //node 3 dice ket qua
            nodeResultDice: cc.Node,

            //bat de nan
            nodeBowl: cc.Node,

            //animation Dice
            diceMask:cc.Node,
            animationDice: cc.Animation,
            //sprite 3 dice
            spriteDice1: cc.Sprite,
            spriteDice2: cc.Sprite,
            spriteDice3: cc.Sprite,

            //label tong diem cua 3 dice
            //nodeBgTotalDice: cc.Node,
            //lbTotalDice: cc.Label,
            nodeTai: cc.Node,
            nodeXiu: cc.Node,
            //node effect bat len khi win
            nodeTaiWins: [cc.Node],
            nodeXiuWins: [cc.Node],

            //spriteFrame 6 dice
            sfDice1s: [cc.SpriteFrame],
            nodeDiceAnim: {
                default: null,
                type: cc.Node
             },
            timeOutEffect: cc.Animation
        },


        v2Distance(v1, v2) {
            return Math.sqrt(Math.pow(v2.x - v1.x, 2) + Math.pow(v2.y - v1.y, 2));
        },

        onLoad: function () {
            //setView
            cc.TaiXiuController.getInstance().setTaiXiuResultView(this);
            this.rootPasBowl = this.nodeBowl.position; //save lai vi tri goc
            this.animXocBat = this.nodeDiceAnim.getComponent(sp.Skeleton);
            this.reset();

            this.nodeBowl.on( cc.Node.EventType.TOUCH_MOVE,(event) => {
                  var pos = this.nodeBowl.position;
                  pos.x += event.getDeltaX()*2;
                  pos.y += event.getDeltaY()*2;
                  this.nodeBowl.position = pos;
                  let distance = this.v2Distance(cc.v2(pos.x, pos.y),this.rootPasBowl );
                  if (Math.abs(distance) > 270) {
                    cc.TaiXiuController.getInstance().openEndDiaNanView();
                    this.nodeBowl.active = false;
                  }
                },
                this
              );
              
              this.nodeBowl.on(cc.Node.EventType.TOUCH_END,() => {
                  this.nodeBowl.stopAllActions();
                  let pos = this.nodeBowl.position;
                  let distance = this.v2Distance(cc.v2(pos.x, pos.y),this.rootPasBowl );
                  if (Math.abs(distance) < 270) {
                    cc.tween(this.nodeBowl)
                        .to(0.1, { x: this.rootPasBowl.x, y: this.rootPasBowl.y}, { easing: cc.easing.sineOut })
                        .start();
                  }
                },
                this
              );
              
              this.nodeBowl.on(cc.Node.EventType.TOUCH_CANCEL,() => {
                  this.nodeBowl.stopAllActions();
                  let pos = this.nodeBowl.position;
                  let distance = this.v2Distance(cc.v2(pos.x, pos.y),this.rootPasBowl );
                  if (Math.abs(distance) < 270) {
                    cc.tween(this.nodeBowl)
                        .to(0.1, { x: this.rootPasBowl.x, y: this.rootPasBowl.y}, { easing: cc.easing.sineOut })
                        .start();
                  }
                },
                this
              );
        },

        onDestroy: function () {
            cc.TaiXiuController.getInstance().setTaiXiuResultView(null);
        },

        reset: function () {
            this.unscheduleAllCallbacks();
            this.currentState = 999;
            this.resetUI();
        },
        resetUI: function () {
            //dang play anim dice?
            this.animationOpenPlaying = false;
            this.animationDice.stop();
            
            this.diceMask.active = false;
            this.nodeResult.active = false;
            this.nodeResultDice.active = false;
            this.nodeBowl.active = false;
            this.nodeDiceAnim.active = false;
			this.audioShowresult.stop();
			this.audioDice.stop();

            //this.nodeBgTotalDice.active = false;
            //this.lbTotalDice.node.active = false;

            //reset lai vi tri bowl
            this.nodeBowl.position = this.rootPasBowl;

            this.nodeTaiWins.forEach(function (nodeTaiWin) {
                nodeTaiWin.active = false;
            });
            this.nodeXiuWins.forEach(function (nodeXiuWin) {
                nodeXiuWin.active = false;
            });
            this.nodeTai.active = true;
            this.nodeXiu.active = true;
        },
        hideNodeResult:function()
        {
            this.diceMask.active = false;
            this.nodeResult.active = false;
            this.nodeResultDice.active = false;
            this.nodeBowl.active = false;
        },
        getIsBowl: function () {
            return this.nodeBowl.active;
        },

        updateResult: function (sessionInfo, resume) {
            if(resume){
                this.currentState = sessionInfo.CurrentState;
                this.resetUI();
                switch (sessionInfo.CurrentState) {
                    case cc.TaiXiuState.RESULT: //15
                        this.setResult(sessionInfo);
                        break;

                }
                return;
            } 
            if (sessionInfo.CurrentState !== this.currentState) {
                //check state de xu ly hien thi
                switch (sessionInfo.CurrentState) {
                    case cc.TaiXiuState.BETTING: //54
                        //reset lai UI
                        this.resetUI();
                        break;
                    case cc.TaiXiuState.END_BETTING:
                        //Ko cho dat cuoc nua
                        //reset lai UI
                        this.resetUI();
                        break;
                        case cc.TaiXiuState.RESULT: //15
                        this.playAnimationAndSetResult(sessionInfo);
                        this.schedule(function() {
                            // Here this refers to component
                            this.diceAnimFinish();
                        }, 0, 0, 2);
                        break;
                    case cc.TaiXiuState.PREPARE_NEW_SESSION:
                        //neu dang hien thi bat de nan -> tat bat di + play fx
                        if (this.nodeBowl.active) {
                            this.nodeBowl.active = false;
                            this.startEffectResult();
                            //hien effect
                        } else {
                            this.setResult(sessionInfo);
                        }
                        break;
                    case 4://switch table
                        this.nodeBowl.active = false;
                        this.setResult(sessionInfo);
                        break;

                }
            }

            this.currentState = sessionInfo.CurrentState;
        },
        openEndDiaNan: function(){
            if (this.nodeBowl.active) {         
                this.nodeBowl.active = false;
                this.startEffectResult();
            }
        },
        playAnimationAndSetResult: function (sessionInfo) {
            //tinh total Dice
            this.totalDice = sessionInfo.Result.Dice1 +  sessionInfo.Result.Dice2 + sessionInfo.Result.Dice3;

            //bat node Result
            this.nodeResult.active = true;

            //set thong so diem cua Dice
            //this.lbTotalDice.string  = this.totalDice;

            //set ket qua vao sprite Dice
            this.spriteDice1.spriteFrame = this.sfDice1s[sessionInfo.Result.Dice1 - 1];
            this.spriteDice2.spriteFrame = this.sfDice1s[sessionInfo.Result.Dice2 - 1];
            this.spriteDice3.spriteFrame = this.sfDice1s[sessionInfo.Result.Dice3 - 1];

            //Tat node Dice Ket qua (3 Dice)
            this.nodeResultDice.active = false;

            //anim mới
            this.nodeDiceAnim.active = true;               
            this.animXocBat.__preload();

            //Bat node Dice Anim
            this.diceMask.active = true;
            this.animationDice.play('fxDice'); //diceAnimationOld
			if (cc.TaiXiuController.getInstance().getSoundStatus()) {
                this.audioDice.play();
            }
            //danh dau la dang play
            this.animationOpenPlaying = true;
            //cc.director.getScheduler().schedule(function () {
               // cc.TaiXiuMainController.getInstance().changeGraphView();
           // }.bind(this), this, 0, 0, 2, false);

        },

        //chi bat ket qua xuc xac (che do Nan)
        setResultDice: function (sessionInfo) {
            //bat node Result
            this.nodeResult.active = true;

            //set ket qua vao sprite Dice
            this.spriteDice1.spriteFrame = this.sfDice1s[sessionInfo.Result.Dice1 - 1];
            this.spriteDice2.spriteFrame = this.sfDice1s[sessionInfo.Result.Dice2 - 1];
            this.spriteDice3.spriteFrame = this.sfDice1s[sessionInfo.Result.Dice3 - 1];

            //Bat node Dice Ket qua (3 Dice)
            this.nodeResultDice.active = true;
        },

        //goi set ket qua luon (ko chay animation dice)
        setResult: function (sessionInfo) {
            //neu dang play animation dice thi return luon. Ket qua se tu hien sau khi anim ket thuc
            if (this.animationOpenPlaying && sessionInfo.CurrentState!=4) return;

            //hien luon ket qua
            this.totalDice = sessionInfo.Result.Dice1 +  sessionInfo.Result.Dice2 + sessionInfo.Result.Dice3;

            //bat node Result
            this.nodeResult.active = true;

            //set thong so diem cua Dice
            //this.lbTotalDice.string  = this.totalDice;

            //set ket qua vao sprite Dice
            this.spriteDice1.spriteFrame = this.sfDice1s[sessionInfo.Result.Dice1 - 1];
            this.spriteDice2.spriteFrame = this.sfDice1s[sessionInfo.Result.Dice2 - 1];
            this.spriteDice3.spriteFrame = this.sfDice1s[sessionInfo.Result.Dice3 - 1];

            //Bat node Dice Ket qua (3 Dice)
            this.nodeResultDice.active = true;

            //effect
            this.startEffectResult();
        },

        startEffectResult: function () {
            //Kiem tra xem ban nao thang
            if (this.totalDice > 10) {
                //TAI
                this.nodeTaiWins.forEach(function (nodeTaiWin) {
                    nodeTaiWin.active = true;
                });
                this.nodeXiuWins.forEach(function (nodeXiuWin) {
                    nodeXiuWin.active = false;
                });
                this.nodeTai.active = false;
            } else if (this.totalDice > 2 && this.totalDice <= 10) {
                //XIU
                this.nodeTaiWins.forEach(function (nodeTaiWin) {
                    nodeTaiWin.active = false;
                });
                this.nodeXiuWins.forEach(function (nodeXiuWin) {
                    nodeXiuWin.active = true;
                });
                this.nodeXiu.active = false;
            }
            if (cc.TaiXiuController.getInstance().getSoundStatus()) {
                this.audioShowresult.play();
            }
        },

        //sau khi play xong animation Dice
        diceAnimFinish: function () {
            // anim mới xong
            this.nodeDiceAnim.active = false; 
           
            //dang mo bat de nan -> ko chay animation thang
            if (cc.TaiXiuController.getInstance().getIsNan()) {
                
                this.nodeBowl.active = true;

                //tat node Dice Anim
                this.diceMask.active = false;
                this.animationDice.node.active = false;
                //Bat node Dice Ket qua (3 Dice)
                this.nodeResultDice.active = true;
            } else {
                //tat node Dice Anim
                this.diceMask.active = false;
                this.animationDice.node.active = false;

                //Bat node Dice Ket qua (3 Dice)
                this.nodeResultDice.active = true;				

                //Bat node ket qua tong
                //this.nodeBgTotalDice.active = true;
                //this.lbTotalDice.node.active = true;

                //effect
                this.startEffectResult();
            }
        },
    });
}).call(this);
