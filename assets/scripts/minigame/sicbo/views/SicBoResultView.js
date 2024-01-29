/*
 * Generated by BeChicken
 * on 11/14/2019
 * version v1.0
 */
(function () {
    cc.SicBoResultView = cc.Class({
        extends: cc.Component,
        properties: {
            spriteFistDice: cc.Sprite,
            spriteSecondDice: cc.Sprite,
            spriteThirdDice: cc.Sprite,
            imgTai: cc.Node,
            imgXiu: cc.Node,
            imgBao: cc.Node,
            lbResult: cc.Label,
            lastResult: cc.Node,
            lbX:cc.Sprite,
            lbXImage:[cc.SpriteFrame],
            lbNumOfSession:cc.Label,
            spThiemThu:cc.Sprite,
            listImageGateThiemThu:[cc.SpriteFrame],
            listSpriteRecentResult:[cc.Sprite],
            resultImg:[cc.SpriteFrame]
        },
        onLoad: function () {
            this.controller = cc.SicBoController.getInstance();
            this.controller.setResultView(this);
            this.listBetSide = Object.values(cc.SicBoBetSide);
        },
        setDicesResult: function(data) {
            let result = data.Result;
            let resDice1 = parseInt(result.Dice1);
            let resDice2 = parseInt(result.Dice2);
            let resDice3 = parseInt(result.Dice3);
            this.setDiceResult(this.spriteFistDice, resDice1 - 1);
            this.setDiceResult(this.spriteSecondDice, resDice2 - 1);
            this.setDiceResult(this.spriteThirdDice, resDice3 - 1);

            //--update result banner
            let total = resDice1 + resDice2 + resDice3;
            this.imgTai.active = false;
            this.imgXiu.active = false;
            this.imgBao.active = false;
            let str = "";
            if(total==3 || total==18){
                this.imgBao.active = true;
                str = "Bão";
            } else if(total > 10) {
                this.imgTai.active = true;
                str = "Tài";
            } else {
                this.imgXiu.active = true;
                str = "Xỉu";
            }
            this.lbResult.string = total + " - ";
        },
        onShowResult: function (data) {
            this.setDicesResult(data);
            let arrResult = [];
            if(data.GateWins.length>0){
                let GateWins = data.GateWins.split(',');
                for(let i=0;i<GateWins.length;i++){
                    arrResult.push(parseInt(GateWins[i]))
                }
                arrResult = cc.Tool.getInstance().arrUnique(arrResult);
            }

            //Hien thi cua thang
            arrResult.map(side => this.controller.playAnimationWin(side));

            //thiem thu
            
            let listWin = arrResult;
            let listLose = [];
            this.listBetSide.map(side => {
                if (!listWin.includes(side)) {
                    listLose.push(side);
                }
            });
                //Thu chip cua thua
            cc.director.getScheduler().schedule(function () {
                listLose.map(gateLose => {
                    this.controller.getChipsLose(gateLose);
                });

                cc.director.getScheduler().schedule(function () {
                    //Tra chip
                    listWin.map((gateWin, index) => {
                        this.controller.refundChips(gateWin)
                    }, this);
                    if(data.ThiemThu>0 && data.GateThiemThu>0){
                        cc.AudioController.getInstance().playSound(cc.AudioTypes.SICBO_THIEMTHU_COIN_FALL);
                        this.controller.playAnimationXWin(data.GateThiemThu, data.ThiemThu);
                    }
                }, this, 0, 0, 1.5, false);

                cc.director.getScheduler().schedule(function () {
                    let result = this.controller.getWinResult();
                    if (result) {
                        // this.controller.winResult(result);
                        //--show player win effect
                        for(let i=0;i<result.ResultForGates.length;i++){
                            this.controller.playAnimationCurrentPlayerWin(result.ResultForGates[i].GateID, result.ResultForGates[i].Award);
                        }
                    }

                    let vipResult = this.controller.getWinVipResult();
                    if (vipResult) {
                        this.controller.winResultVip(vipResult);
                    }
                    let totalWinResult = this.controller.getTotalWinResult();
                    if (totalWinResult) {
                        this.controller.updateTotalUserWin(totalWinResult);
                    }
                }, this, 0, 0, 3.5, false);

            }, this, 0, 0, 2, false);
        },
        setDiceResult: function (sprite, indexDice) {
            sprite.spriteFrame = this.controller.getSfDice(indexDice);
        },
        updateThemThuResult: function(result){
            for(let i=0;i<result.length;i++){
                let item = result[i];
                if(i==0){
                    let str = "";
                    let resDice1 = parseInt(item.FirstDice);
                    let resDice2 = parseInt(item.SecondDice);
                    let resDice3 = parseInt(item.ThirdDice);
                    let diceSum = resDice1 + resDice2 + resDice3;
                    str = diceSum>10?"TÀI":"XỈU";
                    if (resDice1==resDice2&&resDice2==resDice3) {
                        str = "BÃO";
                    }
                    this.lastResult.children[3].getComponent(cc.Label).string = diceSum + " / " + str;
                    this.lastResult.children[0].getComponent(cc.Sprite).spriteFrame = this.controller.getSfDice2D(resDice1 - 1);
                    this.lastResult.children[1].getComponent(cc.Sprite).spriteFrame = this.controller.getSfDice2D(resDice2 - 1);
                    this.lastResult.children[2].getComponent(cc.Sprite).spriteFrame = this.controller.getSfDice2D(resDice3 - 1);
                }
                if(item.ThiemThu>0){

                    this.lbNumOfSession.string = (i+1) + " Phiên trước";
                    this.lbX.spriteFrame = this.lbXImage[item.ThiemThu-1];
                    this.spThiemThu.spriteFrame = this.listImageGateThiemThu[item.GateThiemThu-1]
                    break;
                }
            }
            this.updateRecentResult(result);
        },
        updateRecentResult: function(result){
            for(let i=0;i<11;i++){
                let resDice1 = parseInt(result[i].FirstDice);
                let resDice2 = parseInt(result[i].SecondDice);
                let resDice3 = parseInt(result[i].ThirdDice);
                let diceSum = resDice1 + resDice2 + resDice3;
                var type = diceSum>10?0:1;
                if (resDice1==resDice2&&resDice2==resDice3) {
                    type = 2;
                }
                this.listSpriteRecentResult[i].spriteFrame = this.resultImg[type];
            }
        },
        getTuImage:function()
        {
            return this.listImageGateThiemThu;
        }
    });
}).call(this);