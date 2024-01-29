// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        topNode:cc.Node,
        ruleNode:cc.Node,
        btnTopDay:cc.Button,
        btnTopMonth:cc.Button,
        btnRule:cc.Button,
        topWinContent:cc.Node,
        topLoseContent:cc.Node,
        monthSelectorContent:cc.Node,
        daySelectorContent:cc.Node,
        itemTop:cc.Node,
        itemViewMoreWin:cc.Node,
        itemViewMoreLose:cc.Node,
        itemDay:cc.Node,
        itemMonth:cc.Node,
        labelCurrentMonth:cc.Label,
        labelCurrentDay:cc.Label,
        daySelectorNode:cc.Node,
        monthSelectorNode:cc.Node,
        daySelectorContainer:cc.Node,
    },
    onLoad () {
        this.isViewMoreWin = false;
        this.isViewMoreLose = false;
        this.topNode.active = true;
        this.btnTopDay.interactable = false;
        this.currentTab = this.topNode;
        this.currentBtnTab = this.btnTopDay;
        this.getTop(false);
        this.selectedMonth = 0;
        this.selectedDate = new Date().getDate();
        this.isViewingTopDay = true;
        this.renderDaySelector();
        this.renderMonthSelector();
        let dateTime = new Date();
        this.choosenDate = dateTime;
        this.labelCurrentMonth.string = (dateTime.getMonth()+1)+'/'+dateTime.getFullYear();
        this.labelCurrentDay.string = dateTime.getDate()+'/'+(dateTime.getMonth()+1)+'/'+dateTime.getFullYear()+'(hôm nay)';
    },
    changeTabClicked:function(event,tabName)
    {
        this.choosenDate = new Date();
        this.currentTab.active = false;
        this.currentBtnTab.interactable = true;
        switch (tabName) {
            case 'topDay':
                this.topNode.active = true;
                this.btnTopDay.interactable = false;
                this.currentTab = this.topNode;
                this.currentBtnTab = this.btnTopDay;
                this.isViewingTopDay = true;
                this.daySelectorContainer.active = true;
                this.getTop(false);
                break;
            case 'topMonth':
                this.topNode.active = true;
                this.btnTopMonth.interactable = false;
                this.currentTab = this.topNode;
                this.isViewingTopDay = false;
                this.daySelectorContainer.active = false;
                this.currentBtnTab = this.btnTopMonth;
                this.getTop(true);
                break;
            case 'rule':
                this.ruleNode.active = true;
                this.btnRule.interactable = false;
                this.currentTab = this.ruleNode;
                this.currentBtnTab = this.btnRule;
                break;
        }
    },
    resetTop:function()
    {            
        var children = this.topWinContent.children;
        for (var i = children.length - 1; i >= 0; i--) {
            this.topWinContent.children[i].destroy();
        }
        children = this.topLoseContent.children;
        for (var i = children.length - 1; i >= 0; i--) {
            this.topLoseContent.children[i].destroy();
        }
    },
    getTop: function (isMonth) {
        if(!this.choosenDate)
        this.choosenDate = new Date();
        var txGetEventTienTriCommand = new cc.TXGetEventTientriCommand;
        txGetEventTienTriCommand.excute(this,isMonth,this.choosenDate);
        this.resetTop();
    },// 
    selectMonth: function (event,offsetMonth) {
        let chosenMonth = -parseInt(offsetMonth);
        this.openMonthSelector();
        if (this.selectedMonth==chosenMonth) {
            return;
        }
        this.selectedMonth = chosenMonth;
        var now = new Date();
        var dateTime = new Date(now.getFullYear(),now.getMonth()+chosenMonth+1,0);
        if (this.isViewingTopDay) {
            if (chosenMonth==0) {
                this.choosenDate = new Date();
                this.labelCurrentDay.string = this.choosenDate.getDate()+'/'+(this.choosenDate.getMonth()+1)+'/'+this.choosenDate.getFullYear()+'(hôm nay)';
                this.labelCurrentMonth.string = (this.choosenDate.getMonth()+1)+'/'+this.choosenDate.getFullYear()
            }
            else
            {
                dateTime = new Date(dateTime.getFullYear(),dateTime.getMonth()+1,0)
                this.choosenDate = dateTime;
                this.labelCurrentDay.string = dateTime.getDate()+'/'+(dateTime.getMonth()+1)+'/'+dateTime.getFullYear();
                this.labelCurrentMonth.string = (dateTime.getMonth()+1)+'/'+dateTime.getFullYear()
            }
        }
        else
        {
                this.choosenDate = dateTime;
                this.labelCurrentMonth.string = (dateTime.getMonth()+1)+'/'+dateTime.getFullYear();           
        }
        this.getTop(!this.isViewingTopDay);
        this.renderDaySelector();
    },//
    selectDay: function (event,choosingDate) {
        this.openDaySelector();
        choosingDate = parseInt(choosingDate+1);
        if (this.selectedDate==choosingDate) {
            return;
        }
        this.selectedDate = choosingDate;
        // var now = new Date(now.getFullYear(),now.getMonth()+this.selectedMonth,0);
        var now = new Date();
        now.setMonth(now.getMonth()+this.selectedMonth);
        var dateTime = new Date();
        dateTime = now;
        dateTime.setDate(choosingDate);
        this.choosenDate = dateTime;
        if (choosingDate==new Date().getDate()&&this.selectMonth==0) {
            this.labelCurrentDay.string = dateTime.getDate()+'/'+(dateTime.getMonth()+1)+'/'+dateTime.getFullYear()+'(hôm nay)';
        }
        else
        {
            this.labelCurrentDay.string = dateTime.getDate()+'/'+(dateTime.getMonth()+1)+'/'+dateTime.getFullYear();
        }
        this.getTop(false);
    },//
    renderMonthSelector:function()
    {
        let now = new Date();
        let startDate = new Date(2019,0,1);
        let offsetMonth = 0;
        while(now>startDate)
        {
            var item = cc.instantiate(this.itemMonth);
            this.monthSelectorContent.addChild(item);
            item.getComponentInChildren(cc.Label).string = (now.getMonth()+1)+'/'+now.getFullYear();
            const clickEventHandler = new cc.Component.EventHandler();
            // This node is the node to which your event handler code component belongs
            clickEventHandler.target = this.node;
            // This is the script class name
            clickEventHandler.component = 'TaiXiuTienTriEventView';
            clickEventHandler.handler = 'selectMonth';
            clickEventHandler.customEventData = offsetMonth;

            item.getComponent(cc.Button).clickEvents.push(clickEventHandler);
            now.setMonth(now.getMonth()-1);
            offsetMonth++;
        }
    },
    renderDaySelector:function()
    {
        var children = this.daySelectorContent.children;
        for (var i = children.length - 1; i >= 0; i--) {
            this.daySelectorContent.children[i].destroy();
        }
        let dateTime = this.choosenDate;
        dateTime = new Date(dateTime.getFullYear(),dateTime.getMonth()+1,0)
        let totalDayInMonth = dateTime.getDate();
        for (let index = 0; index < totalDayInMonth; index++)
        {
            var item = cc.instantiate(this.itemDay);
            this.daySelectorContent.addChild(item);
            if (this.selectedMonth==0&&(index+1)== new Date().getDate()) {
                item.getComponentInChildren(cc.Label).string = (index+1)+'/'+(dateTime.getMonth()+1)+'/'+dateTime.getFullYear()+'(hôm nay)';
            }
            else
                item.getComponentInChildren(cc.Label).string = (index+1)+'/'+(dateTime.getMonth()+1)+'/'+dateTime.getFullYear();
            const clickEventHandler = new cc.Component.EventHandler();
            // This node is the node to which your event handler code component belongs
            clickEventHandler.target = this.node;
            // This is the script class name
            clickEventHandler.component = 'TaiXiuTienTriEventView';
            clickEventHandler.handler = 'selectDay';
            clickEventHandler.customEventData = index;

            item.getComponent(cc.Button).clickEvents.push(clickEventHandler);
        }
    },
    openDaySelector:function()
    {
        this.daySelectorNode.active = !this.daySelectorNode.active;
    },
    openMonthSelector:function()
    {
        this.monthSelectorNode.active = !this.monthSelectorNode.active;
    },
    onGetEventTienTriResponse:function(response)
    {
        this.resetTop();
        this.tempResponse = response;
        var topWinList = response.ListWinChain;
        var topLoseList = response.ListLossChain;
        if (topWinList&&topWinList.length>0&&topLoseList&&topLoseList.length>0) {
            var index = 0;
            let numberToViewWin = this.isViewMoreWin?10:3;
            let numberToViewLose = this.isViewMoreLose?10:3;
            topWinList.forEach(data => {
                if(index<numberToViewWin)
                {
                    var itemNode = cc.instantiate(this.itemTop);
                    this.topWinContent.addChild(itemNode);
                    itemNode.getComponent(cc.TaiXiuTienTriEventTopItem).updateItem(data,index);
                    index++;
                }
            });
            var index = 0;
            topLoseList.forEach(data => {
                if(index<numberToViewLose)
                {
                    var itemNode = cc.instantiate(this.itemTop);
                    this.topLoseContent.addChild(itemNode);
                    itemNode.getComponent(cc.TaiXiuTienTriEventTopItem).updateItem(data,index);
                    index++;
                }
            });
            var viewMoreWin = cc.instantiate(this.itemViewMoreWin);
            if (this.isViewMoreWin) {
                viewMoreWin.getComponentInChildren(cc.Label).string = "THU GỌN";
            }
            this.topWinContent.addChild(viewMoreWin);
            var viewMorLose = cc.instantiate(this.itemViewMoreLose);
            if (this.viewMorLose) {
                viewMorLose.getComponentInChildren(cc.Label).string = "THU GỌN";
            }
            this.topLoseContent.addChild(viewMorLose);
        }
        
    },
    viewMoreWin:function()
    {
        this.isViewMoreWin = !this.isViewMoreWin;
        var topWinList = this.tempResponse.ListWinChain;
        if(this.isViewMoreWin)
        {
            this.topWinContent.children[3].destroy();
            for (let index = 3; index < topWinList.length; index++) {
                var itemNode = cc.instantiate(this.itemTop);
                this.topWinContent.addChild(itemNode);
                itemNode.getComponent(cc.TaiXiuTienTriEventTopItem).updateItem(topWinList[index],index);
            }
        }
        else
        {
            for (let index = 3; index < this.topWinContent.children.length; index++) {
                this.topWinContent.children[index].destroy();
            }
        }
        var viewMoreWin = cc.instantiate(this.itemViewMoreWin);
        if (this.isViewMoreWin) {
            viewMoreWin.getComponentInChildren(cc.Label).string = "THU GỌN";
        }
        this.topWinContent.addChild(viewMoreWin);
    },
    viewMoreLose:function()
    {
        this.isViewMoreLose = !this.isViewMoreLose;
        var topLoseList = this.tempResponse.ListLossChain;
        if(this.isViewMoreLose)
        {
            this.topLoseContent.children[3].destroy();
            for (let index = 3; index < topLoseList.length; index++) {
                var itemNode = cc.instantiate(this.itemTop);
                this.topLoseContent.addChild(itemNode);
                itemNode.getComponent(cc.TaiXiuTienTriEventTopItem).updateItem(topLoseList[index],index);
            }
        }
        else
        {
            for (let index = 3; index < this.topLoseContent.children.length; index++) {
                this.topLoseContent.children[index].destroy();
            }
        }
        var viewMoreLose = cc.instantiate(this.itemViewMoreLose);
        if (this.isViewMoreLose) {
            viewMoreLose.getComponentInChildren(cc.Label).string = "THU GỌN";
        }
        this.topLoseContent.addChild(viewMoreLose);
    },
    closeFinished: function () {
        cc.TaiXiuMainController.getInstance().destroyEventTienTriView();
    }
});
