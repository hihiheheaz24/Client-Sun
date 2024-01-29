// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        anim1:cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    playcolor:function () {
        cc.tween(this.anim1).to(3, { position : cc.v2(0,0) }).start();
        // example2
        // cc.tween(this.anim1).to(3, { color : new cc.Color(255, 0, 0) }).start();
        // // example3
        // let targetColor = new cc.Color();
        // cc.Color.fromHEX(targetColor, '#FF0000');
        // cc.tween(this.anim1).to(3, { color: targetColor}).start();
        // // example4
        // let targetColor2 = new cc.Color();
        // cc.Color.fromHex(targetColor2, 4278190335);  // 4278190335 -> FF0000FF
        // cc.tween(this.anim1).to(3, { color: targetColor2}).start();
    },
    playAnim:function()
    {
        this.anim1.setPosition(-300,-300);
        this.anim1.opacity = 255;
        console.log("start: "+Date.now());
        let posEnd = cc.v2(300,300);
        let c1 = this.anim1.position;
        let c2 = cc.v2(0,0);
        c2.y+=(posEnd.y + this.anim1.position.y)/2 + (Math.random()-0.5)*500;
        c2.x+=(posEnd.x + this.anim1.position.x)/2+(Math.random()-0.5)*500;
        const bezierConfig = [
            c1,
            c2,
            posEnd,
        ];
        var bezierToAction = cc.bezierTo(1, bezierConfig);
        this.anim1.runAction(bezierToAction);
        cc.tween(this.anim1)
            .to(1, {opacity: 50})
            .call(() => {
                console.log("done:"+Date.now());
            }, this)
            .start();
    },

    // update (dt) {},
});
