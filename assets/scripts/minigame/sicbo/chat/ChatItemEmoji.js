// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        labelNickName:cc.Label,
        emojiSkeleton:sp.Skeleton,
        listSkeletonData:[sp.SkeletonData]
    },

    updateMessage:function(data)
    {
        let array = data[1].split(':');
        let emojiIndex = parseInt(array[1]);
        this.labelNickName.string = data[0]+": ";
        let skeletonData = this.listSkeletonData[emojiIndex]; 
        this.emojiSkeleton.skeletonData = skeletonData;
        this.emojiSkeleton.setSkin('default');
        this.emojiSkeleton.setAnimation(0,'animation',true)
    }
});
