cc.Class({
    extends: cc.Component,

    properties: {
            content:cc.Node,
            item:cc.Node,
            historyNode:cc.Node
        },

    onEnable(){
       this.historyNode.active = false;
       this.data = cc.LiveXXController.getInstance().getJackPotUserList();
       this.renderItems();
    },
    renderItems:function()
    {
        this.resetAllItem();
        this.data.forEach((itemData,index) => {
            let nodeTemp = cc.instantiate(this.item);
            nodeTemp.parent = this.content;
            nodeTemp.getComponent(cc.xxLiveJackpotUserWinItem).updateItem(itemData,index);
        });
        cc.PopupController.getInstance().hideBusy();
        
    },
    resetAllItem(){
        this.content.children.forEach(item=>{
            item.destroy();
        });
    },

    closeClicked () {
        this.historyNode.active = true;
        this.node.active = false;
    },


});
