const { ccclass, property } = cc._decorator;

namespace common {

    export class TweenCommonListener {
        target: cc.Component = null;
        duration: number = 0;
        curDuration: number = 0;
        callback: (p: number) => void = null;
    }

    @ccclass
    export class TweenCommon extends cc.Component {

        private static instance: TweenCommon = null;
        private static getInstance(): TweenCommon {
            if (this.instance == null) {
                let node = new cc.Node();
                node.name = "TweenCommon";
                cc.game.addPersistRootNode(node);
                this.instance = node.addComponent(TweenCommon);
            }
            return this.instance;
        }

        private static listeners = new Array<TweenCommonListener>();

        private skeepFrame = false;
        private readonly countSkeep = 1;
        private curCountSkeep = 0;
        private delta = 0;

        update(dt: number) {
            if (this.skeepFrame) {
                this.curCountSkeep++;
                this.delta += dt;
                if (this.curCountSkeep >= this.countSkeep) {
                    this.curCountSkeep = 0;
                    this.skeepFrame = false;
                }
                return;
            }
            for (var i = 0; i < TweenCommon.listeners.length; i++) {
                let listener = TweenCommon.listeners[i];
                if (listener.target && listener.target instanceof cc.Component && listener.target.node) {
                    listener.curDuration = Math.min(listener.duration, listener.curDuration + dt + this.delta);
                    listener.callback(listener.curDuration / listener.duration);
                    if (listener.curDuration >= listener.duration) {
                        TweenCommon.listeners.splice(i--, 1);
                    }
                } else {
                    TweenCommon.listeners.splice(i--, 1);
                }
            }

            this.skeepFrame = true;
            this.delta = 0;
        }

        static numberTo(label: any, toNumber: number, duration: number, format: (n: number) => string = (n) => { return cc.Tool.getInstance().formatNumber(n) }) {
            this.getInstance();
            let listener = null;
            for (var i = 0; i < TweenCommon.listeners.length; i++) {
                let _listener = TweenCommon.listeners[i];
                if (_listener.target == label) {
                    listener = _listener;
                    break;
                }
            }
            if (listener == null) {
                listener = new TweenCommonListener();
                this.listeners.push(listener);
            }            
            let startNumber = cc.Tool.getInstance().removeDot(label.label.string);
            let distance = toNumber - startNumber;
            listener.curDuration = 0;
            listener.duration = duration;
            listener.target = label;
            listener.callback = (p: number) => {
                label.label.string = format(parseInt("" + (startNumber + distance * p)));
            }
        }

        static numberToWithLabel(label: any, toNumber: number, duration: number, format: (n: number) => string = (n) => { return cc.Tool.getInstance().formatNumber(n) }) {
            this.getInstance();
            let listener = null;
            for (var i = 0; i < TweenCommon.listeners.length; i++) {
                let _listener = TweenCommon.listeners[i];
                if (_listener.target == label) {
                    listener = _listener;
                    break;
                }
            }
            if (listener == null) {
                listener = new TweenCommonListener();
                this.listeners.push(listener);
            }            
            let startNumber = cc.Tool.getInstance().removeDot(label.string);
            let distance = toNumber - startNumber;
            listener.curDuration = 0;
            listener.duration = duration;
            listener.target = label;
            listener.callback = (p: number) => {
                label.string = format(parseInt("" + (startNumber + distance * p)));
            }
        }

        public static showPopup(box:cc.Node,parent:cc.Node){
            parent.active = true;
            box.scale = 0;
            parent.opacity = 0;
            cc.Tween.stopAllByTarget(box);
            cc.Tween.stopAllByTarget(parent);
            cc.tween(box)
                .to(0.5, { scale: 1 }, { easing: "backOut" })
                .start();
    
            cc.tween(parent)
                .to(0.3, { opacity: 255 }, { easing: "linear" })
                .start();
        }
    
        public static hidePopup(box:cc.Node,parent:cc.Node,isDestroy:boolean = true){
            cc.Tween.stopAllByTarget(box);
            cc.Tween.stopAllByTarget(parent);
            cc.tween(box)
                .to(0.5, { scale: 0 }, { easing: "backIn" })
                .call(() => {
                    if(isDestroy){
                        parent.destroy();
                    }
                    else{
                        parent.active =  false;
                    }
                })
                .start();
    
            cc.tween(parent)
                .to(0.5, { opacity: 0 }, { easing: "linear" })
                .start();
        }
    }


}
export default common.TweenCommon;