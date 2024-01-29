(function () {
    cc.Xeng777AnimationView = cc.Class({
        extends: cc.Component,

        properties: {
            spDotLed: sp.Skeleton,
            spBgLed: sp.Skeleton,
            btnBets: [cc.Node],
            items: [cc.Node],
            lbNumTxResult: cc.Label,
            nodeJackpotEffect:cc.Node
        },

        onLoad() {
            this.controller = cc.Xeng777Controller.getInstance();

            this.controller.setAnimationView(this);

            this.resetUI();

            //this.showResult(9, 2);
            this.arrNumAnis = [12, 4, 2, 8, 5, 10, 1, 7, 6, 11, 13, 3, 9, 12, 4, 2, 8, 5, 10, 1, 7, 6, 11, 13, 3, 9];
        },

        onDestroy: function () {
            this.controller.setAnimationView(null);
        },

        resetBtnBets: function () {
            this.btnBets.forEach(item => {
                this.setItemAction(item, false);
            })
        },

        resetItems: function () {
            this.items.forEach(item => {
                this.setItemAction(item, false);
            })
            this.nodeJackpotEffect.active = false;
        },

        setSpBgLedActive: function (active) {
            this.spBgLed.node.active = active;
        },

        setSpDotLedActive: function (active) {
            this.spDotLed.node.active = active;
        },

        activeGateWin: function (indexItem, indexItemTaiXiu) {
            this.setItemAction(this.items[indexItem], true);

            cc.director.getScheduler().schedule(() => {
                this.setActiveSpBgLed(false);
                this.setSpDotLedActive(false);

                const nodeTx = (indexItemTaiXiu == 0 ? this.btnBets[0] : (indexItemTaiXiu == 1 ? this.btnBets[1] : null));
                const nodeItem = this.btnBets[this.getGateWinByIndexItem(indexItem)];

                if (nodeTx) {
                    this.setItemAction(nodeTx, true);
                    this.setItemAction(nodeItem, true);
                }

            }, this, .5, 0, 0, false);
        },

        setActiveSpBgLed: function (action) {
            if (action) {
                this.spBgLed.setAnimation(0, 'animation', true);
            } else {
                this.spBgLed.clearTracks();
            }
        },

        getGateWinByIndexItem: function (indexItem) {
            switch (indexItem + 1) {
                case 4:
                case 5:
                case 6:
                    return 2; //bar
                case 16:
                case 17:
                    return 3; //77
                case 1:
                case 3:
                case 15:
                    return 4; //chuong
                case 8:
                case 19:
                case 20:
                    return 5; //chanh
                case 7:
                case 12:
                case 18:
                case 24:
                    return 6; //dao
                case 2:
                case 13:
                case 14:
                    return 7; //cam
                case 9:
                case 10:
                    return 8; //dua hau
                case 21:
                case 22:
                    return 9; //sao
            }
        },

        showResult: function (result) {
            const self = this;
            const countRound = 3;

            const indexItem = result.GateResultSymbolId - 1;
            const indexItemTaiXiu = result.GateBetTaiXiuId - 1;
            const txResultValue = result.TaiXiuValue;
            //console.log(result);
            this.setActiveSpBgLed(false);
            this.setSpDotLedActive(true);

            // if (this.controller.getElapsed() < 8) {
            //     self.activeGateWin(indexItem, indexItemTaiXiu);
            //     self.showNumResult(txResultValue);
            //     return;
            // } else {
            // }
            if (result.GateResultSymbolId==23)
            {
                this.isJackpot = true;
            }
            this.controller.soundStartResult();

            function scheduleSequentiallyShowResult(index) {
                const pos = index % 24;


                if (index < 24 * (countRound + 1) && pos < indexItem) {
                    let timer = .15;
                    if (indexItem - pos < 4) {
                        timer = .2;
                    }
                    cc.director.getScheduler().schedule(() => {
                        if (pos > 0) {
                            self.setItemAction(self.items[pos - 1], false);
                        } else if (pos == 0) {
                            self.setItemAction(self.items[23], false);
                        }

                        self.setItemAction(self.items[pos], true);
                        self.showNumResult(self.arrNumAnis[pos]);
                        scheduleSequentiallyShowResult(index + 1);
                    }, self, 0, 0, timer, false);
                } else {
                    cc.director.getScheduler().schedule(() => {
                        if (pos > 0) {
                            self.setItemAction(self.items[pos - 1], false);
                        } else if (pos == 0) {
                            self.setItemAction(self.items[23], false);
                        }

                        self.activeGateWin(indexItem, indexItemTaiXiu);
                        self.showNumResult(txResultValue);
                        self.controller.soundEndResult();
                        self.controller.soundResult(txResultValue);
                    }, self, .3, 0, 0, false);
                }
            }

            function scheduleSequentially(index) {
                if (index < 24 * countRound) {
                    var pos = index % 24;
                    cc.director.getScheduler().schedule(() => {
                        if (pos > 0) {
                            self.setItemAction(self.items[pos - 1], false);
                        } else if (pos == 0) {
                            self.setItemAction(self.items[23], false);
                        }
                        self.setItemAction(self.items[pos], true);
                        self.showNumResult(self.arrNumAnis[pos]);
                        scheduleSequentially(index + 1);
                    }, self, 0, 0, .05, false);
                } else {
                    scheduleSequentiallyShowResult(index);
                }
            }

            scheduleSequentially(0);
        },

        showReward: function () {
            const self = this;
            if (this.isJackpot)
            this.nodeJackpotEffect.active = true;
            this.isJackpot = false;
            if (!cc.game.isPaused()) {
                //Thu chip cua thua
                // listLose.map(gateLose => {
                //     this.controller.getChipsLose(gateLose);
                // });

                // cc.director.getScheduler().schedule(function () {
                //     //Tra chip
                //     listWin.map(gateWin => {
                //         this.controller.refundChips(gateWin);
                //     }, this);

                // }, this, 0, 0, 1, false);
                cc.director.getScheduler().schedule(function () {
                    let result = self.controller.getWinResult();
                    if (result) {
                        self.controller.winResult2(result);
                    }

                    let vipResult = self.controller.getWinVipResult();
                    if (vipResult) {
                        self.controller.winResultVip(vipResult);
                    }
                    let totalWinResult = self.controller.getTotalWinResult();
                    if (totalWinResult) {
                        self.controller.updateTotalUserWin(totalWinResult);
                    }

                }, this, 0, 0, 0.1, false);
            }
        },

        showNumResult: function (num) {
            this.lbNumTxResult.string = (num < 10 ? '0' : '') + num;
        },

        setItemAction: function (item, action) {
            if (!item) {
                return;
            }

            const active = item.getChildByName("active");
            active.active = action;
        },

        showAniBetting: function () {
            this.setActiveSpBgLed(true);
            this.setSpDotLedActive(false);
        },

        resetUI: function () {
            this.resetBtnBets();
            this.resetItems();
            this.setSpBgLedActive(true);
            this.setSpDotLedActive(false);
            this.controller.resetBet();
            this.lbNumTxResult.string = '00';
            this.nodeJackpotEffect.active = false;
        }



    });
}).call(this);