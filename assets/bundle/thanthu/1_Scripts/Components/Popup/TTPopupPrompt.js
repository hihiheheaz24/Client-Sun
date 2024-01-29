cc.Class({
    extends: require('TTPopupItem'),
    properties: {
        txtMessage: cc.Label,
    },

    show(msg) {
        this.onResetState();
        this.txtMessage.string = msg;
        this._super();
    },
    onResetState() {
        if (!cc.isValid(this.node)) return;
        this._super();
        this.txtMessage.string = "";
    },

});
