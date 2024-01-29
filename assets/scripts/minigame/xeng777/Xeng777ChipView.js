(function () {
    cc.Xeng777ChipView = cc.Class({
        extends: cc.Component,
        properties: {
            //Layout chua chip
            layoutChip: cc.Node,
            //Vi tri chip
            posChips: [cc.Node],
            //Vi tri user khac
            posGroupUsers: cc.Node,
            //Vi tri Dealer
            posDealer: cc.Node,
            // //Vi tri Huou
            // posDeer: cc.Node,
            // //Vi tri Bau
            // posGourd: cc.Node,
            // //Vi tri Ga
            // posRooster: cc.Node,
            // //Vi tri Ca
            // posFish: cc.Node,
            // //Vi tri Cua
            // posCrab: cc.Node,
            // //Vi tri Huou
            // posLobster: cc.Node,
            posParentBets: cc.Node,
            //Danh sach posPlayer
            lstPosPlayer: [cc.Node],
        },
        onLoad: function () {
            this.controller = cc.Xeng777Controller.getInstance();
            this.controller.setChipView(this);
            this.initParamChips();
            this.MAX_COUNT_CHIP = 10;

        },
        initParamChips: function () {
            this.chipsGateBets = [];
            this.posBets = [];

            for (let i = 0; i < 10; i++) {
                this.chipsGateBets.push([]);
            }

            this.posBets.push(this.posParentBets.getChildByName("btnBet1"));
            this.posBets.push(this.posParentBets.getChildByName("btnBet2"));
            this.posBets.push(this.posParentBets.getChildByName("btnBet3"));
            this.posBets.push(this.posParentBets.getChildByName("btnBet4"));
            this.posBets.push(this.posParentBets.getChildByName("btnBet5"));
            this.posBets.push(this.posParentBets.getChildByName("btnBet6"));

            this.posBets.push(this.posParentBets.getChildByName("btnBet7"));
            this.posBets.push(this.posParentBets.getChildByName("btnBet8"));
            this.posBets.push(this.posParentBets.getChildByName("btnBet9"));
            this.posBets.push(this.posParentBets.getChildByName("btnBet10"));
        },
        //Lay random vi tri chip cua betSide
        randomPosChip: function (betValue, betSide) {
            betSide = parseInt(betSide);
            let pos = null;

            pos = this.getPostBet(betSide);

            let posEnd = pos.position;

            let xMax = (pos.width / 2);
            let xMin = -xMax;

            let yMax = (pos.height / 2);
            let yMin = -yMax;

            let xRandom = Math.floor(Math.random() * (xMax - xMin + 1) + xMin);
            let yRandom = Math.floor(Math.random() * (yMax - yMin + 1) + yMin);

            posEnd.x = posEnd.x + xRandom;
            posEnd.y = posEnd.y + yRandom;

            return posEnd;
        },

        getPostBet: function (betSide) {
            // return this.posBets[betSide - 1].getChildByName('layoutChipBets');
            return this.posBets[betSide - 1]
        },
        //Di chuyen chip cua player khi bet thanh cong
        moveChipBet: function (betValue, betSide, type, accID) {
            // this.layoutChip.position = cc.v2(0, 0);
            // cc.AudioController.getInstance().playSound(cc.AudioTypes.CHIP_BET);

            betValue = parseInt(betValue);
            //Lay vi tri bat dau cua chip
            let posChipStart = cc.v2(0, -450);
            if (type === cc.BacaratChipOf.USERS) {
                posChipStart = this.posGroupUsers.position;
                //Lay danh sach player
                let positionPlayerUI = this.controller.positionPlayerUI();

                let indexPosition = positionPlayerUI ? positionPlayerUI.indexOf(accID) : -1;

                if (indexPosition !== -1) {
                    posChipStart = this.lstPosPlayer[indexPosition].position;
                }
            }
            // let posChipEnd = this.randomPosChip(betValue, betSide);
            // let posChipEnd = cc.v2(-727.238, 46.757);
            let posChipEnd = this.randomPosChip(betValue, betSide);
            let posIndex = this.getListChip(betSide).length;
            //Khoi tao chip
            let chip = this.controller.createChip(cc.Xeng777MapChipSpriteFrame[betValue]);
            chip.parent = this.getPostBet(betSide).parent;
            chip.position = posChipStart;
            let moveAction = cc.moveTo(0.3, posChipEnd);

            if (!cc.game.isPaused()) {
                //chip.runAction(moveAction);
                cc.tween(chip)
                    .to(0, { scale: 2, position: cc.v2(posChipStart.x, posChipStart.y) })
                    .to(.3, { scale: .7, position: cc.v2(posChipEnd.x, posChipEnd.y) })
                    .to(.45, { opacity: 0 })
                    .start();

            } else {
                chip.position = posChipEnd;
                chip.opacity = 0;
            }

            //Luu vi tri de di chuyen chip cho ket qua
            let positionEndChip = posChipStart;
            if (type === cc.BacaratChipOf.PLAYER) {
                // positionEndChip = this.lstPosPlayer[0].position;
                positionEndChip = cc.v2(-679.075, -503.784);
            }
            //Push node chip vao mang
            this.pushChipToArray(betSide, betValue, positionEndChip, chip);
        },
        //Push chip vao mang
        pushChipToArray: function (betSide, betValue, position, chip) {

            let listChips = this.getListChip(betSide);
            if (listChips) {
                listChips.push([chip, betValue, position]);
            }
        },
        //Cap nhat chip cho betsession
        updateChipForBetSession: function (data) {
            if (data.length === 0) {
                return;
            }
            data.map(dataChip => {
                if (dataChip.length === 0) {
                    return;
                }

                dataChip.map(sideData => {
                    let betSide = parseInt(sideData.BetSide);
                    let betValue = parseInt(sideData.BetValue);
                    let chip = this.controller.createChip(cc.Xeng777MapChipSpriteFrame[betValue]);

                    // console.log('betValue: ', betValue);

                    let positionChip = this.randomPosChip(betValue, betSide);

                    chip.parent = this.getPostBet(sideData.BetSide).parent;
                    chip.position = positionChip;
                    let posChipEnd = this.posGroupUsers.position;
                    //Lay danh sach player
                    let positionPlayerUI = this.controller.positionPlayerUI();
                    try {

                        let indexPosition = positionPlayerUI.indexOf(sideData.AccountID);
                        if (indexPosition !== -1) {
                            posChipEnd = this.lstPosPlayer[indexPosition].position;
                        }
                        //Push node chip vao mang
                        this.pushChipToArray(betSide, betValue, posChipEnd, chip);
                    } catch (e) {
                        console.log({ positionPlayerUI })
                        console.log({ sideData })
                        console.log(e);
                    }


                }, this);

            }, this);
        },
        //Tra chip thang
        refundChips: function (sideWin) {
            sideWin = parseInt(sideWin);
            let lstChip = this.getListChip(sideWin);
            let totalTime = 0;

            if (lstChip.length === 0) {
                return;
            }
            lstChip.map((chip, index) => {
                try {
                    index = (index > 5) ? 5 : index;

                    totalTime = index * 0.1;
                    //Tao chip                
                    let chipRefund = this.controller.createChip(cc.Xeng777MapChipSpriteFrame[chip[1]]);
                    chipRefund.parent = this.getPostBet(sideWin).parent;
                    chipRefund.position = this.posDealer.position;
                    let posEnd = this.randomPosChip(chip[1], sideWin);
                    //Kiem tra game pause
                    if (!cc.game.isPaused()) {
                        let moveRefund = cc.moveTo(0.3, posEnd);
                        cc.director.getScheduler().schedule(function () {
                            chipRefund.runAction(moveRefund);
                        }, this, 0, 0, index * 0.1, false);
                    } else {
                        chipRefund.position = posEnd;
                    }

                    //Gan chip vao mang chipWin de di chuyen chip ve phia groupUser
                    this.controller.setChipWin(chip[0], chip[1], chip[2]);
                    this.controller.setChipWin(chipRefund, chip[1], chip[2]);

                } catch (e) {
                    console.log(e);
                }
            }, this);

            //Tra chip ve cho user
            cc.director.getScheduler().schedule(function () {
                this.runRefundChipForUser();
            }, this, 0, 0, totalTime + 1.5, false);
        },
        //Tra chip cho user
        runRefundChipForUser: function () {
            // console.log("runRefundChipForUser")
            try {
                let chips = this.controller.getChipsWin();
                chips.map((chip, index) => {
                    if (index > 5) {
                        index = 5;
                    }
                    let posEnd = chip[2];
                    //console.log("chip", chip);
                    //Kiem tra game pause
                    if (!cc.game.isPaused()) {
                        cc.director.getScheduler().schedule(function () {
                            cc.tween(chip[0])
                                .to(0.3, { position: posEnd })
                                .to(0.3, { opacity: 0 })
                                .call(() => {
                                    this.controller.putChipToPool(chip[0], chip[1]);
                                }, this)
                                .start();
                        }, this, 0, 0, index * 0.1, false);
                    } else {
                        this.controller.putChipToPool(chip[0], chip[1]);
                    }

                }, this)

            } catch (e) {
                console.log(e);
            }
        },
        //Lay list chip theo side
        getListChip: function (side) {
            let listChips = null;
            listChips = this.chipsGateBets[side - 1];
            return listChips;
        },
        //Lay chip thua
        getChipsLose: function (sideLose) {

            sideLose = parseInt(sideLose);
            let lstChip = this.getListChip(sideLose);
            if (lstChip.length === 0) {
                return;
            }
            lstChip.map((chip, index) => {
                // try {
                if (index > 5) {
                    index = 5;
                }
                let endPos = this.posDealer.position;
                //Kiem tra game pause
                if (!cc.game.isPaused()) {
                    cc.director.getScheduler().schedule(function () {
                        let moveEnd = cc.moveTo(0.3, endPos);
                        let callBack = cc.callFunc(function () {
                            this.controller.putChipToPool(chip[0], chip[1]);
                            //chip[0].removeFromParent(true);
                        }, this);
                        chip[0].runAction(cc.sequence(moveEnd, callBack));
                    }, this, 0, 0, index * 0.1, false)
                } else {
                    this.controller.putChipToPool(chip[0], chip[1]);
                    //chip[0].removeFromParent(true);
                }

                // } catch (e) {
                //     console.log(e)
                // }

            }, this);
            //Reset list
            lstChip = [];
        },

        clearAllChips: function () {
            this.controller.clearPools();
            // this.layoutChip.removeAllChildren();
        }

    });
}).call(this);
