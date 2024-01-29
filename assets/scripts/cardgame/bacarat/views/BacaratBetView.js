/*
 * Generated by BeChicken
 * on 9/27/2019
 * version v1.0
 */
(function () {
    cc.BacaratBetView = cc.Class({
        extends: cc.Component,
        properties: {

            btnChips: [cc.Button],
            btnChipsTxt: [cc.Label],

            nodeLayoutBet: cc.Node,
            //Btn PlayerPair
            nodeAreaPPair: cc.Node,
            sfPPair: [cc.SpriteFrame],//0: Normal, 1: Press

            //Btn Player
            nodeAreaPlayer: cc.Node,
            sfPlayer: [cc.SpriteFrame],

            //Btn Tie
            nodeAreaTie: cc.Node,
            sfTie: [cc.SpriteFrame],

            //Btn Banker
            nodeAreaBanker: cc.Node,
            sfBanker: [cc.SpriteFrame],

            //Btn Banker Pair
            nodeAreaPBanker: cc.Node,
            sfPBanker: [cc.SpriteFrame],

            totalPPlayerBet: cc.Label,
            totalUserPPlayerBet: cc.Label,

            totalPlayerBet: cc.Label,
            totalUserPlayerBet: cc.Label,

            totalTieBet: cc.Label,
            totalUserTieBet: cc.Label,

            totalBankerBet: cc.Label,
            totalUserBankerBet: cc.Label,

            totalPBankerBet: cc.Label,
            totalUserPBankerBet: cc.Label,


            //Btn Bet again
            nodeBetX2: cc.Node,
            nodeBetAgain: cc.Node,

            nodePlayerPairFX: cc.Node,
            nodePlayerWinFX: cc.Node,
            nodeTieFX: cc.Node,
            nodeBankerPairFX: cc.Node,
            nodeBankerWinFX: cc.Node,

        },
        onLoad: function () {
            cc.BacaratController.getInstance().setBetView(this);
            this.betValue = 5000;//Khoi tao bet value 5k
            

            this.nodeChipPress = [];
            var self = this;
            this.btnChips.forEach(function (btnChip) {
                self.nodeChipPress.push(btnChip.node.getChildByName('Background'));
            });

            //PolyCollider cac cua dat
            this.areaPPair = this.nodeAreaPPair.getComponent(cc.PolygonCollider);
            this.areaPlayer = this.nodeAreaPlayer.getComponent(cc.PolygonCollider);
            this.areaTie = this.nodeAreaTie.getComponent(cc.PolygonCollider);
            this.areaBanker = this.nodeAreaBanker.getComponent(cc.PolygonCollider);
            this.areaPBanker = this.nodeAreaPBanker.getComponent(cc.PolygonCollider);

            //Spire cac cua dat
            this.pPairSprite = this.nodeAreaPPair.getComponent(cc.Sprite);
            this.playerSprite = this.nodeAreaPlayer.getComponent(cc.Sprite);
            this.tieSprite = this.nodeAreaTie.getComponent(cc.Sprite);
            this.bankerSprite = this.nodeAreaBanker.getComponent(cc.Sprite);
            this.pBankerSprite = this.nodeAreaPBanker.getComponent(cc.Sprite);

            //Node win cac cua dat
            this.pPairWin = this.nodeAreaPPair.getChildByName('win');
            this.playerWin = this.nodeAreaPlayer.getChildByName('win');
            this.tieWin = this.nodeAreaTie.getChildByName('win');
            this.bankerWin = this.nodeAreaBanker.getChildByName('win');
            this.pBankerWin = this.nodeAreaPBanker.getChildByName('win');

            this.pPairFW = this.nodeAreaPPair.getChildByName('firework');
            this.playerFW = this.nodeAreaPlayer.getChildByName('firework');
            this.tieFW = this.nodeAreaTie.getChildByName('firework');
            this.bankerFW = this.nodeAreaBanker.getChildByName('firework');
            this.pBankerFW = this.nodeAreaPBanker.getChildByName('firework');

            //Khoi tao event click bet
            //this.initBetEvent();
            this.resetLbTotalBet();

            //Btn Bet
            this.btnBetX2 = this.nodeBetX2.getComponent(cc.Button);
            this.btnBetAgain = this.nodeBetAgain.getComponent(cc.Button);
            this.setBetValue(null, this.betValue);
        },
        resetLbTotalBet: function () {
            let lstLabel = [
                this.totalPPlayerBet, this.totalUserPPlayerBet,
                this.totalPlayerBet, this.totalUserPlayerBet,
                this.totalTieBet, this.totalUserTieBet,
                this.totalBankerBet, this.totalUserBankerBet,
                this.totalPBankerBet, this.totalUserPBankerBet
            ];
            lstLabel.map(label => label.string = "");
        },
        onEnable: function () {
            cc.director.getCollisionManager().enabled = true;
        },
        onDisable: function () {
            // cc.director.getCollisionManager().enabled = false;
        },
        //Set gia tri bet
        setBetValue: function (event, value) {
            value = parseInt(value);  
            this.betValue = value;
            if(event){
                cc.AudioController.getInstance().playSound(cc.AudioTypes.CHIP_SELECT);  
            } 
            for (var i = 0; i < 5; i++) {
                this.btnChips[i].interactable = true;
                this.nodeChipPress[i].y = 0;
                this.btnChipsTxt[i].node.color = cc.Color.WHITE   
            }
            const listValue = [1000,5000,10000,100000,500000];
            const btnIndex = listValue.indexOf(this.betValue);
            this.btnChips[btnIndex].interactable = false;
            this.nodeChipPress[btnIndex].y = 5;
            this.btnChipsTxt[btnIndex].node.color = cc.Color.YELLOW;
        },
        setActiveButton: function (node) {
            node.getChildByName('active').active = true;
            let moveUp = cc.moveTo(0.3, cc.v2(node.x, -297));
            node.runAction(moveUp);
        },
        setDefaultSfButton: function (node, type) {
            node.getChildByName('active').active = false;
            let moveBack = cc.moveTo(0.3, cc.v2(node.x, -312));
            node.runAction(moveBack);
        },
        //Bet lai
        onBetAgain: function (sender, unit) {
            unit = parseInt(unit); //He so bet
            let logBet = cc.BacaratController.getInstance().getBetLogBySessionID(cc.BacaratController.getInstance().getBetLogSession());
            if (logBet.length === 0) {
                cc.PopupController.getInstance().showSlotsMessage("Chưa có dữ liệu của phiên trước.");
                return;
            }
            for (let i = 1; i <= unit; i++) {
                logBet.map((betData, index) => {
                    let timeOut = setTimeout(function () {
                        if (cc.BacaratController.getInstance().getCurrentState() === cc.BacaratMapGameState.BETTING && betData.sessionID === cc.BacaratController.getInstance().getBetLogSession() - 1) {
                            this.sendRequestBet(betData.value, betData.betSide);
                        } else {
                            try {
                                clearTimeout(timeOut);
                            } catch (e) {
                                console.log(e);
                            }
                        }
                    }.bind(this), index * 120*i);
                }, this);
            }
            this.disableBetAgain(true);
        },
        //Disable button bet lai, bet x2
        disableBetAgain: function (isDisable) {
            this.btnBetAgain.interactable = !isDisable;
            this.btnBetX2.interactable = !isDisable;
            // let color = cc.Color.WHITE;
            // if (isDisable) {
            //     color = cc.Color.GRAY;
            // }
            // this.nodeBetX2.color = color;
            // this.nodeBetAgain.color = color;
        },
        //Init event click vao bet
        initBetEvent: function () {
            this.nodeLayoutBet.on(cc.Node.EventType.MOUSE_MOVE, function (touch, event) {
                this.onBetSideMouseMove(touch.getLocation());
            }, this);

            this.nodeLayoutBet.on('touchstart', function (touch, event) {
                this.onBetSideClick(touch.getLocation(), 'touchstart');
            }, this);
            this.nodeLayoutBet.on('touchend', function (touch, event) {
                this.onBetSideClick(touch.getLocation(), 'touchend');
            }, this);
        },
        enableClickBet: function (enable) {
            if (enable) {
                this.initBetEvent()
            } else {
                this.nodeLayoutBet.off(cc.Node.EventType.TOUCH_START);
                this.nodeLayoutBet.off(cc.Node.EventType.TOUCH_END);
                this.nodeLayoutBet.off(cc.Node.EventType.MOUSE_MOVE);
                //Reset lai trang thai normal button
                this.changeSpriteFrame(this.pPairSprite, this.sfPPair, 'touchend', cc.BacaratBetSite.PLAYER_PAIR);
                this.changeSpriteFrame(this.playerSprite, this.sfPlayer, 'touchend', cc.BacaratBetSite.PLAYER);
                this.changeSpriteFrame(this.tieSprite, this.sfTie, 'touchend', cc.BacaratBetSite.TIE);
                this.changeSpriteFrame(this.bankerSprite, this.sfBanker, 'touchend', cc.BacaratBetSite.BANKER);
                this.changeSpriteFrame(this.pBankerSprite, this.sfPBanker, 'touchend', cc.BacaratBetSite.BANKER_PAIR);
            }
        },

        onBetSideMouseMove: function (location) {
            //Click PPlayer Side

            this.changeSpriteFrameV2(this.pPairSprite, this.sfPPair , false);
            this.changeSpriteFrameV2(this.playerSprite, this.sfPlayer, false);
            this.changeSpriteFrameV2(this.tieSprite, this.sfTie, false);
            this.changeSpriteFrameV2(this.bankerSprite, this.sfBanker, false);
            this.changeSpriteFrameV2(this.pBankerSprite, this.sfPBanker, false);

            if (cc.Intersection.pointInPolygon(location, this.areaPPair.world.points)) {
                this.changeSpriteFrameV2(this.pPairSprite, this.sfPPair , true);
            }
            //Click Player Side
            if (cc.Intersection.pointInPolygon(location, this.areaPlayer.world.points)) {
                this.changeSpriteFrameV2(this.playerSprite, this.sfPlayer, true);
            }
            //Click Tie Side
            if (cc.Intersection.pointInPolygon(location, this.areaTie.world.points)) {
                this.changeSpriteFrameV2(this.tieSprite, this.sfTie, true);
            }
            //Click Banker Side
            if (cc.Intersection.pointInPolygon(location, this.areaBanker.world.points)) {
                this.changeSpriteFrameV2(this.bankerSprite, this.sfBanker, true);
            }
            //Click Banker Pair Side
            if (cc.Intersection.pointInPolygon(location, this.areaPBanker.world.points)) {
                this.changeSpriteFrameV2(this.pBankerSprite, this.sfPBanker, true);
            }
        },

         //Thay doi sprite frame cua node khi click bet
         changeSpriteFrameV2: function (spriteNode, sfNode, enable) {
            if (enable) {
                spriteNode.spriteFrame = sfNode[1];
            } else {
                spriteNode.spriteFrame = sfNode[0];
            }
        },


        onBetSideClick: function (location, touchState) {
            //Click PPlayer Side
            if (cc.Intersection.pointInPolygon(location, this.areaPPair.world.points)) {
                this.changeSpriteFrame(this.pPairSprite, this.sfPPair, touchState, cc.BacaratBetSite.PLAYER_PAIR);
            }
            //Click Player Side
            if (cc.Intersection.pointInPolygon(location, this.areaPlayer.world.points)) {
                this.changeSpriteFrame(this.playerSprite, this.sfPlayer, touchState, cc.BacaratBetSite.PLAYER);

            }
            //Click Tie Side
            if (cc.Intersection.pointInPolygon(location, this.areaTie.world.points)) {
                this.changeSpriteFrame(this.tieSprite, this.sfTie, touchState, cc.BacaratBetSite.TIE);
            }
            //Click Banker Side
            if (cc.Intersection.pointInPolygon(location, this.areaBanker.world.points)) {
                this.changeSpriteFrame(this.bankerSprite, this.sfBanker, touchState, cc.BacaratBetSite.BANKER);
            }
            //Click Banker Pair Side
            if (cc.Intersection.pointInPolygon(location, this.areaPBanker.world.points)) {
                this.changeSpriteFrame(this.pBankerSprite, this.sfPBanker, touchState, cc.BacaratBetSite.BANKER_PAIR);

            }
        },
        //Thay doi sprite frame cua node khi click bet
        changeSpriteFrame: function (spriteNode, sfNode, touchEvent, betSide) {
            if (touchEvent == 'touchstart') {
                spriteNode.spriteFrame = sfNode[1];
                this.onBet(betSide);
            } else {
                spriteNode.spriteFrame = sfNode[0];
            }
        },

        //Chay animation win
        playAnimationWin: function (sideWin) {
            sideWin = parseInt(sideWin);
            let nodeWin = null;
            let nodeFirework = null;
            switch (sideWin) {
                case cc.BacaratBetSite.PLAYER_PAIR:
                    nodeWin = this.pPairWin;
                    nodeFirework = this.pPairFW;
                    this.nodePlayerPairFX.active = true;
                    break;
                case cc.BacaratBetSite.PLAYER:
                    nodeWin = this.playerWin;
                    nodeFirework = this.playerFW;
                    this.nodePlayerWinFX.active = true;
                    break;
                case cc.BacaratBetSite.TIE:
                    nodeWin = this.tieWin;
                    nodeFirework = this.tieFW;
                    this.nodeTieFX.active = true;
                    break;
                case cc.BacaratBetSite.BANKER:
                    nodeWin = this.bankerWin;
                    nodeFirework = this.bankerFW;
                    this.nodeBankerWinFX.active = true;
                    break;
                case cc.BacaratBetSite.BANKER_PAIR:
                    nodeWin = this.pBankerWin;
                    nodeFirework = this.pBankerFW;
                    this.nodeBankerPairFX.active = true;
                    break;
            }
            if (nodeWin != null) {
                nodeWin.active = true;
                nodeWin.stopAllActions();
                nodeWin.runAction(cc.sequence(
                    cc.fadeOut(0.2),
                    cc.fadeIn(0.2),
                    cc.fadeOut(0.2),
                    cc.fadeIn(0.2),
                    cc.fadeOut(0.2),
                    cc.fadeIn(0.2),
                    cc.fadeOut(0.2),
                    cc.fadeIn(0.2),
                ));
               
            }
            if (nodeFirework != null) {
                nodeFirework.active = true;
                nodeFirework.getComponent(cc.Animation).play();
            }

        },
        //Stop play win
        stopAnimationWin: function () {
            this.pPairWin.stopAllActions();
            this.pPairWin.active = false;
            this.pPairFW.active = false;
            this.pPairFW.getComponent(cc.Animation).stop();

            this.playerWin.stopAllActions();
            this.playerWin.active = false;
            this.playerFW.active = false;
            this.playerFW.getComponent(cc.Animation).stop();

            this.tieWin.stopAllActions();
            this.tieWin.active = false;
            this.tieFW.active = false;
            this.tieFW.getComponent(cc.Animation).stop();

            this.bankerWin.stopAllActions();
            this.bankerWin.active = false;
            this.bankerFW.active = false;
            this.bankerFW.getComponent(cc.Animation).stop();

            this.pBankerWin.stopAllActions();
            this.pBankerWin.active = false;
            this.pBankerFW.active = false;
            this.pBankerFW.getComponent(cc.Animation).stop();
            this.resetLbTotalBet();

            this.nodePlayerPairFX.active = false;
            this.nodePlayerWinFX.active = false;
            this.nodeTieFX.active = false;
            this.nodeBankerPairFX.active = false;
            this.nodeBankerWinFX.active = false;
        },
        //onBet dat cua
        onBet: function (betSide) {
            this.disableBetAgain(true);
            cc.AudioController.getInstance().playSound(cc.AudioTypes.CHIP_BET);
            //Gui request bet
            this.sendRequestBet(this.betValue, betSide);
        },
        //Update betValue
        updateTotalUserBetSide: function (betSide, totalBet) {
            betSide = parseInt(betSide);
            let label = null;
            switch (betSide) {
                case cc.BacaratBetSite.PLAYER_PAIR:
                    label = this.totalUserPPlayerBet;
                    break;
                case cc.BacaratBetSite.PLAYER:
                    label = this.totalUserPlayerBet;
                    break;
                case cc.BacaratBetSite.TIE:
                    label = this.totalUserTieBet;
                    break;
                case cc.BacaratBetSite.BANKER:
                    label = this.totalUserBankerBet;
                    break;
                case cc.BacaratBetSite.BANKER_PAIR:
                    label = this.totalUserPBankerBet;
                    break;
            }
            label.string = cc.Tool.getInstance().formatNumberSicbo(totalBet);
        },
        //HubOn betOfAccount
        updateBetOfAccount: function (data) {
            data.map(betSide => {
                let side = parseInt(betSide.BetSide);
                let label = null;
                switch (side) {
                    case cc.BacaratBetSite.PLAYER_PAIR:
                        label = this.totalUserPPlayerBet;
                        break;
                    case cc.BacaratBetSite.PLAYER:
                        label = this.totalUserPlayerBet;
                        break;
                    case cc.BacaratBetSite.TIE:
                        label = this.totalUserTieBet;
                        break;
                    case cc.BacaratBetSite.BANKER:
                        label = this.totalUserBankerBet;
                        break;
                    case cc.BacaratBetSite.BANKER_PAIR:
                        label = this.totalUserPBankerBet;
                        break;
                }
                label.string = cc.Tool.getInstance().formatNumberSicbo(betSide.BetValue);
            });
        },
        updateTotalBet: function (data) {
            this.totalPPlayerBet.string = data.TotalBetPlayerPair === 0 ? '' : cc.Tool.getInstance().formatNumberSicbo(data.TotalBetPlayerPair);

            this.totalPlayerBet.string = data.TotalBetPlayer === 0 ? '' : cc.Tool.getInstance().formatNumberSicbo(data.TotalBetPlayer);

            this.totalTieBet.string = data.TotalBetTie === 0 ? '' : cc.Tool.getInstance().formatNumberSicbo(data.TotalBetTie);

            this.totalBankerBet.string = data.TotalBetBanker === 0 ? '' : cc.Tool.getInstance().formatNumberSicbo(data.TotalBetBanker);

            this.totalPBankerBet.string = data.TotalBetBankerPair === 0 ? '' : cc.Tool.getInstance().formatNumberSicbo(data.TotalBetBankerPair);
        },
        sendRequestBet: function (betValue, betSide) {
            return cc.BacaratController.getInstance().sendRequestOnHub(cc.MethodHubName.BET, betValue, betSide);
        }

    });
}).call(this);
