/**
 * Created by Nofear on 3/15/2019.
 */

(function () {
    cc.LiveXXAssets = cc.Class({
        "extends": cc.Component,
        properties: {
            sfChips: [cc.SpriteFrame],
            sfNans: [cc.SpriteFrame],
            sfAvatarDef: cc.SpriteFrame,

            sfBacks: [cc.SpriteFrame],

            sfDots: [cc.SpriteFrame],

            //font
            bmfWin: cc.BitmapFont,
            bmfLose: cc.BitmapFont,
            sfTopTip:[cc.SpriteFrame],
            skeletonDataTopSet: [sp.SkeletonData],
        },

        onLoad: function () {
            cc.LiveXXController.getInstance().setLiveXXAssets(this);
        },

        getWinFont: function () {
            return this.bmfWin;
        },

        getLoseFont: function () {
            return this.bmfLose;
        },

        getChips: function () {
            return this.sfChips;
        },

        getNans: function () {
            return this.sfNans;
        },

        getAvatarDef: function () {
            return this.sfAvatarDef;
        },
        getTopTipIcon: function(){
            return this.sfTopTip;
        },
        getSkeletonTopTipData: function(){
            return this.skeletonDataTopSet;
        }
    });
}).call(this);
