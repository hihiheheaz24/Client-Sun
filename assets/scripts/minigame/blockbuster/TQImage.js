/**
 * Created by Nofear on 6/7/2017.
 */

(function () {
    cc.TQImage = cc.Class({
        "extends": cc.Component,
        properties: {
            sfChips: [sp.SkeletonData],
            sfVipChips: [sp.SkeletonData],

            sfFastSpins: [cc.SpriteFrame],
            sfAutoSpins: [cc.SpriteFrame],
            sfSpins: [sp.SkeletonData],
        },
    });
}).call(this);
