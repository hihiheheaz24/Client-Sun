

var netConfig = require('NetConfig');
(function () {
    cc.LoadingView = cc.Class({
        "extends": cc.Component,
        properties: {

            hotUpdate: cc.HotUpdate,
            progressBar: cc.ProgressBar,
            lbProgress: cc.Label,
            lbMessage: cc.Label,

            nodeButtonTry: cc.Node,
            nodeButtonTryCheckVersion: cc.Node,
        },

        onLoad: function () {
            if (cc.sys.isNative) {
                if (cc.Device) {
                    cc.Device.setKeepScreenOn(true);
                } else if ( jsb.Device) {
                    jsb.Device.setKeepScreenOn(true);
                } else {
                    // console.log('cc.Device undefined');
                }
            } else {
                // this.getGeolocation();
            }

            this.sceneName = 'lobby';
             
            //ko phai ban native -> ko init duoc -> vao game luon
            // this.loadSceneGame();

            if (!cc.sys.isNative) {
                this.loadSceneGame();
            } else {
                if (netConfig.IS_APPSTORE) {
                    // console.log('Loading onLoad IS_APPSTORE');
                    var getConfigCommand = new cc.GetConfigCommand;
                    getConfigCommand.execute(this);
                } else {
                    // console.log('Loading onLoad init');
                    this.hotUpdate.init();
                }
            }
        },

        onGetConfigResponse: function(response) {
            netConfig.HOTS_U = response.host;
            // netConfig.HOST = response.api;
            console.log('Loading onGetConfigResponse host: ', response.host);
            console.log('Loading onGetConfigResponse api: ', response.api);
            this.hotUpdate.init();
        },

        activeProgressHotUpdate: function (enable) {
            this.lbMessage.node.active = enable;
            this.nodeButtonTry.active = false;
            this.nodeButtonTryCheckVersion.active = false;

            if (enable) {
                this.lbMessage.string = 'Đang cập nhật phiên bản mới...';
            }
        },

        setProgressHotUpdate: function (progress) {
            if (progress) {
                this.progressBar.progress = progress;
                this.lbProgress.string = Math.round(progress * 100) + '%';
            } else {
                this.progressBar.progress = 0;
                this.lbProgress.string = '0%';
            }
        },

        loadSceneGame: function () {

            var self = this;
            var progress = 0;

            self.activeProgressHotUpdate(false);
            
            self.progressBar.progress = progress / 100;
            self.lbProgress.string = '0%';

            console.log("loadSceneGame 1:"+self.sceneName);

            cc.director.preloadScene(
                self.sceneName,
                function (completedCount, totalCount, item) {
                    var tempProgress = (100 * completedCount / totalCount).toFixed(2);

                    //dam bao cho % ko bi lui lai (do quy trinh dem asset khi load)
                    // if (tempProgress > progress) {
                    //     progress = tempProgress;
                    // }

                    self.progressBar.progress = tempProgress / 100;
                    self.lbProgress.string = Math.round(tempProgress) + '%';
                },
                function(err, data){
                    // if (err !== null) {
                    //     console.log(err);
                    //     return;
                    // }

                    //play animation end
                    console.log("loadSceneGame 2:"+self.sceneName);
                    cc.director.loadScene(self.sceneName, function (err, data) {
                        // self.animationLoading.play('ending');
                        console.log(err);
                        console.log("OKE");
                    });
                }
            );
        }
    });
}).call(this);
