// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        labelText:cc.RichText
    },

    updateMessage:function(data)
    {
        this.labelText.string = "<color=#00B8FF>" + data[0]+ ":</color> "+data[1];
    }
});
