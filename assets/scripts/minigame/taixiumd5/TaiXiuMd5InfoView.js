/**
 * Thong tin phien
 */

var taiXiuMd5Config = require('TaiXiuMd5Config');
import Utils from "../../../scripts/shootFish/common/Utils";
import Tween from "../../../scripts/shootFish/common/Tween";

(function () {
    cc.TaiXiuMd5InfoView = cc.Class({
        "extends": cc.Component,
        properties: {
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
            cc.TaiXiuMd5Controller.getInstance().setTaiXiuMd5InfoView(this);
			this.interval = null;
            this.reset();
        },

        onEnable: function () {
            if (cc.sys.isNative && this.nodeMain !== null && this.nodeMain !== undefined) {
                this.nodeMain.scaleX = 0.9;
                this.nodeMain.scaleY = 0.9;
            }
        },
        
        onDestroy: function () {
            cc.TaiXiuMd5Controller.getInstance().setTaiXiuMd5InfoView(null);
            if (this.interval !== null) {
                clearInterval(this.interval);
            }
        },

        reset: function () {
            this.currentState = 999;
            this.lastTime = 999;
            this.isTimer = false;
            this.timer = 0;
            if (this.interval !== null) {
                clearInterval(this.interval);
            }
        },

        updateInfo: function (md5sessionInfo) {
			//console.log(md5sessionInfo);
			this.startTimer(md5sessionInfo.Ellapsed);
            //check state de xu ly hien thi
            switch (md5sessionInfo.CurrentState) {
                //giai doan dat cuoc
                case cc.TaiXiuMd5State.BETTING: //54
                    if (this.currentState !== md5sessionInfo.CurrentState) {
                        //goi reset thong tin betInfo
                        cc.TaiXiuMd5Controller.getInstance().resetBetAndResultInfo();
                    }
                    this.lbBigTimer.node.active = true;
                    this.lbTimer.node.active = false;
                    this.nodeBGTimer.active = false;
					this.lbTotalBetTai.string = cc.Tool.getInstance().formatNumber(md5sessionInfo.TotalBetTai);
					this.lbTotalBetXiu.string = cc.Tool.getInstance().formatNumber(md5sessionInfo.TotalBetXiu);
                    break;
                //giai doan cho ket qua (ko cho dat cuoc)
                case cc.TaiXiuMd5State.END_BETTING:
                    this.lbBigTimer.node.active = true;
                    this.lbTimer.node.active = false;
                    this.nodeBGTimer.active = false;	
					//return;					
                    break;

                //giai doan ket qua
                case cc.TaiXiuMd5State.RESULT: //15
                    //dem thoi gian o local
                    this.lbBigTimer.node.active = false;
                    this.lbTimer.node.active = true;
                    this.nodeBGTimer.active = true;
                    break;

                //giai doan cho phien moi
                case cc.TaiXiuMd5State.PREPARE_NEW_SESSION:
                    //kiem tra neu chua start timer -> start
                    cc.TaiXiuMd5Controller.getInstance().resetBetInfo();
                    this.lbBigTimer.node.active = false;
                    this.lbTimer.node.active = true;
                    this.nodeBGTimer.active = true;
                    break;

            }
            //luu lai state hien tai
            this.currentState = md5sessionInfo.CurrentState;
            //set thong tin
            this.lbSessionID.string = '#' + md5sessionInfo.SessionID;
            this.lbUserBetTai.string = cc.Tool.getInstance().formatNumber(md5sessionInfo.TotalTai);
            this.lbUserBetXiu.string = cc.Tool.getInstance().formatNumber(md5sessionInfo.TotalXiu);
        },
		
        startTimer: function (remaining) {
            if (this.interval !== null) {
                clearInterval(this.interval);
            }

            var self = this;
            this.timer = remaining;
            this.isTimer = true;

            ////update timer UI
            this.updateTime(remaining);

            //this.interval = setInterval(function(){
                //if (self.isTimer) {
                    //self.timer -= 1;
                    //self.updateTime(Math.round(self.timer));
                //}
            //}, 1000);
        },
		
        updateTime: function (time) {	
			//console.log(time);
            switch (this.currentState) {				
                case cc.TaiXiuMd5State.BETTING: //54
                    this.lbBigTimer.string = time;
					this.lbTimer.string = time;
					if (time >= 48) {
						cc.TaiXiuMd5Controller.getInstance().playAnimation();						
					}
                    break;
                case cc.TaiXiuMd5State.END_BETTING: //15
					//console.log(time);
                    //kiem tra thoi gian de dieu chinh animation
                    this.lbBigTimer.string = time;       
					this.lbTimer.string = time;
                    break;
                case cc.TaiXiuMd5State.RESULT: //15
					this.lbTimer.string = time;
                    this.lbBigTimer.node.color = cc.Color.WHITE;
                    this.lbBigTimer.string = time;
                    if (time === 10 || time === 5) {
                        cc.LobbyController.getInstance().refreshAccountInfo();
                    }
                    break;

                case cc.TaiXiuMd5State.PREPARE_NEW_SESSION:
					this.lbTimer.string = time;
                    this.lbBigTimer.node.color = cc.Color.WHITE;
                    //if (time === 1)
                        this.lbBigTimer.string = time;
                    //else this.lbBigTimer.string = time;
                    break;
            }
            this.lastTime = time;
        },		
        updateTimerInfo: function (time) {			
            /*switch (this.currentState) {				
                case cc.TaiXiuMd5State.BETTING: //54
                    this.lbBigTimer.string = time;
					this.lbTimer.string = time;
					if (time >= 48) {
						cc.TaiXiuMd5Controller.getInstance().playAnimation();						
					}
                    break;
                case cc.TaiXiuMd5State.END_BETTING: //15
					console.log(time);
                    //kiem tra thoi gian de dieu chinh animation
                    this.lbBigTimer.string = time;
                    if (time === 1 || time <= 2){
						this.lbTimer.string = 15;
                    } else {
						this.lbTimer.string = time;
					}
                    break;
                case cc.TaiXiuMd5State.RESULT: //15
					this.lbTimer.string = time;
                    this.lbBigTimer.node.color = cc.Color.WHITE;
                    this.lbBigTimer.string = time;
                    this.elapsedTime = 0;
                    if (time === 10 || time === 5) {
                        cc.LobbyController.getInstance().refreshAccountInfo();
                    }
                    break;

                case cc.TaiXiuMd5State.PREPARE_NEW_SESSION:
					this.lbTimer.string = time;
                    this.lbBigTimer.node.color = cc.Color.WHITE;
                    if (time === 1)
                        this.lbBigTimer.string = 50;
                    else this.lbBigTimer.string = time;
                    break;
            }
            this.lastTime = time;*/
        },
		
		showRuleClick: function()
		{
			cc.TaiXiuMd5MainController.getInstance().createRuleView();
		}
    });
}).call(this);