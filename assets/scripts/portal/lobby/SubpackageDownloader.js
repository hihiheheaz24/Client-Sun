(function () {
    var SubpackageDownloader;

    SubpackageDownloader = (function () {
        var instance;
        function SubpackageDownloader() {
            this.isDownloading = false;
            this._storagePath = "";
            this._am = null;
            this.failCount = 0;
            this.isUpdate = true;
        }
        instance = void 0;

        SubpackageDownloader.prototype.downloadSubpackage = function (name, progress, callbacks) {
            if (this.isDownloading) return;
            this.isUpdate = true;

             if (CC_JSB && !CC_DEBUG) {
                this._storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') +  cc.HotUpdate.storageFolder+'/assets/' + name;

                var versionNew = cc.HotUpdate.version.hasOwnProperty(name) && cc.HotUpdate.version[name].version?cc.HotUpdate.version[name]["version"]:"0.0.0";

                console.log('1111 2222 Storage path for remote asset : ' + this._storagePath + " name:"+name+"="+versionNew);

                if (jsb.fileUtils.isFileExist(this._storagePath + "/project.manifest")) {

                    cc.loader.load(this._storagePath + "/project.manifest", (err, json) => {
                        json = JSON.parse(json);
                        var t = Date.now();
                        var version = "";
                        if (json.hasOwnProperty("version")) {
                            version = json["version"];
                        }
                        console.log("version:"+version+" "+versionNew);

                        if(version == versionNew){
                            this.isUpdate = true;

                           //  console.log("assets/"+name+"/assets/"+name);
                           //  var searchPaths = jsb.fileUtils.getSearchPaths();
                            // console.log(JSON.stringify(searchPaths));
                            // jsb.fileUtils.setSearchPaths(this._storagePath);

                            var searchPaths = jsb.fileUtils.getSearchPaths();
                            console.log('HOT UPDATE: newPaths: ' + JSON.stringify(searchPaths));
                            this.loadBundle(name,callbacks);
                           // this.checkUpdate(name, progress , callbacks);
                        }else{
                            console.log("json old: " + JSON.stringify(json, null, "\t"));
                            if(json.hasOwnProperty("packageUrl") && json["packageUrl"] != cc.HotUpdate.packageUrl){
                                json["packageUrl"] = cc.HotUpdate.packageUrl+"assets/"+name;
                            }
                            json["remoteManifestUrl"] = json["packageUrl"]+"/project.manifest?t=" + t;
                            json["remoteVersionUrl"] =  json["packageUrl"]+ "/version.manifest?t=" + t
                            console.log("json new: " + JSON.stringify(json, null, "\t"));
                            jsb.fileUtils.writeStringToFile(JSON.stringify(json, null, "\t"), this._storagePath + "/project.manifest");
                            this.checkUpdate(name, progress , callbacks);
                        }
                    });
                } else {
                    this.checkUpdate(name,progress, callbacks);
                }
            } else {
                if (CC_BUILD) {
                    this.loadBundle(name,callbacks);
                } else {
                    this.loadBundle(name,callbacks);
                }
            } 
        };
        SubpackageDownloader.prototype.loadBundle = function(name,callbacks){
            let t = setTimeout(()=>{
                clearTimeout(t);
                cc.assetManager.loadBundle(name,(err, bundle) => {
                    if (err) {
                        callbacks(err, bundle);
                    } else {
                        callbacks(err, bundle);
                    }
                });
            },10);
        }
        SubpackageDownloader.prototype.checkUpdate = function(name, progress,callbacks) {
            var versionCompareHandle = (versionA, versionB) => {
                console.log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
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
            let t = Date.now();
            var customManifestStr = JSON.stringify({
                "packageUrl": cc.HotUpdate.packageUrl + "assets/" + name + "/",
                "remoteManifestUrl": cc.HotUpdate.packageUrl+ "assets/" + name + "/project.manifest?t=" + t,
                "remoteVersionUrl": cc.HotUpdate.packageUrl+"assets/" + name + "/version.manifest?t=" + t,
                "version": "0.0.0"
            });
            console.log(customManifestStr);
            this._am = new jsb.AssetsManager('', this._storagePath, versionCompareHandle)
            if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
                var manifest = new jsb.Manifest(customManifestStr, this._storagePath);
                this._am.loadLocalManifest(manifest, this._storagePath);
            }
            this._am.setEventCallback((event) => {
                switch (event.getEventCode()) {
                    //check callback
                    case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                        console.log("No local manifest file found, hot update skipped.");
                        callbacks("No local manifest file found, hot update skipped.", null);
                        break;
                    case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                    case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                        console.log("Fail to download manifest file, hot update skipped.");
                        callbacks("Fail to download manifest file, hot update skipped.", null);
                        break;
                    case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                        console.log("Already up to date with the latest remote version 1.");
                        this.loadBundle(name,callbacks);
                        break;
                    case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                        console.log("New version found, please try to update.");
                        this._am.update();
                        break;
                    //download callback
                    case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                        console.log("files: " + event.getDownloadedFiles() + ' / ' + event.getTotalFiles());
                        console.log("bytes: " + event.getTotalBytes() + ' / ' + event.getDownloadedBytes());
                        console.log("event.getPercent(): " + event.getPercent());
                        var _progress = Number(event.getDownloadedFiles() / event.getTotalFiles());
                        var _progress = Number(event.getPercent());
                        progress(_progress);
                        break;
                    case jsb.EventAssetsManager.UPDATE_FINISHED:
                        var newPaths = this._am.getLocalManifest().getSearchPaths();

                        console.log('HOT UPDATE: newPaths: ' + JSON.stringify(newPaths));

                        var searchPaths = jsb.fileUtils.getSearchPaths();

                        // if(!searchPaths.includes(newPaths)){
                        //     Array.prototype.unshift.apply(searchPaths, newPaths);
                        //     cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
                        //     console.log('HOT UPDATE: newPaths: ' + JSON.stringify(searchPaths));
                        //     jsb.fileUtils.newPaths(searchPaths);
                        // }

                        for(let i = 0 ; i < newPaths.length ; i++){
                            if(!searchPaths.includes(newPaths[i])){
                                Array.prototype.unshift.apply(searchPaths, newPaths[i]);
                                jsb.fileUtils.addSearchPath(searchPaths);
                            }
                        }
                        console.log('HOT UPDATE: newPaths: ' + JSON.stringify(searchPaths));
                        cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
                        this.loadBundle(name,callbacks);
                        break;
                    case jsb.EventAssetsManager.UPDATE_FAILED:
                        console.log('Update failed. ' + event.getMessage());
                        if (this.failCount < 5) {
                            this._am.downloadFailedAssets();
                        } else {
                            callbacks('Update failed. ' + event.getMessage(), null);
                        }
                        this.failCount++;
                        break;
                    case jsb.EventAssetsManager.ERROR_UPDATING:
                        console.log('Asset update error: ' + event.getAssetId() + ', ' + event.getMessage());
                        // callbacks('Asset update error: ' + event.getAssetId() + ', ' + event.getMessage(), 0);
                        break;
                    case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                        console.log('Decompress error: ' + event.getMessage());
                        callbacks('Decompress error: ' + event.getMessage(), null);
                        break;
                    default:
                        return;
                }
            });
            this._am.checkUpdate();
        };
        return SubpackageDownloader;
    })();
    cc.SubpackageDownloader = SubpackageDownloader;
}).call(this);