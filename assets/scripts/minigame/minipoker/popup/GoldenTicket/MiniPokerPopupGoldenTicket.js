
const CONFIG_PAGE = {
    VE_SO_VANG: 0,
    SIEU_CAY: 1,
    VE_CUA_TOI: 2,
    THE_LE: 3,
}

cc.Class({
    extends: cc.Component,
    properties: {
        toggleContainer: cc.ToggleContainer,
        pageVeSoVang: require("MiniPokerPageVeSoVang"),
        pageSieuCay:  require("MiniPokerPageSieuCay"),
        pageVeCuaToi:  require("MiniPokerPageVeCuaToi"),
        pageTheLe:  require("MiniPokerPageTheLe"),
        _choiceIndex: -1,

    },

    onLoad(){
        this.node.show = this.show.bind(this);
    },

    show(pageIndex = CONFIG_PAGE.VE_SO_VANG) {
        this._initialized = false;
        this._choiceIndex = parseInt(pageIndex);
        const toggleChecked = this.toggleContainer.toggleItems[this._choiceIndex].isChecked = true;
        this.toggleContainer.updateToggles(toggleChecked);
        this._initialized = true;
        this.updatePage(this._choiceIndex);
    },

    updatePage(index) {
        this.pageVeSoVang.hide();
        this.pageSieuCay.hide();
        this.pageVeCuaToi.hide();
        this.pageTheLe.hide();
        switch (index){
            case CONFIG_PAGE.VE_SO_VANG: {
                this.pageVeSoVang.show();
                break;
            }
            case CONFIG_PAGE.SIEU_CAY: {
                this.pageSieuCay.show();
                break;
            }
            case CONFIG_PAGE.VE_CUA_TOI: {
                this.pageVeCuaToi.show();
                break;
            }
            case CONFIG_PAGE.THE_LE: {
                this.pageTheLe.show();
                break;
            }
        }
    },

    onClick(event, index) {
        if(this._choiceIndex == parseInt(index)) return;
        this._choiceIndex = parseInt(index);
        this.updatePage(this._choiceIndex);
    },

    closeClicked(){
        this.node.destroy();
    }

});
