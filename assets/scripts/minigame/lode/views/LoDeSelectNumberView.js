cc.Class({
    extends: cc.Component,

    properties: {
        nodeLo: [cc.Node],
        nodeXien: [cc.Node],
        nodeDe: [cc.Node],
        nodeDauDit: [cc.Node],

        edbLo2So: cc.EditBox,
        edbLo2SoAmount: cc.EditBox,
        edbXien21: cc.EditBox,
        edbXien22: cc.EditBox,
        edbXien2Amount: cc.EditBox,
        edbXien31: cc.EditBox,
        edbXien32: cc.EditBox,
        edbXien33: cc.EditBox,
        edbXien3Amount: cc.EditBox,
        edbXien41: cc.EditBox,
        edbXien42: cc.EditBox,
        edbXien43: cc.EditBox,
        edbXien44: cc.EditBox,
        edbXien4Amount: cc.EditBox,
        edbDeDB: cc.EditBox,
        edbDeDBAmount: cc.EditBox,

        edbDau: cc.EditBox,
        edbDeDauAmount: cc.EditBox,
        edbDuoi: cc.EditBox,
        edbDeDuoiAmount: cc.EditBox,

        lbUserBetValue: cc.Label,
        lbTotalMoney: cc.Label,
        lblSelectedNumber: cc.Label,
        nodeConfirm: cc.Node,

        prefabSelectMoney: cc.Prefab,
    },

    onLoad: function () {
        this.currentTab = cc.LoDeNumberCategoryEnum.LO;
    },

    onEnable: function() {
        this.animation = this.nodeConfirm.getComponent(cc.Animation);
        this.activeTab(this.currentTab);
    },

    changeTabClicked: function (event, data) {
        if(cc.LodeController.getInstance().currPharse === cc.LodePharse.WAITING) {
            return cc.PopupController.getInstance().showMessage("VUI LÒNG CHỜ PHIÊN TIẾP THEO!");
        }
        if (data.toString() === this.currentTab) return;
        this.activeTab(data.toString());
    },

    activeTab (tabName) {
        this.reset();
        switch (tabName) {
            case cc.LoDeNumberCategoryEnum.LO:
                this.nodeLo.forEach(node => node.active = true);
                break;
            case cc.LoDeNumberCategoryEnum.LO_XIEN:
                this.nodeXien.forEach(node => node.active = true);
                break;
            case cc.LoDeNumberCategoryEnum.DE:
                this.nodeDe.forEach(node => node.active = true);
                break;
            case cc.LoDeNumberCategoryEnum.DAUDIT:
                this.nodeDauDit.forEach(node => node.active = true);
                break;

        }
        this.currentTab = tabName;
    },

    reset() {
        this.nodeLo.forEach(node => node.active = false);
        this.nodeXien.forEach(node => node.active = false);
        this.nodeDe.forEach(node => node.active = false);
        this.nodeDauDit.forEach(node => node.active = false);
    },

    onClickBet(event, data) {
        cc.LodeController.getInstance().initNumberChooses();
        this.listNumbers = [];
        var betValue;
        this.typeBet = parseInt(data);
        switch (this.typeBet) {
            case cc.LodeType.DE:
                this.listNumbers = this.edbDeDB.string.trim().split(',');
                betValue = parseFloat(cc.Tool.getInstance().removeDot(this.edbDeDBAmount.string));
                break;
            case cc.LodeType.DE_DAU:
                this.listNumbers = this.edbDau.string.trim().split(',');
                betValue = parseFloat(cc.Tool.getInstance().removeDot(this.edbDeDauAmount.string));
                break;
            case cc.LodeType.DE_CUOI:
                this.listNumbers = this.edbDuoi.string.trim().split(',');
                betValue = parseFloat(cc.Tool.getInstance().removeDot(this.edbDeDuoiAmount.string));
                break;
            case cc.LodeType.LO:
                this.listNumbers = this.edbLo2So.string.trim().split(',');
                betValue = parseFloat(cc.Tool.getInstance().removeDot(this.edbLo2SoAmount.string));
                break;
            case cc.LodeType.XIEN2:
                let numberXien21 = this.edbXien21.string.trim();
                let numberXien22 = this.edbXien22.string.trim();
                if(numberXien21.length === 0 || numberXien22.length === 0) {
                    return cc.PopupController.getInstance().showMessageError("VUI LÒNG CHỌN SỐ!");
                } else {
                    this.listNumbers.push(numberXien21);
                    this.listNumbers.push(numberXien22);
                }
                betValue = parseFloat(cc.Tool.getInstance().removeDot(this.edbXien2Amount.string));
                break;
            case cc.LodeType.XIEN3:
                let numberXien31 = this.edbXien31.string.trim();
                let numberXien32 = this.edbXien32.string.trim();
                let numberXien33 = this.edbXien33.string.trim();

                if(numberXien31.length === 0 || numberXien32.length === 0 || numberXien33.length === 0) {
                    return cc.PopupController.getInstance().showMessageError("VUI LÒNG CHỌN SỐ!");
                } else {
                    this.listNumbers.push(numberXien31);
                    this.listNumbers.push(numberXien32);
                    this.listNumbers.push(numberXien33);
                }
                betValue = parseFloat(cc.Tool.getInstance().removeDot(this.edbXien3Amount.string));
                break;
            case cc.LodeType.XIEN4:
                let numberXien41 = this.edbXien41.string.trim();
                let numberXien42 = this.edbXien42.string.trim();
                let numberXien43 = this.edbXien43.string.trim();
                let numberXien44 = this.edbXien44.string.trim();

                if(numberXien41.length === 0 || numberXien42.length === 0 || numberXien43.length === 0 || numberXien44.length === 0) {
                    return cc.PopupController.getInstance().showMessageError("VUI LÒNG CHỌN SỐ!");
                } else {
                    this.listNumbers.push(numberXien41);
                    this.listNumbers.push(numberXien42);
                    this.listNumbers.push(numberXien43);
                    this.listNumbers.push(numberXien44);
                }
                betValue = parseFloat(cc.Tool.getInstance().removeDot(this.edbXien4Amount.string));
                break;
        }

        this.listNumbers.forEach(number => cc.LodeController.getInstance().setNumberChooses(number));
        if(isNaN(parseInt(this.listNumbers[0]))) {
            return cc.PopupController.getInstance().showMessageError("VUI LÒNG CHỌN SỐ!");
        }
        cc.LodeController.getInstance().setTypeBet(parseInt(data));
        let arrTypeXien = [cc.LodeType.XIEN2, cc.LodeType.XIEN3, cc.LodeType.XIEN4];
        let arrTypeMin5 = [cc.LodeType.LO, cc.LodeType.DE_DAU, cc.LodeType.DE_CUOI, cc.LodeType.XIEN2, cc.LodeType.XIEN3, cc.LodeType.XIEN4];

        let numberChooses = cc.LodeController.getInstance().getNumberChooses();
        if (numberChooses.length === 0) {
            return cc.PopupController.getInstance().showMessageError("VUI LÒNG CHỌN SỐ!");
        }

        if (betValue.length == 0 || isNaN(betValue)) {
            return cc.PopupController.getInstance().showMessageError("VUI LÒNG NHẬP TIỀN CƯỢC!");
        }

        if (betValue < 1000 && this.typeBet === cc.LodeType.DE) {
            return cc.PopupController.getInstance().showMessageError("TIỀN CƯỢC TỐI THIỂU 1.000!");
        }

        if(betValue < 5000 && arrTypeMin5.includes(this.typeBet)) {
            return cc.PopupController.getInstance().showMessageError("TIỀN CƯỢC TỐI THIỂU 5.000!");
        }

        betValue = parseFloat(betValue);

        this.userBet = betValue;
        let totalBet = (arrTypeXien.includes(this.typeBet)) ? betValue : betValue * numberChooses.length;

        //Kiem tra so du
        if (betValue > cc.BalanceController.getInstance().getBalance()) {
            return cc.PopupController.getInstance().showMessageError("SỐ DƯ KHÔNG ĐỦ!");
        }
        this.listNumbers = this.listNumbers.map(number => number = (parseInt(number) < 10) ? "0" + parseInt(number) : number)
        this.lblSelectedNumber.string = `${this.listNumbers.join(',')}`;
        this.lbUserBetValue.string = `${cc.Tool.getInstance().formatNumber(betValue)}`;
        this.lbTotalMoney.string = `${cc.Tool.getInstance().formatNumber(totalBet)}`;

        this.enableNodeConfirm(true);
    },

    enableNodeConfirm: function (enable) {
        this.nodeConfirm.active = enable;
    },

    confirmBet: function () {
        let numberChooses = cc.LodeController.getInstance().getNumberChooses();
        //format so dat
        //Neu ko phai DE_DAU, DE_CUOI them so 0 vao dau so nho hon 10
        if (this.typeBet !== cc.LodeType.DE_DAU && this.typeBet !== cc.LodeType.DE_CUOI) {
            numberChooses = numberChooses.map(number => number = (number < 10) ? "0" + parseInt(number) : number);
        }
        cc.LodeController.getInstance().sendRequestOnHub(cc.MethodHubName.BET, this.typeBet, this.userBet, numberChooses.join(','));
        //Gui du lieu len server
        this.enableNodeConfirm(false);
        this.onCancelClicked();
        this.resetEditBox(this.typeBet);
    },

    onCancelClicked: function () {
        var delay = 0.12;
        cc.director.getScheduler().schedule(function () {
            this.enableNodeConfirm(false);
        }, this, 1, 0, delay, false);
    },

    resetEditBox(lodeType) {
        switch (lodeType) {
            case cc.LodeType.DE:
                this.edbDeDB.string = '';
                this.edbDeDBAmount.string = '';
                break;
            case cc.LodeType.DE_DAU:
                this.edbDau.string = '';
                this.edbDeDauAmount.string = '';
                break;
            case cc.LodeType.DE_CUOI:
                this.edbDuoi.string = '';
                this.edbDeDuoiAmount.string = '';
                break;
            case cc.LodeType.LO:
                this.edbLo2So.string = '';
                this.edbLo2SoAmount.string = '';
                break;
            case cc.LodeType.XIEN2:
                this.edbXien21.string = '';
                this.edbXien22.string = '';
                this.edbXien2Amount.string = '';
                break;
            case cc.LodeType.XIEN3:
                this.edbXien31.string = '';
                this.edbXien32.string = '';
                this.edbXien33.string = '';
                this.edbXien3Amount.string = '';
                break;
            case cc.LodeType.XIEN4:
                this.edbXien41.string = '';
                this.edbXien42.string = '';
                this.edbXien43.string = '';
                this.edbXien44.string = '';
                this.edbXien4Amount.string = '';
                break;
        }
    },

    onClickEditBox(event, data) {
        let popupMoney = cc.instantiate(this.prefabSelectMoney);
        this.node.addChild(popupMoney);
        popupMoney.getComponent('LoDeSelectMoneyView').setCurrentSelectedEditbox(event.currentTarget);
    }
});
