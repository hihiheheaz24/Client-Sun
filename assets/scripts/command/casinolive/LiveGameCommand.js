(function () {
    let GetGameInfo = function(controller){
        let url = 'api/livegame/GetGameInfo';

        return cc.ServerConnector.getInstance().sendRequestPOST(cc.SubdomainName.PORTAL, url, null, function (response) {
            var obj = JSON.parse(response);

            return controller.onGetGameInfoResponse(obj);
        });
    }


    let GetAccountInfo = function(controller, productType){
        let url = 'api/livegame/GetAccountInfo';

        var params = JSON.stringify({
            productType: productType
        });

        return cc.ServerConnector.getInstance().sendRequestPOST(cc.SubdomainName.PORTAL, url, params, function (response) {
            var obj = JSON.parse(response);

            return controller.onGetAccountInfoResponse(obj);
        });
    }

    let GetLink = function(controller, productType){
        let url = 'api/livegame/GetLink';

        var params = JSON.stringify({
            productType: productType
        });

        return cc.ServerConnector.getInstance().sendRequestPOST(cc.SubdomainName.PORTAL, url, params, function (response) {
            var obj = JSON.parse(response);
            
            return controller.onGetLinkResponse(obj);
        });
    }

    let Deposit = function(controller, amount, productType){
        let url = 'api/livegame/Deposit';

        var params = JSON.stringify({
            Amount: amount,
            productType: productType
        });
        console.log(params);
        return cc.ServerConnector.getInstance().sendRequestPOST(cc.SubdomainName.PORTAL, url, params, function (response) {
            var obj = JSON.parse(response);

            return controller.onTransactionResponse(obj);
        });
    }

    let Withdrawal = function(controller, amount, productType){
        let url = 'api/livegame/Withdrawal';

        var params = JSON.stringify({
            Amount: amount,
            productType: productType
        });
        console.log(params);
        return cc.ServerConnector.getInstance().sendRequestPOST(cc.SubdomainName.PORTAL, url, params, function (response) {
            var obj = JSON.parse(response);
            
            return controller.onTransactionResponse(obj);
        });
    }

    cc.LiveGameCommand = {
        GetGameInfo,
        GetAccountInfo,
        GetLink,
        Deposit,
        Withdrawal
    };

}).call(this);