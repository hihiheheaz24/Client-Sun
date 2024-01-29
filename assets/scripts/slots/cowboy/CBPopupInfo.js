
cc.Class({
    extends: cc.Component,

    properties: {
        listPage: [cc.Node],
    },

    onLoad(){
        this.totalPage = 4;
        this.currentPage = 1;
        this.onActivePage(this.currentPage);

    },

    onActivePage(index){
        this.listPage.forEach(page =>{
            page.active = false;
        });
        this.listPage[index-1].active = true;
    },

    btnNext(){
        this.currentPage++;
        if(this.currentPage == this.totalPage + 1){
            this.currentPage = 1;
        }
        this.onActivePage(this.currentPage);
    },

    btnBack(){
        this.currentPage--;
        if(this.currentPage == 0 ){
            this.currentPage = 4;
        }
        this.onActivePage(this.currentPage)
    },

    closeClicked () {
        cc.MainController.getInstance().destroyHelpView();
    },
});
