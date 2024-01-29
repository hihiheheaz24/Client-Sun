/**
 * Created by Nofear on 3/15/2019.
 */

(function () {
    cc.TopHonorGamVipView = cc.Class({
        "extends": cc.Component,
        properties: {
            buttonFirst: cc.Button,
            buttonBack: cc.Button,
            listButton: [cc.Button],
            buttonLast: cc.Button,
            buttonNext: cc.Button,
            listItem: [cc.Node],
            listTabBtn:[cc.Button]
        },
        
        onLoad(){
            this.totalItemOfPage = 10;
            this.resetAllItem();
            this.totalPage = 10;
            this.currentPage = 1;
            this.data = [];
            this.roomID = 3;
            // this.currentBtnTabActive = this.listTabBtn[3];
        },
        getInfo: function () {
            var getUserJackpotInfoCommand = new cc.GetUserJackpotInfoCommand;
            getUserJackpotInfoCommand.execute(this,cc.GameId.ALL);
        },
        selectTabRoom:function(event,roomID)
        {
            this.roomID = parseInt(roomID);
            this.currentPage = 1;
            // this.currentBtnTabActive.interactable = true;
            // this.currentBtnTabActive = this.listTabBtn[this.roomID];
            // this.currentBtnTabActive.interactable = false;
            this.updateUIButton(this.currentPage);
            this.updateDataByPageIndex(this.currentPage);
        }, 
        onGetUserJackpotInfoResponse: function (response) {
            if (response !== null) {
                var self = this;
                var list = response.list;

                this.listRoom100 = [];
                this.listRoom1k = [];
                this.listRoom10k = [];
                this.listRoomOther = [];
                list.forEach(function (record) {
                    
                    switch (record.RoomID) {
                        case 1:
                            self.listRoom100.push(record);
                            break;
                        case 2:
                            self.listRoom1k.push(record);
                            break;
                        case 3:
                            self.listRoom10k.push(record);
                            break;
                        default:
                            self.listRoomOther.push(record);
                            break;
                    }
                });
                this.listRoom100.forEach((item, index) =>{
                    item['Page'] = Math.floor(index/this.totalItemOfPage) + 1;
                    item['Username'] = this.setCharAt(item['Username'],item['Username'].length -1,'*');
                    item['Username'] = this.setCharAt(item['Username'],item['Username'].length -2,'*');
                    item['Username'] = this.setCharAt(item['Username'],item['Username'].length -3,'*');
        
                 
                });
                this.listRoom1k.forEach((item, index) =>{
                    item['Page'] = Math.floor(index/this.totalItemOfPage) + 1;
                    item['Username'] = this.setCharAt(item['Username'],item['Username'].length -1,'*');
                    item['Username'] = this.setCharAt(item['Username'],item['Username'].length -2,'*');
                    item['Username'] = this.setCharAt(item['Username'],item['Username'].length -3,'*');
        
                 
                });
                this.listRoom10k.forEach((item, index) =>{
                    item['Page'] = Math.floor(index/this.totalItemOfPage) + 1;
                    item['Username'] = this.setCharAt(item['Username'],item['Username'].length -1,'*');
                    item['Username'] = this.setCharAt(item['Username'],item['Username'].length -2,'*');
                    item['Username'] = this.setCharAt(item['Username'],item['Username'].length -3,'*');
        
                 
                });
                this.listRoomOther.forEach((item, index) =>{
                    item['Page'] = Math.floor(index/this.totalItemOfPage) + 1;
                    item['Username'] = this.setCharAt(item['Username'],item['Username'].length -1,'*');
                    item['Username'] = this.setCharAt(item['Username'],item['Username'].length -2,'*');
                    item['Username'] = this.setCharAt(item['Username'],item['Username'].length -3,'*');
        
                 
                });
                //cc.warn("onGetJackpotResponse", response)
                this.data = response;
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
            switch (this.roomID) {
                case 1:
                    this.data = this.listRoom100;
                    break;
                case 2:
                    this.data = this.listRoom1k;
                    break;
                case 3:
                    this.data = this.listRoom10k;
                    break;
                case 4:
                    this.data = this.listRoomOther;
                    break;
            }
            this.resetAllItem();
            this.totalPage = parseInt(this.data.length/10);
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
            this.node.active = true;
            this.roomID = 3;
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
