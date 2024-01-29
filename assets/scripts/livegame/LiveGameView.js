var netConfig = require('NetConfig');

(function () {
    cc.LiveGameView  = cc.Class({
        extends: cc.Component,
        properties: {
            lbCoin: cc.Label,
            lbCoinNhan: cc.Label,
            lbCoinChuyen: cc.Label,
            lbNameG63: cc.Label,
            lbNameGame: cc.Label,
            editBoxCoin: cc.EditBox,
            // richText: cc.RichText,
            _status:1,
            _game:"exness.exchange",
            _productName:"CasinoLive",
            _productType: 2
        },

        // LIFE-CYCLE CALLBACKS:

         onLoad () {
            this.animation = this.node.getComponent(cc.Animation);
            this.node.zIndex = cc.Config.getInstance().getZINDEX();
            
            switch(this.node._name){
                case "CasinoLiveView":
                    this._productType = cc.TCGProductType.CASINOLIVE;
                    this._productName = "CasinoLive";
                    break;
                case "EsportView":
                    this._productType = cc.TCGProductType.ESPORTS;
                    this._productName = "SabaEsports";
                    break;    
                case "LotteryView":
                    this._productType = cc.TCGProductType.LOTTERY;
                    this._productName = "Lottery";
                    break;    
            }
           
         },

        start () {
            this._rate = 0;
            this._fee = 0;
            this._loading = false;
            this._status = 1;

            this.lbNameG63.string = this._game;
            this.lbNameGame.string = this._productName;
         
            this.loadGameInfo();
            this.loadAccountInfo();
        },
        hideBusy(){
            this._step--;
            if(this._step <= 0){
                cc.PopupController.getInstance().hideBusy();
            }
        },
        showBusy(step){
            this._step = step;
            cc.PopupController.getInstance().showBusy();
        },
        loadGameInfo(){
            this.showBusy(1);
            
            cc.LiveGameCommand.GetGameInfo(this);
        },
        loadAccountInfo(){
           
            this.showBusy(2);
            
            cc.LiveGameCommand.GetAccountInfo(this, this._productType);
        },
        onGetGameInfoResponse(response){
            this.hideBusy();

            if (response){
                this._rate = response.Ratio;
//                 this.richText.string = `+ Chuyển vào <color=#FFFF00>${response.MinDeposit} = <color=#FFFF00>${response.MinDeposit * response.Ratio}</c>.
// + Tối thiểu <color=#FFFF00>${response.MinDeposit}, tối đa <color=#FFFF00>100M</c>.
// + Chuyển ra <color=#FFFF00>${response.MinDeposit * response.Ratio}</c> = <color=#FFFF00>${response.MinDeposit}
// + Hệ thống sẽ tự động hoàn trả phần tiền thừa.`
            }
        },

        onTransactionResponse(response){
           
            this._loading = false;
            if(response.ResponseCode == 1){
                this.lbCoin.string = this.numberWithCommas(response.CasinoLiveBalance);
                cc.BalanceController.getInstance().updateBalance(response.Balance);
            }
            else{
                cc.PopupController.getInstance().showMessageError(response.Message);
            }

            this.hideBusy();
        },
        onGetLinkResponse: function (response) {
      
            this.hideBusy();
            
            if (response.LinkGame){
                this.onOpenGame(response.LinkGame);
            }
            else{
                cc.PopupController.getInstance().showMessageError("Khởi tạo trò chơi không thành công");
            }
        },

        onGetAccountInfoResponse: function (response) {
        
            if (response.ResponseCode === 1){
                this.lbCoin.string = this.numberWithCommas(response.CasinoLiveCoin);
                this.casinoCoin = parseFloat(response.CasinoLiveCoin);
                this.hideBusy();
    
                if(cc.BalanceController.getInstance().getBalance() <= 0){
                    cc.PopupController.getInstance().showMessageError('Không đủ số dư từ ví exness.exchange. Số G11-Game chuyển ví 100K G trở lên');
                }
            }
            else{
                cc.PopupController.getInstance().showMessageError(Message || "Lấy thông tin tài khoản không thành công");
            }
            
        },
        onClickPlay()
        {
            if(this.casinoCoin<=0){
                cc.PopupController.getInstance().showMessageError('Số VNDK của bạn trong ví không đủ chơi game!');
                return;
            }
           
            this.showBusy(1);

            cc.LiveGameCommand.GetLink(this, this._productType);

        },
        onOpenGame(linkGame){
            
            if (linkGame){
                if (linkGame.indexOf("http") === -1){
                    linkGame = `${netConfig.SCHEME}://www.${netConfig.HOST}/${linkGame}`;
                }
                
                cc.sys.openURL(linkGame);
                this.closeClicked();
            }
            else{
                cc.PopupController.getInstance().showMessageError('Khởi tạo game không thành công');
            }
        },
        onClickTransfer(){
            if(this._loading){
                cc.PopupController.getInstance().showMessageError("Thao tác quá nhanh");
                return;
            }
            var coin = this.casinoCoin;
            var amount = parseFloat(this.editBoxCoin.string.replaceAll(",",''));
            if ( amount == 0) {
                cc.PopupController.getInstance().showMessageError('Nhập số tiền cần Giao dịch');
                return;
            }
            if( this.lbNameG63.string ==  this._game){
                if ( amount > cc.BalanceController.getInstance().getBalance()) {
                    cc.PopupController.getInstance().showMessageError('Số tiền của bạn trong Game không đủ để thực hiện giao dịch');
                    return;
                }
            }else{
                if ( amount > coin) {
                    cc.PopupController.getInstance().showMessageError('Số tiền của bạn trong ví không đủ để thực hiện giao dịch');
                    return;
                }
            }

            this.type =  this.lbNameG63.string == this._game && this.lbNameGame.string == this._productName?"Deposit":"Withdrawal";
            this._loading = true;
            this.showBusy(1);
            
            if (this.type === "Deposit"){
                cc.LiveGameCommand.Deposit(this, amount, this._productType)
            }
            else{
                cc.LiveGameCommand.Withdrawal(this, amount, this._productType)
            }
        },
        onSwitch(){
            if( this.lbNameG63.string ==  this._game){
                this.lbNameG63.string = this._productName;
                this.lbNameGame.string = this._game;
            }else{
                this.lbNameG63.string = this._game;
                this.lbNameGame.string = this._productName;
            }
            this.calculator((this.editBoxCoin.string));
        },
        
        onEnable: function () {
            this.animation.play('openPopup');
           
        },

        onDestroy: function () {
            if (cc.sys.isNative) {
                switch(this._productType){
                    case cc.TCGProductType.ESPORTS:
                        cc.loader.releaseResDir('eports/prefabs');
                        cc.LobbyController.getInstance().destroyDynamicView(cc.GameId.ESPORTS);

                        break;
                    case cc.TCGProductType.LOTTERY:
                        cc.loader.releaseResDir('lottery/prefabs');
                        cc.LobbyController.getInstance().destroyDynamicView(cc.GameId.LOTTERY);

                        break;
                    case cc.TCGProductType.CASINOLIVE:
                        cc.loader.releaseResDir('casinolive/prefabs');
                        cc.LobbyController.getInstance().destroyDynamicView(cc.GameId.CASINO_LIVE);

                        break;
                }
                
            }
        },
        closeClicked: function () {
            this.animation.play('closePopup');
            var self = this;
            var delay = 0.12;
            cc.director.getScheduler().schedule(function () {
                self.animation.stop();

                switch(this._productType){
                    case cc.TCGProductType.ESPORTS:
                        cc.LobbyController.getInstance().destroyDynamicView(cc.GameId.ESPORTS);
                        break;
                    case cc.TCGProductType.LOTTERY:
                        cc.LobbyController.getInstance().destroyDynamicView(cc.GameId.LOTTERY);
                        break;
                    case cc.TCGProductType.CASINOLIVE:
                        cc.LobbyController.getInstance().destroyDynamicView(cc.GameId.CASINO_LIVE);
                        break;
                }

            }, this, 1, 0, delay, false);
        },
        calculator: function(coin){

            coin = parseFloat(coin); 

            if(isNaN(coin)) coin = 0;
             if(this.lbNameG63.string ==  this._game){
                var c =  coin *this._rate;
                
                this.lbCoinNhan.string = this.numberWithCommas(c);
                this.lbCoinChuyen.string = cc.Tool.getInstance().formatNumber(coin+coin*this._fee);
             }else{
                var c =  coin/this._rate;
                this.lbCoinNhan.string = cc.Tool.getInstance().formatNumber(c);
                this.lbCoinChuyen.string = this.numberWithCommas(coin);
             }

            
        },
        numberWithCommas(x) {
        return x.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        onEditDidBegan: function(editbox, customEventData) {
             
            
            this.calculator((editbox.string));
            // The editbox here is a cc.EditBox object.
            // The customEventData parameter here is equal to the "foobar" you set earlier.
        },
        // Suppose this callback is for the editingDidEnded event.
        onEditDidEnded: function(editbox, customEventData) {
            
            this.calculator((editbox.string));
            // The editbox here is a cc.EditBox object.
            // The customEventData parameter here is equal to the "foobar" you set earlier.
        },
        // Suppose this callback is for the textChanged event.
        onTextChanged: function(text, editbox, customEventData) {
             
            this.calculator((editbox.string));
            // The text here indicates the text content of the modified EditBox.
            // The editbox here is a cc.EditBox object.
            // The customEventData parameter here is equal to the "foobar" you set earlier.
        },
        // Suppose this callback is for the editingReturn event.
        onEditingReturn: function(editbox,  customEventData) {
          
            this.calculator((editbox.string));
            // The editbox here is a cc.EditBox object.
            // The customEventData parameter here is equal to the "foobar" you set earlier.
        },
        onScale: function() {
            if (!this.isScale) {
                this.isScale = true;
                this.nodeScale.scaleX = 1.0;
                this.nodeScale.scaleY = 1.0;
            } else {
                this.isScale = false;
                this.nodeScale.scaleX = 0.8;
                this.nodeScale.scaleY = 0.8;
            }
        }
        // update (dt) {},
    });
}).call(this);