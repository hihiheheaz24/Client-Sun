
cc.Class({
    extends: cc.Component,

    properties: {
        canvas : cc.Canvas,
        miniView: cc.MINIView,
    },

   
    onLoad () {
        if(!this.canvas){
            this.canvas = cc.Canvas.instance;
        }   

        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event) => {
            var pos = this.node.position;
            pos.x += event.getDeltaX();
            pos.y += event.getDeltaY();
            this.node.position = pos;
          
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_START, (event) => {
            this.holdStart = true;
            this.holdTime = 0;
          
        }, this);


        this.node.on( cc.Node.EventType.TOUCH_END, (event) => {
            this.holdStart = false;
            this.checkOutScene();
            if(this.holdTime < 0.2){
                this.miniView.openClicked();
               
            }
           
        }, this);

        this.node.on( cc.Node.EventType.TOUCH_CANCEL, (event) => {
            this.holdStart = false;
            this.checkOutScene();
            if(this.holdTime < 0.2){
                this.miniView.openClicked();
            }
        }, this);

    },

    update (dt) {
        if (this.holdStart) {
            this.holdTime += dt;
        }
    },

    convertToRelativePoint(point) {
        const radian = cc.misc.degreesToRadians(this.node.angle);
        const x = this.node.position.x + point.x * Math.cos(radian) - point.y * Math.sin(radian);
        const y = this.node.position.y + point.x * Math.sin(radian) + point.y * Math.cos(radian);
        return cc.v2(x, y);
    },

    isPointInScreen(point){
        const sceneWidth = this.canvas.designResolution.width;
        const seceneHeight = this.canvas.designResolution.height;
        const screen = new cc.Rect(-sceneWidth/2,-seceneHeight/2,sceneWidth,seceneHeight);
        return screen.contains(cc.v2(point.x, point.y));
    },

    checkOutScene(){
        const sceneWidth = this.canvas.designResolution.width;
        const seceneHeight = this.canvas.designResolution.height;
        let currentPos = this.node.position;
        const visibleWidth = 120;
        const visibleHieght = 120;
        const leftPoint = cc.v2(currentPos.x + (-visibleWidth/2), 0);
        const rightPoint = cc.v2(currentPos.x + (visibleWidth/2), 0);
        const topPoint = cc.v2(0,currentPos.y + (visibleHieght/2));
        const bottomPoint = cc.v2(0,currentPos.y + (-visibleHieght/2));
        const isLeftIn = this.isPointInScreen(leftPoint);
        const isRightIn = this.isPointInScreen(rightPoint);
        const isTopIn = this.isPointInScreen(topPoint);
        const isBottomIn = this.isPointInScreen(bottomPoint);

        let newPos = cc.v2(0,0);

        if(!isLeftIn) newPos.x = -sceneWidth/2 + visibleWidth/2;
        if(!isRightIn) newPos.x = sceneWidth/2 - visibleWidth/2;
        if(!isTopIn) newPos.y = seceneHeight/2 - visibleHieght/2;
        if(!isBottomIn) newPos.y = -seceneHeight/2 + visibleHieght/2;
        if(newPos.y == 0) {
            newPos.y = currentPos.y
        }

        if(newPos.x == 0) {
            newPos.x = currentPos.x
        }

        this.node.stopAllActions();
        this.node.runAction(cc.sequence(
            cc.moveTo(0.15, newPos),
            cc.delayTime(0.1)
        ))
    }


  
});
