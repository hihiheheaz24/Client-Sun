cc.Class({
    extends: cc.Component,

    properties: {
        nodeSelectDigit: cc.Node,
        nodeSelectFast: cc.Node,
        lblNumber: cc.Label,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._currentEditBox = null;
        this._currentNumberString = '0';
        this.onToggleEnterMoney(true);
    },

    start () {

    },

    setCurrentSelectedEditbox(editbox) {
        this._currentEditBox = editbox;
    },

    onSelectMoneyFast(event, data) {
        this._currentEditBox.getComponent(cc.EditBox).string = cc.Tool.getInstance().formatNumber(data);
        this.closeClicked();
    },

    onSelectConnectionNumber(event, data) {
        if(parseInt(this._currentNumberString) === 0) {
            this._currentNumberString = data;
        } else {
            this._currentNumberString = this._currentNumberString.concat(data);
        }
        this.lblNumber.string = cc.Tool.getInstance().formatNumber(this._currentNumberString);
    },

    onToggleEnterMoney(enable) {
        this.nodeSelectDigit.active = !enable;
        this.nodeSelectFast.active = enable;
    },

    onChangeToSelectDigit() {
        this.onToggleEnterMoney(false);
    },

    onChangeToSelectFast() {
        this.onToggleEnterMoney(true);
    },

    closeClicked: function () {
        this.node.destroy();
    },

    onConfirmSelect() {
        this._currentEditBox.getComponent(cc.EditBox).string = cc.Tool.getInstance().formatNumber(this._currentNumberString);
        this.closeClicked();
    },

    deleteString() {
        if(this._currentNumberString.length > 1) {
            this._currentNumberString = this._currentNumberString.slice(0, -1);
        } else {
            this._currentNumberString = '0';
        }
        this.lblNumber.string = cc.Tool.getInstance().formatNumber(this._currentNumberString);
    },
});
