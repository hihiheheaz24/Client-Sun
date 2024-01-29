/**
 * Created by Nofear on 6/7/2017.
 */
const Emitter = require('TayDuEventEmitter');
var netConfig = require('NetConfig');
const Config = require('TayDuConfig');
(function () {
    cc.TayDuThanKhiView = cc.Class({
        "extends": cc.Component,
        properties: {
            holoSkeleton:sp.Skeleton,
            boardCurrentWin:sp.Skeleton,
            currentWinLabel:cc.Label,
            profileWinLabel:cc.LabelIncrement,
            profileBalanceLabel:cc.LabelIncrement,
            jackpotView:cc.Node,
            freeGameView:cc.Node,            
            spinView:cc.Node,
            allBtn:cc.Node,
            wukongSpineBonusGame:sp.Skeleton,
            introBg:cc.Animation,
            transitionEffect:sp.Skeleton,
            lbJackpot:[cc.LabelIncrement]
        },

        onLoad: function () {
            cc.TayDuThanKhiController.getInstance().setSpinView(this);
            cc.TayDuThanKhiController.getInstance().setIsBonusing(false);
            Emitter.instance = new Emitter();
            Config.instance = new Config();
            this.hubName = '';
            //Lay gameId (set khi click vao big game)
            this.gameId = '72';
            this.hubName = cc.HubName.TayDuThanKhiHub;
            var tayDuThanKhiNegotiateCommand = new cc.TayDuThanKhiNegotiateCommand;
            tayDuThanKhiNegotiateCommand.execute(this);
            this.lastTimeReconnect = (new Date()).getTime();
            this.boardCurrentWin.node.active = false;
            this.freeGameView.active = false;
            //tam dung update jackpot ngoai lobby -> bat lai khi tat big game
            cc.LobbyJackpotController.getInstance().pauseUpdateJackpot(true);
            this.updateBalance();
            this.holoSkeleton.clearTracks();
            this.holoSkeleton.setToSetupPose();
            this.holoSkeleton.setAnimation(0,'Appear',false);
            this.holoSkeleton.addAnimation(0,'Face_Spin',false);
            this.holoSkeleton.addAnimation(0,'Idle',true);
            this.tempData ={
                "C": "d-6DE01207-B,14D|T,2E|U,2|E,14D",
                "M": [
                    {
                        "H": "TayDuThanKhiHub",
                        "M": "resultSpin",
                        "A": [
                            {
                                "SymbolID": [
                                    5,
                                    1,
                                    1,
                                    7,
                                    8,
                                    10,
                                    9,
                                    8,
                                    5,
                                    6,
                                    8,
                                    5,
                                    11,
                                    1,
                                    11,
                                    9,
                                    9,
                                    11,
                                    11,
                                    7,
                                    10,
                                    8,
                                    9,
                                    7,
                                    9,
                                    11,
                                    6,
                                    9,
                                    7,
                                    6
                                ],
                                "WinCombination": [
                                    {
                                        "Position": [
                                            1,
                                            2,
                                            3,
                                            9,
                                            12,
                                            14,
                                            5,
                                            8,
                                            11,
                                            22,
                                            7,
                                            16,
                                            17,
                                            23,
                                            25,
                                            28,
                                            6,
                                            21,
                                            13,
                                            15,
                                            18,
                                            19,
                                            26
                                        ],
                                        "WinAmount": 23400
                                    },
                                    {
                                        "Position": [
                                            1,
                                            2,
                                            3,
                                            9,
                                            12,
                                            14
                                        ],
                                        "WinAmount": 7200
                                    },
                                    {
                                        "Position": [
                                            2,
                                            3,
                                            5,
                                            8,
                                            11,
                                            14,
                                            22
                                        ],
                                        "WinAmount": 4400
                                    },
                                    {
                                        "Position": [
                                            2,
                                            3,
                                            7,
                                            14,
                                            16,
                                            17,
                                            23,
                                            25,
                                            28
                                        ],
                                        "WinAmount": 9000
                                    },
                                    {
                                        "Position": [
                                            2,
                                            3,
                                            6,
                                            14,
                                            21
                                        ],
                                        "WinAmount": 400
                                    },
                                    {
                                        "Position": [
                                            2,
                                            3,
                                            13,
                                            14,
                                            15,
                                            18,
                                            19,
                                            26
                                        ],
                                        "WinAmount": 2400
                                    }
                                ],
                                "TotalWin": 23400,
                                "BonusData": {
                                    "Step": [
                                        {
                                            "SymbolID": [
                                                12,
                                                15,
                                                3,
                                                11,
                                                8,
                                                8,
                                                14,
                                                3,
                                                11,
                                                14,
                                                13,
                                                15,
                                                11,
                                                11,
                                                15,
                                                11,
                                                14,
                                                14,
                                                10,
                                                8,
                                                8,
                                                8,
                                                8,
                                                11,
                                                8,
                                                7,
                                                9,
                                                13,
                                                8,
                                                12
                                            ],
                                            "WinCombination": [],
                                            "MultiplierState": {
                                                "MultiplierSymbolID": [],
                                                "CurrentMultiplier": 1
                                            }
                                        },
                                        {
                                            "SymbolID": [
                                                8,
                                                15,
                                                3,
                                                11,
                                                15,
                                                10,
                                                8,
                                                3,
                                                10,
                                                10,
                                                11,
                                                12,
                                                11,
                                                8,
                                                11,
                                                8,
                                                11,
                                                12,
                                                13,
                                                12,
                                                8,
                                                8,
                                                10,
                                                11,
                                                13,
                                                8,
                                                14,
                                                11,
                                                14,
                                                14
                                            ],
                                            "WinCombination": [
                                                {
                                                    "Position": [
                                                        1,
                                                        3,
                                                        7,
                                                        8,
                                                        14
                                                    ],
                                                    "WinAmount": 1000
                                                }
                                            ],
                                            "MultiplierState": {
                                                "MultiplierSymbolID": [],
                                                "CurrentMultiplier": 1
                                            }
                                        },
                                        {
                                            "SymbolID": [
                                                10,
                                                8,
                                                3,
                                                13,
                                                12,
                                                10,
                                                8,
                                                3,
                                                8,
                                                12,
                                                9,
                                                9,
                                                15,
                                                3,
                                                12,
                                                9,
                                                7,
                                                8,
                                                10,
                                                7,
                                                11,
                                                8,
                                                9,
                                                11,
                                                13,
                                                7,
                                                8,
                                                9,
                                                13,
                                                9
                                            ],
                                            "WinCombination": [
                                                {
                                                    "Position": [
                                                        3,
                                                        8,
                                                        11,
                                                        12,
                                                        14
                                                    ],
                                                    "WinAmount": 600
                                                }
                                            ],
                                            "MultiplierState": {
                                                "MultiplierSymbolID": [],
                                                "CurrentMultiplier": 1
                                            }
                                        },
                                        {
                                            "SymbolID": [
                                                9,
                                                15,
                                                3,
                                                9,
                                                15,
                                                11,
                                                13,
                                                3,
                                                10,
                                                8,
                                                8,
                                                10,
                                                12,
                                                3,
                                                12,
                                                10,
                                                12,
                                                12,
                                                7,
                                                7,
                                                8,
                                                12,
                                                13,
                                                12,
                                                7,
                                                11,
                                                7,
                                                11,
                                                13,
                                                14
                                            ],
                                            "WinCombination": [],
                                            "MultiplierState": {
                                                "MultiplierSymbolID": [],
                                                "CurrentMultiplier": 1
                                            }
                                        },
                                        {
                                            "SymbolID": [
                                                13,
                                                9,
                                                3,
                                                15,
                                                15,
                                                10,
                                                13,
                                                3,
                                                8,
                                                12,
                                                13,
                                                8,
                                                12,
                                                3,
                                                9,
                                                8,
                                                7,
                                                13,
                                                13,
                                                14,
                                                7,
                                                12,
                                                7,
                                                8,
                                                9,
                                                11,
                                                12,
                                                7,
                                                11,
                                                11
                                            ],
                                            "WinCombination": [
                                                {
                                                    "Position": [
                                                        1,
                                                        3,
                                                        7,
                                                        8,
                                                        11,
                                                        14
                                                    ],
                                                    "WinAmount": 7200
                                                }
                                            ],
                                            "MultiplierState": {
                                                "MultiplierSymbolID": [],
                                                "CurrentMultiplier": 1
                                            }
                                        },
                                        {
                                            "SymbolID": [
                                                13,
                                                10,
                                                3,
                                                13,
                                                15,
                                                12,
                                                10,
                                                3,
                                                10,
                                                14,
                                                9,
                                                13,
                                                10,
                                                3,
                                                13,
                                                7,
                                                12,
                                                11,
                                                10,
                                                11,
                                                12,
                                                9,
                                                11,
                                                9,
                                                11,
                                                8,
                                                11,
                                                13,
                                                14,
                                                14
                                            ],
                                            "WinCombination": [
                                                {
                                                    "Position": [
                                                        1,
                                                        3,
                                                        4,
                                                        8,
                                                        12,
                                                        14,
                                                        15
                                                    ],
                                                    "WinAmount": 9600
                                                },
                                                {
                                                    "Position": [
                                                        1,
                                                        3,
                                                        4,
                                                        8,
                                                        12,
                                                        14,
                                                        15
                                                    ],
                                                    "WinAmount": 9600
                                                }
                                            ],
                                            "MultiplierState": {
                                                "MultiplierSymbolID": [
                                                    13
                                                ],
                                                "CurrentMultiplier": 2
                                            }
                                        },
                                        {
                                            "SymbolID": [
                                                10,
                                                9,
                                                3,
                                                3,
                                                12,
                                                8,
                                                8,
                                                3,
                                                9,
                                                12,
                                                8,
                                                15,
                                                15,
                                                3,
                                                10,
                                                9,
                                                14,
                                                12,
                                                13,
                                                14,
                                                11,
                                                9,
                                                13,
                                                14,
                                                10,
                                                14,
                                                12,
                                                11,
                                                9,
                                                11
                                            ],
                                            "WinCombination": [
                                                {
                                                    "Position": [
                                                        3,
                                                        4,
                                                        6,
                                                        7,
                                                        8,
                                                        11,
                                                        14
                                                    ],
                                                    "WinAmount": 4000
                                                }
                                            ],
                                            "MultiplierState": {
                                                "MultiplierSymbolID": [],
                                                "CurrentMultiplier": 2
                                            }
                                        },
                                        {
                                            "SymbolID": [
                                                15,
                                                14,
                                                3,
                                                3,
                                                11,
                                                14,
                                                12,
                                                3,
                                                3,
                                                11,
                                                8,
                                                11,
                                                11,
                                                3,
                                                13,
                                                14,
                                                9,
                                                8,
                                                9,
                                                8,
                                                11,
                                                14,
                                                10,
                                                9,
                                                13,
                                                12,
                                                7,
                                                7,
                                                11,
                                                10
                                            ],
                                            "WinCombination": [
                                                {
                                                    "Position": [
                                                        2,
                                                        3,
                                                        4,
                                                        6,
                                                        8,
                                                        9,
                                                        14
                                                    ],
                                                    "WinAmount": 7200
                                                }
                                            ],
                                            "MultiplierState": {
                                                "MultiplierSymbolID": [],
                                                "CurrentMultiplier": 2
                                            }
                                        }
                                    ],
                                    "TotalWin": 29600,
                                    "Multiplier": 2
                                },
                                "JackpotData": null,
                                "RoomID": 1,
                                "BetValue": 2000,
                                "IsPlayTry": false,
                                "GameStatus": 1,
                                "Account": {
                                    "AccountID": 200096927,
                                    "UserName": "driver",
                                    "TotalStar": 0
                                },
                                "AccountID": 200096927,
                                "PlayerStatus": 1,
                                "ConnectionStatus": 1
                            }
                        ]
                    }
                ]
            };
        },

        onEnable: function () {

        },

        onDestroy: function () {
            cc.LobbyJackpotController.getInstance().pauseUpdateJackpot(false);

            if (this.slotsHub)
                this.slotsHub.disconnect();
            this.unscheduleAllCallbacks();
            if (cc.sys.isNative) {
               
                        var bundle = cc.assetManager.getBundle('tayduthankhi');
                        if(bundle) bundle.releaseAll();
                }
            
            cc.PopupController.getInstance().hideBusy();
        },

        
        activeRoom: function () {
            this.nodeMain.active = false;
            this.nodeRoom.active = true;
        },

        activeMain: function () {
            this.nodeMain.active = true;
            this.nodeRoom.active = false;
        },
        showMiniGameJackpot:function()
        {
            this.jackpotView.active = true;
        },
        updateLabelJackpot:function(data)
        {
            this.lbJackpot[0].tweenValueto(data.MinorJackpot);
            this.lbJackpot[1].tweenValueto(data.MajorJackpot);
            this.lbJackpot[2].tweenValueto(data.GrandJackpot);
        },
        transitionScene:function(isOpen)
        {
            this.transitionEffect.node.active = true;
            this.transitionEffect.setCompleteListener(() => { });
            if (isOpen) {
                this.transitionEffect.setAnimation(0,'open',false);    
                this.transitionEffect.setCompleteListener(() => { 
                    this.transitionEffect.setCompleteListener(() => { });
                    this.transitionEffect.node.active = false;
                });            
            }
            else
            {
              
                this.transitionEffect.setAnimation(0,'close',false);  
                this.transitionEffect.addAnimation(0,'idle',false);                              
            }
        },
        openFreeGameView:function()
        {
            cc.TayDuThanKhiController.getInstance().playEffect(cc.AudioTayDuClipIndex.SOUND_FREE_GAME_WUKONG_IN,false,1);
            cc.director.getScheduler().schedule(function () {
               
            this.wukongSpineBonusGame.node.parent.active = true;
            this.wukongSpineBonusGame.clearTracks();
            this.wukongSpineBonusGame.setToSetupPose();
            this.wukongSpineBonusGame.setCompleteListener(()=>{
                this.allBtn.active = false;
                this.freeGameView.active = true;
                this.spinView.active = false;
                this.wukongSpineBonusGame.node.parent.active = false;
            });
            this.wukongSpineBonusGame.setAnimation(0,'Appear_Wukong',false)
            }.bind(this), this, 0, 0, 0.5, false);
        },
        closeFreeGameView:function()
        {
            this.allBtn.active = true;
            this.freeGameView.active = false;
            this.spinView.active = true;
        },
        updateBalance:function()
        {
            var getBalanceCommand = new cc.GetBalanceCommand;
            getBalanceCommand.execute(this);
        },
        onGetBalanceResponse: function (response) {
            if (this.profileBalanceLabel){
                this.profileBalanceLabel.tweenValueto(response.balance);
                this.currentBalance = response.balance;
            }
        },
        showCurrentWinAmount:function()
        {
            let winType = cc.TayDuThanKhiController.getInstance().getCurrentWinType();
            let winAmount = cc.TayDuThanKhiController.getInstance().currentTotalWin;
            this.profileWinLabel.tweenValueto(winAmount);
            this.currentWinLabel.node.active = false;
            this.currentWinLabel.string = "+"+cc.Tool.getInstance().formatNumber(winAmount);
            this.updateBalance();
            this.boardCurrentWin.node.active = true;
            this.boardCurrentWin.clearTracks();
            this.boardCurrentWin.setToSetupPose();
            this.boardCurrentWin.setStartListener(()=>{
                if (this.boardCurrentWin.animation=='Appear_Board') {
                    this.currentWinLabel.node.active = true;
                    this.currentWinLabel.node.getComponent(cc.Animation).play('totalWinLabel');
                }
                if (this.boardCurrentWin.animation=='Appear_Green') {
                    this.currentWinLabel.node.active = true;
                    this.currentWinLabel.node.getComponent(cc.Animation).play('totalWinLabel');
                }
                if (this.boardCurrentWin.animation=='Appear_Red') {
                    this.currentWinLabel.node.active = true;
                    this.currentWinLabel.node.getComponent(cc.Animation).play('totalWinLabel');
                }
            })
            switch (winType) {
                case 0:
                    this.boardCurrentWin.addAnimation(0,'Appear_Board',false);
                    this.boardCurrentWin.addAnimation(0,'Static_Board',false,0);
                    break;
                case 1:
                    this.boardCurrentWin.addAnimation(0,'Appear_Green',false);
                    this.boardCurrentWin.addAnimation(0,'Static_Green',false,0);
                    break;
                case 2:
                    this.boardCurrentWin.addAnimation(0,'Appear_Red',false);
                    this.boardCurrentWin.addAnimation(0,'Static_Red',false,0);
                    break;
            }
            
        },
        sendRequestOnHub: function (method, data1, data2) {
            if (this.slotsHub === undefined || this.slotsHub === null) return;
            switch (method) {
                case cc.MethodHubName.PLAY_TRY:
                    cc.PopupController.getInstance().showBusy();
                    this.slotsHub.playTry();
                    break;
                case cc.MethodHubName.PLAY_NOW:
                    cc.PopupController.getInstance().showBusy();
                    this.slotsHub.playNow(data1);
                    break;
                case cc.MethodHubName.SPIN_TRY:
                    this.slotsHub.spinTry();
                    break;
                case cc.MethodHubName.SPIN:
                    this.slotsHub.spin(data1,data2);
                    break;
                case cc.MethodHubName.PLAY_BONUS:
                    this.slotsHub.playBonus(data1, data2);
                    break;
                case cc.MethodHubName.PLAY_X2_GAME:
                    this.slotsHub.playX2Game();
                    break;
                case cc.MethodHubName.FINISH_X2_GAME:
                    this.slotsHub.finishX2Game();
                    break;
                case cc.MethodHubName.FREE_SPIN:
                    this.slotsHub.freeSpin();
                    break;
                case cc.MethodHubName.UPDATE_JACKPOT:
                    var data = {
                        M: cc.MethodHubName.UPDATE_JACKPOT,
                    };
                    this.slotsHub.send(data);
                    break;
            }
        },

        reconnect: function () {
            this.lastTimeReconnect = (new Date()).getTime();
            this.slotsHub.connect(this, this.hubName, this.connectionToken, true);
        },

        onSlotsNegotiateResponse: function (response) {
            this.connectionToken = response.ConnectionToken;
            this.slotsHub = new cc.Hub;
            this.slotsHub.connect(this, this.hubName, response.ConnectionToken);
        },
        
        onHubMessage: function (response) {
            if (response.M !== undefined && response.M.length > 0) {
                var m = (response.M)[0];
                switch (m.M) {
                    //vao Phong
                    case cc.MethodHubOnName.JOIN_GAME:
                        break;
                    case cc.MethodHubOnName.RESULT_SPIN:
                        // response = this.tempData;
                        // m = (this.tempData.M)[0];
                        // console.log(response);
                        this.currentBalance -= cc.TayDuThanKhiController.getInstance().getBetAmount();
                        this.profileBalanceLabel.tweenValueto(this.currentBalance);
                        cc.TayDuThanKhiController.getInstance().spinNormal(m.A[0].SymbolID);
                        cc.TayDuThanKhiController.getInstance().setCurrentWinCombo(m.A[0].WinCombination,m.A[0].TotalWin);
                        cc.TayDuThanKhiController.getInstance().setCurrentJackPotWinData(m.A[0].JackpotData);
                        cc.TayDuThanKhiController.getInstance().setCurrentBonusData(m.A[0].BonusData);
                        break;
                    case cc.MethodHubOnName.RESULT_FREE_SPIN:
                        
                    case cc.MethodHubOnName.UPDATE_USER_BALANCE:
                        break;
                    case cc.MethodHubOnName.RESULT_X2_GAME:
                       break;
                    case cc.MethodHubOnName.UPDATE_JACKPOT:
                        // console.log("jackpot:");
                        // console.log(m);
                        break;
                    case cc.MethodHubOnName.JACKPOT_FUND_DETAIL:
                        cc.TayDuThanKhiController.getInstance().setJackpotFundDetail(m.A[0]);
                        break;
                    case cc.MethodHubOnName.MESSAGE:

                        break;

                    case cc.MethodHubOnName.OTHER_DEVICE:
                        // m.A[0] = ma loi , m.A[1] = message
                        //vao phong choi tren thiet bi khac
                        // cc.PopupController.getInstance().showPopupOtherDevice( m.A[1], this.gameId);
                        // break;
                    default:
                        //Error
                        if (response.E !== undefined) {
                            /*
                            {
                              "I": "2",
                              "E": "'Spin' method could not be resolved. Potential candidates are: \nSpin(lines:String, deviceId:Int32):Int32"
                            }
                            * */
                        }
                        break;
                }
            } else {
                //PING PONG
                if (response.I) {
                    this.slotsHub.pingPongResponse(response.I);
                }
            }
        },

        onHubOpen: function () {
            this.slotsHub.enterLobby();
            cc.TayDuThanKhiController.getInstance().setActiveAllButton(true);
            this.introBg.play('bgLoadingIntro');
            this.sendRequestOnHub(cc.MethodHubName.UPDATE_JACKPOT);
            cc.director.getScheduler().schedule(function () {
                this.transitionScene(true);
                cc.TayDuThanKhiController.getInstance().playEffect(cc.AudioTayDuClipIndex.SOUND_DOOR_OUT,false,1);
            }.bind(this), this, 0, 0, 0.5, false);
            // this.sendRequestOnHub(cc.MethodHubName.PLAY_NOW,cc.TayDuThanKhiController.getInstance().getRoomID());
        },

        onHubClose: function () {
            //reconnect
            if ((new Date()).getTime() - this.lastTimeReconnect >= netConfig.RECONNECT_TIME * 1000) {
                this.reconnect();
            } else {
                cc.director.getScheduler().schedule(this.reconnect, this, netConfig.RECONNECT_TIME, 0, 0, false);
            }
        },

        onHubError: function () {
            // cc.SpinController.getInstance().activeButtonSpin(true);
        },

        backClicked: function () {
            // console.log('');
            cc.LobbyController.getInstance().destroyDynamicView(null);
        }
    });
}).call(this);
