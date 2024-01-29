(function () {
    cc.ChooseMoney = cc.Class({
        extends: cc.Component,
    
        properties: {
            lbValue: cc.Label
        },
    
        onEnable() {
            var loginResponse = cc.LoginController.getInstance().getLoginResponse();
            this.lbValue.string = cc.Tool.getInstance().formatNumber(loginResponse.Balance);
        },
    });
}).call(this);
