/**
 * Created by Nofear on 3/15/2019.
 */

(function () {
    cc.TopHonorItem = cc.Class({
        "extends": cc.Component,
        properties: {
            
        },

        onEnable: function () {
            
        },

        getInfo: function () {
            var getUserJackpotInfoCommand = new cc.GetUserJackpotInfoCommand;
            getUserJackpotInfoCommand.execute(this,cc.GameId.ALL);
        },

        onGetUserJackpotInfoResponse: function (response) {
            if (response !== null) {
                var self = this;
                var list = response.list;


                list.forEach(function (record) {
                    
                });
            }
        },


    });
}).call(this);
