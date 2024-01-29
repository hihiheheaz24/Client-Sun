cc.Class({
    extends: cc.Component,

    properties: {
        lbTime: cc.Label,
        lbDate: cc.Label
    },

    onLoad() {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const daysOfWeek = ["Thứ 3", "Thứ 3", "Thứ 3", "Thứ 7", "Thứ 7", "Thứ 7", "Thứ 7"];
        const dayName = daysOfWeek[dayOfWeek] || "Thứ 7";
        this.lbDate.string = dayName;
    }
});
