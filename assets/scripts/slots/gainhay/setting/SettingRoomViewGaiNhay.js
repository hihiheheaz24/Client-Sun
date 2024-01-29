cc.Class({
    extends: cc.SettingRoomView,

    musicClicked: function () {
        this._super();
        cc.AudioController.getInstance().enableSound(this.music);
    },
});
