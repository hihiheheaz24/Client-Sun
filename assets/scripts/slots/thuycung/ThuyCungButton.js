
const CONFIG_COLOR = {
     NORMAL: 0,
     HOVER: 0.2,
}
cc.Class({
    extends: cc.Component,  

   onLoad(){
     this._updateRenderComponentMaterial(CONFIG_COLOR.NORMAL)
        this.node.on(cc.Node.EventType.MOUSE_ENTER, this.onHover, this);
        this.node.on(cc.Node.EventType.MOUSE_LEAVE, this.onLeave, this);
   },

   onHover(){  
        const button = this.node.getComponent(cc.Button);
        if(button && button.interactable){
           cc.AudioController.getInstance().playSound(cc.AudioTypes.BUTTON_HOVER);
           this._updateRenderComponentMaterial(CONFIG_COLOR.HOVER)
        }
     
   },

   onLeave(){
     this._updateRenderComponentMaterial(CONFIG_COLOR.NORMAL)
   },

   _updateRenderComponentMaterial(glowColor){
    const srpite = this.node.getComponent(cc.Sprite);
    const material = srpite.getMaterial(0);
    material.setProperty('addedColor', cc.v4(1, 1, 1, glowColor));
   }

});
