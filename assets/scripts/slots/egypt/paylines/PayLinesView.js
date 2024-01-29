/**
 * Created by Nofear on 3/14/2019.
 */
const {ccclass, property} = cc._decorator;

const WILD_SYMBOL = "1";
const FREE_GAME_WILD_SYMBOL = "101";
@ccclass("LineIconsGroup")
export class LineIconsGroup {
    @property([cc.Node])
    groupIconByLine = []
}

(function () {
    cc.PayLinesView = cc.Class({
        "extends": cc.PayLinesViewBase,
        properties: {
            IconByLines: {
                type: LineIconsGroup,
                default: [],
            }
        },

        onLoad: function () {
            cc.PayLinesController.getInstance().setPayLinesView(this);
            cc.GaiNhayPayLinesController.getInstance().setPayLinesView(this);
        },

        showLine: function () {
            var self = this;
            let prize = this.prizeLines[this.index];
            let items = prize.Items;
            const symbolIndex = prize.Items[0];
            this.showLineID(prize.LineID);
            //neu la freespin mode thi lay icon freespin
            let slotsData = null;
            if (cc.FreeSpinController.getInstance().getStateFreeSpin()) {
                slotsData = cc.SpinController.getInstance().getSpinResponse().FreeSpinData.SlotsData;
            } else {
                slotsData = cc.SpinController.getInstance().getSpinResponse().SpinData.SlotsData;
            }
            const matrix = [...slotsData];
            const symbolName = matrix[symbolIndex - 1];
            this.showIconByLineID(prize.LineID, symbolName);
            this.stopHighlight();

            if (self.iconSkeletons.length > 0) {
                items.forEach(function (iconId) {
                    //self.animationIcons[iconId - 1].play('slotHighlight');
                    self.iconSkeletons[iconId - 1].setAnimation(1, 'win', false);
                });
            }

            this.index++;
            if (this.index === this.totalPrizes) {
                this.index = 0;
            }
        },

        stopGameEffect: function () {
            cc.EffectController.getInstance().stopEffect();
        },

        showSelectedLines(linesNumber) {
            this.node.children.forEach(child => child.active = false);
            for(let i = 0; i < linesNumber; i++) {
                this.node.children[i].active = true;
            }
        },

        showIconByLineID: function(lineID, symbolId) {
            this.IconByLines[lineID - 1].groupIconByLine.forEach((iconAnimation, index) => {
                const symbolName = iconAnimation.children[0].name;
                if (symbolName == symbolId || symbolName == WILD_SYMBOL || symbolName == FREE_GAME_WILD_SYMBOL) {
                    if (cc.FreeSpinController.getInstance().getStateFreeSpin()) {
                        iconAnimation.children[0].getComponent(cc.Animation).play(`iconfs${symbolName}`);
                    } else {
                        iconAnimation.children[0].getComponent(cc.Animation).play(`icon${symbolName}`);
                    }
                }
            });
        },
    });
}).call(this);
