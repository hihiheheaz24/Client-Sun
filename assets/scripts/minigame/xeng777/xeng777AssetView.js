(function () {
    cc.xeng777AssetView = cc.Class({
        extends: cc.Component,
        properties: {
            sfPrefabChip: [cc.Prefab],//0:1K,1:5K,2:10K,3:50k,4:100K,5:500K,6:1M
        },
        onLoad: function () {
            this.controller = cc.Xeng777Controller.getInstance();

            this.controller.setAssetView(this);

            this.chip1kPool = new cc.NodePool();
            this.chip5kPool = new cc.NodePool();
            this.chip10kPool = new cc.NodePool();
            this.chip50kPool = new cc.NodePool();
            this.chip100kPool = new cc.NodePool();
            this.chip500kPool = new cc.NodePool();
            this.chip1mPool = new cc.NodePool();
            this.chip5mPool = new cc.NodePool();
            this.chip10mPool = new cc.NodePool();
            this.chip50mPool = new cc.NodePool();
            this.chip100mPool = new cc.NodePool();
            this.chip150mPool = new cc.NodePool();
            this.chip200mPool = new cc.NodePool();

        },
        onDestroy: function () {
            this.clearPools();
        },
        clearPools: function () {
            try {
                //Clear pool
                this.chip1kPool.clear();
                this.chip5kPool.clear();
                this.chip10kPool.clear();
                this.chip50kPool.clear();
                this.chip100kPool.clear();
                this.chip500kPool.clear();
                this.chip1mPool.clear();
                this.chip5mPool.clear();
                this.chip10mPool.clear();
                this.chip50mPool.clear();
                this.chip100mPool.clear();
                this.chip150mPool.clear();
                this.chip200mPool.clear();
            } catch (e) {
                console.log(e);
            }
        },
        createChip: function (type) {
            let nodeChip = null;
            switch (type) {
                case cc.Xeng777MapChip['1K']:
                    if (this.chip1kPool.size() > 0) {
                        nodeChip = this.chip1kPool.get();
                    } else {
                        nodeChip = cc.instantiate(this.sfPrefabChip[0]);
                    }
                    break;
                case cc.Xeng777MapChip['5K']:
                    if (this.chip5kPool.size() > 0) {
                        nodeChip = this.chip5kPool.get();
                    } else {
                        nodeChip = cc.instantiate(this.sfPrefabChip[1]);
                    }
                    break;
                case cc.Xeng777MapChip['10K']:
                    if (this.chip10kPool.size() > 0) {
                        nodeChip = this.chip10kPool.get();
                    } else {
                        nodeChip = cc.instantiate(this.sfPrefabChip[2]);
                    }
                    break;
                case cc.Xeng777MapChip['50K']:
                    if (this.chip50kPool.size() > 0) {
                        nodeChip = this.chip50kPool.get();
                    } else {
                        nodeChip = cc.instantiate(this.sfPrefabChip[3]);
                    }
                    break;
                case cc.Xeng777MapChip['100K']:
                    if (this.chip100kPool.size() > 0) {
                        nodeChip = this.chip100kPool.get();
                    } else {
                        nodeChip = cc.instantiate(this.sfPrefabChip[4]);
                    }
                    break;
                case cc.Xeng777MapChip['500K']:
                    if (this.chip500kPool.size() > 0) {
                        nodeChip = this.chip500kPool.get();
                    } else {
                        nodeChip = cc.instantiate(this.sfPrefabChip[5]);
                    }
                    break;
                case cc.Xeng777MapChip['1M']:
                    if (this.chip1mPool.size() > 0) {
                        nodeChip = this.chip1mPool.get();
                    } else {
                        nodeChip = cc.instantiate(this.sfPrefabChip[6]);
                    }
                    break;
                case cc.Xeng777MapChip['5M']:
                    if (this.chip5mPool.size() > 0) {
                        nodeChip = this.chip5mPool.get();
                    } else {
                        nodeChip = cc.instantiate(this.sfPrefabChip[7]);
                    }
                    break;
                case cc.Xeng777MapChip['10M']:
                    if (this.chip10mPool.size() > 0) {
                        nodeChip = this.chip10mPool.get();
                    } else {
                        nodeChip = cc.instantiate(this.sfPrefabChip[8]);
                    }
                    break;
                case cc.Xeng777MapChip['50M']:
                    if (this.chip50mPool.size() > 0) {
                        nodeChip = this.chip50mPool.get();
                    } else {
                        nodeChip = cc.instantiate(this.sfPrefabChip[9]);
                    }
                    break;
                case cc.Xeng777MapChip['100M']:
                    if (this.chip100mPool.size() > 0) {
                        nodeChip = this.chip100mPool.get();
                    } else {
                        nodeChip = cc.instantiate(this.sfPrefabChip[10]);
                    }
                    break;
                case cc.Xeng777MapChip['150M']:
                    if (this.chip150mPool.size() > 0) {
                        nodeChip = this.chip150mPool.get();
                    } else {
                        nodeChip = cc.instantiate(this.sfPrefabChip[11]);
                    }
                    break;
                case cc.Xeng777MapChip['200M']:
                    if (this.chip200mPool.size() > 0) {
                        nodeChip = this.chip200mPool.get();
                    } else {
                        nodeChip = cc.instantiate(this.sfPrefabChip[12]);
                    }
                    break;
            }

            try {
                nodeChip.setScale(0.7, 0.7);
            } catch (e) {
                console.log(e);
                this.createChip(type);
            }

            return nodeChip;
        },

        putChipToPool: function (nodeChip, betValue) {
            switch (betValue) {
                case 1000:
                    this.chip1kPool.put(nodeChip);
                    break;
                case 5000:
                    this.chip5kPool.put(nodeChip);
                    break;
                case 10000:
                    this.chip10kPool.put(nodeChip);
                    break;
                case 50000:
                    this.chip50kPool.put(nodeChip);
                    break;
                case 100000:
                    this.chip100kPool.put(nodeChip);
                    break;
                case 500000:
                    this.chip500kPool.put(nodeChip);
                    break;
                case 1000000:
                    this.chip1mPool.put(nodeChip);
                    break;
                case 5000000:
                    this.chip5mPool.put(nodeChip);
                    break;
                case 10000000:
                    this.chip10mPool.put(nodeChip);
                    break;
                case 50000000:
                    this.chip50mPool.put(nodeChip);
                    break;
                case 100000000:
                    this.chip100mPool.put(nodeChip);
                    break;
                case 150000000:
                    this.chip150mPool.put(nodeChip);
                    break;
                case 200000000:
                    this.chip200mPool.put(nodeChip);
                    break;
            }
        },
        //Lay spriteFrame Dice
        //getSfDice: function (indexDice) {
            //return this.sfDices[indexDice];
        //}

    });
}).call(this);