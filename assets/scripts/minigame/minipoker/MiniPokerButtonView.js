/**
 * Created by Nofear on 6/7/2017.
 */

var gameMessage = require('GameMessage');
var netConfig = require('NetConfig');

(function () {
    cc.MiniPokerButtonView = cc.Class({
        "extends": cc.Component,
        properties: {
            miniPokerImage: cc.MiniPokerImage, //chua spriteFrame
            // miniPokerImage: cc.Minipokere, //chua spriteFrame

            nodeGroupLeft: cc.Node, //nhom cac node chuc nang ben trai
            nodeClose: cc.Node,
            nodeGroupBot: cc.Node, //nhom cac node chuc nang ben duoi
            nodeGroupBot2: cc.Node,
            nodeFreeSpin: cc.Node,
            nodeEffect: cc.Node,

            btn100: cc.Button,
            btn1000: cc.Button,
            btn10000: cc.Button,
            // btn30000: cc.Button,
            btn1x: cc.Button,
            btn2x: cc.Button,
            // lb100: cc.Label,
            // lb1000: cc.Label,
            // lb10000: cc.Label,
            // lb30000: cc.Label,

            btnAutoSpin: cc.Button,

            btnSpin: cc.Button,

            skSpin: sp.Skeleton,
            statusSpin: cc.Label,
            speed1x: cc.Node,
            speed2x: cc.Node,
        },

        onLoad: function () {
            if (!cc.Config.getInstance().getDomainVK().includes(netConfig.HOST)) {
                this.betValues = [100, 1000, 10000, 30000];
            } else {
                this.betValues = [100, 1000, 10000, 50000];
            }
            // this.spriteAutoSpin.spriteFrame = this.miniPokerImage.sfAutoSpins[0];
            // this.skSpin.setAnimation(0, 'TRUCQUAY', false);

            this.nodeSpin = this.btnSpin.node;
            this.speed1x.active = true;
            this.speed2x.active = false;
            this.sprite100 = this.btn100.node.getComponent(cc.Sprite);
            this.sprite1000 = this.btn1000.node.getComponent(cc.Sprite);
            this.sprite10000 = this.btn10000.node.getComponent(cc.Sprite);

            this.sprite1x= this.btn1x.node.getComponent(cc.Sprite);
            this.sprite2x = this.btn2x.node.getComponent(cc.Sprite);
            this.sprite1x.spriteFrame = this.miniPokerImage.sfFastSpins1[0];
            // this.sprite30000 = this.btn30000.node.getComponent(cc.Sprite);

            this.spriteAutoSpin = this.btnAutoSpin.node.getComponent(cc.Sprite);

            //default x1
            this.xPoker = cc.MiniPokerX.X1;
            this.roomId = cc.MiniPokerRoomId.Room_100;

            this.isFastSpin = false;
            this.isAutoSpin = false;
            this.isScale = false;

            this.isFreeSpinMode = false;

            this.animation = this.node.getComponent(cc.Animation);

            this.processUIByMode();
            this.processUIByRoomId();

            //mac dinh vao phong khoa nut den khi goi PlayNow thanh cong
            this.activateAllButton(false);

            cc.MiniPokerController.getInstance().setMiniPokerButtonView(this);


        },

        activateAllButton: function (enable) {
            this.btnAutoSpin.interactable = enable;
            this.activateButton(enable);
        },

        activateButton: function (enable) {
            this.btnSpin.interactable = enable;

            // this.btn100.interactable = enable;
            // this.btn1000.interactable = enable;
            // this.btn10000.interactable = enable;
            //
            // switch (this.roomId) {
            //     case cc.MiniPokerRoomId.Room_100:
            //         this.btn100.interactable = false;
            //         break;
            //     case cc.MiniPokerRoomId.Room_1000:
            //         this.btn1000.interactable = false;
            //         break;
            //     case cc.MiniPokerRoomId.Room_10000:
            //         this.btn10000.interactable = false;
            //         break;
            // }

            // this.btn30000.interactable = enable;
        },

        activateButtonX: function (enable) {
            this.isFreeSpinMode = !enable;

        },

        processUIByMode: function () {
            // this.lb100.string = cc.Tool.getInstance().formatNumberK(this.betValues[0] * this.xPoker);
            // this.lb1000.string = cc.Tool.getInstance().formatNumberK(this.betValues[1] * this.xPoker);
            // this.lb10000.string = cc.Tool.getInstance().formatNumberK(this.betValues[2] * this.xPoker);
            // this.lb30000.string = cc.Tool.getInstance().formatNumberK(this.betValues[3] * this.xPoker);
        },


        processUIByRoomId: function () {
            // this.sprite100.spriteFrame = this.miniPokerImage.sfChips[1];
            // this.sprite1000.spriteFrame = this.miniPokerImage.sfChips[1];
            // this.sprite10000.spriteFrame = this.miniPokerImage.sfChips[1];
            // this.sprite30000.spriteFrame = this.miniPokerImage.sfChips[1];
            this.btn100.interactable = true;
            this.btn1000.interactable = true;
            this.btn10000.interactable = true;

            switch (this.roomId) {
                case cc.MiniPokerRoomId.Room_100:
                    // this.sprite100.spriteFrame = this.miniPokerImage.sfChips[0];
                    this.btn100.interactable = false;
                    this.sprite100.spriteFrame = this.miniPokerImage.sfChips[0];
                    this.sprite1000.spriteFrame = this.miniPokerImage.sfChips[3];
                    this.sprite10000.spriteFrame = this.miniPokerImage.sfChips[5];
                    break;
                case cc.MiniPokerRoomId.Room_1000:
                    // this.sprite1000.spriteFrame = this.miniPokerImage.sfChips[0];
                    this.btn1000.interactable = false;
                    this.sprite100.spriteFrame = this.miniPokerImage.sfChips[1];
                    this.sprite1000.spriteFrame = this.miniPokerImage.sfChips[2];
                    this.sprite10000.spriteFrame = this.miniPokerImage.sfChips[5];
                    break;
                case cc.MiniPokerRoomId.Room_10000:
                    // this.sprite10000.spriteFrame = this.miniPokerImage.sfChips[0];
                    this.btn10000.interactable = false;
                    this.sprite100.spriteFrame = this.miniPokerImage.sfChips[1];
                    this.sprite1000.spriteFrame = this.miniPokerImage.sfChips[3];
                    this.sprite10000.spriteFrame = this.miniPokerImage.sfChips[4];
                    break;
                // case cc.MiniPokerRoomId.Room_30000:
                //     this.sprite30000.spriteFrame = this.miniPokerImage.sfChips[0];
                //     break;
            }


        },

        getMode: function () {
            return this.xPoker;
        },

        getRoomId: function () {
            return this.roomId;
        },

        getFastSpin: function () {
            return this.isFastSpin;
        },

        stopAutoSpin: function () {
            this.isAutoSpin = false;
            this.processAutoSpin();
        },

        startSpin: function () {
            if (!cc.MPFreeSpinController.getInstance().getStateFreeSpin()) {
                //ko du so du
                if (cc.BalanceController.getInstance().getBalance() < (this.betValues[this.roomId - 1] * this.xPoker)) {
                    cc.PopupController.getInstance().showMessage(gameMessage.BALANCE_NOT_ENOUGH_SPIN);
                    //tat autoSpin
                    this.stopAutoSpin();
                    return;
                }
            }

            var self = this;
            this.skSpin.setAnimation(0, 'TRUCQUAY', false);

            self.activateButton(false);
            cc.MiniPokerController.getInstance().activeArrow(false);
            cc.director.getScheduler().schedule(function () {
                //Khoa Click cac button chuc nang
                //request len hub
                cc.MiniPokerController.getInstance().sendRequestOnHub(cc.MethodHubName.SPIN, self.xPoker, self.roomId);
            }, this, 1, 0, 0.2, false);
        },

        processAutoSpin: function () {
            if (this.isAutoSpin) {
                this.spriteAutoSpin.spriteFrame = this.miniPokerImage.sfAutoSpins[1];
                this.statusSpin.string = "Dừng"

            } else {
                this.spriteAutoSpin.spriteFrame = this.miniPokerImage.sfAutoSpins[0];
                this.statusSpin.string = "Tự quay"
            }
            cc.MPSpinController.getInstance().autoSpin(this.isAutoSpin);
        },

        setMode: function (mode) {
            this.xPoker = mode;
            this.processUIByMode();

            cc.MPJackpotController.getInstance().refreshMPJackpot();
        },

        modeClicked: function (event, data) {
            if (this.xPoker === parseInt(data.toString())) return;

            if (this.isFreeSpinMode) {
                cc.PopupController.getInstance().showMessage('Bạn không thể đổi chế độ chơi khi quay miễn phí');
                return;
            }

            if (this.isAutoSpin) {
                cc.PopupController.getInstance().showMessage(gameMessage.MP_CANT_SWITCH_ROOM_AUTO_SPIN);
                return;
            }

            if (cc.MPSpinController.getInstance().getSpining()) {
                cc.PopupController.getInstance().showMessage(gameMessage.MP_CANT_SWITCH_ROOM_SPINNING);
                return;
            }

            this.xPoker = parseInt(data.toString());
            this.processUIByMode();

            cc.MPJackpotController.getInstance().refreshMPJackpot();
        },

        roomClicked: function (event, data) {
            if (this.isAutoSpin) {
                cc.PopupController.getInstance().showMessage(gameMessage.MP_CANT_SWITCH_ROOM_AUTO_SPIN);
                return;
            }

            if (cc.MPSpinController.getInstance().getSpining()) {
                cc.PopupController.getInstance().showMessage(gameMessage.MP_CANT_SWITCH_ROOM_SPINNING);
                return;
            }

            this.roomId = parseInt(data.toString());
            this.processUIByRoomId();

            cc.MiniPokerController.getInstance().sendRequestOnHub(cc.MethodHubName.PLAY_NOW);
        },

        fastSpinClicked: function () {
            this.isFastSpin = !this.isFastSpin;
            if (this.isFastSpin) {
               
                this.sprite2x.spriteFrame = this.miniPokerImage.sfFastSpins1[0];
                this.sprite1x.spriteFrame = this.miniPokerImage.sfFastSpins1[1];
                // this.testnode.active = false;
            } else {
              
                this.sprite1x.spriteFrame = this.miniPokerImage.sfFastSpins1[0];
                this.sprite2x.spriteFrame = this.miniPokerImage.sfFastSpins1[1];
                // this.testnode.active = true;
            }
        },

        fastSpin1xClicked: function () {
            this.isFastSpin = false;
                this.speed1x.active = true;
                this.speed2x.active = false;
                this.sprite1x.spriteFrame = this.miniPokerImage.sfFastSpins1[0];
                this.sprite2x.spriteFrame = this.miniPokerImage.sfFastSpins1[1];
        },
        fastSpin2xClicked: function () {
            this.isFastSpin = true;
            this.speed1x.active = false;
            this.speed2x.active = true;
                this.sprite2x.spriteFrame = this.miniPokerImage.sfFastSpins1[0];
                this.sprite1x.spriteFrame = this.miniPokerImage.sfFastSpins1[1];
                cc.log("status 1", this.isFastSpin)
        },



        autoSpinClicked: function () {
            if (!this.isAutoSpin) {
                if (!cc.MPFreeSpinController.getInstance().getStateFreeSpin()) {
                    //ko du so du
                    if (cc.BalanceController.getInstance().getBalance() < (this.betValues[this.roomId - 1] * this.xPoker)) {
                        cc.PopupController.getInstance().showMessage(gameMessage.BALANCE_NOT_ENOUGH_SPIN);
                        return;
                    }
                }
            }

            this.isAutoSpin = !this.isAutoSpin;
            this.processAutoSpin();
        },

        spinClicked: function () {
            this.startSpin();

        },

        helpClicked: function () {
            cc.MiniPokerController.getInstance().createHelpView();
        },

        topClicked: function () {
            cc.MiniPokerController.getInstance().createTopView();
        },

        historyClicked: function () {
            cc.MiniPokerController.getInstance().createHistoryView();
        },
    });
}).call(this);
