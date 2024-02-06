cc.Class({
  extends: cc.Component,

  properties: {
    isWithCavans: {
      default: true,
    },
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    if (this.isWithCavans) {
      this.canvas = cc.director.getScene().getChildByName("Canvas");
      cc.log("check canvas la : ", this.canvas )
      // if(!cc.sys.isBrowser)
      this.canvas.on(cc.Node.EventType.SIZE_CHANGED, this.onSizeChange, this);
    } else {
      let cp = this.getComponent(cc.Sprite);
      if (cp) {
        cp.sizeMode = 0;
      }
      cc.log("check canvas la : ", this.canvas )
      cc.log("check size la : ",cc.winSize )
      this.node.setContentSize(cc.winSize);
    }
  },

  onEnable() {
    // if(!cc.sys.isBrowser)
    this.onSizeChange();
  },
  onSizeChange() {
    cc.log("chay vao onsize change",this.canvas.getContentSize().width)
    cc.log("chay vao onsize change",this.canvas.getContentSize().height)
    let cp = this.getComponent(cc.Sprite);
    if (cp) {
      cp.sizeMode = 0;
    }
    if (this.canvas) {
      this.node.setContentSize(this.canvas.getContentSize().width, this.canvas.getContentSize().height);
    }
  },

  onDisable() {
    if (this.canvas) this.canvas.off(cc.Node.EventType.SIZE_CHANGED, this.onSizeChange, this);
  },

  // update (dt) {},
});
