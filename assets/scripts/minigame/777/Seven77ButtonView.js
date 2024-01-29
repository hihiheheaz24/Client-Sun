/**
 * Created by Nofear on 6/7/2017.
 */

var gameMessage = require('GameMessage');

(function () {
    cc.Seven77ButtonView = cc.Class({
        "extends": cc.Component,
        properties: {
            seven77Image: cc.Seven77Image, //chua spriteFrame
            // sfFastSpins: [cc.SpriteFrame],
            btn100: cc.Button,
            btn1000: cc.Button,
            btn5000: cc.Button,
            btn10000: cc.Button,

            btnFastSpin: cc.Button,
            btnAutoSpin: cc.Button,

            btnSpin: cc.Button,

            btnSelectLines: cc.Button,

            btnScale: cc.Button,
            spriteScaleIcon: [cc.SpriteFrame],
            btntest: cc.Sprite,
            boxs: cc.Node,
            lines: cc.Node,
            lblStatus: cc.Label,
          
            lineViews: cc.Node,
            nodeMain: cc.Node,
            _statusAuto :  null,

        },

        onLoad: function () {
            // this.spriteFastSpin = this.btnFastSpin.node.getComponent(cc.Sprite);
            // this.btnSpin.interactable = false
            this.lineViews.active = false;
            for (var i = 0; i < this.boxs.children.length; i++) {
                var boxChild = this.boxs.children[i];
                var lineChild = this.lines.children[i];
                (function (boxChild, lineChild) {
                    boxChild.on(cc.Node.EventType.MOUSE_ENTER, function (event) {
                        lineChild.active = true;
                    }, this);
                    boxChild.on(cc.Node.EventType.MOUSE_LEAVE, function (event) {
                        lineChild.active = false;
                    }, this);
                })(boxChild, lineChild);
            }

            this.activeEventBtnBetOn()
            cc.Seven77Controller.getInstance().setSeven77ButtonView(this);

            this.betValues = [100, 1000, 5000, 10000];

            this.sprite100 = this.btn100.node.getComponent(cc.Sprite);
            this.sprite1000 = this.btn1000.node.getComponent(cc.Sprite);
            this.sprite5000 = this.btn5000.node.getComponent(cc.Sprite);
            this.sprite10000 = this.btn10000.node.getComponent(cc.Sprite);

            this.lb100 = this.btn100.node.getComponentInChildren(cc.Label);
            this.lb1000 = this.btn1000.node.getComponentInChildren(cc.Label);
            this.lb5000 = this.btn5000.node.getComponentInChildren(cc.Label);
            this.lb10000 = this.btn10000.node.getComponentInChildren(cc.Label);

            this.spriteFastSpin = this.btnFastSpin.node.getComponent(cc.Sprite);
            this.spriteAutoSpin = this.btnAutoSpin.node.getComponent(cc.Sprite);
            this.spriteSpin = this.btnSpin.node.getComponent(cc.Sprite);
            this.spriteButtonScale = this.btnScale.node.getComponent(cc.Sprite);

            //default x1
            this.roomId = cc.Seven77RoomId.Room_100;

            this.isFastSpin = false;
            this.isAutoSpin = false;
            this.isScale = false;

            this.isFreeSpinMode = false;

            this.animation = this.node.getComponent(cc.Animation);

            this.processUIByRoomId();

            //mac dinh vao phong khoa nut den khi goi PlayNow thanh cong
            this.activateAllButton(false);
        },
        // test(event){
        //     var listButtons = this.test.children
        //     for (let i = 0; i < listButtons.length; i++) {
        //         cc.log(i)
        // }
        // },
        onButton1kHover(event) {
            this.sprite1000.spriteFrame = this.seven77Image.sfChips[0];
        },

        onButton1kLeave(event) {
            this.sprite1000.spriteFrame = this.seven77Image.sfChips[1];
            this.processUIByRoomId();
        },
        onButton100Hover(event) {
            this.sprite100.spriteFrame = this.seven77Image.sfChips[0];
        },

        onButton100Leave(event) {
            this.sprite100.spriteFrame = this.seven77Image.sfChips[1];
            this.processUIByRoomId();
        },
        onButton10kHover(event) {
            this.sprite10000.spriteFrame = this.seven77Image.sfChips[0];
        },

        onButton10kLeave(event) {
            this.sprite10000.spriteFrame = this.seven77Image.sfChips[1];
            this.processUIByRoomId();
        },

        activateAllButton: function (enable) {
            this.btnFastSpin.interactable = enable;
            if (this._statusAuto == 1) {
                this.btnAutoSpin.interactable = enable;
            }
        },
        activeEventBtnBetOn: function () {
            this.btn1000.node.on(cc.Node.EventType.MOUSE_ENTER, this.onButton1kHover, this);
            this.btn1000.node.on(cc.Node.EventType.MOUSE_LEAVE, this.onButton1kLeave, this);
            this.btn100.node.on(cc.Node.EventType.MOUSE_ENTER, this.onButton100Hover, this);
            this.btn100.node.on(cc.Node.EventType.MOUSE_LEAVE, this.onButton100Leave, this);
            this.btn10000.node.on(cc.Node.EventType.MOUSE_ENTER, this.onButton10kHover, this);
            this.btn10000.node.on(cc.Node.EventType.MOUSE_LEAVE, this.onButton10kLeave, this);
        },

        activeEventBtnBetOff: function () {
            this.btn1000.node.off(cc.Node.EventType.MOUSE_ENTER, this.onButton1kHover, this);
            this.btn1000.node.off(cc.Node.EventType.MOUSE_LEAVE, this.onButton1kLeave, this);
            this.btn100.node.off(cc.Node.EventType.MOUSE_ENTER, this.onButton100Hover, this);
            this.btn100.node.off(cc.Node.EventType.MOUSE_LEAVE, this.onButton100Leave, this);
            this.btn10000.node.off(cc.Node.EventType.MOUSE_ENTER, this.onButton10kHover, this);
            this.btn10000.node.off(cc.Node.EventType.MOUSE_LEAVE, this.onButton10kLeave, this);
        },

        activateButton: function (enable) {
            this.spriteSpin.spriteFrame = enable ? this.seven77Image.sfSpins[0] : this.seven77Image.sfSpins[0];
            this.btnSpin.interactable = enable;
            // this.btnAutoSpin.interactable = enable;
            if (this._statusAuto == 1) {
                this.btnAutoSpin.interactable = enable;
            }
            cc.log("unactive")
            this.btnSelectLines.interactable = enable;
            this.btn100.interactable = enable;
            this.btn1000.interactable = enable;
            this.btn100.node.opacity = 255;
            this.btn1000.node.opacity = 255;
            this.btn10000.node.opacity = 255;
            this.btn10000.interactable = enable;
            this.btnFastSpin.node.opacity = 255;
            this.btnFastSpin.interactable = enable;
            this.activeEventBtnBetOn();
        },

        activateButtonSelectLines: function (enable) {
            this.isFreeSpinMode = !enable;
            // cc.log("vị trí")
            // this.btnSelectLines.interactable = enable;
        },

        processUIByRoomId: function () {
            this.sprite100.spriteFrame = this.seven77Image.sfChips[1];
            this.sprite1000.spriteFrame = this.seven77Image.sfChips[1];
            this.sprite5000.spriteFrame = this.seven77Image.sfChips[1];
            this.sprite10000.spriteFrame = this.seven77Image.sfChips[1];
            switch (this.roomId) {
                case cc.Seven77RoomId.Room_100:
                    this.sprite100.spriteFrame = this.seven77Image.sfChips[0];
                    // this.btn100.interactable = enable;
                    break;
                case cc.Seven77RoomId.Room_1000:
                    this.sprite1000.spriteFrame = this.seven77Image.sfChips[0];
                    break;
                case cc.Seven77RoomId.Room_5000:
                    this.sprite5000.spriteFrame = this.seven77Image.sfChips[0];
                    break;
                case cc.Seven77RoomId.Room_10000:
                    this.sprite10000.spriteFrame = this.seven77Image.sfChips[0];
                    break;
            }
        },

        getBetValue: function () {
            return this.betValues[this.roomId - 1];
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
            cc.log("quay")
            // this.spriteSpin.spriteFrame =  this.seven77Image.sfSpins[0];
            
            if (cc.Seven77SpinController.getInstance().getBetLinesText() === '') {
                cc.PopupController.getInstance().showMessage(gameMessage.YOU_NOT_CHOOSE_BET_LINES);
                return;
            }

            //ko du so du
            if (!cc.Seven77FreeSpinController.getInstance().getStateFreeSpin()) {
                if (cc.BalanceController.getInstance().getBalance() < (this.betValues[this.roomId - 1] * cc.Seven77SpinController.getInstance().getTotalLines())) {
                    cc.PopupController.getInstance().showMessage(gameMessage.BALANCE_NOT_ENOUGH_SPIN);
                    //tat autoSpin
                    this.stopAutoSpin();
                    return;
                }
            }

            this.btnSelectLines.interactable = false;
            this.btn100.interactable = false;
            this.btn1000.interactable = false;
            this.btn10000.interactable = false;
            this.btnFastSpin.interactable = false;
            var self = this;
            //Khoa Click cac button chuc nang
            self.activateButton(false);
            this.btn100.node.opacity = 128;
            this.btn1000.node.opacity = 128;
            this.btn10000.node.opacity = 128;
            this.btnFastSpin.node.opacity = 128;
            this.activeEventBtnBetOff();
            //request len hub
            cc.Seven77Controller.getInstance().sendRequestOnHub(
                cc.MethodHubName.SPIN,
                cc.Seven77SpinController.getInstance().getBetLinesText(),
                self.roomId,
            );

            //cc.Seven77SpinController.getInstance().startSpin();
        },

        processAutoSpin: function () {
            this._statusAuto = 2;
            if (this.isAutoSpin) {
                //this.spriteAutoSpin.spriteFrame = this.seven77Image.sfAutoSpins[0];
                this.lblStatus.string = "DỪNG"
            } else {
                //this.spriteAutoSpin.spriteFrame = this.seven77Image.sfAutoSpins[1];
                this.lblStatus.string = "TỰ QUAY"
            }
            cc.Seven77SpinController.getInstance().autoSpin(this.isAutoSpin);
        },

        roomClicked: function (event, data) {
            if (this.isAutoSpin) {
                cc.PopupController.getInstance().showMessage(gameMessage.MP_CANT_SWITCH_ROOM_AUTO_SPIN);
                return;
            }

            if (cc.Seven77SpinController.getInstance().getSpining()) {
                cc.PopupController.getInstance().showMessage(gameMessage.MP_CANT_SWITCH_ROOM_SPINNING);
                return;
            }

            this.roomId = parseInt(data.toString());
            this.processUIByRoomId();

            cc.Seven77Controller.getInstance().sendRequestOnHub(cc.MethodHubName.PLAY_NOW);
        },

        fastSpinClicked: function () {
            this.isFastSpin = !this.isFastSpin;
            if (this.isFastSpin) {
                cc.log("1")
                this.spriteFastSpin.spriteFrame = this.seven77Image.sfFastSpins[0];
            } else {
                this.spriteFastSpin.spriteFrame = this.seven77Image.sfFastSpins[1];
            }
        },

        autoSpinClicked: function () {
            if (cc.Seven77SpinController.getInstance().getBetLinesText() === '') {
                cc.PopupController.getInstance().showMessage(gameMessage.YOU_NOT_CHOOSE_BET_LINES);
                return;
            }

            if (!this.isAutoSpin) {
                if (!cc.Seven77FreeSpinController.getInstance().getStateFreeSpin()) {
                    //ko du so du
                    if (cc.BalanceController.getInstance().getBalance() < (this.betValues[this.roomId - 1] * cc.Seven77SpinController.getInstance().getTotalLines())) {
                        cc.PopupController.getInstance().showMessage(gameMessage.BALANCE_NOT_ENOUGH_SPIN);
                        return;
                    }
                }
            }

            this.isAutoSpin = !this.isAutoSpin;
            this.processAutoSpin();
        },

        spinClicked: function () {
            this._statusAuto = 1;
            this.startSpin();
        },

        helpClicked: function () {
            cc.Seven77PopupController.getInstance().createHelpView();
        },

        topClicked: function () {
            cc.Seven77PopupController.getInstance().createTopView();
        },

        historyClicked: function () {
            cc.Seven77PopupController.getInstance().createHistoryView();
        },

        betLinesClicked: function () {
            if (this.isFreeSpinMode) {
                cc.PopupController.getInstance().showMessage('Bạn không thể chọn dòng khi quay miễn phí');
                return;
            }
            this.lineViews.active = true;
            var nodePosition = this.nodeMain.getPosition();
            // this.nodeMain.setPosition(cc.v2(220,0));
        },
        returnPos: function(){
            // this.nodeMain.setPosition(cc.v2(0,0));
        },

        scaleClick: function () {
            cc.Seven77Controller.getInstance().onScale();
            if (!this.isScale) {
                this.spriteButtonScale.spriteFrame = this.spriteScaleIcon[0];
                this.isScale = true;
            } else {
                this.spriteButtonScale.spriteFrame = this.spriteScaleIcon[1];
                this.isScale = false;
            }
        },
    });
}).call(this);
