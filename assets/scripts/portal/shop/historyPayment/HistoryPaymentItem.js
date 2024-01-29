// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

(function () {
    cc.HistoryPaymentItem = cc.Class({
    extends: cc.Component,
    properties: {
        lbTransactionId:cc.Label,
        lbTime:cc.Label,
        lbService:cc.Label,
        lbAmount:cc.Label,
        lbBalance:cc.Label,
        lbDescription:cc.Label,
        btnCancelCashout:cc.Node,
        btnDetailRecharge:cc.Node,
        detailRechargeNode:cc.Node
    },

    updateItem:function(data)
    {
        //     "amount": 1000000,
        //     "code": "20346",
        //     "type": "casout",
        //     "subType": "bank",
        //     "createAt": "2023-10-05T23:52:12.903",
        //     "balance": 276719770,
        //     "status": 10,
        //     "id": 'xdafasffas',
        this.resetInfo();
        this.itemData = data;
        this.lbTransactionId.string = data.code;
        this.lbTime.string = data.createAt.slice(0,19).replace('T',' ');
        this.lbAmount.string = cc.Tool.getInstance().formatNumber(data.amount);
        this.lbBalance.string = cc.Tool.getInstance().formatNumber(data.balance);
        this.lbService.string = data.type=='casout'?'Rút tiền về ':'Nạp tiền qua '+data.subType;
        this.lbDescription.string = this.formatDescription(data);
    },
    formatDescription:function(data)
    {
        let string = '';
        if (data.type=='casout') {
            if (data.status==10) {
                string = 'Đang xử lý';
                this.btnCancelCashout.active = true;
            }
            else if (data.status==5) {
                string = 'Đã huỷ và hoàn tiền';
            }
            else if (data.status==4) {
                string = 'CashOut-'+data.subType+"-"+data.code+'-'+data.createAt.replace('T','').replace('-','');
                string = string.slice(0,30)+'...';
            }
            else{
                string = 'Đang xác nhận';
            }
        }
        if (data.type=='recharge') {
            if (data.status==-1) {
                string = 'Đang chờ nạp';
                this.btnDetailRecharge.active = true;
            }
            else if (data.status==1) {
                string = 'CashIn-'+data.subType+"-"+data.code+'-'+data.id?data.id:'xxx'+'-'+data.createAt.replace('T','').replace('-','');
                string = string.slice(0,30)+'...';
            }
            else{
                string = 'Đã quá hạn';
            }
        }
        return string;
    },
    cancelCashoutClicked:function()
    {
        this.cashoutId = this.itemData.code;
        this.cashoutType = this.itemData.subType;
        var CancelCashoutCommand = new  cc.CancelCashoutCommand;
        CancelCashoutCommand.execute(this);
    },
    rechargeDetailClicked:function()
    {
        this.requestId = this.itemData.id;
        var GetDetailRechargeByRequestIDCommand = new  cc.GetDetailRechargeByRequestIDCommand;
        GetDetailRechargeByRequestIDCommand.execute(this);
    },
    onCancelCashoutSuccess:function(data)
    {
        this.lbDescription.string = 'Đã huỷ và hoàn tiền';
        this.btnCancelCashout.active = false;
    },
    onCancelCashoutError:function(data)
    {
        console.log(data);
    },
    onGetDetailRechargeSuccess:function(data)
    {
        this.detailRechargeNode.active = true;
        this.detailRechargeNode.getComponent(cc.DetailRecharge).show(data.Data);
    },
    onGetDetailRechargeError:function(data)
    {
        console.log(data);
    },
    resetInfo:function(){
        this.itemData = null;
        this.lbTransactionId.string = '...';
        this.lbTime.string = '..:..:.. ..:..';
        this.lbAmount.string = '...';
        this.lbBalance.string = '...';
        this.lbService.string = '...';
        this.lbDescription.string = '...';
        this.btnCancelCashout.active = false;
        this.btnDetailRecharge.active = false;
    }

})}).call(this);
