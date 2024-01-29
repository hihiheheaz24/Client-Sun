/**
 * Created by Nofear on 6/7/2017.
 */

var netConfig = require('NetConfig');
import TweenCommon from "TweenCommon";

(function () {
    cc.LobbyView = cc.Class({
        "extends": cc.Component,
        properties: {
            //prefab portal
            prefabVip: cc.prefab,
            prefabLoginViewKV: cc.Prefab, //#KingViet
            prefabLoginView: cc.Prefab,
            prefabAccountView: cc.Prefab,
            prefabSecurityView: cc.Prefab,
            

            prefabShopView: cc.Prefab,
            prefabShopViewBank: cc.Prefab,
            prefabShopViewKV: cc.Prefab, //#KingViet

            prefabShopTopupView: cc.Prefab,
            prefabShopTopupViewBank: cc.Prefab,

            prefabShopCastOutView: cc.Prefab,


            prefabHistoryView: cc.Prefab,
            prefabHistoryViewBank: cc.Prefab,
            prefabHistoryViewKV: cc.Prefab, //#KingViet

            prefabPopupUpdateUserPass: cc.Prefab,

            prefabDownloadd: cc.Prefab,
            prefabSupport: cc.Prefab,
            prefabGiftcode: cc.Prefab,
            prefabEvent: cc.Prefab,
            prefabVQMM: cc.Prefab,
            prefabAppSafeHelp: cc.Prefab,

            //DNS Help
            prefabDNSHelp: cc.Prefab,
            //Update Account
            prefabUpdateAccount: cc.Prefab,
            prefabMoveBB: cc.Prefab,
            prefabBlockBB: cc.Prefab,

            //event - san kho bau
            prefabTreasure: cc.Prefab,
            prefabCarrotDailyBonus: cc.Prefab,
            prefabBuyCarrot: cc.Prefab,
            prefabTreasureGift: cc.Prefab,
            prefabTreasureRule: cc.Prefab,
            prefabTreasureTop: cc.Prefab,

            //event - x2 Nap
            prefabX2Popup: cc.Prefab,
            prefabX2Reward: cc.Prefab,

            //prefab FX summon Dragon
            prefabFxSummonDragon: cc.Prefab,

            //#KingViet
            prefabEventPopup: cc.Prefab,

            //#GameVN
            prefabEventVNPopup: cc.Prefab,

            popUpLoadingSicBo:cc.Node,

            //Node list jackpot
            prefabListJackpot: cc.Prefab,
            nodeLobbys: [cc.Node],
            nodeTopBar: cc.Node,
            nodeSetting: cc.Node,

            //audio
            audioBg: cc.AudioSource,
            toggleAudio: cc.Toggle,
            sliderOn: cc.Node,
            sliderOff: cc.Node,
            prefabEventTop: cc.Prefab,
            nodeEventTop: cc.Node,
            loadingProcess:cc.Node,
            loadingLabel: cc.Label,
            loadingProgressBar: cc.ProgressBar,
            nodeXocDiaLobby: require('XocDiaLobby'),
        
            loadingMinigameNode:cc.Node,
            loadingMinigameProgress:cc.ProgressBar,
            //loadingMinigameLabel:cc.Label
          
            
            lbTotalTai: cc.LabelIncrement,
            lbTotalXiu: cc.LabelIncrement,

            guestMobile: cc.Node,
            guestWeb: cc.Node,
        },
        // use this for initialization
        onLoad: function () {
            cc.LobbyController.getInstance().setLobbyView(this);
            this.nodeTaiXiu = null;
			this.nodeTaiXiuMd5 = null;
            this.nodeEsport = null;
            this.nodeMiniPoker = null;
            this.nodeCaoThap = null;
            this.node777 = null;
            this.nodeBauCuaView = null;
            this.nodeTQ = null;
            this.nodeLW = null;
            this.nodeSlotsView = null;
            this.nodeVQMMView = null;
            this.nodeSicBoView = null;
            this.nodeLoDeView = null;
            var tool = cc.Tool.getInstance();
            if (tool.getItem('@onAudioBg') !== null) {
                if (tool.getItem('@onAudioBg') === 'true') {
                    this.IsOnAudioBg = true;
                } else {
                    this.IsOnAudioBg = false;
                }
            } else {
                this.IsOnAudioBg = true;
            }
            this.sliderOn.active = this.IsOnAudioBg;
            this.sliderOff.active = !this.IsOnAudioBg;
            // this.toggleAudio.isChecked = this.IsOnAudioBg;  
            this.guestMobile.active = cc.sys.isNative;
            this.guestWeb.active = !this.guestMobile.active;      
        },

        onEnable: function () {
            if (this.IsOnAudioBg) {
                this.audioBg.play();
            } else {
                this.audioBg.stop();
            }
            this.sliderOn.active = this.IsOnAudioBg;
            this.sliderOff.active = !this.IsOnAudioBg;
            if(!cc.LoginController.getInstance().getLoginState()) {
                var tool = cc.Tool.getInstance();
                if (tool.getItem('@isLanding') !== null) {
                    if (tool.getItem('@isLanding') === 'true') {
                        cc.LobbyController.getInstance().showRegisterView();
                    }
                }   
            }
        },

        //event X2
        createX2PopupView: function () {
            this.nodeX2Popup = this.createView(this.prefabX2Popup);
        },

        destroyX2PopupView: function () {
            if (this.nodeX2Popup)
                this.nodeX2Popup.destroy();
        },

        createX2RewardView: function () {
            this.nodeX2Reward = this.createView(this.prefabX2Reward);
        },

        destroyX2RewardView: function () {
            if (this.nodeX2Reward)
                this.nodeX2Reward.destroy();
        },
        createNewsView: function () {
            this.nodeNewsPopup = this.createView(this.prefabNewsPopup);
        },

        destroyNewsView: function () {
            if (this.nodeNewsPopup)
                this.nodeNewsPopup.destroy();
        },


        //event san KHO BAU
        createEventPopupView: function () {
            if (cc.Config.getInstance().getDomainVK().includes(netConfig.HOST)) {
                this.nodeEventPopup = this.createView(this.prefabEventPopup);
            } else {
                this.nodeEventPopup = this.createView(this.prefabEventVNPopup);
            }
        },

        destroyEventPopupView: function () {
            if (this.nodeEventPopup)
                this.nodeEventPopup.destroy();
        },

        //event san KHO BAU
        createTreasureView: function () {
            this.nodeTreasureView = this.createView(this.prefabTreasure);
        },

        destroyTreasureView: function () {
            if (this.nodeTreasureView)
                this.nodeTreasureView.destroy();
        },

        //buy carrot
        createBuyCarrotView: function () {
            this.nodeBuyCarrotView = this.createView(this.prefabBuyCarrot);
        },

        destroyBuyCarrotView: function () {
            if (this.nodeBuyCarrotView)
                this.nodeBuyCarrotView.destroy();
        },

        //chon qua vat ly
        createTreasureGiftView: function () {
            this.nodeTreasureGiftView = this.createView(this.prefabTreasureGift);
        },

        destroyTreasureGiftView: function () {
            if (this.nodeTreasureGiftView)
                this.nodeTreasureGiftView.destroy();
        },


        //carrot daily bonus popup
        createCarrotDailyBonusView: function () {
            this.nodeCarrotDailyBonusView = this.createView(this.prefabCarrotDailyBonus);
        },

        destroyCarrotDailyBonusView: function () {
            if (this.nodeCarrotDailyBonusView)
                this.nodeCarrotDailyBonusView.destroy();
        },

        //treasure rule popup
        createTreasureRuleView: function () {
            this.nodeTreasureRuleView = this.createView(this.prefabTreasureRule);
        },

        destroyTreasureRuleView: function () {
            if (this.nodeTreasureRuleView)
                this.nodeTreasureRuleView.destroy();
        },

        //treasure top popup
        createTreasureTopView: function () {
            this.nodeTreasureTopView = this.createView(this.prefabTreasureTop);
        },

        destroyTreasureTopView: function () {
            if (this.nodeTreasureTopView)
                this.nodeTreasureTopView.destroy();
        },

        //Fx
        createFxSummonDragon: function () {
            this.nodeFxSummonDragon = this.createView(this.prefabFxSummonDragon);
        },

        destroyFxSummonDragon: function () {
            if (this.nodeFxSummonDragon)
                this.nodeFxSummonDragon.destroy();
        },
        //end fx

        //Portal Portal Portal
        createLoginView: function () {
            if (!cc.Config.getInstance().getDomainVK().includes(netConfig.HOST)) {
                this.nodeLoginView = this.createView(this.prefabLoginView);
            } else {
                this.nodeLoginView = this.createView(this.prefabLoginViewKV);
            }
        },

        destroyLoginView: function () {
            if (this.nodeLoginView) 
                this.nodeLoginView.destroy();
        },

        createVQMMView: function () {
            if (this.nodeVQMMView === null) {
                this.nodeVQMMView = this.createView(this.prefabVQMM);
            }
        },

        destroyVQMMView: function () {
            if (this.nodeVQMMView) {
                this.nodeVQMMView.destroy();
                this.nodeVQMMView = null;
            }
        },

        createHistoryView: function () {
            // if (cc.Config.getInstance().getServiceId() === cc.ServiceId.BLOCK_BUSTER_3
            //     || cc.Config.getInstance().getServiceId() === cc.ServiceId.BLOCK_BUSTER_2) {
            //     this.nodeHistoryView = this.createView(this.prefabHistoryViewBank);
            // } else {
            //     this.nodeHistoryView = this.createView(this.prefabHistoryView);
            // }

            if (!cc.Config.getInstance().getDomainVK().includes(netConfig.HOST)) {
                this.nodeHistoryView = this.createView(this.prefabHistoryViewBank);
            } else {
                this.nodeHistoryView = this.createView(this.prefabHistoryViewKV);
            }

            //hide cac node o lobby
            // this.activeNodeLobby(false);
        },

        destroyHistoryView: function () {
            // this.activeNodeLobby(true);

            //cc.BannerController.getInstance().switchPage();

            if (this.nodeHistoryView)
                this.nodeHistoryView.destroy();
        },

        createAccountView: function () {
            this.nodeAccountView = this.createView(this.prefabAccountView);
            this.nodeAccountView.zIndex = cc.NoteDepth.POPUP_LOBBY;
            //hide cac node o lobby
            // this.activeNodeLobby(false);
        },

        destroyAccountView: function () {
            // this.activeNodeLobby(true);

            //cc.BannerController.getInstance().switchPage();

            cc.LobbyController.getInstance().refreshAccountInfo();
            if (this.nodeAccountView)
                this.nodeAccountView.destroy();
        },

        createSecurityView: function () {
            this.nodeSecurityView = this.createView(this.prefabSecurityView);
            //hide cac node o lobby
            // this.activeNodeLobby(false);
        },

        destroySecurityView: function () {
            cc.LobbyController.getInstance().refreshAccountInfo();
            if (this.nodeSecurityView)
                this.nodeSecurityView.destroy();
        },

        createPopupUpdateUserPassView: function () {
            this.nodePopupUpdateUserPass = this.createView(this.prefabPopupUpdateUserPass);
            this.nodePopupUpdateUserPass.zIndex = cc.NoteDepth.POPUP_LOBBY;
        },

        destroyPopupUpdateUserPassView: function () {
            cc.LobbyController.getInstance().refreshAccountInfo();
            if (this.nodePopupUpdateUserPass)
                this.nodePopupUpdateUserPass.destroy();
        },

        createShopTopupView: function () {
            // if (cc.Config.getInstance().getServiceId() === cc.ServiceId.BLOCK_BUSTER_3) {
            //     this.nodeShopTopupView = this.createView(this.prefabShopTopupViewBank);
            // } else {
            //     this.nodeShopTopupView = this.createView(this.prefabShopTopupView);
            // }

            this.nodeShopTopupView = this.createView(this.prefabShopTopupViewBank);
            this.nodeShopTopupView.zIndex = cc.NoteDepth.POPUP_LOBBY;

            //hide cac node o lobby
            // this.activeNodeLobby(false);
        },

        destroyShopTopupView: function () {
            // this.activeNodeLobby(true);

            //cc.BannerController.getInstance().switchPage();

            cc.LobbyController.getInstance().refreshAccountInfo();
            if (this.nodeShopTopupView)
                this.nodeShopTopupView.destroy();
            //hide cac node o lobby
        },

        createShopCastOutView: function () {
            this.nodeShopCastOutView = this.createView(this.prefabShopCastOutView);
            this.nodeShopCastOutView.zIndex = cc.NoteDepth.POPUP_LOBBY;
        },

        destroyShopCastOutView: function () {
            // this.activeNodeLobby(true);

            //cc.BannerController.getInstance().switchPage();

            cc.LobbyController.getInstance().refreshAccountInfo();
            if (this.nodeShopCastOutView)
                this.nodeShopCastOutView.destroy();
            //hide cac node o lobby
        },
        updateBetTotalTaiXiu: function (data) {
            // this.lbTotalTai.tweenValueto(data.TotalBetTai);
            // this.lbTotalXiu.tweenValueto(data.TotalBetXiu);
            if (data.CurrentState == cc.TaiXiuState.BETTING || data._isCanCua == true) {
                TweenCommon.numberTo(this.lbTotalTai, data.TotalBetTai, 0.3);
                TweenCommon.numberTo(this.lbTotalXiu, data.TotalBetXiu, 0.3);
                
            }
        },

        createShopView: function () {
            if (!cc.Config.getInstance().getDomainVK().includes(netConfig.HOST)) {
                if (cc.Config.getInstance().getServiceId() === cc.ServiceId.BLOCK_BUSTER_3) {
                    this.nodeShopView = this.createView(this.prefabShopViewBank);
                } else {
                    this.nodeShopView = this.createView(this.prefabShopView);
                }
            } else {
                this.nodeShopView = this.createView(this.prefabShopViewKV);
            }
            this.nodeShopView.zIndex = cc.NoteDepth.POPUP_LOBBY;
        },

        destroyShopView: function () {
            // this.activeNodeLobby(true);

            //cc.BannerController.getInstance().switchPage();

            cc.LobbyController.getInstance().refreshAccountInfo();
            if (this.nodeShopView)
                this.nodeShopView.destroy();
            //hide cac node o lobby
        },

        createGiftcodeView: function () {
            this.nodeGiftcodeView = this.createView(this.prefabGiftcode);
        },
////////////////////////////
        createSupportView: function () {
            this.createView(this.prefabSupport);
        },

        createDownloadView: function () {
            this.createView(this.prefabDownloadd);
        },
////////////////////////////
        destroyGiftcodeView: function () {
            if (this.nodeGiftcodeView)
                this.nodeGiftcodeView.destroy();
        },

        createEventView: function () {
            this.nodeEventView = this.createView(this.prefabEvent);
            this.nodeEventView.zIndex = cc.NoteDepth.POPUP_LOBBY;
        },

        createEventViewTopVP: function () {
            this.nodeEventViewTopVP = this.createView(this.prefabEventTop);
            this.nodeEventViewTopVP.zIndex = cc.NoteDepth.POPUP_LOBBY;
        },
        
        createAppSafeHelpView: function () {
            this.createView(this.prefabAppSafeHelp);
        },

        createDNSHelpView: function () {
            this.createView(this.prefabDNSHelp);
        },

        createUpdateAccountView: function () {
            this.createView(this.prefabUpdateAccount);
        },

        createMoveBBView: function () {
            this.createView(this.prefabMoveBB);
        },
        destroyMoveBBView: function () {
            if (this.prefabMoveBB)
                this.prefabMoveBB.destroy();
        },
        destroyViewXocDia: function () {
            this.destroyDynamicView(null);
        },

        createVipView: function () {
            if( this._prefabVip){
                this._prefabVip.active = true;
            }else{
                this._prefabVip = this.createView(this.prefabVip);
                this._prefabVip.zIndex = 100;
            }
           

        },
        destroyVipView: function () {
            if (this._prefabVip)
                this._prefabVip.destroy();
        },
        createBlockBBView: function () {
            this.createView(this.prefabBlockBB);
        },


        loadGameFullScreenByGameId(gameID){
            const config = {
                [cc.GameId.SHOOT_FISH]: {
                    downloadSubpackage: true,
                    bundleName: "shootFish",
                    urlBundle: "prefabs/ShootFish"
                },
                [cc.GameId.EGYPT]: {
                    downloadSubpackage: true,
                    bundleName: "egypt",
                    urlBundle: "prefabs/egyptView"
                },
                [cc.GameId.TAY_DU_THAN_KHI]: {
                    downloadSubpackage: true,
                    bundleName: "tayduthankhi",
                    urlBundle: "prefabs/tayDuThanKhiView"
                },
                [cc.GameId.THAN_THU]: {
                    downloadSubpackage: true,
                    bundleName: "thanthu",
                    urlBundle: "Scene/thanThuView"
                },
                [cc.GameId.THREE_KINGDOM]: {
                    downloadSubpackage: true,
                    bundleName: "tk",
                    urlBundle: "prefabs/tkView"
                },
                [cc.GameId.THUY_CUNG]: {
                    downloadSubpackage: true,
                    bundleName: "thuycung",
                    urlBundle: "prefabs/thuycungView"
                },
                [cc.GameId.BUM_BUM]: {
                    downloadSubpackage: true,
                    bundleName: "bumbum",
                    urlBundle: "prefabs/bbView"
                },
                [cc.GameId.AQUARIUM]: {
                    downloadSubpackage: true,
                    bundleName: "aquarium",
                    urlBundle: "prefabs/aquariumView"
                },
                [cc.GameId.DRAGON_BALL]: {
                    downloadSubpackage: true,
                    bundleName: "dragonball",
                    urlBundle: "prefabs/dbView"
                },
                [cc.GameId.COWBOY]: {
                    downloadSubpackage: true,
                    bundleName: "cowboy",
                    urlBundle: "prefabs/cbView"
                },
                [cc.GameId.XENG777]: {
                    downloadSubpackage: true,
                    bundleName: "Xeng777",
                    urlBundle: "xeng777View"
                },
                [cc.GameId.MONKEY]: {
                    downloadSubpackage: true,
                    bundleName: "monkey",
                    urlBundle: "prefabs/monkeyView"
                },
                [cc.GameId.DRAGON_TIGER]: {
                    downloadSubpackage: true,
                    bundleName: "dragontiger",
                    urlBundle: "prefabs/dragonTigerView"
                },
                [cc.GameId.XOC_XOC]: {
                    downloadSubpackage: true,
                    bundleName: "xocxoc",
                    urlBundle: "prefabs/xocxocView"
                },
                [cc.GameId.XOC_DIA_LIVE]: {
                    downloadSubpackage: true,
                    bundleName: "xocdialive",
                    urlBundle: "prefabs/xocxocLiveView"
                },
                [cc.GameId.POKER_TEXAS]: {
                    downloadSubpackage: true,
                    bundleName: "poker",
                    urlBundle: "prefabs/pokerView",
                    activeTopBar: true,
                },
                [cc.GameId.BA_CAY]: {
                    downloadSubpackage: true,
                    bundleName: "3cay",
                    urlBundle: "prefabs/3CLobby",
                    activeTopBar: true,
                },
                [cc.GameId.TIEN_LEN_MN]: {
                    downloadSubpackage: true,
                    bundleName: "tienlenMN",
                    urlBundle: "prefabs/TLMNLobby",
                    activeTopBar: true,
                },
                [cc.GameId.TIEN_LEN_MN_SOLO]: {
                    downloadSubpackage: true,
                    bundleName: "tienlenMNSoLo",
                    urlBundle: "prefabs/TLMNSoLoLobby",
                    activeTopBar: true,
                },
                [cc.GameId.MAU_BINH]: {
                    downloadSubpackage: true,
                    bundleName: "maubinh",
                    urlBundle: "prefabs/MBLobby",
                    activeTopBar: true,
                },
                [cc.GameId.BACCARAT]: {
                    downloadSubpackage: true,
                    bundleName: "bacarat",
                    urlBundle: "prefabs/BaCaratView",
                },
                [cc.GameId.VIETLOT]: {
                    downloadSubpackage: true,
                    bundleName: "vietlot",
                    urlBundle: "prefabs/VietlotView",
                },
                [cc.GameId.SICBO]: {
                    downloadSubpackage: true,
                    bundleName: "sicbo",
                    urlBundle: "prefabs/SicBoView",
                }
                
            }
            if(this.isLoading) return; // Đang tải game thì không tải tiếp game mới
            if (this.nodeSlotsView !== null) { // Xoá game cũ nếu đang chạy
                this.nodeSlotsView.destroy();
                this.nodeSlotsView = null;
            }

            if(gameID == cc.GameId.SICBO){
                this.popUpLoadingSicBo.active = true;
            }
            cc.RoomController.getInstance().setGameId(gameID);
            this.loadingProgressBar.progress = 0;
            this.loadingLabel.string = 0 + '%';
            let realPercent = 0;
            let downSubPacket = false;
            let gameConfig = config[gameID];
            this.isLoading = true;
            this.loadingProcess.active = true;
            if(gameConfig.downloadSubpackage){
                const sub = new cc.SubpackageDownloader();
                sub.downloadSubpackage(gameConfig.bundleName,(tempPercent)=>{
                    downSubPacket = true;
                    realPercent = tempPercent*0.5;
                    if(realPercent >= this.loadingProgressBar.progress){
                        this.loadingProgressBar.progress = realPercent;
                        this.loadingLabel.string = Math.round(100 * realPercent) + '%';
                    }
                },(err, bundle)=>{
                    if (err) {
                        return console.error(err);
                    }
                    bundle.load(gameConfig.urlBundle,cc.Prefab,
                        (completedCount, totalCount, item) => {
                            if(downSubPacket){
                                realPercent = 0.5 + (completedCount / totalCount)*0.5;
                                if(realPercent >= this.loadingProgressBar.progress){
                                    this.loadingProgressBar.progress = realPercent;
                                    this.loadingLabel.string = Math.round(100 * realPercent) + '%';
                                }
                            } else {
                                realPercent = (completedCount / totalCount)
                                if(realPercent >= this.loadingProgressBar.progress){
                                    this.loadingProgressBar.progress = realPercent;
                                    this.loadingLabel.string = Math.round(100 * realPercent) + '%';
                                }
                            }
                        
                        },
                        (err, prefab) => {
                            if (err) {
                                return console.error(err);
                            }
                            this.isLoading = false;
                            this.loadingProcess.active = false;
                            this.nodeSlotsView = this.createView(prefab);
                            this.nodeSlotsView.zIndex = cc.NoteDepth.FULL_SCENE_GAME;
                            
                            this.activeNodeLobby(false);
                            if(gameConfig.activeTopBar){
                                this.activeNodeTopBar(true);
                            }

                            if(gameID == cc.GameId.SICBO){
                                this.popUpLoadingSicBo.active = false;
                            }
                        }
                    );
                });
            } else {
                cc.assetManager.loadBundle(gameConfig.bundleName,(err, bundle) => {
                    bundle.load(gameConfig.urlBundle,cc.Prefab,
                        (completedCount, totalCount, item) => {
                            realPercent = (completedCount / totalCount)
                            if(realPercent >= this.loadingProgressBar.progress){
                                this.loadingProgressBar.progress = realPercent;
                                this.loadingLabel.string = Math.round(100 * realPercent) + '%';
                            }
                        },(err, prefab) => {
                            if (err) {
                                return console.error(err);
                            }
                            this.isLoading = false;
                            this.loadingProcess.active = false;
                            this.nodeSlotsView = this.createView(prefab);
                            this.nodeSlotsView.zIndex = cc.NoteDepth.FULL_SCENE_GAME;
                            this.activeNodeLobby(false);
                        }
                    );
                });    
            }

        },

        loadGameMiniByGameId(gameID){
            const config = {
                [cc.GameId.TAI_XIU]: {
                    bundleName: "taixiu",
                    urlBundle: "prefabs/taixiuView",
                    txt: "Tải Tài Xỉu: ",
                    nodeGame:'nodeTaiXiu'
                },
                [cc.GameId.MINI_POKER]: {
                    bundleName: "minipoker",
                    urlBundle: "prefabs/minipokerView",
                    txt: "Tải Mini Poker: ",
                    nodeGame: 'nodeMiniPoker'
                },
                [cc.GameId.CAO_THAP]: {
                    bundleName: "caothap",
                    urlBundle: "prefabs/caothapView",
                    txt: "Tải Cao Thấp: ",
                    nodeGame: 'nodeCaoThap'
                },
                [cc.GameId.SEVEN77]: {
                    bundleName: "777",
                    urlBundle: "prefabs/777View",
                    txt: "Tải Phục Sinh: ",
                    nodeGame: 'node777'
                },
                [cc.GameId.BAUCUA]: {
                    bundleName: "baucua",
                    urlBundle: "prefabs/BauCuaView",
                    txt: "Tải Bầu Cua: ",
                    nodeGame: 'nodeBauCuaView'
                },
                [cc.GameId.LODE]: {
                    bundleName: "lode",
                    urlBundle: "prefabs/LoDeLobby",
                    txt: "Tải Lô Đề: ",
                    nodeGame: 'nodeLoDeView'
                },
                

                

            }
            let gameConfig = config[gameID];
            if(this.isLoading) return; // Đang tải game thì không tải tiếp game mới
            if (this[gameConfig.nodeGame] !== null) return;
            cc.RoomController.getInstance().setGameId(gameID);
            this.loadingProgressBar.progress = 0;
            this.loadingLabel.string = 0 + '%';
            let realPercent = 0;
            let downSubPacket = false;
           
            this.isLoading = true;
            this.loadingMinigameNode.active = true;
            const sub = new cc.SubpackageDownloader();
            sub.downloadSubpackage(gameConfig.bundleName,(tempPercent)=>{
                downSubPacket = true;
                realPercent = tempPercent*0.5;
                if(realPercent >= this.loadingProgressBar.progress){
                    this.loadingMinigameProgress.progress = realPercent;
                  //  this.loadingMinigameLabel.string = gameConfig.txt + Math.round(100 * realPercent) + '%';
                }
            },(err, bundle)=>{
                if (err) {
                    return console.error(err);
                }
                bundle.load(gameConfig.urlBundle,cc.Prefab,
                    (completedCount, totalCount, item) => {
                        if(downSubPacket){
                            realPercent = 0.5 + (completedCount / totalCount)*0.5;
                            if(realPercent >= this.loadingProgressBar.progress){
                                this.loadingMinigameProgress.progress = realPercent;
                         //       this.loadingMinigameLabel.string = gameConfig.txt+ Math.round(100 * realPercent) + '%';
                            }
                        } else {
                            realPercent = (completedCount / totalCount)
                            if(realPercent >= this.loadingProgressBar.progress){
                                this.loadingMinigameProgress.progress = realPercent;
                          //      this.loadingMinigameLabel.string = gameConfig.txt+ Math.round(100 * realPercent) + '%';
                            }
                        }
                    
                    },
                    (err, prefab) => {
                        if (err) {
                            return console.error(err);
                        }
                        this.isLoading = false;
                        this.loadingMinigameNode.active = false;
                        cc.LobbyController.getInstance().AddMiniGameCount(1);

                        if(gameID == cc.GameId.TAI_XIU){
                            this[gameConfig.nodeGame] = this.createView(prefab,1000);
                            this.hideTaiXiu();
                            this.setActiveLiveXocDia();
                        } else {
                            this[gameConfig.nodeGame] = this.createView(prefab);
                            this.setActiveLiveXocDia();
                        }      
                       
                    }
                );
            });

        },
  //Tao cac game (prefab load dynamic)
        createDynamicView: function (gameId) {
            this.loadingProgressBar.progress = 0;
            this.loadingLabel.string = 0 + '%';
            switch (gameId) {
                case cc.GameId.SHOOT_FISH:
                case cc.GameId.EGYPT:
                case cc.GameId.TAY_DU_THAN_KHI:
                case cc.GameId.THAN_THU:
                case cc.GameId.THREE_KINGDOM:
                case cc.GameId.THUY_CUNG:
                case cc.GameId.BUM_BUM:
                case cc.GameId.AQUARIUM:
                case cc.GameId.DRAGON_BALL:
                case cc.GameId.COWBOY:
                case cc.GameId.XENG777:
                case cc.GameId.MONKEY:
                case cc.GameId.DRAGON_TIGER:
                case cc.GameId.XOC_XOC:
                case cc.GameId.XOC_DIA_LIVE:
                case cc.GameId.POKER_TEXAS:
                case cc.GameId.BA_CAY:
                case cc.GameId.TIEN_LEN_MN:
                case cc.GameId.TIEN_LEN_MN_SOLO:
                case cc.GameId.MAU_BINH:
                case cc.GameId.BACCARAT:
                case cc.GameId.VIETLOT:
                case cc.GameId.SICBO:
                {
                    this.loadGameFullScreenByGameId(gameId)   
                    break;
                }       
                case cc.GameId.LODE:
                case cc.GameId.SEVEN77:
                case cc.GameId.BAUCUA:
                case cc.GameId.CAO_THAP:
                case cc.GameId.MINI_POKER:
                case cc.GameId.TAI_XIU:{
                    this.loadGameMiniByGameId(gameId);
                    break;
                } 
                case cc.GameId.TAI_XIU_MD5:
                    //kiem tra da tao roi -> ko tao them
                    if (this.nodeTaiXiuMd5 !== null) return;

                    this.isLoading = true;
                    var self = this;
                    //Bat loading
                    self.loadingProcess.active = true;
                    var percent = 0;

                    var sub = new cc.SubpackageDownloader();

                    sub.downloadSubpackage('taixiumd5',function(tempPercent){
                        tempPercent = Math.round(100 * tempPercent);
                        if (tempPercent > percent) {
                            percent = tempPercent;
                        }
                        self.loadingLabel.string = percent + '%';
                    },(err, bundle)=>{
                        if (err) {
                            return console.error(err);
                        }
                        percent = 0;
                        bundle.load("prefabs/taixiuMd5View",cc.Prefab,
                            function (completedCount, totalCount, item) {
                                //self.ImgLoadingTaiXiuMd5.progress = completedCount / totalCount;
                                var tempPercent = Math.round(100 * completedCount / totalCount);
                                if (tempPercent > percent) {
                                    percent = tempPercent;
                                }
                                self.loadingProgressBar.progress = completedCount / totalCount;

                                self.loadingLabel.string = percent + '%';
                            },
                            function (err, prefab) {
                                //Load xong
                                self.isLoading = false;
                                //Tat loading
                                self.loadingProcess.active = false;
                                //Tao game
                                self.nodeTaiXiuMd5 = self.createView(prefab);
                            }
                        );
                    });
                    break;
                case cc.GameId.BLOCK_BUSTER:
                    //kiem tra da tao roi -> ko tao them
                    if (this.nodeTQ !== null) return;

                    this.isLoading = true;
                    var self = this;
                    //Bat loading
                    self.loadingProcess.active = true;
                    var percent = 0;
                    // cc.assetManager.loadBundle('tq',(err, bundle) => {
                    //     if (err) {
                    //         return console.error(err);
                    //     }
                    var sub = new cc.SubpackageDownloader();
                    sub.downloadSubpackage('tq',function(tempPercent){
                        tempPercent = Math.round(100 * tempPercent);
                        if (tempPercent > percent) {
                            percent = tempPercent;
                        }
                        self.loadingLabel.string = percent + '%';
                    },(err, bundle)=>{
                        if (err) {
                            return console.error(err);
                        }
                        percent = 0;
                        bundle.load("prefabs/tqView",cc.Prefab,
                        function (completedCount, totalCount, item) {
                            //self.ImgLoadingTQ.progress = completedCount / totalCount;
                            var tempPercent = Math.round(100 * completedCount / totalCount);

                            //dam bao cho % ko bi lui lai (do quy trinh dem asset khi load)
                            if (tempPercent > percent) {
                                percent = tempPercent;
                            }
                        //    self.loadingMinigameLabel.string = "Tải Siêu Xe"+ percent + '%';
                            self.loadingMinigameProgress.progress = completedCount / totalCount;
                            // self.loadingProgressBar.progress = completedCount / totalCount;
                            // self.loadingLabel.string = percent + '%';
                        },
                        function (err, prefab) {
                            //Load xong
                            self.isLoading = false;
                            self.loadingMinigameNode.active = false;
                            //Tao game
                            self.nodeTQ = self.createView(prefab);
                            self.setActiveLiveXocDia();
                        }
                    );
                    });
                    break;

                //LUCKY WILD
                case cc.GameId.LUCKY_WILD:

                    //kiem tra da tao roi -> ko tao them
                    if (this.nodeLW !== null) return;
                    this.isLoading = true;
                    var self = this;
                    //Bat loading
                    self.loadingProcess.active = true;
                    var percent = 0;

                    // cc.assetManager.loadBundle('luckyWild',(err, bundle) => {
                    //     if (err) {
                    //         return console.error(err);
                    //     }
                    var sub = new cc.SubpackageDownloader();
                    sub.downloadSubpackage('luckyWild',function(tempPercent){
                        tempPercent = Math.round(100 * tempPercent);
                        if (tempPercent > percent) {
                            percent = tempPercent;
                        }
                        self.loadingLabel.string = percent + '%';
                    },(err, bundle)=>{
                        if (err) {
                            return console.error(err);
                        }
                        percent = 0;
                        bundle.load("prefabs/lwView",cc.Prefab,
                        function (completedCount, totalCount, item) {
                            //self.ImgLoadingLuckyWild.progress = completedCount / totalCount;
                            var tempPercent = Math.round(100 * completedCount / totalCount);

                            //dam bao cho % ko bi lui lai (do quy trinh dem asset khi load)
                            if (tempPercent > percent) {
                                percent = tempPercent;
                            }
                         //   self.loadingMinigameLabel.string ="Tải Phục Sinh: "+ percent + '%';
                            self.loadingMinigameProgress.progress = completedCount / totalCount;
                            // self.loadingProgressBar.progress = completedCount / totalCount;
                            // self.loadingLabel.string = percent + '%';
                        },
                        function (err, prefab) {
                            //Load xong
                            self.isLoading = false;
                            self.loadingMinigameNode.active = false;

                            //Tao game
                            self.nodeLW = self.createView(prefab);
                            self.setActiveLiveXocDia();
                        }
                    );
                    });   
                    break;
              
                case cc.GameId.ESPORTS:
                    if (this.nodeEsport !== null) return;

                    cc.RoomController.getInstance().setGameId(gameId);
                    this.isLoading = true;
                    var self = this;

                    //Bat loading
                    self.loadingProcess.active = true;
                    var percent = 0;

                    // cc.assetManager.loadBundle('vietlot',(err, bundle) => {
                    //     if (err) {
                    //         return console.error(err);
                    //     }
                    var sub = new cc.SubpackageDownloader();
                    sub.downloadSubpackage('esports',function(tempPercent){
                        tempPercent = Math.round(100 * tempPercent);
                        if (tempPercent > percent) {
                            percent = tempPercent;
                        }
                        self.loadingLabel.string = percent + '%';
                    },(err, bundle)=>{
                        if (err) {
                            return console.error(err);
                        }
                        percent = 0;
                        bundle.load("prefabs/EsportView",cc.Prefab,
                            function (completedCount, totalCount, item) {
                                //self.ImgLoadingEsport.progress = completedCount / totalCount;
                                var tempPercent = Math.round(100 * completedCount / totalCount);

                                //dam bao cho % ko bi lui lai (do quy trinh dem asset khi load)
                                if (tempPercent > percent) {
                                    percent = tempPercent;
                                }
                                self.loadingProgressBar.progress = completedCount / totalCount;

                                self.loadingLabel.string = percent + '%';
                            },
                            function (err, prefab) {

                                self.isLoading = false;
                                //Tat loading
                                self.loadingProcess.active = false;
                                //Tao game
                                self.nodeEsport = self.createView(prefab);
                                cc.LobbyController.getInstance().AddMiniGameCount(1);
                                this.setActiveLiveXocDia();

                            }
                        );
                    });
                    break;    
                }
        },
    destroyDynamicView: function (gameId) {
        switch (gameId) {
            case cc.GameId.EVENT_TREASURE:
                if (this.nodeTreasureView) {
                    this.nodeTreasureView.destroy();
                    this.nodeTreasureView = null;
                }

                if (this.nodeTreasureGiftView) {
                    this.nodeTreasureGiftView.destroy();
                    this.nodeTreasureGiftView = null;
                }

                if (this.nodeBuyCarrotView) {
                    this.nodeBuyCarrotView.destroy();
                    this.nodeBuyCarrotView = null;
                }
                break;
            case cc.GameId.TAI_XIU:
                if (this.nodeTaiXiu) {
                    if(cc.LoginController.getInstance().getLoginState()){
                        this.hideTaiXiu();
                    } else {
                        this.nodeTaiXiu.destroy();
                        this.nodeTaiXiu = null;
                    }
                  
                   
                }
                break;
            case cc.GameId.TAI_XIU_MD5:
                if (this.nodeTaiXiuMd5) {
                    this.nodeTaiXiuMd5.destroy();
                    this.nodeTaiXiuMd5 = null;
                }
                break;
            case cc.GameId.LODE:
                if (this.nodeLoDeView) {
                    this.nodeLoDeView.destroy();
                    this.nodeLoDeView = null;
                    cc.LobbyController.getInstance().AddMiniGameCount(-1);

                }
                break;
            case cc.GameId.BAUCUA:
                if (this.nodeBauCuaView) {
                    this.nodeBauCuaView.destroy();
                    this.nodeBauCuaView = null;
                    cc.LobbyController.getInstance().AddMiniGameCount(-1);

                }
                break;
            case cc.GameId.MINI_POKER:
                if (this.nodeMiniPoker) {
                    this.nodeMiniPoker.destroy();
                    this.nodeMiniPoker = null;
                    cc.LobbyController.getInstance().AddMiniGameCount(-1);

                }
                break;
            case cc.GameId.CAO_THAP:
                if (this.nodeCaoThap) {
                    this.nodeCaoThap.destroy();
                    this.nodeCaoThap = null;
                    cc.LobbyController.getInstance().AddMiniGameCount(-1);

                }
                break;
            case cc.GameId.SEVEN77:
                if (this.node777) {
                    this.node777.destroy();
                    this.node777 = null;
                    cc.LobbyController.getInstance().AddMiniGameCount(-1);

                }
                break;
            case cc.GameId.BLOCK_BUSTER:
                if (this.nodeTQ) {
                    this.nodeTQ.destroy();
                    this.nodeTQ = null;
                }
                break;
            case cc.GameId.LUCKY_WILD:
                if (this.nodeLW) {
                    this.nodeLW.destroy();
                    this.nodeLW = null;
                }
                break;
            case cc.GameId.ESPORTS:
                if (this.nodeEsport) {
                    this.nodeEsport.destroy();
                    this.nodeEsport = null;
                    cc.LobbyController.getInstance().AddMiniGameCount(-1);

                }
                break;    
            default:
                this.activeNodeTopBar(false);
                //bat lai cac node o lobby
                this.activeNodeLobby(true);

                //cc.BannerController.getInstance().switchPage();

                //mac dinh se là cac game slots
                if (this.nodeSlotsView) {
                    this.nodeSlotsView.destroy();
                    this.nodeSlotsView = null;
                }
                
                if (this.nodeEventView) {
                    this.nodeEventView.destroy();
                    this.nodeEventView = null;
                }

                if (this.nodeEventViewTopVP) {
                    this.nodeEventViewTopVP.destroy();
                    this.nodeEventViewTopVP = null;
                }
                
                break;
        }
        cc.LobbyController.getInstance().refreshAccountInfo();
        this.setActiveLiveXocDia();
    },
        setActiveLiveXocDia:function()
        {
            if (this.nodeTaiXiu==null) {
                return;
            }
            if (cc.LobbyController.getInstance().GetMiniGameCount()===0)
                {
                    cc.LobbyController.getInstance().setActiveLiveXocDia(true);
                }
                else{
                    cc.LobbyController.getInstance().setActiveLiveXocDia(false);
                }
        },
        destroyAllMiniGameView: function () {
            this.destroyDynamicView(cc.GameId.TAI_XIU);
			this.destroyDynamicView(cc.GameId.TAI_XIU_MD5);
            this.destroyDynamicView(cc.GameId.MINI_POKER);
            this.destroyDynamicView(cc.GameId.CAO_THAP);
            this.destroyDynamicView(cc.GameId.SEVEN77);
            this.destroyDynamicView(cc.GameId.BLOCK_BUSTER);
            this.destroyDynamicView(cc.GameId.LUCKY_WILD);
            this.destroyDynamicView(null);
        },


        createView: function (prefab, posY) {
            var nodeView = cc.instantiate(prefab);
            nodeView.parent = this.node;
            if (posY) {
                nodeView.setPosition(0, posY);
            } else {
                nodeView.setPosition(0, 0);
            }
            return nodeView;
        },

        loginSuccess: function () {
            cc.OneSignalController.getInstance().sendTag('AccountID', cc.LoginController.getInstance().getUserId());
            cc.OneSignalController.getInstance().sendTag('AccountName', cc.LoginController.getInstance().getNickname());

            //cap nhat lai trang thai
            cc.LoginController.getInstance().setLoginState(true);
            //hien UI NickName + avatar
            cc.LobbyController.getInstance().updateUILogin(false);
            //open hub portal
            cc.GameController.getInstance().portalNegotiate();

            cc.LobbyController.getInstance().topBarUpdateInfo();

            //Kiem tra thu chua doc
            cc.LobbyController.getInstance().getMailUnRead();

            //Bat huong dan appSafe sau khi Login + chua tich hopj AppSafe
            var loginResponse = cc.LoginController.getInstance().getLoginResponse();

            if (!cc.DomainController.getInstance().checkErrorDomain()) {
                //bat event sau khi login thanh cong

                // cc.Tool.getInstance().setItem('@startTabEvent', 0);
                // cc.Tool.getInstance().setItem('@startSubTabEvent', 'TOP');
                // cc.LobbyController.getInstance().createEventView();

                // if (loginResponse.PhoneSafeNo === null) {
                //     cc.LobbyController.getInstance().createAppSafeHelpView();
                // }

                //check xem co luot quay VQMM ko? -> show VQMM
                this.checkVQMMInfo(); //ALPHA chua chay

                cc.DDNA.getInstance().clientDevice();
                cc.DDNA.getInstance().gameStarted();

                var getChargeDefaultCommand = new cc.GetChargeDefaultCommand;
                getChargeDefaultCommand.execute(this);
            }

            // //#KingViet
            // if (cc.Config.getInstance().getDomainVK().includes(netConfig.HOST)) {
            //     cc.AccountController.getInstance().setAppSafeSatus(false);
            //     var checkSafeLinkAccountCommand = new cc.CheckSafeLinkAccountCommand;
            //     checkSafeLinkAccountCommand.execute();
            // } else {
            //
            //
            //  
            // }

            // cc.LobbyController.getInstance().createDNSHelpView();

            // var checkHaveGiftcodeCommand = new cc.CheckHaveGiftcodeCommand;
            // checkHaveGiftcodeCommand.execute();

            // show sieu xe
            // if (this.nodeX2Popup == null)
                // cc.LobbyController.getInstance().createX2PopupView(); // comment
            
            if (cc.LoginController.getInstance().checkLogin()) {
                this.joinGame('8');
            }
        },
        showTaiXiu:function()
        {
            if (cc.LoginController.getInstance().checkLogin()) {
                if (this.nodeTaiXiu) {
                    this.nodeTaiXiu.setPosition(0,0);
                    this.nodeTaiXiu.opacity = 255;
                    this.nodeTaiXiu.zIndex = cc.Config.getInstance().getZINDEX();
                    cc.LobbyController.getInstance().AddMiniGameCount(1);
                   // cc.TaiXiuController.getInstance().setSound(true);
                    this.setActiveLiveXocDia();

                }
            }
           
        },
        hideTaiXiu:function()
        {
            if (this.nodeTaiXiu) {
                this.nodeTaiXiu.opacity = 0;
                this.nodeTaiXiu.setPosition(10000,0);
                cc.LobbyController.getInstance().AddMiniGameCount(-1);
               // cc.TaiXiuController.getInstance().setSound(false);
                this.setActiveLiveXocDia();
            }
        },
        //EVENT SAN KHO BAU
        checkHaveDailyBonus: function () {
            var treasureGetCarrotNameKnownCommand = new cc.TreasureGetCarrotNameKnownCommand;
            treasureGetCarrotNameKnownCommand.execute(this);
        },

        onTreasureGetCarrotNameKnownResponse: function (response) {
            if (response !== null)
                cc.TreasureController.getInstance().setIsDailyBonus(response.IsInDay); //= true la nhan roi

            //chua nhan thi moi hien
            if (response !== null && !response.IsInDay) {
                cc.LobbyController.getInstance().createCarrotDailyBonusView();
            }
        },

        joinGame: function (gameId) {
            if (cc.LoginController.getInstance().checkLogin()) {
                if (this.isLoading) return;

                if (gameId === undefined) { // || gameId === cc.GameId.BLOCK_BUSTER
                    //cc.PopupController.getInstance().showMessage('Sắp ra mắt!');
                    cc.PopupController.getInstance().showMessage('Sắp ra mắt!');
                    return;
                }

                //CHECK LOCATION
                //         if (gameId === cc.GameId.TIEN_LEN_MN
                //             // gameId === cc.GameId.POKER_TEXAS ||
                //             // gameId === cc.GameId.BA_CAY ||
                //             // gameId === cc.GameId.TIEN_LEN_MN_SOLO ||
                //             // gameId === cc.GameId.MAU_BINH
                //         ) {
                //
                //             if (cc.LocationController.getInstance().askEnableLocationService()) {
                //                 //tren native phai goi them lay lat long
                //                 if (cc.sys.isNative) {
                //                     if (cc.LocationController.getInstance().getLatitude() && cc.LocationController.getInstance().getLongitude()) {
                //
                //                     } else {
                //                         cc.PopupController.getInstance().showPopupRequireEnableLocation();
                //                         return;
                //                     }
                //                 } else {
                //
                //                 }
                //
                //             } else {
                //
                //                 if (cc.sys.isNative) {
                //                     cc.PopupController.getInstance().showPopupRequireEnableLocation();
                //                 } else {
                //                     var error = cc.LocationController.getInstance().getGeoErrorCode();
                //
                //                     if (error.code === error.PERMISSION_DENIED) {
                //                         // detailError = "User denied the request for Geolocation.";
                //                         cc.PopupController.getInstance().showMessage('Để tiếp tục chơi game bạn cần cấp quyền thu thập thông tin vị trí.');
                //                     } else if (error.code === error.POSITION_UNAVAILABLE) {
                //                         // detailError = "Location information is unavailable.";
                //                         cc.PopupController.getInstance().showMessage('Để tiếp tục chơi game bạn cần cấp quyền thu thập thông tin vị trí.');
                //                     } else if (error.code === error.TIMEOUT) {
                //                         // detailError = "The request to get user location timed out."
                //                         cc.PopupController.getInstance().showMessage('Để tiếp tục chơi game bạn cần cấp quyền thu thập thông tin vị trí.');
                //                     } else if (error.code === error.UNKNOWN_ERROR) {
                //                         // detailError = "An unknown error occurred."
                //                         cc.PopupController.getInstance().showMessage('Để tiếp tục chơi game bạn cần cấp quyền thu thập thông tin vị trí.');
                //                     } else {
                //                         cc.PopupController.getInstance().showPopupRequireEnableLocation();
                //                     }
                //                 }
                //
                //                 return;
                //             }
                //         }
                // } else {
                //     //Bat yeu cau bat cap nhap phien ban moi
                //     cc.PopupController.getInstance().showMessage('Cập nhật phiên bản mới để chơi');
                //     return;
                // }
                // }

                switch (gameId.toString()) {
                    case cc.GameId.SHOOT_FISH:
                        this.createDynamicView(cc.GameId.SHOOT_FISH);
                        break;
                    case cc.GameId.ESPORTS:
                        this.createDynamicView(cc.GameId.ESPORTS);
                        break;
                    //Game slots chinh
                    case cc.GameId.EGYPT:
                        this.createDynamicView(cc.GameId.EGYPT);
                        break;
                    case cc.GameId.TAY_DU_THAN_KHI:
                        this.createDynamicView(cc.GameId.TAY_DU_THAN_KHI);
                        break; 
                    case cc.GameId.THAN_THU:
                        this.createDynamicView(cc.GameId.THAN_THU);
                        break;   
                    case cc.GameId.THREE_KINGDOM:
                        this.createDynamicView(cc.GameId.THREE_KINGDOM);
                        break;
                    case cc.GameId.THUY_CUNG:
                    this.createDynamicView(cc.GameId.THUY_CUNG);
                    break;
                    case cc.GameId.AQUARIUM:
                        this.createDynamicView(cc.GameId.AQUARIUM);
                        break;
                    case cc.GameId.DRAGON_BALL:
                        this.createDynamicView(cc.GameId.DRAGON_BALL);
                        break;
                    case cc.GameId.BUM_BUM:
                        this.createDynamicView(cc.GameId.BUM_BUM);
                        break;
                    case cc.GameId.COWBOY:
                        this.createDynamicView(cc.GameId.COWBOY);
                        break;
                    case cc.GameId.XENG777:
                        this.createDynamicView(cc.GameId.XENG777);
                        break;
                    case cc.GameId.THUONG_HAI:
                        this.createDynamicView(cc.GameId.THUONG_HAI);
                        break;
                    case cc.GameId.GAINHAY:
                        this.createDynamicView(cc.GameId.GAINHAY);
                        break;
                    //Game mini full màn hình
                    case cc.GameId.BACCARAT:
                        this.createDynamicView(cc.GameId.BACCARAT);
                        break;
                    case cc.GameId.MONKEY:
                        this.createDynamicView(cc.GameId.MONKEY);
                        break;
                    case cc.GameId.DRAGON_TIGER:
                        this.createDynamicView(cc.GameId.DRAGON_TIGER);
                        break;
                    case cc.GameId.BAUCUA:
                        this.createDynamicView(cc.GameId.BAUCUA);
                        break;
                    case cc.GameId.SICBO:
                        this.createDynamicView(cc.GameId.SICBO);
                        break;
                    //CARD GAME
                    case cc.GameId.XOC_XOC:
                        this.createDynamicView(cc.GameId.XOC_XOC);
                        break;
                    case cc.GameId.XOC_DIA_LIVE:
                        this.createDynamicView(cc.GameId.XOC_DIA_LIVE);
                        break;
                    case cc.GameId.POKER_TEXAS:
                    case cc.GameId.BA_CAY:
                    case cc.GameId.TIEN_LEN_MN:
                    case cc.GameId.TIEN_LEN_MN_SOLO:
                        if (cc.BalanceController.getInstance().getBalance() < 10000) {
                            cc.PopupController.getInstance().showMessage('Bạn không đủ tiền để vào phòng. Tối thiểu cần 10.000');
                            return;
                        } else {
                            this.createDynamicView(gameId.toString());
                        }
                        break;
                    case cc.GameId.MAU_BINH:
                        if (cc.BalanceController.getInstance().getBalance() < 30000) {
                            cc.PopupController.getInstance().showMessage('Bạn không đủ tiền để vào phòng. Tối thiểu cần 30.000');
                            return;
                        } else {
                            this.createDynamicView(gameId.toString());
                        }
                        break;
                    //MINI game
                    case cc.GameId.TAI_XIU:
                        this.createDynamicView(cc.GameId.TAI_XIU);
                        break;
                    case cc.GameId.TAI_XIU_MD5:
                        this.createDynamicView(cc.GameId.TAI_XIU_MD5);
                        break;
                    case cc.GameId.MINI_POKER:
                        this.createDynamicView(cc.GameId.MINI_POKER);
                        break;
                    case cc.GameId.CAO_THAP:
                        this.createDynamicView(cc.GameId.CAO_THAP);
                        break;
                    case cc.GameId.SEVEN77:
                        this.createDynamicView(cc.GameId.SEVEN77);
                        break;
                    case cc.GameId.BLOCK_BUSTER:
                        this.createDynamicView(cc.GameId.BLOCK_BUSTER);
                        break;
                    case cc.GameId.LUCKY_WILD:
                        this.createDynamicView(cc.GameId.LUCKY_WILD);
                        break;

                    case cc.GameId.LODE:
                        this.createDynamicView(cc.GameId.LODE);
                        break;
                    case cc.GameId.VIETLOT:
                        this.createDynamicView(cc.GameId.VIETLOT);
                        break;
                    case '100':
                        cc.PopupController.getInstance().showMessage('Sắp ra mắt');
                        break;
                    case '101':
                        cc.PopupController.getInstance().showMessage('Sắp ra mắt');
                        break;


                }
            }
        },

        refreshAccountInfo: function () {
            var getAccountInfoCommand = new cc.GetAccountInfoCommand;
            getAccountInfoCommand.execute(this);
        },

        activeNodeLobby: function (enable) {
            if (enable) {
                this.activeNodeTopBar(false);
                this.playAudioBg();
            } else {
                this.audioBg.stop();
            }
            this.nodeEventTop.active = enable;

            this.nodeLobbys.forEach(function (nodeLobby) {
                nodeLobby.active = enable;
            });

            cc.LobbyController.getInstance().setLobbyActive(enable);
        },

        activeNodeTopBar: function (enable) {
            this.nodeTopBar.active = enable;
            this.nodeSetting.active = enable;
            this.nodeTopBar.getComponent(cc.TopBarView).isCardGame = enable;
            if (enable) {
                this.refreshAccountInfo();
            }
            this.nodeTopBar.zIndex = cc.NoteDepth.TOP_BAR;
          
        },

        activeCardGame(isLobby = false){
            if(!this.nodeSlotsView) return;
            if(isLobby){   
                this.nodeSlotsView.zIndex = cc.NoteDepth.POPUP_LOBBY -1;
            } else {
                this.nodeSlotsView.zIndex = cc.NoteDepth.FULL_SCENE_GAME;
            }
        },

        //response
        onGetAccountInfoResponse: function (response) {
            if (response !== null) {
                cc.LoginController.getInstance().setLoginResponse(response.AccountInfo);
                cc.LoginController.getInstance().setNextVPResponse(response.NextVIP);
                cc.LoginController.getInstance().setTopVPResponse(response.TopVP);
            }
            cc.LobbyController.getInstance().topBarUpdateInfo();
        },

        checkVQMMInfo: function () {
            var vqmmGetInfoCommand = new cc.VQMMGetInfoCommand;
            vqmmGetInfoCommand.execute(this);
        },

        onVQMMGetInfoResponse: function (response) {
            //{"Quantity":1,"IsOpen":false,"Response":0}
            if (response !== null && response.Quantity > 0 && response.IsOpen) {
                this.createVQMMView();
            }
        },

        joinGameClicked: function (event, data) {
            if (cc.LoginController.getInstance().checkLogin()) {
                console.log('joingameclicked: '+data);
                this.joinGame(data);
                if (data) {
                    cc.DDNA.getInstance().uiInteraction(cc.DDNAUILocation.PORTAL, cc.DDNA.getInstance().getGameById(data.toString()), cc.DDNAUIType.BUTTON);
                }
            }
        },

        setIsAudioBg: function () {
            this.IsOnAudioBg = !this.IsOnAudioBg;
            cc.Tool.getInstance().setItem('@onAudioBg', this.IsOnAudioBg);
            if (this.IsOnAudioBg) {
                this.audioBg.play();
            }
            else {
                this.audioBg.stop();
            }
            this.sliderOn.active = this.IsOnAudioBg;
            this.sliderOff.active = !this.IsOnAudioBg;
            // this.toggleAudio.isChecked = this.IsOnAudioBg;
        },

        playAudioBg: function () {
            if (this.IsOnAudioBg) {
                this.audioBg.play();
            } else {
                this.audioBg.stop();
            }
            this.sliderOn.active = this.IsOnAudioBg;
            this.sliderOff.active = !this.IsOnAudioBg;
        },

        hideUpdateODPPhonePopup() {
            if(this.nodeUpdateODPPhone) {
                this.nodeUpdateODPPhone.destroy();
            }
        },
        createPopupJackpotView() {
            this.nodeListJackpot = this.createView(this.prefabListJackpot);
        },

        destroyPopupJackpotView() {
            if(this.nodeListJackpot) {
                this.nodeListJackpot.destroy();
            }
        }

    });
}).call(this);