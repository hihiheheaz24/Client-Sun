/**
 * Created by Nofear on 6/7/2017.
 */

(function () {
    cc.TaiXiuMainView = cc.Class({
        "extends": cc.PopupViewBase,
        properties: {
            prefabGraph: cc.Prefab, //soi cau
           // prefabUserWinJackpot: cc.Prefab
        },

        onLoad: function () {
            cc.TaiXiuMainController.getInstance().setTaiXiuMainView(this);
        },

        createGraphView: function () {
            this.nodeGraphView = this.createView(this.prefabGraph);
        },

        destroyGraphView: function () {
            if (this.nodeGraphView)
                this.nodeGraphView.destroy();
        },

      //  createUserWinJackpotView: function () {
          //  this.nodeUserWinJackpot = this.createView(this.prefabUserWinJackpot);
       // },

      //  destroyUserWinJackpotView: function () {
          //  if (this.nodeUserWinJackpot)
              //  this.nodeUserWinJackpot.destroy();
    //    },
    });
}).call(this);
