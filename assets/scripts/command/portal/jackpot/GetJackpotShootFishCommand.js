/**
 * Created by Nofear on 2/27/2019.
 */

(function () {
    var GetJackpotShootFishCommand;

    GetJackpotShootFishCommand = (function () {
        function GetJackpotShootFishCommand() {
        }

        GetJackpotShootFishCommand.prototype.execute = function (controller) {

            var urlRequest = 'https://fishapi.zanews24h.com/api/BanCa/GetJackpots';

            var e, request;
            request = new XMLHttpRequest();

            try {
                request.timeout = 60000;
                request.open(cc.RequestType.GET, urlRequest); //+ '?' + Math.random()
                request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

                request.onreadystatechange = function () {
                    if (request.readyState === 4 && request.status === 200) {

                        // //moi them -> sau nay sua parse JSON o day luon
                        var obj = JSON.parse(request.responseText);

                        // var receiveDate = (new Date()).getTime();
                        // cc.DDNA.getInstance().logAPI(subdomain, url, receiveDate - sendDate);

                        return controller.onGetJackpotShootFishResponse(obj);
                    }
                };
                return request.send();
            } catch (error) {
                e = error;
                return console.log('Caught Exception: ' + e.message);
            }

            // return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.PORTAL, url, function (response) {
            //     var obj = JSON.parse(response);
            //     if (obj.ResponseCode === 1) {
            //         return controller.onGetJackpotShootFishResponse(obj);
            //     } else {
            //         //cc.PopupController.getInstance().showMessageError(obj.Message, obj.ResponseCode);
            //     }
            // });
        };

        return GetJackpotShootFishCommand;

    })();

    cc.GetJackpotShootFishCommand = GetJackpotShootFishCommand;

}).call(this);
