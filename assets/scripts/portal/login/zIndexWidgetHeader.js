
(function() {
    cc.zIndexWidgetHeader = cc.Class({
        extends: cc.Component,
        properties: {
            block: cc.Node 
        },

        onLoad () {
            cc.LoginController.getInstance().setzIndexWidgetHeader(this);
            this.node.zIndex =  cc.NoteDepth.TOP_BAR;
            this.activeBlock(false);
            // console.log(this.node.zIndex)
        },

        activeBlock: function (enable) {
            this.block.active = enable;
        }
    });
}).call(this);
