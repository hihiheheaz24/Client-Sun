/**
 * Created by Nofear on 3/20/2019.
 */

(function () {
    var GetBalanceLogCommand;

    GetBalanceLogCommand = (function () {
        function GetBalanceLogCommand() {
        }

        GetBalanceLogCommand.prototype.execute = function (controller) {
            var url = 'api/UserTranfer/GetHistory?type=0'; //1=chuyeen,2=nhan //38

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.PORTAL, url, function (response) {
                var obj = JSON.parse(response);
                if (obj.ResponseCode === 1) {
                    return controller.onBalanceLogResponse(obj);
                } else {
                    cc.PopupController.getInstance().showMessageError(obj.Message, obj.ResponseCode);
                }
            });
        };

        return GetBalanceLogCommand;

    })();

    cc.GetBalanceLogCommand = GetBalanceLogCommand;

    var GetUserTransferHistoryCommand;

    GetUserTransferHistoryCommand = (function () {
        function GetUserTransferHistoryCommand() {
        }

        GetUserTransferHistoryCommand.prototype.execute = function (controller) {
            var url = 'api/UserTranfer/GetTransferHistory?type=0'; //1=chuyeen,2=nhan //38

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.PORTAL, url, function (response) {
                var obj = JSON.parse(response);
                if (obj.ResponseCode === 1) {
                    return controller.onUserTransferHistoryResponse(obj);
                } else {
                    cc.PopupController.getInstance().showMessageError(obj.Message, obj.ResponseCode);
                }
            });
        };

        return GetUserTransferHistoryCommand;

    })();

    cc.GetUserTransferHistoryCommand = GetUserTransferHistoryCommand;
}).call(this);
