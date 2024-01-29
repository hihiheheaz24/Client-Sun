// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,
    properties: {
        MainGroupList: cc.Node,
        pageListView:cc.Node,
        CardGroup: cc.Node,
        CasinoGroup:cc.Node,
        SlotsGroup: cc.Node,
        LotteryGroup:cc.Node,
        SkillGroup:cc.Node,
        SportGroup:cc.Node,
        btnBack:cc.Node,
        pageController:cc.Node,
        btnNext:cc.Node,
        btnNextPage:cc.Node,
        btnPrevious:cc.Node,
        btnPreviousPage:cc.Node,
        lbPageNumber:cc.Label,
    },
    onLoad:function(){
        this.currentType = '';
        this.currentPageIndex = 0;
        this.timeSwitchPage = 0.3;
        this.pageView = null;
        this.lbPageNumber.string = `${this.currentPageIndex+1}`;
    },
    

    openGroup:function(event, type)
    {
        this.MainGroupList.active = false;
        this.pageListView.active = true;
        this.CardGroup.active = this.CasinoGroup.active = this.SlotsGroup.active = this.LotteryGroup.active = this.SkillGroup.active = this.SportGroup.active = false;
        this.btnBack.active = !this.btnBack.active;
        this.pageController.active = false;
        this.currentType = type;
        switch(type)
        {
            case 'card':
                 this.CardGroup.active = !this.CardGroup.active;
                 break;
            case 'casino': 
                this.CasinoGroup.active = !this.CasinoGroup.active; break;
            case 'slots': 
                this.SlotsGroup.active = !this.SlotsGroup.active;
                this.pageController.active = true;
                break;
            case 'lottery': 
                this.LotteryGroup.active = !this.LotteryGroup.active; break;
            case 'skill': 
                this.SkillGroup.active = !this.SkillGroup.active;
                this.pageController.active = true;
                break;
            case 'sport': 
                this.SportGroup.active = !this.SportGroup.active; break;
            case 'back':
                this.MainGroupList.active = true;
                this.pageListView.active = false;
                break;
        }
    },
    onPageController:function(event, data){
        switch(this.currentType){
            case 'card':
                this.pageView = this.CardGroup.getComponent(cc.PageView);
                break;
            case 'casino': 
                break;
            case 'slots': 
                this.pageView = this.SlotsGroup.getComponent(cc.PageView);
                break;
            case 'lottery': 
                this.pageView = this.LotteryGroup.getComponent(cc.PageView); 
                break;
            case 'skill': 
                this.pageView = this.SkillGroup.getComponent(cc.PageView);
            case 'sport': 
                break;
            case 'back':
                break;
        }
        if(!this.pageView){
            return;
        }
        switch(data){
            case 'next':
            case 'nextPage':
                this.currentPageIndex = this.pageView.getCurrentPageIndex() + 1;
                this.checkStatusButton();
                break;
            case 'previous':
            case 'previousPage':
                this.currentPageIndex = this.pageView.getCurrentPageIndex() - 1;
                this.checkStatusButton();
                break;
        }
    },
    checkStatusButton: function () {
        let totalPage = this.pageView.getPages().length;
        if(this.currentPageIndex<0){
            this.currentPageIndex = 0;
            this.btnPrevious.interactable = false;
            this.btnPreviousPage.interactable = false;
        } else {
            this.btnPrevious.interactable = true;
            this.btnPreviousPage.interactable = true;
        }

        if (this.currentPageIndex >=  totalPage) {
            this.currentPageIndex = totalPage - 1;
            this.btnNext.interactable = false;
            this.btnNextPage.interactable = false;
        } else {
            this.btnNext.interactable = true;
            this.btnNextPage.interactable = true;
        }
        this.pageView.scrollToPage(this.currentPageIndex, this.timeSwitchPage);
        this.lbPageNumber.string = `${this.currentPageIndex+1}`;
    },

});
