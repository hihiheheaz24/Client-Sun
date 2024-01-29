/**
 * Created by Nofear on 3/15/2019.
 */

(function () {
    cc.MyJackpotView = cc.Class({
        "extends": cc.Component,
        properties: {
            lblDisplayName: cc.Label,
            buttonFirst: cc.Button,
            buttonBack: cc.Button,
            listButton: [cc.Button],
            buttonLast: cc.Button,
            buttonNext: cc.Button,
            listItem: [cc.Node],
        },
        
        onLoad(){
            this.totalItemOfPage = 10;
            this.resetAllItem();
            this.totalPage = 10;
            this.currentPage = 1;
            this.data = [];
        },
        getInfo: function () {
            var getMyJackpotCommand = new cc.GetMyJackpotCommand;
            getMyJackpotCommand.execute(this);
        },
        onGetMyJackpotResponse: function (response) {
            if (response !== null) {
                response.forEach((item, index) =>{
                    item['Page'] = Math.floor(index/this.totalItemOfPage) + 1;
                    item['Username'] = this.setCharAt(item['Username'],item['Username'].length -1,'*');
                    item['Username'] = this.setCharAt(item['Username'],item['Username'].length -2,'*');
                    item['Username'] = this.setCharAt(item['Username'],item['Username'].length -3,'*');                 
                });
                this.data = response;
                this.totalPage = parseInt(this.data.length/10);
                this.updateUIButton(this.currentPage);
                this.updateDataByPageIndex(this.currentPage);
            }
        },
        updateDataByPageIndex(pageIndex){
            // {
                    //     "Username": "906899336",
                    //     "PrizeValue": 9739088,
                    //     "CreatedTime": "2023-09-12T20:12:00.063",
                    //     "GameID": 3,
                    //     "RoomID": 2,
                    //     "ServiceID": 1,
                    //     "GameName": "Sấm Truyền"
                    // }
            this.resetAllItem();
            const result = this.data.filter(item => item.Page == pageIndex);
            this.listItem.forEach((item,index)=>{
                if(result[index]){
                    item.active = true;
                    item.getChildByName("gameName").getComponent(cc.Label).string = result[index].GameName;
                    item.getChildByName("time").getComponent(cc.Label).string = result[index].CreatedTime.slice(0,19).replace("T"," ");
                    item.getChildByName("displayName").getComponent(cc.Label).string = result[index].Username;
                    item.getChildByName("jpCount").getComponent(cc.Label).string = result[index].ServiceID;
                    item.getChildByName("win").getComponent(cc.Label).string = cc.Tool.getInstance().formatNumber(result[index].PrizeValue);

                } else {
                    item.active = false;
                }
            });
    
        },
    
    
        updateUIButton(pageIndex){
            if (this.totalPage <= 5) {
                this.buttonFirst.interactable = false;
                this.buttonBack.interactable = false;
                this.buttonLast.interactable = false;
                this.buttonNext.interactable = false;
                this.listButton.forEach((button, index) => {
                    button.interactable = index < this.totalPage;
                });
                return;
            }
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
            this.lblDisplayName.string = cc.LoginController.getInstance().getNickname() ? `Tên nhân vật: ${cc.LoginController.getInstance().getNickname()}` : "";
            this.node.active = true;
            this.getInfo();
            this.buttonFirst.interactable = false;
            this.buttonBack.interactable = false;
            this.buttonLast.interactable = false;
            this.buttonNext.interactable = false;
            this.listButton.forEach((button)=>{
                button.interactable = false;
            });
        },
    
        setCharAt(str,index,chr) {
            if(index > str.length-1) return str;
            return str.substring(0,index) + chr + str.substring(index+1);
        },

    });
}).call(this);
