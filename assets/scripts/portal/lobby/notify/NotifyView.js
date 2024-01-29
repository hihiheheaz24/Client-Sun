/**
 * Created by Nofear on 6/7/2017.
 */

(function () {
    cc.NotifyView = cc.Class({
        "extends": cc.Component,
        properties: {
            nodeContent: cc.Node,
            notifyItem: cc.Node,
        },

        onLoad: function () {
            cc.NotifyController.getInstance().setNotifyView(this);
            this.node.zIndex = 0;
            cc.director.getScheduler().schedule(this.getNotify, this, 30, cc.REPEAT_FOREVER, 0, false);
            this.getNotify();
        },

        getNotify: function () {
            var getNotifyCommand = new cc.GetNotifyCommand;
            getNotifyCommand.execute(this);
        },

        onGetNotifyResponse: function (response) {
            if (response !== null && response.List.length > 0) {
                if (this.action==null||(this.action&&this.action.isDone()))
                {
                    this.nodeContent.removeAllChildren();
                    for (let index = 0;index<response.List.length;index++)
                    {
                        let text =  cc.instantiate(this.notifyItem);
                        text.getComponent(cc.RichText).string = response.List[index].AccountName;
                        text.y = 0;
                        text.parent = this.nodeContent;
                    }
                    this.nodeContent.x = 300;
                    let distance = 300 + this.nodeContent.width;
                    let duration = (5.00 / 300) * distance;
                    this.action = cc.moveTo(duration, cc.v2(-distance-300, 0));
                    this.nodeContent.runAction(this.action);
                }
            }
        },
    });
}).call(this);
