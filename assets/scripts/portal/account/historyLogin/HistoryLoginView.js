cc.Class({
    extends: cc.Component,

    properties: {
        buttonFirst: cc.Button,
        buttonBack: cc.Button,
        listButton: [cc.Button],
        buttonLast: cc.Button,
        buttonNext: cc.Button,
        listItem: [cc.Node]
        },

    onLoad(){
        this.totalItemOfPage = 10;
        this.resetAllItem();
        this.totalPage = 999;
        this.currentPage = 1;
        this.data = [];
    },

    updateDataByPageIndex(pageIndex){
        this.resetAllItem();
        const result = this.data.filter(item => item.Page == pageIndex);
        this.listItem.forEach((item,index)=>{
            if(result[index]){
                item.active = true;
                item.getComponent(cc.HistoryLoginItem).updateItem(result[index],pageIndex*this.totalItemOfPage+index);
            } else {
                item.active = false;
            }
        });

    },


    updateUIButton(pageIndex){
        let buttonActive = 3;
        let numberFrom = pageIndex - 2;
       
        this.buttonFirst.interactable = true;
        this.buttonBack.interactable = true;
       
        this.buttonLast.interactable = true;
        this.buttonNext.interactable = true;
      
        if(pageIndex == 1){
            this.buttonFirst.interactable = false;
            this.buttonBack.interactable = false;
            buttonActive = 1;
            numberFrom = 1;
        }

        if(pageIndex == 2){
            buttonActive = 2
            numberFrom = 1;
        }

        if(pageIndex == this.totalPage){
            this.buttonLast.interactable = false;
            this.buttonNext.interactable = false;
            buttonActive = 5;
            numberFrom = this.totalPage - 4;
        }

        if(pageIndex == this.totalPage - 1){  
            buttonActive = 4;
            numberFrom = this.totalPage - 4;
        }
        let color = cc.Color.WHITE;
        let colorActive = new cc.Color(148,19,132) //"#941384"
        let colorNormal = new cc.Color(103,7,91) //"#67075B"
        this.listButton.forEach((button,index)=>{
            if(index == buttonActive - 1){
                button.normalColor  = colorActive
                button.interactable = true;
               
            } else {
                button.normalColor = colorNormal
                button.interactable = true;
               
            }
            button.node.getChildByName("Label").getComponent(cc.Label).string = numberFrom + index
            if (numberFrom+index<=0) {
                button.node.active = false;
            }
        });
    },


    clickButtonFirstPage(){
        this.currentPage = 1;
        this.updateUIButton(this.currentPage);
        this.updateDataByPageIndex(this.currentPage);

    },

    clickButtonLastPage(){
        this.currentPage = this.totalPage;
        this.updateUIButton(this.currentPage);
        this.updateDataByPageIndex(this.currentPage);

    },

    clickButtonBackPage(){
        if(this.currentPage == 1) return; 
        this.currentPage--;
        this.updateUIButton(this.currentPage);
        this.updateDataByPageIndex(this.currentPage);
    },
    
    clickButtonNextPage(){
        if(this.currentPage == this.totalPage) return; 
        this.currentPage++;
        this.updateUIButton(this.currentPage);
        this.updateDataByPageIndex(this.currentPage);
    },

    clickButtonPage(event, index){
        let pageString = this.listButton[parseInt(index)].node.getChildByName("Label").getComponent(cc.Label).string;
        this.currentPage = parseInt(pageString)
        this.updateUIButton(this.currentPage);
        this.updateDataByPageIndex(this.currentPage);
    },

    resetAllItem(){
        this.listItem.forEach(item=>{
            item.active = false;
        });
    },

    onEnable () {
        this.node.active = true;
        let GetHistoryLoginCommand = new cc.GetHistoryLoginCommand;
        GetHistoryLoginCommand.execute(this);
        this.buttonFirst.interactable = false;
        this.buttonBack.interactable = false;
        this.buttonLast.interactable = false;
        this.buttonNext.interactable = false;
        this.listButton.forEach((button)=>{
            button.interactable = false;
        });
    },

    onGetHistoryLoginSuccess (response) {
        let data = response.list;
        if (data !== null && data.length > 0) {
            data.forEach((item, index) =>{
                item['Page'] = Math.floor(index/this.totalItemOfPage) + 1;   
            })
            this.data = data;
            this.totalPage = Math.ceil(parseFloat(data.length/this.totalItemOfPage));
            this.updateUIButton(this.currentPage);
            this.updateDataByPageIndex(this.currentPage);
        }
       
    },
    onGetHistoryLoginError (response) {
        console.log(response);       
    },

    closeClicked () {
        this.node.destroy();
    },


});
