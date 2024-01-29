/*
 * Generated by BeChicken
 * on 6/21/2019
 * version v1.0
 */
(function () {
    cc.DragonTigerMoveChip = cc.Class({
        extends: cc.Component,
        properties: {
            prefabsChip: [cc.Prefab],
            nodeChipsRong: cc.Node,
            nodeChipsHoa: cc.Node,
            nodeChipsHo: cc.Node,
            nodeChipsStartMove: cc.Node,
            lstPosChip: [cc.Node],//1K...1M
            nodePosGroupUser: cc.Node,
            lstPosPlayer: [cc.Node],
            posNodeDealer: cc.Node,
        },
        onLoad: function () {
            cc.DragonTigerController.getInstance().moveChipView = this;

            this.lstPosPlayerUI = [];
            //Khoi tao vi tri cua vip player trong ban
            this.lstPosPlayer.map(node => {
                this.lstPosPlayerUI.push(node.position);
            }, this);

            this.listChips = [];
            this.listChipsRong = [];
            this.listChipHo = [];
            this.listChipHoa = [];
            this.listChipReward = [];
            this.listChipOfUser = [];
            // this.listMap = {1000: 0, 2000: 1, 3000: 2, 5000: 3, 10000: 4, 100000: 5, 500000: 6};
            this.listMap = {1000: 0, 2000: 1, 3000: 2, 5000: 3, 10000: 4, 50000: 5, 100000: 6, 500000: 7, 1000000: 8};

            /*
           1k: -400, -289
           2k: -265, -289
           3k: -138, -289
           5k: -11, -289
           10k: 114,-289
           100k: 237, -289
           500k: 356, -289
           */
            // this.listPos = {1000: -400, 2000: -265, 3000: -138, 5000: -11, 10000: 114, 100000: 237, 500000: 356};
            this.listPos = {
                1000: this.lstPosChip[0].position.x,
                2000: this.lstPosChip[0].position.x,
                3000: this.lstPosChip[0].position.x,
                5000: this.lstPosChip[1].position.x,
                10000: this.lstPosChip[2].position.x,
                50000: this.lstPosChip[3].position.x,
                100000: this.lstPosChip[4].position.x,
                500000: this.lstPosChip[5].position.x,
                1000000: this.lstPosChip[6].position.x
            };
            this.listPools = [];
            //Khoi tao listPool
            Object.keys(this.listPos).map(key => {
                this.listPools[key] = new cc.NodePool();
                for (let i = 0; i <= 10; i++) {
                    let indexChip = this.listMap[key];
                    let chip = cc.instantiate(this.prefabsChip[indexChip]);
                    //Khoi tao ban dau 10 chip moi loai
                    this.listPools[key].put(chip);
                }
            }, this);

            this.posDealer = this.posNodeDealer.position;
            this.posTotalUser = this.nodePosGroupUser.position;//cc.v2(396, 232);
        },
        createListChipOfUser: function (data) {
            //reset chip of user
            this.listChipOfUser = [];
            let self = this;
            if (data.length > 0) {
                data.map(chip => {
                    //{BetSide: 1, BetValue: 5000}
                    let side = chip.BetSide;
                    let noddeChip = self.createChip(chip.BetValue);
                    self.listChipOfUser.push([noddeChip, side]);
                });
            }
        },
        updateListChipOfUser: function (side, value) {
            let nodeChip = this.createChip(value);
            this.listChipOfUser.push([nodeChip, side]);
        },
        moveChip: function (data, isCurrentUser) {
            let side = data[1];
            let value = data[0];


            let posDes = this.randomPosMove(side);

            var chip = this.createChip(value);
            switch (side) {
                case cc.DragonTigerBetSide.RONG:
                    this.listChipsRong.push([chip, value]);
                    break;
                case cc.DragonTigerBetSide.HOA:
                    this.listChipHoa.push([chip, value]);
                    break;
                case cc.DragonTigerBetSide.HO:
                    this.listChipHo.push([chip, value]);
                    break;
            }

            this.listChips.push([chip, value]);
            chip.parent = this.nodeChipsStartMove;
            if (!isCurrentUser) {
                chip.position = this.posTotalUser;
            } else {
                chip.x = this.listPos[value];
                chip.y = -315;
            }

            this.chipMoveTo(chip, posDes, 0.3);
        },
        //Di chuyen chip co vi tri bat dau den ban
        moveChipWithStartPos: function (data, isCurrentUser) {
            let positionUI = cc.DragonTigerController.getInstance().getPositionUI();
            let indexUI = -1;//AccID
            try {
                indexUI = positionUI.indexOf(data[2]);
            } catch (e) {
                indexUI = -1;
            }

            indexUI = (isCurrentUser) ? 0 : indexUI;
            //Lay vi tri bat dau
            let startPos = (indexUI != -1) ? this.lstPosPlayerUI[indexUI] : this.nodePosGroupUser.position;
            let side = data[1];
            let value = data[0];

            //Vi tri chip tren ban
            let posDes = this.randomPosMove(side);
            //Khoi tao chip
            let chip = this.createChip(value);
            switch (side) {
                case cc.DragonTigerBetSide.RONG:
                    this.listChipsRong.push([chip, value, startPos]);
                    break;
                case cc.DragonTigerBetSide.HOA:
                    this.listChipHoa.push([chip, value, startPos]);
                    break;
                case cc.DragonTigerBetSide.HO:
                    this.listChipHo.push([chip, value, startPos]);
                    break;
            }
            this.listChips.push([chip, value]);
            chip.parent = this.nodeChipsStartMove;
            if (!isCurrentUser) {
                chip.position = startPos;//this.nodePosGroupUser.position;
            } else {
                chip.x = this.listPos[value];
                chip.y = -315;
            }
            this.chipMoveTo(chip, posDes, 0.3);
        },
        initChipsBet: function (data) {


            let indexUI = -1;
            try {
                let positionUI = cc.DragonTigerController.getInstance().getPositionUI();
                indexUI = positionUI.indexOf(data[2]);//AccID
            } catch (e) {
                indexUI = -1;
            }
            //Lay vi tri bat dau
            let startPos = (indexUI != -1) ? this.lstPosPlayerUI[indexUI] : this.nodePosGroupUser.position;

            let side = data[1];
            let value = data[0];


            let posDes = this.randomPosMove(side);

            var chip = this.createChip(value);
            switch (side) {
                case cc.DragonTigerBetSide.RONG:
                    this.listChipsRong.push([chip, value, startPos]);
                    break;
                case cc.DragonTigerBetSide.HOA:
                    this.listChipHoa.push([chip, value, startPos]);
                    break;
                case cc.DragonTigerBetSide.HO:
                    this.listChipHo.push([chip, value, startPos]);
                    break;
            }

            this.listChips.push([chip, value]);
            chip.parent = this.nodeChipsStartMove;
            chip.position = posDes;
        },
        randomPosMove: function (side) {
            let posDes = "";
            let xMax = 0;
            let yMax = 0;
            let offset = 0;
            //Random x, y
            switch (side) {
                case cc.DragonTigerBetSide.RONG:
                    xMax = this.nodeChipsRong.width / 2;
                    yMax = this.nodeChipsRong.height / 2;
                    posDes = this.nodeChipsRong.position;
                    offset = 50
                    break;
                case cc.DragonTigerBetSide.HOA:
                    xMax = this.nodeChipsHoa.width / 5;
                    yMax = this.nodeChipsHoa.height / 2;
                    posDes = this.nodeChipsHoa.position;
                    offset = 25
                    break;
                case cc.DragonTigerBetSide.HO:
                    xMax = this.nodeChipsHo.width / 2;
                    yMax = this.nodeChipsHo.height / 2;
                    posDes = this.nodeChipsHo.position;
                    offset = 50
                    break;
            }   
            posDes.x = posDes.x + this.getRandomInt(-xMax + offset, xMax - offset);
            posDes.y = posDes.y + this.getRandomInt(-yMax + offset, yMax - offset);
            return posDes;
        },

        getRandomInt: function (min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        chipMoveTo: function (node, pos, duration) {
            let action = cc.moveTo(duration, pos);
            action.easing(cc.easeOut(1));
            node.runAction(action);
        },
        chipWinAnimation: function (node, pos, duration) {
            if (node._name == '') return;
            let action = cc.moveTo(duration, pos);
            let fadeOut = cc.fadeOut(2 * duration);
            node.runAction(cc.spawn(action, fadeOut));
        },
        chipRewardWinAnimation: function (node, pos, duration) {
            if (node._name == '') return;
            let action = cc.moveTo(duration, pos);
            node.runAction(action);

        },
        chipMoveToSideWin: function (sideWin) {
            let list = [];
            switch (sideWin) {
                case cc.DragonTigerBetSide.RONG:
                    list = this.listChipsRong;
                    break;
                case cc.DragonTigerBetSide.HO:
                    list = this.listChipHo;
                    break;
                case cc.DragonTigerBetSide.HOA:
                    list = this.listChipHoa;
                    break;
            }
            let self = this;
            list.map((chip, index) => {
                let pos = self.randomPosMove(sideWin);
                //clone chip
                let chp = self.createChip(chip[1]);
                chp.parent = this.nodeChipsStartMove;
                chp.position = cc.v2(-9, 153);
                self.listChipReward.push([chp, chip[1], chip[2]]);//[Chip, type, positionEnd]
                self.listChips.push(chp);
                index = (index >= 5) ? 5 : index;

                setTimeout(function () {
                    try {
                        self.chipRewardWinAnimation(chp, pos, 0.5);
                    } catch (e) {
                    }

                }, index * 100)
            });
        },
        //Di chuyen chip ve player
        chipMoveToCurrentUser: function (sideWin) {
            for (let i = 0; i < 2; i++) {
                let self = this;
                var index = 0;

                this.listChipOfUser.map(dataChip => {
                    if (dataChip[1] == sideWin) {
                        index++;
                        index = (index >= 5) ? 5 : index; // limit index 5
                        setTimeout(function () {
                            try {
                                // self.chipWinAnimation(dataChip[0], self.nodeChipsStartMove.position, 0.5);
                                self.chipWinAnimation(dataChip[0], dataChip[2], 0.5);
                            } catch (e) {
                            }

                        }, index * 100)
                    }

                })
            }
        },
        //Tao chip moi theo gia tri bet
        createChip: function (value) {
            let chip = null;
            let indexChip = this.listMap[value];
            if (this.listPools[value].size() > 0) {
                chip = this.listPools[value].get();
            } else {
                chip = cc.instantiate(this.prefabsChip[indexChip]);
            }
            chip.opacity = 255;
            try {
                chip.setScale(cc.v2(0.5, 0.5));
            } catch (err) {
                chip = cc.instantiate(this.prefabsChip[indexChip]);
                chip.setScale(cc.v2(0.5, 0.5));
            }

            return chip;


        },
        //Di chuyen chip ve dealer
        chipMoveToCoin: function (sideWin, isWin, total) {
            try {
                let listMoveDealer1 = [];
                let listMoveDealer2 = [];
                let listMoveCoin = [];
                switch (sideWin) {
                    case cc.DragonTigerBetSide.RONG:
                        listMoveCoin = this.listChipsRong;
                        listMoveDealer1 = this.listChipHoa;
                        listMoveDealer2 = this.listChipHo;
                        break;
                    case cc.DragonTigerBetSide.HO:
                        listMoveCoin = this.listChipHo;
                        listMoveDealer1 = this.listChipHoa;
                        listMoveDealer2 = this.listChipsRong;
                        break;
                    case cc.DragonTigerBetSide.HOA:
                        listMoveCoin = this.listChipHoa;
                        listMoveDealer1 = this.listChipHo;
                        listMoveDealer2 = this.listChipsRong;
                        break;
                }
                if (isWin)
                // this.commonMoveChipResult(listMoveCoin, this.posTotalUser);
                    this.commonMoveChipResultNoPositionEnd(listMoveCoin);
                else {
                    //Tra chip hoa cho user
                    if (sideWin == cc.DragonTigerBetSide.HOA) {
                        try {
                            setTimeout(function () {
                                this.moveChipTie(listMoveDealer1);
                                this.moveChipTie(listMoveDealer2);
                            }.bind(this), 1500)
                        } catch (e) {

                        }

                    } else { //Di chuyen chip ve dealer
                        this.commonMoveChipResult(listMoveDealer1, this.posDealer);
                        this.commonMoveChipResult(listMoveDealer2, this.posDealer);
                    }

                }
            } catch (e) {
                console.log(e);
            }


        },
        //Xoa chip
        removeChips: function (sideWin) {
            let listChipsRemove = [];
            switch (sideWin) {
                case cc.DragonTigerBetSide.RONG:
                    listChipsRemove = [...this.listChipHoa, ...this.listChipHo];
                    break;
                case cc.DragonTigerBetSide.HO:
                    listChipsRemove = [...this.listChipHoa, ...this.listChipsRong];
                    break;
                case cc.DragonTigerBetSide.HOA:
                    listChipsRemove = [...this.listChipHo, ...this.listChipsRong];
                    break;
            }
            if (listChipsRemove.length > 0) {
                listChipsRemove.map(chip => chip[0].destroy());
            }
        },

        commonMoveChipResult: function (listChip, posEnd) {
            let self = this;
            listChip = [...listChip, ...this.listChipReward];
            listChip.map((chip, index) => {
                index = (index >= 5) ? 5 : index;
                setTimeout(function () {
                    try {
                        self.chipWinAnimation(chip[0], posEnd, 0.3);
                    } catch (e) {
                    }

                }, index * 100)
            });
        },
        //Di chuyen chip hoa
        moveChipTie: function (listChip) {
            let self = this;
            if (listChip) {
                listChip.map((chip, index) => {
                    index = (index >= 5) ? 5 : index;
                    setTimeout(function () {
                        try {
                            self.chipWinAnimation(chip[0], chip[2], 0.5);
                        } catch (e) {
                        }
                    }, index * 100)
                });
            }

        },
        //Di chuyen chip thang
        commonMoveChipResultNoPositionEnd: function (listChip) {
            let self = this;
            listChip = [...listChip, ...this.listChipReward];
            listChip.map((chip, index) => {
                index = (index >= 5) ? 5 : index;
                setTimeout(function () {
                    try {
                        self.chipWinAnimation(chip[0], chip[2], 0.5);
                    } catch (e) {
                    }

                }, index * 100)
            });
        },
        clearChips: function () {
            if (this.listChips) {
                try {
                    //this.listChips.map(chip => chip.destroy());
                    this.listChips.map(chip => {
                        if (chip) {
                            let nodeChip = chip[0];
                            let value = chip[1];
                            if (value)
                                this.listPools[value].put(nodeChip);
                        }
                    }, this);
                } catch (e) {
                    console.log(e)
                }

            }
            this.listChips = [];
            this.listChipsRong = [];
            this.listChipHo = [];
            this.listChipHoa = [];
            this.listChipReward = [];
            this.listChipOfUser = [];
        },
        clearPools: function () {
            if (this.listPools) {
                this.listPools = [];
            }
        }
    });
}).call(this);