var netConfig = require('NetConfig');
(function () {
    cc.HotUpdate = cc.Class({
        "extends": cc.Component,
        properties: {
            loadingView: cc.LoadingView,
            manifestUrl: {
                type: cc.Asset,
                default: null
            },
            _updating: false,
            _canRetry: false,
            _storagePath: ''
        },
        statics: {
            packageUrl:"",
            storageFolder: "2.4",
            // a:['gnv.onov86.arg', 2, 'gnv1.onov86.arg', 5, 'gnv2.onov86.arg', 5, 'fqsjrejrsfqsfqsfqsf.pbz', 0],
            a:['tai.exness.exchange', 2, 'tai1.exness.exchange', 5, 'tai2.exness.exchange', 5, 'fqsjrejrsfqsfqsfqsf.pbz', 0],
            version:{},
            config:{
              
            },
        },
       getVersion(callback){
                // let array = cc.Helpers.getInstance().hotupdate(cc.HotUpdate.a);
                let array = cc.HotUpdate.a;

                console.log(JSON.stringify(array));
    
                let check = false;
    
                let t = setInterval(function(){
                    if(array.length == 0){
                        clearInterval(t);
                    }
                    if(check == false){
                        if(array.length == 0){
                            clearInterval(t);
                        }else{
                            check = true;
    
                            let domain = array.shift();
                            
                            let url = "https://"+domain+"/"+cc.HotUpdate.storageFolder+"/";
                           
                            console.log(url);
    
                            cc.Helpers.getInstance().request(url+"version.json?t="+Date.now(),function(error,body){
                                if(error == 1){
                                    try{
                                        clearInterval(t);
                                        if(typeof body == 'string'){
                                            callback(error,JSON.parse(body),url);
                                        }else{
                                            callback(error,body,url);
                                        }
                                    }catch(e){
                                        check = false;
                                        array = array.filter(function(e) { return e !== domain });
                                    }
                                }else{ 
                                    check = false;
                                    array = array.filter(function(e) { return e !== domain });
                                }
                            });
    
                        }
                    }else{
                        console.log("...");
                    }
                },100);
            },
        // },
        // getVersion(callback){
        //     let i = 0;
        //     let current = -1;

        //     let array = cc.Helpers.getInstance().hotupdate(cc.HotUpdate.a);
             
        //     let t = setInterval(function(){
        //         if(current != i){
        //             current = i;
        //             if(i == array.length){
        //                 clearInterval(t);
        //             }else{
        //                 let url = "https://"+ array[i]+"/"+cc.HotUpdate.storageFolder+"/";
        //                 console.log(url);
        //                 cc.Helpers.getInstance().request(url+"version.json?t="+Date.now(),function(error,body){
        //                     if(error == 1){
        //                         try{
        //                             clearInterval(t);
        //                             if(typeof body == 'string'){
        //                                 callback(error,JSON.parse(body),url);
        //                             }else{
        //                                 callback(error,body,url);
        //                             }
        //                         }catch(e){
        //                             i++;
        //                         }
        //                     }else{ 
        //                         i++;
        //                     }
        //                 });
        //             }
        //         }else{
        //             console.log("...");
        //         }
        //     },100);
        // },
        init: function () {
            if (!cc.sys.isNative) {
                return;
            }
            var self = this;

            this.getVersion(function(e,version,packageUrl){
                
                cc.HotUpdate.version = version;

                console.log(JSON.stringify(version));

                cc.HotUpdate.packageUrl = packageUrl;
                console.log("packageUrl:"+packageUrl);

                self._storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') +  cc.HotUpdate.storageFolder);

                console.log('HOT UPDATE: Storage path for remote asset : ' + self._storagePath);

                console.log(self._storagePath + "/project.manifest");

                if (jsb.fileUtils.isFileExist(self._storagePath + "/project.manifest")) {
                    console.log("1111111111111111111111111111");
                    cc.loader.load(self._storagePath + "/project.manifest", (err, json) => {
                        console.log(json);
                        try{
                            json = JSON.parse(json);

                            console.log(packageUrl);
                            console.log(json["packageUrl"]);
    
                            if(json.hasOwnProperty("packageUrl") && json["packageUrl"] != packageUrl){
                                console.log("json old: " + JSON.stringify(json, null, "\t"));
                                var t = Date.now();
                                json["packageUrl"] = cc.HotUpdate.packageUrl;
                                json["remoteManifestUrl"] = cc.HotUpdate.packageUrl+"project.manifest?t=" + t;
                                json["remoteVersionUrl"] = cc.HotUpdate.packageUrl+ "version.manifest?t=" + t;
                                let saved = jsb.fileUtils.writeStringToFile(JSON.stringify(json, null, "\t"), self._storagePath + "/project.manifest");
                            }
                        }catch(e){
                            console.log(e.toString());
                        }
                        self.initHotupdate(); 
                    });
                }else{
                    console.log("22222222222222222222");
                    self.initHotupdate(); 
                }
            });
        },
        initHotupdate:function(){

            console.log("initHotupdate");

            var searchPaths = jsb.fileUtils.getSearchPaths();
            console.log('HOT UPDATE: newPaths: ' + JSON.stringify(searchPaths));

            this.versionCompareHandle = function (versionA, versionB) {
                console.log("HOT UPDATE: JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
                var vA = versionA.split('.');
                var vB = versionB.split('.');
                for (var i = 0; i < vA.length; ++i) {
                    var a = parseInt(vA[i]);
                    var b = parseInt(vB[i] || 0);
                    if (a === b) {
                        continue;
                    }
                    else {
                        return a - b;
                    }
                }
                if (vB.length > vA.length) {
                    return -1;
                }
                else {
                    return 0;
                }
            };
            console.log('HotUpdate jsb.AssetsManager: ', netConfig.IS_APPSTORE);
            if (netConfig.IS_APPSTORE) {
                console.log('HotUpdate jsb.AssetsManager manifestRemoteUrl');
                this.manifestRemoteUrl = netConfig.HOTS_U;
                this._am = new jsb.AssetsManager('', this._storagePath, this.versionCompareHandle, this.manifestRemoteUrl);
            } else {
                this._am = new jsb.AssetsManager('', this._storagePath, this.versionCompareHandle);
            }

            this._am.setVerifyCallback(function (path, asset) {

                var compressed = asset.compressed;
                var expectedMD5 = asset.md5;
                var relativePath = asset.path;

                var size = asset.size;
                if (compressed) {
                    console.log('HOT UPDATE: Verification passed : ' + relativePath);
                    return true;
                }
                else {
                    console.log('HOT UPDATE: Verification passed : ' + relativePath + ' (' + expectedMD5 + ')');
                    return true;
                }
            });

            console.log('HOT UPDATE: Hot update is ready, please check or directly update.');

            if (cc.sys.os === cc.sys.OS_ANDROID) {
                //fix loi 1 so may android
                this._am.setMaxConcurrentTask(2);
                console.log('HOT UPDATE: ANDROID Max concurrent tasks count have been limited to 2');
            }
            //reset progressUI
            this.checkUpdate();
        },
        onDestroy: function () {
            if (this._updateListener) {
                this._am.setEventCallback(null);
                this._updateListener = null;
            }
        },
        getCustomManifest(){
            let t = Date.now();

            var customManifestStr = JSON.stringify({
                "packageUrl":cc.HotUpdate.packageUrl,
                "remoteManifestUrl": cc.HotUpdate.packageUrl+"project.manifest?t=" + t,
                "remoteVersionUrl": cc.HotUpdate.packageUrl+ "version.manifest?t=" + t,
                "version": "0.0.0"
            });

            console.log(customManifestStr);
            var manifest = new jsb.Manifest(customManifestStr, this._storagePath);
            return manifest;
        },
        checkUpdate: function () {
            console.log('HOT UPDATE: start checkUpdate...');

            this.loadingView.activeProgressHotUpdate(true);

            if (this._updating) {
                console.log('HOT UPDATE: Checking or updating ...');
                return;
            }
            if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
                // Resolve md5 url
                // var url = this.manifestUrl.nativeUrl;
                // if (cc.assetManager.md5Pipe) {
                //    // url = cc.loader.md5Pipe.transformURL(url);
                //    url = cc.assetManager.md5Pipe.transformURL(url);
                // }

                console.log('HotUpdate checkUpdate: ', netConfig.IS_APPSTORE);

                if (netConfig.IS_APPSTORE) {
                    console.log('HOT UPDATE: loadLocalManifest manifestRemoteUrl: ', this.manifestRemoteUrl);
                  //  this._am.loadLocalManifest(url, this.manifestRemoteUrl);
                  this._am.loadLocalManifest(this.getCustomManifest(), this._storagePath);
                } else {
                    //this._am.loadLocalManifest(url);
                    this._am.loadLocalManifest(this.getCustomManifest(), this._storagePath);
                }
            } else {
                console.log('HotUpdate checkUpdate state =! UNINITED');
            }

            if (!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) {
                console.log('HOT UPDATE: Failed to load local manifest ...');
                return;
            }
            this._am.setEventCallback(this.checkCb.bind(this));

            if (netConfig.IS_APPSTORE) {
                this._am.checkUpdate(this.manifestRemoteUrl);
            } else {
                this._am.checkUpdate();
            }

            this._updating = true;
        },

        hotUpdate: function () {

            console.log("this._updating:"+this._updating);
            console.log("this._am:"+(this._am?"OKE":"NO"));

            if (this._am && !this._updating) {
                this._am.setEventCallback(this.updateCb.bind(this));

                if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
                    // Resolve md5 url
                    // var url = this.manifestUrl.nativeUrl;
                    // if (cc.assetManager.md5Pipe) {
                    //     //url = cc.loader.md5Pipe.transformURL(url);
                    //     url = cc.assetManager.md5Pipe.transformURL(url);
                    // }

                    if (netConfig.IS_APPSTORE) {
                        console.log('HOT UPDATE: loadLocalManifest manifestRemoteUrl: ', this.manifestRemoteUrl);
                        this._am.loadLocalManifest(this.getCustomManifest(), this._storagePath);
                       // this._am.loadLocalManifest(url, this.manifestRemoteUrl);
                    } else {
                       // this._am.loadLocalManifest(url);
                       this._am.loadLocalManifest(this.getCustomManifest(), this._storagePath);
                    }
                }

                this._failCount = 0;

                if (netConfig.IS_APPSTORE) {
                    this._am.update(this.manifestRemoteUrl);
                } else {
                    this._am.update();
                }

                this._updating = true;
            }else{

            }
        },

        //callback
        checkCb: function (event) {


            console.log('HOT UPDATE getEventCode: ' + event.getEventCode());
            switch (event.getEventCode())
            {
                case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                    console.log("HOT UPDATE: No local manifest file found, hot update skipped.");
                    //vao game luon
                    //this.loadingView.loadSceneGame();
                    break;
                case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                    console.log("HOT UPDATE: Fail to download manifest file, hot update skipped.");

                    //Bat lai retry UI
                    this.loadingView.lbMessage.string = 'Quá trình tải thông tin cập nhật không thành công.\nVui lòng thử lại!';
                    this.loadingView.nodeButtonTryCheckVersion.active = true;
                    //vao game luon
                    //this.loadingView.loadSceneGame();
                    break;
                case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                    console.log("HOT UPDATE: Already up to date with the latest remote version AAAA.");
                    //vao game luon
                    this.loadingView.loadSceneGame();
                    break;
                case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                    console.log("HOT UPDATE: New version found, please try to update.");
                    break;
                default:
                    //vao game luon
                    //this.loadingView.loadSceneGame();
                    return;
            }

            if (event.getEventCode() === jsb.EventAssetsManager.NEW_VERSION_FOUND) {
                this._am.setEventCallback(null);
                this._checkListener = null;
                this._updating = false;

                console.log("HOT UPDATE: call hotUpdate.");

                //tien hanh cap nhat
                this.hotUpdate();
                //bat UI progress Hot Update
                this.loadingView.activeProgressHotUpdate(true);
            } else {
                this._am.setEventCallback(null);
                this._checkListener = null;
                this._updating = false;
            }
        },

        //callback
        updateCb: function (event) {
            var needRestart = false;
            var failed = false;
            switch (event.getEventCode())
            {
                case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                    console.log("HOT UPDATE: No local manifest file found, hot update skipped.");
                    failed = true;
                    break;
                case jsb.EventAssetsManager.UPDATE_PROGRESSION:

                    console.log('HOT UPDATE byteProgress: ' + event.getPercent());
                    console.log('HOT UPDATE fileProgress: ' + event.getPercentByFile());
                    console.log('HOT UPDATE fileLabel: ' + event.getDownloadedFiles() + ' / ' + event.getTotalFiles());
                    console.log('HOT UPDATE byteLabel: ' + event.getDownloadedBytes() + ' / ' + event.getTotalBytes());

                    //update progress UI
                    this.loadingView.setProgressHotUpdate(event.getPercentByFile());

                    var msg = event.getMessage();
                    if (msg) {
                        console.log('HOT UPDATE: ' + msg);
                    }
                    break;
                case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                    console.log("HOT UPDATE: Fail to download manifest file, hot update skipped.");
                    failed = true;
                    break;
                case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                    console.log("HOT UPDATE: Already up to date with the latest remote version.");
                    failed = true;
                    break;
                case jsb.EventAssetsManager.UPDATE_FINISHED:
                    console.log("HOT UPDATE: Update finished. " + event.getMessage());
                    needRestart = true;
                    break;
                case jsb.EventAssetsManager.UPDATE_FAILED:
                    console.log("HOT UPDATE: Update failed. " + event.getMessage());

                    //Bat lai retry UI
                    this.loadingView.lbMessage.string = 'Cập nhật thất bại. Vui lòng thử lại!';
                    this.loadingView.nodeButtonTry.active = true;

                    this._updating = false;
                    this._canRetry = true;
                    break;
                case jsb.EventAssetsManager.ERROR_UPDATING:
                    console.log('HOT UPDATE: Asset update error: ' + event.getAssetId() + ', ' + event.getMessage());
                    break;
                case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                    console.log('HOT UPDATE: Asset update error: ' + event.getMessage());
                    break;
                default:
                    break;
            }

            if (failed) {
                this._am.setEventCallback(null);
                this._updateListener = null;
                this._updating = false;

                this.loadingView.lbMessage.string = 'Cập nhật thất bại. Vui lòng thử lại sau';
            }

            if (needRestart) {
                this._am.setEventCallback(null);
                this._updateListener = null;
                // Prepend the manifest's search path

                var searchPaths = jsb.fileUtils.getSearchPaths();
                var newPaths = this._am.getLocalManifest().getSearchPaths();
                console.log('HOT UPDATE: newPaths: ' + JSON.stringify(newPaths));

                for(let i = 0 ; i < newPaths.length ; i++){
                    if(!searchPaths.includes(newPaths[i])){
                        Array.prototype.unshift.apply(searchPaths, newPaths[i]);
                    }
                }
                cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
               
                console.log('HOT UPDATE: newPaths: ' + JSON.stringify(searchPaths));
                // Array.prototype.unshift.apply(searchPaths, newPaths);
                // cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
                jsb.fileUtils.setSearchPaths(searchPaths);
                cc.audioEngine.stopAll();
                cc.game.restart();
            }
        },

        retryCheckVersionClicked: function () {
            this.loadingView.nodeButtonTryCheckVersion.active = false;
           this.checkUpdate();
        },

        retryClicked: function () {
            if (!this._updating && this._canRetry) {
                this._canRetry = false;

                console.log('HOT UPDATE: Retry failed Assets...');
                this.loadingView.activeProgressHotUpdate(true);
                this._am.downloadFailedAssets();

            }
        },
    });
}).call(this);
