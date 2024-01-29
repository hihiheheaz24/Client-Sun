// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

(function () {
    cc.HistoryLoginItem = cc.Class({
    extends: cc.Component,
    properties: {
        lbSTT:cc.Label,
        lbTime:cc.Label,
        lbDevice:cc.Label,
        lbIP:cc.Label,
    },

    updateItem:function(data,index)
    {
        let dataTemp = {
            "AccountID": 200100053,
            "DeviceType": 1,
            "ClientIP": "171.255.69.203",
            "LoginTime": "2023-08-19T19:23:08.627",
            "Page": 1
        }
        this.resetInfo();
        this.lbSTT.string = index;
        this.lbTime.string = data.LoginTime.slice(0,19).replace("T"," ");
        this.lbDevice.string = data.DeviceType==1?"Web":data.DeviceType==2?"Android":"IOS";
        this.lbIP.string = data.ClientIP;
    },
    resetInfo:function(){
        this.lbSTT.string = "...";
        this.lbTime.string = "...";
        this.lbDevice.string = "...";
        this.lbIP.string = "...";
    }

})}).call(this);
