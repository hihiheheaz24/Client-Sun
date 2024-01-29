// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        listMustHideNode:[cc.Node],
        listMustShowNode:[cc.Node]
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if (cc.sys.isNative) {
            var GetVersionCommand = new cc.GetVersionCommand();
            GetVersionCommand.execute(this);
        }  
    },

    onGetVersionResponse:function(response) {
        if (response!==null) {
            console.log(response.version);
            var listVersion = response.version.split(',');
            var currentVersion = localStorage.getItem("CurrentCodeBuild"); 
            var isOnBuild = false;
            if (currentVersion!==null) {
                for (let index = 0; index < listVersion.length; index++) {
                    if (listVersion[index]==currentVersion) {
                        isOnBuild = true;
                    }
                }
                if (isOnBuild) {
                    this.listMustHideNode.forEach(element => {
                        element.active = false;
                    });
                    this.listMustShowNode.forEach(element => {
                        element.active = true;
                    });

                }
                else{
                    console.log("This build is ready for use!-success");
                }      
            } 
            else{
                console.log("This build is ready for use!-success");
            }  
        }
        else{
            console.log("Get version fail!-error");
        } 
        
        
    }
});
