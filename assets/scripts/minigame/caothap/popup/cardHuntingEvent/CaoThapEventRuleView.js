cc.Class({
    extends: cc.Component,

    properties: {},

    show() {
        this.node.active = true;
    },

    hide() {
        this.node.active = false;
    },
});
