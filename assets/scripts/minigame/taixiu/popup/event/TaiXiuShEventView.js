// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        historyNode:cc.Node,
        statisticNode:cc.Node,
        ruleNode:cc.Node,
        btnHistory:cc.Button,
        btnStatistic:cc.Button,
        btnRule:cc.Button,
        historyContent:cc.Node,
        statisticContent:cc.Node,
        itemHistory:cc.Node,
        itemStatistic:cc.Node
    },
    onLoad () {
        
        this.historyNode.active = true;
        this.btnHistory.interactable = false;
        this.currentTab = this.historyNode;
        this.currentBtnTab = this.btnHistory;
        this.getHistory();
    },
    changeTabClicked:function(event,tabName)
    {
        this.currentTab.active = false;
        this.currentBtnTab.interactable = true;
        switch (tabName) {
            case 'history':
                this.historyNode.active = true;
                this.btnHistory.interactable = false;
                this.currentTab = this.historyNode;
                this.currentBtnTab = this.btnHistory;
                this.resetHistory();
                this.getHistory();
                break;
            case 'statistic':
                this.statisticNode.active = true;
                this.btnStatistic.interactable = false;
                this.currentTab = this.statisticNode;
                this.currentBtnTab = this.btnStatistic;
                this.resetStatistic();
                var tXGetEventShCommand = new cc.TXGetEventShCommand;
                tXGetEventShCommand.getStatisticByBoxID(this,'0');
                break;
            case 'rule':
                this.ruleNode.active = true;
                this.btnRule.interactable = false;
                this.currentTab = this.ruleNode;
                this.currentBtnTab = this.btnRule;
                break;
        }
    },
    resetHistory:function()
    {            
        var children = this.historyContent.children;
        for (var i = children.length - 1; i >= 0; i--) {
            this.historyContent.removeChild(children[i]);
        }
    },
    getHistory: function () {
        var tXGetEventShCommand = new cc.TXGetEventShCommand;
        tXGetEventShCommand.getHistory(this);
    },// 
    onGetEventShHistoryResponse:function(response)
    {
        console.log(response);
        var index = 0;
        response.forEach(data => {
            var itemNode = cc.instantiate(this.itemHistory);
            this.historyContent.addChild(itemNode);
            itemNode.getComponent(cc.TaiXiuShEventHistoryItem).updateItem(data,index);
            index++;
        });
    },
    resetStatistic:function()
    {            
        var children = this.statisticContent.children;
        for (var i = children.length - 1; i >= 0; i--) {
            this.statisticContent.removeChild(children[i]);
        }
    },
    getStatistic: function (event,boxID) {
        this.resetStatistic();
        var tXGetEventShCommand = new cc.TXGetEventShCommand;
        tXGetEventShCommand.getStatisticByBoxID(this,boxID);
    },// onLoad () {},
    onGetStatisticResponse:function(response)
    {
        console.log(response);
        var index = 0;
        response.forEach(data => {
            var itemNode = cc.instantiate(this.itemStatistic);
            this.statisticContent.addChild(itemNode);
            itemNode.getComponent(cc.TaiXiuShEventStatisticItem).updateItem(data,index);
            index++;
        });
    },
    closeFinished: function () {
        cc.TaiXiuMainController.getInstance().destroyEventShView();
    }
});
