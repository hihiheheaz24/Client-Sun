/**
 * Created by Nofear on 3/14/2019.
 */


(function () {
    cc.HelpView = cc.Class({
        "extends": cc.Component,
        properties: {
            nodeGuide: [cc.Node],

            _guideIndex: 0,
        },

        onClickNextGuide() {
            this._guideIndex++;
            if(this._guideIndex === this.nodeGuide.length) {
                this._guideIndex = 0;
            }
            this.activeGuide(this._guideIndex);
        },

        onClickPreviousGuide() {
            this._guideIndex--;
            if(this._guideIndex < 0) {
                this._guideIndex = this.nodeGuide.length - 1;
            }
            this.activeGuide(this._guideIndex);
        },

        activeGuide(index) {
            this.nodeGuide.forEach(node => {
                node.active = false;
            });

            this.nodeGuide[index].active = true;
        },

        closeClick: function() {
            this.node.destroy();
        }
    });
}).call(this);
