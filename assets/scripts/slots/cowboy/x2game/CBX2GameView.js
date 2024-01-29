/**
 * Created by Nofear on 3/26/2019.
 */
var gameMessage = require('GameMessage');

(function () {
    cc.CBX2GameView = cc.Class({
        "extends": cc.Component,
        properties: {
            lbiLastWin: cc.LabelIncrement,
            lbiX2: cc.LabelIncrement,

            btnClose: cc.Button,
            btnContinue: cc.Button,

            btnPicks: [cc.Button],

            nodeResult: [cc.Node],

            nodeFXOpen: cc.Node,

            sfResultX2: cc.SpriteFrame,
            sfResultMiss: cc.SpriteFrame,
        },

        onLoad: function () {
            cc.X2GameController.getInstance().setX2GameView(this);
        },

        //gọi sau khi tao ra -> de set so tien last win mang ra choi x2
        onEnable: function () {
            var baseValue = cc.X2GameController.getInstance().getBaseValue();
            var x2GameData = cc.X2GameController.getInstance().getX2GameData();

            //Kiem tra xem dang o buoc nao
            this.currentStep = x2GameData.Step;

            this.lbiLastWin.tweenValueto(baseValue);
            this.lbiX2.tweenValueto(baseValue * 2);
            //Bat nut dung
            this.btnClose.interactable = true;
            //Cap nhat so du ban dau
            cc.BalanceController.getInstance().updateBalance(cc.BalanceController.getInstance().getBalance());

            this.resetUI();
        },

        resetUI: function () {
            //tat het ket qua
            this.nodeResult.forEach(function (node) {
                node.active = true;
                node.opacity = 255;
            });

            this.nodeFXOpen.acitve = false;
            //Cho pick tiep
            this.btnPicks.forEach(function (btnPick) {
                btnPick.interactable = true;
                btnPick.node.active = true;
            });

            //Tat nut choi tiep
            this.btnContinue.interactable = false;
            this.btnContinue.node.active = false;
        },

        //ket qua khi co se tra ve day
        onResultX2Game (data) {
            cc.warn("onResultX2Game",data)
            //Kiem tra co phai truong hop bam Finish ko
            if (data.Step === 0) {
                this.checkData(data);
            }

            var self = this;
            this.currentStep = data.Step;

            //chay animation tien thang o vi tri pick
            this.node.runAction(cc.sequence(
                cc.callFunc(()=>{
                    // Mở cữa
                    self.nodeFXOpen.position =  this.btnPicks[self.pickID].node.position;
                    self.nodeFXOpen.active = true;
                    self.nodeFXOpen.getChildByName('fx').getComponent(cc.Animation).play('cbfxopenx2');
                }),
                cc.delayTime(0.05),
                cc.callFunc(()=>{
                    this.btnPicks[self.pickID].node.active = false;
                }),
                cc.delayTime(0.15),
                cc.callFunc(()=>{
                    let listFakeResult = [0,0,1,1];
                    if(data.RoundPrize > 0){
                        listFakeResult.splice(listFakeResult.indexOf(1),1);
                    } else {
                        listFakeResult.splice(listFakeResult.indexOf(0),1);
                    }
                    listFakeResult.sort( () => 0.5 - Math.random() );

                    this.nodeResult.forEach(function (node, index) {
                        if(index === self.pickID){
                            node.opacity = 255;
                            if (data.RoundPrize > 0) {
                                node.getComponent(cc.Sprite).spriteFrame = self.sfResultX2;
                            } else {
                                node.getComponent(cc.Sprite).spriteFrame = self.sfResultMiss;
                            }
                        } else {
                            node.opacity = 150;
                            const fakeResult = listFakeResult.shift();
                            node.getComponent(cc.Sprite).spriteFrame = fakeResult ? self.sfResultX2 : self.sfResultMiss;
                        }         
                    }); 
                    if (data.RoundPrize <= 0) {
                        this.lbiLastWin.tweenValueto(0,0.01);
                        this.lbiX2.tweenValueto(0,0.01);
                        cc.AudioController.getInstance().playSound(cc.AudioTypes.X2_CLICK);
                       
                    }
                }),
                cc.delayTime(0.5),
                cc.callFunc(()=>{
                    if (data.RoundPrize > 0) {
                        this.btnClose.node.active = true;
                        this.btnContinue.node.active = true;
                    }
                    this.btnPicks.forEach(function (button) {
                        button.node.active = false;    
                    });  
                    if (data.RoundPrize > 0) {
                        this.lbiLastWin.tweenValueto(data.RoundPrize);
                        cc.AudioController.getInstance().playSound(cc.AudioTypes.X2_WIN);
                        this.lbiX2.tweenValueto(data.TotalPrize * 2);
                    } 
                }),
                cc.delayTime(1),
                cc.callFunc(()=>{
                    self.checkData(data);
                })
               
            ));
            cc.AudioController.getInstance().playSound(cc.AudioTypes.OPEN_CARD);
        },

        checkData: function (data) {
            //Kiem tra xem phai lan cuoi -> ket thuc luon
            if (data.IsStop) {
                let prize = data.TotalPrize || 0;
                if (prize <= 0) {
                    prize = 0;
                }
                // neu thang thi show ket qua hieu ung thang
                if (data.RoundPrize > 0) {
                    //Show hieu ung thang

                    //Thang ca 4 lan
                    if (data.Step === 3) {
                        cc.PopupController.getInstance().showSlotsMessage(gameMessage.YOU_WIN_X2);
                        cc.director.getScheduler().schedule(function () {
                            cc.SpinController.getInstance().updateTotalWinUI(prize);
                            cc.MainController.getInstance().destroyX2GameView();
                        }, this, 0, 0, 2, false);
                    } else {
                        //nguoi choi tu bam dung (Step = 0)
                        cc.SpinController.getInstance().updateTotalWinUI(prize);
                        cc.MainController.getInstance().destroyX2GameView();
                    }
                } else {
                    this.lbiX2.tweenValueto(0);
                    cc.director.getScheduler().schedule(function () {
                        cc.SpinController.getInstance().updateTotalWinUI(prize);
                        cc.MainController.getInstance().destroyX2GameView();
                    }, this, 0, 0, 2, false);
                }
            } else {
                //set tiep gia tri x2
                //bat lai 2 button
                this.btnClose.interactable = true;
                this.btnContinue.interactable = true;

            }
        },

        pickClicked: function (event, data) {

            //luu lai ID vi tri Pick
            this.pickID = parseInt(data.toString());
            //ko cho bat cac nut
            this.btnClose.interactable = false;
            this.btnContinue.interactable = false;

            this.btnClose.node.active = false;
            this.btnContinue.node.active = false;

            this.btnPicks.forEach(function (btnPick) {
                btnPick.interactable = false;
            });

            //call hub method
            cc.RoomController.getInstance().sendRequestOnHub(cc.MethodHubName.PLAY_X2_GAME);
        },

        closeClicked: function () {
            if (this.currentStep > 0) {
                cc.RoomController.getInstance().sendRequestOnHub(cc.MethodHubName.FINISH_X2_GAME);
            } else {
                cc.MainController.getInstance().destroyX2GameView();
            }
        },

        continueClicked: function () {
            this.resetUI();
        },
    });
}).call(this);
