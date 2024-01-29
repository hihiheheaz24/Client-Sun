/*
 * Generated by BeChicken
 * on 11/13/2019
 * version v1.0
 */
(function () {
  cc.SicBoChipsView = cc.Class({
    extends: cc.Component,
    properties: {
      //Layout chua chip
      layoutChip: cc.Node,
      //Vi tri chip
      posChips: cc.Node,
      //Vi tri user khac
      posGroupUsers: cc.Node,
      //Vi tri Dealer
      posDealer: cc.Node,
      coinPrefab: cc.Prefab,
      posAppearCoinThiemThu: cc.Node,
      posMatMot: cc.Node,
      posMatHai: cc.Node,
      posMatBa: cc.Node,
      posMatBon: cc.Node,
      posMatNam: cc.Node,
      posMatSau: cc.Node,
      posCuaTai: cc.Node,
      posCuaXiu: cc.Node,
      posCuaChan: cc.Node,
      posCuaLe: cc.Node,
      posMatMotHai: cc.Node,
      posMatMotBa: cc.Node,
      posMatMotBon: cc.Node,
      posMatMotNam: cc.Node,
      posMatMotSau: cc.Node,
      posMatHaiBa: cc.Node,
      posMatHaiBon: cc.Node,
      posMatHaiNam: cc.Node,
      posMatHaiSau: cc.Node,
      posMatBaBon: cc.Node,
      posMatBaNam: cc.Node,
      posMatBaSau: cc.Node,
      posMatBonNam: cc.Node,
      posMatBonSau: cc.Node,
      posMatNamSau: cc.Node,
      posTongBon: cc.Node,
      posTongNam: cc.Node,
      posTongSau: cc.Node,
      posTongBay: cc.Node,
      posTongTam: cc.Node,
      posTongChin: cc.Node,
      posTongMuoi: cc.Node,
      posTongMuoiMot: cc.Node,
      posTongMuoiHai: cc.Node,
      posTongMuoiBa: cc.Node,
      posTongMuoiBon: cc.Node,
      posTongMuoiNam: cc.Node,
      posTongMuoiSau: cc.Node,
      posTongMuoiBay: cc.Node,
      posMatMotMot: cc.Node,
      posMatHaiHai: cc.Node,
      posMatBaBa: cc.Node,
      posMatBonBon: cc.Node,
      posMatNamNam: cc.Node,
      posMatSauSau: cc.Node,
      posMatMotMotMot: cc.Node,
      posMatHaiHaiHai: cc.Node,
      posMatBaBaBa: cc.Node,
      posMatBonBonBon: cc.Node,
      posMatNamNamNam: cc.Node,
      posMatSauSauSau: cc.Node,
      posBaoBatKy: cc.Node,

      //Danh sach posPlayer
      lstPosPlayer: [cc.Node],
    },
    onLoad: function () {
      this.controller = cc.SicBoController.getInstance();
      this.controller.setChipsView(this);
      this.initParamChips();
      this.timePlaySound = 0;
    },
    initParamChips: function () {
      this.chipsMatMot = [];
      this.chipsMatHai = [];
      this.chipsMatBa = [];
      this.chipsMatBon = [];
      this.chipsMatNam = [];
      this.chipsMatSau = [];
      this.chipsCuaTai = [];
      this.chipsCuaXiu = [];
      this.chipsCuaChan = [];
      this.chipsCuaLe = [];
      this.chipsMatMotHai = [];
      this.chipsMatMotBa = [];
      this.chipsMatMotBon = [];
      this.chipsMatMotNam = [];
      this.chipsMatMotSau = [];
      this.chipsMatHaiBa = [];
      this.chipsMatHaiBon = [];
      this.chipsMatHaiNam = [];
      this.chipsMatHaiSau = [];
      this.chipsMatBaBon = [];
      this.chipsMatBaNam = [];
      this.chipsMatBaSau = [];
      this.chipsMatBonNam = [];
      this.chipsMatBonSau = [];
      this.chipsMatNamSau = [];
      this.chipsTongBon = [];
      this.chipsTongNam = [];
      this.chipsTongSau = [];
      this.chipsTongBay = [];
      this.chipsTongTam = [];
      this.chipsTongChin = [];
      this.chipsTongMuoi = [];
      this.chipsTongMuoiMot = [];
      this.chipsTongMuoiHai = [];
      this.chipsTongMuoiBa = [];
      this.chipsTongMuoiBon = [];
      this.chipsTongMuoiNam = [];
      this.chipsTongMuoiSau = [];
      this.chipsTongMuoiBay = [];
      this.chipsMatMotMot = [];
      this.chipsMatHaiHai = [];
      this.chipsMatBaBa = [];
      this.chipsMatBonBon = [];
      this.chipsMatNamNam = [];
      this.chipsMatSauSau = [];
      this.chipsMatMotMotMot = [];
      this.chipsMatHaiHaiHai = [];
      this.chipsMatBaBaBa = [];
      this.chipsMatBonBonBon = [];
      this.chipsMatNamNamNam = [];
      this.chipsMatSauSauSau = [];
      this.chipsBaoBatKy = [];
    },
    //Lay random vi tri chip cua betSide
    randomPosChip: function (betValue, betSide) {
      betSide = parseInt(betSide);
      let pos = null;
      switch (betSide) {
        case cc.SicBoBetSide.MatMot:
          pos = cc.v2(this.posMatMot.x, this.posMatMot.y);
          break;
        case cc.SicBoBetSide.MatHai:
          pos = cc.v2(this.posMatHai.x, this.posMatHai.y);
          break;
        case cc.SicBoBetSide.MatBa:
          pos = cc.v2(this.posMatBa.x, this.posMatBa.y);
          break;
        case cc.SicBoBetSide.MatBon:
          pos = cc.v2(this.posMatBon.x, this.posMatBon.y);
          break;
        case cc.SicBoBetSide.MatNam:
          pos = cc.v2(this.posMatNam.x, this.posMatNam.y);
          break;
        case cc.SicBoBetSide.MatSau:
          pos = cc.v2(this.posMatSau.x, this.posMatSau.y);
          break;
        case cc.SicBoBetSide.CuaTai:
          pos = cc.v2(this.posCuaTai.x, this.posCuaTai.y);
          break;
        case cc.SicBoBetSide.CuaXiu:
          pos = cc.v2(this.posCuaXiu.x, this.posCuaXiu.y);
          break;
        case cc.SicBoBetSide.CuaChan:
          pos = cc.v2(this.posCuaChan.x, this.posCuaChan.y);
          break;
        case cc.SicBoBetSide.CuaLe:
          pos = cc.v2(this.posCuaLe.x, this.posCuaLe.y);
          break;
        case cc.SicBoBetSide.MatMotHai:
          pos = cc.v2(this.posMatMotHai.x, this.posMatMotHai.y);
          break;
        case cc.SicBoBetSide.MatMotBa:
          pos = cc.v2(this.posMatMotBa.x, this.posMatMotBa.y);
          break;
        case cc.SicBoBetSide.MatMotBon:
          pos = cc.v2(this.posMatMotBon.x, this.posMatMotBon.y);
          break;
        case cc.SicBoBetSide.MatMotNam:
          pos = cc.v2(this.posMatMotNam.x, this.posMatMotNam.y);
          break;
        case cc.SicBoBetSide.MatMotSau:
          pos = cc.v2(this.posMatMotSau.x, this.posMatMotSau.y);
          break;
        case cc.SicBoBetSide.MatHaiBa:
          pos = cc.v2(this.posMatHaiBa.x, this.posMatHaiBa.y);
          break;
        case cc.SicBoBetSide.MatHaiBon:
          pos = cc.v2(this.posMatHaiBon.x, this.posMatHaiBon.y);
          break;
        case cc.SicBoBetSide.MatHaiNam:
          pos = cc.v2(this.posMatHaiNam.x, this.posMatHaiNam.y);
          break;
        case cc.SicBoBetSide.MatHaiSau:
          pos = cc.v2(this.posMatHaiSau.x, this.posMatHaiSau.y);
          break;
        case cc.SicBoBetSide.MatBaBon:
          pos = cc.v2(this.posMatBaBon.x, this.posMatBaBon.y);
          break;
        case cc.SicBoBetSide.MatBaNam:
          pos = cc.v2(this.posMatBaNam.x, this.posMatBaNam.y);
          break;
        case cc.SicBoBetSide.MatBaSau:
          pos = cc.v2(this.posMatBaSau.x, this.posMatBaSau.y);
          break;
        case cc.SicBoBetSide.MatBonNam:
          pos = cc.v2(this.posMatBonNam.x, this.posMatBonNam.y);
          break;
        case cc.SicBoBetSide.MatBonSau:
          pos = cc.v2(this.posMatBonSau.x, this.posMatBonSau.y);
          break;
        case cc.SicBoBetSide.MatNamSau:
          pos = cc.v2(this.posMatNamSau.x, this.posMatNamSau.y);
          break;
        case cc.SicBoBetSide.TongBon:
          pos = cc.v2(this.posTongBon.x, this.posTongBon.y);
          break;
        case cc.SicBoBetSide.TongNam:
          pos = cc.v2(this.posTongNam.x, this.posTongNam.y);
          break;
        case cc.SicBoBetSide.TongSau:
          pos = cc.v2(this.posTongSau.x, this.posTongSau.y);
          break;
        case cc.SicBoBetSide.TongBay:
          pos = cc.v2(this.posTongBay.x, this.posTongBay.y);
          break;
        case cc.SicBoBetSide.TongTam:
          pos = cc.v2(this.posTongTam.x, this.posTongTam.y);
          break;
        case cc.SicBoBetSide.TongChin:
          pos = cc.v2(this.posTongChin.x, this.posTongChin.y);
          break;
        case cc.SicBoBetSide.TongMuoi:
          pos = cc.v2(this.posTongMuoi.x, this.posTongMuoi.y);
          break;
        case cc.SicBoBetSide.TongMuoiMot:
          pos = cc.v2(this.posTongMuoiMot.x, this.posTongMuoiMot.y);
          break;
        case cc.SicBoBetSide.TongMuoiHai:
          pos = cc.v2(this.posTongMuoiHai.x, this.posTongMuoiHai.y);
          break;
        case cc.SicBoBetSide.TongMuoiBa:
          pos = cc.v2(this.posTongMuoiBa.x, this.posTongMuoiBa.y);
          break;
        case cc.SicBoBetSide.TongMuoiBon:
          pos = cc.v2(this.posTongMuoiBon.x, this.posTongMuoiBon.y);
          break;
        case cc.SicBoBetSide.TongMuoiNam:
          pos = cc.v2(this.posTongMuoiNam.x, this.posTongMuoiNam.y);
          break;
        case cc.SicBoBetSide.TongMuoiSau:
          pos = cc.v2(this.posTongMuoiSau.x, this.posTongMuoiSau.y);
          break;
        case cc.SicBoBetSide.TongMuoiBay:
          pos = cc.v2(this.posTongMuoiBay.x, this.posTongMuoiBay.y);
          break;
        case cc.SicBoBetSide.MatMotMot:
          pos = cc.v2(this.posMatMotMot.x, this.posMatMotMot.y);
          break;
        case cc.SicBoBetSide.MatHaiHai:
          pos = cc.v2(this.posMatHaiHai.x, this.posMatHaiHai.y);
          break;
        case cc.SicBoBetSide.MatBaBa:
          pos = cc.v2(this.posMatBaBa.x, this.posMatBaBa.y);
          break;
        case cc.SicBoBetSide.MatBonBon:
          pos = cc.v2(this.posMatBonBon.x, this.posMatBonBon.y);
          break;
        case cc.SicBoBetSide.MatNamNam:
          pos = cc.v2(this.posMatNamNam.x, this.posMatNamNam.y);
          break;
        case cc.SicBoBetSide.MatSauSau:
          pos = cc.v2(this.posMatSauSau.x, this.posMatSauSau.y);
          break;
        case cc.SicBoBetSide.MatMotMotMot:
          pos = cc.v2(this.posMatMotMotMot.x, this.posMatMotMotMot.y);
          break;
        case cc.SicBoBetSide.MatHaiHaiHai:
          pos = cc.v2(this.posMatHaiHaiHai.x, this.posMatHaiHaiHai.y);
          break;
        case cc.SicBoBetSide.MatBaBaBa:
          pos = cc.v2(this.posMatBaBaBa.x, this.posMatBaBaBa.y);
          break;
        case cc.SicBoBetSide.MatBonBonBon:
          pos = cc.v2(this.posMatBonBonBon.x, this.posMatBonBonBon.y);
          break;
        case cc.SicBoBetSide.MatNamNamNam:
          pos = cc.v2(this.posMatNamNamNam.x, this.posMatNamNamNam.y);
          break;
        case cc.SicBoBetSide.MatSauSauSau:
          pos = cc.v2(this.posMatSauSauSau.x, this.posMatSauSauSau.y);
          break;
        case cc.SicBoBetSide.BaoBatKy:
          pos = cc.v2(this.posBaoBatKy.x, this.posBaoBatKy.y);
          break;
      }
      let listChips = this.getListChip(betSide);
      let length = listChips.length;
      if (length < 7) {
        pos.y += listChips.length * 1.8;
      } else pos.y += 7 * 1.8;
      return pos;
    },
    getPosBetSide: function (betSide) {
      betSide = parseInt(betSide);
      let pos = null;
      switch (betSide) {
        case cc.SicBoBetSide.MatMot:
          pos = cc.v2(this.posMatMot.x, this.posMatMot.y);
          break;
        case cc.SicBoBetSide.MatHai:
          pos = cc.v2(this.posMatHai.x, this.posMatHai.y);
          break;
        case cc.SicBoBetSide.MatBa:
          pos = cc.v2(this.posMatBa.x, this.posMatBa.y);
          break;
        case cc.SicBoBetSide.MatBon:
          pos = cc.v2(this.posMatBon.x, this.posMatBon.y);
          break;
        case cc.SicBoBetSide.MatNam:
          pos = cc.v2(this.posMatNam.x, this.posMatNam.y);
          break;
        case cc.SicBoBetSide.MatSau:
          pos = cc.v2(this.posMatSau.x, this.posMatSau.y);
          break;
        case cc.SicBoBetSide.CuaTai:
          pos = cc.v2(this.posCuaTai.x, this.posCuaTai.y);
          break;
        case cc.SicBoBetSide.CuaXiu:
          pos = cc.v2(this.posCuaXiu.x, this.posCuaXiu.y);
          break;
        case cc.SicBoBetSide.CuaChan:
          pos = cc.v2(this.posCuaChan.x, this.posCuaChan.y);
          break;
        case cc.SicBoBetSide.CuaLe:
          pos = cc.v2(this.posCuaLe.x, this.posCuaLe.y);
          break;
        case cc.SicBoBetSide.MatMotHai:
          pos = cc.v2(this.posMatMotHai.x, this.posMatMotHai.y);
          break;
        case cc.SicBoBetSide.MatMotBa:
          pos = cc.v2(this.posMatMotBa.x, this.posMatMotBa.y);
          break;
        case cc.SicBoBetSide.MatMotBon:
          pos = cc.v2(this.posMatMotBon.x, this.posMatMotBon.y);
          break;
        case cc.SicBoBetSide.MatMotNam:
          pos = cc.v2(this.posMatMotNam.x, this.posMatMotNam.y);
          break;
        case cc.SicBoBetSide.MatMotSau:
          pos = cc.v2(this.posMatMotSau.x, this.posMatMotSau.y);
          break;
        case cc.SicBoBetSide.MatHaiBa:
          pos = cc.v2(this.posMatHaiBa.x, this.posMatHaiBa.y);
          break;
        case cc.SicBoBetSide.MatHaiBon:
          pos = cc.v2(this.posMatHaiBon.x, this.posMatHaiBon.y);
          break;
        case cc.SicBoBetSide.MatHaiNam:
          pos = cc.v2(this.posMatHaiNam.x, this.posMatHaiNam.y);
          break;
        case cc.SicBoBetSide.MatHaiSau:
          pos = cc.v2(this.posMatHaiSau.x, this.posMatHaiSau.y);
          break;
        case cc.SicBoBetSide.MatBaBon:
          pos = cc.v2(this.posMatBaBon.x, this.posMatBaBon.y);
          break;
        case cc.SicBoBetSide.MatBaNam:
          pos = cc.v2(this.posMatBaNam.x, this.posMatBaNam.y);
          break;
        case cc.SicBoBetSide.MatBaSau:
          pos = cc.v2(this.posMatBaSau.x, this.posMatBaSau.y);
          break;
        case cc.SicBoBetSide.MatBonNam:
          pos = cc.v2(this.posMatBonNam.x, this.posMatBonNam.y);
          break;
        case cc.SicBoBetSide.MatBonSau:
          pos = cc.v2(this.posMatBonSau.x, this.posMatBonSau.y);
          break;
        case cc.SicBoBetSide.MatNamSau:
          pos = cc.v2(this.posMatNamSau.x, this.posMatNamSau.y);
          break;
        case cc.SicBoBetSide.TongBon:
          pos = cc.v2(this.posTongBon.x, this.posTongBon.y);
          break;
        case cc.SicBoBetSide.TongNam:
          pos = cc.v2(this.posTongNam.x, this.posTongNam.y);
          break;
        case cc.SicBoBetSide.TongSau:
          pos = cc.v2(this.posTongSau.x, this.posTongSau.y);
          break;
        case cc.SicBoBetSide.TongBay:
          pos = cc.v2(this.posTongBay.x, this.posTongBay.y);
          break;
        case cc.SicBoBetSide.TongTam:
          pos = cc.v2(this.posTongTam.x, this.posTongTam.y);
          break;
        case cc.SicBoBetSide.TongChin:
          pos = cc.v2(this.posTongChin.x, this.posTongChin.y);
          break;
        case cc.SicBoBetSide.TongMuoi:
          pos = cc.v2(this.posTongMuoi.x, this.posTongMuoi.y);
          break;
        case cc.SicBoBetSide.TongMuoiMot:
          pos = cc.v2(this.posTongMuoiMot.x, this.posTongMuoiMot.y);
          break;
        case cc.SicBoBetSide.TongMuoiHai:
          pos = cc.v2(this.posTongMuoiHai.x, this.posTongMuoiHai.y);
          break;
        case cc.SicBoBetSide.TongMuoiBa:
          pos = cc.v2(this.posTongMuoiBa.x, this.posTongMuoiBa.y);
          break;
        case cc.SicBoBetSide.TongMuoiBon:
          pos = cc.v2(this.posTongMuoiBon.x, this.posTongMuoiBon.y);
          break;
        case cc.SicBoBetSide.TongMuoiNam:
          pos = cc.v2(this.posTongMuoiNam.x, this.posTongMuoiNam.y);
          break;
        case cc.SicBoBetSide.TongMuoiSau:
          pos = cc.v2(this.posTongMuoiSau.x, this.posTongMuoiSau.y);
          break;
        case cc.SicBoBetSide.TongMuoiBay:
          pos = cc.v2(this.posTongMuoiBay.x, this.posTongMuoiBay.y);
          break;
        case cc.SicBoBetSide.MatMotMot:
          pos = cc.v2(this.posMatMotMot.x, this.posMatMotMot.y);
          break;
        case cc.SicBoBetSide.MatHaiHai:
          pos = cc.v2(this.posMatHaiHai.x, this.posMatHaiHai.y);
          break;
        case cc.SicBoBetSide.MatBaBa:
          pos = cc.v2(this.posMatBaBa.x, this.posMatBaBa.y);
          break;
        case cc.SicBoBetSide.MatBonBon:
          pos = cc.v2(this.posMatBonBon.x, this.posMatBonBon.y);
          break;
        case cc.SicBoBetSide.MatNamNam:
          pos = cc.v2(this.posMatNamNam.x, this.posMatNamNam.y);
          break;
        case cc.SicBoBetSide.MatSauSau:
          pos = cc.v2(this.posMatSauSau.x, this.posMatSauSau.y);
          break;
        case cc.SicBoBetSide.MatMotMotMot:
          pos = cc.v2(this.posMatMotMotMot.x, this.posMatMotMotMot.y);
          break;
        case cc.SicBoBetSide.MatHaiHaiHai:
          pos = cc.v2(this.posMatHaiHaiHai.x, this.posMatHaiHaiHai.y);
          break;
        case cc.SicBoBetSide.MatBaBaBa:
          pos = cc.v2(this.posMatBaBaBa.x, this.posMatBaBaBa.y);
          break;
        case cc.SicBoBetSide.MatBonBonBon:
          pos = cc.v2(this.posMatBonBonBon.x, this.posMatBonBonBon.y);
          break;
        case cc.SicBoBetSide.MatNamNamNam:
          pos = cc.v2(this.posMatNamNamNam.x, this.posMatNamNamNam.y);
          break;
        case cc.SicBoBetSide.MatSauSauSau:
          pos = cc.v2(this.posMatSauSauSau.x, this.posMatSauSauSau.y);
          break;
        case cc.SicBoBetSide.BaoBatKy:
          pos = cc.v2(this.posBaoBatKy.x, this.posBaoBatKy.y);
          break;
      }
      pos.x + 15;
      pos.y + 10;
      return pos;
    },
    //Di chuyen chip cua player khi bet thanh cong
    moveChipBet: function (betValue, betSide, type, accID) {
      this.layoutChip.position = cc.v2(0, 0);
      if (!betSide || !betValue) return;
      try {
        betValue = parseInt(betValue);
        //Lay vi tri bat dau cua chip
        let posChipStart = this.posChips.position;
        if (type === cc.BacaratChipOf.USERS) {
          posChipStart = this.posGroupUsers.position;
          //Lay danh sach player
          let positionPlayerUI = this.controller.positionPlayerUI();
          let indexPosition = positionPlayerUI.indexOf(accID);
          if (indexPosition !== -1) {
            posChipStart = this.lstPosPlayer[indexPosition].position;
          }
        }
        let posChipEnd = this.randomPosChip(betValue, betSide);

        //Khoi tao chip
        let chip = this.controller.createChip(
          cc.SicBoMapChipSpriteFrame[betValue]
        );
        chip.parent = this.layoutChip;
        chip.setScale(0.66, 0.44);
        if (Date.now() - this.timePlaySound > 300) {
          cc.AudioController.getInstance().playSound(cc.AudioTypes.CHIP_BET);
          this.timePlaySound = Date.now();
        }
        switch (betSide) {
          case cc.SicBoBetSide.CuaTai:
            chip.setScale(0.84, 0.56);
            break;
          case cc.SicBoBetSide.CuaXiu:
            chip.setScale(0.84, 0.56);
            break;
        }
        chip.position = posChipStart;
        let moveAction = cc.moveTo(0.25, posChipEnd);

        if (!cc.game.isPaused()) {
          chip.runAction(moveAction);
        } else {
          chip.position = posChipEnd;
        }

        //Luu vi tri de di chuyen chip cho ket qua
        let positionEndChip = posChipStart;
        if (type === cc.BacaratChipOf.PLAYER) {
          positionEndChip = this.lstPosPlayer[0].position;
        }
        //Push node chip vao mang
        this.pushChipToArray(betSide, betValue, positionEndChip, chip);
      } catch (e) {
        console.log(e);
      }
    },
    pushCoinThiemThu: function (betSide) {
      this.controller.playDealerAnimXWin();

      cc.AudioController.getInstance().playSound(
        cc.AudioTypes.SICBO_THIEMTHU_CHANNELING
      );

      cc.director.getScheduler().schedule(
        function () {
          cc.AudioController.getInstance().playSound(
            cc.AudioTypes.SICBO_THIEMTHU_PUSH_COIN
          );
          for (let index = 0; index < 30; index++) {
            cc.director.getScheduler().schedule(
              function () {
                let nodeCoin = cc.instantiate(this.coinPrefab);
                nodeCoin.parent = this.posAppearCoinThiemThu;
                nodeCoin.position = this.posDealer.position;
                let posEnd = this.getPosBetSide(betSide);
                nodeCoin.children[0]
                  .getComponent(cc.Animation)
                  .play("coin-effect");
                let callBack = cc.callFunc(function () {
                  nodeCoin.destroy();
                }, this);
                let actionMove = cc.moveTo(1, posEnd);
                nodeCoin.runAction(cc.sequence(actionMove, callBack));
              },
              this,
              0,
              0,
              index * 0.1,
              false
            );
          }
        },
        this,
        0,
        0,
        4,
        false
      );
      cc.director.getScheduler().schedule(
        function () {
          cc.AudioController.getInstance().playSound(
            cc.AudioTypes.SICBO_THIEMTHU_HIT_TU
          );
        },
        this,
        0,
        0,
        5,
        false
      );
    },
    //Push chip vao mang
    pushChipToArray: function (betSide, betValue, position, chip) {
      let listChips = this.getListChip(betSide);
      if (listChips) {
        this.pushChipToListChips(betSide, [chip, betValue, position]);
      }
    },
    //Cap nhat chip cho betsession
    updateChipForBetSession: function (data) {
      if (data.length === 0) {
        return;
      }
      data.map((dataChip) => {
        if (dataChip.length === 0) {
          return;
        }

        dataChip.map((sideData) => {
          let betSide = parseInt(sideData.BetSide);
          let betValue = parseInt(sideData.BetValue);

          let chip = this.controller.createChip(
            cc.SicBoMapChipSpriteFrame[betValue]
          );

          // console.log('betValue: ', betValue);

          let positionChip = this.randomPosChip(betValue, betSide);
          chip.setScale(0.66, 0.44);
          chip.parent = this.layoutChip;
          chip.position = positionChip;
          let posChipEnd = this.posGroupUsers.position;
          //Lay danh sach player
          let positionPlayerUI = this.controller.positionPlayerUI();
          try {
            let indexPosition = positionPlayerUI.indexOf(sideData.AccountID);
            if (indexPosition !== -1) {
              posChipEnd = this.lstPosPlayer[indexPosition].position;
            }
            //Push node chip vao mang
            this.pushChipToArray(betSide, betValue, posChipEnd, chip);
          } catch (e) {
            console.log({ positionPlayerUI });
            console.log({ sideData });
            console.log(e);
          }
        }, this);
      }, this);
    },
    //Tra chip thang
    refundChips: function (sideWin) {
      sideWin = parseInt(sideWin);
      let lstChip = this.getListChip(sideWin);
      let totalTime = 0;

      if (lstChip.length === 0) {
        return;
      }
      lstChip.map((chip, index) => {
        try {
          index = index > 5 ? 5 : index;

          totalTime = index * 0.1;
          //Tao chip
          let chipRefund = this.controller.createChip(
            cc.SicBoMapChipSpriteFrame[chip[1]]
          );
          chipRefund.setScale(0.66, 0.44);
          if (Date.now() - this.timePlaySound > 300) {
            cc.AudioController.getInstance().playSound(cc.AudioTypes.CHIP_BET);
            this.timePlaySound = Date.now();
          }
          chipRefund.parent = this.layoutChip;
          chipRefund.position = this.posDealer.position;
          chipRefund.setPosition(
            (this.posDealer.position.x += (Math.random() - 0.5) * 30),
            this.posDealer.position.y - 90
          );
          let posEnd = this.randomPosChip(chip[1], sideWin);
          //Kiem tra game pause
          if (!cc.game.isPaused()) {
            let moveRefund = cc.moveTo(0.5, posEnd);
            cc.director.getScheduler().schedule(
              function () {
                chipRefund.runAction(moveRefund);
              },
              this,
              0,
              0,
              index * 0.1,
              false
            );
          } else {
            chipRefund.position = posEnd;
          }

          //Gan chip vao mang chipWin de di chuyen chip ve phia groupUser
          this.controller.setChipWin(chip[0], chip[1], chip[2]);
          this.controller.setChipWin(chipRefund, chip[1], chip[2]);
        } catch (e) {
          console.log(e);
        }
      }, this);

      //Tra chip ve cho user
      cc.director.getScheduler().schedule(
        function () {
          this.runRefundChipForUser();
        },
        this,
        0,
        0,
        totalTime + 1,
        false
      );
    },
    //Tra chip cho user
    runRefundChipForUser: function () {
      if (this.refunded) return;
      this.refunded = true;
      try {
        let chips = this.controller.getChipsWin();
        console.log("runRefundChipForUser");
        chips.forEach((chip, index) => {
          if (index > 5) {
            index = 5;
          }
          //Kiem tra game pause
          if (!cc.game.isPaused()) {
            setTimeout(() => {
              let posEnd = cc.v2(chip[2].x, chip[2].y);
              let c1 = cc.v2(chip[0].position.x, chip[0].position.y);
              let c2 = cc.v2(0, 0);
              c2.y = (posEnd.y + c1.y) / 2 + (Math.random() - 0.5) * 600;
              c2.x = (posEnd.x + c1.x) / 2 + (Math.random() - 0.5) * 600;
              const bezierConfig = [c1, c2, posEnd];
              var bezierToAction = cc.bezierTo(2, bezierConfig);
              chip[0].stopAllActions();
              chip[0].runAction(bezierToAction);
              cc.tween(chip[0])
                .to(2, { opacity: 130 })
                .call(() => {
                  if (Date.now() - this.timePlaySound > 300) {
                    cc.AudioController.getInstance().playSound(
                      cc.AudioTypes.CHIP_BET
                    );
                    this.timePlaySound = Date.now();
                  }
                  this.controller.putChipToPool(chip[0], chip[1]);
                  chip[0].opacity = 0;
                }, this)
                .start();
            }, index * 100);
          } else {
            this.controller.putChipToPool(chip[0], chip[1]);
          }
        });
        setTimeout(() => {
          let result = this.controller.getWinResult();
          if (result) {
            this.controller.winResult(result);
          }
          console.log('effectWhenchipdone');
        }, 2500);
      } catch (e) {
        console.log(e);
      }
    },
    //Lay list chip theo side
    getListChip: function (side) {
      let listChips = null;
      switch (side) {
        case cc.SicBoBetSide.MatMot:
          listChips = this.chipsMatMot;
          break;
        case cc.SicBoBetSide.MatHai:
          listChips = this.chipsMatHai;
          break;
        case cc.SicBoBetSide.MatBa:
          listChips = this.chipsMatBa;
          break;
        case cc.SicBoBetSide.MatBon:
          listChips = this.chipsMatBon;
          break;
        case cc.SicBoBetSide.MatNam:
          listChips = this.chipsMatNam;
          break;
        case cc.SicBoBetSide.MatSau:
          listChips = this.chipsMatSau;
          break;
        case cc.SicBoBetSide.CuaTai:
          listChips = this.chipsCuaTai;
          break;
        case cc.SicBoBetSide.CuaXiu:
          listChips = this.chipsCuaXiu;
          break;
        case cc.SicBoBetSide.CuaChan:
          listChips = this.chipsCuaChan;
          break;
        case cc.SicBoBetSide.CuaLe:
          listChips = this.chipsCuaLe;
          break;
        case cc.SicBoBetSide.MatMotHai:
          listChips = this.chipsMatMotHai;
          break;
        case cc.SicBoBetSide.MatMotBa:
          listChips = this.chipsMatMotBa;
          break;
        case cc.SicBoBetSide.MatMotBon:
          listChips = this.chipsMatMotBon;
          break;
        case cc.SicBoBetSide.MatMotNam:
          listChips = this.chipsMatMotNam;
          break;
        case cc.SicBoBetSide.MatMotSau:
          listChips = this.chipsMatMotSau;
          break;
        case cc.SicBoBetSide.MatHaiBa:
          listChips = this.chipsMatHaiBa;
          break;
        case cc.SicBoBetSide.MatHaiBon:
          listChips = this.chipsMatHaiBon;
          break;
        case cc.SicBoBetSide.MatHaiNam:
          listChips = this.chipsMatHaiNam;
          break;
        case cc.SicBoBetSide.MatHaiSau:
          listChips = this.chipsMatHaiSau;
          break;
        case cc.SicBoBetSide.MatBaBon:
          listChips = this.chipsMatBaBon;
          break;
        case cc.SicBoBetSide.MatBaNam:
          listChips = this.chipsMatBaNam;
          break;
        case cc.SicBoBetSide.MatBaSau:
          listChips = this.chipsMatBaSau;
          break;
        case cc.SicBoBetSide.MatBonNam:
          listChips = this.chipsMatBonNam;
          break;
        case cc.SicBoBetSide.MatBonSau:
          listChips = this.chipsMatBonSau;
          break;
        case cc.SicBoBetSide.MatNamSau:
          listChips = this.chipsMatNamSau;
          break;
        case cc.SicBoBetSide.TongBon:
          listChips = this.chipsTongBon;
          break;
        case cc.SicBoBetSide.TongNam:
          listChips = this.chipsTongNam;
          break;
        case cc.SicBoBetSide.TongSau:
          listChips = this.chipsTongSau;
          break;
        case cc.SicBoBetSide.TongBay:
          listChips = this.chipsTongBay;
          break;
        case cc.SicBoBetSide.TongTam:
          listChips = this.chipsTongTam;
          break;
        case cc.SicBoBetSide.TongChin:
          listChips = this.chipsTongChin;
          break;
        case cc.SicBoBetSide.TongMuoi:
          listChips = this.chipsTongMuoi;
          break;
        case cc.SicBoBetSide.TongMuoiMot:
          listChips = this.chipsTongMuoiMot;
          break;
        case cc.SicBoBetSide.TongMuoiHai:
          listChips = this.chipsTongMuoiHai;
          break;
        case cc.SicBoBetSide.TongMuoiBa:
          listChips = this.chipsTongMuoiBa;
          break;
        case cc.SicBoBetSide.TongMuoiBon:
          listChips = this.chipsTongMuoiBon;
          break;
        case cc.SicBoBetSide.TongMuoiNam:
          listChips = this.chipsTongMuoiNam;
          break;
        case cc.SicBoBetSide.TongMuoiSau:
          listChips = this.chipsTongMuoiSau;
          break;
        case cc.SicBoBetSide.TongMuoiBay:
          listChips = this.chipsTongMuoiBay;
          break;
        case cc.SicBoBetSide.MatMotMot:
          listChips = this.chipsMatMotMot;
          break;
        case cc.SicBoBetSide.MatHaiHai:
          listChips = this.chipsMatHaiHai;
          break;
        case cc.SicBoBetSide.MatBaBa:
          listChips = this.chipsMatBaBa;
          break;
        case cc.SicBoBetSide.MatBonBon:
          listChips = this.chipsMatBonBon;
          break;
        case cc.SicBoBetSide.MatNamNam:
          listChips = this.chipsMatNamNam;
          break;
        case cc.SicBoBetSide.MatNamNam:
          listChips = this.chipsMatNamNam;
          break;
        case cc.SicBoBetSide.MatSauSau:
          listChips = this.chipsMatSauSau;
          break;
        case cc.SicBoBetSide.MatMotMotMot:
          listChips = this.chipsMatMotMotMot;
          break;
        case cc.SicBoBetSide.MatHaiHaiHai:
          listChips = this.chipsMatHaiHaiHai;
          break;
        case cc.SicBoBetSide.MatBaBaBa:
          listChips = this.chipsMatBaBaBa;
          break;
        case cc.SicBoBetSide.MatBonBonBon:
          listChips = this.chipsMatBonBonBon;
          break;
        case cc.SicBoBetSide.MatNamNamNam:
          listChips = this.chipsMatNamNamNam;
          break;
        case cc.SicBoBetSide.MatSauSauSau:
          listChips = this.chipsMatSauSauSau;
          break;
        case cc.SicBoBetSide.BaoBatKy:
          listChips = this.chipsBaoBatKy;
          break;
      }
      return listChips;
    },
    pushChipToListChips: function (side, chipData) {
      switch (side) {
        case cc.SicBoBetSide.MatMot:
          this.chipsMatMot.push(chipData);
          break;
        case cc.SicBoBetSide.MatHai:
          this.chipsMatHai.push(chipData);
          break;
        case cc.SicBoBetSide.MatBa:
          this.chipsMatBa.push(chipData);
          break;
        case cc.SicBoBetSide.MatBon:
          this.chipsMatBon.push(chipData);
          break;
        case cc.SicBoBetSide.MatNam:
          this.chipsMatNam.push(chipData);
          break;
        case cc.SicBoBetSide.MatSau:
          this.chipsMatSau.push(chipData);
          break;
        case cc.SicBoBetSide.CuaTai:
          this.chipsCuaTai.push(chipData);
          break;
        case cc.SicBoBetSide.CuaXiu:
          this.chipsCuaXiu.push(chipData);
          break;
        case cc.SicBoBetSide.CuaChan:
          this.chipsCuaChan.push(chipData);
          break;
        case cc.SicBoBetSide.CuaLe:
          this.chipsCuaLe.push(chipData);
          break;
        case cc.SicBoBetSide.MatMotHai:
          this.chipsMatMotHai.push(chipData);
          break;
        case cc.SicBoBetSide.MatMotBa:
          this.chipsMatMotBa.push(chipData);
          break;
        case cc.SicBoBetSide.MatMotBon:
          this.chipsMatMotBon.push(chipData);
          break;
        case cc.SicBoBetSide.MatMotNam:
          this.chipsMatMotNam.push(chipData);
          break;
        case cc.SicBoBetSide.MatMotSau:
          this.chipsMatMotSau.push(chipData);
          break;
        case cc.SicBoBetSide.MatHaiBa:
          this.chipsMatHaiBa.push(chipData);
          break;
        case cc.SicBoBetSide.MatHaiBon:
          this.chipsMatHaiBon.push(chipData);
          break;
        case cc.SicBoBetSide.MatHaiNam:
          this.chipsMatHaiNam.push(chipData);
          break;
        case cc.SicBoBetSide.MatHaiSau:
          this.chipsMatHaiSau.push(chipData);
          break;
        case cc.SicBoBetSide.MatBaBon:
          this.chipsMatBaBon.push(chipData);
          break;
        case cc.SicBoBetSide.MatBaNam:
          this.chipsMatBaNam.push(chipData);
          break;
        case cc.SicBoBetSide.MatBaSau:
          this.chipsMatBaSau.push(chipData);
          break;
        case cc.SicBoBetSide.MatBonNam:
          this.chipsMatBonNam.push(chipData);
          break;
        case cc.SicBoBetSide.MatBonSau:
          this.chipsMatBonSau.push(chipData);
          break;
        case cc.SicBoBetSide.MatNamSau:
          this.chipsMatNamSau.push(chipData);
          break;
        case cc.SicBoBetSide.TongBon:
          this.chipsTongBon.push(chipData);
          break;
        case cc.SicBoBetSide.TongNam:
          this.chipsTongNam.push(chipData);
          break;
        case cc.SicBoBetSide.TongSau:
          this.chipsTongSau.push(chipData);
          break;
        case cc.SicBoBetSide.TongBay:
          this.chipsTongBay.push(chipData);
          break;
        case cc.SicBoBetSide.TongTam:
          this.chipsTongTam.push(chipData);
          break;
        case cc.SicBoBetSide.TongChin:
          this.chipsTongChin.push(chipData);
          break;
        case cc.SicBoBetSide.TongMuoi:
          this.chipsTongMuoi.push(chipData);
          break;
        case cc.SicBoBetSide.TongMuoiMot:
          this.chipsTongMuoiMot.push(chipData);
          break;
        case cc.SicBoBetSide.TongMuoiHai:
          this.chipsTongMuoiHai.push(chipData);
          break;
        case cc.SicBoBetSide.TongMuoiBa:
          this.chipsTongMuoiBa.push(chipData);
          break;
        case cc.SicBoBetSide.TongMuoiBon:
          this.chipsTongMuoiBon.push(chipData);
          break;
        case cc.SicBoBetSide.TongMuoiNam:
          this.chipsTongMuoiNam.push(chipData);
          break;
        case cc.SicBoBetSide.TongMuoiSau:
          this.chipsTongMuoiSau.push(chipData);
          break;
        case cc.SicBoBetSide.TongMuoiBay:
          this.chipsTongMuoiBay.push(chipData);
          break;
        case cc.SicBoBetSide.MatMotMot:
          this.chipsMatMotMot.push(chipData);
          break;
        case cc.SicBoBetSide.MatHaiHai:
          this.chipsMatHaiHai.push(chipData);
          break;
        case cc.SicBoBetSide.MatBaBa:
          this.chipsMatBaBa.push(chipData);
          break;
        case cc.SicBoBetSide.MatBonBon:
          this.chipsMatBonBon.push(chipData);
          break;
        case cc.SicBoBetSide.MatNamNam:
          this.chipsMatNamNam.push(chipData);
          break;
        case cc.SicBoBetSide.MatNamNam:
          this.chipsMatNamNam.push(chipData);
          break;
        case cc.SicBoBetSide.MatSauSau:
          this.chipsMatSauSau.push(chipData);
          break;
        case cc.SicBoBetSide.MatMotMotMot:
          this.chipsMatMotMotMot.push(chipData);
          break;
        case cc.SicBoBetSide.MatHaiHaiHai:
          this.chipsMatHaiHaiHai.push(chipData);
          break;
        case cc.SicBoBetSide.MatBaBaBa:
          this.chipsMatBaBaBa.push(chipData);
          break;
        case cc.SicBoBetSide.MatBonBonBon:
          this.chipsMatBonBonBon.push(chipData);
          break;
        case cc.SicBoBetSide.MatNamNamNam:
          this.chipsMatNamNamNam.push(chipData);
          break;
        case cc.SicBoBetSide.MatSauSauSau:
          this.chipsMatSauSauSau.push(chipData);
          break;
        case cc.SicBoBetSide.BaoBatKy:
          this.chipsBaoBatKy.push(chipData);
          break;
      }
    },
    //Lay chip thua
    getChipsLose: function (sideLose) {
      sideLose = parseInt(sideLose);
      let lstChip = this.getListChip(sideLose);
      if (lstChip.length === 0) {
        return;
      }
      lstChip.map((chip, index) => {
        try {
          if (index > 5) {
            index = 5;
          }
          let endPos = this.posDealer.position;
          endPos.x += (Math.random() - 0.5) * 30;
          endPos.y -= 90;
          //Kiem tra game pause
          if (!cc.game.isPaused()) {
            cc.director.getScheduler().schedule(
              function () {
                let moveEnd = cc.moveTo(0.5, endPos);
                let callBack = cc.callFunc(function () {
                  if (Date.now() - this.timePlaySound > 300) {
                    cc.AudioController.getInstance().playSound(
                      cc.AudioTypes.CHIP_BET
                    );
                    this.timePlaySound = Date.now();
                  }
                  this.controller.putChipToPool(chip[0], chip[1]);
                  //chip[0].removeFromParent(true);
                }, this);
                chip[0].runAction(cc.sequence(moveEnd, callBack));
              },
              this,
              0,
              0,
              index * 0.1,
              false
            );
          } else {
            this.controller.putChipToPool(chip[0], chip[1]);
            //chip[0].removeFromParent(true);
          }
        } catch (e) {
          console.log(e);
        }
      }, this);
      //Reset list
      lstChip = [];
    },

    clearAllChips: function () {
      this.refunded = false;
      this.controller.clearPools();
      this.layoutChip.removeAllChildren();
    },
  });
}).call(this);